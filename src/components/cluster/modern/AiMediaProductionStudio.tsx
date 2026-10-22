'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { tr } from '@/lib/i18n-inline';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/cluster/ui';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';
import {
  Sparkles,
  Camera,
  Video,
  Wand2,
  Building2,
  Target,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Layers,
  ShieldCheck,
  Cpu,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export type MediaPurposeId =
  | 'B2B_BUYER_PITCH'
  | 'TRADE_SHOW_BOOTH'
  | 'MACRO_SWATCH_SHOWCASE'
  | 'FACTORY_TOUR_OEE'
  | 'SOCIAL_MEDIA_AD'
  | 'ESG_CBAM_DPP'
  | 'ACADEMY_SOP_TRAINING'
  | 'PRODUCT_CATALOG_HERO';

export type FreeImageModelId =
  | 'flux-schnell'
  | 'flux-realism'
  | 'sdxl-turbo'
  | 'imagen-3-bridge';

export type FreeVideoModelId =
  | 'veo-2'
  | 'wan-2.1-t2v'
  | 'hunyuan-video'
  | 'cogvideox-5b';

interface CompanyProfilePreset {
  id: string;
  nameEn: string;
  nameAr: string;
  specialtyEn: string;
  specialtyAr: string;
  certifications: string;
  targetMarketEn: string;
  targetMarketAr: string;
  primaryHex: string;
  accentHex: string;
  defaultPromptEn: string;
  defaultPromptAr: string;
}

const COMPANY_PRESETS: CompanyProfilePreset[] = [
  {
    id: 'misr-sateen',
    nameEn: 'Misr Heritage Spinning & Weaving (El-Mahalla)',
    nameAr: 'شركة مصر التراثية للغزل والنسيج (المحلة الكبرى)',
    specialtyEn: '100% Extra-Long Staple Giza 86/94 Compact-Spun Sateen Bedlinen (400–600 TC)',
    specialtyAr: 'مفروشات ساتان فندقية فاخرة ١٠٠٪ قطن جيزة ٨٦/٩٤ طويل التيلة (400–600 غرزة)',
    certifications: 'OEKO-TEX® Made in Green, GOTS Organic, ISO 17025 Lab, EUR.1 0% EU Duty',
    targetMarketEn: 'Germany, Switzerland, France & UK 5-Star Hospitality Chains',
    targetMarketAr: 'سلاسل الفنادق ٥ نجوم في ألمانيا وسويسرا وفرنسا وبريطانيا',
    primaryHex: '#064E3B',
    accentHex: '#D97706',
    defaultPromptEn:
      'Luxury 400 thread count Egyptian Giza 86 optical white and champagne gold sateen hotel bedlinen draped in a sunlit European suite with macro weave sheen',
    defaultPromptAr:
      'طقم سرير فندقي فاخر من ساتان قطن جيزة ٨٦ (400 غرزة) باللون الأبيض الناصع والذهبي الهادئ داخل جناح فندقي أوروبي مشرق',
  },
  {
    id: 'rowad-dyehouse',
    nameEn: 'Al-Rowad ZDHC Level 3 Reactive Dyeing & Finishing',
    nameAr: 'الرواد للصباغة النشطة والتجهيز المستدام (ZDHC Level 3)',
    specialtyEn: 'Low-Liquor 1:5.5 Airflow Reactive Dyeing, Spectrophotometer ΔE ≤ 0.5 & 70% ZLD Water Recycling',
    specialtyAr: 'صباغة نشطة منخفضة المنسوب 1:5.5 ومطابقة لونية بالمطياف ΔE ≤ 0.5 وتدوير مياه 70%',
    certifications: 'ZDHC MRSL v3.1 Level 3, ISO 14001, OEKO-TEX® Standard 100, EU CBAM Verified',
    targetMarketEn: 'Scandinavian, Italian & Dutch Sustainable Apparel Brands',
    targetMarketAr: 'علامات الأزياء المستدامة في إيطاليا وهولندا والدول الإسكندنافية',
    primaryHex: '#0D9488',
    accentHex: '#F59E0B',
    defaultPromptEn:
      'High-tech textile dyehouse laboratory with Datacolor spectrophotometer matching vibrant emerald and indigo reactive-dyed cotton fabric rolls',
    defaultPromptAr:
      'معمل صباغة حديث مزود بجهاز مطياف الألوان Datacolor مع رولات قماش قطني مصبوغة بدرجات الزمردي والنيلي فائقة الثبات',
  },
  {
    id: 'delta-knitwear',
    nameEn: 'Delta Compact Combed Jersey & Interlock Mills',
    nameAr: 'مصانع الدلتا للتريكو الدائري والجيرسيه المدمج',
    specialtyEn: 'Ne 40/1 Bio-Polished Compact Jersey & Piqué (180–240 GSM) with < 2% Spirality',
    specialtyAr: 'أقمشة جيرسيه وبيكيه قطن ممشط معالج بالإنزيمات (180–240 جم/م²) بانكماش أقل من 2%',
    certifications: 'GOTS Certified, BSCI / SMETA 4-Pillar, QIZ 0% USA Duty, EU DPP',
    targetMarketEn: 'USA Private-Label Activewear & European Premium Casualwear',
    targetMarketAr: 'علامات الملابس الكاجوال والرياضية في الولايات المتحدة وأوروبا',
    primaryHex: '#1E1B4B',
    accentHex: '#10B981',
    defaultPromptEn:
      'Macro studio showcase of bio-polished compact combed Egyptian cotton jersey knit fabric in deep navy and sage green alongside automated Mayer & Cie circular knitting machines',
    defaultPromptAr:
      'عرض استوديو ماكرو لقماش تريكو جيرسيه قطن مصري ممشط ناعم الملمس باللون الكحلي والأخضر مع ماكينات التريكو الدائرية الحديثة',
  },
  {
    id: 'royal-terry',
    nameEn: 'El-Mahalla Royal Jacquard Terry & Spa Towels',
    nameAr: 'المحلة رويال للفوط الجاكار والوبريات الفندقية (650 GSM)',
    specialtyEn: 'Zero-Twist Hydro-Cotton Jacquard Terry Towels & Bathrobes (550–650 GSM, < 2.2s Absorbency)',
    specialtyAr: 'فوط وبشاكير جاكار فندقية فائقة الامتصاص بدون برم (550–650 جم/م²)',
    certifications: 'OEKO-TEX® Class I, ISO 9001, GRS Recycled Border Option, EUR.1',
    targetMarketEn: 'Mediterranean Wellness Resorts, Cruise Lines & Gulf 5-Star Spas',
    targetMarketAr: 'المنتجعات الصحية والفنادق الفاخرة في البحر المتوسط والخليج وأوروبا',
    primaryHex: '#1E293B',
    accentHex: '#38BDF8',
    defaultPromptEn:
      'Plush 650 GSM zero-twist Egyptian cotton jacquard spa towels stacked on natural travertine stone beside an infinity pool with macro loop detail',
    defaultPromptAr:
      'فوط سبا فاخرة 650 جم/م² من قطن جيزة المصري بتصميم جاكار بارز مرتبة على رخام طبيعي في منتجع صحي فاخر',
  },
];

const PURPOSE_OPTIONS: {
  id: MediaPurposeId;
  en: string;
  ar: string;
  descEn: string;
  descAr: string;
  recommendedRatio: '16:9' | '9:16' | '1:1' | '4:5';
}[] = [
  {
    id: 'B2B_BUYER_PITCH',
    en: 'B2B Buyer Pitch & RFQ Proposal',
    ar: 'عرض المشترين الدوليين ومناقصات التصدير',
    descEn: 'Highlights mill capacity, 0% EUR.1/QIZ duty, and Six Sigma QC.',
    descAr: 'يبرز الطاقة الإنتاجية والإعفاء الجمركي 0% وشهادات الجودة.',
    recommendedRatio: '16:9',
  },
  {
    id: 'MACRO_SWATCH_SHOWCASE',
    en: '100mm Macro Swatch & Weave Physics',
    ar: 'تصوير ماكرو لتركيب النسيج والغزل',
    descEn: 'Extreme close-up of yarn twist, sateen luster, and Pantone TCX.',
    descAr: 'لقطات مقربة جداً لانتظام الشعيرات ولمعة الساتان وتطابق اللون.',
    recommendedRatio: '1:1',
  },
  {
    id: 'TRADE_SHOW_BOOTH',
    en: 'Heimtextil / Première Vision Booth',
    ar: 'بوستر وجناح المعارض الدولية (Heimtextil)',
    descEn: 'Exhibition stand visuals, roll-up banners & VIP buyer invite.',
    descAr: 'تصميمات أجنحة المعارض الدولية ورول أب ودعوات المشترين.',
    recommendedRatio: '9:16',
  },
  {
    id: 'FACTORY_TOUR_OEE',
    en: 'Factory Tour, Loom OEE & Lab Documentary',
    ar: 'فيلم وثائقي لخطوط الإنتاج ومعمل الفحص',
    descEn: 'Showcases automated air-jet looms, spectrophotometer & 5S.',
    descAr: 'يستعرض الماكينات الأوتوماتيكية ومعمل الأيزو 17025 وكفاءة OEE.',
    recommendedRatio: '16:9',
  },
  {
    id: 'SOCIAL_MEDIA_AD',
    en: 'LinkedIn B2B Ad & Instagram Viral Reel',
    ar: 'إعلان ممول LinkedIn وفيديو Reels',
    descEn: 'High-converting hook, verified proof pillars & direct CTA.',
    descAr: 'تصميم إعلاني خاطف للانتباه مع ركائز الثقة ودعوة تواصل.',
    recommendedRatio: '4:5',
  },
  {
    id: 'ESG_CBAM_DPP',
    en: 'Sustainability, ZLD Water & EU DPP Proof',
    ar: 'الاستدامة وتدوير المياه وجواز المنتج DPP',
    descEn: 'Solar PPA, closed-loop water recycling & SHA-256 QR passport.',
    descAr: 'الطاقة الشمسية وتدوير المياه وجواز المنتج الرقمي الأوروبي.',
    recommendedRatio: '16:9',
  },
  {
    id: 'ACADEMY_SOP_TRAINING',
    en: 'Shop-Floor SOP & Lean Visual Training',
    ar: 'تدريب بصري لإجراءات العمل القياسية SOP',
    descEn: 'Instructional visuals for SMED, Poka-Yoke & 4-Point inspection.',
    descAr: 'وسائط تعليمية لتدريب الفنيين على التشغيل القياسي وفحص الجودة.',
    recommendedRatio: '16:9',
  },
  {
    id: 'PRODUCT_CATALOG_HERO',
    en: 'Luxury Hospitality & Lookbook Catalog',
    ar: 'كتالوج الفنادق والمنتجات النهائية الفاخرة',
    descEn: 'Editorial 5-star hotel room or apparel collection showcase.',
    descAr: 'تصوير كتالوجات المفروشات الفندقية والأزياء الجاهزة للتصدير.',
    recommendedRatio: '4:5',
  },
];

const FREE_IMAGE_MODELS: { id: FreeImageModelId; labelEn: string; labelAr: string; badge: string }[] = [
  {
    id: 'flux-schnell',
    labelEn: 'FLUX.1-Schnell (Free Photorealistic Commercial AI)',
    labelAr: 'نموذج FLUX.1-Schnell (توليد فوتوغرافي واقعي مجاني)',
    badge: 'Best Overall',
  },
  {
    id: 'flux-realism',
    labelEn: 'FLUX-Realism Macro (100mm Fiber & Weave Specialist)',
    labelAr: 'نموذج FLUX-Realism (متخصص تفاصيل الألياف والماكرو)',
    badge: 'Macro 8K',
  },
  {
    id: 'sdxl-turbo',
    labelEn: 'SDXL Turbo Lightning (Instant Concept Storyboard)',
    labelAr: 'نموذج SDXL Turbo (توليد فائق السرعة للكادرات)',
    badge: 'Ultra Fast',
  },
  {
    id: 'imagen-3-bridge',
    labelEn: 'Google Imagen 3 / ImageFX + Studio Canvas',
    labelAr: 'محرك Google Imagen 3 / ImageFX + استوديو التصميم',
    badge: 'Google Labs',
  },
];

const FREE_VIDEO_MODELS: { id: FreeVideoModelId; labelEn: string; labelAr: string; badge: string }[] = [
  {
    id: 'veo-2',
    labelEn: 'Google Veo 2 / VideoFX + Live HTML5 WebM Studio Producer',
    labelAr: 'محرك Google Veo 2 + منتج الفيديو المباشر بصيغة WebM HD',
    badge: 'Cinema 24/30fps',
  },
  {
    id: 'wan-2.1-t2v',
    labelEn: 'Alibaba Wan 2.1 14B Open-Source T2V + Live Studio Renderer',
    labelAr: 'نموذج Wan 2.1 14B مفتوح المصدر + رندر الفيديو المباشر',
    badge: 'Open-Weight #1',
  },
  {
    id: 'hunyuan-video',
    labelEn: 'Tencent HunyuanVideo 60fps Fabric Physics + Live Renderer',
    labelAr: 'نموذج HunyuanVideo لحركة الأقمشة الواقعية + رندر مباشر',
    badge: 'Cloth Physics',
  },
  {
    id: 'cogvideox-5b',
    labelEn: 'THUDM CogVideoX-5B Industrial Motion + Live Renderer',
    labelAr: 'نموذج CogVideoX-5B للتصوير الصناعي + رندر مباشر',
    badge: 'Industrial',
  },
];

export function AiMediaProductionStudio({
  locale,
  defaultPurpose = 'B2B_BUYER_PITCH',
  defaultCompanyName,
  defaultPrompt,
}: {
  locale: string;
  defaultPurpose?: MediaPurposeId;
  defaultCompanyName?: string;
  defaultPrompt?: string;
}) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  // Company & Purpose State
  const [selectedPresetId, setSelectedPresetId] = useState<string>(COMPANY_PRESETS[0].id);
  const [companyName, setCompanyName] = useState<string>(
    defaultCompanyName || (isAr ? COMPANY_PRESETS[0].nameAr : COMPANY_PRESETS[0].nameEn)
  );
  const [companySpecialty, setCompanySpecialty] = useState<string>(
    isAr ? COMPANY_PRESETS[0].specialtyAr : COMPANY_PRESETS[0].specialtyEn
  );
  const [certifications, setCertifications] = useState<string>(COMPANY_PRESETS[0].certifications);
  const [targetMarket, setTargetMarket] = useState<string>(
    isAr ? COMPANY_PRESETS[0].targetMarketAr : COMPANY_PRESETS[0].targetMarketEn
  );
  const [primaryColorHex, setPrimaryColorHex] = useState<string>(COMPANY_PRESETS[0].primaryHex);
  const [accentColorHex, setAccentColorHex] = useState<string>(COMPANY_PRESETS[0].accentHex);

  const [purposeId, setPurposeId] = useState<MediaPurposeId>(defaultPurpose);
  const [prompt, setPrompt] = useState<string>(
    defaultPrompt || (isAr ? COMPANY_PRESETS[0].defaultPromptAr : COMPANY_PRESETS[0].defaultPromptEn)
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('16:9');
  const [imageModelId, setImageModelId] = useState<FreeImageModelId>('flux-schnell');
  const [videoModelId, setVideoModelId] = useState<FreeVideoModelId>('veo-2');
  const [preferredLlm, setPreferredLlm] = useState<string>('auto');

  // Workspace Mode: 'BOTH' | 'IMAGES' | 'VIDEO'
  const [workspaceTab, setWorkspaceTab] = useState<'BOTH' | 'IMAGES' | 'VIDEO'>('BOTH');
  const [showBrandedOverlay, setShowBrandedOverlay] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generated Payload State
  const [productionData, setProductionData] = useState<any | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Video Player & WebM Recorder State
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [voiceMuted, setVoiceMuted] = useState<boolean>(false);
  const [isRecordingWebm, setIsRecordingWebm] = useState<boolean>(false);
  const [recordingProgressPct, setRecordingProgressPct] = useState<number>(0);

  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedSceneImagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Trigger initial generation on mount
  const runGeneration = useCallback(
    async (overrideSeed?: number, customPreset?: CompanyProfilePreset) => {
      setLoading(true);
      try {
        const cName = customPreset
          ? isAr
            ? customPreset.nameAr
            : customPreset.nameEn
          : companyName;
        const cSpec = customPreset
          ? isAr
            ? customPreset.specialtyAr
            : customPreset.specialtyEn
          : companySpecialty;
        const cCerts = customPreset ? customPreset.certifications : certifications;
        const cMarket = customPreset
          ? isAr
            ? customPreset.targetMarketAr
            : customPreset.targetMarketEn
          : targetMarket;
        const cPrimary = customPreset ? customPreset.primaryHex : primaryColorHex;
        const cAccent = customPreset ? customPreset.accentHex : accentColorHex;
        const cPrompt = customPreset
          ? isAr
            ? customPreset.defaultPromptAr
            : customPreset.defaultPromptEn
          : prompt;

        const res = await fetch('/api/cluster/media-studio/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: cName,
            companySpecialty: cSpec,
            certifications: cCerts,
            targetMarket: cMarket,
            primaryColorHex: cPrimary,
            accentColorHex: cAccent,
            purposeId,
            prompt: cPrompt,
            aspectRatio,
            imageModelId,
            videoModelId,
            preferredLlm,
            seed: overrideSeed,
            locale,
          }),
        });
        const data = await res.json();
        if (data && data.images) {
          setProductionData(data);
          setActiveSceneIdx(0);
          setSceneProgress(0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [
      companyName,
      companySpecialty,
      certifications,
      targetMarket,
      primaryColorHex,
      accentColorHex,
      purposeId,
      prompt,
      aspectRatio,
      imageModelId,
      videoModelId,
      preferredLlm,
      locale,
      isAr,
    ]
  );

  useEffect(() => {
    runGeneration(420860);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload AI keyframe images into HTMLImageElement cache for smooth canvas rendering
  useEffect(() => {
    if (!productionData?.videoStoryboard?.scenes) return;
    productionData.videoStoryboard.scenes.forEach((sc: any) => {
      if (sc.keyframeUrl && !loadedSceneImagesRef.current[sc.keyframeUrl]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = sc.keyframeUrl;
        img.onload = () => {
          loadedSceneImagesRef.current[sc.keyframeUrl] = img;
        };
      }
    });
  }, [productionData]);

  // Speak scene voiceover when playing
  const speakSceneVoiceover = useCallback(
    (scene: any) => {
      if (voiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const text = isAr ? scene.voiceoverAr : scene.voiceoverEn;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = isAr ? 'ar-EG' : 'en-US';
        utter.rate = 1.02;
        window.speechSynthesis.speak(utter);
      } catch {
        // ignore speech synthesis errors
      }
    },
    [voiceMuted, isAr]
  );

  // Advance video scenes & progress timer when playing
  useEffect(() => {
    if (!isPlayingVideo || !productionData?.videoStoryboard?.scenes) return;
    const scenes = productionData.videoStoryboard.scenes;
    speakSceneVoiceover(scenes[activeSceneIdx] || scenes[0]);

    const stepMs = 80;
    const sceneDurationMs = 4000;
    const timer = setInterval(() => {
      setSceneProgress((prev) => {
        const next = prev + (stepMs / sceneDurationMs) * 100;
        if (next >= 100) {
          setActiveSceneIdx((sIdx) => {
            const nextScene = (sIdx + 1) % scenes.length;
            speakSceneVoiceover(scenes[nextScene]);
            return nextScene;
          });
          return 0;
        }
        return next;
      });
    }, stepMs);

    return () => {
      clearInterval(timer);
    };
  }, [isPlayingVideo, activeSceneIdx, productionData, speakSceneVoiceover]);

  // Draw current video frame onto HTML5 Canvas (60fps-ready cinema renderer)
  const drawCinemaFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      scene: any,
      progressPct: number,
      sceneIndex: number,
      totalScenes: number
    ) => {
      const w = canvas.width;
      const h = canvas.height;
      const tNorm = Math.max(0, Math.min(1, progressPct / 100));

      // 1. Background Gradient + Procedural Weave Texture
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, primaryColorHex || '#064E3B');
      bgGrad.addColorStop(0.55, '#0F172A');
      bgGrad.addColorStop(1, '#1E1B4B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. If AI Keyframe Image is loaded, draw with Ken Burns camera motion
      const cachedImg = scene?.keyframeUrl
        ? loadedSceneImagesRef.current[scene.keyframeUrl]
        : null;
      if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
        ctx.save();
        let scale = 1.05 + tNorm * 0.12;
        let offsetX = 0;
        let offsetY = 0;
        if (scene.cameraMotion === 'ZOOM_OUT') {
          scale = 1.18 - tNorm * 0.12;
        } else if (scene.cameraMotion === 'PAN_RIGHT') {
          scale = 1.14;
          offsetX = (tNorm - 0.5) * w * 0.08;
        } else if (scene.cameraMotion === 'PAN_LEFT') {
          scale = 1.14;
          offsetX = (0.5 - tNorm) * w * 0.08;
        }
        ctx.translate(w / 2 + offsetX, h / 2 + offsetY);
        ctx.scale(scale, scale);
        ctx.drawImage(cachedImg, -w / 2, -h / 2, w, h);
        ctx.restore();

        // Dark cinematic gradient vignette for broadcast text legibility
        const vig = ctx.createLinearGradient(0, 0, 0, h);
        vig.addColorStop(0, 'rgba(9, 14, 28, 0.68)');
        vig.addColorStop(0.45, 'rgba(9, 14, 28, 0.22)');
        vig.addColorStop(0.75, 'rgba(9, 14, 28, 0.78)');
        vig.addColorStop(1, 'rgba(9, 14, 28, 0.94)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);
      } else {
        // Crisp Procedural Textile Micro-Weave & Studio Spotlight Backdrop
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        const drift = tNorm * 40;
        for (let x = -40; x < w + 40; x += 24) {
          ctx.beginPath();
          ctx.moveTo(x + drift, 0);
          ctx.lineTo(x + drift, h);
          ctx.stroke();
        }
        for (let y = -40; y < h + 40; y += 24) {
          ctx.beginPath();
          ctx.moveTo(0, y + drift * 0.5);
          ctx.lineTo(w, y + drift * 0.5);
          ctx.stroke();
        }
        // Glowing accent orb
        const radGrad = ctx.createRadialGradient(
          w * (0.3 + tNorm * 0.4),
          h * 0.4,
          20,
          w * 0.5,
          h * 0.5,
          w * 0.65
        );
        radGrad.addColorStop(0, `${accentColorHex}55`);
        radGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      if (!showBrandedOverlay) return;

      // 3. Top Broadcast Header Bar (Company Crest + KPI Badge + Scene Indicator)
      const pad = Math.round(w * 0.045);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.beginPath();
      ctx.roundRect(pad, pad * 0.75, w - pad * 2, 54, 14);
      ctx.fill();
      ctx.strokeStyle = `${accentColorHex}88`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Company Color Dot + Name
      ctx.fillStyle = accentColorHex || '#D97706';
      ctx.beginPath();
      ctx.arc(pad + 26, pad * 0.75 + 27, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(companyName.slice(0, 42), pad + 44, pad * 0.75 + 33);

      // Right KPI Badge
      const kpiText = (isAr ? scene?.kpiBadgeAr : scene?.kpiBadgeEn) || 'ISO 17025 • EU DPP';
      ctx.fillStyle = primaryColorHex || '#064E3B';
      const badgeW = Math.min(340, ctx.measureText(kpiText).width + 36);
      ctx.beginPath();
      ctx.roundRect(w - pad - badgeW - 12, pad * 0.75 + 10, badgeW, 34, 10);
      ctx.fill();
      ctx.fillStyle = '#ECFDF5';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(kpiText, w - pad - badgeW / 2 - 12, pad * 0.75 + 32);

      // 4. Lower-Third Broadcast Graphics Card
      const cardH = Math.round(h * 0.26);
      const cardY = h - cardH - pad;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.roundRect(pad, cardY, w - pad * 2, cardH, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Accent Left Strip
      ctx.fillStyle = accentColorHex || '#D97706';
      ctx.beginPath();
      ctx.roundRect(pad, cardY, 10, cardH, [18, 0, 0, 18]);
      ctx.fill();

      // Scene Camera Motion Tag
      const motionLabel = isAr ? scene?.cameraMotionLabelAr : scene?.cameraMotionLabelEn;
      ctx.fillStyle = accentColorHex || '#F59E0B';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(
        `SCENE 0${sceneIndex + 1}/0${totalScenes} • ${motionLabel || 'CINEMA SHOT'}`,
        pad + 28,
        cardY + 30
      );

      // Scene Headline
      const headline = (isAr ? scene?.headlineAr : scene?.headlineEn) || prompt;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(headline.slice(0, 68), pad + 28, cardY + 64);
      if (headline.length > 68) {
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(headline.slice(68, 136), pad + 28, cardY + 92);
      }

      // Subline & Certifications
      const subline = (isAr ? scene?.sublineAr : scene?.sublineEn) || certifications;
      ctx.fillStyle = '#94A3B8';
      ctx.font = '15px sans-serif';
      ctx.fillText(subline.slice(0, 85), pad + 28, cardY + cardH - 42);

      // Voiceover Subtitle Bar
      const vo = (isAr ? scene?.voiceoverAr : scene?.voiceoverEn) || '';
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'italic 14px sans-serif';
      ctx.fillText(`🎙️ "${vo.slice(0, 96)}${vo.length > 96 ? '...' : ''}"`, pad + 28, cardY + cardH - 16);

      // Bottom Progress Bar across total video
      const totalPct = ((sceneIndex + tNorm) / totalScenes) * (w - pad * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(pad, h - 12, w - pad * 2, 5);
      ctx.fillStyle = accentColorHex || '#10B981';
      ctx.fillRect(pad, h - 12, totalPct, 5);
    },
    [companyName, certifications, primaryColorHex, accentColorHex, prompt, showBrandedOverlay, isAr]
  );

  // Render canvas frame whenever scene or progress updates
  useEffect(() => {
    const canvas = videoCanvasRef.current;
    if (!canvas || !productionData?.videoStoryboard?.scenes) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const scenes = productionData.videoStoryboard.scenes;
    const currentScene = scenes[activeSceneIdx] || scenes[0];
    drawCinemaFrame(ctx, canvas, currentScene, sceneProgress, activeSceneIdx, scenes.length);
  }, [productionData, activeSceneIdx, sceneProgress, drawCinemaFrame]);

  // Download Branded HD Image (.png) for any of the 4 camera angles
  const handleDownloadBrandedImagePng = async (imgSpec: any, index: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = imgSpec.width || 1280;
    canvas.height = imgSpec.height || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Try drawing the live AI image if CORS permits, otherwise procedural backdrop
    const fakeScene = {
      keyframeUrl: imgSpec.imageUrl,
      cameraMotion: 'ZOOM_IN',
      cameraMotionLabelEn: imgSpec.lens,
      cameraMotionLabelAr: imgSpec.lens,
      headlineEn: isAr ? imgSpec.titleAr : imgSpec.titleEn,
      headlineAr: imgSpec.titleAr,
      sublineEn: `${companyName} • ${companySpecialty}`,
      sublineAr: `${companyName} • ${companySpecialty}`,
      voiceoverEn: `Target Market: ${targetMarket} | Verified: ${certifications}`,
      voiceoverAr: `السوق المستهدف: ${targetMarket} | الشهادات: ${certifications}`,
      kpiBadgeEn: imgSpec.badgeEn,
      kpiBadgeAr: imgSpec.badgeAr,
    };

    drawCinemaFrame(ctx, canvas, fakeScene, 35, index, 4);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-angle-${index + 1}.png`;
    a.click();
  };

  // Record & Download Real Multi-Scene HD Video (.webm) using MediaRecorder API
  const handleRecordAndDownloadWebm = async () => {
    const canvas = videoCanvasRef.current;
    if (!canvas || !productionData?.videoStoryboard?.scenes || isRecordingWebm) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsPlayingVideo(false);
    setIsRecordingWebm(true);
    setRecordingProgressPct(0);

    try {
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 4500000,
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const donePromise = new Promise<void>((resolve) => {
        recorder.onstop = () => resolve();
      });

      recorder.start(100);

      const scenes = productionData.videoStoryboard.scenes;
      const framesPerScene = 45; // 1.5s per scene at 30fps for fast 7.5s HD export
      const totalFrames = scenes.length * framesPerScene;

      for (let s = 0; s < scenes.length; s++) {
        setActiveSceneIdx(s);
        for (let f = 0; f < framesPerScene; f++) {
          const pct = (f / framesPerScene) * 100;
          setSceneProgress(pct);
          drawCinemaFrame(ctx, canvas, scenes[s], pct, s, scenes.length);
          const overallFrame = s * framesPerScene + f + 1;
          setRecordingProgressPct(Math.round((overallFrame / totalFrames) * 100));
          await new Promise((r) => setTimeout(r, 33));
        }
      }

      recorder.stop();
      await donePromise;

      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${purposeId.toLowerCase()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('WebM recording error:', e);
    } finally {
      setIsRecordingWebm(false);
      setRecordingProgressPct(0);
    }
  };

  const copyText = (key: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleSelectCompanyPreset = (preset: CompanyProfilePreset) => {
    setSelectedPresetId(preset.id);
    setCompanyName(isAr ? preset.nameAr : preset.nameEn);
    setCompanySpecialty(isAr ? preset.specialtyAr : preset.specialtyEn);
    setCertifications(preset.certifications);
    setTargetMarket(isAr ? preset.targetMarketAr : preset.targetMarketEn);
    setPrimaryColorHex(preset.primaryHex);
    setAccentColorHex(preset.accentHex);
    setPrompt(isAr ? preset.defaultPromptAr : preset.defaultPromptEn);
    runGeneration(Math.floor(100000 + Math.random() * 899999), preset);
  };

  const currentScenes = productionData?.videoStoryboard?.scenes || [];
  const activeScene = currentScenes[activeSceneIdx] || currentScenes[0];

  return (
    <section className="rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-emerald-950 text-white p-6 md:p-8 shadow-2xl space-y-6">
      {/* Top Studio Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/15 pb-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              {t(
                'AI IMAGE & VIDEO PRODUCTION STUDIO • COMPANY DNA + PURPOSE ENGINE',
                'استوديو إنتاج الصور والفيديوهات بالذكاء الاصطناعي • تحليل بيانات الشركة والغرض التسويقي'
              )}
            </span>
            <Pill tone="purple">FLUX.1 • Imagen 3 • Google Veo 2 • Wan 2.1</Pill>
            <ExpertManualButton manualId="ai-media-studio" locale={locale} variant="pill" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {t(
              'Produce Expert Images & Multi-Scene HD Videos Grounded in Your Company Profile & Commercial Purpose',
              'أنتج صوراً احترافية وفيديوهات عالية الدقة (HD) مبنية على تحليل بيانات مصنعك والغرض الصناعي أو التصديري'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t(
              'Enter your company capabilities, certifications, and text prompt below. Our multi-model studio analyzes your Business DNA, generates 4 photorealistic camera angles via Free FLUX/SDXL models, and renders a 5-scene commercial video with AI voiceover and downloadable .WEBM & .PNG masters.',
              'أدخل تخصص مصنعك وشهادات الجودة والوصف النصي أدناه؛ سيقوم الاستوديو بتحليل هوية الشركة وتوليد ٤ لقطات فوتوغرافية بزوايا كاميرا احترافية عبر نماذج FLUX المجانية، وإنتاج فيديو إعلاني من ٥ مشاهد بالتعليق الصوتي وتحميل مباشر بصيغة .WEBM و .PNG.'
            )}
          </p>
        </div>

        {/* Workspace View Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white/10 p-1.5 rounded-2xl border border-white/15 shrink-0">
          {[
            { id: 'BOTH', en: 'Images + Video Studio', ar: 'الصور + الفيديو معاً', icon: Layers },
            { id: 'IMAGES', en: '4-Angle Image Studio', ar: 'استوديو الصور (4 زوايا)', icon: Camera },
            { id: 'VIDEO', en: '5-Scene Video Producer', ar: 'استوديو الفيديو (5 مشاهد)', icon: Film },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = workspaceTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setWorkspaceTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {isAr ? tab.ar : tab.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: 1-Click Company DNA Presets */}
      <div className="space-y-2">
        <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
          <Building2 className="w-4 h-4" />
          {t(
            'Step 1 — Load a Verified Company Profile or Enter Your Own Mill Information Below:',
            'الخطوة ١ — اختر ملف شركة معتمد بنقرة واحدة أو أدخل بيانات مصنعك المخصصة أدناه:'
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {COMPANY_PRESETS.map((cp) => (
            <button
              key={cp.id}
              type="button"
              onClick={() => handleSelectCompanyPreset(cp)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-2 ${
                selectedPresetId === cp.id
                  ? 'bg-white text-slate-950 border-white shadow-md'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 border border-white/40"
                style={{ backgroundColor: cp.primaryHex }}
              />
              {isAr ? cp.nameAr : cp.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Company Information Analysis + Purpose + Model Configuration Grid */}
      <div className="grid lg:grid-cols-12 gap-4 bg-white/5 border border-white/15 rounded-2xl p-5">
        <div className="lg:col-span-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              {t('Company / Factory Name', 'اسم الشركة أو المصنع')}
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2 text-xs sm:text-sm font-bold text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
              {t('Core Machinery, Yarn Count & Fabric Specialty', 'التخصص الصناعي والماكينات ومواصفة المنتج')}
            </label>
            <input
              type="text"
              value={companySpecialty}
              onChange={(e) => setCompanySpecialty(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('Verified Certifications', 'شهادات الجودة والمنشأ')}
              </label>
              <input
                type="text"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                {t('Target Export Market', 'السوق التصديري المستهدف')}
              </label>
              <input
                type="text"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Purpose of Image/Video */}
        <div className="lg:col-span-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-1">
              <Target className="w-3.5 h-3.5 inline me-1" />
              {t('Step 2 — Purpose of the Image or Video', 'الخطوة ٢ — الغرض من الصورة أو الفيديو')}
            </label>
            <select
              value={purposeId}
              onChange={(e) => {
                const nextPurpose = e.target.value as MediaPurposeId;
                setPurposeId(nextPurpose);
                const found = PURPOSE_OPTIONS.find((p) => p.id === nextPurpose);
                if (found) setAspectRatio(found.recommendedRatio);
              }}
              className="w-full rounded-xl border border-emerald-400/40 bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white"
            >
              {PURPOSE_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {isAr ? p.ar : p.en}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-300 mt-1">
              {
                PURPOSE_OPTIONS.find((p) => p.id === purposeId)?.[
                  isAr ? 'descAr' : 'descEn'
                ]
              }
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                {t('Aspect Ratio', 'أبعاد الكادر')}
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full rounded-xl border border-white/20 bg-slate-900 px-2.5 py-2 text-xs font-bold text-white"
              >
                <option value="16:9">16:9 Cinema</option>
                <option value="9:16">9:16 Reel/Story</option>
                <option value="1:1">1:1 Square</option>
                <option value="4:5">4:5 B2B Feed</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                {t('Primary HEX', 'اللون الأساسي')}
              </label>
              <div className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-900 px-2 py-1.5">
                <input
                  type="color"
                  value={primaryColorHex}
                  onChange={(e) => setPrimaryColorHex(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[11px] font-mono">{primaryColorHex}</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                {t('Accent HEX', 'لون التمييز')}
              </label>
              <div className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-900 px-2 py-1.5">
                <input
                  type="color"
                  value={accentColorHex}
                  onChange={(e) => setAccentColorHex(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[11px] font-mono">{accentColorHex}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Best Free AI Image & Video Models */}
        <div className="lg:col-span-4 space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-sky-300 mb-1">
              <Cpu className="w-3.5 h-3.5 inline me-1" />
              {t('Free AI Image Generation Model', 'نموذج الذكاء الاصطناعي المجاني للصور')}
            </label>
            <select
              value={imageModelId}
              onChange={(e) => setImageModelId(e.target.value as FreeImageModelId)}
              className="w-full rounded-xl border border-sky-400/40 bg-slate-900 px-3 py-2 text-xs font-bold text-white"
            >
              {FREE_IMAGE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.badge}] {isAr ? m.labelAr : m.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1">
              <Video className="w-3.5 h-3.5 inline me-1" />
              {t('Free AI Video Generation Model', 'نموذج الذكاء الاصطناعي المجاني للفيديو')}
            </label>
            <select
              value={videoModelId}
              onChange={(e) => setVideoModelId(e.target.value as FreeVideoModelId)}
              className="w-full rounded-xl border border-purple-400/40 bg-slate-900 px-3 py-2 text-xs font-bold text-white"
            >
              {FREE_VIDEO_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.badge}] {isAr ? m.labelAr : m.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={showBrandedOverlay}
                onChange={(e) => setShowBrandedOverlay(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
              {t(
                'Composite Company Brand & KPI Overlay',
                'دمج شعار الشركة ومؤشرات الجودة على الصور والفيديو'
              )}
            </label>
          </div>
        </div>

        {/* Prompt Input & Generate Action Bar */}
        <div className="lg:col-span-12 pt-2 border-t border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-end">
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-extrabold text-emerald-300">
              <Wand2 className="w-3.5 h-3.5 inline me-1" />
              {t(
                'Step 3 — Visual Prompt / Scene Description (Describe Your Product, Fabric, Machinery, or Campaign Vision):',
                'الخطوة ٣ — الوصف البصري للمشهد أو المنتج (صف القماش، الغزل، الماكينات، أو فكرة الإعلان):'
              )}
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runGeneration()}
              placeholder={t(
                'e.g. 400 TC Giza 86 sateen bedlinen in optical white & gold inside a luxury Berlin hotel suite, plus 100mm macro weave shot...',
                'مثال: مفروشات ساتان قطن جيزة 86 (400 غرزة) باللون الأبيض والذهبي في جناح فندقي فاخر مع لقطة ماكرو للنسيج...'
              )}
              className="w-full rounded-xl border border-white/25 bg-slate-900 px-4 py-3 text-xs sm:text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <Button
            type="button"
            disabled={loading}
            onClick={() => runGeneration()}
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 hover:opacity-95 text-slate-950 font-extrabold text-xs sm:text-sm gap-2 shadow-xl shrink-0 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading
              ? t('AI Analyzing Company & Rendering...', 'جاري تحليل الشركة وتوليد الصور والفيديو...')
              : t('✨ Produce AI Images & Video Now', '✨ إنتاج الصور والفيديو بالذكاء الاصطناعي')}
          </Button>
        </div>
      </div>

      {/* Company Information Analysis & Creative Direction Brief */}
      {productionData?.companyAnalysis && (
        <div className="rounded-2xl border border-emerald-400/30 bg-slate-900/80 p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-extrabold">
                {t(
                  'AI Company DNA Analysis & Purpose-Aligned Creative Direction',
                  'تحليل الذكاء الاصطناعي لبيانات الشركة والتوجيه الإبداعي حسب الغرض'
                )}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="emerald">
                {isAr
                  ? productionData.companyAnalysis.purposeLabelAr
                  : productionData.companyAnalysis.purposeLabelEn}
              </Pill>
              <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                🧠 {productionData.companyAnalysis.llmModelUsed}
              </span>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
            {productionData.companyAnalysis.aiDirectorBrief}
          </div>
        </div>
      )}

      {/* WORKSPACE A: 4-ANGLE AI IMAGE PRODUCTION STUDIO */}
      {(workspaceTab === 'BOTH' || workspaceTab === 'IMAGES') &&
        productionData?.images && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-sky-400" />
                  {t(
                    '1. 4-Angle AI Commercial & Macro Image Suite (Live FLUX / SDXL Generation)',
                    '١. جناح الصور الفوتوغرافية والماكرو بالذكاء الاصطناعي (٤ زوايا تصوير حية)'
                  )}
                </h3>
                <p className="text-xs text-slate-300">
                  {t(
                    'Each image is synthesized live from your Company DNA & Purpose. Click any card to inspect prompt or download the Branded High-Res PNG.',
                    'يتم توليد كل صورة مباشرة بناءً على تخصص مصنعك والغرض المختار. اضغط لتحميل الصورة عالية الدقة بصيغة PNG مع شعار الشركة.'
                  )}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => runGeneration(Math.floor(100000 + Math.random() * 899999))}
                className="border-white/25 bg-white/10 hover:bg-white/20 text-white text-xs font-bold gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t('Generate New AI Seed Variations', 'توليد لقطات جديدة ببذرة عشوائية')}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {productionData.images.map((img: any, idx: number) => (
                <Card
                  key={img.id}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`overflow-hidden bg-slate-900 border-2 transition cursor-pointer flex flex-col justify-between text-white ${
                    activeImageIdx === idx
                      ? 'border-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'border-white/15 hover:border-white/35'
                  }`}
                >
                  {/* Live AI Image Viewport with Branded Overlay */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.imageUrl}
                      alt={isAr ? img.titleAr : img.titleEn}
                      crossOrigin="anonymous"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        // Graceful fallback if external rate-limit occurs
                        (e.currentTarget as HTMLImageElement).style.opacity = '0.15';
                      }}
                    />

                    {/* Branded Overlay on Image */}
                    {showBrandedOverlay && (
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-slate-950/70 p-3 flex flex-col justify-between pointer-events-none">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-white shadow"
                            style={{ backgroundColor: primaryColorHex }}
                          >
                            {companyName.slice(0, 22)}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-slate-950"
                            style={{ backgroundColor: accentColorHex }}
                          >
                            {isAr ? img.badgeAr : img.badgeEn}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[10px] font-mono text-emerald-300">
                            📷 {img.lens}
                          </div>
                          <div className="text-xs font-extrabold text-white line-clamp-2 leading-snug">
                            {isAr
                              ? productionData.companyAnalysis.hookAr
                              : productionData.companyAnalysis.hookEn}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Controls */}
                  <div className="p-3.5 space-y-2.5 bg-slate-900/95">
                    <div>
                      <div className="text-xs font-extrabold text-white">
                        {isAr ? img.titleAr : img.titleEn}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                        {isAr ? img.promptAr : img.promptEn}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadBrandedImagePng(img, idx);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-1.5 px-2.5 text-[11px] transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {t('Download PNG', 'تحميل PNG')}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyText(`img-prompt-${idx}`, img.promptEn);
                        }}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 px-2.5 text-[11px] transition cursor-pointer"
                      >
                        {copiedKey === `img-prompt-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {t('Prompt', 'الأمر')}
                      </button>
                      <a
                        href={img.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title={t('Open Raw AI Image in New Tab', 'فتح الصورة الأصلية في نافذة جديدة')}
                        className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white p-1.5 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      {/* WORKSPACE B: 5-SCENE AI VIDEO PRODUCER & WEBM RECORDER */}
      {(workspaceTab === 'BOTH' || workspaceTab === 'VIDEO') &&
        productionData?.videoStoryboard && (
          <div className="space-y-4 pt-2 border-t border-white/15">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-400" />
                  {t(
                    '2. 5-Scene AI Commercial Video Producer, Voiceover & HD .WEBM Recorder',
                    '٢. استوديو إنتاج الفيديو السينمائي (٥ مشاهد بالتعليق الصوتي وتحميل ملف فيديو .WEBM)'
                  )}
                </h3>
                <p className="text-xs text-slate-300">
                  {t(
                    'Plays a 5-scene broadcast commercial combining live AI keyframes, Ken Burns camera motion, bilingual AI voiceover, and real-time .WEBM video export.',
                    'يعرض فيديو إعلانياً من ٥ مشاهد يدمج لقطات الذكاء الاصطناعي وحركة الكاميرا السينمائية والتعليق الصوتي مع إمكانية تسجيل وتحميل ملف فيديو حقيقي (.WEBM).'
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  onClick={() => setIsPlayingVideo((p) => !p)}
                  disabled={isRecordingWebm}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs gap-1.5 cursor-pointer"
                >
                  {isPlayingVideo ? (
                    <>
                      <Pause className="w-4 h-4" />
                      {t('Pause Video', 'إيقاف مؤقت')}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      {t('Play 5-Scene AI Video', 'تشغيل الفيديو (٥ مشاهد)')}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setVoiceMuted((m) => !m);
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className="border-white/25 bg-white/10 hover:bg-white/20 text-white text-xs font-bold gap-1.5 cursor-pointer"
                >
                  {voiceMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-400" />
                      {t('Voice Muted', 'الصوت مكتوم')}
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-300" />
                      {t('AI Voiceover ON', 'التعليق الصوتي مفعل')}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleRecordAndDownloadWebm}
                  disabled={isRecordingWebm}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-95 text-white font-extrabold text-xs gap-1.5 shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {isRecordingWebm
                    ? t(
                        `Recording HD WebM (${recordingProgressPct}%)...`,
                        `جاري تسجيل ملف الفيديو (${recordingProgressPct}%)...`
                      )
                    : t('Render & Download HD Video (.WEBM)', 'تصدير وتحميل الفيديو (.WEBM)')}
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Cols: Live HTML5 Cinema Canvas Player */}
              <div className="lg:col-span-7 space-y-3">
                <div className="rounded-2xl overflow-hidden border-2 border-purple-400/40 bg-slate-950 shadow-2xl relative">
                  <canvas
                    ref={videoCanvasRef}
                    width={productionData.videoStoryboard.width || 1280}
                    height={productionData.videoStoryboard.height || 720}
                    className="w-full max-h-[430px] object-contain bg-slate-950 block mx-auto"
                  />
                </div>

                {/* Scene Scrubber Pills */}
                <div className="grid grid-cols-5 gap-2">
                  {currentScenes.map((sc: any, idx: number) => (
                    <button
                      key={sc.sceneNumber}
                      type="button"
                      onClick={() => {
                        setActiveSceneIdx(idx);
                        setSceneProgress(0);
                      }}
                      className={`p-2.5 rounded-xl border text-start transition cursor-pointer ${
                        activeSceneIdx === idx
                          ? 'bg-purple-500/30 border-purple-400 text-white'
                          : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-purple-300 font-bold">
                        {t(`Scene 0${sc.sceneNumber}`, `مشهد ٠${sc.sceneNumber}`)} ({sc.durationSec}s)
                      </div>
                      <div className="text-xs font-bold truncate mt-0.5">
                        {isAr ? sc.headlineAr : sc.headlineEn}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right 5 Cols: Active Scene Script + Free External AI Video Model Bridges (Veo 2 / Wan 2.1 / Hunyuan) */}
              <div className="lg:col-span-5 space-y-4">
                {activeScene && (
                  <div className="rounded-2xl border border-white/15 bg-slate-900/90 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">
                        {t(
                          `Active Director Script — Scene 0${activeScene.sceneNumber}`,
                          `سيناريو المشهد الحالي — مشهد ٠${activeScene.sceneNumber}`
                        )}
                      </span>
                      <Pill tone="blue">
                        {isAr ? activeScene.cameraMotionLabelAr : activeScene.cameraMotionLabelEn}
                      </Pill>
                    </div>
                    <div className="text-sm font-extrabold text-white">
                      {isAr ? activeScene.headlineAr : activeScene.headlineEn}
                    </div>
                    <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 leading-relaxed">
                      🎙️ <strong>{t('Voiceover:', 'التعليق الصوتي:')}</strong>{' '}
                      {isAr ? activeScene.voiceoverAr : activeScene.voiceoverEn}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      <strong>{t('Visual Prompt:', 'أمر التوليد البصري:')}</strong>{' '}
                      {activeScene.visualPromptEn}
                    </div>
                  </div>
                )}

                {/* Master Video Prompts for Google Veo 2, Wan 2.1 & HunyuanVideo */}
                <div className="rounded-2xl border border-white/15 bg-slate-900/90 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      {t(
                        'Master Prompt for Selected Free AI Video Model',
                        'الأمر الهندسي المجمع لنموذج الفيديو المجاني المختار'
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          'master-video-prompt',
                          productionData.videoStoryboard.videoModelPrompts?.[videoModelId] ||
                            productionData.videoStoryboard.videoModelPrompts?.['veo-2'] ||
                            ''
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white cursor-pointer"
                    >
                      {copiedKey === 'master-video-prompt' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {t('Copy Video Prompt', 'نسخ أمر الفيديو')}
                    </button>
                  </div>

                  <p className="text-[11px] font-mono text-slate-300 bg-slate-950/90 p-3 rounded-xl border border-white/10 leading-relaxed max-h-32 overflow-y-auto">
                    {productionData.videoStoryboard.videoModelPrompts?.[videoModelId] ||
                      productionData.videoStoryboard.videoModelPrompts?.['veo-2']}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href="https://labs.google/fx/tools/video-fx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2 px-3 text-xs font-bold text-white transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                      {t('Open Google VideoFX (Veo 2)', 'فتح Google VideoFX')}
                    </a>
                    <a
                      href="https://huggingface.co/spaces/Wan-AI/Wan2.1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2 px-3 text-xs font-bold text-white transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
                      {t('Open Wan 2.1 Free Space', 'فتح نموذج Wan 2.1 المجاني')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </section>
  );
}

export default AiMediaProductionStudio;
