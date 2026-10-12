import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, safeQuery } from '@/server/cluster';
import { tr, fmtMoney } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { FlaskConical, MapPin, UserSquare2, ShieldCheck, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function FacilitiesPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ type?: string }> }) {
  const { locale } = await params;
  const { type } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  if (!userId) redirect(`/${locale}/sign-in`);

  const { data: facilities, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (type) where.type = type;
      return prisma.sharedFacility.findMany({
        where,
        include: { _count: { select: { bookings: { where: { status: 'CONFIRMED', endAt: { gt: new Date() } } } } } },
        orderBy: { createdAt: 'desc' }
      });
    },
    // Fallback data
    [
      { id: '1', name: 'TIGARA Textile Testing Lab', type: 'LAB', description: 'ISO certified lab for yarn strength, color fastness, and composition testing.', ratePerHour: 500, location: 'Mahalla Cluster Center, Bldg B', operatorName: 'Eng. Khaled', equipmentIds: ['Tensile Tester', 'Spectrophotometer'], _count: { bookings: 3 } },
      { id: '2', name: 'CAD/CAM Design Studio', type: 'STUDIO', description: 'High-end workstations with Optitex and Gerber software for pattern making.', ratePerHour: 150, location: 'Innovation Hub', operatorName: 'IT Dept', equipmentIds: ['Optitex 3D', 'Plotter'], _count: { bookings: 0 } }
    ]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={FlaskConical}
        title={t('Shared Facilities', 'المرافق المشتركة')}
        subtitle={t('Book testing labs, design studios, and specialized equipment shared by the cluster.', 'احجز مختبرات الفحص، استوديوهات التصميم، والمعدات المتخصصة المشتركة في التجمع.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <a href={`/${locale}/cluster/facilities`} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${!type ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
          {t('All Facilities', 'جميع المرافق')}
        </a>
        {['LAB', 'STUDIO', 'TREATMENT', 'TRAINING', 'SHOWROOM'].map(cat => (
          <a key={cat} href={`/${locale}/cluster/facilities?type=${cat}`} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${type === cat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
            {t(cat, cat)}
          </a>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities?.map((fac: any) => (
          <Card key={fac.id} className="p-0 overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors">
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <Pill tone="blue">{fac.type}</Pill>
                <div className="text-right">
                  <div className="font-bold text-lg text-primary">{fmtMoney(locale, fac.ratePerHour)}</div>
                  <div className="text-xs text-muted-foreground">{t('per hour', 'في الساعة')}</div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{fac.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{fac.description}</p>
              
              <div className="space-y-2 text-sm bg-muted/20 p-3 rounded-lg mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">{fac.location}</span>
                </div>
                {fac.operatorName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserSquare2 className="w-4 h-4 shrink-0" />
                    <span>{fac.operatorName}</span>
                  </div>
                )}
                {fac.equipmentIds && fac.equipmentIds.length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="truncate">{fac.equipmentIds.join(' • ')}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between border-t pt-4">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Activity className="w-3.5 h-3.5" />
                  {fac._count?.bookings || 0} {t('upcoming bookings', 'حجوزات قادمة')}
                </span>
                <Button size="sm">
                  {t('Book Slot', 'احجز موعد')}
                </Button>
              </div>
            </div>
          </Card>
        ))}

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
