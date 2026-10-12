import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireAdmin } from '@/server/auth';
import { audit } from '@/server/events';

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');

  const where: any = {};
  if (type) where.type = type;

  const facilities = await prisma.sharedFacility.findMany({
    where,
    include: {
      // Just getting a count of confirmed upcoming bookings to show availability
      _count: {
        select: {
          bookings: {
            where: { status: 'CONFIRMED', endAt: { gt: new Date() } }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return { facilities };
});

const createFacilitySchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  type: z.string(),
  ratePerHour: z.number().min(0),
  location: z.string(),
  operatorName: z.string().optional(),
  equipmentIds: z.array(z.string()).optional(),
});

export const POST = route(async (req) => {
  const { user } = await requireAdmin();
  const body = await parseBody(req, createFacilitySchema);

  const facility = await prisma.sharedFacility.create({
    data: {
      ...body,
      equipment: body.equipmentIds || [],
    },
  });

  await audit(user.id, 'CREATE_FACILITY', 'SharedFacility', facility.id);

  return facility;
});
