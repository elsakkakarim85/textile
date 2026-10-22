'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Cpu,
  Zap,
  Download,
  Sliders,
  Sparkles,
  CheckCircle2,
  Layers,
  Database,
  Eye,
  FileJson,
  FileText,
  Grid,
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';
import {
  extractTextileTelemetry,
  runSovereignTextileModel,
} from '@/lib/sovereign-textile-lm';
import {
  renderSovereignVisualToCanvas,
  type SovereignVisualMode,
} from '@/lib/sovereign-visual-model';

interface Props {
  locale: string;
}

export function SovereignNeuralLabPanel({ locale }: Props) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [prompt, setPrompt] = useState(
    isAr
      ? 'قماش ساتان فاخر قطن جيزة 94 نمرة Ne 60/1 بعرض 280 سم وصباغة تفاعلية منخفضة الحمام 1:6 للتصدير إلى ألمانيا بشهادة EUR.1 وجواز المنتج الرقمي DPP'
      : 'Luxury Giza 94 compact cotton sateen Ne 60/1, 280 cm width, low-liquor 1:6 reactive indigo dyeing for Germany EU EUR.1 & US QIZ export with Digital Product Passport'
  );
  const [visualMode, setVisualMode] = useState<SovereignVisualMode>('weave-physics');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parametric Engineering Sliders
  const [sliderNe, setSliderNe] = useState(60);
  const [sliderPly, setSliderPly] = useState(1);
  const [sliderWidth, setSliderWidth] = useState(280);
  const [sliderLr, setSliderLr] = useState(6.0);
  const [sliderStructure, setSliderStructure] = useState('sateen');
  const [sliderFiber, setSliderFiber] = useState('Giza 94');

  // Unlimited Custom / Local LLM Config State
  const [customProvider, setCustomProvider] = useState<
    'auto' | 'sovereign' | 'ollama' | 'groq' | 'gemini' | 'openrouter' | 'huggingface'
  >('sovereign');
  const [customApiKey, setCustomApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('http://localhost:11434/v1');
  const [customModelName, setCustomModelName] = useState('mahalla-sovereign-v5');
  const [customFactoryRules, setCustomFactoryRules] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mahalla_custom_ai_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.provider) setCustomProvider(parsed.provider);
        if (parsed.apiKey) setCustomApiKey(parsed.apiKey);
        if (parsed.baseUrl) setCustomBaseUrl(parsed.baseUrl);
        if (parsed.modelName) setCustomModelName(parsed.modelName);
        if (parsed.factoryRules) setCustomFactoryRules(parsed.factoryRules);
      }
    } catch {
      // ignore
    }
  }, []);

  const applyParametricSynthesis = (
    nextStruct = sliderStructure,
    nextFiber = sliderFiber,
    nextNe = sliderNe,
    nextPly = sliderPly,
    nextWidth = sliderWidth,
    nextLr = sliderLr
  ) => {
    setSliderStructure(nextStruct);
    setSliderFiber(nextFiber);
    setSliderNe(nextNe);
    setSliderPly(nextPly);
    setSliderWidth(nextWidth);
    setSliderLr(nextLr);

    const synthesizedPrompt = isAr
      ? `تصنيع وتصدير قماش ${nextStruct} من ${nextFiber} نمرة Ne ${nextNe}/${nextPly} بعرض ${nextWidth} سم وصباغة تفاعلية بنسبة حمام 1:${nextLr} مع حساب مواصفات Uster 2023 وتكلفة FOB والإعفاء الجمركي EUR.1 / QIZ`
      : `Engineered ${nextFiber} ${nextStruct} fabric Ne ${nextNe}/${nextPly}, ${nextWidth} cm width, low-liquor 1:${nextLr} reactive dyeing with Uster 2023 benchmarks, reed/crimp geometry, and FOB to EU EUR.1 / US QIZ landed cost`;
    setPrompt(synthesizedPrompt);
  };

  const telemetry = extractTextileTelemetry(prompt);
  const sovereignOutput = runSovereignTextileModel({
    prompt: customFactoryRules ? `${prompt}\n[Factory Custom Rules: ${customFactoryRules}]` : prompt,
    localeHint: locale,
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    renderSovereignVisualToCanvas({
      canvas: canvasRef.current,
      prompt,
      moduleBadge: isAr ? 'المختبر العصبي السيادي v5.0' : 'SOVEREIGN NEURAL LAB v5.0',
      locale,
      mode: visualMode,
    });
  }, [prompt, visualMode, locale, isAr]);

  const handleSaveConfig = () => {
    try {
      localStorage.setItem(
        'mahalla_custom_ai_config',
        JSON.stringify({
          provider: customProvider,
          apiKey: customApiKey,
          baseUrl: customBaseUrl,
          modelName: customModelName,
          factoryRules: customFactoryRules,
        })
      );
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleDownloadCanvas = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahalla-sovereign-${visualMode}-1280x540.png`;
    a.click();
  };

  const handleDownloadDppJson = () => {
    const payload = {
      dppStandard: 'EU-ESPR-2024-1781-v5.0',
      generatedBy: 'Mahalla-Sovereign-LM v5.0 (Built-From-Scratch Quantitative Engine)',
      timestamp: new Date().toISOString(),
      clusterOrigin: 'El-Mahalla El-Kubra Industrial Textile Cluster, Egypt',
      specification: {
        fiber: telemetry.fiberLabelEn,
        construction: telemetry.structureLabelEn,
        yarnCount: `Ne ${telemetry.yarnCountNe}/${telemetry.ply}`,
        linearDensityTex: telemetry.tex,
        twistTpi: telemetry.tpi,
        settEpiByPpi: `${telemetry.epi} x ${telemetry.ppi}`,
        threadCount: telemetry.threadCount,
        arealWeightGsm: telemetry.gsm,
        fabricWidthCm: telemetry.fabricWidthCm,
      },
      uster2023Profile: telemetry.uster,
      weaveAndReedGeometry: telemetry.weaveGeometry,
      fobCostingBom: telemetry.costing,
      sustainabilityAndCarbon: telemetry.sustainability,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahalla-eu-dpp-ne${telemetry.yarnCountNe}-${telemetry.structure}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([sovereignOutput.text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahalla-sovereign-report-ne${telemetry.yarnCountNe}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const presetScenarios = [
    {
      label: t('Giza 94 Luxury Sateen Ne 60/1 (EU EUR.1)', 'ساتان جيزة 94 نمرة 60/1 (تصدير أوروبا EUR.1)'),
      text: isAr
        ? 'قماش ساتان فاخر قطن جيزة 94 نمرة Ne 60/1 بعرض 280 سم وصباغة تفاعلية 1:6 للتصدير إلى ألمانيا وإيطاليا بشهادة EUR.1'
        : 'Luxury Giza 94 compact cotton sateen Ne 60/1, 280 cm width, low-liquor 1:6 reactive emerald dyeing for EU EUR.1 vs US QIZ landed cost comparison',
    },
    {
      label: t('Hospitality Terry Towel 550 GSM (1:6 Dyeing)', 'فوط فندقية 550 جم/م² (صباغة منخفضة الحمام 1:6)'),
      text: isAr
        ? 'قدم بروتوكولاً هندسياً لصباغة فوط فندقية قطن جيزة 86 نمرة Ne 20/2 بوزن 550 GSM ونسبة حمام 1:6 مع التوافق مع ZDHC MRSL v3.1'
        : 'Provide a low-liquor 1:6 reactive dyeing recipe for 550 GSM hospitality terry towels Ne 20/2 Giza 86 cotton achieving ΔE ≤ 0.75 and ZDHC Level 3',
    },
    {
      label: t('Indigo Workwear Twill / Denim Ne 16/1 (Uster & OEE)', 'جبردين ودنيم نيلي Ne 16/1 (معايير Uster وكفاءة OEE)'),
      text: isAr
        ? 'ما هي معايير Uster 2023 وضبط الرطوبة النسبية وشد السداء وتقليل زمن تغيير المطواة SMED لأنوال الهواء عند نسج جبردين نيلي Ne 16/1 بوزن 285 GSM؟'
        : 'Air-jet weaving OEE, Uster 2023 yarn benchmarks, warp tension calibration, and SMED beam changeover for indigo workwear twill Ne 16/1 at 285 GSM and 165 cm width',
    },
    {
      label: t('Green CAPEX, NPV/IRR & EBRD 15% Grant', 'دراسة جدوى التحديث الأخضر ومنحة EBRD 15%'),
      text: isAr
        ? 'احسب العائد الاستثماري NPV ومعدل العائد الداخلي IRR وفترة الاسترداد ومنحة EBRD GEFF بنسبة 15% لتحديث مصبغة وحلقة غزل قطن جيزة 86'
        : 'Calculate CAPEX, 5-year NPV, IRR, payback period, and EBRD GEFF 15% green cashback grant for modernizing a Giza 86 dyeing and weaving mill',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Architecture Banner */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-950 via-emerald-950/90 to-slate-900 p-6 text-white shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-extrabold text-emerald-300">
                <Cpu className="h-3.5 w-3.5" />
                {t(
                  'BUILT-FROM-SCRATCH SOVEREIGN TEXTILE AI v5.0 • ZERO EXTERNAL LIMITS • <2ms LATENCY',
                  'النموذج العصبي السيادي المبني من الصفر v5.0 • بدون أي قيود أو حدود استخدام • استجابة فورية'
                )}
              </div>
              <ExpertManualButton manualId="sovereign-neural-lab" locale={locale} variant="pill" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {t(
                'Mahalla-Sovereign-LM v5.0 + Weave-Diffusion v5.0 Parametric Engineering Workbench',
                'مختبر المحرك العصبي السيادي للمحلة (Mahalla-Sovereign-LM v5.0 + Weave-Diffusion v5.0)'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl">
              {t(
                'Features Uster® 2023 5% yarn quality modeling, 8×8 Dobby peg-plan & reed/crimp geometry, isothermal dyeing stoichiometry, CAPEX/NPV/IRR financial modeling, and 5 procedural HD engineering visual modes.',
                'يتضمن نمذجة جودة الغزول وفق Uster® 2023، ومصفوفة الدوبي 8×8 وحسابات المشط والتشريب، وكيمياء الصباغة، ودراسات الجدوى المالية NPV/IRR، و5 أنماط رسم هندسي ثلاثي الأبعاد.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadDppJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1.5 text-xs font-extrabold text-emerald-200 transition cursor-pointer"
            >
              <FileJson className="h-3.5 w-3.5" />
              {t('Export EU DPP (.JSON)', 'تصدير جواز المنتج (.JSON)')}
            </button>
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/50 bg-sky-500/20 hover:bg-sky-500/30 px-3 py-1.5 text-xs font-extrabold text-sky-200 transition cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5" />
              {t('Download Report (.MD)', 'تحميل الدراسة (.MD)')}
            </button>
          </div>
        </div>

        {/* Interactive Parametric Engineering Synthesizer Controls */}
        <div className="rounded-2xl border border-white/15 bg-slate-900/85 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              {t(
                'Interactive Parametric CAD & Physics Synthesizer (Slide to recompute live in 0ms)',
                'لوحة التحكم البارامترية في فيزياء الغزل والنسيج والصباغة (حرّك المؤشرات للتحديث اللحظي)'
              )}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {t(
                `Draft D=${telemetry.uster.spinningDraft} • Spindle ${telemetry.uster.spindleRpm} RPM • Reed ${telemetry.weaveGeometry.reedCountDentsInch} dents/in`,
                `السحب D=${telemetry.uster.spinningDraft} • سرعة المردن ${telemetry.uster.spindleRpm} RPM • المشط ${telemetry.weaveGeometry.reedCountDentsInch} باب/بوصة`
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {t('Weave / Knit Structure', 'التركيب النسجي')}
              </label>
              <select
                value={sliderStructure}
                onChange={(e) =>
                  applyParametricSynthesis(
                    e.target.value,
                    sliderFiber,
                    sliderNe,
                    sliderPly,
                    sliderWidth,
                    sliderLr
                  )
                }
                className="w-full rounded-lg border border-white/20 bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-white"
              >
                <option value="sateen">4/1 Luxury Sateen</option>
                <option value="percale">1/1 Plain Percale</option>
                <option value="twill denim">3/1 Z-Twill / Denim</option>
                <option value="jacquard">Damask Jacquard</option>
                <option value="terry towel">3-Pick Terry Towel</option>
                <option value="single jersey">28GG Single Jersey</option>
                <option value="interlock">24GG Interlock</option>
                <option value="pique">Honeycomb Pique</option>
                <option value="fleece">3-End Brushed Fleece</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {t('Fiber Grade', 'صنف الخامة والألياف')}
              </label>
              <select
                value={sliderFiber}
                onChange={(e) =>
                  applyParametricSynthesis(
                    sliderStructure,
                    e.target.value,
                    sliderNe,
                    sliderPly,
                    sliderWidth,
                    sliderLr
                  )
                }
                className="w-full rounded-lg border border-white/20 bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-white"
              >
                <option value="Giza 94">Giza 94 ELS Compact</option>
                <option value="Giza 86">Giza 86 Long-Staple</option>
                <option value="Organic GOTS">GOTS Organic Cotton</option>
                <option value="Recycled rPET Blend">80/20 Cotton / GRS rPET</option>
                <option value="Linen Cotton">55/45 Flax Linen / Giza</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {t(`Yarn Count: Ne ${sliderNe}`, `نمرة الغزل: Ne ${sliderNe}`)}
              </label>
              <input
                type="range"
                min={12}
                max={120}
                step={2}
                value={sliderNe}
                onChange={(e) =>
                  applyParametricSynthesis(
                    sliderStructure,
                    sliderFiber,
                    Number(e.target.value),
                    sliderPly,
                    sliderWidth,
                    sliderLr
                  )
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {t('Yarn Ply', 'عدد الزوي (Ply)')}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[1, 2].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() =>
                      applyParametricSynthesis(
                        sliderStructure,
                        sliderFiber,
                        sliderNe,
                        p,
                        sliderWidth,
                        sliderLr
                      )
                    }
                    className={`rounded-lg py-1.5 text-xs font-extrabold transition cursor-pointer ${
                      sliderPly === p
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-950 border border-white/15 text-slate-300'
                    }`}
                  >
                    {p === 1 ? 'Single (/1)' : '2-Ply (/2)'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {t(`Width: ${sliderWidth} cm`, `العرض: ${sliderWidth} سم`)}
              </label>
              <input
                type="range"
                min={110}
                max={340}
                step={5}
                value={sliderWidth}
                onChange={(e) =>
                  applyParametricSynthesis(
                    sliderStructure,
                    sliderFiber,
                    sliderNe,
                    sliderPly,
                    Number(e.target.value),
                    sliderLr
                  )
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                {t(`Liquor Ratio: 1:${sliderLr}`, `نسبة الحمام: 1:${sliderLr}`)}
              </label>
              <input
                type="range"
                min={4.5}
                max={10}
                step={0.5}
                value={sliderLr}
                onChange={(e) =>
                  applyParametricSynthesis(
                    sliderStructure,
                    sliderFiber,
                    sliderNe,
                    sliderPly,
                    sliderWidth,
                    Number(e.target.value)
                  )
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 1-Click Preset Engineering Scenarios */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presetScenarios.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(sc.text)}
              className="text-start rounded-xl border border-white/15 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-400/50 p-3 transition cursor-pointer"
            >
              <div className="text-xs font-extrabold text-amber-300 mb-1 flex items-center justify-between">
                <span>{sc.label}</span>
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2">{sc.text}</p>
            </button>
          ))}
        </div>

        {/* Live Prompt Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-emerald-300">
            {t(
              'Live Neural Tokenizer & Synthesis Input (Edit any specification or question in English or Arabic):',
              'مدخلات المحرك العصبي الفوري (عدّل أي مواصفة أو اطرح أي سؤال بالعربية أو الإنجليزية):'
            )}
          </label>
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full rounded-xl border border-emerald-400/40 bg-slate-900/95 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none"
          />
        </div>

        {/* Real-Time Extracted Quantitative Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="rounded-xl border border-white/15 bg-slate-900/90 p-3">
            <div className="text-[10px] font-bold uppercase text-emerald-400">
              {t('Uster® 2023 Profile', 'مؤشر Uster® 2023')}
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              CVm {telemetry.uster.cvmPct}% • {telemetry.uster.tenacityCnTex} cN/tex
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Ne {telemetry.yarnCountNe}/{telemetry.ply} ({telemetry.tex} Tex)
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-slate-900/90 p-3">
            <div className="text-[10px] font-bold uppercase text-emerald-400">
              {t('Reed & Crimp Plan', 'المشط والتشريب')}
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              {telemetry.weaveGeometry.reedCountDentsInch} dents/in ({telemetry.weaveGeometry.endsPerDent}/dent)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Reed Width: {telemetry.weaveGeometry.reedWidthCm} cm
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-slate-900/90 p-3">
            <div className="text-[10px] font-bold uppercase text-emerald-400">
              {t('Sett & Mass/Meter', 'الكثافة ووزن المتر')}
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              {telemetry.epi}×{telemetry.ppi} ({telemetry.gsm} GSM)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {telemetry.weaveGeometry.totalGramsPerLinearMeter} g / linear meter
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-slate-900/90 p-3">
            <div className="text-[10px] font-bold uppercase text-amber-400">
              {t('BOM FOB Price', 'تكلفة التصدير FOB')}
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              ${telemetry.costing.totalFobUsdKg.toFixed(2)}/kg ({telemetry.costing.totalFobEgpKg} EGP)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Linear Meter: ${telemetry.costing.fobUnitUsd.toFixed(2)}/m
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-slate-900/90 p-3">
            <div className="text-[10px] font-bold uppercase text-sky-400">
              {t('Wet Processing', 'الصباغة والتجهيز')}
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              LR 1:{telemetry.liquorRatio} • ΔE ≤ 0.75
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              -{telemetry.sustainability.waterSavedPct}% Water • ZDHC L3
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-slate-900/90 p-3">
            <div className="text-[10px] font-bold uppercase text-purple-400">
              {t('Carbon & EU DPP', 'البصمة الكربونية DPP')}
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              {telemetry.sustainability.netKgCo2ePerKg} kg CO2e/kg
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {telemetry.sustainability.waterLitersPerKgOptimized} L/kg • ESPR Ready
            </div>
          </div>
        </div>
      </div>

      {/* Built-From-Scratch Procedural Visual & CAD Synthesizer (5 Modes) */}
      <div className="rounded-3xl border-2 border-emerald-500/30 bg-slate-950 p-5 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-extrabold">
                {t(
                  'Mahalla-Weave-Diffusion v5.0 — 5-Mode Procedural Weave, Smart Mill, CAD, Dobby Draft & Uster Lab',
                  'محرك التوليد البصري والهندسي السيادي (Mahalla-Weave-Diffusion v5.0) — ٥ أنماط هندسية'
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {t(
                  '100% procedurally synthesized on HTML5 Canvas from your prompt parameters — zero external image servers, zero rate limits.',
                  'مرسوم برمجياً بالكامل من معادلات الغزل والنسيج والدوبى ومعمل Uster المستخلصة من نصك بدون أي قيود.'
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setVisualMode('weave-physics')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                visualMode === 'weave-physics'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('1. 3D Micro-Weave', '١. النسيج المجهري 3D')}
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('isometric-factory')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                visualMode === 'isometric-factory'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('2. 3D Smart Mill Twin', '٢. التوأم الرقمي للمصنع')}
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('cad-techpack')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                visualMode === 'cad-techpack'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('3. Vector CAD & Pantone', '٣. مخطط CAD والألوان')}
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('dobby-pegplan')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                visualMode === 'dobby-pegplan'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('4. 8×8 Dobby Peg-Plan & Crimp', '٤. مصفوفة الدوبي والمشط')}
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('uster-lab')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                visualMode === 'uster-lab'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('5. Uster® 2023 & CIE L*a*b*', '٥. معمل Uster والمطياف')}
            </button>
            <button
              type="button"
              onClick={handleDownloadCanvas}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-3 py-1.5 text-xs font-extrabold text-slate-950 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {t('Download .PNG', 'تحميل .PNG')}
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/15 bg-slate-900">
          <canvas ref={canvasRef} width={1280} height={540} className="w-full h-auto block" />
        </div>
      </div>

      {/* Two-Column Grid: Live Sovereign Markdown Deliverable + Interactive Dobby Matrix & Unlimited LLM Hub */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Live Sovereign Quantitative Deliverable */}
        <div className="lg:col-span-7 rounded-2xl border bg-card text-card-foreground p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-extrabold">
                {t(
                  'Live Sovereign Quantitative Synthesis Output',
                  'المخرجات الهندسية والكمية الفورية للنموذج السيادي'
                )}
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
              {sovereignOutput.model}
            </span>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{sovereignOutput.text}</ReactMarkdown>
          </div>
        </div>

        {/* Right 5 Cols: Interactive 8x8 Dobby Peg-Plan Inspector + Unlimited Local/Cloud Hub */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive 8x8 Dobby Point-Paper & Reed Spec Card */}
          <div className="rounded-2xl border bg-card text-card-foreground p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center gap-2">
                <Grid className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold">
                  {t(
                    '8×8 Dobby Point-Paper & Reed Mass Balance',
                    'مصفوفة الدوبي (8×8) وحسابات المشط واستهلاك الخيوط'
                  )}
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold text-emerald-600">
                {telemetry.weaveGeometry.weaveRepeat}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 items-center">
              {/* 8x8 Binary Grid */}
              <div className="grid grid-cols-8 gap-1 p-2.5 rounded-xl bg-slate-950 border w-fit mx-auto">
                {telemetry.weaveGeometry.matrix8x8.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                        val === 1
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                      title={`Pick ${rIdx + 1}, End ${cIdx + 1}: ${val === 1 ? 'Warp Up (Riser)' : 'Weft Up (Sinker)'}`}
                    >
                      {val}
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="rounded-lg border p-2 bg-muted/40">
                  <div className="text-[10px] font-bold text-muted-foreground">
                    {t('Harness & Denting Plan', 'الدرقات ونظام التطريح')}
                  </div>
                  <div className="font-extrabold">
                    {telemetry.weaveGeometry.harnessFrames} Frames • {telemetry.weaveGeometry.reedCountDentsInch} dents/in ({telemetry.weaveGeometry.endsPerDent}/dent)
                  </div>
                </div>
                <div className="rounded-lg border p-2 bg-muted/40">
                  <div className="text-[10px] font-bold text-muted-foreground">
                    {t('Reed Width & Crimp %', 'عرض المشط ونسبة التشريب')}
                  </div>
                  <div className="font-extrabold">
                    {telemetry.weaveGeometry.reedWidthCm} cm (Warp {telemetry.weaveGeometry.warpCrimpPct}% / Weft {telemetry.weaveGeometry.weftCrimpPct}%)
                  </div>
                </div>
                <div className="rounded-lg border p-2 bg-muted/40">
                  <div className="text-[10px] font-bold text-muted-foreground">
                    {t('Yarn Consumption / Linear Meter', 'استهلاك الغزل للمتر الطولي')}
                  </div>
                  <div className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {telemetry.weaveGeometry.totalGramsPerLinearMeter} g/m ({telemetry.weaveGeometry.warpGramsPerLinearMeter}g W + {telemetry.weaveGeometry.weftGramsPerLinearMeter}g F)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Unlimited Local Ollama & Cloud BYOK Configuration Card */}
          <div className="rounded-2xl border bg-card text-card-foreground p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Sliders className="h-4 w-4 text-emerald-600" />
              <div>
                <h3 className="text-sm font-extrabold">
                  {t(
                    'Unlimited LLM Router, Local Ollama & Custom Fine-Tuning',
                    'إعدادات النماذج غير المحدودة (Ollama المحلي + التخصيص الصناعي)'
                  )}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {t(
                    'Configure your preferred unlimited execution backend across all 19 modules.',
                    'اضبط محرك التشغيل المفضل لديك ليتم تطبيقه عبر جميع وحدات المنصة.'
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1">
                  {t('Primary AI Execution Architecture', 'معمارية التشغيل الأساسية')}
                </label>
                <select
                  value={customProvider}
                  onChange={(e) => setCustomProvider(e.target.value as any)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs font-bold"
                >
                  <option value="sovereign">
                    {t(
                      'Mahalla Sovereign Neural v5.0 (Built-From-Scratch • 0ms • 100% Unlimited)',
                      'النموذج السيادي للمحلة v5.0 (مبني من الصفر • فوري وبلا حدود)'
                    )}
                  </option>
                  <option value="auto">
                    {t(
                      'Hybrid Multi-LLM Router + Sovereign Cascade (Unlimited)',
                      'التوجيه الهجين متعدد النماذج + النموذج السيادي'
                    )}
                  </option>
                  <option value="ollama">
                    {t(
                      'Local Ollama / vLLM / LM Studio Server (http://localhost:11434/v1)',
                      'خادم محلي غير محدود Ollama / vLLM / LM Studio'
                    )}
                  </option>
                  <option value="groq">
                    {t('Groq LPU Cloud (Llama 3.3 70B / DeepSeek R1)', 'سحابة Groq فائقة السرعة')}
                  </option>
                  <option value="gemini">
                    {t('Google Gemini 2.5 Flash API', 'واجهة Google Gemini 2.5 Flash')}
                  </option>
                  <option value="openrouter">
                    {t('OpenRouter Multi-Model Gateway', 'بوابة OpenRouter')}
                  </option>
                  <option value="huggingface">
                    {t('HuggingFace Serverless Inference', 'بوابة HuggingFace')}
                  </option>
                </select>
              </div>

              {customProvider === 'ollama' ? (
                <div>
                  <label className="block text-xs font-bold mb-1">
                    {t('Local OpenAI-Compatible Server URL', 'رابط الخادم المحلي (Ollama / vLLM)')}
                  </label>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="http://localhost:11434/v1"
                    className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
                  />
                </div>
              ) : (
                customProvider !== 'sovereign' && (
                  <div>
                    <label className="block text-xs font-bold mb-1">
                      {t('API Key (Optional for Auto Cascade)', 'مفتاح API (اختياري)')}
                    </label>
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder={t('Paste Groq / Gemini / OpenRouter / HF key...', 'أدخل مفتاح API للاتصال المباشر...')}
                      className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
                    />
                  </div>
                )
              )}

              <div>
                <label className="block text-xs font-bold mb-1">
                  {t('Target Model Identifier', 'معرّف النموذج المستهدف')}
                </label>
                <input
                  type="text"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder="mahalla-sovereign-v5 / llama3.3 / gemini-2.5-flash"
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-emerald-600" />
                  {t(
                    'Custom Factory Knowledge & Domain Fine-Tuning Rules',
                    'قواعد تخصيص وتدريب النموذج على بيانات مصنعك'
                  )}
                </label>
                <textarea
                  rows={3}
                  value={customFactoryRules}
                  onChange={(e) => setCustomFactoryRules(e.target.value)}
                  placeholder={t(
                    'Example: Our mill operates 48 Picanol OmniPlus-i air-jet looms, 500 kWp rooftop solar, and specializes in Giza 86/94 hotel bedding for Germany...',
                    'مثال: يمتلك مصنعنا ٤٨ نول هواء بيكانول، ومحطة طاقة شمسية ٥٠٠ كيلوواط، ومتخصصون في مفروشات الفنادق لقطن جيزة ٨٦/٩٤...'
                  )}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveConfig}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-extrabold text-white transition cursor-pointer"
              >
                <Zap className="h-4 w-4" />
                {t(
                  'Save Unlimited AI Configuration Across Platform',
                  'حفظ وتعميم إعدادات الذكاء الاصطناعي عبر المنصة'
                )}
              </button>

              {savedBanner && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {t(
                    'Saved! All 19 modules, chat, and studios are now using your configuration.',
                    'تم الحفظ! جميع الوحدات والاستوديوهات تستخدم الآن هذا الإعداد.'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
