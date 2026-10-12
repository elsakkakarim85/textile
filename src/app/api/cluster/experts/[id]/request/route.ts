import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireUser } from '@/server/auth';

const requestSchema = z.object({
  topic: z.string().min(5),
  message: z.string().min(20),
  preferredAt: z.string().datetime().optional(),
});

export const POST = route(async (req, { params }) => {
  const { id } = params as { id: string };
  const { user } = await requireUser();
  const body = await parseBody(req, requestSchema);

  const expert = await prisma.expertProfile.findUnique({ where: { id } });
  if (!expert) throw new HttpError(404, 'Expert not found');
  if (!expert.isAvailableForMentorship) throw new HttpError(400, 'Not available for mentorship');
  if (expert.userId === user.id) throw new HttpError(400, 'Cannot request mentorship from yourself');

  const mentorshipRequest = await prisma.mentorshipRequest.create({
    data: {
      expertId: id,
      requesterId: user.id,
      ...body,
      status: 'PENDING',
    }
  });

  return mentorshipRequest;
});
