import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { currentUserId, safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { EventActionButtons } from '@/components/cluster/community/CommunityInteractive';
import { CalendarDays, MapPin, Video, Users, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; past?: string }>;
}) {
  const { locale } = await params;
  const { type, past } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const isPast = past === 'true';

  const userId = await currentUserId();

  const { data: events, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (type) where.type = type;
      if (isPast) {
        where.startsAt = { lt: new Date() };
      } else {
        where.startsAt = { gte: new Date() };
      }
      return prisma.clusterEvent.findMany({
        where,
        include: {
          _count: { select: { registrations: true } },
          registrations: userId ? { where: { userId } } : false,
        },
        orderBy: isPast ? { startsAt: 'desc' } : { startsAt: 'asc' },
      });
    },
    [
      {
        id: '1',
        title: 'Heimtextil Frankfurt Export Delegation Prep Workshop',
        titleAr: 'ورشة التحضير لبعثة معرض هايمتكستيل فرانكفورت للتصدير',
        type: 'WORKSHOP',
        description: 'Prepare your collections for the upcoming German exhibition with EU DPP & sustainability compliance.',
        startsAt: new Date(Date.now() + 5 * 86400000),
        endsAt: new Date(Date.now() + 5 * 86400000 + 4 * 3600000),
        location: 'Mahalla Cluster Innovation Center',
        onlineUrl: null,
        capacity: 50,
        _count: { registrations: 34 },
        registrations: [],
      },
      {
        id: '2',
        title: 'EU Digital Product Passport (DPP) & CBAM Webinar',
        titleAr: 'ندوة جواز السفر الرقمي للمنتج الأوروبي وآلية CBAM',
        type: 'WEBINAR',
        description: 'Online session covering Digital Product Passport requirements for Egyptian textile exporters.',
        startsAt: new Date(Date.now() + 12 * 86400000),
        endsAt: new Date(Date.now() + 12 * 86400000 + 2 * 3600000),
        location: 'Online Webinar',
        onlineUrl: 'https://meet.google.com',
        capacity: 200,
        _count: { registrations: 118 },
        registrations: [],
      },
    ] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={CalendarDays}
        title={t('Cluster Events, Workshops & B2B Matchmaking', 'فعاليات التجمع وورش العمل ولقاءات الأعمال')}
        subtitle={t(
          'Join technical workshops, international trade-fair delegations, and B2B buyer matchmaking days organized by TIGARA & UNIDO.',
          'شارك في ورش العمل الفنية، وبعثات المعارض الدولية، وأيام التشبيك التجاري مع المشترين الدوليين.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Link
            href={`/${locale}/cluster/events`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
              !isPast ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t('Upcoming Events', 'الفعاليات القادمة')}
          </Link>
          <Link
            href={`/${locale}/cluster/events?past=true`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
              isPast ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t('Past Events', 'الفعاليات السابقة')}
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((evt: any) => {
          const isRegistered = evt.registrations && evt.registrations.length > 0;
          const isFull = evt.capacity && evt._count?.registrations >= evt.capacity;
          const isOnline = !!evt.onlineUrl || evt.type === 'WEBINAR';
          const title = locale === 'ar' ? evt.titleAr || evt.title : evt.title;
          const startDate = evt.startsAt || evt.startAt;

          return (
            <Card key={evt.id} className="p-0 overflow-hidden flex flex-col h-full hover:border-primary/50 transition-colors">
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                  <Pill tone="blue">{evt.type.replace('_', ' ')}</Pill>
                  {isOnline ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      <Video className="w-3.5 h-3.5" /> {t('Online', 'عبر الإنترنت')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                      <MapPin className="w-3.5 h-3.5" /> {t('In-Person', 'حضوري')}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>

                <div className="space-y-2 text-xs text-muted-foreground mb-4 bg-muted/30 p-3.5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{fmtDate(locale, startDate)}</span>
                  </div>
                  {evt.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                  )}
                  {evt.capacity && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 shrink-0" />
                      <span>
                        {evt._count?.registrations || 0} / {evt.capacity} {t('registered', 'مسجلين')}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{evt.description}</p>

                {!isPast && (
                  <EventActionButtons
                    event={evt}
                    isRegistered={!!isRegistered}
                    isFull={!!isFull}
                    locale={locale}
                  />
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
