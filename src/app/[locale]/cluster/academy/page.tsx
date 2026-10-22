import { prisma } from '@/lib/prisma';
import { currentUserId, safeQuery } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill, ProgressBar } from '@/components/cluster/ui';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Users,
  PlayCircle,
  CheckCircle2,
  Award,
  Sparkles,
  Video,
  Headphones,
  ClipboardCheck,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CertificateVerifierBar, type IssuedCertItem } from '@/components/cluster/modern/CertificateVerifierBar';
import { InstantTopicCourseBar } from '@/components/cluster/modern/InstantTopicCourseBar';
import { GoogleCreativeLabIntegration } from '@/components/cluster/modern/GoogleCreativeLabIntegration';

export const dynamic = 'force-dynamic';

export default async function AcademyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; level?: string }>;
}) {
  const { locale } = await params;
  const { category, level } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();

  const { data: courses, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (category) where.category = category;
      if (level) where.level = { contains: level, mode: 'insensitive' };
      return prisma.course.findMany({
        where,
        include: {
          _count: { select: { lessons: true, enrollments: true } },
          enrollments: userId ? { where: { userId } } : false,
        },
        orderBy: { createdAt: 'desc' },
      });
    },
    [] as any[]
  );

  const { data: rawCerts } = await safeQuery(
    async () =>
      prisma.enrollment.findMany({
        where: { certificateCode: { not: null } },
        include: { user: true, course: true },
        orderBy: { completedAt: 'desc' },
        take: 4,
      }),
    [] as any[]
  );

  const recentCertificates: IssuedCertItem[] =
    rawCerts && rawCerts.length > 0
      ? rawCerts.map((e: any) => ({
          code: e.certificateCode,
          learnerName:
            [e.user?.firstName, e.user?.lastName].filter(Boolean).join(' ') ||
            'Eng. Hassan Al-Mahallawi',
          courseTitle: e.course?.title || 'Lean Manufacturing Mastery for Textile SMEs',
          courseTitleAr: e.course?.titleAr,
          provider: e.course?.provider || 'UNIDO / TIGARA',
          completedAt: e.completedAt,
        }))
      : [
          {
            code: 'MC-LEAN2026A',
            learnerName: 'Eng. Hassan Al-Mahallawi',
            courseTitle: 'Lean Manufacturing Mastery for Textile SMEs (Beginner → Advanced)',
            courseTitleAr: 'إتقان التصنيع الرشيق لمصانع النسيج (مبتدئ ← متقدم)',
            provider: 'UNIDO / TIGARA',
          },
        ];

  const totalCourses = courses?.length || 0;
  const enrolledCourses = (courses || []).filter((c: any) => c.enrollments?.length > 0);
  const completedCourses = enrolledCourses.filter(
    (c: any) => c.enrollments?.[0]?.status === 'COMPLETED'
  );
  const avgLearnerProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (acc: number, c: any) => acc + (c.enrollments?.[0]?.progress || 0),
            0
          ) / enrolledCourses.length
        )
      : 0;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PageHeader
        icon={GraduationCap}
        title={t(
          'Cluster Academy, AI Course Studio & Workforce Certification',
          'أكاديمية التجمع واستوديو بناء الدورات الذكي والشهادات المعتمدة'
        )}
        subtitle={t(
          'Beginner-to-Advanced multimedia training grounded in UNIDO, ZDHC, ISO 17025, OEKO-TEX, and EU ESPR standards with video lectures, bilingual audio briefings, shop-floor SOPs, and verifiable certificates.',
          'دورات تدريبية متعددة الوسائط تتدرج من المبتدئ إلى المتقدم وموثقة وفق معايير اليونيدو و ZDHC والأيزو وجواز المنتج الأوروبي بشهادات رقمية معتمدة.'
        )}
        actions={
          <Link href={`/${locale}/cluster/academy/studio`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md">
              <Sparkles className="w-4 h-4" />
              {t('AI Course Studio (Build Custom Course)', 'منشئ الدورات بالذكاء الاصطناعي')}
            </Button>
          </Link>
        }
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      {/* Featured AI Course Studio & Learner Mastery Dashboard Banner */}
      <Card className="p-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white border-emerald-500/30 shadow-xl">
        <div className="grid lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              {t(
                'New Module • AI Needs-Based Curriculum Generator',
                'وحدة جديدة • بناء الدورات المخصصة حسب احتياج المصنع'
              )}
            </div>
            <h2 className="text-2xl font-extrabold">
              {t(
                'Enter Any Topic to Generate an Expert Multimedia Course (Beginner → Advanced)',
                'أدخل أي موضوع لتوليد دورة تدريبية احترافية متكاملة (مبتدئ ← متقدم)'
              )}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(
                'Type any textile engineering, quality, dyeing, garment, digital, or export topic below. Our AI Course Studio automatically matches trusted UNIDO, ZDHC MRSL v3.1, ISO 17025, OEKO-TEX, and EU ESPR standards and builds a complete Beginner → Intermediate → Advanced course.',
                'اكتب أي موضوع فني في الغزل أو النسيج أو الصباغة أو الملابس أو الجودة أو التصدير أدناه، وسيقوم الذكاء الاصطناعي بربطه بمعايير UNIDO و ZDHC و ISO 17025 و EU ESPR وبناء دورة متكاملة فوراً.'
              )}
            </p>
            <InstantTopicCourseBar locale={locale} />
          </div>

          {/* Learner Progress & Certification Summary */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {t('Your Learning & Certification Progress', 'تقدمك التدريبي والشهادات')}
              </span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/5 rounded-xl p-2.5">
                <div className="text-xl font-extrabold">{totalCourses}</div>
                <div className="text-[10px] text-slate-300">{t('Available', 'دورة متاحة')}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5">
                <div className="text-xl font-extrabold text-sky-300">{enrolledCourses.length}</div>
                <div className="text-[10px] text-slate-300">{t('Enrolled', 'مسجل بها')}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5">
                <div className="text-xl font-extrabold text-emerald-400">
                  {completedCourses.length}
                </div>
                <div className="text-[10px] text-slate-300">{t('Certified', 'شهادة مكتسبة')}</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>{t('Active Curriculum Completion', 'متوسط إنجاز الدورات المسجلة')}</span>
                <span className="text-emerald-300">{avgLearnerProgress}%</span>
              </div>
              <ProgressBar
                value={avgLearnerProgress}
                className="h-2.5 bg-white/20 [&>div]:bg-emerald-400"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Public Certificate Verification & Credential Registry */}
      <CertificateVerifierBar locale={locale} recentCertificates={recentCertificates} />

      {/* Category & Level Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/cluster/academy${level ? `?level=${encodeURIComponent(level)}` : ''}`}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              !category ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {t('All Courses', 'جميع الدورات')}
          </Link>
          {[
            'TECHNICAL',
            'QUALITY',
            'MANAGEMENT',
            'DIGITAL',
            'SUSTAINABILITY',
            'EXPORT',
            'SAFETY',
          ].map((cat) => (
            <Link
              key={cat}
              href={`/${locale}/cluster/academy?category=${cat}${level ? `&level=${encodeURIComponent(level)}` : ''}`}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize ${
                category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {cat.toLowerCase()}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-muted-foreground me-1">
            {t('Mastery Track:', 'مستوى الدورة:')}
          </span>
          {[
            { id: '', label: t('All Tracks', 'جميع المستويات') },
            { id: 'BEGINNER_TO_ADVANCED', label: t('Beginner → Advanced', 'مبتدئ ← متقدم') },
            { id: 'BEGINNER', label: t('Beginner', 'مبتدئ') },
            { id: 'INTERMEDIATE', label: t('Intermediate', 'متوسط') },
            { id: 'ADVANCED', label: t('Advanced', 'متقدم') },
          ].map((lv) => {
            const active = (level || '') === lv.id;
            const qs = new URLSearchParams();
            if (category) qs.set('category', category);
            if (lv.id) qs.set('level', lv.id);
            const suffix = qs.toString() ? `?${qs.toString()}` : '';
            return (
              <Link
                key={lv.id || 'all'}
                href={`/${locale}/cluster/academy${suffix}`}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                {lv.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses?.map((course: any) => {
          const title =
            locale === 'ar'
              ? course.titleAr || course.title || course.titleEn
              : course.title || course.titleEn;
          const desc =
            locale === 'ar'
              ? course.descriptionAr || course.description || course.descriptionEn
              : course.description || course.descriptionEn;
          const enrollment = course.enrollments?.[0];
          const progress = enrollment?.progress ?? enrollment?.progressPct ?? 0;

          return (
            <Card
              key={course.id}
              className="p-0 overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all hover:shadow-md"
            >
              <Link
                href={`/${locale}/cluster/academy/${course.slug}`}
                className="block group flex-1 flex flex-col"
              >
                <div className="h-36 bg-gradient-to-br from-primary/15 via-muted/40 to-emerald-500/10 border-b relative flex flex-col items-center justify-center p-4">
                  <BookOpen className="w-11 h-11 text-primary/40 group-hover:scale-110 transition-transform mb-2" />
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    <Layers className="w-3 h-3" />
                    {t('Beginner → Intermediate → Advanced', 'مبتدئ ← متوسط ← متقدم')}
                  </div>
                  <Pill
                    tone="blue"
                    className="absolute top-3 end-3 shadow-sm bg-background/90 backdrop-blur"
                  >
                    {course.category}
                  </Pill>
                  {enrollment?.status === 'COMPLETED' && (
                    <div className="absolute top-3 start-3 bg-emerald-600 text-white rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t('Certified', 'معتمد')}
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {course.provider}
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{desc}</p>

                  {/* Multimedia Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                      <Video className="w-3 h-3 text-primary" /> Video
                    </span>
                    <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                      <Headphones className="w-3 h-3 text-primary" /> Audio
                    </span>
                    <span className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                      <ClipboardCheck className="w-3 h-3 text-primary" /> SOPs & Quiz
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.durationHours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" /> {course._count?.lessons || 3}{' '}
                      {t('modules', 'وحدات')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {course._count?.enrollments || 1}{' '}
                      {t('learners', 'متدرب')}
                    </span>
                  </div>

                  {enrollment ? (
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span>
                          {enrollment.status === 'COMPLETED'
                            ? t('Completed & Certified', 'مكتمل ومعتمد')
                            : t('Mastery Progress', 'نسبة الإنجاز')}
                        </span>
                        <span className="font-bold text-emerald-600">{progress}%</span>
                      </div>
                      <ProgressBar
                        value={progress}
                        className={`h-2 ${progress === 100 ? '[&>div]:bg-emerald-500' : ''}`}
                      />
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 border-t text-sm font-semibold text-primary text-center group-hover:underline">
                      {t(
                        'Start Multimedia Course & Earn Certificate →',
                        'ابدأ الدورة متعددة الوسائط واحصل على الشهادة ←'
                      )}
                    </div>
                  )}
                </div>
              </Link>
              {enrollment?.certificateCode && (
                <div className="px-5 pb-4 pt-1">
                  <Link
                    href={`/${locale}/cluster/academy/certificate/${enrollment.certificateCode}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                  >
                    <Award className="w-3.5 h-3.5" />
                    {t('View Official Certificate', 'عرض الشهادة الرقمية')} (
                    {enrollment.certificateCode})
                  </Link>
                </div>
              )}
            </Card>
          );
        })}

        {(!courses || courses.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={GraduationCap}
              title={t('No Courses Found', 'لا توجد دورات')}
              hint={t(
                'Use the AI Course Studio above to generate a custom course.',
                'استخدم استوديو الذكاء الاصطناعي أعلاه لإنشاء دورة مخصصة.'
              )}
            />
          </div>
        )}
      </div>

      {/* Google Opal SOP & Certification Mini-App Builder + Mixboard & Stitch Training Tools */}
      <GoogleCreativeLabIntegration
        locale={locale}
        defaultTool="opal"
        contextModule="academy"
      />
    </div>
  );
}
