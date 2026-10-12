import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { CapacityForm } from '@/components/cluster/collab/CapacityForm';
import { ArrowRightLeft, Building2, Calendar, MessageSquarePlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function CapacityExchangePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  if (!userId) redirect(`/${locale}/sign-in`);

  const { data: posts, ok } = await safeQuery(
    async () => {
      return prisma.capacityPost.findMany({
        where: { status: 'OPEN' },
        include: { factory: true, _count: { select: { responses: true } } },
        orderBy: { createdAt: 'desc' }
      });
    },
    // Fallback data
    [
      { id: '1', kind: 'OFFER', process: 'weaving', title: 'Idle Looms for Denim', availableFrom: new Date(), availableUntil: new Date(Date.now() + 30*86400000), factory: { name: 'Al-Rowad Textiles' }, quantity: 5000, uom: 'm', _count: { responses: 2 } },
      { id: '2', kind: 'REQUEST', process: 'dyeing', title: 'Need reactive dyeing for 10 tons cotton yarn', availableFrom: new Date(), availableUntil: new Date(Date.now() + 15*86400000), factory: { name: 'Misr Spinning' }, quantity: 10000, uom: 'kg', _count: { responses: 0 } },
    ]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={ArrowRightLeft}
        title={t('Capacity Exchange', 'تبادل الطاقات الإنتاجية')}
        subtitle={t('Find subcontractors or offer your idle machinery to other cluster members.', 'ابحث عن مقاولي باطن أو اعرض ماكيناتك العاطلة على أعضاء التجمع الآخرين.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="mb-8">
        {factory ? (
          <CapacityForm locale={locale} />
        ) : (
          <div className="bg-amber-50 p-4 rounded-lg text-amber-700 text-sm">
            {t('You must create a factory profile to post capacity offers or requests.', 'يجب عليك إنشاء ملف مصنع لنشر عروض أو طلبات الطاقة الإنتاجية.')}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {posts?.map((post: any) => (
          <Card key={post.id} className="p-6 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <Pill tone={post.kind === 'OFFER' ? 'emerald' : 'blue'}>
                {post.kind === 'OFFER' ? t('OFFER', 'عرض') : t('REQUEST', 'طلب')}
              </Pill>
              <Pill tone="gray">{post.process.toUpperCase()}</Pill>
            </div>
            
            <h3 className="text-xl font-bold mb-2 line-clamp-1">{post.title}</h3>
            {post.description && <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.description}</p>}
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm mt-auto mb-6">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{post.factory?.name || 'Factory'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{fmtDate(locale, post.availableFrom)}</span>
              </div>
              {post.quantity && (
                <div className="col-span-2 font-medium">
                  {t('Qty:', 'الكمية:')} {post.quantity} {post.uom}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                {post._count?.responses || 0} {t('responses', 'ردود')}
              </span>
              <Button variant="outline" size="sm" disabled={post.factoryId === factory?.id}>
                <MessageSquarePlus className="w-4 h-4 me-2" />
                {t('Respond', 'رد')}
              </Button>
            </div>
          </Card>
        ))}
        {(!posts || posts.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={ArrowRightLeft}
              title={t('No Posts Found', 'لا توجد منشورات')}
              hint={t('Be the first to post a capacity offer or request.', 'كن أول من ينشر عرض أو طلب طاقة إنتاجية.')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
