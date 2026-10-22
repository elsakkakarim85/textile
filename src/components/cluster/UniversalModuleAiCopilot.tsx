'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  RefreshCw,
  Film,
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { Pill } from '@/components/cluster/ui';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';
import {
  MODULE_AI_CONFIGS,
  CLIENT_FREE_LLM_MODELS,
  type ClusterModuleId,
  type ClientFreeLlmModelId,
} from '@/server/modernization/module-ai-prompts';
import {
  renderSovereignVisualToCanvas,
  type SovereignVisualMode,
} from '@/lib/sovereign-visual-model';
import { runSovereignTextileModel } from '@/lib/sovereign-textile-lm';

interface Props {
  locale: string;
  explicitModuleId?: ClusterModuleId;
  contextSummary?: string;
}

function inferModuleFromPathname(pathname: string): ClusterModuleId | null {
  const p = pathname.toLowerCase();
  if (p.includes('/sign-in') || p.includes('/sign-up')) return null;
  if (p.includes('/cluster/lean-manufacturing')) return 'lean-manufacturing';
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

const MODULE_STUDIO_BACKDROPS: {
  url: string;
  lensEn: string;
  lensAr: string;
  primaryHex: string;
  accentHex: string;
  kpisEn: string[];
  kpisAr: string[];
}[] = [
  {
    url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1280&q=85',
    lensEn: '35mm Cinema Prime • Automated Weaving & Spinning Hall',
    lensAr: 'عدسة 35mm سينمائية • صالة الغزل والنسيج الأوتوماتيكية',
    primaryHex: '#064E3B',
    accentHex: '#10B981',
    kpisEn: ['ISO 9001 & SMETA 4-Pillar Audited', 'Loom OEE 88.4% • Cpk 1.48', 'Uster® 5% Giza 86/94 Yarn', '0% Duty EUR.1 & QIZ Ready'],
    kpisAr: ['معتمد أيزو 9001 و SMETA', 'كفاءة الماكينات OEE 88.4%', 'غزل قطن جيزة 86/94 (Uster 5%)', 'إعفاء جمركي 0% EUR.1 و QIZ'],
  },
  {
    url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1280&q=85',
    lensEn: '100mm f/2.8 Macro • Combed Egyptian Cotton Weave & Swatches',
    lensAr: 'عدسة ماكرو 100mm • تفاصيل النسج وعينات القطن المصري الممشط',
    primaryHex: '#0F172A',
    accentHex: '#F59E0B',
    kpisEn: ['CMC ΔE ≤ 0.5 Shade Continuity', 'ISO 17025 Lab Tested', 'OEKO-TEX® Standard 100 Class I', 'EU ESPR Digital Product Passport'],
    kpisAr: ['تطابق لوني بالمطياف ΔE ≤ 0.5', 'فحص معمل معتمد ISO 17025', 'شهادة OEKO-TEX Standard 100', 'جواز المنتج الرقمي الأوروبي DPP'],
  },
  {
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1280&q=85',
    lensEn: '50mm Studio Key Light • Luxury Export Textile Presentation',
    lensAr: 'إضاءة استوديو 50mm • عرض منتجات التصدير الفندقية والمنسوجات',
    primaryHex: '#1E1B4B',
    accentHex: '#38BDF8',
    kpisEn: ['300–600 TC Combed Sateen & Terry', '98.4% Right-First-Time (RFT)', 'ZDHC MRSL v3.1 Level 3', '48h DHL Physical Swatch Dispatch'],
    kpisAr: ['ساتان وفوط فندقية 300–600 غرزة', 'مطابقة من المرة الأولى 98.4%', 'صباغة مستدامة ZDHC Level 3', 'إرسال عينات DHL خلال 48 ساعة'],
  },
  {
    url: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1280&q=85',
    lensEn: '24mm Architectural Wide • Quality Lab & Export Packaging Hub',
    lensAr: 'عدسة 24mm واسعة • معمل مراقبة الجودة وتجهيز شحنات التصدير',
    primaryHex: '#134E4A',
    accentHex: '#FBBF24',
    kpisEn: ['4-Point ASTM Inspection ≤ 12 pts', '70% Closed-Loop ZLD Water Recovery', 'Smart Milestone Escrow 30/40/30', 'SHA-256 Cryptographic Traceability'],
    kpisAr: ['فحص الجودة الرباعي ASTM ممتاز', 'تدوير مياه الصباغة بنسبة 70%', 'حماية الدفعات عبر الضمان البنكي', 'تتبع رقمي مشفر SHA-256'],
  },
];

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
  const [showVisualStudio, setShowVisualStudio] = useState(false);
  const [visualVariantIdx, setVisualVariantIdx] = useState(0);
  const [sovereignVisualMode, setSovereignVisualMode] = useState<
    SovereignVisualMode | 'studio-photo'
  >('weave-physics');
  const [showCustomAiSettings, setShowCustomAiSettings] = useState(false);
  const [customProvider, setCustomProvider] = useState<
    'auto' | 'sovereign' | 'groq' | 'gemini' | 'openrouter' | 'huggingface' | 'ollama'
  >('auto');
  const [customApiKey, setCustomApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('http://localhost:11434/v1');
  const [customModelName, setCustomModelName] = useState('');
  const visualCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedBackdropRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mahalla_custom_ai_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.provider) setCustomProvider(parsed.provider);
        if (parsed.apiKey) setCustomApiKey(parsed.apiKey);
        if (parsed.baseUrl) setCustomBaseUrl(parsed.baseUrl);
        if (parsed.modelName) setCustomModelName(parsed.modelName);
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  const saveCustomAiSettings = () => {
    try {
      localStorage.setItem(
        'mahalla_custom_ai_config',
        JSON.stringify({
          provider: customProvider,
          apiKey: customApiKey,
          baseUrl: customBaseUrl,
          modelName: customModelName,
        })
      );
      setShowCustomAiSettings(false);
    } catch {
      // Ignore storage error
    }
  };

  // Sync active module specialist whenever route changes
  useEffect(() => {
    if (explicitModuleId) {
      setSelectedModule(explicitModuleId);
    } else {
      const m = inferModuleFromPathname(pathname);
      if (m) {
        setSelectedModule(m);
        setReply(null);
        setShowVisualStudio(false);
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
    const t0 = Date.now();

    // Instant client-side execution if user selected Built-From-Scratch Sovereign Engine
    if (preferredModel === 'mahalla-sovereign' || customProvider === 'sovereign') {
      const sov = runSovereignTextileModel({
        prompt: finalPrompt,
        systemContext: cfg.systemPrompt,
        localeHint: locale,
      });
      setReply(
        isAr
          ? `> **الوحدة المتخصصة النشطة:** ${cfg.badgeAr} — *${cfg.titleAr}*\n\n${sov.text}`
          : `> **Active Specialist Module:** ${cfg.badgeEn} — *${cfg.titleEn}*\n\n${sov.text}`
      );
      setModelUsed(sov.model);
      setLatencyMs(Math.max(4, Date.now() - t0));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/cluster/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: selectedModule,
          prompt: finalPrompt,
          contextSummary: contextSummary || `Active Route: ${pathname}`,
          preferredModel,
          customConfig:
            customProvider !== 'auto'
              ? {
                  provider: customProvider,
                  apiKey: customApiKey || undefined,
                  baseUrl: customBaseUrl || undefined,
                  modelName: customModelName || undefined,
                }
              : undefined,
          locale,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setReply(data.reply);
        setModelUsed(data.modelUsed || preferredModel);
        setLatencyMs(data.latencyMs || 420);
      } else {
        const sov = runSovereignTextileModel({
          prompt: finalPrompt,
          systemContext: cfg.systemPrompt,
          localeHint: locale,
        });
        setReply(sov.text);
        setModelUsed(sov.model);
        setLatencyMs(Date.now() - t0);
      }
    } catch {
      const sov = runSovereignTextileModel({
        prompt: finalPrompt,
        systemContext: cfg.systemPrompt,
        localeHint: locale,
      });
      setReply(sov.text);
      setModelUsed(sov.model);
      setLatencyMs(Date.now() - t0);
    } finally {
      setLoading(false);
    }
  };

  const renderVisualCanvas = useCallback(
    (variantIndex: number) => {
      const canvas = visualCanvasRef.current;
      if (!canvas) return;

      if (sovereignVisualMode !== 'studio-photo') {
        renderSovereignVisualToCanvas({
          canvas,
          prompt:
            customPrompt.trim() ||
            (isAr ? cfg.quickActions[0].promptAr : cfg.quickActions[0].promptEn),
          moduleBadge: isAr ? cfg.badgeAr : cfg.badgeEn,
          locale,
          mode: sovereignVisualMode,
        });
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const theme = MODULE_STUDIO_BACKDROPS[variantIndex % MODULE_STUDIO_BACKDROPS.length];

      // 1. Base Gradient
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, theme.primaryHex);
      bg.addColorStop(0.55, '#090D16');
      bg.addColorStop(1, '#0F172A');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Photorealistic Backdrop if loaded
      const cached = loadedBackdropRef.current[theme.url];
      if (cached && cached.complete && cached.naturalWidth > 0) {
        ctx.save();
        ctx.drawImage(cached, 0, 0, w, h);
        ctx.restore();

        const vig = ctx.createLinearGradient(0, 0, w, h);
        vig.addColorStop(0, 'rgba(6, 15, 28, 0.86)');
        vig.addColorStop(0.5, 'rgba(6, 15, 28, 0.58)');
        vig.addColorStop(1, 'rgba(6, 15, 28, 0.92)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);
      }

      // 3. Precision Engineering Micro-Weave & Blueprint Grid Overlay
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.065)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Top Header Bar (Module Specialist + Lens Spec)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
      ctx.beginPath();
      ctx.roundRect(36, 28, w - 72, 56, 14);
      ctx.fill();
      ctx.strokeStyle = `${theme.accentHex}88`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = theme.accentHex;
      ctx.beginPath();
      ctx.arc(64, 56, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'left';
      const modBadge = isAr ? cfg.badgeAr : cfg.badgeEn;
      ctx.fillText(modBadge.slice(0, 52), 84, 62);

      const lensLabel = isAr ? theme.lensAr : theme.lensEn;
      ctx.fillStyle = '#6EE7B7';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`📷 ${lensLabel}`, w - 56, 61);

      // 5. Center Visual Subject & Prompt Synthesis Card
      const subjectText =
        customPrompt.trim() || (isAr ? cfg.titleAr : cfg.titleEn);
      const subText = isAr ? cfg.subtitleAr : cfg.subtitleEn;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.beginPath();
      ctx.roundRect(36, 110, w - 72, 195, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.stroke();

      ctx.fillStyle = theme.accentHex;
      ctx.beginPath();
      ctx.roundRect(36, 110, 10, 195, [18, 0, 0, 18]);
      ctx.fill();

      ctx.fillStyle = theme.accentHex;
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        isAr
          ? 'EL-MAHALLA INDUSTRIAL AI STUDIO • ZERO-RATE-LIMIT HD RENDER'
          : 'EL-MAHALLA INDUSTRIAL AI STUDIO • ZERO-RATE-LIMIT HD RENDER',
        66,
        144
      );

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(subjectText.slice(0, 62), 66, 184);
      if (subjectText.length > 62) {
        ctx.font = 'bold 21px sans-serif';
        ctx.fillText(subjectText.slice(62, 128), 66, 216);
      }

      ctx.fillStyle = '#CBD5E1';
      ctx.font = '15px sans-serif';
      ctx.fillText(subText.slice(0, 92), 66, 256);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(
        '✔ UNIDO / TIGARA VERIFIED   •   ✔ ISO 17025 LAB   •   ✔ OEKO-TEX® 100   •   ✔ EU ESPR DPP',
        66,
        286
      );

      // 6. 4 Engineering & Commercial KPI Callout Cards at Bottom
      const kpis = isAr ? theme.kpisAr : theme.kpisEn;
      const cardGap = 16;
      const cardW = Math.floor((w - 72 - cardGap * 3) / 4);
      const cardY = 330;
      const cardH = 148;

      kpis.forEach((kpi, idx) => {
        const cx = 36 + idx * (cardW + cardGap);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(cx, cardY, cardW, cardH, 14);
        ctx.fill();
        ctx.strokeStyle = idx === 0 ? theme.accentHex : 'rgba(255,255,255,0.18)';
        ctx.lineWidth = idx === 0 ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = theme.accentHex;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`PILLAR 0${idx + 1}`, cx + 18, cardY + 32);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(kpi.slice(0, 26), cx + 18, cardY + 68);
        if (kpi.length > 26) {
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(kpi.slice(26, 54), cx + 18, cardY + 92);
        }

        // Mini progress/tolerance bar
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillRect(cx + 18, cardY + cardH - 26, cardW - 36, 6);
        ctx.fillStyle = '#10B981';
        ctx.fillRect(cx + 18, cardY + cardH - 26, Math.round((cardW - 36) * (0.85 + idx * 0.04)), 6);
      });

      // 7. Bottom Spectrophotometer Pantone TCX & Signature Bar
      ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
      ctx.fillRect(0, h - 42, w, 42);
      const swatches = [theme.primaryHex, theme.accentHex, '#0284C7', '#10B981', '#F8FAFC'];
      swatches.forEach((hex, i) => {
        ctx.fillStyle = hex;
        ctx.fillRect(36 + i * 34, h - 30, 24, 18);
      });
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        'mahalla-cluster-app.vercel.app • AI Industrial Visual & Blueprint Synthesizer (1280×540 HD)',
        w - 36,
        h - 16
      );
    },
    [cfg, customPrompt, isAr, locale, sovereignVisualMode]
  );

  useEffect(() => {
    if (!showVisualStudio) return;
    const theme = MODULE_STUDIO_BACKDROPS[visualVariantIdx % MODULE_STUDIO_BACKDROPS.length];
    renderVisualCanvas(visualVariantIdx);

    if (sovereignVisualMode === 'studio-photo' && !loadedBackdropRef.current[theme.url]) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = theme.url;
      img.onload = () => {
        loadedBackdropRef.current[theme.url] = img;
        renderVisualCanvas(visualVariantIdx);
      };
    }
  }, [showVisualStudio, visualVariantIdx, sovereignVisualMode, renderVisualCanvas]);

  const handleGenerateFreeVisual = () => {
    setShowVisualStudio(true);
    setVisualVariantIdx((prev) => prev + 1);
  };

  const handleDownloadVisualPng = () => {
    const canvas = visualCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `mahalla-ai-${selectedModule}-visual.png`;
    a.click();
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
      <div className="fixed bottom-5 end-5 z-40 flex items-center gap-1.5 print:hidden">
        <ExpertManualButton manualId="gadget-ai-copilot" locale={locale} variant="icon" />
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
            <ExpertManualButton manualId="gadget-ai-copilot" locale={locale} variant="mini" />
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
              onClick={() => setShowCustomAiSettings((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-xl border border-amber-400/40 bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-200 hover:bg-amber-500/25 transition cursor-pointer"
              title={t('Configure Unlimited Local Ollama / Custom LLM Key', 'إعدادات النماذج غير المحدودة والمحلية')}
            >
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              {t('Unlimited / Custom LLM', 'ربط نموذج غير محدود')}
            </button>

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

        {/* Unlimited Custom / Local LLM & Sovereign Engine Drawer */}
        {showCustomAiSettings && (
          <div className="px-6 py-4 bg-slate-950/95 border-b border-emerald-500/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-emerald-300">
                {t(
                  'Unlimited AI Architecture: Built-From-Scratch Sovereign Engine + Local Ollama + Cloud BYOK',
                  'منظومة الذكاء الاصطناعي غير المحدودة: النموذج السيادي المبني من الصفر + Ollama المحلي + مفاتيح السحابة'
                )}
              </div>
              <span className="text-[11px] text-slate-400">
                {t('Saved locally in your browser • Zero rate limits', 'يحفظ محلياً في متصفحك • بدون أي حدود استخدام')}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {t('Primary Execution Engine', 'محرك التشغيل الأساسي')}
                </label>
                <select
                  value={customProvider}
                  onChange={(e) => setCustomProvider(e.target.value as any)}
                  className="w-full rounded-lg border border-white/20 bg-slate-900 px-2.5 py-2 text-xs font-bold text-white"
                >
                  <option value="auto">
                    {t('Auto Multi-LLM + Sovereign Cascade', 'تلقائي (سحابي مجاني + النموذج السيادي)')}
                  </option>
                  <option value="sovereign">
                    {t('Mahalla Sovereign v4.0 (Built-From-Scratch • 0ms)', 'النموذج السيادي للمحلة v4.0 (مبني من الصفر • فوري)')}
                  </option>
                  <option value="ollama">
                    {t('Local Ollama / vLLM / LM Studio (Unlimited GPU)', 'نموذج محلي Ollama / vLLM (بلا حدود)')}
                  </option>
                  <option value="groq">{t('Groq LPU (Llama 3.3 70B / DeepSeek)', 'Groq LPU السريع')}</option>
                  <option value="gemini">{t('Google Gemini 2.5 Flash', 'Google Gemini 2.5 Flash')}</option>
                  <option value="openrouter">{t('OpenRouter Free / Custom', 'OpenRouter')}</option>
                  <option value="huggingface">{t('HuggingFace Inference API', 'HuggingFace API')}</option>
                </select>
              </div>

              {customProvider === 'ollama' ? (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {t('Local OpenAI-Compatible Base URL', 'رابط الخادم المحلي (Ollama / vLLM)')}
                  </label>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="http://localhost:11434/v1"
                    className="w-full rounded-lg border border-white/20 bg-slate-900 px-2.5 py-2 text-xs text-white"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {t('Optional API Key (Groq / Gemini / OpenRouter / HF)', 'مفتاح API اختياري (للاتصال المباشر غير المحدود)')}
                  </label>
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder={t('Leave blank for built-in free & sovereign AI', 'اتركه فارغاً لاستخدام المحرك المجاني والسيادي')}
                    className="w-full rounded-lg border border-white/20 bg-slate-900 px-2.5 py-2 text-xs text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {t('Custom Model ID (Optional)', 'اسم النموذج المخصص (اختياري)')}
                </label>
                <input
                  type="text"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder="llama-3.3-70b-versatile / gemini-2.5-flash"
                  className="w-full rounded-lg border border-white/20 bg-slate-900 px-2.5 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={saveCustomAiSettings}
                  className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3 py-2 text-xs font-extrabold text-slate-950 transition cursor-pointer"
                >
                  {t('Apply & Save Engine Config', 'حفظ وتفعيل إعدادات المحرك')}
                </button>
              </div>
            </div>
          </div>
        )}

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

            {/* Zero-Rate-Limit Interactive AI Visual & Engineering Blueprint Studio */}
            {showVisualStudio && (
              <div className="rounded-2xl border border-emerald-400/35 bg-slate-900/90 p-4 space-y-3 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-emerald-400" />
                      {t(
                        'Free AI Generated Industrial & Product Concept Visual (HD 1280×540)',
                        'التصور البصري والهندسي المولّد بالذكاء الاصطناعي (جودة عالية HD)'
                      )}
                    </span>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      Zero-Limit Studio Engine
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSovereignVisualMode('weave-physics')}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                        sovereignVisualMode === 'weave-physics'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {t('1. 3D Micro-Weave Simulation', '١. محاكاة النسيج المجهري 3D')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSovereignVisualMode('isometric-factory')}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                        sovereignVisualMode === 'isometric-factory'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {t('2. 3D Smart Mill Twin', '٢. التوأم الرقمي للمصنع 3D')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSovereignVisualMode('cad-techpack')}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                        sovereignVisualMode === 'cad-techpack'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {t('3. CAD Tech-Pack & Pantone', '٣. مخطط CAD والألوان')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSovereignVisualMode('studio-photo');
                        setVisualVariantIdx((v) => v + 1);
                      }}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                        sovereignVisualMode === 'studio-photo'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <RefreshCw className="h-3 w-3" />
                      {t('4. Studio Photo + HUD', '٤. تصوير استوديو + مؤشرات')}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadVisualPng}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-400 hover:bg-amber-300 px-2.5 py-1 text-[11px] font-extrabold text-slate-950 transition cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      {t('Download HD .PNG', 'تحميل .PNG')}
                    </button>
                    <Link
                      href={`/${locale}/cluster/media-studio?prompt=${encodeURIComponent(
                        customPrompt.trim() || cfg.titleEn
                      )}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-purple-500/30 border border-purple-400/40 hover:bg-purple-500/40 px-2.5 py-1 text-[11px] font-bold text-purple-200 transition"
                    >
                      <Film className="h-3 w-3" />
                      {t('Full Image & MP4 Video Studio', 'استوديو الصور والفيديو MP4 الكامل')}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowVisualStudio(false)}
                      className="text-slate-400 hover:text-white px-1.5 font-bold cursor-pointer"
                    >
                      ✕ {t('Close', 'إغلاق')}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-white/15 bg-slate-950">
                  <canvas
                    ref={visualCanvasRef}
                    width={1280}
                    height={540}
                    className="w-full h-auto block"
                  />
                </div>
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
