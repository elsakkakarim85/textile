import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    if (conversationId) {
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' }
      });
      return NextResponse.json(messages);
    }

    // Otherwise, fetch all conversations for the user
    // The user could be the buyer OR the factory owner
    const factory = await prisma.factory.findFirst({ where: { ownerId: authObj.userId } });

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { buyerId: authObj.userId },
          ...(factory ? [{ factoryId: factory.id }] : [])
        ]
      },
      include: {
        buyer: true,
        factory: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { factoryId, content, listingId, conversationId } = await req.json();

    let convoId = conversationId;

    if (!convoId) {
      // Find existing or create new conversation
      let conversation = await prisma.conversation.findFirst({
        where: { buyerId: authObj.userId, factoryId }
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: { buyerId: authObj.userId, factoryId, listingId }
        });
      }
      convoId = conversation.id;
    }

    const message = await prisma.message.create({
      data: {
        conversationId: convoId,
        senderId: authObj.userId,
        content
      }
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: convoId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
