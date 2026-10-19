'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Globe2,
  Sparkles,
  TrendingUp,
  Briefcase,
  Building2,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';

export function InstantExportIntelligenceBar({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);
  const router = useRouter();

  const [product, setProduct] = useState('');
  const [country, setCountry] = useState('');

  const quickCorridors = [
    {
      labelEn: '🇩🇪 Giza 86 Hotel Bedding → Germany',
      labelAr: '🇩🇪 مفروشات فنادق جيزة ٨٦ ← ألمانيا',
      product: 'Egyptian Giza 86 Combed Cotton Sateen Bed Linen & 600 GSM Hotel Terry Towels (HS 6302)',
      country: 'Germany',
    },
    {
      labelEn: '🇸🇦 Hospitality & Medical Scrubs → Saudi Arabia',
      labelAr: '🇸🇦 مفروشات فنادق وزي طبي ← السعودية (SABER)',
      product: '5-Star Hospitality Bedding, Banquet Linens & Antimicrobial Medical Scrubs (HS 6302 / 6211)',
      country: 'Saudi Arabia',
    },
    {
      labelEn: '🇺🇸 Denim & Knit Apparel → USA (QIZ 0% Duty)',
      labelAr: '🇺🇸 ملابس دنيم وتريكو ← أمريكا (الكويز 0% جمارك)',
      product: 'Recycled & Egyptian Cotton Denim Jeans, Interlock T-Shirts & Activewear (HS 6203 / 6109)',
      country: 'United States',
    },
    {
      labelEn: '🇮🇹 Compact Combed Yarn Ne 60/1 → Italy',
      labelAr: '🇮🇹 غزول قطن جيزة كومباكت Ne 60/1 ← إيطاليا',
      product: '100% Egyptian Combed Compact Ring-Spun Cotton Yarn Ne 40/1 to Ne 80/1 (HS 5205)',
      country: 'Italy',
    },
    {
      labelEn: '🇬🇧 Flame-Retardant Workwear → United Kingdom',
      labelAr: '🇬🇧 أقمشة وقاية صناعية مقاومة للحريق ← بريطانيا',
      product: 'EN ISO 11612 Modacrylic/Cotton Flame-Retardant Industrial Workwear & Technical Twill (HS 6211)',
      country: 'United Kingdom',
    },
  ];

  const launchExportHub = (
    overrideProduct?: string,
    overrideCountry?: string,
    tab?: string
  ) => {
    const finalProduct =
      (overrideProduct ?? product).trim() || quickCorridors[0].product;
    const finalCountry =
      (overrideCountry ?? country).trim() || quickCorridors[0].country;
    const qs = new URLSearchParams();
    qs.set('product', finalProduct);
    qs.set('country', finalCountry);
    if (tab) qs.set('tab', tab);
    router.push(`/${locale}/cluster/export-intelligence?${qs.toString()}`);
  };

  return (
    <Card className="p-6 border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-background to-sky-500/10 shadow-md space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-1 text-xs font-extrabold text-teal-700 dark:text-teal-300">
              <Globe2 className="w-3.5 h-3.5" />
              {t(
                'AI GLOBAL EXPORT INTELLIGENCE • MARKET ENTRY • TRUSTED BUYERS • NTM STANDARDS',
                'ذكاء التصدير العالمي • استراتيجيات دخول الأسواق • المشترون الموثوقون • المواصفات والعوائق غير الجمركية'
              )}
            </div>
            <ExpertManualButton manualId="export-intelligence" locale={locale} variant="mini" />
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold">
            {t(
              'Generate Market Studies, Entry Strategies, Live Tenders, Buyer Outreach & Country NTMs for Any Country',
              'ولّد دراسة سوق، استراتيجية دخول، مناقصات دولية، قوائم مشترين موثوقين وتحليل مواصفات NTM لأي دولة'
            )}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
          <button
            type="button"
            onClick={() => launchExportHub(undefined, undefined, 'MARKET_STUDY')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border hover:border-teal-500 transition cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            {t('Market Study & FTAs', 'دراسة السوق والاتفاقيات')}
          </button>
          <button
            type="button"
            onClick={() => launchExportHub(undefined, undefined, 'TENDERS')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border hover:border-teal-500 transition cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-sky-600" />
            {t('Live Tenders & RFQs', 'المناقصات الدولية')}
          </button>
          <button
            type="button"
            onClick={() => launchExportHub(undefined, undefined, 'BUYERS')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border hover:border-teal-500 transition cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            {t('Trusted Buyers & Outreach', 'كشاف المشترين والتواصل')}
          </button>
          <button
            type="button"
            onClick={() => launchExportHub(undefined, undefined, 'NTM_STANDARDS')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border hover:border-teal-500 transition cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            {t('Country NTMs & Standards', 'المواصفات والعوائق NTM')}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-3">
        <div className="md:col-span-5">
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && launchExportHub()}
            placeholder={t(
              'Enter any product or HS code (e.g., Giza 86 Bed Linen, Organic Baby Knits, HS 6302)...',
              'أدخل أي منتج نسجي أو بند جمركي (مثال: مفروشات جيزة ٨٦، ملابس أطفال، غزل ممشط)...'
            )}
            className="w-full h-11 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="md:col-span-4">
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && launchExportHub()}
            placeholder={t(
              'Any destination country (Germany, Saudi Arabia, USA, UK, Japan, Kenya...)',
              'أي دولة مستهدفة (ألمانيا، السعودية، أمريكا، بريطانيا، اليابان، كينيا...)'
            )}
            className="w-full h-11 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="md:col-span-3">
          <Button
            onClick={() => launchExportHub()}
            className="w-full h-11 rounded-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {t('Analyze Market & Buyers', 'تحليل السوق والمشترين')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-muted-foreground">
          {t('1-Click Trade Corridors:', 'مسارات تصديرية جاهزة بضغطة واحدة:')}
        </span>
        {quickCorridors.map((c, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => launchExportHub(c.product, c.country)}
            className="text-xs font-semibold px-3 py-1 rounded-full border bg-background hover:border-teal-500 hover:bg-teal-500/10 transition-colors cursor-pointer"
          >
            {isAr ? c.labelAr : c.labelEn}
          </button>
        ))}
      </div>
    </Card>
  );
}

export default InstantExportIntelligenceBar;
