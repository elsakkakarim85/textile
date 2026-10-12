import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { tr, fmtMoney, fmtNumber, fmtDate, daysUntil } from '@/lib/i18n-inline';
import { PageHeader, StatCard, Pill, ProgressBar, DbOfflineBanner } from '@/components/cluster/ui';
import { ProcurementCommitForm } from '@/components/cluster/collab/ProcurementCommitForm';
import { ShoppingBag, Users, TrendingDown, Target, Building2, Calendar, Scale } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default async function ProcurementDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  if (!userId) redirect(`/${locale}/sign-in`);

  const { data: pool, ok } = await safeQuery(
    async () => {
      const p = await prisma.procurementPool.findUnique({
        where: { id },
        include: {
          organizer: true,
          commitments: {
            where: { status: { in: ['COMMITTED', 'FULFILLED'] } },
            include: { factory: true }
          }
        }
      });
      if (!p) return null;
      
      const committedQty = p.commitments.reduce((sum, c) => sum + Number(c.quantity), 0);
      return { ...p, committedQty };
    },
    null
  );

  if (ok && !pool) notFound();
  if (!pool) return <div className="container py-8"><DbOfflineBanner locale={locale} /></div>;

  const progressPct = Math.min(100, (pool.committedQty / Number(pool.targetQty)) * 100);
  const isOrganizer = pool.organizerId === userId;
  const myCommitment = pool.commitments.find((c: any) => c.factoryId === factory?.id);
  const isParticipant = !!myCommitment;

  // Calculate savings
  const benchmark = Number(pool.benchmarkUnitPrice || 0);
  const currentPrice = Number(pool.negotiatedUnitPrice || pool.targetUnitPrice || 0);
  const savingsPct = benchmark > 0 && currentPrice < benchmark 
    ? Math.round(((benchmark - currentPrice) / benchmark) * 100) 
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4 text-sm">
        <Link href={`/${locale}/cluster/procurement`} className="text-muted-foreground hover:underline">{t('Joint Procurement', 'الشراء المشترك')}</Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{pool.title}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Pill>{pool.category}</Pill>
            <Pill tone={pool.status === 'OPEN' ? 'emerald' : pool.status === 'NEGOTIATING' ? 'blue' : 'gray'}>
              {pool.status}
            </Pill>
          </div>
          <h1 className="text-2xl font-bold mb-2">{pool.title}</h1>
          <p className="text-muted-foreground max-w-2xl">{pool.description}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Card */}
          <Card className="p-6 border-primary/20 bg-card">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('Committed Volume', 'الحجم المؤكد')}</p>
                <div className="text-3xl font-bold">
                  {fmtNumber(locale, pool.committedQty)} <span className="text-lg text-muted-foreground font-normal">/ {fmtNumber(locale, Number(pool.targetQty))} {pool.uom}</span>
                </div>
              </div>
              <div className="text-end">
                <p className="text-sm text-muted-foreground mb-1">{t('Progress', 'التقدم')}</p>
                <div className="text-xl font-semibold text-primary">{Math.round(progressPct)}%</div>
              </div>
            </div>
            <ProgressBar value={progressPct} className="mb-4 h-3" />
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-4 h-4" />
                {pool.commitments.length} {t('Factories joined', 'مصانع مشاركة')}
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <Calendar className="w-4 h-4" />
                {daysUntil(pool.deadline)} {t('days left', 'أيام متبقية')}
              </span>
            </div>
          </Card>

          {/* Pricing Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Scale className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('Market Benchmark', 'متوسط سعر السوق')}</p>
                  <p className="text-xl font-semibold">{benchmark > 0 ? fmtMoney(locale, benchmark) : t('N/A', 'غير محدد')}</p>
                  <p className="text-xs text-muted-foreground mt-1">/{pool.uom}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">{t('Target Group Price', 'السعر المستهدف للمجموعة')}</p>
                  <p className="text-xl font-bold">{currentPrice > 0 ? fmtMoney(locale, currentPrice) : t('TBD', 'يحدد لاحقاً')}</p>
                  {savingsPct > 0 && (
                    <p className="text-xs text-emerald-600 font-medium mt-1 inline-flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> {t('Est. savings:', 'توفير مقدر:')} {savingsPct}%
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Participants List */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-lg">{t('Participants', 'المشاركون')}</h3>
            {isParticipant || isOrganizer ? (
              <div className="divide-y">
                {pool.commitments.map((c: any) => (
                  <div key={c.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{c.factory.name}</span>
                    </div>
                    <span className="font-semibold">{c.quantity} <span className="text-sm font-normal text-muted-foreground">{pool.uom}</span></span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>{t('Only participants can see the full list of factories.', 'يمكن للمشاركين فقط رؤية القائمة الكاملة للمصانع.')}</p>
                <p className="text-sm mt-1">{pool.commitments.length} {t('factories currently participating.', 'مصانع تشارك حالياً.')}</p>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-primary/20">
            <h3 className="font-semibold mb-4 text-lg">{t('Your Participation', 'مشاركتك')}</h3>
            {factory ? (
              <ProcurementCommitForm pool={pool} myCommitment={myCommitment} locale={locale} />
            ) : (
              <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-lg">
                {t('You must create a factory profile to participate in joint procurement.', 'يجب عليك إنشاء ملف مصنع للمشاركة في الشراء المشترك.')}
              </div>
            )}
          </Card>

          {isOrganizer && (
            <Card className="p-6 bg-muted/30">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{t('Organizer Controls', 'أدوات المنظم')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('You are the organizer of this pool. You can update the status once negotiations begin.', 'أنت منظم هذا التجمع. يمكنك تحديث الحالة بمجرد بدء المفاوضات.')}
              </p>
              <Link href={`/${locale}/cluster/procurement/${id}/edit`} className="text-sm text-primary hover:underline">
                {t('Manage Pool', 'إدارة التجمع')} &rarr;
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
