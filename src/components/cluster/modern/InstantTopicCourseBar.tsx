'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { tr } from '@/lib/i18n-inline';
import { inferTopicProfile } from '@/server/modernization/course-generator';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/cluster/ui';
import {
  Sparkles,
  Wand2,
  ArrowRight,
  SlidersHorizontal,
  ShieldCheck,
} from 'lucide-react';

export function InstantTopicCourseBar({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState('');

  const quickTopics = [
    {
      en: 'Jacquard Terry Towel Weaving & Pile Ratio Control',
      ar: 'نسيج الجاكار والوبريات وضبط نسبة الوبرة',
    },
    {
      en: 'Denim Laser Finishing, Ozone Washing & EIM Score',
      ar: 'تجهيز الدنيم بالليزر والأوزون وتقليل استهلاك المياه',
    },
    {
      en: 'Garment CAD/CAM Marker Efficiency & SAM Line Balancing',
      ar: 'كفاءة التعشيق CAD/CAM وتوازن خطوط الحياكة SAM',
    },
    {
      en: 'Mercerizing, Sanforizing & Dimensional Shrinkage Control',
      ar: 'المرسرة والسنفرة والتحكم في انكماش الأقمشة القطنية',
    },
    {
      en: 'Rotary Screen & Digital Sublimation Printing Mastery',
      ar: 'إتقان الطباعة الدورانية والطباعة الرقمية الحرارية',
    },
    {
      en: 'Solar PPA & Steam Boiler Condensate Heat Recovery',
      ar: 'الطاقة الشمسية واسترجاع حرارة تكثيف الغلايات بالمصابغ',
    },
  ];

  const liveProfile = topic.trim().length >= 2 ? inferTopicProfile(topic) : null;

  const handleInstantGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = topic.trim();
    if (clean.length < 2) return;

    const inferred = inferTopicProfile(clean);
    setGenerating(true);
    setProgress(20);
    setStepLabel(
      t(
        `1/3 Analyzing "${clean}" & matching authorized standards (${inferred.resourceIds.join(', ')})...`,
        `١/٣ تحليل موضوع «${clean}» وربطه بالمعايير المعتمدة...`
      )
    );

    const t1 = setTimeout(() => {
      setProgress(68);
      setStepLabel(
        t(
          '2/3 Synthesizing Beginner → Intermediate → Advanced video slides, audio & SOP checklists...',
          '٢/٣ بناء المستويات الثلاثة (مبتدئ ← متوسط ← متقدم) والشرائح والصوت وقوائم SOP...'
        )
      );
    }, 650);

    try {
      const res = await api<{ slug: string }>('/api/cluster/academy/ai-generate', 'POST', {
        topic: clean,
        category: inferred.category,
        targetRole: inferred.targetRole,
        resourceIds: inferred.resourceIds,
        levelProgression: 'BEGINNER_TO_ADVANCED',
        durationHours: 12,
      });
      clearTimeout(t1);
      setProgress(100);
      setStepLabel(
        t(
          '3/3 Expert course ready! Opening Multimedia Player...',
          '٣/٣ تم إنشاء الدورة بنجاح! جاري فتح المشغل متعدد الوسائط...'
        )
      );
      setTimeout(() => {
        router.push(`/${locale}/cluster/academy/${res.slug}`);
      }, 300);
    } catch (err: any) {
      clearTimeout(t1);
      alert(err.message || 'Failed to generate course');
      setGenerating(false);
    }
  };

  return (
    <div className="pt-2 space-y-3">
      <form onSubmit={handleInstantGenerate} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Wand2 className="w-4 h-4 text-emerald-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            minLength={2}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={t(
              'Enter ANY topic to generate an expert Beginner → Advanced course (e.g., Jacquard Weaving, Denim Laser, Garment SAM)...',
              'أدخل أي موضوع لتوليد دورة احترافية كاملة فوراً (مثال: نسيج الجاكار، طباعة رقمية، توازن خطوط الملابس)...'
            )}
            className="w-full rounded-xl bg-white/10 border border-white/25 text-white placeholder:text-slate-400 ps-10 pe-4 py-3 text-xs md:text-sm focus:outline-none focus:border-emerald-400 focus:bg-white/15"
          />
        </div>
        <Button
          type="submit"
          disabled={generating || topic.trim().length < 2}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 h-auto gap-2 shrink-0 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          {generating
            ? t('Generating Course...', 'جاري بناء الدورة...')
            : t('Generate Course Now', 'ولّد الدورة فوراً')}
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Link
          href={`/${locale}/cluster/academy/studio${
            topic.trim() ? `?topic=${encodeURIComponent(topic.trim())}` : ''
          }`}
        >
          <Button
            type="button"
            variant="outline"
            className="border-white/25 bg-white/5 hover:bg-white/15 text-white font-semibold px-4 py-3 h-auto gap-1.5 w-full sm:w-auto"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-300" />
            {t('Advanced Studio', 'استوديو التخصيص')}
          </Button>
        </Link>
      </form>

      {/* Live Auto-Detected Domain & Standards Preview when user types */}
      {liveProfile && !generating && (
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-200 bg-emerald-500/15 border border-emerald-400/30 rounded-xl px-3.5 py-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-bold">
            {t('Auto-Matched Standards & Track:', 'تم التعرف التلقائي على المسار والمعايير:')}
          </span>
          <span className="bg-white/10 px-2 py-0.5 rounded font-semibold">{liveProfile.category}</span>
          <span className="bg-white/10 px-2 py-0.5 rounded">{liveProfile.targetRole}</span>
          <span className="text-emerald-300 font-mono">
            {liveProfile.keyMetrics.slice(0, 2).join(' • ')}
          </span>
        </div>
      )}

      {/* Animated Progress Bar while generating */}
      {generating && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-400/40 space-y-2">
          <div className="flex justify-between text-xs font-bold text-emerald-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              {stepLabel}
            </span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} className="h-2 bg-white/20 [&>div]:bg-emerald-400" />
        </div>
      )}

      {/* Quick 1-Click Topic Inspiration Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] font-bold text-emerald-300 me-1">
          {t('Try any topic:', 'جرّب أي موضوع:')}
        </span>
        {quickTopics.map((qt, i) => {
          const label = locale === 'ar' ? qt.ar : qt.en;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setTopic(label)}
              className="text-[11px] bg-white/10 hover:bg-emerald-500/30 border border-white/15 hover:border-emerald-400/50 text-slate-200 px-2.5 py-1 rounded-full transition-colors truncate max-w-[260px]"
            >
              + {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
