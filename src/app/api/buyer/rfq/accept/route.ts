import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { rfqId, quotationId } = await req.json();

    // Verify buyer owns the RFQ
    const rfq = await prisma.rFQ.findUnique({
      where: { id: rfqId }
    });

    if (!rfq || rfq.buyerId !== authObj.userId) {
      return NextResponse.json({ error: 'Not authorized or RFQ not found' }, { status: 403 });
    }

    if (rfq.status === 'CLOSED') {
      return NextResponse.json({ error: 'RFQ is already closed' }, { status: 400 });
    }

    // 1. Mark RFQ as CLOSED
    await prisma.rFQ.update({
      where: { id: rfqId },
      data: { status: 'CLOSED' }
    });

    // 2. Mark the selected quotation as ACCEPTED, and others as REJECTED
    await prisma.quotation.updateMany({
      where: { rfqId },
      data: { status: 'REJECTED' }
    });

    const acceptedQuote = await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: 'ACCEPTED' },
      include: { factory: true }
    });

    // 3. Create or find a Conversation between buyer and factory owner
    let conversation = await prisma.conversation.findFirst({
      where: { buyerId: authObj.userId, factoryId: acceptedQuote.factoryId }
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          buyerId: authObj.userId,
          factoryId: acceptedQuote.factoryId
        }
      });
    }

    // 4. Send an automatic message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: authObj.userId,
        content: `I have accepted your quotation of ${acceptedQuote.price} for my RFQ: "${rfq.title}". Let's discuss the details!`
      }
    });

    // Notify the factory owner
    await prisma.notification.create({
      data: {
        userId: acceptedQuote.factory.ownerId,
        title: "RFQ Accepted! 🎉",
        message: `Your quotation for "${rfq.title}" was accepted. Check your messages.`,
      }
    });

    return NextResponse.json({ success: true, conversationId: conversation.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to accept quotation' }, { status: 500 });
  }
}
