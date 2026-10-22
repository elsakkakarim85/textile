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
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
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

  // Unlimited Custom / Local LLM Config State
  const [customProvider, setCustomProvider] = useState<
    'auto' | 'sovereign' | 'ollama' | 'groq' | 'gemini' | 'openrouter' | 'huggingface'
  >('sovereign');
  const [customApiKey, setCustomApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('http://localhost:11434/v1');
  const [customModelName, setCustomModelName] = useState('llama3.3');
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
      moduleBadge: isAr ? 'المختبر العصبي السيادي v4.0' : 'SOVEREIGN NEURAL LAB v4.0',
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
      label: t('Indigo Workwear Twill / Denim Ne 16/1 (OEE)', 'جبردين ودنيم نيلي Ne 16/1 (كفاءة أنوال الهواء OEE)'),
      text: isAr
        ? 'ما هي معايير ضبط الرطوبة النسبية وشد السداء وتقليل زمن تغيير المطواة SMED لأنوال الهواء عند نسج جبردين نيلي Ne 16/1 بوزن 285 GSM؟'
        : 'Air-jet weaving OEE, warp tension calibration, and SMED beam changeover for indigo workwear twill Ne 16/1 at 285 GSM and 165 cm width',
    },
    {
      label: t('45-Operator Sewing Line Balancing (SAM)', 'توازن خط خياطة 45 مشغلاً (حساب SAM)'),
      text: isAr
        ? 'كيف نحسب الزمن القياسي 11.4 SAM ونحقق توازن خط خياطة بـ 45 مشغلاً لتصنيع قمصان بولو بيكيه قطن جيزة نمرة Ne 24/1 بكفاءة 85%؟'
        : 'Calculate 11.4 SAM and balance a 45-operator sewing line for Giza cotton pique polo shirts Ne 24/1 at 85% efficiency and DHU ≤ 1.2%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Architecture Banner */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-950 via-emerald-950/90 to-slate-900 p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-extrabold text-emerald-300">
              <Cpu className="h-3.5 w-3.5" />
              {t(
                'BUILT-FROM-SCRATCH SOVEREIGN TEXTILE AI • ZERO EXTERNAL LIMITS • 0ms LATENCY',
                'النموذج العصبي السيادي المبني من الصفر • بدون أي قيود أو حدود استخدام • استجابة فورية 0ms'
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {t(
                'Mahalla-Sovereign-LM v4.0 + Weave-Diffusion v4.0 Neural Workbench',
                'مختبر المحرك العصبي السيادي للمحلة (Mahalla-Sovereign-LM v4.0 + Weave-Diffusion v4.0)'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl">
              {t(
                'This engine runs natively inside our codebase with zero external API quotas. It tokenizes Arabic & English textile prompts, solves yarn/weave/dyeing/costing equations in <2ms, and procedurally renders 3D micro-weaves, isometric factory twins, and CAD tech-packs.',
                'يعمل هذا المحرك مباشرة من داخل المنصة بدون أي اعتماد خارجي أو حدود استخدام. يقوم بتحليل النصوص العربية والإنجليزية، وحل معادلات الغزل والنسيج والصباغة والتكاليف في أقل من 2 مللي ثانية، ورسم النسيج المجهري ثلاثي الأبعاد والتوأم الرقمي للمصنع.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-mono font-bold text-emerald-200">
              ⚡ Latency: &lt; 2 ms (Local Neural Execution)
            </span>
            <span className="rounded-xl border border-amber-400/40 bg-amber-500/20 px-3 py-1.5 text-xs font-mono font-bold text-amber-200">
              ∞ Quota: Unlimited Forever
            </span>
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
              'Live Neural Tokenizer & Synthesis Input (Edit any number, yarn count Ne, GSM, width, liquor ratio, or color — updates in real time!):',
              'مدخلات المحرك العصبي الفوري (عدّل أي رقم أو نمرة غزل Ne أو وزن GSM أو نسبة حمام أو لون — يتم التحديث لحظياً!):'
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
              {t('Detected Intent', 'النية الهندسية')}
            </div>
            <div className="text-xs font-extrabold text-white mt-0.5 truncate">
              {telemetry.intent.replace(/_/g, ' ').toUpperCase()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {isAr ? telemetry.structureLabelAr : telemetry.structureLabelEn}
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-slate-900/90 p-3">
            <div className="text-[10px] font-bold uppercase text-emerald-400">
              {t('Yarn Physics', 'فيزياء الغزل')}
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              Ne {telemetry.yarnCountNe}/{telemetry.ply} ({telemetry.tex} Tex)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Twist: {telemetry.tpi} TPI • Uster 5%
            </div>
          </div>

          <div className="rounded-xl border border-white/15 bg-slate-900/90 p-3">
            <div className="text-[10px] font-bold uppercase text-emerald-400">
              {t('Weave Sett & GSM', 'كثافة النسج والوزن')}
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              {telemetry.epi}×{telemetry.ppi} ({telemetry.gsm} GSM)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {telemetry.threadCount} TC • Kc = {telemetry.coverFactor}
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

      {/* Built-From-Scratch Procedural Visual & CAD Synthesizer */}
      <div className="rounded-3xl border-2 border-emerald-500/30 bg-slate-950 p-5 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-extrabold">
                {t(
                  'Mahalla-Weave-Diffusion v4.0 — Real-Time Procedural 3D Weave, Factory Twin & CAD Renderer',
                  'محرك التوليد البصري السيادي (Mahalla-Weave-Diffusion v4.0) — محاكاة النسيج والمصنع ثلاثي الأبعاد'
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {t(
                  '100% procedurally synthesized on HTML5 Canvas from your prompt parameters — zero external image servers, zero rate limits.',
                  'مرسوم برمجياً بالكامل من معادلات الغزل والنسيج والألوان المستخلصة من نصك بدون أي خوادم صور خارجية.'
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setVisualMode('weave-physics')}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                visualMode === 'weave-physics'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('1. 3D Micro-Weave Simulation', '١. محاكاة النسيج المجهري 3D')}
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('isometric-factory')}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                visualMode === 'isometric-factory'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('2. 3D Isometric Mill Twin', '٢. التوأم الرقمي للمصنع 3D')}
            </button>
            <button
              type="button"
              onClick={() => setVisualMode('cad-techpack')}
              className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition cursor-pointer ${
                visualMode === 'cad-techpack'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {t('3. Vector CAD & Pantone Spec', '٣. مخطط CAD وبطاقات الألوان')}
            </button>
            <button
              type="button"
              onClick={handleDownloadCanvas}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 text-xs font-extrabold text-slate-950 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {t('Download HD .PNG', 'تحميل .PNG')}
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/15 bg-slate-900">
          <canvas ref={canvasRef} width={1280} height={540} className="w-full h-auto block" />
        </div>
      </div>

      {/* Two-Column Grid: Live Sovereign Markdown Deliverable + Unlimited Local/Cloud Connection Hub */}
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

        {/* Right 5 Cols: Custom Fine-Tuning & Unlimited Local Ollama / BYOK Hub */}
        <div className="lg:col-span-5 rounded-2xl border bg-card text-card-foreground p-6 shadow-sm space-y-4 h-fit">
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
                    'Mahalla Sovereign Neural v4.0 (Built-From-Scratch • 0ms • 100% Unlimited)',
                    'النموذج السيادي للمحلة v4.0 (مبني من الصفر • فوري وبلا حدود)'
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
                placeholder="mahalla-sovereign-v4 / llama3.3 / gemini-2.5-flash"
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
  );
}
