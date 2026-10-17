import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';
import { notify } from '@/server/events';

const FALLBACK_CONTRACTS = [
  {
    id: 'escrow-mahalla-2026-01',
    title: '12,000 Sets — 100% Giza 86 Combed Cotton Sateen Bedlinen (300 TC)',
    status: 'IN_PRODUCTION',
    totalAmount: 314400,
    currency: 'USD',
    incoterm: 'FOB Alexandria',
    buyerId: 'demo-buyer-de',
    buyer: { id: 'demo-buyer-de', firstName: 'Hanseatic Hospitality', lastName: 'GmbH (Germany)', email: 'procurement@hanseatic-hotel.de' },
    factory: { id: 'demo-factory-1', name: 'Misr Spinning & Weaving (El-Mahalla)', ownerId: 'demo-owner-1', logoUrl: null },
    milestones: [
      {
        id: 'ms-101',
        title: 'Tranche 1 (30%): Combed Giza 86 Yarn Allocation & Warping Mobilization',
        amount: 94320,
        status: 'RELEASED',
      },
      {
        id: 'ms-102',
        title: 'Tranche 2 (40%): Air-Jet Weaving, Reactive Dyeing & ISO 17025 Lab QC Pass',
        amount: 125760,
        status: 'FUNDED',
      },
      {
        id: 'ms-103',
        title: 'Tranche 3 (30%): Clean Bill of Lading (FOB Alexandria) + EU DPP QR Handover',
        amount: 94320,
        status: 'PENDING',
      },
    ],
    shipments: [],
  },
  {
    id: 'escrow-mahalla-2026-02',
    title: '25,000 Pcs — 550 GSM Zero-Twist Hotel Jacquard Bath Towels',
    status: 'QC',
    totalAmount: 116250,
    currency: 'USD',
    incoterm: 'CIF Genoa',
    buyerId: 'demo-buyer-it',
    buyer: { id: 'demo-buyer-it', firstName: 'Lombardia Tessile', lastName: 'S.r.l. (Italy)', email: 'sourcing@lombardiatessile.it' },
    factory: { id: 'demo-factory-3', name: 'Delta Jacquard & Home Textiles', ownerId: 'demo-owner-3', logoUrl: null },
    milestones: [
      {
        id: 'ms-201',
        title: 'Tranche 1 (30%): Ring-Spun Terry Pile Yarn & Jacquard Loom Setup',
        amount: 34875,
        status: 'RELEASED',
      },
      {
        id: 'ms-202',
        title: 'Tranche 2 (40%): Vat Dyeing (CMC ΔE ≤ 0.6) & ASTM D4772 Absorption Audit',
        amount: 46500,
        status: 'FUNDED',
      },
      {
        id: 'ms-203',
        title: 'Tranche 3 (30%): CIF Genoa Container Dispatch & EUR.1 Customs Release',
        amount: 34875,
        status: 'PENDING',
      },
    ],
    shipments: [],
  },
];

export const GET = route(async () => {
  const includeSpec = {
    buyer: { select: { id: true, firstName: true, lastName: true, email: true } },
    factory: { select: { id: true, name: true, ownerId: true, logoUrl: true } },
    milestones: { orderBy: { createdAt: 'asc' as const } },
    shipments: true,
  };

  try {
    const user = await requireUser().catch(() => null);
    let contracts = user
      ? await prisma.contract.findMany({
          where:
            user.role === 'admin'
              ? {}
              : {
                  OR: [
                    { buyerId: user.id },
                    { factory: { ownerId: user.id } },
                    { factory: { members: { some: { userId: user.id } } } },
                  ],
                },
          include: includeSpec,
          orderBy: { updatedAt: 'desc' },
        })
      : [];

    if (contracts.length === 0) {
      contracts = await prisma.contract.findMany({
        include: includeSpec,
        orderBy: { updatedAt: 'desc' },
        take: 10,
      });
    }

    if (contracts.length > 0) return contracts;
  } catch {
    // Fall through to deterministic CBE Smart Escrow contracts when DB is asleep
  }

  return FALLBACK_CONTRACTS;
});


const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('CONFIRM'), contractId: z.string() }),
  z.object({ action: z.literal('FUND'), milestoneId: z.string() }),
  z.object({ action: z.literal('RELEASE'), milestoneId: z.string() }),
  z.object({
    action: z.literal('ADVANCE'),
    contractId: z.string(),
    status: z.enum(['IN_PRODUCTION', 'QC', 'SHIPPED', 'DELIVERED', 'COMPLETED']),
  }),
  z.object({ action: z.literal('CANCEL'), contractId: z.string() }),
]);

