import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { audit } from '@/server/events';

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const tag = url.searchParams.get('tag');

  const where: any = { isActive: true };
  if (tag) where.tags = { has: tag };

  const programs = await prisma.fundingProgram.findMany({
    where,
    orderBy: { deadline: 'asc' },
  });

  return { programs };
});

const applySchema = z.object({
  amountRequested: z.number().min(1000).optional(),
  purpose: z.string().min(20),
});

export const POST = route(async (req, { params }: any) => {
  // We use this route for POSTing applications, handling it as a composite endpoint or we can split it.
  // Actually, standard REST would put apply on /api/cluster/funding/[id]/apply.
  // We will just do a standard export here for creating programs (admin) if needed, but let's skip admin creation for brevity.
  throw new HttpError(405, 'Method not allowed');
});
