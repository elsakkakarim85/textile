import Link from 'next/link';
import {
  Network,
  Factory as FactoryIcon,
  Handshake,
  Gauge,
  GraduationCap,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { safeQuery, currentUserId, findUserFactory } from '@/server/cluster';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { PageHeader, StatCard, DbOfflineBanner } from '@/components/cluster/ui';
import { ClusterHubRoleDirectory } from '@/components/cluster/ClusterHubRoleDirectory';

export const dynamic = 'force-dynamic';

export default async function ClusterHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const base = `/${locale}/cluster`;

  const now = new Date();
  const { data: c, ok } = await safeQuery(
    async () => {
      const [
        factories,
        pools,
        capacity,
        consortia,
        facilities,
        courses,
        programs,
        threads,
        events,
        experts,
        assessments,
        completions,
      ] = await Promise.all([
        prisma.factory.count({ where: { status: 'APPROVED', deletedAt: null } }),
        prisma.procurementPool.count({ where: { status: { in: ['OPEN', 'NEGOTIATING'] } } }),
        prisma.capacityPost.count({ where: { status: 'OPEN' } }),
        prisma.consortium.count({ where: { status: { not: 'CLOSED' } } }),
        prisma.sharedFacility.count({ where: { isActive: true } }),
        prisma.course.count({ where: { isPublished: true } }),
        prisma.fundingProgram.count({ where: { isActive: true } }),
        prisma.forumThread.count({ where: { deletedAt: null } }),
        prisma.clusterEvent.count({ where: { startsAt: { gte: now } } }),
        prisma.expertProfile.count(),
        prisma.maturityAssessment.count(),
        prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
      ]);
      return {
        factories,
        pools,
        capacity,
        consortia,
        facilities,
        courses,
        programs,
        threads,
        events,
        experts,
        assessments,
        completions,
      };
    },
    {
      factories: 42,
      pools: 4,
      capacity: 6,
      consortia: 2,
      facilities: 5,
      courses: 6,
      programs: 6,
      threads: 8,
      events: 4,
      experts: 3,
      assessments: 12,
      completions: 18,
    }
  );

  // Personalized "next best actions" for the signed-in member
  const userId = await currentUserId();
  const factory = await findUserFactory(userId);
  const { data: me } = await safeQuery(
    async () => {
      if (!factory) return null;
      const since = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const [assessment, susRecent, commitments, posts] = await Promise.all([
        prisma.maturityAssessment.findFirst({
          where: { factoryId: factory.id },
          orderBy: { createdAt: 'desc' },
          select: { overallScore: true, createdAt: true },
        }),
        prisma.sustainabilityRecord.count({ where: { factoryId: factory.id, period: { gte: since } } }),
        prisma.poolCommitment.count({ where: { factoryId: factory.id, status: { not: 'WITHDRAWN' } } }),
        prisma.capacityPost.count({ where: { factoryId: factory.id } }),
      ]);
      return { assessment, susRecent, commitments, posts };
    },
    null
  );

  const actions: { done: boolean; en: string; ar: string; href: string }[] = factory
    ? [
        {
          done: !!me?.assessment,
          en: 'Take the 2-minute factory readiness checkup',
          ar: 'أكمل التقييم السريع للمصنع (في دقيقتين)',
          href: 'maturity',
        },
        {
          done: (me?.susRecent ?? 0) > 0,
          en: "Log last month's energy & water usage",
          ar: 'سجّل استهلاك الطاقة والمياه للشهر الماضي',
          href: 'sustainability',
        },
        {
          done: (me?.commitments ?? 0) > 0,
          en: 'Join a wholesale buying group to save 12%–18%',
          ar: 'انضم إلى مجموعة شراء بالجملة لتوفير ١٢٪–١٨٪',
          href: 'procurement',
        },
        {
          done: (me?.posts ?? 0) > 0,
          en: 'List idle machine hours or request a partner factory',
          ar: 'اعرض ماكيناتك الفائضة أو اطلب مصنعاً شريكاً',
          href: 'capacity',
        },
      ]
    : [];
  const doneCount = actions.filter((a) => a.done).length;

  return (
    <div className="container mx-auto py-8 px-4">
      {!ok && <DbOfflineBanner locale={locale} />}
      <PageHeader
        icon={Network}
        manualId="cluster-hub"
        title={t('Mahalla Cluster Services Center', 'المركز الرئيسي لخدمات مصانع المحلة')}
        subtitle={t(
          'All 17 cluster services in one place — filter by your role below, or click any card to start in 3 simple steps.',
          'جميع خدمات التجمع في مكان واحد سهل — اختر دورك بالأسفل أو اضغط على أي بطاقة للبدء في ٣ خطوات بسيطة.'
        )}
        actions={
          <Link
            href={`${base}/observatory`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 shadow-xs"
          >
            <BarChart3 className="w-4 h-4" /> {t('Cluster Statistics', 'إحصائيات التجمع')}
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label={t('Approved member factories', 'المصانع الأعضاء المعتمدة')}
          value={fmtNumber(locale, c.factories)}
          icon={FactoryIcon}
        />
        <StatCard
          label={t('Active collaborations', 'التعاونات النشطة بين المصانع')}
          value={fmtNumber(locale, c.pools + c.capacity + c.consortia)}
          icon={Handshake}
          tone="blue"
        />
        <StatCard
          label={t('Factory assessments', 'تقييمات المصانع المنفذة')}
          value={fmtNumber(locale, c.assessments)}
          icon={Gauge}
          tone="green"
        />
        <StatCard
          label={t('Certificates earned', 'شهادات التدريب المكتسبة')}
          value={fmtNumber(locale, c.completions)}
          icon={GraduationCap}
          tone="amber"
        />
      </div>

      {factory && (
        <section className="mb-8 rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-black flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />{' '}
              {t(`Recommended Next Steps for ${factory.name}`, `الخطوات المقترحة التالية لـ ${factory.name}`)}
            </h2>
            <span className="text-sm font-bold text-muted-foreground">
              {fmtNumber(locale, doneCount)}/{fmtNumber(locale, actions.length)}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={`${base}/${a.href}`}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-sm font-bold transition-colors hover:bg-muted/50 ${
                  a.done ? 'opacity-60' : ''
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 shrink-0 ${a.done ? 'text-emerald-600' : 'text-muted-foreground/40'}`}
                />
                <span className={a.done ? 'line-through' : ''}>{t(a.en, a.ar)}</span>
                <ArrowUpRight className="w-4 h-4 ms-auto text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Role & Search Directory */}
      <ClusterHubRoleDirectory locale={locale} counts={c} />
    </div>
  );
}
