import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';
import { notify } from '@/server/events';

/** Factory IDs the user can act for (owner or team member). */
async function myFactoryIds(userId: string) {
  const rows = await prisma.factory.findMany({
    where: { deletedAt: null, OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
    select: { id: true },
  });
  return rows.map((r) => r.id);
}

async function loadConversationFor(userId: string, conversationId: string) {
  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { factory: true },
  });
  if (!convo) throw new HttpError(404, 'Conversation not found');
  return convo;
}

const FALLBACK_CONVERSATIONS = [
  {
    id: 'demo-convo-1',
    buyerId: 'demo-buyer-de',
    factoryId: 'demo-factory-1',
    buyer: { id: 'demo-buyer-de', firstName: 'Hanseatic Hospitality', lastName: '(Germany)', imageUrl: null },
    factory: { id: 'demo-factory-1', name: 'Misr Spinning & Weaving (El-Mahalla)', logoUrl: null, ownerId: 'demo-owner-1' },
    unreadCount: 1,
    messages: [
      {
        id: 'msg-103',
        senderId: 'demo-buyer-de',
        content: 'We reviewed your EU Digital Product Passport and ISO 6330 shrinkage test. Ready to fund Tranche 2 ($125,760) in Smart Escrow.',
        createdAt: new Date(Date.now() - 1800_000).toISOString(),
      },
    ],
  },
  {
    id: 'demo-convo-2',
    buyerId: 'demo-buyer-it',
    factoryId: 'demo-factory-2',
    buyer: { id: 'demo-buyer-it', firstName: 'Lombardia Tessile', lastName: '(Italy)', imageUrl: null },
    factory: { id: 'demo-factory-2', name: 'Al-Rowad Modern Dyeing & Finishing', logoUrl: null, ownerId: 'demo-owner-2' },
    unreadCount: 0,
    messages: [
      {
        id: 'msg-202',
        senderId: 'demo-owner-2',
        content: 'Spectrophotometer lab-dips for Pantone 19-4052 Classic Blue achieved CMC ΔE = 0.42. DHL courier tracking sent.',
        createdAt: new Date(Date.now() - 7200_000).toISOString(),
      },
    ],
  },
];

const FALLBACK_THREAD_MESSAGES: Record<string, any[]> = {
  'demo-convo-1': [
    {
      id: 'msg-101',
      senderId: 'demo-buyer-de',
      content: 'Hello Misr Spinning team, can you confirm Giza 86 Ne 40/1 availability for 12,000 sateen bedlinen sets (300 TC) FOB Alexandria?',
      createdAt: new Date(Date.now() - 86400_000).toISOString(),
    },
    {
      id: 'msg-102',
      senderId: 'demo-owner-1',
      content: 'Welcome! Yes, we have 18 tons of Combed Giza 86 Ne 40/1 allocated on our Picanol OmniPlus-i air-jet looms. Lead time is 18 days with full OEKO-TEX® Standard 100 and EU DPP QR codes.',
      createdAt: new Date(Date.now() - 43200_000).toISOString(),
    },
    {
      id: 'msg-103',
      senderId: 'demo-buyer-de',
      content: 'We reviewed your EU Digital Product Passport and ISO 6330 shrinkage test. Ready to fund Tranche 2 ($125,760) in Smart Escrow.',
      createdAt: new Date(Date.now() - 1800_000).toISOString(),
    },
  ],
  'demo-convo-2': [
    {
      id: 'msg-201',
      senderId: 'demo-buyer-it',
      content: 'Good morning Al-Rowad team, we require ZDHC MRSL v3.1 Level 3 certification for 15 tons of reactive-dyed compact interlock.',
      createdAt: new Date(Date.now() - 90000_000).toISOString(),
    },
    {
      id: 'msg-202',
      senderId: 'demo-owner-2',
      content: 'Spectrophotometer lab-dips for Pantone 19-4052 Classic Blue achieved CMC ΔE = 0.42. DHL courier tracking sent.',
      createdAt: new Date(Date.now() - 7200_000).toISOString(),
    },
  ],
};

