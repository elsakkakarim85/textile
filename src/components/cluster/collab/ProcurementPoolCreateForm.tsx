"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { tr } from '@/lib/i18n-inline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Settings2, Sparkles, Cpu } from 'lucide-react';

export function ProcurementPoolCreateForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModelBadge, setAiModelBadge] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    specification: '',
    category: 'YARN',
    targetQty: '25000',
    minCommitQty: '1000',
    unit: 'kg',
    benchmarkUnitPrice: '250',
    targetUnitPrice: '215',
    supplierName: '',
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  });

  const handleAiAutoFill = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'procurement_pool',
          context: { category: form.category, hint: form.title },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields) {
        setForm((prev) => ({
          ...prev,
          title: data.fields.title || prev.title,
          description: data.fields.description || prev.description,
          specification: data.fields.specification || prev.specification,
          targetQty: String(data.fields.targetQty || prev.targetQty),
          minCommitQty: String(data.fields.minCommitQty || prev.minCommitQty),
          unit: data.fields.unit || prev.unit,
          benchmarkUnitPrice: String(data.fields.benchmarkUnitPrice || prev.benchmarkUnitPrice),
          targetUnitPrice: String(data.fields.targetUnitPrice || prev.targetUnitPrice),
          supplierName: data.fields.supplierName || prev.supplierName,
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
      await api('/api/cluster/procurement', 'POST', {
        title: form.title,
        description: form.description,
        specification: form.specification || undefined,
        category: form.category,
        targetQty: Number(form.targetQty),
        minCommitQty: Number(form.minCommitQty),
        unit: form.unit,
        benchmarkUnitPrice: form.benchmarkUnitPrice ? Number(form.benchmarkUnitPrice) : undefined,
        targetUnitPrice: form.targetUnitPrice ? Number(form.targetUnitPrice) : undefined,
        supplierName: form.supplierName || undefined,
        deadline: new Date(form.deadline).toISOString(),
      });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 me-2" />
        {t('Launch New Procurement Pool', 'إطلاق مجموعة شراء مشترك جديدة')}
      </Button>
    );
  }

  return (
    <Card className="p-6 mb-8 border-primary/30">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-lg">{t('Launch Joint Procurement Pool', 'إطلاق مجموعة شراء مشترك')}</h3>
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
              ? t('AI Generating Spec & Tier Pricing...', 'جاري توليد المواصفات والأسعار بالذكاء الاصطناعي...')
              : t('✨ Auto-Fill Spec & Pricing with Free AI', '✨ ملء تلقائي للمواصفات والأسعار بالذكاء الاصطناعي')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            {t('Cancel', 'إلغاء')}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium mb-1">{t('Pool Title', 'عنوان المجموعة')}</label>
            <Input
              required
              placeholder={t('e.g. Combed Giza 86 Cotton Yarn Ne 30/1', 'مثال: غزل قطن جيزة 86 ممشط نمرة 30/1')}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Category', 'الفئة')}</label>
            <select
              className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="YARN">{t('Yarn', 'الغزول')}</option>
              <option value="FIBER">{t('Raw Fiber', 'الألياف الخام')}</option>
              <option value="DYES_CHEMICALS">{t('Dyes & Chemicals', 'الأصباغ والكيماويات')}</option>
              <option value="SPARE_PARTS">{t('Loom & Machine Spare Parts', 'قطع غيار الماكينات')}</option>
              <option value="ENERGY">{t('Solar / Energy PPA', 'الطاقة المتجددة')}</option>
              <option value="PACKAGING">{t('Packaging', 'التعبئة والتغليف')}</option>
              <option value="LOGISTICS">{t('Container / Logistics', 'الشحن واللوجستيات')}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Target Volume', 'الكمية المستهدفة')}</label>
            <Input
              type="number"
              min="1"
              required
              value={form.targetQty}
              onChange={(e) => setForm({ ...form, targetQty: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Minimum Factory Commitment', 'الحد الأدنى لالتزام المصنع')}</label>
            <Input
              type="number"
              min="1"
              required
              value={form.minCommitQty}
              onChange={(e) => setForm({ ...form, minCommitQty: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Unit', 'الوحدة')}</label>
            <Input
              required
              placeholder="kg, tons, meters, kWh"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Market Benchmark Price (EGP)', 'سعر السوق الفردي (ج.م)')}</label>
            <Input
              type="number"
              min="0"
              value={form.benchmarkUnitPrice}
              onChange={(e) => setForm({ ...form, benchmarkUnitPrice: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Target Group Price (EGP)', 'سعر الشراء الجماعي المستهدف (ج.م)')}</label>
            <Input
              type="number"
              min="0"
              value={form.targetUnitPrice}
              onChange={(e) => setForm({ ...form, targetUnitPrice: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Closing Deadline', 'موعد الإغلاق')}</label>
            <Input
              type="date"
              required
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">{t('Technical Specification & Terms', 'المواصفات الفنية وشروط التوريد')}</label>
          <textarea
            required
            rows={3}
            className="w-full rounded-md border bg-background p-3 text-sm"
            placeholder={t('Specify yarn count, ISO standard, payment milestones, and delivery schedule...', 'حدد المواصفات الفنية، معايير الجودة، شروط الدفع، والجدول الزمني للتوريد...')}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? t('Creating...', 'جاري الإنشاء...') : t('Publish Pool', 'نشر المجموعة')}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function ProcurementOrganizerControls({
  poolId,
  currentStatus,
  negotiatedUnitPrice,
  supplierName,
  locale,
}: {
  poolId: string;
  currentStatus: string;
  negotiatedUnitPrice?: number | null;
  supplierName?: string | null;
  locale: string;
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [status, setStatus] = useState(currentStatus);
  const [price, setPrice] = useState(negotiatedUnitPrice ? String(negotiatedUnitPrice) : '');
  const [supplier, setSupplier] = useState(supplierName || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api(`/api/cluster/procurement/${poolId}`, 'PATCH', {
        status,
        negotiatedUnitPrice: price ? Number(price) : undefined,
        supplierName: supplier || undefined,
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Settings2 className="w-4 h-4 text-primary" />
        {t('Organizer & Negotiation Controls', 'أدوات المنظم والمفاوضات')}
      </div>
      <div>
        <label className="block text-xs mb-1">{t('Pool Status', 'حالة المجموعة')}</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full h-9 rounded-md border bg-background px-2.5 text-sm"
        >
          <option value="OPEN">OPEN</option>
          <option value="NEGOTIATING">NEGOTIATING</option>
          <option value="ORDERED">ORDERED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>
      <div>
        <label className="block text-xs mb-1">{t('Final Negotiated Unit Price', 'السعر التفاوضي النهائي للوحدة')}</label>
        <Input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 210"
        />
      </div>
      <div>
        <label className="block text-xs mb-1">{t('Selected Supplier', 'المورد المعتمد')}</label>
        <Input
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          placeholder={t('e.g. Misr Spinning / DyStar Egypt', 'مثال: مصر للغزل / داي ستار')}
        />
      </div>
      <Button type="submit" size="sm" variant="secondary" className="w-full" disabled={loading}>
        {loading ? t('Updating...', 'جاري التحديث...') : t('Update Pool & Notify Factories', 'تحديث المجموعة وإشعار المصانع')}
      </Button>
    </form>
  );
}
