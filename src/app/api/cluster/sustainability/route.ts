import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { computeCo2e, computeKPIs } from '@/server/modernization/emissions';

const recordSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM
  productionVolumeKg: z.number().min(0),
  electricityKwh: z.number().min(0).optional(),
  renewableSharePct: z.number().min(0).max(100).optional(),
  naturalGasM3: z.number().min(0).optional(),
  dieselLiters: z.number().min(0).optional(),
  waterM3: z.number().min(0).optional(),
  // wasteTotalKg: z.number().min(0).optional(),
  // wasteRecycledKg: z.number().min(0).optional(),
  // certZdhc: z.boolean().optional(),
  // certOekoTex: z.boolean().optional(),
});

export const GET = route(async (req) => {
  const { factory } = await requireFactory();
  
  const records = await prisma.sustainabilityRecord.findMany({
    where: { factoryId: factory.id },
    orderBy: { period: 'desc' },
    take: 24, // last 24 months
  });

  return { records };
});

export const POST = route(async (req) => {
  const { factory } = await requireFactory();
  const body = await parseBody(req, recordSchema);
  
  const co2eKg = computeCo2e(body);
  const kpis = computeKPIs(body);

  const record = await prisma.sustainabilityRecord.upsert({
    where: {
      factoryId_period: {
        factoryId: factory.id,
        period: new Date(body.period),
      }
    },
    update: {
      ...body,
      co2eKg,
    },
    create: {
      factoryId: factory.id,
      ...body,
      co2eKg,
    }
  });

  return { record, kpis };
});
