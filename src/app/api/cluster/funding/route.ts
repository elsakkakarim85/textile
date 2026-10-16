import { z } from 'zod';
import type { FundingType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route, parseBody } from '@/server/http';
import { requireAdmin } from '@/server/auth';
import { audit } from '@/server/events';

const VALID_FUNDING_TYPES: FundingType[] = [
  'GRANT',
  'LOAN',
  'TECHNICAL_ASSISTANCE',
  'SUBSIDY',
  'EQUITY',
];

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

const createProgramSchema = z.object({
  title: z.string().min(4),
  titleAr: z.string().optional(),
  provider: z.string().min(2),
  type: z.string().default('GRANT'),
  description: z.string().min(10),
  descriptionAr: z.string().optional(),
  eligibility: z.string().default('Approved Mahalla Textile Cluster SME'),
  maxAmount: z.number().optional(),
  deadline: z.string().optional(),
  tags: z.array(z.string()).default(['modernization']),
});

export const POST = route(async (req) => {
  const user = await requireAdmin();
  const body = await parseBody(req, createProgramSchema);

  const type: FundingType = VALID_FUNDING_TYPES.includes(body.type as FundingType)
    ? (body.type as FundingType)
    : 'GRANT';

  const program = await prisma.fundingProgram.create({
    data: {
      title: body.title,
      titleAr: body.titleAr || body.title,
      provider: body.provider,
      type,
      description: body.description,
      descriptionAr: body.descriptionAr || null,
      eligibility: body.eligibility || 'Approved Mahalla Textile Cluster SME',
      maxAmount: body.maxAmount,
      deadline: body.deadline ? new Date(body.deadline) : null,
      tags: body.tags || ['modernization'],
      isActive: true,
    },
  });

  await audit(user.id, 'CREATE_FUNDING_PROGRAM', 'FundingProgram', program.id);

  return program;
});
