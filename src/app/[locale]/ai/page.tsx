// @ts-nocheck
'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import {
  CLIENT_FREE_LLM_MODELS,
  type ClientFreeLlmModelId,
} from '@/server/modernization/module-ai-prompts';

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

export default function AIBrainPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

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

  const sendPrompt = async (promptText: string) => {
    const clean = promptText.trim();
    if (!clean || isLoading) return;

    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: clean };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, preferredModel }),
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPrompt(input);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            {t(
              'MULTI-LLM FREE AI ENGINE • LLAMA 3.3 70B • DEEPSEEK R1 • MISTRAL • QWEN 2.5 • GEMINI',
              'محرك الذكاء الاصطناعي المجاني متعدد النماذج (Llama 3.3 • DeepSeek R1 • Mistral • Qwen 2.5)'
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold">
            {t(
              'Mahalla AI Trade, Engineering & Standards Command Center',
              'مركز القيادة الذكي للهندسة الصناعية والتصدير والمعايير الدولية'
            )}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-3xl">
            {t(
              'Select your preferred free LLM model below and ask any technical, sourcing, chemical compliance, or export regulation question. Includes live Mermaid process diagrams, ISO/ASTM benchmark tables, and 18 specialized module AI agents.',
              'اختر نموذج الذكاء الاصطناعي المجاني المفضل لديك واطرح أي سؤال في الغزل والنسيج أو الصباغة أو التصدير الأوروبي أو ترشيح المصانع، مع ١٨ وكيلاً ذكياً متخصصاً لجميع وحدات المنصة.'
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
              {t('New Consultation', 'استشارة جديدة')}
            </Button>
          )}
        </div>
      </div>

      <Card className="flex flex-col min-h-[580px] shadow-lg border-primary/20 overflow-hidden">
        <CardHeader className="bg-muted/40 border-b py-3.5 px-6 flex flex-wrap flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t(
              'Interactive Industrial & B2B Trade Consultation Session',
              'جلسة الاستشارات الهندسية والتجارية الفورية'
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-muted-foreground">
              {t('Free LLM Engine:', 'النموذج المجاني:')}
            </span>
            <select
              value={preferredModel}
              onChange={(e) => setPreferredModel(e.target.value as ClientFreeLlmModelId)}
              className="rounded-lg border bg-background px-2.5 py-1 text-xs font-bold outline-none cursor-pointer"
            >
              {CLIENT_FREE_LLM_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {isAr ? m.labelAr : m.labelEn}
                </option>
              ))}
            </select>
          </div>
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
                      className="text-start p-4 rounded-xl border bg-card hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all space-y-2 group shadow-2xs"
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
    </div>
  );
}
