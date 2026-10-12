import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { tr, fmtMoney, fmtDate, daysUntil } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { FundingApplyForm } from '@/components/cluster/modern/FundingApplyForm';
import { Landmark, Building2, Calendar, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default async function FundingPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ tag?: string }> }) {
  const { locale } = await params;
  const { tag } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  if (!userId) redirect(`/${locale}/sign-in`);

  // Compute recommended tags based on lowest maturity score dimensions (if user has a factory)
  let recommendedTags: string[] = [];
  if (factory) {
    const { data: latestMaturity } = await safeQuery(
      () => prisma.maturityAssessment.findFirst({ where: { factoryId: factory.id }, orderBy: { createdAt: 'desc' } })
    );
    if (latestMaturity) {
      const scores = latestMaturity.scores as Record<string, number>;
      const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]); // Ascending
      recommendedTags = sorted.slice(0, 2).map(([key]) => key); // Top 2 weakest dimensions
    }
  }

  const { data: programs, ok } = await safeQuery(
    async () => {
      const where: any = { isActive: true };
      if (tag) where.tags = { has: tag };
      return prisma.fundingProgram.findMany({
        where,
        include: {
          applications: factory ? { where: { factoryId: factory.id } } : false
        },
        orderBy: { deadline: 'asc' }
      });
    },
    // Fallback
    [
      { id: '1', title: 'SME Green Transformation Grant', provider: 'EBRD & MSMEDA', description: 'Financial assistance for installing solar panels and water recycling systems.', type: 'GRANT', maxAmount: 500000, deadline: new Date(Date.now() + 15*86400000), tags: ['sustainability', 'energy'], applications: [] },
      { id: '2', title: 'Digital ERP Subsidy', provider: 'TIGARA / IMC', description: '70% subsidy for implementing cloud ERP and tracking software.', type: 'SUBSIDY', maxAmount: 150000, deadline: new Date(Date.now() + 45*86400000), tags: ['digital', 'production'], applications: [] },
    ]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Landmark}
        title={t('Funding & Grants Hub', 'مركز التمويل والمنح')}
        subtitle={t('Access subsidies, green financing, and technical assistance programs targeted for the textile sector.', 'احصل على الدعم، التمويل الأخضر، وبرامج المساعدة الفنية المخصصة لقطاع الغزل والنسيج.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <a href={`/${locale}/cluster/funding`} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${!tag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
          {t('All Programs', 'جميع البرامج')}
        </a>
        {['digital', 'sustainability', 'export', 'production', 'quality', 'people'].map(tDim => (
          <a key={tDim} href={`/${locale}/cluster/funding?tag=${tDim}`} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap capitalize ${tag === tDim ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
            {t(tDim, tDim)}
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs?.map((prog: any) => {
          const isRecommended = prog.tags.some((t: string) => recommendedTags.includes(t));
          const hasApplied = prog.applications && prog.applications.length > 0;
          
          return (
            <Card key={prog.id} className={`p-6 flex flex-col h-full ${isRecommended ? 'border-primary shadow-sm' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <Pill tone={prog.type === 'GRANT' ? 'emerald' : prog.type === 'LOAN' ? 'blue' : 'amber'}>
                  {prog.type}
                </Pill>
                {isRecommended && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    <Target className="w-3 h-3" /> {t('Recommended', 'موصى به')}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-1">{prog.title}</h3>
              <p className="text-sm font-medium text-muted-foreground mb-3">{prog.provider}</p>
              
              <p className="text-sm mb-4 flex-1 text-muted-foreground">{prog.description}</p>
              
              <div className="space-y-2 text-sm mb-6 bg-muted/30 p-3 rounded-lg">
                {prog.maxAmount && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('Up to:', 'حتى:')}</span>
                    <span className="font-semibold">{fmtMoney(locale, prog.maxAmount)}</span>
                  </div>
                )}
                {prog.deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('Deadline:', 'الموعد النهائي:')}</span>
                    <span className={`font-semibold ${daysUntil(prog.deadline) < 7 ? 'text-red-600' : ''}`}>
                      {fmtDate(locale, prog.deadline)}
                    </span>
                  </div>
                )}
              </div>

              {factory ? (
                <FundingApplyForm programId={prog.id} hasApplied={hasApplied} locale={locale} />
              ) : (
                <div className="text-xs text-center text-amber-600 bg-amber-50 p-2 rounded mt-auto border border-amber-100">
                  {t('Factory profile required to apply.', 'مطلوب ملف مصنع للتقديم.')}
                </div>
              )}
            </Card>
          );
        })}

        {(!programs || programs.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={Landmark}
              title={t('No Programs Found', 'لا توجد برامج')}
              hint={t('There are no active funding programs matching this category.', 'لا توجد برامج تمويل نشطة تطابق هذا التصنيف.')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
