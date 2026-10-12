import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';
import { computeKPIs } from '@/server/modernization/emissions';

export const revalidate = 300; // Cache for 5 minutes

export const GET = route(async () => {
  // We use Promise.allSettled to ensure one failure doesn't kill the whole dashboard
  const [
    factoriesRes,
    rfqsRes,
    contractsRes,
    procurementRes,
    maturityRes,
    sustainabilityRes
  ] = await Promise.allSettled([
    prisma.factory.count({ where: { status: 'APPROVED' } }),
    prisma.rFQ.count({ where: { status: 'OPEN' } }),
    prisma.contract.aggregate({ _sum: { totalAmount: true }, where: { status: 'ACTIVE' } }),
    prisma.poolCommitment.aggregate({ _sum: { quantity: true }, where: { status: 'COMMITTED' } }),
    prisma.maturityAssessment.findMany({ orderBy: { createdAt: 'desc' }, select: { factoryId: true, scores: true } }),
    prisma.sustainabilityRecord.findMany({ take: 200, orderBy: { period: 'desc' } })
  ]);

  const factoriesCount = factoriesRes.status === 'fulfilled' ? factoriesRes.value : 0;
  const openRfqs = rfqsRes.status === 'fulfilled' ? rfqsRes.value : 0;
  const totalContractValue = contractsRes.status === 'fulfilled' ? contractsRes.value._sum.value?.toNumber() || 0 : 0;
  const committedVolume = procurementRes.status === 'fulfilled' ? procurementRes.value._sum.quantity?.toNumber() || 0 : 0;

  // Process Maturity
  let maturityAverages = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
  if (maturityRes.status === 'fulfilled' && maturityRes.value.length > 0) {
    const latestPerFactory = new Map();
    for (const a of maturityRes.value) {
      if (!latestPerFactory.has(a.factoryId)) latestPerFactory.set(a.factoryId, a.scores);
    }
    const latest = Array.from(latestPerFactory.values());
    const sums = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
    for (const s of latest) {
      const scores = s as Record<string, number>;
      for (const key of Object.keys(sums)) sums[key as keyof typeof sums] += scores[key] || 0;
    }
    for (const key of Object.keys(sums)) {
      maturityAverages[key as keyof typeof maturityAverages] = Math.round(sums[key as keyof typeof sums] / latest.length);
    }
  }

  // Process Sustainability (Total CO2e by period)
  const co2eTrend: Record<string, number> = {};
  if (sustainabilityRes.status === 'fulfilled') {
    for (const r of sustainabilityRes.value) {
      if (!co2eTrend[r.period]) co2eTrend[r.period] = 0;
      co2eTrend[r.period] += r.co2eKg;
    }
  }
  const co2eChartData = Object.entries(co2eTrend)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([period, value]) => ({ period, co2e: Math.round(value) }));

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
