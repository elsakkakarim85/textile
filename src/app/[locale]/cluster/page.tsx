import Link from 'next/link';
import {
  Network, ShoppingCart, Factory as FactoryIcon, Handshake, FlaskConical, Gauge, GraduationCap, Leaf,
  Landmark, MessagesSquare, CalendarDays, UserCheck, Megaphone, BarChart3, ArrowUpRight, Sparkles, CheckCircle2, Globe2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { safeQuery, currentUserId, findUserFactory } from '@/server/cluster';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { PageHeader, StatCard, DbOfflineBanner } from '@/components/cluster/ui';
import { InstantBrandStudioBar } from '@/components/cluster/modern/InstantBrandStudioBar';
import { InstantExportIntelligenceBar } from '@/components/cluster/modern/InstantExportIntelligenceBar';

export const dynamic = 'force-dynamic';

type Mod = { href: string; icon: LucideIcon; en: string; ar: string; descEn: string; descAr: string; stat?: number };

export default async function ClusterHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const base = `/${locale}/cluster`;

  const now = new Date();
  const { data: c, ok } = await safeQuery(
    async () => {
      const [factories, pools, capacity, consortia, facilities, courses, programs, threads, events, experts, assessments, completions] =
        await Promise.all([
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
      return { factories, pools, capacity, consortia, facilities, courses, programs, threads, events, experts, assessments, completions };
    },
    { factories: 42, pools: 4, capacity: 6, consortia: 2, facilities: 5, courses: 6, programs: 6, threads: 8, events: 4, experts: 3, assessments: 12, completions: 18 },
  );

  // Personalized "next best actions" for the signed-in member
  const userId = await currentUserId();
  const factory = await findUserFactory(userId);
  const { data: me } = await safeQuery(
    async () => {
      if (!factory) return null;
      const since = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const [assessment, susRecent, commitments, posts] = await Promise.all([
        prisma.maturityAssessment.findFirst({ where: { factoryId: factory.id }, orderBy: { createdAt: 'desc' }, select: { overallScore: true, createdAt: true } }),
        prisma.sustainabilityRecord.count({ where: { factoryId: factory.id, period: { gte: since } } }),
        prisma.poolCommitment.count({ where: { factoryId: factory.id, status: { not: 'WITHDRAWN' } } }),
        prisma.capacityPost.count({ where: { factoryId: factory.id } }),
      ]);
      return { assessment, susRecent, commitments, posts };
    },
    null,
  );

  const groups: { titleEn: string; titleAr: string; tone: string; mods: Mod[] }[] = [
    {
      titleEn: 'Collaborate', titleAr: 'التعاون', tone: 'from-sky-500/15',
      mods: [
        { href: 'procurement', icon: ShoppingCart, en: 'Joint Procurement', ar: 'الشراء المشترك', descEn: 'Pool demand for yarn, dyes, spare parts and energy to unlock bulk prices.', descAr: 'تجميع الطلب على الغزل والصبغات وقطع الغيار والطاقة للحصول على أسعار الجملة.', stat: c.pools },
        { href: 'capacity', icon: FactoryIcon, en: 'Capacity Exchange', ar: 'تبادل الطاقات الإنتاجية', descEn: 'Sell idle machine capacity or find trusted subcontractors in the cluster.', descAr: 'اعرض طاقتك المعطلة أو اعثر على مقاول باطن موثوق داخل التجمع.', stat: c.capacity },
        { href: 'consortia', icon: Handshake, en: 'Export Consortia', ar: 'التحالفات التصديرية', descEn: 'Combine SMEs along the value chain to win orders too large for one firm.', descAr: 'تحالف المصانع الصغيرة عبر سلسلة القيمة للفوز بطلبيات أكبر من قدرة مصنع واحد.', stat: c.consortia },
        { href: 'facilities', icon: FlaskConical, en: 'Shared Facilities', ar: 'المرافق المشتركة', descEn: 'Book the testing lab, CAD studio, effluent plant and training rooms.', descAr: 'احجز معمل الاختبارات واستوديو التصميم ومحطة المعالجة وقاعات التدريب.', stat: c.facilities },
      ],
    },
    {
      titleEn: 'Modernize & Export Globally', titleAr: 'التحديث والتصدير العالمي', tone: 'from-emerald-500/15',
      mods: [
        { href: 'export-intelligence', icon: Globe2, en: 'AI Export Intelligence, Buyers & NTMs', ar: 'ذكاء التصدير والمشترين والمواصفات الدولية', descEn: 'Market studies, entry strategies, live international tenders, export promotion plans, verified buyer outreach, and country NTM standards.', descAr: 'دراسات الأسواق، استراتيجيات الدخول، المناقصات الدولية، خطط الترويج، كشاف المشترين الموثوقين، وتحليل المواصفات القياسية والعوائق غير الجمركية.' },
        { href: 'maturity', icon: Gauge, en: 'Digital Maturity', ar: 'النضج الرقمي', descEn: 'Industry 4.0 readiness assessment with a personalized 90-day roadmap.', descAr: 'تقييم الجاهزية للصناعة 4.0 مع خارطة طريق مخصصة لمدة 90 يومًا.', stat: c.assessments },
        { href: 'academy', icon: GraduationCap, en: 'Cluster Academy', ar: 'أكاديمية التجمع', descEn: 'Practical courses for workers and managers with verifiable certificates.', descAr: 'دورات عملية للعمال والمديرين بشهادات قابلة للتحقق.', stat: c.courses },
        { href: 'academy/studio', icon: Sparkles, en: 'AI Course Studio', ar: 'منشئ الدورات الذكي', descEn: 'Generate Beginner-to-Advanced multimedia courses from your factory needs & authorized UNIDO/ZDHC/ISO standards.', descAr: 'إنشاء دورات متعددة الوسائط (مبتدئ ← متقدم) حسب احتياجات مصنعك وبمراجع دولية معتمدة.' },
        { href: 'brand-studio', icon: Megaphone, en: 'AI Brand & Marketing Studio', ar: 'استوديو الهوية والتسويق الذكي', descEn: 'Build textile brands, automate omnichannel campaigns, and generate promo videos, photos, brochures, flyers & posters.', descAr: 'إنشاء العلامات التجارية، أتمتة الخطط التسويقية، وتوليد الفيديوهات والصور والبروشورات والفلايرز والبوسترات.' },
        { href: 'sustainability', icon: Leaf, en: 'Sustainability & CBAM', ar: 'الاستدامة و CBAM', descEn: 'Track energy, water, chemicals and CO₂e; get EU-market ready.', descAr: 'تتبع الطاقة والمياه والكيماويات والانبعاثات واستعد للسوق الأوروبي.' },
        { href: 'funding', icon: Landmark, en: 'Funding & Grants', ar: 'التمويل والمنح', descEn: 'Grants, green loans and technical assistance matched to your gaps.', descAr: 'منح وقروض خضراء ودعم فني مطابق لاحتياجاتك.', stat: c.programs },
      ],
    },
    {
      titleEn: 'Community', titleAr: 'المجتمع', tone: 'from-violet-500/15',
      mods: [
        { href: 'forum', icon: MessagesSquare, en: 'Forum & Q&A', ar: 'المنتدى والأسئلة', descEn: 'Ask peers, share know-how, solve technical problems together.', descAr: 'اسأل زملاءك وشارك الخبرات وحلّوا المشكلات الفنية معًا.', stat: c.threads },
        { href: 'events', icon: CalendarDays, en: 'Events', ar: 'الفعاليات', descEn: 'Workshops, B2B matchmaking days, trade-fair delegations, webinars.', descAr: 'ورش عمل وأيام لقاءات أعمال وبعثات معارض وندوات عبر الإنترنت.', stat: c.events },
        { href: 'experts', icon: UserCheck, en: 'Experts & Mentors', ar: 'الخبراء والموجّهون', descEn: 'Verified consultants and free mentorship hours for cluster SMEs.', descAr: 'استشاريون معتمدون وساعات توجيه مجانية للمصانع الصغيرة.', stat: c.experts },
        { href: 'announcements', icon: Megaphone, en: 'Announcements', ar: 'الإعلانات', descEn: 'Official news and calls from the cluster management.', descAr: 'الأخبار والدعوات الرسمية من إدارة التجمع.' },
      ],
    },
  ];

  const actions: { done: boolean; en: string; ar: string; href: string }[] = factory
    ? [
        { done: !!me?.assessment, en: 'Take the digital maturity assessment', ar: 'أكمل تقييم النضج الرقمي', href: 'maturity' },
        { done: (me?.susRecent ?? 0) > 0, en: "Log last month's energy & water data", ar: 'سجّل بيانات الطاقة والمياه للشهر الماضي', href: 'sustainability' },
        { done: (me?.commitments ?? 0) > 0, en: 'Join a joint procurement pool', ar: 'انضم إلى مجموعة شراء مشترك', href: 'procurement' },
        { done: (me?.posts ?? 0) > 0, en: 'Post idle capacity or a subcontracting need', ar: 'انشر طاقة معطلة أو حاجة لمقاول باطن', href: 'capacity' },
      ]
    : [];
  const doneCount = actions.filter((a) => a.done).length;

  return (
    <div className="container mx-auto py-8 px-4">
      {!ok && <DbOfflineBanner locale={locale} />}
      <PageHeader
        icon={Network}
        title={t('Mahalla Cluster Hub', 'مركز تجمع المحلة')}
        subtitle={t(
          'One place for cluster members to collaborate, share resources, modernize operations and grow exports together.',
          'منصة واحدة لأعضاء التجمع للتعاون وتقاسم الموارد وتحديث العمليات وتنمية الصادرات معًا.',
        )}
        actions={
          <Link href={`${base}/observatory`} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <BarChart3 className="w-4 h-4" /> {t('Cluster Observatory', 'مرصد التجمع')}
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label={t('Approved member factories', 'المصانع الأعضاء المعتمدة')} value={fmtNumber(locale, c.factories)} icon={FactoryIcon} />
        <StatCard label={t('Active collaborations', 'التعاونات النشطة')} value={fmtNumber(locale, c.pools + c.capacity + c.consortia)} icon={Handshake} tone="blue" />
        <StatCard label={t('Maturity assessments', 'تقييمات النضج')} value={fmtNumber(locale, c.assessments)} icon={Gauge} tone="green" />
        <StatCard label={t('Certificates earned', 'الشهادات المكتسبة')} value={fmtNumber(locale, c.completions)} icon={GraduationCap} tone="amber" />
      </div>

      <div className="mb-10 space-y-6">
        <InstantExportIntelligenceBar locale={locale} />
        <InstantBrandStudioBar locale={locale} />
      </div>

      {factory && (
        <section className="mb-10 rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> {t(`Next steps for ${factory.name}`, `الخطوات التالية لـ ${factory.name}`)}
            </h2>
            <span className="text-sm text-muted-foreground">{fmtNumber(locale, doneCount)}/{fmtNumber(locale, actions.length)}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {actions.map((a) => (
              <Link key={a.href} href={`${base}/${a.href}`} className={`flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 ${a.done ? 'opacity-60' : ''}`}>
                <CheckCircle2 className={`w-5 h-5 shrink-0 ${a.done ? 'text-emerald-600' : 'text-muted-foreground/40'}`} />
                <span className={a.done ? 'line-through' : ''}>{t(a.en, a.ar)}</span>
                <ArrowUpRight className="w-4 h-4 ms-auto text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g.titleEn}>
            <h2 className="text-xl font-bold mb-4">{t(g.titleEn, g.titleAr)}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {g.mods.map((m) => {
                const Icon = m.icon;
                return (
                  <Link key={m.href} href={`${base}/${m.href}`} className={`group relative rounded-xl border bg-gradient-to-br ${g.tone} to-transparent p-5 transition-all hover:shadow-md hover:-translate-y-0.5`}>
                    <div className="flex items-start justify-between">
                      <span className="rounded-lg bg-background/80 border p-2.5"><Icon className="w-5 h-5 text-primary" /></span>
                      {m.stat !== undefined && (
                        <span className="rounded-full bg-background/80 border px-2.5 py-0.5 text-xs font-semibold tabular-nums">{fmtNumber(locale, m.stat)}</span>
                      )}
                    </div>
                    <h3 className="mt-4 font-semibold flex items-center gap-1">
                      {t(m.en, m.ar)}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t(m.descEn, m.descAr)}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
