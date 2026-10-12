import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { audit } from '@/server/events';

const createCapacitySchema = z.object({
  kind: z.enum(['OFFER', 'REQUEST']),
  process: z.string(),
  title: z.string().min(5),
  description: z.string().optional(),
  availableFrom: z.string().datetime(),
  availableUntil: z.string().datetime(),
  quantity: z.number().min(1).optional(),
  uom: z.string().optional(),
});

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const kind = url.searchParams.get('kind');
  const process = url.searchParams.get('process');

  const where: any = { status: 'OPEN' };
  if (kind) where.kind = kind;
  if (process) where.process = process;

  const posts = await prisma.capacityPost.findMany({
    where,
    include: {
      factory: { select: { name: true, id: true } },
      _count: { select: { responses: true } }
    },
    orderBy: { createdAt: 'desc' },
  });

  return { posts };
});

export const POST = route(async (req) => {
  const { user, factory } = await requireFactory();
  const body = await parseBody(req, createCapacitySchema);

  if (new Date(body.availableUntil) <= new Date(body.availableFrom)) {
    throw new HttpError(400, 'End date must be after start date');
  }

  const post = await prisma.capacityPost.create({
    data: {
      factoryId: factory.id,
      status: 'OPEN',
      ...body,
    },
  });

  await audit(user.id, 'CREATE_CAPACITY_POST', 'CapacityPost', post.id);

  return post;
});
