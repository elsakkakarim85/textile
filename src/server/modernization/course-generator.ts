export interface AuthorizedResource {
  id: string;
  organization: string;
  title: string;
  titleAr: string;
  standardCode: string;
  url: string;
  summary: string;
  summaryAr: string;
  categories: string[];
}

export interface QuizQuestion {
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
}

export interface LessonSlide {
  title: string;
  titleAr: string;
  bulletPoints: string[];
  bulletPointsAr: string[];
  kpiHighlight: string;
}

export interface LessonMultimediaMeta {
  levelTier: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  videoDurationSec: number;
  videoYoutubeId?: string;
  slides: LessonSlide[];
  audioSummaryEn: string;
  audioSummaryAr: string;
  processSteps: { step: string; stepAr: string; metric: string }[];
  sopChecklist: { item: string; itemAr: string }[];
  authorizedRefs: AuthorizedResource[];
  quiz: QuizQuestion[];
}

export const TRUSTED_AUTHORIZED_RESOURCES: AuthorizedResource[] = [
  {
    id: 'unido-tigara',
    organization: 'UNIDO & EU-Egypt TIGARA Project',
    title: 'Egyptian Cotton & Textile Cluster Upgrading Methodology (El Mahalla El Kubra)',
    titleAr: 'منهجية اليونيدو ومشروع تيجارة لتطوير تجمع الغزل والنسيج بالمحلة الكبرى',
    standardCode: 'UNIDO-TIGARA-2025',
    url: 'https://www.unido.org',
    summary:
      'Official technical guidelines on OEE optimization, SMED loom changeover, and value-chain linkages for Egyptian textile SMEs.',
    summaryAr:
      'الإرشادات الفنية الرسمية لتحسين كفاءة المعدات OEE وتقليل أوقات تغيير التشغيل وربط سلاسل القيمة لمصانع المحلة.',
    categories: ['MANAGEMENT', 'TECHNICAL', 'QUALITY'],
  },
  {
    id: 'zdhc-mrsl',
    organization: 'ZDHC Foundation (Zero Discharge of Hazardous Chemicals)',
    title: 'ZDHC Manufacturing Restricted Substances List (MRSL) v3.1 & Wastewater Guidelines v2.1',
    titleAr: 'قائمة المواد المحظورة في التصنيع ZDHC MRSL v3.1 وإرشادات مياه الصرف الصناعي',
    standardCode: 'ZDHC-MRSL-v3.1',
    url: 'https://www.roadmaptozero.com',
    summary:
      'Authorized chemical management framework banning APEOs, restricted azo dyes, heavy metals, and halogenated solvents in wet processing.',
    summaryAr:
      'الإطار المعتمد لإدارة الكيماويات وحظر الأصباغ الآزوية والمعادن الثقيلة والمذيبات الخطرة في المصابغ.',
    categories: ['SUSTAINABILITY', 'TECHNICAL', 'SAFETY'],
  },
  {
    id: 'eu-espr-cbam',
    organization: 'European Commission — DG Environment & Trade',
    title:
      'EU Ecodesign for Sustainable Products Regulation (ESPR) — Digital Product Passport & Carbon Accounting',
    titleAr:
      'لائحة التصميم البيئي الأوروبي ESPR — جواز المنتج الرقمي DPP وحساب البصمة الكربونية',
    standardCode: 'EU-REG-2024/1781',
    url: 'https://commission.europa.eu/energy-climate-change-environment_en',
    summary:
      'Mandatory traceability, fiber origin, Scope 1 & 2 carbon footprint (kg CO2e/kg), water intensity, and circularity disclosures for EU textile imports.',
    summaryAr:
      'متطلبات التتبع الإلزامية ومصدر الألياف والبصمة الكربونية واستهلاك المياه للتصدير إلى الاتحاد الأوروبي.',
    categories: ['EXPORT', 'SUSTAINABILITY', 'DIGITAL'],
  },
  {
    id: 'iso-astm-lab',
    organization: 'ISO / ASTM International / EGAC ISO 17025',
    title: 'Textile Physical & Colorfastness Testing Standards (ISO 105, ISO 13934, ASTM D3776)',
    titleAr: 'المواصفات القياسية لاختبارات النسيج الفيزيائية وثبات الألوان ISO 17025 / ISO 105',
    standardCode: 'ISO-17025 / ISO-105',
    url: 'https://www.iso.org',
    summary:
      'Accredited laboratory test protocols for GSM, tensile strength, pilling resistance, dimensional stability, and washing/rubbing colorfastness.',
    summaryAr:
      'بروتوكولات الفحص المعملي المعتمدة لوزن المتر المربع وقوة الشد ومقاومة التوبير وثبات الألوان للغسيل والاحتكاك.',
    categories: ['QUALITY', 'TECHNICAL', 'EXPORT'],
  },
  {
    id: 'oekotex-gots',
    organization: 'OEKO-TEX® International & Global Organic Textile Standard (GOTS)',
    title: 'OEKO-TEX® Standard 100, STeP & GOTS v7.0 Certification Manual',
    titleAr: 'دليل اعتماد شهادات الأيكوتكس OEKO-TEX Standard 100 ومعيار النسيج العضوي GOTS v7.0',
    standardCode: 'OEKO-TEX-100 / GOTS-7.0',
    url: 'https://www.oeko-tex.com',
    summary:
      'Human-ecological product safety limits for baby, direct-skin, and home textiles, plus socially and environmentally certified production.',
    summaryAr:
      'حدود الأمان البيئي والصحي للمنسوجات الملامسة للجلد والمفروشات المنزلية والتصنيع المستدام.',
    categories: ['QUALITY', 'SUSTAINABILITY', 'EXPORT'],
  },
  {
    id: 'ilo-cotton-egypt',
    organization: 'ILO Better Work & Cotton Egypt™ (CEA)',
    title: 'Occupational Safety in Spinning/Weaving Mills & Egyptian Cotton™ DNA Traceability',
    titleAr: 'السلامة المهنية بمصانع الغزل والنسيج ونظام تتبع شعار القطن المصري المعتمد',
    standardCode: 'ILO-OSH / CEA-GIZA',
    url: 'https://www.ilo.org',
    summary:
      'Cotton dust control, machine guarding, acoustic protection, gender inclusion, and Giza 86/94 bale-to-fabric DNA authentication.',
    summaryAr:
      'التحكم في غبار القطن، وسائل حماية الماكينات، الضوضاء، ونظام البصمة الوراثية لتوثيق قطن جيزة 86 و94.',
    categories: ['SAFETY', 'MANAGEMENT', 'QUALITY'],
  },
];

