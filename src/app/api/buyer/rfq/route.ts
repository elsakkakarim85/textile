import { z } from 'zod';
import { Currency } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/server/auth';
import { parseBody, route } from '@/server/http';

const schema = z.object({
  title: z.string().trim().min(5).max(200),
  description: z.string().trim().min(10).max(5000),
  quantity: z.coerce.number().int().positive().max(100_000_000),
  unit: z.string().trim().max(30).default('piece'),
  targetPrice: z.coerce.number().positive().max(1_000_000).optional(),
  currency: z.nativeEnum(Currency).default('USD'),
  deadline: z.coerce.date().optional(),
  deliveryCountry: z.string().trim().max(60).optional(),
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const data = await parseBody(req, schema);
  return prisma.rFQ.create({ data: { ...data, buyerId: user.id } });
});

export const GET = route(async () => {
  const user = await requireUser();
  return prisma.rFQ.findMany({
    where: { buyerId: user.id },
    include: {
      quotations: {
        include: { factory: { select: { id: true, name: true, isVerified: true, logoUrl: true } } },
        orderBy: { unitPrice: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
});
