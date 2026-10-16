import { z } from 'zod';
import { CourseCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route, parseBody } from '@/server/http';
import { requireUser } from '@/server/auth';
import { findUserFactory } from '@/server/cluster';
import { generate } from '@/server/ai';
import {
  TRUSTED_AUTHORIZED_RESOURCES,
  embedMultimediaMeta,
  type LessonMultimediaMeta,
} from '@/server/modernization/course-generator';

export const GET = route(async () => {
  const user = await requireUser();
  const factory = await findUserFactory(user.id);

  const latestAssessment = factory
    ? await prisma.maturityAssessment.findFirst({
        where: { factoryId: factory.id },
        orderBy: { createdAt: 'desc' },
      })
    : null;

  const scores = (latestAssessment?.scores as Record<string, number> | null) || {
    digital: 52,
    production: 64,
    quality: 58,
    sustainability: 46,
    market: 55,
    people: 62,
  };

  // Identify top skill needs based on lowest maturity scores & factory capabilities
  const suggestedNeeds = [
    {
      id: 'need-sustainability',
      dimension: 'sustainability',
      score: scores.sustainability ?? 48,
      category: 'SUSTAINABILITY' as CourseCategory,
      title: 'Zero-Defect Reactive Dyeing, Water Recovery & ZDHC MRSL v3.1 Mastery',
      titleAr: 'إتقان الصباغة التفاعلية واسترجاع المياه والتوافق مع معيار ZDHC MRSL v3.1',
      needSummary:
        'Reduce dyehouse liquor ratios from 1:10 to 1:6, eliminate restricted chemical formulations, and meet EU wastewater guidelines.',
      needSummaryAr:
        'خفض نسبة الحمام في الصباغة إلى 1:6، وإحلال الكيماويات المحظورة، والتوافق مع معايير الصرف الأوروبية.',
      targetRole: 'Dyehouse & Chemical Supervisor',
      resourceIds: ['zdhc-mrsl', 'oekotex-gots', 'eu-espr-cbam'],
    },
    {
      id: 'need-digital',
      dimension: 'digital',
      score: scores.digital ?? 52,
      category: 'DIGITAL' as CourseCategory,
      title: 'Industry 4.0 Loom OEE Telemetry, ERP Batch Tracking & EU Digital Product Passports',
      titleAr: 'الجيل الرابع للصناعة: تتبع كفاءة الأنوال OEE وبطاقات التشغيل الرقمية وجواز المنتج الأوروبي',
      needSummary:
        'Connect shop-floor weaving/knitting counters to cloud ERP and generate cryptographic EU ESPR Digital Product Passports.',
      needSummaryAr:
        'ربط عدادات الأنوال والتريكو بنظام ERP السحابي وإصدار جواز المنتج الرقمي الموثق للتصدير لأوروبا.',
      targetRole: 'Operations & Digital Transformation Lead',
      resourceIds: ['eu-espr-cbam', 'unido-tigara', 'iso-astm-lab'],
    },
    {
      id: 'need-quality',
      dimension: 'quality',
      score: scores.quality ?? 58,
      category: 'QUALITY' as CourseCategory,
      title: 'ISO 17025 Physical Textile Testing, Giza Cotton Traceability & Shade Control',
      titleAr: 'اختبارات النسيج الفيزيائية ISO 17025 وتتبع قطن جيزة وضبط الدرجات اللونية',
      needSummary:
        'Master tensile strength, pilling, and spectrophotometer ΔE<0.8 shade sorting for Tier-1 European retail buyers.',
      needSummaryAr:
        'إتقان اختبارات الشد والتوبير والقياس الطيفي للألوان ΔE<0.8 لتلبية متطلبات سلاسل التجزئة الأوروبية.',
      targetRole: 'Quality Assurance & Lab Engineer',
      resourceIds: ['iso-astm-lab', 'oekotex-gots', 'ilo-cotton-egypt'],
    },
    {
      id: 'need-production',
      dimension: 'production',
      score: scores.production ?? 64,
      category: 'TECHNICAL' as CourseCategory,
      title: 'High-Speed Air-Jet Weaving & Ring Spinning Optimization (SMED & Zero Yarn Stops)',
      titleAr: 'تحسين أداء أنوال الهواء والغزل الحلقي (تقليل توقفات السداء واللحمة ومنهجية SMED)',
      needSummary:
        'Cut warp beam changeover time by 50% and reduce stops per 100,000 picks through humidity and tension calibration.',
      needSummaryAr:
        'خفض زمن تغيير مطواة السداء بنسبة 50% وتقليل انقطاعات الخيوط عبر ضبط الرطوبة والشد.',
      targetRole: 'Spinning & Weaving Floor Engineer',
      resourceIds: ['unido-tigara', 'iso-astm-lab', 'ilo-cotton-egypt'],
    },
  ].sort((a, b) => a.score - b.score);

  return {
    factory: factory
      ? { id: factory.id, name: factory.name, capabilities: factory.capabilities }
      : null,
    maturityScores: scores,
    suggestedNeeds,
    authorizedResources: TRUSTED_AUTHORIZED_RESOURCES,
  };
});