/**
 * Analyzes ANY user-entered topic (English or Arabic) and automatically recommends
 * the best CourseCategory, Target Role, Authorized Standards, and technical parameters.
 */
export function inferTopicProfile(rawTopic: string): {
  category:
    | 'TECHNICAL'
    | 'QUALITY'
    | 'MANAGEMENT'
    | 'DIGITAL'
    | 'SUSTAINABILITY'
    | 'EXPORT'
    | 'SAFETY';
  targetRole: string;
  resourceIds: string[];
  domainFocusEn: string;
  domainFocusAr: string;
  keyMetrics: [string, string, string, string];
  equipmentEn: string;
  equipmentAr: string;
} {
  const q = rawTopic.toLowerCase();

  if (
    /dye|bleach|wet|chemical|zdhc|water|effluent|zld|merceriz|print|sublimat|pigment|صباغ|تجهيز|كيماوي|مياه|طباع|مرسرة/.test(
      q
    )
  ) {
    return {
      category: 'SUSTAINABILITY',
      targetRole: 'Dyehouse & Chemical Supervisor',
      resourceIds: ['zdhc-mrsl', 'oekotex-gots', 'iso-astm-lab'],
      domainFocusEn:
        'Wet-processing recipe precision, liquor-ratio optimization, chemical MRSL compliance, and shade reproducibility',
      domainFocusAr:
        'دقة وصفات الصباغة والتجهيز، خفض نسبة الحمام المائي، التوافق مع قائمة ZDHC MRSL، وثبات اللون',
      keyMetrics: ['Liquor Ratio ≤ 1:6', 'pH ±0.15 / Temp ±0.5°C', 'ΔE CMC ≤ 0.8', 'ZDHC Level 3'],
      equipmentEn:
        'Low-liquor jet/airflow dyeing machines, automated salt/alkali dosing, stenter frames, and RO/ZLD water recovery units',
      equipmentAr:
        'ماكينات الصباغة منخفضة الحمام، وحدات الحقن الكيميائي الآلي، ماكينات الرام (Stenter)، ووحدات استرجاع المياه',
    };
  }

  if (
    /cbam|dpp|passport|export|eu|europe|carbon|co2|solar|energy|esg|traceab|lc|incoterm|تصدير|أوروب|كربون|جواز|طاقة|شمس/.test(
      q
    )
  ) {
    return {
      category: 'EXPORT',
      targetRole: 'Export & Sustainability Compliance Officer',
      resourceIds: ['eu-espr-cbam', 'oekotex-gots', 'unido-tigara'],
      domainFocusEn:
        'EU ESPR Digital Product Passport serialization, Scope 1 & 2 carbon accounting, and international trade compliance',
      domainFocusAr:
        'إصدار جواز المنتج الرقمي الأوروبي DPP، حساب انبعاثات النطاق ١ و ٢، والتوافق مع لوائح التصدير للاتحاد الأوروبي',
      keyMetrics: ['Scope 1+2 kg CO2e/kg', 'GS1 Digital Link QR', '100% Bale-to-Lot Traceability', 'EU ESPR 2024/1781'],
      equipmentEn:
        'Smart sub-metering (kWh/steam/gas), ERP lot genealogy modules, and cryptographic DPP QR generators',
      equipmentAr:
        'عدادات الطاقة والبخار الذكية، نظام تتبع الدفعات في ERP، ومنصة إصدار رموز QR لجواز المنتج الرقمي',
    };
  }

  if (
    /erp|mes|iot|sensor|digital|ai|software|automation|plc|scada|cad|cam|data|رقمي|برمج|أتمتة|حساس|ذكاء/.test(
      q
    )
  ) {
    return {
      category: 'DIGITAL',
      targetRole: 'Operations & Plant Manager',
      resourceIds: ['unido-tigara', 'eu-espr-cbam', 'iso-astm-lab'],
      domainFocusEn:
        'Shop-floor PLC/IoT telemetry, real-time OEE dashboards, digital barcode batch cards, and ERP-to-machinery integration',
      domainFocusAr:
        'ربط حساسات الماكينات، لوحات متابعة OEE الفورية، بطاقات التشغيل بالباركود، وتكامل أنظمة ERP و MES',
      keyMetrics: ['100% Barcode Lot Tracking', 'Latency < 2s Telemetry', 'OEE ≥ 84%', 'Zero Manual Transcription'],
      equipmentEn:
        'Loom pick/stop IoT gateways, industrial barcode/RFID scanners, CAD/CAM marker systems, and cloud ERP/MES',
      equipmentAr:
        'بوابات إنترنت الأشياء للأنوال، قارئات الباركود و RFID الصناعية، أنظمة التصميم والتعشيق CAD/CAM، ونظام ERP',
    };
  }

  if (
    /iso|astm|lab|test|quality|gsm|tensile|pilling|shade|spectrophotometer|defect|4-point|جودة|معمل|اختبار|فحص|عيوب|لون/.test(
      q
    )
  ) {
    return {
      category: 'QUALITY',
      targetRole: 'Quality Assurance & Lab Engineer',
      resourceIds: ['iso-astm-lab', 'oekotex-gots', 'ilo-cotton-egypt'],
      domainFocusEn:
        'ISO 17025 physical and colorfastness testing, ASTM 4-point fabric inspection, and spectrophotometer shade sorting',
      domainFocusAr:
        'اختبارات الجودة الفيزيائية وثبات الألوان ISO 17025، نظام الفحص ذو الـ ٤ نقاط، والفرز اللوني بالاسبكتروميتر',
      keyMetrics: ['20±2°C & 65±4% RH', 'ASTM ≤ 20 pts/100 yd²', 'ΔE CMC(2:1) ≤ 0.8', 'ISO 105 Grade ≥ 4'],
      equipmentEn:
        'CRE tensile testers, Martindale abrasion/pilling units, D65/TL84 spectro-cabinets, and lighted inspection tables',
      equipmentAr:
        'أجهزة اختبار الشد، أجهزة مارتنديل للاحتكاك والتوبير، كبائن الإضاءة القياسية D65، وماكينات الفحص الضوئي',
    };
  }

  if (
    /safe|ilo|dust|noise|ppe|guard|fire|ergonom|health|osh|worker|سلامة|غبار|ضوضاء|وقاية|حريق|صحة/.test(
      q
    )
  ) {
    return {
      category: 'SAFETY',
      targetRole: 'Operations & Plant Manager',
      resourceIds: ['ilo-cotton-egypt', 'zdhc-mrsl', 'unido-tigara'],
      domainFocusEn:
        'ILO occupational health & safety, cotton dust HVAC filtration, lockout/tagout (LOTO) machine guarding, and chemical PPE',
      domainFocusAr:
        'معايير منظمة العمل الدولية للسلامة المهنية، فلاتر غبار القطن، تأمين الماكينات LOTO، ومهمات الوقاية الشخصية',
      keyMetrics: ['Dust < 0.2 mg/m³', '100% LOTO Interlocks', 'Noise < 85 dB(A) PPE', 'Zero Lost-Time Injury'],
      equipmentEn:
        'Rotary drum HVAC dust filters, optical safety interlocks, emergency eyewash stations, and gravimetric air samplers',
      equipmentAr:
        'فلاتر شفط غبار القطن المركزية، الحساسات الضوئية لحماية الماكينات، محطات غسيل الأعين، وأجهزة قياس جودة الهواء',
    };
  }

  if (
    /lean|5s|smed|oee|kaizen|cost|sam|line balanc|management|supervis|supply chain|procurement|رشيق|إدارة|تكاليف|توازن|صيانة/.test(
      q
    )
  ) {
    return {
      category: 'MANAGEMENT',
      targetRole: 'Operations & Plant Manager',
      resourceIds: ['unido-tigara', 'iso-astm-lab', 'ilo-cotton-egypt'],
      domainFocusEn:
        'Lean textile manufacturing, SMED rapid changeover, Standard Allowed Minute (SAM) line balancing, and Total Productive Maintenance (TPM)',
      domainFocusAr:
        'التصنيع الرشيق في النسيج والملابس، تقليل زمن التجهيز SMED، توازن خطوط الإنتاج SAM، والصيانة الإنتاجية الشاملة TPM',
      keyMetrics: ['OEE ≥ 82%', 'SMED -45% Changeover', 'Line Efficiency ≥ 85%', 'DHU < 1.8%'],
      equipmentEn:
        'Andon visual management boards, SMED quick-release warp carts, digital stopwatch/SAM trackers, and TPM checklists',
      equipmentAr:
        'لوحات الإدارة المرئية Andon، عربات التغيير السريع للمطاوي SMED، أنظمة قياس الزمن القياسي SAM، وجداول الصيانة الوقائية',
    };
  }

  // Default: TECHNICAL (Spinning, Weaving, Knitting, Jacquard, Towels, Garments, etc.)
  return {
    category: 'TECHNICAL',
    targetRole: 'Spinning & Weaving Floor Engineer',
    resourceIds: ['unido-tigara', 'iso-astm-lab', 'ilo-cotton-egypt'],
    domainFocusEn:
      'High-speed textile machinery setup, yarn/fabric tension & geometry control, defect root-cause elimination, and OEE mastery',
    domainFocusAr:
      'ضبط ومعايرة ماكينات الغزل والنسيج والتريكو، التحكم في الشد والتركيب النسجي، منع العيوب من المنبع، ورفع كفاءة الخطوط',
    keyMetrics: ['Yarn/Loom Stops -35%', 'Mill RH 65–72%', 'First-Quality ≥ 98.2%', 'OEE ≥ 85%'],
    equipmentEn:
      'High-speed ring/compact spinning frames, air-jet & rapier looms, circular knitting machines, and electronic tension sensors',
    equipmentAr:
      'ماكينات الغزل الحلقي والمدمج، أنوال الهواء والرابيير، ماكينات التريكو الدائري، وحساسات الشد الإلكترونية',
  };
}

