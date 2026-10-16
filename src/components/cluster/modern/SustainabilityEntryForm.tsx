"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { tr } from '@/lib/i18n-inline';
import { Plus, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SustainabilityEntryForm({
  locale,
  records = [],
}: {
  locale: string;
  records?: any[];
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    period: new Date().toISOString().slice(0, 7),
    productionKg: '52000',
    electricityKwh: '115000',
    solarKwh: '18000',
    naturalGasM3: '4200',
    waterM3: '1850',
    recycledWaterM3: '450',
    wasteKg: '1400',
    recycledWasteKg: '680',
    notes: 'ZDHC Level 2 & OEKO-TEX Standard 100 Verified',
  });

  const handleExportCsv = () => {
    const header = [
      'Period',
      'Production_kg',
      'Electricity_kWh',
      'Solar_kWh',
      'NaturalGas_m3',
      'Water_m3',
      'RecycledWater_m3',
      'Waste_kg',
      'RecycledWaste_kg',
      'CO2e_kg',
    ];
    const rows = (records || []).map((r: any) => {
      const p = typeof r.period === 'string' ? r.period.slice(0, 7) : new Date(r.period).toISOString().slice(0, 7);
      return [
        p,
        Number(r.productionKg ?? r.productionVolumeKg ?? 0),
        Number(r.electricityKwh ?? 0),
        Number(r.solarKwh ?? 0),
        Number(r.naturalGasM3 ?? 0),
        Number(r.waterM3 ?? 0),
        Number(r.recycledWaterM3 ?? 0),
        Number(r.wasteKg ?? r.wasteTotalKg ?? 0),
        Number(r.recycledWasteKg ?? r.wasteRecycledKg ?? 0),
        Number(r.co2eKg ?? 0),
      ].join(',');
    });
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahalla-esg-cbam-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        period: formData.period,
        productionKg: Number(formData.productionKg),
        electricityKwh: formData.electricityKwh ? Number(formData.electricityKwh) : 0,
        solarKwh: formData.solarKwh ? Number(formData.solarKwh) : 0,
        naturalGasM3: formData.naturalGasM3 ? Number(formData.naturalGasM3) : 0,
        waterM3: formData.waterM3 ? Number(formData.waterM3) : 0,
        recycledWaterM3: formData.recycledWaterM3 ? Number(formData.recycledWaterM3) : 0,
        wasteKg: formData.wasteKg ? Number(formData.wasteKg) : 0,
        recycledWasteKg: formData.recycledWasteKg ? Number(formData.recycledWasteKg) : 0,
        notes: formData.notes,
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
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 me-2" />
          {t('Log Monthly ESG & CBAM Data', 'تسجيل بيانات الاستدامة والانبعاثات الشهرية')}
        </Button>
        {records.length > 0 && (
          <Button variant="outline" onClick={handleExportCsv}>
            <Download className="w-4 h-4 me-2" />
            {t('Export EU CBAM CSV Report', 'تصدير تقرير CBAM الأوروبي (CSV)')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="p-6 mb-8 border-primary/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{t('Log Monthly ESG & Resource Record', 'تسجيل بيانات الموارد والانبعاثات الشهرية')}</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          {t('Cancel', 'إلغاء')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">{t('Period (YYYY-MM)', 'الفترة (سنة-شهر)')}</label>
            <Input
              type="month"
              required
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Production Output (kg)', 'إجمالي الإنتاج (كجم)')}</label>
            <Input
              type="number"
              min="1"
              required
              value={formData.productionKg}
              onChange={(e) => setFormData({ ...formData, productionKg: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Grid Electricity (kWh)', 'كهرباء الشبكة (كيلوواط ساعة)')}</label>
            <Input
              type="number"
              min="0"
              value={formData.electricityKwh}
              onChange={(e) => setFormData({ ...formData, electricityKwh: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Solar / Renewable (kWh)', 'الطاقة الشمسية المتجددة (كيلوواط ساعة)')}</label>
            <Input
              type="number"
              min="0"
              value={formData.solarKwh}
              onChange={(e) => setFormData({ ...formData, solarKwh: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Natural Gas (m³)', 'الغاز الطبيعي (م³)')}</label>
            <Input
              type="number"
              min="0"
              value={formData.naturalGasM3}
              onChange={(e) => setFormData({ ...formData, naturalGasM3: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Total Water Intake (m³)', 'سحب المياه الإجمالي (م³)')}</label>
            <Input
              type="number"
              min="0"
              value={formData.waterM3}
              onChange={(e) => setFormData({ ...formData, waterM3: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Recycled Water (ZLD) (m³)', 'المياه المعاد تدويرها (م³)')}</label>
            <Input
              type="number"
              min="0"
              value={formData.recycledWaterM3}
              onChange={(e) => setFormData({ ...formData, recycledWaterM3: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Total Solid Waste (kg)', 'إجمالي المخلفات الصلبة (كجم)')}</label>
            <Input
              type="number"
              min="0"
              value={formData.wasteKg}
              onChange={(e) => setFormData({ ...formData, wasteKg: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('Recycled Cotton/Textile Waste (kg)', 'العوادم المعاد تدويرها (كجم)')}</label>
            <Input
              type="number"
              min="0"
              value={formData.recycledWasteKg}
              onChange={(e) => setFormData({ ...formData, recycledWasteKg: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">{t('Certifications & Audit Notes', 'الشهادات وملاحظات التدقيق البيئي')}</label>
          <Input
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. ZDHC MRSL Level 3, OEKO-TEX Standard 100, ISO 14001"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? t('Calculating CO2e & Saving...', 'جاري حساب البصمة الكربونية والحفظ...') : t('Save & Compute CO2e', 'حفظ وحساب الانبعاثات')}
          </Button>
        </div>
      </form>
    </Card>
  );
}
