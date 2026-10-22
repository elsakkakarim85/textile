import { tr } from '@/lib/i18n-inline';
import { PageHeader, Pill } from '@/components/cluster/ui';
import { AiMediaProductionStudio, type MediaPurposeId } from '@/components/cluster/modern/AiMediaProductionStudio';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';
import { Film } from 'lucide-react';

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
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PageHeader
        icon={Film}
        manualId="ai-media-studio"
        title={t(
          'AI Image & Video Production Studio (FLUX.1 • Imagen 3 • Veo 2 • Wan 2.1)',
          'استوديو إنتاج الصور والفيديوهات بالذكاء الاصطناعي (FLUX.1 • Imagen 3 • Veo 2 • Wan 2.1)'
        )}
        subtitle={t(
          'Generate 4-angle photorealistic commercial & 100mm macro textile images and 5-scene HD promotional videos (.WEBM) integrated with your Company DNA Analysis and commercial purpose.',
          'أنتج صوراً فوتوغرافية وماكرو بـ ٤ زوايا كاميرا وفيديوهات ترويجية وصناعية عالية الدقة (٥ مشاهد بصيغة .WEBM) متكاملة مع تحليل بيانات مصنعك والغرض التسويقي.'
        )}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="emerald">Free Multi-Model AI Studio</Pill>
            <ExpertManualButton manualId="ai-media-studio" locale={locale} variant="pill" />
          </div>
        }
      />

      <AiMediaProductionStudio
        locale={locale}
        defaultPurpose={initialPurpose}
        defaultCompanyName={company}
        defaultPrompt={prompt}
      />
    </div>
  );
}
