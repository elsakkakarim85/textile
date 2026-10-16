import { z } from 'zod';
import type { FacilityType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route, parseBody } from '@/server/http';
import { requireAdmin } from '@/server/auth';
import { audit } from '@/server/events';

const VALID_FACILITY_TYPES: FacilityType[] = [
  'TESTING_LAB',
  'CAD_DESIGN',
  'DYEHOUSE',
  'EFFLUENT_TREATMENT',
  'TRAINING_CENTER',
  'WAREHOUSE',
  'SHOWROOM',
  'OTHER',
];

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');

  const where: any = {};
  if (type && VALID_FACILITY_TYPES.includes(type as FacilityType)) {
    where.type = type as FacilityType;
  }

  const facilities = await prisma.sharedFacility.findMany({
    where,
    include: {
      _count: {
        select: {
          bookings: {
            where: { status: 'CONFIRMED', endAt: { gt: new Date() } },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { facilities };
});

const createFacilitySchema = z.object({
  name: z.string().min(3),
  nameAr: z.string().optional(),
  description: z.string(),
  type: z.string(),
  ratePerHour: z.number().min(0),
  location: z.string(),
  operatorName: z.string().optional(),
  operator: z.string().optional(),
  equipmentIds: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
});

export const POST = route(async (req) => {
  const user = await requireAdmin();
  const body = await parseBody(req, createFacilitySchema);

  const facilityType: FacilityType = VALID_FACILITY_TYPES.includes(body.type as FacilityType)
    ? (body.type as FacilityType)
    : 'TESTING_LAB';

  const facility = await prisma.sharedFacility.create({
    data: {
      name: body.name,
      nameAr: body.nameAr || null,
      description: body.description,
      type: facilityType,
      ratePerHour: body.ratePerHour,
      location: body.location,
      operator: body.operator || body.operatorName || null,
      equipment: body.equipment || body.equipmentIds || [],
    },
  });

  await audit(user.id, 'CREATE_FACILITY', 'SharedFacility', facility.id);

  return facility;
});
