import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, StatCard } from '@/components/cluster/ui';
import { MaturityRadarChart } from '@/components/cluster/modern/MaturityRadarChart';
import { Gauge, CheckCircle2, GraduationCap, Landmark } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MaturityResultPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: assessment, ok } = await safeQuery(
    () => prisma.maturityAssessment.findUnique({ where: { id }, include: { factory: { select: { name: true } } } }),
    null
  );

  if (ok && !assessment) notFound();

  const { data: benchmark } = await safeQuery(
    async () => {
      const all = await prisma.maturityAssessment.findMany({ orderBy: { createdAt: 'desc' } });
      if (!all.length) return { digital: 45, production: 55, quality: 65, sustainability: 40, market: 50, people: 55 };

      const sums = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
      all.forEach((a) => {
        const s = a.scores as Record<string, number>;
        Object.keys(sums).forEach((k) => {
          sums[k as keyof typeof sums] += s[k] || 0;
        });
      });
      return {
        digital: Math.round(sums.digital / all.length),
        production: Math.round(sums.production / all.length),
        quality: Math.round(sums.quality / all.length),
        sustainability: Math.round(sums.sustainability / all.length),
        market: Math.round(sums.market / all.length),
        people: Math.round(sums.people / all.length),
      };
    },
    { digital: 45, production: 55, quality: 65, sustainability: 40, market: 50, people: 55 }
  );

  if (!assessment) return null;

  const scores = assessment.scores as Record<string, number>;
  const recommendations = (assessment.recommendations || []) as Array<{
    dimension: string;
    priority: string;
    action: string;
    actionAr: string;
    tag?: string;
    programHint?: string;
    category?: string;
  }>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4 text-sm">
        <Link href={`/${locale}/cluster/maturity`} className="text-muted-foreground hover:underline">
          {t('Digital Maturity', 'النضج الرقمي')}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{t('Assessment Results', 'نتائج التقييم')}</span>
      </div>

      <PageHeader
        icon={Gauge}
        title={`${t('Maturity Report:', 'تقرير النضج الرقمي:')} ${(assessment as any).factory?.name || ''}`}
        subtitle={`${t('Completed on', 'تم التقييم في')} ${fmtDate(locale, assessment.createdAt)}`}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <StatCard
            label={t('Overall Readiness Score', 'الدرجة الكلية للجاهزية')}
            value={`${assessment.overallScore}/100`}
            hint={`${t('Industry 4.0 Level', 'المستوى')} ${assessment.level} / 5`}
            tone="blue"
          />
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4">{t('Performance vs Cluster Benchmark', 'أداء المصنع مقارنة بمتوسط التجمع')}</h3>
            <MaturityRadarChart scores={scores} clusterAverage={benchmark} locale={locale} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">{t('Prioritized 90-Day Modernization Roadmap', 'خارطة الطريق التنفيذية لـ 90 يوماً')}</h2>
            {recommendations.length === 0 ? (
              <div className="rounded-xl border p-6 text-center text-muted-foreground">
                {t('Great job! You are leading in all dimensions.', 'عمل رائع! مصنعك رائد في جميع المحاور.')}
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl border bg-card shadow-sm">
                    <CheckCircle2
                      className={`w-6 h-6 shrink-0 mt-0.5 ${
                        rec.priority === 'Now'
                          ? 'text-rose-500'
                          : rec.priority === 'Next'
                          ? 'text-amber-500'
                          : 'text-sky-500'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            rec.priority === 'Now'
                              ? 'text-rose-600'
                              : rec.priority === 'Next'
                              ? 'text-amber-600'
                              : 'text-sky-600'
                          }`}
                        >
                          {t(rec.priority, rec.priority === 'Now' ? 'الآن (عاجل)' : rec.priority === 'Next' ? 'التالي' : 'لاحقاً')}
                        </span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-xs text-muted-foreground capitalize">{rec.dimension}</span>
                      </div>
                      <p className="font-medium mb-3">{t(rec.action, rec.actionAr || rec.action)}</p>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/${locale}/cluster/funding?tag=${rec.tag || rec.dimension}`}
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline bg-primary/10 px-2.5 py-1 rounded-md font-medium"
                        >
                          <Landmark className="w-3.5 h-3.5" />
                          {t('Matching Grants & Subsidies', 'المنح والبرامج التمويلية المطابقة')}
                        </Link>
                        <Link
                          href={`/${locale}/cluster/academy?category=${rec.category || 'TECHNICAL'}`}
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:underline bg-emerald-500/10 px-2.5 py-1 rounded-md font-medium"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          {t('Recommended Academy Courses', 'الدورات التدريبية المقترحة')}
                        </Link>
                        <Link
                          href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(
                            rec.action
                          )}&category=${encodeURIComponent(
                            rec.category || 'TECHNICAL'
                          )}&need=${encodeURIComponent(
                            `Address ${rec.dimension} gap (${rec.priority} priority): ${rec.action}`
                          )}`}
                          className="inline-flex items-center gap-1.5 text-xs text-amber-700 hover:underline bg-amber-500/15 px-2.5 py-1 rounded-md font-semibold"
                        >
                          ✨ {t('Generate Custom AI Course', 'إنشاء دورة مخصصة بالذكاء الاصطناعي')}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
