import { tr, Locale } from '@/lib/i18n-inline';

// M1 Digital Maturity & Industry 4.0 Readiness
export type Dimension = 'digital' | 'production' | 'quality' | 'sustainability' | 'market' | 'people';

export const DIMENSIONS: { id: Dimension; en: string; ar: string }[] = [
  { id: 'digital', en: 'Digital & Data', ar: 'الرقمية والبيانات' },
  { id: 'production', en: 'Smart Production', ar: 'الإنتاج الذكي' },
  { id: 'quality', en: 'Quality & Traceability', ar: 'الجودة والتتبع' },
  { id: 'sustainability', en: 'Green & Sustainable', ar: 'الاستدامة والبيئة' },
  { id: 'market', en: 'Market & Export', ar: 'السوق والتصدير' },
  { id: 'people', en: 'People & Skills', ar: 'الكوادر والمهارات' },
];

export interface Question {
  id: string;
  dimension: Dimension;
  questionEn: string;
  questionAr: string;
  optionsEn: string[];
  optionsAr: string[];
}

export const QUESTIONS: Question[] = [
  // Digital
  {
    id: 'dig_1',
    dimension: 'digital',
    questionEn: 'How do you manage core business data (orders, inventory, finance)?',
    questionAr: 'كيف تدير بيانات العمل الأساسية (الطلبات، المخزون، الحسابات)؟',
    optionsEn: ['Paper records / memory', 'Basic spreadsheets (Excel)', 'Isolated accounting software', 'Integrated ERP system', 'Cloud ERP with real-time dashboards'],
    optionsAr: ['سجلات ورقية / الاعتماد على الذاكرة', 'جداول بيانات بسيطة (إكسيل)', 'برنامج حسابات منفصل', 'نظام تخطيط موارد (ERP) متكامل', 'نظام ERP سحابي مع لوحات تحكم لحظية'],
  },
  {
    id: 'dig_2',
    dimension: 'digital',
    questionEn: 'How is data captured on the shop floor?',
    questionAr: 'كيف يتم جمع البيانات من صالة الإنتاج؟',
    optionsEn: ['Not captured', 'Paper forms entered later', 'Manual entry on tablets/PCs at stations', 'Barcode/RFID scanning', 'Direct machine integration (IoT/MES)'],
    optionsAr: ['لا يتم جمعها', 'نماذج ورقية يتم إدخالها لاحقاً', 'إدخال يدوي عبر أجهزة لوحية/حواسيب', 'مسح الباركود/RFID', 'ربط مباشر مع الماكينات (IoT/MES)'],
  },
  // Production
  {
    id: 'prod_1',
    dimension: 'production',
    questionEn: 'What is the average age/technology level of your main production machinery?',
    questionAr: 'ما هو متوسط عمر/مستوى التكنولوجيا لماكينات الإنتاج الرئيسية؟',
    optionsEn: ['>20 years, purely mechanical', '10-20 years, some electronics', '<10 years, computerized (PLC/CNC)', 'Modern with connectivity built-in', 'State-of-the-art with AI/adaptive controls'],
    optionsAr: ['أكثر من 20 سنة، ميكانيكية بالكامل', '10-20 سنة، بعض الإلكترونيات', 'أقل من 10 سنوات، مبرمجة (PLC/CNC)', 'حديثة ومزودة بقدرات اتصال شبكي', 'أحدث طراز مع تحكم بالذكاء الاصطناعي'],
  },
  {
    id: 'prod_2',
    dimension: 'production',
    questionEn: 'How do you track Overall Equipment Effectiveness (OEE) and downtime?',
    questionAr: 'كيف تتابع الفعالية الشاملة للمعدات (OEE) وأوقات التوقف؟',
    optionsEn: ['We do not track it', 'Rough estimates when issues happen', 'Daily manual logs', 'Digital tracking at shift end', 'Real-time automated OEE monitoring'],
    optionsAr: ['لا نتابعها', 'تقديرات تقريبية عند حدوث مشكلة', 'سجلات يدوية يومية', 'تتبع رقمي في نهاية الوردية', 'مراقبة لحظية وآلية للـ OEE'],
  },
  // Quality
  {
    id: 'qual_1',
    dimension: 'quality',
    questionEn: 'How is quality control integrated into the process?',
    questionAr: 'كيف يتم دمج مراقبة الجودة في عملية الإنتاج؟',
    optionsEn: ['Final visual inspection only', 'Manual checks at specific stages', 'Standardized digital checklists', 'Automated inline sensors/cameras', 'Predictive quality using AI'],
    optionsAr: ['فحص بصري نهائي فقط', 'فحوصات يدوية في مراحل محددة', 'قوائم فحص رقمية موحدة', 'حساسات/كاميرات آلية على خط الإنتاج', 'التنبؤ بجودة الإنتاج باستخدام الذكاء الاصطناعي'],
  },
  {
    id: 'qual_2',
    dimension: 'quality',
    questionEn: 'Can you trace a finished product back to its raw material batch?',
    questionAr: 'هل يمكنك تتبع المنتج النهائي وصولاً إلى تشغيلة المادة الخام؟',
    optionsEn: ['No traceability', 'Difficult, requires digging through paper', 'Yes, manual batch codes', 'Yes, barcode scanning per batch', 'Full digital traceability (blockchain/DPP ready)'],
    optionsAr: ['لا يوجد تتبع', 'صعب، يتطلب البحث في الأوراق', 'نعم، أكواد تشغيلات يدوية', 'نعم، مسح الباركود لكل تشغيلة', 'تتبع رقمي كامل (جاهز لجواز السفر الرقمي)'],
  },
  // Sustainability
  {
    id: 'sust_1',
    dimension: 'sustainability',
    questionEn: 'How do you monitor energy and water consumption?',
    questionAr: 'كيف تراقب استهلاك الطاقة والمياه؟',
    optionsEn: ['We just pay the monthly bills', 'Manual readings from main meters', 'Sub-metering for major departments', 'Digital real-time monitoring', 'Automated optimization system'],
    optionsAr: ['ندفع الفواتير الشهرية فقط', 'قراءات يدوية للعدادات الرئيسية', 'عدادات فرعية للأقسام الرئيسية', 'مراقبة رقمية لحظية', 'نظام آلي لترشيد الاستهلاك'],
  },
  {
    id: 'sust_2',
    dimension: 'sustainability',
    questionEn: 'What is your chemical management approach (e.g. ZDHC)?',
    questionAr: 'ما هو نهجك في إدارة الكيماويات (مثل ZDHC)؟',
    optionsEn: ['No formal management', 'Basic safety data sheets (SDS) on file', 'Actively substituting hazardous chemicals', 'ZDHC foundational compliance', 'ZDHC progressive/advanced compliance'],
    optionsAr: ['لا توجد إدارة رسمية', 'الاحتفاظ بصحائف بيانات السلامة الأساسية', 'استبدال الكيماويات الخطرة بشكل نشط', 'توافق أساسي مع ZDHC', 'توافق متقدم/شامل مع ZDHC'],
  },
  // Market
  {
    id: 'mrkt_1',
    dimension: 'market',
    questionEn: 'What percentage of your production is exported?',
    questionAr: 'ما هي نسبة الإنتاج الموجه للتصدير؟',
    optionsEn: ['0% (Local market only)', '1-25%', '26-50%', '51-80%', '81-100%'],
    optionsAr: ['0% (سوق محلي فقط)', '1-25%', '26-50%', '51-80%', '81-100%'],
  },
  {
    id: 'mrkt_2',
    dimension: 'market',
    questionEn: 'How prepared are you for the EU Carbon Border Adjustment Mechanism (CBAM)?',
    questionAr: 'ما مدى جاهزيتك لآلية تعديل حدود الكربون التابعة للاتحاد الأوروبي (CBAM)؟',
    optionsEn: ['Never heard of it', 'Aware, but haven\'t started', 'Currently assessing our emissions', 'We calculate Scope 1 & 2 emissions', 'Fully compliant reporting in place'],
    optionsAr: ['لم أسمع بها من قبل', 'على دراية، لكن لم نبدأ بعد', 'نقوم حالياً بتقييم انبعاثاتنا', 'نحسب انبعاثات النطاقين 1 و 2', 'نمتلك نظام تقارير متوافق بالكامل'],
  },
  // People
  {
    id: 'pepl_1',
    dimension: 'people',
    questionEn: 'How do you approach worker training?',
    questionAr: 'كيف تتعامل مع تدريب العمال؟',
    optionsEn: ['No training / learn on the job', 'Occasional ad-hoc training', 'Basic onboarding program', 'Regular structured training plan', 'Digital learning management with certifications'],
    optionsAr: ['لا يوجد تدريب / التعلم أثناء العمل', 'تدريب عرضي عند الحاجة', 'برنامج توجيه أساسي للمعينين الجدد', 'خطة تدريب منتظمة ومهيكلة', 'إدارة تعلم رقمي بشهادات'],
  },
  {
    id: 'pepl_2',
    dimension: 'people',
    questionEn: 'What is the digital literacy level of your shop floor supervisors?',
    questionAr: 'ما هو مستوى المعرفة الرقمية لمشرفي صالة الإنتاج؟',
    optionsEn: ['Very low, rely on paper only', 'Can use smartphones for chat', 'Can use basic software (Excel)', 'Comfortable with specialized software/ERP', 'Can configure and troubleshoot digital systems'],
    optionsAr: ['منخفض جداً، يعتمدون على الورق فقط', 'يستخدمون الهواتف الذكية للدردشة', 'يمكنهم استخدام برامج أساسية (إكسيل)', 'يستخدمون برامج متخصصة/ERP بطلاقة', 'قادرون على تهيئة وحل مشاكل الأنظمة الرقمية'],
  },
];

