import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { audit } from '@/server/events';

const applySchema = z.object({
  amountRequested: z.number().optional(),
  purpose: z.string().min(10),
});

export const POST = route(async (req, { params }: any) => {
  const { id } = params as { id: string };
  const { user, factory } = await requireFactory();
  
  const body = await parseBody(req, applySchema);

  const program = await prisma.fundingProgram.findUnique({ where: { id } });
  if (!program) throw new HttpError(404, 'Program not found');
  if (!program.isActive) throw new HttpError(400, 'Program is no longer active');
  if (program.deadline && new Date() > program.deadline) throw new HttpError(400, 'Deadline has passed');

  // Check if already applied
  const existing = await prisma.fundingApplication.findFirst({
    where: { programId: id, factoryId: factory.id }
  });
  if (existing) throw new HttpError(409, 'Already applied to this program');

  const application = await prisma.fundingApplication.create({
    data: {
      programId: id,
      factoryId: factory.id,
      ...body,
      
    }
  });

  await audit(user.id, 'APPLY_FUNDING', 'FundingApplication', application.id);

  return application;
});
