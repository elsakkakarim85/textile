import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { route } from '@/server/http';
import { generate, sanitizeMessages } from '@/server/ai';

export const maxDuration = 30;

export const POST = route(async (req) => {
  await requireAdmin();
  const body = await req.json().catch(() => ({}));
  const messages = sanitizeMessages(body?.messages);

  const [totalUsers, byStatus, openRfqs, activeContracts, settings, logs] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.factory.groupBy({ by: ['status'], _count: true }),
    prisma.rFQ.count({ where: { status: 'OPEN' } }),
    prisma.contract.count({ where: { status: { in: ['ACTIVE', 'IN_PRODUCTION', 'QC', 'SHIPPED'] } } }),
    prisma.systemSetting.findMany(),
    prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
  ]);

  const system = `You are the Super-Admin assistant for the Mahalla Cluster B2B textile platform.
Answer only from the live data below; if something is not in the data, say so. Reply in the user's language
(professional Egyptian Arabic if they write Arabic). Use Markdown headings, tables and bullet points.

LIVE PLATFORM DATA:
- Registered users: ${totalUsers}
- Factories by status: ${byStatus.map((b) => `${b.status}=${b._count}`).join(', ') || 'none'}
- Open RFQs: ${openRfqs}
- Active contracts: ${activeContracts}
- Settings: ${settings.map((s) => `${s.key}=${s.value}`).join(', ') || 'none'}
- Last admin actions: ${logs.map((l) => `${l.action} on ${l.entity} (${l.createdAt.toISOString().slice(0, 10)})`).join('; ') || 'none'}`;

  const { text } = await generate({ system, messages });
  return { text };
});
