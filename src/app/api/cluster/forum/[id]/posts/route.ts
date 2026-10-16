import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';

const createPostSchema = z.object({
  body: z.string().min(3).max(5000),
});

const patchSchema = z.object({
  postId: z.string().optional(),
  accept: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  isLocked: z.boolean().optional(),
});

export const POST = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  const user = await requireUser();
  const body = await parseBody(req, createPostSchema);

  const thread = await prisma.forumThread.findUnique({ where: { id } });
  if (!thread || thread.deletedAt) throw new HttpError(404, 'Thread not found');
  if (thread.isLocked) throw new HttpError(400, 'Thread is locked');

  const post = await prisma.forumPost.create({
    data: {
      threadId: id,
      authorId: user.id,
      body: body.body,
    },
  });

  await prisma.forumThread.update({
    where: { id },
    data: { lastActivityAt: new Date() },
  });

  return post;
});

export const PATCH = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  await requireUser();
  const body = await parseBody(req, patchSchema);

  if (body.postId && body.accept !== undefined) {
    await prisma.forumPost.updateMany({
      where: { threadId: id },
      data: { isAccepted: false },
    });
    return prisma.forumPost.update({
      where: { id: body.postId },
      data: { isAccepted: body.accept },
    });
  }

  return prisma.forumThread.update({
    where: { id },
    data: {
      ...(body.isPinned !== undefined ? { isPinned: body.isPinned } : {}),
      ...(body.isLocked !== undefined ? { isLocked: body.isLocked } : {}),
    },
  });
});
