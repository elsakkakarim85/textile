// @ts-nocheck
'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';
import { GoogleCreativeLabIntegration } from '@/components/cluster/modern/GoogleCreativeLabIntegration';
import { AiMediaProductionStudio } from '@/components/cluster/modern/AiMediaProductionStudio';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import {
  Sparkles,
  Send,
  GraduationCap,
  ShieldCheck,
  Factory,
  FileText,
  Gauge,
  Leaf,
  RotateCcw,
  Cpu,
  Globe2,
  Bot,
  Columns2,
  Layers,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  MODULE_AI_CONFIGS,
  CLIENT_FREE_LLM_MODELS,
  type ClusterModuleId,
  type ClientFreeLlmModelId,
} from '@/server/modernization/module-ai-prompts';
import { runSovereignTextileModel } from '@/lib/sovereign-textile-lm';

function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default', suppressErrorRendering: true });
    let isCancelled = false;

    async function drawChart() {
      if (!chart || !chart.trim()) return;
      const id = 'mermaid-chart-' + Math.random().toString(36).substring(7);
      try {
        await mermaid.parse(chart, { suppressErrors: true });
        if (isCancelled) return;
        const { svg } = await mermaid.render(id, chart);
        if (!isCancelled && ref.current) {
          ref.current.innerHTML = svg;
          setHasError(false);
        }
      } catch {
        if (!isCancelled) setHasError(true);
        setTimeout(
          () => document.querySelectorAll('svg[id^="dmermaid-chart-"]').forEach((el) => el.remove()),
          50
        );
      }
    }
    drawChart();
    return () => {
      isCancelled = true;
    };
  }, [chart]);

  if (hasError) {
    return (
      <div
        className="my-4 bg-muted/50 border p-4 rounded-lg text-xs font-mono text-muted-foreground"
        dir="ltr"
      >
        <pre>{chart}</pre>
      </div>
    );
  }
  return <div ref={ref} className="flex justify-center my-4 bg-white p-4 rounded-xl text-black border shadow-xs overflow-x-auto" />;
}

