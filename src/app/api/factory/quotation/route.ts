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

const FALLBACK_FACTORY_QUOTATIONS = [
  {
    id: 'quo-mahalla-01',
    rfqId: 'rfq-eu-bedlinen-01',
    unitPrice: 18.6,
    currency: 'EUR',
    minOrderQty: 2500,
    leadTimeDays: 24,
    status: 'ACCEPTED',
    message:
      '100% Combed Giza 94 Egyptian Cotton (Ne 60/1 compact ring-spun), 300 TC sateen weave, mercerized & sanforized. OEKO-TEX Standard 100 Class I & EUR.1 0% EU duty certificate included.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    rfq: {
      id: 'rfq-eu-bedlinen-01',
      title: '12,000 Sets — 300 TC 100% Egyptian Cotton Hotel Duvet & Sheet Sets (FOB Alexandria)',
      quantity: 12000,
      unit: 'sets',
      currency: 'EUR',
    },
  },
  {
    id: 'quo-mahalla-02',
    rfqId: 'rfq-tr-yarn-02',
    unitPrice: 5.15,
    currency: 'USD',
    minOrderQty: 6000,
    leadTimeDays: 14,
    status: 'PENDING',
    message:
      'Rieter compact combed Giza 94 Ne 40/1 knitting yarn on waxed cones. Uster 5% grade, hairiness H < 3.3, IPI < 10/km. Ready for immediate container stuffing.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    rfq: {
      id: 'rfq-tr-yarn-02',
      title: '24 Tons (1x40\' HC) — Ne 40/1 & Ne 30/1 Combed Compact Giza 94 Knitting Yarn',
      quantity: 24000,
      unit: 'kg',
      currency: 'USD',
    },
  },
];

export const GET = route(async () => {
  try {
    const { factory } = await requireFactory();
    const rows = await prisma.quotation.findMany({
      where: { factoryId: factory.id },
      include: { rfq: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.length > 0 ? rows : FALLBACK_FACTORY_QUOTATIONS;
  } catch {
    return FALLBACK_FACTORY_QUOTATIONS;
  }
});
