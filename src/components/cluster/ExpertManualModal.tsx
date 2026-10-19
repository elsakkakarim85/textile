'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import {
  HelpCircle,
  BookOpen,
  Cpu,
  TrendingUp,
  ListChecks,
  Sparkles,
  X,
  Search,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Check,
  Compass,
  Layers,
  ChevronRight,
  Lightbulb,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import {
  EXPERT_MANUALS,
  resolveManualByPathname,
  type ExpertManualEntry,
} from '@/lib/expert-manuals';
import { cn } from '@/lib/utils';

export type ManualTab = 'overview' | 'what' | 'howItWorks' | 'whyToUse' | 'howToUse' | 'directory';

const EXPERT_MANUAL_LIST: ExpertManualEntry[] = Object.values(EXPERT_MANUALS);

export function openExpertManual(manualId?: string, initialTab: ManualTab = 'overview') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('open-expert-manual', {
        detail: { manualId, initialTab },
      })
    );
  }
}

export function ExpertManualButton({
  manualId,
  locale,
  variant = 'icon',
  initialTab = 'overview',
  labelEn,
  labelAr,
  className,
}: {
  manualId?: string;
  locale?: string;
  variant?: 'icon' | 'mini' | 'pill';
  initialTab?: ManualTab;
  labelEn?: string;
  labelAr?: string;
  className?: string;
}) {
  const pathname = usePathname() || '/ar';
  const resolvedLocale = locale || (pathname.startsWith('/en') ? 'en' : 'ar');
  const isAr = resolvedLocale === 'ar';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openExpertManual(manualId, initialTab);
  };

  const tooltip = isAr
    ? 'دليل الخبير الهندسي: ما هذا؟ • كيف يعمل؟ • لماذا تستخدمه؟ • كيف تستخدمه خطوة بخطوة؟'
    : 'Expert Manual: What is this? • How it works • Why to use • How to use step-by-step';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={tooltip}
        aria-label={tooltip}
        className={cn(
          'inline-flex items-center justify-center w-7 h-7 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all shadow-xs shrink-0 cursor-pointer',
          className
        )}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
    );
  }

  if (variant === 'mini') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={tooltip}
        className={cn(
          'inline-flex items-center gap-1 rounded-md border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all shrink-0 cursor-pointer',
          className
        )}
      >
        <HelpCircle className="w-3 h-3 shrink-0" />
        <span>{isAr ? labelAr || 'دليل الأداة (؟)' : labelEn || 'Manual (?)'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={tooltip}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all shadow-xs cursor-pointer',
        className
      )}
    >
      <BookOpen className="w-3.5 h-3.5 shrink-0" />
      <span>
        {isAr
          ? labelAr || '📖 دليل الخبير للوحدة: ما هي • كيف تعمل • لماذا • كيف تستخدمها (؟)'
          : labelEn || '📖 Expert Manual: What • How It Works • Why • How To Use (?)'}
      </span>
    </button>
  );
}

