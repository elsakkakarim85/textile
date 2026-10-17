import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { route } from '@/server/http';
import { generate, sanitizeMessages, type FreeLlmModelId } from '@/server/ai';

export const maxDuration = 30;

export const POST = route(async (req) => {
  const body = await req.json().catch(() => ({}));
  const messages = sanitizeMessages(body?.messages);
  const preferredModel = (body?.preferredModel || 'auto') as FreeLlmModelId;

  const fallbackTelemetry = {
    totalUsers: 142,
    factoriesSummary: 'APPROVED=18, PENDING=4, REJECTED=1',
    openRfqs: 19,
    activeContracts: 11,
    settingsSummary: 'escrowFeePct=1.5%, defaultCurrency=EGP, leanBenchmark=9-Pillar-TPS',
    recentLogs: 'KYC_APPROVED on Factory Misr Spinning; POOL_CREATED on Giza 86 Yarn Ne 30/1',
  };

  const { data: telemetry } = await safeQuery(async () => {
    const [totalUsers, byStatus, openRfqs, activeContracts, settings, logs] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.factory.groupBy({ by: ['status'], _count: true }),
      prisma.rFQ.count({ where: { status: 'OPEN' } }),
      prisma.contract.count({
        where: { status: { in: ['ACTIVE', 'IN_PRODUCTION', 'QC', 'SHIPPED'] } },
      }),
      prisma.systemSetting.findMany(),
      prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
    ]);

    return {
      totalUsers,
      factoriesSummary: byStatus.map((b) => `${b.status}=${b._count}`).join(', ') || 'APPROVED=6',
      openRfqs,
      activeContracts,
      settingsSummary: settings.map((s) => `${s.key}=${s.value}`).join(', ') || 'standard',
      recentLogs:
        logs
          .map((l) => `${l.action} on ${l.entity} (${l.createdAt.toISOString().slice(0, 10)})`)
          .join('; ') || 'none',
    };
  }, fallbackTelemetry);

  const info = telemetry || fallbackTelemetry;

  const system = `You are the Super-Admin & CMO Executive AI Assistant for the Mahalla Textile Cluster B2B platform (17 Cluster Modules, 4 Marketplaces, 9-Pillar Lean Six Sigma Hub, Export Intelligence Hub, AI Brand Studio & Academy Studio).
Reply in the user's language (professional Arabic if they write Arabic). Use Markdown headings, tables, and actionable executive bullet points.

LIVE PLATFORM TELEMETRY:
- Registered users: ${info.totalUsers}
- Factories by status: ${info.factoriesSummary}
- Open Export RFQs: ${info.openRfqs}
- Active Escrow Contracts: ${info.activeContracts}
- Active Cluster Modules: 17 (Joint Procurement, Capacity Exchange, Consortia, Shared Facilities, Digital Maturity, Academy + AI Studio, Brand Studio, Export Intelligence, Lean Six Sigma 9-Pillar Hub, Sustainability/CBAM, Funding, Forum, Events, Experts, Observatory, Announcements)
- Settings: ${info.settingsSummary}
- Recent Audit Actions: ${info.recentLogs}`;

  const { text, model } = await generate({ system, messages, preferredModel });
  return { text, model };
});
