import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { audit } from '@/server/events';

const createConsortiumSchema = z.object({
  name: z.string().min(4),
  description: z.string().min(5),
  targetMarket: z.string().optional(),
  leadRole: z.string().default('Lead / Final Assembly'),
  rfqId: z.string().optional(),
});

export const GET = route(async () => {
  const consortia = await prisma.consortium.findMany({
    include: {
      leadFactory: { select: { id: true, name: true } },
      members: {
        include: { factory: { select: { id: true, name: true, capabilities: true, monthlyCapacity: true } } },
      },
      rfq: { select: { id: true, title: true, quantity: true, unit: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { consortia };
});

export const POST = route(async (req) => {
  const { user, factory } = await requireFactory();
  const body = await parseBody(req, createConsortiumSchema);

  const consortium = await prisma.consortium.create({
    data: {
      name: body.name,
      description: body.description,
      targetMarket: body.targetMarket || 'EU',
      leadFactoryId: factory.id,
      rfqId: body.rfqId || null,
      status: 'FORMING',
      members: {
        create: {
          factoryId: factory.id,
          role: body.leadRole || 'Lead / Final Assembly',
          status: 'ACCEPTED',
          sharePct: 50,
        },
      },
    },
  });

  await audit(user.id, 'CREATE_CONSORTIUM', 'Consortium', consortium.id);

  return consortium;
});
