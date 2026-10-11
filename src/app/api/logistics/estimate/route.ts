import { z } from 'zod';
import { route, parseBody } from '@/server/http';

/**
 * Indicative ocean-freight estimate from Alexandria. Rates are configurable reference values,
 * NOT live carrier quotes (live carrier APIs are planned in Phase 5).
 */
const LANES = {
  europe: { ratePerCbm: 120, transit: '12–15 days', port: 'Genoa / Rotterdam' },
  usa: { ratePerCbm: 250, transit: '25–30 days', port: 'New York / Savannah' },
  gcc: { ratePerCbm: 80, transit: '5–7 days', port: 'Jeddah / Jebel Ali' },
  other: { ratePerCbm: 150, transit: '15–20 days', port: '—' },
} as const;

const schema = z.object({
  weightKg: z.coerce.number().positive().max(1_000_000),
  volumeCbm: z.coerce.number().positive().max(10_000),
  destination: z.string().trim().toLowerCase(),
});

export const POST = route(async (req) => {
  const { weightKg, volumeCbm, destination } = await parseBody(req, schema);
  const lane = LANES[destination as keyof typeof LANES] ?? LANES.other;

  // Ocean LCL: chargeable volume = max(CBM, metric tonnes)
  const chargeable = Math.max(volumeCbm, weightKg / 1000);
  const oceanFreight = chargeable * lane.ratePerCbm;
  const customs = 150;
  const docs = 50;

  return {
    success: true,
    data: {
      chargeableCbm: chargeable.toFixed(2),
      oceanFreight: oceanFreight.toFixed(2),
      customs: customs.toFixed(2),
      docs: docs.toFixed(2),
      totalUsd: (oceanFreight + customs + docs).toFixed(2),
      estimatedTransitTime: lane.transit,
      portOfLoading: 'Alexandria, Egypt',
      portOfDischarge: lane.port,
      disclaimer: 'Indicative estimate only. Final rates depend on carrier, season and cargo.',
    },
  };
});
