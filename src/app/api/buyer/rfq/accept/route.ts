import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';
import { notify } from '@/server/events';

const schema = z.object({ rfqId: z.string().min(1), quotationId: z.string().min(1) });

/**
 * Buyer accepts a quotation → RFQ AWARDED, other quotes REJECTED, a DRAFT contract with
 * default 30/70 milestones is created, and a buyer↔factory conversation is opened.
 * All in one transaction so the state can never be half-applied.
 */
export const POST = route(async (req) => {
  const user = await requireUser();
  const { rfqId, quotationId } = await parseBody(req, schema);

  const result = await prisma.$transaction(async (tx) => {
    const rfq = await tx.rFQ.findUnique({ where: { id: rfqId } });
    if (!rfq || rfq.buyerId !== user.id) throw new HttpError(403, 'Not authorized or RFQ not found');
    if (rfq.status !== 'OPEN') throw new HttpError(400, 'This RFQ is no longer open');

    const quote = await tx.quotation.findUnique({ where: { id: quotationId }, include: { factory: true } });
    if (!quote || quote.rfqId !== rfqId) throw new HttpError(404, 'Quotation not found for this RFQ');
    if (quote.validUntil && quote.validUntil < new Date()) throw new HttpError(400, 'This quotation has expired');

    await tx.rFQ.update({ where: { id: rfqId }, data: { status: 'AWARDED' } });
    await tx.quotation.updateMany({ where: { rfqId, id: { not: quotationId } }, data: { status: 'REJECTED' } });
    await tx.quotation.update({ where: { id: quotationId }, data: { status: 'ACCEPTED' } });

    const total = new Prisma.Decimal(quote.unitPrice).mul(rfq.quantity);
    const advance = total.mul(0.3).toDecimalPlaces(2);
    const contract = await tx.contract.create({
      data: {
        title: rfq.title,
        totalAmount: total,
        currency: quote.currency,
        status: 'DRAFT',
        quotationId: quote.id,
        buyerId: user.id,
        factoryId: quote.factoryId,
        buyerAcceptedAt: new Date(),
        milestones: {
          create: [
            { title: '30% advance payment', amount: advance },
            { title: '70% balance against bill of lading', amount: total.minus(advance) },
          ],
        },
      },
    });

    const conversation =
      (await tx.conversation.findFirst({ where: { buyerId: user.id, factoryId: quote.factoryId } })) ??
      (await tx.conversation.create({ data: { buyerId: user.id, factoryId: quote.factoryId, rfqId, contractId: contract.id } }));

    await tx.message.create({
      data: {
        conversationId: conversation.id,
        senderId: user.id,
        content: `I accepted your quotation of ${quote.unitPrice} ${quote.currency}/${rfq.unit} for "${rfq.title}" (${rfq.quantity} ${rfq.unit}). A draft contract has been created for your confirmation.`,
      },
    });
    await tx.conversation.update({ where: { id: conversation.id }, data: { lastMessageAt: new Date() } });

    return { contract, conversation, factoryOwnerId: quote.factory.ownerId, rfqTitle: rfq.title };
  });

  await notify(
    result.factoryOwnerId,
    'Quotation accepted 🎉',
    `Your quotation for "${result.rfqTitle}" was accepted. Please review and confirm the draft contract.`,
    '/dashboard/contracts',
  );

  return { success: true, conversationId: result.conversation.id, contractId: result.contract.id };
});
