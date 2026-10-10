import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const authObj = await auth();
  
  let role = (authObj.sessionClaims?.metadata as any)?.role;
  if (!role && authObj.userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(authObj.userId);
    role = user.publicMetadata?.role;
  }

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const activeFactories = await prisma.factory.count({ where: { status: 'APPROVED' } });
    const pendingFactories = await prisma.factory.count({ where: { status: 'PENDING' } });
    const totalJobs = await prisma.jobPosting.count();

    return NextResponse.json({
      totalUsers,
      activeFactories,
      pendingFactories,
      totalJobs
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
