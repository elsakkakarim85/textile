import { z } from 'zod';
import type { EventType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';
import { audit } from '@/server/events';

const VALID_EVENT_TYPES: EventType[] = [
  'WORKSHOP',
  'TRADE_FAIR',
  'B2B_MEETING',
  'TRAINING',
  'WEBINAR',
  'NETWORKING',
];

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const past = url.searchParams.get('past') === 'true';

  const where: any = {};
  if (type && VALID_EVENT_TYPES.includes(type as EventType)) {
    where.type = type as EventType;
  }
  if (past) {
    where.startsAt = { lt: new Date() };
  } else {
    where.startsAt = { gte: new Date() };
  }

  const events = await prisma.clusterEvent.findMany({
    where,
    include: {
      _count: { select: { registrations: true } },
    },
    orderBy: past ? { startsAt: 'desc' } : { startsAt: 'asc' },
  });

  return { events };
});

const createEventSchema = z.object({
  title: z.string().min(4),
  titleAr: z.string().optional(),
  description: z.string(),
  type: z.string().default('WORKSHOP'),
  startAt: z.string().optional(),
  startsAt: z.string().optional(),
  endAt: z.string().optional(),
  endsAt: z.string().optional(),
  location: z.string().optional(),
  onlineUrl: z.string().optional(),
  isOnline: z.boolean().optional(),
  capacity: z.number().optional(),
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, createEventSchema);

  const startsAt = new Date(body.startsAt || body.startAt || Date.now() + 86400000);
  const endsAtRaw = body.endsAt || body.endAt;
  const endsAt = endsAtRaw ? new Date(endsAtRaw) : new Date(startsAt.getTime() + 2 * 3600000);

  if (endsAt <= startsAt) {
    throw new HttpError(400, 'End time must be after start time');
  }

  const eventType: EventType = VALID_EVENT_TYPES.includes(body.type as EventType)
    ? (body.type as EventType)
    : 'WORKSHOP';

  const event = await prisma.clusterEvent.create({
    data: {
      organizerId: user.id,
      title: body.title,
      titleAr: body.titleAr || null,
      description: body.description,
      type: eventType,
      startsAt,
      endsAt,
      location: body.location || (body.isOnline ? 'Online Webinar' : 'Mahalla Cluster Center'),
      onlineUrl: body.onlineUrl || (body.isOnline ? 'https://meet.google.com' : null),
      capacity: body.capacity || 100,
    },
  });

  await audit(user.id, 'CREATE_EVENT', 'ClusterEvent', event.id);

  return event;
});
