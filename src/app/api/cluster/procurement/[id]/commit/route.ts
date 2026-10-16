import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';
import { findUserFactory, notifyFactory } from '@/server/cluster';

const commitSchema = z.object({
  quantity: z.number().min(1),
  note: z.string().optional(),
});

export const POST = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  const user = await requireUser();
  const factory = await findUserFactory(user.id);
  if (!factory) throw new HttpError(403, 'Must have a factory profile to commit');

  const body = await parseBody(req, commitSchema);

  const pool = await prisma.procurementPool.findUnique({ where: { id } });
  if (!pool) throw new HttpError(404, 'Pool not found');
  if (pool.status !== 'OPEN' && pool.status !== 'NEGOTIATING') {
    throw new HttpError(400, 'Pool is not open for commitments');
  }
  if (new Date() > pool.deadline) throw new HttpError(400, 'Deadline has passed');
  if (body.quantity < pool.minCommitQty) {
    throw new HttpError(400, `Minimum commitment is ${pool.minCommitQty} ${pool.unit}`);
  }

  const commitment = await prisma.poolCommitment.upsert({
    where: { poolId_factoryId: { poolId: id, factoryId: factory.id } },
    update: { quantity: body.quantity, note: body.note, status: 'COMMITTED' },
    create: {
      poolId: id,
      factoryId: factory.id,
      quantity: body.quantity,
      note: body.note,
      status: 'COMMITTED',
    },
  });

  await notifyFactory(
    factory.id,
    'Joint Procurement Commitment Confirmed',
    `Committed ${body.quantity} ${pool.unit} to "${pool.title}".`,
    `/cluster/procurement/${id}`
  );

  return commitment;
});

export const DELETE = route(async (_req, ctx: any) => {
  const { id } = await ctx.params;
  const user = await requireUser();
  const factory = await findUserFactory(user.id);
  if (!factory) throw new HttpError(403, 'Must have a factory profile');

  await prisma.poolCommitment.update({
    where: { poolId_factoryId: { poolId: id, factoryId: factory.id } },
    data: { status: 'WITHDRAWN' },
  });

  return { success: true };
});
