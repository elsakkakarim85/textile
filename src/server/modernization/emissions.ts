import type { SustainabilityRecord } from '@prisma/client';

// Emission factors based on Egyptian grid & IPCC / GHG Protocol standards
export const EMISSION_FACTORS = {
  electricityKwh: 0.45, // Egypt grid average kg CO2e / kWh
  naturalGasM3: 1.96,   // kg CO2e / m3
  dieselLiters: 2.68,   // kg CO2e / Liter
  waterM3: 0.344,       // kg CO2e / m3 supply & treatment
};

export type SustainabilityInput = Partial<SustainabilityRecord> & {
  productionVolumeKg?: number;
  renewableSharePct?: number;
  wasteTotalKg?: number;
  wasteRecycledKg?: number;
  certZdhc?: boolean;
  certOekoTex?: boolean;
};

export function computeCo2e(record: SustainabilityInput): number {
  const elec = Number(record.electricityKwh || 0);
  const solar = Number(record.solarKwh || 0);
  const renPct = Number(record.renewableSharePct || 0);

  // Scope 2: grid electricity after subtracting solar or renewable %
  const netGridElec = solar > 0
    ? Math.max(0, elec - solar)
    : elec * Math.max(0, 1 - renPct / 100);

  const scope2 = netGridElec * EMISSION_FACTORS.electricityKwh;

  // Scope 1: stationary combustion (natural gas + diesel)
  const scope1 =
    Number(record.naturalGasM3 || 0) * EMISSION_FACTORS.naturalGasM3 +
    Number(record.dieselLiters || 0) * EMISSION_FACTORS.dieselLiters;

  return Math.round((scope1 + scope2) * 100) / 100;
}

export function computeKPIs(record: SustainabilityInput) {
  const co2eKg = Number(record.co2eKg) > 0 ? Number(record.co2eKg) : computeCo2e(record);
  const productionKg = Number(record.productionKg ?? record.productionVolumeKg) || 1;
  const elec = Number(record.electricityKwh || 0);
  const solar = Number(record.solarKwh || 0);
  const wasteKg = Number(record.wasteKg ?? record.wasteTotalKg) || 0;
  const recycledWasteKg = Number(record.recycledWasteKg ?? record.wasteRecycledKg) || 0;
  const waterM3 = Number(record.waterM3 || 0);
  const recycledWaterM3 = Number(record.recycledWaterM3 || 0);

  const renewableSharePct =
    record.renewableSharePct !== undefined
      ? Number(record.renewableSharePct)
      : elec + solar > 0
      ? Math.round((solar / (elec + solar)) * 100)
      : 0;

  return {
    co2eKg: Math.round(co2eKg),
    intensityCo2e: Number((co2eKg / productionKg).toFixed(2)), // kg CO2e per kg product
    intensityWater: Number(((waterM3 * 1000) / productionKg).toFixed(1)), // Liters per kg product
    waterRecyclingRate: waterM3 > 0 ? Math.round((recycledWaterM3 / waterM3) * 100) : 0,
    wasteDiversionRate: wasteKg > 0 ? Math.round((recycledWasteKg / wasteKg) * 100) : 0,
    renewableSharePct,
  };
}

export function computeEsgScore(records: SustainabilityInput[]): number {
  if (!records || records.length === 0) return 0;

  const latest = records[0];
  const kpis = computeKPIs(latest);

  let score = 55; // base score

  // Reward low CO2e intensity (< 2.5 kg CO2e/kg is strong for textile wet/dry processing)
  if (kpis.intensityCo2e <= 2.0) score += 18;
  else if (kpis.intensityCo2e <= 3.5) score += 10;
  else if (kpis.intensityCo2e > 7.0) score -= 10;

  // Reward high waste diversion
  score += Math.min(15, Math.round((kpis.wasteDiversionRate / 100) * 15));

  // Reward renewable solar energy & water recycling
  score += Math.min(10, Math.round((kpis.renewableSharePct / 30) * 10));
  score += Math.min(7, Math.round((kpis.waterRecyclingRate / 40) * 7));

  return Math.min(100, Math.max(0, Math.round(score)));
}
