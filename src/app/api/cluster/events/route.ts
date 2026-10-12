import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireRole } from '@/server/auth';
import { audit } from '@/server/events';

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const past = url.searchParams.get('past') === 'true';

  const where: any = {};
  if (type) where.type = type;
  if (past) {
    where.endAt = { lt: new Date() };
  } else {
    where.endAt = { gte: new Date() };
  }

  const events = await prisma.clusterEvent.findMany({
    where,
    include: {
      _count: { select: { registrations: true } },
    },
    orderBy: past ? { startAt: 'desc' } : { startAt: 'asc' },
  });

  return { events };
});

const createEventSchema = z.object({
  title: z.string().min(5),
  description: z.string(),
  type: z.string(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  location: z.string().optional(),
  isOnline: z.boolean(),
  capacity: z.number().optional(),
});

export const POST = route(async (req) => {
  const { user } = await requireRole(['admin', 'service_provider']);
  const body = await parseBody(req, createEventSchema);

  if (new Date(body.endAt) <= new Date(body.startAt)) {
    throw new HttpError(400, 'End time must be after start time');
  }

  const event = await prisma.clusterEvent.create({
    data: {
      organizerId: user.id,
      ...body,
    },
  });

  await audit(user.id, 'CREATE_EVENT', 'ClusterEvent', event.id);

  return event;
});
