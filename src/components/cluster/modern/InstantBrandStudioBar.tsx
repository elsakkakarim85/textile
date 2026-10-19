'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Megaphone,
  Sparkles,
  Video,
  Camera,
  FileText,
  Workflow,
  ArrowRight,
} from 'lucide-react';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';

export function InstantBrandStudioBar({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);
  const router = useRouter();

  const [topic, setTopic] = useState('');
  const [brandName, setBrandName] = useState('');

  const quickIdeas = [
    {
      en: 'Luxury Giza 86 Hotel Bedding & Spa Towels',
      ar: 'مفروشات فنادق ومناشف سبا من قطن جيزة ٨٦',
      brand: 'NILE CROWN ATELIER',
    },
    {
      en: 'Zero-Discharge Recycled Denim & Organic Knitwear',
      ar: 'دنيم معاد تدويره وتريكو عضوي للتصدير الأوروبي',
      brand: 'VERDE DELTA STUDIO',
    },
    {
      en: 'Compact Ring-Spun Yarns Ne 60/1 & Flame-Retardant Workwear',
      ar: 'غزول كومباكت رفيعة وأقمشة وقاية صناعية مقاومة للحريق',
      brand: 'MAHALLA VORTEX TECH',
    },
    {
      en: 'Egyptian Flax Linen Resortwear & Modest Fashion',
      ar: 'أزياء الكتان المصري والملابس العصرية الفاخرة',
      brand: 'KHEPRI LINEN CO.',
    },
  ];

  const launchStudio = (overrideTopic?: string, overrideBrand?: string) => {
    const finalTopic = (overrideTopic ?? topic).trim() || quickIdeas[0].en;
    const finalBrand = (overrideBrand ?? brandName).trim();
    const qs = new URLSearchParams();
    qs.set('topic', finalTopic);
    if (finalBrand) qs.set('brand', finalBrand);
    router.push(`/${locale}/cluster/brand-studio?${qs.toString()}`);
  };

  return (
    <Card className="p-6 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-background to-rose-500/10 shadow-md space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-extrabold text-amber-700 dark:text-amber-300">
              <Megaphone className="w-3.5 h-3.5" />
              {t(
                'AI BRAND ARCHITECT • CAMPAIGN AUTOMATION • VIDEO, PHOTO & PRINT STUDIO',
                'مهندس العلامات التجارية • أتمتة التسويق • استوديو الفيديو والصور والمطبوعات'
              )}
            </div>
            <ExpertManualButton manualId="brand-studio" locale={locale} variant="mini" />
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold">
            {t(
              'Create a Complete Brand, Automated Marketing Plan, Promo Video, Brochure, Flyer & Poster',
              'أنشئ علامة تجارية وخطة تسويق مؤتمتة وفيديو إعلاني وبروشور وفلاير وبوستر لأي منتج'
            )}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border">
            <Video className="w-3.5 h-3.5 text-rose-500" />
            {t('30s Video (.WEBM)', 'فيديو ترويجي')}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border">
            <Camera className="w-3.5 h-3.5 text-amber-500" />
            {t('4 Studio Photos', '٤ صور إعلانية')}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border">
            <FileText className="w-3.5 h-3.5 text-primary" />
            {t('Brochure • Flyer • Poster', 'بروشور • فلاير • بوستر')}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border">
            <Workflow className="w-3.5 h-3.5 text-emerald-600" />
            {t('4-Channel Autopilot', 'أتمتة الحملات')}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-3">
        <div className="md:col-span-6">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && launchStudio()}
            placeholder={t(
              'Enter any product, fabric, or brand concept (e.g., Giza 86 Sateen Bedding, Recycled Denim)...',
              'أدخل أي منتج أو قماش أو فكرة علامة تجارية (مثال: مفروشات قطن جيزة، دنيم مستدام)...'
            )}
            className="w-full h-11 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="md:col-span-3">
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && launchStudio()}
            placeholder={t('Brand Name (Optional)', 'اسم العلامة (اختياري)')}
            className="w-full h-11 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="md:col-span-3">
          <Button
            onClick={() => launchStudio()}
            className="w-full h-11 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white shadow-md gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {t('Generate Brand & Assets', 'توليد الهوية والمطبوعات')}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-muted-foreground">
          {t('1-Click Launch:', 'تشغيل فوري بضغطة واحدة:')}
        </span>
        {quickIdeas.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => launchStudio(isAr ? q.ar : q.en, q.brand)}
            className="text-xs font-semibold px-3 py-1 rounded-full border bg-background hover:border-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            ✨ {isAr ? q.ar : q.en}
          </button>
        ))}
      </div>
    </Card>
  );
}

export default InstantBrandStudioBar;
