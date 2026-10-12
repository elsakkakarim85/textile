import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { ConsortiumForm } from '@/components/cluster/collab/ConsortiumForm';
import { Network, Building2, Target, Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default async function ConsortiaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  if (!userId) redirect(`/${locale}/sign-in`);

  const { data: consortia, ok } = await safeQuery(
    async () => {
      return prisma.consortium.findMany({
        include: {
          members: {
            where: { status: 'ACCEPTED' },
            include: { factory: { select: { name: true, capabilities: true } } },
          },
          rfq: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' }
      });
    },
    // Fallback data
    [
      { 
        id: '1', name: 'Mahalla Denim Export Alliance', description: 'Targeting European buyers with integrated spinning to sewing.', status: 'ACTIVE', targetMarket: 'EU', 
        members: [{ factory: { name: 'Al-Rowad Textiles' } }, { factory: { name: 'Misr Spinning' } }] 
      }
    ]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Network}
        title={t('Export Consortia', 'تحالفات التصدير')}
        subtitle={t('Combine capabilities with other SMEs to bid on large RFQs and enter new markets.', 'اجمع قدراتك مع مصانع أخرى للمنافسة على طلبات كبيرة ودخول أسواق جديدة.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="mb-8">
        {factory ? (
          <ConsortiumForm locale={locale} />
        ) : (
          <div className="bg-amber-50 p-4 rounded-lg text-amber-700 text-sm">
            {t('You must create a factory profile to form a consortium.', 'يجب عليك إنشاء ملف مصنع لتشكيل تحالف.')}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consortia?.map((c: any) => (
          <Link key={c.id} href={`/${locale}/cluster/consortia/${c.id}`} className="block group">
            <Card className="p-6 h-full flex flex-col hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <Pill tone={c.status === 'ACTIVE' ? 'emerald' : c.status === 'FORMING' ? 'blue' : 'gray'}>
                  {c.status}
                </Pill>
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{c.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">{c.description}</p>
              
              <div className="space-y-3 text-sm mb-4">
                {c.targetMarket && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="w-4 h-4 shrink-0" />
                    <span>{t('Target:', 'الهدف:')} {c.targetMarket}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>{c.members.length} {t('Active Members', 'أعضاء نشطين')}</span>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between text-sm font-medium text-primary">
                {t('View Details', 'عرض التفاصيل')}
                <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          </Link>
        ))}
        {(!consortia || consortia.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={Network}
              title={t('No Consortia Found', 'لا توجد تحالفات')}
              hint={t('Start a new consortium to combine forces with other factories.', 'ابدأ تحالفاً جديداً لتوحيد جهودك مع المصانع الأخرى.')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
