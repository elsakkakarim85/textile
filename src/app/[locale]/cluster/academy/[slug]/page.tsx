import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { currentUserId, safeQuery } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, Pill, DbOfflineBanner } from '@/components/cluster/ui';
import { AcademyLessonViewer } from '@/components/cluster/modern/AcademyLessonViewer';
import { GraduationCap, Clock, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const userId = await currentUserId();

  const { data: course, ok } = await safeQuery(
    async () => {
      return prisma.course.findUnique({
        where: { slug },
        include: {
          lessons: { orderBy: { position: 'asc' } },
          enrollments: userId ? { where: { userId } } : false,
          _count: { select: { enrollments: true, lessons: true } },
        },
      });
    },
    null
  );

  if (ok && !course) notFound();
  if (!course) {
    return (
      <div className="container py-8">
        <DbOfflineBanner locale={locale} />
      </div>
    );
  }

  const title = locale === 'ar' ? course.titleAr || course.title : course.title;
  const desc = locale === 'ar' ? course.descriptionAr || course.description : course.description;
  const enrollment = (course as any).enrollments?.[0] || null;

  const fallbackLessons =
    course.lessons.length > 0
      ? course.lessons
      : [
          {
            id: `${course.id}-l1`,
            position: 1,
            title: 'Module 1: Core Principles & Mahalla Benchmarks',
            titleAr: 'الوحدة ١: المبادئ الأساسية ومعايير تجمع المحلة',
            durationMin: 20,
            content:
              '1. Overview of international textile standards and how Mahalla SMEs can reduce defect rates by 35%.\n\n2. Key Performance Indicators (KPIs): Right-First-Time (RFT), Overall Equipment Effectiveness (OEE), and specific water/energy consumption.\n\n3. Practical checklist for shop-floor supervisors.',
          },
          {
            id: `${course.id}-l2`,
            position: 2,
            title: 'Module 2: Shop-Floor Implementation & SOPs',
            titleAr: 'الوحدة ٢: التطبيق العملي وإجراءات التشغيل القياسية',
            durationMin: 25,
            content:
              'Step-by-step Standard Operating Procedures (SOPs) for spinning, weaving, and wet-processing teams:\n\n• Root-cause analysis for yarn breakage and shade variation.\n• Preventive maintenance scheduling.\n• Digital batch card tracking for EU export compliance.',
          },
          {
            id: `${course.id}-l3`,
            position: 3,
            title: 'Module 3: Audit Readiness & Certification Assessment',
            titleAr: 'الوحدة ٣: الجاهزية للتدقيق والتقييم النهائي للشهادة',
            durationMin: 20,
            content:
              'Final self-audit checklist before third-party inspection (ISO / OEKO-TEX / ZDHC / CBAM). Complete this module to unlock your verifiable Mahalla Cluster Academy Certificate.',
          },
        ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4 text-sm">
        <Link href={`/${locale}/cluster/academy`} className="text-muted-foreground hover:underline">
          {t('Cluster Academy', 'أكاديمية التجمع')}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{title}</span>
      </div>

      <PageHeader
        icon={GraduationCap}
        title={title}
        subtitle={desc}
        actions={
          <div className="flex items-center gap-2">
            <Pill tone="blue">{course.category}</Pill>
            <Pill tone="emerald">{course.provider}</Pill>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ms-2">
              <Clock className="w-3.5 h-3.5" /> {course.durationHours}h
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ms-2">
              <Users className="w-3.5 h-3.5" /> {course._count?.enrollments || 1}
            </span>
          </div>
        }
      />

      <AcademyLessonViewer
        course={{ ...course, lessons: fallbackLessons }}
        enrollment={enrollment}
        locale={locale}
      />
    </div>
  );
}
