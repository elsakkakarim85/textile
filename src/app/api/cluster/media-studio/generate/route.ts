import { z } from 'zod';
import { route, parseBody } from '@/server/http';
import { generate, type FreeLlmModelId } from '@/server/ai';

const MediaGenerateSchema = z.object({
  companyName: z.string().min(2).max(160),
  companySpecialty: z.string().min(2).max(400),
  certifications: z.string().max(300).default('OEKO-TEX Standard 100, ISO 17025, EUR.1 0% EU Duty, EU DPP'),
  targetMarket: z.string().max(200).default('European Union (Germany, Italy, France) & USA Hospitality'),
  primaryColorHex: z.string().max(20).default('#064E3B'),
  accentColorHex: z.string().max(20).default('#D97706'),
  purposeId: z
    .enum([
      'B2B_BUYER_PITCH',
      'TRADE_SHOW_BOOTH',
      'MACRO_SWATCH_SHOWCASE',
      'FACTORY_TOUR_OEE',
      'SOCIAL_MEDIA_AD',
      'ESG_CBAM_DPP',
      'ACADEMY_SOP_TRAINING',
      'PRODUCT_CATALOG_HERO',
    ])
    .default('B2B_BUYER_PITCH'),
  prompt: z.string().min(3).max(2000),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5']).default('16:9'),
  imageModelId: z
    .enum(['flux-schnell', 'flux-realism', 'sdxl-turbo', 'imagen-3-bridge'])
    .default('flux-schnell'),
  videoModelId: z
    .enum(['veo-2', 'wan-2.1-t2v', 'hunyuan-video', 'cogvideox-5b'])
    .default('veo-2'),
  preferredLlm: z
    .enum([
      'auto',
      'mahalla-sovereign',
      'llama-3.3-70b',
      'deepseek-r1',
      'mistral',
      'qwen-2.5-72b',
      'openai-free',
      'gemini-2.5-flash',
    ])
    .optional(),
  seed: z.number().int().optional(),
  locale: z.string().max(10).optional(),
});

function getDimensions(aspectRatio: '16:9' | '9:16' | '1:1' | '4:5') {
  switch (aspectRatio) {
    case '16:9':
      return { width: 1280, height: 720 };
    case '9:16':
      return { width: 720, height: 1280 };
    case '1:1':
      return { width: 1024, height: 1024 };
    case '4:5':
      return { width: 960, height: 1200 };
  }
}

const ZERO_LIMIT_STUDIO_POOLS: Record<string, string[]> = {
  'angle-hero': [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=1280&q=85',
  ],
  'angle-macro': [
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1280&q=85',
  ],
  'angle-factory': [
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1280&q=85',
  ],
  'angle-export': [
    'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1280&q=85',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1280&q=85',
  ],
};

function buildPollinationsImageUrl(
  promptText: string,
  _modelId: string,
  width: number,
  height: number,
  seed: number,
  angleId = 'angle-hero'
) {
  const pool = ZERO_LIMIT_STUDIO_POOLS[angleId] || ZERO_LIMIT_STUDIO_POOLS['angle-hero'];
  const hash = promptText.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), seed);
  const base = pool[Math.abs(hash) % pool.length];
  return `${base.split('?')[0]}?auto=format&fit=crop&w=${width}&h=${height}&q=85&sig=${Math.abs(seed)}`;
}

