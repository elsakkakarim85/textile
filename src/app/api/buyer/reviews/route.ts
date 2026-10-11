import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';
import { notify } from '@/server/events';

const schema = z.object({
  factoryId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional(),
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const { factoryId, rating, comment } = await parseBody(req, schema);

  const factory = await prisma.factory.findUnique({ where: { id: factoryId } });
  if (!factory) throw new HttpError(404, 'Factory not found');
  if (factory.ownerId === user.id) throw new HttpError(400, 'You cannot review your own factory.');

  // Only buyers who actually did business with the factory may review (prevents fake reviews)
  const hasDealt = await prisma.contract.count({ where: { buyerId: user.id, factoryId } });
  if (!hasDealt && user.role !== 'admin') {
    throw new HttpError(403, 'Only buyers with a contract with this factory can leave a review.');
  }

  const review = await prisma.review.upsert({
    where: { factoryId_reviewerId: { factoryId, reviewerId: user.id } },
    create: { factoryId, rating, comment, reviewerId: user.id },
    update: { rating, comment },
  });

  await notify(factory.ownerId, 'New review', `You received a ${rating}★ review.`, `/factories/${factoryId}`);
  return review;
});
