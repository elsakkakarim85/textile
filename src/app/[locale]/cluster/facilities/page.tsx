import Link from 'next/link';
import type { FacilityType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtMoney } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { FacilityBookForm } from '@/components/cluster/collab/FacilityBookForm';
import { FlaskConical, MapPin, UserSquare2, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const FACILITY_TYPES: { key: FacilityType; en: string; ar: string }[] = [
  { key: 'TESTING_LAB', en: 'Testing Lab', ar: 'معمل الاختبارات' },
  { key: 'CAD_DESIGN', en: 'CAD/CAM Studio', ar: 'استوديو التصميم CAD' },
  { key: 'EFFLUENT_TREATMENT', en: 'Effluent Treatment', ar: 'محطة معالجة الصرف' },
  { key: 'TRAINING_CENTER', en: 'Training Center', ar: 'مركز التدريب' },
  { key: 'SHOWROOM', en: 'Export Showroom', ar: 'صالة عرض التصدير' },
  { key: 'DYEHOUSE', en: 'Pilot Dyehouse', ar: 'مصبغة تجريبية' },
];

export default async function FacilitiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const { type } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: facilities, ok } = await safeQuery(
    async () => {
      const where: any = { isActive: true };
      if (type && FACILITY_TYPES.some((f) => f.key === type)) {
        where.type = type as FacilityType;
      }
      return prisma.sharedFacility.findMany({
        where,
        include: {
          bookings: {
            where: { status: { in: ['PENDING', 'CONFIRMED'] } },
            include: { factory: { select: { name: true } } },
            orderBy: { startAt: 'asc' },
            take: 5,
          },
          _count: {
            select: {
              bookings: { where: { status: 'CONFIRMED', endAt: { gt: new Date() } } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    },
    [
      {
        id: '1',
        name: 'TIGARA ISO Textile Testing Lab',
        nameAr: 'معمل تيجارا المعتمد لاختبارات النسيج',
        type: 'TESTING_LAB' as FacilityType,
        description: 'ISO 17025 certified laboratory for yarn tensile strength, color fastness, pilling, and fiber composition.',
        ratePerHour: 500,
        currency: 'EGP',
        location: 'Mahalla Cluster Center, Bldg B',
        operator: 'Eng. Khaled Mansour',
        equipment: ['Uster Tensorapid', 'Datacolor Spectrophotometer', 'Martindale Abrasion Tester'],
        bookings: [],
        _count: { bookings: 3 },
      },
    ] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={FlaskConical}
        title={t('Shared Cluster Facilities & Labs', 'المرافق والمعامل المشتركة للتجمع')}
        subtitle={t(
          'Book accredited quality testing laboratories, 3D CAD/CAM pattern studios, central effluent treatment, and export showrooms at subsidized cluster rates.',
          'احجز معامل فحص الجودة المعتمدة واستوديوهات التصميم ثلاثي الأبعاد ومحطة المعالجة المركزية وصالات العرض بأسعار مدعومة لأعضاء التجمع.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`/${locale}/cluster/facilities`}
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            !type ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {t('All Facilities', 'جميع المرافق')}
        </Link>
        {FACILITY_TYPES.map((cat) => (
          <Link
            key={cat.key}
            href={`/${locale}/cluster/facilities?type=${cat.key}`}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              type === cat.key ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t(cat.en, cat.ar)}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities?.map((fac: any) => {
          const name = locale === 'ar' ? fac.nameAr || fac.name : fac.name;
          const equipList: string[] = fac.equipment || fac.equipmentIds || [];
          const operatorName = fac.operator || fac.operatorName;

          return (
            <Card key={fac.id} className="p-6 flex flex-col h-full hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <Pill tone="blue">{fac.type.replace('_', ' ')}</Pill>
                <div className="text-end">
                  <div className="font-bold text-lg text-primary">
                    {fmtMoney(locale, Number(fac.ratePerHour || 0), fac.currency || 'EGP')}
                  </div>
                  <div className="text-xs text-muted-foreground">{t('per hour', 'في الساعة')}</div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">{name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-1">{fac.description}</p>

              <div className="space-y-2 text-xs bg-muted/30 p-3.5 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate font-medium text-foreground">{fac.location}</span>
                </div>
                {operatorName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserSquare2 className="w-4 h-4 shrink-0" />
                    <span>{operatorName}</span>
                  </div>
                )}
                {equipList.length > 0 && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {equipList.map((eq) => (
                        <span key={eq} className="px-2 py-0.5 rounded bg-background border text-[11px]">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <FacilityBookForm facility={fac} locale={locale} />
            </Card>
          );
        })}

        {(!facilities || facilities.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={FlaskConical}
              title={t('No Facilities Found', 'لا توجد مرافق')}
              hint={t('No shared facilities available for this category yet.', 'لا توجد مرافق مشتركة متاحة في هذا التصنيف بعد.')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
