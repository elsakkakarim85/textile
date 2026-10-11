import { z } from 'zod';
import { Currency } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireFactory } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';
import { notify } from '@/server/events';

const schema = z.object({
  rfqId: z.string().min(1),
  unitPrice: z.coerce.number().positive().max(1_000_000),
  currency: z.nativeEnum(Currency).default('USD'),
  minOrderQty: z.coerce.number().int().positive().optional(),
  leadTimeDays: z.coerce.number().int().positive().max(730).optional(),
  validUntil: z.coerce.date().optional(),
  message: z.string().trim().min(10).max(5000),
});

export const POST = route(async (req) => {
  const { factory } = await requireFactory({ approved: true });
  const data = await parseBody(req, schema);

  const rfq = await prisma.rFQ.findUnique({ where: { id: data.rfqId } });
  if (!rfq || rfq.status !== 'OPEN') throw new HttpError(400, 'This RFQ is not open for quotations');
  if (rfq.buyerId === factory.ownerId) throw new HttpError(400, 'You cannot quote on your own RFQ');
  if (rfq.deadline && rfq.deadline < new Date()) throw new HttpError(400, 'The RFQ deadline has passed');

  // @@unique([rfqId, factoryId]) guarantees one quote per factory (409 on duplicates)
  const quotation = await prisma.quotation.create({ data: { ...data, factoryId: factory.id } });

  await notify(rfq.buyerId, 'New quotation received', `${factory.name} quoted ${data.unitPrice} ${data.currency} on "${rfq.title}".`, '/dashboard/buyer/rfqs');
  return quotation;
});

export const GET = route(async () => {
  const { factory } = await requireFactory();
  return prisma.quotation.findMany({
    where: { factoryId: factory.id },
    include: { rfq: true },
    orderBy: { createdAt: 'desc' },
  });
});
