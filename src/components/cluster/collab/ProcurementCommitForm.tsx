"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tr } from '@/lib/i18n-inline';

export function ProcurementCommitForm({ pool, myCommitment, locale }: { pool: any, myCommitment?: any, locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  
  const [qty, setQty] = useState(myCommitment?.quantity?.toString() || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api(`/api/cluster/procurement/${pool.id}/commit`, 'POST', { quantity: Number(qty) });
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!confirm(t('Are you sure you want to withdraw?', 'هل أنت متأكد من سحب التزامك؟'))) return;
    setLoading(true);
    try {
      await api(`/api/cluster/procurement/${pool.id}/commit`, 'DELETE');
      setQty('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (pool.status !== 'OPEN') {
    return (
      <div className="p-4 rounded border bg-muted/30 text-center text-sm text-muted-foreground">
        {t('This pool is closed for new commitments.', 'هذا التجمع مغلق للمشاركات الجديدة.')}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('Commit Quantity', 'كمية الالتزام')} ({pool.uom})
        </label>
        <Input 
          type="number" 
          required 
          min={pool.minCommitQty} 
          step="any"
          value={qty} 
          onChange={e => setQty(e.target.value)} 
          placeholder={`${t('Min:', 'الحد الأدنى:')} ${pool.minCommitQty}`}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? t('Saving...', 'جاري الحفظ...') : myCommitment ? t('Update Commitment', 'تحديث الالتزام') : t('Commit to Buy', 'تأكيد الشراء')}
        </Button>
        {myCommitment && (
          <Button type="button" variant="outline" onClick={handleWithdraw} disabled={loading} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            {t('Withdraw', 'سحب')}
          </Button>
        )}
      </div>
    </form>
  );
}
