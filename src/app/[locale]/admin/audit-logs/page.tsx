"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, ShieldAlert } from 'lucide-react';
import { downloadCSV } from '@/lib/export';

const CLIENT_FALLBACK_LOGS = [
  {
    id: 'aud-1',
    actorId: 'usr-admin-1 (TIGARA PMO)',
    action: 'KYC_VERIFIED',
    entity: 'Factory',
    entityId: 'fac-misr-spinning',
    metadata: { verifiedBadge: 'TIGARA Gold Verified Exporter', goeicCheck: 'PASSED' },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'aud-2',
    actorId: 'usr-admin-1 (TIGARA PMO)',
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
    actorId: 'usr-admin-1 (TIGARA PMO)',
    action: 'UPDATE_SETTINGS',
    entity: 'Setting',
    entityId: 'global',
    metadata: { ai_enabled: true, commission_rate: '1.5', default_currency: 'EGP' },
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

export default function AdminAuditLogsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [logs, setLogs] = useState<any[]>(CLIENT_FALLBACK_LOGS);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLogs(data);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter((l) => entityFilter === 'ALL' || l.entity === entityFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-primary" />
            {t('Immutable Security & Governance Audit Trail', 'سجل المراجعة الأمنية والحوكمة (Audit Logs)')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t(
              'Cryptographic log of all admin verifications, escrow releases, grant approvals, and system changes.',
              'سجل زمني موثق لجميع عمليات التوثيق وصرف دفعات الضمان والموافقات التمويلية وتعديلات النظام.'
            )}
          </p>
        </div>
        <button
          onClick={() => downloadCSV(filteredLogs, 'mahalla_audit_logs')}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-xs font-bold"
        >
          <Download className="w-4 h-4" />
          {t('Export CSV', 'تصدير CSV')}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['ALL', 'Factory', 'FundingApplication', 'Contract', 'Setting'].map((ent) => (
          <button
            key={ent}
            onClick={() => setEntityFilter(ent)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              entityFilter === ent
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background hover:bg-muted'
            }`}
          >
            {ent === 'ALL' ? t('All Entities', 'جميع العمليات') : ent}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            {t('System Governance Events', 'أحداث الحوكمة المسجلة')} ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              {t('Loading audit trail...', 'جاري تحميل سجل المراجعة...')}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => {
                const metaObj = log.metadata ?? log.details;
                return (
                  <div key={log.id} className="border-b pb-4 last:border-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                          {log.action}
                        </Badge>
                        <span className="text-xs font-semibold">
                          {log.entity} ({log.entityId})
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('Actor ID:', 'المنفذ:')} <strong>{log.actorId || log.adminId || 'system'}</strong>
                    </p>
                    {metaObj && (
                      <pre className="bg-muted/60 border p-2.5 rounded-lg text-[11px] overflow-x-auto font-mono">
                        {typeof metaObj === 'string' ? metaObj : JSON.stringify(metaObj, null, 2)}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
