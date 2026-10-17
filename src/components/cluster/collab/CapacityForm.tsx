"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tr } from '@/lib/i18n-inline';
import { Plus, Sparkles, Cpu } from 'lucide-react';

const PROCESSES = [
  'spinning', 'weaving', 'knitting', 'dyeing', 'printing', 
  'finishing', 'sewing', 'embroidery', 'cutting', 'washing', 'testing'
];

export function CapacityForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModelBadge, setAiModelBadge] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    kind: 'OFFER',
    process: 'spinning',
    title: '',
    description: '',
    availableFrom: '',
    availableUntil: '',
    quantity: '',
    uom: 'kg',
  });

  const handleAiAutoFill = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'capacity_post',
          context: {
            kind: formData.kind,
            process: formData.process,
            hint: formData.title,
          },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields) {
        setFormData((prev) => ({
          ...prev,
          title: data.fields.title || prev.title,
          description: data.fields.description || prev.description,
          availableFrom: data.fields.availableFrom || prev.availableFrom,
          availableUntil: data.fields.availableUntil || prev.availableUntil,
          quantity: String(data.fields.quantity || prev.quantity),
          uom: data.fields.uom || prev.uom,
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
      await api('/api/cluster/capacity', 'POST', {
        ...formData,
        quantity: formData.quantity ? Number(formData.quantity) : undefined,
        availableFrom: new Date(formData.availableFrom).toISOString(),
        availableUntil: new Date(formData.availableUntil).toISOString(),
      });
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
        {t('Post Capacity', 'إضافة طلب/عرض طاقة')}
      </Button>
    );
  }

  return (
    <Card className="p-6 mb-8 border-primary/20 bg-card">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{t('New Capacity Post', 'إضافة عرض/طلب طاقة إنتاجية جديد')}</h3>
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
              ? t('AI Drafting SLA...', 'جاري صياغة المواصفات بالذكاء الاصطناعي...')
              : t('✨ AI Auto-Draft Spec & SLA', '✨ صياغة تلقائية للمواصفات بالذكاء الاصطناعي')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>{t('Cancel', 'إلغاء')}</Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">{t('Type', 'النوع')}</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.kind} 
              onChange={e => setFormData({...formData, kind: e.target.value})}
            >
              <option value="OFFER">{t('Offer (I have idle capacity)', 'عرض (لدي طاقة عاطلة)')}</option>
              <option value="REQUEST">{t('Request (I need subcontracting)', 'طلب (أحتاج تشغيل لدى الغير)')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Process', 'العملية الإنتاجية')}</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.process} 
              onChange={e => setFormData({...formData, process: e.target.value})}
            >
              {PROCESSES.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">{t('Title', 'العنوان')}</label>
            <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">{t('Description', 'الوصف')}</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Available From', 'متاح من')}</label>
            <Input type="date" required value={formData.availableFrom} onChange={e => setFormData({...formData, availableFrom: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Available Until', 'متاح إلى')}</label>
            <Input type="date" required value={formData.availableUntil} onChange={e => setFormData({...formData, availableUntil: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Quantity (optional)', 'الكمية (اختياري)')}</label>
            <Input type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Unit (e.g. kg, pieces)', 'الوحدة')}</label>
            <Input value={formData.uom} onChange={e => setFormData({...formData, uom: e.target.value})} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={loading}>{loading ? t('Posting...', 'جاري النشر...') : t('Post Capacity', 'نشر')}</Button>
        </div>
      </form>
    </Card>
  );
}
