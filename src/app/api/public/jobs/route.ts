import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';

export const dynamic = 'force-dynamic';

export const GET = route(async (req) => {
  const q = new URL(req.url).searchParams.get('q')?.trim();
  return prisma.jobPosting.findMany({
    where: {
      status: 'ACTIVE',
      ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}),
    },
    include: {
      employer: { select: { firstName: true, lastName: true, factories: { select: { id: true, name: true, isVerified: true } } } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
});
