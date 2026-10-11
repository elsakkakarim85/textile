import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** Liveness + DB readiness probe for uptime monitoring. */
export async function GET() {
  const started = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: 'ok', db: 'ok', latencyMs: Date.now() - started, commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null });
  } catch {
    return Response.json({ status: 'degraded', db: 'unreachable' }, { status: 503 });
  }
}