const generateSchema = z.object({
  topic: z.string().trim().min(5).max(200),
  userNeed: z.string().trim().max(1500).optional(),
  targetRole: z.string().trim().min(2).max(120).default('Textile Mill Engineer & Supervisor'),
  category: z.nativeEnum(CourseCategory).default('TECHNICAL'),
  levelProgression: z
    .enum(['BEGINNER_TO_ADVANCED', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    .default('BEGINNER_TO_ADVANCED'),
  durationHours: z.coerce.number().int().min(3).max(40).default(12),
  resourceIds: z.array(z.string()).default(['unido-tigara', 'iso-astm-lab']),
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, generateSchema);

  const resourceIds = body.resourceIds ?? ['unido-tigara', 'iso-astm-lab'];
  const selectedRefs = TRUSTED_AUTHORIZED_RESOURCES.filter((r) =>
    resourceIds.includes(r.id)
  );
  const activeRefs =
    selectedRefs.length > 0 ? selectedRefs : TRUSTED_AUTHORIZED_RESOURCES.slice(0, 3);

  const providerLabel = activeRefs
    .slice(0, 2)
    .map((r) => r.standardCode)
    .join(' • ');

  // Build 3 progressive modules: Module 1 (Beginner), Module 2 (Intermediate), Module 3 (Advanced)
  let aiCustomTitleAr: string | null = null;
  let aiCustomDescEn: string | null = null;
  let aiCustomDescAr: string | null = null;
  let aiModuleInsights: { en: string; ar: string }[] = [];

  try {
    const prompt = `Create a concise JSON summary for an expert textile training course in El Mahalla El Kubra.
Topic: ${body.topic}
User Need: ${body.userNeed || 'Industrial upgrading, quality improvement, and export compliance'}
Target Role: ${body.targetRole}
Authorized Standards: ${activeRefs.map((r) => `${r.organization} (${r.standardCode})`).join(', ')}

Return ONLY valid JSON with this exact shape:
{
  "titleAr": "Arabic translation of the topic",
  "descriptionEn": "2-sentence executive summary of the course from Beginner to Advanced",
  "descriptionAr": "2-sentence Arabic executive summary",
  "modules": [
    { "en": "Detailed paragraph for Module 1 (Beginner Foundation)", "ar": "Arabic paragraph for Module 1" },
    { "en": "Detailed paragraph for Module 2 (Intermediate Shop-Floor Execution)", "ar": "Arabic paragraph for Module 2" },
    { "en": "Detailed paragraph for Module 3 (Advanced Optimization & Certification Audit)", "ar": "Arabic paragraph for Module 3" }
  ]
}`;
    const res = await generate({
      system:
        'You are the Chief Industrial Curriculum Architect for the UNIDO / TIGARA Mahalla Textile Cluster Academy. Output strict JSON only.',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });
    const match = res.text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (parsed.titleAr) aiCustomTitleAr = String(parsed.titleAr);
      if (parsed.descriptionEn) aiCustomDescEn = String(parsed.descriptionEn);
      if (parsed.descriptionAr) aiCustomDescAr = String(parsed.descriptionAr);
      if (Array.isArray(parsed.modules)) aiModuleInsights = parsed.modules;
    }
  } catch {
    // Deterministic expert synthesis fallback below
  }

  const titleEn = body.topic;
  const titleAr =
    aiCustomTitleAr ||
    `الدورة المتكاملة (مبتدئ ← متقدم): ${body.topic}`;
  const descriptionEn =
    aiCustomDescEn ||
    `Comprehensive Beginner-to-Advanced multimedia curriculum tailored for ${body.targetRole}. Grounded in ${activeRefs
      .map((r) => r.standardCode)
      .join(', ')} with interactive video walkthroughs, audio briefings, shop-floor SOP checklists, and certification assessments.${
      body.userNeed ? ` Focused on: ${body.userNeed}` : ''
    }`;
  const descriptionAr =
    aiCustomDescAr ||
    `منهج تدريبي متعدد الوسائط يتدرج من المستوى المبتدئ إلى المتقدم، مصمم خصيصاً لـ (${body.targetRole}) وموثق وفق معايير ${activeRefs
      .map((r) => r.standardCode)
      .join(' و ')} مع محاضرات مرئية وملخصات صوتية وقوائم فحص واختبارات شهادة معتمدة.`;

  const levels: Array<{
    pos: number;
    tier: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    badgeEn: string;
    badgeAr: string;
    durationMin: number;
  }> = [
    {
      pos: 1,
      tier: 'BEGINNER',
      badgeEn: 'Level 1 (Beginner): Core Principles, Terminology & Authorized Standards',
      badgeAr: 'المستوى ١ (مبتدئ): المبادئ الأساسية والمصطلحات والمعايير المعتمدة',
      durationMin: 35,
    },
    {
      pos: 2,
      tier: 'INTERMEDIATE',
      badgeEn: 'Level 2 (Intermediate): Shop-Floor Calibration, SOPs & Root-Cause Control',
      badgeAr: 'المستوى ٢ (متوسط): التطبيق العملي بصالة الإنتاج وإجراءات التشغيل القياسية',
      durationMin: 45,
    },
    {
      pos: 3,
      tier: 'ADVANCED',
      badgeEn: 'Level 3 (Advanced): Predictive Optimization, EU DPP Traceability & Audit Mastery',
      badgeAr: 'المستوى ٣ (متقدم): التحسين الاستباقي والتتبع الرقمي واجتياز التدقيق الدولي',
      durationMin: 50,
    },
  ];

  const lessonsPayload = levels.map((lvl, idx) => {
    const aiNoteEn =
      aiModuleInsights[idx]?.en ||
      `This module equips ${body.targetRole} teams in El Mahalla El Kubra with actionable methodologies for "${titleEn}". ${
        body.userNeed ? `Directly addresses your operational priority: ${body.userNeed}.` : ''
      }`;
    const aiNoteAr =
      aiModuleInsights[idx]?.ar ||
      `تزود هذه الوحدة فرق العمل (${body.targetRole}) في مصانع المحلة الكبرى بالمنهجيات التطبيقية لـ "${titleEn}" وفق أحدث المراجع الدولية.`;

    const markdownBody = `## ${lvl.badgeEn}
### ${lvl.badgeAr}

${aiNoteEn}

> **الخلاصة التنفيذية (Arabic Summary):** ${aiNoteAr}

---

### 1. Authorized Standards & Technical Benchmarks (${activeRefs.map((r) => r.standardCode).join(' / ')})
${activeRefs
  .map(
    (r) =>
      `- **${r.organization} (${r.standardCode}):** ${r.summary}\n  * بالعربية: ${r.summaryAr}`
  )
  .join('\n')}

### 2. Progressive Competency Objectives (${lvl.tier})
- **Target Role:** ${body.targetRole}
- **Key Operational Focus:** ${
      lvl.tier === 'BEGINNER'
        ? 'Establish accurate baseline measurements, safety protocols, and defect classification on the mill floor.'
        : lvl.tier === 'INTERMEDIATE'
        ? 'Standardize machine parameters across all 3 shifts, enforce in-line quality gates, and eliminate rework bottlenecks.'
        : 'Achieve >97% Right-First-Time (RFT) output, integrate batch telemetry into EU Digital Product Passports, and pass third-party certification audits.'
    }
- **Expected Measurable Impact:** ${
      lvl.tier === 'BEGINNER'
        ? '100% team alignment on standard operating terminology and hazard prevention.'
        : lvl.tier === 'INTERMEDIATE'
        ? '25–35% reduction in off-spec lots, machine stops, and resource waste.'
        : 'Full audit readiness for Tier-1 European buyers and verifiable cluster certification.'
    }`;

    const meta: LessonMultimediaMeta = {
      levelTier: lvl.tier,
      videoDurationSec: lvl.durationMin * 60,
      slides: [
        {
          title: `${lvl.tier} Module: ${titleEn}`,
          titleAr: `${lvl.badgeAr}`,
          bulletPoints: [
            `Tailored for: ${body.targetRole}`,
            `Grounded in: ${activeRefs.map((r) => r.standardCode).join(', ')}`,
            body.userNeed
              ? `Targeted Need: ${body.userNeed.slice(0, 110)}`
              : 'Aligned with Mahalla Cluster Modernization Benchmarks',
          ],
          bulletPointsAr: [
            `موجه إلى: ${body.targetRole}`,
            `مستند إلى المعايير المعتمدة: ${activeRefs.map((r) => r.standardCode).join(' ، ')}`,
            'تطبيق مباشر داخل خطوط الغزل والنسيج والصباغة بالمحلة الكبرى',
          ],
          kpiHighlight:
            lvl.tier === 'BEGINNER'
              ? 'Stage 1: Foundation & Baseline'
              : lvl.tier === 'INTERMEDIATE'
              ? 'Stage 2: -32% Defects & +20% OEE'
              : 'Stage 3: 100% Audit & Certification',
        },
        {
          title: 'Authorized Standard Operating Protocol',
          titleAr: 'بروتوكول التشغيل القياسي المعتمد',
          bulletPoints: activeRefs.map((r) => `${r.standardCode}: ${r.title}`),
          bulletPointsAr: activeRefs.map((r) => `${r.standardCode}: ${r.titleAr}`),
          kpiHighlight: '100% Authorized Reference Alignment',
        },
        {
          title: 'Verification & Shop-Floor Sign-Off',
          titleAr: 'التحقق المعملي والاعتماد الميداني',
          bulletPoints: [
            'Execute shift-start calibration and parameter logging',
            'Validate mid-batch samples at the TIGARA ISO 17025 Testing Lab',
            'Complete module knowledge check to unlock your credential',
          ],
          bulletPointsAr: [
            'تنفيذ معايرة بداية الوردية وتسجيل قراءات الماكينات',
            'فحص عينات منتصف التشغيلة في معمل تيجارة المعتمد ISO 17025',
            'اجتياز التقييم المعرفي للوحدة لاستكمال متطلبات الشهادة الرقمية',
          ],
          kpiHighlight: 'Verifiable Cluster Academy Credential',
        },
      ],
      audioSummaryEn: `Audio Briefing for ${lvl.badgeEn} in ${titleEn}. Designed for ${body.targetRole}. This module applies ${activeRefs
        .map((r) => r.organization)
        .join(' and ')} guidelines. ${aiNoteEn}`,
      audioSummaryAr: `الملخص الصوتي لـ ${lvl.badgeAr}. هذه الوحدة مصممة لـ ${body.targetRole} وتطبق معايير ${activeRefs
        .map((r) => r.standardCode)
        .join(' و ')}. ${aiNoteAr}`,
      processSteps: [
        {
          step: `1. ${lvl.tier} Diagnostic & Input Verification`,
          stepAr: '١. التشخيص وفحص المدخلات وفق المواصفة',
          metric: activeRefs[0]?.standardCode || 'ISO-9001',
        },
        {
          step: '2. Machine & Process Parameter Calibration',
          stepAr: '٢. معايرة إعدادات الماكينات وضبط العمليات',
          metric: '±1.0% Tolerance',
        },
        {
          step: '3. In-Line Quality & Sustainability Gate',
          stepAr: '٣. بوابة الفحص المرحلي للجودة والاستدامة',
          metric: 'RFT ≥ 97%',
        },
        {
          step: '4. Digital Traceability & Audit Archiving',
          stepAr: '٤. التوثيق الرقمي وأرشفة ملف التدقيق',
          metric: 'DPP Ready',
        },
      ],
      sopChecklist: [
        {
          item: `[${lvl.tier}] Verify compliance with ${activeRefs[0]?.standardCode || 'UNIDO'} before starting production lot`,
          itemAr: `[${lvl.tier}] التحقق من مطابقة معيار ${activeRefs[0]?.standardCode || 'UNIDO'} قبل بدء التشغيلة`,
        },
        {
          item: 'Calibrate sensors, tensioners, or chemical dosing units and log shift baseline',
          itemAr: 'معايرة الحساسات والشدادات أو وحدات الحقن الكيميائي وتسجيل قراءة بداية الوردية',
        },
        {
          item: 'Inspect first-off sample against approved tolerance table and customer tech-pack',
          itemAr: 'فحص العينة الأولى ومطابقتها بجدول السماحيات المعتمد وملف مواصفات العميل',
        },
        {
          item: 'Upload batch verification record for EU Digital Product Passport & internal audit',
          itemAr: 'رفع سجل فحص التشغيلة لربطه بجواز المنتج الرقمي الأوروبي والتدقيق الداخلي',
        },
      ],
      authorizedRefs: activeRefs,
      quiz: [
        {
          question: `Which authorized standard is directly integrated into this ${lvl.tier} module for "${titleEn}"?`,
          questionAr: `أي معيار دولي معتمد تم دمجه مباشرة في هذه الوحدة (${lvl.tier}) لدورة "${titleEn}"؟`,
          options: [
            `${activeRefs[0]?.organization} (${activeRefs[0]?.standardCode})`,
            'Unverified informal workshop notes without calibration',
            'Outdated manual logs without quality tolerances',
            'Skipping pre-shipment inspection entirely',
          ],
          optionsAr: [
            `${activeRefs[0]?.organization} (${activeRefs[0]?.standardCode})`,
            'ملاحظات غير موثقة بدون معايرة',
            'سجلات يدوية قديمة بدون حدود سماحية للجودة',
            'تجاوز فحص ما قبل الشحن بالكامل',
          ],
          correctIndex: 0,
          explanation: `This course is strictly grounded in ${activeRefs
            .map((r) => r.standardCode)
            .join(', ')} to ensure international buyer acceptance.`,
          explanationAr: `تعتمد هذه الدورة بشكل موثق على معايير ${activeRefs
            .map((r) => r.standardCode)
            .join(' و ')} لضمان القبول لدى المشترين الدوليين.`,
        },
        {
          question: `What is the required outcome of completing ${lvl.badgeEn}?`,
          questionAr: `ما هي النتيجة المطلوبة عند إتمام ${lvl.badgeAr}؟`,
          options: [
            'Measurable shop-floor KPI improvement, standardized SOP execution, and documented audit readiness',
            'Operating lines without recording batch parameters',
            'Ignoring shade or tension variations between shifts',
            'Disconnecting laboratory test results from production teams',
          ],
          optionsAr: [
            'تحسن ملموس في مؤشرات الأداء وتطبيق إجراءات التشغيل القياسية والجاهزية للتدقيق الموثق',
            'تشغيل الخطوط دون تسجيل معايير الدفعات',
            'تجاهل فروق اللون أو الشد بين الورديات',
            'فصل نتائج المعمل عن فرق الإنتاج',
          ],
          correctIndex: 0,
          explanation:
            'Every level in the Mahalla Cluster Academy translates directly into measurable shop-floor quality, efficiency, and export compliance.',
          explanationAr:
            'كل مستوى في أكاديمية تجمع المحلة يترجم مباشرة إلى جودة وكفاءة وتوافق تصديري قابل للقياس.',
        },
      ],
    };

    return {
      position: lvl.pos,
      title: lvl.badgeEn,
      titleAr: lvl.badgeAr,
      durationMin: lvl.durationMin,
      content: embedMultimediaMeta(markdownBody, meta),
    };
  });

  const baseSlug = body.topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 42);
  const slug = `${baseSlug || 'ai-course'}-${Math.random().toString(36).slice(2, 6)}`;

  const course = await prisma.course.create({
    data: {
      slug,
      title: titleEn,
      titleAr,
      description: descriptionEn,
      descriptionAr,
      category: body.category ?? 'TECHNICAL',
      level:
        (body.levelProgression ?? 'BEGINNER_TO_ADVANCED') === 'BEGINNER_TO_ADVANCED'
          ? 'beginner → advanced'
          : (body.levelProgression ?? 'BEGINNER_TO_ADVANCED').toLowerCase(),
      durationHours: body.durationHours ?? 12,
      provider: `AI Studio • ${providerLabel}`,
      isPublished: true,
      lessons: {
        create: lessonsPayload,
      },
    },
    include: {
      lessons: { orderBy: { position: 'asc' } },
    },
  });

  // Auto-enroll the creator so they can start tracking progress immediately
  await prisma.enrollment.upsert({
    where: { courseId_userId: { courseId: course.id, userId: user.id } },
    update: {},
    create: {
      courseId: course.id,
      userId: user.id,
      completedLessons: [],
      progress: 0,
      status: 'ENROLLED',
    },
  });

  return { course, slug: course.slug };
});
