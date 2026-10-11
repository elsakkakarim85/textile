import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';
import { notify } from '@/server/events';

export const GET = route(async () => {
  const user = await requireUser();
  // NOTE: the previous version auto-created fake contracts with random factories for any visitor. Removed.
  return prisma.contract.findMany({
    where: {
      OR: [{ buyerId: user.id }, { factory: { ownerId: user.id } }, { factory: { members: { some: { userId: user.id } } } }],
    },
    include: {
      buyer: { select: { id: true, firstName: true, lastName: true, email: true } },
      factory: { select: { id: true, name: true, ownerId: true, logoUrl: true } },
      milestones: { orderBy: { createdAt: 'asc' } },
      shipments: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
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

  // ── Milestone actions (buyer only) ──
  if (body.action === 'FUND' || body.action === 'RELEASE') {
    const m = await prisma.milestone.findUnique({ where: { id: body.milestoneId }, include: { contract: { include: { factory: true } } } });
    if (!m) throw new HttpError(404, 'Milestone not found');
    if (m.contract.buyerId !== user.id) throw new HttpError(403, 'Only the buyer can do this');
    if (['DRAFT', 'CANCELLED', 'COMPLETED'].includes(m.contract.status)) throw new HttpError(400, `Contract is ${m.contract.status}`);

    if (body.action === 'FUND') {
      if (m.status !== 'PENDING') throw new HttpError(400, 'Milestone already funded');
      // Until the Paymob/Stripe integration (Phase 3) this records an offline/manual payment.
      await prisma.$transaction([
        prisma.milestone.update({ where: { id: m.id }, data: { status: 'FUNDED' } }),
        prisma.payment.create({
          data: { milestoneId: m.id, provider: 'MANUAL', amount: m.amount, currency: m.contract.currency, status: 'SUCCEEDED' },
        }),
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
  const isBuyer = c.buyerId === user.id;
  const isFactory = c.factory.ownerId === user.id;
  if (!isBuyer && !isFactory) throw new HttpError(403, 'Not a party to this contract');

  if (body.action === 'CONFIRM') {
    if (!isFactory) throw new HttpError(403, 'Only the factory confirms a draft contract');
    if (c.status !== 'DRAFT') throw new HttpError(400, 'Contract is not a draft');
    await prisma.contract.update({ where: { id: c.id }, data: { status: 'ACTIVE', factoryAcceptedAt: new Date() } });
    await notify(c.buyerId, 'Contract confirmed', `${c.factory.name} confirmed "${c.title}".`, '/dashboard/contracts');
  }

  if (body.action === 'ADVANCE') {
    // Factory moves production forward; only the buyer can mark DELIVERED/COMPLETED
    const buyerSteps = ['DELIVERED', 'COMPLETED'];
    if (buyerSteps.includes(body.status) ? !isBuyer : !isFactory) throw new HttpError(403, 'Not allowed for your role');
    const from = FLOW.indexOf(c.status as (typeof FLOW)[number]);
    const to = FLOW.indexOf(body.status);
    if (from < 0 || to !== from + 1) throw new HttpError(400, `Cannot move from ${c.status} to ${body.status}`);
    await prisma.contract.update({ where: { id: c.id }, data: { status: body.status } });
    await notify(isBuyer ? c.factory.ownerId : c.buyerId, 'Contract update', `"${c.title}" is now ${body.status}.`, '/dashboard/contracts');
  }

  if (body.action === 'CANCEL') {
    if (!['DRAFT', 'ACTIVE'].includes(c.status)) throw new HttpError(400, 'Only draft or not-yet-started contracts can be cancelled');
    const funded = await prisma.milestone.count({ where: { contractId: c.id, status: { in: ['FUNDED', 'RELEASED'] } } });
    if (funded) throw new HttpError(400, 'Contract has funded milestones — open a dispute instead');
    await prisma.contract.update({ where: { id: c.id }, data: { status: 'CANCELLED' } });
    await notify(isBuyer ? c.factory.ownerId : c.buyerId, 'Contract cancelled', `"${c.title}" was cancelled.`, '/dashboard/contracts');
  }

  return { success: true };
});
