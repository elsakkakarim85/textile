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
  inferTopicProfile,
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
      titleAr:
        'الجيل الرابع للصناعة: تتبع كفاءة الأنوال OEE وبطاقات التشغيل الرقمية وجواز المنتج الأوروبي',
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
  topic: z.string().trim().min(2, 'Please enter a course topic').max(300),
  userNeed: z.string().trim().max(2000).optional(),
  targetRole: z.string().trim().max(150).optional(),
  category: z.nativeEnum(CourseCategory).optional(),
  levelProgression: z
    .enum(['BEGINNER_TO_ADVANCED', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    .default('BEGINNER_TO_ADVANCED'),
  durationHours: z.coerce.number().int().min(3).max(40).default(12),
  resourceIds: z.array(z.string()).optional(),
});

export const POST = route(async (req) => {
  const user = await requireUser();
  const body = await parseBody(req, generateSchema);

  // Automatically infer domain, target role, authorized standards & engineering metrics from ANY entered topic
  const inferred = inferTopicProfile(body.topic);
  const resolvedCategory = (body.category || inferred.category) as CourseCategory;
  const resolvedRole = body.targetRole?.trim() || inferred.targetRole;
  const resourceIds =
    body.resourceIds && body.resourceIds.length > 0 ? body.resourceIds : inferred.resourceIds;

  const selectedRefs = TRUSTED_AUTHORIZED_RESOURCES.filter((r) => resourceIds.includes(r.id));
  const activeRefs =
    selectedRefs.length > 0 ? selectedRefs : TRUSTED_AUTHORIZED_RESOURCES.slice(0, 3);

  const providerLabel = activeRefs
    .slice(0, 2)
    .map((r) => r.standardCode)
    .join(' • ');

  // Build 3 progressive modules: Module 1 (Beginner), Module 2 (Intermediate), Module 3 (Advanced)
  let aiCustomTitleEn: string | null = null;
  let aiCustomTitleAr: string | null = null;
  let aiCustomDescEn: string | null = null;
  let aiCustomDescAr: string | null = null;
  let aiModuleInsights: {
    titleEn?: string;
    titleAr?: string;
    en: string;
    ar: string;
    sopEn?: string;
    sopAr?: string;
  }[] = [];

  try {
    const prompt = `Design an expert-level 3-tier (Beginner -> Intermediate -> Advanced) textile engineering training course for El Mahalla El Kubra based on this user-entered topic:
Topic: "${body.topic}"
User Operational Need: "${body.userNeed || inferred.domainFocusEn}"
Target Role: "${resolvedRole}"
Authorized Standards: ${activeRefs.map((r) => `${r.organization} (${r.standardCode})`).join(', ')}

Return ONLY valid JSON with this exact shape:
{
  "titleEn": "Professional English course title expanding on the user topic",
  "titleAr": "Professional Arabic course title expanding on the user topic",
  "descriptionEn": "2-sentence executive summary of the course from Beginner to Advanced",
  "descriptionAr": "2-sentence Arabic executive summary",
  "modules": [
    {
      "titleEn": "Level 1 (Beginner): Specific foundational title for this topic",
      "titleAr": "المستوى ١ (مبتدئ): عنوان متخصص للأساسيات",
      "en": "Detailed technical paragraph for Module 1 (Beginner Foundation) covering core principles, formulas, and authorized standards for this topic.",
      "ar": "فقرة فنية مفصلة باللغة العربية للوحدة الأولى (المستوى المبتدئ).",
      "sopEn": "Specific shop-floor SOP action for Level 1",
      "sopAr": "إجراء تشغيل قياسي محدد للمستوى الأول"
    },
    {
      "titleEn": "Level 2 (Intermediate): Specific shop-floor execution & calibration title for this topic",
      "titleAr": "المستوى ٢ (متوسط): عنوان متخصص للتطبيق العملي والمعايرة",
      "en": "Detailed technical paragraph for Module 2 (Intermediate Shop-Floor Execution) covering machine settings, SOP tolerances, and root-cause troubleshooting.",
      "ar": "فقرة فنية مفصلة باللغة العربية للوحدة الثانية (المستوى المتوسط).",
      "sopEn": "Specific shop-floor SOP action for Level 2",
      "sopAr": "إجراء تشغيل قياسي محدد للمستوى الثاني"
    },
    {
      "titleEn": "Level 3 (Advanced): Specific optimization, EU DPP & certification audit title for this topic",
      "titleAr": "المستوى ٣ (متقدم): عنوان متخصص للتحسين الاستباقي والتدقيق الدولي",
      "en": "Detailed technical paragraph for Module 3 (Advanced Optimization & Certification Audit) covering predictive KPIs, digital traceability, and third-party audit readiness.",
      "ar": "فقرة فنية مفصلة باللغة العربية للوحدة الثالثة (المستوى المتقدم).",
      "sopEn": "Specific shop-floor SOP action for Level 3",
      "sopAr": "إجراء تشغيل قياسي محدد للمستوى الثالث"
    }
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
      if (parsed.titleEn) aiCustomTitleEn = String(parsed.titleEn);
      if (parsed.titleAr) aiCustomTitleAr = String(parsed.titleAr);
      if (parsed.descriptionEn) aiCustomDescEn = String(parsed.descriptionEn);
      if (parsed.descriptionAr) aiCustomDescAr = String(parsed.descriptionAr);
      if (Array.isArray(parsed.modules)) aiModuleInsights = parsed.modules;
    }
  } catch {
    // Topic-intelligent expert synthesis fallback below
  }

  // Ensure a rich expert title even if the user typed a short 1-2 word topic (e.g. "Jacquard Weaving" or "Denim")
  const rawTopicClean = body.topic.trim();
  const titleEn =
    aiCustomTitleEn ||
    (rawTopicClean.length < 28
      ? `${rawTopicClean}: Expert Industrial Mastery (Beginner → Advanced)`
      : rawTopicClean);
  const titleAr =
    aiCustomTitleAr ||
    `الدورة الاحترافية المتكاملة (مبتدئ ← متقدم): ${rawTopicClean}`;
  const descriptionEn =
    aiCustomDescEn ||
    `Expert Beginner-to-Advanced multimedia training program on "${rawTopicClean}" tailored for ${resolvedRole}. Grounded in ${activeRefs
      .map((r) => r.standardCode)
      .join(
        ', '
      )} with HD video slide lectures, bilingual EN/AR audio briefings, interactive process blueprints, shop-floor SOP checklists, and verifiable certification.${
      body.userNeed ? ` Specifically addresses: ${body.userNeed}` : ''
    }`;
  const descriptionAr =
    aiCustomDescAr ||
    `منهج تدريبي احترافي متعدد الوسائط حول «${rawTopicClean}» يتدرج من المستوى المبتدئ إلى المتقدم، مصمم خصيصاً لـ (${resolvedRole}) وموثق وفق معايير ${activeRefs
      .map((r) => r.standardCode)
      .join(
        ' و '
      )} مع محاضرات مرئية وملخصات صوتية وقوائم فحص SOP واختبارات شهادة معتمدة.`;

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
      badgeEn:
        aiModuleInsights[0]?.titleEn ||
        `Level 1 (Beginner): Core Principles, Engineering Parameters & Authorized Standards for ${rawTopicClean}`,
      badgeAr:
        aiModuleInsights[0]?.titleAr ||
        `المستوى ١ (مبتدئ): المبادئ الهندسية الأساسية والمعايير الدولية المعتمدة لـ ${rawTopicClean}`,
      durationMin: 35,
    },
    {
      pos: 2,
      tier: 'INTERMEDIATE',
      badgeEn:
        aiModuleInsights[1]?.titleEn ||
        `Level 2 (Intermediate): Shop-Floor Calibration, SOP Execution & Root-Cause Control in ${rawTopicClean}`,
      badgeAr:
        aiModuleInsights[1]?.titleAr ||
        `المستوى ٢ (متوسط): المعايرة الميدانية وتطبيق إجراءات SOP ومنع العيوب في ${rawTopicClean}`,
      durationMin: 45,
    },
    {
      pos: 3,
      tier: 'ADVANCED',
      badgeEn:
        aiModuleInsights[2]?.titleEn ||
        `Level 3 (Advanced): Predictive Optimization, EU DPP Traceability & Audit Mastery for ${rawTopicClean}`,
      badgeAr:
        aiModuleInsights[2]?.titleAr ||
        `المستوى ٣ (متقدم): التحسين الاستباقي وجواز المنتج الأوروبي واجتياز التدقيق في ${rawTopicClean}`,
      durationMin: 50,
    },
  ];

  const lessonsPayload = levels.map((lvl, idx) => {
    const aiNoteEn =
      aiModuleInsights[idx]?.en ||
      `This ${lvl.tier.toLowerCase()}-level module equips ${resolvedRole} teams in El Mahalla El Kubra with production-proven methodologies for **${rawTopicClean}** (${inferred.domainFocusEn}). ${
        body.userNeed ? `Directly targets your operational objective: ${body.userNeed}.` : ''
      }`;
    const aiNoteAr =
      aiModuleInsights[idx]?.ar ||
      `تزود هذه الوحدة (${lvl.tier}) فرق العمل (${resolvedRole}) في مصانع المحلة الكبرى بالمنهجيات الهندسية المعتمدة لـ **${rawTopicClean}** (${inferred.domainFocusAr}).`;

    const customSopEn =
      aiModuleInsights[idx]?.sopEn ||
      `[${lvl.tier}] Calibrate and verify ${rawTopicClean} operating parameters (${inferred.keyMetrics[idx] || inferred.keyMetrics[0]}) at shift handover`;
    const customSopAr =
      aiModuleInsights[idx]?.sopAr ||
      `[${lvl.tier}] معايرة والتحقق من محددات التشغيل لـ ${rawTopicClean} (${inferred.keyMetrics[idx] || inferred.keyMetrics[0]}) عند تسليم الوردية`;

    const markdownBody = `## ${lvl.badgeEn}
### ${lvl.badgeAr}

${aiNoteEn}

> **الخلاصة التنفيذية (Arabic Summary):** ${aiNoteAr}

---

### 1. Authorized Standards & Reference Benchmarks (${activeRefs.map((r) => r.standardCode).join(' / ')})
${activeRefs
  .map(
    (r) =>
      `- **${r.organization} (${r.standardCode}):** ${r.summary}\n  * بالعربية: ${r.summaryAr}`
  )
  .join('\n')}

### 2. Industrial Machinery, Instruments & Target KPIs for "${rawTopicClean}"
- **Target Learner Role:** ${resolvedRole}
- **Relevant Mill Equipment & Systems:** ${inferred.equipmentEn}
  * المعدات والأنظمة: ${inferred.equipmentAr}
- **Target Engineering Metrics (${lvl.tier}):** \`${inferred.keyMetrics.join('  |  ')}\`

| Stage / Parameter | Target Benchmark | Verification Method |
| :--- | :--- | :--- |
| **1. Baseline Setup (${rawTopicClean})** | ${inferred.keyMetrics[0]} | Shift-start calibration log |
| **2. Process Stability** | ${inferred.keyMetrics[1]} | In-line sensor / operator check |
| **3. Quality & Fastness Gate** | ${inferred.keyMetrics[2]} | ISO 17025 lab verification |
| **4. Export & Audit Compliance** | ${inferred.keyMetrics[3]} | Digital Product Passport (DPP) |

### 3. Progressive Competency Milestones (${lvl.tier})
- **Operational Focus:** ${
      lvl.tier === 'BEGINNER'
        ? `Master core terminology, safety interlocks, raw material specifications, and baseline defect classification for ${rawTopicClean}.`
        : lvl.tier === 'INTERMEDIATE'
        ? `Standardize machine recipes and tension/dosing parameters across all 3 shifts, execute rapid changeovers, and eliminate root causes of off-spec output in ${rawTopicClean}.`
        : `Achieve ≥97.5% Right-First-Time (RFT) yield, link batch genealogy to EU Digital Product Passports, and pass third-party buyer and ISO/ZDHC certification audits for ${rawTopicClean}.`
    }
- **Expected Shop-Floor ROI:** ${
      lvl.tier === 'BEGINNER'
        ? '100% operator & engineer alignment on authorized SOPs and zero safety incidents.'
        : lvl.tier === 'INTERMEDIATE'
        ? '25–38% reduction in rework, machine stops, and resource consumption within 30 days.'
        : 'Full Tier-1 European export qualification and verifiable Mahalla Cluster Academy certification.'
    }`;

    const meta: LessonMultimediaMeta = {
      levelTier: lvl.tier,
      videoDurationSec: lvl.durationMin * 60,
      slides: [
        {
          title: `${lvl.tier} Track: ${rawTopicClean}`,
          titleAr: `${lvl.badgeAr}`,
          bulletPoints: [
            `Role Focus: ${resolvedRole} — ${inferred.domainFocusEn}`,
            `Authorized Standards: ${activeRefs.map((r) => r.standardCode).join(' • ')}`,
            body.userNeed
              ? `Targeted Operational Need: ${body.userNeed.slice(0, 120)}`
              : `Key Equipment: ${inferred.equipmentEn}`,
          ],
          bulletPointsAr: [
            `الفئة المستهدفة: ${resolvedRole} — ${inferred.domainFocusAr}`,
            `المعايير الدولية المعتمدة: ${activeRefs.map((r) => r.standardCode).join(' • ')}`,
            `المعدات المستهدفة: ${inferred.equipmentAr}`,
          ],
          kpiHighlight: `${lvl.tier} Target: ${inferred.keyMetrics[idx] || inferred.keyMetrics[0]}`,
        },
        {
          title: `Standard Operating Parameters: ${rawTopicClean}`,
          titleAr: `محددات التشغيل القياسية لـ ${rawTopicClean}`,
          bulletPoints: [
            `Enforce ${inferred.keyMetrics[0]} and ${inferred.keyMetrics[1]} across all shifts`,
            `Execute in-line quality gate (${inferred.keyMetrics[2]}) before lot transfer`,
            ...activeRefs.slice(0, 2).map((r) => `${r.standardCode}: ${r.title}`),
          ],
          bulletPointsAr: [
            `تطبيق المحددات (${inferred.keyMetrics[0]} و ${inferred.keyMetrics[1]}) عبر جميع الورديات`,
            `تفعيل بوابة الفحص المرحلي (${inferred.keyMetrics[2]}) قبل انتقال التشغيلة`,
            ...activeRefs.slice(0, 2).map((r) => `${r.standardCode}: ${r.titleAr}`),
          ],
          kpiHighlight: inferred.keyMetrics[2],
        },
        {
          title: 'Root-Cause Control, Audit Evidence & Certification',
          titleAr: 'منع الأسباب الجذرية للعيوب وأدلة التدقيق والشهادة',
          bulletPoints: [
            customSopEn,
            'Validate mid-batch samples against ISO 17025 / buyer tech-pack tolerances',
            'Archive digital batch record for EU Digital Product Passport & Academy certification',
          ],
          bulletPointsAr: [
            customSopAr,
            'مطابقة عينات منتصف التشغيلة مع حدود السماحية في معمل ISO 17025',
            'أرشفة السجل الرقمي للتشغيلة لإصدار جواز المنتج الأوروبي والشهادة المعتمدة',
          ],
          kpiHighlight: inferred.keyMetrics[3],
        },
      ],
      audioSummaryEn: `Audio Briefing for ${lvl.badgeEn}. Tailored for ${resolvedRole} working on ${rawTopicClean}. Grounded in ${activeRefs
        .map((r) => r.organization)
        .join(' and ')}. Key operational targets include ${inferred.keyMetrics.join(', ')}. ${aiNoteEn}`,
      audioSummaryAr: `الملخص الصوتي لـ ${lvl.badgeAr} حول موضوع ${rawTopicClean}. موجه إلى ${resolvedRole} وموثق وفق معايير ${activeRefs
        .map((r) => r.standardCode)
        .join(' و ')}. الأهداف القياسية تشمل ${inferred.keyMetrics.join(' ، ')}. ${aiNoteAr}`,
      processSteps: [
        {
          step: `1. ${rawTopicClean} Baseline & Input Check`,
          stepAr: `١. فحص المدخلات والمعايرة الأولية لـ ${rawTopicClean}`,
          metric: inferred.keyMetrics[0],
        },
        {
          step: '2. Shift Parameter Calibration & Control',
          stepAr: '٢. ضبط محددات الماكينات وتوحيد الورديات',
          metric: inferred.keyMetrics[1],
        },
        {
          step: '3. In-Line Quality & Fastness Gate',
          stepAr: '٣. بوابة الفحص المرحلي والتحقق المعملي',
          metric: inferred.keyMetrics[2],
        },
        {
          step: '4. Digital Batch Sign-Off & Certification',
          stepAr: '٤. التوثيق الرقمي للتشغيلة والاعتماد الدولي',
          metric: inferred.keyMetrics[3],
        },
      ],
      sopChecklist: [
        {
          item: customSopEn,
          itemAr: customSopAr,
        },
        {
          item: `Verify compliance with ${activeRefs[0]?.standardCode || 'UNIDO'} tolerances on ${inferred.equipmentEn.split(',')[0]}`,
          itemAr: `التحقق من مطابقة معيار ${activeRefs[0]?.standardCode || 'UNIDO'} على ${inferred.equipmentAr.split('،')[0]}`,
        },
        {
          item: `Inspect first-off sample of ${rawTopicClean} against target metric (${inferred.keyMetrics[2]})`,
          itemAr: `فحص العينة الأولى لـ ${rawTopicClean} ومطابقتها بالمؤشر المستهدف (${inferred.keyMetrics[2]})`,
        },
        {
          item: 'Sign off digital batch card and archive compliance evidence for EU DPP & third-party audit',
          itemAr: 'اعتماد بطاقة التشغيلة الرقمية وأرشفة أدلة المطابقة لجواز المنتج الأوروبي والتدقيق الخارجي',
        },
      ],
      authorizedRefs: activeRefs,
      quiz: [
        {
          question: `Which authorized international standard is directly integrated into this ${lvl.tier} module for "${rawTopicClean}"?`,
          questionAr: `أي معيار دولي معتمد تم دمجه مباشرة في هذه الوحدة (${lvl.tier}) لدورة "${rawTopicClean}"؟`,
          options: [
            `${activeRefs[0]?.organization} (${activeRefs[0]?.standardCode})`,
            'Unverified verbal notes without instrument calibration',
            'Operating lines without batch traceability or quality tolerances',
            'Skipping pre-shipment inspection entirely',
          ],
          optionsAr: [
            `${activeRefs[0]?.organization} (${activeRefs[0]?.standardCode})`,
            'تعليمات شفهية غير موثقة بدون معايرة للأجهزة',
            'تشغيل الخطوط بدون تتبع للدفعات أو حدود سماحية للجودة',
            'تجاوز فحص ما قبل الشحن بالكامل',
          ],
          correctIndex: 0,
          explanation: `This "${rawTopicClean}" module is strictly grounded in ${activeRefs
            .map((r) => r.standardCode)
            .join(', ')} to ensure international buyer acceptance.`,
          explanationAr: `تعتمد هذه الوحدة حول «${rawTopicClean}» بشكل موثق على معايير ${activeRefs
            .map((r) => r.standardCode)
            .join(' و ')} لضمان القبول لدى المشترين الدوليين.`,
        },
        {
          question: `When executing "${rawTopicClean}" on the shop floor, which target engineering benchmark must be verified by ${resolvedRole}?`,
          questionAr: `عند تطبيق «${rawTopicClean}» في صالة الإنتاج، ما هو المؤشر الهندسي القياسي الذي يجب أن يتحقق منه (${resolvedRole})؟`,
          options: [
            `${inferred.keyMetrics[0]} and ${inferred.keyMetrics[2]}`,
            'Allowing unrestricted parameter drift between morning and night shifts',
            'Mixing unverified lots without barcode identification',
            'Disabling machine safety and tension/temperature sensors',
          ],
          optionsAr: [
            `${inferred.keyMetrics[0]} و ${inferred.keyMetrics[2]}`,
            'السماح بتغير الإعدادات عشوائياً بين الوردية الصباحية والمسائية',
            'خلط التشغيلات غير المفحوصة بدون باركود تعريف',
            'تعطيل حساسات الأمان والشد والحرارة بالماكينات',
          ],
          correctIndex: 0,
          explanation: `Maintaining ${inferred.keyMetrics.join(', ')} eliminates process variation and maximizes Right-First-Time (RFT) yield.`,
          explanationAr: `الحفاظ على المؤشرات (${inferred.keyMetrics.join(' ، ')}) يقضي على التفاوت ويرفع نسبة الجودة من أول مرة.`,
        },
        {
          question: `What is the required competency outcome of completing ${lvl.badgeEn}?`,
          questionAr: `ما هي النتيجة التطبيقية المطلوبة عند إتمام ${lvl.badgeAr}؟`,
          options: [
            'Measurable shop-floor KPI improvement, standardized SOP execution, and documented audit readiness',
            'Running production without recording shift handover logs',
            'Ignoring shade, tension, or energy variations between batches',
            'Isolating laboratory test results from production engineers',
          ],
          optionsAr: [
            'تحسن ملموس في مؤشرات الأداء وتطبيق إجراءات التشغيل القياسية والجاهزية للتدقيق الموثق',
            'تشغيل الخطوط دون تسجيل بيانات تسليم الوردية',
            'تجاهل فروق اللون أو الشد أو استهلاك الطاقة بين الدفعات',
            'عزل نتائج المعمل عن مهندسي الإنتاج',
          ],
          correctIndex: 0,
          explanation:
            'Every level in the Mahalla Cluster Academy translates directly into measurable shop-floor quality, OEE efficiency, and export compliance.',
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
      category: resolvedCategory,
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
