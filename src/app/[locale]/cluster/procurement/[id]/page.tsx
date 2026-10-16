import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { tr, fmtMoney, fmtNumber, daysUntil } from '@/lib/i18n-inline';
import { Pill, ProgressBar, DbOfflineBanner } from '@/components/cluster/ui';
import { ProcurementCommitForm } from '@/components/cluster/collab/ProcurementCommitForm';
import { ProcurementOrganizerControls } from '@/components/cluster/collab/ProcurementPoolCreateForm';
import { Users, TrendingDown, Target, Building2, Calendar, Scale } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default async function ProcurementDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  const { data: pool, ok } = await safeQuery(
    async () => {
      const p = await prisma.procurementPool.findUnique({
        where: { id },
        include: {
          organizer: true,
          commitments: {
            where: { status: { in: ['COMMITTED', 'CONFIRMED'] } },
            include: { factory: true },
          },
        },
      });
      if (!p) return null;

      const committedQty = p.commitments.reduce((sum: number, c: any) => sum + Number(c.quantity), 0);
      return { ...p, committedQty };
    },
    null
  );

  if (ok && !pool) notFound();
  if (!pool) return <div className="container py-8"><DbOfflineBanner locale={locale} /></div>;

  const progressPct = Math.min(100, (pool.committedQty / Math.max(1, Number(pool.targetQty))) * 100);
  const myCommitment = pool.commitments.find((c: any) => c.factoryId === factory?.id);

  const benchmark = Number(pool.benchmarkUnitPrice || 0);
  const currentPrice = Number(pool.negotiatedUnitPrice || pool.targetUnitPrice || 0);
  const savingsPct =
    benchmark > 0 && currentPrice < benchmark
      ? Math.round(((benchmark - currentPrice) / benchmark) * 100)
      : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4 text-sm">
        <Link href={`/${locale}/cluster/procurement`} className="text-muted-foreground hover:underline">
          {t('Joint Procurement', 'الشراء المشترك')}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{locale === 'ar' ? pool.titleAr || pool.title : pool.title}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Pill tone="blue">{pool.category}</Pill>
            <Pill tone={pool.status === 'OPEN' ? 'emerald' : pool.status === 'NEGOTIATING' ? 'amber' : 'gray'}>
              {pool.status}
            </Pill>
            {pool.supplierName && (
              <Pill tone="purple">
                {t('Supplier:', 'المورد:')} {pool.supplierName}
              </Pill>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">{locale === 'ar' ? pool.titleAr || pool.title : pool.title}</h1>
          <p className="text-muted-foreground max-w-2xl">{pool.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Card */}
          <Card className="p-6 border-primary/20 bg-card">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('Committed Volume', 'الحجم المؤكد')}</p>
                <div className="text-3xl font-bold">
                  {fmtNumber(locale, pool.committedQty)}{' '}
                  <span className="text-lg text-muted-foreground font-normal">
                    / {fmtNumber(locale, Number(pool.targetQty))} {pool.unit}
                  </span>
                </div>
              </div>
              <div className="text-end">
                <p className="text-sm text-muted-foreground mb-1">{t('Progress', 'التقدم')}</p>
                <div className="text-xl font-semibold text-primary">{Math.round(progressPct)}%</div>
              </div>
            </div>
            <ProgressBar value={progressPct} className="mb-4 h-3" />
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-4 h-4" />
                {pool.commitments.length} {t('Factories joined', 'مصانع مشاركة')}
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <Calendar className="w-4 h-4" />
                {Math.max(0, daysUntil(pool.deadline))} {t('days left', 'أيام متبقية')}
              </span>
            </div>
          </Card>

          {/* Pricing Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Scale className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('Market Benchmark', 'متوسط سعر السوق الفردي')}</p>
                  <p className="text-xl font-semibold">
                    {benchmark > 0 ? fmtMoney(locale, benchmark, pool.currency) : t('N/A', 'غير محدد')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">/{pool.unit}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                    {t('Group Bulk Price', 'السعر التفاوضي للمجموعة')}
                  </p>
                  <p className="text-xl font-bold">
                    {currentPrice > 0 ? fmtMoney(locale, currentPrice, pool.currency) : t('TBD', 'يحدد لاحقاً')}
                  </p>
                  {savingsPct > 0 && (
                    <p className="text-xs text-emerald-600 font-medium mt-1 inline-flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> {t('Unlocked savings:', 'التوفير المحقق:')} {savingsPct}%
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Participants List */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-lg">{t('Participating Cluster Factories', 'المصانع المشاركة في الشراء المشترك')}</h3>
            <div className="divide-y">
              {pool.commitments.map((c: any) => (
                <div key={c.id} className="py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">{c.factory.name}</span>
                      {c.note && <p className="text-xs text-muted-foreground">{c.note}</p>}
                    </div>
                  </div>
                  <span className="font-semibold">
                    {fmtNumber(locale, c.quantity)}{' '}
                    <span className="text-sm font-normal text-muted-foreground">{pool.unit}</span>
                  </span>
                </div>
              ))}
              {pool.commitments.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">
                  {t('Be the first factory to commit volume to this pool.', 'كن أول مصنع يلتزم بكمية في هذه المجموعة.')}
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-primary/20">
            <h3 className="font-semibold mb-2 text-lg">{t('Your Factory Commitment', 'التزام مصنعك')}</h3>
            {factory && (
              <p className="text-xs text-muted-foreground mb-4">
                {t('Committing as:', 'الالتزام باسم:')} <strong className="text-foreground">{factory.name}</strong>
              </p>
            )}
            <ProcurementCommitForm pool={{ ...pool, uom: pool.unit }} myCommitment={myCommitment} locale={locale} />
          </Card>

          <Card className="p-6 bg-muted/30">
            <ProcurementOrganizerControls
              poolId={pool.id}
              currentStatus={pool.status}
              negotiatedUnitPrice={pool.negotiatedUnitPrice ? Number(pool.negotiatedUnitPrice) : undefined}
              supplierName={pool.supplierName}
              locale={locale}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
