import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';
import { audit } from '@/server/events';

const createThreadSchema = z.object({
  title: z.string().min(8).max(160),
  body: z.string().min(20).max(10000),
  category: z.string(),
  tags: z.array(z.string()).max(5).optional(),
});

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const q = url.searchParams.get('q');
  const sort = url.searchParams.get('sort') || 'latest';

  const where: any = {};
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { body: { contains: q, mode: 'insensitive' } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'top') orderBy = { posts: { _count: 'desc' } };

  const threads = await prisma.forumThread.findMany({
    where,
    include: {
      author: { select: { firstName: true, lastName: true, role: true } },
      _count: { select: { posts: true } },
    },
    orderBy: [
      { isPinned: 'desc' },
      orderBy
    ],
    take: 50,
  });

  return { threads };
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, createThreadSchema);

  // Basic rate limiting could go here, omitting for brevity

  const thread = await prisma.forumThread.create({
    data: {
      authorId: user.id,
      ...body,
      tags: body.tags || [],
    },
  });

  await audit(user.id, 'CREATE_THREAD', 'ForumThread', thread.id);

  return thread;
});
