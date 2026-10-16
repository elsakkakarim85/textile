import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';

export const GET = route(async () => {
  const factories = await prisma.factory.findMany({
    where: { status: 'APPROVED', deletedAt: null },
    select: {
      id: true,
      name: true,
      capabilities: true,
      monthlyCapacity: true,
      capacityUnit: true,
    },
    orderBy: { name: 'asc' },
  });

  return { factories };
});
