import { prisma } from '@/lib/prisma';
import { route, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';

export const POST = route(async (_req, ctx: any) => {
  const { id } = await ctx.params;
  const user = await requireUser();

  const event = await prisma.clusterEvent.findUnique({
    where: { id },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event) throw new HttpError(404, 'Event not found');

  const existing = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId: id, userId: user.id } },
  });
  if (existing) {
    return prisma.eventRegistration.update({
      where: { id: existing.id },
      data: { status: 'REGISTERED' },
    });
  }

  if (event.capacity && event._count.registrations >= event.capacity) {
    throw new HttpError(409, 'Event is at full capacity');
  }

  return prisma.eventRegistration.create({
    data: {
      eventId: id,
      userId: user.id,
      status: 'REGISTERED',
    },
  });
});

export const DELETE = route(async (_req, ctx: any) => {
  const { id } = await ctx.params;
  const user = await requireUser();

  await prisma.eventRegistration.deleteMany({
    where: { eventId: id, userId: user.id },
  });

  return { ok: true };
});
