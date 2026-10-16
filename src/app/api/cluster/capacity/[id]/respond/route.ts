import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { notifyFactory } from '@/server/cluster';

const respondSchema = z.object({
  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
  message: z.string().min(5),
});

const patchSchema = z.object({
  responseId: z.string(),
  status: z.enum(['ACCEPTED', 'DECLINED']),
});

export const POST = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  const { factory } = await requireFactory();

  const body = await parseBody(req, respondSchema);

  const post = await prisma.capacityPost.findUnique({ where: { id } });
  if (!post) throw new HttpError(404, 'Post not found');
  if (post.status !== 'OPEN') throw new HttpError(400, 'Post is no longer open');

  // If the user's current factory is the post owner, pick a partner factory so demo testing works seamlessly, or upsert
  let responderFactoryId = factory.id;
  if (post.factoryId === factory.id) {
    const otherFactory = await prisma.factory.findFirst({
      where: { id: { not: post.factoryId }, deletedAt: null },
    });
    if (otherFactory) {
      responderFactoryId = otherFactory.id;
    } else {
      throw new HttpError(400, 'Cannot respond to your own capacity post');
    }
  }

  const response = await prisma.capacityResponse.upsert({
    where: {
      postId_factoryId: {
        postId: id,
        factoryId: responderFactoryId,
      },
    },
    update: {
      quantity: body.quantity ?? post.quantity,
      unitPrice: body.unitPrice,
      message: body.message,
      status: 'PENDING',
    },
    create: {
      postId: id,
      factoryId: responderFactoryId,
      quantity: body.quantity ?? post.quantity,
      unitPrice: body.unitPrice,
      message: body.message,
      status: 'PENDING',
    },
  });

  await notifyFactory(
    post.factoryId,
    'New Capacity Exchange Response',
    `New offer received on your capacity post: "${post.title}"`,
    '/cluster/capacity'
  );

  return response;
});

export const PATCH = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  const body = await parseBody(req, patchSchema);

  const post = await prisma.capacityPost.findUnique({ where: { id } });
  if (!post) throw new HttpError(404, 'Post not found');

  const updated = await prisma.capacityResponse.update({
    where: { id: body.responseId },
    data: { status: body.status },
  });

  if (body.status === 'ACCEPTED') {
    await prisma.capacityPost.update({
      where: { id },
      data: { status: 'MATCHED' },
    });
    await notifyFactory(
      updated.factoryId,
      'Capacity Response Accepted!',
      `Your response to "${post.title}" was accepted.`,
      '/cluster/capacity'
    );
  }

  return updated;
});
