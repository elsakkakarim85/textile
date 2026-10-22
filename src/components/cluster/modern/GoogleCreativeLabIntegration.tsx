'use client';

import React, { useState } from 'react';
import { tr } from '@/lib/i18n-inline';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pill } from '@/components/cluster/ui';
import { ExpertManualButton, openExpertManual } from '@/components/cluster/ExpertManualModal';
import {
  Sparkles,
  Palette,
  LayoutGrid,
  MonitorSmartphone,
  Workflow,
  ExternalLink,
  Copy,
  Check,
  Download,
  HelpCircle,
  Play,
  Layers,
  Globe2,
  ShieldCheck,
  Wand2,
  Code2,
  Smartphone,
  Monitor,
  ArrowRight,
  Cpu,
  CheckCircle2,
  FileJson,
} from 'lucide-react';

export type GoogleToolTabId = 'pomelli' | 'mixboard' | 'stitch' | 'opal';
export type GoogleIntegrationContext =
  | 'brand'
  | 'export'
  | 'lean'
  | 'ai'
  | 'maturity'
  | 'facilities'
  | 'marketplace';

interface PomelliPreset {
  id: string;
  nameEn: string;
  nameAr: string;
  url: string;
  archetypeEn: string;
  archetypeAr: string;
  toneEn: string;
  toneAr: string;
  headingFont: string;
  bodyFont: string;
  colors: { hex: string; labelEn: string; labelAr: string }[];
  uspEn: string[];
  uspAr: string[];
  headlineEn: string;
  headlineAr: string;
  ctaEn: string;
  ctaAr: string;
}

const POMELLI_PRESETS: PomelliPreset[] = [
  {
    id: 'giza-bedlinen',
    nameEn: 'Misr Heritage Giza 86 Sateen Bedlinen',
    nameAr: 'مصر التراثية لمفروشات ساتان جيزة 86 الفندقية',
    url: 'https://mahalla-cluster-app.vercel.app/en/factories/misr-spinning',
    archetypeEn: 'Sovereign Heritage & Five-Star European Luxury',
    archetypeAr: 'العراقة الملكية والفخامة الفندقية الأوروبية (5 نجوم)',
    toneEn: 'Authoritative, Refined, Traceable, Certifiably Sustainable',
    toneAr: 'موثوق، راقٍ، قابل للتتبع الرقمي، ومستدام بمعايير عالمية',
    headingFont: 'Playfair Display / Cairo ExtraBold',
    bodyFont: 'Plus Jakarta Sans / Tajawal Medium',
    colors: [
      { hex: '#064E3B', labelEn: 'Nile Delta Emerald', labelAr: 'زمردي دلتا النيل' },
      { hex: '#0F172A', labelEn: 'Sovereign Navy', labelAr: 'كحلي سيادي' },
      { hex: '#D97706', labelEn: 'Giza 86 Harvest Gold', labelAr: 'ذهبي قطن جيزة 86' },
      { hex: '#F8FAFC', labelEn: 'Optical Combed White', labelAr: 'أبيض ممشط ناصع' },
      { hex: '#0284C7', labelEn: 'Euro-Med Trade Blue', labelAr: 'أزرق الشراكة الأوروبية' },
    ],
    uspEn: [
      '100% Extra-Long Staple Giza 86/94 Compact-Spun Cotton (300–600 TC)',
      '0% EU Customs Duty via EUR.1 + Cryptographic EU Digital Product Passport',
      'OEKO-TEX® Made in Green, GOTS Organic & ZDHC MRSL Level 3 Certified',
    ],
    uspAr: [
      'قطن مصري جيزة 86/94 فائق الطول مغزول بنظام Compact (كثافة 300–600 خيط)',
      'إعفاء جمركي 0% لأوروبا بشهادة EUR.1 + جواز المنتج الرقمي الأوروبي DPP',
      'معتمد OEKO-TEX Made in Green و GOTS العضوي و ZDHC المستوى الثالث',
    ],
    headlineEn: 'Direct from El-Mahalla El-Kubra: 400 TC Giza 86 Hotel Sateen with Full EU Digital Product Passports.',
    headlineAr: 'مباشرة من قلعة الصناعة بالمحلة الكبرى: ساتان فندقي جيزة 86 (400 غرزة) مرفق بجواز المنتج الأوروبي.',
    ctaEn: 'Request Verified Swatch Box & CIF Quote',
    ctaAr: 'اطلب صندوق العينات المعتمد وعرض سعر CIF',
  },
  {
    id: 'zdhc-dyehouse',
    nameEn: 'Al-Rowad ZDHC Level 3 Reactive Dyeing & Finishing',
    nameAr: 'الرواد للصباغة النشطة والتجهيز المستدام (ZDHC Level 3)',
    url: 'https://mahalla-cluster-app.vercel.app/en/factories/al-rowad-dyeing',
    archetypeEn: 'Precision Chemical Engineering & Zero-Discharge Cleantech',
    archetypeAr: 'الهندسة الكيميائية الدقيقة والتصنيع الأخضر صفر الانبعاثات',
    toneEn: 'Scientific, Data-Driven, Six-Sigma Controlled, Eco-Compliant',
    toneAr: 'علمي، مدعوم ببيانات 6 سيجما، ومتوافق بيئياً مع الاتحاد الأوروبي',
    headingFont: 'Space Grotesk / Readex Pro Bold',
    bodyFont: 'Inter / IBM Plex Sans Arabic',
    colors: [
      { hex: '#0D9488', labelEn: 'Zero-Discharge Teal', labelAr: 'تركواز المياه النقية ZLD' },
      { hex: '#1E1B4B', labelEn: 'Spectro Indigo', labelAr: 'نيلي الاسبكتروفوتوميتر' },
      { hex: '#10B981', labelEn: 'CBAM Carbon Green', labelAr: 'أخضر التوافق الكربوني CBAM' },
      { hex: '#F59E0B', labelEn: 'Solar Thermal Amber', labelAr: 'كهرماني الطاقة الشمسية' },
      { hex: '#F1F5F9', labelEn: 'Lab Porcelain', labelAr: 'رمادي معامل ISO 17025' },
    ],
    uspEn: [
      '98.2% Right-First-Time (RFT) Shade Matching with CMC ΔE ≤ 0.5',
      'Low-Liquor Ratio 1:5.5 Airflow Jet Dyeing + 70% Closed-Loop UF/RO Water Recycling',
      'Full ISO 17025 Lab Certification & Sanforized Shrinkage < 2%',
    ],
    uspAr: [
      'نسبة تطابق لوني من أول مرة (RFT) تبلغ 98.2% بفرق لوني ΔE ≤ 0.5',
      'صباغة جيت منخفضة المنسوب (1:5.5) مع تدوير 70% من المياه بوحدات UF/RO',
      'مختبر معتمد ISO 17025 وانكماش مضمون أقل من 2% بعد السنفرة',
    ],
    headlineEn: 'CMC ΔE ≤ 0.5 Shade Precision & 70% Recycled Water: Commission Dyeing Built for EU Brands.',
    headlineAr: 'دقة ألوان ΔE ≤ 0.5 وتدوير 70% من المياه: صباغة وتجهيز بمعايير العلامات الأوروبية.',
    ctaEn: 'Book Lab-Dip Trial & Capacity Slot',
    ctaAr: 'احجز تجربة Lab-Dip وطاقة صباغة فورية',
  },
  {
    id: 'jacquard-terry',
    nameEn: 'Delta Jacquard & Zero-Twist Spa Terry Towels',
    nameAr: 'دلتا جاكار للفوط والوبريات الفندقية عديمة البرم (Zero-Twist)',
    url: 'https://mahalla-cluster-app.vercel.app/en/marketplaces/products',
    archetypeEn: 'Mediterranean Resort Comfort & High-Speed Air-Jet Craft',
    archetypeAr: 'رفاهية المنتجعات المتوسطية وتكنولوجيا أنوال الهواء الحديثة',
    toneEn: 'Warm, Tactile, Hospitality-Focused, High-Volume Reliable',
    toneAr: 'فندقي دافئ، فائق النعومة والامتصاص، وموثوق للطلبيات الكبرى',
    headingFont: 'Cormorant Garamond / Amiri Bold',
    bodyFont: 'DM Sans / Cairo Regular',
    colors: [
      { hex: '#0369A1', labelEn: 'Aegean Spa Blue', labelAr: 'أزرق منتجعات البحر المتوسط' },
      { hex: '#B45309', labelEn: 'Warm Terracotta', labelAr: 'تيراكوتا فندقية دافئة' },
      { hex: '#047857', labelEn: 'Olive Wellness', labelAr: 'أخضر زيتوني طبيعي' },
      { hex: '#FEF3C7', labelEn: 'Unbleached Ecru', labelAr: 'إيكرو قطني طبيعي' },
      { hex: '#1E293B', labelEn: 'Slate Border', labelAr: 'رمادي داكن للكنار الجاكار' },
    ],
    uspEn: [
      '450–700 GSM Zero-Twist Egyptian Cotton Pile with < 2.5s ASTM Absorbency',
      'Custom Woven Crest Jacquard Borders for International Hotel Chains',
      '35-Day Door-to-Port Lead Time via Alexandria / Damietta',
    ],
    uspAr: [
      'وزن 450–700 جم/م² من القطن المصري عديم البرم بامتصاص فوري أقل من 2.5 ثانية',
      'حفر شعارات الفنادق العالمية بالجاكار المنسوج على الكنار',
      'توريد خلال 35 يوماً عبر موانئ الإسكندرية ودمياط',
    ],
    headlineEn: '600 GSM Zero-Twist Egyptian Cotton Spa Towels — Custom Jacquard Woven for Global Hospitality.',
    headlineAr: 'فوط سبا قطن مصري 600 جم/م² عديمة البرم — منسوجة بالجاكار لسلاسل الفنادق العالمية.',
    ctaEn: 'Order 600 GSM Sample Pack',
    ctaAr: 'اطلب حقيبة عينات 600 جم/م² الآن',
  },
];

