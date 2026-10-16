import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody } from '@/server/http';
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
      { displayName: { contains: q, mode: 'insensitive' } },
      { headline: { contains: q, mode: 'insensitive' } },
      { bio: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (expertise) {
    where.expertise = { has: expertise };
  }
  if (mentorsOnly) {
    where.isMentor = true;
  }

  const experts = await prisma.expertProfile.findMany({
    where,
    include: {
      user: { select: { firstName: true, lastName: true, role: true } },
    },
    orderBy: [{ isVerified: 'desc' }, { yearsExp: 'desc' }],
  });

  return { experts };
});

const profileSchema = z.object({
  displayName: z.string().min(2).optional(),
  headline: z.string().min(5),
  bio: z.string().min(10),
  expertise: z.array(z.string()).min(1),
  yearsOfExperience: z.number().min(1).optional(),
  yearsExp: z.number().min(1).optional(),
  languages: z.array(z.string()).min(1),
  isAvailableForMentorship: z.boolean().optional(),
  isMentor: z.boolean().optional(),
  hourlyRate: z.number().optional(),
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, profileSchema);

  const displayName =
    body.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Cluster Expert';
  const yearsExp = body.yearsExp ?? body.yearsOfExperience ?? 10;
  const isMentor = body.isMentor ?? body.isAvailableForMentorship ?? true;

  const expert = await prisma.expertProfile.upsert({
    where: { userId: user.id },
    update: {
      displayName,
      headline: body.headline,
      bio: body.bio,
      expertise: body.expertise,
      yearsExp,
      languages: body.languages,
      isMentor,
      hourlyRate: body.hourlyRate ?? 0,
    },
    create: {
      userId: user.id,
      displayName,
      headline: body.headline,
      bio: body.bio,
      expertise: body.expertise,
      yearsExp,
      languages: body.languages,
      isMentor,
      hourlyRate: body.hourlyRate ?? 0,
      isVerified: true,
    },
  });

  await audit(user.id, 'UPDATE_EXPERT_PROFILE', 'ExpertProfile', expert.id);

  return expert;
});
