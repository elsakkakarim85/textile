import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';
import { findUserFactory } from '@/server/cluster';

const bookSchema = z.object({
  startAt: z.string(),
  endAt: z.string(),
  purpose: z.string().min(3),
});

const patchSchema = z.object({
  bookingId: z.string(),
  status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED']),
});

export const GET = route(async (_req, ctx: any) => {
  const { id } = await ctx.params;
  const bookings = await prisma.facilityBooking.findMany({
    where: {
      facilityId: id,
      status: { in: ['PENDING', 'CONFIRMED'] },
      endAt: { gt: new Date() },
    },
    include: {
      factory: { select: { name: true } },
    },
    orderBy: { startAt: 'asc' },
    take: 20,
  });

  return { bookings };
});

export const POST = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  const user = await requireUser();
  const factory = await findUserFactory(user.id);
  const body = await parseBody(req, bookSchema);

  const startAt = new Date(body.startAt);
  const endAt = new Date(body.endAt);

  if (isNaN(startAt.getTime()) || isNaN(endAt.getTime()) || endAt <= startAt) {
    throw new HttpError(400, 'End time must be after start time');
  }

  const hours = (endAt.getTime() - startAt.getTime()) / (1000 * 60 * 60);
  if (hours > 12) {
    throw new HttpError(400, 'Maximum booking duration is 12 hours');
  }

  const overlap = await prisma.facilityBooking.findFirst({
    where: {
      facilityId: id,
      status: { in: ['PENDING', 'CONFIRMED'] },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
  });

  if (overlap) {
    throw new HttpError(409, 'This time slot overlaps with an existing booking');
  }

  const booking = await prisma.facilityBooking.create({
    data: {
      facilityId: id,
      userId: user.id,
      factoryId: factory?.id || null,
      startAt,
      endAt,
      purpose: body.purpose,
      status: 'CONFIRMED',
    },
  });

  return booking;
});

export const PATCH = route(async (req) => {
  await requireUser();
  const body = await parseBody(req, patchSchema);

  const updated = await prisma.facilityBooking.update({
    where: { id: body.bookingId },
    data: { status: body.status },
  });

  return updated;
});
