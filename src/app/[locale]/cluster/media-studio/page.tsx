import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { AiMediaProductionStudio, type MediaPurposeId } from '@/components/cluster/modern/AiMediaProductionStudio';
import { ArrowLeft, Megaphone, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AiMediaStudioPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ purpose?: string; company?: string; prompt?: string }>;
}) {
  const { locale } = await params;
  const { purpose, company, prompt } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const validPurposes: MediaPurposeId[] = [
    'B2B_BUYER_PITCH',
    'TRADE_SHOW_BOOTH',
    'MACRO_SWATCH_SHOWCASE',
    'FACTORY_TOUR_OEE',
    'SOCIAL_MEDIA_AD',
    'ESG_CBAM_DPP',
    'ACADEMY_SOP_TRAINING',
    'PRODUCT_CATALOG_HERO',
  ];
  const initialPurpose = validPurposes.includes(purpose as MediaPurposeId)
    ? (purpose as MediaPurposeId)
    : 'B2B_BUYER_PITCH';

  return (
    <div className="container mx-auto py-6 px-4 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`/${locale}/cluster`}
          className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-1.5 text-xs font-bold hover:bg-muted transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('Back to Cluster Hub', 'العودة إلى مركز التجمع')}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/${locale}/cluster/brand-studio`}
            className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-1.5 text-xs font-bold hover:bg-muted transition"
          >
            <Megaphone className="w-3.5 h-3.5 text-amber-500" />
            {t('AI Brand & Collateral Studio', 'استوديو الهوية والمطبوعات')}
          </Link>
          <Link
            href={`/${locale}/cluster/google-labs`}
            className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-1.5 text-xs font-bold hover:bg-muted transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            {t('Google Labs Suite', 'منظومة مختبرات جوجل')}
          </Link>
        </div>
      </div>

      <AiMediaProductionStudio
        locale={locale}
        defaultPurpose={initialPurpose}
        defaultCompanyName={company}
        defaultPrompt={prompt}
      />
    </div>
  );
}
