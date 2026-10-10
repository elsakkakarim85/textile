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

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Generate an array of the last 7 days
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    // Fetch user creations in the last 7 days
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      },
      select: { createdAt: true }
    });

    // Group users by day
    const userGrowth = days.map(day => {
      const count = users.filter(u => u.createdAt.toISOString().startsWith(day)).length;
      return { date: day, newUsers: count };
    });

    // Factory Status Breakdown
    const approvedFactories = await prisma.factory.count({ where: { status: 'APPROVED' } });
    const pendingFactories = await prisma.factory.count({ where: { status: 'PENDING' } });
    const rejectedFactories = await prisma.factory.count({ where: { status: 'REJECTED' } });
    
    const factoryStats = [
      { name: 'Approved', value: approvedFactories, fill: '#22c55e' },
      { name: 'Pending', value: pendingFactories, fill: '#eab308' },
      { name: 'Rejected', value: rejectedFactories, fill: '#ef4444' }
    ];

    // High level counters
    const totalUsers = await prisma.user.count();
    const totalJobs = await prisma.jobPosting.count();
    const totalListings = await prisma.marketplaceListing.count();

    return NextResponse.json({
      userGrowth,
      factoryStats,
      totals: {
        users: totalUsers,
        jobs: totalJobs,
        listings: totalListings,
        pendingFactories
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
