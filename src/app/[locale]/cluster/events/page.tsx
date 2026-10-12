import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { CalendarDays, MapPin, Video, Users, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function EventsPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ type?: string, past?: string }> }) {
  const { locale } = await params;
  const { type, past } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const isPast = past === 'true';

  const userId = await currentUserId();
  if (!userId) redirect(`/${locale}/sign-in`);

  const { data: events, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (type) where.type = type;
      if (isPast) {
        where.endAt = { lt: new Date() };
      } else {
        where.endAt = { gte: new Date() };
      }
      return prisma.clusterEvent.findMany({
        where,
        include: { _count: { select: { registrations: true } }, registrations: { where: { userId } } },
        orderBy: isPast ? { startAt: 'desc' } : { startAt: 'asc' },
      });
    },
    // Fallback data
    [
      { id: '1', title: 'Heimtextil Frankfurt Preparation Workshop', type: 'WORKSHOP', description: 'Prepare your collections for the upcoming German exhibition.', startAt: new Date(Date.now() + 5*86400000), endAt: new Date(Date.now() + 5*86400000 + 4*3600000), location: 'Mahalla Training Center', isOnline: false, capacity: 50, _count: { registrations: 42 }, registrations: [] },
      { id: '2', title: 'EU DPP Requirements Webinar', type: 'WEBINAR', description: 'Online session covering Digital Product Passport requirements for 2027.', startAt: new Date(Date.now() + 12*86400000), endAt: new Date(Date.now() + 12*86400000 + 2*3600000), location: 'Zoom', isOnline: true, capacity: 200, _count: { registrations: 150 }, registrations: [{ id: '1' }] }
    ]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={CalendarDays}
        title={t('Cluster Events', 'فعاليات التجمع')}
        subtitle={t('Workshops, webinars, and B2B matchmaking days to grow your network.', 'ورش عمل، ندوات إلكترونية، وأيام تشبيك أعمال لتوسيع شبكة علاقاتك.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <a href={`/${locale}/cluster/events`} className={`px-4 py-1.5 rounded-full text-sm ${!isPast ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
            {t('Upcoming', 'القادمة')}
          </a>
          <a href={`/${locale}/cluster/events?past=true`} className={`px-4 py-1.5 rounded-full text-sm ${isPast ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
            {t('Past Events', 'السابقة')}
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((evt: any) => {
          const isRegistered = evt.registrations && evt.registrations.length > 0;
          const isFull = evt.capacity && evt._count?.registrations >= evt.capacity;
          
          return (
            <Card key={evt.id} className="p-0 overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors">
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <Pill tone="blue">{evt.type}</Pill>
                  {evt.isOnline ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <Video className="w-3.5 h-3.5" /> Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      <MapPin className="w-3.5 h-3.5" /> In-Person
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{evt.title}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4 bg-muted/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{fmtDate(locale, evt.startAt)}</span>
                  </div>
                  {!evt.isOnline && evt.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  )}
                  {evt.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 shrink-0" />
                      <span>{evt._count?.registrations || 0} / {evt.capacity} {t('registered', 'مسجلين')}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{evt.description}</p>
                
                {!isPast && (
                  <div className="mt-auto border-t pt-4">
                    {isRegistered ? (
                      <Button variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50" disabled>
                        {t('Registered ✓', 'تم التسجيل ✓')}
                      </Button>
                    ) : isFull ? (
                      <Button variant="outline" className="w-full" disabled>
                        {t('Fully Booked', 'مكتمل العدد')}
                      </Button>
                    ) : (
                      <Button className="w-full">
                        {t('Register Now', 'سجل الآن')}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}

        {(!events || events.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={CalendarDays}
              title={t('No Events Found', 'لا توجد فعاليات')}
              hint={t('Check back later for upcoming events.', 'تحقق لاحقاً لمعرفة الفعاليات القادمة.')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
