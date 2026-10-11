import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { route } from '@/server/http';

export const GET = route(async () => {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const [users, byStatus, totalUsers, totalJobs, totalListings, totalRfqs, contractValue] = await Promise.all([
    prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.factory.groupBy({ by: ['status'], _count: true, where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.jobPosting.count(),
    prisma.marketplaceListing.count({ where: { deletedAt: null } }),
    prisma.rFQ.count(),
    prisma.contract.aggregate({ _sum: { totalAmount: true }, where: { status: { not: 'CANCELLED' } } }),
  ]);

  const userGrowth = days.map((day) => ({
    date: day,
    newUsers: users.filter((u) => u.createdAt.toISOString().startsWith(day)).length,
  }));

  const count = (s: string) => byStatus.find((b) => b.status === s)?._count ?? 0;
  const factoryStats = [
    { name: 'Approved', value: count('APPROVED'), fill: '#22c55e' },
    { name: 'Pending', value: count('PENDING'), fill: '#eab308' },
    { name: 'Rejected', value: count('REJECTED'), fill: '#ef4444' },
    { name: 'Suspended', value: count('SUSPENDED'), fill: '#64748b' },
  ];

  return {
    userGrowth,
    factoryStats,
    totals: {
      users: totalUsers,
      jobs: totalJobs,
      listings: totalListings,
      rfqs: totalRfqs,
      pendingFactories: count('PENDING'),
      gmv: contractValue._sum.totalAmount ?? 0,
    },
  };
});
