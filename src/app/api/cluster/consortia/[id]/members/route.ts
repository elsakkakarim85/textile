import { z } from 'zod';
import type { ConsortiumStatus, SeatStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { notifyFactory } from '@/server/cluster';

const inviteSchema = z.object({
  factoryId: z.string(),
  role: z.string().min(2),
  sharePct: z.number().min(1).max(100).default(25),
});

const patchSchema = z.object({
  memberId: z.string().optional(),
  status: z.enum(['ACCEPTED', 'DECLINED']).optional(),
  consortiumStatus: z.enum(['FORMING', 'BIDDING', 'ACTIVE', 'CLOSED']).optional(),
});

export const POST = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  await requireFactory();
  const body = await parseBody(req, inviteSchema);

  const consortium = await prisma.consortium.findUnique({ where: { id } });
  if (!consortium) throw new HttpError(404, 'Consortium not found');

  const member = await prisma.consortiumMember.upsert({
    where: {
      consortiumId_factoryId: {
        consortiumId: id,
        factoryId: body.factoryId,
      },
    },
    update: {
      role: body.role,
      sharePct: body.sharePct,
      status: 'ACCEPTED',
    },
    create: {
      consortiumId: id,
      factoryId: body.factoryId,
      role: body.role,
      sharePct: body.sharePct,
      status: 'ACCEPTED',
    },
  });

  await notifyFactory(
    body.factoryId,
    'Invited to Export Consortium',
    `Your factory was added to "${consortium.name}" as ${body.role}.`,
    `/cluster/consortia/${id}`
  );

  return member;
});

export const PATCH = route(async (req, ctx: any) => {
  const { id } = await ctx.params;
  await requireFactory();
  const body = await parseBody(req, patchSchema);

  if (body.consortiumStatus) {
    return prisma.consortium.update({
      where: { id },
      data: { status: body.consortiumStatus as ConsortiumStatus },
    });
  }

  if (body.memberId && body.status) {
    return prisma.consortiumMember.update({
      where: { id: body.memberId },
      data: { status: body.status as SeatStatus },
    });
  }

  throw new HttpError(400, 'Invalid update payload');
});
