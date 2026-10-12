import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { audit } from '@/server/events';

const createConsortiumSchema = z.object({
  name: z.string().min(5),
  description: z.string(),
  targetMarket: z.string().optional(),
  leadRole: z.string(),
});

export const GET = route(async () => {
  const consortia = await prisma.consortium.findMany({
    include: {
      members: {
        where: { status: 'ACCEPTED' },
        include: { factory: { select: { name: true, capabilities: true } } },
      },
      rfq: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { consortia };
});

export const POST = route(async (req) => {
  const { user, factory } = await requireFactory();
  const body = await parseBody(req, createConsortiumSchema);

  // Create the consortium AND add the creator as the lead member
  const consortium = await prisma.consortium.create({
    data: {
      ...body,
      status: 'FORMING',
      members: {
        create: {
          factoryId: factory.id,
          role: body.leadRole,
          status: 'ACCEPTED',
          sharePct: 0, // lead can adjust shares later
        }
      }
    }
  });

  await audit(user.id, 'CREATE_CONSORTIUM', 'Consortium', consortium.id);

  return consortium;
});
