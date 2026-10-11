import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';

export const dynamic = 'force-dynamic';

export const GET = route(async () => {
  return prisma.rFQ.findMany({
    where: { status: 'OPEN', OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
    include: {
      buyer: { select: { firstName: true, id: true } },
      _count: { select: { quotations: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
});
