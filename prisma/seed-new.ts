import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding comprehensive Mahalla Textile Cluster production data...');

  // 1. Ensure core users exist & enrich them
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mahallacluster.eg' },
    update: { role: 'admin', firstName: 'Tarek', lastName: 'El-Shenawy (CMO)' },
    create: {
      id: 'user_seed_admin',
      email: 'admin@mahallacluster.eg',
      firstName: 'Tarek',
      lastName: 'El-Shenawy (CMO)',
      role: 'admin',
      locale: 'ar',
    },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: 'owner@misrspinning.eg' },
    update: { role: 'factory_owner', firstName: 'Mahmoud', lastName: 'Abdel-Aziz' },
    create: {
      id: 'user_seed_owner1',
      email: 'owner@misrspinning.eg',
      firstName: 'Mahmoud',
      lastName: 'Abdel-Aziz',
      role: 'factory_owner',
      locale: 'ar',
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner@alrowad-dyeing.eg' },
    update: { role: 'factory_owner', firstName: 'Hossam', lastName: 'El-Gendy' },
    create: {
      id: 'user_seed_owner2',
      email: 'owner@alrowad-dyeing.eg',
      firstName: 'Hossam',
      lastName: 'El-Gendy',
      role: 'factory_owner',
      locale: 'ar',
    },
  });

  const owner3 = await prisma.user.upsert({
    where: { email: 'info@delta-weaving.eg' },
    update: { role: 'factory_owner', firstName: 'Karim', lastName: 'El-Sakka' },
    create: {
      id: 'user_seed_owner3',
      email: 'info@delta-weaving.eg',
      firstName: 'Karim',
      lastName: 'El-Sakka',
      role: 'factory_owner',
      locale: 'ar',
    },
  });

  const owner4 = await prisma.user.upsert({
    where: { email: 'sales@nile-terry.eg' },
    update: { role: 'factory_owner', firstName: 'Nadia', lastName: 'Mansour' },
    create: {
      id: 'user_seed_owner4',
      email: 'sales@nile-terry.eg',
      firstName: 'Nadia',
      lastName: 'Mansour',
      role: 'factory_owner',
      locale: 'ar',
    },
  });

  const expertUser1 = await prisma.user.upsert({
    where: { email: 'expert.khaled@tigara-unido.org' },
    update: { role: 'service_provider', firstName: 'Dr. Khaled', lastName: 'Soliman' },
    create: {
      id: 'user_seed_expert1',
      email: 'expert.khaled@tigara-unido.org',
      firstName: 'Dr. Khaled',
      lastName: 'Soliman',
      role: 'service_provider',
      locale: 'ar',
    },
  });

  const expertUser2 = await prisma.user.upsert({
    where: { email: 'expert.mona@eu-cbam.org' },
    update: { role: 'service_provider', firstName: 'Eng. Mona', lastName: 'Zaki' },
    create: {
      id: 'user_seed_expert2',
      email: 'expert.mona@eu-cbam.org',
      firstName: 'Eng. Mona',
      lastName: 'Zaki',
      role: 'service_provider',
      locale: 'en',
    },
  });

  // 2. Ensure & Enrich Factories
  const existingFactories = await prisma.factory.findMany({ orderBy: { createdAt: 'asc' } });
  if (existingFactories[0]) {
    await prisma.factory.update({
      where: { id: existingFactories[0].id },
      data: {
        status: 'APPROVED',
        isVerified: true,
        capabilities: ['spinning', 'weaving', 'finishing'],
        monthlyCapacity: 180000,
        capacityUnit: 'meters',
        minOrderQty: 2000,
        leadTimeDays: 21,
        employeesCount: 450,
        foundedYear: 1938,
        exportMarkets: ['DE', 'IT', 'TR', 'SA'],
      },
    });
  }
  if (existingFactories[1]) {
    await prisma.factory.update({
      where: { id: existingFactories[1].id },
      data: {
        status: 'APPROVED',
        isVerified: true,
        capabilities: ['dyeing', 'printing', 'finishing', 'washing'],
        monthlyCapacity: 110000,
        capacityUnit: 'kg',
        minOrderQty: 500,
        leadTimeDays: 10,
        employeesCount: 140,
        foundedYear: 1996,
        exportMarkets: ['IT', 'ES', 'MA'],
      },
    });
  }

  const f3 = await prisma.factory.upsert({
    where: { taxRegistrationNumber: '310-445-889' },
    update: {
      status: 'APPROVED',
      isVerified: true,
      capabilities: ['weaving', 'sewing', 'cutting'],
      monthlyCapacity: 85000,
    },
    create: {
      slug: 'el-delta-modern-weaving',
      name: 'El-Delta Modern Weaving & Home Textiles',
      description: 'Specialized in Giza cotton sateen bedlinens, hospitality jacquard fabrics, and automated cut-and-sew lines.',
      address: 'Industrial Zone Phase 2, El Mahalla El Kubra',
      city: 'El Mahalla El Kubra',
      taxRegistrationNumber: '310-445-889',
      commercialRegister: 'GH-88214',
      employeesCount: 165,
      foundedYear: 2004,
      monthlyCapacity: 85000,
      capacityUnit: 'meters',
      minOrderQty: 1000,
      leadTimeDays: 18,
      capabilities: ['weaving', 'sewing', 'cutting'],
      exportMarkets: ['DE', 'FR', 'GB', 'AE'],
      status: 'APPROVED',
      isVerified: true,
      ownerId: owner3.id,
    },
  });

  const f4 = await prisma.factory.upsert({
    where: { taxRegistrationNumber: '412-901-773' },
    update: {
      status: 'APPROVED',
      isVerified: true,
      capabilities: ['knitting', 'dyeing', 'sewing', 'embroidery'],
      monthlyCapacity: 65000,
    },
    create: {
      slug: 'nile-valley-terry-knits',
      name: 'Nile Valley Terry & Knits Co.',
      description: 'OEKO-TEX certified producer of heavy hotel terry towels, bathrobes, and combed cotton jersey.',
      address: 'Ring Road Industrial Area, El Mahalla El Kubra',
      city: 'El Mahalla El Kubra',
      taxRegistrationNumber: '412-901-773',
      commercialRegister: 'GH-91420',
      employeesCount: 110,
      foundedYear: 2011,
      monthlyCapacity: 65000,
      capacityUnit: 'pieces',
      minOrderQty: 500,
      leadTimeDays: 14,
      capabilities: ['knitting', 'dyeing', 'sewing', 'embroidery'],
      exportMarkets: ['NL', 'SE', 'US'],
      status: 'APPROVED',
      isVerified: true,
      ownerId: owner4.id,
    },
  });

  const allFactories = await prisma.factory.findMany({ orderBy: { createdAt: 'asc' } });
  const f1 = allFactories[0] || f3;
  const f2 = allFactories[1] || f4;

  // 3. Courses + Lessons + Enrollments (Upsert by slug)
  const courseData = [
    {
      slug: 'lean-manufacturing',
      title: 'Lean Manufacturing & 5S for Textile Mills',
      titleAr: 'التصنيع الرشيق ومنهجية 5S لمصانع الغزل والنسيج',
      description: 'Eliminate downtime, yarn breakage waste, and changeover bottlenecks across spinning, weaving, and sewing lines.',
      descriptionAr: 'القضاء على أوقات التوقف وهدر انقطاع الخيوط واختناقات تغيير التشغيل في خطوط الغزل والنسيج والحياكة.',
      provider: 'UNIDO / TIGARA',
      durationHours: 12,
      level: 'intermediate',
      category: 'MANAGEMENT' as const,
      lessons: [
        {
          position: 1,
          title: 'Value Stream Mapping in Weaving & Spinning',
          titleAr: 'رسم خريطة تدفق القيمة في الغزل والنسيج',
          durationMin: 25,
          content: `## Value Stream Mapping (VSM) for Mahalla Mills\n\nIn a typical weaving mill in El Mahalla El Kubra, **up to 38% of lead time** is lost waiting between warping, sizing, and loom beam tying.\n\n### Key Metrics to Track\n- **OEE (Overall Equipment Effectiveness):** Availability × Performance × Quality\n- **Warp Knot Changeover (SMED):** Reducing beam change time from 4 hours to under 90 minutes.\n- **First-Pass Yield:** Percentage of grey fabric rolls passing inspection without mending.`,
        },
        {
          position: 2,
          title: '5S Floor Organization & Loom Spare Parts Control',
          titleAr: 'تنظيم صالة الإنتاج 5S وإدارة قطع غيار الأنوال',
          durationMin: 30,
          content: `## Implementing 5S on the Mill Floor\n\n1. **Sort (Seiri):** Remove obsolete reeds, heddles, and cones from active weaving alleys.\n2. **Set in Order (Seiton):** Shadow-boards for rapier grippers, air-jet nozzles, and tensioners.\n3. **Shine (Seiso):** Daily compressed-air lint schedules to prevent yarn contamination.\n4. **Standardize & Sustain:** Weekly visual audits scored by shift supervisors.`,
        },
        {
          position: 3,
          title: 'Root Cause Analysis for Yarn Breakage & Shade Variation',
          titleAr: 'تحليل الأسباب الجذرية لانقطاع الخيوط وتفاوت الدرجات اللونية',
          durationMin: 35,
          content: `## Controlling Stops per 100,000 Picks\n\nEvery warp stop on a high-speed air-jet loom costs 45–90 seconds of operator intervention and creates a starting mark defect.\n\n- Maintain relative humidity at **68–72% RH** in cotton weaving halls.\n- Standardize sizing recipe viscosity and refractometer checks every 2 hours.`,
        },
      ],
    },
    {
      slug: 'zdhc-basics',
      title: 'ZDHC Chemical Management & MRSL Compliance',
      titleAr: 'إدارة الكيماويات وفق معيار ZDHC والتوافق مع قائمة MRSL',
      description: 'Master Zero Discharge of Hazardous Chemicals (ZDHC) protocols, chemical inventory logs, and wastewater compliance for European brands.',
      descriptionAr: 'إتقان بروتوكولات التخلص الصفري من الكيماويات الخطرة وسجلات المخزون الكيميائي ومعايير مياه الصرف للتصدير لأوروبا.',
      provider: 'TIGARA / ZDHC Academy',
      durationHours: 8,
      level: 'beginner',
      category: 'SUSTAINABILITY' as const,
      lessons: [
        {
          position: 1,
          title: 'Understanding the ZDHC MRSL v3.1',
          titleAr: 'فهم قائمة المواد المحظورة في التصنيع ZDHC MRSL v3.1',
          durationMin: 20,
          content: `## MRSL vs. RSL\n\n- **RSL (Restricted Substances List):** Limits chemicals present on the finished fabric.\n- **MRSL (Manufacturing Restricted Substances List):** Bans hazardous substances (APEOs, heavy metals, azo dyes, chlorophenols) from entering the dyehouse altogether.\n\nAlways verify supplier formulations on the **ZDHC Gateway** before bulk purchasing.`,
        },
        {
          position: 2,
          title: 'Chemical Storage, SDS & Secondary Containment',
          titleAr: 'تخزين الكيماويات وبطاقات الأمان SDS والاحتواء الثانوي',
          durationMin: 25,
          content: `## Safe Dyehouse Chemical Warehousing\n\n- Keep updated **16-section Safety Data Sheets (SDS)** in Arabic and English at every dispensing station.\n- Separate oxidizing agents (hydrogen peroxide) from organic acids and reducing agents.\n- Install 110% volume bunding trays under liquid caustic soda and auxiliary drums.`,
        },
      ],
    },
    {
      slug: 'eu-cbam-dpp-export',
      title: 'EU Export Readiness: CBAM Carbon Accounting & Digital Product Passport',
      titleAr: 'جاهزية التصدير للاتحاد الأوروبي: البصمة الكربونية وجواز المنتج الرقمي DPP',
      description: 'Prepare your textile factory for the EU Ecodesign for Sustainable Products Regulation (ESPR) and supply-chain carbon reporting.',
      descriptionAr: 'تأهيل مصنعك لمتطلبات التصميم البيئي الأوروبي ESPR وحساب الانبعاثات الكربونية للنسيج.',
      provider: 'EU-Egypt TIGARA',
      durationHours: 10,
      level: 'advanced',
      category: 'EXPORT' as const,
      lessons: [
        {
          position: 1,
          title: 'Scope 1 & Scope 2 Emissions in Spinning, Weaving & Dyeing',
          titleAr: 'انبعاثات النطاق 1 و 2 في الغزل والنسيج والصباغة',
          durationMin: 30,
          content: `## Calculating kg CO₂e per kg of Finished Textile\n\nEuropean buyers increasingly require batch-level carbon footprints:\n- **Scope 1:** On-site steam boilers burning natural gas ($1.96\\text{ kg CO}_2\\text{e/m}^3$) and backup diesel generators ($2.68\\text{ kg CO}_2\\text{e/L}$).\n- **Scope 2:** Purchased grid electricity ($0.45\\text{ kg CO}_2\\text{e/kWh}$ in Egypt).\n- **Reduction Levers:** Rooftop solar PV, condensate heat recovery on jet dyeing machines, and low-liquor-ratio (1:5) dyeing.`,
        },
        {
          position: 2,
          title: 'Building Your Digital Product Passport (DPP)',
          titleAr: 'بناء جواز المنتج الرقمي DPP للمنسوجات المصرية',
          durationMin: 25,
          content: `## Mandatory DPP Data Fields for EU Apparel & Home Textiles\n\n1. Fiber composition & Giza cotton bale traceability\n2. Spinning, weaving, and wet-processing facility identifiers\n3. Verified water consumption (L/kg) and carbon intensity (kg CO₂e/kg)\n4. OEKO-TEX / GOTS / ISO certificate hashes and care & recycling instructions.`,
        },
        {
          position: 3,
          title: 'Level 3 (Advanced): Third-Party CBAM Verification & Cryptographic DPP Signing',
          titleAr: 'المستوى ٣ (متقدم): التدقيق الخارجي للبصمة الكربونية والتوقيع الرقمي لجواز المنتج',
          durationMin: 35,
          content: `## Preparing Your Audit File for European Customs & Retail Buyers\n\n- Reconcile monthly natural gas and electricity utility bills against batch production logs.\n- Generate SHA-256 cryptographic hashes linking each fabric roll QR code to its ISO 17025 test certificate.`,
        },
      ],
    },
    {
      slug: 'air-jet-weaving-mastery',
      title: 'High-Speed Air-Jet Weaving & Giza 86 Zero-Stop Mastery',
      titleAr: 'إتقان النسيج على أنوال الهواء عالية السرعة ومنع انقطاع خيوط جيزة 86',
      description: 'Beginner-to-Advanced technical track grounded in UNIDO & Cotton Egypt™ standards to cut warp/weft stops by 45% and maximize weaving OEE.',
      descriptionAr: 'مسار فني متكامل (مبتدئ ← متقدم) موثق وفق معايير اليونيدو وشعار القطن المصري لتقليل توقفات السداء واللحمة بنسبة 45% ورفع كفاءة الأنوال.',
      provider: 'AI Studio • UNIDO-TIGARA-2025 • CEA-GIZA',
      durationHours: 14,
      level: 'beginner → advanced',
      category: 'TECHNICAL' as const,
      lessons: [
        {
          position: 1,
          title: 'Level 1 (Beginner): Giza 86/94 Yarn Hairiness, Sizing & Humidity Fundamentals',
          titleAr: 'المستوى ١ (مبتدئ): أساسيات تشعير خيوط جيزة 86 وعملية البوش وضبط الرطوبة',
          durationMin: 30,
          content: `## Level 1 (Beginner): Core Principles of High-Speed Cotton Weaving\n\n grounded in **UNIDO-TIGARA-2025** & **CEA-GIZA** standards:\n- Maintain weaving hall relative humidity at **68–72% RH** and temperature at **24–26°C**.\n- Control PVA/starch sizing pick-up at **11.5% ± 0.5%** to encapsulate yarn hairiness without over-stiffening warp ends.`,
        },
        {
          position: 2,
          title: 'Level 2 (Intermediate): Main/Relay Nozzle Pressure Calibration & SMED Beam Change',
          titleAr: 'المستوى ٢ (متوسط): معايرة ضغط فوهات الهواء وتغيير مطواة السداء بمنهجية SMED',
          durationMin: 40,
          content: `## Level 2 (Intermediate): Shop-Floor Calibration & SOPs\n\n- Synchronize main nozzle and relay nozzle timing angles to prevent weft arrival delays and blown picks.\n- Apply **SMED (Single-Minute Exchange of Die)** to reduce warp beam tying and drawing-in from 4 hours to 85 minutes.`,
        },
        {
          position: 3,
          title: 'Level 3 (Advanced): Real-Time Loom OEE Telemetry & Zero-Defect Sateen Auditing',
          titleAr: 'المستوى ٣ (متقدم): التتبع اللحظي لكفاءة الأنوال OEE وتدقيق أقمشة الساتان فائقة الجودة',
          durationMin: 45,
          content: `## Level 3 (Advanced): Predictive Optimization & Export Audit\n\n- Achieve **<1.2 warp stops per 100,000 picks** on 300TC–600TC Egyptian cotton sateen.\n- Integrate automatic pick-counter telemetry into the factory ERP and Digital Product Passport.`,
        },
      ],
    },
    {
      slug: 'iso-17025-quality-shade-control',
      title: 'ISO 17025 Physical Textile Testing & Spectrophotometer Shade Control',
      titleAr: 'اختبارات النسيج الفيزيائية ISO 17025 وضبط الدرجات اللونية بالسبكتروفوتوميتر',
      description: 'Master accredited laboratory testing (ISO 105, ISO 13934, OEKO-TEX 100) and CMC ΔE < 0.8 shade sorting from Beginner to Advanced.',
      descriptionAr: 'إتقان اختبارات المعامل المعتمدة ISO 17025 وثبات الألوان وفرز الدرجات اللونية ΔE < 0.8 للتصدير الأوروبي.',
      provider: 'AI Studio • ISO-17025 • OEKO-TEX-100',
      durationHours: 12,
      level: 'beginner → advanced',
      category: 'QUALITY' as const,
      lessons: [
        {
          position: 1,
          title: 'Level 1 (Beginner): Standard Conditioning Atmosphere & Sample Preparation (ISO 139)',
          titleAr: 'المستوى ١ (مبتدئ): التكييف القياسي للعينات وتجهيز الاختبارات وفق معيار ISO 139',
          durationMin: 30,
          content: `## Level 1 (Beginner): Accredited Lab Foundations\n\n- Pre-condition all textile specimens at **20.0 ± 2.0°C** and **65.0 ± 4.0% RH** for 24 hours prior to physical testing.\n- Understand GSM (ASTM D3776), tensile grab/strip testing (ISO 13934), and Martindale pilling/abrasion (ISO 12945).`,
        },
        {
          position: 2,
          title: 'Level 2 (Intermediate): Spectrophotometer Calibration & CMC (2:1) ΔE Shade Grouping',
          titleAr: 'المستوى ٢ (متوسط): معايرة جهاز السبكتروفوتوميتر وفرز الدرجات اللونية CMC ΔE',
          durationMin: 40,
          content: `## Level 2 (Intermediate): Instrumental Color Control\n\n- Calibrate UV-included / UV-excluded aperture plates at the start of every shift under D65 and TL84 illuminants.\n- Group dyed fabric rolls using **555 shade tapering** so center-to-selvedge and roll-to-roll ΔE remains below **0.8**.`,
        },
        {
          position: 3,
          title: 'Level 3 (Advanced): OEKO-TEX Standard 100 pH/Formaldehyde Audits & Lab Certification',
          titleAr: 'المستوى ٣ (متقدم): تدقيق حدود الأيكوتكس للأس الهيدروجيني والفورمالدهيد واعتماد المعمل',
          durationMin: 45,
          content: `## Level 3 (Advanced): Export Release & Audit Mastery\n\n- Verify fabric extractable pH between **4.0 and 7.5** (Product Class I & II) and zero detectable arylamines.\n- Issue digitally signed ISO 17025 test reports linked directly to buyer escrow milestones.`,
        },
      ],
    },
    {
      slug: 'ilo-spinning-safety-cotton-dust',
      title: 'ILO Occupational Safety, Cotton Dust Control & Ergonomics in Textile Mills',
      titleAr: 'السلامة والصحة المهنية والتحكم في غبار القطن بمصانع الغزل والنسيج (معايير ILO)',
      description: 'Comprehensive Beginner-to-Advanced safety curriculum grounded in ILO Better Work & Egyptian OSH standards for spinning, weaving, and dyeing.',
      descriptionAr: 'منهج متكامل (مبتدئ ← متقدم) للسلامة المهنية والتحكم في غبار القطن وحماية الماكينات وتأمين بيئة العمل وفق معايير منظمة العمل الدولية ILO.',
      provider: 'AI Studio • ILO-OSH • ZDHC-MRSL-v3.1',
      durationHours: 8,
      level: 'beginner → advanced',
      category: 'SAFETY' as const,
      lessons: [
        {
          position: 1,
          title: 'Level 1 (Beginner): Cotton Dust PEL Limits, Respiratory PPE & Acoustic Protection',
          titleAr: 'المستوى ١ (مبتدئ): الحدود المسموحة لغبار القطن ومهمات الوقاية التنفسية والسمعية',
          durationMin: 25,
          content: `## Level 1 (Beginner): Mill Floor Hazard Identification\n\n- Enforce airborne cotton dust limits below **0.2 mg/m³** in blowroom and carding halls to prevent byssinosis.\n- Mandatory SNR ≥ 28 dB hearing protection in high-speed weaving sheds (>85 dBA).`,
        },
        {
          position: 2,
          title: 'Level 2 (Intermediate): Lockout/Tagout (LOTO), Machine Guarding & Chemical Eyewash Stations',
          titleAr: 'المستوى ٢ (متوسط): نظام العزل وتأمين الطاقة LOTO وحواجز الماكينات ومحطات غسيل الأعين',
          durationMin: 30,
          content: `## Level 2 (Intermediate): Shop-Floor Safety SOPs\n\n- Apply strict **Lockout/Tagout (LOTO)** before clearing carding cylinder chokes or entering stenter ovens.\n- Test emergency drench showers and eyewash stations weekly in chemical dispensing rooms.`,
        },
        {
          position: 3,
          title: 'Level 3 (Advanced): Fire Prevention in Lint Ducts & Social Compliance Audit Readiness',
          titleAr: 'المستوى ٣ (متقدم): الوقاية من حرائق فلاتر الزغب واجتياز تدقيق التوافق الاجتماعي الدولي',
          durationMin: 35,
          content: `## Level 3 (Advanced): Safety Management Systems & Buyer Audits\n\n- Maintain spark-detection and automatic CO₂/water-mist suppression in pneumatic lint collection ducts.\n- Pass BSCI, Sedex SMETA, and ILO Better Work factory inspections with zero critical non-conformities.`,
        },
      ],
    },
  ];

  for (const c of courseData) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        titleAr: c.titleAr,
        description: c.description,
        descriptionAr: c.descriptionAr,
        provider: c.provider,
        durationHours: c.durationHours,
        level: c.level,
        category: c.category,
        isPublished: true,
      },
      create: {
        slug: c.slug,
        title: c.title,
        titleAr: c.titleAr,
        description: c.description,
        descriptionAr: c.descriptionAr,
        provider: c.provider,
        durationHours: c.durationHours,
        level: c.level,
        category: c.category,
        isPublished: true,
      },
    });

    const lessonIds: string[] = [];
    for (const l of c.lessons) {
      const lesson = await prisma.lesson.upsert({
        where: { courseId_position: { courseId: course.id, position: l.position } },
        update: {
          title: l.title,
          titleAr: l.titleAr,
          content: l.content,
          durationMin: l.durationMin,
        },
        create: {
          courseId: course.id,
          position: l.position,
          title: l.title,
          titleAr: l.titleAr,
          content: l.content,
          durationMin: l.durationMin,
        },
      });
      lessonIds.push(lesson.id);
    }

    if (c.slug === 'lean-manufacturing') {
      await prisma.enrollment.upsert({
        where: { courseId_userId: { courseId: course.id, userId: owner1.id } },
        update: {
          completedLessons: lessonIds,
          progress: 100,
          status: 'COMPLETED',
          certificateCode: 'MC-UNIDO-2026-01',
          completedAt: new Date(),
        },
        create: {
          courseId: course.id,
          userId: owner1.id,
          completedLessons: lessonIds,
          progress: 100,
          status: 'COMPLETED',
          certificateCode: 'MC-UNIDO-2026-01',
          completedAt: new Date(),
        },
      });
    }
  }

  // 4. Sustainability Records (12 months for f1 and f2)
  const months = [
    { period: '2026-04-01T00:00:00.000Z', elec: 118000, solar: 12000, gas: 16500, diesel: 800, water: 3800, rWater: 950, chem: 4200, waste: 2900, rWaste: 1650, prod: 48000 },
    { period: '2026-05-01T00:00:00.000Z', elec: 115000, solar: 15500, gas: 16000, diesel: 650, water: 3650, rWater: 1050, chem: 4100, waste: 2800, rWaste: 1720, prod: 50000 },
    { period: '2026-06-01T00:00:00.000Z', elec: 112000, solar: 19000, gas: 15200, diesel: 500, water: 3500, rWater: 1180, chem: 3950, waste: 2700, rWaste: 1850, prod: 51500 },
    { period: '2026-07-01T00:00:00.000Z', elec: 109000, solar: 22500, gas: 14800, diesel: 450, water: 3420, rWater: 1300, chem: 3800, waste: 2650, rWaste: 1920, prod: 53000 },
    { period: '2026-08-01T00:00:00.000Z', elec: 106000, solar: 24000, gas: 14200, diesel: 400, water: 3300, rWater: 1420, chem: 3700, waste: 2550, rWaste: 1980, prod: 54500 },
    { period: '2026-09-01T00:00:00.000Z', elec: 102000, solar: 26500, gas: 13900, diesel: 350, water: 3180, rWater: 1550, chem: 3600, waste: 2480, rWaste: 2050, prod: 56000 },
  ];

  for (const m of months) {
    const periodDate = new Date(m.period);
    const co2e = Math.round((m.elec * 0.45 + m.gas * 1.96 + m.diesel * 2.68) * 100) / 100;
    await prisma.sustainabilityRecord.upsert({
      where: { factoryId_period: { factoryId: f1.id, period: periodDate } },
      update: {
        electricityKwh: m.elec,
        solarKwh: m.solar,
        naturalGasM3: m.gas,
        dieselLiters: m.diesel,
        waterM3: m.water,
        recycledWaterM3: m.rWater,
        chemicalsKg: m.chem,
        wasteKg: m.waste,
        recycledWasteKg: m.rWaste,
        productionKg: m.prod,
        co2eKg: co2e,
      },
      create: {
        factoryId: f1.id,
        period: periodDate,
        electricityKwh: m.elec,
        solarKwh: m.solar,
        naturalGasM3: m.gas,
        dieselLiters: m.diesel,
        waterM3: m.water,
        recycledWaterM3: m.rWater,
        chemicalsKg: m.chem,
        wasteKg: m.waste,
        recycledWasteKg: m.rWaste,
        productionKg: m.prod,
        co2eKg: co2e,
      },
    });
  }

  // 5. Funding Programs
  const existingPrograms = await prisma.fundingProgram.count();
  if (existingPrograms === 0) {
    const p1 = await prisma.fundingProgram.create({
      data: {
        title: 'GEFF Egypt Green Economy Financing Facility',
        titleAr: 'مرفق تمويل الاقتصاد الأخضر GEFF لتحديث مصانع النسيج',
        provider: 'EBRD / NBE / QNB',
        type: 'GRANT',
        description: 'Up to 15% cashback incentive grant on rooftop solar PV, heat-recovery boilers, and low-liquor-ratio dyeing machines.',
        descriptionAr: 'منحة استرداد نقدي تصل إلى 15% عند تركيب محطات الطاقة الشمسية وغلايات استرداد الحرارة وماكينات الصباغة الموفرة للمياه.',
        eligibility: 'Registered industrial SMEs in El Mahalla El Kubra with >2 years operational track record.',
        maxAmount: 2500000,
        currency: 'EGP',
        deadline: new Date(Date.now() + 45 * 86400000),
        url: 'https://ebrdgeff.com/egypt',
        tags: ['sustainability', 'production'],
        isActive: true,
      },
    });

    const p2 = await prisma.fundingProgram.create({
      data: {
        title: 'TIGARA / UNIDO Digital & Quality Co-Investment Subsidy',
        titleAr: 'منحة تيجارة / اليونيدو للتحول الرقمي وشهادات التصدير',
        provider: 'UNIDO / EU TIGARA',
        type: 'SUBSIDY',
        description: 'Covers 70% of cloud ERP/MES deployment, barcode roll traceability, and OEKO-TEX / GOTS certification audits.',
        descriptionAr: 'تغطية 70% من تكلفة تطبيق أنظمة تخطيط موارد المؤسسات ERP وتتبع الباركود وشهادات الأيكوتكس و GOTS.',
        eligibility: 'Mahalla Textile Cluster member factories with 15–250 employees.',
        maxAmount: 450000,
        currency: 'EGP',
        deadline: new Date(Date.now() + 30 * 86400000),
        url: 'https://www.unido.org',
        tags: ['digital', 'quality', 'market'],
        isActive: true,
      },
    });

    await prisma.fundingProgram.create({
      data: {
        title: 'CBE / MSMEDA Industrial Machinery Modernization Credit Line',
        titleAr: 'مبادرة البنك المركزي وجهاز تنمية المشروعات لتحديث خطوط الإنتاج',
        provider: 'MSMEDA / CBE',
        type: 'LOAN',
        description: 'Subsidized diminishing-balance financing for high-speed air-jet looms and automated cutting tables.',
        descriptionAr: 'تمويل ميسر لتوريد أنوال الهواء الحديثة وطاولات القص الأوتوماتيكية لمصانع المحلة.',
        eligibility: 'Valid Industrial Register & Tax Card.',
        maxAmount: 8000000,
        currency: 'EGP',
        deadline: new Date(Date.now() + 90 * 86400000),
        tags: ['production', 'people'],
        isActive: true,
      },
    });

    await prisma.fundingApplication.upsert({
      where: { programId_factoryId: { programId: p2.id, factoryId: f1.id } },
      update: {},
      create: {
        programId: p2.id,
        factoryId: f1.id,
        amountRequested: 380000,
        purpose: 'Deploying cloud loom OEE monitoring sensors across 24 weaving machines and renewing OEKO-TEX Standard 100.',
        status: 'APPROVED',
        reviewNote: 'Approved under TIGARA Batch 2 technical modernization cohort.',
      },
    });

    await prisma.fundingApplication.upsert({
      where: { programId_factoryId: { programId: p1.id, factoryId: f1.id } },
      update: {},
      create: {
        programId: p1.id,
        factoryId: f1.id,
        amountRequested: 1850000,
        purpose: 'Installing 250 kWp rooftop solar PV array and dyehouse heat exchanger.',
        status: 'UNDER_REVIEW',
      },
    });
  }

  // 6. Forum Threads & Replies
  const existingThreads = await prisma.forumThread.count();
  if (existingThreads === 0) {
    const t1 = await prisma.forumThread.create({
      data: {
        authorId: owner1.id,
        title: 'أفضل طريقة لتقليل استهلاك المياه في الصباغة التفاعلية للقطن؟',
        body: 'نبحث عن تجارب عملية داخل مصانع المحلة لتقليل نسبة الحمام (Liquor Ratio) في صباغة غزل القطن جيزة 86 دون التأثير على ثبات اللون للغسيل والاحتكاك.',
        category: 'TECHNICAL',
        isPinned: true,
        viewCount: 142,
        tags: ['Dyeing', 'Water', 'Giza-86'],
      },
    });

    await prisma.forumPost.create({
      data: {
        threadId: t1.id,
        authorId: expertUser1.id,
        body: 'من واقع تطبيقنا في 4 مصابغ بالمحلة، التحول إلى الصباغة بنسبة حمام 1:6 مع استخدام غسيل التدفق العكسي (Counter-current rinsing) وتثبيت درجة الحموضة إلكترونياً يخفض استهلاك المياه بنسبة 38% ويوفر 22% من البخار.',
        isAccepted: true,
      },
    });

    await prisma.forumPost.create({
      data: {
        threadId: t1.id,
        authorId: owner2.id,
        body: 'نؤكد ذلك، قمنا أيضاً بتركيب وحدة فلترة UF لاسترجاع مياه الشطف الأخيرة وإعادة استخدامها في الحمام الأول.',
        isAccepted: false,
      },
    });

    const t2 = await prisma.forumThread.create({
      data: {
        authorId: owner3.id,
        title: 'How are Mahalla exporters preparing for EU Digital Product Passport (DPP) in 2027?',
        body: 'Several of our German and Italian hospitality buyers asked for batch-level carbon intensity (kg CO2e/kg) and cotton bale origin data. Are we standardizing a template across the cluster?',
        category: 'MARKET',
        isPinned: false,
        viewCount: 89,
        tags: ['EU-Export', 'DPP', 'CBAM'],
      },
    });

    await prisma.forumPost.create({
      data: {
        threadId: t2.id,
        authorId: expertUser2.id,
        body: 'Yes! You can now log your monthly electricity, solar, and gas data directly in the Cluster Sustainability & ESG Tracker, then click "Export CBAM CSV" to generate the exact Scope 1+2 intensity report requested by EU buyers.',
        isAccepted: true,
      },
    });
  }

  // 7. Cluster Events
  const existingEvents = await prisma.clusterEvent.count();
  if (existingEvents === 0) {
    const ev1 = await prisma.clusterEvent.create({
      data: {
        organizerId: admin.id,
        title: 'Heimtextil Frankfurt 2027 — Mahalla Pavilion & B2B Matchmaking Prep',
        titleAr: 'ورشة التحضير لجناح المحلة في معرض هايم تكستيل فرانكفورت 2027',
        description: 'Prepare export collections, pricing sheets, and EU Digital Product Passport QR tags for German and Nordic buyers.',
        type: 'WORKSHOP',
        startsAt: new Date(Date.now() + 6 * 86400000),
        endsAt: new Date(Date.now() + 6 * 86400000 + 4 * 3600000),
        location: 'TIGARA Innovation Hub, El Mahalla El Kubra',
        capacity: 50,
      },
    });

    await prisma.clusterEvent.create({
      data: {
        organizerId: admin.id,
        title: 'European Apparel & Home Textile Buyers Delegation Visit',
        titleAr: 'بعثة المشترين الأوروبيين ولقاءات التعاقد الثنائية B2B بالمحلة',
        description: 'Direct factory floor tours and B2B sourcing tables with 14 verified buyers from Italy, Germany, and Spain.',
        type: 'B2B_MEETING',
        startsAt: new Date(Date.now() + 14 * 86400000),
        endsAt: new Date(Date.now() + 14 * 86400000 + 7 * 3600000),
        location: 'Misr Spinning Conference Hall, El Mahalla El Kubra',
        capacity: 80,
      },
    });

    await prisma.clusterEvent.create({
      data: {
        organizerId: expertUser2.id,
        title: 'Live Webinar: Zero-Defect Reactive Dyeing & ZDHC Gateway Onboarding',
        titleAr: 'ندوة إلكترونية: الصباغة التفاعلية بدون عيوب والتسجيل في منصة ZDHC',
        description: 'Step-by-step live walkthrough of chemical inventory uploads and wastewater testing compliance.',
        type: 'WEBINAR',
        startsAt: new Date(Date.now() + 19 * 86400000),
        endsAt: new Date(Date.now() + 19 * 86400000 + 2 * 3600000),
        location: 'Online (Zoom)',
        onlineUrl: 'https://zoom.us/j/mahalla-cluster-zdhc',
        capacity: 200,
      },
    });

    await prisma.eventRegistration.upsert({
      where: { eventId_userId: { eventId: ev1.id, userId: owner1.id } },
      update: {},
      create: { eventId: ev1.id, userId: owner1.id, status: 'REGISTERED' },
    });
  }

  // 8. Expert Profiles & Mentorship
  const exp1 = await prisma.expertProfile.upsert({
    where: { userId: expertUser1.id },
    update: {
      displayName: 'Dr. Khaled Soliman',
      headline: 'Senior Wet-Processing, Reactive Dyeing & ZDHC Compliance Advisor',
      bio: '22+ years optimizing dyehouses across El Mahalla El Kubra, 10th of Ramadan, and Bursa. Former UNIDO senior technical advisor for water & energy efficiency.',
      expertise: ['Dyeing Chemistry', 'ZDHC & Effluent', 'Lean Manufacturing', 'OEE'],
      languages: ['Arabic', 'English', 'German'],
      yearsExp: 22,
      hourlyRate: 0,
      isMentor: true,
      isVerified: true,
    },
    create: {
      userId: expertUser1.id,
      displayName: 'Dr. Khaled Soliman',
      headline: 'Senior Wet-Processing, Reactive Dyeing & ZDHC Compliance Advisor',
      bio: '22+ years optimizing dyehouses across El Mahalla El Kubra, 10th of Ramadan, and Bursa. Former UNIDO senior technical advisor for water & energy efficiency.',
      expertise: ['Dyeing Chemistry', 'ZDHC & Effluent', 'Lean Manufacturing', 'OEE'],
      languages: ['Arabic', 'English', 'German'],
      yearsExp: 22,
      hourlyRate: 0,
      isMentor: true,
      isVerified: true,
    },
  });

  await prisma.expertProfile.upsert({
    where: { userId: expertUser2.id },
    update: {
      displayName: 'Eng. Mona Zaki',
      headline: 'EU Textile Export, CBAM Carbon Accounting & OEKO-TEX/GOTS Lead Auditor',
      bio: '15 years guiding Egyptian spinning, weaving, and home-textile SMEs into Tier-1 European retail supply chains.',
      expertise: ['EU Export & CBAM', 'OEKO-TEX / GOTS', 'Digital Product Passport', 'Costing'],
      languages: ['Arabic', 'English', 'Italian'],
      yearsExp: 15,
      hourlyRate: 850,
      isMentor: true,
      isVerified: true,
    },
    create: {
      userId: expertUser2.id,
      displayName: 'Eng. Mona Zaki',
      headline: 'EU Textile Export, CBAM Carbon Accounting & OEKO-TEX/GOTS Lead Auditor',
      bio: '15 years guiding Egyptian spinning, weaving, and home-textile SMEs into Tier-1 European retail supply chains.',
      expertise: ['EU Export & CBAM', 'OEKO-TEX / GOTS', 'Digital Product Passport', 'Costing'],
      languages: ['Arabic', 'English', 'Italian'],
      yearsExp: 15,
      hourlyRate: 850,
      isMentor: true,
      isVerified: true,
    },
  });

  const existingMentorships = await prisma.mentorshipRequest.count();
  if (existingMentorships === 0) {
    await prisma.mentorshipRequest.create({
      data: {
        expertId: exp1.id,
        requesterId: owner1.id,
        topic: 'Reducing salt & water usage in dark navy reactive cotton dyeing',
        message: 'We would like a 2-hour floor audit of our jet dyeing recipes next Tuesday.',
        status: 'ACCEPTED',
      },
    });
  }

  // 9. Announcements
  const existingAnnouncements = await prisma.announcement.count();
  if (existingAnnouncements === 0) {
    await prisma.announcement.create({
      data: {
        authorId: admin.id,
        title: 'Bulk Giza 86 Cotton Yarn Pool Closing Friday — 86% Target Reached',
        titleAr: 'إغلاق التجمع الشرائي لغزل قطن جيزة 86 يوم الجمعة — تم تغطية 86% من الكمية',
        body: 'Participating Mahalla weaving and knitting mills have already locked in a 14% volume discount. Submit your final tonnages before Friday 5:00 PM.',
        bodyAr: 'تمكنت مصانع النسيج والتريكو المشاركة في التجمع من تأمين خصم كميات بنسبة 14%. يرجى تسجيل الكميات النهائية قبل الساعة 5 مساء الجمعة.',
        audience: 'ALL',
        isPinned: true,
      },
    });

    await prisma.announcement.create({
      data: {
        authorId: admin.id,
        title: 'Free ISO 17025 Physical & Color-Fastness Lab Vouchers for Cluster SMEs',
        titleAr: 'قسائم فحص مجانية بمعمل اختبارات الجودة المعتمد ISO 17025 للمصانع الأعضاء',
        body: 'Each verified SME factory can book up to 6 complimentary hours of tensile strength, pilling, and color-fastness testing at the TIGARA Textile Testing Lab this month.',
        bodyAr: 'يمكن لكل مصنع معتمد بالتجمع حجز 6 ساعات مجانية لاختبارات قوة الشد وثبات الألوان في معمل تيجارة المركزي خلال هذا الشهر.',
        audience: 'FACTORIES',
        isPinned: false,
      },
    });
  }

  // 10. Additional Procurement Pool if fewer than 2 exist
  const poolCount = await prisma.procurementPool.count();
  if (poolCount < 2) {
    await prisma.procurementPool.create({
      data: {
        organizerId: admin.id,
        title: 'ZDHC Level-3 Reactive Dyes & Auxiliaries Q4 Bundle',
        titleAr: 'شراء جماعي للأصباغ التفاعلية والكيماويات المعتمدة ZDHC للربع الرابع',
        description: 'Joint import of certified bifunctional reactive dyes (Black B, Navy RGB, Crimson) with guaranteed lot-to-lot shade consistency.',
        category: 'DYES_CHEMICALS',
        specification: 'ZDHC MRSL v3.1 Level 3 Conformance',
        targetQty: 12000,
        unit: 'kg',
        minCommitQty: 250,
        benchmarkUnitPrice: 410,
        targetUnitPrice: 345,
        negotiatedUnitPrice: 340,
        currency: 'EGP',
        supplierName: 'Archroma / Dystar Authorized Distributor',
        deadline: new Date(Date.now() + 14 * 86400000),
        status: 'OPEN',
        commitments: {
          create: [
            { factoryId: f2.id, quantity: 4500, status: 'COMMITTED' },
            { factoryId: f4.id, quantity: 3000, status: 'COMMITTED' },
          ],
        },
      },
    });
  }

  // 11. Buyer Persona, Digital Product Passports, Smart Contracts, B2B Conversations & Reviews
  const buyer1 = await prisma.user.upsert({
    where: { email: 'buyer@eurotextiles.de' },
    update: { role: 'buyer', firstName: 'Stefan', lastName: 'Weber (EU Buyer)' },
    create: {
      id: 'user_seed_buyer1',
      email: 'buyer@eurotextiles.de',
      firstName: 'Stefan',
      lastName: 'Weber (EU Buyer)',
      role: 'buyer',
      locale: 'en',
    },
  });

  // Ensure all product listings have EU Digital Product Passports
  const productListings = await prisma.marketplaceListing.findMany({
    where: { type: 'PRODUCT', deletedAt: null },
  });
  for (const item of productListings) {
    await prisma.productPassport.upsert({
      where: { listingId: item.id },
      update: {},
      create: {
        listingId: item.id,
        origin: 'El Mahalla El Kubra, Gharbia, Egypt',
        material: '100% Egyptian Long-Staple Combed Cotton (Giza 86)',
        fiberOrigin: 'Nile Delta — Kafr El-Sheikh & Gharbia Cooperative Ginning',
        carbonFootprint: '2.08 kg CO2e / kg textile (Scope 1 + 2 verified)',
        waterUsage: '39 L / kg (Closed-loop UF recovery)',
        certifications: 'OEKO-TEX Standard 100, ISO 9001:2015, ZDHC MRSL Level 3',
        recyclability: '100% Mechanically Recyclable Mono-Fiber Cotton',
        signatureHash: `0x9f84c2e1b7a04d3c8e51209ab45f67d2e8c1a3094b7f82d1c6e5a4b30192f8a1`,
      },
    });
  }

  // Ensure Smart Escrow Contracts exist
  const contractCount = await prisma.contract.count();
  if (contractCount === 0) {
    await prisma.contract.create({
      data: {
        title: 'Export Order: 12,000 m Giza 86 Sateen 300TC + Reactive Dyeing',
        totalAmount: 540000,
        currency: 'EGP',
        status: 'IN_PRODUCTION',
        incoterm: 'FOB Alexandria',
        buyerId: buyer1.id,
        factoryId: f1.id,
        buyerAcceptedAt: new Date(Date.now() - 5 * 86400000),
        factoryAcceptedAt: new Date(Date.now() - 4 * 86400000),
        milestones: {
          create: [
            {
              title: '1. Advance Deposit (30%) — Giza 86 Yarn Allocation',
              amount: 162000,
              status: 'RELEASED',
              releasedAt: new Date(Date.now() - 3 * 86400000),
            },
            {
              title: '2. Weaving & Reactive Dyeing Inspection (40%)',
              amount: 216000,
              status: 'FUNDED',
            },
            {
              title: '3. Final Bill of Lading & EU DPP Handover (30%)',
              amount: 162000,
              status: 'PENDING',
            },
          ],
        },
      },
    });
  }

  // Ensure B2B Conversations & Messages exist
  const convoCount = await prisma.conversation.count();
  if (convoCount === 0) {
    const c1 = await prisma.conversation.create({
      data: {
        buyerId: buyer1.id,
        factoryId: f1.id,
        lastMessageAt: new Date(),
      },
    });
    await prisma.message.createMany({
      data: [
        {
          conversationId: c1.id,
          senderId: buyer1.id,
          content:
            'Hello Misr Spinning team, we are reviewing your Giza 86 combed yarn and 300TC sateen specs for our Q1 Frankfurt hospitality line. Can you provide OEKO-TEX & DPP batch data?',
        },
        {
          conversationId: c1.id,
          senderId: f1.ownerId,
          content:
            'Welcome Stefan! Yes, all our Giza 86 lots include verified Scope 1+2 carbon intensity (2.08 kg CO2e/kg) and ISO 17025 lab test reports from the TIGARA Testing Lab.',
        },
      ],
    });
  }

  // Ensure Factory Reviews exist
  await prisma.review.upsert({
    where: { factoryId_reviewerId: { factoryId: f1.id, reviewerId: buyer1.id } },
    update: { rating: 5 },
    create: {
      factoryId: f1.id,
      reviewerId: buyer1.id,
      rating: 5,
      comment:
        'Exceptional Giza 86 yarn regularity and fast reactive dyeing turnaround. Full EU Digital Product Passport documentation was provided on schedule.',
    },
  });

  console.log('All Mahalla Textile Cluster modules seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
