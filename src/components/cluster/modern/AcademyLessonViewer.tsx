"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { tr } from '@/lib/i18n-inline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/cluster/ui';
import { CheckCircle2, PlayCircle, Award, Clock, ArrowRight } from 'lucide-react';

export function AcademyLessonViewer({
  course,
  enrollment,
  locale,
}: {
  course: any;
  enrollment: any;
  locale: string;
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const lessons = course.lessons || [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  const completedIds: string[] = enrollment?.completedLessons || [];
  const progress = enrollment?.progress ?? 0;
  const activeLesson = lessons[activeIdx] || null;

  const handleCompleteLesson = async (lessonId?: string) => {
    setLoading(true);
    try {
      await api(`/api/cluster/academy/${course.slug}/progress`, 'POST', {
        lessonId,
      });
      router.refresh();
      if (lessonId && activeIdx < lessons.length - 1) {
        setActiveIdx(activeIdx + 1);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Sidebar Curriculum */}
      <div className="space-y-4">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{t('Your Progress', 'تقدمك في الدورة')}</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <ProgressBar value={progress} />

          {enrollment?.certificateCode && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center space-y-2">
              <Award className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                {t('Course Completed! Certificate Issued', 'تم إتمام الدورة وإصدار الشهادة')}
              </div>
              <Link
                href={`/${locale}/cluster/academy/certificate/${enrollment.certificateCode}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                {t('View & Print Certificate', 'عرض وطباعة الشهادة')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {!enrollment && (
            <Button className="w-full" onClick={() => handleCompleteLesson(undefined)} disabled={loading}>
              {loading ? t('Enrolling...', 'جاري التسجيل...') : t('Start Course (Free for Cluster Members)', 'ابدأ الدورة مجاناً لأعضاء التجمع')}
            </Button>
          )}
        </Card>

        <Card className="p-4 space-y-2">
          <h3 className="font-bold text-sm px-2 py-1">{t('Course Curriculum', 'منهج الدورة التدريبية')}</h3>
          {lessons.map((lesson: any, idx: number) => {
            const isDone = completedIds.includes(lesson.id);
            const isCurrent = idx === activeIdx;
            const title = locale === 'ar' ? lesson.titleAr || lesson.title : lesson.title;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`w-full text-start p-3 rounded-lg border text-xs flex items-center justify-between gap-2 transition-colors ${
                  isCurrent
                    ? 'border-primary bg-primary/10 font-semibold text-primary'
                    : 'hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <PlayCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <span className="truncate">
                    {idx + 1}. {title}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lesson.durationMin || 15}m
                </span>
              </button>
            );
          })}
        </Card>
      </div>

      {/* Lesson Content Viewer */}
      <div className="lg:col-span-2">
        {activeLesson ? (
          <Card className="p-6 md:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  {t(`Module ${activeIdx + 1} of ${lessons.length}`, `الوحدة ${activeIdx + 1} من ${lessons.length}`)}
                </div>
                <h2 className="text-2xl font-bold">
                  {locale === 'ar' ? activeLesson.titleAr || activeLesson.title : activeLesson.title}
                </h2>
              </div>
              <Button
                onClick={() => handleCompleteLesson(activeLesson.id)}
                disabled={loading}
                variant={completedIds.includes(activeLesson.id) ? 'outline' : 'default'}
              >
                <CheckCircle2 className="w-4 h-4 me-2" />
                {completedIds.includes(activeLesson.id)
                  ? t('Completed ✓ (Next Lesson)', 'مكتمل ✓ (الدرس التالي)')
                  : t('Mark Complete & Continue', 'إتمام الدرس والمتابعة')}
              </Button>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {activeLesson.content}
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            {t('Select a lesson to begin.', 'اختر درساً للبدء.')}
          </Card>
        )}
      </div>
    </div>
  );
}
