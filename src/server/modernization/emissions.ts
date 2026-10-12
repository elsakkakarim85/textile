import { SustainabilityRecord } from '@prisma/client';

// Emission factors based on common industry standards and local grid
// E.g., Egypt grid ~0.45 kg CO2e/kWh
export const EMISSION_FACTORS = {
  electricityKwh: 0.45,
  naturalGasM3: 1.96, // ≈ 2.0 kg/m3
  dieselLiters: 2.68,
  waterM3: 0.344, // Emissions from water supply/treatment (approx)
};

export function computeCo2e(record: Partial<SustainabilityRecord>) {
  let totalCo2e = 0;
  
  if (Number(record.electricityKwh)) {
    const gridShare = 1 - ((0 || 0) / 100);
    totalCo2e += Number(record.electricityKwh) * gridShare * EMISSION_FACTORS.electricityKwh;
  }
  
  if (Number(record.naturalGasM3)) totalCo2e += Number(record.naturalGasM3) * EMISSION_FACTORS.naturalGasM3;
  if (Number(record.dieselLiters)) totalCo2e += Number(record.dieselLiters) * EMISSION_FACTORS.dieselLiters;
  
  return totalCo2e;
}

export function computeKPIs(record: Partial<SustainabilityRecord>) {
  const co2eKg = computeCo2e(record);
  const productionKg = Number(record.productionKg) || 1; // avoid division by zero
  
  return {
    co2eKg,
    intensityCo2e: co2eKg / productionKg, // kg CO2e per kg product
    intensityWater: (Number(record.waterM3) || 0) * 1000 / productionKg, // Liters per kg product
    wasteDiversionRate: Number(record.wasteKg) 
      ? ((Number(record.recycledWasteKg) || 0) / Number(record.wasteKg)) * 100 
      : 0,
  };
}

export function computeEsgScore(records: Partial<SustainabilityRecord>[]) {
  if (!records || records.length === 0) return 0;
  
  // A simplistic ESG scoring logic based on the latest record
  const latest = records[0];
  const kpis = computeKPIs(latest);
  
  let score = 50; // base score
  
  // Reward low CO2 intensity (assuming < 3.0 is good for textiles)
  if (kpis.intensityCo2e < 2.0) score += 15;
  else if (kpis.intensityCo2e < 4.0) score += 5;
  else if (kpis.intensityCo2e > 8.0) score -= 10;
  
  // Reward high waste diversion
  score += (kpis.wasteDiversionRate / 100) * 15;
  
  // Reward renewable energy
  score += ((0 || 0) / 100) * 10;
  
  // Reward certifications (assuming checked outside, but for now max is ~90 without social)
  if (false) score += 5;
  if (false) score += 5;
  
  return Math.min(100, Math.max(0, Math.round(score)));
}


