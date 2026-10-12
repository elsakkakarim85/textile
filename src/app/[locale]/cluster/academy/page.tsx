import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, safeQuery } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill, ProgressBar } from '@/components/cluster/ui';
import { GraduationCap, BookOpen, Clock, Users, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default async function AcademyPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ category?: string }> }) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  if (!userId) redirect(`/${locale}/sign-in`);

  const { data: courses, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (category) where.category = category;
      return prisma.course.findMany({
        where,
        include: {
          _count: { select: { lessons: true, enrollments: true } },
          enrollments: { where: { userId } }
        },
        orderBy: { createdAt: 'desc' }
      });
    },
    // Fallback data
    [
      { id: '1', slug: 'lean-manufacturing', titleEn: 'Lean Manufacturing for Textiles', titleAr: 'التصنيع الرشيق لقطاع النسيج', descriptionEn: 'Reduce waste and improve efficiency.', descriptionAr: 'تقليل الهدر وتحسين الكفاءة.', provider: 'UNIDO', durationHours: 12, level: 'INTERMEDIATE', category: 'MANAGEMENT', _count: { lessons: 8, enrollments: 145 }, enrollments: [] },
      { id: '2', slug: 'zdhc-basics', titleEn: 'ZDHC Chemical Management Basics', titleAr: 'أساسيات إدارة الكيماويات ZDHC', descriptionEn: 'Safe handling of dyes and chemicals.', descriptionAr: 'التعامل الآمن مع الأصباغ والكيماويات.', provider: 'TIGARA', durationHours: 6, level: 'BEGINNER', category: 'SUSTAINABILITY', _count: { lessons: 4, enrollments: 89 }, enrollments: [{ progressPct: 100, status: 'COMPLETED' }] }
    ]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={GraduationCap}
        title={t('Cluster Academy', 'أكاديمية التجمع')}
        subtitle={t('Upskill your workforce with specialized courses in textiles, digital tools, and sustainability.', 'ارفع كفاءة العاملين لديك من خلال دورات متخصصة في الغزل والنسيج، الأدوات الرقمية، والاستدامة.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex flex-wrap gap-2 mb-8">
        <Link href={`/${locale}/cluster/academy`} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${!category ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
          {t('All Courses', 'جميع الدورات')}
        </Link>
        {['TECHNICAL', 'MANAGEMENT', 'DIGITAL', 'SUSTAINABILITY', 'EXPORT'].map(cat => (
          <Link key={cat} href={`/${locale}/cluster/academy?category=${cat}`} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap capitalize ${category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
            {t(cat.toLowerCase(), cat.toLowerCase())}
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses?.map((course: any) => {
          const title = locale === 'ar' ? (course.titleAr || course.titleEn) : course.titleEn;
          const desc = locale === 'ar' ? (course.descriptionAr || course.descriptionEn) : course.descriptionEn;
          const enrollment = course.enrollments?.[0];

          return (
            <Link key={course.id} href={`/${locale}/cluster/academy/${course.slug}`} className="block group">
              <Card className="p-0 overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all hover:shadow-md">
                <div className="h-32 bg-muted/50 border-b relative flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                  <Pill className="absolute top-3 right-3 shadow-sm bg-background/90 backdrop-blur">
                    {course.category}
                  </Pill>
                  {enrollment?.status === 'COMPLETED' && (
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">{course.provider}</div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{desc}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.durationHours}h</span>
                    <span className="flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5" /> {course._count?.lessons || 0} {t('lessons', 'دروس')}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course._count?.enrollments || 0}</span>
                  </div>

                  {enrollment ? (
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span>{enrollment.status === 'COMPLETED' ? t('Completed', 'مكتمل') : t('In Progress', 'قيد التقدم')}</span>
                        <span>{enrollment.progressPct}%</span>
                      </div>
                      <ProgressBar value={enrollment.progressPct} className={`h-2 ${enrollment.progressPct === 100 ? '[&>div]:bg-emerald-500' : ''}`} />
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 border-t text-sm font-medium text-primary text-center group-hover:underline">
                      {t('Enroll Now', 'سجل الآن')}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
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
