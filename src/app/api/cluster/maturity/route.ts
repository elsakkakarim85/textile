import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { route, parseBody, HttpError } from '@/server/http';
import { requireFactory } from '@/server/auth';
import { scoreAssessment, buildRecommendations } from '@/server/modernization/maturity';
import { audit } from '@/server/events';

const answerSchema = z.record(z.number().min(0).max(4));

export const GET = route(async (req) => {
  const { factory } = await requireFactory();
  
  const history = await prisma.maturityAssessment.findMany({
    where: { factoryId: factory.id },
    orderBy: { createdAt: 'desc' },
  });

  return { assessments: history };
});

export const POST = route(async (req) => {
  const { user, factory } = await requireFactory();
  const answers = await parseBody(req, answerSchema);
  
  const result = scoreAssessment(answers);
  const recommendations = buildRecommendations(result.scores as any);

  const assessment = await prisma.maturityAssessment.create({
    data: {
      factoryId: factory.id,
      takenById: user.id,
      answers,
      scores: result.scores,
      overallScore: result.overallScore,
      level: result.level,
      recommendations,
    },
  });

  await audit(user.id, 'MATURITY_ASSESSMENT', 'Factory', factory.id);

  return assessment;
});
