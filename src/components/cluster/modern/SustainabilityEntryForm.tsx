"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { tr } from '@/lib/i18n-inline';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SustainabilityEntryForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    period: new Date().toISOString().slice(0, 7), // YYYY-MM
    productionVolumeKg: '',
    electricityKwh: '',
    renewableSharePct: '',
    naturalGasM3: '',
    waterM3: '',
    wasteTotalKg: '',
    wasteRecycledKg: '',
    certZdhc: false,
    certOekoTex: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        period: formData.period,
        productionVolumeKg: Number(formData.productionVolumeKg),
        electricityKwh: formData.electricityKwh ? Number(formData.electricityKwh) : undefined,
        renewableSharePct: formData.renewableSharePct ? Number(formData.renewableSharePct) : undefined,
        naturalGasM3: formData.naturalGasM3 ? Number(formData.naturalGasM3) : undefined,
        waterM3: formData.waterM3 ? Number(formData.waterM3) : undefined,
        wasteTotalKg: formData.wasteTotalKg ? Number(formData.wasteTotalKg) : undefined,
        wasteRecycledKg: formData.wasteRecycledKg ? Number(formData.wasteRecycledKg) : undefined,
        certZdhc: formData.certZdhc,
        certOekoTex: formData.certOekoTex,
      };

      await api('/api/cluster/sustainability', 'POST', payload);
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
        {t('Add Monthly Record', 'إضافة سجل شهري')}
      </Button>
    );
  }

  return (
    <Card className="p-6 mb-8 border-primary/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{t('New Monthly Record', 'سجل شهري جديد')}</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>{t('Cancel', 'إلغاء')}</Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">{t('Period (YYYY-MM)', 'الفترة (سنة-شهر)')}</label>
            <Input type="month" required value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Production Volume (kg)', 'حجم الإنتاج (كجم)')}</label>
            <Input type="number" min="0" required value={formData.productionVolumeKg} onChange={e => setFormData({...formData, productionVolumeKg: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Electricity (kWh)', 'الكهرباء (كيلوواط ساعة)')}</label>
            <Input type="number" min="0" value={formData.electricityKwh} onChange={e => setFormData({...formData, electricityKwh: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Renewable Share (%)', 'نسبة الطاقة المتجددة (%)')}</label>
            <Input type="number" min="0" max="100" value={formData.renewableSharePct} onChange={e => setFormData({...formData, renewableSharePct: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Natural Gas (m3)', 'الغاز الطبيعي (متر مكعب)')}</label>
            <Input type="number" min="0" value={formData.naturalGasM3} onChange={e => setFormData({...formData, naturalGasM3: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Water Consumption (m3)', 'استهلاك المياه (متر مكعب)')}</label>
            <Input type="number" min="0" value={formData.waterM3} onChange={e => setFormData({...formData, waterM3: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Total Solid Waste (kg)', 'إجمالي المخلفات الصلبة (كجم)')}</label>
            <Input type="number" min="0" value={formData.wasteTotalKg} onChange={e => setFormData({...formData, wasteTotalKg: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Recycled Waste (kg)', 'المخلفات المعاد تدويرها (كجم)')}</label>
            <Input type="number" min="0" value={formData.wasteRecycledKg} onChange={e => setFormData({...formData, wasteRecycledKg: e.target.value})} />
          </div>
        </div>

        <div className="flex gap-6 mt-4 pt-4 border-t">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.certZdhc} onChange={e => setFormData({...formData, certZdhc: e.target.checked})} className="rounded text-primary" />
            <span className="text-sm font-medium">ZDHC Compliant</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.certOekoTex} onChange={e => setFormData({...formData, certOekoTex: e.target.checked})} className="rounded text-primary" />
            <span className="text-sm font-medium">OEKO-TEX Certified</span>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading}>{loading ? t('Saving...', 'جاري الحفظ...') : t('Save Record', 'حفظ السجل')}</Button>
        </div>
      </form>
    </Card>
  );
}
