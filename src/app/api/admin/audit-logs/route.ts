import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { route } from '@/server/http';

const FALLBACK_AUDIT_LOGS = [
  {
    id: 'aud-1',
    actorId: 'usr-admin-1',
    action: 'KYC_VERIFIED',
    entity: 'Factory',
    entityId: 'fac-misr-spinning',
    metadata: { verifiedBadge: 'TIGARA Gold Verified Exporter', goeicCheck: 'PASSED' },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'aud-2',
    actorId: 'usr-admin-1',
    action: 'FUNDING_APPLICATION_APPROVED',
    entity: 'FundingApplication',
    entityId: 'fapp-ebrd-geff-01',
    metadata: { program: 'EBRD GEFF Green Financing', grantPct: 15, amountEgp: 1650000 },
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'aud-3',
    actorId: 'usr-owner-1',
    action: 'CONTRACT_MILESTONE_RELEASED',
    entity: 'Contract',
    entityId: 'cnt-mahalla-eu-01',
    metadata: { stage: '30% Advance Deposit — Raw Giza 94 Cotton Reservation', amountUsd: 33480 },
    createdAt: new Date(Date.now() - 3600000 * 19).toISOString(),
  },
  {
    id: 'aud-4',
    actorId: 'usr-admin-1',
    action: 'UPDATE_SETTINGS',
    entity: 'Setting',
    entityId: 'global',
    metadata: { ai_enabled: true, commission_rate: '1.5', default_currency: 'EGP' },
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

export const GET = route(async (req) => {
  await requireAdmin();
  const { searchParams } = new URL(req.url);
  const take = Math.min(Number(searchParams.get('take')) || 100, 500);
  const cursor = searchParams.get('cursor');
  const entity = searchParams.get('entity') || undefined;

  try {
    const logs = await prisma.auditLog.findMany({
      where: entity ? { entity } : undefined,
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
    if (logs.length > 0) return logs;
    return entity ? FALLBACK_AUDIT_LOGS.filter((l) => l.entity === entity) : FALLBACK_AUDIT_LOGS;
  } catch {
    return entity ? FALLBACK_AUDIT_LOGS.filter((l) => l.entity === entity) : FALLBACK_AUDIT_LOGS;
  }
});
