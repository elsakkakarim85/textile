import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';
import { currentUserId } from '@/server/cluster';

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const userId = await currentUserId();

  const where: any = {};
  if (category) where.category = category;

  const courses = await prisma.course.findMany({
    where,
    include: {
      _count: { select: { lessons: true, enrollments: true } },
      enrollments: userId ? { where: { userId } } : false,
    },
    orderBy: { createdAt: 'desc' },
  });

  return { courses };
});
