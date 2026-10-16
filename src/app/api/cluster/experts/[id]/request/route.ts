import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';

const requestSchema = z.object({
  topic: z.string().min(3),
  message: z.string().min(5),
  preferredAt: z.string().optional(),
});

export const POST = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  const user = await requireUser();
  const body = await parseBody(req, requestSchema);

  const expert = await prisma.expertProfile.findUnique({ where: { id } });
  if (!expert) throw new HttpError(404, 'Expert not found');
  if (!expert.isMentor) throw new HttpError(400, 'Not available for mentorship');

  const mentorshipRequest = await prisma.mentorshipRequest.create({
    data: {
      expertId: id,
      requesterId: user.id,
      topic: body.topic,
      message: body.message,
      preferredAt: body.preferredAt ? new Date(body.preferredAt) : null,
      status: 'PENDING',
    },
  });

  return mentorshipRequest;
});
