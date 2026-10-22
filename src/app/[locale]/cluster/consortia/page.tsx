import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { ConsortiumForm } from '@/components/cluster/collab/ConsortiumForm';
import { GoogleCreativeLabIntegration } from '@/components/cluster/modern/GoogleCreativeLabIntegration';
import { Network, Target, Users, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ConsortiaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

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
        orderBy: { createdAt: 'desc' },
      });
    },
    [
      {
        id: '1',
        name: 'Mahalla Denim Export Alliance',
        description: 'Targeting European buyers with integrated spinning to sewing.',
        status: 'ACTIVE',
        targetMarket: 'EU',
        members: [
          { factory: { name: 'Al-Rowad Textiles', capabilities: ['dyeing', 'finishing'] } },
          { factory: { name: 'Misr Spinning', capabilities: ['spinning', 'weaving'] } },
        ],
      },
    ] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Network}
        title={t('Export Consortia', 'التحالفات التصديرية')}
        subtitle={t(
          'Combine capabilities with other Mahalla SMEs along the textile value chain to bid jointly on large international orders.',
          'اجمع قدرات مصنعك مع المصانع الأخرى عبر سلسلة القيمة للمنافسة بشكل مشترك على الطلبيات التصديرية الكبرى.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="mb-8">
        <ConsortiumForm locale={locale} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consortia?.map((c: any) => (
          <Link key={c.id} href={`/${locale}/cluster/consortia/${c.id}`} className="block group">
            <Card className="p-6 h-full flex flex-col hover:border-primary/50 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <Pill tone={c.status === 'ACTIVE' ? 'emerald' : c.status === 'FORMING' ? 'blue' : 'gray'}>
                  {c.status}
                </Pill>
                {c.targetMarket && (
                  <Pill tone="purple">
                    <Target className="w-3 h-3 me-1" /> {c.targetMarket}
                  </Pill>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{c.name}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">{c.description}</p>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4 shrink-0 text-primary" />
                  <span className="font-medium">
                    {c.members.length} {t('Member Factories', 'مصانع أعضاء')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.members.map((m: any, idx: number) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded bg-muted">
                      {m.factory?.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between text-sm font-semibold text-primary">
                {t('Open Consortium Workspace', 'فتح مساحة عمل التحالف')}
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
              hint={t('Start a new consortium above to combine forces with other factories.', 'ابدأ تحالفاً جديداً أعلاه لتوحيد جهودك مع المصانع الأخرى.')}
            />
          </div>
        )}
      </div>

      {/* Google Pomelli Joint-Brand Export Campaign & Google Opal Consortium Quoter */}
      <div className="mt-10">
        <GoogleCreativeLabIntegration
          locale={locale}
          defaultTool="pomelli"
          contextModule="consortia"
        />
      </div>
    </div>
  );
}
