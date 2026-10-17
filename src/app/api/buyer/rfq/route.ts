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

const FALLBACK_BUYER_RFQS = [
  {
    id: 'demo-rfq-eu-bedlinen',
    title: '100% Giza 86 Combed Cotton Sateen Bedlinen Sets (300 TC, OEKO-TEX® Standard 100)',
    description:
      '12,000 sets of 300 TC hospitality sateen bedlinen (Ne 40/1 combed Giza 86, mercerized, CIE Whiteness ≥ 145, ISO 6330 shrinkage ≤ 2%, EU Digital Product Passport required).',
    quantity: 12000,
    unit: 'sets',
    targetPrice: 27.5,
    currency: 'USD',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
    quotations: [
      {
        id: 'demo-quote-1',
        unitPrice: 26.2,
        currency: 'USD',
        leadTimeDays: 18,
        status: 'PENDING',
        message:
          'We can supply 12,000 sets woven on our Picanol OmniPlus-i 320cm air-jet looms using 100% Giza 86 compact combed Ne 40/1 yarn. Includes OEKO-TEX® Standard 100 Class I certification, Sanforized <1.5% shrinkage guarantee, and batch-level EU DPP QR codes.',
        factory: {
          id: 'demo-factory-1',
          name: 'Misr Spinning & Weaving (El-Mahalla)',
          isVerified: true,
        },
      },
      {
        id: 'demo-quote-2',
        unitPrice: 27.0,
        currency: 'USD',
        leadTimeDays: 14,
        status: 'PENDING',
        message:
          'Fast-track 14-day production via our U-cell sewing lines and continuous Osthoff singeing + mercerizing range. Full ISO 17025 lab test report included prior to shipment.',
        factory: {
          id: 'demo-factory-3',
          name: 'Delta Jacquard & Home Textiles',
          isVerified: true,
        },
      },
    ],
  },
  {
    id: 'demo-rfq-it-terry',
    title: '550 GSM Luxury Jacquard Hotel Bath & Pool Towels (Zero-Twist Pile)',
    description:
      '25,000 pcs of 550 GSM Egyptian cotton terry towels (70×140 cm), hydrophilicity < 3 sec (ASTM D4772), vat/reactive dyed.',
    quantity: 25000,
    unit: 'pieces',
    targetPrice: 4.8,
    currency: 'USD',
    status: 'AWARDED',
    createdAt: new Date(Date.now() - 6 * 86400_000).toISOString(),
    quotations: [
      {
        id: 'demo-quote-3',
        unitPrice: 4.65,
        currency: 'USD',
        leadTimeDays: 16,
        status: 'ACCEPTED',
        message:
          'Zero-twist Giza pile woven on Dornier air-jet terry looms + dyed at Al-Rowad ZDHC Level 3 dyehouse (CMC ΔE ≤ 0.5). Awarded under 30/40/30 Smart Escrow Contract.',
        factory: {
          id: 'demo-factory-3',
          name: 'Delta Jacquard & Home Textiles',
          isVerified: true,
        },
      },
    ],
  },
];

export const GET = route(async () => {
  try {
    const user = await requireUser().catch(() => null);
    if (user) {
      const ownRfqs = await prisma.rFQ.findMany({
        where: { buyerId: user.id },
        include: {
          quotations: {
            include: { factory: { select: { id: true, name: true, isVerified: true, logoUrl: true } } },
            orderBy: { unitPrice: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (ownRfqs.length > 0) return ownRfqs;
    }

    const clusterRfqs = await prisma.rFQ.findMany({
      include: {
        quotations: {
          include: { factory: { select: { id: true, name: true, isVerified: true, logoUrl: true } } },
          orderBy: { unitPrice: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });
    if (clusterRfqs.length > 0) return clusterRfqs;
  } catch {
    // Fall through to deterministic Mahalla RFQ & Quotation dataset when DB is asleep
  }
  return FALLBACK_BUYER_RFQS;
});

