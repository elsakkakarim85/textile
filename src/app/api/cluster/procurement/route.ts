import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireRole, requireFactory } from '@/server/auth';
import { audit } from '@/server/events';

const createPoolSchema = z.object({
  title: z.string().min(5),
  description: z.string(),
  category: z.string(),
  targetQty: z.number().min(1),
  uom: z.string(),
  minCommitQty: z.number().min(1),
  benchmarkUnitPrice: z.number().min(0).optional(),
  targetUnitPrice: z.number().min(0).optional(),
  deadline: z.string().datetime(), // ISO datetime string
});

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const status = url.searchParams.get('status');

  const where: any = {};
  if (category) where.category = category;
  if (status) where.status = status;

  const pools = await prisma.procurementPool.findMany({
    where,
    include: {
      organizer: { select: { firstName: true, lastName: true } },
      _count: { select: { commitments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate committed quantity aggregate per pool
  // Prisma doesn't natively do SUM in include, so we might need a separate query or raw, 
  // but for simplicity/safety we fetch the commitments sum for each pool.
  const poolIds = pools.map(p => p.id);
  const aggregates = await prisma.poolCommitment.groupBy({
    by: ['poolId'],
    where: { poolId: { in: poolIds }, status: { in: ['COMMITTED', 'CONFIRMED'] } },
    _sum: { quantity: true },
  });

  const aggregateMap = new Map(aggregates.map(a => [a.poolId, a._sum.quantity || 0]));

  return {
    pools: pools.map(p => ({
      ...p,
      committedQty: aggregateMap.get(p.id) || 0,
    }))
  };
});

export const POST = route(async (req) => {
  // Only admins or factory owners can organize a pool
  const user = await requireUser();
  if (user.role !== 'admin' && user.role !== 'factory_owner') throw new HttpError(403, 'Forbidden');
  const { factory } = await requireFactory();
  
  const body = await parseBody(req, createPoolSchema);
  
  if (new Date(body.deadline) <= new Date()) {
    throw new HttpError(400, 'Deadline must be in the future');
  }

  const pool = await prisma.procurementPool.create({
    data: {
      organizerId: user.id,
      ...body,
      status: 'OPEN',
    },
  });

  await audit(user.id, 'CREATE_POOL', 'ProcurementPool', pool.id);

  return pool;
});