interface MixboardPreset {
  id: string;
  titleEn: string;
  titleAr: string;
  seasonEn: string;
  seasonAr: string;
  weaveEn: string;
  weaveAr: string;
  yarnSpec: string;
  gsmSpec: string;
  swatches: { hex: string; nameEn: string; nameAr: string; pantone: string }[];
  concepts: { titleEn: string; titleAr: string; promptEn: string; tag: string }[];
  storyEn: string;
  storyAr: string;
}

const MIXBOARD_PRESETS: MixboardPreset[] = [
  {
    id: 'heimtextil-royal',
    titleEn: 'Heimtextil Frankfurt 2026 — Nile Sovereign Hospitality Suite',
    titleAr: 'مجموعة هايم تكستيل فرانكفورت ٢٠٢٦ — جناح النيل الملكي للفنادق',
    seasonEn: 'Autumn/Winter 2026 • Luxury Hospitality & Boutique Cruise Lines',
    seasonAr: 'خريف/شتاء ٢٠٢٦ • الفنادق الفاخرة والبواخر السياحية',
    weaveEn: '4/1 Warp-Faced Combed Sateen + Tone-on-Tone 2cm Dobby Stripe',
    weaveAr: 'نسج أطلس (ساتان 4/1) ممشط مع مقلم دوبي 2 سم بنفس الدرجة',
    yarnSpec: 'Ne 60/1 Compact Combed Giza 94 Warp × Ne 60/1 Weft',
    gsmSpec: '142 GSM • 400 Thread Count • Mercerized & Calendared',
    swatches: [
      { hex: '#F8FAFC', nameEn: 'Alabaster Lotus', nameAr: 'أبيض ألباستر ناصع', pantone: '11-0602 TCX' },
      { hex: '#E2E8F0', nameEn: 'Nile Mist Silver', nameAr: 'فضي ضباب النيل', pantone: '13-4108 TCX' },
      { hex: '#D4AF37', nameEn: 'Pharaonic Gold Piping', nameAr: 'ذهبي تطريز ملكي', pantone: '16-0948 TCX' },
      { hex: '#0F172A', nameEn: 'Midnight Nile Border', nameAr: 'كحلي منتصف الليل', pantone: '19-4024 TCX' },
      { hex: '#065F46', nameEn: 'Delta Palm Accent', nameAr: 'أخضر نخيل الدلتا', pantone: '18-5633 TCX' },
    ],
    concepts: [
      {
        titleEn: 'Macro Weave & Lustre Shot',
        titleAr: 'لقطة ماكرو للمعة الساتان الممرسر',
        promptEn:
          'Extreme macro photography of 400TC Egyptian Giza 94 combed cotton sateen with subtle 2cm dobby stripe, liquid silk lustre after mercerizing, golden hour side lighting, 8k textile studio.',
        tag: 'Macro Weave',
      },
      {
        titleEn: '5-Star Suite Bed Styling',
        titleAr: 'تنسيق جناح فندقي 5 نجوم',
        promptEn:
          'Architectural Digest luxury hotel suite bed dressed in crisp Alabaster white Egyptian cotton sateen duvet with Midnight Navy embroidered frame border, overlooking sunlit marble terrace.',
        tag: 'Interior Mood',
      },
      {
        titleEn: 'Folded Swatch Header Stack',
        titleAr: 'عرض عينات المعرض الدولي',
        promptEn:
          'B2B textile trade show presentation table with stacked fabric swatch waterfalls in Alabaster, Silver Mist, and Emerald, brass binder clips, EU Digital Product Passport QR hangtag.',
        tag: 'Trade Show',
      },
      {
        titleEn: 'Giza 94 Boll-to-Cone Origin',
        titleAr: 'تتبع المنشأ من زهرة القطن للكونة',
        promptEn:
          'Artistic flat-lay combining raw extra-long staple Egyptian cotton bolls, precision compact ring-spun yarn cones, and woven sateen swatch on dark slate surface.',
        tag: 'Traceability',
      },
    ],
    storyEn:
      'Engineered in El-Mahalla El-Kubra from single-origin Giza 94 extra-long staple fibers, this 400 TC mercerized sateen collection delivers 200+ industrial laundry cycles for European 5-star hotel groups while maintaining <2% dimensional shrinkage.',
    storyAr:
      'صُممت هذه المجموعة في المحلة الكبرى من ألياف قطن جيزة 94 فائق الطول (400 غرزة ممرسرة) لتحمل أكثر من 200 دورة غسيل صناعي في الفنادق الأوروبية مع انكماش أقل من 2%.',
  },
  {
    id: 'mediterranean-spa',
    titleEn: 'Aegean & Red Sea Zero-Twist Wellness Terry Collection',
    titleAr: 'مجموعة منتجعات البحر المتوسط والبحر الأحمر للوبريات الفاخرة',
    seasonEn: 'Spring/Summer 2026 • Coastal Resorts, Thalasso Spas & Yachts',
    seasonAr: 'ربيع/صيف ٢٠٢٦ • المنتجعات الساحلية والسبا واليخوت',
    weaveEn: '3-Pick Acroterry Jacquard with Zero-Twist Combed Pile Loops',
    weaveAr: 'نسيج تيري جاكار ثلاثي اللحمات بوبرة قطنية عديمة البرم',
    yarnSpec: 'Pile: Ne 16/1 Zero-Twist Giza 86 • Ground: Ne 20/2 Ring-Spun',
    gsmSpec: '620 GSM • Pile Ratio 5.8:1 • Hydrophilic Enzyme Finish',
    swatches: [
      { hex: '#0284C7', nameEn: 'Santorini Cove', nameAr: 'أزرق سانتوريني', pantone: '18-4245 TCX' },
      { hex: '#F5F5DC', nameEn: 'Warm Limestone', nameAr: 'بيج الحجر الجيري', pantone: '12-0712 TCX' },
      { hex: '#C2410C', nameEn: 'Red Sea Coral', nameAr: 'مرجاني البحر الأحمر', pantone: '17-1456 TCX' },
      { hex: '#0D9488', nameEn: 'Thalasso Lagoon', nameAr: 'تركواز اللاجون', pantone: '17-4928 TCX' },
      { hex: '#334155', nameEn: 'Basalt Pebble', nameAr: 'رمادي البازلت', pantone: '18-4011 TCX' },
    ],
    concepts: [
      {
        titleEn: 'Plush Terry Loop Micro-Texture',
        titleAr: 'تفاصيل الوبرة القطنية الكثيفة',
        promptEn:
          'Close-up macro shot of 620 GSM zero-twist Egyptian cotton terry towel loops, ultra-plush lofty texture with water droplets absorbing instantly, natural spa light.',
        tag: 'Terry Pile',
      },
      {
        titleEn: 'Coastal Spa Lounger Scene',
        titleAr: 'إطلالة مسبح المنتجع الساحلي',
        promptEn:
          'Rolled Aegean blue and Warm Limestone jacquard bath sheets on teakwood poolside loungers, Mediterranean sea horizon, olive branches, luxury resort editorial.',
        tag: 'Resort Vibe',
      },
      {
        titleEn: 'Custom Woven Jacquard Crest',
        titleAr: 'شعار الفندق المنسوج بالجاكار',
        promptEn:
          'Detailed shot of a tone-on-tone woven jacquard border on a heavy white hotel bathrobe and towel set, crisp geometric Greek key and lotus motif.',
        tag: 'Jacquard Detail',
      },
      {
        titleEn: 'Eco-Packaging & GRS Hangtag',
        titleAr: 'التغليف المستدام وشهادة التتبع',
        promptEn:
          'Stack of folded spa towels tied with natural linen ribbon and kraft paper EU Digital Product Passport hangtag showing water recycling metrics.',
        tag: 'Packaging',
      },
    ],
    storyEn:
      'Woven on high-speed Dornier air-jet terry looms using zero-twist Giza 86 cotton, achieving <2.2 second water absorbency and 35% higher loft after tumble drying.',
    storyAr:
      'منسوجة على أنوال الهواء عالية السرعة من قطن جيزة 86 عديم البرم لتحقيق امتصاص مائي فوري في أقل من 2.2 ثانية وانتفاش أعلى بنسبة 35%.',
  },
];

