"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { tr } from '@/lib/i18n-inline';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar, Pill } from '@/components/cluster/ui';
import type { AuthorizedResource } from '@/server/modernization/course-generator';
import {
  Sparkles,
  ShieldCheck,
  Target,
  Layers,
  Video,
  Headphones,
  FileText,
  ClipboardCheck,
  Award,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Wand2,
} from 'lucide-react';

interface SuggestedNeed {
  id: string;
  dimension: string;
  score: number;
  category: string;
  title: string;
  titleAr: string;
  needSummary: string;
  needSummaryAr: string;
  targetRole: string;
  resourceIds: string[];
}

export function AiCourseStudioClient({
  locale,
  factoryName,
  maturityScores,
  suggestedNeeds,
  authorizedResources,
}: {
  locale: string;
  factoryName: string;
  maturityScores: Record<string, number>;
  suggestedNeeds: SuggestedNeed[];
  authorizedResources: AuthorizedResource[];
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [topic, setTopic] = useState(
    suggestedNeeds[0]
      ? locale === 'ar'
        ? suggestedNeeds[0].titleAr
        : suggestedNeeds[0].title
      : ''
  );
  const [userNeed, setUserNeed] = useState(
    suggestedNeeds[0]
      ? locale === 'ar'
        ? suggestedNeeds[0].needSummaryAr
        : suggestedNeeds[0].needSummary
      : ''
  );
  const [targetRole, setTargetRole] = useState(
    suggestedNeeds[0]?.targetRole || 'Spinning & Weaving Floor Engineer'
  );
  const [category, setCategory] = useState(suggestedNeeds[0]?.category || 'SUSTAINABILITY');
  const [levelProgression, setLevelProgression] = useState<
    'BEGINNER_TO_ADVANCED' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  >('BEGINNER_TO_ADVANCED');
  const [durationHours, setDurationHours] = useState(12);
  const [selectedResources, setSelectedResources] = useState<string[]>(
    suggestedNeeds[0]?.resourceIds || ['unido-tigara', 'zdhc-mrsl', 'iso-astm-lab']
  );

  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStepText, setGenStepText] = useState('');

  const applySuggestedNeed = (need: SuggestedNeed) => {
    setTopic(locale === 'ar' ? need.titleAr : need.title);
    setUserNeed(locale === 'ar' ? need.needSummaryAr : need.needSummary);
    setTargetRole(need.targetRole);
    setCategory(need.category);
    setSelectedResources(need.resourceIds);
  };

  const toggleResource = (id: string) => {
    setSelectedResources((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((r) => r !== id)
          : prev
        : [...prev, id]
    );
  };

  const handleGenerateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    setGenProgress(15);
    setGenStepText(
      t(
        '1/4 Analyzing user & factory competency gaps...',
        '١/٤ تحليل فجوات المهارات واحتياجات المصنع...'
      )
    );

    const stepTimer1 = setTimeout(() => {
      setGenProgress(45);
      setGenStepText(
        t(
          '2/4 Grounding curriculum in authorized UNIDO, ZDHC, ISO & EU ESPR standards...',
          '٢/٤ ربط المنهج بالمعايير المعتمدة (UNIDO, ZDHC, ISO, EU ESPR)...'
        )
      );
    }, 600);

    const stepTimer2 = setTimeout(() => {
      setGenProgress(78);
      setGenStepText(
        t(
          '3/4 Synthesizing Beginner → Intermediate → Advanced multimedia slides, audio & SOPs...',
          '٣/٤ بناء الوحدات (مبتدئ ← متوسط ← متقدم) والشرائح المرئية والصوتية وقوائم SOP...'
        )
      );
    }, 1300);

    try {
      const res = await api<{ slug: string }>('/api/cluster/academy/ai-generate', 'POST', {
        topic,
        userNeed,
        targetRole,
        category,
        levelProgression,
        durationHours,
        resourceIds: selectedResources,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setGenProgress(100);
      setGenStepText(
        t(
          '4/4 Course published & enrolled! Redirecting to Multimedia Player...',
          '٤/٤ تم نشر الدورة وتسجيلك بنجاح! جاري فتح المشغل متعدد الوسائط...'
        )
      );

      setTimeout(() => {
        router.push(`/${locale}/cluster/academy/${res.slug}`);
      }, 400);
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      alert(err.message || 'Failed to generate course');
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Feature Highlights Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            icon: Layers,
            title: t('Beginner → Advanced', 'مبتدئ ← متقدم'),
            sub: t('3-Tier Mastery Track', 'مسار متدرج من ٣ مستويات'),
          },
          {
            icon: ShieldCheck,
            title: t('Authorized Standards', 'مراجع دولية معتمدة'),
            sub: 'UNIDO • ZDHC • ISO • EU DPP',
          },
          {
            icon: Video,
            title: t('HD Video & Slides', 'محاضرات مرئية وشرائح'),
            sub: t('Interactive Visual Deck', 'عرض تفاعلي للمؤشرات'),
          },
          {
            icon: Headphones,
            title: t('Bilingual Audio', 'شرح صوتي عربي/إنجليزي'),
            sub: t('Hands-Free Mill Podcast', 'استماع ميداني بصالة الإنتاج'),
          },
          {
            icon: Award,
            title: t('Verified Certificate', 'شهادة رقمية موثقة'),
            sub: t('SOPs + Quiz + Credential', 'قوائم SOP واختبار وشهادة'),
          },
        ].map((f, idx) => {
          const Icon = f.icon;
          return (
            <Card key={idx} className="p-3.5 flex items-center gap-3 bg-muted/20 border-primary/20">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-700 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{f.title}</div>
                <div className="text-[11px] text-muted-foreground truncate">{f.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: AI Needs Diagnosis & Recommended Blueprints */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                <Target className="w-4 h-4" />
                {t('Factory Needs & Skill Gap Radar', 'تشخيص فجوات المهارات للمصنع')}
              </div>
              <Pill tone="emerald">{factoryName}</Pill>
            </div>
            <p className="text-xs text-muted-foreground">
              {t(
                'Computed live from your Digital Maturity & ESG profile. Lower scores indicate high-priority training needs:',
                'محسوب تلقائياً من تقييم النضج الرقمي والاستدامة لمصنعك. المؤشرات الأقل تمثل أولوية تدريبية قصوى:'
              )}
            </p>

            <div className="space-y-3">
              {[
                { key: 'sustainability', label: t('Sustainability, ZDHC & Water', 'الاستدامة والكيماويات والمياه') },
                { key: 'digital', label: t('Digital ERP, OEE & EU DPP', 'التحول الرقمي وجواز المنتج') },
                { key: 'quality', label: t('ISO 17025 Lab & Shade Control', 'معامل الجودة وضبط الألوان') },
                { key: 'market', label: t('EU Export & CBAM Readiness', 'التصدير الأوروبي والبصمة الكربونية') },
                { key: 'people', label: t('Workforce & Safety (ILO)', 'تأهيل الكوادر والسلامة المهنية') },
                { key: 'production', label: t('Weaving & Spinning OEE', 'كفاءة الغزل والنسيج OEE') },
              ].map((dim) => {
                const val = maturityScores[dim.key] ?? 55;
                return (
                  <div key={dim.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{dim.label}</span>
                      <span
                        className={`font-bold ${
                          val < 55
                            ? 'text-amber-600'
                            : val < 70
                            ? 'text-sky-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {val}%
                      </span>
                    </div>
                    <ProgressBar
                      value={val}
                      className={`h-2 ${
                        val < 55
                          ? '[&>div]:bg-amber-500'
                          : val < 70
                          ? '[&>div]:bg-sky-500'
                          : '[&>div]:bg-emerald-500'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {t(
                '1-Click Recommended Needs Blueprints',
                'قوالب تدريبية مقترحة حسب احتياجاتك'
              )}
            </h3>
            <div className="space-y-2.5">
              {suggestedNeeds.map((need) => (
                <div
                  key={need.id}
                  className="p-3.5 rounded-xl border bg-muted/20 hover:border-emerald-500/50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Pill tone="amber">
                      {t('Gap Score:', 'مؤشر الحاجة:')} {need.score}%
                    </Pill>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {need.category}
                    </span>
                  </div>
                  <div className="text-xs font-bold">
                    {locale === 'ar' ? need.titleAr : need.title}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {locale === 'ar' ? need.needSummaryAr : need.needSummary}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestedNeed(need)}
                    className="w-full text-xs h-7 border-emerald-600/40 text-emerald-700 hover:bg-emerald-50"
                  >
                    {t('Load This Need into AI Studio →', 'استخدام هذا الاحتياج في المنشئ الذكي ←')}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 2 Columns: AI Course Builder Form & Authorized Resource Selector */}
        <div className="lg:col-span-2">
          <Card className="p-6 md:p-8 space-y-6 border-2 border-primary/20 shadow-md">
            <div className="border-b pb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-500/10 px-3 py-1 rounded-full mb-2">
                <Wand2 className="w-3.5 h-3.5" />
                {t(
                  'AI Curriculum Architect • Trusted & Authorized Sources',
                  'معماري المناهج بالذكاء الاصطناعي • مصادر دولية معتمدة'
                )}
              </div>
              <h2 className="text-2xl font-extrabold">
                {t(
                  'Build Custom Expert Course (Beginner → Advanced)',
                  'إنشاء دورة تدريبية احترافية مخصصة (مبتدئ ← متقدم)'
                )}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {t(
                  'Describe your operational need and select the authorized international standards. The AI generates a complete 3-tier multimedia course with video slides, audio narration, SOP checklists, quizzes, and verifiable certification.',
                  'حدد الاحتياج التدريبي لمصنعك واختر الهيئات المعتمدة، ليقوم الذكاء الاصطناعي ببناء دورة متكاملة من المبتدئ للمتقدم تشمل الفيديو والصوت وقوائم SOP والاختبارات والشهادة الموثقة.'
                )}
              </p>
            </div>

            <form onSubmit={handleGenerateCourse} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold block">
                  {t('1. Course Title / Competency Topic', '١. عنوان الدورة أو المهارة المطلوبة')}
                </label>
                <input
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t(
                    'e.g. Zero-Defect Air-Jet Weaving & Giza 86 Warp Tension Control',
                    'مثال: ضبط شد السداء في أنوال الهواء لخيوط قطن جيزة 86 بدون عيوب'
                  )}
                  className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold block">
                  {t(
                    '2. Specific User / Factory Operational Need',
                    '٢. وصف الاحتياج الفعلي للمستخدم أو المصنع'
                  )}
                </label>
                <textarea
                  rows={3}
                  value={userNeed}
                  onChange={(e) => setUserNeed(e.target.value)}
                  placeholder={t(
                    'Describe the exact shop-floor problem, machine type, defect rate, or European buyer compliance requirement you want this course to solve...',
                    'اشرح المشكلة الفنية في صالة الإنتاج، أو نوع الماكينات، أو متطلبات المشتري الأوروبي التي ترغب في معالجتها خلال الدورة...'
                  )}
                  className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
                    {t('Target Learner Role', 'الفئة المستهدفة')}
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  >
                    <option value="Spinning & Weaving Floor Engineer">
                      {t('Spinning & Weaving Engineer', 'مهندس غزل ونسيج')}
                    </option>
                    <option value="Dyehouse & Chemical Supervisor">
                      {t('Dyehouse & Chemical Supervisor', 'مشرف صباغة وتجهيز وكيماويات')}
                    </option>
                    <option value="Quality Assurance & Lab Engineer">
                      {t('Quality Assurance & Lab Engineer', 'مهندس جودة ومعامل فحص')}
                    </option>
                    <option value="Operations & Plant Manager">
                      {t('Operations & Plant Manager', 'مدير مصنع وتشغيل')}
                    </option>
                    <option value="Export & Sustainability Compliance Officer">
                      {t('Export & Sustainability Officer', 'مسؤول تصدير واستدامة وبصمة كربونية')}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
                    {t('Competency Domain', 'مجال التخصص')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  >
                    <option value="TECHNICAL">TECHNICAL (Spinning/Weaving/Dyeing)</option>
                    <option value="SUSTAINABILITY">SUSTAINABILITY (ZDHC/Water/ESG)</option>
                    <option value="QUALITY">QUALITY (ISO 17025/OEKO-TEX)</option>
                    <option value="EXPORT">EXPORT (EU DPP/CBAM/Markets)</option>
                    <option value="DIGITAL">DIGITAL (ERP/OEE/Industry 4.0)</option>
                    <option value="MANAGEMENT">MANAGEMENT (Lean/5S/SMED)</option>
                    <option value="SAFETY">SAFETY (ILO/OSH Standards)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground block mb-1.5">
                    {t('Mastery Progression Track', 'تدرج المستوى التدريبي')}
                  </label>
                  <select
                    value={levelProgression}
                    onChange={(e) => setLevelProgression(e.target.value as any)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm font-semibold text-emerald-700"
                  >
                    <option value="BEGINNER_TO_ADVANCED">
                      {t(
                        'Full Track: Beginner → Intermediate → Advanced',
                        'المسار الكامل: مبتدئ ← متوسط ← متقدم'
                      )}
                    </option>
                    <option value="BEGINNER">{t('Beginner Focus', 'تركيز مبتدئ')}</option>
                    <option value="INTERMEDIATE">{t('Intermediate Focus', 'تركيز متوسط')}</option>
                    <option value="ADVANCED">{t('Advanced Focus', 'تركيز متقدم')}</option>
                  </select>
                </div>
              </div>

              {/* Trusted & Authorized Resources Multi-Select */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {t(
                      '3. Select Trusted & Authorized Reference Bodies',
                      '٣. اختر الهيئات والمواصفات الدولية المعتمدة لتوثيق الدورة'
                    )}
                  </label>
                  <span className="text-xs text-muted-foreground">
                    {selectedResources.length} {t('selected', 'محددة')}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {authorizedResources.map((res) => {
                    const isSelected = selectedResources.includes(res.id);
                    return (
                      <div
                        key={res.id}
                        onClick={() => toggleResource(res.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-500/10 shadow-2xs'
                            : 'hover:bg-muted/50 opacity-80'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                              {res.standardCode}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <div className="text-xs font-bold">{res.organization}</div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {locale === 'ar' ? res.summaryAr : res.summary}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[10px] text-muted-foreground">
                          <span>{res.categories.join(' • ')}</span>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 text-emerald-700 hover:underline font-semibold"
                          >
                            Official Portal <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Generation Progress Bar */}
              {generating && (
                <div className="p-4 rounded-xl bg-emerald-950 text-white space-y-2.5 border border-emerald-500/40">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                      {genStepText}
                    </span>
                    <span className="text-emerald-300">{genProgress}%</span>
                  </div>
                  <ProgressBar
                    value={genProgress}
                    className="h-2.5 bg-white/20 [&>div]:bg-emerald-400"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  {t(
                    'Generates 3 progressive modules (Beginner → Intermediate → Advanced) + Video Slides + Audio + SOPs + Quiz + Certificate.',
                    'يولد ٣ وحدات متدرجة (مبتدئ ← متوسط ← متقدم) مع شرائح فيديو وشرح صوتي وقوائم SOP واختبار وشهادة معتمدة.'
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={generating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  {generating
                    ? t('Synthesizing Multimedia Course...', 'جاري بناء الدورة متعددة الوسائط...')
                    : t('Generate AI Multimedia Course', 'إنشاء الدورة التدريبية بالذكاء الاصطناعي')}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
