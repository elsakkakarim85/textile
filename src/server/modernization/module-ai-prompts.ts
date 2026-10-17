export type ClusterModuleId =
  | 'procurement'
  | 'capacity'
  | 'consortia'
  | 'facilities'
  | 'maturity'
  | 'academy'
  | 'brand-studio'
  | 'export-intelligence'
  | 'sustainability'
  | 'funding'
  | 'forum'
  | 'events'
  | 'experts'
  | 'announcements'
  | 'observatory'
  | 'marketplaces'
  | 'recruitment'
  | 'factories';

export type ClientFreeLlmModelId =
  | 'auto'
  | 'llama-3.3-70b'
  | 'deepseek-r1'
  | 'mistral'
  | 'qwen-2.5-72b'
  | 'openai-free'
  | 'gemini-2.5-flash';

export const CLIENT_FREE_LLM_MODELS: {
  id: ClientFreeLlmModelId;
  labelEn: string;
  labelAr: string;
  badge: string;
}[] = [
  {
    id: 'auto',
    labelEn: 'Auto Best Free LLM (Smart Cascade)',
    labelAr: 'التوجيه الذكي لأفضل نموذج مجاني (تلقائي)',
    badge: 'Multi-LLM Router',
  },
  {
    id: 'llama-3.3-70b',
    labelEn: 'Meta Llama 3.3 70B Instruct (Free)',
    labelAr: 'ميتا لاما Llama 3.3 70B (مجاني)',
    badge: 'Llama 3.3 70B',
  },
  {
    id: 'deepseek-r1',
    labelEn: 'DeepSeek V3 / R1 Reasoning (Free)',
    labelAr: 'ديب سيك DeepSeek R1 للتحليل العميق (مجاني)',
    badge: 'DeepSeek R1',
  },
  {
    id: 'mistral',
    labelEn: 'Mistral Large / Small 3 EU (Free)',
    labelAr: 'ميسترال الأوروبي Mistral (مجاني)',
    badge: 'Mistral AI',
  },
  {
    id: 'qwen-2.5-72b',
    labelEn: 'Qwen 2.5 72B Industrial & Math (Free)',
    labelAr: 'كوين Qwen 2.5 72B للحسابات الهندسية (مجاني)',
    badge: 'Qwen 2.5 72B',
  },
  {
    id: 'openai-free',
    labelEn: 'GPT-4o-Mini Free Gateway',
    labelAr: 'نموذج GPT-4o-Mini السريع (مجاني)',
    badge: 'GPT-4o-Mini Free',
  },
  {
    id: 'gemini-2.5-flash',
    labelEn: 'Google Gemini 2.5 Flash (Free Tier)',
    labelAr: 'جوجل جيميناي Gemini 2.5 Flash',
    badge: 'Gemini 2.5 Flash',
  },
];

export interface ModuleAiConfig {
  moduleId: ClusterModuleId;
  badgeEn: string;
  badgeAr: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  systemPrompt: string;
  quickActions: {
    id: string;
    labelEn: string;
    labelAr: string;
    promptEn: string;
    promptAr: string;
  }[];
}

