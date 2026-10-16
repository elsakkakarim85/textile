import { z } from 'zod';
import type { Audience } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route, parseBody } from '@/server/http';
import { requireAdmin } from '@/server/auth';
import { audit } from '@/server/events';

const VALID_AUDIENCES: Audience[] = ['ALL', 'FACTORIES', 'BUYERS', 'WORKERS'];

export const GET = route(async () => {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
    include: { author: { select: { firstName: true, lastName: true } } },
  });

  return { announcements };
});

const createAnnouncementSchema = z.object({
  titleEn: z.string().min(3).optional(),
  title: z.string().min(3).optional(),
  titleAr: z.string().optional(),
  bodyEn: z.string().min(5).optional(),
  body: z.string().min(5).optional(),
  bodyAr: z.string().optional(),
  targetRole: z.string().optional(),
  audience: z.string().optional(),
  isPinned: z.boolean().optional(),
});

export const POST = route(async (req) => {
  const user = await requireAdmin();
  const body = await parseBody(req, createAnnouncementSchema);

  const rawAudience = (body.audience || body.targetRole || 'ALL').toUpperCase();
  const audience: Audience = VALID_AUDIENCES.includes(rawAudience as Audience)
    ? (rawAudience as Audience)
    : 'ALL';

  const announcement = await prisma.announcement.create({
    data: {
      authorId: user.id,
      title: body.title || body.titleEn || 'Cluster Announcement',
      titleAr: body.titleAr || null,
      body: body.body || body.bodyEn || '',
      bodyAr: body.bodyAr || null,
      audience,
      isPinned: body.isPinned || false,
    },
  });

  await audit(user.id, 'CREATE_ANNOUNCEMENT', 'Announcement', announcement.id);

  return announcement;
});
