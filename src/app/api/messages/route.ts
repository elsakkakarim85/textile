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

/** Loads a conversation only if the user is a participant — fixes an IDOR where anyone could read any chat. */
async function loadConversationFor(userId: string, conversationId: string) {
  const convo = await prisma.conversation.findUnique({ where: { id: conversationId }, include: { factory: true } });
  if (!convo) throw new HttpError(404, 'Conversation not found');
  const factoryIds = await myFactoryIds(userId);
  if (convo.buyerId !== userId && !factoryIds.includes(convo.factoryId)) throw new HttpError(403, 'Forbidden');
  return convo;
}

export const GET = route(async (req) => {
  const user = await requireUser();
  const conversationId = new URL(req.url).searchParams.get('conversationId');

  if (conversationId) {
    await loadConversationFor(user.id, conversationId);
    const messages = await prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' }, take: 500 });
    await prisma.message.updateMany({ where: { conversationId, senderId: { not: user.id }, isRead: false }, data: { isRead: true } });
    return messages;
  }

  const factoryIds = await myFactoryIds(user.id);
  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ buyerId: user.id }, ...(factoryIds.length ? [{ factoryId: { in: factoryIds } }] : [])] },
    include: {
      buyer: { select: { id: true, firstName: true, lastName: true, imageUrl: true } },
      factory: { select: { id: true, name: true, logoUrl: true, ownerId: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { lastMessageAt: 'desc' },
  });

  const unread = await prisma.message.groupBy({
    by: ['conversationId'],
    where: { conversationId: { in: conversations.map((c) => c.id) }, senderId: { not: user.id }, isRead: false },
    _count: true,
  });
  return conversations.map((c) => ({ ...c, unreadCount: unread.find((u) => u.conversationId === c.id)?._count ?? 0 }));
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
    if (factory.ownerId === user.id) throw new HttpError(400, 'You cannot message your own factory');
    convo =
      (await prisma.conversation.findFirst({ where: { buyerId: user.id, factoryId: factory.id }, include: { factory: true } })) ??
      (await prisma.conversation.create({ data: { buyerId: user.id, factoryId: factory.id, listingId }, include: { factory: true } }));
  }

  const message = await prisma.message.create({ data: { conversationId: convo.id, senderId: user.id, content } });
  await prisma.conversation.update({ where: { id: convo.id }, data: { lastMessageAt: new Date() } });

  const recipient = user.id === convo.buyerId ? convo.factory.ownerId : convo.buyerId;
  await notify(recipient, 'New message', content.slice(0, 120), '/dashboard/messages');
  return message;
});
