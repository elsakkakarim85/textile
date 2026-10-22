import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, Pill } from '@/components/cluster/ui';
import { GoogleCreativeLabIntegration } from '@/components/cluster/modern/GoogleCreativeLabIntegration';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';
import { Sparkles, Megaphone, Globe2, Gauge, Cpu } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GoogleLabsHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tool?: string }>;
}) {
  const { locale } = await params;
  const { tool } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const validTool =
    tool === 'mixboard' || tool === 'stitch' || tool === 'opal' || tool === 'pomelli'
      ? tool
      : 'pomelli';

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PageHeader
        icon={Sparkles}
        manualId="google-pomelli"
        title={t(
          'Google Labs Free AI Suite: Pomelli • Mixboard • Stitch • Opal',
          'منظومة مختبرات جوجل المجانية: Pomelli • Mixboard • Stitch • Opal'
        )}
        subtitle={t(
          'Extract your mill Business DNA & launch B2B campaigns with Google Pomelli, design Pantone TCX fabric moodboards with Mixboard, prototype UI/UX buyer portals & Andon tablets with Stitch, and run 4-node industrial AI mini-apps with Opal.',
          'استخرج الحمض النووي التسويقي لمصنعك وأطلق حملات التصدير عبر Google Pomelli، وصمم لوحات الألوان والنسج بـ Mixboard، وابتكر واجهات بوابات المشترين وشاشات الأندون بـ Stitch، وشغّل تطبيقات الذكاء الصناعية المصغرة بـ Opal.'
        )}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="emerald">100% Free Google Labs Ecosystem</Pill>
            <ExpertManualButton manualId="google-opal" locale={locale} variant="pill" />
          </div>
        }
      />

      {/* Quick Jump Links to Relative Platform Modules */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Link
          href={`/${locale}/cluster/brand-studio`}
          className="rounded-xl border bg-card p-4 hover:border-primary/50 transition-all flex items-start gap-3"
        >
          <span className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
            <Megaphone className="w-5 h-5" />
          </span>
          <div>
            <div className="text-xs font-extrabold text-primary">Google Pomelli + Mixboard</div>
            <div className="text-sm font-bold mt-0.5">
              {t('Brand & Marketing Studio', 'استوديو الهوية والتسويق')}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {t('Business DNA, Pantone TCX & Print Collateral', 'الحمض النووي للعلامة والمطبوعات')}
            </div>
          </div>
        </Link>

        <Link
          href={`/${locale}/cluster/export-intelligence`}
          className="rounded-xl border bg-card p-4 hover:border-primary/50 transition-all flex items-start gap-3"
        >
          <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
            <Globe2 className="w-5 h-5" />
          </span>
          <div>
            <div className="text-xs font-extrabold text-emerald-600">Google Pomelli + Opal</div>
            <div className="text-sm font-bold mt-0.5">
              {t('Export Intelligence & Buyers', 'ذكاء التصدير والمشترين')}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {t('EUR.1 / QIZ Landed-Cost & Buyer Ads', 'تسعير الشحن الجمركي وإعلانات المشترين')}
            </div>
          </div>
        </Link>

        <Link
          href={`/${locale}/cluster/lean-manufacturing`}
          className="rounded-xl border bg-card p-4 hover:border-primary/50 transition-all flex items-start gap-3"
        >
          <span className="p-2.5 rounded-lg bg-sky-500/10 text-sky-600 shrink-0">
            <Gauge className="w-5 h-5" />
          </span>
          <div>
            <div className="text-xs font-extrabold text-sky-600">Google Opal + Stitch</div>
            <div className="text-sm font-bold mt-0.5">
              {t('Lean Six Sigma & OEE Hub', 'مركز اللين 6 سيجما و OEE')}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {t('OEE/SMED Mini-Apps & Andon Tablet UI', 'تطبيقات SMED وشاشات الأندون الذكية')}
            </div>
          </div>
        </Link>

        <Link
          href={`/${locale}/ai`}
          className="rounded-xl border bg-card p-4 hover:border-primary/50 transition-all flex items-start gap-3"
        >
          <span className="p-2.5 rounded-lg bg-violet-500/10 text-violet-600 shrink-0">
            <Cpu className="w-5 h-5" />
          </span>
          <div>
            <div className="text-xs font-extrabold text-violet-600">Google Opal + 7 Free LLMs</div>
            <div className="text-sm font-bold mt-0.5">
              {t('Multi-LLM AI Command Center', 'مركز الذكاء الاصطناعي والمقارنة')}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {t('Side-by-Side Arena & Custom AI Workflows', 'مقارنة النماذج وسلاسل العمل الذكية')}
            </div>
          </div>
        </Link>
      </div>

      {/* Main Interactive 4-Tool Studio */}
      <GoogleCreativeLabIntegration
        locale={locale}
        defaultTool={validTool}
        contextModule="hub"
      />
    </div>
  );
}