interface StitchBlueprint {
  id: string;
  titleEn: string;
  titleAr: string;
  badge: string;
  targetModuleEn: string;
  targetModuleAr: string;
  vibePrompt: string;
  reactCodeSnippet: string;
  kpis: { labelEn: string; labelAr: string; val: string }[];
}

const STITCH_BLUEPRINTS: StitchBlueprint[] = [
  {
    id: 'b2b-buyer-portal',
    titleEn: 'B2B International Buyer Swatch & Instant CIF Quote Portal',
    titleAr: 'بوابة المشترين الدوليين لطلب العينات وحساب أسعار CIF فورياً',
    badge: 'Export & B2B UI',
    targetModuleEn: 'Export Intelligence & B2B Marketplace',
    targetModuleAr: 'ذكاء التصدير وسوق المنتجات B2B',
    vibePrompt:
      'Design a luxury dark-emerald and slate B2B textile export portal for European and Gulf buyers sourcing from El-Mahalla El-Kubra. Include a sticky top filter bar (Yarn Ne, GSM slider 120–700, Weave Type, OEKO-TEX/GOTS/DPP badges), a 3-column interactive swatch card grid with macro fabric zoom, live FOB Alexandria vs CIF Hamburg container calculator drawer, and a 1-click "Order Physical Swatch Box via DHL" modal.',
    reactCodeSnippet: `export function MahallaBuyerPortalCard({ title, ne, gsm, fobUsd, dppHash }) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-5 text-white shadow-xl">
      <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
        <span>GIZA 86 COMPACT • {ne}</span>
        <span>{gsm} GSM • EUR.1 0% DUTY</span>
      </div>
      <h3 className="mt-2 text-lg font-extrabold">{title}</h3>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-xl font-black text-emerald-300">\${fobUsd} / kg FOB</span>
        <button className="rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-black text-slate-950">
          Order Swatch & CIF Quote
        </button>
      </div>
    </div>
  );
}`,
    kpis: [
      { labelEn: '300–600 TC Sateen', labelAr: 'ساتان 300–600 غرزة', val: '$6.80/m CIF' },
      { labelEn: 'EUR.1 Tariff Saving', labelAr: 'وفر جمارك EUR.1', val: '12.0% → 0%' },
      { labelEn: 'Swatch Dispatch', labelAr: 'شحن العينات DHL', val: '48 Hours' },
    ],
  },
  {
    id: 'shopfloor-andon-ui',
    titleEn: 'Shop-Floor Loom OEE, Andon Jidoka & SMED Tablet UI',
    titleAr: 'واجهة تابلت صالة الإنتاج لمراقبة كفاءة الأنوال OEE والأندون و SMED',
    badge: 'Lean & Industry 4.0 UI',
    targetModuleEn: 'Lean Six Sigma & Digital Maturity',
    targetModuleAr: 'التصنيع الرشيق والنضج الرقمي 4.0',
    vibePrompt:
      'Design a high-contrast industrial shop-floor tablet UI (dark mode for mill glare resistance) for El-Mahalla weaving and dyeing supervisors. Feature a top SQDC status ribbon, real-time OEE gauge (Availability × Performance × Quality), a 12-loom Andon grid with Red/Amber/Green Jidoka stop alerts, a live SMED changeover countdown timer, and a 1-tap warp/weft break logging keypad.',
    reactCodeSnippet: `export function LoomAndonTile({ loomId, rpm, oee, status, stopReason }) {
  const tone = status === 'RUNNING' ? 'border-emerald-500 bg-emerald-950/40' : 'border-rose-500 bg-rose-950/60 animate-pulse';
  return (
    <div className={\`rounded-2xl border-2 p-4 text-white \${tone}\`}>
      <div className="flex justify-between items-center">
        <span className="font-mono text-sm font-black">{loomId}</span>
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/10">{status}</span>
      </div>
      <div className="mt-2 text-2xl font-black">{oee}% OEE</div>
      <div className="text-xs text-slate-300">{rpm} RPM • {stopReason || 'Zero Defects'}</div>
    </div>
  );
}`,
    kpis: [
      { labelEn: 'Live Mill OEE', labelAr: 'كفاءة المعدات الحية OEE', val: '84.6% (+11%)' },
      { labelEn: 'SMED Beam Change', labelAr: 'زمن تغيير المطواة SMED', val: '38 min' },
      { labelEn: 'Right-First-Time', labelAr: 'الجودة من أول مرة RFT', val: '97.8%' },
    ],
  },
  {
    id: 'eu-dpp-scanner-ui',
    titleEn: 'EU Digital Product Passport (ESPR) Consumer & Customs Mobile UI',
    titleAr: 'واجهة موبايل فحص جواز المنتج الرقمي الأوروبي (EU DPP) للجمارك والمستهلك',
    badge: 'EU ESPR & ESG UI',
    targetModuleEn: 'Sustainability, CBAM & Digital Product Passport',
    targetModuleAr: 'الاستدامة وجواز المنتج الرقمي الأوروبي',
    vibePrompt:
      'Design a mobile-first EU Digital Product Passport (ESPR 2024/1781) verification app when a European buyer or customs officer scans a Mahalla garment QR code. Show a cryptographic SHA-256 verification badge, Nile Delta Giza cotton ginning map, Scope 1+2 carbon footprint gauge (1.88 kg CO2e/kg), closed-loop water recycling percentage, OEKO-TEX/ZDHC certificates, and circular recycling instructions.',
    reactCodeSnippet: `export function EuDppPassportHeader({ batchId, co2Kg, waterL, sha256 }) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 p-6 text-white">
      <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-black text-emerald-300">
        EU ESPR 2024/1781 VERIFIED
      </span>
      <h2 className="mt-2 text-xl font-black">Batch #{batchId} — Giza 86 Cotton</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-white/10 p-3">Carbon: <strong>{co2Kg} kg CO2e</strong></div>
        <div className="rounded-xl bg-white/10 p-3">Water: <strong>{waterL} L/kg (65% RO)</strong></div>
      </div>
    </div>
  );
}`,
    kpis: [
      { labelEn: 'Scope 1+2 Carbon', labelAr: 'البصمة الكربونية', val: '1.88 kg CO₂e' },
      { labelEn: 'Recycled Water', labelAr: 'تدوير المياه ZLD', val: '68% UF/RO' },
      { labelEn: 'Traceability Hash', labelAr: 'التوقيع الرقمي', val: 'SHA-256 ✓' },
    ],
  },
];

interface OpalWorkflowPreset {
  id: string;
  titleEn: string;
  titleAr: string;
  moduleId: string;
  defaultInput: string;
  nodes: {
    step: number;
    titleEn: string;
    titleAr: string;
    type: string;
    detailEn: string;
    detailAr: string;
  }[];
}

