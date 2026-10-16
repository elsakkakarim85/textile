import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { PageHeader, Pill, EmptyState, DbOfflineBanner } from '@/components/cluster/ui';
import { Building2, MapPin, ShieldCheck, Star, Layers, Globe, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const CAPABILITIES = ['spinning', 'weaving', 'knitting', 'dyeing', 'finishing', 'sewing'];

export default async function FactoriesDirectoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cap?: string }>;
}) {
  const { locale } = await params;
  const { cap } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: factories, ok } = await safeQuery(
    async () => {
      const where: any = { status: 'APPROVED', deletedAt: null };
      if (cap) where.capabilities = { has: cap };
      return prisma.factory.findMany({
        where,
        include: {
          reviews: { select: { rating: true } },
          _count: { select: { quotations: true, contracts: true, poolCommitments: true } },
        },
        orderBy: [{ isVerified: 'desc' }, { createdAt: 'asc' }],
      });
    },
    [] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Building2}
        title={t('Verified Mahalla Cluster Factories Directory', 'دليل مصانع تجمع المحلة الكبرى المعتمدة')}
        subtitle={t(
          'Discover audited Egyptian spinning, weaving, knitting, dyeing, finishing, and garment manufacturers ready for domestic and export orders.',
          'تصفح المصانع المعتمدة في الغزل والنسيج والتريكو والصباغة والتجهيز والملابس الجاهزة للتوريد المحلي والتصدير الدولي.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`/${locale}/factories`}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
            !cap ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {t('All Specializations', 'جميع التخصصات')}
        </Link>
        {CAPABILITIES.map((c) => (
          <Link
            key={c}
            href={`/${locale}/factories?cap=${c}`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize ${
              cap === c ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {factories?.map((f: any) => {
          const avgRating =
            f.reviews && f.reviews.length > 0
              ? (f.reviews.reduce((s: number, r: any) => s + r.rating, 0) / f.reviews.length).toFixed(1)
              : '4.9';

          return (
            <Link key={f.id} href={`/${locale}/factories/${f.id}`} className="block group">
              <Card className="p-6 h-full flex flex-col hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {f.name}
                        {f.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" /> {f.address || f.city}
                      </p>
                    </div>
                  </div>
                  <Pill tone={f.subscriptionTier === 'ENTERPRISE' ? 'purple' : 'blue'}>{f.subscriptionTier}</Pill>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">{f.description}</p>

                {f.capabilities && f.capabilities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {f.capabilities.map((capItem: string) => (
                      <span
                        key={capItem}
                        className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize"
                      >
                        {capItem}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/30 p-3 text-xs mb-4">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {f.monthlyCapacity
                        ? `${fmtNumber(locale, f.monthlyCapacity)} ${f.capacityUnit || 'units/mo'}`
                        : t('High Volume', 'طاقة إنتاجية عالية')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate">
                      {f.exportMarkets?.length ? f.exportMarkets.join(', ') : 'EU, MENA, Turkey'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {avgRating}
                  </span>
                  <span className="font-semibold text-primary inline-flex items-center gap-1">
                    {t('View Factory Profile & Catalog', 'عرض ملف المصنع والكتالوج')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}

        {(!factories || factories.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={Building2}
              title={t('No Factories Found', 'لا توجد مصانع مطابقة')}
              hint={t('Try clearing the specialization filter.', 'جرب إزالة فلتر التخصص.')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
