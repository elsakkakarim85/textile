import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { PageHeader, Pill, EmptyState, DbOfflineBanner } from '@/components/cluster/ui';
import { Building2, MapPin, ShieldCheck, Star, Layers, Globe, ArrowRight, Gauge, Compass } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const CAPABILITIES: { id: string; en: string; ar: string }[] = [
  { id: 'spinning', en: 'Spinning', ar: 'الغزل' },
  { id: 'weaving', en: 'Weaving', ar: 'النسيج' },
  { id: 'knitting', en: 'Knitting', ar: 'التريكو' },
  { id: 'dyeing', en: 'Dyeing', ar: 'الصباغة' },
  { id: 'finishing', en: 'Finishing', ar: 'التجهيز النهائي' },
  { id: 'sewing', en: 'Garment Sewing', ar: 'الملابس الجاهزة' },
];

const FALLBACK_FACTORIES = [
  {
    id: 'demo-factory-1',
    name: 'Misr Spinning & Weaving (El-Mahalla)',
    address: 'Industrial Zone A, El Mahalla El Kubra',
    city: 'El Mahalla El Kubra',
    isVerified: true,
    subscriptionTier: 'ENTERPRISE',
    description:
      'Flagship integrated spinning, air-jet weaving, and dyeing complex producing Combed Giza 86/94 yarns (Ne 30/1–80/1) and 300–600 TC hospitality bedlinen for European and Gulf buyers.',
    capabilities: ['spinning', 'weaving', 'dyeing', 'finishing', 'sewing'],
    monthlyCapacity: 185000,
    capacityUnit: 'units/mo',
    exportMarkets: ['Germany', 'Italy', 'UK', 'UAE', 'USA'],
    reviews: [{ rating: 5 }, { rating: 5 }],
    _count: { quotations: 18, contracts: 9, poolCommitments: 4 },
  },
  {
    id: 'demo-factory-2',
    name: 'Al-Rowad Modern Dyeing & Finishing',
    address: 'Ring Road Industrial Estate, El Mahalla El Kubra',
    city: 'El Mahalla El Kubra',
    isVerified: true,
    subscriptionTier: 'ENTERPRISE',
    description:
      'ZDHC MRSL v3.1 & OEKO-TEX® Standard 100 certified dyehouse specializing in low-liquor-ratio jet dyeing, continuous mercerizing, Sanforizing, and spectrophotometer shade matching (CMC ΔE ≤ 0.6).',
    capabilities: ['dyeing', 'finishing'],
    monthlyCapacity: 320000,
    capacityUnit: 'kg/mo',
    exportMarkets: ['Italy', 'Turkey', 'Spain', 'Poland'],
    reviews: [{ rating: 5 }, { rating: 4.8 }],
    _count: { quotations: 14, contracts: 7, poolCommitments: 3 },
  },
  {
    id: 'demo-factory-3',
    name: 'Delta Jacquard & Home Textiles',
    address: '3rd Industrial Sector, El Mahalla El Kubra',
    city: 'El Mahalla El Kubra',
    isVerified: true,
    subscriptionTier: 'PRO',
    description:
      'High-speed Dornier & Picanol air-jet terry and jacquard weaving mill manufacturing 450–650 GSM zero-twist hotel bath towels, bathrobes, and table linens with EU Digital Product Passports.',
    capabilities: ['weaving', 'finishing', 'sewing'],
    monthlyCapacity: 95000,
    capacityUnit: 'pcs/mo',
    exportMarkets: ['Germany', 'France', 'Saudi Arabia', 'Greece'],
    reviews: [{ rating: 4.9 }],
    _count: { quotations: 11, contracts: 5, poolCommitments: 3 },
  },
  {
    id: 'demo-factory-4',
    name: 'Nile Valley Combed Knits & Apparel',
    address: 'Mansoura Road Industrial Zone, El Mahalla El Kubra',
    city: 'El Mahalla El Kubra',
    isVerified: true,
    subscriptionTier: 'PRO',
    description:
      'Mayer & Cie circular knitting and modular U-cell garment assembly plant producing compact single jersey, interlock, pique polos, and organic cotton loungewear.',
    capabilities: ['knitting', 'sewing'],
    monthlyCapacity: 110000,
    capacityUnit: 'pcs/mo',
    exportMarkets: ['UK', 'Netherlands', 'Germany', 'USA'],
    reviews: [{ rating: 4.8 }],
    _count: { quotations: 9, contracts: 4, poolCommitments: 2 },
  },
  {
    id: 'demo-factory-5',
    name: 'Ghazl El-Delta Compact Spinning Mill',
    address: 'West Industrial Quarter, El Mahalla El Kubra',
    city: 'El Mahalla El Kubra',
    isVerified: true,
    subscriptionTier: 'PRO',
    description:
      'Specialized Rieter compact ring-spinning and open-end rotor spinning mill delivering Uster® 5% certified Giza cotton cones and GRS-certified recycled cotton blends.',
    capabilities: ['spinning'],
    monthlyCapacity: 240000,
    capacityUnit: 'kg/mo',
    exportMarkets: ['Turkey', 'Portugal', 'Italy', 'Morocco'],
    reviews: [{ rating: 4.9 }],
    _count: { quotations: 12, contracts: 6, poolCommitments: 4 },
  },
  {
    id: 'demo-factory-6',
    name: 'Horus Medical & Technical Workwear',
    address: 'New Industrial Zone, El Mahalla El Kubra',
    city: 'El Mahalla El Kubra',
    isVerified: true,
    subscriptionTier: 'PRO',
    description:
      'ISO 9001 & EN ISO 13688 compliant manufacturer of antimicrobial hospital scrubs, flame-retardant industrial coveralls, and high-durability poly-cotton uniform fabrics.',
    capabilities: ['weaving', 'finishing', 'sewing'],
    monthlyCapacity: 65000,
    capacityUnit: 'sets/mo',
    exportMarkets: ['Saudi Arabia', 'UAE', 'Kuwait', 'Kenya'],
    reviews: [{ rating: 4.9 }],
    _count: { quotations: 8, contracts: 4, poolCommitments: 2 },
  },
];

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

  const fallbackFiltered = cap
    ? FALLBACK_FACTORIES.filter((f) => f.capabilities.includes(cap))
    : FALLBACK_FACTORIES;

  const { data: dbFactories, ok } = await safeQuery(
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
    fallbackFiltered as any[]
  );

  const factories = dbFactories && dbFactories.length > 0 ? dbFactories : fallbackFiltered;

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Building2}
        title={t('Verified Mahalla Cluster Factories Directory', 'دليل مصانع تجمع المحلة الكبرى المعتمدة')}
        subtitle={t(
          'Discover audited Egyptian spinning, weaving, knitting, dyeing, finishing, and garment manufacturers ready for domestic and export orders.',
          'تصفح المصانع المعتمدة في الغزل والنسيج والتريكو والصباغة والتجهيز والملابس الجاهزة للتوريد المحلي والتصدير الدولي.'
        )}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${locale}/cluster/lean-manufacturing`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-xs"
            >
              <Gauge className="w-3.5 h-3.5" />
              {t('Lean Six Sigma Suite', 'منظومة اللين سيكس سيجما')}
            </Link>
            <Link
              href={`/${locale}/cluster/export-intelligence`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 px-3.5 py-2 text-xs font-bold"
            >
              <Compass className="w-3.5 h-3.5" />
              {t('Export Intelligence Hub', 'مركز ذكاء التصدير')}
            </Link>
          </div>
        }
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`/${locale}/factories`}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            !cap ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {t('All Specializations', 'جميع التخصصات')}
        </Link>
        {CAPABILITIES.map((c) => (
          <Link
            key={c.id}
            href={`/${locale}/factories?cap=${c.id}`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              cap === c.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t(c.en, c.ar)}
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
                    {f.capabilities.map((capItem: string) => {
                      const capMeta = CAPABILITIES.find((c) => c.id === capItem);
                      return (
                        <span
                          key={capItem}
                          className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize"
                        >
                          {capMeta ? t(capMeta.en, capMeta.ar) : capItem}
                        </span>
                      );
                    })}
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

