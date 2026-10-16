export interface BrandColorSwatch {
  nameEn: string;
  nameAr: string;
  hex: string;
  pantoneTcx: string;
  usageEn: string;
  usageAr: string;
}

export interface BuyerPersona {
  roleEn: string;
  roleAr: string;
  regionEn: string;
  regionAr: string;
  painPointsEn: string[];
  painPointsAr: string[];
  decisionTriggersEn: string[];
  decisionTriggersAr: string[];
  typicalOrderSize: string;
}

export interface MarketingChannelPlan {
  channelEn: string;
  channelAr: string;
  budgetSharePct: number;
  monthlyCadenceEn: string;
  monthlyCadenceAr: string;
  primaryKpiEn: string;
  primaryKpiAr: string;
  expectedRoas: string;
  tacticsEn: string[];
  tacticsAr: string[];
}

export interface RoadmapPhase {
  phaseEn: string;
  phaseAr: string;
  weeks: string;
  objectiveEn: string;
  objectiveAr: string;
  deliverablesEn: string[];
  deliverablesAr: string[];
  targetMetric: string;
}

export interface AutomationWorkflow {
  id: string;
  nameEn: string;
  nameAr: string;
  triggerEn: string;
  triggerAr: string;
  audienceEn: string;
  audienceAr: string;
  conversionGoal: string;
  steps: {
    dayOffset: string;
    channel: 'LINKEDIN' | 'EMAIL' | 'WHATSAPP' | 'INSTAGRAM' | 'CRM_WEBHOOK';
    titleEn: string;
    titleAr: string;
    copyEn: string;
    copyAr: string;
  }[];
}

export interface ScheduledCalendarItem {
  id: string;
  week: number;
  dayEn: string;
  dayAr: string;
  channel: 'LinkedIn' | 'Instagram Reels' | 'B2B Email' | 'WhatsApp VIP' | 'Trade Portal';
  formatEn: string;
  formatAr: string;
  headlineEn: string;
  headlineAr: string;
  captionEn: string;
  captionAr: string;
  ctaEn: string;
  ctaAr: string;
  autoStatus: 'AUTO_SCHEDULED' | 'READY_TO_PUBLISH' | 'ACTIVE_DRIP';
}

export interface VideoSceneSpec {
  sceneNumber: number;
  durationSec: number;
  visualSettingEn: string;
  visualSettingAr: string;
  cameraMovementEn: string;
  cameraMovementAr: string;
  onScreenTextEn: string;
  onScreenTextAr: string;
  voiceoverEn: string;
  voiceoverAr: string;
  accentHex: string;
}

export interface PromoPhotoConcept {
  id: string;
  styleTagEn: string;
  styleTagAr: string;
  titleEn: string;
  titleAr: string;
  headlineOverlayEn: string;
  headlineOverlayAr: string;
  subOverlayEn: string;
  subOverlayAr: string;
  cameraSpec: string;
  aiPromptEn: string;
  primaryHex: string;
  secondaryHex: string;
  patternType: 'WEAVE_MACRO' | 'EDITORIAL_DRAPE' | 'MILL_CRAFT' | 'SOCIAL_PRODUCT';
}

export interface BrochurePanel {
  panelNumber: number;
  panelRoleEn: string;
  panelRoleAr: string;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
  bulletsEn: string[];
  bulletsAr: string[];
  highlightStat?: string;
}

export interface BrandMarketingKit {
  id: string;
  topicEn: string;
  topicAr: string;
  brandNameEn: string;
  brandNameAr: string;
  altBrandNames: { en: string; ar: string; rationaleEn: string; rationaleAr: string }[];
  taglineEn: string;
  taglineAr: string;
  archetypeEn: string;
  archetypeAr: string;
  positioningEn: string;
  positioningAr: string;
  storyEn: string;
  storyAr: string;
  uvpBulletsEn: string[];
  uvpBulletsAr: string[];
  certificationsBadges: string[];
  logoStyle: {
    monogram: string;
    emblemShape: 'CREST' | 'LOOM_DIAMOND' | 'COTTON_CROWN' | 'HEX_TECH';
    typographyEn: string;
    typographyAr: string;
  };
  palette: BrandColorSwatch[];
  packagingSpec: {
    wovenLabelEn: string;
    wovenLabelAr: string;
    hangtagCopyEn: string;
    hangtagCopyAr: string;
    sustainabilityClaimEn: string;
    sustainabilityClaimAr: string;
  };
  personas: BuyerPersona[];
  channels: MarketingChannelPlan[];
  roadmap: RoadmapPhase[];
  automations: AutomationWorkflow[];
  calendar: ScheduledCalendarItem[];
  videoSpec: {
    titleEn: string;
    titleAr: string;
    totalDurationSec: number;
    musicMoodEn: string;
    musicMoodAr: string;
    scenes: VideoSceneSpec[];
  };
  photoConcepts: PromoPhotoConcept[];
  brochurePanels: BrochurePanel[];
  flyerSpec: {
    badgeEn: string;
    badgeAr: string;
    headlineEn: string;
    headlineAr: string;
    subheadlineEn: string;
    subheadlineAr: string;
    offerHighlightEn: string;
    offerHighlightAr: string;
    keySpecs: { labelEn: string; labelAr: string; valueEn: string; valueAr: string }[];
    ctaEn: string;
    ctaAr: string;
    contactLine: string;
  };
  posterSpec: {
    exhibitionNameEn: string;
    exhibitionNameAr: string;
    boothNumber: string;
    heroStatementEn: string;
    heroStatementAr: string;
    subStatementEn: string;
    subStatementAr: string;
    pillars: { titleEn: string; titleAr: string; metric: string }[];
    footerCalloutEn: string;
    footerCalloutAr: string;
  };
}

export interface BrandStudioInput {
  topic: string;
  brandName?: string;
  targetMarket?: string;
  productCategory?: string;
  tone?: 'LUXURY_HERITAGE' | 'ECO_INNOVATION' | 'INDUSTRIAL_B2B' | 'MODERN_FASHION';
}

export const BRAND_STUDIO_PRESETS: {
  id: string;
  labelEn: string;
  labelAr: string;
  topic: string;
  brandName: string;
  targetMarket: string;
  productCategory: string;
  tone: 'LUXURY_HERITAGE' | 'ECO_INNOVATION' | 'INDUSTRIAL_B2B' | 'MODERN_FASHION';
}[] = [
  {
    id: 'giza-hospitality',
    labelEn: 'Luxury Giza 86 Hotel & Home Linen Brand',
    labelAr: 'علامة فاخرة لمفروشات الفنادق والمنزل من قطن جيزة ٨٦',
    topic: 'Luxury Egyptian Giza 86 Long-Staple Cotton 600TC Sateen Bedding & 650 GSM Spa Towels for 5-Star European Hotels',
    brandName: 'NILE CROWN ATELIER',
    targetMarket: 'EU & UK 5-Star Hospitality, Luxury Department Stores (DACH, France, GCC)',
    productCategory: 'Home & Hospitality Textiles',
    tone: 'LUXURY_HERITAGE',
  },
  {
    id: 'circular-denim',
    labelEn: 'Eco-Circular Denim & Organic Knitwear Label',
    labelAr: 'علامة الدنيم المستدام والتريكو العضوي للتصدير الأوروبي',
    topic: 'Zero-Liquid-Discharge (ZLD) Recycled Cotton Denim & GOTS Organic Interlock Knitwear with EU Digital Product Passports',
    brandName: 'VERDE DELTA STUDIO',
    targetMarket: 'Scandinavia, Germany & Netherlands Sustainable Fashion Retailers',
    productCategory: 'Sustainable Apparel & Denim',
    tone: 'ECO_INNOVATION',
  },
  {
    id: 'technical-yarn',
    labelEn: 'High-Precision Compact Spinning & Technical Textiles Mill',
    labelAr: 'هوية صناعية لمصنع غزل كومباكت ومنسوجات تقنية وطبية',
    topic: 'Combed Compact Ring-Spun Giza Yarns (Ne 40/1 to Ne 100/1) & ISO-Certified Flame-Retardant Workwear Fabrics',
    brandName: 'MAHALLA VORTEX TECH',
    targetMarket: 'Global Weaving Mills, Industrial Workwear Brands & Medical Procurement',
    productCategory: 'Fine Yarns & Technical Fabrics',
    tone: 'INDUSTRIAL_B2B',
  },
  {
    id: 'resort-linen',
    labelEn: 'Mediterranean Egyptian Linen & Modest Resortwear Brand',
    labelAr: 'علامة أزياء الكتان المصري والملابس العصرية الفاخرة',
    topic: 'Breathable Egyptian Flax Linen & Fine Mercerized Cotton Resortwear & Modest Capsule Collections',
    brandName: 'KHEPRI LINEN CO.',
    targetMarket: 'D2C E-Commerce, Boutique Concept Stores in Milan, Paris, Dubai & Riyadh',
    productCategory: 'Fashion & Resort Apparel',
    tone: 'MODERN_FASHION',
  },
];

