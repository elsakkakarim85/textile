import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireAdmin } from '@/server/auth';
import { audit } from '@/server/events';

export const GET = route(async () => {
  const announcements = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' }
    ],
    include: { author: { select: { firstName: true, lastName: true } } }
  });

  return { announcements };
});

const createAnnouncementSchema = z.object({
  titleEn: z.string().min(5),
  titleAr: z.string().min(5),
  bodyEn: z.string().min(10),
  bodyAr: z.string().min(10),
  targetRole: z.string(),
  isPinned: z.boolean().optional(),
});

export const POST = route(async (req) => {
  const { user } = await requireAdmin();
  const body = await parseBody(req, createAnnouncementSchema);

  const announcement = await prisma.announcement.create({
    data: {
      authorId: user.id,
      ...body,
      isPinned: body.isPinned || false,
    },
  });

  await audit(user.id, 'CREATE_ANNOUNCEMENT', 'Announcement', announcement.id);

  return announcement;
});
