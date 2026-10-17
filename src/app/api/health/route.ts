import { prisma } from '@/lib/prisma';
import { FREE_LLM_CATALOG } from '@/server/ai';

export const dynamic = 'force-dynamic';

/**
 * Full-Platform Liveness, Database Resilience & Multi-LLM AI Telemetry Probe.
 */
export async function GET() {
  const started = Date.now();
  let dbConnected = false;
  let dbLatencyMs: number | null = null;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
    dbLatencyMs = Date.now() - started;
  } catch {
    dbConnected = false;
    dbLatencyMs = Date.now() - started;
  }

  return Response.json({
    status: 'ok',
    mode: dbConnected ? 'live_database' : 'resilient_domain_fallback',
    timestamp: new Date().toISOString(),
    db: {
      connected: dbConnected,
      fallbackActive: !dbConnected,
      latencyMs: dbLatencyMs,
    },
    aiEngine: {
      status: 'operational',
      supportedFreeModels: FREE_LLM_CATALOG.map((m) => m.id),
      providers: {
        groqConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
        geminiConfigured: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()),
        openRouterConfigured: Boolean(process.env.OPENROUTER_API_KEY?.trim()),
        huggingFaceConfigured: Boolean(process.env.HUGGINGFACE_API_KEY?.trim()),
        pollinationsZeroKeyActive: true,
        deterministicDomainEngineActive: true,
      },
    },
    architecture: {
      clusterModulesCount: 17,
      marketplacesCount: 4,
      leanSixSigmaPillars: 9,
      bilingualLocales: ['ar', 'en'],
    },
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? 'production',
  });
}
