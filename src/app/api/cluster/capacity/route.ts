import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { audit } from '@/server/events';

const createCapacitySchema = z.object({
  kind: z.enum(['OFFER', 'REQUEST']),
  process: z.string(),
  title: z.string().min(4),
  description: z.string().optional(),
  availableFrom: z.string(),
  availableUntil: z.string().optional(),
  availableTo: z.string().optional(),
  quantity: z.number().min(1).optional(),
  uom: z.string().optional(),
  unit: z.string().optional(),
  unitPrice: z.number().min(0).optional(),
});

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const kind = url.searchParams.get('kind');
  const process = url.searchParams.get('process');

  const where: any = {};
  if (kind) where.kind = kind;
  if (process) where.process = process;

  const posts = await prisma.capacityPost.findMany({
    where,
    include: {
      factory: { select: { name: true, id: true, city: true, isVerified: true } },
      responses: {
        include: { factory: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { responses: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { posts };
});

export const POST = route(async (req) => {
  const { user, factory } = await requireFactory();
  const body = await parseBody(req, createCapacitySchema);

  const fromDate = new Date(body.availableFrom);
  const toRaw = body.availableTo || body.availableUntil;
  const toDate = toRaw ? new Date(toRaw) : null;

  if (toDate && toDate <= fromDate) {
    throw new HttpError(400, 'End date must be after start date');
  }

  const post = await prisma.capacityPost.create({
    data: {
      factoryId: factory.id,
      status: 'OPEN',
      kind: body.kind,
      process: body.process.toLowerCase(),
      title: body.title,
      description: body.description || body.title,
      quantity: body.quantity || 1000,
      unit: body.unit || body.uom || 'meters',
      availableFrom: fromDate,
      availableTo: toDate,
      unitPrice: body.unitPrice,
    },
  });

  await audit(user.id, 'CREATE_CAPACITY_POST', 'CapacityPost', post.id);

  return post;
});
