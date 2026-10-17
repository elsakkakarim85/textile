/**
 * Expert-Level Lean Management & Lean Manufacturing Operational Excellence Engine
 * Covers:
 * 1. Value Stream Mapping (VSM), Takt Time, Process Cycle Efficiency (PCE) & 8 Wastes (DOWNTIME)
 * 2. 5S Workplace Audit, Red-Tagging, Visual Management & Gemba Walk Scoring
 * 3. TPM (Total Productive Maintenance), OEE (Availability × Performance × Quality), Six Big Losses & SMED
 * 4. Line Balancing, Yamazumi Chart, SAM/SMV Costing & Cellular Flow
 * 5. Kanban Pull System, Supermarket Sizing, Heijunka Leveling & JIT Inventory
 * 6. Jidoka, Andon Board, Poka-Yoke (Mistake Proofing) & Root-Cause (5 Whys + 6M Ishikawa Fishbone)
 * 7. Hoshin Kanri X-Matrix, Kaizen Blitz PDCA & Toyota-Style A3 Problem-Solving Report
 */

export type LeanDepartmentId =
  | 'spinning'
  | 'weaving'
  | 'knitting'
  | 'dyeing_finishing'
  | 'cutting_sewing'
  | 'quality_packing'
  | 'full_mill';

export interface VsmProcessStep {
  id: string;
  stepNameEn: string;
  stepNameAr: string;
  cycleTimeSec: number;
  changeoverMin: number;
  uptimePct: number;
  operators: number;
  defectPct: number;
  wipWaitHours: number;
  valueAddedMin: number;
}

export interface LeanWasteItem {
  code: 'D' | 'O' | 'W' | 'N' | 'T' | 'I' | 'M' | 'E';
  nameEn: string;
  nameAr: string;
  symptomEn: string;
  symptomAr: string;
  countermeasureEn: string;
  countermeasureAr: string;
  severityScore: number; // 1-10
  estimatedMonthlyLossEgp: number;
  targetReductionPct: number;
}

export interface FiveSCheckItem {
  id: string;
  pillar: '1S_SORT' | '2S_SET' | '3S_SHINE' | '4S_STANDARDIZE' | '5S_SUSTAIN';
  pillarTitleEn: string;
  pillarTitleAr: string;
  criterionEn: string;
  criterionAr: string;
  defaultScore: number; // 1-5
  standardRef: string;
}

export interface SmedTaskItem {
  id: string;
  taskEn: string;
  taskAr: string;
  originalCategory: 'INTERNAL' | 'EXTERNAL';
  targetCategory: 'INTERNAL' | 'EXTERNAL' | 'ELIMINATED';
  beforeMinutes: number;
  afterMinutes: number;
  improvementMethodEn: string;
  improvementMethodAr: string;
}

export interface WorkstationBalanceItem {
  id: string;
  stationEn: string;
  stationAr: string;
  cycleTimeSec: number;
  operators: number;
  skillGrade: 'A' | 'B' | 'C';
  vaSec: number;
  nvaSec: number;
}

export interface PokaYokeDevice {
  id: string;
  processEn: string;
  processAr: string;
  defectPreventedEn: string;
  defectPreventedAr: string;
  deviceTypeEn: string;
  deviceTypeAr: string;
  mechanismEn: string;
  mechanismAr: string;
  costEstimateEgp: number;
  roiMonths: number;
}

export interface IshikawaCause {
  category: 'Machine' | 'Method' | 'Material' | 'Man' | 'Measurement' | 'Environment';
  categoryAr: string;
  causesEn: string[];
  causesAr: string[];
}

export interface LeanA3Report {
  titleEn: string;
  titleAr: string;
  ownerRoleEn: string;
  ownerRoleAr: string;
  backgroundEn: string;
  backgroundAr: string;
  currentStateEn: string;
  currentStateAr: string;
  targetGoalEn: string;
  targetGoalAr: string;
  fiveWhys: {
    whyLevel: number;
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
  }[];
  ishikawa: IshikawaCause[];
  countermeasures: {
    actionEn: string;
    actionAr: string;
    ownerEn: string;
    ownerAr: string;
    timelineEn: string;
    timelineAr: string;
    expectedGainEn: string;
    expectedGainAr: string;
  }[];
  followUpStandardEn: string;
  followUpStandardAr: string;
}

export interface HoshinObjective {
  breakthrough3YrEn: string;
  breakthrough3YrAr: string;
  annualTargetEn: string;
  annualTargetAr: string;
  shopFloorKaizenEn: string;
  shopFloorKaizenAr: string;
  kpiMetricEn: string;
  kpiMetricAr: string;
  ownerEn: string;
  ownerAr: string;
}

export interface LeanBlueprintReport {
  factoryName: string;
  department: LeanDepartmentId;
  productFocus: string;
  primaryBottleneck: string;
  generatedAt: string;
  aiExecutiveSummaryEn?: string;
  aiExecutiveSummaryAr?: string;
  aiModelUsed?: string;
  vsmSteps: VsmProcessStep[];
  eightWastes: LeanWasteItem[];
  fiveSAuditItems: FiveSCheckItem[];
  smedTasks: SmedTaskItem[];
  workstations: WorkstationBalanceItem[];
  pokaYokeLibrary: PokaYokeDevice[];
  a3Report: LeanA3Report;
  hoshinMatrix: HoshinObjective[];
}

export const LEAN_DEPARTMENTS: {
  id: LeanDepartmentId;
  labelEn: string;
  labelAr: string;
}[] = [
  { id: 'full_mill', labelEn: 'Full Integrated Textile Mill (Spinning → Packing)', labelAr: 'مصنع نسيج متكامل (من الغزل حتى التعبئة)' },
  { id: 'spinning', labelEn: 'Ring & Compact Spinning Mill', labelAr: 'مصنع الغزل الحلقي والمدمج (Compact)' },
  { id: 'weaving', labelEn: 'Warping, Sizing & High-Speed Air-Jet Weaving', labelAr: 'التسدية والتبويش والنسيج الهوائي السريع' },
  { id: 'knitting', labelEn: 'Circular & Flatbed Knitting Floor', labelAr: 'عنبر التريكو الدائري والمستطيل' },
  { id: 'dyeing_finishing', labelEn: 'Reactive Dyeing, Printing & Stenter Finishing', labelAr: 'المصبغة والطباعة والتجهيز النهائي (الرام)' },
  { id: 'cutting_sewing', labelEn: 'CAD Cutting, Sewing Lines & Garment Assembly', labelAr: 'القص الآلي وخطوط الخياطة وتجميع الملابس' },
  { id: 'quality_packing', labelEn: '4-Point Inspection, Folding & Export Packing', labelAr: 'فحص الجودة (4-Point) والطي والتعبئة للتصدير' },
];