export function synthesizeExpertBrandKit(input: BrandStudioInput): BrandMarketingKit {
  const rawTopic = (input.topic || '').trim() || BRAND_STUDIO_PRESETS[0].topic;
  const lower = rawTopic.toLowerCase();

  // Detect domain / tone automatically from any entered topic
  const isEco =
    input.tone === 'ECO_INNOVATION' ||
    /recycl|organic|gots|zdhc|green|sustainab|cbam|eco|solar|zero|مستدام|عضوي|بيئ|تدوير/.test(lower);
  const isIndustrial =
    input.tone === 'INDUSTRIAL_B2B' ||
    /yarn|spin|ne |loom|workwear|medical|technical|industrial|b2b|غزل|خيوط|تقني|طبي|صناعي/.test(lower);
  const isFashion =
    input.tone === 'MODERN_FASHION' ||
    /fashion|apparel|linen|dress|shirt|resort|modest|streetwear|أزياء|ملابس|كتان|موضة/.test(lower);

  const tone: 'LUXURY_HERITAGE' | 'ECO_INNOVATION' | 'INDUSTRIAL_B2B' | 'MODERN_FASHION' =
    input.tone ||
    (isEco
      ? 'ECO_INNOVATION'
      : isIndustrial
      ? 'INDUSTRIAL_B2B'
      : isFashion
      ? 'MODERN_FASHION'
      : 'LUXURY_HERITAGE');

  const defaultNames = {
    LUXURY_HERITAGE: { en: 'NILE CROWN ATELIER', ar: 'أتيليه تاج النيل' },
    ECO_INNOVATION: { en: 'VERDE DELTA TEXTILES', ar: 'فيردي دلتا للنسيج المستدام' },
    INDUSTRIAL_B2B: { en: 'MAHALLA VORTEX MILLS', ar: 'مصانع فورتكس المحلة' },
    MODERN_FASHION: { en: 'KHEPRI HERITAGE CO.', ar: 'خيبري للأزياء والكتان' },
  }[tone];

  const brandNameEn = (input.brandName || '').trim() || defaultNames.en;
  const brandNameAr =
    input.brandName && /[\u0600-\u06FF]/.test(input.brandName)
      ? input.brandName.trim()
      : `${defaultNames.ar} (${brandNameEn})`;

  const targetMarket =
    (input.targetMarket || '').trim() ||
    'European Union (Germany, Italy, France), UK & GCC Premium Buyers';

  const words = rawTopic
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
  const monogram =
    brandNameEn
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'MC';

  const palettes: Record<typeof tone, BrandColorSwatch[]> = {
    LUXURY_HERITAGE: [
      {
        nameEn: 'Royal Nile Midnight',
        nameAr: 'كحلي النيل الملكي',
        hex: '#0F172A',
        pantoneTcx: 'PANTONE 19-4024 TCX',
        usageEn: 'Primary Brand Background, Woven Labels & Rigid Gift Boxes',
        usageAr: 'الخلفية الرئيسية للهوية، التيكيت المنسوج وعلب التغليف الفاخرة',
      },
      {
        nameEn: 'Pharaonic Spun Gold',
        nameAr: 'ذهبي الغزل الفرعوني',
        hex: '#D4AF37',
        pantoneTcx: 'PANTONE 16-0948 TCX',
        usageEn: 'Hot-Foil Stamping, Monogram Crest & VIP Tier Badges',
        usageAr: 'الطباعة الحرارية الذهبية، شعار التاج، وشارات الجودة الفاخرة',
      },
      {
        nameEn: 'Raw Giza Cotton Ivory',
        nameAr: 'عاجي قطن جيزة الطبيعي',
        hex: '#FAF6F0',
        pantoneTcx: 'PANTONE 11-0105 TCX',
        usageEn: 'Brochure Canvas, Unbleached Cotton Ribbon & Editorial Space',
        usageAr: 'خلفية البروشورات، شرائط القطن الطبيعي، والمساحات النصية',
      },
      {
        nameEn: 'Alexandria Harbor Teal',
        nameAr: 'فيروزي ميناء الإسكندرية',
        hex: '#0D9488',
        pantoneTcx: 'PANTONE 17-4928 TCX',
        usageEn: 'EU Digital Passport QR Accents & Sustainability Callouts',
        usageAr: 'رموز جواز المنتج الرقمي الأوروبي ومؤشرات الاستدامة',
      },
      {
        nameEn: 'Delta Terracotta',
        nameAr: 'تراكوتا دلتا النيل',
        hex: '#B45309',
        pantoneTcx: 'PANTONE 18-1248 TCX',
        usageEn: 'Call-to-Action Buttons, Limited Edition Capsule Highlights',
        usageAr: 'أزرار الدعوة لاتخاذ إجراء (CTA) وإصدارات الكبسولة الخاصة',
      },
    ],
    ECO_INNOVATION: [
      {
        nameEn: 'Deep Botanical Forest',
        nameAr: 'أخضر الغابات المستدام',
        hex: '#064E3B',
        pantoneTcx: 'PANTONE 19-5513 TCX',
        usageEn: 'Primary Brand Anchor, Hangtags & Trade-Show Walls',
        usageAr: 'اللون الأساسي للهوية، بطاقات التعليق، وجدران أجنحة المعارض',
      },
      {
        nameEn: 'Circular Emerald Leaf',
        nameAr: 'زمردي التدوير الحيوي',
        hex: '#10B981',
        pantoneTcx: 'PANTONE 16-5938 TCX',
        usageEn: 'Data Charts, Carbon-Reduction Badges & Digital CTA',
        usageAr: 'الرسوم البيانية، شارات خفض الكربون، وأزرار التفاعل الرقمية',
      },
      {
        nameEn: 'Unbleached Flax Oat',
        nameAr: 'بيج الكتان غير المبيض',
        hex: '#F5F5F4',
        pantoneTcx: 'PANTONE 11-4202 TCX',
        usageEn: 'Recycled Kraft Paper Packaging & Clean Editorial Layouts',
        usageAr: 'التغليف الورقي المعاد تدويره وخلفيات الكتالوجات',
      },
      {
        nameEn: 'Hydro-Recycled Cyan',
        nameAr: 'سماوي المياه المعالجة ZLD',
        hex: '#0284C7',
        pantoneTcx: 'PANTONE 18-4245 TCX',
        usageEn: 'Water-Saving Infographics & ZDHC Compliance Seals',
        usageAr: 'مخططات توفير المياه وأختام مطابقة ZDHC',
      },
      {
        nameEn: 'Solar Amber Glow',
        nameAr: 'كهرماني الطاقة الشمسية',
        hex: '#F59E0B',
        pantoneTcx: 'PANTONE 14-1064 TCX',
        usageEn: 'Renewable Energy Highlights & Promotional Offer Badges',
        usageAr: 'إبراز الطاقة المتجددة وشارات العروض الترويجية',
      },
    ],
    INDUSTRIAL_B2B: [
      {
        nameEn: 'Precision Carbon Navy',
        nameAr: 'كحلي كربوني صناعي',
        hex: '#1E293B',
        pantoneTcx: 'PANTONE 19-4013 TCX',
        usageEn: 'Technical Spec Sheets, Machinery Signage & Header Blocks',
        usageAr: 'جداول المواصفات الفنية، لافتات المصنع، والعناوين الرئيسية',
      },
      {
        nameEn: 'ISO Cobalt Blue',
        nameAr: 'أزرق كوبالت قياسي ISO',
        hex: '#2563EB',
        pantoneTcx: 'PANTONE 18-4051 TCX',
        usageEn: 'Engineering Tables, Uster % Curves & Primary B2B Accents',
        usageAr: 'الجداول الهندسية، منحنيات الجودة، والعناصر التفاعلية',
      },
      {
        nameEn: 'Lab Titanium White',
        nameAr: 'أبيض تيتانيوم معملي',
        hex: '#F8FAFC',
        pantoneTcx: 'PANTONE 11-0601 TCX',
        usageEn: 'High-Contrast Technical Backgrounds & Cone Labels',
        usageAr: 'الخلفيات عالية التباين وملصقات كونات الغزل',
      },
      {
        nameEn: 'Safety Signal Orange',
        nameAr: 'برتقالي الإشارة الصناعي',
        hex: '#EA580C',
        pantoneTcx: 'PANTONE 16-1459 TCX',
        usageEn: 'MOQ Callouts, Fast-Track Lead Time Badges & Alerts',
        usageAr: 'تنبيهات الحد الأدنى للطلب (MOQ) ومؤشرات سرعة التوريد',
      },
      {
        nameEn: 'Verified Emerald Check',
        nameAr: 'أخضر الاعتماد المعملي',
        hex: '#059669',
        pantoneTcx: 'PANTONE 17-5641 TCX',
        usageEn: 'ISO 17025 / OEKO-TEX Pass Indicators & Quality Stamps',
        usageAr: 'مؤشرات اجتياز اختبارات ISO 17025 و OEKO-TEX',
      },
    ],
    MODERN_FASHION: [
      {
        nameEn: 'Obsidian Runway Black',
        nameAr: 'أسود أوبسيديان للأزياء',
        hex: '#18181B',
        pantoneTcx: 'PANTONE 19-0303 TCX',
        usageEn: 'Lookbook Typography, Jacquard Neck Labels & Hangtags',
        usageAr: 'خطوط الكتالوجات، تيكيت الرقبة الجاكار، والبطاقات المعلقة',
      },
      {
        nameEn: 'Mediterranean Sunset Coral',
        nameAr: 'مرجاني غروب المتوسط',
        hex: '#E11D48',
        pantoneTcx: 'PANTONE 18-1657 TCX',
        usageEn: 'Campaign Drop Badges, Reels Kinetic Text & Seasonal Seals',
        usageAr: 'شارات إطلاق المجموعات، نصوص الفيديوهات، والأختام الموسمية',
      },
      {
        nameEn: 'Warm Sahara Sand',
        nameAr: 'رملي صحراوي دافئ',
        hex: '#FAF5EE',
        pantoneTcx: 'PANTONE 12-0804 TCX',
        usageEn: 'Editorial Lookbook Spreads & Tissue Wrapping Paper',
        usageAr: 'صفحات كتالوج الأزياء وورق التغليف الداخلي',
      },
      {
        nameEn: 'Indigo Artisan Dye',
        nameAr: 'نيلي الصباغة الحرفية',
        hex: '#4F46E5',
        pantoneTcx: 'PANTONE 18-3949 TCX',
        usageEn: 'Digital Showroom Buttons & Interactive AR Try-On Links',
        usageAr: 'أزرار صالة العرض الرقمية وروابط التجربة التفاعلية',
      },
      {
        nameEn: 'Olive Grove Drape',
        nameAr: 'زيتوني انسيابي طبيعي',
        hex: '#65A30D',
        pantoneTcx: 'PANTONE 17-0535 TCX',
        usageEn: 'Natural Fiber Composition Icons & Eco Care Labels',
        usageAr: 'أيقونات الألياف الطبيعية وتعليمات العناية المستدامة',
      },
    ],
  };

  const palette = palettes[tone];

  return {
    id: `brand-kit-${Date.now()}`,
    topicEn: rawTopic,
    topicAr: rawTopic,
    brandNameEn,
    brandNameAr,
    altBrandNames: [
      {
        en: brandNameEn,
        ar: brandNameAr,
        rationaleEn: 'Primary flagship identity blending Egyptian textile heritage with international export authority.',
        rationaleAr: 'الهوية الرئيسية التي تدمج عراقة النسيج المصري بالموثوقية التصديرية الدولية.',
      },
      {
        en: `MAHALLA ${words[0]?.toUpperCase() || 'PRIME'} LABS`,
        ar: `مختبرات المحلة بريم (${words[0] || 'النسيج'})`,
        rationaleEn: 'Technical & R&D-forward naming ideal for European B2B buyers and ISO/DPP compliance.',
        rationaleAr: 'اسم ذو طابع تقني ومعملي يناسب المشترين الصناعيين في أوروبا ومعايير ISO.',
      },
      {
        en: `ATELIER GIZA • 1927`,
        ar: 'أتيليه جيزة ١٩٢٧',
        rationaleEn: 'Luxury heritage positioning celebrating El-Mahalla El-Kubra craftsmanship and long-staple authenticity.',
        rationaleAr: 'تموضع فاخر يحتفي بتاريخ المحلة الكبرى وأصالة القطن المصري طويل التيلة.',
      },
    ],
    taglineEn: `Crafted in El-Mahalla from Certified Egyptian Fibers — Engineered for Global Standards.`,
    taglineAr: `صُنع بإتقان في المحلة الكبرى من أجود الألياف المصرية — بمعايير عالمية موثقة.`,
    archetypeEn:
      tone === 'LUXURY_HERITAGE'
        ? 'The Sovereign Creator (Luxury Craftsmanship & Timeless Provenance)'
        : tone === 'ECO_INNOVATION'
        ? 'The Regenerative Guardian (Zero-Impact Circular Textile Pioneer)'
        : tone === 'INDUSTRIAL_B2B'
        ? 'The Precision Sage (Data-Driven Engineering & Right-First-Time Reliability)'
        : 'The Modern Muse (Effortless Mediterranean Elegance & Breathable Comfort)',
    archetypeAr:
      tone === 'LUXURY_HERITAGE'
        ? 'المبدع الملكي (الحرفية الفاخرة والأصالة الموثقة)'
        : tone === 'ECO_INNOVATION'
        ? 'الحارس المستدام (ريادة النسيج الدائري صفر الانبعاثات)'
        : tone === 'INDUSTRIAL_B2B'
        ? 'الحكيم الهندسي (الدقة القياسية والاعتمادية الصناعية)'
        : 'الملهم العصري (الأناقة المتوسطية والراحة الطبيعية)',
    positioningEn: `For discerning buyers in ${targetMarket} seeking ${rawTopic}, ${brandNameEn} is the vertically integrated El-Mahalla El-Kubra textile brand that delivers DNA-traceable Egyptian fiber quality, 94%+ Right-First-Time dyeing consistency, and full EU Digital Product Passport (ESPR) & ZDHC MRSL v3.1 compliance—with 14-day Mediterranean sea-freight lead times from Alexandria Port.`,
    positioningAr: `للمشترين المميزين في (${targetMarket}) الباحثين عن (${rawTopic})، تمثل علامة ${brandNameAr} الشريك الصناعي المتكامل بالمحلة الكبرى الذي يجمع بين تتبع الحمض النووي للألياف المصرية، وثبات الصباغة من المرة الأولى بنسبة تتجاوز ٩٤٪، والامتثال الكامل لجواز المنتج الرقمي الأوروبي (EU DPP) ومعايير ZDHC مع شحن بحري سريع خلال ١٤ يوماً من ميناء الإسكندرية.`,
    storyEn: `Born in the heart of El-Mahalla El-Kubra—Egypt’s historic textile capital—${brandNameEn} bridges a century of master spinning, weaving, and finishing artistry with Industry 4.0 precision. Every lot produced under "${rawTopic}" is lab-verified to ISO 17025 standards, dyed with zero-discharge eco-chemistry, and serialized with a QR Digital Product Passport so global brands and consumers can trace their textile from the Nile Delta cotton field to the final showroom.`,
    storyAr: `انطلقت علامة ${brandNameAr} من قلب مدينة المحلة الكبرى — عاصمة صناعة الغزل والنسيج في مصر — لتجمع بين قرن من البراعة الحرفية وتقنيات الثورة الصناعية الرابعة 4.0. كل تشغيلة إنتاجية ضمن (${rawTopic}) تخضع لاختبارات معملية معتمدة وفق ISO 17025، وتُصبغ بكيماويات آمنة بيئياً، وتُزود برمز QR لجواز السفر الرقمي للمنتج لتوثيق رحلة القطعة من حقول الدلتا إلى الأسواق العالمية.`,
    uvpBulletsEn: [
      `100% Traceable Supply Chain: Fiber-to-finish lot serialization with QR EU Digital Product Passport (Regulation 2024/1781).`,
      `Near-Shore Speed Advantage: 5–7 day air sampling & 12–16 day vessel transit from Alexandria/Damietta to Southern & Central Europe.`,
      `Certified Eco-Chemistry: OEKO-TEX® Standard 100 Class I, ZDHC MRSL Level 3 & ISO 9001/14001 lab verification on every shipment.`,
      `Flexible Cluster Capacity: Backed by the El-Mahalla El-Kubra Industrial Consortium for scalable MOQs (from 500-unit capsules to 100,000+ retail programs).`,
    ],
    uvpBulletsAr: [
      `سلسلة إمداد موثقة بالكامل: تتبع رقمي من الألياف حتى المنتج النهائي مع رمز QR لجواز المنتج الأوروبي (EU DPP).`,
      `ميزة القرب الجغرافي وسرعة التوريد: عينات خلال ٥–٧ أيام وشحن بحري خلال ١٢–١٦ يوماً إلى موانئ أوروبا والخليج.`,
      `مختبرات وجودة معتمدة دولياً: مطابقة كاملة لمعايير OEKO-TEX® Standard 100 و ZDHC MRSL v3.1 و ISO 17025.`,
      `مرونة الطاقة الإنتاجية: دعم تحالف مصانع المحلة الكبرى لتلبية الطلبيات من ٥٠٠ قطعة وحتى ١٠٠,٠٠٠+ قطعة شهرياً.`,
    ],
    certificationsBadges: [
      'Cotton Egypt™ Gold Seal',
      'OEKO-TEX® Standard 100',
      'ZDHC MRSL v3.1 Level 3',
      'EU ESPR Digital Product Passport',
      'ISO 9001 & ISO 17025 Lab',
      'GOTS / GRS Certified Chain',
    ],
    logoStyle: {
      monogram,
      emblemShape:
        tone === 'LUXURY_HERITAGE'
          ? 'COTTON_CROWN'
          : tone === 'ECO_INNOVATION'
          ? 'LOOM_DIAMOND'
          : tone === 'INDUSTRIAL_B2B'
          ? 'HEX_TECH'
          : 'CREST',
      typographyEn:
        tone === 'LUXURY_HERITAGE'
          ? 'Cormorant Garamond Bold (Headlines) + Plus Jakarta Sans (Specs)'
          : tone === 'INDUSTRIAL_B2B'
          ? 'Space Grotesk Bold (Display) + JetBrains Mono (Technical Data)'
          : 'Playfair Display SemiBold + Inter Regular',
      typographyAr: 'Cairo ExtraBold (العناوين الرئيسية) + Tajawal Medium (النصوص والمواصفات)',
    },
    palette,
    packagingSpec: {
      wovenLabelEn: `High-density 100-denier recycled polyester damask woven neck/hem label in ${palette[0].nameEn} (${palette[0].hex}) with metallic ${palette[1].nameEn} (${palette[1].hex}) thread weave.`,
      wovenLabelAr: `تيكيت منسوج دمشقي عالي الكثافة (100 Denier) بلون ${palette[0].nameAr} (${palette[0].hex}) مع خيوط مطرزة بلون ${palette[1].nameAr} (${palette[1].hex}).`,
      hangtagCopyEn: `350 GSM cotton-linter card stock hangtag with embossed ${monogram} seal, serialized EU DPP QR code, carbon footprint badge (0.86 kg CO2e/kg), and natural unbleached Giza cotton cord.`,
      hangtagCopyAr: `بطاقة تعليق (Hangtag) فاخرة بوزن 350 GSM من ألياف القطن المعاد تدويره مع ختم ${monogram} البارز، ورمز QR لجواز المنتج الرقمي، وخيط قطن جيزة طبيعي.`,
      sustainabilityClaimEn: `Verified Scope 1 & 2 Carbon Intensity: 0.86 kg CO2e/kg • 62% Closed-Loop Water Recycling • Zero Azo Dyes.`,
      sustainabilityClaimAr: `بصمة كربونية موثقة: 0.86 كجم CO2e/كجم • 62% إعادة تدوير مياه مغلقة • خالٍ تماماً من صبغات الأزو.`,
    },
    personas: [
      {
        roleEn: 'Head of Category Sourcing & Private Label (EU / UK Retail)',
        roleAr: 'مدير المشتريات والعلامات الخاصة (متاجر التجزئة في أوروبا وبريطانيا)',
        regionEn: 'Germany, France, UK, Nordics',
        regionAr: 'ألمانيا، فرنسا، بريطانيا، الدول الإسكندنافية',
        painPointsEn: [
          'Long 45–60 day sea-freight delays from Far East suppliers',
          'Strict EU ESPR Digital Product Passport & CBAM carbon audit requirements',
          'Shade variation (ΔE > 1.2) across repeat dye lots',
        ],
        painPointsAr: [
          'تأخر الشحن البحري من شرق آسيا (٤٥–٦٠ يوماً)',
          'متطلبات الاتحاد الأوروبي الصارمة لجواز المنتج الرقمي والبصمة الكربونية',
          'تفاوت درجات اللون (ΔE > 1.2) بين الدفعات المتكررة',
        ],
        decisionTriggersEn: [
          'Free lab-dip & physical swatch book delivered via DHL within 5 days',
          'Pre-verified ISO 17025 fastness & shrinkage test reports attached to quote',
          '14-day Alexandria-to-Rotterdam/Genoa vessel transit',
        ],
        decisionTriggersAr: [
          'إرسال كتالوج عينات فعلية وتجارب معملية خلال ٥ أيام عبر DHL',
          'إرفاق شهادات اختبار الثبات والانكماش المعتمدة ISO 17025 مع عرض السعر',
          'شحن بحري سريع خلال ١٤ يوماً إلى موانئ جنوب وغرب أوروبا',
        ],
        typicalOrderSize: '$35,000 – $250,000 / Season',
      },
      {
        roleEn: 'VP of Hospitality & Contract Textiles Procurement',
        roleAr: 'نائب رئيس مشتريات الفنادق والمشاريع الكبرى',
        regionEn: 'GCC (Dubai, Riyadh, Doha) & Mediterranean Resorts',
        regionAr: 'دول الخليج (دبي، الرياض، الدوحة) ومنتجعات البحر المتوسط',
        painPointsEn: [
          'Fabric pilling and tensile strength loss after 150+ industrial tunnel washes',
          'Rigid high MOQs for custom jacquard crest embroidery',
        ],
        painPointsAr: [
          'تآكل الأنسجة أو ضعف المتانة بعد ١٥٠ دورة غسيل فندقي صناعي',
          'اشتراط كميات ضخمة لتنفيذ شعارات الجاكار والتطريز الخاص',
        ],
        decisionTriggersEn: [
          'Guaranteed 300-wash industrial durability certification',
          'Low 300-piece custom jacquard MOQ with 21-day turnaround',
        ],
        decisionTriggersAr: [
          'ضمان تحمل ٣٠٠ غسلة صناعية بشهادة معملية موثقة',
          'حد أدنى مرن (٣٠٠ قطعة) للجاكار الخاص مع تسليم خلال ٢١ يوماً',
        ],
        typicalOrderSize: '$20,000 – $120,000 / Property',
      },
      {
        roleEn: 'Founder / Creative Director of Sustainable D2C Brand',
        roleAr: 'مؤسس / مدير إبداعي لعلامة أزياء مستدامة (D2C)',
        regionEn: 'Milan, Paris, Amsterdam, New York',
        regionAr: 'ميلانو، باريس، أمستردام، نيويورك',
        painPointsEn: [
          'Opaque supply chains risking greenwashing penalties',
          'Need high-resolution mill storytelling photos & videos for Instagram/TikTok',
        ],
        painPointsAr: [
          'غياب شفافية سلسلة الإمداد ومخاطر غرامات الادعاءات البيئية',
          'الحاجة لصور وفيديوهات احترافية من داخل المصنع للتسويق الرقمي',
        ],
        decisionTriggersEn: [
          'Turnkey co-branded content kit (mill videos, provenance QR code, GOTS/OEKO-TEX tags)',
          'Capsule-friendly MOQs starting at 300–500 units per style',
        ],
        decisionTriggersAr: [
          'حزمة محتوى تسويقي جاهزة (فيديوهات من المصنع، باركود التتبع، وتيكيت معتمد)',
          'كميات مرنة للمجموعات الموسمية تبدأ من ٣٠٠–٥٠٠ قطعة للموديل',
        ],
        typicalOrderSize: '$12,000 – $60,000 / Drop',
      },
    ],
    channels: [
      {
        channelEn: 'LinkedIn Account-Based Marketing (ABM) & Buyer Outreach',
        channelAr: 'التسويق الموجه لكبار المشترين عبر LinkedIn (ABM)',
        budgetSharePct: 35,
        monthlyCadenceEn: '12 technical authority posts + 400 targeted buyer sequences/mo',
        monthlyCadenceAr: '١٢ منشوراً تقنياً + ٤٠٠ رسالة مخصصة لمديري المشتريات شهرياً',
        primaryKpiEn: 'Qualified Sample Swatch Requests (SQLs)',
        primaryKpiAr: 'طلبات كتالوجات العينات المؤهلة (SQLs)',
        expectedRoas: '6.8x Pipeline ROI',
        tacticsEn: [
          'Target Sourcing Directors at DACH, French, UK & GCC retail groups',
          'Lead magnet: Free physical Swatch Box + EU DPP Compliance Dossier',
          'Automated 4-step LinkedIn + Email follow-up sequence',
        ],
        tacticsAr: [
          'استهداف مديري التوريد في كبرى سلاسل التجزئة الأوروبية والخليجية',
          'عرض جذب: إرسال صندوق عينات مجاني مع ملف مطابقة جواز المنتج الأوروبي',
          'تسلسل متابعة آلي من ٤ خطوات عبر LinkedIn والبريد الإلكتروني',
        ],
      },
      {
        channelEn: 'International Trade Shows (Heimtextil, Première Vision, Techtextil)',
        channelAr: 'المعارض الدولية (هايم تكستيل، بريميير فيجن، تيك تكستيل)',
        budgetSharePct: 30,
        monthlyCadenceEn: 'Pre-show 30-day warmup + Live booth QR capture + 14-day post-show drip',
        monthlyCadenceAr: 'حملة تمهيدية ٣٠ يوماً قبل المعرض + مسح QR بالجناح + متابعة ١٤ يوماً',
        primaryKpiEn: 'Booked Booth Appointments & Trial Containers',
        primaryKpiAr: 'اجتماعات الجناح المحجوزة والطلبيات التجريبية',
        expectedRoas: '5.4x Export Contract Value',
        tacticsEn: [
          'Roll-up posters & tri-fold brochures with instant QR sample ordering',
          'Pre-scheduled 20-minute VIP mill consultations via Cluster Consortium',
        ],
        tacticsAr: [
          'بوسترات رول أب وبروشورات ثلاثية الطيات مزودة برمز QR لطلب العينات فوراً',
          'جدولة مسبقة لاجتماعات VIP مدتها ٢٠ دقيقة بالتعاون مع تحالف التجمع',
        ],
      },
      {
        channelEn: 'Instagram Reels, YouTube Shorts & Visual Mill Storytelling',
        channelAr: 'فيديوهات Reels و Shorts وسرد قصة التصنيع من داخل المصنع',
        budgetSharePct: 20,
        monthlyCadenceEn: '8 macro craftsmanship Reels + 4 behind-the-scenes lab QC videos/mo',
        monthlyCadenceAr: '٨ فيديوهات Reels لتفاصيل النسيج + ٤ فيديوهات من معمل الجودة شهرياً',
        primaryKpiEn: 'Digital Showroom Visits & D2C/Boutique Inquiries',
        primaryKpiAr: 'زيارات صالة العرض الرقمية واستفسارات العلامات التجارية',
        expectedRoas: '4.2x Brand Equity & Inbound Leads',
        tacticsEn: [
          'ASMR high-speed loom & ring-spinning macro reels with bilingual captions',
          'Live spectrophotometer ΔE < 0.8 color-matching demonstrations',
        ],
        tacticsAr: [
          'تصوير مقرب لماكينات الغزل والنسيج والصباغة مع تعليق صوتي ثنائي اللغة',
          'عروض حية لاختبارات مطابقة الألوان بالسبكتروفوتوميتر (ΔE < 0.8)',
        ],
      },
      {
        channelEn: 'Digital Showroom SEO, Mahalla Cluster RFQ Exchange & WhatsApp VIP',
        channelAr: 'تحسين محركات البحث، منصة مناقصات المحلة، وواتساب لكبار العملاء',
        budgetSharePct: 15,
        monthlyCadenceEn: 'Always-on SEO landing pages + Instant <15 min WhatsApp quotation bot',
        monthlyCadenceAr: 'صفحات هبوط دائمة + رد فوري خلال ١٥ دقيقة عبر واتساب للأعمال',
        primaryKpiEn: 'RFQ-to-Sample Conversion Rate (>28%)',
        primaryKpiAr: 'معدل تحويل طلبات الأسعار إلى عينات معتمدة (>٢٨٪)',
        expectedRoas: '8.1x Direct Conversion ROI',
        tacticsEn: [
          'Publish live EU Digital Product Passports for every core SKU',
          'Automated WhatsApp spec-sheet & FOB price calculator delivery',
        ],
        tacticsAr: [
          'نشر جواز السفر الرقمي الأوروبي لكل منتج أساسي لتحسين الظهور في البحث',
          'إرسال جداول المواصفات وحاسبة أسعار FOB تلقائياً عبر واتساب للأعمال',
        ],
      },
    ],
    roadmap: [
      {
        phaseEn: 'Phase 1: Brand Architecture, Visual Assets & EU DPP Showroom',
        phaseAr: 'المرحلة الأولى: تأسيس الهوية البصرية وإطلاق صالة العرض الرقمية',
        weeks: 'Weeks 1–4 (Days 1–30)',
        objectiveEn: 'Establish world-class visual identity, print/digital collateral, and verified compliance proofs.',
        objectiveAr: 'إرساء الهوية البصرية العالمية، وتجهيز المطبوعات والفيديوهات وشهادات المطابقة.',
        deliverablesEn: [
          `Finalize ${brandNameEn} Logo Book, Pantone TCX palette, woven labels & eco-hangtags`,
          'Produce 30-second flagship promo video, 4 hero product photo sets & 6-panel tri-fold brochure',
          'Publish serialized EU Digital Product Passports (ESPR) & ISO 17025 lab test dossiers',
        ],
        deliverablesAr: [
          `اعتماد دليل هوية ${brandNameAr}، ألوان Pantone TCX، التيكيت المنسوج وبطاقات التعليق`,
          'إنتاج الفيديو الترويجي (٣٠ ثانية)، ٤ مجموعات صور احترافية، والبروشور الثلاثي',
          'نشر جواز السفر الرقمي للمنتج (EU DPP) وملفات الاختبارات المعملية ISO 17025',
        ],
        targetMetric: '100% Collateral Ready + 25 Core SKU Passports Live',
      },
      {
        phaseEn: 'Phase 2: Automated Outbound Buyer Blitz & Swatch Box Campaign',
        phaseAr: 'المرحلة الثانية: إطلاق حملات الاستهداف الآلي وإرسال صناديق العينات',
        weeks: 'Weeks 5–8 (Days 31–60)',
        objectiveEn: 'Activate omnichannel marketing automations and ship physical swatch kits to qualified buyers.',
        objectiveAr: 'تفعيل مسارات التسويق الآلي وشحن صناديق العينات الفعلية للمشترين المؤهلين.',
        deliverablesEn: [
          'Launch LinkedIn ABM + B2B Email + WhatsApp 4-step automated outreach sequence',
          'Dispatch 60 physical VIP Swatch & Lab-Dip Boxes to EU, UK & GCC sourcing directors',
          'Publish 2 weekly craftsmanship Reels & technical spec carousels',
        ],
        deliverablesAr: [
          'إطلاق تسلسل الأتمتة الرباعي عبر LinkedIn والبريد الإلكتروني وواتساب',
          'شحن ٦٠ صندوق عينات VIP لمديري المشتريات في أوروبا وبريطانيا والخليج',
          'نشر فيديوهين أسبوعياً (Reels) ومنشورات تقنية للمواصفات',
        ],
        targetMetric: '60 Swatch Kits Shipped • 18+ Active Buyer Negotiations',
      },
      {
        phaseEn: 'Phase 3: Trade-Fair Activation, Retargeting & Consortium Scaling',
        phaseAr: 'المرحلة الثالثة: المشاركة بالمعارض الدولية وتوسيع العقود التصديرية',
        weeks: 'Weeks 9–12 (Days 61–90)',
        objectiveEn: 'Convert sample approvals into recurring container/program contracts and consortium bids.',
        objectiveAr: 'تحويل اعتمادات العينات إلى عقود توريد مستدامة ومناقصات تصديرية كبرى.',
        deliverablesEn: [
          'Deploy large-format exhibition roll-up posters & QR instant-quote flyers at trade shows',
          'Run automated 14-day post-sample follow-up & FOB/CIF container pricing cadence',
          'Scale overflow orders across El-Mahalla Export Consortium partner mills',
        ],
        deliverablesAr: [
          'نشر بوسترات المعارض والفلايرات التفاعلية المزودة برمز QR لطلب التسعير الفوري',
          'تشغيل أتمتة المتابعة لمدة ١٤ يوماً بعد استلام العينات لتأكيد أوامر الشراء',
          'توسيع الطاقات الإنتاجية للطلبيات الكبرى عبر تحالف مصانع المحلة التصديري',
        ],
        targetMetric: '$250K–$600K Export Pipeline • 4+ Signed Annual Contracts',
      },
    ],
    automations: [
      {
        id: 'auto-eu-buyer-abm',
        nameEn: 'Flow 1: EU & GCC Buyer Swatch-to-Order Automation',
        nameAr: 'المسار الآلي ١: تحويل طلبات عينات المشترين الدوليين إلى عقود',
        triggerEn: 'Trigger: Buyer scans Brochure/Poster QR or requests Swatch Kit on Platform',
        triggerAr: 'المُشغّل: مسح المشتري لرمز QR على البروشور/البوستر أو طلب عينات عبر المنصة',
        audienceEn: 'Sourcing Directors & Private-Label Buyers (EU, UK, GCC)',
        audienceAr: 'مديرو المشتريات والعلامات الخاصة (أوروبا، بريطانيا، الخليج)',
        conversionGoal: '34% Swatch-to-RFQ Conversion',
        steps: [
          {
            dayOffset: 'Instant (T+0 min)',
            channel: 'WHATSAPP',
            titleEn: 'Instant Digital Brochure, EU DPP Link & DHL Swatch Confirmation',
            titleAr: 'إرسال فوري للبروشور الرقمي ورابط جواز المنتج وتأكيد شحن العينة',
            copyEn: `Hello {{buyer_name}}, thank you for connecting with ${brandNameEn}. Here is your interactive Technical Brochure & EU Digital Product Passport for "${rawTopic}". Reply with your preferred GSM/colorway to dispatch your complimentary DHL Swatch Box today.`,
            copyAr: `مرحباً {{buyer_name}}، شكراً لتواصلكم مع ${brandNameAr}. مرفق لكم البروشور الفني التفاعلي وجواز المنتج الأوروبي لـ (${rawTopic}). يرجى تأكيد الأوزان والألوان المطلوبة لشحن صندوق العينات المجاني عبر DHL اليوم.`,
          },
          {
            dayOffset: 'Day 2 (T+48h)',
            channel: 'EMAIL',
            titleEn: 'ISO 17025 Lab Test Report & FOB Alexandria Costing Matrix',
            titleAr: 'إرسال تقرير اختبارات المعمل ISO 17025وجدول تسعير FOB الإسكندرية',
            copyEn: `Subject: [${brandNameEn}] ISO Lab Fastness Dossier & Near-Shore Lead Times\n\nDear {{buyer_name}}, while your physical swatches are in transit, please find attached our verified ISO 105 colorfastness report (ΔE ≤ 0.8), ZDHC Level 3 certificate, and tiered FOB Alexandria pricing for 500 / 2,500 / 10,000 units.`,
            copyAr: `الموضوع: [${brandNameAr}] تقارير الجودة المعملية ISO وأسعار التصدير FOB الإسكندرية\n\nتحية طيبة {{buyer_name}}، بالتزامن مع شحن العينات، نرفق لكم تقارير ثبات الألوان (ΔE ≤ 0.8) وشهادة ZDHC وجدول الأسعار التنافسية للكميات المختلفة.`,
          },
          {
            dayOffset: 'Day 6 (Post-DHL Delivery)',
            channel: 'LINKEDIN',
            titleEn: 'LinkedIn Executive Touchpoint + Custom Lab-Dip Offer',
            titleAr: 'متابعة تنفيذية عبر LinkedIn وعرض تنفيذ عينة لون خاصة (Lab-Dip)',
            copyEn: `Hi {{buyer_name}}, DHL confirmed your ${brandNameEn} swatch kit arrived today! Our dyeing lab in El-Mahalla can match any custom Pantone TCX shade within 72 hours. Would Tuesday at 11:00 CET work for a 10-minute video walkthrough of our production line?`,
            copyAr: `مرحباً {{buyer_name}}، أكدت شركة DHL تسليم صندوق عينات ${brandNameAr} اليوم! معمل الصباغة لدينا في المحلة الكبرى جاهز لمطابقة أي لون Pantone TCX خاص بكم خلال ٧٢ ساعة. هل يناسبكم اتصال فيديو سريع لمدة ١٠ دقائق يوم الثلاثاء؟`,
          },
          {
            dayOffset: 'Day 12 (Closing Sequence)',
            channel: 'CRM_WEBHOOK',
            titleEn: 'Auto-Generate Priority Loom Reservation & Trial Order Contract',
            titleAr: 'إنشاء عرض حجز أولوية على خطوط الإنتاج وعقد طلبية تجريبية تلقائياً',
            copyEn: `System Action: If buyer opens pricing matrix ≥2 times, automatically generate a 14-day Priority Capacity Hold on Mahalla Cluster Exchange and send a 1-click Trial Order Reservation link.`,
            copyAr: `إجراء آلي: عند فتح المشتري لجدول الأسعار مرتين أو أكثر، يقوم النظام بحجز أولوية طاقة إنتاجية لمدة ١٤ يوماً وإرسال رابط تأكيد الطلبية التجريبية بضغطة واحدة.`,
          },
        ],
      },
      {
        id: 'auto-social-omnipresence',
        nameEn: 'Flow 2: Weekly Omnichannel Content & Lead-Gen Autopilot',
        nameAr: 'المسار الآلي ٢: النشر الأسبوعي المتزامن وتوليد العملاء المحتملين',
        triggerEn: 'Trigger: Recurring Weekly Cron (Every Monday & Thursday at 09:30 CET)',
        triggerAr: 'المُشغّل: جدولة أسبوعية تلقائية (كل إثنين وخميس الساعة ٠٩:٣٠ صباحاً)',
        audienceEn: 'Global Apparel Buyers, Interior Designers & Trade Fair Visitors',
        audienceAr: 'مشترو الأزياء والمفروشات، المصممون، وزوار المعارض الدولية',
        conversionGoal: '3.5x Inbound Inquiries / Month',
        steps: [
          {
            dayOffset: 'Monday 09:30',
            channel: 'INSTAGRAM',
            titleEn: 'Publish 30s Craftsmanship Reel + Auto-DM Comment Keyword',
            titleAr: 'نشر فيديو Reel (٣٠ ثانية) مع الرد الآلي الفوري على التعليقات',
            copyEn: `Auto-Post Reel: Macro weave & spectrophotometer QC of "${rawTopic}". Caption: "Comment 'SWATCH' to receive our 2026 Digital Brochure & Free Sample Kit." Auto-DM sends instant brochure link.`,
            copyAr: `نشر تلقائي لفيديو Reel يستعرض دقة النسيج وفحص الجودة لـ (${rawTopic}). عند كتابة كلمة "عينة" في التعليقات، يرسل النظام البروشور التفاعلي ورابط طلب العينة تلقائياً.`,
          },
          {
            dayOffset: 'Wednesday 11:00',
            channel: 'LINKEDIN',
            titleEn: 'Publish Technical Case Study & EU DPP Carousel',
            titleAr: 'نشر دراسة حالة هندسية وعرض شرائح (Carousel) لجواز المنتج الأوروبي',
            copyEn: `Auto-Post LinkedIn Carousel: "How ${brandNameEn} achieves ΔE ≤ 0.8 shade consistency & 0.86 kg CO2e/kg carbon intensity in El-Mahalla El-Kubra."`,
            copyAr: `نشر شرائح تعليمية على LinkedIn: "كيف تحقق ${brandNameAr} ثبات ألوان ΔE ≤ 0.8 وبصمة كربونية منخفضة في المحلة الكبرى."`,
          },
          {
            dayOffset: 'Thursday 14:00',
            channel: 'EMAIL',
            titleEn: 'Bi-Weekly Capacity Availability & Spot-Lot Newsletter',
            titleAr: 'النشرة الدورية للطاقات الإنتاجية المتاحة والعروض الفورية',
            copyEn: `Broadcast live available spindle/loom hours and ready-to-dye greige fabric stock to subscribed buyers with 1-click booking.`,
            copyAr: `إرسال تحديث آلي بالماكينات المتاحة والأقمشة الجاهزة للصباغة الفورية لقائمة المشترين المشتركين مع زر حجز مباشر.`,
          },
        ],
      },
    ],
    calendar: [
      {
        id: 'cal-1',
        week: 1,
        dayEn: 'Monday • 09:30',
        dayAr: 'الإثنين • ٠٩:٣٠ ص',
        channel: 'LinkedIn',
        formatEn: 'PDF Technical Carousel (6 Slides)',
        formatAr: 'عرض شرائح تقني PDF (٦ شرائح)',
        headlineEn: `Introducing ${brandNameEn}: Traceable Egyptian Excellence in ${rawTopic}`,
        headlineAr: `إطلاق ${brandNameAr}: التميز المصري الموثق في ${rawTopic}`,
        captionEn: `Discover how our El-Mahalla facility combines certified Egyptian fibers, ISO 17025 testing, and 14-day EU sea freight.`,
        captionAr: `اكتشف كيف يجمع مصنعنا بالمحلة الكبرى بين الألياف المصرية المعتمدة، واختبارات ISO 17025، والشحن لأوروبا خلال ١٤ يوماً.`,
        ctaEn: 'Download Technical Brochure →',
        ctaAr: 'حمّل البروشور الفني ←',
        autoStatus: 'AUTO_SCHEDULED',
      },
      {
        id: 'cal-2',
        week: 1,
        dayEn: 'Thursday • 16:00',
        dayAr: 'الخميس • ٠٤:٠٠ م',
        channel: 'Instagram Reels',
        formatEn: '9:16 HD Promo Video (30s)',
        formatAr: 'فيديو ترويجي عمودي 9:16 (٣٠ ثانية)',
        headlineEn: 'From Nile Delta Fiber to High-Precision Finishing',
        headlineAr: 'من ألياف دلتا النيل إلى التجهيز النهائي فائق الدقة',
        captionEn: `Watch every stage of our Right-First-Time production for ${brandTopicShort(rawTopic)}. Comment "CATALOG" for instant specs.`,
        captionAr: `شاهد مراحل الإنتاج القياسي لـ (${brandTopicShort(rawTopic)}). اكتب "كتالوج" في التعليقات للحصول على المواصفات فوراً.`,
        ctaEn: 'Request Free Swatch Kit',
        ctaAr: 'اطلب صندوق العينات المجاني',
        autoStatus: 'AUTO_SCHEDULED',
      },
      {
        id: 'cal-3',
        week: 2,
        dayEn: 'Tuesday • 10:00',
        dayAr: 'الثلاثاء • ١٠:٠٠ ص',
        channel: 'B2B Email',
        formatEn: 'Personalized Buyer Dossier + Pricing Sheet',
        formatAr: 'ملف المشتري المخصص + قائمة الأسعار',
        headlineEn: `[Sample Ready] ${brandNameEn} Swatch Box & EU Digital Product Passport`,
        headlineAr: `[عينات جاهزة] صندوق عينات ${brandNameAr} وجواز المنتج الأوروبي`,
        captionEn: `Direct outreach to 150 curated sourcing directors in ${targetMarket} with 1-click DHL sample booking.`,
        captionAr: `رسالة مخصصة إلى ١٥٠ مدير مشتريات في (${targetMarket}) مع رابط حجز عينة فورية عبر DHL.`,
        ctaEn: 'Claim Complimentary Swatch Box',
        ctaAr: 'احصل على صندوق العينات مجاناً',
        autoStatus: 'ACTIVE_DRIP',
      },
      {
        id: 'cal-4',
        week: 2,
        dayEn: 'Friday • 12:00',
        dayAr: 'الجمعة • ١٢:٠٠ م',
        channel: 'WhatsApp VIP',
        formatEn: 'Interactive Brochure PDF + Voice Note',
        formatAr: 'بروشور PDF تفاعلي + رسالة سريعة',
        headlineEn: 'Priority Loom & Dye-House Slot Allocation for Q4/Q1',
        headlineAr: 'حجز أولوية خطوط النسيج والصباغة للربع القادم',
        captionEn: `Instant WhatsApp broadcast to warm leads offering 72-hour custom Pantone lab-dips and flexible MOQs.`,
        captionAr: `إشعار عبر واتساب للأعمال للعملاء المهتمين لتنفيذ عينات الألوان الخاصة خلال ٧٢ ساعة وبكميات مرنة.`,
        ctaEn: 'Reply "RESERVE" for Instant Quote',
        ctaAr: 'أرسل "حجز" للحصول على عرض سعر فوري',
        autoStatus: 'AUTO_SCHEDULED',
      },
      {
        id: 'cal-5',
        week: 3,
        dayEn: 'Monday • 11:00',
        dayAr: 'الإثنين • ١١:٠٠ ص',
        channel: 'Trade Portal',
        formatEn: 'Verified RFQ Auto-Pitch & DPP Showcase',
        formatAr: 'عرض فني موثق للمناقصات التصديرية',
        headlineEn: `Zero-Defect Export Program: ${brandNameEn} Certified Production`,
        headlineAr: `برنامج التصدير الصفري العيوب: إنتاج ${brandNameAr} المعتمد`,
        captionEn: `Syndicated across Mahalla Cluster Exchange, EuroPages & Heimtextil Digital Directory.`,
        captionAr: `نشر متزامن عبر بورصة تجمع المحلة الكبرى، ودليل المصدرين الأوروبي، ومعرض هايم تكستيل.`,
        ctaEn: 'Launch B2B RFQ / Consortium Bid',
        ctaAr: 'ابدأ طلب عرض سعر أو تعاقد تحالف',
        autoStatus: 'READY_TO_PUBLISH',
      },
      {
        id: 'cal-6',
        week: 4,
        dayEn: 'Wednesday • 15:00',
        dayAr: 'الأربعاء • ٠٣:٠٠ م',
        channel: 'LinkedIn',
        formatEn: 'ESG & Carbon Intensity Infographics',
        formatAr: 'إنفوجرافيك الاستدامة والبصمة الكربونية',
        headlineEn: `How ${brandNameEn} Cuts Scope 1 & 2 Emissions to 0.86 kg CO2e/kg`,
        headlineAr: `كيف تخفض ${brandNameAr} الانبعاثات الكربونية إلى 0.86 كجم CO2e/كجم`,
        captionEn: `Full transparency for EU CBAM & ESPR buyers: closed-loop water recycling, solar thermal steam, and ZDHC Level 3 chemistry.`,
        captionAr: `شفافية كاملة للمشترين الأوروبيين: تدوير المياه المغلق، الطاقة الشمسية الحرارية، وكيماويات ZDHC المستوى الثالث.`,
        ctaEn: 'Inspect Live EU Digital Passport',
        ctaAr: 'افحص جواز المنتج الرقمي الحي',
        autoStatus: 'AUTO_SCHEDULED',
      },
    ],
    videoSpec: {
      titleEn: `${brandNameEn} — 30-Second Global Export Commercial`,
      titleAr: `${brandNameAr} — الإعلان الترويجي العالمي (٣٠ ثانية)`,
      totalDurationSec: 30,
      musicMoodEn: 'Cinematic Warm Oud & Modern Minimalist Electronic Pulse (112 BPM)',
      musicMoodAr: 'موسيقى سينمائية دافئة تمزج الأصالة المصرية بالإيقاع العصري الحديث (112 BPM)',
      scenes: [
        {
          sceneNumber: 1,
          durationSec: 7,
          visualSettingEn: 'Golden-hour macro shot of raw Egyptian long-staple fibers morphing into high-speed compact ring spindles in El-Mahalla.',
          visualSettingAr: 'لقطة مقربة في الإضاءة الذهبية لألياف القطن المصري الطويل التيلة تتحول بانسيابية إلى مغازل كومباكت فائقة السرعة بالمحلة الكبرى.',
          cameraMovementEn: '85mm Macro Probe Lens • Slow dolly push-in at 120fps',
          cameraMovementAr: 'عدسة ماكرو 85mm • حركة كاميرا بطيئة للأمام بسرعة 120 إطار/ثانية',
          onScreenTextEn: `${brandNameEn} • BORN IN EL-MAHALLA EL-KUBRA`,
          onScreenTextAr: `${brandNameAr} • عراقة الصناعة من قلب المحلة الكبرى`,
          voiceoverEn: `In the heart of Egypt's textile capital, ${brandNameEn} transforms the world's finest fibers into precision-engineered excellence.`,
          voiceoverAr: `من قلب عاصمة النسيج المصرية، تحول علامة ${brandNameAr} أجود الألياف الطبيعية إلى منتجات فائقة الدقة بمعايير عالمية.`,
          accentHex: palette[0].hex,
        },
        {
          sceneNumber: 2,
          durationSec: 8,
          visualSettingEn: 'High-speed air-jet looms & automated low-liquor-ratio dyeing vessels with live spectrophotometer ΔE = 0.42 pass screen.',
          visualSettingAr: 'أنوال النسيج الهوائية الحديثة وأجهزة الصباغة الذكية مع شاشة الفحص الطيفي التي تظهر تطابق اللون بدقة ΔE = 0.42.',
          cameraMovementEn: '35mm Anamorphic • Dynamic tracking shot across automated mill floor',
          cameraMovementAr: 'عدسة سينمائية 35mm • حركة تتبع ديناميكية عبر خطوط الإنتاج الذكية',
          onScreenTextEn: `94.8% RIGHT-FIRST-TIME • ISO 17025 & ZDHC LEVEL 3`,
          onScreenTextAr: `دقة قياسية 94.8% • اعتماد ISO 17025 و ZDHC المستوى الثالث`,
          voiceoverEn: `Every meter of ${brandTopicShort(rawTopic)} is lab-verified to ISO 17025 standards and dyed with zero-discharge eco-chemistry.`,
          voiceoverAr: `كل متر من إنتاچنا يخضع لاختبارات معملية صارمة وفق ISO 17025 وبكيماويات آمنة بيئياً ومعتمدة دولياً.`,
          accentHex: palette[1].hex,
        },
        {
          sceneNumber: 3,
          durationSec: 8,
          visualSettingEn: 'Luxury showroom table: buyer scans the serialized EU Digital Product Passport QR code on the embossed hangtag.',
          visualSettingAr: 'صالة عرض فاخرة: مشتري دولي يمسح رمز QR لجواز المنتج الرقمي الأوروبي المطبوع على بطاقة المنتج.',
          cameraMovementEn: '50mm Prime • Over-the-shoulder reveal with holographic UI overlay',
          cameraMovementAr: 'عدسة 50mm • لقطة تفصيلية مع واجهة بيانات رقمية تفاعلية على الشاشة',
          onScreenTextEn: `100% EU DIGITAL PRODUCT PASSPORT • 0.86 kg CO2e/kg`,
          onScreenTextAr: `جواز السفر الرقمي الأوروبي • بصمة كربونية منخفضة 0.86 كجم`,
          voiceoverEn: `Full fiber-to-finish traceability, verified low carbon intensity, and rapid 14-day sea freight from Alexandria to Europe.`,
          voiceoverAr: `تتبع رقمي كامل من المصدر حتى التسليم، بصمة كربونية منخفضة، وشحن بحري سريع خلال أربعة عشر يوماً إلى أوروبا.`,
          accentHex: palette[3].hex,
        },
        {
          sceneNumber: 4,
          durationSec: 7,
          visualSettingEn: 'Hero brand crest lockup with luxury folded textiles, gold foil seal, and direct website/QR call-to-action.',
          visualSettingAr: 'ظهور شعار العلامة الرئيسي مع تشكيلة المنتجات الفاخرة والختم الذهبي ودعوة مباشرة لطلب صندوق العينات.',
          cameraMovementEn: 'Centered Hero Lockup • Subtle crane rise with soft key lighting',
          cameraMovementAr: 'تأطير مركزي فخم • إضاءة استوديو ناعمة تبرز ملمس النسيج والشعار',
          onScreenTextEn: `${brandNameEn} • REQUEST YOUR VIP SWATCH BOX TODAY`,
          onScreenTextAr: `${brandNameAr} • اطلب صندوق العينات المجاني الآن`,
          voiceoverEn: `${brandNameEn}. Crafted in Egypt. Trusted by global brands. Request your complimentary swatch kit today.`,
          voiceoverAr: `${brandNameAr}. صُنع بإتقان في مصر، وموثوق من كبرى العلامات العالمية. اطلب صندوق العينات الخاص بك اليوم.`,
          accentHex: palette[4].hex,
        },
      ],
    },
    photoConcepts: [
      {
        id: 'photo-macro-weave',
        styleTagEn: 'HERO MACRO TEXTURE',
        styleTagAr: 'لقطة ماكرو لتفاصيل النسيج',
        titleEn: 'Ultra-Macro Fiber & Weave Architecture',
        titleAr: 'تصوير ماكرو فائق الدقة لبنية الخيوط والنسيج',
        headlineOverlayEn: brandNameEn,
        headlineOverlayAr: brandNameAr,
        subOverlayEn: `CERTIFIED EGYPTIAN QUALITY • ${brandTopicShort(rawTopic).toUpperCase()}`,
        subOverlayAr: `جودة مصرية معتمدة • ${brandTopicShort(rawTopic)}`,
        cameraSpec: 'Hasselblad H6D-100c • 120mm Macro f/8 • Raking Softbox Key Light',
        aiPromptEn: `Commercial luxury textile macro photography for "${brandNameEn}", extreme close-up of ${rawTopic}, visible lustrous long-staple Egyptian cotton weave structure, golden rim lighting, color palette ${palette[0].hex} and ${palette[1].hex}, shot on Hasselblad 100MP, 8k photorealistic editorial campaign.`,
        primaryHex: palette[0].hex,
        secondaryHex: palette[1].hex,
        patternType: 'WEAVE_MACRO',
      },
      {
        id: 'photo-editorial-drape',
        styleTagEn: 'LIFESTYLE EDITORIAL CAMPAIGN',
        styleTagAr: 'حملة إعلانية للمنتج النهائي',
        titleEn: 'Sunlit Mediterranean Showroom & Drape',
        titleAr: 'عرض انسيابي للمنتج في إضاءة طبيعية فاخرة',
        headlineOverlayEn: `${brandNameEn} COLLECTION`,
        headlineOverlayAr: `مجموعة ${brandNameAr}`,
        subOverlayEn: 'OEKO-TEX® STANDARD 100 • EU DPP VERIFIED',
        subOverlayAr: 'معتمد OEKO-TEX® 100 • جواز المنتج الأوروبي',
        cameraSpec: 'PhaseOne IQ4 150MP • 55mm f/4 • Natural Mediterranean Window Light',
        aiPromptEn: `High-end editorial campaign photo for "${brandNameEn}", showcasing ${rawTopic} draped on travertine stone in a sunlit Mediterranean architectural villa, embossed hangtag with QR code visible, colors ${palette[0].hex}, ${palette[2].hex}, and ${palette[1].hex}, architectural digest aesthetic, 8k.`,
        primaryHex: palette[3].hex,
        secondaryHex: palette[1].hex,
        patternType: 'EDITORIAL_DRAPE',
      },
      {
        id: 'photo-mill-craft',
        styleTagEn: 'INDUSTRY 4.0 CRAFTSMANSHIP',
        styleTagAr: 'التصنيع الذكي ومعمل الجودة',
        titleEn: 'El-Mahalla Precision Mill & ISO Lab QC',
        titleAr: 'دقة التصنيع في المحلة الكبرى وفحص الجودة المعملي',
        headlineOverlayEn: 'ENGINEERED IN EL-MAHALLA',
        headlineOverlayAr: 'هندسة نسيجية من المحلة الكبرى',
        subOverlayEn: 'ISO 17025 LAB • ΔE ≤ 0.8 SHADE PRECISION',
        subOverlayAr: 'معمل ISO 17025 • دقة ألوان قياسية ΔE ≤ 0.8',
        cameraSpec: 'Sony Venice 2 • 35mm Master Prime f/2.8 • Cinematic Clean Industrial Lighting',
        aiPromptEn: `Modern European-standard textile mill in El-Mahalla Egypt producing ${rawTopic}, quality engineer inspecting fabric with digital spectrophotometer, clean high-tech industrial floor, warm sunlight beams, brand colors ${palette[0].hex} and ${palette[3].hex}, 8k corporate photography.`,
        primaryHex: palette[0].hex,
        secondaryHex: palette[3].hex,
        patternType: 'MILL_CRAFT',
      },
      {
        id: 'photo-social-pack',
        styleTagEn: 'VIP SWATCH & PACKAGING KIT',
        styleTagAr: 'صندوق العينات والتغليف الفاخر',
        titleEn: 'Executive B2B Swatch Box & Hangtag Flatlay',
        titleAr: 'تصميم صندوق عينات المشترين الدوليين والبطاقات المرفقة',
        headlineOverlayEn: 'FREE DHL SWATCH BOX',
        headlineOverlayAr: 'صندوق عينات مجاني عبر DHL',
        subOverlayEn: '5-DAY GLOBAL DELIVERY TO EU, UK & GCC',
        subOverlayAr: 'توصيل سريع خلال ٥ أيام لأوروبا والخليج',
        cameraSpec: 'Canon EOS R5 • 50mm f/5.6 Overhead Flatlay • Diffused Studio Strobe',
        aiPromptEn: `Overhead luxury flatlay photography of "${brandNameEn}" B2B buyer sample swatch box, rigid box in ${palette[0].hex} with ${palette[1].hex} gold foil monogram "${monogram}", neatly arranged fabric swatches of ${rawTopic}, Pantone TCX chips, and QR Digital Product Passport card, 8k studio shot.`,
        primaryHex: palette[4].hex,
        secondaryHex: palette[0].hex,
        patternType: 'SOCIAL_PRODUCT',
      },
    ],
    brochurePanels: [
      {
        panelNumber: 1,
        panelRoleEn: 'Panel 1 • Outside Front Cover',
        panelRoleAr: 'الوجه ١ • الغلاف الأمامي الخارجي',
        titleEn: brandNameEn,
        titleAr: brandNameAr,
        bodyEn: `Crafted in El-Mahalla El-Kubra • Global Export Edition for ${rawTopic}`,
        bodyAr: `صُنع في المحلة الكبرى • الإصدار التصديري العالمي لـ (${rawTopic})`,
        bulletsEn: [
          '100% Traceable Egyptian Provenance',
          'EU Digital Product Passport (ESPR) Ready',
          '14-Day Fast-Track Mediterranean Freight',
        ],
        bulletsAr: [
          'مصدر مصري موثق بالكامل ١٠٠٪',
          'جاهزية كاملة لجواز المنتج الرقمي الأوروبي',
          'شحن بحري سريع خلال ١٤ يوماً لأوروبا',
        ],
        highlightStat: 'ISO 17025 & OEKO-TEX® VERIFIED',
      },
      {
        panelNumber: 2,
        panelRoleEn: 'Panel 2 • Inside Left (Heritage & Mill Power)',
        panelRoleAr: 'الوجه ٢ • الداخل يمين (العراقة والقدرة الصناعية)',
        titleEn: 'A Century of Egyptian Textile Mastery',
        titleAr: 'قرن من الريادة في صناعة الغزل والنسيج',
        bodyEn: `${brandNameEn} operates within the UNIDO/EU-supported El-Mahalla El-Kubra Industrial Cluster, uniting state-of-the-art spinning, weaving, dyeing, and finishing under rigorous international quality management.`,
        bodyAr: `تعمل علامة ${brandNameAr} ضمن تجمع المحلة الكبرى الصناعي المدعوم من اليونيدو والاتحاد الأوروبي، حيث توحد أحدث خطوط الغزل والنسيج والصباغة والتجهيز تحت إدارة جودة عالمية صارمة.`,
        bulletsEn: [
          '94.8% Right-First-Time (RFT) Automated Dyeing',
          'Spectrophotometer Color Tolerance ΔE ≤ 0.8',
          '4-Point ASTM D5430 Optical Inspection on 100% of Lots',
        ],
        bulletsAr: [
          'نسبة صباغة صحيحة من المرة الأولى 94.8% (RFT)',
          'تطابق لوني طيفي بدقة ΔE ≤ 0.8',
          'فحص بصري شامل ١٠٠٪ وفق معيار ASTM D5430',
        ],
        highlightStat: '94.8% RFT Quality',
      },
      {
        panelNumber: 3,
        panelRoleEn: 'Panel 3 • Inside Center (Product Portfolio & Specs)',
        panelRoleAr: 'الوجه ٣ • الداخل وسط (المواصفات الفنية للمنتجات)',
        titleEn: 'Core Technical Specifications',
        titleAr: 'المواصفات الهندسية والفنية المعتمدة',
        bodyEn: `Engineered specifically for "${rawTopic}" to exceed European, UK, and GCC retail and hospitality durability standards.`,
        bodyAr: `صُممت منتجات (${rawTopic}) لتتجاوز معايير المتانة والثبات في الأسواق الأوروبية والبريطانية والخليجية.`,
        bulletsEn: [
          'Colorfastness to Washing (ISO 105-C06): Grade 4.5–5.0',
          'Dimensional Stability (ISO 6330): ≤ ±2.0% Shrinkage',
          'Pilling Resistance (ISO 12945-2 Martindale): Grade 4.5 (2000 cycles)',
          'Custom Pantone TCX Lab-Dips in 72 Hours',
        ],
        bulletsAr: [
          'ثبات اللون للغسيل (ISO 105-C06): درجة 4.5–5.0',
          'ثبات الأبعاد والانكماش (ISO 6330): أقل من ±2.0%',
          'مقاومة التوبر (ISO 12945-2): درجة 4.5 بعد ٢٠٠٠ دورة',
          'تنفيذ عينات ألوان Pantone TCX الخاصة خلال ٧٢ ساعة',
        ],
        highlightStat: 'ΔE ≤ 0.8 Precision',
      },
      {
        panelNumber: 4,
        panelRoleEn: 'Panel 4 • Inside Right (ESG, CBAM & EU DPP)',
        panelRoleAr: 'الوجه ٤ • الداخل يسار (الاستدامة وجواز المنتج الأوروبي)',
        titleEn: 'Sustainable & EU-Compliant by Design',
        titleAr: 'استدامة موثقة ومطابقة كاملة لمعايير أوروبا',
        bodyEn: `Every shipment includes a serialized QR Digital Product Passport (EU Regulation 2024/1781) and auditable Scope 1 & 2 carbon telemetry.`,
        bodyAr: `تتضمن كل شحنة رمز QR لجواز السفر الرقمي للمنتج (لائحة الاتحاد الأوروبي 2024/1781) وبيانات البصمة الكربونية الموثقة.`,
        bulletsEn: [
          'Carbon Footprint: 0.86 kg CO2e / kg product (32% below benchmark)',
          '62% Closed-Loop Water Recycling & Heat Recovery',
          'ZDHC MRSL v3.1 Level 3 Zero-Hazardous-Discharge Chemistry',
        ],
        bulletsAr: [
          'البصمة الكربونية: 0.86 كجم CO2e/كجم (أقل بـ ٣٢٪ من المتوسط)',
          '62% إعادة تدوير مياه مغلقة واسترداد الطاقة الحرارية',
          'مطابقة كاملة لقائمة ZDHC MRSL v3.1 للمستوى الثالث',
        ],
        highlightStat: '0.86 kg CO2e/kg',
      },
      {
        panelNumber: 5,
        panelRoleEn: 'Panel 5 • Outside Back Flap (Commercial & MOQ Terms)',
        panelRoleAr: 'الوجه ٥ • الطية الخلفية (شروط التوريد والكميات المرنة)',
        titleEn: 'Agile MOQs & Near-Shore Logistics',
        titleAr: 'مرونة الكميات وسرعة الشحن الدولي',
        bodyEn: `Skip 60-day Asian transit bottlenecks. Partner directly with El-Mahalla’s integrated textile cluster for rapid replenishment.`,
        bodyAr: `تجاوز فترات الانتظار الطويلة. تعاقد مباشرة مع تجمع المحلة الكبرى الصناعي لتوريد سريع وموثوق.`,
        bulletsEn: [
          'Sample Swatch Kit & Lab-Dips: Dispatched in 5 Business Days',
          'Flexible MOQs: From 300–500 units (Capsules) to 100,000+ (Programs)',
          'Incoterms: FOB Alexandria / Damietta or CIF Rotterdam / Genoa / Jebel Ali',
        ],
        bulletsAr: [
          'شحن صندوق العينات وتجارب الألوان خلال ٥ أيام عمل',
          'حد أدنى مرن يبدأ من ٣٠٠–٥٠٠ قطعة وحتى ١٠٠,٠٠٠+ قطعة',
          'شروط تسليم مرنة: FOB الإسكندرية/دمياط أو CIF موانئ أوروبا والخليج',
        ],
        highlightStat: '14-Day EU Transit',
      },
      {
        panelNumber: 6,
        panelRoleEn: 'Panel 6 • Outside Back Cover (Contact & QR Passport)',
        panelRoleAr: 'الوجه ٦ • الغلاف الخلفي (التواصل المباشر ورمز QR)',
        titleEn: 'Connect with Our Export Desk',
        titleAr: 'تواصل مباشرة مع مكتب التصدير',
        bodyEn: `Scan the QR code to inspect our live EU Digital Product Passports, book a virtual mill tour, or claim your complimentary DHL Swatch Box.`,
        bodyAr: `امسح رمز QR لفحص جواز السفر الرقمي للمنتجات، أو حجز جولة افتراضية بالمصنع، أو طلب صندوق العينات المجاني عبر DHL.`,
        bulletsEn: [
          'Industrial Zone, El-Mahalla El-Kubra, Gharbia, Egypt',
          'Export Desk: export@mahalla-cluster.eg • +20 40 222 0000',
          'Web Showroom: mahalla-cluster-app.vercel.app',
        ],
        bulletsAr: [
          'المنطقة الصناعية، المحلة الكبرى، محافظة الغربية، مصر',
          'مكتب التصدير: export@mahalla-cluster.eg • +20 40 222 0000',
          'المنصة الرقمية: mahalla-cluster-app.vercel.app',
        ],
        highlightStat: 'SCAN FOR FREE SWATCH KIT',
      },
    ],
    flyerSpec: {
      badgeEn: 'OFFICIAL EXPORT SHOWCASE • FAST-TRACK SAMPLING',
      badgeAr: 'عرض التصدير الرسمي • شحن فوري للعينات',
      headlineEn: `${brandNameEn}: Certified Egyptian ${brandTopicShort(rawTopic)}`,
      headlineAr: `${brandNameAr}: التميز المصري المعتمد في ${brandTopicShort(rawTopic)}`,
      subheadlineEn: `Engineered in El-Mahalla El-Kubra for ${targetMarket} — ISO 17025 Tested, ZDHC Level 3 & EU Digital Product Passport Ready.`,
      subheadlineAr: `صُنع في المحلة الكبرى خصيصاً لـ (${targetMarket}) — معتمد معملياً ISO 17025 و ZDHC وجاهز لجواز المنتج الأوروبي.`,
      offerHighlightEn: 'VIP BUYER OFFER: FREE DHL SWATCH BOX + 72-HOUR CUSTOM PANTONE LAB-DIPS + 10% OFF FIRST TRIAL ORDER',
      offerHighlightAr: 'عرض خاص للمشترين: صندوق عينات مجاني عبر DHL + مطابقة ألوان Pantone خلال ٧٢ ساعة + خصم ١٠٪ على أول طلبية تجريبية',
      keySpecs: [
        {
          labelEn: 'Fiber & Provenance',
          labelAr: 'الألياف والمصدر',
          valueEn: '100% Traceable Egyptian Giza / Certified Eco-Fibers',
          valueAr: 'ألياف مصرية موثقة ١٠٠٪ بشهادة منشأ وتتبع رقمي',
        },
        {
          labelEn: 'Quality & Fastness',
          labelAr: 'الجودة والثبات',
          valueEn: 'ISO 105 Grade 4.5+ • ΔE ≤ 0.8 • ≤2% Shrinkage',
          valueAr: 'ثبات غسيل 4.5+ • دقة لون ΔE ≤ 0.8 • انكماش ≤ 2%',
        },
        {
          labelEn: 'Eco & EU Compliance',
          labelAr: 'المطابقة البيئية والأوروبية',
          valueEn: 'OEKO-TEX® 100 • ZDHC v3.1 • EU DPP QR Serialized',
          valueAr: 'معتمد OEKO-TEX® 100 و ZDHC وجواز المنتج الأوروبي',
        },
        {
          labelEn: 'Lead Time & MOQ',
          labelAr: 'مدة التوريد والحد الأدنى',
          valueEn: '5-Day Samples • 14-Day EU Sea Freight • Flexible MOQ',
          valueAr: 'عينات خلال ٥ أيام • شحن بحري ١٤ يوماً • كميات مرنة',
        },
      ],
      ctaEn: 'Scan QR or Visit mahalla-cluster-app.vercel.app to Request Your Swatch Box',
      ctaAr: 'امسح رمز QR أو زر المنصة لطلب صندوق العينات وعرض السعر الفوري',
      contactLine: 'El-Mahalla El-Kubra Textile Cluster • export@mahalla-cluster.eg • FOB Alexandria / CIF Europe & GCC',
    },
    posterSpec: {
      exhibitionNameEn: 'HEIMTEXTIL FRANKFURT / PREMIÈRE VISION PARIS — EGYPT PAVILION',
      exhibitionNameAr: 'معرض هايم تكستيل فرانكفورت / بريميير فيجن باريس — الجناح المصري',
      boothNumber: 'HALL 4.1 • BOOTH C-18',
      heroStatementEn: brandNameEn,
      heroStatementAr: brandNameAr,
      subStatementEn: `THE FUTURE OF TRACEABLE EGYPTIAN TEXTILES: ${rawTopic.toUpperCase()}`,
      subStatementAr: `مستقبل النسيج المصري الموثق عالمياً: ${rawTopic}`,
      pillars: [
        {
          titleEn: 'DNA-Traceable Egyptian Fibers',
          titleAr: 'ألياف مصرية موثقة المصدر ١٠٠٪',
          metric: 'GIZA GOLD SEAL',
        },
        {
          titleEn: 'Right-First-Time Shade Accuracy',
          titleAr: 'دقة صباغة قياسية من المرة الأولى',
          metric: 'ΔE ≤ 0.8 RFT',
        },
        {
          titleEn: 'Verified Low Carbon Footprint',
          titleAr: 'بصمة كربونية منخفضة وموثقة',
          metric: '0.86 kg CO2e',
        },
        {
          titleEn: 'Fast-Track Alexandria to EU Port',
          titleAr: 'شحن بحري سريع من الإسكندرية لأوروبا',
          metric: '14 DAYS FOB/CIF',
        },
      ],
      footerCalloutEn: 'SCAN QR CODE AT BOOTH FOR INSTANT DIGITAL CATALOG, LIVE EU PRODUCT PASSPORT & FREE DHL SAMPLE DISPATCH',
      footerCalloutAr: 'امسح رمز QR في الجناح للحصول الفوري على الكتالوج الرقمي وجواز المنتج الأوروبي وشحن العينات مجاناً عبر DHL',
    },
  };
}

function brandTopicShort(rawTopic: string): string {
  const clean = rawTopic.trim();
  if (clean.length <= 48) return clean;
  return clean.slice(0, 46).trim() + '…';
}
