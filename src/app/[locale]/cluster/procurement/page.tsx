import Link from 'next/link';
import type { ProcurementCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtMoney, fmtNumber, daysUntil } from '@/lib/i18n-inline';
import { PageHeader, StatCard, Pill, ProgressBar, EmptyState, DbOfflineBanner } from '@/components/cluster/ui';
import { ProcurementPoolCreateForm } from '@/components/cluster/collab/ProcurementPoolCreateForm';
import { GoogleCreativeLabIntegration } from '@/components/cluster/modern/GoogleCreativeLabIntegration';
import { ShoppingCart, Users, TrendingDown, Layers, Calendar, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const CATEGORIES: { key: ProcurementCategory; en: string; ar: string }[] = [
  { key: 'YARN', en: 'Yarn', ar: 'الغزول' },
  { key: 'FIBER', en: 'Raw Fiber', ar: 'الألياف الخام' },
  { key: 'DYES_CHEMICALS', en: 'Dyes & Chemicals', ar: 'الأصباغ والكيماويات' },
  { key: 'SPARE_PARTS', en: 'Spare Parts', ar: 'قطع الغيار' },
  { key: 'ENERGY', en: 'Solar & Energy', ar: 'الطاقة المتجددة' },
  { key: 'PACKAGING', en: 'Packaging', ar: 'التغليف' },
  { key: 'LOGISTICS', en: 'Logistics', ar: 'اللوجستيات' },
];

export default async function ProcurementListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: pools, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (category && CATEGORIES.some((c) => c.key === category)) {
        where.category = category as ProcurementCategory;
      }
      const list = await prisma.procurementPool.findMany({
        where,
        include: {
          organizer: { select: { firstName: true, lastName: true } },
          commitments: {
            where: { status: { in: ['COMMITTED', 'CONFIRMED'] } },
            select: { quantity: true, factoryId: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return list.map((p) => {
        const committedQty = p.commitments.reduce((s, c) => s + Number(c.quantity), 0);
        return {
          ...p,
          committedQty,
          participantsCount: p.commitments.length,
        };
      });
    },
    [
      {
        id: 'demo-pool-1',
        title: 'Giza 86 Combed Cotton Yarn (Ne 30/1)',
        titleAr: 'غزل قطن جيزة 86 ممشط (نمرة 30/1)',
        description: 'Bulk cluster purchase of Ne 30/1 combed cotton yarn to unlock a 14% volume discount for participating weaving & knitting mills.',
        category: 'YARN' as ProcurementCategory,
        unit: 'kg',
        targetQty: 50000,
        minCommitQty: 1000,
        committedQty: 32000,
        participantsCount: 6,
        benchmarkUnitPrice: 250,
        targetUnitPrice: 215,
        negotiatedUnitPrice: 212,
        currency: 'EGP',
        deadline: new Date(Date.now() + 10 * 86400000),
        status: 'OPEN',
      },
    ] as any[]
  );

  const activePoolsCount = (pools || []).filter((p: any) => p.status === 'OPEN' || p.status === 'NEGOTIATING').length;
  const totalCommittedUnits = (pools || []).reduce((s: number, p: any) => s + Number(p.committedQty || 0), 0);
  const totalParticipants = (pools || []).reduce((s: number, p: any) => s + Number(p.participantsCount || 0), 0);

  let totalSavingsValue = 0;
  for (const p of pools || []) {
    const bench = Number(p.benchmarkUnitPrice || 0);
    const target = Number(p.negotiatedUnitPrice || p.targetUnitPrice || 0);
    if (bench > target && target > 0) {
      totalSavingsValue += (bench - target) * Number(p.committedQty || 0);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={ShoppingCart}
        title={t('Joint Procurement Pools', 'مجموعات الشراء المشترك')}
        subtitle={t(
          'Aggregate demand across Mahalla SMEs for yarn, reactive dyes, spare parts, and solar energy to unlock tier-1 bulk pricing.',
          'تجميع الطلب بين مصانع المحلة للغزول والأصباغ وقطع الغيار والطاقة للحصول على أسعار الجملة وتخفيض تكاليف الإنتاج.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label={t('Active Buying Pools', 'مجموعات الشراء النشطة')}
          value={fmtNumber(locale, activePoolsCount)}
          icon={ShoppingCart}
          tone="blue"
        />
        <StatCard
          label={t('Committed Volume (Units)', 'إجمالي الكميات الملتزم بها')}
          value={fmtNumber(locale, totalCommittedUnits)}
          icon={Layers}
          tone="purple"
        />
        <StatCard
          label={t('Estimated Cluster Savings', 'الوفورات المقدرة للتجمع')}
          value={fmtMoney(locale, totalSavingsValue)}
          icon={TrendingDown}
          tone="emerald"
        />
        <StatCard
          label={t('Participating Commitments', 'التزامات المصانع المشاركة')}
          value={fmtNumber(locale, totalParticipants)}
          icon={Users}
          tone="amber"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/cluster/procurement`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !category ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t('All Categories', 'جميع الفئات')}
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/${locale}/cluster/procurement?category=${c.key}`}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === c.key ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {t(c.en, c.ar)}
            </Link>
          ))}
        </div>

        <ProcurementPoolCreateForm locale={locale} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools?.map((pool: any) => {
          const progressPct = Math.min(100, Math.round((Number(pool.committedQty) / Math.max(1, Number(pool.targetQty))) * 100));
          const bench = Number(pool.benchmarkUnitPrice || 0);
          const target = Number(pool.negotiatedUnitPrice || pool.targetUnitPrice || 0);
          const savingsPct = bench > target && target > 0 ? Math.round(((bench - target) / bench) * 100) : 0;
          const title = locale === 'ar' ? pool.titleAr || pool.title : pool.title;

          return (
            <Link key={pool.id} href={`/${locale}/cluster/procurement/${pool.id}`} className="block group">
              <Card className="p-6 h-full flex flex-col hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Pill tone="blue">{pool.category}</Pill>
                  <Pill tone={pool.status === 'OPEN' ? 'emerald' : pool.status === 'NEGOTIATING' ? 'amber' : 'gray'}>
                    {pool.status}
                  </Pill>
                </div>

                <h3 className="text-lg font-bold mb-1.5 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{pool.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span>
                      {fmtNumber(locale, pool.committedQty)} / {fmtNumber(locale, pool.targetQty)} {pool.unit}
                    </span>
                    <span className="text-primary font-bold">{progressPct}%</span>
                  </div>
                  <ProgressBar value={progressPct} />
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 text-xs mb-4">
                  <div>
                    <div className="text-muted-foreground">{t('Market Price', 'سعر السوق')}</div>
                    <div className="font-semibold line-through opacity-75">
                      {bench > 0 ? `${fmtMoney(locale, bench, pool.currency)}/${pool.unit}` : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-emerald-600 font-medium">{t('Group Price', 'سعر المجموعة')}</div>
                    <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                      {target > 0 ? `${fmtMoney(locale, target, pool.currency)}/${pool.unit}` : 'TBD'}
                      {savingsPct > 0 && <span className="ms-1 text-[11px]">(-{savingsPct}%)</span>}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {pool.participantsCount} {t('factories', 'مصانع')}
                  </span>
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> {Math.max(0, daysUntil(pool.deadline))} {t('days left', 'أيام متبقية')}
                  </span>
                  <span className="text-primary font-semibold inline-flex items-center gap-1">
                    {t('Join Pool', 'انضم')} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}

        {(!pools || pools.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={ShoppingCart}
              title={t('No Procurement Pools Found', 'لا توجد مجموعات شراء مشترك')}
              hint={t('Launch the first pool above to aggregate demand across cluster factories.', 'أطلق أول مجموعة شراء مشترك أعلاه لتجميع طلبات المصانع.')}
            />
          </div>
        )}
      </div>

      {/* Google Opal Bulk Cost-Savings Workflow & Mixboard Technical Spec Studio */}
      <div className="mt-10">
        <GoogleCreativeLabIntegration
          locale={locale}
          defaultTool="opal"
          contextModule="procurement"
        />
      </div>
    </div>
  );
}
