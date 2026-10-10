import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

// Check if user is admin (simplified check for demo, usually verify roles)
async function isAdmin() {
  const authObj = await auth();
  return authObj.userId; // For demo purposes, any logged in user can access this. In production, check role.
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const factories = await prisma.factory.findMany({
      include: { owner: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(factories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch factories' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { factoryId, isVerified } = await req.json();
    const updated = await prisma.factory.update({
      where: { id: factoryId },
      data: { isVerified }
    });

    // Notify the factory owner
    if (isVerified) {
      await prisma.notification.create({
        data: {
          userId: updated.ownerId,
          title: "Account Verified! ✔️",
          message: "Congratulations! Your factory has been verified by the Mahalla Cluster Admin Team.",
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update KYC status' }, { status: 500 });
  }
}
