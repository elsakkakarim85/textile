import { z } from 'zod';
import type { ProcurementCategory, PoolStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';
import { audit } from '@/server/events';

const VALID_CATEGORIES: ProcurementCategory[] = [
  'YARN',
  'FIBER',
  'DYES_CHEMICALS',
  'SPARE_PARTS',
  'PACKAGING',
  'ENERGY',
  'LOGISTICS',
  'OTHER',
];

const createPoolSchema = z.object({
  title: z.string().min(5),
  titleAr: z.string().optional(),
  description: z.string().min(5),
  specification: z.string().optional(),
  category: z.string(),
  targetQty: z.number().min(1),
  uom: z.string().optional(),
  unit: z.string().optional(),
  minCommitQty: z.number().min(1).default(1),
  benchmarkUnitPrice: z.number().min(0).optional(),
  targetUnitPrice: z.number().min(0).optional(),
  supplierName: z.string().optional(),
  deadline: z.string(),
});

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const status = url.searchParams.get('status');

  const where: any = {};
  if (category && VALID_CATEGORIES.includes(category as ProcurementCategory)) {
    where.category = category as ProcurementCategory;
  }
  if (status) where.status = status as PoolStatus;

  const pools = await prisma.procurementPool.findMany({
    where,
    include: {
      organizer: { select: { firstName: true, lastName: true } },
      _count: { select: { commitments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const poolIds = pools.map((p) => p.id);
  const aggregates = await prisma.poolCommitment.groupBy({
    by: ['poolId'],
    where: { poolId: { in: poolIds }, status: { in: ['COMMITTED', 'CONFIRMED'] } },
    _sum: { quantity: true },
  });

  const aggregateMap = new Map(aggregates.map((a) => [a.poolId, a._sum.quantity || 0]));

  return {
    pools: pools.map((p) => ({
      ...p,
      committedQty: aggregateMap.get(p.id) || 0,
    })),
  };
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, createPoolSchema);

  const deadlineDate = new Date(body.deadline);
  if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
    throw new HttpError(400, 'Deadline must be a valid future date');
  }

  const category: ProcurementCategory = VALID_CATEGORIES.includes(body.category as ProcurementCategory)
    ? (body.category as ProcurementCategory)
    : 'OTHER';

  const pool = await prisma.procurementPool.create({
    data: {
      organizerId: user.id,
      title: body.title,
      titleAr: body.titleAr || null,
      description: body.description,
      specification: body.specification || null,
      category,
      targetQty: body.targetQty,
      unit: body.unit || body.uom || 'kg',
      minCommitQty: body.minCommitQty,
      benchmarkUnitPrice: body.benchmarkUnitPrice,
      targetUnitPrice: body.targetUnitPrice,
      supplierName: body.supplierName || null,
      deadline: deadlineDate,
      status: 'OPEN',
    },
  });

  await audit(user.id, 'CREATE_POOL', 'ProcurementPool', pool.id);

  return pool;
});