export function synthesizeLeanBlueprint(params: {
  factoryName?: string;
  department?: LeanDepartmentId;
  productFocus?: string;
  primaryBottleneck?: string;
}): LeanBlueprintReport {
  const factoryName = (params.factoryName || 'El-Mahalla Premier Textile Mill').trim();
  const department: LeanDepartmentId = params.department || 'full_mill';
  const productFocus = (params.productFocus || '100% Egyptian Giza 86 Combed Cotton Fabrics & Home Textiles').trim();
  const primaryBottleneck = (
    params.primaryBottleneck ||
    'Long changeover times (SMED), WIP accumulation between weaving and dyeing, and shade rework'
  ).trim();

  const vsmSteps: VsmProcessStep[] = [
    {
      id: 'step-1',
      stepNameEn: '1. Yarn Conditioning & High-Speed Warping',
      stepNameAr: '١. ترطيب الغزول والتسدية السريعة',
      cycleTimeSec: 42,
      changeoverMin: 55,
      uptimePct: 91,
      operators: 4,
      defectPct: 1.2,
      wipWaitHours: 36,
      valueAddedMin: 65,
    },
    {
      id: 'step-2',
      stepNameEn: '2. Warp Sizing & Beam Drawing-In',
      stepNameAr: '٢. التبويش واللقي والتطريح',
      cycleTimeSec: 54,
      changeoverMin: 110,
      uptimePct: 84,
      operators: 5,
      defectPct: 1.8,
      wipWaitHours: 48,
      valueAddedMin: 80,
    },
    {
      id: 'step-3',
      stepNameEn: '3. High-Speed Air-Jet Weaving (Picanol/Toyota)',
      stepNameAr: '٣. النسيج على أنوال الهواء السريعة',
      cycleTimeSec: 68,
      changeoverMin: 165,
      uptimePct: 81,
      operators: 8,
      defectPct: 3.1,
      wipWaitHours: 72,
      valueAddedMin: 240,
    },
    {
      id: 'step-4',
      stepNameEn: '4. Pretreatment & Low-Liquor Reactive Dyeing (1:6)',
      stepNameAr: '٤. التجهيز التحضيري والصباغة التفاعلية (1:6)',
      cycleTimeSec: 62,
      changeoverMin: 85,
      uptimePct: 86,
      operators: 6,
      defectPct: 3.8,
      wipWaitHours: 60,
      valueAddedMin: 210,
    },
    {
      id: 'step-5',
      stepNameEn: '5. Stenter Heat-Setting, Sanforizing & Calendaring',
      stepNameAr: '٥. التثبيت الحراري بالرام والسانفورايز',
      cycleTimeSec: 45,
      changeoverMin: 40,
      uptimePct: 89,
      operators: 4,
      defectPct: 1.4,
      wipWaitHours: 28,
      valueAddedMin: 55,
    },
    {
      id: 'step-6',
      stepNameEn: '6. Automated Cutting, Hemming/Sewing & 4-Point Packing',
      stepNameAr: '٦. القص الآلي والحياكة وفحص الجودة والتغليف',
      cycleTimeSec: 58,
      changeoverMin: 35,
      uptimePct: 92,
      operators: 14,
      defectPct: 2.2,
      wipWaitHours: 24,
      valueAddedMin: 95,
    },
  ];

  const eightWastes: LeanWasteItem[] = [
    {
      code: 'D',
      nameEn: 'Defects (Off-Shade ΔE > 0.8, Weaving Barre, Seam Puckering)',
      nameAr: 'العيوب وإعادة التشغيل (تفاوت اللون، الباري، عيوب الخياطة)',
      symptomEn: `Re-dyeing batches (6.5% rate) and 4-Point fabric penalties on ${productFocus}`,
      symptomAr: `إعادة صباغة نحو ٦.٥٪ من اللوطات وخصومات نقاط الجودة في ${productFocus}`,
      countermeasureEn: 'Implement automated pH/alkali dosing curves, spectrophotometer lab-to-bulk correlation, and Poka-Yoke cone-lot barcode scanning.',
      countermeasureAr: 'تطبيق الحقن التدريجي الآلي للقلوي، ومطابقة طيف الألوان مخبرياً، وماسح الباركود للوطات الغزل (Poka-Yoke).',
      severityScore: 9,
      estimatedMonthlyLossEgp: 185000,
      targetReductionPct: 70,
    },
    {
      code: 'O',
      nameEn: 'Overproduction (Weaving/Dyeing Speculative Batch Sizes)',
      nameAr: 'الإفراط في الإنتاج (تشغيل كميات أكبر من طلب العميل)',
      symptomEn: 'Running 5,000m minimum batches when export order requires 3,200m, tying up working capital.',
      symptomAr: 'تشغيل دفعات كبيرة لتقليل التغيير مما يكدس المخزون الراكد ويجمد السيولة.',
      countermeasureEn: 'Transition to Heijunka leveled pull scheduling and reduce changeover time via SMED so smaller lots are profitable.',
      countermeasureAr: 'التحول إلى نظام السحب (Kanban Pull) وجدولة Heijunka مع تقليل وقت تغيير المطواة عبر SMED.',
      severityScore: 7,
      estimatedMonthlyLossEgp: 110000,
      targetReductionPct: 60,
    },
    {
      code: 'W',
      nameEn: 'Waiting (Loom Beam Changeover, Lab-Dip Approval & Mechanic Delay)',
      nameAr: 'الانتظار (انتظار المطاوي، موافقة اللون، أو فني الصيانة)',
      symptomEn: `Machines idle waiting for warp knotting trolleys, chemical weighing, or maintenance response (${primaryBottleneck}).`,
      symptomAr: `توقف الماكينات انتظاراً لعربة اللقي أو وزن الصبغات أو تدخل الصيانة (${primaryBottleneck}).`,
      countermeasureEn: 'Deploy Andon light/WhatsApp alert escalation, pre-stage warp beams 2 hours before run-out, and pre-weigh dyestuffs in dispensary.',
      countermeasureAr: 'تركيب نظام إنذار Andon ضوئي/رقمي، وتجهيز المطاوي والكيماويات خارجياً قبل انتهاء التشغيلة بـ ساعتين.',
      severityScore: 9,
      estimatedMonthlyLossEgp: 165000,
      targetReductionPct: 65,
    },
    {
      code: 'N',
      nameEn: 'Non-Utilized Talent (Lack of Multi-Skill Cross-Training)',
      nameAr: 'عدم استغلال مهارات العاملين (غياب التدريب المتقاطع)',
      symptomEn: 'Single-operation dependency causing line bottlenecks when key operators are absent.',
      symptomAr: 'اعتماد كل مرحلة على عامل واحد دون مصفوفة مهارات متعددة (Skill Matrix).',
      countermeasureEn: 'Establish a 4×4 Cross-Training Skill Matrix and incentivize daily operator Kaizen idea cards.',
      countermeasureAr: 'تطبيق مصفوفة المهارات المتعددة (٤×٤) وحوافز شهرية لبطاقات تحسين كايزن من العمال.',
      severityScore: 6,
      estimatedMonthlyLossEgp: 55000,
      targetReductionPct: 75,
    },
    {
      code: 'T',
      nameEn: 'Transportation (Back-and-Forth Greige & Dyed Batch Trolleys)',
      nameAr: 'النقل والحركة الزائدة للعربات واللوطات بين الأقسام',
      symptomEn: 'Fabric rolls travel >850 meters across disconnected buildings before final inspection.',
      symptomAr: 'انتقال رولات القماش لمسافة تتجاوز ٨٥٠ متراً بين الأقسام والمخازن قبل الفحص.',
      countermeasureEn: 'Re-layout into U-shaped cellular flow for cutting-sewing-packing and mark dedicated FIFO tugger lanes.',
      countermeasureAr: 'إعادة تخطيط المسارات على شكل حرف U وتحديد ممرات FIFO مباشرة بين الصباغة والتجهيز.',
      severityScore: 6,
      estimatedMonthlyLossEgp: 48000,
      targetReductionPct: 55,
    },
    {
      code: 'I',
      nameEn: 'Inventory (Excess Yarn Cones, Greige WIP & Chemical Drums)',
      nameAr: 'المخزون الزائد (تراكم التشغيل تحت الصنع WIP والغزول)',
      symptomEn: '11.2 days of WIP sitting between weaving, dyeing, and sewing floors.',
      symptomAr: 'تراكم مخزون تحت التشغيل (WIP) يكفي ١١.٢ يوماً بين النسيج والمصبغة والقص.',
      countermeasureEn: 'Introduce 2-Bin Kanban Supermarkets with strict WIP caps (max 2.5 days buffer between processes).',
      countermeasureAr: 'تطبيق نظام السوبرماركت وبطاقات كانبان بحد أقصى ٢.٥ يوم مخزون أمان بين المراحل.',
      severityScore: 8,
      estimatedMonthlyLossEgp: 140000,
      targetReductionPct: 60,
    },
    {
      code: 'M',
      nameEn: 'Motion (Searching for Tools, Scissors, Cones & Pattern Templates)',
      nameAr: 'الحركة غير الضرورية للعمال (البحث عن العدد والمقصات والبكرات)',
      symptomEn: 'Operators lose 42 minutes/shift bending, reaching, or searching for bobbins and tools.',
      symptomAr: 'فقدان نحو ٤٢ دقيقة في الوردية للبحث عن مفاتيح الضبط أو المقصات أو البكرات.',
      countermeasureEn: 'Install 2S shadow boards at every loom/machine and ergonomic gravity-fed work tables in sewing.',
      countermeasureAr: 'تركيب لوحات الظل (Shadow Boards) للعدد بجوار كل ماكينة وطاولات مناولة مريحة هندسياً.',
      severityScore: 7,
      estimatedMonthlyLossEgp: 72000,
      targetReductionPct: 70,
    },
    {
      code: 'E',
      nameEn: 'Extra-Processing (Redundant Washing Baths & Manual Re-Inspection)',
      nameAr: 'المعالجة الزائدة (شطف متكرر غير محسوب وفحص يدوي مزدوج)',
      symptomEn: 'Using 4 hot-rinse baths instead of optimized counter-current rinsing and double manual folding.',
      symptomAr: 'استخدام حمامات غسيل إضافية غير لازمة وإعادة فحص وطي الأقمشة مرتين.',
      countermeasureEn: 'Standardize recipe SOPs (Standard Work) and embed inline quality inspection (Jidoka) at source.',
      countermeasureAr: 'توحيد وصفات التشغيل القياسية (SOP) وتفعيل الفحص الذاتي عند المنبع (Jidoka).',
      severityScore: 7,
      estimatedMonthlyLossEgp: 85000,
      targetReductionPct: 65,
    },
  ];

  const fiveSAuditItems: FiveSCheckItem[] = [
    {
      id: '5s-1',
      pillar: '1S_SORT',
      pillarTitleEn: '1S: Seiri (Sort)',
      pillarTitleAr: '١. التصنيف والفرز (Seiri)',
      criterionEn: 'All broken reeds, obsolete yarn cones, and expired auxiliaries are red-tagged and removed from the production floor.',
      criterionAr: 'إزالة كافة الأمشاط التالفة وبواقي الغزول الراكدة والكيماويات منتهية الصلاحية ببطاقات حمراء (Red Tag).',
      defaultScore: 3,
      standardRef: 'JIPM 5S / ISO 9001 Cl. 7.1.4',
    },
    {
      id: '5s-2',
      pillar: '1S_SORT',
      pillarTitleEn: '1S: Seiri (Sort)',
      pillarTitleAr: '١. التصنيف والفرز (Seiri)',
      criterionEn: 'Only active production lots and tools needed for the current shift are present at workstations.',
      criterionAr: 'وجود الخامات والعدد اللازمة للوردية الحالية فقط بجوار الماكينات.',
      defaultScore: 3,
      standardRef: 'Toyota Production System (TPS)',
    },
    {
      id: '5s-3',
      pillar: '2S_SET',
      pillarTitleEn: '2S: Seiton (Set in Order)',
      pillarTitleAr: '٢. الترتيب والتنظيم البصري (Seiton)',
      criterionEn: 'Floor aisles, WIP trolley bays, and yarn lot lanes are clearly painted with color-coded tape (Yellow=Aisle, Green=OK WIP, Red=Reject).',
      criterionAr: 'تخطيط ممرات الحركة ومناطق انتظار العربات بألوان معيارية (أصفر للممرات، أخضر للسليم، أحمر للمرفوض).',
      defaultScore: 3,
      standardRef: 'OSHA / Visual Factory Standard',
    },
    {
      id: '5s-4',
      pillar: '2S_SET',
      pillarTitleEn: '2S: Seiton (Set in Order)',
      pillarTitleAr: '٢. الترتيب والتنظيم البصري (Seiton)',
      criterionEn: 'Shadow boards installed for all loom/machine wrenches, gauges, and scissors (30-second retrieval rule).',
      criterionAr: 'لوحات ظل (Shadow Boards) لجميع المفاتيح وأدوات القياس بحيث يمكن الوصول لأي أداة في أقل من ٣٠ ثانية.',
      defaultScore: 2,
      standardRef: 'Lean Visual Management',
    },
    {
      id: '5s-5',
      pillar: '3S_SHINE',
      pillarTitleEn: '3S: Seiso (Shine & Inspect)',
      pillarTitleAr: '٣. التنظيف والفحص الوقائي (Seiso)',
      criterionEn: 'Cotton fly/lint is vacuumed on schedule; zero oil or dye leaks around gearboxes, stenter chains, or jet nozzles.',
      criterionAr: 'شفط زغب القطن دورياً؛ وانعدام أي تسريب للزيوت أو الصبغات لضمان عدم تبقيع الأقمشة.',
      defaultScore: 4,
      standardRef: 'TPM Pillar 1: Jishu Hozen',
    },
    {
      id: '5s-6',
      pillar: '3S_SHINE',
      pillarTitleEn: '3S: Seiso (Shine & Inspect)',
      pillarTitleAr: '٣. التنظيف والفحص الوقائي (Seiso)',
      criterionEn: 'Pressure gauges, temperature sensors, and optical weft feelers are clean and marked with green operating ranges.',
      criterionAr: 'نظافة عدادات الضغط والحرارة والحساسات البصرية مع وضع علامات خضراء وحمراء للنطاق المسموح.',
      defaultScore: 3,
      standardRef: 'TPM Visual Controls',
    },
    {
      id: '5s-7',
      pillar: '4S_STANDARDIZE',
      pillarTitleEn: '4S: Seiketsu (Standardize)',
      pillarTitleAr: '٤. التنميط وتوحيد المعايير (Seiketsu)',
      criterionEn: 'Bilingual One-Point Lessons (OPL) and Standard Operating Procedures (SOPs) displayed visibly at every machine group.',
      criterionAr: 'تعليق دروس النقطة الواحدة (OPL) وتعليمات التشغيل القياسية المصورة بجوار كل مجموعة ماكينات.',
      defaultScore: 3,
      standardRef: 'ISO 9001 Cl. 8.5.1',
    },
    {
      id: '5s-8',
      pillar: '4S_STANDARDIZE',
      pillarTitleEn: '4S: Seiketsu (Standardize)',
      pillarTitleAr: '٤. التنميط وتوحيد المعايير (Seiketsu)',
      criterionEn: 'Shift handover boards updated hourly with Target vs. Actual output, OEE %, and top defect causes.',
      criterionAr: 'تحديث لوحة متابعة الإنتاج بالساعة (الهدف مقابل الفعلي، OEE%، وأهم أسباب التوقف).',
      defaultScore: 3,
      standardRef: 'Shop-Floor Daily Management',
    },
    {
      id: '5s-9',
      pillar: '5S_SUSTAIN',
      pillarTitleEn: '5S: Shitsuke (Sustain)',
      pillarTitleAr: '٥. الاستدامة والانضباط الذاتي (Shitsuke)',
      criterionEn: 'Weekly leadership Gemba Walks conducted with scored 5S radar charts posted on the departmentSQDC board.',
      criterionAr: 'تنفيذ جولات Gemba أسبوعية من الإدارة ونشر نتائج تقييم 5S على لوحة القسم.',
      defaultScore: 3,
      standardRef: 'Shingo Operational Excellence',
    },
    {
      id: '5s-10',
      pillar: '5S_SUSTAIN',
      pillarTitleEn: '5S: Shitsuke (Sustain)',
      pillarTitleAr: '٥. الاستدامة والانضباط الذاتي (Shitsuke)',
      criterionEn: 'Operators submit at least 1 Kaizen improvement suggestion per month with recognition rewards.',
      criterionAr: 'مشاركة العمال في تقديم مقترحات تحسين كايزن شهرياً وتكريم أفضل تطبيق عملي.',
      defaultScore: 2,
      standardRef: 'Kaizen Teian System',
    },
  ];

  const smedTasks: SmedTaskItem[] = [
    {
      id: 'smed-1',
      taskEn: 'Fetch new warp beam / dye lot recipe & tools from central store',
      taskAr: 'إحضار المطواة الجديدة أو وصفة الصباغة والعدد من المخزن المركزي',
      originalCategory: 'INTERNAL',
      targetCategory: 'EXTERNAL',
      beforeMinutes: 25,
      afterMinutes: 0,
      improvementMethodEn: 'Convert to EXTERNAL: Pre-stage beam on trolley and kitted tool cart 60 min before loom run-out.',
      improvementMethodAr: 'تحويل إلى خطوة خارجية (External): تجهيز المطواة وعربة العدد بجوار الماكينة قبل انتهاء التشغيل بـ ٦٠ دقيقة.',
    },
    {
      id: 'smed-2',
      taskEn: 'Remove empty beam, clean reed/drop wires & vacuum lint',
      taskAr: 'فك المطواة الفارغة وتنظيف المشط والدروب واير وشفط الزغب',
      originalCategory: 'INTERNAL',
      targetCategory: 'INTERNAL',
      beforeMinutes: 30,
      afterMinutes: 14,
      improvementMethodEn: 'Deploy 2-person parallel pit-stop crew with quick-release beam clamps and high-suction vacuum.',
      improvementMethodAr: 'تنفيذ متوازٍ بفريق مزدوج مع مثبتات سريعة الفك (Quick-Release Clamps) وشفاط صناعي سريع.',
    },
    {
      id: 'smed-3',
      taskEn: 'Mount new warp beam & align harnesses / frames',
      taskAr: 'تركيب المطواة الجديدة وضبط الدرق والإطارات',
      originalCategory: 'INTERNAL',
      targetCategory: 'INTERNAL',
      beforeMinutes: 40,
      afterMinutes: 18,
      improvementMethodEn: 'Use standardized mechanical stop-pins and color-coded height gauges instead of manual trial-and-error.',
      improvementMethodAr: 'استخدام محددات قياس مسبقة المعايرة ومشابك تعليق سريعة بدلاً من الضبط اليدوي المتكرر.',
    },
    {
      id: 'smed-4',
      taskEn: 'Automatic warp tying / knotting (4,800 ends)',
      taskAr: 'عملية التطريح / عقد خيوط السداء أوتوماتيكياً (٤٨٠٠ فتلة)',
      originalCategory: 'INTERNAL',
      targetCategory: 'INTERNAL',
      beforeMinutes: 45,
      afterMinutes: 22,
      improvementMethodEn: 'Pre-comb and clamp warp sheet offline; calibrate Staubli tying machine speed and tension.',
      improvementMethodAr: 'تمشيط وتثبيت خيوط السداء مسبقاً خارج الماكينة ومعايرة ماكينة التطريح الأوتوماتيكية.',
    },
    {
      id: 'smed-5',
      taskEn: 'First-piece trial weaving, tension tuning & QA sign-off',
      taskAr: 'تشغيل المتر الأول التجريبي وضبط الشد واعتماد مراقب الجودة',
      originalCategory: 'INTERNAL',
      targetCategory: 'INTERNAL',
      beforeMinutes: 25,
      afterMinutes: 8,
      improvementMethodEn: 'Load digital loom recipe presets (warp tension, weft bar pressure) via QR code & empower inline QA sign-off.',
      improvementMethodAr: 'تحميل إعدادات الماكينة الرقمية مسبقاً عبر رمز QR وتفويض الفحص الفوري على النول.',
    },
  ];

  const workstations: WorkstationBalanceItem[] = [
    {
      id: 'ws-1',
      stationEn: 'Station 1: Precision CAD Panel Cutting & Lot Bundling',
      stationAr: 'محطة ١: القص الآلي وترقيم البندلات',
      cycleTimeSec: 38,
      operators: 2,
      skillGrade: 'A',
      vaSec: 33,
      nvaSec: 5,
    },
    {
      id: 'ws-2',
      stationEn: 'Station 2: Automated Edge Overlock & Side Seaming',
      stationAr: 'محطة ٢: أوفرلوك الحواف والخياطة الجانبية',
      cycleTimeSec: 46,
      operators: 3,
      skillGrade: 'B',
      vaSec: 40,
      nvaSec: 6,
    },
    {
      id: 'ws-3',
      stationEn: 'Station 3: Decorative Border / Jacquard Attachment (Bottleneck)',
      stationAr: 'محطة ٣: تركيب البرواز / الجاكار وتثبيت الزوايا (نقطة اختناق)',
      cycleTimeSec: 62,
      operators: 4,
      skillGrade: 'A',
      vaSec: 48,
      nvaSec: 14,
    },
    {
      id: 'ws-4',
      stationEn: 'Station 4: Care Label, Brand Tag & Bartack Reinforcement',
      stationAr: 'محطة ٤: تثبيت ليبل العناية والعلامة التجارية والفرماتورة',
      cycleTimeSec: 41,
      operators: 2,
      skillGrade: 'B',
      vaSec: 35,
      nvaSec: 6,
    },
    {
      id: 'ws-5',
      stationEn: 'Station 5: Thread Trimming, Light-Table Inspection & Metal Detection',
      stationAr: 'محطة ٥: تنظيف الخيوط والفحص الضوئي وكشف المعادن',
      cycleTimeSec: 49,
      operators: 3,
      skillGrade: 'B',
      vaSec: 41,
      nvaSec: 8,
    },
    {
      id: 'ws-6',
      stationEn: 'Station 6: Steam Pressing, Folding & Export Carton Barcode Packing',
      stationAr: 'محطة ٦: الكي بالبخار والطي والتعبئة بالباركود للتصدير',
      cycleTimeSec: 43,
      operators: 2,
      skillGrade: 'B',
      vaSec: 37,
      nvaSec: 6,
    },
  ];

  const pokaYokeLibrary: PokaYokeDevice[] = [
    {
      id: 'py-1',
      processEn: 'Creel Loading & Warping / Knitting',
      processAr: 'تغذية الكريل في التسدية والتريكو',
      defectPreventedEn: 'Mixed cotton yarn lots / twist direction causing horizontal or vertical barre after dyeing',
      defectPreventedAr: 'خلط لوطات الغزل أو اتجاه البرم مما يسبب عيوب التخطيط (Barre) بعد الصباغة',
      deviceTypeEn: 'UV Tint + Barcode Interlock Scanner',
      deviceTypeAr: 'فحص بالأشعة فوق البنفسجية + قارئ باركود مانع للتشغيل الخاطئ',
      mechanismEn: 'Operator scans cone lot barcode against creel sheet; UV lamp verifies fiber lot fugitive tint before tying.',
      mechanismAr: 'مسح باركود الكونة ومقارنته آلياً بأمر الشغل مع كشاف UV لمنع دخول أي كونة من لوط مختلف.',
      costEstimateEgp: 18500,
      roiMonths: 1.5,
    },
    {
      id: 'py-2',
      processEn: 'Jet / Overflow Reactive Dyeing',
      processAr: 'ماكينات الصباغة التفاعلية (Jet)',
      defectPreventedEn: 'Uneven dye strike (unlevelness) & shade variation ΔE > 0.8 due to manual alkali addition',
      defectPreventedAr: 'عدم تجانس الصباغة وتفاوت اللون نتيجة الإضافة اليدوية للصودا والملح',
      deviceTypeEn: 'Automated Progressive Dosing & pH/Temp PLC Interlock',
      deviceTypeAr: 'وحدة حقن تدريجي آلي مرتبطة بحساس pH والحرارة (PLC Interlock)',
      mechanismEn: 'Machine blocks alkali valve opening unless bath temperature is within 59–61°C and pH curve matches recipe.',
      mechanismAr: 'قفل صمام القلوي آلياً إذا لم تكن درجة حرارة الحمام بين ٥٩-٦١ مئوية ومنحنى pH مطابقاً للوصفة.',
      costEstimateEgp: 65000,
      roiMonths: 2.8,
    },
    {
      id: 'py-3',
      processEn: 'High-Speed Sewing & Hemming',
      processAr: 'خطوط الخياطة والحياكة السريعة',
      defectPreventedEn: 'Uneven hem width, twisted seams, and broken needle fragments in export cartons',
      defectPreventedAr: 'تفاوت عرض الثانيات والتواء الخياطة أو وجود بقايا إبر مكسورة',
      deviceTypeEn: 'Magnetic Edge-Guide Jig + Broken-Needle Exchange Log + Tunnel Metal Detector',
      deviceTypeAr: 'دليل حافة مغناطيسي + نظام استبدال الإبرة المكسورة بكافة أجزائها + بوابة كشف معادن',
      mechanismEn: 'Mechanical folder guides fabric edge automatically; conveyor stops & alarms if ferrous particle ≥ 0.8mm detected.',
      mechanismAr: 'مطواة ميكانيكية تضبط عرض الثانية تلقائياً مع توقف السير فوراً عند رصد أي جزء معدني ≥ ٠.٨ مم.',
      costEstimateEgp: 42000,
      roiMonths: 2.0,
    },
    {
      id: 'py-4',
      processEn: 'Stenter Finishing & Fabric Inspection',
      processAr: 'تجهيز الرام وفحص الأقمشة',
      defectPreventedEn: 'Weft bow/skew exceeding 2% tolerance and wrong width shipment',
      defectPreventedAr: 'اعوجاج اللحمة (Bow/Skew) بأكثر من ٢٪ أو شحن عرض قماش غير مطابق',
      deviceTypeEn: 'Optical Weft Straightener (Mahlo-style) + Ultrasonic Width Sensor',
      deviceTypeAr: 'حساس بصري لتعديل اللحمة أوتوماتيكياً + حساس قياس العرض بالموجات فوق الصوتية',
      mechanismEn: 'Optical cameras detect weft angle in real time and adjust bow/skew rollers automatically before heat-setting.',
      mechanismAr: 'كاميرات بصرية تقيس زاوية اللحمة لحظياً وتعدل سلندرات الاستعدال أوتوماتيكياً قبل التثبيت الحراري.',
      costEstimateEgp: 95000,
      roiMonths: 3.5,
    },
  ];

  const a3Report: LeanA3Report = {
    titleEn: `A3 Operational Turnaround: Eliminating Changeover Losses, Shade Rework & WIP Bottlenecks at ${factoryName}`,
    titleAr: `تقرير A3 القياسي: القضاء على فواقد التغيير وإعادة الصباغة واختناقات المخزون في ${factoryName}`,
    ownerRoleEn: 'VP of Operations & Continuous Improvement (Lean Sensei)',
    ownerRoleAr: 'مدير العمليات والتحسين المستمر (قائد اللين)',
    backgroundEn: `${factoryName} produces ${productFocus} for domestic and international buyers. Rising order variety and strict EU/US delivery windows require faster lead times, higher Right-First-Time (RFT) quality, and lower unit conversion costs.`,
    backgroundAr: `يقوم مصنع (${factoryName}) بإنتاج (${productFocus}). ومع زيادة تنوع الطلبيات التصديرية، تبرز الحاجة لتقليص زمن التوريد (Lead Time) ورفع جودة المرة الأولى (RFT) وخفض تكلفة التشغيل.`,
    currentStateEn: `Current OEE averages 64.8%, Process Cycle Efficiency (PCE) is below 14%, average changeover takes 162 minutes, and total WIP across departments exceeds 11 days (${primaryBottleneck}).`,
    currentStateAr: `يبلغ متوسط الكفاءة الكلية للماكينات (OEE) حالياً ٦٤.٨٪، وكفاءة دورة العمليات (PCE) أقل من ١٤٪، ومتوسط زمن التغيير ١٦٢ دقيقة، مع تراكم مخزون تحت التشغيل لأكثر من ١١ يوماً (${primaryBottleneck}).`,
    targetGoalEn: ' within 90 days: Raise OEE from 64.8% → 82.5%, cut SMED changeover time by 58%, reduce WIP lead time from 11.2 days → 4.5 days, and lift RFT quality to ≥ 96.5%.',
    targetGoalAr: 'خلال ٩٠ يوماً: رفع OEE من ٦٤.٨٪ إلى ٨٢.٥٪، وخفض زمن التغيير (SMED) بنسبة ٥٨٪، وتقليص زمن المخزون البيني من ١١.٢ يوم إلى ٤.٥ يوم، ورفع المطابقة من المرة الأولى إلى ٩٦.٥٪.',
    fiveWhys: [
      {
        whyLevel: 1,
        questionEn: 'Why is total customer order lead time taking 11.2 days instead of 4.5 days?',
        questionAr: 'لماذا يستغرق تنفيذ الطلبية ١١.٢ يوماً بدلاً من ٤.٥ يوم؟',
        answerEn: 'Large queues of WIP sit waiting for 48–72 hours between weaving, dyeing, and sewing/finishing.',
        answerAr: 'بسبب تراكم كميات كبيرة من القماش تحت التشغيل (WIP) لمدة ٤٨–٧٢ ساعة بين الأقسام.',
      },
      {
        whyLevel: 2,
        questionEn: 'Why do departments produce in large disconnected batches that create WIP queues?',
        questionAr: 'لماذا تنتج الأقسام بدفعات كبيرة منفصلة تسبب طوابير الانتظار؟',
        answerEn: 'Supervisors avoid machine changeovers because beam/lot setup takes over 160 minutes and shade approval is slow.',
        answerAr: 'يتجنب المشرفون تغيير التشغيلات لأن إعداد الماكينة يستغرق أكثر من ١٦٠ دقيقة وتأخر اعتماد اللون.',
      },
      {
        whyLevel: 3,
        questionEn: 'Why does changeover take 160+ minutes and why do 6.5% of dye batches need rework?',
        questionAr: 'لماذا يستغرق الإعداد ١٦٠ دقيقة ولماذا تحتاج ٦.٥٪ من التشغيلات لإعادة صباغة؟',
        answerEn: 'Preparation tasks (fetching beams, tools, weighing dyes) are done AFTER stopping the machine, and alkali is dosed manually.',
        answerAr: 'لأن تجهيز المطاوي والعدد ووزن الصبغات يتم بعد إيقاف الماكينة، كما تتم إضافة القلوي يدوياً.',
      },
      {
        whyLevel: 4,
        questionEn: 'Why are preparation tasks done internally and why is dosing not standardized?',
        questionAr: 'لماذا يتم التحضير أثناء توقف الماكينة ولماذا غاب التنميط القياسي؟',
        answerEn: 'No SMED separation checklist, no pre-staging Kanban trigger, and lack of visual Standard Work SOPs at the machine.',
        answerAr: 'لعدم تطبيق فصل الخطوات الداخلية والخارجية (SMED) وغياب إشارات كانبان وتعليمات العمل القياسية.',
      },
      {
        whyLevel: 5,
        questionEn: 'Why were SMED, Kanban, and Standard Work not sustained on the shop floor?',
        questionAr: 'لماذا لم يتم تفعيل واستدامة أنظمة SMED وكانبان والعمل القياسي في العنابر؟',
        answerEn: 'Root Cause: Lack of daily Tiered SQDC Gemba management boards, 5S shadow boards, and cross-functional Kaizen ownership.',
        answerAr: 'السبب الجذري: غياب لوحات الإدارة اليومية (SQDC) في صالة الإنتاج ولوحات 5S وفرق كايزن متعددة التخصصات.',
      },
    ],
    ishikawa: [
      {
        category: 'Machine',
        categoryAr: 'الماكينات والمعدات (Machine)',
        causesEn: [
          'Unplanned air-jet solenoid & weft cutter stops',
          'Manual alkali valve control instead of automated dosing curve',
          'Lack of quick-release warp beam clamps',
        ],
        causesAr: [
          'توقفات صمامات الهواء ومقصات اللحمة المفاجئة',
          'التحكم اليدوي في صمامات القلوي بدلاً من الحقن التدريجي',
          'عدم وجود مثبتات سريعة الفك للمطاوي',
        ],
      },
      {
        category: 'Method',
        categoryAr: 'طرق وأساليب العمل (Method)',
        causesEn: [
          'Internal & external setup steps mixed during changeover',
          'Push scheduling instead of Kanban pull supermarkets',
          'Missing One-Point Lessons (OPL) at bottleneck stations',
        ],
        causesAr: [
          'خلط خطوات التجهيز الخارجية مع الداخلية أثناء توقف الماكينة',
          'الإنتاج بنظام الدفع (Push) بدلاً من السحب (Kanban Pull)',
          'غياب دروس النقطة الواحدة (OPL) عند نقاط الاختناق',
        ],
      },
      {
        category: 'Material',
        categoryAr: 'الخامات والغزول (Material)',
        causesEn: [
          'Mixed yarn cone lots entering creel without UV/barcode check',
          'Inconsistent greige moisture content before dyeing',
          'Late staging of trims and packaging cartons',
        ],
        causesAr: [
          'دخول كونات غزل من لوطات مختلفة دون فحص باركود أو UV',
          'تفاوت نسبة رطوبة القماش الخام قبل الصباغة',
          'تأخر تحضير الإكسسوارات ومستلزمات التعبئة',
        ],
      },
      {
        category: 'Man',
        categoryAr: 'العمالة والمهارات (Man)',
        causesEn: [
          'Single-skilled operators unable to cover bottleneck stations',
          'Changeover performed by 1 technician instead of synchronized 2-person pit crew',
          'No daily 5-minute 5S & Autonomous Maintenance routine',
        ],
        causesAr: [
          'نقص التدريب المتقاطع للعمال لتغطية محطات الاختناق',
          'تنفيذ التغيير بواسطة فني واحد بدلاً من فريق متزامن',
          'غياب روتين الصيانة الذاتية (٥ دقائق يومياً) للمشغل',
        ],
      },
      {
        category: 'Measurement',
        categoryAr: 'القياس والمعايرة (Measurement)',
        causesEn: [
          'OEE losses not categorized by the Six Big Losses per shift',
          'Manual shade checking without D65 lightbox & ΔE digital log',
          'Missing hourly pitch board tracking on sewing/packing lines',
        ],
        causesAr: [
          'عدم تصنيف فواقد OEE الستة الكبرى في كل وردية',
          'فحص اللون بصرياً دون تسجيل رقمي لفرق اللون ΔE تحت إضاءة D65',
          'غياب متابعة الإنتاج بالساعة على خطوط الحياكة والتعبئة',
        ],
      },
      {
        category: 'Environment',
        categoryAr: 'بيئة العمل (Environment)',
        causesEn: [
          'Weaving hall relative humidity drifting outside 78–82% RH window',
          'Cotton lint accumulation on optical sensors',
          'Poor lighting (<500 Lux) at inline inspection points',
        ],
        causesAr: [
          'تذبذب الرطوبة النسبية في صالة النسيج خارج نطاق ٧٨–٨٢٪',
          'تراكم زغب القطن على الحساسات البصرية',
          'ضعف شدة الإضاءة (أقل من ٥٠٠ لوكس) في نقاط الفحص البيني',
        ],
      },
    ],
    countermeasures: [
      {
        actionEn: 'Execute SMED Pit-Stop Protocol: Externalize beam/dye preparation & install quick-release clamps',
        actionAr: 'تطبيق بروتوكول SMED السريع: تحويل تحضير المطاوي والصبغات لخطوات خارجية وتركيب مثبتات سريعة',
        ownerEn: 'Weaving & Dyeing Maintenance Leads',
        ownerAr: 'رؤساء صيانة النسيج والمصبغة',
        timelineEn: 'Days 1–30',
        timelineAr: 'الأيام ١–٣٠',
        expectedGainEn: 'Changeover time cut from 165 min → 62 min (-62%)',
        expectedGainAr: 'خفض زمن التغيير من ١٦٥ دقيقة إلى ٦٢ دقيقة (-٦٢٪)',
      },
      {
        actionEn: 'Deploy 5S Shadow Boards, Floor Color-Coding & Daily 5-Minute CLIT Autonomous Maintenance',
        actionAr: 'تركيب لوحات الظل 5S وتخطيط الأرضيات وتطبيق الصيانة الذاتية اليومية (CLIT)',
        ownerEn: 'Production Shift Supervisors',
        ownerAr: 'مشرفو الورديات الإنتاجية',
        timelineEn: 'Days 15–45',
        timelineAr: 'الأيام ١٥–٤٥',
        expectedGainEn: '+9.5% Availability & 70% reduction in tool search motion',
        expectedGainAr: 'رفع الإتاحة التشغيلية +٩.٥٪ وتقليل وقت البحث عن العدد ٧٠٪',
      },
      {
        actionEn: 'Launch 2-Bin Kanban Supermarkets & Line Re-Balancing across Cutting-Sewing-Packing',
        actionAr: 'تطبيق نظام كانبان (2-Bin Supermarket) وإعادة موازنة خطوط القص والخياطة والتعبئة',
        ownerEn: 'Industrial Engineering & Planning Team',
        ownerAr: 'فريق الهندسة الصناعية والتخطيط',
        timelineEn: 'Days 30–60',
        timelineAr: 'الأيام ٣٠–٦٠',
        expectedGainEn: 'WIP reduced from 11.2 → 4.5 days; Line Balance Efficiency ≥ 89%',
        expectedGainAr: 'خفض المخزون البيني من ١١.٢ إلى ٤.٥ يوم؛ ورفع كفاءة توازن الخط إلى ٨٩٪',
      },
      {
        actionEn: 'Install Poka-Yoke Barcode Lot Verification & Automated Progressive Alkali Dosing',
        actionAr: 'تركيب نظام Poka-Yoke لفحص باركود لوطات الغزل والحقن التدريجي الآلي للقلوي',
        ownerEn: 'Quality Assurance & Dyehouse Lab Director',
        ownerAr: 'مدير توكيد الجودة ومعمل المصبغة',
        timelineEn: 'Days 45–90',
        timelineAr: 'الأيام ٤٥–٩٠',
        expectedGainEn: 'Right-First-Time (RFT) lifted to 96.8%; saves EGP 185,000/month',
        expectedGainAr: 'رفع جودة المرة الأولى إلى ٩٦.٨٪ وتوفير ١٨٥,٠٠٠ ج.م شهرياً',
      },
    ],
    followUpStandardEn:
      'Lock gains via updated ISO 9001 Standard Work Combination Sheets (SWCS), daily 08:30 AM Gemba SQDC stand-up meetings, and monthly Shingo 5S + OEE leaderboard audits.',
    followUpStandardAr:
      'تثبيت المكاسب عبر تحديث بطاقات العمل القياسي (SWCS)، واجتماع Gemba الصباحي اليومي الساعة ٨:٣٠ أمام لوحة SQDC، والمراجعة الشهرية لمؤشر OEE و 5S.',
  };

  const hoshinMatrix: HoshinObjective[] = [
    {
      breakthrough3YrEn: 'Achieve World-Class 85% OEE & Top-Decile Cost Competitiveness in EU/US Export Markets',
      breakthrough3YrAr: 'الوصول للكفاءة العالمية (85% OEE) وأعلى تنافسية سعرية في أسواق التصدير الأوروبية والأمريكية',
      annualTargetEn: 'Lift mill-wide OEE from 64.8% to 82.5% and cut unit conversion cost by 16%',
      annualTargetAr: 'رفع متوسط OEE من ٦٤.٨٪ إلى ٨٢.٥٪ وخفض تكلفة التشغيل للوحدة بنسبة ١٦٪',
      shopFloorKaizenEn: 'Execute SMED on top 10 looms/jet-dyers + TPM Autonomous Maintenance Step 1–3',
      shopFloorKaizenAr: 'تطبيق SMED على أهم ١٠ ماكينات نسيج وصباغة + الصيانة الذاتية TPM',
      kpiMetricEn: 'OEE %, MTBF (hours), MTTR (minutes), Changeover Minutes',
      kpiMetricAr: 'نسبة OEE%، متوسط الوقت بين الأعطال MTBF، وزمن التغيير بالدقيقة',
      ownerEn: 'Plant Manager & Head of Maintenance',
      ownerAr: 'مدير المصنع ورئيس الصيانة',
    },
    {
      breakthrough3YrEn: 'Cut Order-to-Shipment Lead Time by 60% via Lean Pull Flow',
      breakthrough3YrAr: 'تقليص زمن التوريد للعملاء بنسبة ٦٠٪ عبر نظام التدفق والسحب الرشيق',
      annualTargetEn: 'Reduce WIP inventory from 11.2 days to 4.5 days and raise Process Cycle Efficiency > 28%',
      annualTargetAr: 'خفض مخزون تحت التشغيل من ١١.٢ يوم إلى ٤.٥ يوم ورفع كفاءة دورة العمليات فوق ٢٨٪',
      shopFloorKaizenEn: 'Install 2-Bin Kanban Supermarkets & U-Cell Line Balancing in Cutting/Sewing',
      shopFloorKaizenAr: 'إنشاء سوبرماركت كانبان وخلايا إنتاج على شكل U في القص والحياكة',
      kpiMetricEn: 'Total Lead Time (Days), WIP Turns/Year, Line Balance Efficiency %',
      kpiMetricAr: 'إجمالي زمن التوريد (أيام)، معدل دوران المخزون، وكفاءة توازن الخط %',
      ownerEn: 'Supply Chain & Industrial Engineering Lead',
      ownerAr: 'مدير التخطيط والهندسة الصناعية',
    },
    {
      breakthrough3YrEn: 'Zero-Defect Export Quality & 100% ZDHC / ISO 17025 Compliance',
      breakthrough3YrAr: 'جودة تصديرية صفرية العيوب وتوافق كامل مع معايير ZDHC و ISO 17025',
      annualTargetEn: 'Achieve ≥ 96.5% Right-First-Time (RFT) dyeing & sewing DHU < 1.2%',
      annualTargetAr: 'تحقيق نسبة مطابقة من المرة الأولى ≥ ٩٦.٥٪ وخفض عيوب الخياطة DHU تحت ١.٢٪',
      shopFloorKaizenEn: 'Poka-Yoke Barcode Lot Verification, Automated Alkali Dosing & Jidoka Andon Cord',
      shopFloorKaizenAr: 'فحص الباركود Poka-Yoke والحقن الآلي للقلوي ونظام الإيقاف الذاتي Jidoka',
      kpiMetricEn: 'RFT %, DHU %, Customer Claim Rate (<0.2%), Cost of Poor Quality (COPQ)',
      kpiMetricAr: 'نسبة RFT%، ومعدل العيوب DHU%، وتكلفة الجودة الرديئة COPQ',
      ownerEn: 'Quality Assurance Director',
      ownerAr: 'مدير توكيد الجودة والمعمل',
    },
  ];

  return {
    factoryName,
    department,
    productFocus,
    primaryBottleneck,
    generatedAt: new Date().toISOString(),
    vsmSteps,
    eightWastes,
    fiveSAuditItems,
    smedTasks,
    workstations,
    pokaYokeLibrary,
    a3Report,
    hoshinMatrix,
  };
}
