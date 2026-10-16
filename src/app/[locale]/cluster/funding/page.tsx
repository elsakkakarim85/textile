import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { tr, fmtMoney, fmtDate, daysUntil } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { FundingApplyForm } from '@/components/cluster/modern/FundingApplyForm';
import { Landmark, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function FundingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
  const { tag } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  let recommendedTags: string[] = [];
  if (factory) {
    const { data: latestMaturity } = await safeQuery(
      () => prisma.maturityAssessment.findFirst({ where: { factoryId: factory.id }, orderBy: { createdAt: 'desc' } }),
      null
    );
    if (latestMaturity) {
      const scores = latestMaturity.scores as Record<string, number>;
      const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
      recommendedTags = sorted.slice(0, 2).map(([key]) => key);
    }
  }

  const { data: programs, ok } = await safeQuery(
    async () => {
      const where: any = { isActive: true };
      if (tag) where.tags = { has: tag };
      return prisma.fundingProgram.findMany({
        where,
        include: {
          applications: factory ? { where: { factoryId: factory.id } } : false,
        },
        orderBy: { deadline: 'asc' },
      });
    },
    [
      {
        id: '1',
        title: 'SME Green Transformation Grant',
        titleAr: 'منحة التحول الأخضر للمصانع الصغيرة والمتوسطة',
        provider: 'EBRD & MSMEDA',
        description: 'Financial assistance for installing solar panels and water recycling systems.',
        eligibility: 'Approved Mahalla Textile SMEs',
        type: 'GRANT',
        maxAmount: 500000,
        currency: 'EGP',
        deadline: new Date(Date.now() + 15 * 86400000),
        tags: ['sustainability', 'energy'],
        applications: [],
      },
    ] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Landmark}
        title={t('Funding, Grants & Green Finance Hub', 'مركز التمويل والمنح والدعم الفني')}
        subtitle={t(
          'Access EU/UNIDO TIGARA technical assistance, MSMEDA green loans, IMC modernization subsidies, and CBE SME financing matched to your factory gaps.',
          'احصل على منح الدعم الفني من مشروع تيجارا واليونيدو، القروض الخضراء من جهاز تنمية المشروعات، وبرامج مركز تحديث الصناعة.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href={`/${locale}/cluster/funding`}
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            !tag ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {t('All Programs', 'جميع البرامج')}
        </Link>
        {['digital', 'sustainability', 'export', 'production', 'quality', 'people'].map((tDim) => (
          <Link
            key={tDim}
            href={`/${locale}/cluster/funding?tag=${tDim}`}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize ${
              tag === tDim ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {tDim}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs?.map((prog: any) => {
          const isRecommended = (prog.tags || []).some((tg: string) => recommendedTags.includes(tg));
          const hasApplied = prog.applications && prog.applications.length > 0;
          const title = locale === 'ar' ? prog.titleAr || prog.title : prog.title;
          const desc = locale === 'ar' ? prog.descriptionAr || prog.description : prog.description;

          return (
            <Card key={prog.id} className={`p-6 flex flex-col h-full ${isRecommended ? 'border-primary shadow-sm' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <Pill tone={prog.type === 'GRANT' ? 'emerald' : prog.type === 'LOAN' ? 'blue' : 'amber'}>
                  {prog.type.replace('_', ' ')}
                </Pill>
                {isRecommended && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    <Target className="w-3 h-3" /> {t('Matched to Your Factory', 'موصى به لمصنعك')}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">{prog.provider}</p>

              <p className="text-sm mb-4 flex-1 text-muted-foreground">{desc}</p>

              <div className="space-y-2 text-xs mb-6 bg-muted/30 p-3.5 rounded-lg">
                {prog.maxAmount && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('Maximum Funding:', 'الحد الأقصى للتمويل:')}</span>
                    <span className="font-bold text-sm">{fmtMoney(locale, Number(prog.maxAmount), prog.currency || 'EGP')}</span>
                  </div>
                )}
                {prog.eligibility && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">{t('Eligibility:', 'الأهلية:')}</span>
                    <span className="font-medium truncate">{prog.eligibility}</span>
                  </div>
                )}
                {prog.deadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('Deadline:', 'الموعد النهائي:')}</span>
                    <span className={`font-semibold ${daysUntil(prog.deadline) < 7 ? 'text-rose-600' : ''}`}>
                      {fmtDate(locale, prog.deadline)} ({Math.max(0, daysUntil(prog.deadline))}d)
                    </span>
                  </div>
                )}
              </div>

              <FundingApplyForm programId={prog.id} hasApplied={hasApplied} locale={locale} />
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
