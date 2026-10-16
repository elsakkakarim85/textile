import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { audit } from '@/server/events';

const applySchema = z.object({
  amountRequested: z.number().optional(),
  purpose: z.string().min(10),
});

export const POST = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  const { user, factory } = await requireFactory();

  const body = await parseBody(req, applySchema);

  const program = await prisma.fundingProgram.findUnique({ where: { id } });
  if (!program) throw new HttpError(404, 'Program not found');
  if (!program.isActive) throw new HttpError(400, 'Program is no longer active');
  if (program.deadline && new Date() > program.deadline) {
    throw new HttpError(400, 'Deadline has passed');
  }

  const application = await prisma.fundingApplication.upsert({
    where: {
      programId_factoryId: {
        programId: id,
        factoryId: factory.id,
      },
    },
    update: {
      amountRequested: body.amountRequested,
      purpose: body.purpose,
      status: 'SUBMITTED',
    },
    create: {
      programId: id,
      factoryId: factory.id,
      amountRequested: body.amountRequested,
      purpose: body.purpose,
      status: 'SUBMITTED',
    },
  });

  await audit(user.id, 'APPLY_FUNDING', 'FundingApplication', application.id);

  return application;
});
