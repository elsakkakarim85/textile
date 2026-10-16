import { prisma } from '@/lib/prisma';
import { currentUserId, safeQuery } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill, ProgressBar } from '@/components/cluster/ui';
import { GraduationCap, BookOpen, Clock, Users, PlayCircle, CheckCircle2, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AcademyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();

  const { data: courses, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (category) where.category = category;
      return prisma.course.findMany({
        where,
        include: {
          _count: { select: { lessons: true, enrollments: true } },
          enrollments: userId ? { where: { userId } } : false,
        },
        orderBy: { createdAt: 'desc' },
      });
    },
    [
      {
        id: '1',
        slug: 'lean-manufacturing',
        title: 'Lean Manufacturing for Textiles',
        titleAr: 'التصنيع الرشيق لقطاع النسيج',
        description: 'Reduce waste and improve efficiency in spinning and weaving.',
        descriptionAr: 'تقليل الهدر وتحسين الكفاءة في الغزل والنسيج.',
        provider: 'UNIDO / TIGARA',
        durationHours: 12,
        level: 'INTERMEDIATE',
        category: 'MANAGEMENT',
        _count: { lessons: 3, enrollments: 145 },
        enrollments: [],
      },
      {
        id: '2',
        slug: 'zdhc-basics',
        title: 'ZDHC Chemical Management Basics',
        titleAr: 'أساسيات إدارة الكيماويات ZDHC',
        description: 'Safe handling of dyes and chemicals for EU export compliance.',
        descriptionAr: 'التعامل الآمن مع الأصباغ والكيماويات للتوافق مع التصدير الأوروبي.',
        provider: 'TIGARA',
        durationHours: 6,
        level: 'BEGINNER',
        category: 'SUSTAINABILITY',
        _count: { lessons: 3, enrollments: 89 },
        enrollments: [{ progress: 100, status: 'COMPLETED', certificateCode: 'MC-ZDHC-2026' }],
      },
    ] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={GraduationCap}
        title={t('Cluster Academy & Workforce Upskilling', 'أكاديمية التجمع وتأهيل الكوادر')}
        subtitle={t(
          'Practical technical, digital, and sustainability courses for Mahalla engineers, supervisors, and managers with verifiable certificates.',
          'دورات عملية متخصصة في الغزل والنسيج، الأدوات الرقمية، ومعايير الاستدامة والتصدير بشهادات رقمية موثقة.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`/${locale}/cluster/academy`}
          className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
            !category ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {t('All Courses', 'جميع الدورات')}
        </Link>
        {['TECHNICAL', 'QUALITY', 'MANAGEMENT', 'DIGITAL', 'SUSTAINABILITY', 'EXPORT', 'SAFETY'].map((cat) => (
          <Link
            key={cat}
            href={`/${locale}/cluster/academy?category=${cat}`}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap capitalize ${
              category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {cat.toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses?.map((course: any) => {
          const title = locale === 'ar' ? course.titleAr || course.title || course.titleEn : course.title || course.titleEn;
          const desc =
            locale === 'ar'
              ? course.descriptionAr || course.description || course.descriptionEn
              : course.description || course.descriptionEn;
          const enrollment = course.enrollments?.[0];
          const progress = enrollment?.progress ?? enrollment?.progressPct ?? 0;

          return (
            <Card key={course.id} className="p-0 overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all hover:shadow-md">
              <Link href={`/${locale}/cluster/academy/${course.slug}`} className="block group flex-1 flex flex-col">
                <div className="h-32 bg-gradient-to-br from-primary/15 via-muted/40 to-emerald-500/10 border-b relative flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform" />
                  <Pill tone="blue" className="absolute top-3 end-3 shadow-sm bg-background/90 backdrop-blur">
                    {course.category}
                  </Pill>
                  {enrollment?.status === 'COMPLETED' && (
                    <div className="absolute top-3 start-3 bg-emerald-600 text-white rounded-full px-2.5 py-0.5 text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t('Certified', 'معتمد')}
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">{course.provider}</div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{desc}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.durationHours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" /> {course._count?.lessons || 3} {t('modules', 'وحدات')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {course._count?.enrollments || 12} {t('learners', 'متدرب')}
                    </span>
                  </div>

                  {enrollment ? (
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span>{enrollment.status === 'COMPLETED' ? t('Completed', 'مكتمل') : t('In Progress', 'قيد الدراسة')}</span>
                        <span>{progress}%</span>
                      </div>
                      <ProgressBar value={progress} className={`h-2 ${progress === 100 ? '[&>div]:bg-emerald-500' : ''}`} />
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 border-t text-sm font-semibold text-primary text-center group-hover:underline">
                      {t('Start Course & Earn Certificate →', 'ابدأ الدورة واحصل على الشهادة ←')}
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
                    {t('View Certificate', 'عرض الشهادة الرقمية')} ({enrollment.certificateCode})
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
              hint={t('Try adjusting your category filter.', 'حاول تغيير تصنيف البحث.')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
