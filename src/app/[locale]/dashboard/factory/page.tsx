import { prisma } from '@/lib/prisma';
import { findUserFactory, safeQuery } from '@/server/cluster';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DbOfflineBanner } from '@/components/cluster/ui';
import {
  Eye,
  TrendingUp,
  Package,
  FileText,
  Star,
  ShieldCheck,
  Network,
  ArrowUpRight,
  Gauge,
  Compass,
  Sparkles,
  Recycle,
} from 'lucide-react';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { AnalyticsChart } from './AnalyticsChart';

export const dynamic = 'force-dynamic';

const FALLBACK_FACTORY = {
  id: 'demo-factory-1',
  name: 'Misr Spinning & Weaving (El-Mahalla)',
  isVerified: true,
  monthlyCapacity: 185000,
  capacityUnit: 'units',
  owner: {
    listings: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
  },
  quotations: [
    { id: 'q1', status: 'ACCEPTED' },
    { id: 'q2', status: 'ACCEPTED' },
    { id: 'q3', status: 'PENDING' },
    { id: 'q4', status: 'PENDING' },
  ],
  reviews: [{ rating: 5 }, { rating: 4.9 }],
  poolCommitments: [{ id: 'p1' }, { id: 'p2' }, { id: 'p3' }],
  capacityPosts: [{ id: 'c1' }, { id: 'c2' }],
};

export default async function FactoryDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: factory, ok } = await safeQuery(async () => {
    const activeFactory = await findUserFactory();
    const targetId = activeFactory?.id;
    const found = targetId
      ? await prisma.factory.findUnique({
          where: { id: targetId },
          include: {
            owner: { include: { listings: { where: { deletedAt: null } } } },
            quotations: true,
            reviews: true,
            poolCommitments: true,
            capacityPosts: true,
          },
        })
      : await prisma.factory.findFirst({
          where: { deletedAt: null },
          include: {
            owner: { include: { listings: { where: { deletedAt: null } } } },
            quotations: true,
            reviews: true,
            poolCommitments: true,
            capacityPosts: true,
          },
        });
    return (found as any) || FALLBACK_FACTORY;
  }, FALLBACK_FACTORY);

  const avgRating =
    factory.reviews.length > 0
      ? (factory.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / factory.reviews.length).toFixed(1)
      : '4.9';

  return (
    <div className="space-y-8">
      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{factory.name}</h1>
            {factory.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('Verified', 'موثق')}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {t(
              'Live factory performance, B2B quotations, Lean OEE excellence, and cluster collaboration metrics.',
              'مؤشرات أداء المصنع الحية، عروض الأسعار التصديرية، كفاءة اللين OEE، والتعاون في التجمع.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/factories/${factory.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border bg-background text-xs font-semibold hover:border-primary/50"
          >
            {t('Public Factory Profile', 'صفحة المصنع العامة')} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/${locale}/cluster`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
          >
            <Network className="w-3.5 h-3.5" /> {t('Cluster Ecosystem', 'منظومة التجمع')}
          </Link>
        </div>
      </div>

      {/* Industrial Excellence & AI Quick-Launch Strip */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link
          href={`/${locale}/cluster/lean-manufacturing`}
          className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/30 hover:bg-emerald-500/10 transition-all flex items-start gap-3"
        >
          <Gauge className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
              {t('Lean Six Sigma & OEE Suite', 'منظومة اللين سيكس سيجما و OEE')}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {t('VSM, 5S Red-Tag, SMED, SPC Cp/Cpk & SQDC', 'تخطيط التدفق، 5S، تبديل الاسطمبات، وضبط الجودة')}
            </div>
          </div>
        </Link>

        <Link
          href={`/${locale}/cluster/export-intelligence`}
          className="p-4 rounded-xl border bg-indigo-500/5 border-indigo-500/30 hover:bg-indigo-500/10 transition-all flex items-start gap-3"
        >
          <Compass className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-extrabold text-indigo-800 dark:text-indigo-300">
              {t('Global Export Intelligence', 'مركز دراسات التصدير والمشترين')}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {t('Market studies, tenders, NTMs & buyer outreach', 'دراسات السوق، المناقصات الدولية، والمشترين')}
            </div>
          </div>
        </Link>

        <Link
          href={`/${locale}/cluster/brand-studio`}
          className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10 transition-all flex items-start gap-3"
        >
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-extrabold text-amber-800 dark:text-amber-300">
              {t('AI Brand & Brochure Studio', 'استوديو الهوية والبروشور الذكي')}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {t('Generate export catalogs, logos & buyer decks', 'تصميم الهوية، البروشور التصديري، والكتالوج')}
            </div>
          </div>
        </Link>

        <Link
          href={`/${locale}/marketplaces/waste/add`}
          className="p-4 rounded-xl border bg-teal-500/5 border-teal-500/30 hover:bg-teal-500/10 transition-all flex items-start gap-3"
        >
          <Recycle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-extrabold text-teal-800 dark:text-teal-300">
              {t('List Circular Waste Lot', 'عرض عوادم للتدوير الدائري')}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {t('Monetize 5S Red-Tag offcuts & comber noil', 'تحويل عوادم التمشيط والقصاقيص إلى سيولة نقدية')}
            </div>
          </div>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Active Catalog Listings', 'المنتجات والموارد المعروضة')}
            </CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{factory.owner.listings.length}</div>
            <Link href={`/${locale}/dashboard/factory/listings`} className="text-xs text-primary hover:underline mt-1 inline-block">
              {t('Manage catalog & DPP QR →', 'إدارة الكتالوج وجواز المنتج ←')}
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Quotations Sent', 'عروض الأسعار المقدمة')}
            </CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{factory.quotations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {factory.quotations.filter((q: any) => q.status === 'ACCEPTED').length} {t('accepted bids', 'عروض مقبولة')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Cluster Collaborations', 'مشاركات التجمع الصناعي')}
            </CardTitle>
            <Eye className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {factory.poolCommitments.length + factory.capacityPosts.length}
            </div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {t('Procurement pools & capacity posts', 'شراء جماعي وتبادل طاقات')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('Trust & Quality Rating', 'تقييم الثقة والجودة')}
            </CardTitle>
            <Star className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {avgRating} <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {factory.monthlyCapacity
                ? `${factory.monthlyCapacity.toLocaleString()} ${factory.capacityUnit || 'units'}/mo`
                : t('Verified capacity', 'طاقة إنتاجية موثقة')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('Buyer Engagement & Inquiries (Last 6 Months)', 'تفاعل المشترين والاستفسارات (آخر 6 أشهر)')}</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <AnalyticsChart />
        </CardContent>
      </Card>
    </div>
  );
}

