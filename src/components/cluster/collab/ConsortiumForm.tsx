"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tr } from '@/lib/i18n-inline';
import { Plus, Sparkles, Cpu } from 'lucide-react';

export function ConsortiumForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModelBadge, setAiModelBadge] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetMarket: '',
    leadRole: '',
  });

  const handleAiAutoFill = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'consortium',
          context: { hint: formData.name || formData.targetMarket },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields) {
        setFormData((prev) => ({
          ...prev,
          name: data.fields.name || prev.name,
          description: data.fields.description || prev.description,
          targetMarket: data.fields.targetMarket || prev.targetMarket,
          leadRole: data.fields.leadRole || prev.leadRole,
        }));
        setAiModelBadge(data.modelUsed || 'Free LLM');
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
      await api('/api/cluster/consortia', 'POST', formData);
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 me-2" />
        {t('Form a Consortium', 'تشكيل تحالف')}
      </Button>
    );
  }

  return (
    <Card className="p-6 mb-8 border-primary/20 bg-card">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{t('New Consortium', 'تحالف جديد')}</h3>
          {aiModelBadge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <Cpu className="w-3 h-3" /> {aiModelBadge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleAiAutoFill}
            disabled={aiLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {aiLoading
              ? t('AI Generating JV Plan...', 'جاري توليد خطة التحالف بالذكاء الاصطناعي...')
              : t('✨ AI Generate Export JV Charter', '✨ توليد ميثاق التحالف التصديري بالذكاء الاصطناعي')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>{t('Cancel', 'إلغاء')}</Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">{t('Consortium Name', 'اسم التحالف')}</label>
            <Input required minLength={5} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">{t('Description & Goals', 'الوصف والأهداف')}</label>
            <textarea 
              required
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Target Market (e.g. EU Export)', 'السوق المستهدف')}</label>
            <Input value={formData.targetMarket} onChange={e => setFormData({...formData, targetMarket: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Your Role (Lead)', 'دورك (القائد)')}</label>
            <Input required placeholder={t('e.g. Final Assembly & QA', 'مثال: التجميع النهائي والجودة')} value={formData.leadRole} onChange={e => setFormData({...formData, leadRole: e.target.value})} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={loading}>{loading ? t('Creating...', 'جاري الإنشاء...') : t('Create', 'إنشاء')}</Button>
        </div>
      </form>
    </Card>
  );
}
