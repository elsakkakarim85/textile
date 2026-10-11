import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { route } from '@/server/http';

export const GET = route(async () => {
  await requireAdmin();
  const [totalUsers, activeFactories, pendingFactories, totalJobs, openRfqs, activeContracts] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.factory.count({ where: { status: 'APPROVED', deletedAt: null } }),
    prisma.factory.count({ where: { status: 'PENDING', deletedAt: null } }),
    prisma.jobPosting.count({ where: { status: 'ACTIVE' } }),
    prisma.rFQ.count({ where: { status: 'OPEN' } }),
    prisma.contract.count({ where: { status: { in: ['ACTIVE', 'IN_PRODUCTION', 'QC', 'SHIPPED'] } } }),
  ]);
  return { totalUsers, activeFactories, pendingFactories, totalJobs, openRfqs, activeContracts };
});
