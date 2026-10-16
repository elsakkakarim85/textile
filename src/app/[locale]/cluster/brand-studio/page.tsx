import Link from 'next/link';
import { Megaphone, Palette, Workflow, Video, FileText, ArrowLeft, Sparkles } from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, StatCard } from '@/components/cluster/ui';
import { currentUserId, findUserFactory } from '@/server/cluster';
import { BrandMarketingStudioClient } from '@/components/cluster/modern/BrandMarketingStudioClient';

export const dynamic = 'force-dynamic';

export default async function BrandMarketingStudioPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ topic?: string; brand?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PageHeader
        icon={Megaphone}
        title={t(
          'AI Brand Architect, Marketing Automation & Collateral Studio',
          'استوديو بناء العلامات التجارية وأتمتة التسويق وإنتاج المواد الترويجية'
        )}
        subtitle={t(
          'Create world-class textile brands, 90-day export marketing plans, omnichannel campaign automations, promotional videos, studio photos, 6-panel brochures, flyers, and trade-show roll-up posters from any topic.',
          'منظومة ذكية متكاملة لإنشاء الهويات التجارية، خطط التسويق التصديري، أتمتة الحملات، وتوليد الفيديوهات الإعلانية والصور والبروشورات والفلايرز وبوسترات المعارض الدولية لأي منتج.'
        )}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/${locale}/cluster`}
              className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-muted"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('Cluster Hub', 'مركز التجمع')}
            </Link>
            <Link
              href={`/${locale}/marketplaces/matchmaking`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t('B2B RFQ Exchange', 'بورصة مناقصات التصدير')}
            </Link>
          </div>
        }
      />

      {/* Executive Studio Capabilities Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label={t('Brand Identity & Pantone® System', 'الهوية البصرية ونظام Pantone®')}
          value={t('SVG + 5 TCX Swatches', 'شعار متجه + ٥ ألوان')}
          icon={Palette}
        />
        <StatCard
          label={t('Omnichannel Campaign Automation', 'مسارات الأتمتة والجدولة الذكية')}
          value={t('4-Channel Autopilot', 'أتمتة عبر ٤ قنوات')}
          icon={Workflow}
          tone="blue"
        />
        <StatCard
          label={t('Promo Video & Studio Photos', 'إنتاج الفيديو والصور الإعلانية')}
          value={t('30s Ad + 4 Artboards', 'إعلان ٣٠ث + ٤ لوحات')}
          icon={Video}
          tone="green"
        />
        <StatCard
          label={t('Print-Ready Trade Collateral', 'المطبوعات الجاهزة للمعارض')}
          value={t('Brochure • Flyer • Poster', 'بروشور • فلاير • بوستر')}
          icon={FileText}
          tone="amber"
        />
      </div>

      <BrandMarketingStudioClient
        locale={locale}
        initialTopic={sp.topic || factory?.description || undefined}
        defaultBrandName={sp.brand || factory?.name || undefined}
      />
    </div>
  );
}