export const MODULE_AI_CONFIGS: Record<ClusterModuleId, ModuleAiConfig> = {
  procurement: {
    moduleId: 'procurement',
    badgeEn: 'AI Joint Procurement & Contract Strategist',
    badgeAr: 'مستشار الشراء المشترك والتفاوض التعاقدي الذكي',
    titleEn: 'AI Collective Bargaining, Tiered Pricing & Supplier Contract Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي للتفاوض الجماعي وشرائح الأسعار وعقود الموردين',
    subtitleEn:
      'Use free LLMs to calculate bulk EOQ volume discounts, draft tiered supplier RFQ contracts, and enforce ISO/Uster yarn & ZDHC dye quality penalty clauses.',
    subtitleAr:
      'استخدم نماذج الذكاء الاصطناعي المجانية لحساب خصومات الكميات، وصياغة عقود التوريد المجمع، وشروط الجزاءات الفنية لجودة الغزول (Uster) والصبغات (ZDHC).',
    systemPrompt:
      'You are the Chief Industrial Procurement & Supply Chain Strategist for the El-Mahalla El-Kubra Textile Cluster. Provide mathematical volume-tier discount tables, Economic Order Quantity (EOQ) formulas, Uster Statistics 5% yarn quality acceptance clauses, ZDHC Level 3 dye specs, and ready-to-sign supplier contract clauses.',
    quickActions: [
      {
        id: 'tier-neg',
        labelEn: 'Draft Tiered Supplier Negotiation Memo',
        labelAr: 'صياغة مذكرة تفاوض شرائح الأسعار مع الموردين',
        promptEn:
          'Draft an executive collective-bargaining negotiation memo for a 45-ton Giza 86 Ne 30/1 combed cotton yarn pool across 8 El-Mahalla SMEs, including 3 volume discount tiers, Uster CVm% ≤ 11.8% quality acceptance criteria, and L/C payment milestones.',
        promptAr:
          'قم بصياغة مذكرة تفاوض جماعي لشراء ٤٥ طن غزل قطن جيزة ٨٦ ممشط Ne 30/1 لصالح ٨ مصانع بالمحلة الكبرى، تتضمن ٣ شرائح خصم للكميات، وشروط قبول الجودة Uster CVm% ≤ 11.8%، وجدول دفعات الاعتماد المستندي.',
      },
      {
        id: 'dye-rfq',
        labelEn: 'ZDHC Reactive Dyes Technical RFQ Spec',
        labelAr: 'كراسة مواصفات فنية لشراء صبغات تفاعلية ZDHC',
        promptEn:
          'Generate a technical RFQ specification for bulk procurement of 12 tons of high-exhaustion bifunctional reactive dyes & salt-free auxiliaries compliant with ZDHC MRSL v3.1 Level 3 and OEKO-TEX Standard 100 Class I.',
        promptAr:
          'ولّد كراسة مواصفات فنية (RFQ) لشراء ١٢ طن من الصبغات التفاعلية ثنائية المجموعة والمواد المساعدة المتوافقة مع ZDHC MRSL v3.1 Level 3 و OEKO-TEX Standard 100.',
      },
      {
        id: 'penalty-sla',
        labelEn: 'Quality & Late-Delivery Penalty Clauses',
        labelAr: 'بنود غرامات التأخير ومطابقة المواصفات المعمليّة',
        promptEn:
          'Write legally robust bilingual contract clauses covering batch-to-batch shade/count variance tolerance, ISO 17025 lab rejection remedies, and liquidated damages for late yarn/chemical delivery.',
        promptAr:
          'اكتب بنوداً تعاقدية قانونية وفنية تغطي حدود التفاوت المسموح به بين اللوطات، وإجراءات الرفض المعملي وفق ISO 17025، وغرامات التأخير في التوريد.',
      },
      {
        id: 'solar-ppa',
        labelEn: 'Cluster Solar PPA Cost-Sharing Model',
        labelAr: 'نموذج تقاسم تكلفة ووفورات الطاقة الشمسية المشتركة',
        promptEn:
          'Build a financial cost-and-savings allocation table for 10 cluster mills co-contracting a 2.5 MW rooftop solar PPA to cut kWh costs by 22% and lower EU CBAM Scope 2 emissions.',
        promptAr:
          'صمم جدولاً مالياً لتوزيع التكاليف والوفورات لعشرة مصانع تشترك في اتفاقية شراء طاقة شمسية (Solar PPA) بقدرة ٢.٥ ميجاوات لخفض تكلفة الكهرباء بنسبة ٢٢٪ وتقليل انبعاثات النطاق الثاني CBAM.',
      },
    ],
  },
  capacity: {
    moduleId: 'capacity',
    badgeEn: 'AI Line-Balancing & Subcontracting Optimizer',
    badgeAr: 'مهندس توازن الخطوط والتشغيل لدى الغير بالذكاء الاصطناعي',
    titleEn: 'AI Subcontracting Costing, OEE & Technical SLA Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لتسعير التشغيل للغير وكفاءة الماكينات OEE واتفاقيات الجودة',
    subtitleEn:
      'Calculate fair machine-hour rates for spinning, weaving, knitting, dyeing & sewing, optimize changeover times, and draft subcontracting SLAs.',
    subtitleAr:
      'احسب التكلفة العادلة لساعة تشغيل الماكينات (غزل، نسيج، تريكو، صباغة، خياطة)، وقلل أزمنة التجهيز، وصغ عقود التشغيل لدى الغير.',
    systemPrompt:
      'You are a Senior Industrial Production Engineer & Subcontracting Specialist in El-Mahalla El-Kubra. Provide exact machine-hour costing breakdowns, SMED changeover reductions, yarn/fabric wastage allowances, and ASTM 4-Point defect SLA contracts.',
    quickActions: [
      {
        id: 'hour-cost',
        labelEn: 'Calculate Fair Machine-Hour & KG Rate',
        labelAr: 'حساب التكلفة العادلة لساعة الماكينة أو الكيلوجرام',
        promptEn:
          'Calculate a transparent subcontracting cost breakdown per kg and per machine-hour for 24-gg circular knitting and low-liquor-ratio jet dyeing in El-Mahalla, including power, steam, labor, depreciation, and 15% fair margin.',
        promptAr:
          'احسب تفصيل تكلفة التشغيل للغير لكل كيلوجرام ولكل ساعة ماكينة لماكينات التريكو الدائري ٢٤ جوج وماكينات الصباغة الجيت منخفضة نسبة الحمام في المحلة الكبرى شاملاً الطاقة والبخار والعمالة والإهلاك وهامش ربح ١٥٪.',
      },
      {
        id: 'sub-sla',
        labelEn: 'Draft Subcontracting Quality & Wastage SLA',
        labelAr: 'صياغة عقد تشغيل للغير مع نسب الهالك المسموحة',
        promptEn:
          'Draft a technical subcontracting SLA between two Mahalla mills defining maximum allowable process wastage (spinning/weaving/dyeing shrinkage), ASTM D5430 4-Point inspection limits (≤ 20 points/100 sq.yd), and rework liability.',
        promptAr:
          'صغ اتفاقية مستوى خدمة (SLA) للتشغيل لدى الغير بين مصنعين بالمحلة تحدد الحد الأقصى للهالك المسموح به، ونظام الفحص الرباعي ASTM D5430، ومسؤولية إعادة التشغيل عند العيوب.',
      },
      {
        id: 'smed-oee',
        labelEn: 'SMED Loom/Dye-Jet Changeover Optimization',
        labelAr: 'خطة SMED لتقليل وقت تغيير اللوطات ورفع OEE',
        promptEn:
          'Create a step-by-step SMED (Single-Minute Exchange of Die) checklist to cut air-jet loom warp beam changeovers and dyeing machine shade-to-shade washdowns by 40%, boosting OEE above 82%.',
        promptAr:
          'أنشئ قائمة مرجعية بمنهجية SMED لخفض زمن تغيير المطاوي في أنوال الهواء وزمن غسيل ماكينات الصباغة بين الألوان بنسبة ٤٠٪ لرفع الكفاءة الكلية OEE فوق ٨٢٪.',
      },
      {
        id: 'line-balance',
        labelEn: 'Apparel Sewing Line Balancing & SAM Plan',
        labelAr: 'موازنة خطوط الخياطة وحساب الزمن القياسي SAM',
        promptEn:
          'Design a balanced 32-operator sewing line layout with Standard Allowed Minutes (SAM), bottleneck elimination, and hourly target output for an export order of 15,000 knitted polo shirts.',
        promptAr:
          'صمم خطة موازنة خط خياطة مكون من ٣٢ مشغلاً مع حساب الزمن القياسي للدقيقة (SAM) ومعالجة نقاط الاختناق والإنتاجية الساعية لطلبية تصدير ١٥,٠٠٠ تيشيرت بولو.',
      },
    ],
  },
  consortia: {
    moduleId: 'consortia',
    badgeEn: 'AI Export Consortium & JV Architect',
    badgeAr: 'مهندس التحالفات التصديرية وتوزيع الحصص الذكي',
    titleEn: 'AI Multi-Factory Value-Chain Allocation & Consortium MoU Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لتوزيع الحصص الإنتاجية وصياغة اتفاقيات التحالف التصديري',
    subtitleEn:
      'Allocate large export orders across spinning, weaving, dyeing, and CMT mills, calculate revenue splits, and draft legally structured Consortium MoUs.',
    subtitleAr:
      'وزّع الطلبيات التصديرية الكبرى عبر مصانع الغزل والنسيج والصباغة والتفصيل، واحسب نسب الإيرادات، وصغ بروتوكول التحالف القانوني.',
    systemPrompt:
      'You are an UNIDO Industrial Cluster Consortium Advisor specializing in multi-SME export alliances in El-Mahalla El-Kubra. Provide value-chain capacity allocation tables, transfer-pricing formulas, joint L/C banking structures, and formal Consortium MoU drafts.',
    quickActions: [
      {
        id: 'consortium-mou',
        labelEn: 'Draft Multi-Factory Export Consortium MoU',
        labelAr: 'صياغة اتفاقية تحالف تصديري (MoU) بين المصانع',
        promptEn:
          'Draft a comprehensive bilingual Export Consortium Memorandum of Understanding (MoU) among 4 El-Mahalla SMEs (Spinning, Weaving, Dyeing/Finishing, Sewing/Packaging) bidding jointly on a €420,000 European hotel linen contract.',
        promptAr:
          'قم بصياغة مذكرة تفاهم وعقد تحالف تصديري متكامل بين ٤ مصانع بالمحلة الكبرى (غزل، نسيج، صباغة وتجهيز، تفصيل وتعبئة) للتقدم المشترك لمناقصة مفروشات فنادق أوروبية بقيمة ٤٢٠,٠٠٠ يورو.',
      },
      {
        id: 'revenue-split',
        labelEn: 'Value-Chain Margin & Transfer-Price Matrix',
        labelAr: 'مصفوفة تسعير التحويل وتوزيع الأرباح عبر سلسلة القيمة',
        promptEn:
          'Build a fair value-added cost and revenue-sharing matrix across Spinning (24%), Weaving (26%), Reactive Dyeing & Sateen Calendering (28%), and Cut-Make-Pack + Export Logistics (22%) for a joint consortium order.',
        promptAr:
          'ابنِ مصفوفة عادلة لتسعير المراحل وتوزيع الإيرادات وهوامش الربح عبر مراحل الغزل (٢٤٪)، النسيج (٢٦٪)، الصباغة والتجهيز (٢٨٪)، والتفصيل والتغليف والشحن (٢٢٪).',
      },
      {
        id: 'joint-qc',
        labelEn: 'Inter-Factory Handover Quality Gate Protocol',
        labelAr: 'بروتوكول استلام وفحص الجودة بين مصانع التحالف',
        promptEn:
          'Design a zero-dispute inter-factory quality handover protocol so each consortium member inspects and signs off on yarn cones, greige fabric rolls, dyed lots, and stitched cartons before transfer.',
        promptAr:
          'صمم بروتوكول استلام وفحص جودة بين مصانع التحالف يمنع النزاعات عند تسليم كونات الغزل وأتواب القماش الخام ولوطات الصباغة وكراتين المنتج النهائي.',
      },
      {
        id: 'back-to-back-lc',
        labelEn: 'Master L/C & Back-to-Back Banking Structure',
        labelAr: 'هيكلة الاعتماد المستندي المجمع (Master & Back-to-Back L/C)',
        promptEn:
          'Explain how the Lead Consortium Factory can structure a Master Irrevocable L/C from an EU buyer and issue domestic Back-to-Back L/Cs or escrow payouts to partner SMEs in Egypt.',
        promptAr:
          'اشرح خطوات هيكلة اعتماد مستندي رئيسي (Master L/C) باسم المصنع القائد للتحالف وإصدار اعتمادات داخلية فرعية (Back-to-Back L/C) لتمويل المصانع الشريكة.',
      },
    ],
  },
  facilities: {
    moduleId: 'facilities',
    badgeEn: 'AI ISO 17025 Lab & Shared Facility Advisor',
    badgeAr: 'المستشار الذكي لمعمل الاختبارات ISO 17025 والمرافق المشتركة',
    titleEn: 'AI Testing Protocol, CAD Marker Efficiency & Effluent Treatment Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لبروتوكولات الفحص المعملي وكفاءة الباترون CAD ومعالجة الصرف',
    subtitleEn:
      'Select exact ISO/ASTM/AATCC lab tests before booking the TIGARA Lab, optimize 3D CAD fabric utilization, and calculate ZLD wastewater dosing.',
    subtitleAr:
      'حدّد الاختبارات المعملية القياسية (ISO / ASTM) قبل حجز معمل تيجارا، وارفع كفاءة تعشيق الباترون CAD، واحسب جرعات معالجة الصرف الصناعي.',
    systemPrompt:
      'You are the Chief Laboratory Director (ISO/IEC 17025) and Shared Technical Facilities Manager for the TIGARA El-Mahalla Cluster Center. Provide exact ISO/ASTM test standards, acceptance thresholds, CAD marker nesting strategies, and ETP wastewater treatment calculations.',
    quickActions: [
      {
        id: 'iso-test-plan',
        labelEn: 'Build ISO/ASTM Lab Test Plan for Export Lot',
        labelAr: 'إعداد خطة فحص معملي ISO/ASTM لشحنة تصدير',
        promptEn:
          'Create a complete ISO/IEC 17025 physical and chemical laboratory test schedule (ISO 105-C06 wash fastness, ISO 105-X12 rubbing, ISO 13934-1 tensile, ISO 6330 shrinkage, ISO 14184-1 formaldehyde) with pass/fail limits and estimated lab hours.',
        promptAr:
          'أعد جدول اختبارات معملية متكاملاً وفق ISO/IEC 17025 (ثبات الغسيل ISO 105-C06، الاحتكاك ISO 105-X12، الشد ISO 13934-1، الانكماش ISO 6330، الفورمالديهايد ISO 14184-1) مع حدود القبول وعدد ساعات المعمل.',
      },
      {
        id: 'cad-nesting',
        labelEn: 'Optimize CAD/CAM Marker Fabric Efficiency',
        labelAr: 'رفع كفاءة تعشيق الباترون CAD وتقليل هالك القص',
        promptEn:
          'Provide an engineering guide for the Shared CAD Studio on increasing fabric marker efficiency from 79% to 87% using multi-size nesting, fabric width grouping, and selvedge tension control.',
        promptAr:
          'قدّم دليلاً هندسياً لاستوديو التصميم CAD المشترك لرفع كفاءة تعشيق الباترون من ٧٩٪ إلى ٨٧٪ عبر دمج المقاسات وتصنيف عروض الأتواب وتقليل هالك القص.',
      },
      {
        id: 'etp-zdhc',
        labelEn: 'Central Effluent Plant (CETP) ZDHC Compliance',
        labelAr: 'خطة مطابقة الصرف الصناعي لمعايير ZDHC بمحطة المعالجة',
        promptEn:
          'Analyze pre-treatment requirements for dyeing mills discharging into the Shared Central Effluent Treatment Plant (pH 6.5–8.5, COD < 400 mg/L, BOD < 150 mg/L, color Pt-Co, zero Azo/APEOs) under ZDHC Wastewater Guidelines v2.1.',
        promptAr:
          'حلّل متطلبات المعالجة الأولية لمصانع الصباغة قبل الصرف على المحطة المركزية المشتركة (pH، COD، BOD، إزالة اللون، خلو من APEOs) طبقاً لدليل مياه الصرف ZDHC v2.1.',
      },
      {
        id: 'lab-failure-rca',
        labelEn: 'Diagnose Failed Wet-Rubbing or Pilling Test',
        labelAr: 'تشخيص وعلاج فشل اختبار ثبات الاحتكاك الرطب أو الوبرة',
        promptEn:
          'A reactive-dyed dark navy cotton sateen lot scored Grade 2.0 on ISO 105-X12 wet rubbing and Grade 2.5 on ISO 12945-2 Martindale pilling. Diagnose the root causes and prescribe the exact re-soaping/enzyme/finishing fix.',
        promptAr:
          'حصل لوط ساتان قطني مصبوغ بلون كحلي غامق على درجة 2.0 في اختبار الاحتكاك الرطب ISO 105-X12 ودرجة 2.5 في اختبار الوبرة ISO 12945-2. شخّص الأسباب الجذرية واكتب وصفة المعالجة التصحيحية.',
      },
    ],
  },
  maturity: {
    moduleId: 'maturity',
    badgeEn: 'AI Chief Digital Officer & Industry 4.0 Architect',
    badgeAr: 'مستشار التحول الرقمي والصناعة 4.0 بالذكاء الاصطناعي',
    titleEn: 'AI Industry 4.0 Transformation, IoT Sensor & ERP/MES ROI Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لخارطة التحول الرقمي وحساب عائد استثمار ERP/MES وإنترنت الأشياء',
    subtitleEn:
      'Turn your Digital Maturity score into a budgeted 90-day ERP/MES implementation plan, loom IoT telemetry architecture, and EU DPP data pipeline.',
    subtitleAr:
      'حوّل نتيجة تقييم النضج الرقمي إلى خطة تنفيذية لمدة ٩٠ يوماً لربط الماكينات بإنترنت الأشياء وتطبيق نظام ERP/MES وحساب فترة استرداد التكلفة.',
    systemPrompt:
      'You are the Chief Digital Officer (CDO) and Industry 4.0 Systems Architect for El-Mahalla textile mills. Provide low-cost modular ERP/MES architectures, PLC/IoT sensor specs for looms and dyeing jiggers, payback period (ROI) tables, and EU DPP integration plans.',
    quickActions: [
      {
        id: '90day-i40',
        labelEn: 'Generate 90-Day Low-CAPEX Industry 4.0 Plan',
        labelAr: 'خطة تحول رقمي منخفضة التكلفة لمدة ٩٠ يوماً',
        promptEn:
          'Design a practical 90-day Industry 4.0 modernization roadmap for a 60-loom Mahalla SME with a $12,000 budget, covering barcode/QR batch tracking, open-source ERP inventory, real-time loom pick counters, and energy sub-metering.',
        promptAr:
          'صمم خارطة طريق عملية للتحول إلى الصناعة 4.0 خلال ٩٠ يوماً لمصنع نسيج بالمحلة يضم ٦٠ نولاً بميزانية ١٢,٠٠٠ دولار تشمل تتبع اللوطات بالباركود، ونظام ERP للمخزون، وحساسات عداد الحدفة واستهلاك الطاقة.',
      },
      {
        id: 'iot-dyeing',
        labelEn: 'IoT Automation Spec for Dyeing & Stenter',
        labelAr: 'مواصفات حساسات IoT لماكينات الصباغة والرام (Stenter)',
        promptEn:
          'Specify an industrial IoT sensor and PLC telemetry architecture for jet dyeing machines and stenter frames to log temperature curves, pH, liquor ratio, exhaust humidity, and natural gas flow per batch.',
        promptAr:
          'حدّد البنية الهندسية لحساسات إنترنت الأشياء (IoT) وربط PLC لماكينات الصباغة الجيت والرام لتسجيل منحنيات الحرارة والأس الهيدروجيني والرطوبة واستهلاك الغاز الطبيعي لكل لوط.',
      },
      {
        id: 'erp-roi',
        labelEn: 'Calculate ERP/MES Payback & ROI Model',
        labelAr: 'حساب العائد على الاستثمار (ROI) وفترة الاسترداد لنظام MES',
        promptEn:
          'Build a 24-month cost-benefit and payback analysis showing how digital MES batch tracking reduces off-shade re-dyeing by 60%, cuts dead yarn inventory by 25%, and increases loom OEE by 9%.',
        promptAr:
          'ابنِ نموذج تحليل التكلفة والعائد لمدة ٢٤ شهراً يوضح كيف يخفض نظام تتبع الإنتاج الرقمي (MES) إعادة الصباغة بنسبة ٦٠٪، ويقلل رواكد الغزل بنسبة ٢٥٪، ويرفع كفاءة الأنوال بنسبة ٩٪.',
      },
      {
        id: 'dpp-schema',
        labelEn: 'EU ESPR Digital Product Passport Data Schema',
        labelAr: 'هيكل البيانات الإلزامي لجواز المنتج الرقمي الأوروبي DPP',
        promptEn:
          'Generate the exact JSON/QR data schema required by EU ESPR Regulation 2024/1781 for Egyptian cotton textiles, mapping bale origin, spinning lot, dye house ZDHC ID, Scope 1+2 CO2e per kg, and recyclability score.',
        promptAr:
          'ولّد هيكل البيانات التقني (Data Schema) المطلوب بموجب لائحة الاتحاد الأوروبي ESPR 2024/1781 لجواز المنتج الرقمي للمنسوجات القطنية المصرية شاملاً منشأ البالة والغزل والصباغة والبصمة الكربونية.',
      },
    ],
  },
  academy: {
    moduleId: 'academy',
    badgeEn: 'AI Socratic Textile Professor & SOP Studio',
    badgeAr: 'الأستاذ التقني الذكي ومنشئ إجراءات التشغيل القياسية SOP',
    titleEn: 'AI Technical Tutor, Shop-Floor SOP Writer & Competency Examiner',
    titleAr: 'المعلم التقني الذكي ومؤلف إجراءات التشغيل القياسية (SOP) واختبارات الكفاءة',
    subtitleEn:
      'Ask deep textile engineering questions, convert complex standards into laminated shop-floor SOP cards, or generate oral/written technician exams.',
    subtitleAr:
      'اطرح أي سؤال هندسي في الغزل أو النسيج أو الصباغة، أو حوّل المواصفات الدولية إلى بطاقات تشغيل مبسطة للعمال، أو ولّد اختبارات تقييم فنية.',
    systemPrompt:
      'You are the Dean of the El-Mahalla Industrial Cluster Academy and UNIDO Senior Textile Vocational Trainer. Explain complex textile chemistry and mechanical formulas clearly, write bilingual shop-floor Standard Operating Procedures (SOPs), and generate practical competency quizzes.',
    quickActions: [
      {
        id: 'shopfloor-sop',
        labelEn: 'Write Laminated 1-Page Machine Operator SOP',
        labelAr: 'كتابة بطاقة تشغيل قياسية (SOP) مبسطة لعامل الماكينة',
        promptEn:
          'Write a clear, bilingual 1-page Standard Operating Procedure (SOP) card to be laminated and hung on a reactive jet-dyeing machine covering pre-start checks, salt/alkali dosing curve, shade check gate, and emergency stop.',
        promptAr:
          'اكتب بطاقة إجراءات تشغيل قياسية (SOP) واضحة وموجزة من صفحة واحدة لتعليقها على ماكينة الصباغة الجيت تشمل فحص ما قبل التشغيل، منحنى إضافة الملح والقلوي، فحص مطابقة اللون، وإجراءات الطوارئ.',
      },
      {
        id: 'defect-guide',
        labelEn: 'Visual Loom & Knitting Defect Troubleshooting Matrix',
        labelAr: 'جدول تشخيص وإصلاح عيوب النسيج والتريكو الميداني',
        promptEn:
          'Create a shop-floor troubleshooting table for the 8 most common weaving and circular knitting defects (broken picks, reed marks, barre, sinker lines, dropped stitches, oil spots) with immediate mechanical settings fixes.',
        promptAr:
          'أنشئ جدولاً ميدانياً لتشخيص وإصلاح أشهر ٨ عيوب في النسيج والتريكو الدائري (تقطيع اللحمة، علامات المشط، الباري، خطوط البلاتين، الغرز الساقطة، بقع الزيت) مع خطوات الضبط الميكانيكي الفوري.',
      },
      {
        id: 'tech-exam',
        labelEn: 'Generate 10-Question Shift Supervisor Competency Exam',
        labelAr: 'توليد اختبار كفاءة فنية (١٠ أسئلة) لمشرفي الورديات',
        promptEn:
          'Generate a 10-question technical competency assessment (with answer key and scoring rubric) for promoting a technician to Shift Quality Supervisor in spinning, weaving, and dyeing.',
        promptAr:
          'ولّد اختبار كفاءة فنية مكوناً من ١٠ أسئلة عملية (مع نموذج الإجابة ومعايير التقييم) لترقية الفنيين إلى منصب مشرف جودة وردية في الغزل والنسيج والصباغة.',
      },
      {
        id: 'math-formulas',
        labelEn: 'Essential Textile Mill Calculations Cheat-Sheet',
        labelAr: 'مرجع المعادلات الحسابية الأساسية لمهندسي المصانع',
        promptEn:
          'Compile an industrial textile engineering cheat-sheet with worked examples for English Cotton Count (Ne) ↔ Tex/Denier conversion, GSM from warp/weft ends & picks, Draft ratio, Twist Multiplier (TM), and Dye Liquor Ratio.',
        promptAr:
          'جمّع دليلاً مرجعياً بالمعادلات الحسابية الهندسية مع أمثلة محلولة لتحويل نمرة الغزل الإنجليزية (Ne) إلى تكس ودينير، وحساب وزن المتر المربع GSM، ونسبة السحب، ومعامل البرم، ونسبة الحمام في الصباغة.',
      },
    ],
  },
  'brand-studio': {
    moduleId: 'brand-studio',
    badgeEn: 'AI Multilingual Creative Director & Copywriter',
    badgeAr: 'المدير الإبداعي الذكي وكاتب الإعلانات متعدد اللغات',
    titleEn: 'AI International Fashion & Home-Textile Copywriting & Campaign Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لصياغة المحتوى الإعلاني العالمي وسيناريوهات الفيديو والمعارض',
    subtitleEn:
      'Generate luxury brand manifestos in English, Arabic, German, French & Italian, LinkedIn B2B ad hooks, and trade-show booth scripts.',
    subtitleAr:
      'ولّد قصص العلامات التجارية والنصوص التسويقية بالإنجليزية والعربية والألمانية والفرنسية والإيطالية، وإعلانات LinkedIn، وسيناريوهات المعارض.',
    systemPrompt:
      'You are an International Luxury Textile Creative Director (Milan, Paris, Frankfurt, Cairo) advising El-Mahalla manufacturers. Write evocative, high-converting brand copy, multilingual catalog descriptions, video commercial scripts, and B2B LinkedIn outreach sequences.',
    quickActions: [
      {
        id: 'multilingual-pitch',
        labelEn: 'Write Brand Story in EN / DE / FR / IT / AR',
        labelAr: 'كتابة قصة العلامة التجارية بـ ٥ لغات للكتالوج الدولي',
        promptEn:
          'Write a prestigious luxury brand story and hangtag manifesto for an El-Mahalla Giza 86 Egyptian Cotton collection in 5 languages: English, German (for Heimtextil), French (for Première Vision), Italian (for Milano Unica), and Arabic.',
        promptAr:
          'اكتب قصة علامة تجارية فاخرة ونص بطاقة المنتج (Hangtag) لمجموعة قطن جيزة ٨٦ من المحلة الكبرى بخمس لغات: العربية، الإنجليزية، الألمانية، الفرنسية، والإيطالية.',
      },
      {
        id: 'linkedin-ads',
        labelEn: '5 High-Converting LinkedIn B2B Ad Hooks',
        labelAr: '٥ إعلانات ممولة عالية التحويل على LinkedIn للمشترين',
        promptEn:
          'Create 5 high-converting LinkedIn B2B sponsored ad variations targeting European & GCC Retail Sourcing Directors, highlighting 0% EUR.1 duty, 6-day Mediterranean transit, and OEKO-TEX/GOTS traceability.',
        promptAr:
          'صمم ٥ نماذج إعلانية احترافية لمنصة LinkedIn تستهدف مديري المشتريات في أوروبا والخليج، تبرز الإعفاء الجمركي 0%، والشحن خلال ٦ أيام، وشهادات OEKO-TEX و GOTS.',
      },
      {
        id: 'swatch-box-kit',
        labelEn: 'Design Luxury Physical DHL Swatch-Box Experience',
        labelAr: 'تصميم تجربة صندوق العينات الفاخر (DHL Swatch Box)',
        promptEn:
          'Design the complete unboxing experience, technical swatch card layout, QR Digital Product Passport insert, and personalized cover letter for a VIP DHL Swatch Box sent to top hospitality & fashion buyers.',
        promptAr:
          'صمم تجربة فتح صندوق العينات الفاخر (VIP Swatch Box) المرسل عبر DHL للمشترين الدوليين، شاملة تخطيط بطاقات العينات الفنية، ورمز QR لجواز المنتج الرقمي، وخطاب الإهداء.',
      },
      {
        id: 'booth-script',
        labelEn: '60-Second Trade-Show Booth Elevator Pitch',
        labelAr: 'سيناريو عرض شفهي (٦٠ ثانية) لجذب زوار جناح المعرض',
        promptEn:
          'Write a persuasive 60-second booth conversation script and objection-handling playbook for sales engineers manning an El-Mahalla stand at Heimtextil Frankfurt.',
        promptAr:
          'اكتب سيناريو حوار بيعي مقنع مدته ٦٠ ثانية ودليل الرد على الأسئلة السريعة لمهندسي المبيعات في جناح مصانع المحلة بمعرض Heimtextil فرانكفورت.',
      },
    ],
  },
  'export-intelligence': {
    moduleId: 'export-intelligence',
    badgeEn: 'AI International Trade Economist & Customs Lawyer',
    badgeAr: 'الخبير الاقتصادي للتجارة الدولية والمستشار الجمركي الذكي',
    titleEn: 'AI Customs Origin Rules, Anti-Dumping Defense & Export Contract Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لقواعد المنشأ الجمركية وعقود التصدير الدولية والاعتمادات',
    subtitleEn:
      'Deep-dive into Pan-Euro-Med diagonal cumulation, QIZ 35% value-added math, Incoterms® 2020 risk transfer, and UCP 600 L/C clauses.',
    subtitleAr:
      'تحليل معمق لقواعد تراكم المنشأ الأورومتوسطي، وحسابات نسبة المكون المحلي باتفاقية الكويز، وشروط Incoterms® 2020، وضوابط الاعتمادات المستندية UCP 600.',
    systemPrompt:
      'You are a Senior International Trade Lawyer and WTO/ITC Customs Specialist advising Egyptian textile exporters. Provide exact HS code classifications, Pan-Euro-Med / QIZ / AfCFTA origin calculations, UCP 600 Letter of Credit wording, and NTM regulatory defense.',
    quickActions: [
      {
        id: 'origin-math',
        labelEn: 'Calculate Pan-Euro-Med & QIZ Rules of Origin',
        labelAr: 'حساب استيفاء قاعدة المنشأ (EUR.1 و QIZ) بالتفصيل',
        promptEn:
          'Provide a worked numerical calculation showing how an El-Mahalla mill satisfies both the Pan-Euro-Med "Double Transformation" rule (EUR.1 to EU/UK) and the US QIZ 35% minimum value-added rule.',
        promptAr:
          'قدّم مثالاً حسابياً تفصيلياً يوضح كيفية استيفاء مصنع بالمحلة لقاعدة التحول المزدوج لاتفاقية الشراكة الأوروبية (EUR.1) وقاعدة نسبة الـ ٣٥٪ قيمة مضافة لاتفاقية الكويز الأمريكية.',
      },
      {
        id: 'ucp600-lc',
        labelEn: 'Audit Letter of Credit (UCP 600) Discrepancy Risks',
        labelAr: 'فحص شروط الاعتماد المستندي UCP 600 لمنع التحفظات البنكية',
        promptEn:
          'List the 10 most dangerous Letter of Credit (MT700 under UCP 600) discrepancy traps that cause Egyptian textile exporters to lose payment or pay bank penalties, and provide the exact safe wording to request from the buyer.',
        promptAr:
          'اعرض أخطر ١٠ ثغرات وتحفظات في الاعتمادات المستندية (MT700 وفق UCP 600) قد تؤخر صرف مستحقات المصدر المصري، مع الصياغة الآمنة البديلة المطلوب إدراجها من المشتري.',
      },
      {
        id: ' exclusivity-contract',
        labelEn: 'Draft Country Distributor Contract with Minimum KPIs',
        labelAr: 'صياغة عقد وكيل أو موزع دولي مشروط بحد أدنى للمبيعات',
        promptEn:
          'Draft a protective International Distribution Agreement granting a foreign importer territorial exclusivity ONLY if they achieve quarterly minimum purchase volumes, with automatic termination on shortfall.',
        promptAr:
          'صغ عقد توزيع دولي يحمي المصنع المصري ويمنح المستورد الأجنبي وكالة/توزيعاً مشروطاً بتحقيق حد أدنى ربع سنوي من المسحوبات مع إلغاء الحصرية تلقائياً عند التقصير.',
      },
      {
        id: 'edf-rebate',
        labelEn: 'Maximize Egyptian Export Rebate (EDF) Claim',
        labelAr: 'دليل تعظيم استرداد المساندة التصديرية المصرية (صندوق دعم الصادرات)',
        promptEn:
          'Outline the step-by-step documentation and value-added multipliers required to maximize cash export rebates from the Egyptian Export Development Fund (EDF) for value-added dyed/finished textiles and branded apparel.',
        promptAr:
          'اشرح الخطوات والمستندات ومعاملات القيمة المضافة اللازمة لتعظيم نسبة المساندة التصديرية النقدية من صندوق تنمية الصادرات المصرية للمنسوجات المصبوغة والملابس ذات العلامة التجارية.',
      },
    ],
  },
  sustainability: {
    moduleId: 'sustainability',
    badgeEn: 'AI Carbon Auditor, EU CBAM & ZLD Water Engineer',
    badgeAr: 'مدقق الكربون الذكي ومهندس الاستدامة وتدوير المياه ZLD',
    titleEn: 'AI Scope 1 & 2 Decarbonization, ZLD Water Recycling & EU Green Deal Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لخفض الانبعاثات الكربونية وتدوير المياه ومتطلبات الصفقة الخضراء الأوروبية',
    subtitleEn:
      'Generate ISO 14064 carbon footprints, caustic recovery (mercerizing) ROI models, flue-gas heat recovery calculations, and EU ESG disclosures.',
    subtitleAr:
      'احسب البصمة الكربونية وفق ISO 14064، وجدوى استرجاع الصودا الكاوية والحرارة المفقودة في الغلايات، وصغ تقارير الاستدامة الأوروبية.',
    systemPrompt:
      'You are a Lead Environmental & Decarbonization Engineer (ISO 14064 / GHG Protocol / ZDHC / GOTS) for the El-Mahalla Textile Cluster. Provide exact engineering calculations for steam/heat recovery, solar integration, water recycling, and EU sustainability reporting.',
    quickActions: [
      {
        id: 'heat-recovery',
        labelEn: 'Dye-House Waste-Water & Stenter Heat Recovery ROI',
        labelAr: 'حساب جدوى استرجاع الحرارة المفقودة من مياه الصباغة والرام',
        promptEn:
          'Calculate the natural gas savings (m3/year), CO2e reduction (tons/year), and CAPEX payback months for installing a plate heat exchanger on 85°C dye-bath effluent and air-to-air heat recovery on a stenter frame.',
        promptAr:
          'احسب وفورات الغاز الطبيعي (متر مكعب/سنة)، وخفض انبعاثات ثاني أكسيد الكربون (طن/سنة)، وفترة استرداد رأس المال لتركيب مبادل حراري على مياه صرف الصباغة الساخنة (٨٥ مئوية) ومداخن ماكينة الرام.',
      },
      {
        id: 'caustic-zld',
        labelEn: 'Mercerizing Caustic Soda (NaOH) Recovery Plan',
        labelAr: 'دراسة استرجاع الصودا الكاوية من مرحلة المرسرة وتدوير المياه',
        promptEn:
          'Design a technical and financial feasibility brief for a membrane/evaporator Caustic Soda (NaOH) recovery unit in a Mahalla finishing mill, recovering 85% of NaOH and cutting effluent alkalinity.',
        promptAr:
          'صمم دراسة جدوى فنية ومالية لوحدة استرجاع الصودا الكاوية (NaOH) من غسيل المرسرة في مصنع تجهيز بالمحلة لاستعادة ٨٥٪ من الصودا وخفض قلوية الصرف الصناعي.',
      },
      {
        id: 'eu-esg-report',
        labelEn: 'Draft EU Buyer ESG & Carbon Footprint Declaration',
        labelAr: 'صياغة إقرار البصمة الكربونية والاستدامة للمشتري الأوروبي',
        promptEn:
          'Draft an official ISO 14064-aligned Product Carbon Footprint (PCF) and Water Stewardship declaration letter for a European retail buyer, reporting kg CO2e/kg textile and L water/kg.',
        promptAr:
          'قم بصياغة إقرار رسمي للبصمة الكربونية للمنتج (PCF وفق ISO 14064) وكفاءة استهلاك المياه لتقديمه للمشترين الأوروبيين يوضح نصيب الكيلوجرام من الانبعاثات والمياه.',
      },
      {
        id: 'gots-grs-audit',
        labelEn: '30-Day GOTS & GRS Certification Readiness Audit',
        labelAr: 'قائمة فحص الاستعداد لتفتيش شهادتي GOTS و GRS خلال ٣٠ يوماً',
        promptEn:
          'Create a comprehensive 30-day internal audit checklist to prepare a Mahalla spinning/weaving/dyeing mill for GOTS (Global Organic Textile Standard) and GRS (Global Recycled Standard) Transaction Certificate (TC) inspection.',
        promptAr:
          'أنشئ قائمة مراجعة داخلية شاملة لمدة ٣٠ يوماً لتجهيز مصنع غزل ونسيج وصباغة بالمحلة لاجتياز تفتيش شهادتي GOTS و GRS وإصدار شهادات المعاملات (TC).',
      },
    ],
  },
  funding: {
    moduleId: 'funding',
    badgeEn: 'AI Bankable Grant Writer & Financial Analyst',
    badgeAr: 'كاتب المنح البنكية والمحلل المالي الذكي (IRR/NPV)',
    titleEn: 'AI Grant Proposal Writer, EBRD/UNIDO/MSMEDA Feasibility & Financial Model Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لصياغة طلبات المنح ودراسات الجدوى البنكية (EBRD / UNIDO / MSMEDA)',
    subtitleEn:
      'Generate persuasive grant applications, 5-year cash-flow & IRR/NPV justifications, and green technology impact narratives.',
    subtitleAr:
      'ولّد ملفات التقديم على المنح والقروض الخضراء، وجداول التدفقات النقدية ومعدل العائد الداخلي IRR، ومبررات الأثر البيئي والتصديري.',
    systemPrompt:
      'You are a Senior Investment Officer and Industrial Grant Writer experienced with EBRD GEFF, UNIDO TIGARA, GIZ, IMC, and MSMEDA financing programs in Egypt. Write bankable feasibility studies, IRR/NPV tables, and winning grant narratives.',
    quickActions: [
      {
        id: 'grant-narrative',
        labelEn: 'Write Winning UNIDO / EBRD Green Grant Application',
        labelAr: 'كتابة ملف تقديم فائز لمنحة UNIDO / البنك الأوروبي EBRD',
        promptEn:
          'Write a complete, persuasive grant application narrative for an El-Mahalla SME applying for €75,000 in co-financing to upgrade to high-speed air-jet looms and low-liquor-ratio dyeing, highlighting export growth, energy savings, and youth/female employment.',
        promptAr:
          'اكتب ملف تقديم متكاملاً ومقنعاً لمصنع بالمحلة الكبرى للحصول على منحة تمويل مشترك بقيمة ٧٥,٠٠٠ يورو لتحديث الأنوال وماكينات الصباغة الموفرة للمياه، مع إبراز نمو الصادرات وتوفير الطاقة وفرص العمل.',
      },
      {
        id: 'financial-irr',
        labelEn: 'Build 5-Year CAPEX Cash-Flow, NPV & IRR Table',
        labelAr: 'إعداد جدول التدفقات النقدية لـ ٥ سنوات وحساب NPV و IRR',
        promptEn:
          'Construct a 5-year pro-forma financial projection table (CAPEX, annual OPEX savings, incremental export revenue, Net Present Value at 12% discount rate, Internal Rate of Return IRR, and payback period) for a $150,000 machinery modernization project.',
        promptAr:
          'أنشئ جدول توقعات مالية لمدة ٥ سنوات (التكلفة الاستثمارية CAPEX، وفورات التشغيل السنوية، عوائد التصدير الإضافية، صافي القيمة الحالية NPV، معدل العائد الداخلي IRR، وفترة الاسترداد) لمشروع تحديث ماكينات بقيمة ١٥٠,٠٠٠ دولار.',
      },
      {
        id: 'msmeda-working-cap',
        labelEn: 'Structure Working-Capital Loan for Raw Cotton',
        labelAr: 'هيكلة ملف قرض رأس مال عامل لتمويل شراء الغزول والأقطان',
        promptEn:
          'Draft a bank credit-committee brief for an MSMEDA / CBE working-capital facility to finance 30 tons of Giza cotton yarn backed by confirmed export orders and EGE export credit insurance.',
        promptAr:
          'صغ مذكرة ائتمانية للبنك وجهاز تنمية المشروعات (MSMEDA) لتمويل رأس مال عامل لشراء ٣٠ طن غزل قطن جيزة بضمان أوامر توريد تصديرية مؤكدة ووثيقة ضمان مخاطر الصادرات.',
      },
      {
        id: 'donor-kpis',
        labelEn: 'Donor Impact Logical Framework (LogFrame)',
        labelAr: 'مصفوفة الإطار المنطقي للأثر التنموي (LogFrame) للجهات المانحة',
        promptEn:
          'Create a donor-ready Logical Framework (LogFrame) table linking Inputs → Activities → Outputs → Outcomes → Impact with baseline and target KPIs (kWh saved, m3 water recycled, women trained, USD exported).',
        promptAr:
          'صمم جدول الإطار المنطقي (LogFrame) المعتمد لدى الجهات المانحة يربط المدخلات بالأنشطة والمخرجات والنتائج مع مؤشرات قياس الأداء (الكهرباء الموفرة، المياه المعاد تدويرها، تدريب السيدات، ونمو الصادرات).',
      },
    ],
  },
  forum: {
    moduleId: 'forum',
    badgeEn: 'AI Peer Technical Moderator & Defect Solver',
    badgeAr: 'الخبير الفني الذكي لحل مشكلات التصنيع بالمنتدى',
    titleEn: 'AI Technical Q&A Synthesizer & Root-Cause Troubleshooting Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي للإجابة العلمية على الاستفسارات الفنية وتشخيص أعطال المصانع',
    subtitleEn:
      'Get instant peer-grade engineering answers to spinning, weaving, knitting, dyeing, or export compliance questions before or after posting.',
    subtitleAr:
      'احصل على إجابات هندسية فورية مدعومة بالمراجع لأي مشكلة فنية في الغزل أو النسيج أو الصباغة أو التصدير.',
    systemPrompt:
      'You are the Chief Technical Moderator of the El-Mahalla Industrial Cluster Engineering Forum. Provide precise, peer-reviewed textile engineering solutions with machine parameters, chemical recipes, and ISO standard references.',
    quickActions: [
      {
        id: 'dye-barriness',
        labelEn: 'Solve Shade Variation & Center-Selvedge Listing',
        labelAr: 'حل مشكلة تفاوت اللون بين الوسط والبرسل في الصباغة',
        promptEn:
          'Explain the exact mechanical and chemical root causes of center-to-selvedge shade listing (طرف ووسط) and batch-to-batch ΔE variation in reactive cotton dyeing, and provide a step-by-step corrective recipe.',
        promptAr:
          'اشرح الأسباب الجذرية الميكانيكية والكيميائية لمشكلة تفاوت اللون بين الوسط والبرسل (طرف ووسط) واختلاف الدرجة اللونية ΔE بين اللوطات في صباغة القطن التفاعلية مع خطوات العلاج.',
      },
      {
        id: 'yarn-hairiness',
        labelEn: 'Reduce Ring-Spun Yarn Hairiness & Neps',
        labelAr: 'خفض تشعير الغزل (Hairiness) والعُقد (Neps) في الغزل الحلقي',
        promptEn:
          'Prescribe the exact carding wire settings, combing noil %, ring traveler weight, spindle speed, and winding tension parameters to reduce Uster Hairiness Index (H) and Neps (+200%) in Ne 40/1 Giza cotton yarn.',
        promptAr:
          'حدد إعدادات ماكينة الكرد، ونسبة عادم التمشيط (Noil %)، ووزن الدبلة (Traveler)، وسرعة المردن، وشد التدوير لخفض معامل التشعير (H) والعُقد (Neps) في غزل قطن جيزة Ne 40/1.',
      },
      {
        id: 'shrinkage-control',
        labelEn: 'Control Knit Fabric Dimensional Shrinkage (< 4%)',
        labelAr: 'ضبط انكماش أقمشة التريكو القطني لأقل من ٤٪ بعد الغسيل',
        promptEn:
          'Detail how to achieve < 4% length and width dimensional stability (ISO 6330) on 100% cotton single-jersey and interlock knits through stitch length control, stenter overfeed %, and sanforizing/compacting.',
        promptAr:
          'اشرح بالتفصيل كيفية تحقيق ثبات أبعاد وانكماش أقل من ٤٪ (وفق ISO 6330) لأقمشة التريكو القطنية (سنجل جيرسيه وإنترلوك) عبر ضبط طول الغرزة ونسبة التغذية الزائدة في الرام والكومباكتور.',
      },
      {
        id: 'draft-forum-post',
        labelEn: 'Format a Technical Question for Maximum Peer Replies',
        labelAr: 'صياغة سؤال فني احترافي لطرحه على خبراء المنتدى',
        promptEn:
          'Help me structure a clear, data-complete technical forum post describing a recurring production issue (fiber blend, yarn count, machine model, chemical bath parameters, defect rate) so cluster experts can diagnose it immediately.',
        promptAr:
          'ساعدني في صياغة منشور فني متكامل البيانات لطرحه في منتدى التجمع يشمل (نوع الخامة، نمرة الغزل، طراز الماكينة، ظروف التشغيل، ونسبة العيب) للحصول على تشخيص دقيق من الخبراء.',
      },
    ],
  },
  events: {
    moduleId: 'events',
    badgeEn: 'AI B2B Matchmaking & Delegation Strategist',
    badgeAr: 'منسق البعثات التصديرية ولقاءات الأعمال B2B الذكي',
    titleEn: 'AI Trade-Show Preparation, B2B Speed-Pitch & Follow-Up Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي للتحضير للمعارض ولقاءات التشبيك الثنائي ومتابعة العملاء',
    subtitleEn:
      'Prepare your 3-minute B2B matchmaking pitch, delegation packing list, and 48-hour post-event buyer conversion sequence.',
    subtitleAr:
      'جهّز عرضك التقديمي السريع للقاءات الأعمال الثنائية (B2B)، وقائمة تجهيز وفد المعرض، وخطة المتابعة خلال ٤٨ ساعة.',
    systemPrompt:
      'You are an International Trade Mission & B2B Matchmaking Director for the TIGARA El-Mahalla Cluster. Prepare high-impact B2B speed-networking pitches, trade-fair preparation checklists, and post-event conversion sequences.',
    quickActions: [
      {
        id: 'b2b-speed-pitch',
        labelEn: '3-Minute B2B Speed-Matchmaking Pitch Script',
        labelAr: 'عرض تقديمي مكثف (٣ دقائق) للقاءات التشبيك الثنائي B2B',
        promptEn:
          'Write a high-impact 3-minute B2B matchmaking table pitch for an El-Mahalla manufacturer meeting 12 visiting European & Arab buyers during a TIGARA Matchmaking Day, including key questions to qualify each buyer.',
        promptAr:
          'اكتب عرضاً تقديمياً مكثفاً مدته ٣ دقائق لمصنع بالمحلة يلتقي بـ ١٢ مشترياً أوروبياً وعربياً خلال يوم التشبيك الثنائي B2B، مع قائمة أسئلة ذكية لتصنيف المشتري وتحديد احتياجاته.',
      },
      {
        id: 'delegation-checklist',
        labelEn: 'Trade-Show Delegation Preparation Checklist',
        labelAr: 'قائمة التجهيز الكاملة لبعثة المعارض الخارجية (Heimtextil)',
        promptEn:
          'Generate a pre-departure checklist for a Mahalla factory joining an international trade-fair delegation (swatch headers with GSM/composition/FOB price, customs ATA Carnet, QR digital catalog, pre-booked buyer calendar).',
        promptAr:
          'ولّد قائمة مراجعة شاملة قبل السفر للمشاركة في بعثة معرض دولي (تجهيز كروت العينات بوزن المتر المربع والسعر، دفتر الإدخال المؤقت للعينات، الكتالوج الرقمي QR، وجدول المواعيد المسبقة).',
      },
      {
        id: 'post-event-48h',
        labelEn: '48-Hour Post-Event Buyer Follow-Up Sequence',
        labelAr: 'خطة متابعة المشترين خلال ٤٨ ساعة بعد انتهاء المعرض',
        promptEn:
          'Design a 3-touch follow-up sequence (Hour 24 WhatsApp photo of selected swatch, Hour 48 formal FOB/CIF quotation + DHL sample tracking, Day 7 video mill tour invite) to convert trade-show leads into trial orders.',
        promptAr:
          'صمم خطة متابعة من ٣ مراحل بعد انتهاء المعرض (رسالة واتساب بصورة العينة خلال ٢٤ ساعة، عرض سعر رسمي ورقم تتبع DHL خلال ٤٨ ساعة، ودعوة جولة فيديو بالمصنع في اليوم السابع).',
      },
      {
        id: 'workshop-agenda',
        labelEn: 'Design Technical Cluster Workshop Agenda',
        labelAr: 'تصميم جدول أعمال ورشة عمل فنية لأعضاء التجمع',
        promptEn:
          'Create a half-day interactive workshop agenda for El-Mahalla factory owners and engineers on "Cutting Dyeing Energy & Water Costs by 25% while Meeting EUDPP Rules".',
        promptAr:
          'صمم جدول أعمال تفصيلياً لورشة عمل تطبيقية لأصحاب ومهندسي مصانع المحلة بعنوان «خفض تكلفة الطاقة والمياه في الصباغة بنسبة ٢٥٪ مع التوافق مع جواز المنتج الأوروبي».',
      },
    ],
  },
  experts: {
    moduleId: 'experts',
    badgeEn: 'AI Technical Consulting & ToR Architect',
    badgeAr: 'مهندس كراسات الشروط الاستشارية (ToR) والتوجيه الفني',
    titleEn: 'AI Consulting Scope-of-Work (ToR) & Mentorship Action-Plan Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لصياغة المهام الاستشارية (ToR) وخطط التوجيه الفني للمصانع',
    subtitleEn:
      'Draft clear Terms of Reference (ToR) with measurable factory KPIs before hiring an expert or booking a mentorship session.',
    subtitleAr:
      'صغ كراسة شروط ومهام استشارية (ToR) مرتبطة بمؤشرات أداء قابلة للقياس قبل التعاقد مع خبير أو طلب جلسة إرشاد.',
    systemPrompt:
      'You are a Senior UNIDO Technical Assistance Program Manager. Draft precise Terms of Reference (ToR) for textile industrial consultants, milestone-based consulting deliverables, and mentorship action plans.',
    quickActions: [
      {
        id: 'draft-tor',
        labelEn: 'Draft Outcome-Based Consultant Terms of Reference (ToR)',
        labelAr: 'صياغة كراسة مهام استشارية (ToR) مرتبطة بالنتائج',
        promptEn:
          'Draft a professional Terms of Reference (ToR) to engage a Senior Dyeing & Finishing Expert for 10 days on-site in El-Mahalla, tying consultant fees to achieving Right-First-Time (RFT) ≥ 95% and reducing re-dyeing below 3%.',
        promptAr:
          'صغ كراسة شروط مرجعية (ToR) للتعاقد مع خبير صباغة وتجهيز لمدة ١٠ أيام ميدانية في المحلة الكبرى، مع ربط أتعاب الخبير برفع نسبة الصباغة الصحيحة من أول مرة (RFT ≥ 95%) وخفض إعادة الصباغة لأقل من ٣٪.',
      },
      {
        id: 'lean-diagnostic',
        labelEn: '5-Day Lean Manufacturing Floor Audit Agenda',
        labelAr: 'خطة تشخيص ميداني (٥ أيام) لتطبيق التصنيع الرشيق Lean',
        promptEn:
          'Create a 5-day on-site mentorship diagnostic schedule for a Lean Textile Consultant visiting a Mahalla SME (Day 1 Value Stream Mapping, Day 2 5S & Yarn Store, Day 3 SMED Changeover, Day 4 Quality Gates, Day 5 KPI Dashboard).',
        promptAr:
          'أنشئ برنامج عمل ميدانياً لمدة ٥ أيام لخبير التصنيع الرشيق (Lean) داخل مصنع بالمحلة (اليوم ١ خريطة تدفق القيمة، اليوم ٢ تنظيم 5S ومخزن الغزل، اليوم ٣ تقليل زمن التجهيز، اليوم ٤ بوابات الجودة، اليوم ٥ لوحة المؤشرات).',
      },
      {
        id: 'export-mentor-brief',
        labelEn: 'Prepare Factory Brief for EU Export Mentor',
        labelAr: 'تجهيز ملف تعريف المصنع لجلسة خبير التصدير الأوروبي',
        promptEn:
          'Generate a structured 1-page pre-session diagnostic brief for a factory owner meeting an EU Export & Compliance Mentor, organizing current capacities, HS codes, certifications, and target buyer bottlenecks.',
        promptAr:
          'ولّد نموذج تحضير مركز من صفحة واحدة لصاحب مصنع قبل اجتماعه مع خبير التصدير للاتحاد الأوروبي يلخص الطاقات المتاحة والبنود الجمركية والشهادات والعقبات الحالية.',
      },
      {
        id: 'expert-profile-bio',
        labelEn: 'Write High-Trust Industrial Consultant Profile',
        labelAr: 'صياغة ملف تعريفي احترافي للخبراء والاستشاريين المعتمدين',
        promptEn:
          'Write an authoritative bilingual Expert Profile headline, bio, and structured mentorship packages for a 20-year textile engineering and ISO/OEKO-TEX compliance specialist.',
        promptAr:
          'اكتب ملفاً تعريفياً احترافياً ثنائي اللغة وعروض جلسات إرشادية لاستشاري هندسة غزل ونسيج ومطابقة دولية ذي خبرة ٢٠ عاماً.',
      },
    ],
  },
  announcements: {
    moduleId: 'announcements',
    badgeEn: 'AI Executive Cluster Communications Composer',
    badgeAr: 'محرر البيانات التنفيذية والتعميمات الرسمية بالذكاء الاصطناعي',
    titleEn: 'AI Bilingual Policy Circular, Subsidy Alert & Cluster Bulletin Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لصياغة التعميمات الرسمية وإشعارات دعم الصادرات والمنح',
    subtitleEn:
      'Draft official bilingual (Arabic/English) announcements for cluster factories, buyers, and workers.',
    subtitleAr:
      'حرر البيانات الرسمية والتعميمات ثنائية اللغة (عربي/إنجليزي) الموجهة للمصانع والمشترين والعمال.',
    systemPrompt:
      'You are the Director of Communications & Policy for the El-Mahalla Textile Cluster Management Organization (CMO). Write clear, authoritative bilingual circulars, regulatory alerts, and program calls.',
    quickActions: [
      {
        id: 'cbam-dpp-circular',
        labelEn: 'Draft Official Circular on EU DPP & Customs Rules',
        labelAr: 'صياغة تعميم رسمي للمصانع حول جواز المنتج الأوروبي DPP',
        promptEn:
          'Draft an official bilingual (Arabic & English) Cluster Management announcement alerting all export mills to mandatory EU ESPR Digital Product Passport requirements and free onboarding support at the TIGARA Center.',
        promptAr:
          'قم بصياغة بيان وتعميم رسمي ثنائي اللغة (عربي وإنجليزي) من إدارة التجمع لتنبيه المصانع المصدرة بمتطلبات جواز المنتج الرقمي الأوروبي (EU DPP) وفتح باب التسجيل للدعم الفني المجاني.',
      },
      {
        id: 'subsidy-call',
        labelEn: 'Announce New EDF Export Subsidy & Trade Mission',
        labelAr: 'إعلان فتح باب التقديم لبعثة معرض دولي ودعم الصادرات',
        promptEn:
          'Write an urgent bilingual announcement inviting cluster factories to apply for 70% subsidized booth space at the upcoming Heimtextil / Première Vision delegation.',
        promptAr:
          'اكتب إعلاناً رسمياً ثنائي اللغة يدعو مصانع التجمع للتسجيل في بعثة معرض Heimtextil / Première Vision بدعم حكومي يغطي ٧٠٪ من تكلفة الجناح والشحن.',
      },
      {
        id: 'pool-launch',
        labelEn: 'Broadcast New Giza Yarn Joint-Procurement Pool',
        labelAr: 'إشعار إطلاق محفظة شراء مشترك جديدة لغزل جيزة ٨٦',
        promptEn:
          'Compose a concise, high-urgency announcement notifying spinning and weaving SMEs that a new 50-ton Giza 86 Yarn Joint-Buying Pool is open for commitments for the next 10 days.',
        promptAr:
          'حرر إشعاراً عاجلاً لأصحاب مصانع النسيج والتريكو بفتح باب الانضمام لمحفظة الشراء المشترك لغزل قطن جيزة ٨٦ بكمية ٥٠ طناً ولمدة ١٠ أيام.',
      },
      {
        id: 'safety-weather',
        labelEn: 'Boiler Safety & Peak-Summer Grid Load Advisory',
        labelAr: 'نشرة إرشادات سلامة الغلايات وترشيد الأحمال الكهربائية بالصيف',
        promptEn:
          'Write a practical technical bulletin for factory maintenance teams on steam boiler valve inspection and shifting heavy dyeing/spinning loads to off-peak tariff hours.',
        promptAr:
          'اكتب نشرة فنية إرشادية لفرق الصيانة بالمصانع حول فحص صمامات أمان الغلايات البخارية وجدولة الأحمال الكثيفة خارج ساعات الذروة الكهربائية.',
      },
    ],
  },
  observatory: {
    moduleId: 'observatory',
    badgeEn: 'AI Cluster Macro-Economist & Policy Advisor',
    badgeAr: 'الخبير الاقتصادي الذكي لمرصد التجمع ومقارنة الأداء',
    titleEn: 'AI Cluster Competitiveness, Peer Benchmarking & Policy Brief Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لتحليل تنافسية التجمع والمقارنة المرجعية وصياغة السياسات',
    subtitleEn:
      'Interpret cluster-wide KPIs, benchmark your mill against top-quartile peers, and generate UNIDO/Ministry policy briefs.',
    subtitleAr:
      'حلّل مؤشرات الأداء الكلية للتجمع، وقارن مصنعك بالربع الأعلى أداءً، وولّد تقارير السياسات الصناعية.',
    systemPrompt:
      'You are the Chief Industrial Economist for the UNIDO TIGARA El-Mahalla Observatory. Analyze cluster-wide capacity, export value chains, carbon intensity trends, and peer benchmarks to produce executive policy briefs and factory improvement plans.',
    quickActions: [
      {
        id: 'policy-brief',
        labelEn: 'Generate Executive Policy Brief for Ministry & UNIDO',
        labelAr: 'توليد تقرير سياسات تنفيذي لوزارة الصناعة ومنظمة UNIDO',
        promptEn:
          'Synthesize an executive policy brief on the El-Mahalla Textile Cluster highlighting how joint procurement, shared ISO 17025 lab access, and consortium bidding increase SME export competitiveness by 28% while reducing CO2e intensity.',
        promptAr:
          'ولّد تقرير سياسات تنفيذي حول تجمع المحلة الكبرى يوضح كيف يسهم الشراء المشترك، والمعمل المعتمد المشترك ISO 17025، والتحالفات التصديرية في رفع تنافسية صادرات المصانع الصغيرة بنسبة ٢٨٪ وخفض كثافة الانبعاثات.',
      },
      {
        id: 'peer-gap-plan',
        labelEn: 'Close the Gap Between Median & Top-Quartile Mills',
        labelAr: 'خطة سد الفجوة للانتقال من المتوسط إلى الربع الأعلى أداءً',
        promptEn:
          'Compare a median El-Mahalla SME (OEE 64%, 3.1 kg CO2e/kg, 85 L water/kg, 12% RFQ win rate) against top-quartile cluster leaders (OEE 84%, 1.8 kg CO2e/kg, 42 L water/kg, 34% win rate) and prescribe a 6-step catch-up plan.',
        promptAr:
          'قارن بين مصنع متوسط الأداء بالمحلة (كفاءة OEE 64%، انبعاثات 3.1 كجم CO2e/كجم، مياه 85 لتر/كجم) ومصانع الصدارة بالربع الأعلى (OEE 84%، انبعاثات 1.8، مياه 42 لتر/كجم) وضع خطة من ٦ خطوات للحاق بالصدارة.',
      },
      {
        id: 'bottleneck-analysis',
        labelEn: 'Value-Chain Bottleneck Analysis (Spinning → Finishing)',
        labelAr: 'تحليل اختناقات سلسلة القيمة بالمحلة (من الغزل إلى التجهيز النهائي)',
        promptEn:
          'Analyze structural value-chain bottlenecks in El-Mahalla (e.g., wide-width 320cm reactive dyeing/sateen finishing capacity vs. weaving output) and recommend targeted shared-facility investments.',
        promptAr:
          'حلّل نقاط الاختناق الهيكلي في سلسلة القيمة بالمحلة الكبرى (مثل طاقات الصباغة والتجهيز للعروض العريضة ٣٢٠ سم مقارنة بطاقة النسيج) واقترح أولويات الاستثمار المشترك.',
      },
      {
        id: 'quarterly-board',
        labelEn: 'Draft Quarterly Cluster Board Presentation',
        labelAr: 'إعداد ملخص التقرير الربع سنوي لمجلس إدارة التجمع',
        promptEn:
          'Draft a structured quarterly executive summary for the Cluster Management Board covering membership growth, pooled procurement savings, matched idle capacity, and green export readiness.',
        promptAr:
          'قم بصياغة ملخص تنفيذي ربع سنوي لمجلس إدارة التجمع يغطي نمو المصانع الأعضاء، وفورات الشراء المجمع، صفقات تبادل الطاقات الإنتاجية، وجاهزية التصدير الأخضر.',
      },
    ],
  },
  marketplaces: {
    moduleId: 'marketplaces',
    badgeEn: 'AI B2B Listing, Circular Waste & RFQ Optimizer',
    badgeAr: 'خبير الذكاء الاصطناعي لعروض B2B وتثمين العوادم والمناقصات',
    titleEn: 'AI Export Product Spec Writer, Circular Cotton Waste Valuator & RFQ Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لصياغة مواصفات المنتجات وتثمين عوادم القطن الدائرية وعروض الأسعار',
    subtitleEn:
      'Write high-converting B2B product listings, price circular spinning/cutting waste for GRS recycling, and structure technical RFQs.',
    subtitleAr:
      'اكتب مواصفات منتجات B2B احترافية للتصدير، وثمّن عوادم الغزل والقص لإعادة التدوير وفق معيار GRS، وصغ طلبات عروض الأسعار.',
    systemPrompt:
      'You are a Senior B2B Textile Merchandiser and Circular Economy Waste Valorization Specialist in El-Mahalla El-Kubra. Write international-standard product data sheets, GRS cotton waste valuation models, and comprehensive RFQ specifications.',
    quickActions: [
      {
        id: 'product-datasheet',
        labelEn: 'Generate Export-Grade Technical Product Datasheet',
        labelAr: 'إنشاء صحيفة مواصفات فنية دولية (Technical Datasheet) لمنتج',
        promptEn:
          'Generate a complete international B2B Technical Product Datasheet (fiber composition, yarn count Ne, warp/weft construction, GSM ±3%, width, tensile & tear strength, shrinkage, fastness grades, HS code, packing specs) ready to paste into a marketplace listing.',
        promptAr:
          'ولّد صحيفة مواصفات فنية دولية كاملة للمنتج (نسبة الألياف، نمرة الغزل، كثافة السدى واللحمة، وزن المتر المربع GSM، العرض، قوة الشد والتمزق، الانكماش، ثبات الألوان، البند الجمركي، وتفاصيل التعبئة).',
      },
      {
        id: 'waste-valuation',
        labelEn: 'Valuate Circular Cotton Waste (Comber Noil / Clips)',
        labelAr: 'تثمين وتسعير عوادم القطن (عوالم التمشيط وقصاصات التفصيل)',
        promptEn:
          'Provide a circular-economy grading and fair-pricing matrix (USD/ton) for El-Mahalla textile waste streams: 100% Giza Comber Noil, Carding Flat Strips, Ring Pneumafil, Unbleached Selvedge Trim, and Sorted White Knitting Clips for GRS mechanical recycling.',
        promptAr:
          'قدّم مصفوفة تصنيف وتسعير عادلة (دولار/طن) لعوادم مصانع المحلة القابلة للتدوير: عوادم تمشيط جيزة (Comber Noil)، عوادم الكرد، الهبّو، حواف الأقمشة الخام، وقصاصات التريكو البيضاء المفرزة لشهادة GRS.',
      },
      {
        id: 'buyer-rfq-spec',
        labelEn: 'Draft Ironclad Buyer RFQ Specification',
        labelAr: 'صياغة طلب عرض أسعار (RFQ) محكم للمشترين',
        promptEn:
          'Draft a complete, unambiguous B2B Buyer RFQ specification including AQL 2.5 inspection rules, lab-dip approval timeline, Incoterms® 2020 FOB/CIF pricing table, and mandatory OEKO-TEX/DPP attachments.',
        promptAr:
          'صغ طلب عرض أسعار (RFQ) محكماً يشمل معيار الفحص الإحصائي AQL 2.5، والجدول الزمني لاعتماد عينات الألوان، وجدول تسعير FOB/CIF، والمرفقات الإلزامية.',
      },
      {
        id: 'win-quotation',
        labelEn: 'Write Winning Factory Quotation Cover Proposal',
        labelAr: 'كتابة عرض فني ومالي فائز للرد على مناقصات المشترين',
        promptEn:
          'Write a persuasive factory quotation proposal responding to an international buyer RFQ, emphasizing zero customs duty (EUR.1/QIZ), vertically integrated Mahalla quality control, and flexible trial MOQs.',
        promptAr:
          'اكتب عرضاً فنياً ومالياً مقنعاً للرد على مناقصة مشتري دولي، يبرز الإعفاء الجمركي الكامل، وتكامل مراحل الإنتاج بالمحلة، ومرونة الحد الأدنى للطلبيات التجريبية.',
      },
    ],
  },
  recruitment: {
    moduleId: 'recruitment',
    badgeEn: 'AI Industrial HR & Technical Competency Architect',
    badgeAr: 'خبير الموارد البشرية الصناعية وتقييم الفنيين بالذكاء الاصطناعي',
    titleEn: 'AI Job Description Writer, Technical Interviewer & Piece-Rate Incentive Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي للوصف الوظيفي الصناعي ومقابلات الفنيين ونظم حوافز الإنتاج',
    subtitleEn:
      'Generate precise textile engineering job descriptions, practical machine-test interview scorecards, and productivity bonus schemes.',
    subtitleAr:
      'ولّد بطاقات وصف وظيفي دقيقة، واختبارات مقابلات عملية للفنيين والمهندسين، ونظم حوافز الإنتاج المرتبطة بالجودة.',
    systemPrompt:
      'You are an Industrial Human Resources Director & Textile Mill Operations Specialist in El-Mahalla El-Kubra. Create technical job descriptions, practical shop-floor interview tests, piece-rate bonus formulas, and retention plans.',
    quickActions: [
      {
        id: 'tech-job-desc',
        labelEn: 'Write Technical Job Spec (Spinning / Weaving / Dyeing)',
        labelAr: 'كتابة بطاقة وصف وظيفي فنية (مهندس أو فني غزل/نسيج/صباغة)',
        promptEn:
          'Write a comprehensive bilingual job description and KPI scorecard for hiring a Senior Air-Jet Weaving & Preventive Maintenance Engineer in El-Mahalla El-Kubra.',
        promptAr:
          'اكتب بطاقة وصف وظيفي ثنائية اللغة ومؤشرات تقييم أداء (KPIs) لتعيين مهندس أول نسيج أنوال هواء وصيانة وقائية في المحلة الكبرى.',
      },
      {
        id: 'practical-interview',
        labelEn: 'Practical 30-Minute Machine-Floor Test Scorecard',
        labelAr: 'نموذج اختبار عملي ميداني (٣٠ دقيقة) على الماكينة للمتقدمين',
        promptEn:
          'Design a 30-minute hands-on machine-floor practical test and grading rubric to evaluate technician candidates on loom timing, knot tying, spectrophotometer reading, and defect identification.',
        promptAr:
          'صمم اختباراً عملياً ميدانياً مدته ٣٠ دقيقة على الماكينة مع بطاقة درجات لتقييم الفنيين المتقدمين في ضبط توقيت النول، وربط الخيوط، وقراءة جهاز الأسبكتروفوتومتر، واكتشاف العيوب.',
      },
      {
        id: 'incentive-scheme',
        labelEn: 'Quality-Weighted Piece-Rate & OEE Bonus Formula',
        labelAr: 'معادلة حوافز الإنتاج الموزونة بالجودة وكفاءة الماكينات',
        promptEn:
          'Create a fair, motivating shift incentive formula for weaving, knitting, and sewing operators that rewards output above 80% efficiency ONLY when first-quality grade exceeds 97% (preventing speed-induced defects).',
        promptAr:
          'ابتكر معادلة حوافز ورديات عادلة ومحفزة لعمال النسيج والتريكو والخياطة تكافئ تجاوز كفاءة ٨٠٪ بشرط ألا تقل نسبة الدرجة الأولى عن ٩٧٪ لمنع التسرع على حساب الجودة.',
      },
      {
        id: 'onboarding-plan',
        labelEn: '14-Day New Operator Safety & Quality Onboarding',
        labelAr: 'برنامج تأهيل وسلامة مهنية لمدة ١٤ يوماً للعمال الجدد',
        promptEn:
          'Build a structured 14-day onboarding and occupational safety (OSHA / ISO 45001) training schedule for new mill operators in spinning and dyeing.',
        promptAr:
          'ضع برنامج تأهيل وتدريب على السلامة والصحة المهنية (ISO 45001) والجودة لمدة ١٤ يوماً للعمال والفنيين الجدد في أقسام الغزل والصباغة.',
      },
    ],
  },
  factories: {
    moduleId: 'factories',
    badgeEn: 'AI Supplier Due-Diligence & Sourcing Matchmaker',
    badgeAr: 'المدقق الذكي لكفاءة المصانع وتشبيك المشترين',
    titleEn: 'AI Factory Capability Auditor, KYC Readiness & Buyer Matchmaking Copilot',
    titleAr: 'مساعد الذكاء الاصطناعي لتدقيق قدرات المصانع والجاهزية التصديرية وتشبيك سلاسل الإمداد',
    subtitleEn:
      'Audit supplier capabilities for international buyers, optimize your factory profile for export discovery, or build multi-tier sourcing chains.',
    subtitleAr:
      'قيّم قدرات المصانع للمشترين الدوليين، وطوّر الملف التعريفي لمصنعك لجذب المستوردين، وصمم سلاسل توريد متكاملة.',
    systemPrompt:
      'You are a Global Apparel & Home-Textile Supplier Auditor (ISO 9001, SMETA 4-Pillar, OEKO-TEX, GOTS) for the El-Mahalla Cluster. Help buyers evaluate factories and help factory owners craft world-class export profiles.',
    quickActions: [
      {
        id: 'buyer-audit-checklist',
        labelEn: 'International Buyer Factory Audit Checklist (SMETA/ISO)',
        labelAr: 'قائمة تدقيق المصانع المعتمدة لدى المشترين الدوليين (SMETA/ISO)',
        promptEn:
          'Generate a 20-point pre-contract technical and social compliance audit checklist (ISO 9001, SMETA 4-Pillar, needle policy, metal detection, fabric inspection lightboxes, batch traceability) for vetting an export supplier.',
        promptAr:
          'ولّد قائمة تدقيق فني واجتماعي من ٢٠ نقطة (ISO 9001، SMETA، سياسة الإبر، كاشف المعادن، طاولات الفحص الضوئي، وتتبع اللوطات) لتقييم جاهزية المصنع للتصدير.',
      },
      {
        id: 'optimize-profile',
        labelEn: 'Rewrite Factory Profile for Global Export Buyers',
        labelAr: 'إعادة صياغة ملف المصنع التعريفي لجذب المشترين الأجانب',
        promptEn:
          'Write a world-class bilingual Factory Export Profile highlighting machinery list, monthly capacity, yarn count/GSM range, ISO/OEKO-TEX compliance, lead times, and EU DPP readiness.',
        promptAr:
          'اكتب ملفاً تعريفياً تصديرياً عالمي المستوى ثنائي اللغة للمصنع يبرز قائمة الماكينات، الطاقة الشهرية، نطاق النمر والأوزان GSM، شهادات الجودة، وزمن التوريد.',
      },
      {
        id: 'sourcing-chain',
        labelEn: 'Build Integrated Spinning → Sewing Supply Chain',
        labelAr: 'تصميم سلسلة إمداد متكاملة داخل المحلة (غزل ← نسيج ← صباغة ← تفصيل)',
        promptEn:
          'Design an optimal multi-factory supply chain routing inside El-Mahalla El-Kubra to fulfill a 40-foot container export order of 100% Egyptian cotton hotel bedding or knitwear with synchronized lead times.',
        promptAr:
          'صمم مسار سلسلة إمداد متكاملة داخل المحلة الكبرى لتنفيذ طلبية حاوية ٤٠ قدماً من مفروشات الفنادق أو التريكو القطني المصري مع مزامنة جداول التسليم بين المصانع.',
      },
      {
        id: 'moq-negotiation',
        labelEn: 'Structure Trial-Order MOQ & Scale-Up Agreement',
        labelAr: 'هيكلة اتفاقية طلبية تجريبية (Trial Order) وخطة التوسع',
        promptEn:
          'Draft a balanced Trial-Order & Volume Scale-Up term sheet between an international buyer and a Mahalla factory, rebating sample/setup surcharges once cumulative orders cross 10,000 units.',
        promptAr:
          'صغ مسودة اتفاقية طلبية تجريبية وخطة توسع تدريجي بين مشتري دولي ومصنع بالمحلة تتضمن استرداد فرق تكلفة العينات والتجهيز فور تجاوز المسحوبات ١٠,٠٠٠ وحدة.',
      },
    ],
  },
};

