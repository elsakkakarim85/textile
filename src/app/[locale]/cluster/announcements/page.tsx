import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner } from '@/components/cluster/ui';
import { Megaphone, Pin, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default async function AnnouncementsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  if (!userId) redirect(`/${locale}/sign-in`);

  const { data: announcements, ok } = await safeQuery(
    async () => {
      return prisma.announcement.findMany({
        where: { isActive: true },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        include: { author: { select: { firstName: true, lastName: true } } }
      });
    },
    // Fallback data
    [
      { id: '1', titleEn: 'Cluster wide electricity maintenance', titleAr: 'صيانة الكهرباء على مستوى التجمع', bodyEn: 'Please be informed that the main grid will be under maintenance this Friday from 2 AM to 6 AM.', bodyAr: 'يرجى العلم أن الشبكة الرئيسية ستخضع للصيانة يوم الجمعة من 2 صباحاً إلى 6 صباحاً.', targetRole: 'ALL', isPinned: true, createdAt: new Date() },
      { id: '2', titleEn: 'New MSMEDA Green Financing Program', titleAr: 'برنامج التمويل الأخضر الجديد من جهاز تنمية المشروعات', bodyEn: 'A new 5% interest rate loan is available for factories installing solar panels. Check the Funding Hub.', bodyAr: 'قرض جديد بفائدة 5% متاح للمصانع التي تقوم بتركيب ألواح طاقة شمسية. راجع مركز التمويل.', targetRole: 'FACTORY_OWNER', isPinned: false, createdAt: new Date(Date.now() - 172800000) }
    ]
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <PageHeader
        icon={Megaphone}
        title={t('Announcements', 'التعميمات والإعلانات')}
        subtitle={t('Official updates and news from the Cluster Management Organization.', 'تحديثات وأخبار رسمية من إدارة التجمع.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="space-y-6">
        {announcements?.map((item: any) => {
          const title = locale === 'ar' ? (item.titleAr || item.titleEn) : item.titleEn;
          const body = locale === 'ar' ? (item.bodyAr || item.bodyEn) : item.bodyEn;

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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{fmtDate(locale, item.createdAt)}</span>
                      {item.author && (
                        <>
                          <span>•</span>
                          <span>{item.author.firstName} {item.author.lastName}</span>
                        </>
                      )}
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
