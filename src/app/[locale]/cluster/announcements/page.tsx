import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { AnnouncementComposer } from '@/components/cluster/community/CommunityInteractive';
import { Megaphone, Pin, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: announcements, ok } = await safeQuery(
    async () => {
      return prisma.announcement.findMany({
        orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }],
        include: { author: { select: { firstName: true, lastName: true } } },
      });
    },
    [
      {
        id: '1',
        title: 'Cluster-Wide Solar PPA & Energy Efficiency Enrollment Open',
        titleAr: 'فتح باب الانضمام لمبادرة الطاقة الشمسية وكفاءة الطاقة لمصانع المحلة',
        body: 'Cluster factories can now join the Phase 2 Joint Solar PPA and receive a 35% EBRD green subsidy on rooftop PV installations.',
        bodyAr: 'يمكن لمصانع التجمع الآن الانضمام للمرحلة الثانية من اتفاقية الطاقة الشمسية المشتركة والحصول على منحة خضراء بنسبة 35% من البنك الأوروبي لإعادة الإعمار.',
        audience: 'ALL',
        isPinned: true,
        publishedAt: new Date(),
        author: { firstName: 'TIGARA', lastName: 'CMO' },
      },
      {
        id: '2',
        title: 'New MSMEDA 5% Green Financing Line for Dyeing & Finishing Modernization',
        titleAr: 'خط تمويل أخضر جديد بفائدة 5% لتحديث المصابغ وخطوط التجهيز',
        body: 'Applications are open in the Funding Hub for Zero Liquid Discharge (ZLD) and low-liquor-ratio jet dyeing upgrades.',
        bodyAr: 'باب التقديم مفتوح الآن عبر مركز التمويل لتحديث ماكينات الصباغة الموفرة للمياه وأنظمة المعالجة.',
        audience: 'FACTORIES',
        isPinned: false,
        publishedAt: new Date(Date.now() - 172800000),
        author: { firstName: 'TIGARA', lastName: 'CMO' },
      },
    ] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <PageHeader
        icon={Megaphone}
        title={t('Official Cluster Bulletins & Announcements', 'التعميمات والإعلانات الرسمية للتجمع')}
        subtitle={t(
          'Official circulars, grant calls, and infrastructure notices from the Mahalla Cluster Management Organization (TIGARA / UNIDO).',
          'التعميمات الرسمية، دعوات المنح، وإشعارات البنية التحتية الصادرة عن إدارة تجمع المحلة للغزل والنسيج.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <AnnouncementComposer locale={locale} />

      <div className="space-y-6">
        {announcements?.map((item: any) => {
          const title = locale === 'ar' ? item.titleAr || item.title || item.titleEn : item.title || item.titleEn;
          const body = locale === 'ar' ? item.bodyAr || item.body || item.bodyEn : item.body || item.bodyEn;
          const dateVal = item.publishedAt || item.createdAt || new Date();

          return (
            <Card key={item.id} className={`p-6 ${item.isPinned ? 'border-primary/50 shadow-sm bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.isPinned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {title}
                      {item.isPinned && <Pin className="w-4 h-4 text-primary" />}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{fmtDate(locale, dateVal)}</span>
                      {item.author && (
                        <>
                          <span>•</span>
                          <span>
                            {item.author.firstName} {item.author.lastName}
                          </span>
                        </>
                      )}
                      {item.audience && <Pill tone="blue">{item.audience}</Pill>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-wrap leading-relaxed">{body}</p>
              </div>
            </Card>
          );
        })}

        {(!announcements || announcements.length === 0) && (
          <EmptyState
            icon={Megaphone}
            title={t('No Announcements', 'لا توجد تعميمات')}
            hint={t('There are no active announcements at this time.', 'لا توجد إعلانات نشطة في هذا الوقت.')}
          />
        )}
      </div>
    </div>
  );
}
