'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from '@/components/cluster/ui';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import {
  Ship,
  Calculator,
  Globe,
  Clock,
  PackageCheck,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function LogisticsCalculatorPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [weight, setWeight] = useState('6500');
  const [cbm, setCbm] = useState('28');
  const [destination, setDestination] = useState('Europe');
  const [incoterm, setIncoterm] = useState<'EXW' | 'FOB' | 'CIF' | 'DDP'>('CIF');
  const [fobInvoiceUsd, setFobInvoiceUsd] = useState('42000');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const containerRecommendation = useMemo(() => {
    const vol = Number(cbm) || 0;
    const wt = Number(weight) || 0;
    if (vol <= 14 && wt <= 4000) {
      return {
        type: 'LCL Consolidated Pallet Load',
        typeAr: 'شحن جزئي مشترك (LCL Pallets)',
        utilizationPct: Math.min(100, Math.round((vol / 15) * 100)),
      };
    }
    if (vol <= 31 && wt <= 18000) {
      return {
        type: "1 × 20' Standard FCL Container (33 CBM)",
        typeAr: 'حاوية ٢٠ قدم قياسية كاملة (٣٣ متر مكعب)',
        utilizationPct: Math.min(100, Math.round((vol / 33) * 100)),
      };
    }
    return {
      type: "1 × 40' High-Cube FCL Container (76 CBM)",
      typeAr: 'حاوية ٤٠ قدم هاي كيوب (٧٦ متر مكعب)',
      utilizationPct: Math.min(100, Math.round((vol / 76) * 100)),
    };
  }, [cbm, weight]);

  const tariffSummary = useMemo(() => {
    const inv = Number(fobInvoiceUsd) || 0;
    const mfnRate = destination === 'USA' ? 0.145 : destination === 'Europe' ? 0.12 : 0.05;
    const agreementName =
      destination === 'Europe'
        ? t('EU–Egypt Euro-Med Association Agreement (EUR.1 = 0% Duty)', 'اتفاقية الشراكة المصرية الأوروبية (شهادة EUR.1 = صفر٪ جمارك)')
        : destination === 'USA'
        ? t('Egypt–USA QIZ Protocol (0% Duty with QIZ Certificate)', 'بروتوكول الكويز المصري الأمريكي (QIZ = صفر٪ جمارك)')
        : destination === 'GCC'
        ? t('GAFTA Pan-Arab Free Trade Area (0% Customs Duty)', 'اتفاقية التجارة الحرة العربية الكبرى GAFTA (صفر٪ جمارك)')
        : t('COMESA / AfCFTA Preferential Tariff (0%–5%)', 'اتفاقية الكوميسا / التجارة الأفريقية الحرة');
    const savedDutyUsd = Math.round(inv * mfnRate);
    return { mfnRatePct: Math.round(mfnRate * 100), agreementName, savedDutyUsd };
  }, [destination, fobInvoiceUsd, locale]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/logistics/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weightKg: Number(weight),
          volumeCbm: Number(cbm),
          destination,
        }),
      });
      const data = await res.json();
      if (res.ok) setResult(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-extrabold text-emerald-600">
          <Ship className="w-4 h-4" />
          {t(
            'INCOTERMS 2020 • CONTAINER LOAD • PREFERENTIAL TARIFF SIMULATOR',
            'حاسبة الشحن الدولي • الحاويات • الإنكوتيرمز ٢٠٢٠ والاعفاءات الجمركية'
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          {t(
            'Global Freight, Container & Landed-Cost Estimator',
            'حاسبة الشحن الدولي وتكلفة الوصول (Landed Cost) من المحلة الكبرى'
          )}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t(
            'Calculate door-to-port and landed shipping costs from El-Mahalla El-Kubra via Alexandria, Damietta, or Sokhna ports with EUR.1 / QIZ / GAFTA duty savings.',
            'احسب تكلفة الشحن من مصانع المحلة الكبرى عبر موانئ الإسكندرية ودمياط والسخنة مع حساب وفر الجمارك باتفاقيات EUR.1 والكويز وتيسير التجارة العربية.'
          )}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* Calculator Form */}
        <Card className="lg:col-span-6 shadow-md">
          <CardHeader className="bg-muted/40 border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="w-5 h-5 text-emerald-600" />
              {t('Shipment & Incoterm Parameters', 'بيانات الشحنة وشروط التسليم (Incoterms)')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">
                    {t('Total Gross Weight (kg)', 'إجمالي الوزن القائم (كجم)')}
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full border bg-background rounded-xl px-3.5 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">
                    {t('Total Volume (CBM m³)', 'إجمالي الحجم (متر مكعب CBM)')}
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    step="0.5"
                    value={cbm}
                    onChange={(e) => setCbm(e.target.value)}
                    className="w-full border bg-background rounded-xl px-3.5 py-2 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold block mb-1">
                    {t('Destination Market / Port', 'وجهة التصدير / الميناء')}
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full border bg-background rounded-xl px-3.5 py-2 text-sm font-bold"
                  >
                    <option value="Europe">
                      {t('Europe (Rotterdam / Genoa / Hamburg)', 'أوروبا (روتردام / جنوة / هامبورج)')}
                    </option>
                    <option value="USA">
                      {t('USA (New York / Savannah)', 'الولايات المتحدة (نيويورك / سافانا)')}
                    </option>
                    <option value="GCC">
                      {t('GCC (Jeddah / Jebel Ali / Dammam)', 'الخليج العربي (جدة / جبل علي / الدمام)')}
                    </option>
                    <option value="Other">
                      {t('Africa & COMESA (Mombasa / Casablanca)', 'أفريقيا والكوميسا (مومباسا / الدار البيضاء)')}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">
                    {t('Incoterm 2020 Rule', 'شرط التسليم Incoterm 2020')}
                  </label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value as any)}
                    className="w-full border bg-background rounded-xl px-3.5 py-2 text-sm font-bold"
                  >
                    <option value="EXW">EXW — Ex Works El-Mahalla Mill</option>
                    <option value="FOB">FOB — Alexandria / Damietta Port</option>
                    <option value="CIF">CIF — Cost, Insurance & Freight</option>
                    <option value="DDP">DDP — Delivered Duty Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">
                  {t('Commercial Invoice Value (USD FOB)', 'قيمة الفاتورة التصديرية بالدولار (USD)')}
                </label>
                <input
                  type="number"
                  min="100"
                  value={fobInvoiceUsd}
                  onChange={(e) => setFobInvoiceUsd(e.target.value)}
                  className="w-full border bg-background rounded-xl px-3.5 py-2 text-sm font-bold"
                />
              </div>

              {/* Container Load Auto-Recommendation */}
              <div className="rounded-xl border bg-muted/30 p-3.5 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-muted-foreground">
                    {t('Recommended Container:', 'الحاوية الموصى بها هندسياً:')}
                  </span>
                  <Pill tone="emerald">{containerRecommendation.utilizationPct}% Fill</Pill>
                </div>
                <div className="font-extrabold text-sm">
                  {locale === 'ar'
                    ? containerRecommendation.typeAr
                    : containerRecommendation.type}
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-xl shadow transition cursor-pointer disabled:opacity-50"
              >
                {loading
                  ? t('Calculating Landed Freight...', 'جارٍ حساب تكلفة الشحن...')
                  : t('Calculate Instant Freight & Tariff Quote', 'احسب تكلفة الشحن والوفر الجمركي فوراً')}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-6 space-y-5">
          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
                <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  {t(`Estimated Freight Cost (${incoterm})`, `إجمالي تكلفة الشحن المقدرة (${incoterm})`)}
                </p>
                <p className="text-4xl md:text-5xl font-black text-emerald-600 mt-1">
                  ${fmtNumber(locale, result.totalUsd)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t(
                    `Origin: ${result.portOfLoading} • Transit: ${result.estimatedTransitTime}`,
                    `ميناء الشحن: ${result.portOfLoading} • مدة الإبحار: ${result.estimatedTransitTime}`
                  )}
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2 font-extrabold text-sm">
                  <PackageCheck className="w-4 h-4 text-emerald-600" />
                  {t('Freight & Origin Handling Breakdown', 'تفاصيل بنود الشحن والتخليص')}
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-muted-foreground">
                      {t('Ocean Freight', 'النولون البحري (Ocean Freight)')}
                    </span>
                    <strong>${result.oceanFreight}</strong>
                  </div>
                  <div className="flex justify-between border-b pb-1.5">
                    <span className="text-muted-foreground">
                      {t('Origin Customs & Nafeza Single-Window', 'التخليص الجمركي ومنصة نافذة')}
                    </span>
                    <strong>${result.customsClearance}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t('Inland Trucking (El-Mahalla → Port)', 'النقل البري (المحلة الكبرى ← الميناء)')}
                    </span>
                    <strong>${result.inlandTrucking}</strong>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-muted/20 p-8 text-center space-y-2">
              <Ship className="w-10 h-10 mx-auto text-muted-foreground opacity-50" />
              <p className="font-bold text-sm">
                {t(
                  'Click "Calculate Instant Freight & Tariff Quote" to view port breakdown',
                  'اضغط على زر الحساب لعرض تفاصيل النولون البحري والنقل البري'
                )}
              </p>
            </div>
          )}

          {/* Preferential Trade Agreement Duty Savings Card */}
          <div className="rounded-2xl border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-extrabold text-sm text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
                {t(
                  'Preferential Trade Agreement Duty Advantage',
                  'ميزة الإعفاء الجمركي للصادرات المصرية'
                )}
              </div>
              <Pill tone="emerald">
                {t('Saves', 'يوفر')} ${fmtNumber(locale, tariffSummary.savedDutyUsd)}
              </Pill>
            </div>
            <p className="text-xs font-semibold">{tariffSummary.agreementName}</p>
            <p className="text-xs text-muted-foreground">
              {t(
                `Standard MFN Tariff (${tariffSummary.mfnRatePct}%) is waived to 0% when accompanied by an authenticated Egyptian Certificate of Origin (EUR.1 / QIZ / GAFTA).`,
                `يتم إعفاء الشحنة من التعريفة الجمركية القياسية (${tariffSummary.mfnRatePct}٪) لتصبح صفر٪ عند إرفاق شهادة المنشأ التفضيلية المعتمدة.`
              )}
            </p>
            <Link
              href={`/${locale}/cluster/export-intelligence`}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 hover:underline pt-1"
            >
              <Globe className="w-3.5 h-3.5" />
              {t(
                'Analyze Full Country NTMs, Standards & Verified Buyers →',
                'تحليل الاشتراطات الفنية الكاملة والمشترين المعتمدين في الدولة المستهدفة ←'
              )}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