export function scoreAssessment(answers: Record<string, number>) {
  const scores = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
  const counts = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };

  for (const q of QUESTIONS) {
    if (answers[q.id] !== undefined) {
      scores[q.dimension] += answers[q.id];
      counts[q.dimension]++;
    }
  }

  // Normalize to 0-100
  let totalScore = 0;
  let totalCount = 0;
  for (const dim of Object.keys(scores) as Dimension[]) {
    if (counts[dim] > 0) {
      scores[dim] = Math.round((scores[dim] / (counts[dim] * 4)) * 100);
      totalScore += scores[dim];
      totalCount++;
    }
  }

  const overallScore = totalCount > 0 ? Math.round(totalScore / totalCount) : 0;
  
  let level = 1;
  if (overallScore >= 80) level = 5;
  else if (overallScore >= 60) level = 4;
  else if (overallScore >= 40) level = 3;
  else if (overallScore >= 20) level = 2;

  const levelNamesEn = ['Basic', 'Emerging', 'Developing', 'Advanced', 'Leading'];
  const levelNamesAr = ['أساسي', 'ناشئ', 'متطور', 'متقدم', 'رائد'];

  return {
    scores,
    overallScore,
    level,
    levelNameEn: levelNamesEn[level - 1],
    levelNameAr: levelNamesAr[level - 1],
  };
}

