import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';

export const revalidate = 300; // Cache for 5 minutes

export const GET = route(async () => {
  const [
    factoriesRes,
    rfqsRes,
    contractsRes,
    procurementRes,
    maturityRes,
    sustainabilityRes,
  ] = await Promise.allSettled([
    prisma.factory.count({ where: { status: 'APPROVED', deletedAt: null } }),
    prisma.rFQ.count({ where: { status: 'OPEN' } }),
    prisma.contract.aggregate({ _sum: { totalAmount: true }, where: { status: 'ACTIVE' } }),
    prisma.poolCommitment.aggregate({ _sum: { quantity: true }, where: { status: { in: ['COMMITTED', 'CONFIRMED'] } } }),
    prisma.maturityAssessment.findMany({ orderBy: { createdAt: 'desc' }, select: { factoryId: true, scores: true } }),
    prisma.sustainabilityRecord.findMany({ take: 200, orderBy: { period: 'desc' } }),
  ]);

  const factoriesCount = factoriesRes.status === 'fulfilled' ? factoriesRes.value : 0;
  const openRfqs = rfqsRes.status === 'fulfilled' ? rfqsRes.value : 0;
  const totalContractValue =
    contractsRes.status === 'fulfilled' ? Number(contractsRes.value._sum.totalAmount || 0) : 0;
  const committedVolume =
    procurementRes.status === 'fulfilled' ? Number(procurementRes.value._sum.quantity || 0) : 0;

  // Process Maturity
  const maturityAverages = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
  if (maturityRes.status === 'fulfilled' && maturityRes.value.length > 0) {
    const latestPerFactory = new Map<string, Record<string, number>>();
    for (const a of maturityRes.value) {
      if (!latestPerFactory.has(a.factoryId)) {
        latestPerFactory.set(a.factoryId, a.scores as Record<string, number>);
      }
    }
    const latest = Array.from(latestPerFactory.values());
    const sums = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
    for (const scores of latest) {
      for (const key of Object.keys(sums)) {
        sums[key as keyof typeof sums] += scores[key] || 0;
      }
    }
    for (const key of Object.keys(sums)) {
      maturityAverages[key as keyof typeof maturityAverages] = Math.round(
        sums[key as keyof typeof sums] / latest.length
      );
    }
  }

  // Process Sustainability (Total CO2e by YYYY-MM period)
  const co2eTrend: Record<string, { co2eKg: number; productionKg: number }> = {};
  if (sustainabilityRes.status === 'fulfilled') {
    for (const r of sustainabilityRes.value) {
      const periodKey = r.period.toISOString().slice(0, 7);
      if (!co2eTrend[periodKey]) co2eTrend[periodKey] = { co2eKg: 0, productionKg: 0 };
      co2eTrend[periodKey].co2eKg += Number(r.co2eKg || 0);
      co2eTrend[periodKey].productionKg += Number(r.productionKg || 0);
    }
  }
  const co2eChartData = Object.entries(co2eTrend)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([period, vals]) => ({
      period,
      co2eKg: Math.round(vals.co2eKg),
      productionKg: Math.round(vals.productionKg),
    }));

  return {
    kpis: {
      factoriesCount,
      openRfqs,
      totalContractValue,
      committedVolume,
    },
    maturityAverages,
    co2eChartData,
  };
});
