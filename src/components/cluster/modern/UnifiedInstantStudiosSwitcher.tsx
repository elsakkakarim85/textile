'use client';

import React, { useState } from 'react';
import {
  Gauge,
  Globe2,
  GraduationCap,
  Megaphone,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { InstantLeanStudioBar } from '@/components/cluster/modern/InstantLeanStudioBar';
import { InstantExportIntelligenceBar } from '@/components/cluster/modern/InstantExportIntelligenceBar';
import { InstantTopicCourseBar } from '@/components/cluster/modern/InstantTopicCourseBar';
import { InstantBrandStudioBar } from '@/components/cluster/modern/InstantBrandStudioBar';

type StudioTabId = 'lean' | 'export' | 'academy' | 'brand';

export function UnifiedInstantStudiosSwitcher({ locale }: { locale: string }) {
  const [activeTab, setActiveTab] = useState<StudioTabId>('export');
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
      id: 'export',
      icon: Globe2,
      labelEn: '1. Find Export Buyers & Study',
      labelAr: '١. دراسة التصدير وإيجاد المشترين',
      subEn: 'Best Countries, Prices, Customs & Buyers',
      subAr: 'أفضل الدول، الأسعار، الجمارك، وقائمة المشترين',
      activeClass: 'border-blue-500 bg-blue-600 text-white shadow-sm',
    },
    {
      id: 'brand',
      icon: Megaphone,
      labelEn: '2. Create Video, Photos & Catalog',
      labelAr: '٢. عمل فيديو وصور وكتالوج للمصنع',
      subEn: 'HD .MP4 Video, Brochure & Marketing Plan',
      subAr: 'فيديو MP4 بالصوت والترجمة وبروشور جاهز للطباعة',
      activeClass: 'border-amber-500 bg-amber-600 text-white shadow-sm',
    },
    {
      id: 'lean',
      icon: Gauge,
      labelEn: '3. Reduce Waste & Boost Production',
      labelAr: '٣. تقليل الهالك وتحسين الإنتاج',
      subEn: 'Stop Defects, Cut Downtime & Lower Cost',
      subAr: 'تقليل عيوب القماش، تقليل الأعطال، وحساب التكلفة',
      activeClass: 'border-emerald-500 bg-emerald-600 text-white shadow-sm',
    },
    {
      id: 'academy',
      icon: GraduationCap,
      labelEn: '4. Create Worker Training Course',
      labelAr: '٤. إنشاء دورة تدريبية للعمال والفنيين',
      subEn: 'Simple Lessons, Audio Guide & Certificate',
      subAr: 'دروس مبسطة، شرح صوتي، واختبار مع شهادة',
      activeClass: 'border-indigo-500 bg-indigo-600 text-white shadow-sm',
    },
  ];

  const handleSelectTab = (id: StudioTabId) => {
    if (activeTab === id && isOpen) {
      setIsOpen(false);
    } else {
      setActiveTab(id);
      setIsOpen(true);
    }
  };

  return (
    <div className="space-y-3">
      {/* Clean Header + 4-Tab Switcher Bar */}
      <div className="rounded-3xl border-2 border-primary/20 bg-card p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary shrink-0">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm sm:text-base font-black text-foreground">
                {t(
                  '1-Click Smart Factory Generators (Try Instantly)',
                  'الاستوديوهات الذكية الفورية (جرّبها الآن بضغطة زر واحدة)'
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t(
                  'Click any of the 4 buttons below to generate an export study, factory video & brochure, waste-reduction plan, or training course:',
                  'اضغط على أي زر من الأزرار الأربعة بالأسفل لتوليد دراسة تصدير، أو فيديو وكتالوج لمصنعك، أو خطة تقليل الهالك، أو دورة تدريبية فوراً:'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/35 bg-primary/10 hover:bg-primary/20 px-4 py-2 text-xs font-extrabold text-primary transition cursor-pointer shrink-0"
          >
            {isOpen ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>{t('Hide Studio Panel', 'إخفاء نافذة الاستوديو')}</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>{t('Open Selected Studio', 'فتح الاستوديو المختار')}</span>
              </>
            )}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && isOpen;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-start transition-all cursor-pointer ${
                  isActive
                    ? tab.activeClass
                    : 'border-border bg-muted/30 text-foreground hover:border-primary/40 hover:bg-muted/70'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-black truncate">
                    {isAr ? tab.labelAr : tab.labelEn}
                  </div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-white/90' : 'text-muted-foreground'
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

      {/* Active Studio Panel (Shown when clicked) */}
      {isOpen && (
        <div className="animate-in fade-in duration-150">
          {activeTab === 'lean' && <InstantLeanStudioBar locale={locale} />}
          {activeTab === 'export' && <InstantExportIntelligenceBar locale={locale} />}
          {activeTab === 'academy' && (
            <div className="rounded-3xl border-2 border-indigo-500/35 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-emerald-950 p-5 md:p-6 text-white shadow-xl">
              <InstantTopicCourseBar locale={locale} />
            </div>
          )}
          {activeTab === 'brand' && <InstantBrandStudioBar locale={locale} />}
        </div>
      )}
    </div>
  );
}
