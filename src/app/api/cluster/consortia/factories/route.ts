import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';

// Helper route to get factories for the invite dropdown
export const GET = route(async () => {
  const factories = await prisma.factory.findMany({
    where: { isApproved: true },
    select: { id: true, name: true, capabilities: true },
    orderBy: { name: 'asc' },
  });

  return { factories };
});