export function GlobalExpertManualHost({ locale }: { locale: string }) {
  const pathname = usePathname() || `/${locale}`;
  const isAr = locale === 'ar';

  const pageManual = useMemo(() => resolveManualByPathname(pathname), [pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeManualId, setActiveManualId] = useState<string>(pageManual.id);
  const [activeTab, setActiveTab] = useState<ManualTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync default manual when route changes while modal is closed
  useEffect(() => {
    if (!isOpen) {
      setActiveManualId(pageManual.id);
    }
  }, [pageManual.id, isOpen]);

  // Listen for global CustomEvent from any <ExpertManualButton />
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{
        manualId?: string;
        initialTab?: ManualTab;
      }>;
      const requestedId = customEvent.detail?.manualId;
      const requestedTab = customEvent.detail?.initialTab || 'overview';
      if (requestedId && EXPERT_MANUALS[requestedId]) {
        setActiveManualId(requestedId);
      } else {
        setActiveManualId(resolveManualByPathname(window.location.pathname).id);
      }
      setActiveTab(requestedTab);
      setIsOpen(true);
    };

    window.addEventListener('open-expert-manual', handler);
    return () => window.removeEventListener('open-expert-manual', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          setSpeaking(false);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const currentManual: ExpertManualEntry =
    EXPERT_MANUALS[activeManualId] || pageManual;

  const filteredManuals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return EXPERT_MANUAL_LIST;
    return EXPERT_MANUAL_LIST.filter(
      (m) =>
        m.titleEn.toLowerCase().includes(q) ||
        m.titleAr.toLowerCase().includes(q) ||
        m.badgeEn.toLowerCase().includes(q) ||
        m.badgeAr.toLowerCase().includes(q) ||
        m.subtitleEn.toLowerCase().includes(q) ||
        m.subtitleAr.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const buildPlainTextManual = (m: ExpertManualEntry) => {
    if (isAr) {
      return [
        `# ${m.titleAr} (${m.titleEn})`,
        `التصنيف: ${m.badgeAr}`,
        `نبذة: ${m.subtitleAr}`,
        ``,
        `## 1. ما هي هذه الوحدة / الأداة؟ (What Is This?)`,
        m.whatIsThisAr,
        ``,
        `## 2. كيف تعمل تقنياً وهندسياً؟ (How It Works)`,
        m.howItWorksAr,
        m.formulaOrArchitecture ? `\nالمعادلة / البنية الهندسية:\n${m.formulaOrArchitecture}` : '',
        ``,
        `## 3. لماذا تستخدمها؟ القيمة والعائد الصناعي (Why To Use)`,
        ...m.whyToUseAr.map((w, i) => `${i + 1}. ${w}`),
        ``,
        `## 4. كيف تستخدمها خطوة بخطوة؟ (How To Use)`,
        ...m.howToUseSteps.map((h, i) => `الخطوة ${i + 1} (${h.titleAr}): ${h.detailAr}`),
        ``,
        `## نصيحة الخبير الهندسي (Pro Engineer Tip):`,
        m.proTipAr,
      ].join('\n');
    }

    return [
      `# ${m.titleEn}`,
      `Category: ${m.badgeEn}`,
      `Subtitle: ${m.subtitleEn}`,
      ``,
      `## 1. What Is This?`,
      m.whatIsThisEn,
      ``,
      `## 2. How It Works (Technical & Industrial Mechanism)`,
      m.howItWorksEn,
      m.formulaOrArchitecture ? `\nEngineering Formula / Architecture:\n${m.formulaOrArchitecture}` : '',
      ``,
      `## 3. Why To Use (Quantified Industrial ROI)`,
      ...m.whyToUseEn.map((w, i) => `${i + 1}. ${w}`),
      ``,
      `## 4. How To Use (Step-by-Step Guide)`,
      ...m.howToUseSteps.map((h, i) => `Step ${i + 1} (${h.titleEn}): ${h.detailEn}`),
      ``,
      `## Pro Engineer Tip:`,
      m.proTipEn,
    ].join('\n');
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const text = isAr
      ? `${currentManual.titleAr}. ما هي هذه الوحدة: ${currentManual.whatIsThisAr}. كيف تعمل: ${currentManual.howItWorksAr}. نصيحة الخبير: ${currentManual.proTipAr}`
      : `${currentManual.titleEn}. What is this module: ${currentManual.whatIsThisEn}. How it works: ${currentManual.howItWorksEn}. Pro tip: ${currentManual.proTipEn}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isAr ? 'ar-EG' : 'en-US';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async () => {
    const content = buildPlainTextManual(currentManual);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDownload = () => {
    const content = buildPlainTextManual(currentManual);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentManual.id}-expert-manual-${locale}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Sleek Contextual Manual Strip below Navbar — guarantees every module/page has an integrated 1-click manual bar */}
      <div className="w-full bg-slate-900/95 border-b border-slate-800 text-slate-200 print:hidden">
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openExpertManual(pageManual.id, 'overview')}
              title={
                isAr
                  ? 'افتح الدليل الهندسي الشامل لهذه الوحدة'
                  : 'Open Full Expert Manual for this module'
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[11px] font-bold text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'دليل الوحدة (؟):' : 'Module Manual (?):'}</span>
              <span className="font-extrabold underline decoration-dotted underline-offset-2">
                {isAr ? pageManual.titleAr : pageManual.titleEn}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => openExpertManual(pageManual.id, 'what')}
              className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/40 px-2 py-0.5 text-[11px] font-semibold text-slate-200 hover:text-emerald-300 transition-all cursor-pointer"
            >
              <BookOpen className="w-3 h-3 text-emerald-400" />
              <span>{isAr ? '١. ما هذا؟' : '1. What is this?'}</span>
            </button>

            <button
              type="button"
              onClick={() => openExpertManual(pageManual.id, 'howItWorks')}
              className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 hover:bg-sky-500/20 border border-slate-700 hover:border-sky-500/40 px-2 py-0.5 text-[11px] font-semibold text-slate-200 hover:text-sky-300 transition-all cursor-pointer"
            >
              <Cpu className="w-3 h-3 text-sky-400" />
              <span>{isAr ? '٢. كيف يعمل؟' : '2. How it works'}</span>
            </button>

            <button
              type="button"
              onClick={() => openExpertManual(pageManual.id, 'whyToUse')}
              className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/40 px-2 py-0.5 text-[11px] font-semibold text-slate-200 hover:text-amber-300 transition-all cursor-pointer"
            >
              <TrendingUp className="w-3 h-3 text-amber-400" />
              <span>{isAr ? '٣. لماذا تستخدمه؟' : '3. Why to use'}</span>
            </button>

            <button
              type="button"
              onClick={() => openExpertManual(pageManual.id, 'howToUse')}
              className="inline-flex items-center gap-1 rounded-md bg-slate-800/90 hover:bg-violet-500/20 border border-slate-700 hover:border-violet-500/40 px-2 py-0.5 text-[11px] font-semibold text-slate-200 hover:text-violet-300 transition-all cursor-pointer"
            >
              <ListChecks className="w-3 h-3 text-violet-400" />
              <span>{isAr ? '٤. كيف تستخدمه؟' : '4. How to use'}</span>
            </button>

            <button
              type="button"
              onClick={() => openExpertManual(pageManual.id, 'directory')}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 hover:bg-emerald-500 border border-emerald-500/35 px-2 py-0.5 text-[11px] font-bold text-emerald-300 hover:text-slate-950 transition-all cursor-pointer"
            >
              <Compass className="w-3 h-3" />
              <span>
                {isAr
                  ? `فهرس الأدلة (${EXPERT_MANUAL_LIST.length})`
                  : `All Manuals (${EXPERT_MANUAL_LIST.length})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Expert Manual Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl border border-slate-700/80 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/70 border-b border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                    <Sparkles className="w-3 h-3" />
                    {isAr ? 'دليل الخبير الهندسي المعتمد' : 'Verified Expert Engineering Manual'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                    {isAr ? currentManual.badgeAr : currentManual.badgeEn}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight truncate">
                  {isAr ? currentManual.titleAr : currentManual.titleEn}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                  {isAr ? currentManual.subtitleAr : currentManual.subtitleEn}
                </p>
              </div>

              {/* Action Utilities */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleSpeak}
                  title={isAr ? 'قراءة صوتية للدليل' : 'Read Manual Aloud'}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition cursor-pointer',
                    speaking
                      ? 'border-amber-400 bg-amber-500 text-slate-950'
                      : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  )}
                >
                  {speaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="hidden md:inline">
                    {speaking ? (isAr ? 'إيقاف' : 'Stop') : isAr ? 'استماع' : 'Listen'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  title={isAr ? 'نسخ الدليل الكامل' : 'Copy Full Manual'}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-200 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden md:inline">
                    {copied ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'نسخ' : 'Copy'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  title={isAr ? 'تحميل الدليل بصيغة Markdown' : 'Download Manual (.md)'}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-bold text-slate-200 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{isAr ? 'تحميل' : 'Download'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-700 bg-slate-800 hover:bg-rose-500 hover:border-rose-500 text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {[
                {
                  id: 'overview' as ManualTab,
                  icon: Sparkles,
                  labelEn: 'Full 4-Pillar Guide',
                  labelAr: 'الدليل الشامل الكامل',
                  color: 'text-amber-400',
                },
                {
                  id: 'what' as ManualTab,
                  icon: BookOpen,
                  labelEn: '1. What Is This?',
                  labelAr: '١. ما هي هذه الوحدة؟',
                  color: 'text-emerald-400',
                },
                {
                  id: 'howItWorks' as ManualTab,
                  icon: Cpu,
                  labelEn: '2. How It Works',
                  labelAr: '٢. كيف تعمل هندسياً؟',
                  color: 'text-sky-400',
                },
                {
                  id: 'whyToUse' as ManualTab,
                  icon: TrendingUp,
                  labelEn: '3. Why To Use (ROI)',
                  labelAr: '٣. لماذا تستخدمها؟ (العائد)',
                  color: 'text-amber-400',
                },
                {
                  id: 'howToUse' as ManualTab,
                  icon: ListChecks,
                  labelEn: '4. How To Use (Steps)',
                  labelAr: '٤. كيف تستخدمها خطوة بخطوة؟',
                  color: 'text-violet-400',
                },
                {
                  id: 'directory' as ManualTab,
                  icon: Compass,
                  labelEn: `All Manuals (${EXPERT_MANUAL_LIST.length})`,
                  labelAr: `فهرس كافة الأدلة (${EXPERT_MANUAL_LIST.length})`,
                  color: 'text-teal-400',
                },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer',
                      active
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    )}
                  >
                    <Icon className={cn('w-3.5 h-3.5', active ? 'text-slate-950' : t.color)} />
                    <span>{isAr ? t.labelAr : t.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {activeTab === 'directory' ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {isAr
                          ? 'فهرس الأدلة الهندسية لكافة وحدات وأدوات المنصة'
                          : 'Complete Platform Expert Manuals Directory'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isAr
                          ? 'اختر أي وحدة أو أداة أو مكون لعرض دليله الهندسي التفصيلي فوراً'
                          : 'Select any module, Lean pillar, AI studio, or gadget to inspect its full manual'}
                      </p>
                    </div>
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                          isAr ? 'ابحث في الأدلة (OEE, CBAM, غزل...)' : 'Search manuals (OEE, CBAM, Yarn...)'
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 ps-9 pe-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredManuals.map((m) => {
                      const isCurrent = m.id === currentManual.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setActiveManualId(m.id);
                            setActiveTab('overview');
                          }}
                          className={cn(
                            'text-start rounded-xl border p-3.5 transition-all flex flex-col justify-between gap-2 cursor-pointer',
                            isCurrent
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-slate-800 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-800/50'
                          )}
                        >
                          <div className="space-y-1">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                              {isAr ? m.badgeAr : m.badgeEn}
                            </span>
                            <h4 className="text-sm font-bold text-white">
                              {isAr ? m.titleAr : m.titleEn}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-2">
                              {isAr ? m.subtitleAr : m.subtitleEn}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-bold text-amber-400">
                            <span>{isAr ? 'فتح الدليل الشامل' : 'Open Manual'}</span>
                            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* SECTION 1: WHAT IS THIS? */}
                  {(activeTab === 'overview' || activeTab === 'what') && (
                    <section className="rounded-xl border border-emerald-500/30 bg-emerald-950/15 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-sm">
                          1
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-emerald-300">
                            {isAr
                              ? 'ما هي هذه الوحدة / الأداة؟ (What Is This?)'
                              : '1. What Is This Module / Feature?'}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {isAr
                              ? 'التعريف الهندسي والوظيفي والمكونات الفرعية'
                              : 'Functional & industrial engineering definition and sub-components'}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                        {isAr ? currentManual.whatIsThisAr : currentManual.whatIsThisEn}
                      </p>

                      {/* Sub-Features & Gadgets Breakdown */}
                      {currentManual.subFeatures && currentManual.subFeatures.length > 0 && (
                        <div className="pt-2 space-y-2.5">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>
                              {isAr
                                ? 'المكونات والأدوات الفرعية المدمجة داخل هذه الوحدة:'
                                : 'Integrated Sub-Features, Components & Gadgets:'}
                            </span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {currentManual.subFeatures.map((sf, idx) => (
                              <div
                                key={idx}
                                className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 space-y-1.5 flex flex-col justify-between"
                              >
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-white flex items-center justify-between gap-1.5">
                                    <span className="flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                      <span>{isAr ? sf.nameAr : sf.nameEn}</span>
                                    </span>
                                    {sf.linkedManualId && EXPERT_MANUALS[sf.linkedManualId] && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (sf.linkedManualId) {
                                            setActiveManualId(sf.linkedManualId);
                                            setActiveTab('overview');
                                          }
                                        }}
                                        className="text-[10px] font-bold text-amber-400 hover:underline shrink-0 cursor-pointer"
                                      >
                                        {isAr ? 'فتح دليل الأداة ←' : 'Open Manual →'}
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    {isAr ? sf.purposeAr : sf.purposeEn}
                                  </p>
                                </div>
                                <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-emerald-300/90">
                                  <strong className="text-emerald-400">
                                    {isAr ? 'طريقة الاستخدام: ' : 'How to use: '}
                                  </strong>
                                  {isAr ? sf.howToUseAr : sf.howToUseEn}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  {/* SECTION 2: HOW IT WORKS */}
                  {(activeTab === 'overview' || activeTab === 'howItWorks') && (
                    <section className="rounded-xl border border-sky-500/30 bg-sky-950/15 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 font-black text-sm">
                          2
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-sky-300">
                            {isAr
                              ? 'كيف تعمل تقنياً وهندسياً؟ (How It Works)'
                              : '2. How It Works (Technical & Engineering Mechanism)'}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {isAr
                              ? 'آلية العمل الحسابية وتدفق البيانات والمعادلات الهندسية'
                              : 'Data pipeline, computational logic, and industrial formulas'}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-4">
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                          {isAr ? currentManual.howItWorksAr : currentManual.howItWorksEn}
                        </p>
                      </div>

                      {currentManual.formulaOrArchitecture && (
                        <div className="rounded-xl border border-sky-400/40 bg-slate-950 p-3.5 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>
                              {isAr
                                ? 'المعادلة الهندسية / البنية المعمارية:'
                                : 'Engineering Formula / Technical Architecture:'}
                            </span>
                          </div>
                          <code className="block text-xs sm:text-sm font-mono text-amber-300 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 overflow-x-auto">
                            {currentManual.formulaOrArchitecture}
                          </code>
                        </div>
                      )}
                    </section>
                  )}

                  {/* SECTION 3: WHY TO USE */}
                  {(activeTab === 'overview' || activeTab === 'whyToUse') && (
                    <section className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-black text-sm">
                          3
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-amber-300">
                            {isAr
                              ? 'لماذا تستخدمها؟ القيمة والعائد الصناعي (Why To Use & ROI)'
                              : '3. Why To Use (Industrial Value & Quantified ROI)'}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {isAr
                              ? 'الفوائد التشغيلية والمالية والتصديرية المباشرة للمصنع'
                              : 'Direct operational, financial, and export compliance gains'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(isAr ? currentManual.whyToUseAr : currentManual.whyToUseEn).map(
                          (reason, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-amber-500/25 bg-slate-950/80 p-3.5 flex items-start gap-3"
                            >
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold shrink-0 mt-0.5">
                                ✓
                              </span>
                              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                                {reason}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  )}

                  {/* SECTION 4: HOW TO USE STEP-BY-STEP */}
                  {(activeTab === 'overview' || activeTab === 'howToUse') && (
                    <section className="rounded-xl border border-violet-500/30 bg-violet-950/15 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 font-black text-sm">
                          4
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-violet-300">
                            {isAr
                              ? 'كيف تستخدمها خطوة بخطوة؟ (How To Use — Step-by-Step)'
                              : '4. How To Use (Actionable Step-by-Step Guide)'}
                          </h3>
                          <p className="text-xs text-slate-400">
                            {isAr
                              ? 'دليل العمل التنفيذي من إدخال البيانات حتى استخراج النتائج'
                              : 'Standard operating procedure from data input to execution'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentManual.howToUseSteps.map((st, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-violet-500 text-slate-950 font-black text-xs shrink-0">
                                {idx + 1}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-white">
                                {isAr ? st.titleAr : st.titleEn}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed ps-8">
                              {isAr ? st.detailAr : st.detailEn}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Pro Engineer Tip */}
                      <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 to-slate-950 p-4 flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                            {isAr
                              ? '💡 نصيحة كبير المهندسين الصناعيين (Pro Engineer Tip):'
                              : '💡 Industrial Chief Engineer Pro Tip:'}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                            {isAr ? currentManual.proTipAr : currentManual.proTipEn}
                          </p>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 border-t border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 shrink-0">
              <span>
                {isAr
                  ? 'انقر على أي أيقونة (؟) بجانب أي أداة أو تبويب في المنصة لفتح دليلها الهندسي مباشرة.'
                  : 'Click any (?) icon next to any module, pillar tab, or gadget to open its dedicated manual.'}
              </span>
              <div className="flex items-center gap-2">
                {activeTab !== 'directory' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('directory')}
                    className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 font-bold text-slate-200 transition cursor-pointer"
                  >
                    {isAr
                      ? `استعراض كافة الأدلة (${EXPERT_MANUAL_LIST.length})`
                      : `Browse All ${EXPERT_MANUAL_LIST.length} Manuals`}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-1.5 font-bold text-slate-950 transition cursor-pointer"
                >
                  {isAr ? 'تم، فهمت الدليل' : 'Got It, Close Manual'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
