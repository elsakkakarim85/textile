import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { sendFactoryStatusEmail } from '@/lib/email';

async function checkAdmin() {
  const authObj = await auth();
  let role = (authObj.sessionClaims?.metadata as any)?.role;
  if (!role && authObj.userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(authObj.userId);
    role = user.publicMetadata?.role;
  }
  return role === 'admin';
}

export async function GET(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    const factories = await prisma.factory.findMany({
      where: status ? { status } : undefined,
      include: { owner: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(factories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch factories' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { factoryId, status, rejectionReason } = await req.json();
    if (!factoryId || !status) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    const authObj = await auth();
    const adminId = authObj.userId!;

    const factory = await prisma.factory.update({
      where: { id: factoryId },
      data: { status, rejectionReason: status === 'REJECTED' ? rejectionReason : null },
      include: { owner: true }
    });

    // Send Email
    if (factory.owner?.email) {
      const ownerName = factory.owner.firstName || 'Factory Owner';
      await sendFactoryStatusEmail(factory.owner.email, status, ownerName, rejectionReason);
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: `FACTORY_STATUS_${status}`,
        entityId: factoryId,
        entity: 'Factory',
        adminId,
        details: JSON.stringify({ status, rejectionReason })
      }
    });

    return NextResponse.json(factory);
  } catch (error) {
    console.error('Error updating factory:', error);
    return NextResponse.json({ error: 'Failed to update factory' }, { status: 500 });
  }
}
