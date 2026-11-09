'use client';

import React, { useState } from 'react';
import { Gauge, Globe2, GraduationCap, Megaphone, Sparkles } from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { InstantLeanStudioBar } from '@/components/cluster/modern/InstantLeanStudioBar';
import { InstantExportIntelligenceBar } from '@/components/cluster/modern/InstantExportIntelligenceBar';
import { InstantTopicCourseBar } from '@/components/cluster/modern/InstantTopicCourseBar';
import { InstantBrandStudioBar } from '@/components/cluster/modern/InstantBrandStudioBar';

type StudioTabId = 'lean' | 'export' | 'academy' | 'brand';

export function UnifiedInstantStudiosSwitcher({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<StudioTabId>('lean');
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const tabs: {
    id: StudioTabId;
    icon: React.ElementType;
    labelEn: string;
    labelAr: string;
    subEn: string;
    subAr: string;
    activeClass: string;
  }[] = [
    {
      id: 'lean',
      icon: Gauge,
      labelEn: '1. Lean Six Sigma & OEE',
      labelAr: '١. اللين 6 سيجما و OEE',
      subEn: 'VSM, SMED, 5S, Kanban & Toyota A3',
      subAr: 'خرائط القيمة، تقليل التغيير، 5S وتقارير A3',
      activeClass: 'border-emerald-500 bg-emerald-600 text-white shadow-sm',
    },
    {
      id: 'export',
      icon: Globe2,
      labelEn: '2. Global Export & Buyers AI',
      labelAr: '٢. ذكاء التصدير والمشترين',
      subEn: '190+ Countries, Landed Cost, Tenders & NTMs',
      subAr: 'دراسات السوق، المناقصات، والمشترين الموثقين',
      activeClass: 'border-blue-500 bg-blue-600 text-white shadow-sm',
    },
    {
      id: 'academy',
      icon: GraduationCap,
      labelEn: '3. AI Course & SOP Generator',
      labelAr: '٣. منشئ الدورات التدريبية الذكي',
      subEn: 'Beginner → Advanced Curriculum + Quizzes',
      subAr: 'دورات فنية وإدارية متكاملة مع اختبارات وشهادات',
      activeClass: 'border-indigo-500 bg-indigo-600 text-white shadow-sm',
    },
    {
      id: 'brand',
      icon: Megaphone,
      labelEn: '4. Brand, Media & Print Studio',
      labelAr: '٤. استوديو الهوية والفيديو والمطبوعات',
      subEn: 'Brand DNA, HD .MP4 Video, Brochures & Posters',
      subAr: 'الهوية البصرية، فيديوهات MP4، وبروشورات المعارض',
      activeClass: 'border-amber-500 bg-amber-600 text-white shadow-sm',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Compact Header + 4-Tab Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border bg-card p-3 shadow-xs">
        <div className="flex items-center gap-2 px-1">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-primary">
              {t('Instant AI Industrial Launchpad', 'منصة الإطلاق الذكية الفورية')}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {t(
                'Select a studio below to generate custom engineering, export, training, or brand deliverables in 1 click:',
                'اختر الاستوديو المطلوب لتوليد خطط اللين أو دراسات التصدير أو الدورات أو الهوية التسويقية بضغطة واحدة:'
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-start transition-all cursor-pointer ${
                  isActive
                    ? tab.activeClass
                    : 'border-border bg-muted/40 text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-extrabold truncate">
                    {isAr ? tab.labelAr : tab.labelEn}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-white/85' : 'text-muted-foreground'
                    }`}
                  >
                    {isAr ? tab.subAr : tab.subEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Studio Panel */}
      <div>
        {activeTab === 'lean' && <InstantLeanStudioBar locale={locale} />}
        {activeTab === 'export' && <InstantExportIntelligenceBar locale={locale} />}
        {activeTab === 'academy' && (
          <div className="rounded-3xl border-2 border-indigo-500/35 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-emerald-950 p-5 md:p-6 text-white shadow-xl">
            <InstantTopicCourseBar locale={locale} />
          </div>
        )}
        {activeTab === 'brand' && <InstantBrandStudioBar locale={locale} />}
      </div>
    </div>
  );
}
