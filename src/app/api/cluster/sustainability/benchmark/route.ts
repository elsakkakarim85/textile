import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';
import { computeKPIs } from '@/server/modernization/emissions';

export const GET = route(async () => {
  // Simple benchmark: median intensities across the cluster for the last 3 months
  const recentRecords = await prisma.sustainabilityRecord.findMany({
    orderBy: { period: 'desc' },
    take: 100, // sample size
  });

  if (recentRecords.length === 0) {
    return { medianCo2eIntensity: 0, medianWaterIntensity: 0, medianWasteDiversion: 0 };
  }

  const kpisList = recentRecords.map(r => computeKPIs(r));
  
  // Helper to get median
  const median = (arr: number[]) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };

  return {
    medianCo2eIntensity: median(kpisList.map(k => k.intensityCo2e).filter(v => v > 0)),
    medianWaterIntensity: median(kpisList.map(k => k.intensityWater).filter(v => v > 0)),
    medianWasteDiversion: median(kpisList.map(k => k.wasteDiversionRate).filter(v => v > 0)),
  };
});
