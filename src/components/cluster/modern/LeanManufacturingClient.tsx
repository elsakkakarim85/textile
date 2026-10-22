'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Gauge,
  Sparkles,
  CheckCircle2,
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
  RefreshCw,
  Activity,
  ClipboardCheck,
  Users,
  Plus,
  Recycle,
  TrendingUp,
  HelpCircle,
} from 'lucide-react';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { Pill } from '@/components/cluster/ui';
import { ExpertManualButton, openExpertManual } from '@/components/cluster/ExpertManualModal';
import { GoogleCreativeLabIntegration } from '@/components/cluster/modern/GoogleCreativeLabIntegration';
import {
  synthesizeLeanBlueprint,
  LEAN_DEPARTMENTS,
  type LeanBlueprintReport,
  type LeanDepartmentId,
  type IluoLevel,
  type RedTagItem,
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

type LeanTabId =
  | 'vsm'
  | '5s'
  | 'oee_smed'
  | 'balancing'
  | 'kanban'
  | 'jidoka'
  | 'six_sigma'
  | 'daily_mgmt'
  | 'a3_hoshin';

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

  const [activeTab, setActiveTab] = useState<LeanTabId>((initialTab as LeanTabId) || 'vsm');

  // --- On-Demand Pillar SOP / OPL AI State ---
  const [sopLoading, setSopLoading] = useState(false);
  const [pillarSopMap, setPillarSopMap] = useState<Record<string, { md: string; model: string }>>(
    {}
  );

  // --- Pillar 1: VSM, Takt Time, Little's Law & Spaghetti Layout States ---
  const [shiftMinutes, setShiftMinutes] = useState(450);
  const [shiftsPerDay, setShiftsPerDay] = useState(2);
  const [dailyDemandUnits, setDailyDemandUnits] = useState(1200);
  const [futureStateApplied, setFutureStateApplied] = useState(false);
  const [unitValueEgp, setUnitValueEgp] = useState(420);
  const [uCellLayoutApplied, setUCellLayoutApplied] = useState(false);

  // --- Pillar 2: 5S Audit & Red-Tag Digital Register States ---
  const [fiveSScores, setFiveSScores] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    blueprint.fiveSAuditItems.forEach((item) => {
      map[item.id] = item.defaultScore;
    });
    return map;
  });
  const [customRedTags, setCustomRedTags] = useState<RedTagItem[]>([]);
  const [newTagItem, setNewTagItem] = useState('');
  const [newTagLoc, setNewTagLoc] = useState('');
  const [newTagArea, setNewTagArea] = useState(10);
  const [newTagValue, setNewTagValue] = useState(15000);

  // --- Pillar 3: OEE, Six Big Losses, MTBF/MTTR, CLIT & SMED States ---
  const [oeePlannedMin, setOeePlannedMin] = useState(480);
  const [oeeScheduledBreakMin, setOeeScheduledBreakMin] = useState(30);
  const [oeeDownMin, setOeeDownMin] = useState(85);
  const [oeeIdealSecPerUnit, setOeeIdealSecPerUnit] = useState(36);
  const [oeeTotalProduced, setOeeTotalProduced] = useState(520);
  const [oeeDefects, setOeeDefects] = useState(28);
  const [smedOptimized, setSmedOptimized] = useState(false);
  const [mtbfOperatingHours, setMtbfOperatingHours] = useState(360);
  const [mtbfFailureCount, setMtbfFailureCount] = useState(6);
  const [mttrTotalRepairMin, setMttrTotalRepairMin] = useState(270);
  const [clitChecked, setClitChecked] = useState<Record<string, boolean>>({
    'clit-1': true,
    'clit-2': true,
    'clit-3': false,
    'clit-4': false,
  });

  // --- Pillar 4: Line Balancing, Yamazumi, SWCS & ILUO Skill Matrix States ---
  const [lineBalanced, setLineBalanced] = useState(false);
  const [skillMatrixState, setSkillMatrixState] = useState(blueprint.skillMatrix);

  // --- Pillar 5: Kanban, Heijunka & Water Spider States ---
  const [kanbanDailyDemand, setKanbanDailyDemand] = useState(1500);
  const [kanbanLeadDays, setKanbanLeadDays] = useState(2.5);
  const [kanbanSafetyPct, setKanbanSafetyPct] = useState(20);
  const [kanbanBinCap, setKanbanBinCap] = useState(250);
  const [heijunkaPackOutQty, setHeijunkaPackOutQty] = useState(40);
  const [waterSpiderCycleMin, setWaterSpiderCycleMin] = useState(30);

  // --- Pillar 6: Jidoka, Andon & FMEA RPN States ---
  const [andonStates, setAndonStates] = useState<Record<string, 'GREEN' | 'AMBER' | 'RED'>>({
    'Warping & Sizing': 'GREEN',
    'Air-Jet Weaving Bay A': 'AMBER',
    'Reactive Dyeing Jet #4': 'GREEN',
    'Stenter Finishing Line': 'GREEN',
    'Sewing & Packing Cell #1': 'GREEN',
  });
  const [fmeaMitigated, setFmeaMitigated] = useState(false);

  // --- Pillar 7: Lean Six Sigma SPC, Cp/Cpk & DPMO States ---
  const [selectedSpcId, setSelectedSpcId] = useState('gsm');
  const activeSpcPreset = useMemo(
    () => blueprint.spcPresets.find((p) => p.id === selectedSpcId) || blueprint.spcPresets[0],
    [blueprint.spcPresets, selectedSpcId]
  );
  const [spcLsl, setSpcLsl] = useState(activeSpcPreset.lsl);
  const [spcUsl, setSpcUsl] = useState(activeSpcPreset.usl);
  const [spcMean, setSpcMean] = useState(activeSpcPreset.mean);
  const [spcStdDev, setSpcStdDev] = useState(activeSpcPreset.stdDev);
  const [dpmoUnitsInspected, setDpmoUnitsInspected] = useState(5000);
  const [dpmoOpportunitiesPerUnit, setDpmoOpportunitiesPerUnit] = useState(6);
  const [dpmoTotalDefects, setDpmoTotalDefects] = useState(145);
  const [copqCostPerDefectEgp, setCopqCostPerDefectEgp] = useState(380);

  // --- Pillar 8: Lean Daily Management (SQDC Board) State ---
  const [sqdcRows, setSqdcRows] = useState(blueprint.sqdcBoard);

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
    const totalLeadDays = Number((totalLeadTimeMin / (60 * 24)).toFixed(1));
    // Little's Law: WIP = Throughput (Units/Day) × Lead Time (Days)
    const currentLeadDays = Number(
      (
        (blueprint.vsmSteps.reduce((a, s) => a + s.wipWaitHours, 0) * 60 + totalVaMin) /
        (60 * 24)
      ).toFixed(1)
    );
    const futureLeadDays = Number(
      (
        (blueprint.vsmSteps.reduce((a, s) => a + s.wipWaitHours * 0.38, 0) * 60 + totalVaMin) /
        (60 * 24)
      ).toFixed(1)
    );
    const wipUnitsNow = Math.round(dailyDemandUnits * totalLeadDays);
    const cashFreedEgp = Math.round(
      Math.max(0, (currentLeadDays - futureLeadDays) * dailyDemandUnits * unitValueEgp)
    );
    const inventoryTurnsPerYear = Number((300 / Math.max(0.5, totalLeadDays)).toFixed(1));
    const totalDistanceM = blueprint.vsmSteps.reduce(
      (acc, s) => acc + (uCellLayoutApplied ? Math.round(s.distanceMeters * 0.32) : s.distanceMeters),
      0
    );
    return {
      totalWipHours: Math.round(totalWipHours),
      totalVaMin,
      pcePct,
      totalLeadDays,
      wipUnitsNow,
      cashFreedEgp,
      inventoryTurnsPerYear,
      totalDistanceM,
    };
  }, [blueprint.vsmSteps, futureStateApplied, dailyDemandUnits, unitValueEgp, uCellLayoutApplied]);

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

    const allRedTags = [...blueprint.redTagItems, ...customRedTags];
    const totalAreaFreedM2 = allRedTags.reduce((a, r) => a + r.floorAreaSavedM2, 0);
    const totalSalvageEgp = allRedTags.reduce((a, r) => a + r.estimatedSalvageEgp, 0);

    return { earned, maxPoints, pct, tier, allRedTags, totalAreaFreedM2, totalSalvageEgp };
  }, [blueprint.fiveSAuditItems, blueprint.redTagItems, customRedTags, fiveSScores, locale]);

  const oeeMetrics = useMemo(() => {
    const plannedProdTime = Math.max(1, oeePlannedMin - oeeScheduledBreakMin);
    const runTime = Math.max(1, plannedProdTime - oeeDownMin);
    const availability = Math.min(100, (runTime / plannedProdTime) * 100);
    const idealTotalTimeMin = (oeeTotalProduced * oeeIdealSecPerUnit) / 60;
    const performance = Math.min(100, (idealTotalTimeMin / runTime) * 100);
    const goodUnits = Math.max(0, oeeTotalProduced - oeeDefects);
    const quality = oeeTotalProduced > 0 ? Math.min(100, (goodUnits / oeeTotalProduced) * 100) : 0;
    const oee = (availability * performance * quality) / 10000;

    // Six Big Losses estimation
    const speedLossMin = Math.max(0, Math.round(runTime - idealTotalTimeMin));
    const qualityLossMin = Math.round((oeeDefects * oeeIdealSecPerUnit) / 60);
    const mtbfHours = Number((mtbfOperatingHours / Math.max(1, mtbfFailureCount)).toFixed(1));
    const mttrMin = Math.round(mttrTotalRepairMin / Math.max(1, mtbfFailureCount));

    return {
      availability: availability.toFixed(1),
      performance: performance.toFixed(1),
      quality: quality.toFixed(1),
      oee: oee.toFixed(1),
      oeeNum: oee,
      goodUnits,
      speedLossMin,
      qualityLossMin,
      mtbfHours,
      mttrMin,
    };
  }, [
    oeePlannedMin,
    oeeScheduledBreakMin,
    oeeDownMin,
    oeeIdealSecPerUnit,
    oeeTotalProduced,
    oeeDefects,
    mtbfOperatingHours,
    mtbfFailureCount,
    mttrTotalRepairMin,
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
        walkSec: Math.max(2, Math.round(ws.walkSec * 0.4)),
      };
    });
  }, [blueprint.workstations, lineBalanced]);

  const lineBalanceMetrics = useMemo(() => {
    const sumCt = balancedStations.reduce((a, s) => a + s.cycleTimeSec, 0);
    const maxCt = Math.max(...balancedStations.map((s) => s.cycleTimeSec), 1);
    const lbePct = Math.round((sumCt / (balancedStations.length * maxCt)) * 100);
    const totalSamMin = (sumCt / 60).toFixed(2);
    const hourlyCap = Math.round(3600 / maxCt);
    const theoreticalMinOperators = Math.max(1, Math.ceil(sumCt / Math.max(1, taktTimeSec)));
    return { sumCt, maxCt, lbePct, totalSamMin, hourlyCap, theoreticalMinOperators };
  }, [balancedStations, taktTimeSec]);

  const kanbanResult = useMemo(() => {
    const safetyFactor = 1 + kanbanSafetyPct / 100;
    const totalUnitsInLoop = kanbanDailyDemand * kanbanLeadDays * safetyFactor;
    const cards = Math.max(2, Math.ceil(totalUnitsInLoop / Math.max(1, kanbanBinCap)));
    const maxWipUnits = cards * kanbanBinCap;
    const pitchMin = Number(((taktTimeSec * heijunkaPackOutQty) / 60).toFixed(1));
    const waterSpiderTripsPerShift = Math.max(1, Math.floor(shiftMinutes / Math.max(5, waterSpiderCycleMin)));
    return { cards, maxWipUnits, pitchMin, waterSpiderTripsPerShift };
  }, [
    kanbanDailyDemand,
    kanbanLeadDays,
    kanbanSafetyPct,
    kanbanBinCap,
    taktTimeSec,
    heijunkaPackOutQty,
    shiftMinutes,
    waterSpiderCycleMin,
  ]);

  const spcMetrics = useMemo(() => {
    const sigma = Math.max(0.001, spcStdDev);
    const cp = (spcUsl - spcLsl) / (6 * sigma);
    const cpu = (spcUsl - spcMean) / (3 * sigma);
    const cpl = (spcMean - spcLsl) / (3 * sigma);
    const cpk = Math.min(cpu, cpl);
    const ucl = Number((spcMean + 3 * sigma).toFixed(2));
    const lcl = Number((spcMean - 3 * sigma).toFixed(2));

    const totalOpportunities = Math.max(1, dpmoUnitsInspected * dpmoOpportunitiesPerUnit);
    const dpmo = Math.round((dpmoTotalDefects / totalOpportunities) * 1_000_000);
    const dhuPct = Number(((dpmoTotalDefects / Math.max(1, dpmoUnitsInspected)) * 100).toFixed(2));
    const yieldPct = Number(
      (Math.max(0, 1 - dpmoTotalDefects / Math.max(1, dpmoUnitsInspected)) * 100).toFixed(2)
    );
    const sigmaLevel =
      dpmo <= 3.4
        ? 6.0
        : dpmo <= 233
        ? 5.0
        : dpmo <= 6210
        ? 4.0
        : dpmo <= 22750
        ? 3.5
        : dpmo <= 66807
        ? 3.0
        : 2.4;
    const monthlyCopqEgp = dpmoTotalDefects * copqCostPerDefectEgp;

    return {
      cp: cp.toFixed(2),
      cpk: cpk.toFixed(2),
      cpkNum: cpk,
      ucl,
      lcl,
      dpmo,
      dhuPct,
      yieldPct,
      sigmaLevel,
      monthlyCopqEgp,
    };
  }, [
    spcLsl,
    spcUsl,
    spcMean,
    spcStdDev,
    dpmoUnitsInspected,
    dpmoOpportunitiesPerUnit,
    dpmoTotalDefects,
    copqCostPerDefectEgp,
  ]);

  const handleSelectSpcPreset = (presetId: string) => {
    setSelectedSpcId(presetId);
    const found = blueprint.spcPresets.find((p) => p.id === presetId);
    if (found) {
      setSpcLsl(found.lsl);
      setSpcUsl(found.usl);
      setSpcMean(found.mean);
      setSpcStdDev(found.stdDev);
    }
  };

  const handleGenerateBlueprint = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cluster/lean-manufacturing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'blueprint',
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
        setSkillMatrixState(data.blueprint.skillMatrix);
        setSqdcRows(data.blueprint.sqdcBoard);
      }
    } catch {
      // fallback already populated
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePillarSop = async () => {
    setSopLoading(true);
    const liveMetricsContext = `Takt Time: ${taktTimeSec}s, Lead Time: ${vsmMetrics.totalLeadDays} days (PCE ${vsmMetrics.pcePct}%), OEE: ${oeeMetrics.oee}% (Availability ${oeeMetrics.availability}%, Performance ${oeeMetrics.performance}%, Quality ${oeeMetrics.quality}%), SMED Changeover: ${smedSummary.beforeMin}m -> ${smedSummary.afterMin}m, Line Balance Efficiency: ${lineBalanceMetrics.lbePct}%, Kanban Cards: ${kanbanResult.cards} bins, Six Sigma Cpk: ${spcMetrics.cpk} (${spcMetrics.sigmaLevel} Sigma, DPMO ${spcMetrics.dpmo}), 5S Score: ${fiveSSummary.pct}%`;
    try {
      const res = await fetch('/api/cluster/lean-manufacturing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'pillar_sop',
          pillarId: activeTab,
          factoryName,
          department,
          productFocus,
          primaryBottleneck,
          liveMetricsContext,
          preferredModel,
          locale,
        }),
      });
      const data = await res.json();
      if (data?.sopMarkdown) {
        setPillarSopMap((prev) => ({
          ...prev,
          [activeTab]: { md: data.sopMarkdown, model: data.modelUsed || 'Free LLM Sensei' },
        }));
      }
    } catch {
      // ignore
    } finally {
      setSopLoading(false);
    }
  };

  const handleDownloadA3Markdown = () => {
    const a3 = blueprint.a3Report;
    const md = `# ${isAr ? a3.titleAr : a3.titleEn}
- **Factory**: ${blueprint.factoryName}
- **Department**: ${blueprint.department}
- **Product Focus**: ${blueprint.productFocus}
- **Generated**: ${new Date().toISOString().slice(0, 10)}
- **Live KPIs**: Takt=${taktTimeSec}s | Lead Time=${vsmMetrics.totalLeadDays}d | OEE=${oeeMetrics.oee}% | 5S=${fiveSSummary.pct}% | Cpk=${spcMetrics.cpk}

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

  const handleExportLeanCsv = () => {
    const rows = [
      ['Metric Category', 'KPI Name', 'Current / Simulated Value', 'Unit / Benchmark'],
      ['VSM & Flow', 'Customer Takt Time', String(taktTimeSec), 'Seconds / Unit'],
      ['VSM & Flow', 'Total Lead Time', String(vsmMetrics.totalLeadDays), 'Days'],
      ['VSM & Flow', 'Process Cycle Efficiency (PCE)', String(vsmMetrics.pcePct), '%'],
      ['VSM & Flow', 'Working Capital Freed (Future VSM)', String(vsmMetrics.cashFreedEgp), 'EGP'],
      ['8 Wastes', 'Annual Recoverable Waste Savings', String(wasteSummary.annualSavingsEgp), 'EGP / Year'],
      ['5S & Gemba', '5S Audit Score', String(fiveSSummary.pct), `% (${fiveSSummary.tier})`],
      ['5S & Gemba', 'Red-Tag Floor Space Saved', String(fiveSSummary.totalAreaFreedM2), 'm2'],
      ['TPM & OEE', 'Overall Equipment Effectiveness (OEE)', String(oeeMetrics.oee), '% (World Class = 85%)'],
      ['TPM & OEE', 'MTBF / MTTR', `${oeeMetrics.mtbfHours}h / ${oeeMetrics.mttrMin}m`, 'Reliability'],
      ['SMED', 'Changeover Time Reduction', `${smedSummary.beforeMin} -> ${smedSummary.afterMin}`, `Minutes (-${smedSummary.savedPct}%)`],
      ['Line Balancing', 'Line Balance Efficiency (LBE)', String(lineBalanceMetrics.lbePct), '%'],
      ['Kanban Pull', 'Supermarket Kanban Cards', String(kanbanResult.cards), `Bins (Max WIP ${kanbanResult.maxWipUnits})`],
      ['Six Sigma SPC', 'Process Capability (Cp / Cpk)', `${spcMetrics.cp} / ${spcMetrics.cpk}`, `${spcMetrics.sigmaLevel} Sigma`],
      ['Six Sigma SPC', 'DPMO & Monthly COPQ', `${spcMetrics.dpmo} DPMO`, `${spcMetrics.monthlyCopqEgp} EGP/mo`],
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lean-six-sigma-kpis-${blueprint.factoryName.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cycleIluo = (current: IluoLevel): IluoLevel => {
    if (current === 'I') return 'L';
    if (current === 'L') return 'U';
    if (current === 'U') return 'O';
    return 'I';
  };

  const tabs: { id: LeanTabId; icon: any; labelEn: string; labelAr: string; manualId: string }[] = [
    {
      id: 'vsm',
      icon: Layers,
      labelEn: "1. VSM, Little's Law & 8 Wastes",
      labelAr: '١. تدفق القيمة (VSM) والفواقد الـ ٨',
      manualId: 'lean-vsm',
    },
    {
      id: '5s',
      icon: CheckCircle2,
      labelEn: '2. 5S Audit & Red-Tag Register',
      labelAr: '٢. تدقيق 5S وسجل البطاقات الحمراء',
      manualId: 'lean-5s',
    },
    {
      id: 'oee_smed',
      icon: Wrench,
      labelEn: '3. TPM, OEE, MTBF & SMED',
      labelAr: '٣. الصيانة الشاملة و OEE و SMED',
      manualId: 'lean-oee',
    },
    {
      id: 'balancing',
      icon: BarChart3,
      labelEn: '4. Yamazumi, SWCS & Skill Matrix',
      labelAr: '٤. توازن الخطوط ومصفوفة المهارات',
      manualId: 'lean-balancing',
    },
    {
      id: 'kanban',
      icon: Repeat,
      labelEn: '5. Kanban, Heijunka & Water Spider',
      labelAr: '٥. كانبان وجدولة Heijunka والمزود',
      manualId: 'lean-kanban',
    },
    {
      id: 'jidoka',
      icon: ShieldAlert,
      labelEn: '6. Jidoka, Poka-Yoke & FMEA RPN',
      labelAr: '٦. أندون و Poka-Yoke وتحليل FMEA',
      manualId: 'lean-jidoka-fmea',
    },
    {
      id: 'six_sigma',
      icon: Activity,
      labelEn: '7. Six Sigma SPC, Cp/Cpk & DPMO',
      labelAr: '٧. لين 6 سيجما و SPC والقدرة Cpk',
      manualId: 'lean-six-sigma',
    },
    {
      id: 'daily_mgmt',
      icon: ClipboardCheck,
      labelEn: '8. SQDC Gemba Board & Leader Work',
      labelAr: '٨. لوحة الإدارة اليومية SQDC والجيمبا',
      manualId: 'lean-sqdc-daily',
    },
    {
      id: 'a3_hoshin',
      icon: FileText,
      labelEn: '9. A3 Charter & Hoshin Kanri',
      labelAr: '٩. تقرير A3 ومصفوفة هوشين كانري',
      manualId: 'lean-a3-ai',
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
                '9-PILLAR TOYOTA PRODUCTION SYSTEM (TPS) • LEAN SIX SIGMA MASTER BLACK BELT SUITE',
                'منظومة إنتاج تويوتا (TPS) الشاملة • ٩ ركائز للإدارة الرشيقة ولين 6 سيجما'
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
              onChange={(e) => {
                const nextDept = e.target.value as LeanDepartmentId;
                setDepartment(nextDept);
                const updated = synthesizeLeanBlueprint({
                  factoryName,
                  department: nextDept,
                  productFocus,
                  primaryBottleneck,
                });
                setBlueprint(updated);
              }}
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
              <span className="text-slate-300">{t('Quick Mill Presets:', 'نماذج مصانع سريعة:')}</span>
              {[
                {
                  f: 'Misr Spinning & Weaving — Compact Mill #2',
                  d: 'spinning' as LeanDepartmentId,
                  p: 'Combed Giza 86 Yarn Ne 40/1',
                  b: 'High doffing downtime, flyer lint stops & cone lot mixing',
                },
                {
                  f: 'Al-Rowad Dyehouse & Stenter Finishing',
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
                    setBlueprint(
                      synthesizeLeanBlueprint({
                        factoryName: preset.f,
                        department: preset.d,
                        productFocus: preset.p,
                        primaryBottleneck: preset.b,
                      })
                    );
                  }}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold hover:bg-emerald-500/25 hover:border-emerald-400 transition cursor-pointer"
                >
                  {preset.f}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportLeanCsv}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-emerald-300" />
                {t('Export KPIs (.CSV)', 'تصدير المؤشرات (.CSV)')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition shadow-lg cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                {loading
                  ? t('AI Synthesizing 9-Pillar Master Plan...', 'جارٍ توليد خطة اللين و6 سيجما...')
                  : t(
                      '✨ Generate AI Lean Six Sigma Master Plan',
                      '✨ توليد خطة التصنيع الرشيق ولين 6 سيجما بالذكاء الاصطناعي'
                    )}
              </button>
            </div>
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

      {/* Top Executive 6-KPI Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('Takt Time', 'زمن التاكت (Takt)')}</div>
          <div className="text-2xl font-extrabold text-primary mt-1">{taktTimeSec}s</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            {t('Customer demand beat', 'إيقاع طلب العميل')}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('Lead Time & PCE', 'زمن التوريد و PCE')}</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {vsmMetrics.totalLeadDays} {t('days', 'يوم')}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            PCE: <strong>{vsmMetrics.pcePct}%</strong> ({vsmMetrics.inventoryTurnsPerYear}x {t('turns', 'دوران')})
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('Live OEE Score', 'كفاءة الماكينات OEE')}</div>
          <div className="text-2xl font-extrabold text-sky-600 mt-1">{oeeMetrics.oee}%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            MTBF: <strong>{oeeMetrics.mtbfHours}h</strong> | MTTR: <strong>{oeeMetrics.mttrMin}m</strong>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('Six Sigma Capability', 'قدرة العملية Six Sigma')}</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">Cpk {spcMetrics.cpk}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            <strong>{spcMetrics.sigmaLevel}σ</strong> ({fmtNumber(locale, spcMetrics.dpmo)} DPMO)
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('5S & Red-Tag Space', 'تقييم 5S والمساحة المحررة')}</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{fiveSSummary.pct}%</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
            +{fiveSSummary.totalAreaFreedM2} m² {t('floor freed', 'مساحة محررة')}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-xs">
          <div className="text-xs text-muted-foreground">{t('Annual Waste Savings', 'الوفر السنوي من الفواقد')}</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {fmtNumber(locale, wasteSummary.annualSavingsEgp)} EGP
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">
            +{fmtNumber(locale, vsmMetrics.cashFreedEgp)} EGP {t('WIP cash', 'سيولة محررة')}
          </div>
        </div>
      </div>

      {/* 9-Pillar Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                active
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-muted/60 text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              <span
                role="button"
                tabIndex={0}
                title={t(
                  'Open Expert Manual for this Lean Pillar',
                  'افتح الدليل الهندسي الشامل لهذه الأداة'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openExpertManual(tab.manualId);
                }}
                className={`inline-flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
                  active
                    ? 'bg-white/25 text-white hover:bg-amber-400 hover:text-slate-950'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950'
                }`}
              >
                <HelpCircle className="w-3 h-3" />
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Value Stream Mapping (VSM), Takt Time, Little's Law & 8 Wastes */}
      {activeTab === 'vsm' && (
        <div className="space-y-8">
          <div className="rounded-2xl border bg-card p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">
                  {t(
                    "Interactive Value Stream Map (VSM), Takt Time & Little's Law Simulator",
                    'خريطة تدفق القيمة التفاعلية (VSM) وحاسبة زمن التاكت وقانون ليتل (Little’s Law)'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    'Compare Current-State push batches vs. Future-State Lean pull flow and U-Cell layout.',
                    'قارن بين الوضع الحالي (الإنتاج بالدفعات) والوضع المستقبلي الرشيق (التدفق والسحب والخلايا على شكل حرف U).'
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFutureStateApplied((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                    futureStateApplied
                      ? 'bg-emerald-600 text-white'
                      : 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  {futureStateApplied
                    ? t('✓ Future-State VSM Active (-62% WIP)', '✓ خريطة الحالة المستقبلية مفعلة (-٦٢٪ مخزون)')
                    : t('Simulate Future-State VSM Pull', 'محاكاة خريطة التدفق المستقبلية (Future VSM)')}
                </button>
                <button
                  type="button"
                  onClick={() => setUCellLayoutApplied((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
                    uCellLayoutApplied
                      ? 'bg-sky-600 text-white'
                      : 'border border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300'
                  }`}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  {uCellLayoutApplied
                    ? t('✓ Spaghetti Layout -> U-Cell (-68% Travel)', '✓ تم تحويل المسار إلى خلية U (-٦٨٪ مسافة)')
                    : t('Optimize Spaghetti Travel Distance', 'تحسين مخطط السباغيتي ومسافة النقل')}
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="rounded-xl border bg-muted/30 p-3.5">
                <label className="block text-xs font-semibold mb-1">
                  {t('Net Available Time / Shift (min)', 'صافي وقت العمل للوردية (دقيقة)')}
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
                  {t('Daily Customer Demand (Units)', 'الطلب اليومي للعملاء (وحدة/رول)')}
                </label>
                <input
                  type="number"
                  min={10}
                  value={dailyDemandUnits}
                  onChange={(e) => setDailyDemandUnits(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3.5">
                <label className="block text-xs font-semibold mb-1">
                  {t('Avg Unit WIP Cost (EGP)', 'متوسط تكلفة الوحدة تحت التشغيل (ج.م)')}
                </label>
                <input
                  type="number"
                  min={10}
                  value={unitValueEgp}
                  onChange={(e) => setUnitValueEgp(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-3 py-1.5 text-sm font-bold"
                />
              </div>
            </div>

            {/* Little's Law & Spaghetti Layout Summary Strip */}
            <div className="grid sm:grid-cols-4 gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs">
              <div>
                <span className="text-muted-foreground block">
                  {t("Little's Law Active WIP:", 'المخزون البيني حسب قانون ليتل:')}
                </span>
                <strong className="text-base">{fmtNumber(locale, vsmMetrics.wipUnitsNow)} units</strong>
              </div>
              <div>
                <span className="text-muted-foreground block">
                  {t('Working Capital Liberated:', 'السيولة النقدية المحررة من المخزون:')}
                </span>
                <strong className="text-base text-emerald-600">
                  {fmtNumber(locale, vsmMetrics.cashFreedEgp)} EGP
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground block">
                  {t('Inventory Turns / Year:', 'معدل دوران المخزون سنوياً:')}
                </span>
                <strong className="text-base">{vsmMetrics.inventoryTurnsPerYear}x / yr</strong>
              </div>
              <div>
                <span className="text-muted-foreground block">
                  {t('Spaghetti Travel Distance:', 'إجمالي مسافة انتقال اللوط (Spaghetti):')}
                </span>
                <strong className="text-base text-sky-600">{vsmMetrics.totalDistanceM} meters</strong>
              </div>
            </div>

            {/* VSM Process Boxes */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {blueprint.vsmSteps.map((step) => {
                const wipHrs = futureStateApplied
                  ? Math.round(step.wipWaitHours * 0.38)
                  : step.wipWaitHours;
                const coMin = futureStateApplied
                  ? Math.round(step.changeoverMin * 0.42)
                  : step.changeoverMin;
                const distM = uCellLayoutApplied
                  ? Math.round(step.distanceMeters * 0.32)
                  : step.distanceMeters;
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
                      <Pill tone={overTakt ? 'amber' : 'emerald'}>C/T: {step.cycleTimeSec}s</Pill>
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
                          {t('Uptime / RFT', 'الإتاحة / العيوب')}
                        </span>
                        <strong>
                          {step.uptimePct}% ({step.defectPct}% def)
                        </strong>
                      </div>
                      <div className="rounded-lg bg-background p-2 border">
                        <span className="text-muted-foreground block text-[10px]">
                          {t('WIP Queue Wait', 'انتظار المخزون البيني')}
                        </span>
                        <strong className="text-amber-600">{wipHrs} hrs</strong>
                      </div>
                      <div className="rounded-lg bg-background p-2 border">
                        <span className="text-muted-foreground block text-[10px]">
                          {t('VA Time / Travel', 'الوقت المضيف / المسافة')}
                        </span>
                        <strong className="text-emerald-600">
                          {step.valueAddedMin}m • {distM}m
                        </strong>
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
                  {t('Total Monthly Loss Identified: ', 'إجمالي الفاقد الشهري المرصود: ')}
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

      {/* TAB 2: 5S Workplace Audit & Red-Tag Digital Register */}
      {activeTab === '5s' && (
        <div className="space-y-8">
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
                        <Pill tone="emerald">{isAr ? item.pillarTitleAr : item.pillarTitleEn}</Pill>
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

          {/* 1S Seiri Red-Tag Digital Register */}
          <div className="rounded-2xl border bg-card p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">
                  {t(
                    '1S Seiri: Red-Tag Holding Area Register & Waste Exchange Monetization',
                    'سجل البطاقات الحمراء (1S Red-Tag Register) واستغلال الرواكد والعوادم'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t('Floor Space Recovered:', 'المساحة الأرضية المحررة:')}{' '}
                  <strong className="text-emerald-600">{fiveSSummary.totalAreaFreedM2} m²</strong> |{' '}
                  {t('Estimated Cash / Salvage Value:', 'القيمة الاستردادية المقدرة:')}{' '}
                  <strong className="text-emerald-600">
                    {fmtNumber(locale, fiveSSummary.totalSalvageEgp)} EGP
                  </strong>
                </p>
              </div>
              <Link
                href={`/${locale}/marketplaces/waste/add`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-500 transition"
              >
                <Recycle className="h-3.5 w-3.5" />
                {t('List Surplus on Waste Marketplace', 'عرض الرواكد والعوادم في بورصة المخلفات')}
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {fiveSSummary.allRedTags.map((rt) => (
                <div key={rt.id} className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[11px] font-mono font-bold text-white">
                      {rt.tagCode}
                    </span>
                    <Pill tone="emerald">
                      +{rt.floorAreaSavedM2} m² • {fmtNumber(locale, rt.estimatedSalvageEgp)} EGP
                    </Pill>
                  </div>
                  <div className="font-bold text-sm">{isAr ? rt.itemAr : rt.itemEn}</div>
                  <div className="text-xs text-muted-foreground">
                    {t('Location:', 'الموقع:')} {isAr ? rt.locationAr : rt.locationEn} •{' '}
                    <strong>{rt.disposition}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Red-Tag Item */}
            <div className="grid sm:grid-cols-5 gap-3 pt-2 border-t">
              <input
                type="text"
                placeholder={t('Red-Tagged Item Description...', 'وصف الصنف الراكد أو المعدة...')}
                value={newTagItem}
                onChange={(e) => setNewTagItem(e.target.value)}
                className="sm:col-span-2 rounded-lg border bg-background px-3 py-2 text-xs"
              />
              <input
                type="text"
                placeholder={t('Floor Location...', 'موقع العنبر...')}
                value={newTagLoc}
                onChange={(e) => setNewTagLoc(e.target.value)}
                className="rounded-lg border bg-background px-3 py-2 text-xs"
              />
              <input
                type="number"
                placeholder="m²"
                value={newTagArea}
                onChange={(e) => setNewTagArea(Number(e.target.value))}
                className="rounded-lg border bg-background px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newTagItem.trim()) return;
                  setCustomRedTags((prev) => [
                    ...prev,
                    {
                      id: `rt-custom-${Date.now()}`,
                      tagCode: `RT-2026-0${30 + prev.length}`,
                      itemEn: newTagItem,
                      itemAr: newTagItem,
                      locationEn: newTagLoc || 'Production Bay',
                      locationAr: newTagLoc || 'صالة الإنتاج',
                      disposition: 'SCRAP_WASTE_EXCHANGE',
                      floorAreaSavedM2: newTagArea || 8,
                      estimatedSalvageEgp: newTagValue || 12000,
                    },
                  ]);
                  setNewTagItem('');
                  setNewTagLoc('');
                }}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-rose-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-rose-500 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {t('Log Red Tag', 'إضافة بطاقة حمراء')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TPM, OEE, MTBF/MTTR, CLIT & SMED Quick Changeover */}
      {activeTab === 'oee_smed' && (
        <div className="space-y-8">
          <div className="rounded-2xl border bg-card p-6 space-y-5">
            <div>
              <h2 className="text-lg font-extrabold">
                {t(
                  'TPM Overall Equipment Effectiveness (OEE), Six Big Losses & MTBF/MTTR Calculator',
                  'حاسبة الفعالية الكلية للمعدات (OEE) والفواقد الستة الكبرى واعتمادية الصيانة (MTBF/MTTR)'
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t(
                  'Formula: OEE = Availability × Performance × Quality | MTBF = Operating Time / Failures',
                  'المعادلة القياسية: OEE = الإتاحة × الأداء × الجودة | MTBF = ساعات التشغيل ÷ عدد الأعطال'
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
                <div className="text-xs text-muted-foreground">
                  {t('Availability (Loss: Stops)', 'الإتاحة (فاقد التوقفات)')}
                </div>
                <div className="text-2xl font-extrabold text-primary mt-1">
                  {oeeMetrics.availability}%
                </div>
                <div className="text-[11px] text-rose-600 mt-0.5">
                  -{oeeDownMin} min {t('downtime loss', 'توقف وأعطال')}
                </div>
              </div>
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">
                  {t('Performance (Loss: Speed)', 'الأداء (فاقد السرعة)')}
                </div>
                <div className="text-2xl font-extrabold text-sky-600 mt-1">
                  {oeeMetrics.performance}%
                </div>
                <div className="text-[11px] text-amber-600 mt-0.5">
                  -{oeeMetrics.speedLossMin} min {t('micro-stops/speed', 'توقفات صغرى وبطء')}
                </div>
              </div>
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">
                  {t('Quality (Loss: Rework)', 'الجودة من المرة الأولى')}
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  {oeeMetrics.quality}%
                </div>
                <div className="text-[11px] text-rose-600 mt-0.5">
                  -{oeeMetrics.qualityLossMin} min ({oeeDefects} {t('defects', 'وحدة معيبة')})
                </div>
              </div>
              <div className="rounded-2xl border-2 border-emerald-500/40 p-4 bg-emerald-500/10">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {t('Overall OEE Score', 'المؤشر الكلي OEE')}
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">{oeeMetrics.oee}%</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {t('World-Class Benchmark: 85%', 'المعيار العالمي: ٨٥٪')}
                </div>
              </div>
            </div>

            {/* MTBF & MTTR Reliability Row */}
            <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t">
              <div className="rounded-xl border bg-muted/20 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Monthly Operating Hours', 'ساعات التشغيل الشهرية')}
                </label>
                <input
                  type="number"
                  value={mtbfOperatingHours}
                  onChange={(e) => setMtbfOperatingHours(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1 text-xs font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/20 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Breakdown Events Count', 'عدد مرات العطل الفجائي')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={mtbfFailureCount}
                  onChange={(e) => setMtbfFailureCount(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1 text-xs font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/20 p-3 flex flex-col justify-center">
                <div className="text-xs text-muted-foreground">
                  {t('Reliability Metrics:', 'مؤشرات الاعتمادية الهندسية:')}
                </div>
                <div className="text-sm font-extrabold mt-0.5">
                  MTBF: <span className="text-emerald-600">{oeeMetrics.mtbfHours} hrs</span> | MTTR:{' '}
                  <span className="text-amber-600">{oeeMetrics.mttrMin} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* CLIT Autonomous Maintenance (Jishu Hozen) Checklist */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="text-lg font-extrabold">
              {t(
                'TPM Pillar 1: Jishu Hozen (Autonomous Maintenance — CLIT Operator Checklist)',
                'الركيزة الأولى للصيانة الشاملة (TPM): الصيانة الذاتية للمشغل (CLIT Checklist)'
              )}
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {blueprint.clitChecklist.map((item) => {
                const checked = !!clitChecked[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setClitChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                    }
                    className={`rounded-xl border p-4 text-start transition cursor-pointer flex items-start gap-3 ${
                      checked ? 'border-emerald-500/40 bg-emerald-500/5' : 'bg-muted/15'
                    }`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-extrabold text-sm ${
                        checked ? 'bg-emerald-600 text-white' : 'bg-muted text-foreground'
                      }`}
                    >
                      {item.code}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm">
                          {isAr ? item.categoryAr : item.categoryEn}
                        </span>
                        <Pill tone={checked ? 'emerald' : 'amber'}>
                          {item.standardMinutes} min • {isAr ? item.frequencyAr : item.frequencyEn}
                        </Pill>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isAr ? item.taskAr : item.taskEn}
                      </p>
                    </div>
                  </button>
                );
              })}
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
                  setOeeDownMin(smedOptimized ? 85 : 32);
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

      {/* TAB 4: Line Balancing, Yamazumi Chart, SWCS & ILUO Skill Matrix */}
      {activeTab === 'balancing' && (
        <div className="space-y-8">
          <div className="rounded-2xl border bg-card p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">
                  {t(
                    'Workstation Line Balancing, Yamazumi Chart & Standard Work Combination Sheet (SWCS)',
                    'موازنة خطوط الإنتاج ومخطط يامازومي (Yamazumi) وبطاقة العمل القياسي (SWCS)'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t('Line Balance Efficiency (LBE):', 'كفاءة توازن الخط (LBE):')}{' '}
                  <strong className="text-emerald-600">{lineBalanceMetrics.lbePct}%</strong> |{' '}
                  {t('Total SAM:', 'إجمالي الزمن القياسي SAM:')}{' '}
                  <strong>{lineBalanceMetrics.totalSamMin} min</strong> |{' '}
                  {t('Theoretical Min Operators:', 'العدد المثالي للعمال:')}{' '}
                  <strong>{lineBalanceMetrics.theoreticalMinOperators}</strong> |{' '}
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
                  : t(
                      '✨ AI Auto-Balance Workstations & Strip NVA',
                      '✨ موازنة الخط آلياً وحذف الحركات غير المضيفة للقيمة'
                    )}
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
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          VA: <strong className="text-emerald-600">{ws.vaSec}s</strong> + NVA:{' '}
                          <strong className="text-amber-600">{ws.nvaSec}s</strong> | SWCS (Manual:{' '}
                          {ws.manualSec}s / Auto: {ws.machineAutoSec}s / Walk: {ws.walkSec}s) ={' '}
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

          {/* 4×4 ILUO Operator Multi-Skill Matrix */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  {t(
                    'Interactive ILUO Operator Multi-Skill Matrix (Cross-Training & Bottleneck Coverage)',
                    'مصفوفة المهارات المتعددة للعمال (ILUO Skill Matrix) للتدريب المتقاطع'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Click any cell to upgrade operator skill level: I (In Training 25%) → L (Learnt 50%) → U (Independent Standard 75%) → O (Master Trainer 100%).',
                    'اضغط على أي خلية لترقية مستوى مهارة العامل: I (تحت التدريب ٢٥٪) ← L (ممارس بإشراف ٥٠٪) ← U (مستقل بالزمن القياسي ٧٥٪) ← O (مدرب خبير ١٠٠٪).'
                  )}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="p-3 text-start">{t('Operator / Role', 'العامل / الوظيفة')}</th>
                    {blueprint.workstations.map((ws, idx) => (
                      <th key={ws.id} className="p-3 text-center">
                        S{idx + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skillMatrixState.map((op) => (
                    <tr key={op.id} className="border-b hover:bg-muted/20">
                      <td className="p-3">
                        <div className="font-bold">{isAr ? op.operatorNameAr : op.operatorNameEn}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {isAr ? op.roleAr : op.roleEn}
                        </div>
                      </td>
                      {blueprint.workstations.map((ws) => {
                        const lvl = op.skills[ws.id] || 'I';
                        const badgeClass =
                          lvl === 'O'
                            ? 'bg-emerald-600 text-white'
                            : lvl === 'U'
                            ? 'bg-sky-600 text-white'
                            : lvl === 'L'
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                            : 'bg-muted text-muted-foreground';
                        return (
                          <td key={ws.id} className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setSkillMatrixState((prev) =>
                                  prev.map((row) =>
                                    row.id === op.id
                                      ? {
                                          ...row,
                                          skills: {
                                            ...row.skills,
                                            [ws.id]: cycleIluo(row.skills[ws.id] || 'I'),
                                          },
                                        }
                                      : row
                                  )
                                );
                              }}
                              className={`h-8 w-8 rounded-lg font-extrabold text-xs transition cursor-pointer ${badgeClass}`}
                            >
                              {lvl}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Kanban Pull System, Supermarket Sizing, Heijunka Box & Water Spider */}
      {activeTab === 'kanban' && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 rounded-2xl border bg-card p-6 space-y-4">
              <h2 className="text-lg font-extrabold">
                {t(
                  'Kanban Card, Supermarket Sizing & Water Spider Route Calculator',
                  'حاسبة بطاقات كانبان وحجم السوبرماركت ومسار المزود (Water Spider)'
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
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {t('Heijunka Pack-Out Lot Size', 'سعة صندوق الجدولة (Pitch Pack Qty)')}
                  </label>
                  <input
                    type="number"
                    value={heijunkaPackOutQty}
                    onChange={(e) => setHeijunkaPackOutQty(Number(e.target.value))}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {t('Water Spider Cycle (min)', 'دورة قطار التغذية (دقيقة)')}
                  </label>
                  <input
                    type="number"
                    value={waterSpiderCycleMin}
                    onChange={(e) => setWaterSpiderCycleMin(Number(e.target.value))}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 p-3.5">
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    {t('Kanban Cards', 'بطاقات كانبان')}
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                    {kanbanResult.cards} {t('Bins', 'عربة')}
                  </div>
                </div>
                <div className="rounded-xl border bg-muted/30 p-3.5">
                  <div className="text-[11px] text-muted-foreground">
                    {t('Heijunka Pitch', 'إيقاع Pitch')}
                  </div>
                  <div className="text-2xl font-extrabold text-sky-600 mt-1">
                    {kanbanResult.pitchMin}m
                  </div>
                </div>
                <div className="rounded-xl border bg-muted/30 p-3.5">
                  <div className="text-[11px] text-muted-foreground">
                    {t('Spider Trips/Shift', 'جولات التغذية/وردية')}
                  </div>
                  <div className="text-2xl font-extrabold mt-1">
                    {kanbanResult.waterSpiderTripsPerShift}x
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
                  <span className="text-muted-foreground block">
                    {t('Item / Material Spec:', 'الصنف والمواصفة:')}
                  </span>
                  <strong>{blueprint.productFocus}</strong>
                </div>
                <div className="rounded-lg border p-2.5 bg-muted/20">
                  <span className="text-muted-foreground block">
                    {t('Standard Container Qty:', 'سعة الحاوية القياسية:')}
                  </span>
                  <strong>
                    {kanbanBinCap} units / trolley (Max WIP: {kanbanResult.maxWipUnits})
                  </strong>
                </div>
                <div className="rounded-lg border p-2.5 bg-muted/20">
                  <span className="text-muted-foreground block">
                    {t('Upstream Supplier Process:', 'القسم المورّد (المنبع):')}
                  </span>
                  <strong>Weaving / Dyeing Supermarket Bay #2</strong>
                </div>
                <div className="rounded-lg border p-2.5 bg-muted/20">
                  <span className="text-muted-foreground block">
                    {t('Downstream Customer Process:', 'القسم المستهلك (المصب):')}
                  </span>
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

          {/* Visual Heijunka Box (Mixed-Model Production Leveling) */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div>
              <h2 className="text-lg font-extrabold">
                {t(
                  'Heijunka Box: Visual Mixed-Model Production Leveling (A-B-A-C-A-B-D Sequence)',
                  'صندوق هيجونكا (Heijunka Box): تسوية وموازنة الإنتاج متعدد الموديلات (A-B-A-C)'
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t(
                  'Eliminates batching surges (Mura) and machine overburden (Muri) by sequencing SKUs in 30-minute Pitch slots (EPEI = 0.5 Shift).',
                  'يقضي على التذبذب (Mura) والإجهاد الزائد للماكينات (Muri) عبر توزيع الأصناف في فترات Pitch منتظمة كل ٣٠ دقيقة.'
                )}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {blueprint.heijunkaSchedule.map((slot, idx) => (
                <div key={idx} className="rounded-xl border p-3.5 bg-muted/15 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {slot.pitchTime}
                    </span>
                    <Pill tone={slot.colorTone}>{slot.qtyUnits} pcs</Pill>
                  </div>
                  <div className="text-xs font-extrabold">{slot.skuCode}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {isAr ? slot.skuNameAr : slot.skuNameEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Jidoka, Andon Board, Poka-Yoke & Process FMEA (RPN Calculator) */}
      {activeTab === 'jidoka' && (
        <div className="space-y-8">
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
                    onClick={() => setAndonStates((prev) => ({ ...prev, [bay]: nextState }))}
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

          {/* Interactive Process FMEA (RPN = S × O × D) Matrix */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">
                  {t(
                    'Process FMEA (Failure Mode & Effects Analysis) — Risk Priority Number (RPN = S × O × D)',
                    'تحليل أنماط وآثار الفشل (PFMEA) وحساب رقم أولوية المخاطر (RPN = S × O × D)'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Any failure mode with RPN ≥ 100 requires mandatory Poka-Yoke mistake-proofing interlocks.',
                    'أي خطوة يتجاوز فيها معامل الخطورة RPN ≥ ١٠٠ تتطلب تطبيق أنظمة منع الخطأ (Poka-Yoke) فوراً.'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFmeaMitigated((prev) => !prev)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-500 transition cursor-pointer"
              >
                {fmeaMitigated
                  ? t('✓ Poka-Yoke Controls Active (All RPN < 35)', '✓ تم تفعيل Poka-Yoke (جميع RPN أقل من ٣٥)')
                  : t('Simulate Post-Poka-Yoke RPN Reduction', 'محاكاة خفض المخاطر RPN بعد تطبيق Poka-Yoke')}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40 text-start">
                    <th className="p-3 text-start">{t('Process & Failure Mode', 'العملية ونمط الفشل')}</th>
                    <th className="p-3 text-center">S</th>
                    <th className="p-3 text-center">O</th>
                    <th className="p-3 text-center">D</th>
                    <th className="p-3 text-center">RPN</th>
                    <th className="p-3 text-start">{t('Poka-Yoke Countermeasure', 'إجراء Poka-Yoke الوقائي')}</th>
                  </tr>
                </thead>
                <tbody>
                  {blueprint.fmeaItems.map((f) => {
                    const s = fmeaMitigated ? f.afterSeverity : f.severity;
                    const o = fmeaMitigated ? f.afterOccurrence : f.occurrence;
                    const d = fmeaMitigated ? f.afterDetection : f.detection;
                    const rpn = s * o * d;
                    return (
                      <tr key={f.id} className="border-b hover:bg-muted/20">
                        <td className="p-3">
                          <div className="font-bold">
                            {isAr ? f.processStepAr : f.processStepEn}:{' '}
                            {isAr ? f.failureModeAr : f.failureModeEn}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {isAr ? f.effectAr : f.effectEn}
                          </div>
                        </td>
                        <td className="p-3 text-center font-mono font-bold">{s}</td>
                        <td className="p-3 text-center font-mono font-bold">{o}</td>
                        <td className="p-3 text-center font-mono font-bold">{d}</td>
                        <td className="p-3 text-center">
                          <Pill tone={rpn >= 100 ? 'red' : rpn >= 50 ? 'amber' : 'emerald'}>
                            {rpn}
                          </Pill>
                        </td>
                        <td className="p-3 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                          {isAr ? f.recommendedActionAr : f.recommendedActionEn}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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

      {/* TAB 7: Lean Six Sigma DMAIC, SPC Control Chart, Cp/Cpk & DPMO Calculator */}
      {activeTab === 'six_sigma' && (
        <div className="space-y-8">
          <div className="rounded-2xl border bg-card p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold">
                  {t(
                    'Statistical Process Control (SPC) & Process Capability (Cp / Cpk) Calculator',
                    'حاسبة الضبط الإحصائي للعمليات (SPC) ومؤشرات قدرة العملية (Cp / Cpk)'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Cp = (USL - LSL) / 6σ | Cpk = min( (USL - μ)/3σ, (μ - LSL)/3σ ) — Target Cpk ≥ 1.33 (4σ) to 2.00 (6σ).',
                    'المعيار الصناعي لقدرة العملية: Cpk ≥ 1.33 (مستوى ٤ سيجما) إلى 2.00 (مستوى ٦ سيجما العالمي).'
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {blueprint.spcPresets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectSpcPreset(p.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                      selectedSpcId === p.id
                        ? 'bg-emerald-600 text-white'
                        : 'border bg-muted/40 hover:bg-muted'
                    }`}
                  >
                    {isAr ? p.parameterAr : p.parameterEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-3">
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Lower Spec Limit (LSL)', 'الحد الأدنى للمواصفة (LSL)')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={spcLsl}
                  onChange={(e) => setSpcLsl(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Upper Spec Limit (USL)', 'الحد الأعلى للمواصفة (USL)')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={spcUsl}
                  onChange={(e) => setSpcUsl(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Process Mean (μ)', 'متوسط العملية الفعلي (μ)')}
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={spcMean}
                  onChange={(e) => setSpcMean(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Std Deviation (σ)', 'الانحراف المعياري (σ)')}
                </label>
                <input
                  type="number"
                  step="0.02"
                  value={spcStdDev}
                  onChange={(e) => setSpcStdDev(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">{t('Potential Capability (Cp)', 'القدرة الكامنة Cp')}</div>
                <div className="text-2xl font-extrabold text-primary mt-1">{spcMetrics.cp}</div>
              </div>
              <div className="rounded-2xl border-2 border-emerald-500/40 p-4 bg-emerald-500/10">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {t('Centered Capability (Cpk)', 'مؤشر القدرة الفعلي Cpk')}
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 mt-1">{spcMetrics.cpk}</div>
                <div className="text-[11px] mt-0.5">
                  {spcMetrics.cpkNum >= 1.33
                    ? t('✓ Capable Process (≥ 1.33)', '✓ عملية قادرة ومضبوطة إحصائياً')
                    : t('⚠ Drift / High Variation (< 1.33)', '⚠ انحراف يتطلب ضبط المعايرة')}
                </div>
              </div>
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">
                  {t('SPC 3σ Control Limits', 'حدود الرقابة الإحصائية ±3σ')}
                </div>
                <div className="text-sm font-extrabold mt-2">
                  LCL: <span className="text-sky-600">{spcMetrics.lcl}</span> | UCL:{' '}
                  <span className="text-sky-600">{spcMetrics.ucl}</span> {activeSpcPreset.unit}
                </div>
              </div>
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">
                  {t('Sample Batch Readings (12 Lots)', 'قراءات العينات المتتالية (١٢ لوط)')}
                </div>
                <div className="flex items-end gap-1 h-10 mt-2">
                  {activeSpcPreset.samples.map((val, i) => {
                    const norm = Math.max(
                      15,
                      Math.min(
                        100,
                        Math.round(((val - spcLsl) / Math.max(0.01, spcUsl - spcLsl)) * 100)
                      )
                    );
                    const outOfSpec = val > spcUsl || val < spcLsl;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-t ${
                          outOfSpec ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ height: `${norm}%` }}
                        title={`Lot #${i + 1}: ${val} ${activeSpcPreset.unit}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* DPMO, Sigma Level, DHU & COPQ Calculator */}
          <div className="rounded-2xl border bg-card p-6 space-y-5">
            <h2 className="text-lg font-extrabold">
              {t(
                'Six Sigma DPMO, Sigma Level, DHU % & Cost of Poor Quality (COPQ) Calculator',
                'حاسبة عيوب المليون فرصة (DPMO) ومستوى سيجما وتكلفة الجودة الرديئة (COPQ)'
              )}
            </h2>
            <div className="grid sm:grid-cols-4 gap-3">
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Units / Rolls Inspected', 'عدد الوحدات / الرولات المفحوصة')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={dpmoUnitsInspected}
                  onChange={(e) => setDpmoUnitsInspected(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Defect Opportunities / Unit', 'فرص العيب في الوحدة الواحدة')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={dpmoOpportunitiesPerUnit}
                  onChange={(e) => setDpmoOpportunitiesPerUnit(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Total Defects Found', 'إجمالي العيوب المرصودة')}
                </label>
                <input
                  type="number"
                  min={0}
                  value={dpmoTotalDefects}
                  onChange={(e) => setDpmoTotalDefects(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-[11px] font-semibold mb-1">
                  {t('Rework/Scrap Cost per Defect (EGP)', 'متوسط تكلفة العيب الواحد (ج.م)')}
                </label>
                <input
                  type="number"
                  min={1}
                  value={copqCostPerDefectEgp}
                  onChange={(e) => setCopqCostPerDefectEgp(Number(e.target.value))}
                  className="w-full rounded-lg border bg-background px-2.5 py-1.5 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">DPMO</div>
                <div className="text-2xl font-extrabold text-primary mt-1">
                  {fmtNumber(locale, spcMetrics.dpmo)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {t('Defects Per Million Opp.', 'عيب لكل مليون فرصة')}
                </div>
              </div>
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">{t('Sigma Level', 'مستوى سيجما')}</div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  {spcMetrics.sigmaLevel} Sigma (σ)
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Yield: <strong>{spcMetrics.yieldPct}%</strong>
                </div>
              </div>
              <div className="rounded-2xl border p-4 bg-muted/20">
                <div className="text-xs text-muted-foreground">DHU %</div>
                <div className="text-2xl font-extrabold text-amber-600 mt-1">
                  {spcMetrics.dhuPct}%
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {t('Defects Per 100 Units', 'عيوب لكل ١٠٠ قطعة')}
                </div>
              </div>
              <div className="rounded-2xl border p-4 bg-rose-500/10 border-rose-500/30">
                <div className="text-xs font-bold text-rose-600">
                  {t('Monthly COPQ Loss', 'تكلفة الجودة الرديئة شهرياً')}
                </div>
                <div className="text-2xl font-extrabold text-rose-600 mt-1">
                  {fmtNumber(locale, spcMetrics.monthlyCopqEgp)} EGP
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: Lean Daily Management System (LDMS) — SQDC Gemba Board & Leader Standard Work */}
      {activeTab === 'daily_mgmt' && (
        <div className="space-y-8">
          <div className="rounded-2xl border bg-card p-6 space-y-5">
            <div>
              <h2 className="text-lg font-extrabold">
                {t(
                  'Interactive SQDC Shop-Floor Gemba Board (Safety • Quality • Delivery • Cost • People)',
                  'لوحة الإدارة البصرية اليومية في صالة الإنتاج (SQDC Gemba Board)'
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                {t(
                  'Click any day cell (D1–D14) to toggle Green (Target Met) vs. Red (Target Missed — Triggers 24h Countermeasure).',
                  'اضغط على أي يوم (D1–D14) لتغيير حالته بين الأخضر (تحقق الهدف) والأحمر (انحراف يستوجب إجراء كايزن خلال ٢٤ ساعة).'
                )}
              </p>
            </div>

            <div className="space-y-3">
              {sqdcRows.map((row, rIdx) => (
                <div key={row.code} className="rounded-xl border p-4 bg-muted/15 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-extrabold text-sm">
                        {row.code}
                      </span>
                      <div>
                        <div className="font-extrabold text-sm">
                          {isAr ? row.dimensionAr : row.dimensionEn}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t('Target:', 'الهدف:')} {isAr ? row.kpiTargetAr : row.kpiTargetEn}
                        </div>
                      </div>
                    </div>
                    <Pill tone="blue">{isAr ? row.currentActualAr : row.currentActualEn}</Pill>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {row.daysStatus.map((st, dIdx) => (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => {
                          setSqdcRows((prev) =>
                            prev.map((r, i) =>
                              i === rIdx
                                ? {
                                    ...r,
                                    daysStatus: r.daysStatus.map((val, j) =>
                                      j === dIdx ? (val === 'GREEN' ? 'RED' : 'GREEN') : val
                                    ),
                                  }
                                : r
                            )
                          );
                        }}
                        className={`h-7 w-9 rounded-md text-[10px] font-extrabold transition cursor-pointer ${
                          st === 'GREEN'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white animate-pulse'
                        }`}
                      >
                        D{dIdx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 rounded-lg p-2">
                    <strong>{t('Active Gemba Countermeasure:', 'إجراء الجيمبا التصحيحي:')}</strong>{' '}
                    {isAr ? row.countermeasureAr : row.countermeasureEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier 1 / Tier 2 / Tier 3 Leader Standard Work (LSW) Cadence */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="text-lg font-extrabold">
              {t(
                'Tiered Leader Standard Work (LSW) & Daily Gemba Walk Cadence',
                'العمل القياسي للقادة (Leader Standard Work) والروتين اليومي لجولات الجيمبا'
              )}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {blueprint.leaderStandardWork.map((lsw) => (
                <div key={lsw.tier} className="rounded-xl border p-4 bg-muted/15 space-y-2">
                  <Pill tone="emerald">{lsw.timeSlot}</Pill>
                  <h3 className="font-extrabold text-sm">
                    {isAr ? lsw.tierLabelAr : lsw.tierLabelEn}
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    <strong>{t('Participants:', 'المشاركون:')}</strong>{' '}
                    {isAr ? lsw.ownerAr : lsw.ownerEn}
                  </div>
                  <p className="text-xs">{isAr ? lsw.gembaFocusAr : lsw.gembaFocusEn}</p>
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 rounded-lg p-2">
                    {isAr ? lsw.standardOutputAr : lsw.standardOutputEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: Toyota-Style A3 Report, Kaizen PDCA & Hoshin Kanri X-Matrix */}
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
                  onClick={handleExportLeanCsv}
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold hover:bg-muted transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-amber-600" />
                  {t('Export KPIs (.CSV)', 'تصدير المؤشرات (.CSV)')}
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
                    `Lean Six Sigma, SMED, 5S & OEE Turnaround for ${blueprint.factoryName}`
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
                    <th className="p-3 text-start">
                      {t('3-Year Breakthrough', 'الهدف الاستراتيجي (٣ سنوات)')}
                    </th>
                    <th className="p-3 text-start">{t('Annual Target', 'الهدف السنوي')}</th>
                    <th className="p-3 text-start">
                      {t('Shop-Floor Kaizen Focus', 'مبادرة كايزن في العنبر')}
                    </th>
                    <th className="p-3 text-start">{t('KPI Metrics', 'مؤشرات الأداء KPIs')}</th>
                    <th className="p-3 text-start">{t('Owner', 'المسؤول')}</th>
                  </tr>
                </thead>
                <tbody>
                  {blueprint.hoshinMatrix.map((h, i) => (
                    <tr key={i} className="border-b hover:bg-muted/20">
                      <td className="p-3 font-bold">
                        {isAr ? h.breakthrough3YrAr : h.breakthrough3YrEn}
                      </td>
                      <td className="p-3">{isAr ? h.annualTargetAr : h.annualTargetEn}</td>
                      <td className="p-3 text-emerald-700 dark:text-emerald-300 font-medium">
                        {isAr ? h.shopFloorKaizenAr : h.shopFloorKaizenEn}
                      </td>
                      <td className="p-3 font-mono text-xs">
                        {isAr ? h.kpiMetricAr : h.kpiMetricEn}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {isAr ? h.ownerAr : h.ownerEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Universal On-Demand Pillar One-Point Lesson (OPL) & Standard Work SOP Generator */}
      <div className="rounded-2xl border-2 border-emerald-500/35 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-sky-500/10 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-600">
              <Sparkles className="h-3.5 w-3.5" />
              {t(
                'LIVE SHOP-FLOOR ONE-POINT LESSON (OPL) & STANDARD WORK SOP GENERATOR',
                'مولد دروس النقطة الواحدة (OPL) وتعليمات العمل القياسية (SOP) بالذكاء الاصطناعي'
              )}
            </span>
            <h3 className="text-base font-extrabold mt-0.5">
              {t(
                `Synthesize a Custom Shop-Floor OPL & Standard Work Sheet for Pillar: ${activeTab.toUpperCase()}`,
                `توليد وثيقة عمل قياسية (SOP) ودرس نقطة واحدة (OPL) للمحور الحالي (${activeTab.toUpperCase()})`
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t(
                'Uses your live calculator numbers (Takt, OEE, Cpk, Kanban, 5S) and your selected Free LLM.',
                'يعتمد مباشرة على الأرقام المحسوبة أمامك في الحاسبات التفاعلية مع نموذج الذكاء الاصطناعي المجاني المختار.'
              )}
            </p>
          </div>
          <button
            type="button"
            disabled={sopLoading}
            onClick={handleGeneratePillarSop}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-emerald-500 transition shadow cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            {sopLoading
              ? t('AI Writing OPL & SOP...', 'جارٍ كتابة تعليمة العمل القياسية...')
              : t(
                  '✨ Generate AI One-Point Lesson (OPL) for This Tab',
                  '✨ توليد درس النقطة الواحدة (OPL) لهذا المحور'
                )}
          </button>
        </div>

        {pillarSopMap[activeTab] && (
          <div className="rounded-xl border bg-card p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-b pb-2">
              <span>
                {t('Generated Shop-Floor Standard Work Sheet', 'بطاقة العمل القياسي الجاهزة للطباعة')}
              </span>
              <Pill tone="emerald">{pillarSopMap[activeTab].model}</Pill>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {pillarSopMap[activeTab].md}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Google Opal Industrial Mini-App & Google Stitch Andon/OEE UI Prototyper */}
      <GoogleCreativeLabIntegration
        locale={locale}
        defaultTool="opal"
        contextModule="lean"
      />
    </div>
  );
}

export default LeanManufacturingClient;
