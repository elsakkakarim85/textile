import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';

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
  const search = searchParams.get('search') || '';
  
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: search,  } },
          { firstName: { contains: search,  } },
          { lastName: { contains: search,  } },
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId, role, isBanned } = await req.json();
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    const authObj = await auth();
    const adminId = authObj.userId!;

    const updates: any = {};
    if (role !== undefined) updates.role = role;
    if (isBanned !== undefined) updates.isBanned = isBanned;

    // Update in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
    });

    // Sync role to Clerk
    if (role !== undefined) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { role }
      });
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        action: `UPDATED_USER`,
        entityId: userId,
        entity: 'User',
        adminId,
        details: JSON.stringify(updates)
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
