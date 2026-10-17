import Link from 'next/link';
import {
  Globe2,
  TrendingUp,
  Briefcase,
  Building2,
  Scale,
  ArrowLeft,
  Palette,
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, StatCard } from '@/components/cluster/ui';
import { ExportIntelligenceClient } from '@/components/cluster/modern/ExportIntelligenceClient';

export const dynamic = 'force-dynamic';

export default async function ExportIntelligencePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string; country?: string; tab?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PageHeader
        icon={Globe2}
        title={t(
          'AI Global Export Intelligence, Buyer Matchmaking & NTM Compliance Hub',
          'مركز ذكاء التصدير العالمي، دراسات الأسواق، كشاف المشترين والمواصفات القياسية (NTM)'
        )}
        subtitle={t(
          'Generate expert market studies, landed-cost market entry strategies, verified international tenders, trade-show promotional plans, trusted buyer outreach in any country, and Non-Tariff Measures (NTM) regulatory compliance.',
          'ولّد دراسات سوق احترافية، استراتيجيات دخول الأسواق وحاسبة التكلفة الواصلة، المناقصات الدولية الموثقة، خطط الترويج والمعارض، قوائم المشترين الموثوقين مع رسائل تواصل احترافية، وتحليل شامل للمواصفات القياسية والإجراءات غير الجمركية لأي دولة في العالم.'
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
              href={`/${locale}/cluster/brand-studio`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              <Palette className="w-3.5 h-3.5" />
              {t('AI Brand & Collateral Studio', 'استوديو العلامات والمطبوعات')}
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label={t('Global Trade Corridors', 'الأسواق والاتفاقيات المغطاة')}
          value={t('190+ Countries & FTAs', '١٩٠+ دولة واتفاقية')}
          icon={TrendingUp}
        />
        <StatCard
          label={t('Verified Tenders & RFQs', 'المناقصات والفرص الموثقة')}
          value={t('TED • UNGM • ITC • ECS', 'مناقصات دولية مباشرة')}
          icon={Briefcase}
          tone="blue"
        />
        <StatCard
          label={t('Trusted Buyer Outreach', 'كشاف المشترين والتواصل')}
          value={t('5-Stage B2B Studio', '٥ مراحل تفاوض احترافية')}
          icon={Building2}
          tone="green"
        />
        <StatCard
          label={t('Standards & NTM Analyzer', 'المواصفات والعوائق غير الجمركية')}
          value={t('REACH • SABER • CPSIA • DPP', 'فحص شامل للمواصفات')}
          icon={Scale}
          tone="amber"
        />
      </div>

      <ExportIntelligenceClient
        locale={locale}
        initialProduct={sp.product}
        initialCountry={sp.country}
        initialTab={sp.tab}
      />
    </div>
  );
}