export function synthesizeModuleExpertDeliverable(
  moduleId: ClusterModuleId,
  prompt: string,
  locale: string
): string {
  const cfg = MODULE_AI_CONFIGS[moduleId] || MODULE_AI_CONFIGS.observatory;
  const isAr = locale === 'ar' || /[\u0600-\u06FF]/.test(prompt);

  if (isAr) {
    return `# ${cfg.titleAr}
**الوحدة النشطة:** ${cfg.badgeAr}
**الطلب الذي تم تحليله:** «${prompt.slice(0, 180)}»

---

## ١. المخرجات التنفيذية والمعايير الهندسية المعتمدة
تم بناء هذا النموذج التخصصي وفق ضوابط **منظمة الأمم المتحدة للتنمية الصناعية (UNIDO - TIGARA)** ومعايير **ISO / OEKO-TEX / ZDHC / EU ESPR 2024/1781** الخاصة بتجمع المحلة الكبرى:

| البند التنفيذي / المعيار | المؤشر المستهدف (Benchmark) | آلية التحقق والتوثيق |
| :--- | :--- | :--- |
| **١. الكفاءة الفنية وضبط الجودة** | \`RFT ≥ 96.5% | ΔE ≤ 0.8 | ASTM 4-Point ≤ 18\` | شهادة فحص معمل تيجارا المعتمد \`ISO/IEC 17025\` |
| **٢. الوفر المالي وتقليل الهالك** | \`خفض التكلفة 14%–22% | الهالك ≤ 2.5%\` | بطاقات تتبع اللوط الرقمية (\`QR Batch Card\`) |
| **٣. التوافق البيئي والتصديري** | \`ZDHC Level 3 | 0% Customs Duty (EUR.1 / QIZ)\` | جواز المنتج الرقمي الأوروبي (\`EU DPP\`) وشهادة المنشأ |
| **٤. الجدول الزمني للتنفيذ** | \`التنفيذ الكامل خلال 14 – 30 يوماً\` | مراجعة أسبوعية عبر لوحة مؤشرات المنصة |

## ٢. مخطط سير العمل والرقابة القياسية
\`\`\`mermaid
flowchart LR
  A["1. إدخال البيانات والمواصفات الفنية"] --> B["2. التحليل الهندسي والتسعيري بالذكاء الاصطناعي"]
  B --> C["3. التحقق المعملي والتعاقدي (ISO / UCP 600)"]
  C --> D["4. الاعتماد النهائي والتنفيذ التصديري"]
\`\`\`

## ٣. البنود العملية الجاهزة للتطبيق الفوري
1. **البند الفني والقياسي:** الالتزام الكامل بحدود التفاوت القياسية في نمرة الغزل (\`Uster CVm%\`)، ووزن المتر المربع (\`GSM ± 3%\`)، وثبات الألوان للغسيل والاحتكاك (\`ISO 105 ≥ Grade 4.0\`)، وانكماش الغسيل (\`ISO 6330 ≤ 3.5%\`).
2. **البند المالي والتعاقدي:** ربط الدفعات المالية بمراحل الاستلام الفعلي واجتياز الفحص المعملي المعتمد قبل الشحن، مع الاستفادة من الإعفاء الجمركي الكامل للصادرات المصرية (\`0% Tariff\`).
3. **التكامل مع وحدات المنصة:**
   - لتحليل السوق والمشترين والمواصفات القياسية لأي دولة: انتقل إلى **مركز ذكاء التصدير** (\`/ar/cluster/export-intelligence\`).
   - لتوليد دورة تدريبية مفصلة للفنيين والمهندسين: استخدم **استوديو الدورات الذكي** (\`/ar/cluster/academy/studio\`).
   - لتصميم هوية بصرية وبروشور وفيديو ترويجي: افتح **استوديو الهوية والتسويق** (\`/ar/cluster/brand-studio\`).`;
  }

  return `# ${cfg.titleEn}
**Active Module Specialist:** ${cfg.badgeEn}
**Analyzed Brief:** "${prompt.slice(0, 180)}"

---

## 1. Executive Deliverable & Industrial Benchmarks
Synthesized in accordance with **UNIDO TIGARA Cluster Methodology**, **ISO/IEC 17025**, **ZDHC MRSL v3.1**, and **EU ESPR Digital Product Passport (Reg. 2024/1781)** standards for El-Mahalla El-Kubra mills:

| Strategic Dimension / Gate | Target Benchmark | Verification & Audit Evidence |
| :--- | :--- | :--- |
| **1. Technical & Quality Control** | \`RFT ≥ 96.5% | ΔE ≤ 0.8 | ASTM 4-Point ≤ 18\` | Accredited TIGARA Lab Test Report (\`ISO/IEC 17025\`) |
| **2. Cost & Yield Optimization** | \`14%–22% Cost Reduction | Process Waste ≤ 2.5%\` | Digital QR Batch & Machine OEE Telemetry |
| **3. Export & ESG Compliance** | \`ZDHC Level 3 | 0% Tariff (EUR.1 / UK / QIZ)\` | EU Digital Product Passport (\`DPP\`) + Origin Certificate |
| **4. Execution Horizon** | \`14–30 Days Full Rollout\` | Weekly Milestone Tracking on Cluster Dashboard |

## 2. Execution & Quality Verification Workflow
\`\`\`mermaid
flowchart LR
  A["1. Technical Spec & Baseline Input"] --> B["2. AI Engineering & Commercial Modeling"]
  B --> C["3. ISO 17025 & Contractual Gate"]
  C --> D["4. Verified Execution & Export Dispatch"]
\`\`\`

## 3. Ready-to-Use Operational Clauses & Action Steps
1. **Technical Specification Gate:** Enforce strict lot-to-lot tolerance on yarn regularity (\`Uster CVm%\`), fabric weight (\`GSM ± 3%\`), color fastness to washing/rubbing (\`ISO 105-C06 / X12 ≥ Grade 4.0\`), and dimensional stability (\`ISO 6330 ≤ 3.5%\`).
2. **Commercial & Financial Safeguard:** Tie milestone settlements to signed pre-shipment inspection certificates and leverage Egypt's preferential \`0%\` customs duty under \`EUR.1\`, \`UK-Egypt\`, \`USA QIZ\`, and \`GAFTA\`.
3. **Connected Platform Workflows:**
   - Launch country-specific market studies, buyer outreach, and NTM checks in the **AI Export Intelligence Hub** (\`/en/cluster/export-intelligence\`).
   - Generate a 3-tier technician training course on this exact protocol in the **AI Course Studio** (\`/en/cluster/academy/studio\`).
   - Produce localized brochures, videos, and posters in the **AI Brand & Marketing Studio** (\`/en/cluster/brand-studio\`).`;
}
