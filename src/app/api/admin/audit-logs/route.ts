import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { route } from '@/server/http';

export const GET = route(async (req) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const take = Math.min(Number(searchParams.get('take')) || 100, 500);
  const cursor = searchParams.get('cursor');
  const entity = searchParams.get('entity') || undefined;

  const logs = await prisma.auditLog.findMany({
    where: entity ? { entity } : undefined,
    orderBy: { createdAt: 'desc' },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });
  return logs;
});
