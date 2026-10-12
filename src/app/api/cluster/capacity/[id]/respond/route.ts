import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { notifyFactory } from '@/server/cluster';

const respondSchema = z.object({
  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
  message: z.string().min(10),
});

export const POST = route(async (req, { params }) => {
  const { id } = params as { id: string };
  const { user, factory } = await requireFactory();
  
  const body = await parseBody(req, respondSchema);

  const post = await prisma.capacityPost.findUnique({ where: { id } });
  if (!post) throw new HttpError(404, 'Post not found');
  if (post.status !== 'OPEN') throw new HttpError(400, 'Post is not open');
  if (post.factoryId === factory.id) throw new HttpError(400, 'Cannot respond to your own post');

  const response = await prisma.capacityResponse.create({
    data: {
      postId: id,
      responderId: factory.id,
      ...body,
      status: 'PENDING',
    }
  });

  // Notify the post owner
  await notifyFactory(post.factoryId, 'CAPACITY_RESPONSE', `New response to your capacity post: ${post.title}`);

  return response;
});