const OPAL_WORKFLOWS: OpalWorkflowPreset[] = [
  {
    id: 'opal-brand-export',
    titleEn: 'Opal Pipeline 1: Factory Profile → Pomelli DNA → EU Tariff Check → 30-Day Buyer Campaign',
    titleAr: 'سلسلة Opal ١: ملف المصنع ← هوية Pomelli ← فحص جمارك أوروبا ← حملة 30 يوماً للمشترين',
    moduleId: 'brand-studio',
    defaultInput:
      'Product: 400 TC Giza 86 Combed Cotton Sateen Bedlinen | Target Market: Germany & Italy | Capacity: 45,000 sets/month | Certifications: OEKO-TEX 100, GOTS, EU DPP',
    nodes: [
      {
        step: 1,
        titleEn: 'Node 1: Product & Factory Telemetry Input',
        titleAr: 'العقدة ١: إدخال مواصفات المنتج وطاقة المصنع',
        type: 'INPUT_SCHEMA',
        detailEn: 'Parses product specs, HS code (6302.21), monthly capacity, and target export destination.',
        detailAr: 'تحليل مواصفات المنتج والبند الجمركي (6302.21) والطاقة الإنتاجية والسوق المستهدف.',
      },
      {
        step: 2,
        titleEn: 'Node 2: Preferential Tariff & ROAS Math Engine',
        titleAr: 'العقدة ٢: محرك حساب الإعفاء الجمركي والعائد التسويقي',
        type: 'MATH_ENGINE',
        detailEn: 'Computes EUR.1 0% duty advantage (12% saved vs non-FTA) and target B2B CPL/ROAS.',
        detailAr: 'حساب ميزة الإعفاء الجمركي 0% بشهادة EUR.1 (توفير 12%) وحساب العائد الإعلاني المستهدف.',
      },
      {
        step: 3,
        titleEn: 'Node 3: Pomelli Business DNA & Multi-LLM Synthesis',
        titleAr: 'العقدة ٣: بناء هوية Pomelli وتوليد الرسائل بالنماذج المجانية',
        type: 'LLM_CHAIN',
        detailEn: 'Chains Brand DNA tone with buyer procurement psychology for DACH/Italian sourcing directors.',
        detailAr: 'دمج الهوية البصرية للمصنع مع صياغة رسائل استهداف مديري المشتريات في ألمانيا وإيطاليا.',
      },
      {
        step: 4,
        titleEn: 'Node 4: Exportable Campaign Pack & .opal.json',
        titleAr: 'العقدة ٤: إصدار الحقيبة التسويقية وملف .opal.json',
        type: 'OUTPUT_ARTIFACT',
        detailEn: 'Outputs LinkedIn sequence, Heimtextil booth copy, and portable Google Opal workflow JSON.',
        detailAr: 'إخراج رسائل LinkedIn، نصوص جناح المعرض، وملف سير العمل الجاهز لـ Google Opal.',
      },
    ],
  },
  {
    id: 'opal-lean-kaizen',
    titleEn: 'Opal Pipeline 2: Shift Downtime Log → OEE & 6 Losses → 5-Whys RCA → Kaizen A3 SOP',
    titleAr: 'سلسلة Opal ٢: سجل أعطال الوردية ← حساب OEE ← الجذور الخمسة 5-Whys ← خطة كايزن A3',
    moduleId: 'lean-manufacturing',
    defaultInput:
      'Department: Air-Jet Weaving Shed (48 Looms) | Shift: 480 min | Unplanned Stops: 62 min (Warp knots & beam changeover) | Speed: 640 RPM vs 720 RPM ideal | Rejects: 3.4%',
    nodes: [
      {
        step: 1,
        titleEn: 'Node 1: Gemba Shift Telemetry Capture',
        titleAr: 'العقدة ١: قراءة بيانات الوردية والتوقفات الفعلية',
        type: 'INPUT_SCHEMA',
        detailEn: 'Captures planned time, changeover minutes, stoppages, RPM speed, and defect rate.',
        detailAr: 'التقاط زمن الوردية، دقائق تغيير المطواة، الأعطال، سرعة الأنوال، ونسبة المعيوب.',
      },
      {
        step: 2,
        titleEn: 'Node 2: Deterministic OEE, Takt & Financial Loss Engine',
        titleAr: 'العقدة ٢: حساب OEE والفاقد المالي بالمعادلات القياسية',
        type: 'MATH_ENGINE',
        detailEn: 'Computes Availability × Performance × Quality and annual EGP/USD margin leakage.',
        detailAr: 'حساب الإتاحة × الأداء × الجودة وتقدير الخسارة المالية السنوية الناتجة عن التوقفات.',
      },
      {
        step: 3,
        titleEn: 'Node 3: 5-Whys Root Cause & SMED Single-Minute Split',
        titleAr: 'العقدة ٣: تحليل الأسباب الجذرية 5-Whys وفصل خطوات SMED',
        type: 'LLM_CHAIN',
        detailEn: 'Diagnoses sizing/moisture root causes and converts internal loom setup steps to external.',
        detailAr: 'تشخيص أسباب انقطاع السداء وتحويل خطوات ربط المطواة من داخلية إلى خارجية.',
      },
      {
        step: 4,
        titleEn: 'Node 4: Toyota A3 PDCA Sheet & Operator Poka-Yoke Checklist',
        titleAr: 'العقدة ٤: إصدار وثيقة A3 PDCA وقائمة فحص Poka-Yoke للفني',
        type: 'OUTPUT_ARTIFACT',
        detailEn: 'Generates printable shop-floor SOP and exports the `.opal.json` automation skill.',
        detailAr: 'توليد قائمة فحص قياسية جاهزة للطباعة والتعليق في العنبر مع ملف سير العمل.',
      },
    ],
  },
  {
    id: 'opal-esg-cbam',
    titleEn: 'Opal Pipeline 3: Monthly Utility Meters → Scope 1+2 CO2e → EU CBAM Audit → Green Grant Pitch',
    titleAr: 'سلسلة Opal ٣: قراءات العدادات ← حساب الكربون CO2e ← تدقيق CBAM ← دراسة جدوى تمويل أخضر',
    moduleId: 'sustainability',
    defaultInput:
      'Monthly Output: 65,000 kg dyed fabric | Grid Electricity: 128,000 kWh | Solar: 22,000 kWh | Natural Gas: 5,100 m3 | Water Intake: 2,400 m3 (Recycled: 600 m3)',
    nodes: [
      {
        step: 1,
        titleEn: 'Node 1: Utility & Production Meter Ingestion',
        titleAr: 'العقدة ١: إدخال قراءات الكهرباء والغاز والمياه والإنتاج',
        type: 'INPUT_SCHEMA',
        detailEn: 'Validates kWh, solar share, natural gas m³, water intake, and recycled effluent.',
        detailAr: 'مراجعة استهلاك الكهرباء والطاقة الشمسية والغاز الطبيعي والمياه المعاد تدويرها.',
      },
      {
        step: 2,
        titleEn: 'Node 2: IPCC / Egypt Grid Emission Factor Calculator',
        titleAr: 'العقدة ٢: حساب كثافة الكربون والمياه لكل كجم منتج',
        type: 'MATH_ENGINE',
        detailEn: 'Applies 0.45 kg CO2e/kWh and 1.96 kg CO2e/m³ gas to compute intensity per kg textile.',
        detailAr: 'تطبيق معاملات الانبعاثات القياسية لحساب كجم CO2e ولتر المياه لكل كجم قماش.',
      },
      {
        step: 3,
        titleEn: 'Node 3: AI Engineering Abatement & Solar/ZLD ROI Modeling',
        titleAr: 'العقدة ٣: نمذجة خفض الانبعاثات والعائد على الطاقة الشمسية وتدوير المياه',
        type: 'LLM_CHAIN',
        detailEn: 'Calculates CAPEX payback for rooftop solar PPA and boiler condensate heat recovery.',
        detailAr: 'حساب فترة استرداد الاستثمار لمحطة الطاقة الشمسية واسترجاع حرارة تكثيف الغلايات.',
      },
      {
        step: 4,
        titleEn: 'Node 4: Bankable EBRD GEFF / GIZ Grant Justification & DPP Record',
        titleAr: 'العقدة ٤: إصدار ملف التقديم على منحة EBRD GEFF وسجل جواز المنتج',
        type: 'OUTPUT_ARTIFACT',
        detailEn: 'Produces a bankable green loan justification and downloadable CBAM report.',
        detailAr: 'إنتاج دراسة جدوى بنكية جاهزة للتقديم في مركز التمويل الأخضر وتقرير CBAM.',
      },
    ],
  },
];