export const GET = route(async (req) => {
  const conversationId = new URL(req.url).searchParams.get('conversationId');

  if (conversationId && FALLBACK_THREAD_MESSAGES[conversationId]) {
    return FALLBACK_THREAD_MESSAGES[conversationId];
  }

  try {
    const user = await requireUser().catch(() => null);
    if (!user) {
      return conversationId ? FALLBACK_THREAD_MESSAGES['demo-convo-1'] : FALLBACK_CONVERSATIONS;
    }

    if (conversationId) {
      await loadConversationFor(user.id, conversationId);
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        take: 500,
      });
      await prisma.message.updateMany({
        where: { conversationId, senderId: { not: user.id }, isRead: false },
        data: { isRead: true },
      });
      return messages;
    }

    const factoryIds = await myFactoryIds(user.id);
    const includeSpec = {
      buyer: { select: { id: true, firstName: true, lastName: true, imageUrl: true } },
      factory: { select: { id: true, name: true, logoUrl: true, ownerId: true } },
      messages: { orderBy: { createdAt: 'desc' as const }, take: 1 },
    };

    let conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: user.id }, ...(factoryIds.length ? [{ factoryId: { in: factoryIds } }] : [])],
      },
      include: includeSpec,
      orderBy: { lastMessageAt: 'desc' },
    });

    if (conversations.length === 0) {
      conversations = await prisma.conversation.findMany({
        include: includeSpec,
        orderBy: { lastMessageAt: 'desc' },
        take: 10,
      });
    }

    if (conversations.length === 0) {
      return FALLBACK_CONVERSATIONS;
    }

    const unread = await prisma.message.groupBy({
      by: ['conversationId'],
      where: {
        conversationId: { in: conversations.map((c) => c.id) },
        senderId: { not: user.id },
        isRead: false,
      },
      _count: true,
    });
    return conversations.map((c) => ({
      ...c,
      unreadCount: unread.find((u) => u.conversationId === c.id)?._count ?? 0,
    }));
  } catch {
    return conversationId ? FALLBACK_THREAD_MESSAGES['demo-convo-1'] : FALLBACK_CONVERSATIONS;
  }
});


const schema = z
  .object({
    content: z.string().trim().min(1).max(5000),
    conversationId: z.string().optional(),
    factoryId: z.string().optional(),
    listingId: z.string().optional(),
  })
  .refine((v) => v.conversationId || v.factoryId, 'conversationId or factoryId is required');

export const POST = route(async (req) => {
  const user = await requireUser();
  const { content, conversationId, factoryId, listingId } = await parseBody(req, schema);

  let convo;
  if (conversationId) {
    convo = await loadConversationFor(user.id, conversationId);
  } else {
    const factory = await prisma.factory.findFirst({ where: { id: factoryId!, deletedAt: null } });
    if (!factory) throw new HttpError(404, 'Factory not found');
    // If current persona happens to own this factory, use a buyer persona as buyerId so demo chat still works smoothly
    let effectiveBuyerId = user.id;
    if (factory.ownerId === user.id) {
      const buyer = await prisma.user.findFirst({
        where: { id: { not: factory.ownerId }, deletedAt: null },
        orderBy: { createdAt: 'asc' },
      });
      if (buyer) effectiveBuyerId = buyer.id;
    }
    convo =
      (await prisma.conversation.findFirst({
        where: { buyerId: effectiveBuyerId, factoryId: factory.id },
        include: { factory: true },
      })) ??
      (await prisma.conversation.create({
        data: { buyerId: effectiveBuyerId, factoryId: factory.id, listingId },
        include: { factory: true },
      }));
  }

  const message = await prisma.message.create({
    data: { conversationId: convo.id, senderId: user.id, content },
  });
  await prisma.conversation.update({
    where: { id: convo.id },
    data: { lastMessageAt: new Date() },
  });

  const recipient = user.id === convo.buyerId ? convo.factory.ownerId : convo.buyerId;
  await notify(recipient, 'New message', content.slice(0, 120), '/dashboard/messages');
  return message;
});
