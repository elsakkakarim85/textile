import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';

export const GET = route(async () => {
  // Aggregate average scores across all latest factory assessments
  // For a production system with many rows, this could be a raw SQL query using DISTINCT ON (factoryId)
  
  const allAssessments = await prisma.maturityAssessment.findMany({
    orderBy: { createdAt: 'desc' },
    select: { factoryId: true, scores: true },
  });

  // Take only the latest assessment per factory
  const latestPerFactory = new Map();
  for (const a of allAssessments) {
    if (!latestPerFactory.has(a.factoryId)) {
      latestPerFactory.set(a.factoryId, a.scores);
    }
  }

  const latest = Array.from(latestPerFactory.values());
  
  if (latest.length === 0) {
    return {
      clusterAverage: { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 },
      factoryCount: 0
    };
  }

  const sums = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
  for (const s of latest) {
    const scores = s as Record<string, number>;
    for (const key of Object.keys(sums)) {
      sums[key as keyof typeof sums] += scores[key] || 0;
    }
  }

  const averages = {
    digital: Math.round(sums.digital / latest.length),
    production: Math.round(sums.production / latest.length),
    quality: Math.round(sums.quality / latest.length),
    sustainability: Math.round(sums.sustainability / latest.length),
    market: Math.round(sums.market / latest.length),
    people: Math.round(sums.people / latest.length),
  };

  return { clusterAverage: averages, factoryCount: latest.length };
});
