import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { computeCo2e, computeKPIs } from '@/server/modernization/emissions';

const recordSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
  productionVolumeKg: z.number().min(0).optional(),
  productionKg: z.number().min(0).optional(),
  electricityKwh: z.number().min(0).optional(),
  solarKwh: z.number().min(0).optional(),
  renewableSharePct: z.number().min(0).max(100).optional(),
  naturalGasM3: z.number().min(0).optional(),
  dieselLiters: z.number().min(0).optional(),
  waterM3: z.number().min(0).optional(),
  recycledWaterM3: z.number().min(0).optional(),
  chemicalsKg: z.number().min(0).optional(),
  wasteTotalKg: z.number().min(0).optional(),
  wasteKg: z.number().min(0).optional(),
  wasteRecycledKg: z.number().min(0).optional(),
  recycledWasteKg: z.number().min(0).optional(),
  certZdhc: z.boolean().optional(),
  certOekoTex: z.boolean().optional(),
  notes: z.string().optional(),
});

export const GET = route(async () => {
  const { factory } = await requireFactory();

  const records = await prisma.sustainabilityRecord.findMany({
    where: { factoryId: factory.id },
    orderBy: { period: 'desc' },
    take: 24,
  });

  return { records };
});

export const POST = route(async (req) => {
  const { factory } = await requireFactory();
  const body = await parseBody(req, recordSchema);

  const periodStr = body.period.length === 7 ? `${body.period}-01T00:00:00.000Z` : new Date(body.period).toISOString();
  const periodDate = new Date(periodStr);

  const productionKg = body.productionKg ?? body.productionVolumeKg ?? 0;
  const electricityKwh = body.electricityKwh ?? 0;
  const solarKwh =
    body.solarKwh ??
    (body.renewableSharePct ? Math.round((electricityKwh * body.renewableSharePct) / 100) : 0);
  const naturalGasM3 = body.naturalGasM3 ?? 0;
  const dieselLiters = body.dieselLiters ?? 0;
  const waterM3 = body.waterM3 ?? 0;
  const recycledWaterM3 = body.recycledWaterM3 ?? 0;
  const chemicalsKg = body.chemicalsKg ?? 0;
  const wasteKg = body.wasteKg ?? body.wasteTotalKg ?? 0;
  const recycledWasteKg = body.recycledWasteKg ?? body.wasteRecycledKg ?? 0;

  const co2eKg = computeCo2e({
    electricityKwh: electricityKwh as any,
    solarKwh: solarKwh as any,
    naturalGasM3: naturalGasM3 as any,
    dieselLiters: dieselLiters as any,
  });

  const dataPayload = {
    productionKg,
    electricityKwh,
    solarKwh,
    naturalGasM3,
    dieselLiters,
    waterM3,
    recycledWaterM3,
    chemicalsKg,
    wasteKg,
    recycledWasteKg,
    co2eKg,
    notes: body.notes || null,
  };

  const record = await prisma.sustainabilityRecord.upsert({
    where: {
      factoryId_period: {
        factoryId: factory.id,
        period: periodDate,
      },
    },
    update: dataPayload,
    create: {
      factoryId: factory.id,
      period: periodDate,
      ...dataPayload,
    },
  });

  const kpis = computeKPIs(record);
  return { record, kpis };
});
