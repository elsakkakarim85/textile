import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtDate, fmtNumber, fmtMoney } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill, StatCard } from '@/components/cluster/ui';
import { CapacityForm } from '@/components/cluster/collab/CapacityForm';
import { CapacityRespondPanel } from '@/components/cluster/collab/CapacityRespondPanel';
import { ArrowRightLeft, Building2, Calendar, Sparkles, CheckCircle2, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const PROCESSES = ['spinning', 'weaving', 'knitting', 'dyeing', 'printing', 'finishing', 'sewing', 'embroidery'];

export default async function CapacityExchangePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kind?: string; process?: string }>;
}) {
  const { locale } = await params;
  const { kind, process: proc } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: posts, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (kind === 'OFFER' || kind === 'REQUEST') where.kind = kind;
      if (proc) where.process = proc;
      return prisma.capacityPost.findMany({
        where,
        include: {
          factory: { select: { id: true, name: true, isVerified: true, capabilities: true } },
          responses: {
            include: { factory: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
          },
          _count: { select: { responses: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    },
    [
      {
        id: '1',
        kind: 'OFFER',
        process: 'weaving',
        title: 'Idle Sulzer Looms for Heavy Denim Weaving',
        description: '5 Sulzer projectile looms available for 3 weeks. Width up to 220cm.',
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 21 * 86400000),
        factory: { id: 'f1', name: 'Misr Spinning & Weaving Co.', isVerified: true, capabilities: ['spinning', 'weaving'] },
        quantity: 15000,
        unit: 'meters',
        unitPrice: 18,
        status: 'OPEN',
        responses: [],
        _count: { responses: 1 },
      },
    ] as any[]
  );

  const offersCount = (posts || []).filter((p: any) => p.kind === 'OFFER').length;
  const requestsCount = (posts || []).filter((p: any) => p.kind === 'REQUEST').length;
  const matchedCount = (posts || []).filter((p: any) => p.status === 'MATCHED').length;

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={ArrowRightLeft}
        title={t('Capacity Exchange & Subcontracting', 'تبادل الطاقات الإنتاجية والتشغيل لدى الغير')}
        subtitle={t(
          'Monetize idle machinery or find verified Mahalla subcontractors across spinning, weaving, knitting, dyeing, finishing, and garmenting.',
          'استثمر الطاقات الإنتاجية الفائضة لمصنعك أو اعثر على مصانع معتمدة للتشغيل لدى الغير عبر مراحل الغزل والنسيج والصباغة والتجهيز.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label={t('Idle Capacity Offers', 'عروض الطاقات الفائضة')}
          value={fmtNumber(locale, offersCount)}
          icon={Layers}
          tone="emerald"
        />
        <StatCard
          label={t('Subcontracting Requests', 'طلبات التشغيل لدى الغير')}
          value={fmtNumber(locale, requestsCount)}
          icon={ArrowRightLeft}
          tone="blue"
        />
        <StatCard
          label={t('Matched B2B Deals', 'صفقات التشبيك المكتملة')}
          value={fmtNumber(locale, matchedCount)}
          icon={CheckCircle2}
          tone="purple"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/${locale}/cluster/capacity`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
              !kind && !proc ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t('All Posts', 'الكل')}
          </Link>
          <Link
            href={`/${locale}/cluster/capacity?kind=OFFER`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
              kind === 'OFFER' ? 'bg-emerald-600 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t('Capacity Offers', 'عروض الطاقة')}
          </Link>
          <Link
            href={`/${locale}/cluster/capacity?kind=REQUEST`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
              kind === 'REQUEST' ? 'bg-sky-600 text-white' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t('Subcontract Requests', 'طلبات المقاولة')}
          </Link>
          <span className="mx-1 text-muted-foreground">|</span>
          {PROCESSES.map((p) => (
            <Link
              key={p}
              href={`/${locale}/cluster/capacity?process=${p}${kind ? `&kind=${kind}` : ''}`}
              className={`px-3 py-1 rounded-full text-xs capitalize ${
                proc === p ? 'bg-primary/15 text-primary border border-primary/40 font-semibold' : 'bg-muted/60 hover:bg-muted'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>

        <CapacityForm locale={locale} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {posts?.map((post: any) => {
          // Check if there is an opposite-kind post in the same process for smart matching highlight
          const hasComplementaryMatch = (posts || []).some(
            (other: any) => other.id !== post.id && other.kind !== post.kind && other.process === post.process
          );

          return (
            <Card key={post.id} className="p-6 flex flex-col hover:border-primary/40 transition-colors">
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={post.kind === 'OFFER' ? 'emerald' : 'blue'}>
                    {post.kind === 'OFFER' ? t('IDLE CAPACITY OFFER', 'عرض طاقة متاحة') : t('SUBCONTRACT REQUEST', 'طلب مقاول باطن')}
                  </Pill>
                  <Pill tone="gray">{post.process.toUpperCase()}</Pill>
                  {post.status === 'MATCHED' && <Pill tone="purple">{t('MATCHED ✓', 'تم التعاقد ✓')}</Pill>}
                </div>
                {hasComplementaryMatch && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" /> {t('Smart Match Available', 'تطابق ذكي متاح')}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold mb-1.5">{post.title}</h3>
              {post.description && <p className="text-muted-foreground text-sm mb-4 flex-1">{post.description}</p>}

              <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-xs bg-muted/30 p-3.5 rounded-lg mb-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-medium text-foreground truncate">{post.factory?.name || 'Factory'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>
                    {fmtDate(locale, post.availableFrom)}
                    {post.availableTo ? ` → ${fmtDate(locale, post.availableTo)}` : ''}
                  </span>
                </div>
                <div className="font-semibold">
                  {t('Volume:', 'الكمية:')} {fmtNumber(locale, post.quantity)} {post.unit || post.uom || 'units'}
                </div>
                {post.unitPrice && (
                  <div className="font-semibold text-emerald-600">
                    {t('Indicative Rate:', 'السعر الاسترشادي:')} {fmtMoney(locale, Number(post.unitPrice))}/{post.unit || 'unit'}
                  </div>
                )}
              </div>

              <CapacityRespondPanel post={post} locale={locale} />
            </Card>
          );
        })}
        {(!posts || posts.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={ArrowRightLeft}
              title={t('No Capacity Posts Found', 'لا توجد منشورات حالياً')}
              hint={t('Post your idle machine capacity or subcontracting requirement above.', 'انشر طاقتك الإنتاجية المتاحة أو طلب التشغيل لدى الغير أعلاه.')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