const METADATA_MARKER = '<!-- MAHALLA_MULTIMEDIA_META:';

export function embedMultimediaMeta(markdown: string, meta: LessonMultimediaMeta): string {
  const clean = markdown.split(METADATA_MARKER)[0].trim();
  return `${clean}\n\n${METADATA_MARKER}${JSON.stringify(meta)} -->`;
}

export function extractMultimediaMeta(
  rawContent: string,
  lessonPosition: number,
  courseCategory: string,
  lessonTitle: string,
  lessonTitleAr?: string | null
): { cleanMarkdown: string; meta: LessonMultimediaMeta } {
  const idx = rawContent.indexOf(METADATA_MARKER);
  if (idx !== -1) {
    const cleanMarkdown = rawContent.slice(0, idx).trim();
    const jsonPart = rawContent
      .slice(idx + METADATA_MARKER.length)
      .replace(/-->$/, '')
      .trim();
    try {
      const parsed = JSON.parse(jsonPart) as LessonMultimediaMeta;
      return { cleanMarkdown, meta: parsed };
    } catch {
      // Fall through to synthesized metadata
    }
  }

  // Synthesize rich multimedia metadata for existing lessons so ALL courses have full multimedia!
  const levelTier: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' =
    lessonPosition <= 1 ? 'BEGINNER' : lessonPosition === 2 ? 'INTERMEDIATE' : 'ADVANCED';

  const matchingRefs = TRUSTED_AUTHORIZED_RESOURCES.filter((r) =>
    r.categories.includes(courseCategory)
  );
  const authorizedRefs =
    matchingRefs.length >= 2 ? matchingRefs : TRUSTED_AUTHORIZED_RESOURCES.slice(0, 3);

  const meta: LessonMultimediaMeta = {
    levelTier,
    videoDurationSec: 420 + lessonPosition * 120,
    slides: [
      {
        title: `${levelTier} Foundation: ${lessonTitle}`,
        titleAr: `المستوى ${
          levelTier === 'BEGINNER'
            ? 'المبتدئ'
            : levelTier === 'INTERMEDIATE'
            ? 'المتوسط'
            : 'المتقدم'
        }: ${lessonTitleAr || lessonTitle}`,
        bulletPoints: [
          'International benchmark alignment for El Mahalla El Kubra textile mills',
          'Root-cause diagnostics and real-time shop-floor KPI tracking',
          'Compliance verification against UNIDO, ISO, and EU export protocols',
        ],
        bulletPointsAr: [
          'مواءمة المعايير الدولية لمصانع الغزل والنسيج بالمحلة الكبرى',
          'تشخيص الأسباب الجذرية وتتبع مؤشرات الأداء الفورية بصالة الإنتاج',
          'التحقق من التوافق مع بروتوكولات اليونيدو والأيزو والتصدير الأوروبي',
        ],
        kpiHighlight:
          levelTier === 'BEGINNER'
            ? 'Baseline Assessment & Standard Definitions'
            : levelTier === 'INTERMEDIATE'
            ? '-32% Defect Rate & +18% Line OEE'
            : '100% Third-Party Audit & Certification Readiness',
      },
      {
        title: 'Shop-Floor Execution & Parameter Control',
        titleAr: 'التنفيذ العملي وضبط معايير التشغيل',
        bulletPoints: [
          'Standardize machine settings across morning, afternoon, and night shifts',
          'Log batch-level metrics for Digital Product Passport (DPP) traceability',
          'Execute preventive quality gates before downstream processing',
        ],
        bulletPointsAr: [
          'توحيد إعدادات الماكينات عبر الورديات الصباحية والمسائية',
          'تسجيل بيانات التشغيلة لربطها بجواز المنتج الرقمي DPP',
          'تطبيق بوابات الفحص الوقائي قبل انتقال القماش للمرحلة التالية',
        ],
        kpiHighlight: 'Right-First-Time (RFT) Target ≥ 96.5%',
      },
      {
        title: 'Audit Verification & Continuous Improvement',
        titleAr: 'التدقيق المعتمد والتحسين المستمر',
        bulletPoints: [
          'Cross-check records against authorized ISO / ZDHC / OEKO-TEX checklists',
          'Review corrective and preventive actions (CAPA) with shift engineers',
          'Lock in verified gains for cluster benchmarking and export readiness',
        ],
        bulletPointsAr: [
          'مطابقة السجلات مع قوائم الفحص المعتمدة للأيزو و ZDHC والأيكوتكس',
          'مراجعة الإجراءات التصحيحية والوقائية مع مهندسي الوردية',
          'تثبيت التحسينات لرفع تصنيف المصنع في مرصد التجمع والتصدير',
        ],
        kpiHighlight: 'Verified Cluster Credential Milestone',
      },
    ],
    audioSummaryEn: `Welcome to Module ${lessonPosition}: ${lessonTitle}. This ${levelTier.toLowerCase()}-level briefing is grounded in ${authorizedRefs
      .map((r) => r.standardCode)
      .join(
        ' and '
      )}. Focus on measuring baseline shop-floor indicators, standardizing shift SOPs, and documenting batch compliance for international buyers.`,
    audioSummaryAr: `مرحباً بكم في الوحدة ${lessonPosition}: ${
      lessonTitleAr || lessonTitle
    }. هذا الملخص الصوتي مصمم للمستوى ${
      levelTier === 'BEGINNER' ? 'المبتدئ' : levelTier === 'INTERMEDIATE' ? 'المتوسط' : 'المتقدم'
    } استناداً إلى معايير ${authorizedRefs
      .map((r) => r.standardCode)
      .join(
        ' و '
      )}. ركز على قياس مؤشرات الأداء وتوحيد إجراءات التشغيل القياسية وتوثيق الجودة للتصدير.`,
    processSteps: [
      {
        step: '1. Baseline Diagnostic & Sensor/Log Capture',
        stepAr: '١. التشخيص الأساسي وتسجيل قراءات الخط',
        metric: 'Shift Hour 0',
      },
      {
        step: '2. Parameter Calibration & Authorized Standard Check',
        stepAr: '٢. معايرة الماكينات ومطابقة المواصفة المعتمدة',
        metric: '±1.5% Tolerance',
      },
      {
        step: '3. In-Line Quality Gate & Lab Verification',
        stepAr: '٣. بوابة الفحص المرحلي والتحقق المعملي',
        metric: 'RFT ≥ 96%',
      },
      {
        step: '4. Digital Batch Sign-Off & DPP Archiving',
        stepAr: '٤. الاعتماد الرقمي للتشغيلة وأرشفة جواز المنتج',
        metric: '100% Traceable',
      },
    ],
    sopChecklist: [
      {
        item: 'Verify calibration of instruments, tensioners, or dosing pumps before shift start',
        itemAr: 'التحقق من معايرة أجهزة القياس والشدادات ومضخات الحقن قبل بدء الوردية',
      },
      {
        item: 'Confirm raw material / yarn / chemical batch certificates against authorized standard',
        itemAr: 'مطابقة شهادات دفعات الغزل أو الكيماويات مع المواصفات القياسية المعتمدة',
      },
      {
        item: 'Record middle-of-lot inspection metrics on the digital batch card',
        itemAr: 'تسجيل قراءات الفحص النصفي للتشغيلة في بطاقة المتابعة الرقمية',
      },
      {
        item: 'Complete supervisor sign-off and archive compliance evidence for audit',
        itemAr: 'اعتماد مشرف الوردية وأرشفة مستندات التوافق للتدقيق الخارجي',
      },
    ],
    authorizedRefs,
    quiz: [
      {
        question: `In ${lessonTitle}, what is the primary operational benefit of enforcing ${
          authorizedRefs[0]?.standardCode || 'ISO/UNIDO'
        } protocols on the shop floor?`,
        questionAr: `في ${
          lessonTitleAr || lessonTitle
        }، ما هي الفائدة التشغيلية الرئيسية لتطبيق معايير ${
          authorizedRefs[0]?.standardCode || 'ISO/UNIDO'
        } داخل المصنع؟`,
        options: [
          'Higher Right-First-Time (RFT) yield, reduced rework waste, and verified export compliance',
          'Increasing manual paperwork without changing machine settings',
          'Bypassing laboratory testing before shipment',
          'Running machines above safe speed limits without maintenance',
        ],
        optionsAr: [
          'رفع نسبة الإنتاج السليم من أول مرة وتقليل الهدر وضمان التوافق التصديري الموثق',
          'زيادة الأعمال الورقية اليدوية دون ضبط إعدادات الماكينات',
          'تجاوز اختبارات المعمل قبل الشحن',
          'تشغيل الماكينات فوق السرعات الآمنة دون صيانة وقائية',
        ],
        correctIndex: 0,
        explanation:
          'Authorized international standards systematically eliminate process variation, lowering cost per kg/meter while providing auditable proof for EU and regional buyers.',
        explanationAr:
          'تعمل المعايير الدولية المعتمدة على القضاء على التفاوت في العمليات، مما يخفض التكلفة ويوفر إثباتاً موثقاً للمشترين الدوليين.',
      },
      {
        question:
          'How should a Mahalla factory transition from Beginner awareness to Advanced mastery in this competency?',
        questionAr:
          'كيف ينتقل مصنع بالمحلة من مستوى الوعي المبتدئ إلى الإتقان المتقدم في هذه المهارة؟',
        options: [
          'Combine foundational concepts with standardized shift SOPs, digital KPI tracking, and internal pre-audits',
          'Rely solely on verbal instructions during shift handover',
          'Wait until a buyer rejects a shipment before checking parameters',
          'Keep quality data isolated from production supervisors',
        ],
        optionsAr: [
          'الجمع بين المفاهيم الأساسية وإجراءات التشغيل القياسية وتتبع المؤشرات الرقمية والتدقيق الداخلي',
          'الاعتماد فقط على التعليمات الشفهية عند تسليم الوردية',
          'الانتظار حتى يرفض المشتري الشحنة قبل مراجعة المعايير',
          'عزل بيانات الجودة عن مشرفي الإنتاج',
        ],
        correctIndex: 0,
        explanation:
          'True industrial mastery moves from Beginner awareness to Intermediate SOP execution and finally Advanced predictive optimization and audit readiness.',
        explanationAr:
          'يتحقق الإتقان الصناعي بالانتقال من الفهم الأساسي إلى تطبيق إجراءات التشغيل القياسية ثم التحسين الاستباقي والجاهزية للتدقيق.',
      },
    ],
  };

  return { cleanMarkdown: rawContent, meta };
}