const FLOW = ['ACTIVE', 'IN_PRODUCTION', 'QC', 'SHIPPED', 'DELIVERED', 'COMPLETED'] as const;

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, schema);
  const isAdmin = user.role === 'admin';

  // ── Milestone actions (buyer or admin) ──
  if (body.action === 'FUND' || body.action === 'RELEASE') {
    const m = await prisma.milestone.findUnique({
      where: { id: body.milestoneId },
      include: { contract: { include: { factory: true } } },
    });
    if (!m) throw new HttpError(404, 'Milestone not found');
    if (m.contract.buyerId !== user.id && !isAdmin && user.role !== 'buyer') {
      throw new HttpError(403, 'Switch to a Buyer or Admin persona to fund/release escrow milestones');
    }
    if (['CANCELLED', 'COMPLETED'].includes(m.contract.status)) {
      throw new HttpError(400, `Contract is ${m.contract.status}`);
    }

    if (body.action === 'FUND') {
      if (m.status !== 'PENDING') throw new HttpError(400, 'Milestone already funded');
      await prisma.$transaction([
        prisma.milestone.update({ where: { id: m.id }, data: { status: 'FUNDED' } }),
        prisma.payment.create({
          data: {
            milestoneId: m.id,
            provider: 'MANUAL',
            amount: m.amount,
            currency: m.contract.currency,
            status: 'SUCCEEDED',
          },
        }),
        ...(m.contract.status === 'DRAFT'
          ? [prisma.contract.update({ where: { id: m.contract.id }, data: { status: 'ACTIVE' } })]
          : []),
      ]);
      await notify(m.contract.factory.ownerId, 'Milestone funded 💰', `The buyer funded "${m.title}".`, '/dashboard/contracts');
    } else {
      if (m.status !== 'FUNDED') throw new HttpError(400, 'Only funded milestones can be released');
      await prisma.milestone.update({ where: { id: m.id }, data: { status: 'RELEASED', releasedAt: new Date() } });
      await notify(m.contract.factory.ownerId, 'Funds released 🚀', `The buyer released "${m.title}".`, '/dashboard/contracts');
    }
    return { success: true };
  }

  // ── Contract-level actions ──
  const c = await prisma.contract.findUnique({ where: { id: body.contractId }, include: { factory: true } });
  if (!c) throw new HttpError(404, 'Contract not found');
  const isBuyer = c.buyerId === user.id || user.role === 'buyer';
  const isFactory = c.factory.ownerId === user.id || user.role === 'factory_owner';

  if (body.action === 'CONFIRM') {
    if (!isFactory && !isAdmin) throw new HttpError(403, 'Only the factory confirms a draft contract');
    if (c.status !== 'DRAFT') throw new HttpError(400, 'Contract is not a draft');
    await prisma.contract.update({ where: { id: c.id }, data: { status: 'ACTIVE', factoryAcceptedAt: new Date() } });
    await notify(c.buyerId, 'Contract confirmed', `${c.factory.name} confirmed "${c.title}".`, '/dashboard/contracts');
  }

  if (body.action === 'ADVANCE') {
    const buyerSteps = ['DELIVERED', 'COMPLETED'];
    if (!isAdmin && (buyerSteps.includes(body.status) ? !isBuyer : !isFactory)) {
      throw new HttpError(403, 'Not allowed for your role');
    }
    const from = FLOW.indexOf(c.status as (typeof FLOW)[number]);
    const to = FLOW.indexOf(body.status);
    if (from < 0 || to !== from + 1) throw new HttpError(400, `Cannot move from ${c.status} to ${body.status}`);
    await prisma.contract.update({ where: { id: c.id }, data: { status: body.status } });
    await notify(isBuyer ? c.factory.ownerId : c.buyerId, 'Contract update', `"${c.title}" is now ${body.status}.`, '/dashboard/contracts');
  }

  if (body.action === 'CANCEL') {
    if (!['DRAFT', 'ACTIVE'].includes(c.status)) {
      throw new HttpError(400, 'Only draft or not-yet-started contracts can be cancelled');
    }
    const funded = await prisma.milestone.count({
      where: { contractId: c.id, status: { in: ['FUNDED', 'RELEASED'] } },
    });
    if (funded) throw new HttpError(400, 'Contract has funded milestones — open a dispute instead');
    await prisma.contract.update({ where: { id: c.id }, data: { status: 'CANCELLED' } });
    await notify(isBuyer ? c.factory.ownerId : c.buyerId, 'Contract cancelled', `"${c.title}" was cancelled.`, '/dashboard/contracts');
  }

  return { success: true };
});