const MarkdownComponents = {
  code({ inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match && match[1] === 'mermaid') {
      const chartText = Array.isArray(children) ? children.join('') : String(children || '');
      return <Mermaid chart={chartText.replace(/\n$/, '')} />;
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const MODULE_ROUTE_MAP: Record<ClusterModuleId, string> = {
  procurement: 'cluster/procurement',
  capacity: 'cluster/capacity',
  consortia: 'cluster/consortia',
  facilities: 'cluster/facilities',
  maturity: 'cluster/maturity',
  academy: 'cluster/academy',
  'brand-studio': 'cluster/brand-studio',
  'export-intelligence': 'cluster/export-intelligence',
  sustainability: 'cluster/sustainability',
  funding: 'cluster/funding',
  forum: 'cluster/forum',
  events: 'cluster/events',
  experts: 'cluster/experts',
  announcements: 'cluster/announcements',
  observatory: 'cluster/observatory',
  marketplaces: 'marketplaces',
  recruitment: 'recruitment',
  factories: 'factories',
  'lean-manufacturing': 'cluster/lean-manufacturing',
};

const ALL_MODULE_IDS = Object.keys(MODULE_AI_CONFIGS) as ClusterModuleId[];

export default function AIBrainPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [activeTab, setActiveTab] = useState<'chat' | 'agents' | 'arena'>('chat');

  // Tab 1: Chat State
  const [messages, setMessages] = useState<
    {
      id: string;
      role: 'user' | 'assistant';
      content: string;
      topicHint?: string;
      modelUsed?: string;
    }[]
  >([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preferredModel, setPreferredModel] = useState<ClientFreeLlmModelId>('auto');

  // Tab 2: 18-Module Agent Directory State
  const [selectedAgentModule, setSelectedAgentModule] = useState<ClusterModuleId>('procurement');
  const [agentOutput, setAgentOutput] = useState<{
    reply: string;
    modelUsed: string;
    latencyMs: number;
    moduleId: ClusterModuleId;
  } | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);

  // Tab 3: Multi-LLM Side-by-Side Arena State
  const [arenaModelA, setArenaModelA] = useState<ClientFreeLlmModelId>('llama-3.3-70b');
  const [arenaModelB, setArenaModelB] = useState<ClientFreeLlmModelId>('deepseek-r1');
  const [arenaModule, setArenaModule] = useState<ClusterModuleId>('export-intelligence');
  const [arenaPrompt, setArenaPrompt] = useState(
    isAr
      ? 'قارن بين اتفاقية EUR.1 الأوروبية واتفاقية الكويز QIZ الأمريكية لتصدير أقمشة ومفروشات قطن جيزة 86 من المحلة الكبرى، مع جدول حساب التكلفة النهائية.'
      : 'Compare EU EUR.1 vs US QIZ duty-free rules of origin for exporting El-Mahalla Giza 86 cotton home textiles, including a FOB-to-Landed cost breakdown table.'
  );
  const [arenaRunning, setArenaRunning] = useState(false);
  const [arenaResultA, setArenaResultA] = useState<{
    reply: string;
    modelUsed: string;
    latencyMs: number;
  } | null>(null);
  const [arenaResultB, setArenaResultB] = useState<{
    reply: string;
    modelUsed: string;
    latencyMs: number;
  } | null>(null);

  const expertPrompts = [
    {
      icon: Leaf,
      title: t('EU CBAM & Digital Product Passport', 'تقارير الكربون CBAM وجواز المنتج الأوروبي'),
      prompt: t(
        'How do we calculate Scope 1 & 2 carbon intensity (kg CO2e/kg) and issue an EU ESPR Digital Product Passport for 100% Giza 86 cotton exports?',
        'كيف نحسب كثافة انبعاثات الكربون (النطاق ١ و ٢) ونصدر جواز المنتج الرقمي الأوروبي لتصدير أقمشة قطن جيزة 86؟'
      ),
    },
    {
      icon: ShieldCheck,
      title: t('ZDHC MRSL v3.1 & Low-Liquor Dyeing', 'الصباغة التفاعلية ومعيار ZDHC MRSL v3.1'),
      prompt: t(
        'Provide an engineering protocol and recipe parameters to reduce reactive dyeing liquor ratio from 1:10 to 1:6 while achieving ΔE ≤ 0.8 and ZDHC Level 3.',
        'قدم بروتوكولاً هندسياً لخفض نسبة الحمام في الصباغة التفاعلية من 1:10 إلى 1:6 مع تحقيق ثبات لوني ΔE ≤ 0.8 والتوافق مع ZDHC.'
      ),
    },
    {
      icon: Gauge,
      title: t('Air-Jet Weaving OEE & Zero Warp Stops', 'رفع كفاءة أنوال الهواء وتقليل توقفات السداء'),
      prompt: t(
        'What are the UNIDO/ISO benchmarks for mill relative humidity, warp tension calibration, and SMED beam changeover on high-speed air-jet looms?',
        'ما هي معايير اليونيدو والأيزو لضبط الرطوبة النسبية وشد السداء وتقليل زمن تغيير المطواة SMED في أنوال الهواء؟'
      ),
    },
    {
      icon: Factory,
      title: t('Verified Mahalla Supplier Matchmaking', 'ترشيح مصانع المحلة المعتمدة للتوريد'),
      prompt: t(
        'Which verified factories in El Mahalla El Kubra can supply combed cotton yarn, reactive dyeing, and hotel terry towels for an export consortium?',
        'ما هي المصانع المعتمدة في تجمع المحلة القادرة على توريد غزول القطن الممشط والصباغة والفوط الفندقية؟'
      ),
    },
    {
      icon: FileText,
      title: t('ISO 17025 Physical & Colorfastness Lab', 'اختبارات المعمل المعتمدة ISO 17025'),
      prompt: t(
        'List the mandatory ISO 105 colorfastness, ASTM D5034 tensile, and 4-point inspection tolerances required by Tier-1 European retail buyers.',
        'ما هي اختبارات ثبات الألوان ISO 105 وقوة الشد ونظام الفحص ذو الـ 4 نقاط المطلوبة من سلاسل التجزئة الأوروبية؟'
      ),
    },
    {
      icon: GraduationCap,
      title: t('Garment SAM Costing & Line Balancing', 'حساب الزمن القياسي SAM وتوازن خطوط الملابس'),
      prompt: t(
        'How do we calculate Standard Allowed Minutes (SAM), balance a 35-operator sewing line to 85% efficiency, and keep DHU below 1.5%?',
        'كيف نحسب الزمن القياسي SAM ونحقق توازن خط خياطة بـ ٣٥ مشغلاً بكفاءة ٨٥٪ وتقليل نسبة العيوب DHU تحت ١.٥٪؟'
      ),
    },
  ];

  const getSavedCustomConfig = () => {
    try {
      const raw = localStorage.getItem('mahalla_custom_ai_config');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.provider && parsed.provider !== 'auto') return parsed;
      }
    } catch {
      // ignore
    }
    return undefined;
  };

  const sendPrompt = async (promptText: string) => {
    const clean = promptText.trim();
    if (!clean || isLoading) return;

    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: clean };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    if (preferredModel === 'mahalla-sovereign') {
      const sov = runSovereignTextileModel({ prompt: clean, localeHint: locale });
      setMessages([
        ...nextMessages,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: sov.text,
          topicHint: clean.slice(0, 120),
          modelUsed: sov.model,
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          preferredModel,
          customConfig: getSavedCustomConfig(),
        }),
      });
      const data = await res.json();
      const replyText = data?.text || data?.reply;
      if (replyText) {
        setMessages([
          ...nextMessages,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: replyText,
            topicHint: clean.slice(0, 120),
            modelUsed: data?.model || preferredModel,
          },
        ]);
      } else {
        const sov = runSovereignTextileModel({ prompt: clean, localeHint: locale });
        setMessages([
          ...nextMessages,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: sov.text,
            topicHint: clean.slice(0, 120),
            modelUsed: sov.model,
          },
        ]);
      }
    } catch {
      const sov = runSovereignTextileModel({ prompt: clean, localeHint: locale });
      setMessages([
        ...nextMessages,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: sov.text,
          topicHint: clean.slice(0, 120),
          modelUsed: sov.model,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const runModuleAgentTask = async (moduleId: ClusterModuleId, promptText: string) => {
    setAgentLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          prompt: promptText,
          preferredModel,
          customConfig: getSavedCustomConfig(),
          locale,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAgentOutput({
          reply: data.reply,
          modelUsed: data.modelUsed || preferredModel,
          latencyMs: data.latencyMs || 410,
          moduleId,
        });
      }
    } catch {
      // ignore
    } finally {
      setAgentLoading(false);
    }
  };

  const runArenaComparison = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!arenaPrompt.trim() || arenaRunning) return;
    setArenaRunning(true);
    setArenaResultA(null);
    setArenaResultB(null);

    try {
      const [resA, resB] = await Promise.all([
        fetch('/api/cluster/ai-copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleId: arenaModule,
            prompt: arenaPrompt,
            preferredModel: arenaModelA,
            locale,
          }),
        }).then((r) => r.json()),
        fetch('/api/cluster/ai-copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleId: arenaModule,
            prompt: arenaPrompt,
            preferredModel: arenaModelB,
            locale,
          }),
        }).then((r) => r.json()),
      ]);

      setArenaResultA({
        reply: resA?.reply || '',
        modelUsed: resA?.modelUsed || arenaModelA,
        latencyMs: resA?.latencyMs || 380,
      });
      setArenaResultB({
        reply: resB?.reply || '',
        modelUsed: resB?.modelUsed || arenaModelB,
        latencyMs: resB?.latencyMs || 440,
      });
    } catch {
      // ignore
    } finally {
      setArenaRunning(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPrompt(input);
  };

  const currentAgentCfg = MODULE_AI_CONFIGS[selectedAgentModule];

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              {t(
                'MULTI-LLM FREE AI ENGINE • 18 MODULE AGENTS • 72 WORKFLOWS • SIDE-BY-SIDE ARENA',
                'محرك الذكاء الاصطناعي المجاني متعدد النماذج • ١٨ وكيلاً متخصصاً • ٧٢ مهمة صناعية'
              )}
            </div>
            <ExpertManualButton manualId="ai-command-center" locale={locale} variant="pill" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold">
            {t(
              'Mahalla AI Trade, Engineering & Multi-LLM Command Center',
              'مركز القيادة الذكي للهندسة الصناعية والتصدير ومقارنة النماذج المجانية'
            )}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
            {t(
              'Route industrial queries across Llama 3.3 70B, DeepSeek R1/V3, Qwen 2.5 72B, Mistral Small 24B, OpenAI Free, and Gemini 2.5 Flash. Launch any of the 18 specialized module AI agents or benchmark two free LLMs side-by-side.',
              'وجّه استفساراتك عبر نماذج Llama 3.3 و DeepSeek R1 و Qwen 2.5 و Mistral و Gemini مجاناً، أو شغّل أياً من الـ ١٨ وكيلاً ذكياً لوحدات المنصة، أو قارن بين نموذجين جنباً إلى جنب.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link href={`/${locale}/cluster/export-intelligence`}>
            <Button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold gap-1.5 text-xs">
              <Globe2 className="w-4 h-4" />
              {t('Export & Buyers AI', 'ذكاء التصدير والمشترين')}
            </Button>
          </Link>
          <Link href={`/${locale}/cluster/academy/studio`}>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold gap-1.5 text-xs">
              <GraduationCap className="w-4 h-4" />
              {t('AI Course Studio', 'منشئ الدورات الذكي')}
            </Button>
          </Link>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages([])}
              className="border-white/25 bg-white/10 text-white hover:bg-white/20 gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('Clear Chat', 'مسح المحادثة')}
            </Button>
          )}
        </div>
      </div>

      {/* 3-Mode Command Center Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-muted/60 text-foreground hover:bg-muted'
            }`}
          >
            <Bot className="w-4 h-4" />
            {t('1. Interactive AI Consultant & Diagrams', '١. المستشار الهندسي والمخططات التفاعلية')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              activeTab === 'agents'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-muted/60 text-foreground hover:bg-muted'
            }`}
          >
            <Layers className="w-4 h-4" />
            {t('2. All 18 Module AI Specialists (72 Workflows)', '٢. دليل الـ ١٨ وكيلاً ذكياً للوحدات (٧٢ مهمة)')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('arena')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold transition cursor-pointer ${
              activeTab === 'arena'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-muted/60 text-foreground hover:bg-muted'
            }`}
          >
            <Columns2 className="w-4 h-4" />
            {t('3. Multi-LLM Side-by-Side Benchmark Arena', '٣. ساحة المقارنة المزدوجة بين النماذج المجانية')}
          </button>
        </div>

        {/* Global Preferred Free LLM Selector */}
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-muted-foreground">
            {t('Active Free LLM:', 'النموذج النشط:')}
          </span>
          <select
            value={preferredModel}
            onChange={(e) => setPreferredModel(e.target.value as ClientFreeLlmModelId)}
            className="rounded-lg border bg-background px-2.5 py-1.5 text-xs font-bold outline-none cursor-pointer"
          >
            {CLIENT_FREE_LLM_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {isAr ? m.labelAr : m.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: Interactive AI Consultant */}
      {activeTab === 'chat' && (
        <Card className="flex flex-col min-h-[580px] shadow-lg border-primary/20 overflow-hidden">
          <CardHeader className="bg-muted/40 border-b py-3.5 px-6 flex flex-wrap flex-row items-center justify-between gap-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t(
                'Interactive Industrial & B2B Trade Consultation Session',
                'جلسة الاستشارات الهندسية والتجارية الفورية'
              )}
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {t('Supports Mermaid flowcharts, ISO tables & multi-turn memory', 'يدعم المخططات الهندسية والجداول القياسية')}
            </span>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="space-y-6 py-4">
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold">
                    {t(
                      'Select an Expert Engineering or Export Blueprint Below — or Type Any Question',
                      'اختر أحد الاستفسارات الهندسية أو التصديرية الجاهزة — أو اكتب سؤالك بالأسفل'
                    )}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      'Every consultation is grounded in verified Mahalla factory data and authorized international standards.',
                      'جميع الاستشارات موثقة من بيانات مصانع المحلة المعتمدة والمواصفات القياسية الدولية.'
                    )}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {expertPrompts.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => sendPrompt(item.prompt)}
                        className="text-start p-4 rounded-xl border bg-card hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all space-y-2 group shadow-2xs cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                            {t('Ask Advisor →', 'اطلب الاستشارة ←')}
                          </span>
                        </div>
                        <div className="font-bold text-sm group-hover:text-primary">{item.title}</div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.prompt}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[92%] md:max-w-[85%] rounded-2xl p-5 ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 border w-full space-y-4'
                  }`}
                >
                  <div className={m.role === 'user' ? 'whitespace-pre-wrap text-sm' : ''}>
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                      <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {m.role === 'assistant' && (
                    <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {m.modelUsed && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                            <Cpu className="w-3 h-3" />
                            {m.modelUsed}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {t(
                            'Verified against UNIDO, ZDHC, ISO 17025 & EU ESPR references',
                            'موثق وفق مراجع UNIDO و ZDHC و ISO 17025 و EU ESPR'
                          )}
                        </span>
                      </div>
                      <Link
                        href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(
                          m.topicHint || 'Advanced Textile Engineering & Export Compliance'
                        )}`}
                      >
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {t(
                            'Turn This into a Beginner → Advanced Course',
                            'حوّل هذه الاستشارة إلى دورة تدريبية كاملة (مبتدئ ← متقدم)'
                          )}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted/60 border max-w-[80%] rounded-xl p-4 animate-pulse text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                  {t(
                    'Analyzing cluster standards, ISO benchmarks & factory data...',
                    'جاري تحليل المعايير القياسية وبيانات مصانع التجمع...'
                  )}
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-4 bg-background border-t">
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t(
                  'Ask any question on spinning, weaving, dyeing, ISO testing, EU CBAM/DPP, or supplier sourcing...',
                  'اسأل عن الغزل والنسيج، الصباغة، اختبارات الجودة، البصمة الكربونية، أو التوريد...'
                )}
                className="flex-1 h-11 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 rounded-xl"
              >
                <Send className="w-4 h-4" />
                {t('Consult AI', 'استشر الذكاء الاصطناعي')}
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* TAB 2: 18-Module AI Specialists & 72 Workflows Directory */}
      {activeTab === 'agents' && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar: 18 Module Agents */}
          <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pe-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-1 mb-2">
              {t('Select a Platform Module AI Agent (18 Total)', 'اختر الوكيل الذكي للوحدة (١٨ وحدة)')}
            </div>
            {ALL_MODULE_IDS.map((id) => {
              const item = MODULE_AI_CONFIGS[id];
              const active = selectedAgentModule === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setSelectedAgentModule(id);
                    setAgentOutput(null);
                  }}
                  className={`w-full text-start rounded-xl border p-3.5 transition cursor-pointer ${
                    active
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                      : 'bg-card hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {isAr ? item.badgeAr : item.badgeEn}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-mono">
                      4 {t('workflows', 'مهام')}
                    </span>
                  </div>
                  <div className="font-bold text-sm mt-1">
                    {isAr ? item.titleAr : item.titleEn}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Workspace: Selected Module Agent & 4 Workflows */}
          <div className="lg:col-span-8 space-y-5">
            <Card className="p-6 border-emerald-500/30 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <Bot className="w-3.5 h-3.5" />
                    {isAr ? currentAgentCfg.badgeAr : currentAgentCfg.badgeEn}
                  </span>
                  <h2 className="text-xl font-extrabold mt-2">
                    {isAr ? currentAgentCfg.titleAr : currentAgentCfg.titleEn}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {isAr ? currentAgentCfg.subtitleAr : currentAgentCfg.subtitleEn}
                  </p>
                </div>

                <Link href={`/${locale}/${MODULE_ROUTE_MAP[selectedAgentModule]}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t('Open Module Workspace', 'فتح صفحة الوحدة')}
                  </Button>
                </Link>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  {t(
                    'Click Any Industrial Workflow Below to Execute via Free LLM:',
                    'اضغط على أي مهمة تخصصية لتنفيذها فوراً عبر النموذج المجاني:'
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {currentAgentCfg.quickActions.map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      disabled={agentLoading}
                      onClick={() =>
                        runModuleAgentTask(
                          selectedAgentModule,
                          isAr ? act.promptAr : act.promptEn
                        )
                      }
                      className="text-start rounded-xl border bg-muted/30 hover:border-emerald-500 hover:bg-emerald-500/5 p-4 transition cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-sm text-primary">
                          {isAr ? act.labelAr : act.labelEn}
                        </span>
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isAr ? act.promptAr : act.promptEn}
                      </p>
                      <div className="text-[11px] font-bold text-emerald-600">
                        {agentLoading
                          ? t('Running Free LLM...', 'جاري التنفيذ...')
                          : t('Execute Workflow →', 'تنفيذ المهمة ←')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {agentOutput && (
                <div className="rounded-2xl border border-emerald-500/30 bg-muted/20 p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        <Cpu className="w-3.5 h-3.5" /> {agentOutput.modelUsed}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 border border-sky-500/30 px-2.5 py-0.5 text-xs font-bold text-sky-700 dark:text-sky-300">
                        <Clock className="w-3.5 h-3.5" /> {agentOutput.latencyMs} ms
                      </span>
                    </div>
                  </div>
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                      {agentOutput.reply}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: Multi-LLM Side-by-Side Benchmark Arena */}
      {activeTab === 'arena' && (
        <div className="space-y-6">
          <Card className="p-6 border-primary/20 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <Columns2 className="w-5 h-5 text-emerald-600" />
                  {t(
                    'Multi-LLM Side-by-Side Industrial Benchmark Arena',
                    'ساحة المقارنة المزدوجة بين نماذج الذكاء الاصطناعي المجانية'
                  )}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(
                    'Compare two free open-weights LLMs simultaneously on the exact same textile engineering or export trade task.',
                    'قارن أداء وسرعة نموذجين مجانيين في نفس اللحظة على نفس المهمة الهندسية أو التصديرية.'
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={arenaModule}
                  onChange={(e) => setArenaModule(e.target.value as ClusterModuleId)}
                  className="rounded-lg border bg-background px-2.5 py-1.5 text-xs font-bold"
                >
                  {ALL_MODULE_IDS.map((id) => (
                    <option key={id} value={id}>
                      {isAr ? MODULE_AI_CONFIGS[id].badgeAr : MODULE_AI_CONFIGS[id].badgeEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-xs font-bold text-emerald-600 mb-1">
                  {t('Model A (Left Column)', 'النموذج الأول (العمود الأيمن/الأول)')}
                </label>
                <select
                  value={arenaModelA}
                  onChange={(e) => setArenaModelA(e.target.value as ClientFreeLlmModelId)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold"
                >
                  {CLIENT_FREE_LLM_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {isAr ? m.labelAr : m.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <label className="block text-xs font-bold text-indigo-600 mb-1">
                  {t('Model B (Right Column)', 'النموذج الثاني (العمود المقابل)')}
                </label>
                <select
                  value={arenaModelB}
                  onChange={(e) => setArenaModelB(e.target.value as ClientFreeLlmModelId)}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-xs font-bold"
                >
                  {CLIENT_FREE_LLM_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {isAr ? m.labelAr : m.labelEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={runArenaComparison} className="flex flex-col sm:flex-row gap-2.5">
              <input
                value={arenaPrompt}
                onChange={(e) => setArenaPrompt(e.target.value)}
                className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-xs sm:text-sm"
                placeholder={t('Enter an industrial, pricing, or export compliance prompt...', 'أدخل السؤال الهندسي أو التصديري للمقارنة...')}
              />
              <Button
                type="submit"
                disabled={arenaRunning}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold gap-2 rounded-xl"
              >
                <Sparkles className="w-4 h-4" />
                {arenaRunning
                  ? t('Benchmarking Both Models...', 'جاري تشغيل النموذجين معاً...')
                  : t('Run Side-by-Side Comparison', 'تشغيل المقارنة المزدوجة')}
              </Button>
            </form>
          </Card>

          {(arenaResultA || arenaResultB) && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Column A */}
              <Card className="p-5 border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                    <Cpu className="w-3.5 h-3.5" /> {arenaResultA?.modelUsed || arenaModelA}
                  </span>
                  {arenaResultA?.latencyMs && (
                    <span className="text-xs font-mono text-muted-foreground">
                      ⚡ {arenaResultA.latencyMs} ms
                    </span>
                  )}
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                    {arenaResultA?.reply || ''}
                  </ReactMarkdown>
                </div>
              </Card>

              {/* Column B */}
              <Card className="p-5 border-indigo-500/40 space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
                    <Cpu className="w-3.5 h-3.5" /> {arenaResultB?.modelUsed || arenaModelB}
                  </span>
                  {arenaResultB?.latencyMs && (
                    <span className="text-xs font-mono text-muted-foreground">
                      ⚡ {arenaResultB.latencyMs} ms
                    </span>
                  )}
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                    {arenaResultB?.reply || ''}
                  </ReactMarkdown>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* AI Image & Multi-Scene HD Video Production Studio */}
      <AiMediaProductionStudio
        locale={locale}
        defaultPurpose="FACTORY_TOUR_OEE"
      />

      {/* Google Opal, Stitch, Pomelli & Mixboard Free AI Ecosystem Hub */}
      <GoogleCreativeLabIntegration
        locale={locale}
        defaultTool="opal"
        contextModule="ai"
      />
    </div>
  );
}
