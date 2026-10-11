import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/server/auth';
import { route } from '@/server/http';

export const GET = route(async () => {
  const user = await requireUser();
  const [items, unread] = await Promise.all([
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.notification.count({ where: { userId: user.id, isRead: false } }),
  ]);
  // Keep array response shape for the existing dropdown; unread count in a header.
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json', 'X-Unread-Count': String(unread) },
  });
});

const body = z.object({ ids: z.array(z.string()).max(100).optional() }).default({});

/** Mark specific notifications (or all) as read. */
export const PUT = route(async (req) => {
  const user = await requireUser();
  const { ids } = body.parse(await req.json().catch(() => ({})));
  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false, ...(ids?.length ? { id: { in: ids } } : {}) },
    data: { isRead: true },
  });
  return { success: true };
});
