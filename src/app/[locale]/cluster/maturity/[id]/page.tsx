import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, StatCard } from '@/components/cluster/ui';
import { MaturityRadarChart } from '@/components/cluster/modern/MaturityRadarChart';
import { Gauge, CheckCircle2, ChevronRight, GraduationCap, Landmark } from 'lucide-react';
import Link from 'next/link';

export default async function MaturityResultPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  if (!userId || !factory) redirect(`/${locale}/sign-in`);

  // Fetch the assessment
  const { data: assessment, ok } = await safeQuery(
    () => prisma.maturityAssessment.findUnique({ where: { id } }),
    null
  );

  if (ok && !assessment) notFound();

  // Fetch the benchmark
  const { data: benchmark } = await safeQuery(
    async () => {
      // Simplified benchmark fetch: normally you'd hit an internal service, but we'll fetch from DB directly
      const all = await prisma.maturityAssessment.findMany({ orderBy: { createdAt: 'desc' } });
      if (!all.length) return { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
      
      const sums = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
      all.forEach(a => {
        const s = a.scores as Record<string, number>;
        Object.keys(sums).forEach(k => { sums[k as keyof typeof sums] += s[k] || 0; });
      });
      return {
        digital: sums.digital / all.length,
        production: sums.production / all.length,
        quality: sums.quality / all.length,
        sustainability: sums.sustainability / all.length,
        market: sums.market / all.length,
        people: sums.people / all.length,
      };
    },
    { digital: 40, production: 50, quality: 60, sustainability: 30, market: 40, people: 50 } // fallback
  );

  if (!assessment) return null; // fallback rendering if not ok

  const scores = assessment.scores as Record<string, number>;
  const recommendations = assessment.recommendations as Array<{
    dimension: string;
    priority: string;
    action: string;
    actionAr: string;
    tag: string;
    category: string;
  }>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4 text-sm">
        <Link href={`/${locale}/cluster`} className="text-muted-foreground hover:underline">{t('Cluster Hub', 'مركز التجمع')}</Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{t('Assessment Results', 'نتائج التقييم')}</span>
      </div>

      <PageHeader
        icon={Gauge}
        title={t('Maturity Assessment Results', 'نتائج تقييم النضج')}
        subtitle={`${t('Completed on', 'مكتمل في')} ${fmtDate(locale, assessment.createdAt)}`}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <StatCard
            label={t('Overall Score', 'النتيجة الإجمالية')}
            value={`${assessment.overallScore}/100`}
            hint={`${t('Level', 'المستوى')} ${assessment.level}`}
            tone="blue"
          />
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-4">{t('Performance vs Cluster', 'الأداء مقابل التجمع')}</h3>
            <MaturityRadarChart scores={scores} clusterAverage={benchmark} locale={locale} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4">{t('Your 90-Day Roadmap', 'خارطة الطريق لـ 90 يوماً')}</h2>
            {recommendations.length === 0 ? (
              <div className="rounded-xl border p-6 text-center text-muted-foreground">
                {t('Great job! You are leading in all dimensions.', 'عمل رائع! أنت رائد في جميع المحاور.')}
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl border bg-card shadow-sm">
                    <CheckCircle2 className={`w-6 h-6 shrink-0 mt-0.5 ${
                      rec.priority === 'Now' ? 'text-red-500' :
                      rec.priority === 'Next' ? 'text-amber-500' : 'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          rec.priority === 'Now' ? 'text-red-600' :
                          rec.priority === 'Next' ? 'text-amber-600' : 'text-blue-600'
                        }`}>
                          {t(rec.priority, rec.priority === 'Now' ? 'الآن' : rec.priority === 'Next' ? 'التالي' : 'لاحقاً')}
                        </span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-xs text-muted-foreground capitalize">{t(rec.dimension, rec.dimension)}</span>
                      </div>
                      <p className="font-medium mb-3">{t(rec.action, rec.actionAr)}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/${locale}/cluster/funding?tag=${rec.tag}`} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline bg-primary/10 px-2 py-1 rounded">
                          <Landmark className="w-3.5 h-3.5" />
                          {t('Matching Grants', 'منح مطابقة')}
                        </Link>
                        <Link href={`/${locale}/cluster/academy?category=${rec.category}`} className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:underline bg-emerald-500/10 px-2 py-1 rounded">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {t('Recommended Courses', 'دورات مقترحة')}
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
