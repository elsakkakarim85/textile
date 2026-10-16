import { z } from 'zod';
import type { ForumCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route, parseBody } from '@/server/http';
import { requireUser } from '@/server/auth';
import { audit } from '@/server/events';

const VALID_FORUM_CATEGORIES: ForumCategory[] = [
  'GENERAL',
  'TECHNICAL',
  'MARKET',
  'POLICY',
  'SUSTAINABILITY',
  'JOBS',
];

const createThreadSchema = z.object({
  title: z.string().min(5).max(160),
  body: z.string().min(10).max(10000),
  category: z.string().default('GENERAL'),
  tags: z.array(z.string()).max(5).optional(),
});

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const q = url.searchParams.get('q');
  const sort = url.searchParams.get('sort') || 'latest';

  const where: any = { deletedAt: null };
  if (category && VALID_FORUM_CATEGORIES.includes(category as ForumCategory)) {
    where.category = category as ForumCategory;
  }
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
      posts: { where: { isAccepted: true, deletedAt: null }, select: { id: true } },
      _count: { select: { posts: true } },
    },
    orderBy: [{ isPinned: 'desc' }, orderBy],
    take: 50,
  });

  return { threads };
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, createThreadSchema);

  const category: ForumCategory = VALID_FORUM_CATEGORIES.includes(body.category as ForumCategory)
    ? (body.category as ForumCategory)
    : 'GENERAL';

  const thread = await prisma.forumThread.create({
    data: {
      authorId: user.id,
      title: body.title,
      body: body.body,
      category,
      tags: body.tags || [],
    },
  });

  await audit(user.id, 'CREATE_THREAD', 'ForumThread', thread.id);

  return thread;
});
