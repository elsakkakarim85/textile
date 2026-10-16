import { z } from 'zod';
import type { PoolStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';
import { notifyFactory } from '@/server/cluster';

const updatePoolSchema = z.object({
  status: z.enum(['OPEN', 'NEGOTIATING', 'ORDERED', 'DELIVERED', 'CLOSED', 'CANCELLED']).optional(),
  negotiatedUnitPrice: z.number().min(0).optional(),
  supplierName: z.string().optional(),
});

export const GET = route(async (_req, ctx: any) => {
  const { id } = await ctx.params;
  const pool = await prisma.procurementPool.findUnique({
    where: { id },
    include: {
      organizer: { select: { id: true, firstName: true, lastName: true } },
      commitments: {
        where: { status: { in: ['COMMITTED', 'CONFIRMED'] } },
        include: { factory: { select: { id: true, name: true } } },
      },
    },
  });
  if (!pool) throw new HttpError(404, 'Pool not found');
  return pool;
});

export const PATCH = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  const user = await requireUser();
  const body = await parseBody(req, updatePoolSchema);

  const pool = await prisma.procurementPool.findUnique({
    where: { id },
    include: { commitments: { where: { status: { in: ['COMMITTED', 'CONFIRMED'] } } } },
  });
  if (!pool) throw new HttpError(404, 'Pool not found');

  const updated = await prisma.procurementPool.update({
    where: { id },
    data: {
      ...(body.status ? { status: body.status as PoolStatus } : {}),
      ...(body.negotiatedUnitPrice !== undefined ? { negotiatedUnitPrice: body.negotiatedUnitPrice } : {}),
      ...(body.supplierName !== undefined ? { supplierName: body.supplierName } : {}),
    },
  });

  if (body.status && body.status !== pool.status) {
    for (const c of pool.commitments) {
      await notifyFactory(
        c.factoryId,
        `Procurement Pool Status: ${body.status}`,
        `Pool "${pool.title}" moved to ${body.status}.`,
        `/cluster/procurement/${id}`
      );
    }
  }

  void user;
  return updated;
});
