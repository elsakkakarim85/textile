import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser, requireFactory } from '@/server/auth';
import { notifyFactory, currentUserId, findUserFactory } from '@/server/cluster';

const commitSchema = z.object({
  quantity: z.number().min(1),
  note: z.string().optional(),
});

export const POST = route(async (req, { params }: any) => {
  const { id } = params as { id: string };
  const user = await requireUser();
  const factory = await findUserFactory(user.id);
  if (!factory) throw new HttpError(403, 'Must have a factory profile to commit');

  const body = await parseBody(req, commitSchema);

  const pool = await prisma.procurementPool.findUnique({ where: { id } });
  if (!pool) throw new HttpError(404, 'Pool not found');
  if (pool.status !== 'OPEN') throw new HttpError(400, 'Pool is not OPEN for commitments');
  if (new Date() > pool.deadline) throw new HttpError(400, 'Deadline has passed');
  if (body.quantity < pool.minCommitQty) throw new HttpError(400, `Minimum commitment is ${pool.minCommitQty}`);

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

  return commitment;
});

export const DELETE = route(async (req, { params }) => {
  const { id } = params as { id: string };
  const user = await requireUser();
  const factory = await findUserFactory(user.id);
  if (!factory) throw new HttpError(403, 'Must have a factory profile');

  await prisma.poolCommitment.update({
    where: { poolId_factoryId: { poolId: id, factoryId: factory.id } },
    data: { status: 'WITHDRAWN' },
  });

  return { success: true };
});
