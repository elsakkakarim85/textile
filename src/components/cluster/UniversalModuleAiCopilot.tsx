'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Bot,
  Send,
  Copy,
  Check,
  Download,
  Volume2,
  VolumeX,
  Cpu,
  Image as ImageIcon,
  GraduationCap,
  Globe2,
  Palette,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { Pill } from '@/components/cluster/ui';
import {
  MODULE_AI_CONFIGS,
  CLIENT_FREE_LLM_MODELS,
  type ClusterModuleId,
  type ClientFreeLlmModelId,
} from '@/server/modernization/module-ai-prompts';

interface Props {
  locale: string;
  explicitModuleId?: ClusterModuleId;
  contextSummary?: string;
}

function inferModuleFromPathname(pathname: string): ClusterModuleId | null {
  const p = pathname.toLowerCase();
  if (p.includes('/sign-in') || p.includes('/sign-up')) return null;
  if (p.includes('/cluster/procurement')) return 'procurement';
  if (p.includes('/cluster/capacity')) return 'capacity';
  if (p.includes('/cluster/consortia')) return 'consortia';
  if (p.includes('/cluster/facilities')) return 'facilities';
  if (p.includes('/cluster/maturity')) return 'maturity';
  if (p.includes('/cluster/academy')) return 'academy';
  if (p.includes('/cluster/brand-studio')) return 'brand-studio';
  if (p.includes('/cluster/export-intelligence')) return 'export-intelligence';
  if (p.includes('/cluster/sustainability')) return 'sustainability';
  if (p.includes('/cluster/funding')) return 'funding';
  if (p.includes('/cluster/forum')) return 'forum';
  if (p.includes('/cluster/events')) return 'events';
  if (p.includes('/cluster/experts')) return 'experts';
  if (p.includes('/cluster/announcements')) return 'announcements';
  if (p.includes('/cluster/observatory')) return 'observatory';
  if (p.includes('/marketplaces') || p.includes('/dpp')) return 'marketplaces';
  if (p.includes('/recruitment')) return 'recruitment';
  if (p.includes('/factories') || p.includes('/dashboard')) return 'factories';
  if (p.includes('/cluster')) return 'observatory';
  return 'export-intelligence';
}

const ALL_MODULE_KEYS = Object.keys(MODULE_AI_CONFIGS) as ClusterModuleId[];

