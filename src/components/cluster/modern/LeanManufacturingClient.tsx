'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Gauge,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Wrench,
  BarChart3,
  Repeat,
  ShieldAlert,
  FileText,
  Download,
  Printer,
  GraduationCap,
  Cpu,
  Zap,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { Pill } from '@/components/cluster/ui';
import {
  synthesizeLeanBlueprint,
  LEAN_DEPARTMENTS,
  type LeanBlueprintReport,
  type LeanDepartmentId,
} from '@/server/modernization/lean-manufacturing';
import {
  CLIENT_FREE_LLM_MODELS,
  type ClientFreeLlmModelId,
} from '@/server/modernization/module-ai-prompts';

interface Props {
  locale: string;
  initialFactory?: string;
  initialDepartment?: LeanDepartmentId;
  initialProduct?: string;
  initialBottleneck?: string;
  initialTab?: string;
}

export function LeanManufacturingClient({
  locale,
  initialFactory = 'El-Mahalla Premier Textile Mill',
  initialDepartment = 'full_mill',
  initialProduct = '100% Egyptian Giza 86 Combed Cotton Fabrics & Home Textiles',
  initialBottleneck = 'Long changeover times (SMED), WIP accumulation between weaving and dyeing, and shade rework',
  initialTab = 'vsm',
}: Props) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [factoryName, setFactoryName] = useState(initialFactory);
  const [department, setDepartment] = useState<LeanDepartmentId>(initialDepartment);
  const [productFocus, setProductFocus] = useState(initialProduct);
  const [primaryBottleneck, setPrimaryBottleneck] = useState(initialBottleneck);
  const [preferredModel, setPreferredModel] = useState<ClientFreeLlmModelId>('auto');
  const [loading, setLoading] = useState(false);

  const [blueprint, setBlueprint] = useState<LeanBlueprintReport>(() =>
    synthesizeLeanBlueprint({
      factoryName: initialFactory,
      department: initialDepartment,
      productFocus: initialProduct,
      primaryBottleneck: initialBottleneck,
    })
  );

  const [activeTab, setActiveTab] = useState<
    'vsm' | '5s' | 'oee_smed' | 'balancing' | 'kanban' | 'jidoka' | 'a3_hoshin'
  >((initialTab as any) || 'vsm');

  // --- Interactive Calculator States ---
  // 1. VSM & Takt Time
  const [shiftMinutes, setShiftMinutes] = useState(450);
  const [shiftsPerDay, setShiftsPerDay] = useState(2);
  const [dailyDemandUnits, setDailyDemandUnits] = useState(1200);
  const [futureStateApplied, setFutureStateApplied] = useState(false);

  // 2. 5S Interactive Audit Scores
  const [fiveSScores, setFiveSScores] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    blueprint.fiveSAuditItems.forEach((item) => {
      map[item.id] = item.defaultScore;
    });
    return map;
  });

  // 3. OEE & SMED Interactive Calculator
  const [oeePlannedMin, setOeePlannedMin] = useState(480);
  const [oeeScheduledBreakMin, setOeeScheduledBreakMin] = useState(30);
  const [oeeDownMin, setOeeDownMin] = useState(85);
  const [oeeIdealSecPerUnit, setOeeIdealSecPerUnit] = useState(36);
  const [oeeTotalProduced, setOeeTotalProduced] = useState(520);
  const [oeeDefects, setOeeDefects] = useState(28);
  const [smedOptimized, setSmedOptimized] = useState(false);

  // 4. Line Balancing / Yamazumi State
  const [lineBalanced, setLineBalanced] = useState(false);

  // 5. Kanban Pull Calculator State
  const [kanbanDailyDemand, setKanbanDailyDemand] = useState(1500);
  const [kanbanLeadDays, setKanbanLeadDays] = useState(2.5);
  const [kanbanSafetyPct, setKanbanSafetyPct] = useState(20);
  const [kanbanBinCap, setKanbanBinCap] = useState(250);

  // 6. Andon Live Status Simulator
  const [andonStates, setAndonStates] = useState<Record<string, 'GREEN' | 'AMBER' | 'RED'>>({
    'Warping & Sizing': 'GREEN',
    'Air-Jet Weaving Bay A': 'AMBER',
    'Reactive Dyeing Jet #4': 'GREEN',
    'Stenter Finishing Line': 'GREEN',
    'Sewing & Packing Cell #1': 'GREEN',
  });

  // --- Computed Metrics ---
  const taktTimeSec = useMemo(() => {
    const netSec = shiftMinutes * shiftsPerDay * 60;
    return Math.max(1, Math.round(netSec / Math.max(1, dailyDemandUnits)));
  }, [shiftMinutes, shiftsPerDay, dailyDemandUnits]);

  const vsmMetrics = useMemo(() => {
    const totalWipHours = blueprint.vsmSteps.reduce(
      (acc, s) => acc + (futureStateApplied ? s.wipWaitHours * 0.38 : s.wipWaitHours),
      0
    );
    const totalVaMin = blueprint.vsmSteps.reduce((acc, s) => acc + s.valueAddedMin, 0);
    const totalLeadTimeMin = totalWipHours * 60 + totalVaMin;
    const pcePct = ((totalVaMin / Math.max(1, totalLeadTimeMin)) * 100).toFixed(1);
    const totalLeadDays = (totalLeadTimeMin / (60 * 24)).toFixed(1);
    return { totalWipHours: Math.round(totalWipHours), totalVaMin, pcePct, totalLeadDays };
  }, [blueprint.vsmSteps, futureStateApplied]);

  const wasteSummary = useMemo(() => {
    const totalMonthlyLossEgp = blueprint.eightWastes.reduce(
      (acc, w) => acc + w.estimatedMonthlyLossEgp,
      0
    );
    const achievableMonthlySavingsEgp = blueprint.eightWastes.reduce(
      (acc, w) => acc + Math.round((w.estimatedMonthlyLossEgp * w.targetReductionPct) / 100),
      0
    );
    return {
      totalMonthlyLossEgp,
      achievableMonthlySavingsEgp,
      annualSavingsEgp: achievableMonthlySavingsEgp * 12,
    };
  }, [blueprint.eightWastes]);

  const fiveSSummary = useMemo(() => {
    const items = blueprint.fiveSAuditItems;
    const maxPoints = items.length * 5;
    const earned = items.reduce((acc, item) => acc + (fiveSScores[item.id] ?? item.defaultScore), 0);
    const pct = Math.round((earned / Math.max(1, maxPoints)) * 100);
    const tier =
      pct >= 85
        ? t('World-Class Shingo Gold (≥85%)', 'المستوى الذهبي العالمي Shingo (≥٨٥٪)')
        : pct >= 70
        ? t('Silver Lean Certified (70–84%)', 'المستوى الفضي المعتمد (٧٠–٨٤٪)')
        : pct >= 55
        ? t('Bronze Developing (55–69%)', 'المستوى البرونزي التأسيسي (٥٥–٦٩٪)')
        : t('Action Required (<55%)', 'يحتاج تدخل كايزن عاجل (<٥٥٪)');
    return { earned, maxPoints, pct, tier };
  }, [blueprint.fiveSAuditItems, fiveSScores, locale]);

  const oeeMetrics = useMemo(() => {
    const plannedProdTime = Math.max(1, oeePlannedMin - oeeScheduledBreakMin);
    const runTime = Math.max(1, plannedProdTime - oeeDownMin);
    const availability = Math.min(100, (runTime / plannedProdTime) * 100);
    const idealTotalTimeMin = (oeeTotalProduced * oeeIdealSecPerUnit) / 60;
    const performance = Math.min(100, (idealTotalTimeMin / runTime) * 100);
    const goodUnits = Math.max(0, oeeTotalProduced - oeeDefects);
    const quality = oeeTotalProduced > 0 ? Math.min(100, (goodUnits / oeeTotalProduced) * 100) : 0;
    const oee = (availability * performance * quality) / 10000;
    return {
      availability: availability.toFixed(1),
      performance: performance.toFixed(1),
      quality: quality.toFixed(1),
      oee: oee.toFixed(1),
      oeeNum: oee,
      goodUnits,
    };
  }, [
    oeePlannedMin,
    oeeScheduledBreakMin,
    oeeDownMin,
    oeeIdealSecPerUnit,
    oeeTotalProduced,
    oeeDefects,
  ]);

  const smedSummary = useMemo(() => {
    const beforeMin = blueprint.smedTasks.reduce((a, s) => a + s.beforeMinutes, 0);
    const afterMin = blueprint.smedTasks.reduce((a, s) => a + s.afterMinutes, 0);
    const savedPct = Math.round(((beforeMin - afterMin) / Math.max(1, beforeMin)) * 100);
    return { beforeMin, afterMin, savedPct };
  }, [blueprint.smedTasks]);

  const balancedStations = useMemo(() => {
    return blueprint.workstations.map((ws) => {
      if (!lineBalanced) return ws;
      const reducedNva = Math.max(2, Math.round(ws.nvaSec * 0.25));
      const smoothedVa = ws.vaSec > 42 ? 41 : ws.vaSec;
      return {
        ...ws,
        vaSec: smoothedVa,
        nvaSec: reducedNva,
        cycleTimeSec: smoothedVa + reducedNva,
      };
    });
  }, [blueprint.workstations, lineBalanced]);

  const lineBalanceMetrics = useMemo(() => {
    const sumCt = balancedStations.reduce((a, s) => a + s.cycleTimeSec, 0);
    const maxCt = Math.max(...balancedStations.map((s) => s.cycleTimeSec), 1);
    const lbePct = Math.round((sumCt / (balancedStations.length * maxCt)) * 100);
    const totalSamMin = (sumCt / 60).toFixed(2);
    const hourlyCap = Math.round(3600 / maxCt);
    return { sumCt, maxCt, lbePct, totalSamMin, hourlyCap };
  }, [balancedStations]);

  const kanbanResult = useMemo(() => {
    const safetyFactor = 1 + kanbanSafetyPct / 100;
    const totalUnitsInLoop = kanbanDailyDemand * kanbanLeadDays * safetyFactor;
    const cards = Math.max(2, Math.ceil(totalUnitsInLoop / Math.max(1, kanbanBinCap)));
    const maxWipUnits = cards * kanbanBinCap;
    return { cards, maxWipUnits };
  }, [kanbanDailyDemand, kanbanLeadDays, kanbanSafetyPct, kanbanBinCap]);

  const handleGenerateBlueprint = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cluster/lean-manufacturing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factoryName,
          department,
          productFocus,
          primaryBottleneck,
          preferredModel,
          locale,
        }),
      });
      const data = await res.json();
      if (data?.blueprint) {
        setBlueprint(data.blueprint);
      }
    } catch {
      // fallback already populated
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadA3Markdown = () => {
    const a3 = blueprint.a3Report;
    const md = `# ${isAr ? a3.titleAr : a3.titleEn}
- **Factory**: ${blueprint.factoryName}
- **Department**: ${blueprint.department}
- **Product Focus**: ${blueprint.productFocus}
- **Generated**: ${new Date().toISOString().slice(0, 10)}

## 1. Background
${isAr ? a3.backgroundAr : a3.backgroundEn}

## 2. Current Condition
${isAr ? a3.currentStateAr : a3.currentStateEn}

## 3. Target Condition (90-Day Goal)
${isAr ? a3.targetGoalAr : a3.targetGoalEn}

## 4. 5-Whys Root Cause Analysis
${a3.fiveWhys
  .map(
    (w) =>
      `- **Why ${w.whyLevel}**: ${isAr ? w.questionAr : w.questionEn}\n  - *Answer*: ${
        isAr ? w.answerAr : w.answerEn
      }`
  )
  .join('\n')}

## 5. Countermeasures & Implementation Plan
| Action | Owner | Timeline | Expected Gain |
|---|---|---|---|
${a3.countermeasures
  .map(
    (c) =>
      `| ${isAr ? c.actionAr : c.actionEn} | ${isAr ? c.ownerAr : c.ownerEn} | ${
        isAr ? c.timelineAr : c.timelineEn
      } | ${isAr ? c.expectedGainAr : c.expectedGainEn} |`
  )
  .join('\n')}

## 6. Standardization & Follow-Up
${isAr ? a3.followUpStandardAr : a3.followUpStandardEn}
`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lean-a3-report-${blueprint.factoryName.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    {
      id: 'vsm' as const,
      icon: Layers,
      labelEn: '1. VSM, Takt Time & 8 Wastes',
      labelAr: '١. تدفق القيمة (VSM) والفواقد الـ ٨',
    },
    {
      id: '5s' as const,
      icon: CheckCircle2,
      labelEn: '2. 5S Audit & Gemba Walk',
      labelAr: '٢. تدقيق 5S وجولات الجيمبا',
    },
    {
      id: 'oee_smed' as const,
      icon: Wrench,
      labelEn: '3. TPM, OEE & SMED Changeover',
      labelAr: '٣. الصيانة الشاملة و OEE و SMED',
    },
    {
      id: 'balancing' as const,
      icon: BarChart3,
      labelEn: '4. Line Balancing & Yamazumi',
      labelAr: '٤. توازن الخطوط ومخطط يامازومي',
    },
    {
      id: 'kanban' as const,
      icon: Repeat,
      labelEn: '5. Kanban Pull & Heijunka',
      labelAr: '٥. نظام السحب كانبان و Heijunka',
    },
    {
      id: 'jidoka' as const,
      icon: ShieldAlert,
      labelEn: '6. Jidoka, Andon & Poka-Yoke',
      labelAr: '٦. الإيقاف الذاتي و Poka-Yoke',
    },
    {
      id: 'a3_hoshin' as const,
      icon: FileText,
      labelEn: '7. A3 Report, Kaizen & Hoshin Kanri',
      labelAr: '٧. تقرير A3 وكايزن وهوشين كانري',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top AI Lean Sensei Configuration & Generator Panel */}
      <div className="rounded-3xl border-2 border-emerald-500/35 bg-gradient-to-br from-slate-950 via-emerald-950/90 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-300">
              <Gauge className="h-3.5 w-3.5" />
              {t(
                'TOYOTA PRODUCTION SYSTEM (TPS) • LEAN SIX SIGMA • UNIDO BENCHMARKS',
                'نظام إنتاج تويوتا (TPS) • التصنيع الرشيق لين 6 سيجما • معايير اليونيدو'
              )}
            </span>
            {blueprint.aiModelUsed && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                <Cpu className="h-3 w-3" /> {blueprint.aiModelUsed}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">
              {t('Free LLM Sensei:', 'محرك اللين الذكي:')}
            </span>
            <select
              value={preferredModel}
              onChange={(e) => setPreferredModel(e.target.value as ClientFreeLlmModelId)}
              className="rounded-xl border border-white/20 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white outline-none cursor-pointer"
            >
              {CLIENT_FREE_LLM_MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                  {isAr ? m.labelAr : m.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleGenerateBlueprint} className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-emerald-300 mb-1">
              {t('Factory / Mill Name', 'اسم المصنع أو الشركة')}
            </label>
            <input
              type="text"
              value={factoryName}
              onChange={(e) => setFactoryName(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-emerald-300 mb-1">
              {t('Target Department / Value Stream', 'القسم أو سلسلة القيمة المستهدفة')}
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as LeanDepartmentId)}
              className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              {LEAN_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                  {isAr ? d.labelAr : d.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-emerald-300 mb-1">
              {t('Product Line / SKU Focus', 'المنتج الرئيسي')}
            </label>
            <input
              type="text"
              value={productFocus}
              onChange={(e) => setProductFocus(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-emerald-300 mb-1">
              {t('Primary Shop-Floor Bottleneck', 'التحدي التشغيلي أو نقطة الاختناق')}
            </label>
            <input
              type="text"
              value={primaryBottleneck}
              onChange={(e) => setPrimaryBottleneck(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-12 flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-300">{t('Quick Presets:', 'نماذج سريعة:')}</span>
              {[
                {
                  f: 'Misr Spinning & Weaving — Compact Mill #2',
                  d: 'spinning' as LeanDepartmentId,
                  p: 'Combed Giza 86 Yarn Ne 40/1',
                  b: 'High doffing downtime, flyer lint stops & cone lot mixing',
                },
                {
                  f: 'Al-Rowad Dyehouse & Finishing',
                  d: 'dyeing_finishing' as LeanDepartmentId,
                  p: 'Reactive Dyed Sateen & Terry Towels',
                  b: 'Long dye-bath turnaround (85 min) & 6.5% off-shade re-dyeing',
                },
                {
                  f: 'Nile Delta Export Garments & Home Textiles',
                  d: 'cutting_sewing' as LeanDepartmentId,
                  p: 'Hotel Duvet Covers & Fitted Sheets',
                  b: 'Unbalanced sewing stations, WIP bundles & 3.4% DHU seam defects',
                },
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFactoryName(preset.f);
                    setDepartment(preset.d);
                    setProductFocus(preset.p);
                    setPrimaryBottleneck(preset.b);
                  }}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold hover:bg-emerald-500/25 hover:border-emerald-400 transition cursor-pointer"
                >
                  {preset.f}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition shadow-lg cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              {loading
                ? t('AI Synthesizing Lean Master Plan...', 'جارٍ توليد خطة اللين المتكاملة...')
                : t(
                    '✨ Generate AI Lean Manufacturing Master Plan',
                    '✨ توليد خطة الإدارة والتصنيع الرشيق بالذكاء الاصطناعي'
                  )}
            </button>
          </div>
        </form>

        {/* AI Executive Lean Sensei Brief */}
        {(blueprint.aiExecutiveSummaryEn || blueprint.aiExecutiveSummaryAr) && (
          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-slate-900/85 p-5 prose prose-sm prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {isAr
                ? blueprint.aiExecutiveSummaryAr || blueprint.aiExecutiveSummaryEn || ''
                : blueprint.aiExecutiveSummaryEn || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Top Executive KPI Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('Takt Time', 'زمن التاكت (Takt Time)')}</div>
          <div className="text-2xl font-extrabold text-primary mt-1">{taktTimeSec}s</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {t('per unit customer beat', 'لكل وحدة حسب طلب العميل')}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('Lead Time & PCE', 'زمن التوريد وكفاءة الدورة')}</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {vsmMetrics.totalLeadDays} {t('days', 'يوم')}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            PCE: <strong>{vsmMetrics.pcePct}%</strong> ({vsmMetrics.totalVaMin}m VA)
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('Live OEE Score', 'كفاءة الماكينات الكلية OEE')}</div>
          <div className="text-2xl font-extrabold text-sky-600 mt-1">{oeeMetrics.oee}%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {t('World-Class Target: 85%', 'المعيار العالمي: ٨٥٪')}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('5S Workplace Score', 'تقييم بيئة العمل 5S')}</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{fiveSSummary.pct}%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{fiveSSummary.tier}</div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-xs col-span-2 md:col-span-1">
          <div className="text-xs text-muted-foreground">{t('Annual Waste Savings', 'الوفر السنوي من الفواقد')}</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {fmtNumber(locale, wasteSummary.annualSavingsEgp)} EGP
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {t('From 8 Wastes (DOWNTIME)', 'من القضاء على الفواقد الـ ٨')}
          </div>
        </div>
      </div>

      {/* 7-Pillar Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                active
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-muted/60 text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Value Stream Mapping (VSM), Takt Time & 8 Wastes (DOWNTIME) */}
      {activeTab === 'vsm' && (
        <div className="space-y-8">
          {/* Takt Time & Future-State VSM Simulator Bar */}
          <div className="rounded-2xl border bg-card p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">
                  {t(
                    'Interactive Value Stream Map (VSM) & Takt Time Calculator',
                    'خريطة تدفق القيمة التفاعلية (VSM) وحاسبة زمن التاكت'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    'Compare Current-State push production vs. Future-State Lean pull flow across the mill.',
                    'قارن بين الوضع الحالي (الإنتاج بالدفع) والوضع المستقبلي الرشيق (التدفق والسحب) عبر مراحل المصنع.'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFutureStateApplied((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                  futureStateApplied
                    ? 'bg-emerald-600 text-white'
                    : 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                <Zap className="h-4 w-4" />
                {futureStateApplied
                  ? t('✓ Future-State Lean Pull Active (-62% WIP)', '✓ تم تفعيل خريطة الحالة المستقبلية (-٦٢٪ مخزون)')
                  : t('Simulate Future-State VSM Transformation', 'محاكاة خريطة التدفق المستقبلية (Future-State VSM)')}
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border bg-muted/30 p-3.5">
                <label className="block text-xs font-semibold mb-1">
                  {t('Net Available Time per Shift (min)', 'صافي وقت العمل للوردية (دقيقة)')}
                </label>
                <input
                  type="number"
                  min={60}
                  max={720}
                  value={shiftMinutes}
                  onChange={(e) => setShiftMinutes(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3.5">
                <label className="block text-xs font-semibold mb-1">
                  {t('Shifts per Day', 'عدد الورديات اليومية')}
                </label>
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={shiftsPerDay}
                  onChange={(e) => setShiftsPerDay(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3.5">
                <label className="block text-xs font-semibold mb-1">
                  {t('Daily Customer Demand (Units / Rolls)', 'الطلب اليومي للعملاء (وحدة / رول)')}
                </label>
                <input
                  type="number"
                  min={10}
                  value={dailyDemandUnits}
                  onChange={(e) => setDailyDemandUnits(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm font-bold"
                />
              </div>
            </div>

            {/* VSM Process Boxes */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {blueprint.vsmSteps.map((step) => {
                const wipHrs = futureStateApplied
                  ? Math.round(step.wipWaitHours * 0.38)
                  : step.wipWaitHours;
                const coMin = futureStateApplied
                  ? Math.round(step.changeoverMin * 0.42)
                  : step.changeoverMin;
                const overTakt = step.cycleTimeSec > taktTimeSec;
                return (
                  <div
                    key={step.id}
                    className={`rounded-2xl border p-4 space-y-3 ${
                      overTakt ? 'border-amber-500/50 bg-amber-500/5' : 'bg-muted/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm">
                        {isAr ? step.stepNameAr : step.stepNameEn}
                      </h3>
                      <Pill tone={overTakt ? 'amber' : 'emerald'}>
                        C/T: {step.cycleTimeSec}s
                      </Pill>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-background p-2 border">
                        <span className="text-muted-foreground block text-[10px]">
                          {t('Changeover (C/O)', 'زمن التغيير C/O')}
                        </span>
                        <strong>{coMin} min</strong>
                      </div>
                      <div className="rounded-lg bg-background p-2 border">
                        <span className="text-muted-foreground block text-[10px]">
                          {t('Machine Uptime', 'الإتاحة التشغيلية')}
                        </span>
                        <strong>{step.uptimePct}%</strong>
                      </div>
                      <div className="rounded-lg bg-background p-2 border">
                        <span className="text-muted-foreground block text-[10px]">
                          {t('WIP Queue Wait', 'انتظار المخزون البيني')}
                        </span>
                        <strong className="text-amber-600">{wipHrs} hrs</strong>
                      </div>
                      <div className="rounded-lg bg-background p-2 border">
                        <span className="text-muted-foreground block text-[10px]">
                          {t('Value-Added (VA)', 'الوقت المضيف للقيمة')}
                        </span>
                        <strong className="text-emerald-600">{step.valueAddedMin} min</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 8 Wastes of Lean (DOWNTIME) Diagnostic Matrix */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">
                  {t(
                    'The 8 Wastes of Lean (DOWNTIME) Diagnostic & Financial Impact',
                    'تشخيص الفواقد الثمانية (DOWNTIME) والأثر المالي الشهري'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Total Monthly Loss Identified: ',
                    'إجمالي الفاقد الشهري المرصود: '
                  )}
                  <strong className="text-rose-600">
                    {fmtNumber(locale, wasteSummary.totalMonthlyLossEgp)} EGP/mo
                  </strong>{' '}
                  | {t('Target Monthly Recovery: ', 'الوفر الشهري المستهدف: ')}
                  <strong className="text-emerald-600">
                    {fmtNumber(locale, wasteSummary.achievableMonthlySavingsEgp)} EGP/mo
                  </strong>
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {blueprint.eightWastes.map((w) => (
                <div key={w.code} className="rounded-xl border p-4 space-y-2 bg-muted/15">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-extrabold text-sm">
                        {w.code}
                      </span>
                      <h3 className="font-bold text-sm">{isAr ? w.nameAr : w.nameEn}</h3>
                    </div>
                    <Pill tone="red">
                      -{fmtNumber(locale, w.estimatedMonthlyLossEgp)} EGP/{t('mo', 'شهر')}
                    </Pill>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>{t('Shop-Floor Symptom:', 'المظهر في العنبر:')}</strong>{' '}
                    {isAr ? w.symptomAr : w.symptomEn}
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">
                    <strong>{t('Lean Countermeasure:', 'العلاج الرشيق (Lean):')}</strong>{' '}
                    {isAr ? w.countermeasureAr : w.countermeasureEn} (
                    <strong>-{w.targetReductionPct}%</strong>)
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 5S Workplace Audit & Gemba Walk Scorer */}
      {activeTab === '5s' && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">
                  {t(
                    'Interactive 5S Workplace Organization & Gemba Audit Scorer',
                    'مصفوفة التدقيق التفاعلي لنظام 5S وجولات الجيمبا الميدانية'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Score each criterion from 1 (Ad-hoc) to 5 (World-Class Shingo Standard) during your Gemba walk.',
                    'قيّم كل بند من ١ (ضعيف) إلى ٥ (معيار عالمي) أثناء جولة المراجعة في صالة الإنتاج.'
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const upgraded: Record<string, number> = {};
                    blueprint.fiveSAuditItems.forEach((item) => {
                      upgraded[item.id] = 5;
                    });
                    setFiveSScores(upgraded);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-500 transition cursor-pointer"
                >
                  {t('Simulate 5/5 World-Class 5S', 'محاكاة المستوى الذهبي الكامل (5/5)')}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {blueprint.fiveSAuditItems.map((item) => {
                const current = fiveSScores[item.id] ?? item.defaultScore;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/15"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Pill tone="emerald">
                          {isAr ? item.pillarTitleAr : item.pillarTitleEn}
                        </Pill>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {item.standardRef}
                        </span>
                      </div>
                      <p className="text-sm font-medium mt-1">
                        {isAr ? item.criterionAr : item.criterionEn}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((scoreVal) => (
                        <button
                          key={scoreVal}
                          type="button"
                          onClick={() =>
                            setFiveSScores((prev) => ({ ...prev, [item.id]: scoreVal }))
                          }
                          className={`h-9 w-9 rounded-lg font-extrabold text-xs transition cursor-pointer ${
                            current === scoreVal
                              ? 'bg-emerald-600 text-white shadow'
                              : 'border bg-background hover:bg-muted'
                          }`}
                        >
                          {scoreVal}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TPM, OEE & SMED Quick Changeover */}
      {activeTab === 'oee_smed' && (
        <div className="space-y-8">
          {/* Interactive OEE Calculator */}
          <div className="rounded-2xl border bg-card p-6 space-y-5">
            <div>
              <h2 className="text-lg font-extrabold">
                {t(
                  'TPM Overall Equipment Effectiveness (OEE) & Six Big Losses Calculator',
                  'حاسبة الفعالية الكلية للمعدات (OEE) والصيانة الإنتاجية الشاملة (TPM)'
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t(
                  'Formula: OEE = Availability × Performance × Quality (Right-First-Time)',
                  'المعادلة القياسية: OEE = الإتاحة × الأداء × الجودة من المرة الأولى'
                )}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Shift Length (min)', 'وقت الوردية (دقيقة)')}
                </label>
                <input
                  type="number"
                  value={oeePlannedMin}
                  onChange={(e) => setOeePlannedMin(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Planned PM/Breaks (min)', 'توقف مخطط/صيانة (د)')}
                </label>
                <input
                  type="number"
                  value={oeeScheduledBreakMin}
                  onChange={(e) => setOeeScheduledBreakMin(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Unplanned Stops (min)', 'أعطال وتغيير (دقيقة)')}
                </label>
                <input
                  type="number"
                  value={oeeDownMin}
                  onChange={(e) => setOeeDownMin(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Ideal Cycle (sec/unit)', 'الزمن المثالي (ث/وحدة)')}
                </label>
                <input
                  type="number"
                  value={oeeIdealSecPerUnit}
                  onChange={(e) => setOeeIdealSecPerUnit(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Total Produced', 'إجمالي الإنتاج بالوردية')}
                </label>
                <input
                  type="number"
                  value={oeeTotalProduced}
                  onChange={(e) => setOeeTotalProduced(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Defective / Rework', 'المعيب / إعادة التشغيل')}
                </label>
                <input
                  type="number"
                  value={oeeDefects}
                  onChange={(e) => setOeeDefects(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">{t('Availability', 'الإتاحة التشغيلية')}</div>
                <div className="text-2xl font-extrabold text-primary mt-1">{oeeMetrics.availability}%</div>
              </div>
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">{t('Performance', 'كفاءة الأداء والسرعة')}</div>
                <div className="text-2xl font-extrabold text-sky-600 mt-1">{oeeMetrics.performance}%</div>
              </div>
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">{t('Quality (RFT)', 'نسبة الجودة RFT')}</div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">{oeeMetrics.quality}%</div>
              </div>
              <div className="rounded-2xl border-2 border-emerald-500/40 p-4 bg-emerald-500/10">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {t('Overall OEE Score', 'المؤشر الكلي OEE')}
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">{oeeMetrics.oee}%</div>
              </div>
            </div>
          </div>

          {/* SMED Quick Changeover Matrix */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">
                  {t(
                    'SMED (Single-Minute Exchange of Die) Quick Changeover Optimizer',
                    'تحليل وتقليص زمن تغيير التشغيلات والمطاوي (SMED Pit-Stop)'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t('Before SMED:', 'قبل SMED:')} <strong>{smedSummary.beforeMin} min</strong> →{' '}
                  {t('After SMED:', 'بعد SMED:')}{' '}
                  <strong className="text-emerald-600">{smedSummary.afterMin} min</strong> (
                  <strong>-{smedSummary.savedPct}%</strong>)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSmedOptimized((prev) => !prev);
                  setOeeDownMin((prev) => (smedOptimized ? 85 : 32));
                }}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-500 transition cursor-pointer"
              >
                {smedOptimized
                  ? t('✓ SMED Applied to OEE Calculator', '✓ تم تطبيق وفر SMED على حاسبة OEE')
                  : t('Apply SMED Time Savings to Live OEE', 'تطبيق وفر SMED مباشرة على حاسبة OEE')}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40 text-start">
                    <th className="p-3 text-start">{t('Setup Step', 'خطوة الإعداد والتغيير')}</th>
                    <th className="p-3 text-start">{t('Before', 'قبل')}</th>
                    <th className="p-3 text-start">{t('Target Class', 'التصنيف المستهدف')}</th>
                    <th className="p-3 text-start">{t('After SMED', 'بعد SMED')}</th>
                    <th className="p-3 text-start">{t('Engineering Method', 'طريقة التحسين الهندسي')}</th>
                  </tr>
                </thead>
                <tbody>
                  {blueprint.smedTasks.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-muted/20">
                      <td className="p-3 font-semibold">{isAr ? s.taskAr : s.taskEn}</td>
                      <td className="p-3 font-mono text-rose-600">{s.beforeMinutes} min</td>
                      <td className="p-3">
                        <Pill tone={s.targetCategory === 'EXTERNAL' ? 'emerald' : 'blue'}>
                          {s.targetCategory}
                        </Pill>
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-600">
                        {s.afterMinutes} min
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {isAr ? s.improvementMethodAr : s.improvementMethodEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Line Balancing, Yamazumi Chart & SAM Costing */}
      {activeTab === 'balancing' && (
        <div className="rounded-2xl border bg-card p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold">
                {t(
                  'Workstation Line Balancing, Yamazumi Chart & SAM Costing',
                  'موازنة خطوط الإنتاج ومخطط يامازومي (Yamazumi) وحساب الزمن القياسي SAM'
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t('Line Balance Efficiency (LBE):', 'كفاءة توازن الخط (LBE):')}{' '}
                <strong className="text-emerald-600">{lineBalanceMetrics.lbePct}%</strong> |{' '}
                {t('Total SAM:', 'إجمالي الزمن القياسي SAM:')}{' '}
                <strong>{lineBalanceMetrics.totalSamMin} min</strong> |{' '}
                {t('Line Hourly Output:', 'القدرة بالساعة:')}{' '}
                <strong>{lineBalanceMetrics.hourlyCap} units/hr</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLineBalanced((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-500 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {lineBalanced
                ? t('Reset to Unbalanced Baseline', 'إعادة للوضع قبل الموازنة')
                : t('✨ AI Auto-Balance Workstations & Strip NVA', '✨ موازنة الخط آلياً وحذف الحركات غير المضيفة للقيمة')}
            </button>
          </div>

          <div className="space-y-4">
            {balancedStations.map((ws) => {
              const overTakt = ws.cycleTimeSec > taktTimeSec;
              const widthPct = Math.min(100, Math.round((ws.cycleTimeSec / 75) * 100));
              const vaWidthPct = Math.round((ws.vaSec / Math.max(1, ws.cycleTimeSec)) * 100);
              return (
                <div key={ws.id} className="rounded-xl border p-4 space-y-2 bg-muted/15">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-bold">{isAr ? ws.stationAr : ws.stationEn}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        VA: <strong className="text-emerald-600">{ws.vaSec}s</strong> + NVA:{' '}
                        <strong className="text-amber-600">{ws.nvaSec}s</strong> ={' '}
                        <strong>{ws.cycleTimeSec}s</strong> ({t('Takt:', 'التاكت:')} {taktTimeSec}s)
                      </span>
                      <Pill tone={overTakt ? 'red' : 'emerald'}>
                        {overTakt
                          ? t('Bottleneck > Takt', 'اختناق > التاكت')
                          : t('Balanced ≤ Takt', 'متوازن ≤ التاكت')}
                      </Pill>
                    </div>
                  </div>
                  <div className="h-4 w-full rounded-full bg-muted overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${(widthPct * vaWidthPct) / 100}%` }}
                      title="Value-Added Time"
                    />
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: `${(widthPct * (100 - vaWidthPct)) / 100}%` }}
                      title="Non-Value-Added Motion"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Kanban Pull System, Supermarket Sizing & Heijunka */}
      {activeTab === 'kanban' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="text-lg font-extrabold">
              {t(
                'Kanban Card & Supermarket Bin Sizing Calculator',
                'حاسبة عدد بطاقات كانبان وحجم مخزون السوبرماركت (Pull System)'
              )}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t(
                'Formula: N = ceil( (Daily Demand × Lead Time × (1 + Safety %)) / Container Capacity )',
                'المعادلة: عدد بطاقات كانبان = السقف الأعلى لـ (الطلب اليومي × زمن التوريد × معامل الأمان ÷ سعة العربة)'
              )}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {t('Daily Demand (kg / units)', 'الاستهلاك اليومي (كجم / قطعة)')}
                </label>
                <input
                  type="number"
                  value={kanbanDailyDemand}
                  onChange={(e) => setKanbanDailyDemand(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {t('Replenishment Lead Time (Days)', 'زمن الاستعاضة والتوريد (أيام)')}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={kanbanLeadDays}
                  onChange={(e) => setKanbanLeadDays(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {t('Safety Buffer Factor (%)', 'نسبة مخزون الأمان (%)')}
                </label>
                <input
                  type="number"
                  value={kanbanSafetyPct}
                  onChange={(e) => setKanbanSafetyPct(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {t('Standard Trolley / Bin Capacity', 'سعة العربة أو الحاوية القياسية')}
                </label>
                <input
                  type="number"
                  value={kanbanBinCap}
                  onChange={(e) => setKanbanBinCap(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 p-4">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {t('Required Kanban Cards / Bins', 'عدد بطاقات وعربات كانبان المطلوبة')}
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">
                  {kanbanResult.cards} {t('Cards', 'بطاقة')}
                </div>
              </div>
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="text-xs text-muted-foreground">
                  {t('Strict WIP Inventory Cap', 'الحد الأقصى المسموح للمخزون البيني')}
                </div>
                <div className="text-2xl font-extrabold mt-1">
                  {fmtNumber(locale, kanbanResult.maxWipUnits)} {t('units', 'وحدة')}
                </div>
              </div>
            </div>
          </div>

          {/* Printable Visual Kanban Card Preview */}
          <div className="lg:col-span-6 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold">
                  PRODUCTION & WITHDRAWAL KANBAN CARD • KB-MHL-01
                </span>
                <h3 className="font-extrabold text-base">{blueprint.factoryName}</h3>
              </div>
              <Pill tone="emerald">{t('PULL TRIGGER', 'إشارة سحب كانبان')}</Pill>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border p-2.5 bg-muted/20">
                <span className="text-muted-foreground block">{t('Item / Material Spec:', 'الصنف والمواصفة:')}</span>
                <strong>{blueprint.productFocus}</strong>
              </div>
              <div className="rounded-lg border p-2.5 bg-muted/20">
                <span className="text-muted-foreground block">{t('Standard Container Qty:', 'سعة الحاوية القياسية:')}</span>
                <strong>{kanbanBinCap} units / trolley</strong>
              </div>
              <div className="rounded-lg border p-2.5 bg-muted/20">
                <span className="text-muted-foreground block">{t('Upstream Supplier Process:', 'القسم المورّد (المنبع):')}</span>
                <strong>Weaving / Dyeing Supermarket Bay #2</strong>
              </div>
              <div className="rounded-lg border p-2.5 bg-muted/20">
                <span className="text-muted-foreground block">{t('Downstream Customer Process:', 'القسم المستهلك (المصب):')}</span>
                <strong>Finishing / Cutting & Sewing Cell #1</strong>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg">
              {t(
                'Kanban Rule: Never produce or move a trolley without an attached Kanban card. Defective items must never be passed downstream (Jidoka).',
                'قاعدة كانبان الذهبية: يمنع إنتاج أو تحريك أي عربة بدون بطاقة كانبان مرفقة، ويمنع تمرير أي قطعة معيبة للمرحلة التالية.'
              )}
            </p>
          </div>
        </div>
      )}

      {/* TAB 6: Jidoka, Andon Board, Poka-Yoke & Root Cause (5 Whys + Ishikawa) */}
      {activeTab === 'jidoka' && (
        <div className="space-y-8">
          {/* Interactive Andon Shop-Floor Control Board */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div>
              <h2 className="text-lg font-extrabold">
                {t(
                  'Live Andon Shop-Floor Visual Control & Jidoka Stop Simulator',
                  'لوحة أندون (Andon) البصرية للإدارة اللحظية ومحاكاة الإيقاف الذاتي (Jidoka)'
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t(
                  'Click any bay to cycle its Andon state (Green = Normal, Amber = Changeover/Material Call, Red = Jidoka Quality Stop).',
                  'اضغط على أي خط لتغيير حالة إنذار أندون (أخضر = تشغيل طبيعي، أصفر = استدعاء مساعدة/تغيير، أحمر = توقف جودة Jidoka).'
                )}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Object.entries(andonStates).map(([bay, state]) => {
                const nextState =
                  state === 'GREEN' ? 'AMBER' : state === 'AMBER' ? 'RED' : 'GREEN';
                const styles =
                  state === 'GREEN'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : state === 'AMBER'
                    ? 'border-amber-500/60 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                    : 'border-rose-500 bg-rose-500/20 text-rose-700 dark:text-rose-300 animate-pulse';
                return (
                  <button
                    key={bay}
                    type="button"
                    onClick={() =>
                      setAndonStates((prev) => ({ ...prev, [bay]: nextState }))
                    }
                    className={`rounded-2xl border-2 p-4 text-start transition cursor-pointer ${styles}`}
                  >
                    <div className="text-xs font-extrabold uppercase">{state} ANDON</div>
                    <div className="font-bold text-sm mt-1">{bay}</div>
                    <div className="text-[11px] mt-2 opacity-80">
                      {state === 'GREEN'
                        ? t('Running within Takt & ISO spec', 'يعمل ضمن التاكت والمواصفة')
                        : state === 'AMBER'
                        ? t('SMED / Yarn Creel Call', 'استدعاء تجهيز / تغذية غزل')
                        : t('JIDOKA STOP — Team Leader Swarm!', 'توقف جودة فوري — تدخل القائد!')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Poka-Yoke Mistake-Proofing Matrix */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="text-lg font-extrabold">
              {t(
                'Poka-Yoke (Mistake-Proofing) Engineering Devices for Textile Mills',
                'أجهزة وأنظمة منع الخطأ البشري من المنبع (Poka-Yoke)'
              )}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {blueprint.pokaYokeLibrary.map((py) => (
                <div key={py.id} className="rounded-xl border p-4 space-y-2 bg-muted/15">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-sm text-primary">
                      {isAr ? py.deviceTypeAr : py.deviceTypeEn}
                    </span>
                    <Pill tone="emerald">
                      ROI: {py.roiMonths} {t('months', 'أشهر')}
                    </Pill>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>{t('Process:', 'المرحلة:')}</strong> {isAr ? py.processAr : py.processEn}
                  </div>
                  <div className="text-xs">
                    <strong>{t('Defect Prevented:', 'العيب الذي يمنعه:')}</strong>{' '}
                    {isAr ? py.defectPreventedAr : py.defectPreventedEn}
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 rounded-lg p-2.5">
                    {isAr ? py.mechanismAr : py.mechanismEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6M Ishikawa Fishbone Root Cause Matrix */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="text-lg font-extrabold">
              {t(
                '6M Ishikawa (Fishbone) Root-Cause Diagnostic Matrix',
                'مخطط إيشيكاوا (عظمة السمكة 6M) لتحليل الأسباب الجذرية للعيوب'
              )}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blueprint.a3Report.ishikawa.map((bone) => (
                <div key={bone.category} className="rounded-xl border p-4 bg-muted/15 space-y-2">
                  <div className="font-extrabold text-sm text-emerald-600">
                    {isAr ? bone.categoryAr : bone.category}
                  </div>
                  <ul className="list-disc ps-4 space-y-1 text-xs text-muted-foreground">
                    {(isAr ? bone.causesAr : bone.causesEn).map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Toyota-Style A3 Report, Kaizen PDCA & Hoshin Kanri X-Matrix */}
      {activeTab === 'a3_hoshin' && (
        <div className="space-y-8">
          <div className="rounded-2xl border-2 border-emerald-500/35 bg-card p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                  TOYOTA A3 PROBLEM-SOLVING & PDCA CHARTER
                </span>
                <h2 className="text-xl font-extrabold mt-1">
                  {isAr ? blueprint.a3Report.titleAr : blueprint.a3Report.titleEn}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadA3Markdown}
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold hover:bg-muted transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-600" />
                  {t('Download A3 (.MD)', 'تحميل تقرير A3 (.MD)')}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold hover:bg-muted transition cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-sky-600" />
                  {t('Print A3 Sheet', 'طباعة لوحة A3')}
                </button>
                <Link
                  href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(
                    `Lean Manufacturing, SMED, 5S & OEE Turnaround for ${blueprint.factoryName}`
                  )}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-emerald-500 transition"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  {t('Generate Lean Training Course', 'توليد دورة تدريبية للعمال والمهندسين')}
                </Link>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Side of A3: Plan (Background, Current, Goal, 5 Whys) */}
              <div className="space-y-4">
                <div className="rounded-xl border p-4 bg-muted/20 space-y-1">
                  <h3 className="text-xs font-extrabold uppercase text-emerald-600">
                    {t('1. Background & Strategic Context', '١. الخلفية والسياق الاستراتيجي')}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {isAr ? blueprint.a3Report.backgroundAr : blueprint.a3Report.backgroundEn}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-muted/20 space-y-1">
                  <h3 className="text-xs font-extrabold uppercase text-amber-600">
                    {t('2. Current Condition (Gemba Baseline)', '٢. الوضع الراهن (قياسات الجيمبا)')}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {isAr ? blueprint.a3Report.currentStateAr : blueprint.a3Report.currentStateEn}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-emerald-500/10 border-emerald-500/30 space-y-1">
                  <h3 className="text-xs font-extrabold uppercase text-emerald-700 dark:text-emerald-300">
                    {t('3. Target Condition (90-Day Measurable Goal)', '٣. الهدف المستقبلي خلال ٩٠ يوماً')}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                    {isAr ? blueprint.a3Report.targetGoalAr : blueprint.a3Report.targetGoalEn}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
                  <h3 className="text-xs font-extrabold uppercase text-rose-600">
                    {t('4. 5-Whys Root Cause Investigation', '٤. تحليل الأسباب الجذرية (5 Whys)')}
                  </h3>
                  <div className="space-y-2">
                    {blueprint.a3Report.fiveWhys.map((w) => (
                      <div key={w.whyLevel} className="text-xs border-s-2 border-emerald-500 ps-3 py-0.5">
                        <div className="font-bold">
                          Why #{w.whyLevel}: {isAr ? w.questionAr : w.questionEn}
                        </div>
                        <div className="text-muted-foreground">
                          → {isAr ? w.answerAr : w.answerEn}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side of A3: Do, Check, Act (Countermeasures & Standard Work) */}
              <div className="space-y-4">
                <div className="rounded-xl border p-4 bg-muted/20 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase text-emerald-600">
                    {t(
                      '5. Countermeasures & 30-60-90 Day Kaizen Action Plan',
                      '٥. الإجراءات التصحيحية وخطة عمل كايزن (٣٠-٦٠-٩٠ يوماً)'
                    )}
                  </h3>
                  <div className="space-y-2.5">
                    {blueprint.a3Report.countermeasures.map((cm, idx) => (
                      <div key={idx} className="rounded-lg border bg-background p-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold">{isAr ? cm.actionAr : cm.actionEn}</span>
                          <Pill tone="blue">{isAr ? cm.timelineAr : cm.timelineEn}</Pill>
                        </div>
                        <div className="text-muted-foreground">
                          <strong>{t('Owner:', 'المسؤول:')}</strong> {isAr ? cm.ownerAr : cm.ownerEn}
                        </div>
                        <div className="text-emerald-600 font-semibold">
                          <strong>{t('Expected Gain:', 'الأثر المتوقع:')}</strong>{' '}
                          {isAr ? cm.expectedGainAr : cm.expectedGainEn}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border p-4 bg-muted/20 space-y-1">
                  <h3 className="text-xs font-extrabold uppercase text-sky-600">
                    {t(
                      '6. Standardization & Daily Management Sustainment (Act)',
                      '٦. التنميط القياسي والمتابعة اليومية لضمان الاستدامة'
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    {isAr
                      ? blueprint.a3Report.followUpStandardAr
                      : blueprint.a3Report.followUpStandardEn}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hoshin Kanri Strategic Deployment Matrix */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="text-lg font-extrabold">
              {t(
                'Hoshin Kanri Strategic Policy Deployment Matrix (True North Alignment)',
                'مصفوفة هوشين كانري (Hoshin Kanri) لربط الأهداف الاستراتيجية بكايزن صالة الإنتاج'
              )}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40 text-start">
                    <th className="p-3 text-start">{t('3-Year Breakthrough', 'الهدف الاستراتيجي (٣ سنوات)')}</th>
                    <th className="p-3 text-start">{t('Annual Target', 'الهدف السنوي')}</th>
                    <th className="p-3 text-start">{t('Shop-Floor Kaizen Focus', 'مبادرة كايزن في العنبر')}</th>
                    <th className="p-3 text-start">{t('KPI Metrics', 'مؤشرات الأداء KPIs')}</th>
                    <th className="p-3 text-start">{t('Owner', 'المسؤول')}</th>
                  </tr>
                </thead>
                <tbody>
                  {blueprint.hoshinMatrix.map((h, i) => (
                    <tr key={i} className="border-b hover:bg-muted/20">
                      <td className="p-3 font-bold">{isAr ? h.breakthrough3YrAr : h.breakthrough3YrEn}</td>
                      <td className="p-3">{isAr ? h.annualTargetAr : h.annualTargetEn}</td>
                      <td className="p-3 text-emerald-700 dark:text-emerald-300 font-medium">
                        {isAr ? h.shopFloorKaizenAr : h.shopFloorKaizenEn}
                      </td>
                      <td className="p-3 font-mono text-xs">{isAr ? h.kpiMetricAr : h.kpiMetricEn}</td>
                      <td className="p-3 text-xs text-muted-foreground">{isAr ? h.ownerAr : h.ownerEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeanManufacturingClient;
