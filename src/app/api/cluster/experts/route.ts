import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';
import { audit } from '@/server/events';

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const q = url.searchParams.get('q');
  const expertise = url.searchParams.get('expertise');
  const mentorsOnly = url.searchParams.get('mentorsOnly') === 'true';

  const where: any = {};
  if (q) {
    where.OR = [
      { headline: { contains: q, mode: 'insensitive' } },
      { bio: { contains: q, mode: 'insensitive' } }
    ];
  }
  if (expertise) {
    where.expertise = { has: expertise };
  }
  if (mentorsOnly) {
    where.isAvailableForMentorship = true;
  }

  const experts = await prisma.expertProfile.findMany({
    where,
    include: {
      user: { select: { firstName: true, lastName: true, role: true } },
    },
    orderBy: [
      { isVerified: 'desc' }, // Verified first
      { yearsOfExperience: 'desc' }
    ]
  });

  return { experts };
});

const profileSchema = z.object({
  headline: z.string().min(5),
  bio: z.string().min(20),
  expertise: z.array(z.string()).min(1),
  yearsOfExperience: z.number().min(1),
  languages: z.array(z.string()).min(1),
  isAvailableForMentorship: z.boolean(),
  hourlyRate: z.number().optional(),
});

export const POST = route(async (req) => {
  const { user } = await requireUser();
  const body = await parseBody(req, profileSchema);

  const expert = await prisma.expertProfile.upsert({
    where: { userId: user.id },
    update: body,
    create: {
      userId: user.id,
      ...body,
      isVerified: false, // Must be verified by admin
    }
  });

  await audit(user.id, 'UPDATE_EXPERT_PROFILE', 'ExpertProfile', expert.id);

  return expert;
});
