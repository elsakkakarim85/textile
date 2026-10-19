"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tr } from '@/lib/i18n-inline';
import { Sparkles } from 'lucide-react';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';

export function FundingApplyForm({ programId, hasApplied, locale }: { programId: string, hasApplied: boolean, locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  if (hasApplied) {
    return (
      <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm font-medium text-center border border-emerald-200">
        {t('Application Submitted ✓', 'تم تقديم الطلب ✓')}
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button className="w-full" onClick={() => setIsOpen(true)}>
        {t('Apply Now', 'قدم الآن')}
      </Button>
    );
  }

  const handleAiDraftJustification = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'funding_application',
          context: { programId, amount },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields) {
        if (data.fields.amountRequested && !amount) {
          setAmount(String(data.fields.amountRequested));
        }
        if (data.fields.purpose) {
          setPurpose(data.fields.purpose);
        }
      }
    } catch {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api(`/api/cluster/funding/${programId}/apply`, 'POST', {
        amountRequested: amount ? Number(amount) : undefined,
        purpose
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4 pt-4 border-t">
      <div>
        <label className="block text-xs font-medium mb-1">{t('Amount Requested', 'المبلغ المطلوب')} (EGP/USD)</label>
        <Input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder={t('Optional', 'اختياري')} className="h-8 text-sm" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-medium">{t('Purpose / Justification', 'الغرض / المبرر')}</label>
          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAiDraftJustification}
              disabled={aiLoading}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              {aiLoading
                ? t('AI Writing...', 'جاري الصياغة...')
                : t('✨ AI Write Bankable Justification', '✨ صياغة دراسة جدوى بالذكاء الاصطناعي')}
            </button>
            <ExpertManualButton manualId="collab-ai-smart-fill" locale={locale} variant="mini" />
          </div>
        </div>
        <textarea 
          required 
          className="flex min-h-[85px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={purpose} 
          onChange={e => setPurpose(e.target.value)} 
          placeholder={t('Briefly explain how you will use the funds...', 'اشرح باختصار كيف ستستخدم الأموال...')}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setIsOpen(false)} disabled={loading}>
          {t('Cancel', 'إلغاء')}
        </Button>
        <Button type="submit" size="sm" className="flex-1" disabled={loading}>
          {loading ? t('Submitting...', 'جاري التقديم...') : t('Submit', 'تأكيد')}
        </Button>
      </div>
    </form>
  );
}