export function UniversalModuleAiCopilot({
  locale,
  explicitModuleId,
  contextSummary,
}: Props) {
  const pathname = usePathname() || '';
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const detectedModule = explicitModuleId || inferModuleFromPathname(pathname);

  const [selectedModule, setSelectedModule] = useState<ClusterModuleId>(
    detectedModule || 'export-intelligence'
  );
  const [preferredModel, setPreferredModel] = useState<ClientFreeLlmModelId>('auto');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);

  // Sync active module specialist whenever route changes
  useEffect(() => {
    if (explicitModuleId) {
      setSelectedModule(explicitModuleId);
    } else {
      const m = inferModuleFromPathname(pathname);
      if (m) {
        setSelectedModule(m);
        setReply(null);
        setAiImageUrl(null);
      }
    }
  }, [pathname, explicitModuleId]);

  if (!detectedModule && !explicitModuleId) return null;

  const cfg = MODULE_AI_CONFIGS[selectedModule] || MODULE_AI_CONFIGS['export-intelligence'];

  const runCopilot = async (overridePrompt?: string) => {
    const finalPrompt =
      (overridePrompt ?? customPrompt).trim() ||
      (isAr ? cfg.quickActions[0].promptAr : cfg.quickActions[0].promptEn);

    setLoading(true);
    setCustomPrompt(finalPrompt);

    try {
      const res = await fetch('/api/cluster/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModule,
          prompt: finalPrompt,
          contextSummary: contextSummary || `Active Route: ${pathname}`,
          preferredModel,
          locale,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setReply(data.reply);
        setModelUsed(data.modelUsed || preferredModel);
        setLatencyMs(data.latencyMs || 420);
      }
    } catch {
      // Handled gracefully
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFreeVisual = () => {
    const subject =
      customPrompt.trim() ||
      `${cfg.titleEn} El-Mahalla Egyptian cotton textile manufacturing studio high resolution`;
    const encoded = encodeURIComponent(
      `Industrial textile engineering diagram and realistic studio photograph of: ${subject.slice(
        0,
        140
      )}, El-Mahalla El-Kubra Egypt, luxury cotton, ISO laboratory, architectural lighting, 8k`
    );
    setAiImageUrl(
      `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=576&nologo=true&seed=${
        Date.now() % 10000
      }`
    );
  };

  const handleCopy = () => {
    if (!reply) return;
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    if (!reply) return;
    const blob = new Blob([reply], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahalla-ai-${selectedModule}-deliverable.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !reply) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const cleanText = reply.replace(/[#*`|>-]/g, ' ').slice(0, 1800);
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = isAr ? 'ar-EG' : 'en-US';
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const scrollToCopilot = () => {
    setExpanded(true);
    const el = document.getElementById('mahalla-universal-ai-copilot');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Floating Quick-Launch AI Specialist Pill */}
      <div className="fixed bottom-5 end-5 z-40 print:hidden">
        <button
          type="button"
          onClick={scrollToCopilot}
          className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400/60 bg-slate-950/95 px-4 py-2.5 text-xs font-extrabold text-white shadow-2xl hover:bg-emerald-950 transition cursor-pointer"
        >
          <Bot className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">{isAr ? cfg.badgeAr : cfg.badgeEn}</span>
          <span className="sm:hidden">{t('Free AI Copilot', 'المساعد الذكي')}</span>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] text-emerald-300">
            Free LLM
          </span>
        </button>
      </div>

      <section id="mahalla-universal-ai-copilot" className="container mx-auto px-4 py-6 print:hidden scroll-mt-20">
        <div className="rounded-3xl border-2 border-emerald-500/35 bg-gradient-to-br from-slate-950 via-emerald-950/90 to-slate-900 text-white shadow-xl overflow-hidden">
          {/* Top Header Bar */}
          <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/[0.03]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-300">
                <Bot className="h-3.5 w-3.5" />
                {isAr ? cfg.badgeAr : cfg.badgeEn}
              </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
              <Zap className="h-3 w-3" />
              {t(
                '100% Free Multi-LLM Engine (Llama 3.3 • DeepSeek R1 • Mistral • Qwen 2.5 • Gemini)',
                'محرك ذكاء اصطناعي مجاني متعدد النماذج (Llama 3.3 • DeepSeek R1 • Mistral • Qwen 2.5)'
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Free LLM Model Selector */}
            <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-slate-900/90 px-2.5 py-1">
              <Cpu className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <select
                value={preferredModel}
                onChange={(e) => setPreferredModel(e.target.value as ClientFreeLlmModelId)}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                aria-label="Select Free LLM Model"
              >
                {CLIENT_FREE_LLM_MODELS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                    {isAr ? m.labelAr : m.labelEn}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-semibold hover:bg-white/20 transition cursor-pointer"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  {t('Minimize', 'تصغير')}
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  {t('Expand AI Copilot', 'توسيع المساعد الذكي')}
                </>
              )}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="p-6 space-y-5">
            {/* Module Title + Module Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {isAr ? cfg.titleAr : cfg.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                  {isAr ? cfg.subtitleAr : cfg.subtitleEn}
                </p>
              </div>

              {/* Switch Across All 18 Platform Module AI Specialists */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-emerald-300">
                  {t('Active Specialist:', 'التخصص النشط:')}
                </span>
                <select
                  value={selectedModule}
                  onChange={(e) => {
                    setSelectedModule(e.target.value as ClusterModuleId);
                    setReply(null);
                  }}
                  className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer"
                >
                  {ALL_MODULE_KEYS.map((key) => {
                    const item = MODULE_AI_CONFIGS[key];
                    return (
                      <option key={key} value={key} className="bg-slate-900 text-white">
                        {isAr ? item.badgeAr : item.badgeEn}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* 4 One-Click Module-Specific Expert Tasks */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                {t(
                  '1-Click Expert LLM Workflows for This Module:',
                  'مهام الذكاء الاصطناعي التخصصية الجاهزة لهذه الوحدة بنقرة واحدة:'
                )}
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {cfg.quickActions.map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    disabled={loading}
                    onClick={() => runCopilot(isAr ? act.promptAr : act.promptEn)}
                    className="text-start rounded-2xl border border-white/15 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-400/50 p-3.5 transition group cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-extrabold text-amber-300 group-hover:text-emerald-200">
                          {isAr ? act.labelAr : act.labelEn}
                        </span>
                        <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {isAr ? act.promptAr : act.promptEn}
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-emerald-300">
                      {t('Execute with Free LLM →', 'تنفيذ عبر النموذج المجاني ←')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runCopilot();
              }}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={t(
                  `Ask the ${cfg.badgeEn} anything or customize the task above...`,
                  `اطرح أي سؤال أو اطلب حسابات أو عقود من (${cfg.badgeAr})...`
                )}
                className="flex-1 rounded-xl border border-white/20 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-3 text-xs sm:text-sm font-extrabold text-slate-950 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-60 transition cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  {loading
                    ? t('Synthesizing with Free LLM...', 'جارٍ التوليد عبر النموذج المجاني...')
                    : t('Run Expert AI', 'تشغيل الخبير الذكي')}
                </button>
                <button
                  type="button"
                  onClick={handleGenerateFreeVisual}
                  title={t(
                    'Generate Free AI Technical/Product Visual',
                    'توليد صورة أو مخطط بصري مجاني بالذكاء الاصطناعي'
                  )}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-3 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <ImageIcon className="h-4 w-4 text-amber-300" />
                  <span className="hidden md:inline">
                    {t('Free AI Visual', 'صورة ذكية مجانية')}
                  </span>
                </button>
              </div>
            </form>

            {/* Optional Free AI Generated Visual */}
            {aiImageUrl && (
              <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">
                    {t(
                      'Free AI Generated Industrial / Product Concept Visual',
                      'تصور بصري مولّد مجاناً بالذكاء الاصطناعي'
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAiImageUrl(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕ {t('Close', 'إغلاق')}
                  </button>
                </div>
                <img
                  src={aiImageUrl}
                  alt="AI Generated Textile Visual"
                  className="w-full max-h-80 object-cover rounded-xl border border-white/10"
                />
              </div>
            )}

            {/* Generated Deliverable Output */}
            {reply && (
              <div className="rounded-2xl border border-emerald-400/30 bg-background text-foreground p-6 space-y-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone="emerald">
                      <Cpu className="h-3 w-3 inline me-1" />
                      {modelUsed || preferredModel}
                    </Pill>
                    {latencyMs && (
                      <Pill tone="blue">
                        <Clock className="h-3 w-3 inline me-1" />
                        {latencyMs} ms
                      </Pill>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleSpeech}
                      className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold hover:bg-muted transition cursor-pointer"
                    >
                      {speaking ? (
                        <>
                          <VolumeX className="h-3.5 w-3.5 text-rose-500" />
                          {t('Stop Audio', 'إيقاف الصوت')}
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3.5 w-3.5 text-emerald-600" />
                          {t('Listen (TTS)', 'استماع صوتي')}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold hover:bg-muted transition cursor-pointer"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? t('Copied!', 'تم النسخ!') : t('Copy', 'نسخ')}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadMd}
                      className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold hover:bg-muted transition cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-blue-600" />
                      {t('Download .MD', 'تحميل .MD')}
                    </button>
                  </div>
                </div>

                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{reply}</ReactMarkdown>
                </div>

                {/* Cross-Module Action Bridges */}
                <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {t(
                      'Continue this workflow in connected AI studios:',
                      'استكمل هذا العمل في الاستوديوهات الذكية المترابطة:'
                    )}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(
                        customPrompt.slice(0, 100) || cfg.titleEn
                      )}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                      {t('Turn into Training Course', 'تحويل إلى دورة تدريبية')}
                    </Link>
                    <Link
                      href={`/${locale}/cluster/export-intelligence?product=${encodeURIComponent(
                        customPrompt.slice(0, 80) || 'Egyptian Cotton Textiles'
                      )}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border bg-muted/50 px-3 py-1.5 text-xs font-bold hover:bg-muted transition"
                    >
                      <Globe2 className="h-3.5 w-3.5 text-teal-600" />
                      {t('Analyze Export Market & Buyers', 'دراسة السوق والمشترين')}
                    </Link>
                    <Link
                      href={`/${locale}/cluster/brand-studio?topic=${encodeURIComponent(
                        customPrompt.slice(0, 80) || cfg.titleEn
                      )}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border bg-muted/50 px-3 py-1.5 text-xs font-bold hover:bg-muted transition"
                    >
                      <Palette className="h-3.5 w-3.5 text-amber-600" />
                      {t('Build Brand & Collateral', 'تصميم هوية ومطبوعات')}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
    </>
  );
}

export default UniversalModuleAiCopilot;
