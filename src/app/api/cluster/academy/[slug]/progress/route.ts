import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';

const progressSchema = z.object({
  lessonId: z.string().optional(),
});

export const POST = route(async (req, ctx: any) => {
  const { slug } = await ctx.params;
  const user = await requireUser();
  const body = await parseBody(req, progressSchema);

  const course = await prisma.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { position: 'asc' } } },
  });
  if (!course) throw new HttpError(404, 'Course not found');

  const existing = await prisma.enrollment.findUnique({
    where: { courseId_userId: { courseId: course.id, userId: user.id } },
  });

  // If no lessonId is passed, this is just an enrollment action
  if (!body.lessonId) {
    if (existing) return existing;
    return prisma.enrollment.create({
      data: {
        courseId: course.id,
        userId: user.id,
        completedLessons: [],
        progress: 0,
        status: 'ENROLLED',
      },
    });
  }

  const completedSet = new Set<string>(existing?.completedLessons || []);
  completedSet.add(body.lessonId);
  const completedLessons = Array.from(completedSet);

  const totalLessons = Math.max(1, course.lessons.length);
  const progress = Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
  const isCompleted = progress >= 100;
  const certificateCode = isCompleted
    ? existing?.certificateCode || `MC-${course.slug.slice(0, 4).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    : existing?.certificateCode || null;

  const enrollment = await prisma.enrollment.upsert({
    where: { courseId_userId: { courseId: course.id, userId: user.id } },
    update: {
      completedLessons,
      progress,
      status: isCompleted ? 'COMPLETED' : 'ENROLLED',
      completedAt: isCompleted ? existing?.completedAt || new Date() : null,
      certificateCode,
    },
    create: {
      courseId: course.id,
      userId: user.id,
      completedLessons,
      progress,
      status: isCompleted ? 'COMPLETED' : 'ENROLLED',
      completedAt: isCompleted ? new Date() : null,
      certificateCode,
    },
  });

  return enrollment;
});
