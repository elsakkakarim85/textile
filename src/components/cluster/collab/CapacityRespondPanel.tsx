"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { tr, fmtMoney, fmtNumber } from '@/lib/i18n-inline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquarePlus, Check, X, Building2 } from 'lucide-react';

export function CapacityRespondPanel({
  post,
  locale,
}: {
  post: any;
  locale: string;
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(String(post.quantity || 1000));
  const [unitPrice, setUnitPrice] = useState(post.unitPrice ? String(post.unitPrice) : '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api(`/api/cluster/capacity/${post.id}/respond`, 'POST', {
        quantity: quantity ? Number(quantity) : undefined,
        unitPrice: unitPrice ? Number(unitPrice) : undefined,
        message,
      });
      setOpen(false);
      setMessage('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (responseId: string, status: 'ACCEPTED' | 'DECLINED') => {
    setLoading(true);
    try {
      await api(`/api/cluster/capacity/${post.id}/respond`, 'PATCH', {
        responseId,
        status,
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const responses = post.responses || [];

  return (
    <div className="pt-4 border-t space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {post._count?.responses ?? responses.length} {t('responses received', 'عروض مستلمة')}
        </span>
        {post.status === 'OPEN' && (
          <Button variant={open ? 'secondary' : 'outline'} size="sm" onClick={() => setOpen((o) => !o)}>
            <MessageSquarePlus className="w-4 h-4 me-1.5" />
            {open ? t('Cancel', 'إلغاء') : t('Send Offer / Respond', 'إرسال عرض / رد')}
          </Button>
        )}
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="rounded-lg border bg-muted/30 p-3.5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                {t('Quantity', 'الكمية')} ({post.unit || post.uom || 'units'})
              </label>
              <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                {t('Proposed Unit Price (EGP)', 'سعر الوحدة المقترح (ج.م)')}
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 18.50"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Technical Offer & Lead Time', 'تفاصيل العرض الفني ومدة التنفيذ')}</label>
            <textarea
              required
              rows={2}
              className="w-full rounded-md border bg-background p-2.5 text-xs"
              placeholder={t(
                'Describe your machine specs, quality assurance, and readiness date...',
                'اذكر مواصفات الماكينات وضمان الجودة وتاريخ الجاهزية للبدء...'
              )}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? t('Sending...', 'جاري الإرسال...') : t('Submit Response', 'إرسال العرض')}
            </Button>
          </div>
        </form>
      )}

      {responses.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t('Subcontracting Responses', 'العروض المقدمة')}
          </p>
          {responses.map((r: any) => (
            <div key={r.id} className="rounded-lg border bg-muted/20 p-2.5 text-xs flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  {r.factory?.name || 'Partner Factory'}
                  {r.quantity && (
                    <span className="text-muted-foreground font-normal">
                      • {fmtNumber(locale, r.quantity)} {post.unit || 'units'}
                    </span>
                  )}
                  {r.unitPrice && (
                    <span className="text-emerald-600 font-semibold">
                      • {fmtMoney(locale, Number(r.unitPrice))}/{post.unit || 'unit'}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground">{r.message}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {r.status === 'PENDING' ? (
                  <>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleStatus(r.id, 'ACCEPTED')}
                      className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                      title={t('Accept Offer', 'قبول العرض')}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleStatus(r.id, 'DECLINED')}
                      className="p-1.5 rounded bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                      title={t('Decline Offer', 'رفض العرض')}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      r.status === 'ACCEPTED'
                        ? 'bg-emerald-500/15 text-emerald-700'
                        : 'bg-rose-500/15 text-rose-700'
                    }`}
                  >
                    {r.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
