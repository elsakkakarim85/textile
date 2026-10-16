"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { tr } from '@/lib/i18n-inline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';

export function ConsortiumMemberControls({
  consortiumId,
  currentStatus,
  factories,
  locale,
}: {
  consortiumId: string;
  currentStatus: string;
  factories: { id: string; name: string; capabilities: string[] }[];
  locale: string;
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [factoryId, setFactoryId] = useState(factories[0]?.id || '');
  const [role, setRole] = useState('Spinning & Yarn Supply');
  const [sharePct, setSharePct] = useState('25');
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factoryId) return;
    setLoading(true);
    try {
      await api(`/api/cluster/consortia/${consortiumId}/members`, 'POST', {
        factoryId,
        role,
        sharePct: Number(sharePct),
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setStatus(newStatus);
    setLoading(true);
    try {
      await api(`/api/cluster/consortia/${consortiumId}/members`, 'PATCH', {
        consortiumStatus: newStatus,
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleInvite} className="space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-primary" />
          {t('Add / Invite Partner Factory', 'إضافة / دعوة مصنع شريك للتحالف')}
        </h4>
        <div>
          <label className="block text-xs mb-1">{t('Select Cluster Factory', 'اختر المصنع الشريك')}</label>
          <select
            value={factoryId}
            onChange={(e) => setFactoryId(e.target.value)}
            className="w-full h-9 rounded-md border bg-background px-2.5 text-sm"
          >
            {factories.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} {f.capabilities?.length ? `(${f.capabilities.join(', ')})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">{t('Value-Chain Role', 'الدور في سلسلة القيمة')}</label>
          <Input
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Dyeing & Finishing, Cut & Sew"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">{t('Work / Revenue Share (%)', 'حصة العمل / العائد (%)')}</label>
          <Input
            type="number"
            min="1"
            max="100"
            required
            value={sharePct}
            onChange={(e) => setSharePct(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm" className="w-full" disabled={loading}>
          {loading ? t('Adding...', 'جاري الإضافة...') : t('Add Partner to Consortium', 'إضافة الشريك للتحالف')}
        </Button>
      </form>

      <div className="pt-4 border-t space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t('Consortium Lifecycle Status', 'حالة التحالف التصديري')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['FORMING', 'BIDDING', 'ACTIVE', 'CLOSED'].map((st) => (
            <button
              key={st}
              type="button"
              disabled={loading}
              onClick={() => handleStatusUpdate(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                status === st
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
