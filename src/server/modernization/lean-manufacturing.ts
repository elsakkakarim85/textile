/**
 * Expert-Level Lean Management & Lean Six Sigma Operational Excellence Engine
 * Covers 9 Comprehensive Pillars:
 * 1. Value Stream Mapping (VSM), Takt Time, Little's Law, Spaghetti Layout & 8 Wastes (DOWNTIME)
 * 2. 5S Workplace Audit, Red-Tag Digital Register, Visual Management & Gemba Walk Scoring
 * 3. TPM (Total Productive Maintenance), OEE, Six Big Losses, MTBF/MTTR, CLIT & SMED Pit-Stop
 * 4. Line Balancing, Yamazumi Chart, Standard Work Combination Sheet (SWCS) & ILUO Skill Matrix
 * 5. Kanban Pull System, Supermarket Sizing, Heijunka Box (EPEI) & Mizusumashi Water Spider
 * 6. Jidoka, Live Andon Board, Poka-Yoke (Mistake Proofing), Process FMEA (RPN) & 6M Ishikawa
 * 7. Lean Six Sigma DMAIC, SPC Control Charts, Process Capability (Cp/Cpk), DPMO & COPQ
 * 8. Lean Daily Management System (LDMS), Tiered SQDC Gemba Board & Leader Standard Work (LSW)
 * 9. Toyota-Style A3 Problem-Solving Report, Hoshin Kanri X-Matrix & Kaizen Blitz Charter
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
  distanceMeters: number;
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

export interface RedTagItem {
  id: string;
  tagCode: string;
  itemEn: string;
  itemAr: string;
  locationEn: string;
  locationAr: string;
  disposition: 'SCRAP_WASTE_EXCHANGE' | 'CENTRAL_STORE' | 'REPAIR_REUSE';
  floorAreaSavedM2: number;
  estimatedSalvageEgp: number;
}

export interface ClitCheckItem {
  id: string;
  code: 'C' | 'L' | 'I' | 'T';
  categoryEn: string;
  categoryAr: string;
  taskEn: string;
  taskAr: string;
  frequencyEn: string;
  frequencyAr: string;
  standardMinutes: number;
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
  manualSec: number;
  machineAutoSec: number;
  walkSec: number;
}

export type IluoLevel = 'I' | 'L' | 'U' | 'O';

export interface SkillMatrixOperator {
  id: string;
  operatorNameEn: string;
  operatorNameAr: string;
  roleEn: string;
  roleAr: string;
  skills: Record<string, IluoLevel>; // keyed by workstation id
}

export interface HeijunkaSlot {
  pitchTime: string;
  skuCode: string;
  skuNameEn: string;
  skuNameAr: string;
  colorTone: 'emerald' | 'blue' | 'amber' | 'purple';
  qtyUnits: number;
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

export interface FmeaItem {
  id: string;
  processStepEn: string;
  processStepAr: string;
  failureModeEn: string;
  failureModeAr: string;
  effectEn: string;
  effectAr: string;
  severity: number; // 1-10
  occurrence: number; // 1-10
  detection: number; // 1-10
  afterSeverity: number;
  afterOccurrence: number;
  afterDetection: number;
  recommendedActionEn: string;
  recommendedActionAr: string;
}

export interface SpcPreset {
  id: string;
  parameterEn: string;
  parameterAr: string;
  unit: string;
  lsl: number;
  target: number;
  usl: number;
  mean: number;
  stdDev: number;
  samples: number[];
}

export interface SqdcMetricRow {
  code: 'S' | 'Q' | 'D' | 'C' | 'P';
  dimensionEn: string;
  dimensionAr: string;
  kpiTargetEn: string;
  kpiTargetAr: string;
  currentActualEn: string;
  currentActualAr: string;
  countermeasureEn: string;
  countermeasureAr: string;
  daysStatus: ('GREEN' | 'RED')[];
}

export interface LeaderStandardWorkItem {
  tier: 'TIER_1_CELL' | 'TIER_2_DEPT' | 'TIER_3_PLANT';
  tierLabelEn: string;
  tierLabelAr: string;
  timeSlot: string;
  ownerEn: string;
  ownerAr: string;
  gembaFocusEn: string;
  gembaFocusAr: string;
  standardOutputEn: string;
  standardOutputAr: string;
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
  redTagItems: RedTagItem[];
  clitChecklist: ClitCheckItem[];
  smedTasks: SmedTaskItem[];
  workstations: WorkstationBalanceItem[];
  skillMatrix: SkillMatrixOperator[];
  heijunkaSchedule: HeijunkaSlot[];
  pokaYokeLibrary: PokaYokeDevice[];
  fmeaItems: FmeaItem[];
  spcPresets: SpcPreset[];
  sqdcBoard: SqdcMetricRow[];
  leaderStandardWork: LeaderStandardWorkItem[];
  a3Report: LeanA3Report;
  hoshinMatrix: HoshinObjective[];
}

export const LEAN_DEPARTMENTS: {
  id: LeanDepartmentId;
  labelEn: string;
  labelAr: string;
}[] = [
  {
    id: 'full_mill',
    labelEn: 'Full Integrated Textile Mill (Spinning → Packing)',
    labelAr: 'مصنع نسيج متكامل (من الغزل حتى التعبئة)',
  },
  {
    id: 'spinning',
    labelEn: 'Ring & Compact Spinning Mill',
    labelAr: 'مصنع الغزل الحلقي والمدمج (Compact)',
  },
  {
    id: 'weaving',
    labelEn: 'Warping, Sizing & High-Speed Air-Jet Weaving',
    labelAr: 'التسدية والتبويش والنسيج الهوائي السريع',
  },
  {
    id: 'knitting',
    labelEn: 'Circular & Flatbed Knitting Floor',
    labelAr: 'عنبر التريكو الدائري والمستطيل',
  },
  {
    id: 'dyeing_finishing',
    labelEn: 'Reactive Dyeing, Printing & Stenter Finishing',
    labelAr: 'المصبغة والطباعة والتجهيز النهائي (الرام)',
  },
  {
    id: 'cutting_sewing',
    labelEn: 'CAD Cutting, Sewing Lines & Garment Assembly',
    labelAr: 'القص الآلي وخطوط الخياطة وتجميع الملابس',
  },
  {
    id: 'quality_packing',
    labelEn: '4-Point Inspection, Folding & Export Packing',
    labelAr: 'فحص الجودة (4-Point) والطي والتعبئة للتصدير',
  },
];

function buildDepartmentVsmSteps(department: LeanDepartmentId): VsmProcessStep[] {
  if (department === 'spinning') {
    return [
      {
        id: 'step-1',
        stepNameEn: '1. Bale Plucking, Blowroom & Carding (Trützschler)',
        stepNameAr: '١. تفتيح البالات والتنظيف والكرد',
        cycleTimeSec: 36,
        changeoverMin: 45,
        uptimePct: 92,
        operators: 3,
        defectPct: 0.9,
        wipWaitHours: 24,
        valueAddedMin: 55,
        distanceMeters: 140,
      },
      {
        id: 'step-2',
        stepNameEn: '2. Breaker & Auto-Leveler Draw Frame',
        stepNameAr: '٢. السحب الأولي والسحب المحكوم آلياً (Auto-Leveler)',
        cycleTimeSec: 40,
        changeoverMin: 35,
        uptimePct: 90,
        operators: 3,
        defectPct: 1.1,
        wipWaitHours: 30,
        valueAddedMin: 45,
        distanceMeters: 110,
      },
      {
        id: 'step-3',
        stepNameEn: '3. Lap Former & High-Speed Combing (Giza Cotton)',
        stepNameAr: '٣. تحضير اللفات والتمشيط الفائق لقطن جيزة',
        cycleTimeSec: 52,
        changeoverMin: 65,
        uptimePct: 86,
        operators: 4,
        defectPct: 1.5,
        wipWaitHours: 42,
        valueAddedMin: 70,
        distanceMeters: 165,
      },
      {
        id: 'step-4',
        stepNameEn: '4. Speed Frame (Simplex Roving)',
        stepNameAr: '٤. ماكينات البرم الابتدائي (السيمبلكس)',
        cycleTimeSec: 58,
        changeoverMin: 80,
        uptimePct: 84,
        operators: 6,
        defectPct: 1.9,
        wipWaitHours: 48,
        valueAddedMin: 95,
        distanceMeters: 190,
      },
      {
        id: 'step-5',
        stepNameEn: '5. Compact Ring Spinning (1,200 Spindles / Frame)',
        stepNameAr: '٥. الغزل الحلقي المدمج (Compact Ring Spinning)',
        cycleTimeSec: 66,
        changeoverMin: 120,
        uptimePct: 82,
        operators: 8,
        defectPct: 2.8,
        wipWaitHours: 64,
        valueAddedMin: 210,
        distanceMeters: 220,
      },
      {
        id: 'step-6',
        stepNameEn: '6. Autoconer Winding (Uster Quantum Clearer) & Conditioning',
        stepNameAr: '٦. التدوير الآلي (أوتوكونر بحساسات Uster) والترطيب',
        cycleTimeSec: 44,
        changeoverMin: 40,
        uptimePct: 91,
        operators: 5,
        defectPct: 1.0,
        wipWaitHours: 28,
        valueAddedMin: 85,
        distanceMeters: 130,
      },
    ];
  }

  if (department === 'dyeing_finishing') {
    return [
      {
        id: 'step-1',
        stepNameEn: '1. Greige Batching, Sewing & Singeing',
        stepNameAr: '١. تجميع لوطات الخام والحياكة والحريق (Singeing)',
        cycleTimeSec: 38,
        changeoverMin: 35,
        uptimePct: 91,
        operators: 4,
        defectPct: 1.1,
        wipWaitHours: 32,
        valueAddedMin: 50,
        distanceMeters: 150,
      },
      {
        id: 'step-2',
        stepNameEn: '2. Continuous Desizing, Scouring & Bleaching',
        stepNameAr: '٢. إزالة البوش والغلي والتبييض المستمر',
        cycleTimeSec: 49,
        changeoverMin: 55,
        uptimePct: 87,
        operators: 4,
        defectPct: 1.7,
        wipWaitHours: 40,
        valueAddedMin: 90,
        distanceMeters: 175,
      },
      {
        id: 'step-3',
        stepNameEn: '3. Low-Liquor Ratio (1:6) Jet Reactive Dyeing',
        stepNameAr: '٣. الصباغة التفاعلية منخفضة المنسوب (1:6 Jet)',
        cycleTimeSec: 70,
        changeoverMin: 115,
        uptimePct: 80,
        operators: 6,
        defectPct: 4.5,
        wipWaitHours: 72,
        valueAddedMin: 240,
        distanceMeters: 210,
      },
      {
        id: 'step-4',
        stepNameEn: '4. Hydro-Extraction, Slitting & Rope Opening',
        stepNameAr: '٤. العصر الطارد المركزي وفتح العرض',
        cycleTimeSec: 41,
        changeoverMin: 30,
        uptimePct: 90,
        operators: 3,
        defectPct: 1.2,
        wipWaitHours: 24,
        valueAddedMin: 45,
        distanceMeters: 120,
      },
      {
        id: 'step-5',
        stepNameEn: '5. Stenter Heat-Setting, Weft Straightening & Softening',
        stepNameAr: '٥. التثبيت الحراري بالرام واستعدال اللحمة والتنعيم',
        cycleTimeSec: 54,
        changeoverMin: 60,
        uptimePct: 85,
        operators: 5,
        defectPct: 2.3,
        wipWaitHours: 36,
        valueAddedMin: 75,
        distanceMeters: 160,
      },
      {
        id: 'step-6',
        stepNameEn: '6. Sanforizing, Spectrophotometer ΔE Check & Roll Packing',
        stepNameAr: '٦. السانفورايز وفحص الطيف اللوني ΔE والتغليف',
        cycleTimeSec: 46,
        changeoverMin: 30,
        uptimePct: 93,
        operators: 4,
        defectPct: 1.3,
        wipWaitHours: 20,
        valueAddedMin: 60,
        distanceMeters: 115,
      },
    ];
  }

  if (department === 'cutting_sewing') {
    return [
      {
        id: 'step-1',
        stepNameEn: '1. Fabric Relaxation & CAD Marker Nesting',
        stepNameAr: '١. إراحة رولات القماش وتصميم الماركر الآلي CAD',
        cycleTimeSec: 34,
        changeoverMin: 25,
        uptimePct: 94,
        operators: 3,
        defectPct: 0.8,
        wipWaitHours: 24,
        valueAddedMin: 45,
        distanceMeters: 110,
      },
      {
        id: 'step-2',
        stepNameEn: '2. Automated Spreading & CNC Multi-Ply Cutting',
        stepNameAr: '٢. الفرش الأوتوماتيكي والقص الرقمي متعدد الطبقات',
        cycleTimeSec: 44,
        changeoverMin: 40,
        uptimePct: 89,
        operators: 4,
        defectPct: 1.4,
        wipWaitHours: 36,
        valueAddedMin: 60,
        distanceMeters: 145,
      },
      {
        id: 'step-3',
        stepNameEn: '3. Panel Numbering, Fuse-Pressing & Kitting Supermarket',
        stepNameAr: '٣. ترقيم الأجزاء وكبس الفازلين وتجهيز السوبرماركت',
        cycleTimeSec: 39,
        changeoverMin: 30,
        uptimePct: 91,
        operators: 5,
        defectPct: 1.1,
        wipWaitHours: 30,
        valueAddedMin: 40,
        distanceMeters: 125,
      },
      {
        id: 'step-4',
        stepNameEn: '4. Modular U-Cell Sewing & Jacquard Border Attachment',
        stepNameAr: '٤. خلية الخياطة على شكل U وتركيب البراويز',
        cycleTimeSec: 64,
        changeoverMin: 75,
        uptimePct: 83,
        operators: 16,
        defectPct: 3.6,
        wipWaitHours: 54,
        valueAddedMin: 140,
        distanceMeters: 230,
      },
      {
        id: 'step-5',
        stepNameEn: '5. Inline AQL 1.5 Light-Table Inspection & Thread Trimming',
        stepNameAr: '٥. الفحص الضوئي البيني AQL 1.5 وتنظيف الخيوط',
        cycleTimeSec: 48,
        changeoverMin: 20,
        uptimePct: 93,
        operators: 6,
        defectPct: 2.1,
        wipWaitHours: 22,
        valueAddedMin: 50,
        distanceMeters: 95,
      },
      {
        id: 'step-6',
        stepNameEn: '6. Steam Pressing, Tunnel Metal Detection & Barcode Carton Pack',
        stepNameAr: '٦. الكي بالبخار وبوابة كشف المعادن والتعبئة بالباركود',
        cycleTimeSec: 42,
        changeoverMin: 25,
        uptimePct: 95,
        operators: 6,
        defectPct: 0.7,
        wipWaitHours: 18,
        valueAddedMin: 55,
        distanceMeters: 90,
      },
    ];
  }

  return [
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
      distanceMeters: 145,
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
      distanceMeters: 180,
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
      distanceMeters: 240,
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
      distanceMeters: 195,
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
      distanceMeters: 130,
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
      distanceMeters: 120,
    },
  ];
}

export function synthesizeLeanBlueprint(params: {
  factoryName?: string;
  department?: LeanDepartmentId;
  productFocus?: string;
  primaryBottleneck?: string;
}): LeanBlueprintReport {
  const factoryName = (params.factoryName || 'El-Mahalla Premier Textile Mill').trim();
  const department: LeanDepartmentId = params.department || 'full_mill';
  const productFocus = (
    params.productFocus || '100% Egyptian Giza 86 Combed Cotton Fabrics & Home Textiles'
  ).trim();
  const primaryBottleneck = (
    params.primaryBottleneck ||
    'Long changeover times (SMED), WIP accumulation between weaving and dyeing, and shade rework'
  ).trim();

  const vsmSteps = buildDepartmentVsmSteps(department);

  const eightWastes: LeanWasteItem[] = [
    {
      code: 'D',
      nameEn: 'Defects (Off-Shade ΔE > 0.8, Weaving Barre, Seam Puckering)',
      nameAr: 'العيوب وإعادة التشغيل (تفاوت اللون، الباري، عيوب الخياطة)',
      symptomEn: `Re-dyeing batches (6.5% rate) and 4-Point fabric penalties on ${productFocus}`,
      symptomAr: `إعادة صباغة نحو ٦.٥٪ من اللوطات وخصومات نقاط الجودة في ${productFocus}`,
      countermeasureEn:
        'Implement automated pH/alkali dosing curves, spectrophotometer lab-to-bulk correlation, and Poka-Yoke cone-lot barcode scanning.',
      countermeasureAr:
        'تطبيق الحقن التدريجي الآلي للقلوي، ومطابقة طيف الألوان مخبرياً، وماسح الباركود للوطات الغزل (Poka-Yoke).',
      severityScore: 9,
      estimatedMonthlyLossEgp: 185000,
      targetReductionPct: 70,
    },
    {
      code: 'O',
      nameEn: 'Overproduction (Weaving/Dyeing Speculative Batch Sizes)',
      nameAr: 'الإفراط في الإنتاج (تشغيل كميات أكبر من طلب العميل)',
      symptomEn:
        'Running 5,000m minimum batches when export order requires 3,200m, tying up working capital.',
      symptomAr: 'تشغيل دفعات كبيرة لتقليل التغيير مما يكدس المخزون الراكد ويجمد السيولة.',
      countermeasureEn:
        'Transition to Heijunka leveled pull scheduling and reduce changeover time via SMED so smaller lots are profitable.',
      countermeasureAr:
        'التحول إلى نظام السحب (Kanban Pull) وجدولة Heijunka مع تقليل وقت تغيير المطواة عبر SMED.',
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
      countermeasureEn:
        'Deploy Andon light/WhatsApp alert escalation, pre-stage warp beams 2 hours before run-out, and pre-weigh dyestuffs in dispensary.',
      countermeasureAr:
        'تركيب نظام إنذار Andon ضوئي/رقمي، وتجهيز المطاوي والكيماويات خارجياً قبل انتهاء التشغيلة بـ ساعتين.',
      severityScore: 9,
      estimatedMonthlyLossEgp: 165000,
      targetReductionPct: 65,
    },
    {
      code: 'N',
      nameEn: 'Non-Utilized Talent (Lack of Multi-Skill Cross-Training)',
      nameAr: 'عدم استغلال مهارات العاملين (غياب التدريب المتقاطع)',
      symptomEn:
        'Single-operation dependency causing line bottlenecks when key operators are absent.',
      symptomAr: 'اعتماد كل مرحلة على عامل واحد دون مصفوفة مهارات متعددة (ILUO Skill Matrix).',
      countermeasureEn:
        'Establish a 4×4 ILUO Cross-Training Skill Matrix and incentivize daily operator Kaizen idea cards.',
      countermeasureAr:
        'تطبيق مصفوفة المهارات المتعددة (ILUO) وحوافز شهرية لبطاقات تحسين كايزن من العمال.',
      severityScore: 6,
      estimatedMonthlyLossEgp: 55000,
      targetReductionPct: 75,
    },
    {
      code: 'T',
      nameEn: 'Transportation (Back-and-Forth Greige & Dyed Batch Trolleys)',
      nameAr: 'النقل والحركة الزائدة للعربات واللوطات بين الأقسام',
      symptomEn:
        'Fabric rolls travel >1,010 meters across disconnected buildings before final inspection.',
      symptomAr: 'انتقال رولات القماش لمسافة تتجاوز ١٠١٠ متراً بين الأقسام والمخازن قبل الفحص.',
      countermeasureEn:
        'Re-layout into U-shaped cellular flow for cutting-sewing-packing and mark dedicated FIFO Mizusumashi tugger lanes.',
      countermeasureAr:
        'إعادة تخطيط المسارات على شكل حرف U وتحديد ممرات FIFO مباشرة بين الصباغة والتجهيز.',
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
      countermeasureEn:
        'Introduce 2-Bin Kanban Supermarkets with strict WIP caps (max 2.5 days buffer between processes).',
      countermeasureAr:
        'تطبيق نظام السوبرماركت وبطاقات كانبان بحد أقصى ٢.٥ يوم مخزون أمان بين المراحل.',
      severityScore: 8,
      estimatedMonthlyLossEgp: 140000,
      targetReductionPct: 60,
    },
    {
      code: 'M',
      nameEn: 'Motion (Searching for Tools, Scissors, Cones & Pattern Templates)',
      nameAr: 'الحركة غير الضرورية للعمال (البحث عن العدد والمقصات والبكرات)',
      symptomEn:
        'Operators lose 42 minutes/shift bending, reaching, or searching for bobbins and tools.',
      symptomAr: 'فقدان نحو ٤٢ دقيقة في الوردية للبحث عن مفاتيح الضبط أو المقصات أو البكرات.',
      countermeasureEn:
        'Install 2S shadow boards at every loom/machine and ergonomic gravity-fed work tables in sewing.',
      countermeasureAr:
        'تركيب لوحات الظل (Shadow Boards) للعدد بجوار كل ماكينة وطاولات مناولة مريحة هندسياً.',
      severityScore: 7,
      estimatedMonthlyLossEgp: 72000,
      targetReductionPct: 70,
    },
    {
      code: 'E',
      nameEn: 'Extra-Processing (Redundant Washing Baths & Manual Re-Inspection)',
      nameAr: 'المعالجة الزائدة (شطف متكرر غير محسوب وفحص يدوي مزدوج)',
      symptomEn:
        'Using 4 hot-rinse baths instead of optimized counter-current rinsing and double manual folding.',
      symptomAr: 'استخدام حمامات غسيل إضافية غير لازمة وإعادة فحص وطي الأقمشة مرتين.',
      countermeasureEn:
        'Standardize recipe SOPs (Standard Work) and embed inline quality inspection (Jidoka) at source.',
      countermeasureAr:
        'توحيد وصفات التشغيل القياسية (SOP) وتفعيل الفحص الذاتي عند المنبع (Jidoka).',
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
      criterionEn:
        'All broken reeds, obsolete yarn cones, and expired auxiliaries are red-tagged and removed from the production floor.',
      criterionAr:
        'إزالة كافة الأمشاط التالفة وبواقي الغزول الراكدة والكيماويات منتهية الصلاحية ببطاقات حمراء (Red Tag).',
      defaultScore: 3,
      standardRef: 'JIPM 5S / ISO 9001 Cl. 7.1.4',
    },
    {
      id: '5s-2',
      pillar: '1S_SORT',
      pillarTitleEn: '1S: Seiri (Sort)',
      pillarTitleAr: '١. التصنيف والفرز (Seiri)',
      criterionEn:
        'Only active production lots and tools needed for the current shift are present at workstations.',
      criterionAr: 'وجود الخامات والعدد اللازمة للوردية الحالية فقط بجوار الماكينات.',
      defaultScore: 3,
      standardRef: 'Toyota Production System (TPS)',
    },
    {
      id: '5s-3',
      pillar: '2S_SET',
      pillarTitleEn: '2S: Seiton (Set in Order)',
      pillarTitleAr: '٢. الترتيب والتنظيم البصري (Seiton)',
      criterionEn:
        'Floor aisles, WIP trolley bays, and yarn lot lanes are clearly painted with color-coded tape (Yellow=Aisle, Green=OK WIP, Red=Reject).',
      criterionAr:
        'تخطيط ممرات الحركة ومناطق انتظار العربات بألوان معيارية (أصفر للممرات، أخضر للسليم، أحمر للمرفوض).',
      defaultScore: 3,
      standardRef: 'OSHA / Visual Factory Standard',
    },
    {
      id: '5s-4',
      pillar: '2S_SET',
      pillarTitleEn: '2S: Seiton (Set in Order)',
      pillarTitleAr: '٢. الترتيب والتنظيم البصري (Seiton)',
      criterionEn:
        'Shadow boards installed for all loom/machine wrenches, gauges, and scissors (30-second retrieval rule).',
      criterionAr:
        'لوحات ظل (Shadow Boards) لجميع المفاتيح وأدوات القياس بحيث يمكن الوصول لأي أداة في أقل من ٣٠ ثانية.',
      defaultScore: 2,
      standardRef: 'Lean Visual Management',
    },
    {
      id: '5s-5',
      pillar: '3S_SHINE',
      pillarTitleEn: '3S: Seiso (Shine & Inspect)',
      pillarTitleAr: '٣. التنظيف والفحص الوقائي (Seiso)',
      criterionEn:
        'Cotton fly/lint is vacuumed on schedule; zero oil or dye leaks around gearboxes, stenter chains, or jet nozzles.',
      criterionAr:
        'شفط زغب القطن دورياً؛ وانعدام أي تسريب للزيوت أو الصبغات لضمان عدم تبقيع الأقمشة.',
      defaultScore: 4,
      standardRef: 'TPM Pillar 1: Jishu Hozen',
    },
    {
      id: '5s-6',
      pillar: '3S_SHINE',
      pillarTitleEn: '3S: Seiso (Shine & Inspect)',
      pillarTitleAr: '٣. التنظيف والفحص الوقائي (Seiso)',
      criterionEn:
        'Pressure gauges, temperature sensors, and optical weft feelers are clean and marked with green operating ranges.',
      criterionAr:
        'نظافة عدادات الضغط والحرارة والحساسات البصرية مع وضع علامات خضراء وحمراء للنطاق المسموح.',
      defaultScore: 3,
      standardRef: 'TPM Visual Controls',
    },
    {
      id: '5s-7',
      pillar: '4S_STANDARDIZE',
      pillarTitleEn: '4S: Seiketsu (Standardize)',
      pillarTitleAr: '٤. التنميط وتوحيد المعايير (Seiketsu)',
      criterionEn:
        'Bilingual One-Point Lessons (OPL) and Standard Operating Procedures (SOPs) displayed visibly at every machine group.',
      criterionAr:
        'تعليق دروس النقطة الواحدة (OPL) وتعليمات التشغيل القياسية المصورة بجوار كل مجموعة ماكينات.',
      defaultScore: 3,
      standardRef: 'ISO 9001 Cl. 8.5.1',
    },
    {
      id: '5s-8',
      pillar: '4S_STANDARDIZE',
      pillarTitleEn: '4S: Seiketsu (Standardize)',
      pillarTitleAr: '٤. التنميط وتوحيد المعايير (Seiketsu)',
      criterionEn:
        'Shift handover boards updated hourly with Target vs. Actual output, OEE %, and top defect causes.',
      criterionAr:
        'تحديث لوحة متابعة الإنتاج بالساعة (الهدف مقابل الفعلي، OEE%، وأهم أسباب التوقف).',
      defaultScore: 3,
      standardRef: 'Shop-Floor Daily Management',
    },
    {
      id: '5s-9',
      pillar: '5S_SUSTAIN',
      pillarTitleEn: '5S: Shitsuke (Sustain)',
      pillarTitleAr: '٥. الاستدامة والانضباط الذاتي (Shitsuke)',
      criterionEn:
        'Weekly leadership Gemba Walks conducted with scored 5S radar charts posted on the department SQDC board.',
      criterionAr:
        'تنفيذ جولات Gemba أسبوعية من الإدارة ونشر نتائج تقييم 5S على لوحة القسم.',
      defaultScore: 3,
      standardRef: 'Shingo Operational Excellence',
    },
    {
      id: '5s-10',
      pillar: '5S_SUSTAIN',
      pillarTitleEn: '5S: Shitsuke (Sustain)',
      pillarTitleAr: '٥. الاستدامة والانضباط الذاتي (Shitsuke)',
      criterionEn:
        'Operators submit at least 1 Kaizen improvement suggestion per month with recognition rewards.',
      criterionAr: 'مشاركة العمال في تقديم مقترحات تحسين كايزن شهرياً وتكريم أفضل تطبيق عملي.',
      defaultScore: 2,
      standardRef: 'Kaizen Teian System',
    },
  ];

  const redTagItems: RedTagItem[] = [
    {
      id: 'rt-1',
      tagCode: 'RT-2026-014',
      itemEn: '420 kg Odd-Lot Combed Cotton Cones (>9 months idle)',
      itemAr: '٤٢٠ كجم بواقي كونات غزل قطن ممشط راكدة (> ٩ أشهر)',
      locationEn: 'Weaving Creel Aisle B-3',
      locationAr: 'ممر الكريل في عنبر النسيج B-3',
      disposition: 'SCRAP_WASTE_EXCHANGE',
      floorAreaSavedM2: 14,
      estimatedSalvageEgp: 38500,
    },
    {
      id: 'rt-2',
      tagCode: 'RT-2026-019',
      itemEn: '18 Corroded Loom Reeds & 6 Idle Warp Beam Trolleys',
      itemAr: '١٨ مشط نول متآكل و٦ عربات مطاوي غير مستخدمة',
      locationEn: 'Preparation Bay East Corner',
      locationAr: 'الركن الشرقي لصالة التحضيرات',
      disposition: 'REPAIR_REUSE',
      floorAreaSavedM2: 22,
      estimatedSalvageEgp: 29000,
    },
    {
      id: 'rt-3',
      tagCode: 'RT-2026-023',
      itemEn: '680 kg Selvedge Trim & Cutting Room Cotton Offcuts',
      itemAr: '٦٨٠ كجم عوادم براسل وقصاقيص قطنية من صالة القص',
      locationEn: 'Cutting & Sewing Staging Zone',
      locationAr: 'منطقة تجميع صالة القص والخياطة',
      disposition: 'SCRAP_WASTE_EXCHANGE',
      floorAreaSavedM2: 18,
      estimatedSalvageEgp: 19400,
    },
    {
      id: 'rt-4',
      tagCode: 'RT-2026-028',
      itemEn: '35 Spare Sewing Folders, Guides & Gauge Fixtures',
      itemAr: '٣٥ دليل ومطواة خياطة احتياطية مبعثرة على الطاولات',
      locationEn: 'Sewing Line #2 Workbenches',
      locationAr: 'طاولات خط الخياطة رقم ٢',
      disposition: 'CENTRAL_STORE',
      floorAreaSavedM2: 6,
      estimatedSalvageEgp: 14200,
    },
  ];

  const clitChecklist: ClitCheckItem[] = [
    {
      id: 'clit-1',
      code: 'C',
      categoryEn: 'Clean (Seiso Inspection)',
      categoryAr: 'التنظيف والفحص (Clean)',
      taskEn: 'Vacuum cotton lint from optical weft feelers, tension discs, and inverter cooling fans',
      taskAr: 'شفط زغب القطن من حساسات اللحمة البصرية وأقراص الشد ومراوح التبريد',
      frequencyEn: 'Every Shift (Start)',
      frequencyAr: 'بداية كل وردية',
      standardMinutes: 4,
    },
    {
      id: 'clit-2',
      code: 'L',
      categoryEn: 'Lubricate (Tribo-Care)',
      categoryAr: 'التزييت والتشحيم القياسي (Lubricate)',
      taskEn: 'Verify auto-lube oil sight-glass level and apply food-grade non-staining grease to cam followers',
      taskAr: 'فحص منسوب الزيت الزجاجي وتشحيم الكامات بشحم لا يترك بقعاً على القماش',
      frequencyEn: 'Daily (08:15 AM)',
      frequencyAr: 'يومياً (٨:١٥ ص)',
      standardMinutes: 3,
    },
    {
      id: 'clit-3',
      code: 'I',
      categoryEn: 'Inspect (Sensory & Gauge Check)',
      categoryAr: 'الفحص البصري والحسي (Inspect)',
      taskEn: 'Check compressed air pressure (6.2 bar green zone), steam traps, and pH probe calibration',
      taskAr: 'مراجعة ضغط الهواء المضغوط (٦.٢ بار بالمنطقة الخضراء) ومصائد البخار ومعايرة حساس pH',
      frequencyEn: 'Every Shift',
      frequencyAr: 'في كل وردية',
      standardMinutes: 3,
    },
    {
      id: 'clit-4',
      code: 'T',
      categoryEn: 'Tighten (Zero Vibration)',
      categoryAr: 'الربط والتثبيت (Tighten)',
      taskEn: 'Verify match-marks on warp beam locks, reed holder bolts, and sewing needle bar clamps',
      taskAr: 'التأكد من علامات التطابق (Match-Marks) لمثبتات المطواة ومسامير المشط وعمود الإبرة',
      frequencyEn: 'Weekly / At Changeover',
      frequencyAr: 'أسبوعياً / عند التغيير',
      standardMinutes: 4,
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
      improvementMethodEn:
        'Convert to EXTERNAL: Pre-stage beam on trolley and kitted tool cart 60 min before loom run-out.',
      improvementMethodAr:
        'تحويل إلى خطوة خارجية (External): تجهيز المطواة وعربة العدد بجوار الماكينة قبل انتهاء التشغيل بـ ٦٠ دقيقة.',
    },
    {
      id: 'smed-2',
      taskEn: 'Remove empty beam, clean reed/drop wires & vacuum lint',
      taskAr: 'فك المطواة الفارغة وتنظيف المشط والدروب واير وشفط الزغب',
      originalCategory: 'INTERNAL',
      targetCategory: 'INTERNAL',
      beforeMinutes: 30,
      afterMinutes: 14,
      improvementMethodEn:
        'Deploy 2-person parallel pit-stop crew with quick-release beam clamps and high-suction vacuum.',
      improvementMethodAr:
        'تنفيذ متوازٍ بفريق مزدوج مع مثبتات سريعة الفك (Quick-Release Clamps) وشفاط صناعي سريع.',
    },
    {
      id: 'smed-3',
      taskEn: 'Mount new warp beam & align harnesses / frames',
      taskAr: 'تركيب المطواة الجديدة وضبط الدرق والإطارات',
      originalCategory: 'INTERNAL',
      targetCategory: 'INTERNAL',
      beforeMinutes: 40,
      afterMinutes: 18,
      improvementMethodEn:
        'Use standardized mechanical stop-pins and color-coded height gauges instead of manual trial-and-error.',
      improvementMethodAr:
        'استخدام محددات قياس مسبقة المعايرة ومشابك تعليق سريعة بدلاً من الضبط اليدوي المتكرر.',
    },
    {
      id: 'smed-4',
      taskEn: 'Automatic warp tying / knotting (4,800 ends)',
      taskAr: 'عملية التطريح / عقد خيوط السداء أوتوماتيكياً (٤٨٠٠ فتلة)',
      originalCategory: 'INTERNAL',
      targetCategory: 'INTERNAL',
      beforeMinutes: 45,
      afterMinutes: 22,
      improvementMethodEn:
        'Pre-comb and clamp warp sheet offline; calibrate Staubli tying machine speed and tension.',
      improvementMethodAr:
        'تمشيط وتثبيت خيوط السداء مسبقاً خارج الماكينة ومعايرة ماكينة التطريح الأوتوماتيكية.',
    },
    {
      id: 'smed-5',
      taskEn: 'First-piece trial weaving, tension tuning & QA sign-off',
      taskAr: 'تشغيل المتر الأول التجريبي وضبط الشد واعتماد مراقب الجودة',
      originalCategory: 'INTERNAL',
      targetCategory: 'INTERNAL',
      beforeMinutes: 25,
      afterMinutes: 8,
      improvementMethodEn:
        'Load digital loom recipe presets (warp tension, weft bar pressure) via QR code & empower inline QA sign-off.',
      improvementMethodAr:
        'تحميل إعدادات الماكينة الرقمية مسبقاً عبر رمز QR وتفويض الفحص الفوري على النول.',
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
      manualSec: 16,
      machineAutoSec: 18,
      walkSec: 4,
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
      manualSec: 22,
      machineAutoSec: 19,
      walkSec: 5,
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
      manualSec: 34,
      machineAutoSec: 20,
      walkSec: 8,
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
      manualSec: 21,
      machineAutoSec: 15,
      walkSec: 5,
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
      manualSec: 28,
      machineAutoSec: 15,
      walkSec: 6,
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
      manualSec: 23,
      machineAutoSec: 16,
      walkSec: 4,
    },
  ];

  const skillMatrix: SkillMatrixOperator[] = [
    {
      id: 'op-1',
      operatorNameEn: 'Mahmoud El-Sayed',
      operatorNameAr: 'محمود السيد',
      roleEn: 'Senior Line Cell Technician',
      roleAr: 'فني أول خلية الإنتاج',
      skills: { 'ws-1': 'O', 'ws-2': 'U', 'ws-3': 'O', 'ws-4': 'L', 'ws-5': 'U', 'ws-6': 'I' },
    },
    {
      id: 'op-2',
      operatorNameEn: 'Fatma Abdel-Rahman',
      operatorNameAr: 'فاطمة عبد الرحمن',
      roleEn: 'Master Jacquard & Hemming Specialist',
      roleAr: 'مشرفة خياطة وجاكار',
      skills: { 'ws-1': 'L', 'ws-2': 'O', 'ws-3': 'O', 'ws-4': 'O', 'ws-5': 'U', 'ws-6': 'L' },
    },
    {
      id: 'op-3',
      operatorNameEn: 'Ahmed Hassan',
      operatorNameAr: 'أحمد حسن',
      roleEn: 'Multi-Craft Operator',
      roleAr: 'مشغل متعدد المهارات',
      skills: { 'ws-1': 'U', 'ws-2': 'U', 'ws-3': 'L', 'ws-4': 'U', 'ws-5': 'I', 'ws-6': 'U' },
    },
    {
      id: 'op-4',
      operatorNameEn: 'Nourhan Ibrahim',
      operatorNameAr: 'نورهان إبراهيم',
      roleEn: 'Quality & Finishing Operator',
      roleAr: 'فنية فحص وتشطيب نهائي',
      skills: { 'ws-1': 'I', 'ws-2': 'L', 'ws-3': 'I', 'ws-4': 'U', 'ws-5': 'O', 'ws-6': 'O' },
    },
  ];

  const heijunkaSchedule: HeijunkaSlot[] = [
    {
      pitchTime: '08:00 – 08:30',
      skuCode: 'SKU-A (Giza 86 White Sateen 300TC)',
      skuNameEn: 'White Hotel Sateen Duvet Set',
      skuNameAr: 'طقم لحاف فندقي ساتان أبيض ٣٠٠ غرزة',
      colorTone: 'emerald',
      qtyUnits: 40,
    },
    {
      pitchTime: '08:30 – 09:00',
      skuCode: 'SKU-B (Reactive Navy Sateen 300TC)',
      skuNameEn: 'Navy Dyed Export Sheet Set',
      skuNameAr: 'طقم ملاية مصبوغ كحلي للتصدير',
      colorTone: 'blue',
      qtyUnits: 40,
    },
    {
      pitchTime: '09:00 – 09:30',
      skuCode: 'SKU-A (Giza 86 White Sateen 300TC)',
      skuNameEn: 'White Hotel Sateen Duvet Set',
      skuNameAr: 'طقم لحاف فندقي ساتان أبيض ٣٠٠ غرزة',
      colorTone: 'emerald',
      qtyUnits: 40,
    },
    {
      pitchTime: '09:30 – 10:00',
      skuCode: 'SKU-C (Jacquard Stripe King Pillowcase)',
      skuNameEn: 'Jacquard Border Pillowcase Pair',
      skuNameAr: 'طقم كيس مخدة جاكار مقلم',
      colorTone: 'amber',
      qtyUnits: 40,
    },
    {
      pitchTime: '10:00 – 10:30',
      skuCode: 'SKU-A (Giza 86 White Sateen 300TC)',
      skuNameEn: 'White Hotel Sateen Duvet Set',
      skuNameAr: 'طقم لحاف فندقي ساتان أبيض ٣٠٠ غرزة',
      colorTone: 'emerald',
      qtyUnits: 40,
    },
    {
      pitchTime: '10:30 – 11:00',
      skuCode: 'SKU-B (Reactive Navy Sateen 300TC)',
      skuNameEn: 'Navy Dyed Export Sheet Set',
      skuNameAr: 'طقم ملاية مصبوغ كحلي للتصدير',
      colorTone: 'blue',
      qtyUnits: 40,
    },
    {
      pitchTime: '11:00 – 11:30',
      skuCode: 'SKU-D (Organic Ecru Fitted Sheet)',
      skuNameEn: 'GOTS Organic Cotton Fitted Sheet',
      skuNameAr: 'ملاية بأستك قطن عضوي GOTS',
      colorTone: 'purple',
      qtyUnits: 40,
    },
    {
      pitchTime: '11:30 – 12:00',
      skuCode: 'SKU-A (Giza 86 White Sateen 300TC)',
      skuNameEn: 'White Hotel Sateen Duvet Set',
      skuNameAr: 'طقم لحاف فندقي ساتان أبيض ٣٠٠ غرزة',
      colorTone: 'emerald',
      qtyUnits: 40,
    },
  ];

  const pokaYokeLibrary: PokaYokeDevice[] = [
    {
      id: 'py-1',
      processEn: 'Creel Loading & Warping / Knitting',
      processAr: 'تغذية الكريل في التسدية والتريكو',
      defectPreventedEn:
        'Mixed cotton yarn lots / twist direction causing horizontal or vertical barre after dyeing',
      defectPreventedAr:
        'خلط لوطات الغزل أو اتجاه البرم مما يسبب عيوب التخطيط (Barre) بعد الصباغة',
      deviceTypeEn: 'UV Tint + Barcode Interlock Scanner',
      deviceTypeAr: 'فحص بالأشعة فوق البنفسجية + قارئ باركود مانع للتشغيل الخاطئ',
      mechanismEn:
        'Operator scans cone lot barcode against creel sheet; UV lamp verifies fiber lot fugitive tint before tying.',
      mechanismAr:
        'مسح باركود الكونة ومقارنته آلياً بأمر الشغل مع كشاف UV لمنع دخول أي كونة من لوط مختلف.',
      costEstimateEgp: 18500,
      roiMonths: 1.5,
    },
    {
      id: 'py-2',
      processEn: 'Jet / Overflow Reactive Dyeing',
      processAr: 'ماكينات الصباغة التفاعلية (Jet)',
      defectPreventedEn:
        'Uneven dye strike (unlevelness) & shade variation ΔE > 0.8 due to manual alkali addition',
      defectPreventedAr:
        'عدم تجانس الصباغة وتفاوت اللون نتيجة الإضافة اليدوية للصودا والملح',
      deviceTypeEn: 'Automated Progressive Dosing & pH/Temp PLC Interlock',
      deviceTypeAr: 'وحدة حقن تدريجي آلي مرتبطة بحساس pH والحرارة (PLC Interlock)',
      mechanismEn:
        'Machine blocks alkali valve opening unless bath temperature is within 59–61°C and pH curve matches recipe.',
      mechanismAr:
        'قفل صمام القلوي آلياً إذا لم تكن درجة حرارة الحمام بين ٥٩-٦١ مئوية ومنحنى pH مطابقاً للوصفة.',
      costEstimateEgp: 65000,
      roiMonths: 2.8,
    },
    {
      id: 'py-3',
      processEn: 'High-Speed Sewing & Hemming',
      processAr: 'خطوط الخياطة والحياكة السريعة',
      defectPreventedEn:
        'Uneven hem width, twisted seams, and broken needle fragments in export cartons',
      defectPreventedAr: 'تفاوت عرض الثانيات والتواء الخياطة أو وجود بقايا إبر مكسورة',
      deviceTypeEn: 'Magnetic Edge-Guide Jig + Broken-Needle Exchange Log + Tunnel Metal Detector',
      deviceTypeAr: 'دليل حافة مغناطيسي + نظام استبدال الإبرة المكسورة بكافة أجزائها + بوابة كشف معادن',
      mechanismEn:
        'Mechanical folder guides fabric edge automatically; conveyor stops & alarms if ferrous particle ≥ 0.8mm detected.',
      mechanismAr:
        'مطواة ميكانيكية تضبط عرض الثانية تلقائياً مع توقف السير فوراً عند رصد أي جزء معدني ≥ ٠.٨ مم.',
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
      mechanismEn:
        'Optical cameras detect weft angle in real time and adjust bow/skew rollers automatically before heat-setting.',
      mechanismAr:
        'كاميرات بصرية تقيس زاوية اللحمة لحظياً وتعدل سلندرات الاستعدال أوتوماتيكياً قبل التثبيت الحراري.',
      costEstimateEgp: 95000,
      roiMonths: 3.5,
    },
  ];

  const fmeaItems: FmeaItem[] = [
    {
      id: 'fmea-1',
      processStepEn: 'Creel Loading & Warping',
      processStepAr: 'تغذية الكريل والتسدية',
      failureModeEn: 'Mixing cones from different spinning lots (Ne 30/1)',
      failureModeAr: 'خلط كونات غزل من لوطات مختلفة على نفس المطواة',
      effectEn: 'Severe warp streak / barre visible only after dyeing (100% batch downgrade)',
      effectAr: 'ظهور عيب تخطيط طولي (Barre) بعد الصباغة ورفض اللوط بالكامل',
      severity: 9,
      occurrence: 5,
      detection: 6,
      afterSeverity: 9,
      afterOccurrence: 1,
      afterDetection: 2,
      recommendedActionEn: 'Barcode Cone Interlock + UV Fugitive Tint Verification at Creel',
      recommendedActionAr: 'قفل آلي بالباركود مع فحص الصبغة الفلورية المؤقتة بالأشعة UV',
    },
    {
      id: 'fmea-2',
      processStepEn: 'Reactive Jet Dyeing',
      processStepAr: 'الصباغة التفاعلية (Jet)',
      failureModeEn: 'Rapid manual soda ash addition & bath pH spike > 11.2',
      failureModeAr: 'إضافة الصودا يدوياً بسرعة وارتفاع pH الحمام فوق ١١.٢',
      effectEn: 'Unlevel dyeing & shade ΔE > 1.4 requiring stripping/re-dyeing',
      effectAr: 'عدم تجانس اللون وارتفاع ΔE فوق ١.٤ مما يتطلب سحب اللون وإعادة الصباغة',
      severity: 8,
      occurrence: 6,
      detection: 5,
      afterSeverity: 8,
      afterOccurrence: 2,
      afterDetection: 2,
      recommendedActionEn: 'PLC-controlled progressive dosing curve interlocked with inline pH sensor',
      recommendedActionAr: 'منحنى حقن تدريجي مبرمج PLC ومرتبط بحساس pH لحظي',
    },
    {
      id: 'fmea-3',
      processStepEn: 'Stenter Heat-Setting',
      processStepAr: 'التثبيت الحراري بالرام',
      failureModeEn: 'Over-drying cotton fabric (< 4% residual moisture) & skewed weft',
      failureModeAr: 'التجفيف الزائد للقماش (رطوبة أقل من ٤٪) واعوجاج اللحمة',
      effectEn: 'Harsh hand-feel, tearing strength loss (-18%) & skewed cut panels',
      effectAr: 'خشونة الملمس وضعف قوة الشد (-١٨٪) والتواء الأجزاء المقصوصة',
      severity: 7,
      occurrence: 5,
      detection: 5,
      afterSeverity: 7,
      afterOccurrence: 2,
      afterDetection: 2,
      recommendedActionEn: 'Exhaust humidity conductivity control + Optical Weft Straightener',
      recommendedActionAr: 'حساس التحكم في رطوبة القماش الخارجة + جهاز استعدال اللحمة البصري',
    },
    {
      id: 'fmea-4',
      processStepEn: 'Garment Sewing & Export Packing',
      processStepAr: 'الخياطة والتعبئة للتصدير',
      failureModeEn: 'Broken needle tip left inside hemmed duvet/garment',
      failureModeAr: 'بقاء جزء من إبرة مكسورة داخل المنتج النهائي',
      effectEn: 'Critical EU/US buyer safety recall & zero-tolerance customs rejection',
      effectAr: 'رفض الشحنة بالكامل لمخالفة معايير سلامة المستهلك الدولية',
      severity: 10,
      occurrence: 3,
      detection: 5,
      afterSeverity: 10,
      afterOccurrence: 1,
      afterDetection: 1,
      recommendedActionEn: '100% Broken-Needle Fragment Board + Conveyor Tunnel Metal Detector',
      recommendedActionAr: 'لوحة مطابقة أجزاء الإبرة المكسورة ١٠٠٪ + بوابة كشف المعادن النفقية',
    },
  ];

  const spcPresets: SpcPreset[] = [
    {
      id: 'gsm',
      parameterEn: 'Finished Fabric Basis Weight (GSM)',
      parameterAr: 'وزن المتر المربع للقماش المجهز (GSM)',
      unit: 'g/m²',
      lsl: 174,
      target: 180,
      usl: 186,
      mean: 180.4,
      stdDev: 1.35,
      samples: [179.8, 180.5, 181.2, 179.4, 180.1, 181.6, 180.3, 179.9, 180.8, 180.2, 179.7, 180.4],
    },
    {
      id: 'yarn_ne',
      parameterEn: 'Combed Cotton Yarn Count (Ne 30/1)',
      parameterAr: 'نمرة الخيط القطني الممشط (Ne 30/1)',
      unit: 'Ne',
      lsl: 29.4,
      target: 30.0,
      usl: 30.6,
      mean: 30.05,
      stdDev: 0.14,
      samples: [29.95, 30.08, 30.12, 29.91, 30.04, 30.18, 30.02, 29.98, 30.09, 30.01, 29.96, 30.05],
    },
    {
      id: 'delta_e',
      parameterEn: 'Spectrophotometer Shade Tolerance (CMC ΔE)',
      parameterAr: 'فرق الدرجة اللونية بالمطياف الضوئي (ΔE)',
      unit: 'ΔE',
      lsl: 0.0,
      target: 0.35,
      usl: 0.8,
      mean: 0.38,
      stdDev: 0.09,
      samples: [0.32, 0.41, 0.36, 0.45, 0.39, 0.34, 0.42, 0.37, 0.31, 0.4, 0.35, 0.38],
    },
  ];

  const sqdcBoard: SqdcMetricRow[] = [
    {
      code: 'S',
      dimensionEn: 'Safety & Ergonomics (Zero Harm)',
      dimensionAr: 'السلامة والصحة المهنية (Safety)',
      kpiTargetEn: '0 Lost-Time Injuries / 100% Machine Guard Interlocks',
      kpiTargetAr: 'صفر إصابات عمل / فحص حواجز الأمان ١٠٠٪',
      currentActualEn: '14 Days Accident-Free Streak',
      currentActualAr: '١٤ يوماً متتالية بدون إصابات أو حوادث',
      countermeasureEn: 'Daily 5-min LOTO (Lockout/Tagout) & nip-guard check before shift start',
      countermeasureAr: 'فحص أقفال الأمان (LOTO) وحواجز السلندرات يومياً قبل بدء الوردية',
      daysStatus: [
        'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN',
        'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN',
      ],
    },
    {
      code: 'Q',
      dimensionEn: 'Quality (Right-First-Time & 4-Point)',
      dimensionAr: 'الجودة من المرة الأولى (Quality)',
      kpiTargetEn: 'RFT ≥ 96.5% | Sewing DHU ≤ 1.5%',
      kpiTargetAr: 'مطابقة المرة الأولى ≥ ٩٦.٥٪ | عيوب الخياطة ≤ ١.٥٪',
      currentActualEn: 'RFT 95.8% (1 off-shade batch on Day 9)',
      currentActualAr: '٩٥.٨٪ (انحراف لوني واحد في اليوم التاسع)',
      countermeasureEn: 'Recalibrate alkali dosing valve #2 and verify cone lot barcode scan',
      countermeasureAr: 'إعادة معايرة صمام القلوي رقم ٢ وتدقيق مسح باركود لوط الغزل',
      daysStatus: [
        'GREEN', 'GREEN', 'RED', 'GREEN', 'GREEN', 'GREEN', 'GREEN',
        'GREEN', 'RED', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN',
      ],
    },
    {
      code: 'D',
      dimensionEn: 'Delivery & Takt Schedule Attainment',
      dimensionAr: 'الالتزام بالتسليم وزمن التاكت (Delivery)',
      kpiTargetEn: 'On-Time In-Full (OTIF) ≥ 98% | SMED ≤ 65 min',
      kpiTargetAr: 'التسليم في الموعد ≥ ٩٨٪ | زمن تغيير التشغيلة ≤ ٦٥ دقيقة',
      currentActualEn: '96.4% Schedule Attainment',
      currentActualAr: '٩٦.٤٪ التزام بجدول Heijunka اليومي',
      countermeasureEn: 'Pre-stage warp beam & dyestuff cart 60 min ahead via Water Spider route',
      countermeasureAr: 'تجهيز المطواة وعربة الصبغات قبل ٦٠ دقيقة عبر مسار المزود (Water Spider)',
      daysStatus: [
        'GREEN', 'GREEN', 'GREEN', 'RED', 'GREEN', 'GREEN', 'GREEN',
        'GREEN', 'GREEN', 'GREEN', 'RED', 'GREEN', 'GREEN', 'GREEN',
      ],
    },
    {
      code: 'C',
      dimensionEn: 'Cost, OEE & Resource Efficiency',
      dimensionAr: 'التكلفة وكفاءة الماكينات والطاقة (Cost)',
      kpiTargetEn: 'OEE ≥ 82.5% | Steam & kWh/kg within Target',
      kpiTargetAr: 'كفاءة OEE ≥ ٨٢.٥٪ | استهلاك البخار والكهرباء ضمن المعيار',
      currentActualEn: 'OEE 79.4% (+14.6% vs baseline)',
      currentActualAr: 'كفاءة OEE الحالية ٧٩.٤٪ (+١٤.٦٪ تحسن)',
      countermeasureEn: 'Repair compressed-air quick couplings on Weaving Bay B (saves 11% kWh)',
      countermeasureAr: 'إصلاح وصلات الهواء المضغوط السريعة في صالة النسيج (يوفر ١١٪ كهرباء)',
      daysStatus: [
        'RED', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'RED', 'GREEN',
        'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN',
      ],
    },
    {
      code: 'P',
      dimensionEn: 'People, 5S & Kaizen Teian Ideas',
      dimensionAr: 'الأفراد والانضباط 5S ومقترحات كايزن (People)',
      kpiTargetEn: '5S Score ≥ 85% | ≥ 2 Cross-Skilled Operators/Station',
      kpiTargetAr: 'تقييم 5S ≥ ٨٥٪ | وجود عاملين مؤهلين لكل محطة (ILUO)',
      currentActualEn: '18 Operator Kaizen Cards Implemented This Month',
      currentActualAr: 'تنفيذ ١٨ مقترح كايزن من العمال هذا الشهر',
      countermeasureEn: 'Complete 15-min daily cross-training rotation on Bottleneck Station #3',
      countermeasureAr: 'إتمام تدريب متقاطع ١٥ دقيقة يومياً على محطة الاختناق رقم ٣',
      daysStatus: [
        'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN',
        'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN',
      ],
    },
  ];

  const leaderStandardWork: LeaderStandardWorkItem[] = [
    {
      tier: 'TIER_1_CELL',
      tierLabelEn: 'Tier 1: Cell / Line Team Leader Stand-Up',
      tierLabelAr: 'المستوى ١: اجتماع قائد الخط / الخلية مع العمال',
      timeSlot: '08:00 – 08:10 AM (Every Shift)',
      ownerEn: 'Cell Team Leader & Machine Operators',
      ownerAr: 'مشرف الخلية وعمال التشغيل',
      gembaFocusEn: 'Verify CLIT 5-min autonomous maintenance, check 5S shadow boards, review hourly Pitch target & yesterday defects.',
      gembaFocusAr: 'مراجعة الصيانة الذاتية CLIT ولوحات الظل 5S وهدف الإنتاج بالساعة وعيوب الأمس.',
      standardOutputEn: 'Updated Hourly Pitch Board & Immediate Andon Escalation Log',
      standardOutputAr: 'تحديث لوحة الإنتاج بالساعة وسجل استجابات Andon الفورية',
    },
    {
      tier: 'TIER_2_DEPT',
      tierLabelEn: 'Tier 2: Department Gemba Walk & SQDC Review',
      tierLabelAr: 'المستوى ٢: جولة الجيمبا لرئيس القسم أمام لوحة SQDC',
      timeSlot: '09:00 – 09:20 AM (Daily)',
      ownerEn: 'Department Manager, Maintenance Lead & QA Engineer',
      ownerAr: 'مدير القسم ورئيس الصيانة ومهندس الجودة',
      gembaFocusEn: 'Review Red SQDC items from last 24h, inspect Supermarket Kanban buffer levels, and assign 5-Why root-cause owners.',
      gembaFocusAr: 'مراجعة النقاط الحمراء في لوحة SQDC ومستوى مخزون السوبرماركت وتكليف مسؤولي تحليل 5-Whys.',
      standardOutputEn: '24-Hour Countermeasure Containment & SMED Pit-Stop Schedule',
      standardOutputAr: 'خطة الإجراءات التصحيحية خلال ٢٤ ساعة وجدول تغييرات SMED',
    },
    {
      tier: 'TIER_3_PLANT',
      tierLabelEn: 'Tier 3: Plant Obeya & Value-Stream Alignment',
      tierLabelAr: 'المستوى ٣: اجتماع إدارة المصنع (غرفة Obeya)',
      timeSlot: '10:30 – 11:00 AM (Daily / Weekly)',
      ownerEn: 'Plant Director, IE Manager, Supply Chain & Lab Heads',
      ownerAr: 'مدير المصنع ومدير الهندسة الصناعية والتخطيط والمعمل',
      gembaFocusEn: 'Track A3 90-day projects, Hoshin Kanri KPIs (OEE, Lead Time, COPQ), and cross-department pull bottlenecks.',
      gembaFocusAr: 'متابعة مشاريع A3 ومؤشرات هوشين كانري (OEE، زمن التوريد، تكلفة الجودة) وتكامل الأقسام.',
      standardOutputEn: 'Signed A3 Charter Updates & Resource Allocation Decisions',
      standardOutputAr: 'تحديث تقارير A3 المعتمدة وقرارات توفير الموارد والدعم الفني',
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
    targetGoalEn:
      'Within 90 days: Raise OEE from 64.8% → 82.5%, cut SMED changeover time by 58%, reduce WIP lead time from 11.2 days → 4.5 days, and lift RFT quality to ≥ 96.5%.',
    targetGoalAr:
      'خلال ٩٠ يوماً: رفع OEE من ٦٤.٨٪ إلى ٨٢.٥٪، وخفض زمن التغيير (SMED) بنسبة ٥٨٪، وتقليص زمن المخزون البيني من ١١.٢ يوم إلى ٤.٥ يوم، ورفع المطابقة من المرة الأولى إلى ٩٦.٥٪.',
    fiveWhys: [
      {
        whyLevel: 1,
        questionEn: 'Why is total customer order lead time taking 11.2 days instead of 4.5 days?',
        questionAr: 'لماذا يستغرق تنفيذ الطلبية ١١.٢ يوماً بدلاً من ٤.٥ يوم؟',
        answerEn:
          'Large queues of WIP sit waiting for 48–72 hours between weaving, dyeing, and sewing/finishing.',
        answerAr: 'بسبب تراكم كميات كبيرة من القماش تحت التشغيل (WIP) لمدة ٤٨–٧٢ ساعة بين الأقسام.',
      },
      {
        whyLevel: 2,
        questionEn: 'Why do departments produce in large disconnected batches that create WIP queues?',
        questionAr: 'لماذا تنتج الأقسام بدفعات كبيرة منفصلة تسبب طوابير الانتظار؟',
        answerEn:
          'Supervisors avoid machine changeovers because beam/lot setup takes over 160 minutes and shade approval is slow.',
        answerAr:
          'يتجنب المشرفون تغيير التشغيلات لأن إعداد الماكينة يستغرق أكثر من ١٦٠ دقيقة وتأخر اعتماد اللون.',
      },
      {
        whyLevel: 3,
        questionEn: 'Why does changeover take 160+ minutes and why do 6.5% of dye batches need rework?',
        questionAr: 'لماذا يستغرق الإعداد ١٦٠ دقيقة ولماذا تحتاج ٦.٥٪ من التشغيلات لإعادة صباغة؟',
        answerEn:
          'Preparation tasks (fetching beams, tools, weighing dyes) are done AFTER stopping the machine, and alkali is dosed manually.',
        answerAr:
          'لأن تجهيز المطاوي والعدد ووزن الصبغات يتم بعد إيقاف الماكينة، كما تتم إضافة القلوي يدوياً.',
      },
      {
        whyLevel: 4,
        questionEn: 'Why are preparation tasks done internally and why is dosing not standardized?',
        questionAr: 'لماذا يتم التحضير أثناء توقف الماكينة ولماذا غاب التنميط القياسي؟',
        answerEn:
          'No SMED separation checklist, no pre-staging Kanban trigger, and lack of visual Standard Work SOPs at the machine.',
        answerAr:
          'لعدم تطبيق فصل الخطوات الداخلية والخارجية (SMED) وغياب إشارات كانبان وتعليمات العمل القياسية.',
      },
      {
        whyLevel: 5,
        questionEn: 'Why were SMED, Kanban, and Standard Work not sustained on the shop floor?',
        questionAr: 'لماذا لم يتم تفعيل واستدامة أنظمة SMED وكانبان والعمل القياسي في العنابر؟',
        answerEn:
          'Root Cause: Lack of daily Tiered SQDC Gemba management boards, 5S shadow boards, and cross-functional Kaizen ownership.',
        answerAr:
          'السبب الجذري: غياب لوحات الإدارة اليومية (SQDC) في صالة الإنتاج ولوحات 5S وفرق كايزن متعددة التخصصات.',
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
        actionEn:
          'Execute SMED Pit-Stop Protocol: Externalize beam/dye preparation & install quick-release clamps',
        actionAr:
          'تطبيق بروتوكول SMED السريع: تحويل تحضير المطاوي والصبغات لخطوات خارجية وتركيب مثبتات سريعة',
        ownerEn: 'Weaving & Dyeing Maintenance Leads',
        ownerAr: 'رؤساء صيانة النسيج والمصبغة',
        timelineEn: 'Days 1–30',
        timelineAr: 'الأيام ١–٣٠',
        expectedGainEn: 'Changeover time cut from 165 min → 62 min (-62%)',
        expectedGainAr: 'خفض زمن التغيير من ١٦٥ دقيقة إلى ٦٢ دقيقة (-٦٢٪)',
      },
      {
        actionEn:
          'Deploy 5S Shadow Boards, Floor Color-Coding & Daily 5-Minute CLIT Autonomous Maintenance',
        actionAr:
          'تركيب لوحات الظل 5S وتخطيط الأرضيات وتطبيق الصيانة الذاتية اليومية (CLIT)',
        ownerEn: 'Production Shift Supervisors',
        ownerAr: 'مشرفو الورديات الإنتاجية',
        timelineEn: 'Days 15–45',
        timelineAr: 'الأيام ١٥–٤٥',
        expectedGainEn: '+9.5% Availability & 70% reduction in tool search motion',
        expectedGainAr: 'رفع الإتاحة التشغيلية +٩.٥٪ وتقليل وقت البحث عن العدد ٧٠٪',
      },
      {
        actionEn:
          'Launch 2-Bin Kanban Supermarkets & Line Re-Balancing across Cutting-Sewing-Packing',
        actionAr:
          'تطبيق نظام كانبان (2-Bin Supermarket) وإعادة موازنة خطوط القص والخياطة والتعبئة',
        ownerEn: 'Industrial Engineering & Planning Team',
        ownerAr: 'فريق الهندسة الصناعية والتخطيط',
        timelineEn: 'Days 30–60',
        timelineAr: 'الأيام ٣٠–٦٠',
        expectedGainEn: 'WIP reduced from 11.2 → 4.5 days; Line Balance Efficiency ≥ 89%',
        expectedGainAr: 'خفض المخزون البيني من ١١.٢ إلى ٤.٥ يوم؛ ورفع كفاءة توازن الخط إلى ٨٩٪',
      },
      {
        actionEn:
          'Install Poka-Yoke Barcode Lot Verification & Automated Progressive Alkali Dosing',
        actionAr:
          'تركيب نظام Poka-Yoke لفحص باركود لوطات الغزل والحقن التدريجي الآلي للقلوي',
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
      breakthrough3YrEn:
        'Achieve World-Class 85% OEE & Top-Decile Cost Competitiveness in EU/US Export Markets',
      breakthrough3YrAr:
        'الوصول للكفاءة العالمية (85% OEE) وأعلى تنافسية سعرية في أسواق التصدير الأوروبية والأمريكية',
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
      annualTargetEn:
        'Reduce WIP inventory from 11.2 days to 4.5 days and raise Process Cycle Efficiency > 28%',
      annualTargetAr:
        'خفض مخزون تحت التشغيل من ١١.٢ يوم إلى ٤.٥ يوم ورفع كفاءة دورة العمليات فوق ٢٨٪',
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
      shopFloorKaizenEn:
        'Poka-Yoke Barcode Lot Verification, Automated Alkali Dosing & Jidoka Andon Cord',
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
    redTagItems,
    clitChecklist,
    smedTasks,
    workstations,
    skillMatrix,
    heijunkaSchedule,
    pokaYokeLibrary,
    fmeaItems,
    spcPresets,
    sqdcBoard,
    leaderStandardWork,
    a3Report,
    hoshinMatrix,
  };
}