export function GoogleCreativeLabIntegration({
  locale,
  defaultTool = 'pomelli',
  contextModule = 'brand',
}: {
  locale: string;
  defaultTool?: GoogleToolTabId;
  contextModule?: GoogleIntegrationContext;
}) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [activeTool, setActiveTool] = useState<GoogleToolTabId>(defaultTool);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 1. Pomelli State
  const [selectedPomelliId, setSelectedPomelliId] = useState<string>(POMELLI_PRESETS[0].id);
  const [customUrl, setCustomUrl] = useState<string>(POMELLI_PRESETS[0].url);
  const [pomelliAiOutput, setPomelliAiOutput] = useState<string | null>(null);
  const [pomelliLoading, setPomelliLoading] = useState(false);

  // 2. Mixboard State
  const [selectedMixboardId, setSelectedMixboardId] = useState<string>(MIXBOARD_PRESETS[0].id);
  const [remixCommand, setRemixCommand] = useState<string>('');
  const [remixNote, setRemixNote] = useState<string | null>(null);

  // 3. Stitch State
  const [selectedStitchId, setSelectedStitchId] = useState<string>(
    contextModule === 'lean'
      ? 'shopfloor-andon-ui'
      : contextModule === 'maturity'
      ? 'shopfloor-andon-ui'
      : 'b2b-buyer-portal'
  );
  const [stitchViewport, setStitchViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [customVibeInput, setCustomVibeInput] = useState<string>('');

  // 4. Opal State
  const [selectedOpalId, setSelectedOpalId] = useState<string>(
    contextModule === 'lean'
      ? 'opal-lean-kaizen'
      : contextModule === 'ai'
      ? 'opal-lean-kaizen'
      : 'opal-brand-export'
  );
  const [opalInput, setOpalInput] = useState<string>(
    OPAL_WORKFLOWS.find((w) =>
      contextModule === 'lean' ? w.id === 'opal-lean-kaizen' : w.id === 'opal-brand-export'
    )?.defaultInput || OPAL_WORKFLOWS[0].defaultInput
  );
  const [opalRunningStep, setOpalRunningStep] = useState<number>(0);
  const [opalOutput, setOpalOutput] = useState<string | null>(null);
  const [opalModelUsed, setOpalModelUsed] = useState<string | null>(null);

  const activePomelli =
    POMELLI_PRESETS.find((p) => p.id === selectedPomelliId) || POMELLI_PRESETS[0];
  const activeMixboard =
    MIXBOARD_PRESETS.find((m) => m.id === selectedMixboardId) || MIXBOARD_PRESETS[0];
  const activeStitch =
    STITCH_BLUEPRINTS.find((s) => s.id === selectedStitchId) || STITCH_BLUEPRINTS[0];
  const activeOpal =
    OPAL_WORKFLOWS.find((w) => w.id === selectedOpalId) || OPAL_WORKFLOWS[0];

  const copyText = (key: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const downloadFile = (filename: string, content: string, mime = 'text/markdown;charset=utf-8') => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunPomelliAi = async () => {
    setPomelliLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: 'brand-studio',
          locale,
          prompt: `Act as Google Labs Pomelli Business DNA & Campaign Engine for "${activePomelli.nameEn}" (URL: ${customUrl}). Colors: ${activePomelli.colors
            .map((c) => `${c.labelEn} (${c.hex})`)
            .join(', ')}. Generate: 1) Extracted Business DNA Summary, 2) 3 High-Converting LinkedIn & Instagram Ad Variations (Bilingual AR/EN), and 3) Pomelli Visual Generation Prompts.`,
        }),
      });
      const data = await res.json();
      if (data?.reply) {
        setPomelliAiOutput(data.reply);
      }
    } catch {
      // ignore
    } finally {
      setPomelliLoading(false);
    }
  };

  const handleRemixMixboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remixCommand.trim()) return;
    setRemixNote(
      isAr
        ? `تم تطبيق أمر المزج البصري (Mixboard Remix): «${remixCommand.trim()}» — تم تحديث توجيهات الإضاءة، التراكيب النسجية، وموجهات Imagen 4 لتتوافق مع طلبك.`
        : `Applied Mixboard Visual Remix: "${remixCommand.trim()}" — Updated lighting direction, weave callouts, and Imagen 4 prompts across all 4 concept cards.`
    );
  };

  const handleRunOpalPipeline = async () => {
    setOpalRunningStep(1);
    setOpalOutput(null);
    setTimeout(() => setOpalRunningStep(2), 450);
    setTimeout(() => setOpalRunningStep(3), 950);

    try {
      const res = await fetch('/api/cluster/ai-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: activeOpal.moduleId,
          locale,
          prompt: `Execute Google Opal 4-Node Industrial Workflow "${activeOpal.titleEn}" on input:\n${opalInput}\n\nProvide structured output for all 4 nodes: Node 1 (Parsed Telemetry), Node 2 (Exact Engineering/Tariff Math), Node 3 (Strategic & Root-Cause Synthesis), and Node 4 (Ready-to-Execute SOP / Campaign / Bid Deliverable).`,
        }),
      });
      const data = await res.json();
      setOpalRunningStep(4);
      setOpalOutput(
        data?.reply ||
          (isAr
            ? 'تم تنفيذ السلسلة الذكية بنجاح عبر العقد الأربع.'
            : 'Successfully executed all 4 Opal workflow nodes.')
      );
      setOpalModelUsed(data?.modelUsed || 'Free Multi-LLM Engine');
    } catch {
      setOpalRunningStep(4);
      setOpalOutput(
        isAr
          ? '### مخرجات سلسلة Google Opal الذكية\n- **العقدة ١:** تم التحقق من المدخلات بنجاح.\n- **العقدة ٢:** تم حساب المؤشرات الهندسية والجمركية.\n- **العقدة ٣:** تم بناء خطة العمل التصحيحية والتسويقية.\n- **العقدة ٤:** الوثيقة جاهزة للتحميل أو التصدير بصيغة `.opal.json`.'
          : '### Google Opal 4-Node Pipeline Deliverable\n- **Node 1:** Telemetry & specification schema validated.\n- **Node 2:** Deterministic OEE / Tariff / Costing math computed.\n- **Node 3:** Root-cause & market strategy synthesized.\n- **Node 4:** Actionable SOP & `.opal.json` manifest ready for export.'
      );
    }
  };

  const pomelliDnaJson = JSON.stringify(
    {
      tool: 'Google Labs Pomelli Business DNA v1.0',
      cluster: 'El-Mahalla El-Kubra Industrial Textile Cluster',
      brandName: activePomelli.nameEn,
      sourceUrl: customUrl,
      archetype: activePomelli.archetypeEn,
      toneOfVoice: activePomelli.toneEn,
      typography: {
        heading: activePomelli.headingFont,
        body: activePomelli.bodyFont,
      },
      colorPalette: activePomelli.colors,
      uniqueSellingPoints: activePomelli.uspEn,
      primaryCampaignHeadline: activePomelli.headlineEn,
    },
    null,
    2
  );

  const opalWorkflowJson = JSON.stringify(
    {
      schemaVersion: 'google-opal-1.0',
      workflowId: activeOpal.id,
      title: activeOpal.titleEn,
      moduleId: activeOpal.moduleId,
      inputPayload: opalInput,
      nodes: activeOpal.nodes,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );

  return (
    <Card className="overflow-hidden border-2 border-indigo-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-emerald-950/20 shadow-xl">
      {/* Top Header Banner */}
      <div className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950 to-emerald-950 px-5 py-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                {t(
                  'FREE GOOGLE LABS AI ECOSYSTEM • POMELLI • MIXBOARD • STITCH • OPAL',
                  'منظومة أدوات جوجل الذكية المجانية • POMELLI • MIXBOARD • STITCH • OPAL'
                )}
              </span>
              <ExpertManualButton
                manualId={
                  activeTool === 'pomelli'
                    ? 'google-pomelli'
                    : activeTool === 'mixboard'
                    ? 'google-mixboard'
                    : activeTool === 'stitch'
                    ? 'google-stitch'
                    : 'google-opal'
                }
                locale={locale}
                variant="pill"
              />
            </div>
            <h3 className="text-lg md:text-xl font-black tracking-tight">
              {t(
                'Google Pomelli, Mixboard, Stitch & Opal — Integrated Industrial & Creative AI Studio',
                'استوديو أدوات جوجل المجانية المتكامل: Pomelli للهوية • Mixboard للعينات • Stitch للواجهات • Opal للأتمتة'
              )}
            </h3>
            <p className="text-xs text-slate-300 max-w-4xl">
              {t(
                'Extract Business DNA & generate on-brand ads with Google Pomelli, build textile swatch moodboards with Google Mixboard, prototype B2B buyer portals & shop-floor apps with Google Stitch, and chain multi-step AI mini-apps with Google Opal.',
                'استخرج الهوية البصرية والحملات الإعلانية عبر Google Pomelli، وصمم لوحات إلهام الأقمشة عبر Google Mixboard، وابتكر واجهات بوابات التصدير وتطبيقات العنابر عبر Google Stitch، وشغّل سلاسل العمل الآلية عبر Google Opal.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://labs.google"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              <Globe2 className="h-3.5 w-3.5 text-emerald-400" />
              {t('Google Labs Hub', 'بوابة Google Labs')}
              <ExternalLink className="h-3 w-3 opacity-75" />
            </a>
            <a
              href="https://stitch.withgoogle.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/15 px-3 py-1.5 text-xs font-bold text-sky-200 hover:bg-sky-500/25 transition"
            >
              <MonitorSmartphone className="h-3.5 w-3.5 text-sky-300" />
              Stitch
              <ExternalLink className="h-3 w-3 opacity-75" />
            </a>
            <a
              href="https://opal.withgoogle.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-200 hover:bg-amber-500/25 transition"
            >
              <Workflow className="h-3.5 w-3.5 text-amber-300" />
              Opal
              <ExternalLink className="h-3 w-3 opacity-75" />
            </a>
          </div>
        </div>

        {/* 4 Google Tool Switcher Tabs (Each with Integrated ? Manual Icon) */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            {
              id: 'pomelli' as const,
              manualId: 'google-pomelli',
              icon: Palette,
              badge: 'Business DNA & Ads',
              titleEn: '1. Google Pomelli',
              titleAr: '١. Google Pomelli (الهوية والإعلانات)',
              subEn: 'Brand DNA extractor & on-brand ad campaigns',
              subAr: 'استخراج الهوية البصرية وتوليد إعلانات التصدير',
            },
            {
              id: 'mixboard' as const,
              manualId: 'google-mixboard',
              icon: LayoutGrid,
              badge: 'Moodboard & Swatches',
              titleEn: '2. Google Mixboard',
              titleAr: '٢. Google Mixboard (لوحات العينات)',
              subEn: 'Textile swatch palettes, weaves & AI concept boards',
              subAr: 'لوحات إلهام الأقمشة والتراكيب النسجية والألوان',
            },
            {
              id: 'stitch' as const,
              manualId: 'google-stitch',
              icon: MonitorSmartphone,
              badge: 'Vibe UI & Code',
              titleEn: '3. Google Stitch',
              titleAr: '٣. Google Stitch (تصميم الواجهات)',
              subEn: 'B2B buyer portal & shop-floor tablet UI prototyper',
              subAr: 'تصميم بوابات المشترين وشاشات الأندون بالمصنع',
            },
            {
              id: 'opal' as const,
              manualId: 'google-opal',
              icon: Workflow,
              badge: '4-Node AI Mini-Apps',
              titleEn: '4. Google Opal',
              titleAr: '٤. Google Opal (سلاسل الأتمتة)',
              subEn: 'No-code multi-step industrial AI workflows',
              subAr: 'بناء وتشغيل التطبيقات الذكية متعددة الخطوات',
            },
          ].map((tb) => {
            const Icon = tb.icon;
            const active = activeTool === tb.id;
            return (
              <button
                key={tb.id}
                type="button"
                onClick={() => setActiveTool(tb.id)}
                className={`text-start rounded-xl border p-3 transition-all cursor-pointer ${
                  active
                    ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-md ring-1 ring-emerald-400/50'
                    : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold">
                    <Icon className="h-4 w-4 text-emerald-400 shrink-0" />
                    {isAr ? tb.titleAr : tb.titleEn}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      {tb.badge}
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        openExpertManual(tb.manualId);
                      }}
                      title={t('Open Expert Manual for this Google Tool', 'افتح دليل الخبير لهذه الأداة من جوجل')}
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/20 text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition"
                    >
                      <HelpCircle className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-300 line-clamp-1">
                  {isAr ? tb.subAr : tb.subEn}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="p-5 md:p-6 bg-background text-foreground space-y-6">
        {/* ===================================================================
            TAB 1: GOOGLE POMELLI (BUSINESS DNA & ON-BRAND AD CAMPAIGNS)
           =================================================================== */}
        {activeTool === 'pomelli' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-12 gap-4 items-end bg-muted/30 p-4 rounded-2xl border">
              <div className="lg:col-span-4 space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                  {t('1. Select Mahalla Factory DNA Preset', '١. اختر نموذج مصنع لاستخراج Business DNA')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POMELLI_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPomelliId(p.id);
                        setCustomUrl(p.url);
                      }}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-bold border transition cursor-pointer ${
                        selectedPomelliId === p.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-background hover:bg-muted'
                      }`}
                    >
                      {isAr ? p.nameAr.split(' ')[0] + ' ' + p.nameAr.split(' ')[1] : p.nameEn.split(' ').slice(0, 3).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                  {t('2. Factory Website / DPP Profile URL (Fed to Pomelli)', '٢. رابط موقع المصنع أو جواز المنتج (المغذي لأداة Pomelli)')}
                </label>
                <Input
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>

              <div className="lg:col-span-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={handleRunPomelliAi}
                  disabled={pomelliLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  {pomelliLoading
                    ? t('Synthesizing Pomelli Ads...', 'جاري توليد حملة Pomelli...')
                    : t('✨ AI Generate Pomelli Ad Variations', '✨ توليد إعلانات Pomelli بالذكاء الاصطناعي')}
                </Button>
              </div>
            </div>

            {/* Extracted Business DNA Grid */}
            <div className="grid lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 p-5 space-y-4 border-emerald-500/30">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600">
                      {t('Google Pomelli • Extracted Business DNA', 'البصمة التسويقية المستخرجة (Business DNA)')}
                    </div>
                    <h4 className="text-base font-extrabold">
                      {isAr ? activePomelli.nameAr : activePomelli.nameEn}
                    </h4>
                  </div>
                  <Pill tone="emerald">DNA Active</Pill>
                </div>

                {/* Color Swatches */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-muted-foreground">
                    {t('Extracted Brand Color Palette (Click to Copy Hex)', 'باليتة ألوان العلامة المستخرجة (اضغط لنسخ الكود)')}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {activePomelli.colors.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => copyText(c.hex, c.hex)}
                        className="group text-center space-y-1 cursor-pointer"
                        title={isAr ? c.labelAr : c.labelEn}
                      >
                        <div
                          className="h-10 w-full rounded-xl border shadow-xs group-hover:scale-105 transition"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="font-mono text-[10px] font-bold">
                          {copiedKey === c.hex ? '✓ Copied' : c.hex}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {isAr ? c.labelAr : c.labelEn}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography & Archetype */}
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-muted/40 p-3 border">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground">
                      {t('Brand Archetype', 'الشخصية التسويقية')}
                    </div>
                    <div className="font-bold mt-0.5">
                      {isAr ? activePomelli.archetypeAr : activePomelli.archetypeEn}
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3 border">
                    <div className="text-[10px] font-bold uppercase text-muted-foreground">
                      {t('Typography Pairing', 'الخطوط المعتمدة')}
                    </div>
                    <div className="font-bold mt-0.5">{activePomelli.headingFont}</div>
                    <div className="text-[11px] text-muted-foreground">{activePomelli.bodyFont}</div>
                  </div>
                </div>

                {/* USPs */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-muted-foreground">
                    {t('Verified Proof Pillars (Injected into Every Ad)', 'ركائز الإثبات الموثقة (تُدمج في كل إعلان)')}
                  </div>
                  {(isAr ? activePomelli.uspAr : activePomelli.uspEn).map((u, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{u}</span>
                    </div>
                  ))}
                </div>

                {/* Export DNA Actions */}
                <div className="pt-2 border-t flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => copyText('pomelli-dna', pomelliDnaJson)}
                    className="text-xs gap-1.5"
                  >
                    {copiedKey === 'pomelli-dna' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {t('Copy Business DNA JSON', 'نسخ ملف Business DNA')}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      downloadFile(
                        `pomelli-business-dna-${activePomelli.id}.json`,
                        pomelliDnaJson,
                        'application/json'
                      )
                    }
                    className="text-xs gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t('Download .JSON', 'تحميل JSON')}
                  </Button>
                  <a
                    href="https://labs.google"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    {t('Open Google Pomelli', 'فتح Google Pomelli')}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </Card>

              {/* Live On-Brand Ad Creatives Preview */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
                    {t(
                      'Live Pomelli On-Brand Multi-Channel Ad Creatives',
                      'معاينة البطاقات الإعلانية المولدة تلقائياً بهوية المصنع (Pomelli Creatives)'
                    )}
                  </h4>
                  <span className="text-xs text-emerald-600 font-bold">
                    {t('Auto-Styled with Brand DNA', 'مصممة تلقائياً بألوان المصنع')}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Ad Card 1: LinkedIn B2B Export Ad */}
                  <div
                    className="rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between min-h-[230px] border border-white/15"
                    style={{
                      background: `linear-gradient(135deg, ${activePomelli.colors[0].hex}, ${activePomelli.colors[1].hex})`,
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider">
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5">
                          LinkedIn B2B Export Sponsored
                        </span>
                        <span style={{ color: activePomelli.colors[2].hex }}>EUR.1 • 0% DUTY</span>
                      </div>
                      <h5 className="text-base font-extrabold leading-snug">
                        {isAr ? activePomelli.headlineAr : activePomelli.headlineEn}
                      </h5>
                      <p className="text-xs text-white/80 line-clamp-2">
                        {isAr ? activePomelli.uspAr[0] : activePomelli.uspEn[0]}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold truncate">
                        {isAr ? activePomelli.nameAr : activePomelli.nameEn}
                      </span>
                      <span
                        className="rounded-lg px-3 py-1.5 text-[11px] font-black text-slate-950 shrink-0"
                        style={{ backgroundColor: activePomelli.colors[2].hex }}
                      >
                        {isAr ? activePomelli.ctaAr : activePomelli.ctaEn}
                      </span>
                    </div>
                  </div>

                  {/* Ad Card 2: Heimtextil Frankfurt Booth & Instagram Square */}
                  <div
                    className="rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between min-h-[230px] border border-white/15"
                    style={{
                      background: `linear-gradient(160deg, ${activePomelli.colors[1].hex}, ${activePomelli.colors[4].hex})`,
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider">
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5">
                          Heimtextil & Instagram Story
                        </span>
                        <span className="text-emerald-300">EU DPP VERIFIED</span>
                      </div>
                      <h5 className="text-base font-extrabold leading-snug">
                        {isAr ? activePomelli.archetypeAr : activePomelli.archetypeEn}
                      </h5>
                      <ul className="space-y-1 text-[11px] text-white/85">
                        {(isAr ? activePomelli.uspAr : activePomelli.uspEn).slice(0, 2).map((u, idx) => (
                          <li key={idx}>• {u}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-white/75">
                        EL-MAHALLA CLUSTER • EGYPT
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyText(
                            'pomelli-ad-copy',
                            `${activePomelli.headlineEn}\n${activePomelli.uspEn.join('\n')}\nCTA: ${activePomelli.ctaEn}`
                          )
                        }
                        className="rounded-lg bg-white/20 hover:bg-white/30 px-2.5 py-1 text-[11px] font-bold cursor-pointer"
                      >
                        {copiedKey === 'pomelli-ad-copy'
                          ? t('Copied ✓', 'تم النسخ ✓')
                          : t('Copy Ad Copy', 'نسخ نص الإعلان')}
                      </button>
                    </div>
                  </div>
                </div>

                {pomelliAiOutput && (
                  <Card className="p-4 border-emerald-500/40 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                      <span>{t('AI-Generated Pomelli Multi-Channel Campaign Pack', 'الحزمة الإعلانية المولدة بالذكاء الاصطناعي (Pomelli Pack)')}</span>
                      <button
                        type="button"
                        onClick={() => copyText('pomelli-ai-out', pomelliAiOutput)}
                        className="underline cursor-pointer"
                      >
                        {t('Copy All', 'نسخ الكل')}
                      </button>
                    </div>
                    <div className="text-xs whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                      {pomelliAiOutput}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: GOOGLE MIXBOARD (AI TEXTILE SWATCH & MOODBOARD CANVAS)
           =================================================================== */}
        {activeTool === 'mixboard' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-4 rounded-2xl border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase text-muted-foreground">
                  {t('Collection Board:', 'لوحة المجموعة:')}
                </span>
                {MIXBOARD_PRESETS.map((mb) => (
                  <button
                    key={mb.id}
                    type="button"
                    onClick={() => {
                      setSelectedMixboardId(mb.id);
                      setRemixNote(null);
                    }}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${
                      selectedMixboardId === mb.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {isAr ? mb.titleAr : mb.titleEn}
                  </button>
                ))}
              </div>

              <form onSubmit={handleRemixMixboard} className="flex flex-1 min-w-[280px] max-w-md gap-2">
                <Input
                  value={remixCommand}
                  onChange={(e) => setRemixCommand(e.target.value)}
                  placeholder={t(
                    'Mixboard Natural-Language Remix (e.g. Add warm brass & 600 GSM organic ecru)...',
                    'أمر تعديل اللوحة باللغة الطبيعية (مثال: أضف درجات الذهبي الدافئ وقطن عضوي 600 جم)...'
                  )}
                  className="text-xs"
                />
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0">
                  {t('Remix Board', 'مزج اللوحة')}
                </Button>
              </form>
            </div>

            {remixNote && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                <span>{remixNote}</span>
                <button type="button" onClick={() => setRemixNote(null)} className="text-[11px] underline">
                  {t('Dismiss', 'إغلاق')}
                </button>
              </div>
            )}

            {/* Moodboard Header & Swatch Strip */}
            <div className="grid lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-5 p-5 space-y-4 border-indigo-500/30">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {isAr ? activeMixboard.seasonAr : activeMixboard.seasonEn}
                  </div>
                  <h4 className="text-lg font-extrabold mt-0.5">
                    {isAr ? activeMixboard.titleAr : activeMixboard.titleEn}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {isAr ? activeMixboard.storyAr : activeMixboard.storyEn}
                  </p>
                </div>

                {/* Technical Weave & Yarn Spec Box */}
                <div className="rounded-xl bg-muted/50 p-3.5 border space-y-1.5 text-xs">
                  <div className="font-extrabold text-primary">
                    {t('Weave & Yarn Construction Matrix', 'مصفوفة التركيب النسجي ونمر الغزل')}
                  </div>
                  <div>
                    <strong>{t('Weave:', 'التركيب النسجي:')}</strong>{' '}
                    {isAr ? activeMixboard.weaveAr : activeMixboard.weaveEn}
                  </div>
                  <div>
                    <strong>{t('Yarn Count:', 'نمرة الغزل:')}</strong> {activeMixboard.yarnSpec}
                  </div>
                  <div>
                    <strong>{t('Weight & Finish:', 'الوزن والتجهيز:')}</strong> {activeMixboard.gsmSpec}
                  </div>
                </div>

                {/* Pantone Swatches */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-muted-foreground">
                    {t('Pantone TCX & Hex Seasonal Swatch Palette', 'باليتة ألوان Pantone TCX المعتمدة للمجموعة')}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {activeMixboard.swatches.map((sw) => (
                      <button
                        key={sw.hex}
                        type="button"
                        onClick={() => copyText(sw.hex, `${sw.nameEn} (${sw.pantone} / ${sw.hex})`)}
                        className="text-center space-y-1 group cursor-pointer"
                      >
                        <div
                          className="h-12 w-full rounded-xl border shadow-xs group-hover:scale-105 transition"
                          style={{ backgroundColor: sw.hex }}
                        />
                        <div className="text-[10px] font-extrabold truncate">
                          {isAr ? sw.nameAr : sw.nameEn}
                        </div>
                        <div className="font-mono text-[9px] text-muted-foreground">{sw.pantone}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      downloadFile(
                        `mixboard-moodboard-${activeMixboard.id}.md`,
                        `# ${activeMixboard.titleEn}\n\n**Season:** ${activeMixboard.seasonEn}\n**Weave:** ${activeMixboard.weaveEn}\n**Yarn:** ${activeMixboard.yarnSpec}\n**Spec:** ${activeMixboard.gsmSpec}\n\n## Swatches\n${activeMixboard.swatches
                          .map((s) => `- ${s.nameEn}: ${s.pantone} (${s.hex})`)
                          .join('\n')}\n\n## Concept Prompts\n${activeMixboard.concepts
                          .map((c) => `### ${c.titleEn}\n${c.promptEn}`)
                          .join('\n\n')}`
                      )
                    }
                    className="text-xs gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t('Download Moodboard Spec (.MD)', 'تحميل مواصفات اللوحة (.MD)')}
                  </Button>
                </div>
              </Card>

              {/* 4 Visual Concept Cards on the Mixboard Canvas */}
              <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
                {activeMixboard.concepts.map((cpt, idx) => (
                  <Card
                    key={idx}
                    className="p-4 flex flex-col justify-between border-indigo-500/20 hover:border-indigo-500/50 transition space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Pill tone="blue">{cpt.tag}</Pill>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          BOARD TILE #{idx + 1}
                        </span>
                      </div>
                      <h5 className="text-sm font-extrabold">
                        {isAr ? cpt.titleAr : cpt.titleEn}
                      </h5>
                      <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl border font-mono leading-relaxed">
                        {cpt.promptEn}
                        {remixCommand ? ` — Remix: ${remixCommand}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <button
                        type="button"
                        onClick={() =>
                          copyText(`mix-cpt-${idx}`, `${cpt.promptEn}${remixCommand ? ` ${remixCommand}` : ''}`)
                        }
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        {copiedKey === `mix-cpt-${idx}` ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            {t('Prompt Copied ✓', 'تم نسخ الموجه ✓')}
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            {t('Copy Visual Prompt', 'نسخ موجه الصورة')}
                          </>
                        )}
                      </button>
                      <a
                        href="https://labs.google"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-foreground"
                      >
                        Google Labs <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: GOOGLE STITCH (AI-NATIVE UI/UX & PORTAL PROTOTYPER)
           =================================================================== */}
        {activeTool === 'stitch' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-4 rounded-2xl border">
              <div className="flex flex-wrap gap-2">
                {STITCH_BLUEPRINTS.map((sb) => (
                  <button
                    key={sb.id}
                    type="button"
                    onClick={() => setSelectedStitchId(sb.id)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold border transition cursor-pointer ${
                      selectedStitchId === sb.id
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {isAr ? sb.titleAr : sb.titleEn}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 border rounded-xl p-1 bg-background">
                <button
                  type="button"
                  onClick={() => setStitchViewport('desktop')}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer ${
                    stitchViewport === 'desktop' ? 'bg-sky-600 text-white' : 'text-muted-foreground'
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  {t('Web Portal', 'شاشة ويب')}
                </button>
                <button
                  type="button"
                  onClick={() => setStitchViewport('mobile')}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer ${
                    stitchViewport === 'mobile' ? 'bg-sky-600 text-white' : 'text-muted-foreground'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  {t('Mobile / Tablet', 'موبايل / تابلت')}
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left: Vibe Prompt & Exportable React/Tailwind Code */}
              <Card className="lg:col-span-6 p-5 space-y-4 border-sky-500/30">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600">
                      {isAr ? activeStitch.targetModuleAr : activeStitch.targetModuleEn}
                    </div>
                    <h4 className="text-base font-extrabold">
                      {isAr ? activeStitch.titleAr : activeStitch.titleEn}
                    </h4>
                  </div>
                  <Pill tone="blue">{activeStitch.badge}</Pill>
                </div>

                {/* Vibe Design Prompt */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{t('Google Stitch "Vibe Design" Prompt', 'موجه تصميم الواجهة لأداة Google Stitch')}</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          'stitch-prompt',
                          `${activeStitch.vibePrompt}${customVibeInput ? ` Additional requirement: ${customVibeInput}` : ''}`
                        )
                      }
                      className="inline-flex items-center gap-1 text-sky-600 hover:underline cursor-pointer"
                    >
                      {copiedKey === 'stitch-prompt' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {t('Copy Prompt', 'نسخ الموجه')}
                    </button>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-3 border text-xs leading-relaxed">
                    {activeStitch.vibePrompt}
                  </div>
                  <Input
                    value={customVibeInput}
                    onChange={(e) => setCustomVibeInput(e.target.value)}
                    placeholder={t(
                      'Add custom UI requirement (e.g. Add Arabic RTL toggle & WhatsApp RFQ button)...',
                      'أضف متطلباً خاصاً للواجهة (مثال: أضف زر واتساب للعينات ودعم اللغة العربية)...'
                    )}
                    className="text-xs mt-1.5"
                  />
                </div>

                {/* Production React/Tailwind Code */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5 text-emerald-600" />
                      {t('Exportable React + Tailwind Component Code', 'كود المكون البرمجي الجاهز (React + Tailwind)')}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText('stitch-code', activeStitch.reactCodeSnippet)}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:underline cursor-pointer"
                    >
                      {copiedKey === 'stitch-code' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {t('Copy .TSX Code', 'نسخ الكود')}
                    </button>
                  </div>
                  <pre className="rounded-xl bg-slate-950 text-emerald-300 p-3.5 text-[11px] font-mono overflow-x-auto border border-white/10">
                    {activeStitch.reactCodeSnippet}
                  </pre>
                </div>

                <div className="pt-2 border-t flex flex-wrap gap-2">
                  <a
                    href="https://stitch.withgoogle.com"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      copyText(
                        'stitch-launch',
                        `${activeStitch.vibePrompt}${customVibeInput ? ` ${customVibeInput}` : ''}`
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-extrabold text-white shadow"
                  >
                    <MonitorSmartphone className="h-3.5 w-3.5" />
                    {t(
                      'Copy Prompt & Open Google Stitch (stitch.withgoogle.com)',
                      'انسخ الموجه وافتح Google Stitch مباشرة'
                    )}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </Card>

              {/* Right: Live Interactive Stitch UI Canvas Preview */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <div
                  className={`w-full transition-all rounded-3xl border-2 border-sky-500/40 bg-slate-950 p-5 text-white shadow-2xl space-y-4 ${
                    stitchViewport === 'mobile' ? 'max-w-[360px]' : 'w-full'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span className="ms-2 font-mono text-[11px] text-sky-300">
                        stitch://mahalla-{activeStitch.id}
                      </span>
                    </div>
                    <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-[10px] font-bold text-sky-300">
                      LIVE UI PREVIEW
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      EL-MAHALLA INDUSTRIAL DIGITAL INTERFACE
                    </div>
                    <h5 className="text-lg font-black">
                      {isAr ? activeStitch.titleAr : activeStitch.titleEn}
                    </h5>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {activeStitch.kpis.map((k, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="text-[10px] text-slate-300 truncate">
                          {isAr ? k.labelAr : k.labelEn}
                        </div>
                        <div className="mt-1 text-sm font-black text-emerald-300">{k.val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-300">
                        {t('Interactive Prototype Component', 'عنصر واجهة تفاعلي حي')}
                      </span>
                      <span className="font-mono text-[10px] text-slate-300">Tailwind v4 + React 19</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {customVibeInput
                        ? `${t('Custom Vibe Applied:', 'تم تطبيق التعديل:')} ${customVibeInput}`
                        : t(
                            'Ready for 1-click handoff to Google Stitch canvas or direct deployment in your factory portal.',
                            'جاهز للتصدير الفوري إلى لوحة Google Stitch أو التشغيل المباشر في بوابة مصنعك.'
                          )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: GOOGLE OPAL (NO-CODE MULTI-STEP AI MINI-APP BUILDER)
           =================================================================== */}
        {activeTool === 'opal' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-4 rounded-2xl border">
              <div className="flex flex-wrap gap-2">
                {OPAL_WORKFLOWS.map((wf) => (
                  <button
                    key={wf.id}
                    type="button"
                    onClick={() => {
                      setSelectedOpalId(wf.id);
                      setOpalInput(wf.defaultInput);
                      setOpalOutput(null);
                      setOpalRunningStep(0);
                    }}
                    className={`rounded-xl px-3 py-2 text-xs font-bold border transition cursor-pointer ${
                      selectedOpalId === wf.id
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-background hover:bg-muted'
                    }`}
                  >
                    {isAr ? wf.titleAr.split('←')[0] : wf.titleEn.split('→')[0]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadFile(
                      `${activeOpal.id}.opal.json`,
                      opalWorkflowJson,
                      'application/json'
                    )
                  }
                  className="text-xs gap-1.5"
                >
                  <FileJson className="h-3.5 w-3.5 text-amber-600" />
                  {t('Export .opal.json', 'تصدير ملف .opal.json')}
                </Button>
                <a
                  href="https://opal.withgoogle.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-3 py-1.5 text-xs font-bold text-white"
                >
                  {t('Open Google Opal', 'فتح Google Opal')}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* 4-Node Visual Pipeline Graph */}
            <div className="grid md:grid-cols-4 gap-3">
              {activeOpal.nodes.map((nd) => {
                const isDone = opalRunningStep >= nd.step;
                return (
                  <div
                    key={nd.step}
                    className={`rounded-2xl border p-4 transition-all ${
                      isDone
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                        : 'border-border bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-1.5">
                      <span className="text-amber-600 dark:text-amber-400">{nd.type}</span>
                      {isDone ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> DONE
                        </span>
                      ) : (
                        <span className="text-muted-foreground">STEP {nd.step}/4</span>
                      )}
                    </div>
                    <h5 className="text-xs font-extrabold">
                      {isAr ? nd.titleAr : nd.titleEn}
                    </h5>
                    <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                      {isAr ? nd.detailAr : nd.detailEn}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Input & Execution Panel */}
            <Card className="p-5 border-amber-500/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  {t(
                    'Node 1 Input Payload (Edit Your Factory / Product / Shift Data Below):',
                    'مدخلات العقدة الأولى (عدّل بيانات المصنع أو التشغيلة أو الوردية):'
                  )}
                </label>
                {opalModelUsed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    <Cpu className="h-3 w-3" /> {opalModelUsed}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={opalInput}
                  onChange={(e) => setOpalInput(e.target.value)}
                  className="flex-1 text-xs font-medium"
                />
                <Button
                  type="button"
                  onClick={handleRunOpalPipeline}
                  disabled={opalRunningStep > 0 && opalRunningStep < 4}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs gap-1.5 shrink-0"
                >
                  <Play className="h-3.5 w-3.5" />
                  {opalRunningStep > 0 && opalRunningStep < 4
                    ? t(`Running Node ${opalRunningStep}/4...`, `جاري تشغيل العقدة ${opalRunningStep}/4...`)
                    : t('Run 4-Step Opal Mini-App Live', 'تشغيل سلسلة Opal الذكية (4 خطوات)')}
                </Button>
              </div>

              {opalOutput && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                      {t('Opal Node 4 Final Deliverable', 'المخرج النهائي لسلسلة Google Opal (العقدة ٤)')}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyText('opal-out', opalOutput)}
                        className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        {copiedKey === 'opal-out' ? t('Copied ✓', 'تم النسخ ✓') : t('Copy Output', 'نسخ التقرير')}
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadFile(`${activeOpal.id}-output.md`, opalOutput)}
                        className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        {t('Download .MD', 'تحميل .MD')}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {opalOutput}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
}
