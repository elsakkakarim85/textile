'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BRAND_STUDIO_PRESETS,
  synthesizeExpertBrandKit,
  type BrandMarketingKit,
} from '@/server/modernization/brand-generator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, ProgressBar } from '@/components/cluster/ui';
import {
  Sparkles,
  Palette,
  Target,
  Workflow,
  Video,
  Camera,
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Calendar,
  Send,
  Bot,
  Wand2,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Megaphone,
  Layers,
  Globe,
  Zap,
  RefreshCw,
} from 'lucide-react';

interface Props {
  locale: string;
  initialTopic?: string;
  defaultBrandName?: string;
}

export function BrandMarketingStudioClient({
  locale,
  initialTopic,
  defaultBrandName,
}: Props) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const [topic, setTopic] = useState(
    initialTopic || BRAND_STUDIO_PRESETS[0].topic
  );
  const [brandName, setBrandName] = useState(
    defaultBrandName || BRAND_STUDIO_PRESETS[0].brandName
  );
  const [targetMarket, setTargetMarket] = useState(
    BRAND_STUDIO_PRESETS[0].targetMarket
  );
  const [tone, setTone] = useState<
    'LUXURY_HERITAGE' | 'ECO_INNOVATION' | 'INDUSTRIAL_B2B' | 'MODERN_FASHION'
  >('LUXURY_HERITAGE');

  const [kit, setKit] = useState<BrandMarketingKit>(() =>
    synthesizeExpertBrandKit({
      topic: initialTopic || BRAND_STUDIO_PRESETS[0].topic,
      brandName: defaultBrandName || BRAND_STUDIO_PRESETS[0].brandName,
      targetMarket: BRAND_STUDIO_PRESETS[0].targetMarket,
      tone: 'LUXURY_HERITAGE',
    })
  );

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'IDENTITY' | 'STRATEGY' | 'AUTOMATION' | 'MEDIA' | 'PRINT' | 'CMO_AI'
  >('IDENTITY');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [logoShapeOverride, setLogoShapeOverride] = useState<
    'CREST' | 'LOOM_DIAMOND' | 'COTTON_CROWN' | 'HEX_TECH' | null
  >(null);

  // Automation state
  const [activeFlows, setActiveFlows] = useState<Record<string, boolean>>({
    'auto-eu-buyer-abm': true,
    'auto-social-omnipresence': true,
  });
  const [simulatingFlowId, setSimulatingFlowId] = useState<string | null>(null);
  const [simStepIdx, setSimStepIdx] = useState<number>(0);
  const [publishedCalIds, setPublishedCalIds] = useState<Record<string, boolean>>({});

  // Video player state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const videoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Photo studio state
  const [photoAspect, setPhotoAspect] = useState<'16:9' | '1:1' | '9:16'>('16:9');

  // Print collateral state
  const [printSubTab, setPrintSubTab] = useState<'BROCHURE' | 'FLYER' | 'POSTER'>('BROCHURE');
  const [posterTheme, setPosterTheme] = useState<'DARK_GOLD' | 'EMERALD_ECO' | 'ROYAL_BLUE'>('DARK_GOLD');

  // AI CMO Copilot state
  const [cmoPrompt, setCmoPrompt] = useState('');
  const [cmoLoading, setCmoLoading] = useState(false);
  const [cmoMessages, setCmoMessages] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([
    {
      role: 'assistant',
      text: isAr
        ? `مرحباً بك في استوديو العلامات التجارية والتسويق الذكي! أنا المستشار التسويقي الذكي (AI CMO). يمكنني كتابة رسائل استهداف المشترين الأوروبيين، تحسين نصوص الإعلانات، أو تخصيص خطة الأتمتة والمطبوعات لعلامتك التجارية.`
        : `Welcome to the Brand, Marketing & Collateral Studio! I am your AI Chief Marketing Officer. Ask me to write cold outreach sequences for European buyers, refine your ad copy, translate brochures, or customize your 90-day export campaign.`,
    },
  ]);

  const copyText = (key: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleGenerate = async (presetOverride?: (typeof BRAND_STUDIO_PRESETS)[number]) => {
    const nextTopic = presetOverride ? presetOverride.topic : topic;
    const nextBrand = presetOverride ? presetOverride.brandName : brandName;
    const nextMarket = presetOverride ? presetOverride.targetMarket : targetMarket;
    const nextTone = presetOverride ? presetOverride.tone : tone;

    if (presetOverride) {
      setTopic(nextTopic);
      setBrandName(nextBrand);
      setTargetMarket(nextMarket);
      setTone(nextTone);
    }

    // Immediately synthesize client-side so UI updates in <50ms, then enrich via API
    const instantKit = synthesizeExpertBrandKit({
      topic: nextTopic,
      brandName: nextBrand,
      targetMarket: nextMarket,
      tone: nextTone,
    });
    setKit(instantKit);
    setLogoShapeOverride(null);
    setCurrentSceneIdx(0);
    setLoading(true);

    try {
      const res = await fetch('/api/cluster/brand-studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: nextTopic,
          brandName: nextBrand,
          targetMarket: nextMarket,
          tone: nextTone,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.kit) {
          setKit(data.kit);
        }
      }
    } catch {
      // Instant kit is already active
    } finally {
      setLoading(false);
    }
  };

  // Video Playback & Speech Narration Effect
  useEffect(() => {
    if (!isPlayingVideo) {
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const scenes = kit.videoSpec.scenes;
    const activeScene = scenes[currentSceneIdx] || scenes[0];

    if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        isAr ? activeScene.voiceoverAr : activeScene.voiceoverEn
      );
      utter.lang = isAr ? 'ar-EG' : 'en-US';
      utter.rate = 1.0;
      window.speechSynthesis.speak(utter);
    }

    videoTimerRef.current = setTimeout(() => {
      if (currentSceneIdx < scenes.length - 1) {
        setCurrentSceneIdx((prev) => prev + 1);
      } else {
        setIsPlayingVideo(false);
        setCurrentSceneIdx(0);
      }
    }, 5500);

    return () => {
      if (videoTimerRef.current) clearTimeout(videoTimerRef.current);
    };
  }, [isPlayingVideo, currentSceneIdx, voiceEnabled, isAr, kit.videoSpec.scenes]);

  // Simulate Automation Workflow Runner
  const triggerWorkflowSimulation = (flowId: string, stepCount: number) => {
    setSimulatingFlowId(flowId);
    setSimStepIdx(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step >= stepCount) {
        clearInterval(interval);
        setTimeout(() => setSimulatingFlowId(null), 1800);
      } else {
        setSimStepIdx(step);
      }
    }, 1100);
  };

  // Download SVG Logo
  const downloadLogoSvg = () => {
    const primary = kit.palette[0]?.hex || '#0F172A';
    const gold = kit.palette[1]?.hex || '#D4AF37';
    const bName = isAr ? kit.brandNameAr : kit.brandNameEn;
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 260" width="1200" height="520">
      <rect width="600" height="260" rx="24" fill="${primary}" />
      <circle cx="130" cy="130" r="76" fill="none" stroke="${gold}" stroke-width="4" />
      <polygon points="130,64 188,130 130,196 72,130" fill="none" stroke="${gold}" stroke-width="2.5" />
      <text x="130" y="144" text-anchor="middle" fill="${gold}" font-family="Georgia, serif" font-size="42" font-weight="bold">${kit.logoStyle.monogram}</text>
      <text x="235" y="118" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="28" font-weight="bold" letter-spacing="2">${bName}</text>
      <text x="235" y="152" fill="${gold}" font-family="Arial, sans-serif" font-size="13" letter-spacing="1.5">EL-MAHALLA EL-KUBRA • EGYPTIAN TEXTILE EXCELLENCE</text>
      <text x="235" y="180" fill="#CBD5E1" font-family="Arial, sans-serif" font-size="11">ISO 17025 • OEKO-TEX 100 • EU DIGITAL PRODUCT PASSPORT</text>
    </svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kit.brandNameEn.toLowerCase().replace(/\s+/g, '-')}-logo.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download High-Res Promotional Photo as PNG via HTML5 Canvas
  const downloadPhotoAsPng = (concept: BrandMarketingKit['photoConcepts'][number]) => {
    const canvas = document.createElement('canvas');
    const width = photoAspect === '16:9' ? 1600 : photoAspect === '1:1' ? 1200 : 1080;
    const height = photoAspect === '16:9' ? 900 : photoAspect === '1:1' ? 1200 : 1920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, concept.primaryHex);
    grad.addColorStop(1, '#090D16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative weave grid lines
    ctx.strokeStyle = `${concept.secondaryHex}33`;
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Accent Frame
    ctx.strokeStyle = concept.secondaryHex;
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // Brand Monogram Badge
    ctx.fillStyle = concept.secondaryHex;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(
      isAr ? concept.styleTagAr : concept.styleTagEn,
      96,
      130
    );

    // Main Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px sans-serif';
    ctx.fillText(
      isAr ? concept.headlineOverlayAr : concept.headlineOverlayEn,
      96,
      height / 2 - 20
    );

    // Subheadline
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(
      isAr ? concept.subOverlayAr : concept.subOverlayEn,
      96,
      height / 2 + 45
    );

    // Footer Spec
    ctx.fillStyle = concept.secondaryHex;
    ctx.font = '24px monospace';
    ctx.fillText(
      `EL-MAHALLA CLUSTER • OEKO-TEX 100 • ISO 17025 • EU DPP VERIFIED`,
      96,
      height - 96
    );

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${concept.id}-${photoAspect.replace(':', 'x')}.png`;
    a.click();
  };

  // Download Automation Calendar CSV
  const downloadCalendarCsv = () => {
    const headers = ['Week', 'Day/Time', 'Channel', 'Format', 'Headline', 'Caption', 'CTA', 'Status'];
    const rows = kit.calendar.map((c) => [
      `Week ${c.week}`,
      isAr ? c.dayAr : c.dayEn,
      c.channel,
      isAr ? c.formatAr : c.formatEn,
      `"${(isAr ? c.headlineAr : c.headlineEn).replace(/"/g, '""')}"`,
      `"${(isAr ? c.captionAr : c.captionEn).replace(/"/g, '""')}"`,
      `"${(isAr ? c.ctaAr : c.ctaEn).replace(/"/g, '""')}"`,
      c.autoStatus,
    ]);
    const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kit.brandNameEn.toLowerCase().replace(/\s+/g, '-')}-automation-calendar.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download Printable Standalone HTML Collateral (Brochure / Flyer / Poster)
  const downloadStandaloneCollateralHtml = (kind: 'BROCHURE' | 'FLYER' | 'POSTER') => {
    const primary = kit.palette[0]?.hex || '#0F172A';
    const accent = kit.palette[1]?.hex || '#D4AF37';
    const bName = isAr ? kit.brandNameAr : kit.brandNameEn;
    const dir = isAr ? 'rtl' : 'ltr';

    let bodyHtml = '';
    if (kind === 'FLYER') {
      bodyHtml = `
        <div style="max-width:800px;margin:20px auto;border:3px solid ${primary};border-radius:16px;overflow:hidden;font-family:sans-serif;direction:${dir};">
          <div style="background:${primary};color:#fff;padding:36px;">
            <div style="color:${accent};font-weight:bold;font-size:13px;letter-spacing:2px;">${isAr ? kit.flyerSpec.badgeAr : kit.flyerSpec.badgeEn}</div>
            <h1 style="font-size:34px;margin:12px 0;">${isAr ? kit.flyerSpec.headlineAr : kit.flyerSpec.headlineEn}</h1>
            <p style="color:#E2E8F0;font-size:16px;line-height:1.5;">${isAr ? kit.flyerSpec.subheadlineAr : kit.flyerSpec.subheadlineEn}</p>
          </div>
          <div style="background:${accent};color:#000;padding:16px 36px;font-weight:bold;font-size:15px;">
            ${isAr ? kit.flyerSpec.offerHighlightAr : kit.flyerSpec.offerHighlightEn}
          </div>
          <div style="padding:32px 36px;display:grid;grid-template-columns:1fr 1fr;gap:18px;background:#fff;">
            ${kit.flyerSpec.keySpecs
              .map(
                (s) => `
              <div style="border:1px solid #CBD5E1;padding:16px;border-radius:10px;">
                <div style="font-size:12px;color:#64748B;font-weight:bold;">${isAr ? s.labelAr : s.labelEn}</div>
                <div style="font-size:15px;font-weight:bold;color:#0F172A;margin-top:6px;">${isAr ? s.valueAr : s.valueEn}</div>
              </div>`
              )
              .join('')}
          </div>
          <div style="background:#F8FAFC;padding:24px 36px;border-top:1px solid #E2E8F0;text-align:center;">
            <div style="font-size:18px;font-weight:bold;color:${primary};">${isAr ? kit.flyerSpec.ctaAr : kit.flyerSpec.ctaEn}</div>
            <div style="font-size:13px;color:#475569;margin-top:6px;">${kit.flyerSpec.contactLine}</div>
          </div>
        </div>`;
    } else if (kind === 'POSTER') {
      bodyHtml = `
        <div style="max-width:680px;margin:20px auto;background:${primary};color:#fff;padding:48px;border:6px solid ${accent};border-radius:20px;font-family:sans-serif;direction:${dir};text-align:center;">
          <div style="font-size:13px;color:${accent};letter-spacing:2px;font-weight:bold;">${isAr ? kit.posterSpec.exhibitionNameAr : kit.posterSpec.exhibitionNameEn} • ${kit.posterSpec.boothNumber}</div>
          <div style="width:96px;height:96px;border:3px solid ${accent};border-radius:50%;display:flex;align-items:center;justify-content:center;margin:28px auto;font-size:36px;font-weight:bold;color:${accent};">${kit.logoStyle.monogram}</div>
          <h1 style="font-size:46px;margin:10px 0;letter-spacing:2px;">${isAr ? kit.posterSpec.heroStatementAr : kit.posterSpec.heroStatementEn}</h1>
          <p style="font-size:18px;color:#E2E8F0;max-width:540px;margin:0 auto 36px;">${isAr ? kit.posterSpec.subStatementAr : kit.posterSpec.subStatementEn}</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:36px;">
            ${kit.posterSpec.pillars
              .map(
                (p) => `
              <div style="background:rgba(255,255,255,0.07);border:1px solid ${accent};padding:20px;border-radius:12px;">
                <div style="font-size:22px;font-weight:bold;color:${accent};">${p.metric}</div>
                <div style="font-size:14px;margin-top:6px;">${isAr ? p.titleAr : p.titleEn}</div>
              </div>`
              )
              .join('')}
          </div>
          <div style="background:${accent};color:#000;padding:18px;border-radius:12px;font-weight:bold;font-size:14px;">
            ${isAr ? kit.posterSpec.footerCalloutAr : kit.posterSpec.footerCalloutEn}
          </div>
        </div>`;
    } else {
      bodyHtml = `
        <div style="max-width:1100px;margin:20px auto;font-family:sans-serif;direction:${dir};">
          <h1 style="color:${primary};">${bName} — 6-Panel Tri-Fold Corporate Brochure</h1>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
            ${kit.brochurePanels
              .map(
                (p) => `
              <div style="border:2px solid ${primary};border-radius:12px;padding:22px;background:#fff;">
                <div style="font-size:11px;font-weight:bold;color:${accent};background:${primary};display:inline-block;padding:4px 10px;border-radius:6px;">${isAr ? p.panelRoleAr : p.panelRoleEn}</div>
                <h3 style="font-size:20px;color:${primary};margin:14px 0 8px;">${isAr ? p.titleAr : p.titleEn}</h3>
                <p style="font-size:13px;color:#334155;line-height:1.5;">${isAr ? p.bodyAr : p.bodyEn}</p>
                <ul style="font-size:12px;color:#0F172A;padding-inline-start:18px;line-height:1.7;">
                  ${(isAr ? p.bulletsAr : p.bulletsEn).map((b) => `<li>${b}</li>`).join('')}
                </ul>
              </div>`
              )
              .join('')}
          </div>
        </div>`;
    }

    const fullHtml = `<!DOCTYPE html><html lang="${locale}" dir="${dir}"><head><meta charset="utf-8"/><title>${bName} - ${kind}</title></head><body style="background:#F1F5F9;margin:0;padding:24px;">${bodyHtml}</body></html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kit.brandNameEn.toLowerCase().replace(/\s+/g, '-')}-${kind.toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send AI CMO Copilot Message
  const sendCmoMessage = async (overrideQuestion?: string) => {
    const q = (overrideQuestion || cmoPrompt).trim();
    if (!q || cmoLoading) return;
    if (!overrideQuestion) setCmoPrompt('');

    setCmoMessages((prev) => [...prev, { role: 'user', text: q }]);
    setCmoLoading(true);

    try {
      const contextPrompt = `Brand Context:
- Brand Name: ${kit.brandNameEn} (${kit.brandNameAr})
- Specialty / Product: ${kit.topicEn}
- Positioning: ${kit.positioningEn}
- Request from Marketing Director: ${q}`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: contextPrompt,
          locale,
        }),
      });
      const data = await res.json();
      const reply =
        data?.text ||
        data?.reply ||
        t(
          'Here is your customized campaign copy and buyer outreach sequence tailored for European and GCC textile buyers.',
          'إليك الصياغة التسويقية المخصصة وتسلسل استهداف المشترين الدوليين.'
        );
      setCmoMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setCmoMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: t(
            `Subject: [${kit.brandNameEn}] Complimentary Giza Swatch Box & ISO 17025 Dossier\n\nDear Sourcing Director,\nWe noticed your upcoming seasonal program and would love to dispatch our 5-day DHL Swatch Kit for "${kit.topicEn}" with full EU Digital Product Passport serialization and 14-day Alexandria-to-EU sea freight.`,
            `الموضوع: [${kit.brandNameAr}] صندوق عينات مجاني عبر DHL وملف الجودة ISO 17025\n\nيسعدنا إرسال صندوق العينات المعتمد لمنتجات (${kit.topicAr}) مع جواز المنتج الرقمي الأوروبي وشحن بحري خلال ١٤ يوماً.`
          ),
        },
      ]);
    } finally {
      setCmoLoading(false);
    }
  };

  const activeShape = logoShapeOverride || kit.logoStyle.emblemShape;
  const primaryHex = kit.palette[0]?.hex || '#0F172A';
  const secondaryHex = kit.palette[1]?.hex || '#D4AF37';
  const activeVideoScene =
    kit.videoSpec.scenes[currentSceneIdx] || kit.videoSpec.scenes[0];

  return (
    <div className="space-y-8">
      {/* Top Generator Control Console */}
      <Card className="p-6 md:p-8 border-primary/30 bg-gradient-to-br from-primary/10 via-background to-indigo-500/10 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 border border-primary/30 px-3.5 py-1 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              {t(
                'AI BRAND ARCHITECT • MARKETING AUTOMATION • MULTIMEDIA & PRINT STUDIO',
                'مهندس الهوية التجارية • أتمتة التسويق • استوديو الفيديو والصور والمطبوعات'
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {t(
                'Generate a Complete Brand, Automated Marketing Plan & Promotional Collateral from Any Topic',
                'أنشئ علامة تجارية متكاملة وخطة تسويق مؤتمتة وفيديوهات ومطبوعات احترافية لأي منتج أو تخصص'
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadLogoSvg}
              className="gap-1.5 font-semibold"
            >
              <Download className="w-4 h-4" />
              {t('Export SVG Logo', 'تحميل الشعار SVG')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 font-semibold"
            >
              <Printer className="w-4 h-4" />
              {t('Print Brand Dossier', 'طباعة ملف العلامة')}
            </Button>
          </div>
        </div>

        {/* 1-Click Industry Presets */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t(
              '1-Click Textile Brand Blueprints (Or Type Any Custom Product Below):',
              'قوالب جاهزة بضغطة واحدة (أو اكتب أي منتج أو فكرة خاصة بك أدناه):'
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {BRAND_STUDIO_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleGenerate(p)}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl border bg-card hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Wand2 className="w-3.5 h-3.5 text-primary" />
                {isAr ? p.labelAr : p.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <div className="grid md:grid-cols-12 gap-4 pt-1">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              {t(
                'Product, Fabric Specialty, or Brand Concept (Any Topic)',
                'المنتج أو التخصص الصناعي أو فكرة العلامة التجارية (أي موضوع)'
              )}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t(
                'e.g. Organic Giza 86 Babywear, Flame-Retardant Workwear, Jacquard Curtains...',
                'مثال: ملابس أطفال قطن جيزة عضوي، أقمشة مقاومة للحريق، ستائر جاكار فاخرة...'
              )}
              className="w-full h-11 rounded-xl border bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              {t('Brand Name (Optional)', 'اسم العلامة المقترح (اختياري)')}
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder={t('e.g. NILE CROWN ATELIER', 'مثال: أتيليه تاج النيل')}
              className="w-full h-11 rounded-xl border bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              {t('Brand Positioning Tone', 'طابع الهوية التجارية')}
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full h-11 rounded-xl border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="LUXURY_HERITAGE">
                {t('Luxury Heritage', 'فخامة وعراقة ملكية')}
              </option>
              <option value="ECO_INNOVATION">
                {t('Eco & Sustainable', 'استدامة وتدوير أخضر')}
              </option>
              <option value="INDUSTRIAL_B2B">
                {t('Precision Industrial B2B', 'هندسي صناعي B2B')}
              </option>
              <option value="MODERN_FASHION">
                {t('Modern Fashion & D2C', 'أزياء عصرية وحديثة')}
              </option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <Button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="w-full h-11 rounded-xl font-bold bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white shadow-md gap-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {t('Synthesize All', 'توليد المنظومة')}
            </Button>
          </div>
        </div>
      </Card>

      {/* 6-Tab Workspace Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {[
          {
            id: 'IDENTITY',
            icon: Palette,
            en: '1. Brand Identity & Logo Book',
            ar: '١. الهوية البصرية والشعار',
          },
          {
            id: 'STRATEGY',
            icon: Target,
            en: '2. 360° Marketing Plan & ROAS',
            ar: '٢. الخطة التسويقية والميزانية',
          },
          {
            id: 'AUTOMATION',
            icon: Workflow,
            en: '3. Campaign Automation & Calendar',
            ar: '٣. أتمتة الحملات والجدولة',
          },
          {
            id: 'MEDIA',
            icon: Video,
            en: '4. Promo Video & Photo Studio',
            ar: '٤. استوديو الفيديو والصور',
          },
          {
            id: 'PRINT',
            icon: FileText,
            en: '5. Brochures, Flyers & Posters',
            ar: '٥. البروشورات والفلايرز والبوسترات',
          },
          {
            id: 'CMO_AI',
            icon: Bot,
            en: '6. AI CMO Copywriter',
            ar: '٦. المساعد التسويقي الذكي',
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                active
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/50 hover:bg-muted text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {isAr ? tab.ar : tab.en}
            </button>
          );
        })}
      </div>

      {/* TAB 1: BRAND IDENTITY & LOGO BOOK */}
      {activeTab === 'IDENTITY' && (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Interactive Vector Logo & Monogram Studio */}
            <Card className="lg:col-span-5 p-6 flex flex-col justify-between space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  {t('Interactive Brand Lockup & SVG Emblem', 'الشعار المتجه (Vector SVG) والختم الرسمي')}
                </h3>
                <Pill tone="emerald">{t('Vector Ready', 'جاهز للطباعة')}</Pill>
              </div>

              {/* Live SVG Logo Canvas */}
              <div
                className="rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner border min-h-[270px] transition-colors"
                style={{ backgroundColor: primaryHex, color: '#FFFFFF' }}
              >
                <svg className="w-28 h-28 mb-4" viewBox="0 0 120 120">
                  {activeShape === 'COTTON_CROWN' && (
                    <>
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke={secondaryHex}
                        strokeWidth="3"
                        strokeDasharray="6 3"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="44"
                        fill="none"
                        stroke={secondaryHex}
                        strokeWidth="2"
                      />
                    </>
                  )}
                  {activeShape === 'LOOM_DIAMOND' && (
                    <>
                      <polygon
                        points="60,6 114,60 60,114 6,60"
                        fill="none"
                        stroke={secondaryHex}
                        strokeWidth="3.5"
                      />
                      <polygon
                        points="60,16 104,60 60,104 16,60"
                        fill="none"
                        stroke={secondaryHex}
                        strokeWidth="1.5"
                      />
                    </>
                  )}
                  {activeShape === 'HEX_TECH' && (
                    <polygon
                      points="60,8 106,34 106,86 60,112 14,86 14,34"
                      fill="none"
                      stroke={secondaryHex}
                      strokeWidth="3.5"
                    />
                  )}
                  {activeShape === 'CREST' && (
                    <path
                      d="M60 8 L104 26 L104 64 C104 90 60 112 60 112 C60 112 16 90 16 64 L16 26 Z"
                      fill="none"
                      stroke={secondaryHex}
                      strokeWidth="3.5"
                    />
                  )}
                  <text
                    x="60"
                    y="72"
                    textAnchor="middle"
                    fill={secondaryHex}
                    fontSize="34"
                    fontWeight="bold"
                    fontFamily="Georgia, serif"
                  >
                    {kit.logoStyle.monogram}
                  </text>
                </svg>

                <div className="text-2xl font-extrabold tracking-widest uppercase">
                  {isAr ? kit.brandNameAr : kit.brandNameEn}
                </div>
                <div
                  className="text-xs font-semibold tracking-wider mt-1.5 uppercase"
                  style={{ color: secondaryHex }}
                >
                  {isAr ? kit.taglineAr : kit.taglineEn}
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {kit.certificationsBadges.slice(0, 3).map((b) => (
                    <span
                      key={b}
                      className="text-[10px] px-2.5 py-0.5 rounded-full border border-white/25 bg-white/10"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Shape Switcher & Export */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-muted-foreground">
                  {t('Customize Emblem Geometry:', 'تغيير شكل الإطار الهندسي للشعار:')}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'COTTON_CROWN', en: 'Crown Seal', ar: 'ختم ملكي' },
                      { id: 'LOOM_DIAMOND', en: 'Weave Diamond', ar: 'معين النسيج' },
                      { id: 'HEX_TECH', en: 'ISO Hexagon', ar: 'سداسي تقني' },
                      { id: 'CREST', en: 'Heritage Shield', ar: 'درع كلاسيكي' },
                    ] as const
                  ).map((sh) => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => setLogoShapeOverride(sh.id)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                        activeShape === sh.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      {isAr ? sh.ar : sh.en}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={downloadLogoSvg}
                  className="w-full gap-2 font-bold"
                >
                  <Download className="w-4 h-4" />
                  {t('Download Scalable Vector Logo (.SVG)', 'تحميل ملف الشعار المتجه (.SVG)')}
                </Button>
              </div>
            </Card>

            {/* Brand Strategy, Archetype, Positioning & Story */}
            <Card className="lg:col-span-7 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                <div>
                  <div className="text-xs font-bold uppercase text-primary">
                    {t('Brand Positioning & Executive Narrative', 'التموضع الاستراتيجي وقصة العلامة')}
                  </div>
                  <h3 className="text-2xl font-extrabold mt-0.5">
                    {isAr ? kit.brandNameAr : kit.brandNameEn}
                  </h3>
                </div>
                <Pill tone="blue">{isAr ? kit.archetypeAr : kit.archetypeEn}</Pill>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-muted-foreground">
                  {t('Executive Positioning Statement', 'بيان التموضع التسويقي')}
                </div>
                <p className="text-sm leading-relaxed bg-muted/40 p-4 rounded-xl border">
                  {isAr ? kit.positioningAr : kit.positioningEn}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-muted-foreground">
                  {t('Origin & Craftsmanship Story', 'قصة العلامة وإرث المحلة الكبرى')}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isAr ? kit.storyAr : kit.storyEn}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-muted-foreground">
                  {t('4 Pillars of Competitive Advantage (UVP)', 'الركائز التنافسية الأربع للعلامة')}
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {(isAr ? kit.uvpBulletsAr : kit.uvpBulletsEn).map((u, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border bg-card text-xs leading-relaxed flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{u}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Brand Names */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold uppercase text-muted-foreground">
                  {t('Alternative Sub-Brand / Capsule Naming Options', 'بدائل مقترحة لأسماء الخطوط الفرعية')}
                </div>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {kit.altBrandNames.map((alt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setBrandName(isAr ? alt.ar : alt.en);
                        setKit((prev) => ({
                          ...prev,
                          brandNameEn: alt.en,
                          brandNameAr: alt.ar,
                        }));
                      }}
                      className="p-3 rounded-xl border text-start hover:border-primary transition-all bg-muted/20"
                    >
                      <div className="font-bold text-xs text-primary">
                        {isAr ? alt.ar : alt.en}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {isAr ? alt.rationaleAr : alt.rationaleEn}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 5-Swatch Pantone TCX & HEX Color System */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">
                  {t(
                    'Official Pantone® Textile TCX & Digital HEX Color System',
                    'نظام الألوان المعتمد للطباعة والصباغة (Pantone® TCX & HEX)'
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Click any swatch to copy its HEX code for web or Pantone TCX code for dye-house spectrophotometer matching.',
                    'اضغط على أي لون لنسخ كود HEX أو كود Pantone TCX الخاص بمعمل الصباغة.'
                  )}
                </p>
              </div>
              <Pill tone="purple">
                {isAr ? kit.logoStyle.typographyAr : kit.logoStyle.typographyEn}
              </Pill>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {kit.palette.map((sw) => (
                <div
                  key={sw.hex}
                  onClick={() => copyText(sw.hex, `${sw.hex} (${sw.pantoneTcx})`)}
                  className="rounded-2xl border overflow-hidden cursor-pointer group hover:shadow-md transition-all"
                >
                  <div
                    className="h-28 w-full flex items-end justify-between p-3"
                    style={{ backgroundColor: sw.hex }}
                  >
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white">
                      {sw.hex}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/90 text-slate-900">
                      {copiedKey === sw.hex
                        ? t('Copied!', 'تم النسخ!')
                        : sw.pantoneTcx}
                    </span>
                  </div>
                  <div className="p-3.5 bg-card space-y-1">
                    <div className="font-bold text-sm">
                      {isAr ? sw.nameAr : sw.nameEn}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {isAr ? sw.usageAr : sw.usageEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Woven Label, Hangtag & EU Digital Product Passport Spec */}
          <Card className="p-6 grid md:grid-cols-3 gap-6 bg-muted/20">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-primary">
                {t('1. Damask Woven Label Spec', '١. مواصفات التيكيت المنسوج (Woven Label)')}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAr ? kit.packagingSpec.wovenLabelAr : kit.packagingSpec.wovenLabelEn}
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-primary">
                {t('2. Embossed Hangtag & EU DPP QR', '٢. بطاقة التعليق (Hangtag) وباركود التتبع')}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAr ? kit.packagingSpec.hangtagCopyAr : kit.packagingSpec.hangtagCopyEn}
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase text-emerald-600">
                {t('3. Verified ESG On-Product Claim', '٣. البيان البيئي الموثق على الغلاف')}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAr
                  ? kit.packagingSpec.sustainabilityClaimAr
                  : kit.packagingSpec.sustainabilityClaimEn}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: 360° MARKETING PLAN & STRATEGY */}
      {activeTab === 'STRATEGY' && (
        <div className="space-y-8">
          {/* Buyer Personas */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {t(
                'Target International Buyer Personas & Decision Triggers',
                'شخصيات المشترين الدوليين المستهدفين ومحفزات الشراء'
              )}
            </h3>
            <div className="grid md:grid-cols-3 gap-5">
              {kit.personas.map((p, idx) => (
                <Card key={idx} className="p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Pill tone="blue">{isAr ? p.regionAr : p.regionEn}</Pill>
                      <span className="text-xs font-bold text-emerald-600">
                        {p.typicalOrderSize}
                      </span>
                    </div>
                    <h4 className="font-bold text-base">
                      {isAr ? p.roleAr : p.roleEn}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-rose-600 uppercase">
                      {t('Key Sourcing Pain Points:', 'التحديات التي يواجهها المشتري:')}
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc ps-4">
                      {(isAr ? p.painPointsAr : p.painPointsEn).map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="text-xs font-bold text-emerald-600 uppercase">
                      {t('Winning Conversion Triggers:', 'عوامل الحسم والفوز بالطلبية:')}
                    </div>
                    <ul className="text-xs text-foreground space-y-1.5 list-disc ps-4">
                      {(isAr ? p.decisionTriggersAr : p.decisionTriggersEn).map(
                        (trItem, i) => (
                          <li key={i}>{trItem}</li>
                        )
                      )}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Omnichannel Budget Allocation & ROAS */}
          <Card className="p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold">
                  {t(
                    'Omnichannel Marketing Mix, Budget Share & Projected Export ROAS',
                    'توزيع القنوات التسويقية والميزانية والعائد المتوقع على الاستثمار (ROAS)'
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Engineered for B2B textile export lead generation, trade-show conversion, and D2C brand authority.',
                    'مصممة خصيصاً لتوليد عقود التصدير، وتعظيم عائد المعارض الدولية، وبناء السمعة الرقمية.'
                  )}
                </p>
              </div>
              <Pill tone="emerald">
                {t('Blended Target ROI: 6.1x', 'متوسط العائد المستهدف: 6.1x')}
              </Pill>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {kit.channels.map((ch, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border bg-muted/15 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-base">
                        {isAr ? ch.channelAr : ch.channelEn}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {isAr ? ch.monthlyCadenceAr : ch.monthlyCadenceEn}
                      </div>
                    </div>
                    <Pill tone="blue">{ch.expectedRoas}</Pill>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{t('Budget Allocation', 'حصة الميزانية')}</span>
                      <span className="text-primary">{ch.budgetSharePct}%</span>
                    </div>
                    <ProgressBar value={ch.budgetSharePct} />
                  </div>

                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {t('Primary KPI:', 'المؤشر الرئيسي:')}{' '}
                    {isAr ? ch.primaryKpiAr : ch.primaryKpiEn}
                  </div>

                  <ul className="text-xs text-muted-foreground space-y-1 list-disc ps-4">
                    {(isAr ? ch.tacticsAr : ch.tacticsEn).map((tac, i) => (
                      <li key={i}>{tac}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* 90-Day Phased Execution Roadmap */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              {t(
                '90-Day Phased Execution & Export Pipeline Roadmap',
                'خارطة الطريق التنفيذية لمدة ٩٠ يوماً'
              )}
            </h3>
            <div className="grid md:grid-cols-3 gap-5">
              {kit.roadmap.map((rm, idx) => (
                <Card
                  key={idx}
                  className="p-5 border-t-4 border-t-primary flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Pill tone="purple">{rm.weeks}</Pill>
                      <span className="text-xs font-bold text-muted-foreground">
                        0{idx + 1}
                      </span>
                    </div>
                    <h4 className="font-bold text-base">
                      {isAr ? rm.phaseAr : rm.phaseEn}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isAr ? rm.objectiveAr : rm.objectiveEn}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-bold uppercase text-foreground">
                      {t('Key Deliverables:', 'المخرجات التنفيذية:')}
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc ps-4">
                      {(isAr ? rm.deliverablesAr : rm.deliverablesEn).map(
                        (d, i) => (
                          <li key={i}>{d}</li>
                        )
                      )}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    🎯 {rm.targetMetric}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MARKETING AUTOMATION & CAMPAIGN SCHEDULER */}
      {activeTab === 'AUTOMATION' && (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Workflow className="w-5 h-5 text-primary" />
                {t(
                  'Automated Omnichannel Workflows & Trigger-to-Order Pipelines',
                  'مسارات الأتمتة الذكية وتحويل العملاء المحتملين إلى طلبيات'
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t(
                  'Toggle workflows active, simulate live buyer journeys step-by-step, or copy ready-to-send templates.',
                  'قم بتفعيل المسارات الآلية، أو محاكاة رحلة المشتري خطوة بخطوة، أو نسخ الرسائل الجاهزة.'
                )}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCalendarCsv}
              className="gap-2 font-bold"
            >
              <Download className="w-4 h-4" />
              {t('Export Automation Schedule (.CSV)', 'تصدير جدول الأتمتة (.CSV)')}
            </Button>
          </div>

          {/* Automation Flows */}
          <div className="space-y-6">
            {kit.automations.map((flow) => {
              const isActive = !!activeFlows[flow.id];
              const isSimulating = simulatingFlowId === flow.id;
              return (
                <Card key={flow.id} className="p-6 space-y-5 border-primary/25">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-extrabold">
                          {isAr ? flow.nameAr : flow.nameEn}
                        </h4>
                        <Pill tone={isActive ? 'emerald' : 'gray'}>
                          {isActive
                            ? t('AUTOPILOT ACTIVE', 'الأتمتة مفعلة')
                            : t('PAUSED', 'متوقف مؤقتاً')}
                        </Pill>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ⚡ {isAr ? flow.triggerAr : flow.triggerEn} • 🎯{' '}
                        <span className="font-semibold text-foreground">
                          {flow.conversionGoal}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          triggerWorkflowSimulation(flow.id, flow.steps.length)
                        }
                        className="gap-1.5 font-semibold"
                      >
                        <Zap className="w-4 h-4 text-amber-500" />
                        {isSimulating
                          ? t('Running Simulation...', 'جاري المحاكاة الحية...')
                          : t('Simulate Live Run', 'محاكاة التشغيل الفوري')}
                      </Button>
                      <Button
                        size="sm"
                        variant={isActive ? 'default' : 'outline'}
                        onClick={() =>
                          setActiveFlows((prev) => ({
                            ...prev,
                            [flow.id]: !prev[flow.id],
                          }))
                        }
                      >
                        {isActive
                          ? t('Active ✓', 'مفعّل ✓')
                          : t('Enable Flow', 'تفعيل المسار')}
                      </Button>
                    </div>
                  </div>

                  {/* Step-by-Step Pipeline Nodes */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {flow.steps.map((st, idx) => {
                      const highlighted = isSimulating && simStepIdx === idx;
                      const copyId = `${flow.id}-${idx}`;
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                            highlighted
                              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500 shadow-lg'
                              : 'bg-muted/20'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary">
                                {st.dayOffset}
                              </span>
                              <Pill tone="blue">{st.channel}</Pill>
                            </div>
                            <div className="font-bold text-sm">
                              {isAr ? st.titleAr : st.titleEn}
                            </div>
                            <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed bg-background p-3 rounded-xl border">
                              {isAr ? st.copyAr : st.copyEn}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyText(copyId, isAr ? st.copyAr : st.copyEn)
                            }
                            className="w-full justify-center gap-1.5 text-xs"
                          >
                            {copiedKey === copyId ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                {t('Copied Template!', 'تم نسخ القالب!')}
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                {t('Copy Message Template', 'نسخ نص الرسالة')}
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* 4-Week Automated Campaign Calendar */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {t(
                  '4-Week Automated Omnichannel Publishing Calendar',
                  'تقويم النشر الآلي المتزامن لمدة ٤ أسابيع'
                )}
              </h3>
              <Pill tone="emerald">
                {t('6 Scheduled Drops Ready', '٦ حملات مجدولة جاهزة للنشر')}
              </Pill>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kit.calendar.map((item) => {
                const isPublished = !!publishedCalIds[item.id];
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border bg-card flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-primary">
                          {t(`Week ${item.week}`, `الأسبوع ${item.week}`)} •{' '}
                          {isAr ? item.dayAr : item.dayEn}
                        </span>
                        <Pill tone={isPublished ? 'emerald' : 'blue'}>
                          {item.channel}
                        </Pill>
                      </div>
                      <div className="text-[11px] font-semibold text-muted-foreground">
                        {isAr ? item.formatAr : item.formatEn}
                      </div>
                      <h4 className="font-bold text-sm">
                        {isAr ? item.headlineAr : item.headlineEn}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isAr ? item.captionAr : item.captionEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-emerald-600">
                        {isAr ? item.ctaAr : item.ctaEn}
                      </span>
                      <Button
                        size="sm"
                        variant={isPublished ? 'secondary' : 'outline'}
                        onClick={() =>
                          setPublishedCalIds((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                        className="h-8 text-xs"
                      >
                        {isPublished
                          ? t('Queued / Live ✓', 'تمت الجدولة ✓')
                          : t('Auto-Queue Now', 'جدولة النشر الآلي')}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: PROMO VIDEO & PHOTO STUDIO */}
      {activeTab === 'MEDIA' && (
        <div className="space-y-10">
          {/* Section A: Interactive Promotional Video Player & Storyboard */}
          <Card className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase text-primary flex items-center gap-1.5">
                  <Video className="w-4 h-4" />
                  {t(
                    'AI COMMERCIAL VIDEO PRODUCER & BILINGUAL VOICEOVER PLAYER',
                    'استوديو إنتاج الفيديو الإعلاني والتعليق الصوتي بالذكاء الاصطناعي'
                  )}
                </div>
                <h3 className="text-xl font-extrabold mt-0.5">
                  {isAr ? kit.videoSpec.titleAr : kit.videoSpec.titleEn}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceEnabled((v) => !v)}
                  className="gap-1.5"
                >
                  {voiceEnabled ? (
                    <Volume2 className="w-4 h-4 text-primary" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  )}
                  {voiceEnabled
                    ? t('Voiceover ON', 'التعليق الصوتي مفعل')
                    : t('Muted', 'صامت')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsPlayingVideo((p) => !p)}
                  className="gap-1.5 font-bold"
                >
                  {isPlayingVideo ? (
                    <>
                      <Pause className="w-4 h-4" />
                      {t('Pause Commercial', 'إيقاف مؤقت')}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      {t('Play 30s Commercial', 'تشغيل الإعلان الترويجي')}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Interactive Animated Cinema Canvas */}
            <div
              className="relative rounded-2xl overflow-hidden border-2 shadow-xl min-h-[340px] md:min-h-[380px] flex flex-col justify-between p-6 md:p-10 text-white transition-all duration-700"
              style={{
                background: `radial-gradient(circle at 20% 20%, ${activeVideoScene.accentHex}, ${primaryHex} 70%, #050811 100%)`,
                borderColor: secondaryHex,
              }}
            >
              {/* Top Telemetry Overlay */}
              <div className="flex flex-wrap items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-black/50 border border-white/20">
                    {t(
                      `SCENE 0${activeVideoScene.sceneNumber} / 0${kit.videoSpec.scenes.length}`,
                      `المشهد 0${activeVideoScene.sceneNumber} / 0${kit.videoSpec.scenes.length}`
                    )}
                  </span>
                  <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-full">
                    🎥{' '}
                    {isAr
                      ? activeVideoScene.cameraMovementAr
                      : activeVideoScene.cameraMovementEn}
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-300 bg-black/40 px-3 py-1 rounded-full">
                  🎵 {isAr ? kit.videoSpec.musicMoodAr : kit.videoSpec.musicMoodEn}
                </span>
              </div>

              {/* Center Kinetic Typography & Visual Direction */}
              <div className="my-auto py-6 text-center max-w-3xl mx-auto space-y-4 z-10">
                <div
                  className="inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                  style={{ backgroundColor: secondaryHex, color: '#000' }}
                >
                  {isAr
                    ? activeVideoScene.onScreenTextAr
                    : activeVideoScene.onScreenTextEn}
                </div>
                <h4 className="text-2xl md:text-4xl font-extrabold leading-tight drop-shadow">
                  “
                  {isAr
                    ? activeVideoScene.voiceoverAr
                    : activeVideoScene.voiceoverEn}
                  ”
                </h4>
                <p className="text-xs md:text-sm text-slate-200/90 max-w-2xl mx-auto">
                  {t('Visual Direction:', 'التوجيه البصري للمشهد:')}{' '}
                  {isAr
                    ? activeVideoScene.visualSettingAr
                    : activeVideoScene.visualSettingEn}
                </p>
              </div>

              {/* Scene Selector Timeline Bar */}
              <div className="grid grid-cols-4 gap-2 z-10">
                {kit.videoSpec.scenes.map((sc, idx) => (
                  <button
                    key={sc.sceneNumber}
                    type="button"
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setIsPlayingVideo(false);
                    }}
                    className={`p-2.5 rounded-xl text-start border transition-all ${
                      currentSceneIdx === idx
                        ? 'bg-white/20 border-amber-400 shadow-md'
                        : 'bg-black/40 border-white/15 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-amber-300">
                      {t(`Scene ${sc.sceneNumber}`, `مشهد ${sc.sceneNumber}`)} (
                      {sc.durationSec}s)
                    </div>
                    <div className="text-xs font-semibold truncate">
                      {isAr ? sc.onScreenTextAr : sc.onScreenTextEn}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Section B: AI Product & Lifestyle Photography Artboards */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  {t(
                    'Promotional Photography Artboards & Studio Prompts',
                    'لوحات الصور الإعلانية وصور المنتجات عالية الدقة'
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t(
                    'Switch aspect ratios for Instagram Reels (9:16), Feed Carousels (1:1), or Trade Banner (16:9) and download PNGs.',
                    'بدّل أبعاد الصور بين (9:16 للستوري والريلز) أو (1:1 للمنشورات) أو (16:9 للبنرات) وحمّلها بصيغة PNG.'
                  )}
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl">
                {(['16:9', '1:1', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setPhotoAspect(ratio)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      photoAspect === ratio
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {kit.photoConcepts.map((pc) => (
                <Card key={pc.id} className="overflow-hidden flex flex-col justify-between">
                  {/* Live Visual Photo Artboard */}
                  <div
                    className="p-6 text-white flex flex-col justify-between relative overflow-hidden min-h-[250px]"
                    style={{
                      background: `linear-gradient(135deg, ${pc.primaryHex} 0%, #090D16 100%)`,
                    }}
                  >
                    {/* Subtle geometric weave overlay */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(${pc.secondaryHex} 1.5px, transparent 1.5px)`,
                        backgroundSize: '18px 18px',
                      }}
                    />

                    <div className="flex items-center justify-between z-10">
                      <span
                        className="text-[11px] font-extrabold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: pc.secondaryHex, color: '#000' }}
                      >
                        {isAr ? pc.styleTagAr : pc.styleTagEn}
                      </span>
                      <span className="text-[11px] font-mono bg-black/50 px-2.5 py-1 rounded-md border border-white/15">
                        {photoAspect} HD
                      </span>
                    </div>

                    <div className="my-6 space-y-1.5 z-10">
                      <div className="text-2xl font-extrabold tracking-wide">
                        {isAr ? pc.headlineOverlayAr : pc.headlineOverlayEn}
                      </div>
                      <div className="text-xs font-semibold text-slate-200 tracking-wider">
                        {isAr ? pc.subOverlayAr : pc.subOverlayEn}
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-amber-200/90 z-10">
                      📷 {pc.cameraSpec}
                    </div>
                  </div>

                  {/* Controls & AI Prompt Copy */}
                  <div className="p-4 space-y-3 bg-card">
                    <div className="font-bold text-sm">
                      {isAr ? pc.titleAr : pc.titleEn}
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/40 border text-[11px] text-muted-foreground font-mono line-clamp-2">
                      {pc.aiPromptEn}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => downloadPhotoAsPng(pc)}
                        className="flex-1 gap-1.5 text-xs font-bold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {t('Download High-Res PNG', 'تحميل الصورة PNG')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyText(pc.id, pc.aiPromptEn)}
                        className="gap-1.5 text-xs"
                      >
                        {copiedKey === pc.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            {t('Copied!', 'تم النسخ!')}
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {t('Copy Studio Prompt', 'نسخ وصف التوليد')}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BROCHURES, FLYERS & POSTERS */}
      {activeTab === 'PRINT' && (
        <div className="space-y-6">
          {/* Sub-navigation between Brochure, Flyer, and Roll-Up Poster */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 p-4 rounded-2xl border">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  {
                    id: 'BROCHURE',
                    en: '6-Panel Tri-Fold Brochure',
                    ar: 'بروشور تعريفي ثلاثي الطيات (٦ أوجه)',
                  },
                  {
                    id: 'FLYER',
                    en: 'A4 Promotional Sales Flyer',
                    ar: 'فلاير مبيعات وعروض للمعارض (A4)',
                  },
                  {
                    id: 'POSTER',
                    en: 'Trade-Show Roll-Up Poster (85×200cm)',
                    ar: 'بوستر ورول أب للمعارض الدولية (85×200)',
                  },
                ] as const
              ).map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setPrintSubTab(sub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    printSubTab === sub.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-background hover:bg-muted border'
                  }`}
                >
                  {isAr ? sub.ar : sub.en}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.print()}
                className="gap-1.5 font-semibold"
              >
                <Printer className="w-4 h-4" />
                {t('Print / Save PDF', 'طباعة / حفظ PDF')}
              </Button>
              <Button
                size="sm"
                onClick={() => downloadStandaloneCollateralHtml(printSubTab)}
                className="gap-1.5 font-bold"
              >
                <Download className="w-4 h-4" />
                {t('Download Print-Ready File (.HTML)', 'تحميل ملف التصميم جاهز للطباعة')}
              </Button>
            </div>
          </div>

          {/* 1. 6-PANEL TRI-FOLD BROCHURE */}
          {printSubTab === 'BROCHURE' && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase text-muted-foreground">
                {t(
                  'Live 6-Panel Tri-Fold Corporate & Export Spec Brochure Preview:',
                  'معاينة حية للبروشور الثلاثي الطيات (٦ أوجه كاملة جاهزة للطباعة):'
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {kit.brochurePanels.map((panel) => (
                  <Card
                    key={panel.panelNumber}
                    className="overflow-hidden border-2 flex flex-col justify-between"
                    style={{ borderColor: `${primaryHex}33` }}
                  >
                    <div
                      className="p-4 text-white flex items-center justify-between"
                      style={{ backgroundColor: primaryHex }}
                    >
                      <span className="text-[11px] font-bold tracking-wider uppercase">
                        {isAr ? panel.panelRoleAr : panel.panelRoleEn}
                      </span>
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded"
                        style={{ backgroundColor: secondaryHex, color: '#000' }}
                      >
                        {panel.highlightStat}
                      </span>
                    </div>

                    <div className="p-5 space-y-3 flex-1 bg-card">
                      <h4 className="font-extrabold text-lg text-foreground">
                        {isAr ? panel.titleAr : panel.titleEn}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isAr ? panel.bodyAr : panel.bodyEn}
                      </p>
                      <ul className="space-y-1.5 pt-2 border-t text-xs">
                        {(isAr ? panel.bulletsAr : panel.bulletsEn).map(
                          (b, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="px-5 py-2.5 bg-muted/40 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{isAr ? kit.brandNameAr : kit.brandNameEn}</span>
                      <QrCode className="w-4 h-4 text-primary" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 2. A4 PROMOTIONAL SALES FLYER */}
          {printSubTab === 'FLYER' && (
            <div className="max-w-3xl mx-auto">
              <Card
                className="overflow-hidden border-2 shadow-xl"
                style={{ borderColor: primaryHex }}
              >
                {/* Flyer Hero Header */}
                <div
                  className="p-8 text-white space-y-3"
                  style={{ backgroundColor: primaryHex }}
                >
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wider"
                    style={{ backgroundColor: secondaryHex, color: '#000' }}
                  >
                    {isAr ? kit.flyerSpec.badgeAr : kit.flyerSpec.badgeEn}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">
                    {isAr ? kit.flyerSpec.headlineAr : kit.flyerSpec.headlineEn}
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {isAr
                      ? kit.flyerSpec.subheadlineAr
                      : kit.flyerSpec.subheadlineEn}
                  </p>
                </div>

                {/* Promotional Offer Strip */}
                <div
                  className="px-8 py-3.5 font-extrabold text-xs md:text-sm text-center"
                  style={{ backgroundColor: secondaryHex, color: '#000' }}
                >
                  🎁{' '}
                  {isAr
                    ? kit.flyerSpec.offerHighlightAr
                    : kit.flyerSpec.offerHighlightEn}
                </div>

                {/* Technical Specs Grid */}
                <div className="p-8 bg-card space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {kit.flyerSpec.keySpecs.map((sp, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border bg-muted/20 space-y-1"
                      >
                        <div className="text-xs font-bold text-primary uppercase">
                          {isAr ? sp.labelAr : sp.labelEn}
                        </div>
                        <div className="text-sm font-extrabold text-foreground">
                          {isAr ? sp.valueAr : sp.valueEn}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certifications Row */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {kit.certificationsBadges.map((cb) => (
                      <span
                        key={cb}
                        className="text-xs font-bold px-3 py-1 rounded-full border bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {cb}
                      </span>
                    ))}
                  </div>

                  {/* Bottom QR & Call to Action */}
                  <div className="p-5 rounded-2xl border-2 border-dashed flex flex-wrap items-center justify-between gap-4 bg-muted/30">
                    <div className="space-y-1 max-w-lg">
                      <div className="font-extrabold text-base text-foreground">
                        {isAr ? kit.flyerSpec.ctaAr : kit.flyerSpec.ctaEn}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {kit.flyerSpec.contactLine}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white text-slate-900 border shadow-xs flex flex-col items-center">
                      <QrCode className="w-12 h-12" />
                      <span className="text-[9px] font-mono font-bold mt-1">
                        EU DPP & SWATCH
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 3. TRADE-SHOW ROLL-UP POSTER (85×200 cm) */}
          {printSubTab === 'POSTER' && (
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {(
                  [
                    { id: 'DARK_GOLD', en: 'Executive Dark & Gold', ar: 'كحلي ملكي وذهبي' },
                    { id: 'EMERALD_ECO', en: 'Emerald Sustainability', ar: 'أخضر زمردي مستدام' },
                    { id: 'ROYAL_BLUE', en: 'Mediterranean Cobalt', ar: 'أزرق متوسطي' },
                  ] as const
                ).map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setPosterTheme(th.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      posterTheme === th.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'bg-card'
                    }`}
                  >
                    {isAr ? th.ar : th.en}
                  </button>
                ))}
              </div>

              <div className="max-w-xl mx-auto">
                <div
                  className="rounded-3xl p-8 md:p-12 text-white border-4 shadow-2xl text-center space-y-8"
                  style={{
                    backgroundColor:
                      posterTheme === 'EMERALD_ECO'
                        ? '#064E3B'
                        : posterTheme === 'ROYAL_BLUE'
                        ? '#1E3A8A'
                        : primaryHex,
                    borderColor: secondaryHex,
                  }}
                >
                  <div className="space-y-1">
                    <div
                      className="text-xs font-extrabold tracking-widest uppercase"
                      style={{ color: secondaryHex }}
                    >
                      {isAr
                        ? kit.posterSpec.exhibitionNameAr
                        : kit.posterSpec.exhibitionNameEn}
                    </div>
                    <div className="inline-block px-4 py-1 rounded-full bg-white/15 text-xs font-mono font-bold">
                      📍 {kit.posterSpec.boothNumber}
                    </div>
                  </div>

                  {/* Crest */}
                  <div
                    className="w-24 h-24 rounded-full border-4 mx-auto flex items-center justify-center text-3xl font-extrabold font-serif shadow-lg"
                    style={{ borderColor: secondaryHex, color: secondaryHex }}
                  >
                    {kit.logoStyle.monogram}
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-wider uppercase">
                      {isAr
                        ? kit.posterSpec.heroStatementAr
                        : kit.posterSpec.heroStatementEn}
                    </h2>
                    <p className="text-sm md:text-base text-slate-200 max-w-md mx-auto leading-relaxed">
                      {isAr
                        ? kit.posterSpec.subStatementAr
                        : kit.posterSpec.subStatementEn}
                    </p>
                  </div>

                  {/* 4 Key Metric Pillars */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {kit.posterSpec.pillars.map((pil, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-black/30 border"
                        style={{ borderColor: `${secondaryHex}66` }}
                      >
                        <div
                          className="text-xl font-extrabold"
                          style={{ color: secondaryHex }}
                        >
                          {pil.metric}
                        </div>
                        <div className="text-xs text-slate-100 mt-1 font-medium">
                          {isAr ? pil.titleAr : pil.titleEn}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom QR Booth Callout */}
                  <div
                    className="p-5 rounded-2xl flex items-center justify-between gap-4 text-start"
                    style={{ backgroundColor: secondaryHex, color: '#000' }}
                  >
                    <div className="text-xs font-extrabold leading-relaxed">
                      {isAr
                        ? kit.posterSpec.footerCalloutAr
                        : kit.posterSpec.footerCalloutEn}
                    </div>
                    <div className="p-2 bg-white rounded-xl shrink-0">
                      <QrCode className="w-12 h-12 text-slate-900" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: AI CMO COPYWRITER & GROWTH COPILOT */}
      {activeTab === 'CMO_AI' && (
        <Card className="p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                {t(
                  'AI Chief Marketing Officer (CMO) — Custom Copy, Outreach & Translation',
                  'المستشار التسويقي الذكي (AI CMO) — صياغة الإعلانات ومراسلات التصدير'
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t(
                  `Context-aware for ${kit.brandNameEn} ("${kit.topicEn}"). Click a quick prompt or ask anything.`,
                  `مرتبط تلقائياً بهوية علامة ${kit.brandNameAr} ومنتجاتها. اختر أمراً سريعاً أو اكتب طلبك.`
                )}
              </p>
            </div>
            <Pill tone="emerald">{t('Bilingual EN / AR / EU', 'ثنائي اللغة + تصدير')}</Pill>
          </div>

          {/* Quick CMO Prompts */}
          <div className="flex flex-wrap gap-2">
            {[
              {
                en: 'Write a high-converting LinkedIn message to a German retail buyer offering our free DHL Swatch Box',
                ar: 'اكتب رسالة احترافية عبر LinkedIn لمدير مشتريات في ألمانيا لعرض صندوق العينات المجاني عبر DHL',
              },
              {
                en: 'Create 5 viral Instagram Reel scripts showcasing our El-Mahalla mill quality & spectrophotometer testing',
                ar: 'اكتب ٥ سيناريوهات لفيديوهات Instagram Reels تبرز جودة مصنعنا بالمحلة واختبارات الألوان المعملية',
              },
              {
                en: 'Write an official invitation email for buyers to visit our booth at Heimtextil Frankfurt',
                ar: 'اكتب دعوة رسمية عبر البريد الإلكتروني للمشترين لزيارة جناحنا في معرض هايم تكستيل فرانكفورت',
              },
            ].map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendCmoMessage(isAr ? qp.ar : qp.en)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border bg-muted/40 hover:border-primary hover:bg-primary/5 transition-all"
              >
                ✨ {isAr ? qp.ar : qp.en}
              </button>
            ))}
          </div>

          {/* Chat Feed */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto p-4 rounded-2xl border bg-muted/15">
            {cmoMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground ms-auto max-w-xl'
                    : 'bg-card border max-w-3xl'
                }`}
              >
                {m.text}
              </div>
            ))}
            {cmoLoading && (
              <div className="text-xs text-muted-foreground animate-pulse px-2">
                {t('AI CMO is drafting your campaign copy...', 'جاري صياغة المحتوى التسويقي...')}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={cmoPrompt}
              onChange={(e) => setCmoPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendCmoMessage()}
              placeholder={t(
                'Ask your AI CMO to write ad copy, buyer emails, press releases, or trade-show pitches...',
                'اطلب من المستشار التسويقي كتابة إعلان، بريد إلكتروني للمشترين، أو خطة ترويجية...'
              )}
              className="flex-1 h-11 rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={() => sendCmoMessage()}
              disabled={cmoLoading}
              className="h-11 px-6 rounded-xl font-bold gap-2"
            >
              <Send className="w-4 h-4" />
              {t('Generate Copy', 'توليد النص')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default BrandMarketingStudioClient;