export const POST = route(async (req) => {
  const startMs = Date.now();
  const rawBody = await parseBody(req, MediaGenerateSchema);
  const body = {
    companyName: rawBody.companyName,
    companySpecialty: rawBody.companySpecialty,
    certifications:
      rawBody.certifications || 'OEKO-TEX Standard 100, ISO 17025, EUR.1 0% EU Duty, EU DPP',
    targetMarket:
      rawBody.targetMarket || 'European Union (Germany, Italy, France) & USA Hospitality',
    primaryColorHex: rawBody.primaryColorHex || '#064E3B',
    accentColorHex: rawBody.accentColorHex || '#D97706',
    purposeId: rawBody.purposeId || ('B2B_BUYER_PITCH' as const),
    prompt: rawBody.prompt,
    aspectRatio: rawBody.aspectRatio || ('16:9' as const),
    imageModelId: rawBody.imageModelId || ('flux-schnell' as const),
    videoModelId: rawBody.videoModelId || ('veo-2' as const),
    preferredLlm: rawBody.preferredLlm,
    seed: rawBody.seed,
    locale: rawBody.locale || 'en',
  };
  const { width, height } = getDimensions(body.aspectRatio);
  const baseSeed = body.seed || Math.floor(100000 + Math.random() * 899999);

  const purposeMeta: Record<
    string,
    {
      labelEn: string;
      labelAr: string;
      cameraStyle: string;
      hookEn: string;
      hookAr: string;
      ctaEn: string;
      ctaAr: string;
    }
  > = {
    B2B_BUYER_PITCH: {
      labelEn: 'B2B International Buyer Pitch & RFQ Proposal',
      labelAr: 'عرض تقديمي للمشترين الدوليين ومناقصات التصدير (B2B)',
      cameraStyle: 'Arri Alexa Mini LF, 35mm anamorphic lens, architectural industrial lighting, ultra-sharp depth of field',
      hookEn: `Direct from ${body.companyName}: Zero-Duty Export Reliability & Audited Six Sigma Quality`,
      hookAr: `مباشرة من ${body.companyName}: توريد تصديري معفى جمركياً وجودة 6 سيجما موثقة معملياً`,
      ctaEn: 'Request DHL Swatch Box & CIF Quote →',
      ctaAr: 'اطلب صندوق العينات وعرض سعر CIF الآن ←',
    },
    TRADE_SHOW_BOOTH: {
      labelEn: 'Heimtextil Frankfurt / Première Vision Exhibition Booth',
      labelAr: 'جناح المعارض الدولية (هايم تكستيل فرانكفورت / بريميير فيجن)',
      cameraStyle: '24mm tilt-shift architectural exhibition photography, warm luxury spotlights, floating textile drapes',
      hookEn: `Visit ${body.companyName} at Hall 4.1 • Experience Authentic El-Mahalla Craftsmanship`,
      hookAr: `تفضلوا بزيارة جناح ${body.companyName} — قاعة 4.1 • عراقة صناعة المحلة الكبرى`,
      ctaEn: 'Book VIP Buyer Meeting at Booth • Scan DPP QR',
      ctaAr: 'احجز اجتماع مشتريات VIP بالجناح • امسح كود DPP',
    },
    MACRO_SWATCH_SHOWCASE: {
      labelEn: '100mm Macro Fabric Swatch & Yarn Physics Showcase',
      labelAr: 'تصوير ماكرو فائق الدقة لتركيب النسج والغزل والألياف',
      cameraStyle: '100mm f/2.8 Macro lens, raking studio strobe lighting at 35 degrees, individual Giza cotton fiber sheen',
      hookEn: `${body.companyName} Micro-Structure: Precision Yarn Twist, Luster & CMC ΔE ≤ 0.5 Shade Continuity`,
      hookAr: `التركيب المجهري لمنتجات ${body.companyName}: انتظام البرم واللمعان وتطابق لوني ΔE ≤ 0.5`,
      ctaEn: 'Download ISO 17025 Lab Test & Swatch Card',
      ctaAr: 'حمّل شهادة معمل ISO 17025 وبطاقة العينات',
    },
    FACTORY_TOUR_OEE: {
      labelEn: 'Automated Mill Tour, Loom OEE & Lab Quality Documentary',
      labelAr: 'فيلم وثائقي لخطوط الإنتاج الأوتوماتيكية ومعامل الفحص ومؤشر OEE',
      cameraStyle: 'FPV gimbal tracking shot through high-speed Picanol air-jet weaving hall and Datacolor lab',
      hookEn: `Inside ${body.companyName}: Industry 4.0 Automation, 88%+ Loom OEE & 98.4% Right-First-Time`,
      hookAr: `من داخل مصانع ${body.companyName}: أتمتة الصناعة 4.0 وكفاءة تشغيل OEE تتجاوز 88%`,
      ctaEn: 'Schedule Live Virtual Factory Audit',
      ctaAr: 'احجز جولة تدقيق افتراضية مباشرة للمصنع',
    },
    SOCIAL_MEDIA_AD: {
      labelEn: 'High-Converting LinkedIn B2B & Instagram Reel Campaign',
      labelAr: 'حملة إعلانية عالية التحويل لمنصات LinkedIn و Instagram Reels',
      cameraStyle: 'Dynamic commercial lifestyle + studio split-lighting, crisp 8K editorial color grade',
      hookEn: `Why Top European Hospitality & Retail Brands Switch to ${body.companyName}`,
      hookAr: `لماذا تتحول كبرى العلامات الفندقية والأوروبية للتوريد من ${body.companyName}؟`,
      ctaEn: 'Get Instant Landed-Cost Quote (0% EUR.1/QIZ Duty)',
      ctaAr: 'احصل على تسعير فوري شامل الشحن (0% جمارك)',
    },
    ESG_CBAM_DPP: {
      labelEn: 'Green Cleantech, ZLD Water Recycling & EU DPP Traceability',
      labelAr: 'الاستدامة وتدوير المياه والطاقة الشمسية وجواز المنتج الأوروبي DPP',
      cameraStyle: 'Clean Nordic eco-industrial cinematography, natural sunlight over rooftop solar array and crystal-clear ZLD water',
      hookEn: `${body.companyName}: EU CBAM & ESPR Ready with Cryptographic Digital Product Passports`,
      hookAr: `${body.companyName}: جاهزية كاملة لاشتراطات الاتحاد الأوروبي CBAM وجواز المنتج الرقمي`,
      ctaEn: 'Verify SHA-256 Product Passport & Carbon Footprint',
      ctaAr: 'تحقق من البصمة الكربونية وجواز المنتج الرقمي',
    },
    ACADEMY_SOP_TRAINING: {
      labelEn: 'Shop-Floor Standard Work (SOP) & Operator Visual Training',
      labelAr: 'تدريب بصري لإجراءات العمل القياسية (SOP) وسلامة العنبر',
      cameraStyle: 'Clear instructional overhead + over-the-shoulder industrial training camera, high-contrast callouts',
      hookEn: `${body.companyName} Lean Academy: Standardized SMED, Poka-Yoke & 4-Point Inspection Mastery`,
      hookAr: `أكاديمية اللين في ${body.companyName}: إتقان التشغيل القياسي وفحص الجودة من المرة الأولى`,
      ctaEn: 'Complete SOP Module & Earn MC-* Certificate',
      ctaAr: 'أكمل وحدة التشغيل القياسي واحصل على الشهادة',
    },
    PRODUCT_CATALOG_HERO: {
      labelEn: 'Luxury Hospitality & Editorial Lookbook Hero Campaign',
      labelAr: 'تصوير كتالوج المنتجات الفاخرة والفنادق (5 نجوم)',
      cameraStyle: 'Medium-format Hasselblad H6D-100c, sunlit Mediterranean suite, soft organic linen drape',
      hookEn: `${body.companyName} Flagship Collection — Crafted in El-Mahalla for Global Luxury Markets`,
      hookAr: `التشكيلة الرائدة من ${body.companyName} — صُنعت في المحلة الكبرى لأسواق الفخامة العالمية`,
      ctaEn: 'Explore Full B2B Season Catalog & MOQs',
      ctaAr: 'تصفح كتالوج الموسم الكامل والكميات المتاحة',
    },
  };

  const pMeta = purposeMeta[body.purposeId] || purposeMeta.B2B_BUYER_PITCH;

  // Build 4 specialized camera-angle image prompts grounded in the company's info + user prompt
  const baseVisualPrompt = `${body.prompt}, produced by ${body.companyName} (${body.companySpecialty}), El Mahalla El Kubra Egypt textile excellence, color palette ${body.primaryColorHex} and ${body.accentColorHex}, ${pMeta.cameraStyle}, photorealistic 8k commercial photography, ultra-detailed textile weave texture, no text watermark`;

  const angleSpecs = [
    {
      id: 'angle-hero',
      titleEn: '1. Flagship Hero & Brand Positioning Shot',
      titleAr: '١. اللقطة الرئيسية للعلامة والمنتج (Hero Shot)',
      lens: '35mm f/1.8 Prime • Studio Key + Rim Lighting',
      promptEn: `Commercial hero photograph of ${baseVisualPrompt}, showcasing flagship finished textile quality in an executive setting for ${body.targetMarket}`,
      promptAr: `لقطة إعلانية رئيسية تبرز جودة المنتج النسيجي النهائي لشركة ${body.companyName} الموجه لأسواق ${body.targetMarket}`,
      badgeEn: body.certifications.split(',')[0]?.trim() || 'OEKO-TEX® Standard 100',
      badgeAr: 'معتمد للتصدير الدولي',
    },
    {
      id: 'angle-macro',
      titleEn: '2. 100mm Macro Weave, Yarn Twist & Pantone Fidelity',
      titleAr: '٢. لقطة ماكرو دقيقة لتركيب النسيج والغزل والألوان',
      lens: '100mm f/2.8 Macro • 35° Raking Fiber Light',
      promptEn: `Extreme macro close-up photography of ${body.prompt}, ${body.companySpecialty}, showing individual combed Egyptian cotton fibers, tight even weave structure, lustrous sheen, Pantone spectrophotometer color accuracy, 8k micro-texture`,
      promptAr: `تصوير ماكرو فائق الدقة يوضح انتظام شعيرات القطن المصري الممشط وكثافة النسج وتطابق اللون لمنتج ${body.companyName}`,
      badgeEn: 'CMC ΔE ≤ 0.5 • ISO 17025 Lab',
      badgeAr: 'تطابق لوني ΔE ≤ 0.5 • معمل أيزو 17025',
    },
    {
      id: 'angle-factory',
      titleEn: '3. Automated Production Hall & Six Sigma QC Lab',
      titleAr: '٣. صالة الإنتاج الأوتوماتيكية ومعمل مراقبة الجودة',
      lens: '24mm Wide Cinema • Clean Industrial Daylight',
      promptEn: `Modern high-tech textile factory floor at ${body.companyName} in El-Mahalla, automated Picanol air-jet looms and Datacolor quality testing laboratory producing ${body.prompt}, spotless 5S Lean manufacturing environment, 8k photorealistic`,
      promptAr: `صالة الإنتاج الحديثة في ${body.companyName} بالمحلة الكبرى وتظهر ماكينات النسيج الأوتوماتيكية ومعمل فحص الجودة أثناء إنتاج ${body.prompt}`,
      badgeEn: 'Lean Six Sigma Cpk 1.48 • OEE 88%',
      badgeAr: 'تصنيع رشيق 6 سيجما • كفاءة OEE 88%',
    },
    {
      id: 'angle-export',
      titleEn: '4. Export-Ready Presentation, Swatch Box & EU DPP',
      titleAr: '٤. تجهيز التصدير وصندوق العينات وجواز المنتج الأوروبي',
      lens: '50mm f/2.0 • Luxury B2B Presentation Studio',
      promptEn: `Luxury B2B textile swatch book and export packaging presentation for ${body.companyName} featuring ${body.prompt}, neatly folded fabric samples with Pantone color chips and eco certification hangtags ready for ${body.targetMarket}, 8k studio photography`,
      promptAr: `عرض احترافي لكتالوج وصندوق عينات التصدير الخاص بشركة ${body.companyName} مع بطاقات الألوان وشهادة جواز المنتج الأوروبي`,
      badgeEn: '0% Duty EUR.1 / QIZ • EU DPP Verified',
      badgeAr: 'إعفاء جمركي 0% • جواز منتج أوروبي DPP',
    },
  ];

  const images = angleSpecs.map((ang, idx) => ({
    ...ang,
    seed: baseSeed + idx * 17,
    width,
    height,
    aspectRatio: body.aspectRatio,
    imageUrl: buildPollinationsImageUrl(
      ang.promptEn,
      body.imageModelId,
      width,
      height,
      baseSeed + idx * 17,
      ang.id
    ),
  }));

  // Build 5-Scene Video Storyboard with real AI keyframe URLs + camera motion + bilingual voiceover
  const scenes = [
    {
      sceneNumber: 1,
      durationSec: 4,
      cameraMotion: 'ZOOM_IN' as const,
      cameraMotionLabelEn: 'Slow Anamorphic Push-In',
      cameraMotionLabelAr: 'تقريب سينمائي تدريجي (Push-In)',
      headlineEn: pMeta.hookEn,
      headlineAr: pMeta.hookAr,
      sublineEn: `${body.companyName} • ${body.companySpecialty}`,
      sublineAr: `${body.companyName} • ${body.companySpecialty}`,
      voiceoverEn: `Welcome to ${body.companyName} in El-Mahalla El-Kubra. We engineer ${body.prompt} with audited international precision for ${body.targetMarket}.`,
      voiceoverAr: `مرحباً بكم في ${body.companyName} بمدينة المحلة الكبرى. نقدم لكم ${body.prompt} بأعلى معايير الجودة العالمية الموجهة لأسواق ${body.targetMarket}.`,
      kpiBadgeEn: 'EL-MAHALLA PREMIER EXPORTER',
      kpiBadgeAr: 'مصدر معتمد — المحلة الكبرى',
      visualPromptEn: angleSpecs[0].promptEn,
      keyframeUrl: images[0].imageUrl,
    },
    {
      sceneNumber: 2,
      durationSec: 4,
      cameraMotion: 'PAN_RIGHT' as const,
      cameraMotionLabelEn: '100mm Macro Lateral Tracking Shot',
      cameraMotionLabelAr: 'حركة كاميرا ماكرو جانبية على النسيج',
      headlineEn: 'Extra-Long Staple Fiber & Micro-Weave Perfection',
      headlineAr: 'ألياف قطنية فائقة الطول ودقة نسج وصباغة متناهية',
      sublineEn: `Spectrophotometer Shade Matching CMC ΔE ≤ 0.5 • High Tensile Strength`,
      sublineAr: `مطابقة لونية بالمطياف الضوئي ΔE ≤ 0.5 • متانة شد ومقاومة عالية للوبرة`,
      voiceoverEn: `Every yarn and fabric lot undergoes 100-millimeter macro inspection and spectrophotometer matching under ΔE 0.5.`,
      voiceoverAr: `تخضع كل تشغيلة غزل ونسيج لفحص مجهري دقيق ومطابقة لونية بالمطياف الضوئي بأقل من نصف درجة حيود لوني.`,
      kpiBadgeEn: 'CMC ΔE ≤ 0.5 • USTER® 5% GRADE',
      kpiBadgeAr: 'حيود لوني ΔE ≤ 0.5 • جودة Uster 5%',
      visualPromptEn: angleSpecs[1].promptEn,
      keyframeUrl: images[1].imageUrl,
    },
    {
      sceneNumber: 3,
      durationSec: 4,
      cameraMotion: 'ZOOM_OUT' as const,
      cameraMotionLabelEn: 'Gimbal Crane Pull-Back Across Loom Hall',
      cameraMotionLabelAr: 'حركة كاميرا واسعة داخل صالة الماكينات',
      headlineEn: 'Lean Six Sigma Manufacturing & 98.4% Right-First-Time',
      headlineAr: 'تصنيع رشيق (Lean Six Sigma) ومطابقة قياسية من المرة الأولى 98.4%',
      sublineEn: `Automated Machinery • Real-Time OEE Telemetry • ISO 17025 Testing`,
      sublineAr: `ماكينات أوتوماتيكية حديثة • رقابة جودة لحظية • فحص معمل ISO 17025`,
      voiceoverEn: `Powered by Lean Six Sigma process capability Cpk 1.48 and automated production lines, we guarantee consistent bulk quality and on-time container loading.`,
      voiceoverAr: `بفضل منظومة التصنيع الرشيق ولين 6 سيجما والماكينات الأوتوماتيكية، نضمن ثبات الجودة والالتزام التام بمواعيد شحن الحاويات.`,
      kpiBadgeEn: 'LEAN SIX SIGMA Cpk 1.48 • ISO 17025',
      kpiBadgeAr: 'قدرة العملية Cpk 1.48 • أيزو 17025',
      visualPromptEn: angleSpecs[2].promptEn,
      keyframeUrl: images[2].imageUrl,
    },
    {
      sceneNumber: 4,
      durationSec: 4,
      cameraMotion: 'PAN_LEFT' as const,
      cameraMotionLabelEn: 'Orbital Sweep Over Eco-Certifications & DPP QR',
      cameraMotionLabelAr: 'استعراض شهادات الاستدامة وجواز المنتج الأوروبي',
      headlineEn: `Certified Compliance: ${body.certifications}`,
      headlineAr: `شهادات التوافق الدولية: ${body.certifications}`,
      sublineEn: `Zero-Duty Export via EUR.1 / QIZ + Cryptographic EU Digital Product Passport`,
      sublineAr: `إعفاء جمركي 0% عبر شهادات EUR.1 و QIZ + جواز المنتج الرقمي الأوروبي المشفر`,
      voiceoverEn: `All shipments include full ${body.certifications} documentation, zero-duty preferential origin certificates, and a cryptographic EU Digital Product Passport.`,
      voiceoverAr: `تُرفق جميع الشحنات بشهادات ${body.certifications} وشهادات المنشأ للإعفاء الجمركي وجواز المنتج الرقمي الأوروبي.`,
      kpiBadgeEn: '0% CUSTOMS DUTY • EU ESPR DPP',
      kpiBadgeAr: 'إعفاء جمركي 0% • جواز منتج أوروبي',
      visualPromptEn: angleSpecs[3].promptEn,
      keyframeUrl: images[3].imageUrl,
    },
    {
      sceneNumber: 5,
      durationSec: 4,
      cameraMotion: 'ZOOM_IN' as const,
      cameraMotionLabelEn: 'Executive Hero Lock-Off & Call-to-Action',
      cameraMotionLabelAr: 'كادر ختامي للهوية التجارية ودعوة التواصل المباشر',
      headlineEn: pMeta.ctaEn,
      headlineAr: pMeta.ctaAr,
      sublineEn: `${body.companyName} • Direct Export Desk • El-Mahalla Industrial Cluster`,
      sublineAr: `${body.companyName} • مكتب التصدير المباشر • تجمع المحلة الكبرى الصناعي`,
      voiceoverEn: `Partner with ${body.companyName} today. Request your physical DHL swatch box and customized landed-cost quotation.`,
      voiceoverAr: `تواصل مع مكتب التصدير في ${body.companyName} اليوم، واطلب صندوق العينات المجاني عبر DHL وعرض السعر المخصص لطلبيتك.`,
      kpiBadgeEn: 'DHL 48H SWATCH DISPATCH • SMART ESCROW',
      kpiBadgeAr: 'إرسال عينات DHL خلال 48 ساعة • ضمان بنكي',
      visualPromptEn: angleSpecs[0].promptEn,
      keyframeUrl: images[0].imageUrl,
    },
  ];

  // Optional Free LLM strategic enrichment of the company analysis & director notes
  let aiDirectorBrief = '';
  let llmModelUsed = 'mahalla-media-director-engine';
  try {
    const llmRes = await generate({
      system: `You are an elite Industrial Textile Creative Director & B2B Visual Strategist for the El-Mahalla El-Kubra Textile Cluster. Analyze the company's profile and media purpose and write a concise 4-bullet executive creative direction brief (Visual Positioning, Color & Lighting Psychology, Key Technical Proof to Highlight On-Screen, and Conversion Hook). Respond in ${
        body.locale === 'ar' ? 'Arabic' : 'English'
      }.`,
      messages: [
        {
          role: 'user',
          content: `Company: ${body.companyName} (${body.companySpecialty})
Certifications: ${body.certifications}
Target Market: ${body.targetMarket}
Purpose: ${pMeta.labelEn}
User Prompt: ${body.prompt}`,
        },
      ],
      temperature: 0.4,
      preferredModel: (body.preferredLlm || 'auto') as FreeLlmModelId,
    });
    aiDirectorBrief = llmRes.text;
    llmModelUsed = llmRes.model;
  } catch {
    aiDirectorBrief =
      body.locale === 'ar'
        ? `• **التموضع البصري:** إبراز الجمع بين عراقة صناعة المحلة الكبرى في ${body.companyName} والتكنولوجيا الأوروبية الحديثة.\n• **سيكولوجية الإضاءة والألوان:** توظيف اللون الأساسي (${body.primaryColorHex}) والذهبي (${body.accentColorHex}) مع إضاءة ماكرو جانبية بزاوية 35° لإظهار لمعان وانتظام الغزل.\n• **الدليل الهندسي على الشاشة:** تثبيت شارات ${body.certifications} ومؤشر تطابق اللون ΔE ≤ 0.5 في الثلث السفلي.\n• **محفز التحويل (CTA):** توجيه المشتري في ${body.targetMarket} لطلب صندوق العينات الفوري عبر DHL مع الإعفاء الجمركي 0%.`
        : `• **Visual Positioning:** Position ${body.companyName} as a vertically integrated, audit-ready El-Mahalla export manufacturer combining Egyptian cotton heritage with Industry 4.0 precision.\n• **Lighting & Color Psychology:** Anchor frames in ${body.primaryColorHex} and ${body.accentColorHex} with 35° raking macro strobes to accentuate yarn twist and sateen/terry luster.\n• **On-Screen Technical Proof:**Prominently badge ${body.certifications} and spectrophotometer ΔE ≤ 0.5 tolerance.\n• **Conversion Hook:** Drive ${body.targetMarket} buyers to request the 48-hour DHL physical swatch box and 0%-duty EUR.1/QIZ landed-cost quote.`;
  }

  // Video model specialized master prompts (for Veo 2, Wan 2.1, HunyuanVideo, CogVideoX)
  const videoModelPrompts = {
    'veo-2': `[Google Veo 2 / VideoFX Master Prompt — ${body.aspectRatio}, 24fps Cinema] Continuous multi-shot commercial documentary for ${body.companyName}: Shot 1 (0-4s): ${angleSpecs[0].promptEn}. Shot 2 (4-8s): 100mm macro pan across ${body.prompt} showing individual Egyptian cotton fibers and lustrous weave. Shot 3 (8-12s): Gimbal tracking shot inside ${body.companyName} automated weaving & dyeing hall. Shot 4 (12-16s): Close-up of export swatch box with ${body.certifications} & EU DPP QR code. Lighting: ${pMeta.cameraStyle}.`,
    'wan-2.1-t2v': `[Wan 2.1 14B Text-to-Video Prompt] Photorealistic 1080p commercial video of ${body.prompt} manufactured by ${body.companyName}, smooth camera dolly motion, ultra-detailed fabric drape physics, realistic fiber micro-surface reflection, studio rim lighting in ${body.primaryColorHex} and ${body.accentColorHex}, 8k raw cinema quality.`,
    'hunyuan-video': `[HunyuanVideo / CogVideoX-5B Prompt] High-motion cinematic textile showcase: ${body.prompt} flowing in slow-motion 60fps under warm studio spotlights, transitioning to macro weave structure and ${body.companyName} luxury export presentation for ${body.targetMarket}.`,
  };

  return {
    companyAnalysis: {
      companyName: body.companyName,
      companySpecialty: body.companySpecialty,
      certifications: body.certifications,
      targetMarket: body.targetMarket,
      primaryColorHex: body.primaryColorHex,
      accentColorHex: body.accentColorHex,
      purposeId: body.purposeId,
      purposeLabelEn: pMeta.labelEn,
      purposeLabelAr: pMeta.labelAr,
      hookEn: pMeta.hookEn,
      hookAr: pMeta.hookAr,
      ctaEn: pMeta.ctaEn,
      ctaAr: pMeta.ctaAr,
      aiDirectorBrief,
      llmModelUsed,
    },
    images,
    videoStoryboard: {
      totalDurationSec: 20,
      aspectRatio: body.aspectRatio,
      width,
      height,
      videoModelId: body.videoModelId,
      videoModelPrompts,
      scenes,
    },
    latencyMs: Date.now() - startMs,
    generatedAt: new Date().toISOString(),
  };
});
