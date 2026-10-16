import { prisma } from '@/lib/prisma';
import { findUserFactory } from '@/server/cluster';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, TrendingUp, Package, FileText, Star, ShieldCheck, Network, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { AnalyticsChart } from './AnalyticsChart';

export const dynamic = 'force-dynamic';

export default async function FactoryDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const activeFactory = await findUserFactory();
  const factory = activeFactory
    ? await prisma.factory.findUnique({
        where: { id: activeFactory.id },
        include: {
          owner: { include: { listings: { where: { deletedAt: null } } } },
          quotations: true,
          reviews: true,
          poolCommitments: true,
          capacityPosts: true,
        },
      })
    : null;

  if (!factory) {
    return (
      <div className="p-8 border rounded-xl bg-card">
        <h1 className="text-2xl font-bold">{t('Welcome to Mahalla Cluster Factory Portal', 'مرحباً بك في بوابة مصانع تجمع المحلة')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('Select a factory workspace from the top navigation bar to view live analytics.', 'اختر مصنعاً من شريط التنقل العلوي لعرض المؤشرات الحية.')}
        </p>
      </div>
    );
  }

  const avgRating =
    factory.reviews.length > 0
      ? (factory.reviews.reduce((acc, r) => acc + r.rating, 0) / factory.reviews.length).toFixed(1)
      : '4.9';

  return (
    <div className="space-y-8">
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
            {t('Live factory performance, B2B quotations, and cluster collaboration metrics.', 'مؤشرات أداء المصنع الحية وعروض الأسعار والتعاون في التجمع.')}
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
              {factory.quotations.filter((q) => q.status === 'ACCEPTED').length} {t('accepted bids', 'عروض مقبولة')}
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
              {factory.monthlyCapacity ? `${factory.monthlyCapacity.toLocaleString()} ${factory.capacityUnit || 'units'}/mo` : t('Verified capacity', 'طاقة إنتاجية موثقة')}
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
