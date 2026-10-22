import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, Pill } from '@/components/cluster/ui';
import MaturityWizard from '@/components/cluster/modern/MaturityWizard';
import { GoogleCreativeLabIntegration } from '@/components/cluster/modern/GoogleCreativeLabIntegration';
import { Gauge, ArrowRight, History } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function MaturityAssessmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  const { data: recentAssessments } = await safeQuery(
    async () => {
      return prisma.maturityAssessment.findMany({
        include: { factory: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 4,
      });
    },
    [] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PageHeader
        icon={Gauge}
        title={t('Digital Maturity & Industry 4.0 Assessment', 'تقييم النضج الرقمي والجاهزية للصناعة 4.0')}
        subtitle={t(
          'Evaluate your factory across 6 dimensions to generate a personalized 90-day modernization roadmap and unlock matched grants.',
          'قيّم مصنعك عبر 6 محاور رئيسية للحصول على خارطة طريق تحديث مخصصة لمدة 90 يوماً وربطها بالمنح التمويلية.'
        )}
        actions={
          factory && (
            <Pill tone="blue">
              {t('Assessing:', 'التقييم لمصنع:')} {factory.name}
            </Pill>
          )
        }
      />

      {recentAssessments && recentAssessments.length > 0 && (
        <Card className="p-5 bg-muted/20">
          <div className="flex items-center gap-2 text-sm font-bold mb-3">
            <History className="w-4 h-4 text-primary" />
            {t('Recent Cluster Assessments & Roadmaps', 'أحدث تقييمات النضج الرقمي وخرائط الطريق')}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {recentAssessments.map((a: any) => (
              <Link
                key={a.id}
                href={`/${locale}/cluster/maturity/${a.id}`}
                className="rounded-xl border bg-card p-3.5 hover:border-primary/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold truncate">{a.factory?.name || 'Factory'}</div>
                  <div className="text-lg font-extrabold text-primary">
                    {a.overallScore}/100 <span className="text-xs font-normal text-muted-foreground">(L{a.level})</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{fmtDate(locale, a.createdAt)}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-primary shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      )}

      <MaturityWizard locale={locale} />

      {/* Google Stitch UI/UX Prototyper & Google Opal Industry 4.0 Mini-App Builder */}
      <GoogleCreativeLabIntegration
        locale={locale}
        defaultTool="stitch"
        contextModule="maturity"
      />
    </div>
  );
}