export function buildRecommendations(scores: Record<Dimension, number>) {
  const recs = [];
  
  if (scores.digital < 50) {
    recs.push({
      dimension: 'digital',
      priority: 'Now',
      action: 'Implement a basic cloud ERP to centralize orders and inventory.',
      actionAr: 'تطبيق نظام ERP سحابي أساسي لمركزية الطلبات والمخزون.',
      tag: 'digital',
      category: 'TECHNICAL',
    });
  }
  
  if (scores.sustainability < 60) {
    recs.push({
      dimension: 'sustainability',
      priority: 'Now',
      action: 'Install digital energy and water sub-meters on main finishing machines.',
      actionAr: 'تركيب عدادات رقمية فرعية للطاقة والمياه على ماكينات التجهيز الرئيسية.',
      tag: 'sustainability',
      category: 'SUSTAINABILITY',
    });
  }
  
  if (scores.market < 50) {
    recs.push({
      dimension: 'market',
      priority: 'Next',
      action: 'Calculate Scope 1 & 2 carbon emissions to prepare for EU CBAM reporting.',
      actionAr: 'حساب انبعاثات الكربون (النطاق 1 و 2) للتحضير لتقارير CBAM الأوروبية.',
      tag: 'export',
      category: 'EXPORT',
    });
  }

  if (scores.quality < 70) {
    recs.push({
      dimension: 'quality',
      priority: 'Next',
      action: 'Transition from paper checklists to tablet-based digital quality control.',
      actionAr: 'الانتقال من القوائم الورقية إلى فحص الجودة الرقمي عبر الأجهزة اللوحية.',
      tag: 'digital',
      category: 'QUALITY',
    });
  }

  if (scores.people < 60) {
    recs.push({
      dimension: 'people',
      priority: 'Later',
      action: 'Enroll production supervisors in digital literacy and continuous improvement courses.',
      actionAr: 'تسجيل مشرفي الإنتاج في دورات محو الأمية الرقمية والتحسين المستمر.',
      tag: 'people',
      category: 'MANAGEMENT',
    });
  }

  return recs;
}
