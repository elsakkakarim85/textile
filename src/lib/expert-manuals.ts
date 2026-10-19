export interface ManualStep {
  titleEn: string;
  titleAr: string;
  detailEn: string;
  detailAr: string;
}

export interface ManualSubFeature {
  nameEn: string;
  nameAr: string;
  purposeEn: string;
  purposeAr: string;
  howToUseEn: string;
  howToUseAr: string;
  linkedManualId?: string;
}

export interface ExpertManualEntry {
  id: string;
  category:
    | 'lean_excellence'
    | 'export_trade'
    | 'collaboration'
    | 'ai_academy'
    | 'observatory_community'
    | 'gadgets_calculators'
    | 'dashboards_admin';
  badgeEn: string;
  badgeAr: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  whatIsThisEn: string;
  whatIsThisAr: string;
  howItWorksEn: string;
  howItWorksAr: string;
  formulaOrArchitecture?: string;
  whyToUseEn: string[];
  whyToUseAr: string[];
  howToUseSteps: ManualStep[];
  proTipEn: string;
  proTipAr: string;
  subFeatures?: ManualSubFeature[];
}

export const EXPERT_MANUALS: Record<string, ExpertManualEntry> = {
  // ============================================================================
  // 0. PLATFORM OVERVIEW & COMMAND HUB
  // ============================================================================
  'platform-home': {
    id: 'platform-home',
    category: 'observatory_community',
    badgeEn: 'Platform Master Manual',
    badgeAr: 'الدليل الشامل للمنصة',
    titleEn: 'El-Mahalla El-Kubra Industrial Textile Cluster Platform',
    titleAr: 'المنصة الرقمية المتكاملة لتجمع المحلة الكبرى لصناعة الغزل والنسيج',
    subtitleEn: 'EU • UNIDO • Ministry of Industry • MOFAIC — TIGARA Flagship Digital Ecosystem',
    subtitleAr: 'منظومة رقمية متكاملة للتميز الصناعي، التصدير العالمي، التعاون المشترك، والذكاء الاصطناعي',
    whatIsThisEn:
      'The official B2B industrial operating system uniting 520+ spinning, weaving, knitting, dyeing, finishing, and garment factories in El-Mahalla El-Kubra with international buyers, raw-material suppliers, testing labs, and 7 free AI/LLM engines.',
    whatIsThisAr:
      'نظام التشغيل الصناعي الرسمي (B2B) الذي يوحد أكثر من 520 مصنع غزل ونسيج وتريكو وصباغة وتجهيز وملابس بالمحلة الكبرى مع المشترين الدوليين وموردي الخامات والمعامل المعتمدة و7 نماذج ذكاء اصطناعي مجانية.',
    howItWorksEn:
      'Organized into 5 strategic pillars in the top Mega-Menu (Excellence & Lean, Trade & Export, Collaboration, AI & Academy, Observatory & Community), plus 4 Instant AI Studio Bars on the landing page, a Global Quick Tools Dock (Ctrl+K), and a Contextual Free Multi-LLM Copilot on every page.',
    howItWorksAr:
      'تعمل المنصة عبر 5 ركائز استراتيجية في القائمة العلوية (التميز واللين، التجارة والتصدير، التعاون الصناعي، الذكاء والأكاديمية، والمرصد والمجتمع)، بالإضافة إلى 4 أشرطة ذكاء اصطناعي فورية بالصفحة الرئيسية، وحقيبة أدوات المهندس السريعة (Ctrl+K)، والمساعد الذكي المجاني أسفل كل صفحة.',
    formulaOrArchitecture:
      '5 Strategic Pillars × 17 Cluster Modules + 9-Pillar Lean Six Sigma Suite + 5-Provider Free LLM Cascade (Groq • Gemini • OpenRouter • Pollinations • Deterministic Engine)',
    whyToUseEn: [
      'Reduce raw material costs by 12–18% through aggregated Joint Procurement Pools for Giza yarn, ZDHC dyes, and solar energy.',
      'Boost shop-floor OEE by +15–22% and cut machine changeover times by 50%+ using the 9-Pillar Lean Six Sigma & TPM Suite.',
      'Discover verified international buyers across 190+ countries and comply with EU CBAM & Digital Product Passport (ESPR) regulations.',
      'Access 7 world-class free AI models (Llama 3.3 70B, DeepSeek R1, Gemini 2.5, Qwen 2.5 72B) with zero subscription fees.',
    ],
    whyToUseAr: [
      'خفض تكلفة شراء الغزول والصبغات والطاقة بنسبة 12–18% عبر مجموعات الشراء الموحد لمصانع المحلة.',
      'رفع كفاءة الماكينات (OEE) بنسبة 15–22% وتقليل زمن تغيير اللوطات (SMED) لأكثر من النصف عبر منظومة اللين 6 سيجما.',
      'الوصول إلى مشترين دوليين موثقين في 190+ دولة والتوافق الكامل مع جواز المنتج الرقمي الأوروبي (DPP) وآلية الكربون (CBAM).',
      'الاستفادة المجانية الكاملة من 7 نماذج ذكاء اصطناعي عالمية لتوليد الدراسات والدورات والخطط الهندسية والتسويقية.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Select Your Role / Workspace Persona',
        titleAr: '١. اختر دورك أو حساب مصنعك من أعلى اليمين',
        detailEn: 'Use the Workspace icon in the top navbar to switch between Factory Owner, International Buyer, Expert, or Cluster Admin.',
        detailAr: 'استخدم أيقونة الحساب في الشريط العلوي للتبديل بين صاحب مصنع، مشتري دولي، خبير صناعي، أو إدارة التجمع.',
      },
      {
        titleEn: '2. Navigate via the 5-Pillar Mega-Menu or Ctrl+K',
        titleAr: '٢. تنقل عبر القوائم الـ 5 العلوية أو اضغط Ctrl+K',
        detailEn: 'Hover over any of the 5 top pillars to see its specialized modules, or press Ctrl+K to search all 28+ modules and use pocket textile calculators.',
        detailAr: 'مرر المؤشر على أي قائمة علوية لاستعراض وحداتها، أو اضغط Ctrl+K للبحث الفوري واستخدام حاسبات الغزل والقماش.',
      },
      {
        titleEn: '3. Launch Any-Topic AI Studios Directly from the Homepage',
        titleAr: '٣. شغّل استوديوهات الذكاء الاصطناعي الفورية من الصفحة الرئيسية',
        detailEn: 'Type any factory problem, export product, training topic, or brand name into the 4 spotlight bars on the homepage for instant deliverables.',
        detailAr: 'اكتب أي مشكلة إنتاجية أو منتج تصديري أو موضوع تدريبي أو اسم علامة تجارية في الأشرطة الأربعة بالصفحة الرئيسية.',
      },
      {
        titleEn: '4. Click the (?) Manual Icon on Any Module or Gadget',
        titleAr: '٤. اضغط على أيقونة الدليل (؟) بجانب أي وحدة أو أداة',
        detailEn: 'Every module, calculator, and studio tab has an integrated (?) icon that opens its dedicated operational & engineering manual.',
        detailAr: 'كل وحدة وحاسبة وتبويب يحتوي على أيقونة (؟) مدمجة تفتح دليل الاستخدام الهندسي والتشغيلي الخاص بها.',
      },
    ],
    proTipEn: 'Press Ctrl+K at any time from any page to open the Pocket Yarn Count (Ne/Nm/Tex/Denier), Fabric GSM, and Takt Time calculator without leaving your workflow.',
    proTipAr: 'اضغط Ctrl+K في أي وقت ومن أي صفحة لفتح حاسبة نمر الغزل (Ne/Nm/Tex/Denier) ووزن القماش GSM وزمن التاكت دون مغادرة صفحتك.',
    subFeatures: [
      {
        nameEn: 'Instant Lean & Six Sigma Bar',
        nameAr: 'شريط اللين و6 سيجما الفوري',
        purposeEn: 'Generates a complete 9-pillar Toyota Production System & Six Sigma blueprint for any shop-floor problem.',
        purposeAr: 'يولّد خطة لين 6 سيجما متكاملة من 9 ركائز لأي مشكلة تشغيلية بالمصنع.',
        howToUseEn: 'Type your bottleneck (e.g., "Reduce warp breakage on air-jet looms") and click Launch.',
        howToUseAr: 'اكتب المشكلة (مثل: تقليل قطع السداء أو رفع كفاءة الصباغة) واضغط توليد.',
        linkedManualId: 'lean-manufacturing',
      },
      {
        nameEn: 'Instant Global Export & Buyers AI Bar',
        nameAr: 'شريط ذكاء التصدير والمشترين الفوري',
        purposeEn: 'Generates market studies, landed-cost pricing, live tenders, and verified buyer outreach for any textile HS code.',
        purposeAr: 'يولّد دراسة سوق وتسعير شحن ومناقصات وقائمة مشترين دوليين لأي منتج نسيجي.',
        howToUseEn: 'Enter product + target country (e.g., "550 GSM Terry Towels to Germany") and click Launch.',
        howToUseAr: 'أدخل المنتج والدولة المستهدفة (مثل: فوط فندقية 550 جرام إلى ألمانيا) واضغط انطلاق.',
        linkedManualId: 'export-intelligence',
      },
      {
        nameEn: 'Instant Academy Course Studio Bar',
        nameAr: 'شريط توليد الدورات التدريبية الفوري',
        purposeEn: 'Builds a 3-tier Beginner/Intermediate/Advanced technical course with SVG diagrams and quizzes on any topic.',
        purposeAr: 'يبني دورة تدريبية هندسية من 3 مستويات مع رسوم توضيحية واختبارات لأي موضوع.',
        howToUseEn: 'Type any topic (e.g., "ZDHC Chemical Management" or "SMED Quick Changeover") and click Generate.',
        howToUseAr: 'اكتب عنوان الدورة المطلوبة واضغط توليد لبناء المنهج والشهادة فوراً.',
        linkedManualId: 'academy-studio',
      },
      {
        nameEn: 'Instant Brand & Print Collateral Bar',
        nameAr: 'شريط استوديو الهوية والمطبوعات الفوري',
        purposeEn: 'Creates textile brand identities, 90-day marketing plans, and print-ready brochures, flyers, and trade-show roll-ups.',
        purposeAr: 'ينشئ هوية بصرية وخطة تسويق 90 يوماً وبروشور وفلاير ورول أب معارض جاهز للطباعة.',
        howToUseEn: 'Enter your mill or brand name and target market, then click Launch Brand Studio.',
        howToUseAr: 'أدخل اسم مصنعك أو علامتك التجارية والسوق المستهدف واضغط فتح الاستوديو.',
        linkedManualId: 'brand-studio',
      },
    ],
  },

  'cluster-hub': {
    id: 'cluster-hub',
    category: 'collaboration',
    badgeEn: 'Command Center Manual',
    badgeAr: 'دليل المركز الرئيسي للتجمع',
    titleEn: 'Cluster Collaboration & Modernization Command Hub',
    titleAr: 'المركز الرئيسي للتعاون الصناعي والتحديث (١٧ وحدة)',
    subtitleEn: 'Unified launchpad for all 17 Collaboration, Modernization, AI Studio & Community modules',
    subtitleAr: 'نقطة الانطلاق الموحدة لجميع وحدات التعاون والتحديث والذكاء الاصطناعي والمرصد',
    whatIsThisEn:
      'The central executive cockpit of the El-Mahalla El-Kubra Cluster where factory owners, engineers, buyers, and PMO officers see real-time telemetry across all 17 cluster modules, official PMO announcements, and 1-click module launchers.',
    whatIsThisAr:
      'غرفة القيادة المركزية لتجمع المحلة الكبرى التي تعرض المؤشرات الحية لجميع وحدات التجمع الـ 17، والتعميمات الرسمية لإدارة التجمع، وروابط التشغيل المباشرة.',
    howItWorksEn:
      'Aggregates live PostgreSQL counts (Active Buying Pools, Idle Capacity Posts, Export Consortia, Shared Labs, Academy Courses, ESG Records, Funding Grants, and Upcoming Events) with deterministic offline fallbacks and a categorized 4-Pillar Sub-Navigation bar.',
    howItWorksAr:
      'تجمع البيانات الحية من قاعدة البيانات (مجموعات الشراء، الطاقات الفائضة، التحالفات التصديرية، المعامل المشتركة، الدورات، الاستدامة، والمنح) مع شريط تنقل فرعي مقسم إلى 4 ركائز ذكية.',
    formulaOrArchitecture:
      '4 Cluster Pillars: (1) Operational Excellence & Lean • (2) Export, Brand & Trade • (3) Industrial Collaboration • (4) AI Academy & Community',
    whyToUseEn: [
      'Get a 360-degree snapshot of cluster activity, open buying pools, and grant deadlines in 5 seconds.',
      'Switch effortlessly between all 17 specialized cluster modules using the 4-Pillar Sub-Navigation strip.',
      'Read pinned official PMO bulletins and launch any of the 4 AI generation studios directly.',
    ],
    whyToUseAr: [
      'رؤية شاملة لنشاط التجمع ومجموعات الشراء المفتوحة ومواعيد المنح في ثوانٍ معدودة.',
      'التنقل السريع بين 17 وحدة متخصصة عبر شريط الركائز الأربع المدمج.',
      'متابعة التعميمات الرسمية المثبتة وتشغيل استوديوهات الذكاء الاصطناعي الأربعة مباشرة.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Review Live Cluster Telemetry KPIs',
        titleAr: '١. راجع مؤشرات التجمع الحية أعلى الصفحة',
        detailEn: 'Check open buying pools, capacity exchange posts, active consortia, and available grants.',
        detailAr: 'تابع عدد مجموعات الشراء المفتوحة وعروض الطاقات الفائضة والتحالفات والمنح المتاحة.',
      },
      {
        titleEn: '2. Use the 4-Pillar Sub-Navigation Bar',
        titleAr: '٢. استخدم شريط التنقل الفرعي ذو الـ 4 ركائز',
        detailEn: 'Click any of the 4 pillars at the top of the cluster layout to reveal its sub-modules.',
        detailAr: 'اضغط على أي ركيزة من الركائز الأربع أعلى الصفحة لإظهار الوحدات التابعة لها.',
      },
      {
        titleEn: '3. Launch Any Module Card or AI Studio',
        titleAr: '٣. افتح أي وحدة أو شغّل استوديوهات الذكاء الاصطناعي',
        detailEn: 'Click any module card to enter its workspace or use the Instant AI bars at the top.',
        detailAr: 'اضغط على بطاقة أي وحدة للدخول إليها أو استخدم أشرطة التوليد الذكي الفوري.',
      },
    ],
    proTipEn: 'Bookmark /[locale]/cluster as your daily morning dashboard to catch new joint-buying pools and export RFQ consortia before slots fill up.',
    proTipAr: 'اجعل صفحة المركز الرئيسي صفحتك الصباحية اليومية لمتابعة مجموعات الشراء الموحد والتحالفات التصديرية الجديدة فور طرحها.',
  },

  // ============================================================================
  // 1. LEAN MANAGEMENT, SIX SIGMA & OEE SUITE (+ 9 PILLAR SUB-MANUALS)
  // ============================================================================
  'lean-manufacturing': {
    id: 'lean-manufacturing',
    category: 'lean_excellence',
    badgeEn: '9-Pillar TPS & Six Sigma Manual',
    badgeAr: 'دليل اللين 6 سيجما الشامل (٩ ركائز)',
    titleEn: 'Lean Management, Toyota Production System (TPS) & Six Sigma Hub',
    titleAr: 'مركز الإدارة الرشيقة ونظام تويوتا الإنتاجي (TPS) ولين 6 سيجما',
    subtitleEn: 'Interactive VSM, 8 Wastes, 5S Audit, OEE/TPM, SMED, Yamazumi Line Balancing, Kanban, Poka-Yoke/SPC & AI Kaizen Studio',
    subtitleAr: 'منظومة هندسية تفاعلية: خريطة تدفق القيمة، الفواقد الـ 8، تدقيق 5S، كفاءة المعدات OEE، تقليل زمن التجهيز SMED، موازنة الخطوط، كانبان، بوكا يوكي، وتقارير A3 بالذكاء الاصطناعي',
    whatIsThisEn:
      'An industrial engineering & operational excellence workstation built specifically for spinning, weaving, knitting, dyeing, printing, finishing, and garment factories. It combines 8 interactive shop-floor calculators and audit tools with a custom AI Lean & Six Sigma Black Belt Consultant (Pillar 9).',
    whatIsThisAr:
      'محطة عمل هندسية متكاملة للتميز التشغيلي صُممت خصيصاً لمصانع الغزل والنسيج والتريكو والصباغة والتجهيز والملابس. تجمع بين 8 حاسبات وأدوات تدقيق تفاعلية لصالة الإنتاج مع مستشار ذكاء اصطناعي بمستوى حزام أسود في اللين 6 سيجما (الركيزة التاسعة).',
    howItWorksEn:
      'Select your textile sector (Spinning, Weaving, Knitting, Dyeing, Garments) and click any of the 9 Pillar tabs. Every calculator computes real-time industrial engineering metrics (Takt Time, PCE%, 8-Waste EGP loss, 5S Radar score, OEE% & Six Big Losses, SMED ECRS savings, Yamazumi Line Efficiency, Kanban bin sizing, and Six Sigma Cpk/DPMO) and lets you export a complete Markdown SOP or generate a custom AI Kaizen A3 plan.',
    howItWorksAr:
      'اختر قطاع مصنعك (غزل، نسيج، تريكو، صباغة، ملابس) ثم تنقل بين الركائز الـ 9. تقوم كل أداة بحساب المؤشرات الهندسية لحظياً (زمن التاكت، كفاءة دورة العملية PCE%، الخسائر السنوية للفواقد بالجنيه، رادار 5S، مؤشر OEE%، وفر SMED، كفاءة موازنة الخطوط، بطاقات كانبان، ومؤشر القدرة Cpk) مع إمكانية تصدير التقرير أو توليد خطة كايزن A3 بالذكاء الاصطناعي.',
    formulaOrArchitecture:
      'Takt = Available Time / Demand • PCE% = VA Time / Lead Time • OEE = Availability × Performance × Quality • Cpk = min((USL−μ)/3σ, (μ−LSL)/3σ) • Kanban N = (D × L × (1 + α)) / C',
    whyToUseEn: [
      'Increase Value-Added Process Cycle Efficiency (PCE%) from typical 5–8% in batch textile mills to 20%+ via Value Stream Mapping.',
      'Recover 500,000 to 3,000,000+ EGP/year in hidden DOWNTIME wastes (re-dyeing, warp breaks, excess WIP inventory, waiting).',
      'Cut loom warp-tying, screen-printing, and sewing style changeover times by 45–65% using the SMED 4-Stage ECRS converter.',
      'Prevent export quality claims by enforcing Poka-Yoke mistake-proofing and Six Sigma Cpk >= 1.33 process capability.',
    ],
    whyToUseAr: [
      'رفع كفاءة دورة العملية (PCE%) وتقليص زمن التوريد من أسابيع إلى أيام عبر خريطة تدفق القيمة (VSM).',
      'استرداد مئات الآلاف إلى ملايين الجنيهات سنوياً من الفواقد الثمانية الخفية (إعادة الصباغة، قطع السداء، المخزون الراكد، والانتظار).',
      'تخفيض زمن تغيير اللوطات وتضميد السداء وتغيير الموديلات بنسبة 45–65% باستخدام منهجية SMED.',
      'منع مرتجعات التصدير عبر تطبيق وسائل منع الخطأ (Poka-Yoke) وضبط قدرة العملية الإحصائية (Cpk >= 1.33).',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Select Your Factory Sector at the Top',
        titleAr: '١. اختر قطاع مصنعك من الشريط العلوي',
        detailEn: 'Choose Spinning, Weaving, Knitting, Dyeing & Finishing, or Garment Assembly to load sector-specific benchmarks and defect libraries.',
        detailAr: 'اختر (الغزل، النسيج، التريكو، الصباغة والتجهيز، أو الملابس) لتحميل المعايير القياسية الخاصة بقطاعك.',
      },
      {
        titleEn: '2. Work Through the 9 Interactive Lean Pillars',
        titleAr: '٢. استخدم الأدوات والحاسبات في الركائز الـ 9',
        detailEn: 'Enter your shift minutes, daily demand, cycle times, downtime losses, or spec limits into any of the 9 tabs to see instant diagnostics.',
        detailAr: 'أدخل وقت الوردية، الطلب اليومي، أزمنة التشغيل، أو حدود المواصفات في أي ركيزة للحصول على التشخيص الفوري.',
      },
      {
        titleEn: '3. Generate a Custom AI Kaizen & A3 Blueprint (Pillar 9)',
        titleAr: '٣. ولّد خطة كايزن وتقرير A3 بالذكاء الاصطناعي (الركيزة ٩)',
        detailEn: 'Open Pillar 9 (or use the top Instant Lean Bar), describe your specific shop-floor problem, and click Generate.',
        detailAr: 'افتح الركيزة التاسعة، اكتب المشكلة الخاصة بمصنعك، واضغط توليد للحصول على خطة هندسية مفصلة.',
      },
      {
        titleEn: '4. Export Full Lean Report (.MD) or Print for Gemba Walks',
        titleAr: '٤. صدّر التقرير الكامل (.MD) أو اطبعه لجولات الجيمبا',
        detailEn: 'Click "Export Full Lean Report (.MD)" in the top header to save all your calculations and checklists.',
        detailAr: 'اضغط على زر تصدير التقرير الكامل في أعلى الصفحة لحفظ كافة الحسابات وقوائم التدقيق.',
      },
    ],
    proTipEn: 'Click the small (?) icon on any individual Pillar tab below to view the exact mathematical formulas and textile shop-floor SOP for that specific tool!',
    proTipAr: 'اضغط على أيقونة (؟) الصغيرة الموجودة داخل أي ركيزة من الركائز الـ 9 لعرض المعادلات الرياضية وطريقة التطبيق العملي لتلك الركيزة بالتحديد!',
    subFeatures: [
      {
        nameEn: 'Pillar 1: VSM & Takt Time Modeler',
        nameAr: 'الركيزة ١: خريطة تدفق القيمة وزمن التاكت (VSM)',
        purposeEn: 'Maps Value-Added (VA) vs. Non-Value-Added (NVA) lead time across 5 process stages and compares cycle times against customer Takt.',
        purposeAr: 'تحسب زمن التاكت، وكفاءة دورة العملية PCE%، وتكشف المرحلة المختنقة (Bottleneck) التي تتجاوز زمن التاكت.',
        howToUseEn: 'Enter shift minutes, customer demand, and each stage’s Cycle Time (s) & WIP waiting hours.',
        howToUseAr: 'أدخل دقائق الوردية والطلب اليومي وزمن الدورة وساعات انتظار المخزون لكل مرحلة.',
        linkedManualId: 'lean-vsm',
      },
      {
        nameEn: 'Pillar 2: 8 Wastes (DOWNTIME) Cost Calculator',
        nameAr: 'الركيزة ٢: حاسبة الفواقد الثمانية (DOWNTIME)',
        purposeEn: 'Quantifies monthly and annual EGP financial loss across Defects, Overproduction, Waiting, Non-utilized talent, Transport, Inventory, Motion, and Extra-processing.',
        purposeAr: 'تحول الفواقد الثمانية في صالة الإنتاج إلى قيمة مالية بالجنيه شهرياً وسنوياً مع إجراءات كايزن العلاجية.',
        howToUseEn: 'Adjust the severity slider (1–10) for each of the 8 wastes and enter your hourly shop-floor cost rate.',
        howToUseAr: 'حرك مؤشر شدة الفاقد (من 1 إلى 10) لكل نوع من الفواقد الثمانية وأدخل تكلفة ساعة التشغيل.',
        linkedManualId: 'lean-wastes',
      },
      {
        nameEn: 'Pillar 3: 5S Visual Workplace Gemba Audit',
        nameAr: 'الركيزة ٣: تدقيق 5S الميداني والبطاقات الحمراء',
        purposeEn: '20-point bilingual Gemba checklist across Sort, Set in Order, Shine, Standardize, and Sustain with a live Radar Chart.',
        purposeAr: 'قائمة تدقيق ميدانية من 20 نقطة عبر خطوات 5S الخمس مع مخطط راداري حي وتوليد البطاقات الحمراء للرواكد.',
        howToUseEn: 'Score each 5S criterion from 1 to 5 during your shop-floor walk and review the radar gap chart.',
        howToUseAr: 'قيّم كل بند من 1 إلى 5 أثناء جولتك الميدانية بالمصنع وتابع المخطط الراداري.',
        linkedManualId: 'lean-5s',
      },
      {
        nameEn: 'Pillar 4: OEE & TPM Autonomous Maintenance',
        nameAr: 'الركيزة ٤: كفاءة المعدات الكلية (OEE) والصيانة الإنتاجية الشاملة (TPM)',
        purposeEn: 'Calculates Availability × Performance × Quality against the 85% World-Class benchmark and provides a CIL (Clean-Inspect-Lubricate) checklist.',
        purposeAr: 'تحسب الإتاحة × الأداء × الجودة مقارنة بالمستوى العالمي (85%) مع جدول الصيانة الذاتية للمشغلين.',
        howToUseEn: 'Input planned shift time, unplanned stops, ideal vs. actual speed, and total vs. defect output.',
        howToUseAr: 'أدخل وقت الوردية، التوقفات، السرعة المثالية والفعلية، وإجمالي الإنتاج والمعيب.',
        linkedManualId: 'lean-oee',
      },
      {
        nameEn: 'Pillar 5: SMED Quick Changeover Studio',
        nameAr: 'الركيزة ٥: تقليل زمن التجهيز وتغيير اللوطات (SMED)',
        purposeEn: 'Applies Shingo’s 4-stage SMED methodology to convert Internal setup tasks (machine stopped) into External tasks (machine running).',
        purposeAr: 'تحول خطوات التجهيز الداخلية (والماكينة متوقفة) إلى خارجية (أثناء التشغيل) لتقليص وقت تغيير اللوط بأكثر من 50%.',
        howToUseEn: 'Classify setup tasks as Internal/External, toggle "Convert to External", and enter streamline %.',
        howToUseAr: 'صنّف مهام التجهيز وحوّل المهام الممكنة إلى خارجية لشاهد الوفر بالدقائق والجنيه.',
        linkedManualId: 'lean-smed',
      },
      {
        nameEn: 'Pillar 6: Line Balancing & Yamazumi Chart',
        nameAr: 'الركيزة ٦: موازنة خطوط الإنتاج ومخطط يامازومي',
        purposeEn: 'Calculates Line Efficiency %, Balance Delay %, Theoretical Minimum Workstations, and renders a color-coded Yamazumi bar chart.',
        purposeAr: 'تحسب كفاءة توازن الخط وتكشف المحطات المحملة فوق طاقة التاكت والمحطات العاطلة.',
        howToUseEn: 'Adjust operator workstation cycle times (seconds) until red bottleneck bars drop below the Takt line.',
        howToUseAr: 'عدّل أزمنة المحطات بالثواني حتى تنخفض الأعمدة الحمراء تحت خط التاكت.',
        linkedManualId: 'lean-balancing',
      },
      {
        nameEn: 'Pillar 7: Kanban Pull & Heijunka Leveling',
        nameAr: 'الركيزة ٧: نظام السحب كانبان وتسوية الإنتاج (Heijunka)',
        purposeEn: 'Computes exact Kanban card/bin count, Reorder Point (ROP), Safety Stock, and Pitch increment for leveled production.',
        purposeAr: 'تحسب العدد الدقيق لبطاقات وحاويات كانبان ونقطة إعادة الطلب ومخزون الأمان.',
        howToUseEn: 'Enter daily consumption, replenishment lead time, safety factor %, and container capacity.',
        howToUseAr: 'أدخل الاستهلاك اليومي، زمن التوريد، نسبة الأمان، وسعة الحاوية.',
        linkedManualId: 'lean-kanban',
      },
      {
        nameEn: 'Pillar 8: Poka-Yoke, Six Sigma SPC/Cpk & ILUO Matrix',
        nameAr: 'الركيزة ٨: منع الخطأ (Poka-Yoke) وقدرة العملية (6 Sigma Cpk) ومصفوفة المهارات',
        purposeEn: 'Evaluates process capability (Cp, Cpk, Sigma Level, DPMO), textile Poka-Yoke interlocks, and operator ILUO cross-training.',
        purposeAr: 'تحسب مؤشرات القدرة الإحصائية (Cp و Cpk ومستوى سيجما) مع وسائل منع الخطأ ومصفوفة مهارات العمال ILUO.',
        howToUseEn: 'Input LSL, USL, process mean (μ), and standard deviation (σ) (e.g., for fabric GSM or yarn Ne).',
        howToUseAr: 'أدخل الحد الأدنى والأعلى للمواصفة والمتوسط والانحراف المعياري (مثل وزن القماش GSM أو نمرة الغزل).',
        linkedManualId: 'lean-six-sigma',
      },
      {
        nameEn: 'Pillar 9: A3 PDCA & Any-Topic AI Kaizen Studio',
        nameAr: 'الركيزة ٩: تقارير A3 واستوديو الكايزن بالذكاء الاصطناعي',
        purposeEn: 'Interactive 5-Why + Fishbone (6M) A3 builder plus an AI Black Belt generator for any custom factory challenge.',
        purposeAr: 'بناء تقرير A3 (5 لماذا + عظمة السمكة 6M) مع مستشار ذكاء اصطناعي يولّد خطة لين 6 سيجما لأي مشكلة.',
        howToUseEn: 'Type any operational challenge or click a preset topic pill and click Generate AI Blueprint.',
        howToUseAr: 'اكتب أي تحدٍ تشغيلي في مصنعك واضغط توليد الخطة الهندسية.',
        linkedManualId: 'lean-a3-ai',
      },
    ],
  },

  'lean-vsm': {
    id: 'lean-vsm',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 1 Manual',
    badgeAr: 'دليل الركيزة ١: VSM وزمن التاكت',
    titleEn: 'Value Stream Mapping (VSM) & Takt Time Modeler',
    titleAr: 'خريطة تدفق القيمة (VSM) ونمذجة زمن التاكت وكفاءة العملية',
    subtitleEn: 'Eliminate WIP queue time between processes and synchronize production pace with customer demand',
    subtitleAr: 'القضاء على أزمنة الانتظار والمخزون البيني ومزامنة سرعة الإنتاج مع طلب العميل',
    whatIsThisEn:
      'Value Stream Mapping (VSM) is a Toyota Production System method that visually tracks every step required to transform raw cotton/yarn into finished fabric or garments, separating Value-Added (VA) processing seconds from Non-Value-Added (NVA) waiting hours.',
    whatIsThisAr:
      'خريطة تدفق القيمة (VSM) هي أداة رئيسية في نظام تويوتا الإنتاجي تتتبع رحلة المنتج عبر مراحل المصنع، وتفصل بين ثواني التشغيل الفعلية المضيفة للقيمة (VA) وساعات انتظار المخزون غير المضيفة للقيمة (NVA).',
    howItWorksEn:
      'Computes Takt Time = (Net Available Shift Seconds) ÷ (Customer Daily Demand). It then compares each stage’s Cycle Time against Takt Time to flag bottlenecks (Cycle Time > Takt) and calculates Process Cycle Efficiency (PCE%) = Total VA Time ÷ Total Lead Time.',
    howItWorksAr:
      'تحسب الأداة زمن التاكت = (صافي ثواني الوردية المتاحة ÷ الطلب اليومي للعميل)، ثم تقارن زمن دورة كل مرحلة بزمن التاكت لكشف الاختناقات، وتحسب كفاءة دورة العملية PCE% = إجمالي الوقت المضيف للقيمة ÷ إجمالي زمن التوريد.',
    formulaOrArchitecture:
      'Takt Time (sec) = (Shifts × Minutes × 60) / Daily Demand • PCE (%) = (∑ VA Cycle Times / Total Lead Time) × 100',
    whyToUseEn: [
      'Discover why an order that takes only 15 minutes of actual machine processing takes 12 days to ship (98% waiting in WIP queues!).',
      'Pinpoint the exact bottleneck stage that limits your entire factory’s daily output.',
      'Calculate the exact Future-State Lead Time when switching from batch push to continuous flow / FIFO lanes.',
    ],
    whyToUseAr: [
      'اكتشاف سبب استغراق طلبية تحتاج 15 دقيقة تشغيل فعلي فقط لـ 12 يوماً حتى تُشحن (بسبب تراكم المخزون البيني WIP).',
      'التحديد الدقيق للمرحلة المختنقة التي تقيد الطاقة الإنتاجية للمصنع بالكامل.',
      'حساب الوفر في زمن التوريد المستقبلي عند التحول من الدفعات الكبيرة إلى التدفق المستمر (FIFO).',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Enter Net Shift Minutes, Shifts/Day & Customer Daily Demand',
        titleAr: '١. أدخل صافي دقائق الوردية وعدد الورديات والطلب اليومي',
        detailEn: 'The tool immediately calculates your exact Takt Time in seconds per unit.',
        detailAr: 'ستقوم الأداة فوراً بحساب زمن التاكت المطلوب بالثواني لكل وحدة.',
      },
      {
        titleEn: '2. Input Cycle Time (VA) and Queue Wait (NVA) for Each Stage',
        titleAr: '٢. أدخل زمن الدورة (ثانية) وساعات الانتظار لكل مرحلة',
        detailEn: 'Stages whose Cycle Time exceeds Takt Time will automatically highlight in red as Bottlenecks.',
        detailAr: 'المراحل التي يتجاوز زمن دورتها زمن التاكت ستظهر باللون الأحمر كاختناقات.',
      },
      {
        titleEn: '3. Review Current PCE% vs. Future-State Target',
        titleAr: '٣. راجع نسبة PCE% الحالية مقارنة بالحالة المستقبلية المستهدفة',
        detailEn: 'Apply Kaizen burst recommendations to cut WIP queues by 65% and balance the bottleneck.',
        detailAr: 'طبّق توصيات الكايزن المقترحة لخفض طوابير الانتظار وموازنة المرحلة المختنقة.',
      },
    ],
    proTipEn: 'Never speed up a non-bottleneck machine upstream of a bottleneck—that only piles up excess WIP inventory on the shop floor!',
    proTipAr: 'لا تقم أبداً بتسريع ماكينة تسبق المرحلة المختنقة؛ لأن ذلك سيؤدي فقط إلى تكدس المخزون البيني (WIP) في صالة الإنتاج!',
  },

  'lean-wastes': {
    id: 'lean-wastes',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 2 Manual',
    badgeAr: 'دليل الركيزة ٢: الفواقد الثمانية DOWNTIME',
    titleEn: '8 Wastes (DOWNTIME) Diagnostic & Financial Loss Simulator',
    titleAr: 'مشخص الفواقد الثمانية (DOWNTIME) وحاسبة الخسائر المالية السنوية',
    subtitleEn: 'Translate shop-floor inefficiencies into EGP financial impact and targeted Kaizen countermeasures',
    subtitleAr: 'تحويل الهدر التشغيلي في صالة الإنتاج إلى قيمة مالية بالجنيه مع خطط علاجية فورية',
    whatIsThisEn:
      'In Lean Manufacturing, any activity that consumes resources without adding value for the customer is Muda (Waste). This tool audits all 8 DOWNTIME wastes tailored to textile mills: Defects, Overproduction, Waiting, Non-utilized Talent, Transportation, Inventory, Motion, and Extra-Processing.',
    whatIsThisAr:
      'في التصنيع الرشيق، أي نشاط يستهلك وقتاً أو خامات دون إضافة قيمة للعميل هو هدر (Muda). تدقق هذه الأداة الفواقد الثمانية (DOWNTIME) في مصانع النسيج: العيوب، الإنتاج الزائد، الانتظار، عدم استغلال المهارات، النقل، المخزون، الحركة الزائدة، والمعالجة الزائدة.',
    howItWorksEn:
      'You rate the severity (1–10) of each waste observed during a Gemba walk and enter your hourly shop-floor operating cost. The simulator computes monthly and annual EGP losses and ranks the top priority wastes with textile-specific countermeasures.',
    howItWorksAr:
      'تحدد درجة شدة كل فاقد (من 1 إلى 10) بناءً على ملاحظاتك الميدانية مع إدخال تكلفة ساعة التشغيل بالمصنع، لتحسب الأداة الخسائر الشهرية والسنوية بالجنيه وترتب أولويات التحسين.',
    formulaOrArchitecture:
      'DOWNTIME = Defects • Overproduction • Waiting • Non-Utilized Talent • Transport • Inventory • Motion • Extra-Processing',
    whyToUseEn: [
      'Convince management and supervisors with hard EGP numbers showing how much routine waiting and re-dyeing actually cost per year.',
      'Identify the #1 "silent profit killer" in textile mills: Overproduction of greige fabric or yarn without confirmed orders.',
      'Get ready-to-apply textile countermeasures for every single waste category.',
    ],
    whyToUseAr: [
      'توضيح حجم الخسائر السنوية بالجنيه للإدارة والمشرفين نتيجة التوقفات وإعادة الصباغة والانتظار.',
      'كشف أخطر فاقد في مصانع النسيج وهو "الإنتاج الزائد" بدون طلبيات مؤكدة والذي يجمّد السيولة النقدية.',
      'الحصول على إجراءات تصحيحية جاهزة للتطبيق لكل نوع من الفواقد الثمانية.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Walk the Shop Floor (Gemba) and Score Each Waste (1–10)',
        titleAr: '١. قيّم شدة كل فاقد من الفواقد الثمانية (من ١ إلى ١٠)',
        detailEn: '1 = negligible/eliminated, 5 = moderate daily occurrence, 10 = severe chronic waste.',
        detailAr: '1 تعني نادر جداً، 5 متوسط يتكرر يومياً، و10 هدر مزمن ومرتفع.',
      },
      {
        titleEn: '2. Enter Your Hourly Shop-Floor Cost Rate (EGP/hr)',
        titleAr: '٢. أدخل متوسط تكلفة ساعة التشغيل بصالة الإنتاج',
        detailEn: 'Include direct labor, machine depreciation, and energy per production line.',
        detailAr: 'تشمل العمالة المباشرة والطاقة وإهلاك الخط الإنتاجي.',
      },
      {
        titleEn: '3. Execute the Countermeasures on the Top 3 Wastes First',
        titleAr: '٣. ابدأ بتطبيق الإجراءات العلاجية لأعلى ٣ فواقد تكلفة',
        detailEn: 'Follow the Pareto principle (80/20) by attacking the highest-cost red waste cards first.',
        detailAr: 'طبّق مبدأ باريتو بالتركيز على الفواقد ذات التكلفة الأعلى أولاً لتحقيق أسرع عائد.',
      },
    ],
    proTipEn: 'Overproduction is the "Mother of All Wastes" because it creates excess Inventory, extra Transport, hidden Defects, and tied-up working capital.',
    proTipAr: 'الإنتاج الزائد هو "أبو الفواقد" لأنه يولّد تلقائياً مخزوناً راكداً، ونقلاً إضافياً، وعيوباً مخفية، وتجميداً لرأس المال العامل.',
  },

  'lean-5s': {
    id: 'lean-5s',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 3 Manual',
    badgeAr: 'دليل الركيزة ٣: تدقيق 5S الميداني',
    titleEn: '5S Visual Workplace Gemba Audit & Red-Tag Campaign',
    titleAr: 'تدقيق 5S لتنظيم بيئة العمل الميدانية وحملة البطاقات الحمراء',
    subtitleEn: 'Sort (Seiri) • Set in Order (Seiton) • Shine (Seiso) • Standardize (Seiketsu) • Sustain (Shitsuke)',
    subtitleAr: 'الفرز • الترتيب • التنظيف والفحص • التقييس • الانضباط والاستدامة',
    whatIsThisEn:
      '5S is the foundational visual workplace discipline of Lean Manufacturing. Without a clean, shadow-boarded, clearly labeled shop floor, SMED, TPM, and zero-defect quality cannot be sustained.',
    whatIsThisAr:
      'نظام 5S هو حجر الأساس للتصنيع الرشيق وتنظيم صالة الإنتاج بصرياً؛ فبدون بيئة عمل مفروزة ومرتبة ونظيفة ومقيسة لا يمكن تحقيق صيانة فعالة أو جودة خالية من العيوب.',
    howItWorksEn:
      'Provides a 20-point textile-specific Gemba scoring checklist (4 criteria per S, scored 1–5) and plots a live 5-axis Radar Chart showing your score out of 100% along with certification tier (Bronze / Silver / World-Class Gold).',
    howItWorksAr:
      'تضم الأداة قائمة تدقيق ميدانية من 20 بنداً مخصصة لمصانع النسيج (4 بنود لكل S تُقيّم من 1 إلى 5) وترسم مخططاً رادارياً حياً يوضح النتيجة الكلية ومستوى اعتماد الصالة.',
    formulaOrArchitecture:
      '5S Score (%) = (∑ 20 Audit Items / 100) × 100 • Target >= 85% for World-Class Gold Gemba Certification',
    whyToUseEn: [
      'Eliminate 15–30 minutes wasted per shift searching for wrenches, reeds, shuttles, dye recipes, or sewing attachments.',
      'Prevent oil stains, cotton fly contamination, and mixed-lot yarn cones through visual color-coding and floor markings.',
      'Monetize obsolete spare parts and odd yarn lots identified during 1S Red-Tag campaigns via the Circular Waste Exchange.',
    ],
    whyToUseAr: [
      'القضاء على 15–30 دقيقة تضيع في كل وردية للبحث عن العدد أو الأمشاط أو دساتير الصباغة أو دواسات الخياطة.',
      'منع بقع الزيت وتطاير زغب القطن واختلاط نمر الغزل عبر الترميز اللوني وتخطيط أرضية المصنع.',
      'تحويل الرواكد والعوادم المكتشفة في حملة البطاقات الحمراء (1S) إلى سيولة نقدية عبر بورصة العوادم بالمنصة.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Conduct a 15-Minute Gemba Walk with the Zone Supervisor',
        titleAr: '١. نفذ جولة ميدانية (Gemba Walk) مع مشرف القسم',
        detailEn: 'Score each of the 20 items honestly from 1 (Poor) to 5 (World-Class).',
        detailAr: 'قيّم كل بند من البنود الـ 20 بموضوعية من 1 (ضعيف) إلى 5 (ممتاز).',
      },
      {
        titleEn: '2. Inspect the 5-Axis Radar Chart for Weak Pillars',
        titleAr: '٢. راجع مخطط الرادار الخماسي لاكتشاف نقاط الضعف',
        detailEn: 'Most mills score well on 1S/2S but drop on 4S (Standardize) and 5S (Sustain).',
        detailAr: 'ركّز على المحاور التي تقل نتيجتها عن 75% (غالباً التقييس 4S والاستدامة 5S).',
      },
      {
        titleEn: '3. Post Red-Tag Items to the Circular Waste Marketplace',
        titleAr: '٣. اعرض أصناف البطاقات الحمراء في بورصة العوادم والرواكد',
        detailEn: 'Turn unneeded cones, fabric remnants, and idle parts into cash and floor space.',
        detailAr: 'تخلص من الرواكد التي تشغل مساحة الصالة وحوّلها إلى عائد مالي.',
      },
    ],
    proTipEn: 'In 3S (Shine), "Cleaning IS Inspecting"—when operators wipe down a loom or dyeing jet daily, they spot loose bolts and oil leaks weeks before a breakdown!',
    proTipAr: 'في الخطوة الثالثة (3S التنظيف)، القاعدة الذهبية هي: "التنظيف هو فحص مبكر"؛ فعندما ينظف العامل الماكينة يومياً يكتشف أي تسريب زيت أو مسمار مفكوك قبل وقوع العطل!',
  },

  'lean-oee': {
    id: 'lean-oee',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 4 Manual',
    badgeAr: 'دليل الركيزة ٤: كفاءة المعدات OEE و TPM',
    titleEn: 'OEE (Overall Equipment Effectiveness) & TPM Autonomous Maintenance',
    titleAr: 'حاسبة كفاءة المعدات الكلية (OEE) والصيانة الإنتاجية الشاملة (TPM)',
    subtitleEn: 'Availability × Performance × Quality — Eliminate the Six Big Machine Losses',
    subtitleAr: 'الإتاحة × الأداء × الجودة — القضاء على الخسائر الست الكبرى للماكينات',
    whatIsThisEn:
      'OEE is the gold-standard metric for measuring true manufacturing productivity. It exposes how much of your scheduled shift time actually produces First-Quality (Right-First-Time) output at full design speed.',
    whatIsThisAr:
      'مؤشر كفاءة المعدات الكلية (OEE) هو المقياس العالمي الذهبي لكفاءة الماكينات؛ حيث يكشف النسبة الحقيقية من وقت الوردية التي تنتج فيها الماكينة إنتاجاً سليماً من أول مرة (RFT) وبالسرعة القياسية.',
    howItWorksEn:
      'Multiplies three ratios: Availability (Operating Time ÷ Planned Production Time), Performance ((Ideal Cycle Time × Total Count) ÷ Operating Time), and Quality (Good Count ÷ Total Count), and categorizes losses into the Six Big Losses alongside an operator CIL (Clean, Inspect, Lubricate) checklist.',
    howItWorksAr:
      'يضرب ثلاث نسب معاً: الإتاحة (وقت التشغيل الفعلي ÷ وقت الإنتاج المخطط) × الأداء (السرعة الفعلية ÷ السرعة القياسية) × الجودة (الإنتاج السليم ÷ الإنتاج الكلي)، ويحلل الخسائر الست الكبرى مع قائمة الصيانة الذاتية للمشغل (CIL).',
    formulaOrArchitecture:
      'OEE (%) = Availability (%) × Performance (%) × Quality (%) • World-Class Benchmark: 90% × 95% × 99% = 85% OEE',
    whyToUseEn: [
      'A 10% gain in OEE on 40 weaving looms or knitting machines equals buying 4 brand-new machines with ZERO capital expenditure (CAPEX)!',
      'Distinguish clearly between Availability losses (breakdowns/changeovers), Performance losses (micro-stops/reduced speed), and Quality losses (re-dyeing/seconds).',
      'Empower operators with a 5-point daily Autonomous Maintenance (Jishu Hozen) CIL routine to prevent bearing and cam failures.',
    ],
    whyToUseAr: [
      'رفع مؤشر OEE بنسبة 10% في صالة تضم 40 نولاً يعادل شراء 4 أنوال جديدة بالكامل بدون إنفاق جنيه واحد رأسمالي (Zero CAPEX)!',
      'الفصل الدقيق بين خسائر الإتاحة (الأعطال وتغيير اللوط)، وخسائر الأداء (التوقفات الصغرى وتخفيض السرعة)، وخسائر الجودة (الفرز الثاني وإعادة الصباغة).',
      'تمكين المشغلين من تنفيذ الصيانة الذاتية اليومية (تنظيف، فحص، تزييت CIL) لمنع الأعطال المفاجئة.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Enter Shift Minutes, Unplanned Breakdowns & Setup Minutes',
        titleAr: '١. أدخل وقت الوردية ودقائق الأعطال وتغيير اللوطات',
        detailEn: 'This computes your exact Availability % and highlights breakdown vs. changeover loss.',
        detailAr: 'ستحسب الأداة نسبة الإتاحة % وتكشف حجم الوقت الضائع في التوقفات.',
      },
      {
        titleEn: '2. Enter Ideal Speed vs. Actual Output & Defective Units',
        titleAr: '٢. أدخل السرعة المثالية والإنتاج الفعلي وكمية المعيب',
        detailEn: 'The tool calculates Performance %, Quality (RFT) %, and your composite OEE %.',
        detailAr: 'تحسب الأداة نسبة الأداء % ونسبة الجودة % ومؤشر OEE الكلي.',
      },
      {
        titleEn: '3. Complete the Daily Operator CIL Checklist',
        titleAr: '٣. نفّذ قائمة الصيانة الذاتية (CIL) اليومية مع المشغلين',
        detailEn: 'Check off lint removal, oil levels, air pressure, tensioners, and safety sensors.',
        detailAr: 'تأكد من تنظيف الزغب، فحص مستوى الزيت، ضغط الهواء، وحساسات الأمان.',
      },
    ],
    proTipEn: 'If Availability is low, apply SMED (Pillar 5) and TPM. If Performance is low, fix yarn tension/micro-stops. If Quality is low, apply Poka-Yoke & SPC (Pillar 8).',
    proTipAr: 'إذا كانت "الإتاحة" منخفضة طبّق SMED وTPM، وإذا كان "الأداء" منخفضاً عالج التوقفات الصغرى وشد الخيط، وإذا كانت "الجودة" منخفضة طبّق Poka-Yoke و6 سيجما.',
  },

  'lean-smed': {
    id: 'lean-smed',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 5 Manual',
    badgeAr: 'دليل الركيزة ٥: تقليل زمن التجهيز SMED',
    titleEn: 'SMED (Single-Minute Exchange of Die) Quick Changeover Studio',
    titleAr: 'استوديو SMED لتقليص زمن تغيير اللوطات والتجهيز السريع',
    subtitleEn: 'Convert Internal setup (machine stopped) into External preparation (while machine is running)',
    subtitleAr: 'تحويل خطوات التجهيز الداخلية (والماكينة متوقفة) إلى خارجية (أثناء تشغيل اللوط السابق)',
    whatIsThisEn:
      'Developed by Shigeo Shingo for Toyota, SMED is a structured engineering method to reduce machine setup and lot changeover time (warp beam tying, rotary screen washing, dye vessel boil-out, sewing style change) by 50–70%.',
    whatIsThisAr:
      'منهجية هندسية ابتكرها شيجيو شينغو في تويوتا لتقليص زمن تغيير اللوطات وتجهيز الماكينات (تضميد السداء، تغيير شبلونات الطباعة، غسيل غلايات الصباغة، تغيير موديل الخياطة) بنسبة 50–70%.',
    howItWorksEn:
      'Lists every task in your changeover, classifies it as Internal (requires machine stop) or External (can be done BEFORE stopping the machine), lets you convert eligible Internal tasks to External with 1 click, and applies a Streamlining % via quick-release clamps and parallel 2-person pit-stop crews.',
    howItWorksAr:
      'تسجل كافة خطوات التجهيز وتصنفها إلى داخلية (تتطلب إيقاف الماكينة) وخارجية (تُنفذ قبل إيقاف الماكينة)، وتتيح تحويل المهام الممكنة إلى خارجية بضغطة زر مع حساب الوفر بالدقائق والساعات الإنتاجية المستردة شهرياً.',
    formulaOrArchitecture:
      'New Stopped Time = ∑ Remaining Internal Tasks × (1 − Streamline %) • Monthly Recovered Hours = (Saved Min × Changeovers/Mo) / 60',
    whyToUseEn: [
      'Enable profitable small-batch / high-mix export orders without losing half the shift to machine setups.',
      'Cut changeover downtime by 40–65% using zero-cost organizational preparation (pre-staging warp beams, pre-dissolving dyes, pre-setting sewing guides).',
      'See exact monthly recovered machine hours right on screen.',
    ],
    whyToUseAr: [
      'قبول طلبيات التصدير المتنوعة والكميات الصغيرة بربحية عالية دون خسارة نصف الوردية في التجهيز.',
      'تخفيض وقت التوقف بنسبة 40–65% عبر التحضير المسبق للخامات والعدد والصبغات قبل إيقاف الماكينة.',
      'معرفة عدد ساعات التشغيل المستردة شهرياً بشكل فوري.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Video-Record a Real Changeover & List All Tasks',
        titleAr: '١. راقب عملية تغيير لوط فعلية واستعرض قائمة المهام',
        detailEn: 'Adjust the duration (minutes) of each setup step in the SMED table.',
        detailAr: 'أدخل الزمن الفعلي بالدقائق لكل خطوة من خطوات تغيير اللوط.',
      },
      {
        titleEn: '2. Click "Convert to External" on Preparation Tasks',
        titleAr: '٢. حوّل مهام التحضير والفحص والبحث إلى "خارجية (External)"',
        detailEn: 'Any tool fetching, recipe weighing, or pre-heating MUST happen before the machine stops.',
        detailAr: 'إحضار العدد ووزن الصبغات وفحص السداء يجب أن يتم بالكامل والماكينة لا تزال تعمل.',
      },
      {
        titleEn: '3. Set Parallel Crew & Quick-Clamp Streamlining %',
        titleAr: '٣. حدد نسبة التبسيط (العمل المتوازي والمثبتات السريعة)',
        detailEn: 'Using two technicians working in parallel like a Formula-1 pit crew cuts remaining internal time in half.',
        detailAr: 'استخدام فنيين يعملان بالتوازي مع مثبتات سريعة يختصر الزمن الداخلي المتبقي إلى النصف.',
      },
    ],
    proTipEn: 'Never stop a machine until the next warp beam, dye bath, or pre-threaded sewing attachments are staged within 1 meter of the machine!',
    proTipAr: 'القاعدة الذهبية في SMED: لا توقف الماكينة أبداً قبل أن تكون مطوة السداء التالية أو الصبغة المذابة أو الدواسات المضبوطة جاهزة على بُعد متر واحد من الماكينة!',
  },

  'lean-balancing': {
    id: 'lean-balancing',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 6 Manual',
    badgeAr: 'دليل الركيزة ٦: موازنة الخطوط ويامازومي',
    titleEn: 'Line Balancing, Bottleneck Analysis & Yamazumi Chart',
    titleAr: 'موازنة خطوط الإنتاج وتحليل الاختناقات ومخطط يامازومي (Yamazumi)',
    subtitleEn: 'Eliminate operator waiting and workstation overload across sewing and finishing lines',
    subtitleAr: 'موازنة أزمنة العمليات بين المحطات للقضاء على الاختناقات وأوقات الانتظار',
    whatIsThisEn:
      'Line Balancing equalizes the workload across sequential workstations (especially in garment sewing, inspection, and packaging lines) so every station operates just below Takt Time with minimal idle waiting.',
    whatIsThisAr:
      'أداة هندسية لتوزيع عناصر العمل بالتساوي بين محطات الخط الإنتاجي (خاصة في خطوط الحياكة والفحص والتعبئة) بحيث تعمل كل محطة بانسجام تحت خط التاكت دون اختناق أو بطالة مقنعة.',
    howItWorksEn:
      'Plots each workstation’s cycle time against Takt Time on a visual Yamazumi bar chart, flags bottleneck stations (Red: > Takt), optimal stations (Emerald: 85–100% of Takt), and under-loaded stations (Amber: < 85% of Takt), and calculates Line Efficiency %, Balance Delay %, and Hourly Line Output.',
    howItWorksAr:
      'ترسم مخطط يامازومي بالأعمدة الملونة مقارنة بخط التاكت، وتكشف المحطات المختنقة (بالأحمر)، والمحطات المتوازنة (بالأخضر)، والمحطات غير المستغلة (بالأصفر)، وتحسب كفاءة توازن الخط % والفاقد التوازني % والإنتاج الفعلي بالساعة.',
    formulaOrArchitecture:
      'Line Efficiency (%) = (∑ Station Times / (N Stations × Max Bottleneck Time)) × 100 • Theoretical Min Stations = ⌈∑ Station Times / Takt⌉',
    whyToUseEn: [
      'A single 60-second bottleneck station on a 10-station line limits the ENTIRE line to 60 pcs/hour even if the other 9 operators finish in 30 seconds!',
      'Increase garment sewing line output by 20–35% simply by splitting 10 seconds of work from the red bottleneck station to an adjacent amber station.',
      'Determine the exact theoretical minimum number of operators needed for any order target.',
    ],
    whyToUseAr: [
      'محطة واحدة مختنقة (60 ثانية) في خط يضم 10 محطات تقيّد إنتاج الخط بالكامل بـ 60 قطعة/ساعة حتى لو أنهت المحطات التسع الأخرى عملها في 30 ثانية!',
      'زيادة إنتاجية خط الملابس بنسبة 20–35% بمجرد نقل جزء بسيط من عناصر العمل من المحطة الحمراء المختنقة إلى المحطة الصفراء المجاورة.',
      'معرفة العدد النظري الأمثل للمحطات والعمال المطلوب لتحقيق الطلب اليومي.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Set Your Target Takt Time (Seconds/Unit)',
        titleAr: '١. حدد زمن التاكت المستهدف بالثواني لكل قطعة',
        detailEn: 'Use the Takt Time computed in Pillar 1 or adjust the Takt slider directly.',
        detailAr: 'أدخل زمن التاكت المحسوب من الركيزة الأولى أو اضبطه مباشرة.',
      },
      {
        titleEn: '2. Enter Time-Study Seconds for Each Workstation',
        titleAr: '٢. أدخل زمن كل محطة بالثواني (من قياس ساعة الإيقاف)',
        detailEn: 'Watch the Yamazumi chart update live: red bars exceed Takt, green bars are balanced.',
        detailAr: 'تابع مخطط يامازومي الحي؛ الأعمدة الحمراء تتجاوز التاكت وتسبب اختناق الخط.',
      },
      {
        titleEn: '3. Re-distribute Work Elements Until Efficiency Exceeds 85%',
        titleAr: '٣. أعد توزيع عناصر العمل حتى تتجاوز كفاءة التوازن ٨٥٪',
        detailEn: 'Move micro-tasks or add a shared helper/attachment to bring the bottleneck below Takt.',
        detailAr: 'انقل بعض الحركات الفرعية أو أضف دواسة مساعدة لخفض زمن المحطة المختنقة تحت خط التاكت.',
      },
    ],
    proTipEn: 'Aim for Line Balancing Efficiency >= 85% with every station running between 88% and 96% of Takt Time.',
    proTipAr: 'الهدف الهندسي القياسي هو تحقيق كفاءة توازن للخط (Line Efficiency) لا تقل عن 85% مع تشغيل كل محطة عند 88%–96% من زمن التاكت.',
  },

  'lean-kanban': {
    id: 'lean-kanban',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 7 Manual',
    badgeAr: 'دليل الركيزة ٧: كانبان وتسوية الإنتاج',
    titleEn: 'Kanban Pull System, Supermarket Sizing & Heijunka Leveling',
    titleAr: 'نظام السحب كانبان (Kanban) وحساب مخزون الأمان وتسوية الإنتاج (Heijunka)',
    subtitleEn: 'Replace chaotic Push overproduction with disciplined Supermarket Pull signals',
    subtitleAr: 'استبدال الإنتاج العشوائي بنظام السحب المنضبط بالبطاقات والحاويات القياسية',
    whatIsThisEn:
      'Kanban is Toyota’s visual Pull replenishment system where upstream processes (spinning/winding/dyeing/cutting) produce ONLY what downstream processes consume, eliminating both stockouts and overproduction.',
    whatIsThisAr:
      'نظام كانبان هو آلية السحب البصرية في نظام تويوتا؛ حيث لا تنتج المرحلة السابقة إلا الكمية التي استهلكتها المرحلة اللاحقة فعلياً، مما يقضي على نفاد الخامات وتكدس المخزون معاً.',
    howItWorksEn:
      'Uses the standard Toyota Kanban formula to calculate the exact number of Kanban cards/bins (N), Reorder Point (ROP), Safety Stock, Maximum Supermarket Inventory, and Heijunka Pitch time.',
    howItWorksAr:
      'تطبق معادلة تويوتا القياسية لحساب العدد الدقيق لبطاقات/عربات كانبان (N)، ونقطة إعادة الطلب (ROP)، ومخزون الأمان، والحد الأقصى للمخزون، وزمن الإيقاع (Pitch).',
    formulaOrArchitecture:
      'Kanban Bins (N) = ⌈ (Daily Demand × Lead Time Days × (1 + Safety %)) / Container Capacity ⌉',
    whyToUseEn: [
      'Cut raw yarn, greige fabric, and trim inventory holding costs by 30–50% while guaranteeing zero machine starvation.',
      'Give warehouse and floor teams a simple, visual Two-Bin or Card rule instead of complex spreadsheets.',
      'Level daily product mix (Heijunka) so dyehouses and looms don’t suffer erratic emergency rushes.',
    ],
    whyToUseAr: [
      'خفض تكلفة المخزون الراكد من الغزول والأقمشة الخام والإكسسوارات بنسبة 30–50% مع ضمان عدم توقف الماكينات أبداً.',
      'توفير نظام بصري بسيط لعمال المخزن والصالة يوضح متى وبأي كمية يتم التوريد.',
      'تسوية تشكيلة الإنتاج اليومية (Heijunka) لمنع الطلبيات الطارئة والارتباك في الصباغة والنسيج.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Enter Average Daily Consumption & Replenishment Lead Time',
        titleAr: '١. أدخل متوسط الاستهلاك اليومي وزمن التوريد بالأيام',
        detailEn: 'Specify how many kg/cones/pieces are consumed per day and how many days replenishment takes.',
        detailAr: 'حدد الكمية المستهلكة يومياً وعدد الأيام اللازمة لإعادة التوريد.',
      },
      {
        titleEn: '2. Set Container/Trolley Capacity & Safety Buffer %',
        titleAr: '٢. حدد سعة الحاوية أو العربة القياسية ونسبة مخزون الأمان %',
        detailEn: 'The calculator outputs the exact number of Kanban cards/bins to circulate on the floor.',
        detailAr: 'ستظهر لك الأداة العدد الدقيق لبطاقات أو عربات كانبان المطلوب تداولها.',
      },
      {
        titleEn: '3. Print & Attach Physical Kanban Cards to Each Bin',
        titleAr: '٣. التزم بقاعدة كانبان الصارمة: لا إنتاج ولا نقل بدون بطاقة',
        detailEn: 'When a bin empties, its card returns to the upstream Heijunka board as a production signal.',
        detailAr: 'عند فراغ أي عربة، تعود بطاقتها فوراً إلى لوحة التخطيط كإشارة لإنتاج حاوية بديلة.',
      },
    ],
    proTipEn: 'As supplier reliability and SMED improve, reduce your Safety Factor % by 5% each quarter to continuously shrink working capital!',
    proTipAr: 'كلما تحسنت دقة الموردين وانخفض زمن التجهيز (SMED)، خفّض نسبة الأمان بمقدار 5% ربع سنوياً لتقليص رأس المال المجمد في المخزون!',
  },

  'lean-six-sigma': {
    id: 'lean-six-sigma',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 8 Manual',
    badgeAr: 'دليل الركيزة ٨: بوكا يوكي و6 سيجما Cpk',
    titleEn: 'Poka-Yoke Mistake-Proofing, Six Sigma SPC/Cpk & ILUO Skill Matrix',
    titleAr: 'منع الخطأ (Poka-Yoke)، قدرة العملية الإحصائية (Six Sigma Cpk)، ومصفوفة المهارات (ILUO)',
    subtitleEn: 'Achieve Cpk >= 1.33 export consistency, zero-defect interlocks, and multi-skilled operators',
    subtitleAr: 'ضبط استقرار الجودة التصديرية (Cpk >= 1.33) وتطبيق وسائل منع الخطأ وتأهيل العمالة متعددة المهارات',
    whatIsThisEn:
      'Combines statistical quality engineering (Six Sigma Process Capability Cp/Cpk) with Japanese Jidoka/Poka-Yoke physical mistake-proofing and the ILUO operator cross-training matrix.',
    whatIsThisAr:
      'تجمع هذه الركيزة بين الضبط الإحصائي للجودة في 6 سيجما (مؤشرات القدرة Cp وCpk)، ووسائل منع وقوع الخطأ من المنبع (Poka-Yoke)، ومصفوفة تأهيل العمال متعددة المهارات (ILUO).',
    howItWorksEn:
      'Takes your Lower Specification Limit (LSL), Upper Specification Limit (USL), Process Mean (μ), and Standard Deviation (σ)—such as fabric GSM, yarn count Ne, or dye pH—and computes Cp, Cpk, Sigma Level, and Defects Per Million Opportunities (DPMO), alongside interactive Poka-Yoke and ILUO matrices.',
    howItWorksAr:
      'تستقبل الحد الأدنى (LSL) والحد الأعلى (USL) للمواصفة ومتوسط القياسات الفعلية (μ) والانحراف المعياري (σ) — مثل وزن القماش GSM أو نمرة الغزل — لتحسب مؤشر Cp وCpk ومستوى سيجما ومعدل العيوب لكل مليون فرصة (DPMO).',
    formulaOrArchitecture:
      'Cp = (USL − LSL) / 6σ • Cpk = min( (USL − μ)/3σ , (μ − LSL)/3σ ) • Export Target: Cpk >= 1.33 (4σ), World-Class >= 1.67 (5σ)',
    whyToUseEn: [
      'European retail buyers (Zara, IKEA, H&M, Marks & Spencer) require Cpk >= 1.33 on fabric GSM, shrinkage, and shade ΔE.',
      'Distinguish whether defects are caused by excessive variation (low Cp → machine maintenance issue) or off-center settings (Cpk << Cp → calibration issue).',
      'Eliminate single-points-of-failure in critical jobs by ensuring every operation has at least two Level-U/O operators in the ILUO matrix.',
    ],
    whyToUseAr: [
      'المشترون الأوروبيون يشترطون قدرة عملية (Cpk >= 1.33) في وزن المتر المربع GSM ونسب الانكماش وثبات اللون ΔE.',
      'التفريق العلمي بين مشاكل التشتت العالي (انخفاض Cp بسبب اهتزاز أو تآكل الماكينة) ومشاكل انحراف الضبط (انخفاض Cpk عن Cp بسبب خطأ المعايرة).',
      'حماية المصنع من توقف أي خط عند غياب عامل ماهر عبر مصفوفة المهارات المتعددة (ILUO).',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Enter Customer Spec Limits (LSL & USL) and Sample Mean/StdDev',
        titleAr: '١. أدخل حدود مواصفة العميل (LSL و USL) ومتوسط وانحراف العينات',
        detailEn: 'Example: Target 180 GSM fabric with ±5 GSM tolerance → LSL = 175, USL = 185.',
        detailAr: 'مثال: قماش مطلوب بوزن 180 جرام/م2 بتجاوز ±5 جرام ← الحد الأدنى 175 والأعلى 185.',
      },
      {
        titleEn: '2. Check Your Cpk Status Badge & Sigma Level',
        titleAr: '٢. راجع قيمة Cpk ومستوى سيجما والتوصية الهندسية',
        detailEn: 'If Cpk < 1.00, the process is producing defects; if Cpk >= 1.33, it is export-capable.',
        detailAr: 'إذا كان Cpk أقل من 1.00 فالعملية تنتج معيباً؛ وإذا كان 1.33 فأعلى فهي مؤهلة للتصدير.',
      },
      {
        titleEn: '3. Enable Textile Poka-Yoke Devices & Audit Your ILUO Matrix',
        titleAr: '٣. فعّل أجهزة منع الخطأ (Poka-Yoke) وحدّث مصفوفة مهارات العمال (ILUO)',
        detailEn: 'Click any operator cell in the ILUO grid to cycle their skill level from I → L → U → O.',
        detailAr: 'اضغط على خلية أي عامل في مصفوفة ILUO لتحديث مستوى مهارته من متدرب (I) إلى مدرب خبير (O).',
      },
    ],
    proTipEn: 'If Cp is high (e.g. 1.50) but Cpk is low (e.g. 0.85), your machine is precise—you simply need to re-center the stenter/loom setting to the target midpoint!',
    proTipAr: 'إذا كان مؤشر Cp مرتفعاً (مثلاً 1.50) بينما Cpk منخفض (مثلاً 0.85)، فهذا يعني أن الماكينة دقيقة جداً ولكنها تحتاج فقط إلى إعادة معايرة الضبط نحو منتصف المواصفة!',
  },

  'lean-a3-ai': {
    id: 'lean-a3-ai',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 9 Manual',
    badgeAr: 'دليل الركيزة ٩: تقارير A3 ومستشار اللين الذكي',
    titleEn: 'A3 PDCA Problem-Solving, 5-Why, Fishbone (6M) & AI Kaizen Studio',
    titleAr: 'استوديو تقارير A3 (PDCA) وتحليل الجذور (5-Why & 6M) ومستشار الكايزن الذكي',
    subtitleEn: 'Generate custom Toyota A3 reports and 9-pillar Lean Six Sigma blueprints on any topic with free LLMs',
    subtitleAr: 'بناء تقارير A3 القياسية وتوليد خطط لين 6 سيجما متكاملة لأي مشكلة صناعية بالذكاء الاصطناعي',
    whatIsThisEn:
      'Toyota’s A3 Report fits an entire PDCA (Plan-Do-Check-Act) problem-solving story onto a single structured sheet: Background, Current Condition, Target, 6M Fishbone + 5-Why Root Cause Analysis, Countermeasures, and 30/60/90-Day Follow-up—supercharged by our 5-provider Free LLM engine.',
    whatIsThisAr:
      'تقرير A3 في نظام تويوتا يلخص رحلة حل المشكلة بالكامل (PDCA) في لوحة واحدة منظمة: الخلفية، الوضع الحالي، الهدف، تحليل الأسباب الجذرية (عظمة السمكة 6M + الأسئلة الخمسة 5-Why)، الإجراءات التصحيحية، وخطة المتابعة لـ 90 يوماً — مدعوماً بمحرك الذكاء الاصطناعي المجاني.',
    howItWorksEn:
      'Type any shop-floor problem or operational goal (or pick a 1-click Mahalla preset) and click Generate. The API queries our free LLM cascade (Groq Llama 3.3 70B → Gemini 2.5 → OpenRouter DeepSeek/Qwen → Pollinations → Deterministic Industrial Engine) to return a complete, structured JSON blueprint covering VSM, 8 Wastes, 5S, OEE, SMED, Poka-Yoke, A3 5-Why/6M, and a 30/60/90-day roadmap.',
    howItWorksAr:
      'اكتب أي مشكلة إنتاجية أو هدف تشغيلي (أو اختر من القوالب الجاهزة) واضغط توليد؛ ليقوم محرك الذكاء الاصطناعي المجاني ببناء خطة هندسية متكاملة تشمل تشخيص VSM، الفواقد، 5S، OEE، SMED، Poka-Yoke، وتحليل 5-Why وعظمة السمكة 6M، وخارطة طريق 30/60/90 يوماً.',
    formulaOrArchitecture:
      'PDCA Cycle: Plan (Background • Current • Target • 6M/5-Why Root Cause) → Do (Countermeasures) → Check (KPI Verification) → Act (Standardize SOP)',
    whyToUseEn: [
      'Stop treating symptoms ("band-aid fixes") and uncover the true 5th-Why systemic root cause of recurring textile defects.',
      'Generate a presentation-ready A3 Kaizen report for factory management or EU buyer audits in under 15 seconds.',
      'Works 100% reliably on ANY topic with automatic fallback across 5 free AI providers.',
    ],
    whyToUseAr: [
      'التوقف عن المسكنات المؤقتة والوصول إلى السبب الجذري الخامس (5th-Why) الذي يمنع تكرار العيب نهائياً.',
      'توليد تقرير A3 احترافي جاهز للعرض على مجلس الإدارة أو لجان تدقيق المشترين الدوليين في ثوانٍ.',
      'يعمل مجاناً وبكفاءة 100% لأي موضوع صناعي عبر 5 مزودي ذكاء اصطناعي.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Enter Your Specific Problem or Click a Quick Topic Pill',
        titleAr: '١. اكتب المشكلة الإنتاجية بالتفصيل أو اختر قالباً جاهزاً',
        detailEn: 'Be specific (e.g., "Reduce reactive dyeing shade variation on 100% Giza cotton interlock").',
        detailAr: 'كلما كان الوصف محدداً (مثل: تقليل تفاوت اللون في صباغة إنترلوك قطن جيزة) كانت الخطة أدق.',
      },
      {
        titleEn: '2. Click "Generate AI Lean & Six Sigma Blueprint"',
        titleAr: '٢. اضغط على زر توليد خطة اللين 6 سيجما بالذكاء الاصطناعي',
        detailEn: 'Review the generated 6M Fishbone, 5-Why chain, SMED/OEE targets, and 30/60/90-day roadmap.',
        detailAr: 'استعرض مخطط عظمة السمكة 6M، وسلسلة الـ 5 لماذا، وخطة الـ 90 يوماً الناتجة.',
      },
      {
        titleEn: '3. Edit the Interactive A3 Fields & Export to Markdown',
        titleAr: '٣. عدّل حقول تقرير A3 التفاعلي وصدّره كملف قياسي (.MD)',
        detailAr: 'يمكنك تعديل أي حقل في نموذج A3 وحفظه كمرجع قياسي لفريق الجودة والإنتاج.',
        detailEn: 'Customize owner names and target dates in the A3 form, then export the complete report.',
      },
    ],
    proTipEn: 'In a true 5-Why analysis, the 5th Why almost always points to a missing Standard Operating Procedure (SOP), missing Poka-Yoke, or missing ILUO training—never "worker carelessness"!',
    proTipAr: 'في تحليل الـ 5 لماذا الحقيقي، السبب الجذري الخامس يشير دائماً إلى غياب إجراء قياسي (SOP) أو غياب وسيلة منع خطأ (Poka-Yoke) وليس مجرد "إهمال العامل"!',
  },

  // ============================================================================
  // 2. GLOBAL EXPORT INTELLIGENCE, BUYERS & NTMs (+ 6 SUB-MANUALS)
  // ============================================================================
  'export-intelligence': {
    id: 'export-intelligence',
    category: 'export_trade',
    badgeEn: '6-Pillar Global Export AI Manual',
    badgeAr: 'دليل ذكاء التصدير والمشترين الدوليين (٦ ركائز)',
    titleEn: 'AI Global Export Intelligence, International Buyers & NTM Hub',
    titleAr: 'مركز ذكاء التصدير العالمي، المشترين الدوليين، والمناقصات والمواصفات القياسية',
    subtitleEn: 'Market studies, landed-cost pricing, live tenders, promotional plans, verified buyers & 5-stage outreach across 190+ countries',
    subtitleAr: 'دراسات الأسواق، استراتيجيات التسعير، المناقصات الدولية، خطط الترويج، قاعدة المشترين الموثقين، وتحليل المواصفات غير الجمركية',
    whatIsThisEn:
      'An end-to-end international trade intelligence & buyer acquisition command center built for El-Mahalla textile and garment exporters. It combines curated trade intelligence with an Any-Product / Any-Country AI Export Studio.',
    whatIsThisAr:
      'مركز قيادة متكامل لذكاء التصدير والاستحواذ على المشترين الدوليين لمصانع المحلة الكبرى؛ يجمع بين قواعد بيانات التجارة الدولية واستوديو ذكاء اصطناعي يولّد دراسات وخطط تصدير لأي منتج وأي دولة في العالم.',
    howItWorksEn:
      'Structured into 6 specialized tabs: (1) Country Market Studies & HS Demand, (2) Market Entry Strategy & EXW/FOB/CIF/DDP Landed-Cost Calculator, (3) Live International B2B & Government Tenders, (4) 4-Quarter Export Promotional Plans & Trade Fairs, (5) Verified International Buyers Directory with 5-Stage B2B Outreach Templates, and (6) Country Technical Standards, Eco-Labels & Non-Tariff Measures (NTMs).',
    howItWorksAr:
      'يعمل عبر 6 تبويبات متخصصة: (1) دراسات الأسواق والأكواد الجمركية HS، (2) استراتيجية الدخول وحاسبة التكلفة الواصلة EXW/FOB/CIF/DDP، (3) المناقصات الدولية الحية، (4) خطط الترويج والمعارض، (5) دليل المشترين الدوليين الموثقين مع رسائل التواصل من 5 مراحل، و(6) المواصفات الفنية القياسية والعوائق غير الجمركية (NTMs).',
    formulaOrArchitecture:
      'FOB = EXW + InlandPort • CIF = FOB + SeaFreight + Insurance • DDP = CIF × (1 + Duty%) + PortClearance (0% Duty under EUR.1 / QIZ / AfCFTA / MERCOSUR)',
    whyToUseEn: [
      'Leverage Egypt’s 0% duty trade agreements (EU-Egypt EUR.1, USA QIZ, AfCFTA, Mercosur, Agadir) to undercut Asian competitors by 8–28% on landed DDP price.',
      'Access ready-to-send 5-stage B2B outreach sequences (Initial Pitch, Sample Offer, MOQ/Lead-Time Sheet, ESG/DPP Proof, Follow-up) for verified buyers.',
      'Avoid costly customs rejections by checking mandatory NTM rules (REACH, OEKO-TEX, ESPR DPP, CBAM, CPSIA, SABER) before shipping.',
    ],
    whyToUseAr: [
      'استغلال اتفاقيات مصر التجارية المعفاة من الجمارك (اليورو 1 لأوروبا، الكويز لأمريكا، أفريقيا، الميركسور) للتفوق السعري على المنافسين الآسيويين بنسبة 8–28%.',
      'الحصول على سلسلة مراسلات تصديرية احترافية من 5 مراحل جاهزة للإرسال للمشترين الدوليين.',
      'تجنب رفض الشحنات جمركياً عبر فحص الاشتراطات الفنية والبيئية الإلزامية لكل دولة قبل الشحن.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Select Your Target Export Market & Product Category',
        titleAr: '١. اختر الدولة المستهدفة وفئة المنتج النسيجي',
        detailEn: 'Or type any custom product + country in the top AI Export Intelligence bar and click Generate.',
        detailAr: 'أو اكتب أي منتج وأي دولة في شريط الذكاء الاصطناعي العلوي واضغط توليد.',
      },
      {
        titleEn: '2. Simulate Your Landed Price (EXW → FOB → CIF → DDP) in Tab 2',
        titleAr: '٢. احسب سعرك التصديري الواصل (EXW → FOB → CIF → DDP) في التبويب الثاني',
        detailEn: 'Compare your duty-free EUR.1/QIZ landed price against competitors paying MFN tariffs.',
        detailAr: 'قارن سعرك المعفى جمركياً بأسعار المنافسين الخاضعين للتعريفة الجمركية.',
      },
      {
        titleEn: '3. Bid on Live Tenders (Tab 3) & Contact Verified Buyers (Tab 5)',
        titleAr: '٣. نافس على المناقصات الدولية (تبويب ٣) وتواصل مع المشترين (تبويب ٥)',
        detailEn: 'Copy the personalized 5-stage email/LinkedIn/WhatsApp outreach scripts with 1 click.',
        detailAr: 'انسخ رسائل التواصل التصديرية الخمس المخصصة لكل مشتري بضغطة زر.',
      },
      {
        titleEn: '4. Verify Country NTM & Labeling Rules in Tab 6',
        titleAr: '٤. راجع قائمة المواصفات والشهادات الإلزامية للدولة في التبويب السادس',
        detailEn: 'Ensure your lab tests (AATCC/ISO), azo-free dyes, and EUR.1 certificate of origin are complete.',
        detailAr: 'تأكد من استيفاء اختبارات الثبات، وخلو الصبغات من الأزو، وشهادة المنشأ قبل الشحن.',
      },
    ],
    proTipEn: 'Always quote international buyers in both FOB Alexandria/Damietta AND estimated CIF destination port—buyers strongly prefer suppliers who remove freight uncertainty!',
    proTipAr: 'قدّم دائماً عروض أسعارك للمشتري الأجنبي بنظامي FOB الإسكندرية/دمياط وCIF ميناء الوصول؛ فالمشتري الدولي يفضّل المصنع الذي يريحه من عناء حسابات الشحن!',
  },

  // ============================================================================
  // 3. AI BRAND, MARKETING & PRINT COLLATERAL STUDIO
  // ============================================================================
  'brand-studio': {
    id: 'brand-studio',
    category: 'export_trade',
    badgeEn: '6-Tab Brand & Print Studio Manual',
    badgeAr: 'دليل استوديو الهوية والتسويق والمطبوعات (٦ تبويبات)',
    titleEn: 'AI Textile Brand, Marketing Automation & Print Collateral Studio',
    titleAr: 'استوديو بناء العلامات التجارية وأتمتة التسويق وتصميم المطبوعات الذكي',
    subtitleEn: 'SVG Logos, 90-Day Export Marketing Plans, Multi-Channel Campaigns, Video Storyboards, Studio Photo Prompts & Print-Ready Brochures/Flyers/Roll-ups',
    subtitleAr: 'تصميم الشعارات SVG، خطط تسويق 90 يوماً، أتمتة الحملات، سيناريوهات الفيديو، أوامر التصوير الاحترافي، وتصميم البروشورات والفلايرز ورول أب المعارض',
    whatIsThisEn:
      'A complete B2B branding, digital marketing, and print-collateral design agency built inside the platform so El-Mahalla mills can transition from low-margin anonymous subcontracting (OEM) to high-margin branded export collections (ODM/OBM).',
    whatIsThisAr:
      'وكالة متكاملة لبناء الهوية التجارية والتسويق التصديري وتصميم المطبوعات داخل المنصة؛ لتمكين مصانع المحلة من التحول من التشغيل للغير بهامش ربح ضئيل إلى التصدير بعلامات تجارية مصرية عالية القيمة.',
    howItWorksEn:
      'Enter your factory/brand name, specialty products, and target export market. The AI generates a bespoke brand identity, custom SVG vector logo, color palette, 90-day marketing calendar, automated email/LinkedIn workflows, 60-second promo video storyboard, photorealistic AI studio photography prompts, and live printable 6-panel tri-fold brochures, A4 product flyers, and 85×200cm trade-show roll-up banners.',
    howItWorksAr:
      'أدخل اسم مصنعك أو علامتك التجارية ومنتجاتك والسوق المستهدف؛ ليقوم الذكاء الاصطناعي بتوليد الهوية البصرية والشعار المتجه (SVG)، ولوحة الألوان، وخطة تسويق 90 يوماً، وحملات البريد ولينكدإن، وسيناريو فيديو دعائي، وتصميم بروشور مطوي من 6 أوجه وفلاير A4 وبانر رول أب للمعارض الدولية جاهز للطباعة.',
    formulaOrArchitecture:
      '6 Integrated Studios: (1) Brand & SVG Logo • (2) 90-Day Plan • (3) Campaign Automation • (4) Video Script • (5) Photo Studio • (6) Print Brochure, Flyer & Roll-Up',
    whyToUseEn: [
      'Save $3,000–$10,000 in design agency fees when preparing for Heimtextil Frankfurt, Première Vision Paris, or Destination Africa.',
      'Print high-resolution tri-fold company brochures, A4 technical spec flyers, and 85×200cm trade-show roll-up banners directly from your browser (`window.print()`).',
      'Position your Egyptian Giza cotton heritage with luxury European brand storytelling.',
    ],
    whyToUseAr: [
      'توفير آلاف الدولارات من تكاليف وكالات التصميم والإعلان عند التجهيز لمعارض هايم تكستيل فرانكفورت أو بريميير فيجن باريس.',
      'طباعة بروشورات ثلاثية الطي وفلايرز مواصفات فنية وبانرات رول أب للمعارض مباشرة من المتصفح بجودة عالية.',
      'إبراز قيمة قطن جيزة المصري بهوية بصرية وقصة علامة تجارية تضاهي كبرى العلامات الأوروبية.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Enter Brand Name, Product Line & Target Market',
        titleAr: '١. أدخل اسم العلامة التجارية وخط الإنتاج والسوق المستهدف',
        detailEn: 'Click "Generate Full AI Brand & Collateral Suite" to populate all 6 studio tabs.',
        detailAr: 'اضغط توليد الحزمة الكاملة لملء التبويبات الستة بالبيانات والتصميمات المخصصة لمصنعك.',
      },
      {
        titleEn: '2. Download Your Custom SVG Logo & Brand Guidelines (Tab 1)',
        titleAr: '٢. حمّل الشعار المتجه (SVG) ودليل الهوية اللونية (تبويب ١)',
        detailEn: 'The SVG vector logo scales infinitely for woven labels, hangtags, and website headers.',
        detailAr: 'الشعار بصيغة SVG قابل للتكبير لأي مقاس للطباعة على التيكيت المنسوج والكروت والموقع.',
      },
      {
        titleEn: '3. Launch 90-Day Marketing & Automated Outreach (Tabs 2 & 3)',
        titleAr: '٣. نفّذ خطة التسويق لـ 90 يوماً وحملات لينكدإن والبريد (تبويب ٢ و ٣)',
        detailEn: 'Copy ready-made buyer outreach sequences and trade-show countdown posts.',
        detailAr: 'انسخ منشورات لينكدإن ورسائل البريد الجاهزة لاستقطاب المشترين قبل المعارض.',
      },
      {
        titleEn: '4. Preview & Print Brochures, Flyers & Roll-Up Banners (Tab 6)',
        titleAr: '٤. عاين واطبع البروشور والفلاير ورول أب المعارض (تبويب ٦)',
        detailEn: 'Switch between Tri-Fold Brochure, A4 Flyer, and 85×200cm Roll-Up Poster and click Print / Save PDF.',
        detailAr: 'بدّل بين البروشور المطوي والفلاير ورول أب المعرض واضغط طباعة أو حفظ PDF.',
      },
    ],
    proTipEn: 'In Tab 6 (Print Collateral), use your browser’s "Save as PDF" with "Background graphics" checked to generate press-ready PDFs for your local print shop!',
    proTipAr: 'في التبويب السادس (المطبوعات)، اختر "حفظ بتنسيق PDF" من نافذة الطباعة مع تفعيل خيار "رسومات الخلفية (Background graphics)" للحصول على ملف جاهز للمطبعة!',
  },

  // ============================================================================
  // 4. CLUSTER ACADEMY & AI COURSE STUDIO
  // ============================================================================
  'academy': {
    id: 'academy',
    category: 'ai_academy',
    badgeEn: 'Academy & LMS Manual',
    badgeAr: 'دليل الأكاديمية والتدريب المعتمد',
    titleEn: 'Cluster Academy, Technical Upskilling & Verifiable Certificates',
    titleAr: 'أكاديمية التجمع للتدريب الصناعي والشهادات الرقمية الموثقة',
    subtitleEn: 'Bilingual technical courses, interactive markdown lessons, progress tracking & QR-verifiable MC-* certificates',
    subtitleAr: 'دورات هندسية وفنية ثنائية اللغة، تتبع التقدم، وإصدار شهادات رقمية موثقة بكود تحقق',
    whatIsThisEn:
      'The official learning management system (LMS) and AI Course Studio for El-Mahalla El-Kubra engineers, technicians, quality inspectors, and factory managers.',
    whatIsThisAr:
      'نظام إدارة التعلم الرسمي واستوديو توليد الدورات بالذكاء الاصطناعي لمهندسي وفنيي ومراقبي الجودة ومديري المصانع بالمحلة الكبرى.',
    howItWorksEn:
      'Browse published courses by category (Lean & Quality, Dyeing Chemistry, Sustainability & CBAM, Digital ERP, Export) OR generate a brand-new 3-tier course on ANY topic in the AI Course Studio. Completing all lessons in a course automatically mints a public verifiable certificate (`MC-*`).',
    howItWorksAr:
      'تصفح الدورات المعتمدة حسب التخصص أو ولّد دورة جديدة كلياً من 3 مستويات لأي موضوع عبر استوديو الذكاء الاصطناعي. عند إتمام دروس الدورة يتم إصدار شهادة معتمدة برمز تحقق (`MC-*`) قابلة للطباعة.',
    formulaOrArchitecture:
      '3-Tier Mastery Path: Level 1 (Beginner Foundation) → Level 2 (Intermediate Shop-Floor Application) → Level 3 (Advanced Engineering & Troubleshooting) → MC-* Certificate',
    whyToUseEn: [
      'Upskill shop-floor supervisors and engineers on reactive dyeing RFT, Lean SMED, ZDHC, and EU CBAM at zero training cost.',
      'Generate custom SOP training courses on any specific machine or defect in 15 seconds using the AI Course Studio.',
      'Provide verifiable `MC-*` digital certificates that link directly to your factory’s ILUO skill matrix.',
    ],
    whyToUseAr: [
      'رفع كفاءة المهندسين والمشرفين في الصباغة الصحيحة من أول مرة، واللين، وإدارة الكيماويات ZDHC، وآلية CBAM مجاناً.',
      'توليد دورة تدريبية مخصصة لأي ماكينة أو عملية صناعية في 15 ثانية عبر استوديو الدورات الذكي.',
      'منح المتدربين شهادات رقمية موثقة قابلة للتحقق والطباعة.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Browse the Catalog or Type Any Topic in the AI Studio Bar',
        titleAr: '١. اختر دورة من الكتالوج أو اكتب أي موضوع في شريط التوليد الذكي',
        detailEn: 'Filter by category or launch the AI Course Studio to create a custom course.',
        detailAr: 'صفّ الدورات حسب التخصص أو افتح استوديو الذكاء الاصطناعي لتوليد دورة خاصة.',
      },
      {
        titleEn: '2. Enroll & Study Each Lesson (with Diagrams & Formulas)',
        titleAr: '٢. سجّل في الدورة وادرس الدروس والرسوم التوضيحية',
        detailEn: 'Click "Mark Lesson Complete" as you finish each module.',
        detailAr: 'اضغط "إتمام الدرس" بعد قراءة كل وحدة تدريبية وتطبيق تمارينها.',
      },
      {
        titleEn: '3. Claim & Print Your Verifiable MC-* Certificate at 100%',
        titleAr: '٣. احصل على شهادتك المعتمدة (MC-*) فور وصولك إلى ١٠٠٪',
        detailEn: 'Share the public verification URL or print the certificate for your HR file.',
        detailAr: 'شارك رابط التحقق الرسمي أو اطبع الشهادة مباشرة لملف الموارد البشرية.',
      },
    ],
    proTipEn: 'Use the AI Course Studio (`/[locale]/cluster/academy/studio`) before installing new machinery or starting a Kaizen blitz to train all shift operators identically!',
    proTipAr: 'استخدم استوديو الدورات الذكي قبل إدخال أي ماكينة جديدة أو بدء حملة كايزن لتوحيد المعرفة القياسية لدى جميع الورديات!',
  },

  'academy-studio': {
    id: 'academy-studio',
    category: 'ai_academy',
    badgeEn: 'AI Course Generator Manual',
    badgeAr: 'دليل استوديو بناء الدورات الذكي',
    titleEn: 'Any-Topic 3-Tier AI Course & Certificate Studio',
    titleAr: 'استوديو توليد الدورات التدريبية (٣ مستويات) والشهادات بالذكاء الاصطناعي',
    subtitleEn: 'Generate Beginner, Intermediate & Advanced lessons, SVG diagrams, video scripts, quizzes & instant certificates on any topic',
    subtitleAr: 'توليد منهج متكامل (مبتدئ • متوسط • متقدم) مع رسوم SVG واختبارات وشهادة فورية لأي موضوع',
    whatIsThisEn:
      'An interactive AI instructional design studio that turns any topic you type into a structured 3-tier industrial training course complete with custom SVG technical diagrams, step-by-step SOPs, interactive quizzes, and an instant printable certificate.',
    whatIsThisAr:
      'استوديو تعليمي ذكي يحول أي موضوع تكتبه إلى دورة تدريبية صناعية متكاملة من 3 مستويات (مبتدئ، متوسط، متقدم) تشمل رسوماً هندسية (SVG)، وإجراءات تشغيل قياسية، واختبارات تفاعلية، وشهادة إتمام قابلة للطباعة.',
    howItWorksEn:
      'Uses our 5-provider Free LLM cascade to author comprehensive bilingual lessons across Beginner, Intermediate, and Advanced modules, renders dynamic SVG process diagrams, grades your knowledge quiz in real time, and lets you save the course directly into the Cluster Academy database.',
    howItWorksAr:
      'يعتمد على سلسلة نماذج الذكاء الاصطناعي المجانية لتأليف محتوى علمي وتطبيقي عبر المستويات الثلاثة، مع توليد مخططات SVG توضيحية، وتصحيح الاختبارات التفاعلية لحظياً، وإمكانية حفظ الدورة في قاعدة بيانات الأكاديمية.',
    formulaOrArchitecture:
      'Topic Prompt → Free Multi-LLM Engine → 3 Tiers (Beginner • Intermediate • Advanced) + SVG Diagrams + Quiz + DB Save + Printable Certificate',
    whyToUseEn: [
      'Create specialized training on any niche textile topic, ISO standard, software tool, or management skill in seconds.',
      'Includes interactive self-assessment quizzes and a printable certificate with learner name customization.',
      'Save generated courses to the main Cluster Academy catalog so your whole factory team can enroll.',
    ],
    whyToUseAr: [
      'بناء مادة تدريبية احترافية لأي تخصص نسيجي دقيق أو مواصفة أيزو أو مهارة إدارية في ثوانٍ.',
      'يتضمن اختبارات تقييم ذاتي تفاعلية وشهادة إتمام باسم المتدرب جاهزة للطباعة.',
      'إمكانية حفظ الدورة المولّدة في كتالوج الأكاديمية الرسمي ليدرسها جميع العاملين بالمصنع.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Type Any Topic or Click a Suggested Industrial Topic',
        titleAr: '١. اكتب أي موضوع تدريبي أو اختر من الموضوعات المقترحة',
        detailEn: 'Examples: "Reactive Dyeing Right-First-Time", "Air-Jet Loom Warp Tension", "EU CBAM Carbon Accounting".',
        detailAr: 'أمثلة: الصباغة الصحيحة من أول مرة، ضبط شد السداء في أنوال الهواء، حساب البصمة الكربونية CBAM.',
      },
      {
        titleEn: '2. Study the Beginner, Intermediate & Advanced Tabs',
        titleAr: '٢. تصفح دروس المستويات الثلاثة (المبتدئ • المتوسط • المتقدم)',
        detailEn: 'Review the technical SVG diagrams, formulas, and shop-floor checklists in each tier.',
        detailAr: 'راجع الرسوم الهندسية التوضيحية والمعادلات وقوائم التطبيق الميداني في كل مستوى.',
      },
      {
        titleEn: '3. Take the Interactive Quiz & Print Your Certificate',
        titleAr: '٣. أجب عن الاختبار التفاعلي واطبع شهادة الإتمام أو احفظ الدورة',
        detailEn: 'Enter your name to print the certificate or click "Save to Cluster Academy Catalog".',
        detailAr: 'أدخل اسمك لطباعة الشهادة المعتمدة أو اضغط حفظ الدورة في كتالوج الأكاديمية.',
      },
    ],
    proTipEn: 'You can use the Audio Listen button inside any generated lesson to have the course read aloud in Arabic or English during hands-free shop-floor study!',
    proTipAr: 'يمكنك استخدام زر الاستماع الصوتي داخل أي درس للاستماع إلى الشرح باللغة العربية أو الإنجليزية أثناء العمل!',
  },

  // ============================================================================
  // 5. COLLABORATION MODULES (PROCUREMENT, CAPACITY, CONSORTIA, FACILITIES)
  // ============================================================================
  'procurement': {
    id: 'procurement',
    category: 'collaboration',
    badgeEn: 'Joint Buying Manual',
    badgeAr: 'دليل الشراء المجمع للخامات',
    titleEn: 'Joint Procurement Pools (Aggregated Raw Material & Energy Buying)',
    titleAr: 'مجموعات الشراء المشترك والموحد للخامات والصبغات والطاقة',
    subtitleEn: 'Pool SME orders for Giza cotton yarn, ZDHC reactive dyes, spare parts & solar PPA to unlock 12–18% bulk discounts',
    subtitleAr: 'تجميع طلبيات المصانع الصغيرة والمتوسطة للحصول على خصومات الكميات الكبيرة (١٢–١٨٪)',
    whatIsThisEn:
      'A collaborative group-buying mechanism where multiple El-Mahalla factories combine their purchase volumes for common inputs (Ne 30/1 & 40/1 Giza cotton yarn, ZDHC Level-3 reactive dyes, loom spare parts, and rooftop solar PPAs) to negotiate tier-1 wholesale pricing directly from primary producers.',
    whatIsThisAr:
      'آلية شراء تعاوني تتيح لمصانع المحلة الكبرى تجميع كميات مشترياتها من الخامات المشتركة (غزول قطن جيزة، الصبغات النشطة المتوافقة مع ZDHC، قطع غيار الأنوال، والطاقة الشمسية) للتفاوض الجماعي والحصول على أسعار الجملة.',
    howItWorksEn:
      'An organizer factory or the Cluster PMO opens a pool with a Target Volume, Benchmark Market Price, Target Bulk Price, Minimum Commitment Quantity, and Deadline. Member factories commit their required quantities; as total volume crosses tier thresholds, the unit price drops for all participants.',
    howItWorksAr:
      'يقوم مصنع منظم أو إدارة التجمع بطرح مجموعة شراء بكمية مستهدفة وسعر سوق مرجعي وسعر مستهدف مخفض وموعد إغلاق. تلتزم المصانع بالكميات التي تحتاجها، ومع اكتمال الكمية المستهدفة تحصل جميع المصانع المشاركة على السعر المخفض.',
    formulaOrArchitecture:
      'Progress (%) = (∑ Committed Qty / Target Pool Qty) × 100 • Savings (EGP) = Committed Qty × (Benchmark Price − Negotiated Pool Price)',
    whyToUseEn: [
      'SME mills ordering 1–2 tons of yarn normally pay 12–18% more than mega-mills ordering 25+ tons—Joint Pools give SMEs mega-mill buying power!',
      'Guaranteed quality standardization (e.g., certified Giza 86 lot or ZDHC Level-3 dye batch) vetted by the Cluster Testing Lab.',
      'Transparent real-time progress bar showing committed volume, participant count, and exact EGP savings.',
    ],
    whyToUseAr: [
      'منح المصانع الصغيرة والمتوسطة نفس القوة التفاوضية للمصانع العملاقة وتوفير 12–18% من تكلفة الخامات.',
      'ضمان جودة الخامات المشتراة (مثل لوط غزل جيزة 86 موحد أو صبغات معتمدة ZDHC) بعد فحصها في معمل التجمع.',
      'شفافية كاملة في متابعة نسبة اكتمال الكمية والوفر المالي المحقق لكل مصنع.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Filter Open Pools by Category (Yarn, Dyes, Spare Parts, Energy)',
        titleAr: '١. استعرض مجموعات الشراء المفتوحة حسب الفئة (غزول، صبغات، قطع غيار، طاقة)',
        detailEn: 'Compare the Benchmark Market Price against the Target Pool Price and check the remaining days.',
        detailAr: 'قارن سعر السوق الفردي بالسعر المستهدف للمجموعة وتابع الأيام المتبقية للإغلاق.',
      },
      {
        titleEn: '2. Click Any Pool to View Price Tiers & Commit Your Quantity',
        titleAr: '٢. افتح تفاصيل المجموعة وأدخل الكمية التي يرغب مصنعك في الالتزام بها',
        detailEn: 'Enter a quantity >= Minimum Commitment Qty and submit your factory commitment.',
        detailAr: 'أدخل كمية لا تقل عن الحد الأدنى للمشاركة واضغط تأكيد الالتزام.',
      },
      {
        titleEn: '3. Or Create a New Joint Procurement Pool for Your Input Need',
        titleAr: '٣. أو أنشئ مجموعة شراء جديدة للخامة التي يحتاجها مصنعك',
        detailEn: 'Use the "Create New Pool" form (with AI Autofill) to invite peer mills to join your order.',
        detailAr: 'استخدم نموذج إنشاء مجموعة شراء جديدة (المدعوم بالتعبئة الذكية) لدعوة المصانع الزميلة للانضمام.',
      },
    ],
    proTipEn: 'Combine Joint Procurement Pools with Shared Testing Lab bookings (`/[locale]/cluster/facilities`) to test a single master sample for all participating mills!',
    proTipAr: 'اربط مجموعات الشراء المشترك بحجز معمل الفحص المركزي للتجمع لفحص عينة موحدة للوط المشترك وتوزيع تكلفة الفحص على الجميع!',
  },

  'capacity': {
    id: 'capacity',
    category: 'collaboration',
    badgeEn: 'Capacity Exchange Manual',
    badgeAr: 'دليل تبادل الطاقات الإنتاجية',
    titleEn: 'Idle Machine Capacity & Subcontracting Exchange',
    titleAr: 'بورصة تبادل الطاقات الإنتاجية الفائضة والتشغيل للغير',
    subtitleEn: 'Smart matching between idle looms, knitting machines & dyehouses and urgent overflow subcontracting orders',
    subtitleAr: 'مطابقة ذكية بين ساعات التشغيل الفائضة بالماكينات وطلبات التشغيل العاجلة للغير داخل التجمع',
    whatIsThisEn:
      'A real-time B2B capacity balancing marketplace inside El-Mahalla El-Kubra that connects factories having temporary idle machine hours (Offers) with peer factories needing urgent subcontracting capacity (Requests) across 11 textile processes.',
    whatIsThisAr:
      'سوق لحظي لموازنة الطاقات الإنتاجية بين مصانع المحلة الكبرى؛ يربط المصانع التي لديها ساعات ماكينات فائضة مؤقتاً (عروض طاقة) بالمصانع التي لديها طلبيات تفوق طاقتها وتحتاج لتشغيل لدى الغير (طلبات تشغيل) عبر 11 عملية نسيجية.',
    howItWorksEn:
      'Covers Spinning, Weaving, Knitting, Dyeing, Printing, Finishing, Sewing, Embroidery, Cutting, Washing, and Testing. Our Smart Matching algorithm scores opposite-kind posts based on exact process match, date-window overlap, and volume fit.',
    howItWorksAr:
      'يشمل الغزل، النسيج، التريكو، الصباغة، الطباعة، التجهيز، الحياكة، التطريز، القص، الغسيل، والفحص. يقوم محرك المطابقة الذكي بترشيح أفضل العروض المطابقة لطلبك تلقائياً حسب العملية وتداخل التواريخ والكمية.',
    formulaOrArchitecture:
      'Smart Match Score = Process Match (50 pts) + Date Window Overlap (30 pts) + Quantity Fit (20 pts)',
    whyToUseEn: [
      'Monetize idle loom, circular knitting, or jet-dyeing hours instead of absorbing fixed overhead losses.',
      'Accept larger export orders without fear of missing delivery deadlines by subcontracting overflow volume to vetted Mahalla peers.',
      'Keep subcontracting within the local El-Mahalla cluster to eliminate inter-city transport delays.',
    ],
    whyToUseAr: [
      'تحويل ساعات توقف الأنوال أو ماكينات التريكو أو غلايات الصباغة إلى إيرادات نقدية تغطي التكاليف الثابتة.',
      'قبول طلبيات التصدير الكبيرة دون خوف من غرامات التأخير عبر إسناد الفائض لمصانع موثوقة داخل المحلة.',
      'توفير تكاليف ووقت النقل بفضل وجود المصانع المتعاونة في نفس النطاق الجغرافي بالمحلة الكبرى.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Switch Between Capacity "Offers" & Subcontracting "Requests"',
        titleAr: '١. تصفح تبويب "عروض الطاقات المتاحة" أو "طلبات التشغيل للغير"',
        detailEn: 'Filter by process (e.g., Weaving, Dyeing, Knitting, Sewing) and check available dates & rates.',
        detailAr: 'صفّ النتائج حسب نوع العملية الصناعية وراجع التواريخ والأسعار المعروضة.',
      },
      {
        titleEn: '2. Post Your Idle Capacity or Urgent Subcontracting Need',
        titleAr: '٢. انشر عرض طاقة فائضة بمصنعك أو طلب تشغيل لدى الغير',
        detailEn: 'Specify process, machine specs, quantity, unit price, and availability window.',
        detailAr: 'حدد العملية ومواصفات الماكينة والكمية والسعر وفترة الإتاحة.',
      },
      {
        titleEn: '3. Respond to Matches & Accept/Confirm Partner Offers',
        titleAr: '٣. قدّم عرضك أو اقبل عروض المصانع المطابقة',
        detailEn: 'When accepted, the post status automatically updates to MATCHED and notifies both mills.',
        detailAr: 'عند قبول العرض تتحدث حالة الطلب تلقائياً إلى "تمت المطابقة (MATCHED)" مع إشعار الطرفين.',
      },
    ],
    proTipEn: 'Check the "Suggested Smart Matches" banner at the top of the page—it automatically pairs your factory’s posts with complementary peer posts!',
    proTipAr: 'راجع قسم "المطابقات الذكية المقترحة" أعلى الصفحة؛ حيث يرشح لك تلقائياً المصانع المكملة لاحتياج مصنعك!',
  },

  'consortia': {
    id: 'consortia',
    category: 'collaboration',
    badgeEn: 'Export Consortia Manual',
    badgeAr: 'دليل التحالفات التصديرية المشتركة',
    titleEn: 'Multi-Factory Export Consortia & Value-Chain Alliances',
    titleAr: 'التحالفات والتكتلات التصديرية المشتركة عبر سلسلة القيمة',
    subtitleEn: 'Unite spinning, weaving, dyeing, finishing & sewing SMEs to bid jointly on mega international RFQs',
    subtitleAr: 'توحيد مصانع الغزل والنسيج والصباغة والتجهيز والملابس للفوز بمناقصات التصدير الكبرى',
    whatIsThisEn:
      'An institutional alliance builder regulated under the UNIDO export-consortium methodology. It allows 3 to 6 specialized SME factories to combine their capabilities and monthly capacities into a single virtual vertical mega-mill to win large European and Gulf retail orders.',
    whatIsThisAr:
      'منصة لبناء التحالفات التصديرية وفق منهجية منظمة اليونيدو (UNIDO)؛ تتيح لـ 3 إلى 6 مصانع متخصصة دمج قدراتها وطاقاتها الشهرية في كيان تصديري متكامل للفوز بالطلبيات الدولية الكبرى التي يعجز مصنع منفرد عن تلبيتها.',
    howItWorksEn:
      'A Lead Factory creates a consortium linked to a target market or open RFQ, defines value-chain roles (Spinning → Weaving → Dyeing → Finishing → Sewing), invites vetted member factories, and assigns work-share percentages (validated so total accepted share <= 100%).',
    howItWorksAr:
      'ينشئ المصنع القائد تحالفاً مرتبطاً بسوق مستهدف أو مناقصة (RFQ)، ويحدد أدوار سلسلة القيمة (غزل ← نسيج ← صباغة ← تجهيز ← حياكة)، ويدعو المصانع الأعضاء مع تحديد نسبة حصة كل مصنع من العمل والعائد.',
    formulaOrArchitecture:
      'Value-Chain Coverage = Spinning + Weaving/Knitting + Dyeing + Finishing + Sewing • Combined Capacity = ∑ Accepted Members Monthly Capacity',
    whyToUseEn: [
      'Win 100,000+ piece EU hotel linen, hospital uniform, or retail apparel tenders that no single SME could fulfill alone.',
      'Visual value-chain coverage bar immediately shows buyers that all 5 production stages are covered by certified mills.',
      'Clear governance with defined work-share percentages (`sharePct`) and linked B2B RFQs.',
    ],
    whyToUseAr: [
      'الفوز بعقود التصدير الكبرى (فنادق، مستشفيات، سلاسل تجزئة أوروبية) التي تتطلب طاقات إنتاجية ضخمة وتكاملاً رأسياً.',
      'إظهار تغطية سلسلة القيمة الكاملة (من الغزل حتى الملابس الجاهزة) أمام المشتري الدولي بشكل بصري موثق.',
      'حوكمة واضحة لتوزيع حصص العمل والعائد المالي بين المصانع الأعضاء.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Inspect Active Consortia & Their Value-Chain Coverage Chips',
        titleAr: '١. استعرض التحالفات القائمة ومؤشر تغطية مراحل سلسلة القيمة',
        detailEn: 'Green lit chips indicate which stages (Spinning, Weaving, Dyeing, Finishing, Sewing) are already covered.',
        detailAr: 'الشارات الخضراء توضح المراحل المغطاة حالياً والمراحل التي لا تزال تحتاج لمصنع شريك.',
      },
      {
        titleEn: '2. Create a New Consortium or Invite Partner Factories',
        titleAr: '٢. أنشئ تحالفاً تصديرياً جديداً أو ادعُ مصانع متخصصة للانضمام',
        detailEn: 'Pick approved factories from the picker, assign their role and work-share %, and send invitations.',
        detailAr: 'اختر المصانع المعتمدة وحدد دور كل مصنع ونسبة مشاركته في الطلبية.',
      },
      {
        titleEn: '3. Link the Consortium to an Open Export RFQ & Submit Joint Bid',
        titleAr: '٣. اربط التحالف بطلب عرض سعر دولي (RFQ) وقدّم عرضاً مشتركاً',
        detailEn: 'Once members accept, transition the consortium status from FORMING to ACTIVE / BIDDING.',
        detailAr: 'بعد قبول الأعضاء، حوّل حالة التحالف إلى نشط لتقديم العرض الفني والمالي الموحد.',
      },
    ],
    proTipEn: 'Combine a Spinning mill + Weaving mill + ZDHC Dyehouse + Garment Sewing mill in one consortium to offer buyers full "Seed-to-Garment" Egyptian Giza traceability!',
    proTipAr: 'اجمع بين مصنع غزل ومصنع نسيج ومصبغة معتمدة ومصنع ملابس في تحالف واحد لتقديم عرض متكامل "من زهرة القطن إلى المنتج النهائي" للمشتري الأوروبي!',
  },

  'facilities': {
    id: 'facilities',
    category: 'collaboration',
    badgeEn: 'Shared Labs & Studios Manual',
    badgeAr: 'دليل المعامل والمرافق المشتركة',
    titleEn: 'Shared Cluster Facilities, ISO 17025 Testing Labs & CAD Studios',
    titleAr: 'حجز المعامل المركزية المعتمدة واستوديوهات التصميم والمرافق المشتركة',
    subtitleEn: 'Book hourly slots at the TIGARA Textile Testing Lab, 3D CAD/CAM Studio, ZLD Effluent Plant & Training Halls',
    subtitleAr: 'حجز فوري بالساعة لمعمل الفحص المعملي (ISO 17025) واستوديو التصميم ثلاثي الأبعاد ومحطة المعالجة وقاعات التدريب',
    whatIsThisEn:
      'A shared-infrastructure booking system that gives every SME in El-Mahalla affordable hourly access to millions of dollars of advanced testing, design, and environmental equipment without having to buy it individually.',
    whatIsThisAr:
      'نظام حجز للمرافق والمعامل المركزية المشتركة بالتجمع؛ يمكّن المصانع الصغيرة والمتوسطة من استخدام أجهزة فحص وتصميم ومعالجة قيمتها ملايين الدولارات بنظام الساعة وبتكلفة رمزية.',
    howItWorksEn:
      'Displays all shared cluster facilities with their equipment lists, hourly EGP rates, location, and live 7-day occupancy schedule. When you book a time slot, the server validates zero overlap with existing PENDING/CONFIRMED bookings and calculates your exact estimated cost.',
    howItWorksAr:
      'يعرض كافة المرافق المشتركة وقائمة الأجهزة المتاحة بكل مرفق وسعر الساعة وجدول الإشغال للأيام السبعة القادمة، ويتحقق تلقائياً من عدم تعارض المواعيد عند الحجز مع حساب التكلفة الإجمالية.',
    formulaOrArchitecture:
      'Booking Cost (EGP) = Duration Hours × Facility Hourly Rate • Conflict Check: Zero Overlap on [startAt, endAt] Window',
    whyToUseEn: [
      'Run ISO/AATCC colorfastness, pilling, tensile strength, and yarn Uster evenness tests before shipping export lots.',
      'Use 3D CAD/CAM pattern grading and jacquard design workstations by the hour.',
      'Eliminate double-booking conflicts with real-time slot validation and instant confirmation notifications.',
    ],
    whyToUseAr: [
      'إجراء اختبارات ثبات اللون والانكماش وقوة الشد وانتظامية الغزل (Uster) بشهادات معتمدة قبل شحن الطلبيات.',
      'استخدام أجهزة التصميم والتدريج الإلكتروني (3D CAD/CAM) بالساعة لتطوير العينات بسرعة.',
      'منع تضارب المواعيد بفضل نظام التحقق اللحظي وإشعارات التأكيد الفورية.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Filter Facilities by Type (Testing Lab, CAD Studio, Treatment, Training)',
        titleAr: '١. اختر نوع المرفق (معمل فحص، استوديو تصميم CAD، محطة معالجة، قاعة تدريب)',
        detailEn: 'Review the equipment chips (e.g., Uster Tester 6, Spectrophotometer, Lectra CAD) and hourly rate.',
        detailAr: 'استعرض قائمة الأجهزة المتوفرة داخل المرفق وسعر الساعة بالجنيه.',
      },
      {
        titleEn: '2. Select Date, Start/End Time & Purpose of Booking',
        titleAr: '٢. حدد التاريخ ووقت البداية والنهاية والغرض من الحجز',
        detailEn: 'Check the 7-day occupied slots list on the card to pick an open window (up to 12 hours).',
        detailAr: 'راجع المواعيد المحجوزة للأسبوع الحالي واختر موعداً متاحاً (بحد أقصى 12 ساعة).',
      },
      {
        titleEn: '3. Submit Booking & Track Status in "My Bookings"',
        titleAr: '٣. أكد الحجز وتابع حالته في قسم "حجوزاتي"',
        detailEn: 'Cluster lab administrators confirm your slot and notify your factory account.',
        detailAr: 'ستقوم إدارة المعمل بتأكيد الحجز وإرسال إشعار لحساب مصنعك.',
      },
    ],
    proTipEn: 'Book a 2-hour slot at the TIGARA ISO 17025 Testing Lab right after dyeing your first sample lot to attach certified lab values to your EU Digital Product Passport!',
    proTipAr: 'احجز ساعتين في معمل الفحص المعتمد فور صباغة عينة اللوط الأول لإرفاق نتائج الفحص الموثقة في جواز المنتج الرقمي الأوروبي (DPP)!',
  },

  // ============================================================================
  // 6. MODERNIZATION MODULES (MATURITY, SUSTAINABILITY/CBAM, FUNDING)
  // ============================================================================
  'maturity': {
    id: 'maturity',
    category: 'lean_excellence',
    badgeEn: 'Industry 4.0 Diagnostic Manual',
    badgeAr: 'دليل تقييم النضج الرقمي والصناعة 4.0',
    titleEn: 'Digital Maturity & Industry 4.0 Readiness Diagnostic',
    titleAr: 'تشخيص النضج الرقمي وجاهزية الصناعة 4.0 وخارطة التحديث (٩٠ يوماً)',
    subtitleEn: '24-question assessment across 6 dimensions with peer radar benchmarking, 90-day roadmap & matched grants/courses',
    subtitleAr: 'تقييم من ٢٤ سؤالاً عبر ٦ أبعاد مع مخطط راداري للمقارنة بمتوسط التجمع وخارطة طريق ٩٠ يوماً ومنح مطابقة',
    whatIsThisEn:
      'A scientific 6-dimension diagnostic tool (Digital & ERP, Production & Automation, Quality & Traceability, Sustainability & ZDHC, Market & EU Export, People & Skills) that scores your factory from 0 to 100% and assigns an Industry 4.0 Maturity Level (Level 1 Basic → Level 5 Leading).',
    whatIsThisAr:
      'أداة تشخيصية علمية تقيم مصنعك عبر 6 أبعاد استراتيجية (الرقمنة وERP، الإنتاج والأتمتة، الجودة والتتبع، الاستدامة، التسويق والتصدير، والكوادر البشرية) لتمنحك درجة من 100% ومستوى النضج الصناعي (من المستوى 1 إلى 5).',
    howItWorksEn:
      'Step through the 6-dimension wizard (4 questions per dimension, scored 0–4). Upon submission, the engine calculates your dimension scores, plots a Radar Chart comparing your factory against the anonymized Mahalla Cluster Average, builds a prioritized 90-Day Roadmap (Now / Next / Later), and automatically flags matching Funding Grants and Academy Courses for your weakest 2 dimensions!',
    howItWorksAr:
      'تجيب عن 24 سؤالاً عبر معالج تفاعلي من 6 خطوات؛ ليقوم المحرك بحساب درجتك في كل محور، ورسم مخطط راداري يقارن مصنعك بمتوسط مصانع المحلة، وبناء خارطة طريق تنفيذية لـ 90 يوماً، وترشيح المنح التمويلية والدورات التدريبية المطابقة لأضعف محورين لديك تلقائياً!',
    formulaOrArchitecture:
      '6 Dimensions × 4 Questions (0..4 pts) → Dimension Score (0..100%) → Maturity Level 1..5 → Auto-Matched Grants & Academy Courses',
    whyToUseEn: [
      'Know objectively where your factory stands compared to peer mills in El-Mahalla El-Kubra.',
      'Get an actionable 90-day modernization plan (0–30 days Quick Wins, 30–60 days Core Upgrades, 60–90 days Strategic Transformation).',
      'Automatically unlock the "Recommended for You" badge on grants in the Funding Hub that finance your exact maturity gaps!',
    ],
    whyToUseAr: [
      'معرفة موقع مصنعك بدقة وموضوعية مقارنة بمتوسط المصانع المماثلة في تجمع المحلة الكبرى.',
      'الحصول على خارطة طريق تطويرية عملية لمدة 90 يوماً مقسمة حسب الأولوية والعائد.',
      'تفعيل شارة "موصى به لمصنعك" تلقائياً في بوابة المنح والتمويل للبرامج التي تغطي فجوات التحديث لديك!',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Complete the 6-Step Assessment Wizard',
        titleAr: '١. أجب عن الأسئلة عبر المعالج التفاعلي ذو الـ 6 خطوات',
        detailEn: 'Select the option (0 to 4) that best describes your current factory reality in each dimension.',
        detailAr: 'اختر الإجابة التي تعبر بدقة عن الوضع الفعلي الحالي داخل مصنعك في كل محور.',
      },
      {
        titleEn: '2. Analyze Your Radar Chart vs. Cluster Benchmark',
        titleAr: '٢. حلّل مخطط الرادار الخاص بمصنعك مقارنة بمتوسط التجمع',
        detailEn: 'Identify which dimensions lag behind the cluster average and require immediate attention.',
        detailAr: 'حدد المحاور التي يقل فيها أداء مصنعك عن متوسط التجمع للبدء بتحسينها.',
      },
      {
        titleEn: '3. Follow the 90-Day Roadmap & Click Matched Grants/Courses',
        titleAr: '٣. نفّذ خارطة الطريق لـ 90 يوماً وقدّم على المنح والدورات المرشحة',
        detailEn: 'Click the direct links to apply for technical assistance grants and enroll in matched courses.',
        detailAr: 'اضغط على الروابط المباشرة للتقديم على المنح التمويلية والتسجيل في الدورات المطابقة.',
      },
    ],
    proTipEn: 'Re-run your Digital Maturity Assessment every quarter after completing Kaizen projects to track your score trend over time!',
    proTipAr: 'أعد إجراء تقييم النضج الرقمي كل ربع سنة بعد تنفيذ مشاريع التحسين لمتابعة منحنى تطور مصنعك عبر الزمن!',
  },

  'sustainability': {
    id: 'sustainability',
    category: 'lean_excellence',
    badgeEn: 'ESG, Carbon & CBAM Manual',
    badgeAr: 'دليل الاستدامة والبصمة الكربونية CBAM',
    titleEn: 'Sustainability, Scope 1 & 2 Carbon Footprint, ZLD Water & EU CBAM Hub',
    titleAr: 'مركز الاستدامة وحاسبة انبعاثات الكربون (Scope 1 & 2) والمياه وجاهزية CBAM الأوروبية',
    subtitleEn: 'Monthly CO2e/kg product calculator, water intensity L/kg, waste diversion %, peer benchmarks & CSV CBAM export',
    subtitleAr: 'حساب البصمة الكربونية لكل كجم منتج، كثافة استهلاك المياه، تدوير العوادم، وتصدير تقارير CBAM الأوروبية',
    whatIsThisEn:
      'An environmental accounting and EU compliance workstation that calculates your factory’s monthly Scope 1 (Natural Gas, Diesel) and Scope 2 (Grid Electricity vs. Solar) greenhouse gas emissions (`kg CO2e`), carbon intensity per kg of textile output, water intensity (`L/kg`), and overall ESG Score (0–100).',
    whatIsThisAr:
      'محطة محاسبة بيئية وتوافق أوروبي تحسب الانبعاثات الكربونية الشهرية لمصنعك من النطاق الأول (الغاز الطبيعي والسولار) والنطاق الثاني (كهرباء الشبكة مقابل الطاقة الشمسية)، وكثافة الكربون والمياه لكل كجم منتج نسيجي، ومؤشر الحوكمة البيئية (ESG Score).',
    howItWorksEn:
      'Uses documented emission factors (Egypt Grid Electricity ≈ 0.45 kg CO2e/kWh, Natural Gas ≈ 1.96 kg CO2e/m³, Diesel ≈ 2.68 kg CO2e/L, Solar = 0) to compute monthly totals, plots 12-month trend charts against the anonymized cluster median, evaluates your EU Readiness Checklist (CBAM, ESPR DPP, ZDHC, OEKO-TEX/GOTS), and exports audit-ready CSV reports.',
    howItWorksAr:
      'تطبق معاملات الانبعاث القياسية (كهرباء الشبكة المصرية ≈ 0.45 كجم CO2e/ك.و.س، الغاز الطبيعي ≈ 1.96 كجم/م3، السولار ≈ 2.68 كجم/لتر، الطاقة الشمسية = صفر) لحساب البصمة الكربونية ورسم منحنيات الاتجاه ومقارنتها بوسيط التجمع وتصدير ملف CSV جاهز لتقارير CBAM.',
    formulaOrArchitecture:
      'CO2e (kg) = (kWh_Grid × 0.45) + (Gas_m³ × 1.96) + (Diesel_L × 2.68) • Carbon Intensity = Total CO2e (kg) / Production Output (kg)',
    whyToUseEn: [
      'European buyers increasingly demand verified product-level carbon intensity (`kg CO2e/kg fabric`) and water recycling metrics for ESPR Digital Product Passports.',
      'Benchmark your dyehouse water intensity (`L/kg`) against peer mills (best-in-class reactive dyeing with ZLD is < 45 L/kg vs. traditional 100+ L/kg).',
      '1-click CSV export of monthly energy, water, waste, and carbon records for bank green-finance audits (EBRD GEFF / GIZ).',
    ],
    whyToUseAr: [
      'تلبية متطلبات المشترين الأوروبيين الملزمة ببيان البصمة الكربونية (`كجم CO2e لكل كجم قماش`) ونسبة تدوير المياه.',
      'مقارنة كثافة استهلاك المياه في مصبغتك أو مصنعك بالمعايير القياسية للتجمع (أقل من 45 لتر/كجم مع تدوير المياه مقابل 100+ لتر تقليدياً).',
      'تصدير سجل الاستدامة الشهري بضغطة زر بصيغة CSV لتقديمه لجهات التمويل الأخضر (EBRD / GIZ) والمشترين الدوليين.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Log Your Monthly Utility & Production Readings',
        titleAr: '١. أدخل قراءات الاستهلاك والإنتاج الشهرية لمصنعك',
        detailEn: 'Input Period (YYYY-MM), Production (kg), Grid Electricity (kWh), Solar (kWh), Natural Gas (m³), Water (m³), Recycled Water %, and Waste Recycled %.',
        detailAr: 'أدخل الشهر، كمية الإنتاج بالكجم، استهلاك الكهرباء والطاقة الشمسية والغاز والمياه ونسبة التدوير.',
      },
      {
        titleEn: '2. Review Your Carbon & Water Intensity KPIs vs. Cluster Median',
        titleAr: '٢. راجع مؤشرات كثافة الكربون والمياه مقارنة بوسيط التجمع',
        detailEn: 'Track your 12-month trend charts to verify reductions after solar PPA or steam-trap upgrades.',
        detailAr: 'تابع المنحنيات البيانية للتحقق من انخفاض الانبعاثات بعد تركيب الطاقة الشمسية أو صيانة مصايد البخار.',
      },
      {
        titleEn: '3. Complete the EU Readiness Checklist & Export CSV',
        titleAr: '٣. راجع قائمة الجاهزية الأوروبية وصدّر تقرير CSV الموثق',
        detailEn: 'Click "Export CSV" to download your complete sustainability ledger.',
        detailAr: 'اضغط "تصدير CSV" لتحميل السجل البيئي الكامل لمصنعك.',
      },
    ],
    proTipEn: 'Fixing leaking steam traps on dyeing jets and stenters + recovering hot dyehouse wastewater via a heat exchanger typically cuts natural gas consumption (and Scope 1 CO2e) by 18–25%!',
    proTipAr: 'صيانة مصايد البخار التالفة في المصابغ والرامات مع تركيب مبادل حراري لاسترداد حرارة مياه الصرف الساخنة يخفض استهلاك الغاز الطبيعي وانبعاثات الكربون بنسبة 18–25% فوراً!',
  },

  'funding': {
    id: 'funding',
    category: 'lean_excellence',
    badgeEn: 'Grants & Green Finance Manual',
    badgeAr: 'دليل المنح والتمويل الصناعي الأخضر',
    titleEn: 'Industrial Grants, Subsidies, Technical Assistance & Green Finance Hub',
    titleAr: 'بوابة المنح الصناعية والدعم الفني والتمويل الأخضر للمصانع',
    subtitleEn: 'UNIDO/EU TIGARA technical assistance, EBRD GEFF green loans, MSMEDA SME finance, IMC modernization & GIZ programs',
    subtitleAr: 'منح مشروع تجارة (اليونيدو/الاتحاد الأوروبي)، البنك الأوروبي EBRD، جهاز تنمية المشروعات، ومركز تحديث الصناعة',
    whatIsThisEn:
      'A centralized portal connecting El-Mahalla textile factories directly with active national and international grants, subsidized green loans, export-rebate programs, and technical assistance packages—intelligently matched to your factory’s Digital Maturity assessment gaps.',
    whatIsThisAr:
      'بوابة موحدة تربط مصانع المحلة الكبرى ببرامج المنح الدولية والوطنية والقروض الخضراء الميسرة وبرامج الدعم الفني — مع مطابقة ذكية تلقائية حسب نقاط الضعف المكتشفة في تقييم النضج الرقمي لمصنعك.',
    howItWorksEn:
      'Cross-references each funding program’s tags (`digital`, `production`, `quality`, `sustainability`, `market`, `people`) against the weakest 2 dimensions of your latest Maturity Assessment to highlight "Recommended for You" programs, and lets you submit and track applications online.',
    howItWorksAr:
      'تقارن الأداة مجالات كل برنامج تمويلي بأضعف محورين في تقييم النضج الرقمي الأخير لمصنعك لتمييز البرامج بشارة "موصى به لمصنعك"، وتتيح التقديم الإلكتروني المباشر ومتابعة حالة الطلب.',
    formulaOrArchitecture:
      'Smart Grant Matching: Weakest 2 Maturity Dimensions ∩ Program Tags → "Recommended for You" Priority Badge',
    whyToUseEn: [
      'Never miss EU/UNIDO TIGARA technical assistance calls, IMC cost-sharing grants (up to 70–80% subsidy on ISO/OEKO-TEX certification), or EBRD GEFF 15% cashback green equipment loans.',
      'Submit structured funding applications in 2 minutes and track PMO review status (`SUBMITTED → UNDER_REVIEW → APPROVED`).',
      'Use AI Autofill to draft a compelling industrial justification and ROI statement for your grant application.',
    ],
    whyToUseAr: [
      'عدم تفويت منح الدعم الفني لمشروع تجارة (TIGARA)، أو منح مركز تحديث الصناعة (تغطي حتى 70–80% من تكلفة شهادات الأيزو والأيكوتكس)، أو قروض الطاقة الخضراء من البنك الأوروبي (بمنحة استرداد نقدي 15%).',
      'التقديم الإلكتروني المباشر في دقيقتين ومتابعة حالة المراجعة بشفافية كاملة.',
      'استخدام المساعد الذكي لصياغة مبررات المشروع والعائد الصناعي المتوقع لرفع فرص القبول.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Complete Your Maturity Assessment First for Smart Matching',
        titleAr: '١. أجرِ تقييم النضج الرقمي أولاً لتفعيل الترشيح الذكي للمنح',
        detailEn: 'Programs matching your factory’s top modernization gaps will display a green "Recommended" badge.',
        detailAr: 'البرامج التي تغطي فجوات التحديث في مصنعك ستظهر عليها شارة "موصى به لك" تلقائياً.',
      },
      {
        titleEn: '2. Filter Programs by Type (Grant, Loan, Technical Assistance, Subsidy)',
        titleAr: '٢. صفّ البرامج حسب النوع (منحة لا تُرد، تمويل ميسر، دعم فني، رد أعباء)',
        detailEn: 'Check the maximum funding amount, provider, eligibility criteria, and deadline countdown.',
        detailAr: 'راجع الحد الأقصى للتمويل والجهة المانحة والشروط والأيام المتبقية للتقديم.',
      },
      {
        titleEn: '3. Submit Your Application & Track Review Notes',
        titleAr: '٣. قدّم طلبك إلكترونياً وتابع ملاحظات لجنة المراجعة في "طلباتي"',
        detailEn: 'Enter the requested amount and project purpose, then track approval status.',
        detailAr: 'أدخل المبلغ المطلوب والغرض التفصيلي من التمويل وتابع حالة الموافقة.',
      },
    ],
    proTipEn: 'Attach your Lean OEE/SMED diagnostic or Sustainability CO2e CSV report as quantitative evidence when applying for EBRD or TIGARA modernization grants!',
    proTipAr: 'استعن بأرقام تشخيص اللين (OEE/SMED) أو تقرير البصمة الكربونية من المنصة كأدلة رقمية موثقة عند كتابة غرض التمويل لرفع نسبة قبول المنحة!',
  },

  // ============================================================================
  // 7. OBSERVATORY, COMMUNITY, EXPERTS, EVENTS & ANNOUNCEMENTS
  // ============================================================================
  'observatory': {
    id: 'observatory',
    category: 'observatory_community',
    badgeEn: 'Macro Observatory Manual',
    badgeAr: 'دليل مرصد التجمع ومقارنة الأداء',
    titleEn: 'Cluster Macro Observatory, Telemetry & Anonymized Peer Benchmarking',
    titleAr: 'مرصد التجمع الصناعي والمؤشرات الكلية ومقارنة الأداء بين الأقران',
    subtitleEn: 'Executive cluster KPIs, capacity heatmaps by process, CO2e trends, collaboration impact & factory percentiles',
    subtitleAr: 'لوحة المؤشرات التنفيذية للتجمع، خرائط الطاقات حسب العملية، اتجاهات الكربون، وترتيب مصنعك المئوي بين المصانع',
    whatIsThisEn:
      'The real-time economic and industrial intelligence observatory for the Cluster Management Organization (PMO / TIGARA / Ministry of Industry) and member factories. It aggregates cluster-wide capacity, trade, collaboration savings, digital maturity, and carbon intensity.',
    whatIsThisAr:
      'المرصد الاقتصادي والصناعي الحي لإدارة التجمع (PMO / مشروع تجارة / وزارة الصناعة) والمصانع الأعضاء؛ يجمع مؤشرات الطاقة الإنتاجية الكلية، وحجم التعاقدات، ووفر الشراء المجمع، ومتوسط النضج الرقمي، واتجاهات الانبعاثات الكربونية.',
    howItWorksEn:
      'Runs parallel aggregated queries across all 17 cluster tables (cached for fast performance) to render Recharts bar/line visualizations, a "My Position vs. Peers" percentile panel for signed-in factories, and a 1-click KPI CSV exporter.',
    howItWorksAr:
      'يحلل البيانات المجمعة عبر كافة وحدات المنصة ليعرض الرسوم البيانية التفاعلية، ولوحة "موقع مصنعي مقارنة بالأقران" (Percentiles) للمصانع المسجلة، مع زر تصدير جدول المؤشرات بصيغة CSV.',
    formulaOrArchitecture:
      'Cluster Procurement Savings = ∑ CommittedQty × (BenchmarkPrice − PoolPrice) • Peer Percentile = Rank Among Approved Cluster Mills (0..100%)',
    whyToUseEn: [
      'Gives policymakers, donors (EU/UNIDO), and cluster managers live M&E (Monitoring & Evaluation) impact metrics.',
      'Allows individual factory owners to see their anonymized percentile ranking in Digital Maturity, Carbon Intensity, Quotation Win Rate, and Workforce Upskilling.',
      'Identifies cluster-wide capacity bottlenecks (e.g., whether dyeing/finishing capacity lags behind weaving/knitting capacity).',
    ],
    whyToUseAr: [
      'يزود صناع القرار والجهات المانحة (الاتحاد الأوروبي واليونيدو ووزارة الصناعة) بمؤشرات قياس الأثر الحية (M&E).',
      'يتيح لكل صاحب مصنع معرفة ترتيبه المئوي (بسرية تامة) في النضج الرقمي وكفاءة الكربون ونسبة الفوز بالمناقصات وتدريب العمالة.',
      'يكشف فجوات الطاقة الإنتاجية على مستوى التجمع ككل لتوجيه الاستثمارات الجديدة بدقة.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Review Executive Cluster KPIs & Collaboration Impact Cards',
        titleAr: '١. استعرض المؤشرات الكلية للتجمع وبطاقات أثر التعاون الصناعي',
        detailEn: 'See total verified factories, active pools, EGP procurement savings, and matched capacity posts.',
        detailAr: 'تابع إجمالي المصانع المعتمدة، والوفر المالي المحقق من الشراء المشترك، والتحالفات النشطة.',
      },
      {
        titleEn: '2. Inspect Capability Capacity, Maturity & CO2e Trend Charts',
        titleAr: '٢. حلّل الرسوم البيانية للطاقات الإنتاجية والنضج الرقمي وانبعاثات الكربون',
        detailEn: 'Compare monthly capacity across spinning, weaving, knitting, dyeing, and sewing.',
        detailAr: 'قارن الطاقات الإنتاجية الشهرية عبر قطاعات الغزل والنسيج والتريكو والصباغة والملابس.',
      },
      {
        titleEn: '3. Check "My Position vs. Peers" & Export KPI Table to CSV',
        titleAr: '٣. راجع لوحة "ترتيب مصنعي بين الأقران" أو صدّر البيانات بصيغة CSV',
        detailEn: 'Click "Export CSV" in the top right to download the complete observatory dataset.',
        detailAr: 'اضغط "تصدير CSV" لتحميل جدول المؤشرات الكامل للتقارير الرسمية.',
      },
    ],
    proTipEn: 'Use the Observatory’s "Capacity by Capability" chart before investing in new machinery to invest in high-demand bottleneck processes across El-Mahalla!',
    proTipAr: 'استعن بمخطط "الطاقة الإنتاجية حسب التخصص" في المرصد قبل شراء ماكينات جديدة لتوجيه استثمارك نحو العمليات الأكثر طلباً والأقل وفرة في المحلة!',
  },

  'forum': {
    id: 'forum',
    category: 'observatory_community',
    badgeEn: 'Technical Q&A Forum Manual',
    badgeAr: 'دليل المنتدى الفني وتبادل الخبرات',
    titleEn: 'Technical Q&A Forum & Peer Troubleshooting Knowledge Exchange',
    titleAr: 'المنتدى الهندسي والفني لتبادل الخبرات وحل المشكلات الصناعية',
    subtitleEn: 'Ask peer engineers & Master Black Belts about yarn quality, dyeing RFT, loom maintenance & EU CBAM compliance',
    subtitleAr: 'اطرح استفساراتك الهندسية وتبادل الحلول المجربة في الغزل والنسيج والصباغة والصيانة والتصدير',
    whatIsThisEn:
      'A stack-overflow-style industrial Q&A community where El-Mahalla engineers, dyehouse chemists, maintenance managers, and verified consultants solve technical problems together and build a permanent bilingual knowledge base.',
    whatIsThisAr:
      'مجتمع هندسي تفاعلي للأسئلة والأجوبة الفنيه يتبادل فيه مهندسو المحلة وكيميائيو الصباغة ومديرو الصيانة والخبراء المعتمدون الحلول المجربة للمشكلات الصناعية.',
    howItWorksEn:
      'Filter threads by category (`spinning`, `weaving`, `dyeing`, `maintenance`, `export`, `sustainability`), search by keyword, sort by Latest / Top / Unanswered, post Markdown-formatted questions, and mark the best peer reply as the Verified Accepted Answer (`✓`).',
    howItWorksAr:
      'صفّ المواضيع حسب التخصص أو ابحث بالكلمات المفتاحية، ورتب النقاشات حسب الأحدث أو الأكثر تفاعلاً أو غير المجاب عنها، وانشر سؤالك مع إمكانية اعتماد أفضل إجابة هندسية كحل موثق (`✓`).',
    whyToUseEn: [
      'Solve tricky dyeing shade variations, loom electronic board faults, or customs documentation questions in hours with help from 500+ local peers.',
      'Role badges (`Factory Owner`, `Verified Expert`, `Buyer`, `Admin`) show the credibility of every responder.',
      'Pinned threads and accepted answers preserve El-Mahalla’s collective industrial know-how.',
    ],
    whyToUseAr: [
      'الحصول على حلول عملية مجربة لمشكلات الصباغة أو أعطال الكروت الإلكترونية للأنوال أو إجراءات التصدير من خبراء التجمع.',
      'شارات الأدوار المعتمدة بجانب اسم كل مشارك توضح تخصصه وموثوقيته.',
      'الإجابات المعتمدة والمواضيع المثبتة تبني ذاكرة هندسية دائمة لصناعة النسيج بالمحلة.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Search or Filter by Technical Category First',
        titleAr: '١. ابحث في النقاشات السابقة أو صفّ حسب القسم الفني',
        detailEn: 'Check if your technical question already has an Accepted Answer (`✓`).',
        detailAr: 'تحقق مما إذا كان سؤالك قد تمت الإجابة عنه واعتماد حله مسبقاً.',
      },
      {
        titleEn: '2. Post a New Technical Thread with Clear Specs',
        titleAr: '٢. اطرح سؤالاً فنياً جديداً مع ذكر المواصفات بدقة',
        detailEn: 'Include yarn count/composition, machine type, or dye class and up to 5 tags.',
        detailAr: 'اذكر نمرة الغزل وخامته ونوع الماكينة أو الصبغة لتحصل على إجابات هندسية دقيقة.',
      },
      {
        titleEn: '3. Mark the Best Reply as Accepted Answer (✓)',
        titleAr: '٣. اعتمد أفضل إجابة هندسية كحل مقبول (✓) لإفادة زملائك',
        detailEn: 'Thread authors can click "Accept Answer" to pin the winning solution to the top.',
        detailAr: 'يمكن لصاحب السؤال الضغط على "اعتماد الإجابة" لتثبيت الحل الصحيح أعلى الموضوع.',
      },
    ],
    proTipEn: 'Filter by the "Unanswered" tab if you are a senior engineer or consultant looking to help peer factories and build your reputation in the cluster!',
    proTipAr: 'إذا كنت مهندساً خبيراً أو استشارياً، تصفح تبويب "غير مجاب عنه" لمساعدة المصانع الزميلة وبناء سمعتك المهنية داخل التجمع!',
  },

  'experts': {
    id: 'experts',
    category: 'observatory_community',
    badgeEn: 'Experts & Mentorship Manual',
    badgeAr: 'دليل الخبراء والإرشاد الصناعي',
    titleEn: 'Verified Industrial Experts Directory & Free Mentorship Booking',
    titleAr: 'دليل الخبراء والاستشاريين المعتمدين وبوابة الإرشاد الصناعي المجاني',
    subtitleEn: 'Connect 1-on-1 with Lean Six Sigma Master Black Belts, ZDHC dyeing chemists, TPM engineers & EU export advisors',
    subtitleAr: 'تواصل مباشر مع خبراء اللين 6 سيجما، كيميائيي الصباغة، مهندسي الصيانة، ومستشاري التصدير لأوروبا',
    whatIsThisEn:
      'A vetted directory of senior textile engineers, academic professors, dyeing specialists, and international trade consultants offering both free pro-bono mentorship sessions (under TIGARA/UNIDO support) and paid on-site factory consulting.',
    whatIsThisAr:
      'دليل موثق لكبار خبراء واستشاريي الغزل والنسيج والصباغة واللين والتصدير الدوليين الذين يقدمون جلسات إرشاد مجانية (بدعم مشروع تجارة/اليونيدو) أو استشارات ميدانية متخصصة للمصانع.',
    howItWorksEn:
      'Search experts by specialty chip or filter for "Free Mentors Only". Factory owners can send a structured Mentorship/Consultation Request specifying topic, problem description, and preferred date; experts manage incoming requests from their inbox (`PENDING → ACCEPTED → COMPLETED`).',
    howItWorksAr:
      'ابحث حسب التخصص أو فعّل فلتر "الإرشاد المجاني فقط"، وأرسل طلب استشارة مباشرة للخبير موضحاً الموضوع والتاريخ المفضل، ليتلقى الخبير إشعاراً ويؤكد الموعد من صندوق طلباته.',
    whyToUseEn: [
      'Book free 1-on-1 diagnostic sessions with verified Master Black Belts and EU export specialists.',
      'Senior engineers can register their own Expert Profile to offer mentorship or consulting across the cluster.',
      'Full request lifecycle tracking (`PENDING / ACCEPTED / COMPLETED`) for both requester and expert.',
    ],
    whyToUseAr: [
      'حجز جلسات إرشاد فني وتصديري مجانية مع خبراء معتمدين ومراجعي جودة دوليين.',
      'إتاحة الفرصة لكبار المهندسين والاستشاريين لتسجيل ملفاتهم المهنية وتقديم خدماتهم لمصانع التجمع.',
      'متابعة منظمة لحالة طلبات الإرشاد والاستشارة من التقديم حتى الإتمام.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Filter by Expertise or Toggle "Free Mentors Only"',
        titleAr: '١. صفّ الخبراء حسب التخصص أو فعّل خيار "إرشاد مجاني"',
        detailEn: 'Review each expert’s years of experience, languages, credentials, and verified badge.',
        detailAr: 'راجع سنوات الخبرة واللغات والتخصصات الدقيقة وشارة التوثيق لكل خبير.',
      },
      {
        titleEn: '2. Click "Request Mentorship" & Describe Your Factory Goal',
        titleAr: '٢. اضغط "طلب استشارة / إرشاد" واكتب موضوع الاستشارة والتاريخ المفضل',
        detailEn: 'The expert receives an instant notification and responds via the Mentorship Inbox.',
        detailAr: 'سيتلقى الخبير إشعاراً فورياً للرد على طلبك وتأكيد الموعد.',
      },
      {
        titleEn: '3. Register as an Expert via "Become an Expert"',
        titleAr: '٣. أو سجّل ملفك كخبير صناعي عبر نموذج "انضم كخبير"',
        detailEn: 'Share your textile specialization and whether you offer free mentorship hours.',
        detailAr: 'أدخل خبراتك وتخصصك وحدد ما إذا كنت تقدم ساعات إرشاد مجانية لدعم التجمع.',
      },
    ],
    proTipEn: 'Generate a Lean A3 Report or Digital Maturity Radar chart first, then share the findings with your matched Expert during your mentorship session!',
    proTipAr: 'ولّد تقرير A3 أو رادار النضج الرقمي لمصنعك أولاً، ثم شارك النتائج مع الخبير المختار خلال جلسة الإرشاد لاستغلال الوقت بأقصى كفاءة!',
  },

  'events': {
    id: 'events',
    category: 'observatory_community',
    badgeEn: 'Events & Delegations Manual',
    badgeAr: 'دليل الفعاليات والمعارض والبعثات',
    titleEn: 'Cluster Workshops, B2B Matchmaking Days & Trade-Fair Delegations',
    titleAr: 'الفعاليات، ورش العمل الفنية، أيام التشبيك التجاري، وبعثات المعارض الدولية',
    subtitleEn: '1-click seat registration, live capacity bars & .ICS calendar sync for Heimtextil, ZDHC & Lean workshops',
    subtitleAr: 'تسجيل فوري للمقاعد، متابعة الأماكن المتبقية، وإضافة الموعد لتقويمك (.ICS) لمعارض هايم تكستيل وورش العمل',
    whatIsThisEn:
      'The official calendar and seat-reservation system for all TIGARA/UNIDO workshops, international buyer matchmaking missions, trade-show delegations (Heimtextil, Première Vision, Destination Africa), and technical webinars.',
    whatIsThisAr:
      'التقويم الرسمي ونظام حجز المقاعد لجميع ورش عمل مشروع تجارة واليونيدو، وأيام التشبيك مع المشترين الأجانب، والبعثات التصديرية للمعارض الدولية، والندوات الفنية.',
    howItWorksEn:
      'Shows upcoming events with remaining seat capacity bars, online/in-person badges, 1-click registration (enforcing maximum seat capacity), and a direct `.ics` calendar file generator (`/api/cluster/events/[id]/ics`) compatible with Outlook, Google Calendar, and Apple Calendar.',
    howItWorksAr:
      'يعرض الفعاليات القادمة مع شريط المقاعد المتبقية، ويتيح التسجيل الفوري بضغطة زر، وتحميل ملف التقويم القياسي (`.ics`) لإضافة الفعالية وتنبيهاتها مباشرة إلى تقويم أوتلوك أو جوجل أو الهاتف.',
    whyToUseEn: [
      'Secure limited seats in subsidized EU trade-fair delegations and B2B buyer matchmaking days before capacity fills up.',
      'Sync event times and locations directly to your phone or Outlook calendar via `.ics` download.',
      'Review past events and training archives.',
    ],
    whyToUseAr: [
      'حجز مقعدك مبكراً في البعثات التصديرية المدعومة وأيام اللقاءات الثنائية (B2B) مع المشترين الأجانب قبل اكتمال العدد.',
      'إضافة الموعد والمكان مباشرة إلى تقويم هاتفك أو بريدك الإلكتروني عبر زر (.ICS).',
      'متابعة كافة ورش العمل التدريبية الحضورية والإلكترونية بالتجمع.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Filter Upcoming Events by Type (Matchmaking, Trade Fair, Workshop, Webinar)',
        titleAr: '١. صفّ الفعاليات القادمة حسب النوع (تشبيك تجاري، معرض دولي، ورشة عمل، ندوة)',
        detailEn: 'Check the date badge, location/online link, organizer, and seats remaining.',
        detailAr: 'راجع التاريخ والمكان والجهة المنظمة وعدد المقاعد المتبقية.',
      },
      {
        titleEn: '2. Click "Register Seat" to Reserve Your Spot Instantly',
        titleAr: '٢. اضغط "تسجيل الحضور" لحجز مقعد مصنعك فوراً',
        detailEn: 'You can cancel your registration anytime if your schedule changes.',
        detailAr: 'يمكنك إلغاء الحجز في أي وقت لإتاحة المقعد لزميل آخر إذا تغير جدولك.',
      },
      {
        titleEn: '3. Click "Add to Calendar (.ICS)"',
        titleAr: '٣. اضغط "إضافة إلى التقويم (.ICS)" لتفعيل التذكير التلقائي',
        detailEn: 'Downloads a universal calendar invite file for Outlook/Google/Apple Calendar.',
        detailAr: 'يقوم بتحميل ملف دعوة تقويم قياسي يعمل على جميع الهواتف وأجهزة الكمبيوتر.',
      },
    ],
    proTipEn: 'Before attending a B2B Buyer Matchmaking Event, use the AI Brand Studio (`/[locale]/cluster/brand-studio`) to print your 6-panel brochure and A4 spec flyers!',
    proTipAr: 'قبل حضور يوم التشبيك التجاري مع المشترين الأجانب، استخدم "استوديو الهوية والمطبوعات" لطباعة بروشور مصنعك وفلاير المواصفات الفنية!',
  },

  'announcements': {
    id: 'announcements',
    category: 'observatory_community',
    badgeEn: 'Official PMO Bulletins Manual',
    badgeAr: 'دليل التعميمات والنشرات الرسمية',
    titleEn: 'Official Cluster PMO Bulletins, Regulatory Alerts & Grant Deadlines',
    titleAr: 'لوحة التعميمات الرسمية لإدارة التجمع والتنبيهات التنظيمية ومواعيد المنح',
    subtitleEn: 'Role-targeted bilingual circulars from the Cluster Management Organization, UNIDO/TIGARA & Ministry of Industry',
    subtitleAr: 'النشرات الرسمية الموجهة للمصانع والمشترين والكوادر من إدارة التجمع ومشروع تجارة ووزارة الصناعة',
    whatIsThisEn:
      'The authoritative communication channel where the Cluster Management Organization publishes official circulars, export subsidy updates, customs/CBAM regulatory changes, and urgent grant deadlines.',
    whatIsThisAr:
      'القناة الرسمية المعتمدة لإصدار التعميمات والقرارات التنظيمية ومواعيد التقديم على المنح وبرامج رد الأعباء التصديرية من إدارة التجمع الصناعي.',
    howItWorksEn:
      'Automatically filters active announcements tailored to your role (`ALL`, `FACTORIES`, `BUYERS`, `WORKERS`), pins critical alerts at the top, and fans out in-app notifications when new circulars are published.',
    howItWorksAr:
      'تعرض التعميمات النشطة الموجهة لدورك تلقائياً مع تثبيت الإعلانات الهامة في الأعلى وإرسال إشعارات فورية للمستخدمين عند صدور تعميم جديد.',
    whyToUseEn: [
      'Stay informed on official Ministry of Industry, GOEIC, IDA, and EU/UNIDO TIGARA cluster circulars.',
      'Pinned alerts ensure you never miss a subsidy submission window or trade mission deadline.',
    ],
    whyToUseAr: [
      'البقاء على اطلاع دائم بالقرارات الرسمية لوزارة الصناعة وهيئة التنمية الصناعية ومشروع تجارة.',
      'التنبيهات المثبتة تضمن عدم فوات مواعيد التقديم على برامج المساندة التصديرية والمنح.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Read Pinned Official Bulletins at the Top',
        titleAr: '١. راجع التعميمات الرسمية المثبتة في أعلى الصفحة',
        detailEn: 'Pinned items contain time-sensitive regulatory or funding deadlines.',
        detailAr: 'التعميمات المثبتة تحتوي على مواعيد نهائية هامة للمنح أو قرارات تنظيمية عاجلة.',
      },
      {
        titleEn: '2. Click Action Links Inside Any Bulletin',
        titleAr: '٢. اضغط على الروابط المباشرة المرفقة داخل التعميم',
        detailEn: 'Jump directly to the referenced Funding Program, Event, or Procurement Pool.',
        detailAr: 'انتقل مباشرة إلى برنامج التمويل أو الفعالية أو مجموعة الشراء المشار إليها.',
      },
    ],
    proTipEn: 'Check the bell icon in the top navbar anytime to see unread PMO announcements pushed to your account!',
    proTipAr: 'تابع أيقونة الجرس في الشريط العلوي لمعرفة التعميمات والإشعارات الجديدة فور صدورها!',
  },

  // ============================================================================
  // 8. B2B MARKETPLACES, FACTORIES, DPP, LOGISTICS & RECRUITMENT
  // ============================================================================
  'factories': {
    id: 'factories',
    category: 'export_trade',
    badgeEn: 'Factories Directory Manual',
    badgeAr: 'دليل مصانع المحلة المعتمدة',
    titleEn: 'Verified El-Mahalla El-Kubra Textile Factories Directory & KYC Profiles',
    titleAr: 'دليل مصانع الغزل والنسيج والصباغة والملابس المعتمدة بالمحلة الكبرى',
    subtitleEn: 'Search 520+ spinning, weaving, knitting, dyeing & garment mills with IDA/GOEIC KYC verification & AI RFQ messaging',
    subtitleAr: 'تصفح وابحث في مصانع المحلة الموثقة مع شارات الاعتماد وطلب عروض الأسعار المباشر',
    whatIsThisEn:
      'The verified B2B industrial directory of El-Mahalla El-Kubra mills. International and domestic buyers can filter mills by production capability, certifications, minimum order quantity (MOQ), and subscription tier, and inspect each mill’s full catalog, reviews, and KYC credentials.',
    whatIsThisAr:
      'الدليل الصناعي الموثق لمصانع المحلة الكبرى؛ يتيح للمشترين المحليين والدوليين البحث والتصفية حسب التخصص الإنتاجي والشهادات الدولية والحد الأدنى للطلب (MOQ)، واستعراض كتالوج منتجات كل مصنع وتقييماته.',
    howItWorksEn:
      'Queries approved factories from PostgreSQL (with rich Mahalla fallback profiles when offline) and provides instant search, capability filtering, verified KYC badges, and direct links to each factory’s profile, product listings, and RFQ quotation portal.',
    howItWorksAr:
      'يعرض المصانع المعتمدة والموثقة (KYC) مع فلاتر بحث فورية حسب القدرات التصنيعية، ويتيح الدخول لصفحة كل مصنع لاستعراض منتجاته وإرسال طلب عرض سعر (RFQ) أو رسالة مباشرة.',
    whyToUseEn: [
      'Source directly from verified primary manufacturers in El-Mahalla El-Kubra with zero middlemen.',
      'Verify factory capabilities, monthly capacity, certifications (ISO, OEKO-TEX, GOTS, BSCI), and buyer ratings.',
      'Contact factory owners directly or send an AI-structured RFQ in 1 click.',
    ],
    whyToUseAr: [
      'التوريد المباشر من المصانع المنتجة بالمحلة الكبرى بدون وسطاء.',
      'التحقق من قدرات الماكينات والطاقة الشهرية وشهادات الجودة والتصدير وتقييمات المشترين السابقين.',
      'التواصل المباشر مع إدارة المصنع أو إرسال طلب عرض سعر فني ومالي (RFQ) بضغطة زر.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Search by Factory Name, Product, or Capability Keyword',
        titleAr: '١. ابحث باسم المصنع أو نوع المنتج أو التخصص الصناعي',
        detailEn: 'Example keywords: "Giza 86 Yarn", "Reactive Dyeing", "Hotel Terry Towels", "Denim".',
        detailAr: 'أمثلة: غزل جيزة 86، صباغة نشطة، فوط فندقية، مفروشات، تريكو دائري.',
      },
      {
        titleEn: '2. Click Any Factory Card to Open Its Full B2B Profile',
        titleAr: '٢. اضغط على بطاقة المصنع لفتح ملفه الكامل وكتالوج منتجاته',
        detailEn: 'Inspect active product listings, EU Digital Product Passports, and verified buyer reviews.',
        detailAr: 'استعرض المنتجات المعروضة وجوازات السفر الرقمية للمنتجات وتقييمات العملاء.',
      },
      {
        titleEn: '3. Click "Request Quotation (RFQ)" or "Message Factory"',
        titleAr: '٣. اضغط "طلب عرض سعر (RFQ)" أو "مراسلة المصنع"',
        detailEn: 'Start a direct negotiation or invite the factory into an Export Consortium.',
        detailAr: 'ابدأ تفاوضاً مباشراً أو ادعُ المصنع للانضمام إلى تحالف تصديري مشترك.',
      },
    ],
    proTipEn: 'Factory owners: Complete your KYC upload in `/[locale]/dashboard/factory` to earn the green Verified Shield badge and rank higher in buyer searches!',
    proTipAr: 'لأصحاب المصانع: استكمل رفع مستندات التوثيق (السجل الصناعي والبطاقة الضريبية) في لوحة تحكم المصنع للحصول على شارة التوثيق الخضراء وتصدر نتائج بحث المشترين!',
  },

  'marketplace-products': {
    id: 'marketplace-products',
    category: 'export_trade',
    badgeEn: 'Products Marketplace Manual',
    badgeAr: 'دليل سوق المنتجات النهائية والغزول',
    titleEn: 'Finished Products, Yarns & Fabrics B2B Marketplace',
    titleAr: 'سوق المنتجات النهائية والغزول والأقمشة والمفروشات (B2B)',
    subtitleEn: 'Source export-grade Giza yarns, woven/knitted fabrics, hotel bedlinen & terry towels with multi-currency pricing & EU DPP links',
    subtitleAr: 'توريد غزول قطن جيزة، الأقمشة المنسوجة والتريكو، المفروشات الفندقية، والوبريات بأسعار متعددة العملات',
    whatIsThisEn:
      'The primary B2B product catalog where verified El-Mahalla mills list export-ready yarns, greige/dyed fabrics, home textiles, and garments with technical specs, MOQ, lead times, and cryptographic EU Digital Product Passports.',
    whatIsThisAr:
      'الكتالوج التجاري الرئيسي (B2B) لعروض الغزول والأقمشة والمفروشات الفندقية والملابس الجاهزة للتصدير من مصانع المحلة المعتمدة، مع بيان الحد الأدنى للطلب والأسعار وجواز المنتج الرقمي الأوروبي.',
    howItWorksEn:
      'Supports real-time keyword search, price sorting, multi-currency conversion (`EGP / USD / EUR` via the top navbar selector), direct RFQ submission, and 1-click inspection of linked EU Digital Product Passports (`/[locale]/dpp/[id]`).',
    howItWorksAr:
      'يدعم البحث الفوري والترتيب السعري وتحويل العملات لحظياً (جنيه / دولار / يورو من الشريط العلوي)، وطلب عروض الأسعار المباشر، واستعراض شهادة جواز المنتج الرقمي الأوروبي (DPP).',
    whyToUseEn: [
      'Compare verified specifications (Ne count, GSM, width, composition) and wholesale pricing across El-Mahalla mills.',
      'Switch currencies between EGP, USD, and EUR instantly for domestic or export budgeting.',
      'Verify carbon footprint and Egyptian cotton origin via attached EU Digital Product Passports.',
    ],
    whyToUseAr: [
      'مقارنة المواصفات الفنية الدقيقة (نمرة الغزل، وزن المتر المربع GSM، العرض، الخامة) والأسعار بين المصانع.',
      'التبديل الفوري بين الجنيه والدولار واليورو لحسابات السوق المحلي أو التصدير.',
      'التحقق الموثق من المنشأ والبصمة الكربونية عبر جواز المنتج الرقمي الأوروبي المرفق.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Search by Product Spec (e.g., "Ne 40/1", "Percale", "550 GSM")',
        titleAr: '١. ابحث بالمواصفة الفنية (مثل: جيزة 86، نمرة 40/1، ساتان، 550 جرام)',
        detailEn: 'Sort by latest listings, lowest price, or highest price.',
        detailAr: 'رتب العروض حسب الأحدث أو الأقل سعراً أو الأعلى سعراً.',
      },
      {
        titleEn: '2. Click "EU Digital Passport (DPP)" on Certified Products',
        titleAr: '٢. اضغط على شارة "جواز المنتج الرقمي (DPP)" لفحص شهادة المنشأ والكربون',
        detailEn: 'Opens the SHA-256 verifiable ESPR compliance passport for European customs/buyers.',
        detailAr: 'يفتح شهادة التتبع الرقمي المتوافقة مع اشتراطات الاتحاد الأوروبي (ESPR).',
      },
      {
        titleEn: '3. Click "Request Quote / Order" or Visit the Producer Mill',
        titleAr: '٣. اضغط "طلب عرض سعر" أو انتقل لصفحة المصنع المنتج',
        detailEn: 'Lock in pricing and protect your order using Smart Milestone Escrow (30/40/30).',
        detailAr: 'اتفق على السعر واحمِ الصفقة عبر نظام عقود الضمان المرحلية (30/40/30).',
      },
    ],
    proTipEn: 'Factory owners: When adding a product in `/[locale]/dashboard/factory/listings`, click "Generate EU Digital Product Passport" to attract European buyers!',
    proTipAr: 'لأصحاب المصانع: عند إضافة منتج جديد في لوحة التحكم، فعّل "إصدار جواز المنتج الرقمي الأوروبي (DPP)" لجذب المشترين الأوروبيين ورفع قيمة منتجك!',
  },

  'marketplace-resources': {
    id: 'marketplace-resources',
    category: 'export_trade',
    badgeEn: 'Raw Materials & Inputs Manual',
    badgeAr: 'دليل سوق الخامات والكيماويات وقطع الغيار',
    titleEn: 'Raw Materials, Dyestuffs, Auxiliaries & Machinery Spare Parts Marketplace',
    titleAr: 'سوق الخامات الأولية والصبغات والكيماويات المساعدة وقطع غيار الماكينات',
    subtitleEn: 'Source Giza lint cotton, ZDHC Level-3 reactive dyes, silicone softeners, reeds, heddles & electronic loom parts',
    subtitleAr: 'توريد الأقطان الخام، الصبغات النشطة المعتمدة ZDHC، الكيماويات المساعدة، وقطع غيار الأنوال والمصابغ',
    whatIsThisEn:
      'A specialized upstream B2B marketplace where chemical suppliers, spinning mills, and machinery agents supply verified raw inputs, ZDHC-compliant dyestuffs, and spare parts to El-Mahalla factories.',
    whatIsThisAr:
      'سوق متخصص للمدخلات الصناعية يربط موردي الأقطان والغزول والصبغات والكيماويات المساعدة ووكلاء قطع الغيار بمصانع المحلة الكبرى.',
    howItWorksEn:
      'Search and filter upstream production inputs with transparent unit pricing, stock availability, and direct supplier contact—or pool your demand with peer mills via Joint Procurement Pools to save 12–18%.',
    howItWorksAr:
      'ابحث في عروض الخامات والصبغات وقطع الغيار المتاحة للتوريد الفوري، أو انتقل بضغطة زر إلى الشراء المجمع لتوحيد طلبك مع المصانع الزميلة والحصول على خصم الجملة.',
    whyToUseEn: [
      'Find urgent loom spare parts, knitting needles, or ZDHC Level-3 reactive dyes available locally in El-Mahalla today.',
      'Eliminate production downtime waiting for imported spare parts.',
      'Seamlessly escalate high-volume raw material needs into a cluster Joint Procurement Pool.',
    ],
    whyToUseAr: [
      'العثور الفوري على قطع الغيار الحرجة وإبر التريكو والصبغات المعتمدة المتوفرة محلياً بالمحلة اليوم.',
      'منع توقف خطوط الإنتاج بانتظار استيراد قطع الغيار أو الكيماويات.',
      'إمكانية تحويل أي خامة مطلوبة بكميات كبيرة إلى مجموعة شراء مشترك لتخفيض السعر.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Search by Input Name, Chemical Class, or Machine Model',
        titleAr: '١. ابحث باسم الخامة أو نوع الصبغة أو موديل الماكينة',
        detailEn: 'Examples: "Reactive Black B", "Picanol Air-Jet Valve", "Silicone Softener".',
        detailAr: 'أمثلة: صبغة نشطة، صمام نول بيكانول، منعم سيليكون، إبر ماير.',
      },
      {
        titleEn: '2. Compare Unit Price & Available Stock',
        titleAr: '٢. قارن سعر الوحدة والكميات المتوفرة بالمخزن',
        detailEn: 'Contact the supplier directly or request a bulk quotation.',
        detailAr: 'تواصل مباشرة مع المورد أو اطلب عرض سعر للكميات.',
      },
    ],
    proTipEn: 'Before buying reactive dyes or auxiliaries, always verify that the supplier provides a ZDHC MRSL Level-3 conformance certificate for EU export compliance!',
    proTipAr: 'قبل شراء أي صبغات أو كيماويات مساعدة لطلبيات التصدير، تأكد دائماً من حصول الصنف على شهادة توافق ZDHC MRSL المستوى الثالث!',
  },

  'marketplace-waste': {
    id: 'marketplace-waste',
    category: 'export_trade',
    badgeEn: 'Circular Waste & GRS Manual',
    badgeAr: 'دليل بورصة العوادم والتدوير الدائري',
    titleEn: 'Circular Textile Waste, Comber Noil & 5S Red-Tag Salvage Exchange',
    titleAr: 'بورصة تدوير العوادم النسيجية والقصاقيص ومخلفات الغزل والرواكد (5S Red-Tag)',
    subtitleEn: 'Monetize sorted cotton comber noil, selvedge trims, knitting clips & deadstock with live CO2e & water savings metrics',
    subtitleAr: 'تحويل عوادم التمشيط وقصاقيص القص وبواقي الخيوط والرواكد إلى سيولة نقدية مع حساب وفر الكربون والمياه',
    whatIsThisEn:
      'A circular-economy B2B exchange that turns El-Mahalla’s spinning waste (comber noil, carding flat strips), weaving selvedges, garment cutting clips, and 5S Red-Tag deadstock into certified raw material for open-end (OE) recycling spinners, non-woven felt makers, and GRS-certified brands.',
    whatIsThisAr:
      'بورصة للاقتصاد الدائري تحول عوادم الغزل (عوادم التمشيط والكرد)، وحواشي النسيج، وقصاقيص الملابس، ورواكد حملات (5S Red-Tag) إلى خامات أولية عالية القيمة لمصانع الغزل التوربيني (Open-End) واللباد والمشترين الباحثين عن شهادة التدوير العالمية (GRS).',
    howItWorksEn:
      'Calculates the environmental impact of every listed waste lot (`1 ton recycled cotton ≈ 2.2 tons CO2e saved & 3,800 m³ water saved`), filters by waste grade, and lets factories list new waste/salvage lots in 60 seconds (`/[locale]/marketplaces/waste/add`).',
    howItWorksAr:
      'تحسب الأداة العائد البيئي لكل طن عوادم معروض (كل 1 طن قطن معاد تدويره يوفر نحو 2.2 طن انبعاثات كربون و3,800 متر مكعب مياه)، وتتيح للمصانع عرض عوادمها المفروزة للبيع المباشر.',
    formulaOrArchitecture:
      'Circular Impact: 1 Ton Recycled Cotton Waste ≈ −2,200 kg CO2e Saved & −3,800 m³ Virtual Water Saved + GRS Traceability',
    whyToUseEn: [
      'Sorting 100% white Giza comber noil or color-segregated cutting clips increases resale value by 40–70% compared to mixed floor sweepings!',
      'Helps both seller and buyer document Waste Diversion % and Scope 3 carbon reductions in the Sustainability Hub.',
      'Clears shop-floor space immediately after a Lean 5S (1S Sort / Red-Tag) campaign.',
    ],
    whyToUseAr: [
      'فرز عوادم القطن الأبيض (Comber Noil) أو القصاقيص حسب اللون والتركيب يرفع سعر بيعها بنسبة 40–70% مقارنة بالعوادم المخلوطة!',
      'يوثق نسبة تدوير المخلفات ووفر البصمة الكربونية لكل من المصنع البائع والمشتري في تقارير الاستدامة.',
      'يفرغ مساحات صالة الإنتاج والمخازن فوراً بعد تنفيذ حملة الفرز والبطاقات الحمراء (5S).',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Segregate Waste at the Source (By Fiber & Color)',
        titleAr: '١. افرز العوادم من المنبع داخل صالة الإنتاج (حسب الخامة واللون)',
        detailEn: 'Keep 100% cotton clips separate from poly-cotton blends and oil-free.',
        detailAr: 'افصل قصاقيص القطن 100% عن المخلوط واحفظها نظيفة بعيداً عن الزيوت.',
      },
      {
        titleEn: '2. Click "+ List Waste / 5S Red-Tag Lot" to Publish Your Offer',
        titleAr: '٢. اضغط "+ إضافة عوادم / رواكد 5S" لنشر عرضك في البورصة',
        detailEn: 'Specify waste type, weight (kg/tons), fiber composition, and price per kg.',
        detailAr: 'حدد نوع العادم والوزن المتاح والتركيب النسجي وسعر الكيلوجرام.',
      },
      {
        titleEn: '3. Buyers: Filter by Waste Category & Request Lot Purchase',
        titleAr: '٣. للمشترين ومصانع التدوير: صفّ حسب النوع واطلب شراء اللوط مباشرة',
        detailEn: 'Each card displays the exact CO2e and water savings achieved by recycling that lot.',
        detailAr: 'تعرض كل بطاقة كمية الكربون والمياه التي يتم توفيرها عند تدوير هذا اللوط.',
      },
    ],
    proTipEn: 'European apparel brands now mandate 20–30% GRS-certified recycled cotton content—sorted El-Mahalla comber noil is a premium export commodity!',
    proTipAr: 'العلامات الأوروبية الكبرى تشترط الآن نسبة 20–30% قطن معاد تدويره بشهادة GRS؛ مما يجعل عوادم التمشيط والقصاقيص المفروزة بالمحلة سلعة تصديرية عالية الربحية!',
  },

  'marketplace-matchmaking': {
    id: 'marketplace-matchmaking',
    category: 'export_trade',
    badgeEn: 'B2B RFQ Matchmaking Manual',
    badgeAr: 'دليل مناقصات التوريد وطلبات الأسعار RFQ',
    titleEn: 'AI-Assisted B2B RFQ Matchmaking & Factory Quotation Portal',
    titleAr: 'بوابة مناقصات التوريد (RFQ) والتشبيك الذكي وعروض أسعار المصانع',
    subtitleEn: 'Buyers post sourcing specs (with AI Spec Enhancer); verified factories submit technical & financial bids',
    subtitleAr: 'ينشر المشترون مواصفات طلبياتهم (مدعومة بالمحسن الذكي) وتقدم المصانع المعتمدة عروضها الفنية والمالية',
    whatIsThisEn:
      'A reverse-auction and B2B sourcing board where domestic and international buyers publish Requests for Quotations (RFQs) for yarns, fabrics, or garments, and approved El-Mahalla factories submit competitive quotations.',
    whatIsThisAr:
      'منصة مناقصات وطلبات عروض أسعار (RFQ) ينشر فيها المشترون المحليون والدوليون مواصفات طلبياتهم المطلوبة، وتتنافس مصانع المحلة المعتمدة في تقديم عروضها الفنية والمالية.',
    howItWorksEn:
      'Buyers can type a rough description and click "AI Spec Enhancer" (`/api/factory/rfqs/ai-generate`) to automatically format professional textile specs (Ne, GSM, weave, AATCC tolerances, packaging). Approved factories click "Submit Quotation" (`/api/factory/quotation`) to bid price, delivery days, and technical notes.',
    howItWorksAr:
      'يكتب المشتري وصفاً مبدئياً للطلبية ويضغط "تحسين المواصفات بالذكاء الاصطناعي" لصياغة مواصفة فنية قياسية كاملة؛ بينما تضغط المصانع المعتمدة على "تقديم عرض سعر" لإرسال السعر ومدة التوريد والملاحظات الفنية.',
    whyToUseEn: [
      'Buyers receive multiple competitive quotes from vetted El-Mahalla mills with a single RFQ post.',
      'AI Spec Enhancer turns a 1-line buyer request into an unambiguous ISO/AATCC technical specification sheet.',
      'Accepted quotations convert directly into CBE-regulated 30/40/30 Smart Milestone Escrow Contracts!',
    ],
    whyToUseAr: [
      'يحصل المشتري على عدة عروض أسعار تنافسية من مصانع المحلة الموثقة بطلب واحد فقط.',
      'محسن المواصفات الذكي يحول الفكرة المبدئية إلى كراسة مواصفات فنية نسيجية دقيقة تمنع سوء الفهم.',
      'العروض المقبولة تتحول تلقائياً إلى عقود ضمان مرحلية ذكية (30/40/30) لحماية الطرفين!',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Buyers: Fill the RFQ Form & Click "AI Spec Enhancer"',
        titleAr: '١. للمشترين: املأ نموذج الطلب واضغط "تحسين المواصفات بالذكاء الاصطناعي"',
        detailEn: 'Specify product title, quantity, and let AI structure the technical tolerances, then click Publish.',
        detailAr: 'أدخل اسم المنتج والكمية ودع الذكاء الاصطناعي يصيغ التفاصيل الفنية، ثم انشر الطلب.',
      },
      {
        titleEn: '2. Factories: Browse Open RFQs & Click "Submit Quotation"',
        titleAr: '٢. للمصانع: استعرض الطلبات المفتوحة واضغط "تقديم عرض سعر"',
        detailEn: 'Enter your unit/total price, delivery lead time in days, and quality certifications.',
        detailAr: 'أدخل السعر المقترح ومدة التسليم بالأيام وشهادات الجودة المتوفرة بمصنعك.',
      },
      {
        titleEn: '3. Buyers: Compare Quotes & Click "Accept" in Buyer Dashboard',
        titleAr: '٣. للمشترين: قارن العروض المستلمة واضغط "قبول العرض" من لوحة التحكم',
        detailEn: 'Accepting a quote automatically generates a 30/40/30 Milestone Escrow Contract.',
        detailAr: 'قبول العرض ينشئ تلقائياً عقد ضمان مرحلي (30% دفعة مقدمة / 40% فحص جودة / 30% شحن).',
      },
    ],
    proTipEn: 'If an RFQ quantity is too large for your factory alone, click "Form Export Consortium" (`/[locale]/cluster/consortia`) to bid jointly with 2–3 peer mills!',
    proTipAr: 'إذا كانت كمية المناقصة أكبر من طاقة مصنعك بمفرده، افتح وحدة "التحالفات التصديرية" لتكوين تحالف مع مصنعين أو ثلاثة وتقديم عرض مشترك!',
  },

  'logistics-incoterms': {
    id: 'logistics-incoterms',
    category: 'export_trade',
    badgeEn: 'Logistics & Incoterms Manual',
    badgeAr: 'دليل حاسبة الشحن والجمارك Incoterms',
    titleEn: 'Global Freight, Container Sizing & Incoterms 2020 Landed-Cost Simulator',
    titleAr: 'محاكي الشحن الدولي وحساب الحاويات والجمارك (Incoterms 2020)',
    subtitleEn: 'Calculate EXW, FOB, CIF & DDP landed costs, 20ft/40ft/Air freight & EUR.1 / QIZ / AfCFTA duty savings',
    subtitleAr: 'حساب تكلفة التصدير (EXW • FOB • CIF • DDP) وتكلفة الحاويات البحرية والجوية والوفر الجمركي لاتفاقيات مصر التجارية',
    whatIsThisEn:
      'An interactive international trade & logistics simulator that calculates container requirements (20ft FCL, 40ft HC, LCL, Air Cargo), transit days from Alexandria/Damietta/Sokhna ports, marine insurance, customs tariffs, and exact EXW → FOB → CIF → DDP pricing.',
    whatIsThisAr:
      'محاكي لوجستي وتجاري يحسب عدد ونوع الحاويات المطلوبة (20 قدم، 40 قدم هاي كيوب، شحن جزئي، أو شحن جوي)، ومدة الإبحار من موانئ الإسكندرية ودمياط والسخنة، والتأمين البحري، والرسوم الجمركية، والسعر الواصل (EXW / FOB / CIF / DDP).',
    howItWorksEn:
      'Enter shipment weight (kg), volume (CBM), cargo value, transport mode, and destination country. The engine computes freight, port handling, insurance, and compares your 0%-Duty Preferential Landed Cost (under EUR.1, QIZ, AfCFTA, Mercosur) against standard MFN tariffs.',
    howItWorksAr:
      'أدخل وزن الشحنة بالكجم وحجمها بالمتر المكعب وقيمة البضاعة وطريقة الشحن والدولة المستهدفة؛ ليحسب المحرك تكلفة الشحن والتفريغ والتأمين ويقارن السعر الواصل المعفى جمركياً (بشهادة يورو 1 أو الكويز أو أفريقيا) بمنافسيك.',
    formulaOrArchitecture:
      '20ft FCL ≈ 28 CBM / 18t • 40ft HC ≈ 68 CBM / 26t • Preferential Tariff = 0% under EU-Egypt EUR.1, US-QIZ, AfCFTA & Arab League GAFTA',
    whyToUseEn: [
      'Avoid under-quoting or over-quoting international buyers on CIF and DDP export contracts.',
      'Prove mathematically to European and American buyers how Egypt’s 0% duty agreements save them thousands of dollars per container.',
      'Optimize carton packing to maximize 40ft High-Cube container utilization (68 CBM) and minimize freight cost per piece.',
    ],
    whyToUseAr: [
      'تجنب الأخطاء الحسابية عند تسعير عقود التصدير بنظام CIF أو DDP للمشترين الأجانب.',
      'إثبات الوفر الجمركي (0% جمارك عبر اتفاقية اليورو 1 أو الكويز) بالأرقام أمام المشتري الدولي لحسم الصفقة.',
      'تحسين تعبئة الكراتين لاستغلال سعة الحاوية 40 قدم هاي كيوب (68 م3) وخفض نصيب القطعة من تكلفة الشحن.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Select Destination Region/Country & Transport Mode (Sea FCL/LCL or Air)',
        titleAr: '١. اختر وجهة التصدير وطريقة الشحن (بحري حاوية كاملة/جزئي أو جوي)',
        detailEn: 'Compare transit days and base freight rates from Egyptian ports.',
        detailAr: 'قارن مدة الوصول بالأيام وتكلفة الشحن الأساسية من الموانئ المصرية.',
      },
      {
        titleEn: '2. Enter Shipment Weight (kg), Volume (CBM) & EXW Cargo Value',
        titleAr: '٢. أدخل وزن الشحنة (كجم) والحجم (م3) وقيمة البضاعة تسليم المصنع (EXW)',
        detailEn: 'The simulator automatically recommends container count and calculates FOB, CIF, and DDP.',
        detailAr: 'سيوصي المحاكي بنوع وعدد الحاويات ويحسب تكلفة FOB وCIF وDDP تلقائياً.',
      },
      {
        titleEn: '3. Review Incoterms 2020 Risk Transfer & Duty Savings Breakdown',
        titleAr: '٣. راجع جدول توزيع المسؤوليات (Incoterms 2020) والوفر الجمركي',
        detailEn: 'Include the generated breakdown in your proforma invoice and buyer pitch.',
        detailAr: 'استخدم تفصيل التكلفة الناتج في الفاتورة المبدئية وعرض السعر المرسل للمشتري.',
      },
    ],
    proTipEn: 'Vacuum-packing terry towels or rolling knitted fabrics tightly on tubes can increase container payload by 25–35%, cutting sea freight per kg by nearly a third!',
    proTipAr: 'الكبس الحراري للفوط والوبريات أو لف الأقمشة بإحكام يزيد حمولة الحاوية بنسبة 25–35%، مما يخفض تكلفة الشحن البحري للكيلوجرام بنحو الثلث!',
  },

  'dpp-passport': {
    id: 'dpp-passport',
    category: 'lean_excellence',
    badgeEn: 'EU Digital Product Passport Manual',
    badgeAr: 'دليل جواز المنتج الرقمي الأوروبي DPP',
    titleEn: 'EU Digital Product Passport (ESPR) & Cryptographic SHA-256 Traceability',
    titleAr: 'جواز السفر الرقمي الأوروبي للمنتج (EU DPP / ESPR) والتتبع المشفر (SHA-256)',
    subtitleEn: 'Verifiable Egyptian cotton origin, Scope 1–3 carbon footprint, water recycling, ZDHC chemistry & Six Sigma Cpk quality proof',
    subtitleAr: 'شهادة رقمية موثقة لمنشأ القطن المصري، والبصمة الكربونية، وتدوير المياه، والتوافق مع ZDHC، وجودة 6 سيجما',
    whatIsThisEn:
      'Under the European Union’s Ecodesign for Sustainable Products Regulation (ESPR), textiles entering the EU must carry a scannable Digital Product Passport (DPP). This module generates and verifies cryptographic SHA-256 product passports for El-Mahalla yarns, fabrics, and garments.',
    whatIsThisAr:
      'بموجب لائحة التصميم البيئي للمنتجات المستدامة للاتحاد الأوروبي (ESPR)، يجب أن يحمل كل منتج نسيجي يدخل أوروبا "جواز سفر رقمي للمنتج (DPP)" قابل للمسح عبر رمز QR. تصدر هذه الوحدة وتتحقق من جوازات المنتجات الموثقة بتوقيع رقمي (SHA-256).',
    howItWorksEn:
      'Displays verified Supply Chain Origin (Cotton Farm → Spinning → Weaving/Knitting → ZDHC Dyeing → Finishing), Environmental Footprint (`kg CO2e`, `L water`, `% recycled content`, `% renewable energy`), Six Sigma Quality Telemetry (`Cpk`, `RFT%`, `OEE%`), Circular Care/Repair/Recycling instructions, and a deterministic SHA-256 cryptographic hash.',
    howItWorksAr:
      'يعرض سلسلة التوريد الكاملة من المزرعة حتى المنتج النهائي، والبصمة البيئية (الكربون والمياه والطاقة المتجددة ونسبة التدوير)، ومؤشرات جودة اللين 6 سيجما (Cpk وRFT%)، وتعليمات التدوير الدائري، مع بصمة تشفير SHA-256 تمنع التلاعب بالبيانات.',
    formulaOrArchitecture:
      'ESPR DPP = Origin Chain + Carbon/Water Footprint + ZDHC Chemical Compliance + Six Sigma Cpk + SHA-256 Verification Hash + QR Code',
    whyToUseEn: [
      'Future-proof your factory for mandatory 2026–2027 EU ESPR Digital Product Passport enforcement.',
      'Prove authentic Egyptian Giza cotton origin and prevent counterfeit blending claims.',
      'Give retail buyers a print-ready QR code and public verification URL to attach to garment care labels.',
    ],
    whyToUseAr: [
      'تأهيل مصنعك مبكراً للامتثال الإلزامي للائحة جواز المنتج الرقمي الأوروبي (ESPR).',
      'إثبات أصالة قطن جيزة المصري وحمايته من الغش التجاري بسلسلة تتبع موثقة.',
      'تزويد المشتري الأوروبي برمز QR ورابط تحقق رسمي لطباعته على تيكيت المنتج النهائي.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Inspect Supply-Chain Traceability, Carbon & Six Sigma Metrics',
        titleAr: '١. استعرض سلسلة التتبع والبصمة الكربونية ومؤشرات جودة 6 سيجما',
        detailEn: 'Verify each production stage, certificate badge (OEKO-TEX, GOTS, ZDHC), and SHA-256 hash.',
        detailAr: 'تحقق من بيانات كل مرحلة إنتاجية وشهادات الأيكوتكس وZDHC وبصمة التشفير.',
      },
      {
        titleEn: '2. Print or Share the QR-Verified Passport with International Buyers',
        titleAr: '٢. اطبع الشهادة أو شارك رابط التحقق الرسمي مع المشتري الدولي',
        detailEn: 'Use browser print (`Ctrl+P`) or copy the public `/dpp/[id]` link into your export invoice.',
        detailAr: 'اطبع الشهادة كملف PDF أو أدرج رابطها الرسمي في مستندات الشحنة التصديرية.',
      },
      {
        titleEn: '3. Mint New Passports in Your Factory Listings Dashboard',
        titleAr: '٣. أصدر جوازات رقمية لمنتجات مصنعك من لوحة تحكم المصنع',
        detailEn: 'Go to `/[locale]/dashboard/factory/listings` to attach a DPP to any active product.',
        detailAr: 'انتقل إلى صفحة منتجات مصنعك في لوحة التحكم لإصدار جواز سفر رقمي لأي منتج.',
      },
    ],
    proTipEn: 'Linking your Sustainability Hub CO2e records and Lean Six Sigma Cpk scores to your DPP makes your passport Tier-A audit-ready for European customs!',
    proTipAr: 'ربط بيانات البصمة الكربونية ومؤشر القدرة الإحصائية (Cpk) بجواز المنتج الرقمي يمنح شحنتك تصنيف موثوقية من الفئة الأولى لدى المشترين الأوروبيين!',
  },

  'recruitment': {
    id: 'recruitment',
    category: 'observatory_community',
    badgeEn: 'Industrial Recruitment Manual',
    badgeAr: 'دليل بوابة التوظيف الصناعي والمهندسين',
    titleEn: 'Industrial Textile Recruitment, Engineering Jobs & AI Applicant Pitch',
    titleAr: 'بوابة التوظيف الصناعي لوظائف مهندسي وفنيي الغزل والنسيج والصباغة واللين',
    subtitleEn: 'Connect El-Mahalla mills with qualified textile engineers, dyeing chemists, loom technicians & Lean specialists',
    subtitleAr: 'ربط مصانع المحلة الكبرى بمهندسي الغزل والنسيج وكيميائيي الصباغة وفنيي الصيانة وخبراء اللين',
    whatIsThisEn:
      'A specialized industrial recruitment board for the El-Mahalla El-Kubra textile cluster, featuring skill-tag matching, salary transparency, and an integrated AI Cover Letter & Technical Pitch Generator for applicants.',
    whatIsThisAr:
      'بوابة توظيف صناعية متخصصة لقطاع الغزل والنسيج بالمحلة الكبرى؛ تربط المصانع بالمهندسين والفنيين المهرة مع أداة ذكاء اصطناعي لمساعدة المتقدمين في صياغة خطاب التقديم الفني.',
    howItWorksEn:
      'Factories post openings (`/[locale]/dashboard/factory/jobs`) specifying required textile skills and ILUO levels. Engineers and technicians browse openings, open the job detail page (`/[locale]/recruitment/[id]`), use the 1-click AI Pitch Generator to craft a tailored technical application, and apply directly.',
    howItWorksAr:
      'تنشر المصانع الوظائف الشاغرة من لوحة تحكمها مع تحديد المهارات المطلوبة، ويتصفح المهندسون والفنيون الوظائف المتاحة ويستخدمون مولد خطاب التقديم الذكي للتقديم المباشر.',
    whyToUseEn: [
      'Recruit talent with verified textile domain skills (Picanol/Toyota looms, reactive dyeing, Uster QC, Lean Six Sigma) instead of generic job boards.',
      'Applicants can attach their Cluster Academy `MC-*` certificate codes to prove their technical training!',
    ],
    whyToUseAr: [
      'استقطاب كوادر تمتلك مهارات نسيجية دقيقة (صيانة أنوال الهواء، كيمياء الصباغة، مراقبة جودة أوستر، لين 6 سيجما).',
      'تمكين المتقدمين من إرفاق أكواد شهادات أكاديمية التجمع الموثقة (`MC-*`) لإثبات كفاءتهم الفنية.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Search Jobs by Role, Factory, or Technical Skill Tag',
        titleAr: '١. ابحث حسب المسمى الوظيفي أو اسم المصنع أو المهارة الفنية',
        detailEn: 'Review job type, experience level, and salary range.',
        detailAr: 'راجع نوع الدوام ومستوى الخبرة المطلوب ونطاق الراتب.',
      },
      {
        titleEn: '2. Open Job Details & Click "AI Technical Pitch Generator"',
        titleAr: '٢. افتح تفاصيل الوظيفة واضغط "توليد خطاب التقديم الفني بالذكاء الاصطناعي"',
        detailEn: 'Generates a customized bilingual application highlighting your textile & Lean achievements.',
        detailAr: 'يولّد خطاب تقديم احترافي يبرز مهاراتك الهندسية وشهاداتك التدريبية.',
      },
    ],
    proTipEn: 'Complete a free course in the Cluster Academy (`/[locale]/cluster/academy`) and include your `MC-*` certificate code in your application to stand out immediately!',
    proTipAr: 'أكمل دورة تدريبية مجانية في أكاديمية التجمع وأدرج كود شهادتك الموثقة (`MC-*`) في طلب التوظيف لمضاعفة فرص قبولك!',
  },

  'services': {
    id: 'services',
    category: 'collaboration',
    badgeEn: 'Industrial Services Manual',
    badgeAr: 'دليل سوق الخدمات الصناعية المساندة',
    titleEn: 'Industrial Support Services, TPM Maintenance, Testing & Certification Directory',
    titleAr: 'دليل مقدمي الخدمات الصناعية المساندة (الصيانة، المعامل، الشهادات، التغليف، والشحن)',
    subtitleEn: 'Accredited ISO/OEKO-TEX certifiers, loom electronic repair, boiler/steam optimization & export packaging providers',
    subtitleAr: 'جهات منح شهادات الأيزو والأيكوتكس، صيانة كروت الأنوال والغلايات، التغليف التصديري، والتخليص الجمركي',
    whatIsThisEn:
      'A curated directory of B2B industrial service providers supporting El-Mahalla mills across quality certification, predictive/TPM machinery maintenance, energy/boiler efficiency, export packaging, and freight forwarding.',
    whatIsThisAr:
      'دليل معتمد للشركات والمكاتب الهندسية المقدمة للخدمات المساندة لمصانع المحلة: منح شهادات الجودة الدولية، صيانة الماكينات والغلايات، التغليف التصديري، والخدمات اللوجستية.',
    howItWorksEn:
      'Filter service providers by category, compare turnaround times and service packages, or jump directly to the Incoterms 2020 Freight Simulator and Shared Cluster Facilities booking portal.',
    howItWorksAr:
      'صفّ مقدمي الخدمات حسب التخصص، وقارن الباقات والأسعار، أو انتقل مباشرة إلى حاسبة الشحن الدولي ومعامل الفحص المشتركة.',
    whyToUseEn: [
      'Quickly find vetted local technicians for urgent inverter/PLC repairs, stenter burner tuning, or ISO 9001 / OEKO-TEX audit prep.',
      'Verified cluster service partners offer discounted rates to registered El-Mahalla member factories.',
    ],
    whyToUseAr: [
      'الوصول السريع لمراكز صيانة الكروت الإلكترونية والغلايات وجهات منح شهادات الأيزو والأيكوتكس الموثوقة.',
      'الحصول على أسعار تفضيلية خاصة بالمصانع الأعضاء في تجمع المحلة الكبرى.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Select Service Category (Maintenance, Certification, Logistics, Packaging)',
        titleAr: '١. اختر فئة الخدمة المطلوبة (صيانة، شهادات جودة، لوجستيات، تغليف)',
        detailEn: 'Review provider credentials, response times, and contact details.',
        detailAr: 'راجع اعتمادات مقدم الخدمة ووقت الاستجابة وتفاصيل التواصل.',
      },
      {
        titleEn: '2. Request Service Quote or Book Shared Lab Slot',
        titleAr: '٢. اطلب عرض سعر للخدمة أو احجز موعداً في المرافق المشتركة للتجمع',
        detailEn: 'Connect directly with the service provider or use `/[locale]/cluster/facilities`.',
        detailAr: 'تواصل مباشرة مع مقدم الخدمة أو احجز عبر بوابة المعامل المشتركة.',
      },
    ],
    proTipEn: 'Check the Grants & Green Finance Hub (`/[locale]/cluster/funding`) before hiring an ISO/OEKO-TEX consultant—IMC and TIGARA programs often subsidize 70%+ of consulting costs!',
    proTipAr: 'راجع بوابة المنح والتمويل قبل التعاقد على استشارات الأيزو أو الأيكوتكس؛ فبرامج مركز تحديث الصناعة ومشروع تجارة تغطي حتى 70% من التكلفة!',
  },

  // ============================================================================
  // 9. AI COMMAND CENTER, SIDE-BY-SIDE ARENA & GLOBAL GADGETS
  // ============================================================================
  'ai-command-center': {
    id: 'ai-command-center',
    category: 'ai_academy',
    badgeEn: '7-LLM Command Center Manual',
    badgeAr: 'دليل مركز الذكاء الاصطناعي المتعدد والمقارنة',
    titleEn: 'Multi-LLM AI Command Center, Side-by-Side Model Arena & Textile Engineering Advisor',
    titleAr: 'مركز قيادة الذكاء الاصطناعي المتعدد (٧ نماذج مجانية) وحلبة المقارنة المباشرة (Arena)',
    subtitleEn: 'Groq Llama 3.3 70B • DeepSeek R1 • Qwen 2.5 72B • Mistral Small • Gemini 2.5 • Side-by-Side Arena & Pocket Calculators',
    subtitleAr: 'استشر ٧ نماذج ذكاء اصطناعي عالمية مجاناً وقارن إجاباتها جنباً إلى جنب مع حاسبات الغزل والتكلفة',
    whatIsThisEn:
      'The flagship AI intelligence hub of the platform, providing free, unlimited access to 7 open-weights and frontier LLMs across 5 specialist industrial personas (Export Strategist, Textile Engineer, Lean Six Sigma Black Belt, ESG/CBAM Auditor, and B2B Contract Advisor) plus a Side-by-Side Model Comparison Arena.',
    whatIsThisAr:
      'المركز الرئيسي للذكاء الاصطناعي بالمنصة؛ يوفر وصولاً مجانياً لـ 7 نماذج ذكاء اصطناعي عالمية عبر 5 شخصيات استشارية متخصصة (مستشار التصدير، مهندس الغزل والنسيج والصباغة، خبير اللين 6 سيجما، مدقق الاستدامة CBAM، ومستشار العقود) مع حلبة مقارنة النماذج جنباً إلى جنب (Arena).',
    howItWorksEn:
      'Switch between "Single Specialist Advisor" mode and "Side-by-Side Model Comparison Arena" mode. In Arena mode, your prompt is sent simultaneously in parallel to Model A (e.g., Llama 3.3 70B) and Model B (e.g., DeepSeek R1 / Qwen 72B), measuring exact latency (`ms`) and rendering both engineering responses side by side!',
    howItWorksAr:
      'اختر بين وضع "المستشار المتخصص الفردي" أو وضع "حلبة المقارنة جنباً إلى جنب (Arena)". في وضع المقارنة، يتم إرسال سؤالك في نفس اللحظة إلى نموذجين مختلفين (مثل Llama 3.3 70B وDeepSeek R1) لعرض الإجابتين جنباً إلى جنب مع قياس سرعة الاستجابة بالمللي ثانية!',
    formulaOrArchitecture:
      '5-Provider Free Cascade: Groq (Llama 3.3 70B) → Gemini 2.5 → OpenRouter (DeepSeek R1 / Qwen 72B / Mistral) → Pollinations Free AI → Deterministic Engine',
    whyToUseEn: [
      'Compare deep reasoning models (DeepSeek R1) against ultra-fast production models (Groq Llama 3.3 70B) side by side on your toughest factory or export questions.',
      'Includes built-in Voice Readout (TTS), 1-click Markdown Report download (`.md`), and a live Yarn Count (`Ne/Nm/Tex/Denier`) & Landed Cost calculator sidebar.',
      '100% free with automatic multi-provider failover—never hits a dead end even without paid API keys.',
    ],
    whyToUseAr: [
      'مقارنة نماذج التفكير العميق (DeepSeek R1) بنماذج السرعة الفائقة (Llama 3.3 70B) جنباً إلى جنب للحصول على أفضل حل هندسي أو تصديري.',
      'مزود بقراءة صوتية ناطقة (TTS)، وتحميل التقرير بصيغة (.md)، وحاسبة جانبية لنمر الغزل والتكلفة.',
      'مجاني 100% ويعمل بنظام التحويل التلقائي الذكي بين 5 مزودين لضمان عدم انقطاع الخدمة أبداً.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Choose a Specialist Persona (Export, Engineering, Lean, ESG, Contracts)',
        titleAr: '١. اختر تخصص المستشار الذكي (تصدير، هندسة نسيج وصباغة، لين 6 سيجما، استدامة، عقود)',
        detailEn: 'Each persona primes the LLM with deep El-Mahalla textile domain context and equations.',
        detailAr: 'كل شخصية تزود النموذج بالسياق الهندسي والمعادلات القياسية الخاصة بذلك التخصص.',
      },
      {
        titleEn: '2. Select a Free LLM Model or Switch to "Side-by-Side Arena"',
        titleAr: '٢. اختر نموذج الذكاء الاصطناعي أو فعّل وضع "حلبة المقارنة جنباً إلى جنب (Arena)"',
        detailEn: 'In Arena mode, pick Model A and Model B to compare their answers simultaneously.',
        detailAr: 'في وضع المقارنة، اختر النموذج (أ) والنموذج (ب) لمقارنة تحليلهما لنفس المشكلة في آن واحد.',
      },
      {
        titleEn: '3. Ask Any Question, Listen via TTS, or Download as Markdown (.MD)',
        titleAr: '٣. اطرح سؤالك أو اختر من الأسئلة الجاهزة، ثم استمع للإجابة أو حمّلها كملف (.MD)',
        detailEn: 'Use the copy, download, or voice readout buttons on any response.',
        detailAr: 'استخدم أزرار النسخ أو التحميل أو القراءة الصوتية المتوفرة أسفل كل إجابة.',
      },
    ],
    proTipEn: 'Use "DeepSeek R1 Reasoning" when asking complex multi-variable mathematical questions (like dyehouse mass-balance or Six Sigma DOE), and "Llama 3.3 70B" for rapid SOPs and buyer emails!',
    proTipAr: 'استخدم نموذج "DeepSeek R1" للمسائل الهندسية والحسابية المعقدة وتحليل الجذور، واستخدم "Llama 3.3 70B" لصياغة الإجراءات القياسية ورسائل التصدير بسرعة فائقة!',
  },

  'gadget-quick-tools': {
    id: 'gadget-quick-tools',
    category: 'gadgets_calculators',
    badgeEn: 'Ctrl+K Engineering Gadget Manual',
    badgeAr: 'دليل حقيبة المهندس والانتقال السريع (Ctrl+K)',
    titleEn: 'Global Industrial Engineering Gadget & Command Palette (Ctrl+K)',
    titleAr: 'حقيبة المهندس الصناعي ومركز الانتقال السريع للمنصة (Ctrl+K)',
    subtitleEn: 'Instant 28-module command search + Pocket Yarn Count (Ne/Nm/Tex/Denier), Fabric GSM & Takt/FX Calculators',
    subtitleAr: 'بحث وانتقال فوري لجميع وحدات المنصة + حاسبة جيب لنمر الغزل ووزن القماش GSM وزمن التاكت والعملات',
    whatIsThisEn:
      'A floating industrial engineering toolkit accessible from ANY page on the platform via the bottom-left button or by pressing `Ctrl+K` (`Cmd+K` on Mac). It combines a 28-module instant search jumper with pocket textile & Lean calculators.',
    whatIsThisAr:
      'حقيبة أدوات هندسية عائمة متاحة في جميع صفحات المنصة عبر الزر العائم أسفل اليسار أو بالضغط على اختصار لوحة المفاتيح (`Ctrl+K`)؛ تجمع بين محرك انتقال فوري لجميع الوحدات وحاسبات جيب هندسية للنسيج واللين.',
    howItWorksEn:
      'Contains 3 built-in sub-tools: (1) Quick Module Jump directory with instant filtering, (2) Pocket Yarn Count (`Ne ↔ Nm ↔ Tex ↔ Denier`) & Fabric Roll Weight (`GSM × Width × Length → kg/roll & meters/ton`) calculator, and (3) Pocket Takt Time & EGP/USD/EUR Currency converter.',
    howItWorksAr:
      'تضم 3 أدوات مدمجة: (1) الانتقال السريع لأي وحدة بالبحث الفوري، (2) حاسبة تحويل نمر الغزل (Ne / Nm / Tex / Denier) وحساب وزن توب القماش والأمتار في الطن، و(3) حاسبة زمن التاكت السريعة ومحول العملات.',
    formulaOrArchitecture:
      'Nm = Ne × 1.693 • Tex = 590.5 / Ne • Denier = 5315 / Ne • Roll Weight (kg) = (GSM × Width_m × Length_m) / 1000',
    whyToUseEn: [
      'Convert between English Cotton Count (`Ne`), Metric Count (`Nm`), `Tex`, and `Denier` in 1 second while browsing yarn listings or RFQs.',
      'Calculate exact fabric roll weight (`kg`) and linear meters per ton from `GSM` and width (`cm`) without reaching for a calculator.',
      'Jump to any of the platform’s 28+ pages in two keystrokes (`Ctrl+K`).',
    ],
    whyToUseAr: [
      'التحويل الفوري بين نمرة الغزل الإنجليزية (Ne) والمترية (Nm) والتكس (Tex) والدينير (Denier) أثناء تصفح العروض أو المناقصات.',
      'حساب وزن رول القماش بالكيلوجرام وعدد الأمتار الطولية في الطن الواحد بمعلومية الـ GSM والعرض.',
      'الانتقال الخاطف لأي وحدة أو لوحة تحكم في المنصة بضغطة (`Ctrl+K`).',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Press Ctrl+K (or Click the Bottom-Left "Textile Toolkit" Pill)',
        titleAr: '١. اضغط Ctrl+K من لوحة المفاتيح (أو اضغط زر "أدوات المهندس" أسفل الصفحة)',
        detailEn: 'Opens the command modal instantly over your current page.',
        detailAr: 'تفتح نافذة الأدوات السريعة فوراً فوق صفحتك الحالية دون فقدان بياناتك.',
      },
      {
        titleEn: '2. Switch Between Tab 1 (Navigator), Tab 2 (Yarn/GSM) & Tab 3 (Takt/FX)',
        titleAr: '٢. بدّل بين التبويب ١ (الانتقال السريع)، التبويب ٢ (حاسبة الغزل والقماش)، والتبويب ٣ (التاكت والعملات)',
        detailEn: 'Type numbers into any input field for zero-latency engineering conversions.',
        detailAr: 'أدخل الأرقام في أي حقل للحصول على التحويلات الهندسية لحظياً.',
      },
    ],
    proTipEn: 'Memorize `Ctrl+K`—it works on every single page of the platform (Marketplaces, Lean Hub, Export Hub, Dashboards, and Admin)!',
    proTipAr: 'احفظ الاختصار `Ctrl+K`؛ فهو يعمل في جميع صفحات المنصة بالكامل لفتح الحاسبات الهندسية في أي لحظة!',
  },

  'gadget-ai-copilot': {
    id: 'gadget-ai-copilot',
    category: 'gadgets_calculators',
    badgeEn: 'Contextual AI Copilot Manual',
    badgeAr: 'دليل المساعد الذكي السياقي الشامل',
    titleEn: 'Universal Contextual Free Multi-LLM Module Specialist Copilot',
    titleAr: 'المساعد الاستشاري الذكي المجاني المخصص لكل وحدة (Universal AI Copilot)',
    subtitleEn: 'Auto-detects your current page/module and provides tailored 1-click expert prompts, 5 free LLM models, TTS & .MD export',
    subtitleAr: 'يتعرف تلقائياً على الصفحة التي تتصفحها ويوفر استشارات هندسية وتصديرية مخصصة عبر ٥ نماذج مجانية',
    whatIsThisEn:
      'An embedded AI specialist workstation mounted at the bottom of every page (and accessible via the bottom-right floating "Free AI Copilot" pill). It automatically adapts its persona, domain knowledge, and 1-click quick-prompt pills to match whichever module you are currently viewing!',
    whatIsThisAr:
      'مستشار ذكاء اصطناعي مدمج في أسفل كل صفحة بالمنصة (ويمكن القفز إليه عبر الزر العائم أسفل اليمين)؛ يغير شخصيته الاستشارية وأوامره السريعة تلقائياً لتناسب الوحدة التي تتصفحها حالياً!',
    howItWorksEn:
      'Reads your current URL path (`usePathname()`) to load one of 16 specialized industrial personas (Lean Six Sigma, Export Intelligence, Brand Studio, Joint Procurement, Capacity, Consortia, Shared Labs, Maturity, Academy, Sustainability, Funding, Forum, Experts, Events, Observatory, or Marketplaces), lets you pick your preferred Free LLM (`Auto`, `Llama 3.3 70B`, `DeepSeek R1`, `Qwen 2.5 72B`, `Mistral`, `Gemini`), and streams structured Markdown deliverables.',
    howItWorksAr:
      'يقرأ مسار الصفحة الحالية ليحمّل تلقائياً الخبير المختص بتلك الوحدة (من بين 16 شخصية صناعية متخصصة)، ويتيح لك اختيار النموذج الذكي المفضل أو الضغط على أحد الأسئلة الهندسية السريعة لتوليد خطة أو دراسة كاملة.',
    formulaOrArchitecture:
      'Auto-Detected Route Context + 16 Domain Personas + 5-Provider Free LLM Cascade + TTS Voice + Markdown Download',
    whyToUseEn: [
      'Never feel stuck on any module—click one of the 4 tailored quick-prompt pills to generate an instant SOP, negotiation script, or engineering calculation for that exact page.',
      'Switch between 16 module personas manually if you want to cross-consult another specialist.',
      'Listen to the AI response via Text-to-Speech or download it as a `.md` file.',
    ],
    whyToUseAr: [
      'الحصول على مساعدة استشارية فورية مخصصة للصفحة التي تعمل عليها بضغطة زر واحدة على الأوامر السريعة الجاهزة.',
      'إمكانية التبديل بين 16 مستشاراً متخصصاً أو اختيار نموذج الذكاء الاصطناعي المفضل مجاناً.',
      'دعم الاستماع الصوتي للإجابة أو تحميلها كملف توثيق قياسي (.md).',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Click the Bottom-Right "Free AI Copilot" Pill (or Scroll Down)',
        titleAr: '١. اضغط على الزر العائم أسفل اليمين (أو انزل لأسفل الصفحة)',
        detailEn: 'The Copilot automatically selects the specialist persona matching your current page.',
        detailAr: 'سيقوم المساعد تلقائياً بتفعيل المستشار المختص بالصفحة التي تقف عليها.',
      },
      {
        titleEn: '2. Click Any of the 4 Quick-Prompt Pills or Type Your Question',
        titleAr: '٢. اضغط على أحد الأسئلة الأربعة الجاهزة أو اكتب سؤالك الخاص',
        detailEn: 'You can also select a specific Free LLM model (e.g., Llama 3.3 70B or DeepSeek R1) from the dropdown.',
        detailAr: 'يمكنك أيضاً اختيار النموذج الذكي المفضل من القائمة المنسدلة.',
      },
      {
        titleEn: '3. Copy, Download (.MD), or Listen to the Generated Deliverable',
        titleAr: '٣. انسخ التقرير الناتج أو حمّله كملف (.MD) أو استمع إليه صوتياً',
        detailEn: 'Use the action toolbar at the top right of the AI output panel.',
        detailAr: 'استخدم شريط الأدوات أعلى الإجابة للنسخ أو التحميل أو القراءة الصوتية.',
      },
    ],
    proTipEn: 'Every page header also has a green "✨ Free AI Module Specialist ↓" pill that smoothly scrolls you straight to the contextual Copilot!',
    proTipAr: 'تحتوي ترويسة كل صفحة أيضاً على شارة خضراء "✨ المستشار الذكي للوحدة ↓" تنقلك مباشرة إلى المساعد الذكي بالأسفل!',
  },

  // ============================================================================
  // 10. DASHBOARDS (FACTORY, BUYER, ESCROW CONTRACTS, RAG KNOWLEDGE, ADMIN PMO)
  // ============================================================================
  'dashboard-factory': {
    id: 'dashboard-factory',
    category: 'dashboards_admin',
    badgeEn: 'Factory ERP & Portal Manual',
    badgeAr: 'دليل لوحة تحكم المصنع (ERP)',
    titleEn: 'Factory Owner Command Dashboard, Listings, Quotations, Jobs, Analytics & KYC',
    titleAr: 'لوحة تحكم المصنع: إدارة المنتجات، عروض الأسعار، الوظائف، التحليلات، والتوثيق (KYC)',
    subtitleEn: 'Manage your B2B catalog, mint EU Digital Product Passports, bid on RFQs, post jobs & track revenue telemetry',
    subtitleAr: 'إدارة كتالوج منتجات المصنع، إصدار جوازات المنتجات الأوروبية DPP، التسعير للمناقصات، ونشر الوظائف',
    whatIsThisEn:
      'The private operational portal for El-Mahalla factory owners and managers to manage their B2B presence, product listings, EU Digital Product Passports, incoming buyer RFQs, job postings, KYC verification documents, and revenue analytics.',
    whatIsThisAr:
      'البوابة التشغيلية الخاصة بأصحاب ومديري المصانع لإدارة ملف المصنع، وعروض المنتجات، وجوازات السفر الرقمية للمنتجات (DPP)، والرد على مناقصات المشترين (RFQs)، وإعلانات التوظيف، ومستندات التوثيق الرسمي (KYC).',
    howItWorksEn:
      'Divided into 6 sub-modules: Overview & KYC Upload (`dashboard/factory`), Product Listings & DPP Minting (`listings`), Incoming RFQs & AI Quotation Assistant (`rfqs`), Job Postings (`jobs`), Performance & Revenue Charts (`analytics`), and Subscription Tier Management (`billing`).',
    howItWorksAr:
      'تنقسم إلى 6 أقسام متكاملة: النظرة العامة ورفع مستندات التوثيق، إدارة المنتجات وإصدار شهادات DPP، مناقصات المشترين والتسعير الذكي، إدارة الوظائف والمتقدمين، تحليلات الأداء والمبيعات، وإدارة باقة الاشتراك.',
    whyToUseEn: [
      'Centralizes all B2B sales, export compliance passports, and recruitment for your mill in one dashboard.',
      'Includes an AI Quotation Assistant inside `/dashboard/factory/rfqs` to draft winning technical bids.',
      'Mint cryptographic EU Digital Product Passports directly onto your product listings.',
    ],
    whyToUseAr: [
      'تجميع كافة عمليات البيع التجاري وشهادات التصدير الأوروبية والتوظيف لمصنعك في لوحة تحكم واحدة.',
      'تتضمن مساعد تسعير ذكي لصياغة عروض الأسعار الفنية والمالية للمناقصات.',
      'إصدار جوازات المنتجات الرقمية الأوروبية (DPP) مباشرة على منتجاتك المعروضة.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Complete Factory Profile & Upload IDA/GOEIC KYC Documents',
        titleAr: '١. استكمل بيانات المصنع وارفع مستندات السجل الصناعي والبطاقة الضريبية (KYC)',
        detailEn: 'Approved KYC unlocks the green Verified Factory shield across all marketplaces.',
        detailAr: 'اعتماد مستندات التوثيق يمنح مصنعك شارة التوثيق الخضراء أمام جميع المشترين.',
      },
      {
        titleEn: '2. Add Product Listings & Mint EU Digital Passports (DPP)',
        titleAr: '٢. أضف منتجات مصنعك وأصدر لها جواز المنتج الرقمي الأوروبي (DPP)',
        detailEn: 'Include specs, MOQ, price, and carbon/origin metrics.',
        detailAr: 'أدخل المواصفات الفنية والحد الأدنى للطلب والسعر وبيانات المنشأ والكربون.',
      },
      {
        titleEn: '3. Bid on Open Buyer RFQs & Track Escrow Contracts',
        titleAr: '٣. قدّم عروض أسعارك على طلبات المشترين (RFQs) وتابع عقود الضمان',
        detailEn: 'Monitor your quotation win rate and monthly revenue in the Analytics tab.',
        detailAr: 'تابع نسبة فوزك بالعروض ونمو المبيعات في قسم التحليلات.',
      },
    ],
    proTipEn: 'Use the AI Autofill button when creating new product listings to generate bilingual export descriptions and HS-code tags automatically!',
    proTipAr: 'استخدم زر التعبئة الذكية بالذكاء الاصطناعي عند إضافة منتج جديد لتوليد وصف تصديري ثنائي اللغة ومواصفات قياسية تلقائياً!',
  },

  'dashboard-buyer': {
    id: 'dashboard-buyer',
    category: 'dashboards_admin',
    badgeEn: 'Buyer Sourcing Dashboard Manual',
    badgeAr: 'دليل لوحة تحكم المشتري والتوريد',
    titleEn: 'International & Domestic Buyer Sourcing Command Center',
    titleAr: 'لوحة تحكم المشتري الدولي والمحلي وإدارة مناقصات التوريد (RFQs)',
    subtitleEn: 'Compare factory quotations side-by-side, accept winning bids into 30/40/30 Escrow & rate verified suppliers',
    subtitleAr: 'مقارنة عروض أسعار المصانع، قبول العرض الفائز وتحويله لعقد ضمان 30/40/30، وتقييم الموردين',
    whatIsThisEn:
      'The dedicated procurement and sourcing cockpit for domestic and international textile buyers to manage their posted RFQs, evaluate incoming factory quotations, initiate 30/40/30 Smart Milestone Escrow contracts, and submit verified supplier reviews.',
    whatIsThisAr:
      'غرفة عمليات التوريد المخصصة للمشترين المحليين والدوليين لإدارة طلبات عروض الأسعار (RFQs)، ومقارنة عروض المصانع المتقدمة، وتفعيل عقود الضمان المرحلية (30/40/30)، وتقييم أداء المصانع.',
    howItWorksEn:
      'Tracks all RFQs posted by the buyer (`OPEN → QUOTED → CLOSED`), lists every factory quotation with price, delivery days, and factory rating, and provides a 1-click "Accept Quotation" button (`/api/buyer/rfq/accept`) that automatically creates a legally structured Milestone Escrow Contract.',
    howItWorksAr:
      'تعرض جميع طلبات الشراء الخاصة بك مع قائمة عروض الأسعار المقدمة من المصانع (السعر، مدة التوريد، التقييم)، وتتيح قبول العرض الأنسب بضغطة زر لتحويله تلقائياً إلى عقد ضمان ذكي.',
    whyToUseEn: [
      'Eliminate sourcing risk by comparing multiple verified El-Mahalla factories side by side.',
      '1-click transition from accepted quote to a protected 30/40/30 milestone escrow contract.',
      'Leave verified quality and delivery ratings (`/api/buyer/reviews`) after order completion.',
    ],
    whyToUseAr: [
      'مقارنة عروض عدة مصانع معتمدة بالمحلة جنباً إلى جنب لاختيار أفضل سعر وجودة ومدة توريد.',
      'تحويل العرض المقبول بضغطة زر واحدة إلى عقد ضمان مرحلي يحمي أموالك ومواصفات طلبيتك.',
      'تقييم المصنع بعد استلام الشحنة لتعزيز الشفافية في التجمع.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Post a New Sourcing RFQ (with AI Spec Enhancer)',
        titleAr: '١. انشر طلب عرض سعر جديد (RFQ) بالمواصفات والكمية المطلوبة',
        detailEn: 'Approved El-Mahalla factories matching your category are notified immediately.',
        detailAr: 'يتم إشعار المصانع المعتمدة المتخصصة في هذا المنتج لتقديم عروضها.',
      },
      {
        titleEn: '2. Review & Compare Incoming Factory Quotations',
        titleAr: '٢. راجع وقارن عروض الأسعار الفنية والمالية الواردة من المصانع',
        detailEn: 'Check unit price, lead time, and click the factory name to inspect its KYC profile and DPPs.',
        detailAr: 'قارن الأسعار ومدد التسليم وافحص ملف كل مصنع وشهاداته.',
      },
      {
        titleEn: '3. Click "Accept Quotation" to Launch 30/40/30 Escrow',
        titleAr: '٣. اضغط "قبول العرض" لإنشاء عقد الضمان المرحلي (30/40/30)',
        detailEn: 'Proceed to `/[locale]/dashboard/contracts` to fund Milestone 1 (30% Deposit).',
        detailAr: 'انتقل إلى صفحة العقود لمتابعة مراحل التنفيذ والدفعات.',
      },
    ],
    proTipEn: 'Always request a pre-shipment ISO 17025 lab test report from the TIGARA Testing Lab as the release condition for the 40% Quality Inspection milestone!',
    proTipAr: 'اشترط دائماً إرفاق تقرير فحص معمل التجمع المعتمد (ISO 17025) كشرط لصرف الدفعة الثانية (40% بعد فحص الجودة قبل الشحن)!',
  },

  'dashboard-contracts': {
    id: 'dashboard-contracts',
    category: 'dashboards_admin',
    badgeEn: 'Smart Milestone Escrow Manual',
    badgeAr: 'دليل عقود الضمان الذكية (30/40/30)',
    titleEn: 'CBE-Regulated Smart Milestone Escrow Contracts (30% / 40% / 30%)',
    titleAr: 'نظام عقود الضمان المرحلية الذكية (٣٠٪ دفعة مقدمة • ٤٠٪ فحص جودة • ٣٠٪ تسليم)',
    subtitleEn: 'Protect both buyers and factories with stage-gated milestone releases and cryptographic audit logs',
    subtitleAr: 'حماية حقوق كل من المشتري والمصنع عبر ربط صرف الدفعات بمراحل التنفيذ الموثقة والفحص المعملي',
    whatIsThisEn:
      'A stage-gated B2B trade finance and escrow contract management system structured around the international textile standard 30/40/30 payment schedule: 30% Advance Raw Material Deposit, 40% Pre-Shipment Quality Inspection (AQL 2.5 / ISO Lab), and 30% Final Bill of Lading / Delivery.',
    whatIsThisAr:
      'نظام إدارة العقود والضمان المالي المرحلي (Escrow) المصمم لحماية الصفقات التجارية والتصديرية عبر تقسيم قيمة العقد إلى 3 دفعات مشروطة: 30% دفعة مقدمة لشراء الخامات، 40% بعد نجاح فحص الجودة قبل الشحن، و30% عند التسليم أو بوليصة الشحن.',
    howItWorksEn:
      'Displays each contract’s total value, platform escrow fee (2.5%), visual 5-stage progress stepper (`PENDING_DEPOSIT → IN_PRODUCTION → QUALITY_INSPECTION → SHIPPED → COMPLETED`), and role-authenticated action buttons for Buyer and Factory Owner.',
    howItWorksAr:
      'يعرض القيمة الإجمالية للعقد، ومؤشر التقدم البصري عبر المراحل الخمس، وأزرار الاعتماد المخصصة لكل طرف (إيداع الدفعة من المشتري، تأكيد بدء الإنتاج وطلب الفحص من المصنع، واعتماد الجودة والاستلام النهائي).',
    formulaOrArchitecture:
      '30% Raw Material Deposit → Production → 40% QC Lab Approval (AQL 2.5) → Shipment → 30% Final Delivery Release',
    whyToUseEn: [
      'Eliminates buyer fear of paying 100% upfront to a new supplier AND eliminates factory fear of buyer non-payment after production!',
      'Every status transition is recorded in the platform’s immutable Audit Log.',
      'Clear visual timeline showing exactly which milestone is active and what action is required next.',
    ],
    whyToUseAr: [
      'يقضي تماماً على تخوف المشتري من الدفع المقدم غير المضمون، كما يحمي المصنع من مخاطر عدم السداد بعد التصنيع!',
      'توثيق كل خطوة وانتقال مرحلي في سجل التدقيق المشفر للمنصة.',
      'شريط مراحل بصري واضح يبين الدفعة الحالية والإجراء المطلوب من كل طرف.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Buyer: Fund the 30% Deposit to Activate Production',
        titleAr: '١. المشتري: يودع الدفعة المقدمة (٣٠٪) لتفعيل العقد وبدء شراء الخامات',
        detailEn: 'Transitions contract status from PENDING_DEPOSIT to IN_PRODUCTION.',
        detailAr: 'تتحول حالة العقد إلى "قيد الإنتاج" ويتم إشعار المصنع فوراً.',
      },
      {
        titleEn: '2. Factory: Complete Production & Submit for 40% QC Inspection',
        titleAr: '٢. المصنع: ينجز التصنيع ويرفع طلب فحص الجودة لصرف الدفعة الثانية (٤٠٪)',
        detailEn: 'Attach lab test reports or Digital Product Passport verification.',
        detailAr: 'أرفق نتائج معمل الفحص المعتمد أو جواز المنتج الرقمي.',
      },
      {
        titleEn: '3. Buyer: Approve QC & Final Delivery to Release Remaining Funds',
        titleAr: '٣. المشتري: يعتمد فحص الجودة ثم الاستلام النهائي لصرف الدفعة الأخيرة (٣٠٪)',
        detailEn: 'Completes the contract and unlocks verified buyer review submission.',
        detailAr: 'يكتمل العقد بنجاح ويتاح للمشتري تقييم أداء المصنع.',
      },
    ],
    proTipEn: 'Use the AI Contract Advisor in `/[locale]/ai` to generate bilingual INCOTERMS penalty/tolerance clauses before finalizing high-value contracts!',
    proTipAr: 'استعن بمستشار العقود الذكي في صفحة الذكاء الاصطناعي لصياغة بنود التجاوزات المسموحة وشروط التسليم القياسية قبل إبرام الصفقات الكبرى!',
  },

  'dashboard-knowledge': {
    id: 'dashboard-knowledge',
    category: 'ai_academy',
    badgeEn: 'RAG Knowledge Base Manual',
    badgeAr: 'دليل قاعدة المعرفة الهندسية والقياسية RAG',
    titleEn: 'Industrial RAG Semantic Knowledge Base & SOP Ingestion Engine',
    titleAr: 'قاعدة المعرفة الهندسية والقياسية (RAG) ومحرك البحث الدلالي في المراجع الفنية',
    subtitleEn: 'Vector search & AI Q&A across AATCC, ISO, ZDHC, Giza cotton specs, Lean SMED playbooks & your own factory SOPs',
    subtitleAr: 'بحث دلالي ذكي واستعلام بالذكاء الاصطناعي في مواصفات AATCC وISO وZDHC وأدلة اللين وإجراءات مصنعك القياسية',
    whatIsThisEn:
      'A Retrieval-Augmented Generation (RAG) technical library powered by `pgvector` embeddings and free LLMs. It stores authoritative textile engineering standards, dyeing recipes, Lean playbooks, and EU export regulations—and lets you ingest your own factory SOP documents!',
    whatIsThisAr:
      'مكتبة هندسية ذكية تعمل بتقنية التوليد المعزز بالاسترجاع (RAG) والمتجهات الدلالية (`pgvector`)؛ تضم المراجع القياسية لأعمال الغزل والنسيج والصباغة واللين واشتراطات التصدير، وتتيح لك تغذيتها بأدلة التشغيل القياسية الخاصة بمصنعك!',
    howItWorksEn:
      'In Tab 1 ("Semantic Search & AI RAG Answer"), type any technical query to retrieve matching reference documents and generate a grounded AI engineering answer. In Tab 2 ("Ingest New SOP / Technical Document"), paste any manual or standard (`/api/ingest`) to chunk and embed it into the vector database.',
    howItWorksAr:
      'في التبويب الأول يمكنك البحث الدلالي وطرح الأسئلة الهندسية للحصول على إجابة موثقة من المراجع المحفوظة؛ وفي التبويب الثاني يمكنك إضافة أي دليل تشغيل أو مواصفة جديدة لتجزئتها وحفظها في قاعدة المتجهات.',
    whyToUseEn: [
      'Get accurate, reference-grounded answers citing exact AATCC/ISO test numbers, reactive dyeing g/L salt/alkali curves, and SMED standards.',
      'Build a private digital brain for your factory’s standard operating procedures (SOPs).',
    ],
    whyToUseAr: [
      'الحصول على إجابات هندسية دقيقة مستندة إلى أرقام مواصفات AATCC وISO ومنحنيات الصباغة القياسية.',
      'بناء ذاكرة رقمية مؤسسية تحفظ إجراءات التشغيل القياسية (SOPs) وخبرات مصنعك من الضياع.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Search or Click a Curated Industrial Playbook Card',
        titleAr: '١. ابحث عن أي موضوع هندسي أو اختر من المراجع القياسية المعروضة',
        detailEn: 'Ask specific technical questions (e.g., "Glauber salt vs Na2CO3 dosing for deep Navy reactive dyeing").',
        detailAr: 'اطرح سؤالك الفني بالتفصيل للحصول على الإجابة المدعومة بالمراجع.',
      },
      {
        titleEn: '2. Ingest New Factory SOPs in Tab 2',
        titleAr: '٢. أضف أدلة التشغيل القياسية الخاصة بمصنعك في التبويب الثاني',
        detailEn: 'Paste your document text and click Ingest to index it for semantic vector retrieval.',
        detailAr: 'الصق نص الدليل القياسي واضغط حفظ لفهرسته دلالياً في قاعدة المعرفة.',
      },
    ],
    proTipEn: 'Ingest your machine maintenance manuals and buyer quality manuals into the RAG Knowledge Base so shift engineers can query them in seconds!',
    proTipAr: 'أدخل كتالوجات صيانة الماكينات ودلائل جودة المشترين الأجانب في قاعدة المعرفة ليتمكن مهندسو الورديات من الاستعلام عنها في ثوانٍ!',
  },

  'dashboard-messages': {
    id: 'dashboard-messages',
    category: 'dashboards_admin',
    badgeEn: 'B2B Messaging Manual',
    badgeAr: 'دليل المراسلات التجارية المشفرة',
    titleEn: 'B2B Factory–Buyer–Expert Direct Messaging & Negotiation Inbox',
    titleAr: 'صندوق المراسلات التجارية والفنية المباشرة بين المصانع والمشترين والخبراء',
    subtitleEn: 'Real-time thread messaging with 1-click AI B2B reply templates for samples, MOQs, lead times & escrow',
    subtitleAr: 'محادثات فورية منظمة مع قوالب ردود تجارية ذكية لتأكيد العينات والكميات ومواعيد الشحن',
    whatIsThisEn:
      'The built-in B2B communication inbox connecting factory owners, international buyers, consortium partners, and industrial experts inside the platform.',
    whatIsThisAr:
      'صندوق المراسلات المهنية المدمج بالمنصة للتواصل المباشر والتفاوض بين أصحاب المصانع والمشترين الدوليين وشركاء التحالفات والخبراء.',
    howItWorksEn:
      'Displays all active conversation threads on the left and the live message stream on the right, equipped with 1-click B2B Quick-Reply Templates (Sample Dispatch Confirmation, MOQ & Lead-Time Quote, Lab Dip Approval, Escrow Milestone Notice).',
    howItWorksAr:
      'يعرض قائمة المحادثات النشطة مع سجل الرسائل الفوري، ويزودك بأزرار ردود تجارية جاهزة (تأكيد إرسال العينات، عرض السعر والكمية، اعتماد اللون Lab Dip، وإشعار الدفعات).',
    whyToUseEn: [
      'Keep all technical specs, sample approvals, and price negotiations documented in one audit-ready B2B thread.',
      'Respond professionally in seconds using built-in bilingual export reply templates.',
    ],
    whyToUseAr: [
      'حفظ كافة المفاوضات السعرية واعتمادات العينات والمواصفات في سجل رسمي موحد.',
      'الرد السريع والاحترافي باستخدام قوالب المراسلات التصديرية الجاهزة.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Select a Conversation Thread from the Left Sidebar',
        titleAr: '١. اختر المحادثة المطلوبة من القائمة الجانبية',
        detailEn: 'Unread messages are highlighted automatically.',
        detailAr: 'تظهر الرسائل غير المقروءة بعلامة مميزة.',
      },
      {
        titleEn: '2. Click a Quick-Reply Template or Type Your Message',
        titleAr: '٢. اضغط على أحد قوالب الرد السريع أو اكتب رسالتك واضغط إرسال',
        detailEn: 'Messages are saved immediately and trigger an in-app notification for the recipient.',
        detailAr: 'يتم حفظ الرسالة وإرسال إشعار فوري للطرف الآخر.',
      },
    ],
    proTipEn: 'Once you agree on price and lead time in Messages, formalize the deal via an RFQ Acceptance so it is protected by 30/40/30 Milestone Escrow!',
    proTipAr: 'فور الاتفاق على السعر وموعد التسليم في المحادثة، وثّق الصفقة عبر قبول عرض السعر (RFQ) لتتمتع بحماية عقد الضمان المرحلي (30/40/30)!',
  },

  'admin-pmo': {
    id: 'admin-pmo',
    category: 'dashboards_admin',
    badgeEn: 'Admin & Cluster PMO Manual',
    badgeAr: 'دليل لوحة حوكمة وإدارة التجمع (PMO)',
    titleEn: 'Cluster PMO Governance, KYC Verification, RBAC, Audit Logs & Executive AI Copilot',
    titleAr: 'لوحة حوكمة وإدارة التجمع الصناعي (PMO): اعتماد المصانع، التوثيق KYC، سجلات التدقيق، ومساعد الإدارة الذكي',
    subtitleEn: 'Complete administrative control over factories, users, KYC documents, marketplaces, settings & CSV exports',
    subtitleAr: 'تحكم إداري كامل في اعتماد المصانع، وصلاحيات المستخدمين، وفحص مستندات KYC، وسجل التدقيق المشفر، وتصدير التقارير',
    whatIsThisEn:
      'The sovereign administrative and Project Management Office (PMO) suite for Cluster Management, TIGARA/UNIDO officers, and Ministry of Industry administrators.',
    whatIsThisAr:
      'منظومة الحوكمة والإدارة التنفيذية المخصصة لمكتب إدارة التجمع الصناعي (PMO) ومسؤولي مشروع تجارة واليونيدو ووزارة الصناعة.',
    howItWorksEn:
      'Comprises 8 specialized governance consoles: (1) Executive Analytics Dashboard (`admin`), (2) Factories Approval Queue (`admin/factories`), (3) Users & 5-Role RBAC Management (`admin/users`), (4) IDA/GOEIC KYC Document Verification (`admin/kyc`), (5) Marketplace & EU DPP Moderation (`admin/marketplaces`), (6) Immutable Cryptographic Audit Logs (`admin/audit-logs`), (7) Global Platform & Escrow Settings (`admin/settings`), and (8) PMO Executive AI Copilot (`admin/ai`).',
    howItWorksAr:
      'تتكون من 8 وحدات حوكمة متكاملة: لوحة المؤشرات التنفيذية، اعتماد المصانع، إدارة المستخدمين والأدوار الخمسة (RBAC)، فحص واعتماد مستندات التوثيق (KYC)، مراقبة الأسواق وجوازات المنتجات، سجل التدقيق المشفر غير القابل للتعديل، إعدادات المنصة والضمان المالي، والمساعد الذكي لإدارة التجمع.',
    whyToUseEn: [
      'Enforce strict KYC verification (Industrial Register, Tax Card, Commercial Register) before granting factories the Verified Shield.',
      'Every administrative action (`Factory Approval`, `KYC Verification`, `Role Change`, `Settings Update`) is permanently logged in the Audit Trail.',
      '1-click UTF-8 BOM CSV exports (`/api/admin/export`) for users, factories, RFQs, contracts, and audit logs (opens cleanly in Arabic Microsoft Excel).',
    ],
    whyToUseAr: [
      'ضمان الموثوقية الكاملة عبر فحص السجل الصناعي والبطاقة الضريبية قبل منح شارة التوثيق للمصانع.',
      'تسجيل كل إجراء إداري في سجل تدقيق غير قابل للحذف أو التلاعب (Audit Trail).',
      'تصدير تقارير Excel/CSV تدعم اللغة العربية بالكامل (UTF-8 BOM) للمستخدمين والمصانع والمناقصات والعقود.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Review Pending Factory & KYC Queues (Factories / KYC Tabs)',
        titleAr: '١. راجع طلبات انضمام المصانع ومستندات التوثيق المعلقة (قسم المصانع / KYC)',
        detailEn: 'Inspect uploaded documents and click Approve / Verify or Reject with an audit reason.',
        detailAr: 'افحص المستندات المرفوعة واضغط اعتماد أو رفض مع تسجيل السبب.',
      },
      {
        titleEn: '2. Monitor Immutable Audit Logs & Export M&E Reports (CSV)',
        titleAr: '٢. راقب سجل التدقيق الأمني وصدّر تقارير المتابعة والتقييم (CSV)',
        detailEn: 'Filter audit logs by entity type and download UTF-8 CSV spreadsheets for donor reporting.',
        detailAr: 'صفّ السجلات حسب نوع العملية وحمّل ملفات CSV الجاهزة لبرنامج إكسل.',
      },
      {
        titleEn: '3. Consult the PMO Executive AI Copilot (`/[locale]/admin/ai`)',
        titleAr: '٣. استشر المساعد الذكي لإدارة التجمع (`/[locale]/admin/ai`)',
        detailEn: 'Click any 1-click executive audit query pill to analyze cluster bottlenecks and policy priorities.',
        detailAr: 'اضغط على أي زر من الاستعلامات التنفيذية الجاهزة لتحليل مؤشرات التجمع وأولويات الدعم.',
      },
    ],
    proTipEn: 'All CSV exports from `/api/admin/export` include a UTF-8 Byte-Order Mark (`\\uFEFF`) so Arabic factory names and columns open with zero encoding garble in Microsoft Excel!',
    proTipAr: 'جميع ملفات CSV المصدرة من لوحة الإدارة مزودة بترميز (UTF-8 BOM) لتفتح الأسماء والبيانات العربية بشكل سليم تماماً داخل برنامج Microsoft Excel!',
  },

  // ============================================================================
  // 8. GRANULAR INNER PILLARS, STUDIO TABS & POCKET CALCULATORS
  // ============================================================================
  'lean-jidoka-fmea': {
    id: 'lean-jidoka-fmea',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 6 • Jidoka & FMEA',
    badgeAr: 'ركيزة اللين ٦ • جيدوكا و FMEA',
    titleEn: 'Jidoka Andon Cord, Poka-Yoke Mistake-Proofing & FMEA RPN Matrix',
    titleAr: 'نظام أندون (Jidoka)، منع الأخطاء (Poka-Yoke) ومصفوفة تحليل المخاطر (FMEA RPN)',
    subtitleEn: 'Autonomation, zero-defect poka-yoke sensors & Risk Priority Number (RPN = S × O × D) scoring',
    subtitleAr: 'الإيقاف الذاتي عند الخلل، حساسات منع الخطأ من المنبع، وحساب رقم أولوية المخاطر (RPN = الشدة × التكرار × الاكتشاف)',
    whatIsThisEn:
      'An integrated Toyota Jidoka (Autonomation with a Human Touch) and Failure Mode & Effects Analysis (FMEA) workbench designed to stop defects at the source before an entire warp beam, dye lot, or sewing bundle is ruined.',
    whatIsThisAr:
      'منظومة متكاملة لتطبيق ركيزة «جيدوكا» (الجودة المدمجة في العملية والإيقاف الفوري عند اكتشاف خلل) مع مصفوفة تحليل أنماط الفشل وآثارها (FMEA) لمنع إنتاج العيوب من المنبع قبل تلف تشغيلة كاملة.',
    howItWorksEn:
      'Scores each potential failure mode across Severity (S: 1–10), Occurrence (O: 1–10), and Detection (D: 1–10) to compute RPN = S × O × D, triggers live Andon cord escalation states, and prescribes mechanical/optical Poka-Yoke devices.',
    howItWorksAr:
      'تقوم بتقييم كل نمط فشل محتمل عبر 3 أبعاد: الشدة (S من 1 إلى 10)، احتمالية الحدوث (O من 1 إلى 10)، وصعوبة الاكتشاف (D من 1 إلى 10) لحساب مؤشر الخطورة RPN = S × O × D وتحديد وسائل Poka-Yoke الهندسية.',
    formulaOrArchitecture: 'RPN = Severity (1..10) × Occurrence (1..10) × Detection (1..10)  |  Action Threshold: RPN ≥ 100',
    whyToUseEn: [
      'Prevents off-shade dye lots and warp streak defects from advancing to downstream cutting and sewing.',
      'Replaces subjective quality firefighting with quantitative RPN prioritization.',
      'Provides ready-to-install textile Poka-Yoke blueprints (optical weft stop motions, barcode dyestuff interlocks, needle guards).',
    ],
    whyToUseAr: [
      'منع انتقال الأقمشة المعيبة أو فروق الألوان إلى مراحل القص والحياكة اللاحقة.',
      'تحويل إدارة الجودة من رد الفعل العشوائي إلى ترتيب كمي دقيق للمخاطر حسب رقم RPN.',
      'توفير حلول Poka-Yoke جاهزة للتطبيق في الغزل والنسيج والصباغة والملابس.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Simulate Shop-Floor Andon States',
        titleAr: '١. حاكِ حالات لوحة الإنذار المرئي (Andon Cord)',
        detailEn: 'Toggle between Running Green, Yellow Team-Leader Assist, and Red Line-Stop to test escalation protocols.',
        detailAr: 'بدّل بين الحالة الخضراء والصفراء والحمراء لاختبار بروتوكول الاستجابة الفورية للأعطال.',
      },
      {
        titleEn: '2. Score FMEA Severity, Occurrence & Detection',
        titleAr: '٢. قيّم عناصر مصفوفة FMEA (الشدة × التكرار × الاكتشاف)',
        detailEn: 'Identify failure modes with RPN > 100 and assign Poka-Yoke Engineering Controls.',
        detailAr: 'رصد نقاط الفشل التي يتجاوز فيها مؤشر RPN حاجز 100 وتطبيق ضوابط المنع الهندسي.',
      },
    ],
    proTipEn: 'Lowering Detection (D) from 8 to 2 by installing an inline optical sensor or barcode interlock cuts your RPN by 75% overnight!',
    proTipAr: 'خفض معامل صعوبة الاكتشاف (D) من 8 إلى 2 عبر تركيب حساس ضوئي أو قارئ باركود للصبغات يخفض مؤشر المخاطر RPN بنسبة 75% فوراً!',
  },

  'lean-sqdc-daily': {
    id: 'lean-sqdc-daily',
    category: 'lean_excellence',
    badgeEn: 'Lean Pillar 8 • Daily Gemba SQDC',
    badgeAr: 'ركيزة اللين ٨ • لوحة SQDC اليومية',
    titleEn: 'SQDC Daily Gemba Tier Board & Leader Standard Work (LSW)',
    titleAr: 'لوحة الإدارة المرئية اليومية (SQDC) والعمل القياسي للقادة (Leader Standard Work)',
    subtitleEn: 'Safety • Quality • Delivery • Cost daily stand-up tracking & shift-leader Gemba routines',
    subtitleAr: 'متابعة مؤشرات السلامة (S) والجودة (Q) والتسليم (D) والتكلفة (C) وجدول الجيمبا اليومي للمشرفين',
    whatIsThisEn:
      'A digital shop-floor Tier-1 / Tier-2 visual management board tracking Safety, Quality, Delivery, and Cost (SQDC) targets alongside structured Leader Standard Work (LSW) checklists for shift supervisors and plant managers.',
    whatIsThisAr:
      'لوحة إدارة مرئية يومية لصالة الإنتاج تتابع 4 محاور رئيسية: السلامة (Safety)، الجودة (Quality)، الالتزام بالتسليم (Delivery)، والتكلفة (Cost)، مع قائمة المهام القياسية اليومية لمشرفي الورديات ومديري المصانع.',
    howItWorksEn:
      'Displays live RAG (Red/Amber/Green) status across S-Q-D-C metrics for morning 10-minute stand-up Gemba meetings and tracks completion of time-blocked Leader Standard Work audits.',
    howItWorksAr:
      'تعرض حالة المؤشرات الأربعة بالألوان (أخضر/أصفر/أحمر) لاجتماع الصباح اليومي (10 دقائق في صالة الإنتاج) وتوثق إنجاز المهام القياسية للمشرفين.',
    formulaOrArchitecture: 'SQDC Tier Meeting = 10 Min @ 08:00 AM  |  LSW Compliance % = (Completed Leader Checks / Scheduled Checks) × 100',
    whyToUseEn: [
      'Sustains Lean improvements so 5S, OEE, and SMED gains do not regress after initial workshops.',
      'Aligns shift supervisors, maintenance, and quality engineers around the same daily bottlenecks in 10 minutes.',
    ],
    whyToUseAr: [
      'ضمان استدامة تحسينات اللين (5S و OEE و SMED) ومنع تراجع الأداء بمرور الوقت.',
      'توحيد جهود مشرفي الإنتاج والصيانة والجودة يومياً خلال اجتماع مدته 10 دقائق فقط.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Review S-Q-D-C Targets vs. Actuals',
        titleAr: '١. راجع المستهدف مقابل الفعلي في مؤشرات SQDC الأربعة',
        detailEn: 'Flag any metric in Red/Amber and assign an immediate 24-hour countermeasure owner.',
        detailAr: 'حدد أي مؤشر باللون الأحمر أو الأصفر وعيّن مسؤولاً عن الإجراء التصحيحي خلال 24 ساعة.',
      },
      {
        titleEn: '2. Check Off Leader Standard Work (LSW) Tasks',
        titleAr: '٢. أشّر على مهام العمل القياسي للقادة (LSW) خلال الوردية',
        detailEn: 'Complete the scheduled Gemba walks, 5S spot-checks, and bottleneck hourly verifications.',
        detailAr: 'أكمل جولات الجيمبا المجدولة وفحوصات 5S ومراجعة إنتاجية خط العنق كل ساعة.',
      },
    ],
    proTipEn: 'Lean transformations fail without Leader Standard Work—make the 08:00 AM SQDC stand-up board non-negotiable!',
    proTipAr: 'استدامة اللين تعتمد بنسبة 80% على التزام القادة بجولة الجيمبا الصباحية أمام لوحة SQDC في تمام الثامنة صباحاً!',
  },

  'export-market-study': {
    id: 'export-market-study',
    category: 'export_trade',
    badgeEn: 'Export Pillar 1 • Market Study & FTAs',
    badgeAr: 'ركيزة التصدير ١ • دراسة السوق والاتفاقيات',
    titleEn: 'Global Market Study, HS Code Demand & Preferential FTA Tariff Analyzer',
    titleAr: 'دراسة السوق الدولية، حجم الطلب حسب البند الجمركي (HS Code) ومزايا الاتفاقيات التجارية',
    subtitleEn: 'Total import volume, 5-year CAGR, untapped Egyptian potential, competitor benchmarking & 0% FTA duty rules',
    subtitleAr: 'حجم الواردات السنوية، معدل النمو، الفرص غير المستغلة لمصر، تحليل الدول المنافسة، وشروط الإعفاء الجمركي 0%',
    whatIsThisEn:
      'An executive trade intelligence analyzer that computes target-country import demand, Egypt’s untapped export gap, competing supplier countries (Turkey, India, Pakistan, Portugal), and exact preferential customs tariffs under EUR.1, QIZ, AFCFTA, GAFTA, and MERCOSUR.',
    whatIsThisAr:
      'محرك دراسات سوقية وتصديرية يحلل حجم واردات الدولة المستهدفة، الفجوة التصديرية المتاحة لمصر، حصة الدول المنافسة، ونسبة الإعفاء الجمركي الدقيق بموجب اتفاقيات مصر التجارية.',
    howItWorksEn:
      'Cross-references 6-digit HS codes with destination tariff schedules and rules of origin (e.g., Double Transformation for EU EUR.1 vs. 35% value-added + 10.5% QIZ input for USA) to quantify your exact tariff margin over Asian competitors.',
    howItWorksAr:
      'يربط البند الجمركي (HS Code) بجدول التعريفة الجمركية للدولة المستهدفة وقواعد المنشأ (مثل قاعدة التحول المزدوج لأوروبا أو الكويز لأمريكا) لحساب ميزتك التنافسية السعرية.',
    formulaOrArchitecture: 'Tariff Advantage (%) = Competitor MFN Duty (%) − Egypt Preferential FTA Duty (%)',
    whyToUseEn: [
      'Identifies high-margin export markets where Egyptian textiles enjoy a 9.6% to 28% customs duty advantage.',
      'Prevents customs rejection by clarifying exact Origin Certificate (EUR.1 / QIZ / COMESA) rules before quoting.',
    ],
    whyToUseAr: [
      'اكتشاف الأسواق التي تتمتع فيها الصادرات المصرية بميزة إعفاء جمركي تتراوح بين 9.6% و28% مقارنة بالمنافسين.',
      'ضمان استيفاء قواعد شهادة المنشأ الصحيحة قبل تقديم عروض الأسعار للمستوردين.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Enter Your Product & Target Country at the Top',
        titleAr: '١. أدخل المنتج والدولة المستهدفة في شريط التوليد العلوي',
        detailEn: 'Or click any of the 12 quick country flags / 5 trade corridor presets.',
        detailAr: 'أو اختر أي دولة من أزرار الدول السريعة أو المسارات التصديرية الجاهزة.',
      },
      {
        titleEn: '2. Inspect Tariff Advantage & Competitor Matrix',
        titleAr: '٢. راجع مقارنة الجمارك ومصفوفة الدول المنافسة',
        detailEn: 'Use your preferential 0% duty advantage as the primary hook in buyer negotiations.',
        detailAr: 'استخدم ميزة الإعفاء الجمركي (0%) كورقة تفاوض رئيسية أمام المشتري الأجنبي.',
      },
    ],
    proTipEn: 'When quoting German, Italian, or French buyers on HS 6302 (bedding/towels), highlight that Egypt’s EUR.1 0% duty saves them 12% landed cost compared to Indian or Pakistani mills!',
    proTipAr: 'عند تسعير المفروشات والمناشف (HS 6302) لأوروبا، أبرز للمشتري أن شهادة EUR.1 المصرية توفر عليه 12% رسوماً جمركية مقارنة بالمورد الهندي أو الباكستاني!',
  },

  'export-entry-strategy': {
    id: 'export-entry-strategy',
    category: 'export_trade',
    badgeEn: 'Export Pillar 2 • Landed Cost & Entry',
    badgeAr: 'ركيزة التصدير ٢ • التسعير واستراتيجية الدخول',
    titleEn: 'Interactive Export Pricing Waterfall (FOB → CIF → Landed → Retail) & Entry Strategy',
    titleAr: 'حاسبة تسعير التصدير التفاعلية (FOB ← CIF ← تكلفة الوصول ← سعر التجزئة) واستراتيجية الدخول',
    subtitleEn: 'Real-time landed-cost simulator, FTA duty-savings calculator, distribution channels & positioning',
    subtitleAr: 'محاكاة حية لتكلفة البضاعة الواصلة للمستورد، حساب الوفر الجمركي للصفقة، واختيار قنوات التوزيع',
    whatIsThisEn:
      'An interactive export pricing and market-entry simulator that models every cost layer from FOB Alexandria/Damietta to CIF port of arrival, customs clearance, importer wholesale markup, and final retail shelf price.',
    whatIsThisAr:
      'حاسبة تسعير تصديري ومخطط دخول أسواق يحسب كل طبقة تكلفة بدءاً من سعر التسليم على ظهر السفينة (FOB الإسكندرية/دمياط) مروراً بالشحن والتأمين (CIF) والجمارك وهامش الموزع وحتى سعر البيع النهائي للمستهلك.',
    howItWorksEn:
      'Lets you adjust FOB unit price, order quantity, freight %, customs duty %, and importer margin via interactive sliders and calculates total order value and net FTA duty savings in USD.',
    howItWorksAr:
      'يتيح لك تعديل سعر الوحدة (FOB) والكمية ونسبة الشحن والجمارك وهامش المستورد تفاعلياً، ليحسب فوراً إجمالي قيمة العقد وصافي الوفر الجمركي للمشتري بالدولار.',
    formulaOrArchitecture: 'Landed Unit Cost = FOB × (1 + Freight%) × (1 + Duty%)  |  FTA Savings = (MFN Landed − Egypt FTA Landed) × Order Qty',
    whyToUseEn: [
      'Allows export managers to defend their FOB price by proving the buyer’s final landed cost is still lower than Asian competitors.',
      'Defines the optimal distribution channel (Direct Retail Private Label vs. Hospitality Distributor vs. Industrial Converter).',
    ],
    whyToUseAr: [
      'تمكين مدير التصدير من الدفاع عن سعره (FOB) عبر إثبات أن التكلفة النهائية الواصلة للمشتري أقل من المنافسين.',
      'تحديد قناة الدخول الأنسب (تصنيع للعلامات الخاصة Private Label، موزعي الفنادق، أو مستوردي الغزول والأقمشة).',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Adjust FOB Price, Order Quantity & Freight Sliders',
        titleAr: '١. عدّل سعر الوحدة (FOB) والكمية ونسبة الشحن في الحاسبة',
        detailEn: 'Watch the CIF, Landed Cost, Wholesale, and Retail prices update instantaneously.',
        detailAr: 'شاهد تحديث أسعار CIF والتكلفة الواصلة وسعر الجملة والتجزئة لحظياً.',
      },
      {
        titleEn: '2. Follow the Recommended Entry Channel & Payment Terms',
        titleAr: '٢. راجع توصيات قنوات التوزيع وشروط الدفع الآمنة',
        detailEn: 'Check recommended Incoterms 2020 and payment structures (Confirmed L/C, CAD, or Export Credit Insurance).',
        detailAr: 'اعتمد شروط الشحن والدفع الموصى بها (اعتماد مستندي معزز أو ضد المستندات مع تأمين صادرات).',
      },
    ],
    proTipEn: 'Always quote both FOB Alexandria and CIF Destination Port so the buyer sees how fast (6–12 days to Europe) and economical Egyptian sea freight is!',
    proTipAr: 'قدّم دائماً عرض السعر شاملاً خيارَي (FOB الإسكندرية) و(CIF ميناء الوصول) ليلمس المشتري سرعة الشحن البحري المصري (6–12 يوماً لأوروبا) وانخفاض تكلفته!',
  },

  'export-tenders': {
    id: 'export-tenders',
    category: 'export_trade',
    badgeEn: 'Export Pillar 3 • International Tenders',
    badgeAr: 'ركيزة التصدير ٣ • المناقصات الدولية',
    titleEn: 'Live International Textile Tenders, RFQs & Technical Bid Proposal Generator',
    titleAr: 'المناقصات الدولية والعطاءات الحكومية والفندقية ومولد العروض الفنية والمالية',
    subtitleEn: 'Hospitality, healthcare, workwear & retail sourcing tenders + 1-click Technical Bid Dossier generator',
    subtitleAr: 'مناقصات توريد الفنادق والمستشفيات والملابس المهنية وسلاسل التجزئة + توليد عرض فني ومالي فوري',
    whatIsThisEn:
      'A curated international procurement and tender radar for textile, home-linen, medical scrub, uniform, and yarn contracts, complete with an instant Technical & Commercial Bid Generator.',
    whatIsThisAr:
      'رادار للمناقصات والعطاءات الدولية في قطاعات المفروشات الفندقية، الزي الطبي، ملابس العمل، والغزول والأقمشة، مزود بمولد فوري لخطاب العرض الفني والمالي.',
    howItWorksEn:
      'Lists active public and private tenders (EU TED, UNGM, GCC NUPCO/Hospitality, US Hospitality Groups) with technical specs, volume, deadline, and eligibility, and synthesizes a customized bid letter when you click "Generate Technical Bid".',
    howItWorksAr:
      'يعرض المناقصات الدولية المتاحة مع الكميات والمواصفات الفنية وتاريخ الإغلاق، وعند النقر على «توليد العرض الفني للمناقصة» يقوم بصياغة مسودة عرض رسمي متكامل جاهز للنسخ والإرسال.',
    formulaOrArchitecture: 'Bid Readiness = Technical Spec Match + ISO/OEKO-TEX Certs + Bid Bond (1–5%) + Delivery Lead-Time Fit',
    whyToUseEn: [
      'Opens high-volume institutional contracts (hospitality chains, ministries of health, industrial uniforms) with predictable repeat orders.',
      'Allows smaller Mahalla factories to bid jointly by forming an Export Consortium (`/[locale]/cluster/consortia`).',
    ],
    whyToUseAr: [
      'فتح أبواب عقود التوريد المؤسسية الكبرى (سلاسل الفنادق، المستشفيات، الملابس المهنية) ذات الطلبيات المتكررة.',
      'تمكين المصانع المتوسطة من التقدم للمناقصات الضخمة عبر تشكيل تحالف تصديري مشترك.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Inspect Open Tenders & Technical Requirements',
        titleAr: '١. استعرض المناقصات المفتوحة والمواصفات الفنية المطلوبة',
        detailEn: 'Check GSM, yarn count, colorfastness, and required certifications for each tender.',
        detailAr: 'راجع وزن القماش GSM ونمرة الخيط وشهادات الجودة المطلوبة في كراسة الشروط.',
      },
      {
        titleEn: '2. Click "Generate Technical Bid Proposal"',
        titleAr: '٢. اضغط على «توليد العرض الفني والمالي للمناقصة»',
        detailEn: 'Enter your company name and lead time in weeks, then copy the complete formal bid proposal.',
        detailAr: 'أدخل اسم مصنعك وزمن التوريد بالأسابيع ثم انسخ خطاب العرض الفني والمالي الجاهز.',
      },
    ],
    proTipEn: 'If a tender volume exceeds your single-mill monthly capacity, click "Form Export Consortium" to split the order across 2–3 verified Mahalla mills!',
    proTipAr: 'إذا كانت كمية المناقصة أكبر من طاقة مصنعك بمفرده، شكّل «تحالفاً تصديرياً» مع مصنعين آخرين بالتجمع لتنفيذ الطلبية معاً!',
  },

  'export-promotion': {
    id: 'export-promotion',
    category: 'export_trade',
    badgeEn: 'Export Pillar 4 • Promotion & Trade Fairs',
    badgeAr: 'ركيزة التصدير ٤ • خطة الترويج والمعارض',
    titleEn: '90-Day Export Promotional Roadmap, Global Trade Fairs & Sample Kit Engineering',
    titleAr: 'خطة الترويج التصديري (90 يوماً)، المعارض الدولية المتخصصة وهندسة صندوق العينات',
    subtitleEn: 'Heimtextil, Première Vision, ITMA & Techtextil calendars + physical swatch-box conversion strategy',
    subtitleAr: 'خارطة المعارض العالمية (Heimtextil, Première Vision, ITMA) + مواصفات حقيبة العينات القابلة لإبرام العقود',
    whatIsThisEn:
      'A structured 90-day B2B export marketing and trade-show playbook detailing target international exhibitions, digital ABM funnel tactics, and physical Swatch Box engineering.',
    whatIsThisAr:
      'خطة تنفيذية للترويج التصديري لمدة 90 يوماً تشمل أهم المعارض الدولية المتخصصة، استراتيجيات التسويق الرقمي الموجه للمشترين (B2B ABM)، والمواصفات القياسية لصندوق العينات التصديري.',
    howItWorksEn:
      'Matches your product category and destination region to the highest-ROI global trade shows, prescribes pre-show, at-show, and post-show buyer capture workflows, and lists exact swatch hanger specifications.',
    howItWorksAr:
      'تربط منتجك والسوق المستهدف بأهم المعارض العالمية ذات العائد الأعلى، وتحدد خطوات استقطاب المشترين قبل وأثناء وبعد المعرض، ومحتويات صندوق العينات.',
    formulaOrArchitecture: 'Trade-Show ROI = (Booked Pre-Show Meetings × Sample Kit Conversion % × Avg Container LTV) / Booth Cost',
    whyToUseEn: [
      'Transforms expensive trade-fair participation into booked buyer meetings scheduled 4 weeks before the exhibition opens.',
      'Standardizes your physical swatch kit with QR Digital Product Passports and ISO 17025 lab test strips.',
    ],
    whyToUseAr: [
      'تحويل المشاركة في المعارض الدولية إلى اجتماعات محجوزة مسبقاً مع مديري المشتريات قبل السفر بأربعة أسابيع.',
      'تجهيز حقيبة عينات احترافية مزودة برمز QR لجواز المنتج الرقمي وتقرير معمل ISO 17025.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Review Priority Trade Fairs & Subsidies',
        titleAr: '١. راجع قائمة المعارض الدولية الموصى بها لمنتجك',
        detailEn: 'Note exhibition dates, locations, and Egyptian Export Council / TIGARA pavilion opportunities.',
        detailAr: 'تعرف على مواعيد المعارض وفرص الاشتراك في الجناح المصري المدعوم.',
      },
      {
        titleEn: '2. Build the Prescribed Physical Swatch Kit',
        titleAr: '٢. جهّز صندوق العينات القياسي (Swatch Kit) وفق القائمة المحددة',
        detailEn: 'Include 20×20 cm fabric headers, shade cards, wash-tested swatches, and FOB/CIF price sheets.',
        detailAr: 'ضمّن عينات مقاس 20×20 سم، كارتة الألوان، عينة بعد الغسيل، وقائمة الأسعار حسب الكميات.',
      },
    ],
    proTipEn: 'Never attend Heimtextil or Première Vision without booking at least 15 buyer appointments in advance using Tab 5 (Trusted Buyers & Outreach)!',
    proTipAr: 'لا تسافر إلى أي معرض دولي قبل حجز 15 اجتماعاً على الأقل مسبقاً مع المشترين باستخدام التبويب الخامس (المشترون الموثوقون والتواصل)!',
  },

  'export-buyers': {
    id: 'export-buyers',
    category: 'export_trade',
    badgeEn: 'Export Pillar 5 • Buyers & 5-Stage Outreach',
    badgeAr: 'ركيزة التصدير ٥ • المشترون والتواصل الذكي',
    titleEn: 'Verified International Buyers Directory, 5-Stage Outreach Sequence & Proforma Invoice Studio',
    titleAr: 'دليل المشترين الدوليين الموثوقين، منظومة المراسلات من 5 مراحل، ومولد الفاتورة المبدئية',
    subtitleEn: 'Vetted importers, B2B outreach templates (Cold Email, LinkedIn, WhatsApp, Swatch Follow-up) + AI Negotiation Copilot',
    subtitleAr: 'قوائم مستوردين محققين، رسائل استهداف احترافية عبر 5 مراحل، فاتورة مبدئية (PI)، ومساعد تفاوض ذكي',
    whatIsThisEn:
      'An end-to-end B2B buyer acquisition studio combining verified international textile buyers with a 5-stage outreach sequence generator, an instant Proforma Invoice (PI) builder, and an AI Buyer Objection & Negotiation Copilot.',
    whatIsThisAr:
      'استوديو متكامل لاستقطاب المشترين الدوليين يجمع بين بيانات المستوردين الموثقين، ومولد رسائل التواصل عبر 5 مراحل (بريد إلكتروني، لينكدإن، واتساب، متابعة العينات)، ومولد الفاتورة المبدئية (Proforma Invoice)، ومساعد التفاوض الذكي.',
    howItWorksEn:
      'Select any verified buyer profile to auto-populate personalized English or Arabic outreach messages referencing their exact sourcing category, HS code, and Egypt’s FTA tariff advantage, or generate a printable Proforma Invoice.',
    howItWorksAr:
      'اختر أي مشتري من القائمة ليقوم النظام تلقائياً بتخصيص رسائل التواصل (بالإسبانية/الإنجليزية/العربية) شاملة البند الجمركي وميزة الإعفاء الجمركي، مع إمكانية إصدار فاتورة مبدئية (PI) فوراً.',
    formulaOrArchitecture: '5-Stage B2B Funnel: 1. Executive Hook → 2. LinkedIn Connect → 3. DHL Swatch Dispatch → 4. Lab-Dip Tech Review → 5. Trial Order PI',
    whyToUseEn: [
      'Eliminates generic cold emails by referencing concrete landed-cost savings, OEKO-TEX/ZDHC compliance, and 5-day DHL swatch dispatch.',
      'Handles tough buyer objections (price, MOQ, lead time, payment terms) via the built-in AI Negotiation Copilot.',
    ],
    whyToUseAr: [
      'القضاء على رسائل التسويق العشوائية واستبدالها بمراسلات هندسية وتجارية دقيقة تقنع مدير المشتريات الدولي.',
      'الرد الاحترافي الفوري على اعتراضات المشتري (السعر، الحد الأدنى للطلب MOQ، شروط الدفع) عبر مساعد التفاوض الذكي.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Select a Verified Buyer Card & Customize Your Sender Info',
        titleAr: '١. اختر المشتري من القائمة وأدخل اسمك واسم مصنعك',
        detailEn: 'Filter or search buyers by tier and click any buyer card to load their profile.',
        detailAr: 'ابحث في قائمة المشترين واضغط على بطاقة المشتري لتحميل بياناته كاملة.',
      },
      {
        titleEn: '2. Copy the 5-Stage Outreach Sequence or Generate a Proforma Invoice',
        titleAr: '٢. انسخ رسائل المراحل الخمس أو أصدر فاتورة مبدئية (Proforma Invoice)',
        detailEn: 'Switch between Stage 1 to Stage 5, copy the tailored message, or click "Generate Proforma Invoice".',
        detailAr: 'تنقل بين المراحل الـ 5 لنسخ الرسالة المناسبة، أو اضغط على زر إصدار الفاتورة المبدئية.',
      },
    ],
    proTipEn: 'Stage 3 (The 5-Day DHL Physical Swatch Box Follow-Up) has the highest reply rate (38%+) among European and GCC textile sourcing directors!',
    proTipAr: 'المرحلة الثالثة (متابعة إرسال صندوق العينات الفعلي عبر DHL) تحقق أعلى معدل استجابة (أكثر من 38%) لدى مديري المشتريات في أوروبا والخليج!',
  },

  'export-ntm': {
    id: 'export-ntm',
    category: 'export_trade',
    badgeEn: 'Export Pillar 6 • NTM Standards & Labs',
    badgeAr: 'ركيزة التصدير ٦ • المواصفات القياسية و NTM',
    titleEn: 'Country Non-Tariff Measures (NTM), Technical Regulations, Accredited Labs & Document Checklist',
    titleAr: 'المواصفات القياسية الإلزامية والعوائق غير الجمركية (NTM) والمعامل المعتمدة وقائمة مستندات الشحن',
    subtitleEn: 'EU REACH/ESPR/CBAM, Saudi SABER/SASO, US CPSIA/UFLPA, ISO/AATCC physical tests & export readiness score',
    subtitleAr: 'متطلبات REACH و ESPR الأوروبية، منصة سابر السعودية، اختبارات ISO/AATCC الفيزيائية، ومؤشر جاهزية الشحن',
    whatIsThisEn:
      'A regulatory compliance and Non-Tariff Measure (NTM) analyzer detailing every mandatory law, buyer sustainability mandate, physical/chemical lab test threshold, accredited Egyptian testing body, and shipping document required by the destination customs authority.',
    whatIsThisAr:
      'محلل للمواصفات القياسية والعوائق غير الجمركية (NTMs) يفصّل كافة القوانين الإلزامية، متطلبات الاستدامة الخاصة بالمشترين، حدود الاختبارات الفيزيائية والكيميائية (ISO / AATCC)، المعامل المعتمدة في مصر، ومستندات التخليص الجمركي.',
    howItWorksEn:
      'Classifies each NTM by UNCTAD code (SPS / TBT / Pre-Shipment Inspection) and legal status (Mandatory Law vs. Buyer Mandate), lists exact pass/fail thresholds (e.g., pH 4.0–7.5, Formaldehyde < 75 ppm, Shrinkage ≤ ±3%), and calculates your live Export Document Readiness % as you check off documents.',
    howItWorksAr:
      'يصنف كل إجراء حسب كود الأونكتاد (TBT / فحص ما قبل الشحن) ودرجة الإلزام، ويعرض الحدود الرقمية للقبول والرفض في الفحوصات المعملية، ويحسب نسبة جاهزية مستندات الشحنة تفاعلياً.',
    formulaOrArchitecture: 'Export Clearance Readiness (%) = (Verified Compliance Documents / Total Mandatory Destination Docs) × 100',
    whyToUseEn: [
      'Prevents costly customs holds, container demurrages, or rejected shipments at European, Saudi (SABER), or US ports.',
      'Connects you directly to accredited testing labs in Egypt (EOS, Hohenstein Cairo, SGS, Intertek, Mahalla TIGARA Lab).',
    ],
    whyToUseAr: [
      'حماية الشحنات التصديرية من التوقف الجمركي أو الغرامات أو الرفض في موانئ أوروبا والسعودية وأمريكا.',
      'ربط المصنع مباشرة بجهات الفحص والاعتماد المعترف بها دولياً داخل مصر.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Filter NTMs by Mandatory Law vs. Buyer Mandate',
        titleAr: '١. استعرض العوائق غير الجمركية وصنفها (قانون إلزامي / شرط مشتري)',
        detailEn: 'Verify the exact limit values and accredited testing bodies for each regulation.',
        detailAr: 'تحقق من الحدود القصوى المسموح بها والجهات المانحة للشهادات لكل معيار.',
      },
      {
        titleEn: '2. Complete the Interactive Pre-Shipment Document Checklist',
        titleAr: '٢. أكمل قائمة فحص مستندات الشحن التفاعلية للوصول إلى جاهزية 100%',
        detailEn: 'Check off EUR.1/Origin, Commercial Invoice, Packing List, Lab Report, and DPP QR.',
        detailAr: 'أشّر على المستندات المكتملة لمتابعة مؤشر الجاهزية الجمركية قبل شحن الحاوية.',
      },
    ],
    proTipEn: 'For Saudi Arabia exports, always register the product on the SABER platform and issue the PCoC + SCoC certificates BEFORE the vessel departs Alexandria/Sokhna!',
    proTipAr: 'عند التصدير للسعودية، يجب دائماً تسجيل المنتج على منصة «سابر» وإصدار شهادتَي المطابقة (PCoC و SCoC) قبل إبحار السفينة من الميناء المصري!',
  },

  'brand-identity-logo': {
    id: 'brand-identity-logo',
    category: 'ai_academy',
    badgeEn: 'Brand Studio Tab 1 • Identity & SVG Logo',
    badgeAr: 'تبويب الهوية ١ • الشعار والألوان البانتون',
    titleEn: 'AI Brand Identity, Pantone® TCX Color System & Vector SVG Logo Architect',
    titleAr: 'معماري الهوية البصرية، نظام ألوان بانتون للنسيج (Pantone® TCX) ومولد الشعارات المتجهة (SVG)',
    subtitleEn: 'Bilingual brand names, positioning story, 4 emblem geometries, 5 Pantone TCX swatches & instant SVG download',
    subtitleAr: 'توليد الاسم التجاري والشعار اللفظي، القصة التسويقية، ٤ أشكال هندسية للشعار، و٥ ألوان بانتون قابلة للتحميل',
    whatIsThisEn:
      'A specialized textile brand identity and vector logo studio that generates bilingual brand names, taglines, heritage positioning narratives, 5 Pantone® Fashion, Home + Interiors (TCX) dye swatches, and downloadable vector `.SVG` logos.',
    whatIsThisAr:
      'استوديو متخصص لتصميم الهوية البصرية لعلامات الغزل والنسيج والملابس يولّد الاسم التجاري (عربي/إنجليزي)، الشعار اللفظي، القصة التسويقية، 5 ألوان قياسية بنظام Pantone® TCX، وشعارات متجهة قابلة للتحميل بصيغة SVG.',
    howItWorksEn:
      'Synthesizes geometric textile emblems (Royal Crest, Loom Diamond, Cotton Crown, Hex Tech) with customizable color palettes and exports clean XML `.svg` files ready for woven jacquard labels, hangtags, and carton stencils.',
    howItWorksAr:
      'يقوم بتوليد الشعارات الهندسية بأربعة أنماط بصرية مع لوحة ألوان متناسقة، ويصدّر ملفات SVG نقية جاهزة لماكينات نسيج التيكيت الجاكار والمطبوعات.',
    formulaOrArchitecture: 'Vector SVG Output (1200×520 px) + 5 Pantone® TCX Hex/Dye Codes + Typography Pairing',
    whyToUseEn: [
      'Allows Egyptian OEM mills to launch their own high-margin private-label brands for European and GCC retail.',
      'Provides exact Pantone TCX codes so the dyehouse can match brand colors on physical fabric headers.',
    ],
    whyToUseAr: [
      'تمكين مصانع المحلة من الانتقال من التصنيع للغير فقط (OEM) إلى امتلاك علامات تجارية خاصة عالية الربحية.',
      'توفير أكواد ألوان Pantone TCX الدقيقة لربط الهوية البصرية بوصفات الصباغة الفعلية.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Switch Between the 4 Emblem Geometries',
        titleAr: '١. بدّل بين الأشكال الهندسية الأربعة للشعار لاختيار الأنسب',
        detailEn: 'Test Crest, Loom Diamond, Cotton Crown, and Hex Tech styles.',
        detailAr: 'جرّب أنماط الدرع الملكي، ماسة النول، تاج القطن، والشكل السداسي التقني.',
      },
      {
        titleEn: '2. Click "Export SVG Logo" & Copy Hex/TCX Codes',
        titleAr: '٢. اضغط «تحميل الشعار SVG» وانسخ أكواد الألوان',
        detailEn: 'Download the crisp vector logo file and copy any Pantone swatch code with one click.',
        detailAr: 'حمّل ملف الشعار المتجه وانسخ أكواد الألوان لاستخدامها في التيكيت والتغليف.',
      },
    ],
    proTipEn: 'Vector `.SVG` logos scale infinitely without pixelation—send the downloaded SVG directly to your woven label loom or carton printer!',
    proTipAr: 'ملفات الشعار بصيغة (SVG) تحتفظ بدقتها مهما تم تكبيرها—يمكنك إرسالها مباشرة لمطبعة الكرتون أو ماكينة نسيج التيكيت!',
  },

  'brand-strategy-roas': {
    id: 'brand-strategy-roas',
    category: 'ai_academy',
    badgeEn: 'Brand Studio Tab 2 • 360° Strategy & ROAS',
    badgeAr: 'تبويب الهوية ٢ • الخطة التسويقية والعائد',
    titleEn: '360° Export Marketing Strategy, Channel Budget Allocation & ROAS Simulator',
    titleAr: 'الخطة التسويقية التصديرية الشاملة (360°)، توزيع الميزانية، ومحاكاة العائد على الإنفاق (ROAS)',
    subtitleEn: '90-day phased roadmap, LinkedIn ABM, trade-show & sample-kit budget split, and buyer persona cards',
    subtitleAr: 'خارطة طريق 90 يوماً، توزيع ميزانية التسويق عبر القنوات، وملفات المشترين المستهدفين',
    whatIsThisEn:
      'A comprehensive 90-day B2B/B2C textile marketing plan that defines target buyer personas, unique value propositions (UVPs), channel budget percentages, expected Return on Ad Spend (ROAS), and weekly execution milestones.',
    whatIsThisAr:
      'خطة تسويق تصديري متكاملة لمدة 90 يوماً تحدد شرائح المشترين المستهدفين، القيمة التنافسية المضافة، التوزيع الأمثل للميزانية التسويقية، والعائد المتوقع على الاستثمار (ROAS).',
    howItWorksEn:
      'Breaks down marketing investment across LinkedIn Account-Based Marketing (ABM), DHL Physical Swatch Kits, Trade-Show Digital Retargeting, and SEO Technical Catalogs with concrete KPIs.',
    howItWorksAr:
      'تقسم الميزانية التسويقية علمياً بين حملات لينكدإن الموجهة لمديري المشتريات، إرسال صناديق العينات، إعادة الاستهداف الرقمي لزوار المعارض، والكتالوجات الفنية.',
    formulaOrArchitecture: 'Projected Export ROAS = (Attributed Export Contract Value) / (ABM + Swatch Kit + Trade-Show Spend)',
    whyToUseEn: [
      'Prevents wasted ad spend on consumer channels when targeting high-ticket B2B wholesale textile buyers.',
      'Provides a week-by-week 90-day execution checklist for the factory export and marketing team.',
    ],
    whyToUseAr: [
      'حماية ميزانية المصنع من الهدر في إعلانات غير مستهدفة، والتركيز على قنوات استقطاب مستوردي الجملة.',
      'توفير جدول عمل تنفيذي واضح لمدة 90 يوماً لفريق التسويق والتصدير بالمصنع.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Review Buyer Personas & Channel Budget Split',
        titleAr: '١. راجع ملفات المشترين وتوزيع الميزانية على القنوات التسويقية',
        detailEn: 'Compare expected ROAS across LinkedIn ABM, Swatch Dispatch, and Trade Fairs.',
        detailAr: 'قارن العائد المتوقع لكل قناة تسويقية ومؤشرات الأداء المستهدفة.',
      },
      {
        titleEn: '2. Execute the 3-Phase 90-Day Roadmap',
        titleAr: '٢. نفّذ خارطة الطريق المقسمة إلى 3 مراحل (٣٠ / ٦٠ / ٩٠ يوماً)',
        detailEn: 'Follow Phase 1 (Foundation & Swatches), Phase 2 (Outreach), and Phase 3 (Closing).',
        detailAr: 'اتبع خطوات التأسيس وتجهيز العينات ثم الإطلاق والاستقطاب ثم إغلاق العقود.',
      },
    ],
    proTipEn: 'In B2B textile export, allocating 35% of your marketing budget to physical DHL Swatch Boxes sent to pre-qualified LinkedIn leads yields 4x higher conversion than digital ads alone!',
    proTipAr: 'في تصدير المنسوجات (B2B)، تخصيص 35% من ميزانية التسويق لإرسال صناديق عينات فعلية للعملاء المستهدفين عبر لينكدإن يحقق عائداً يفوق الإعلانات الرقمية بـ 4 أضعاف!',
  },

  'brand-automation-calendar': {
    id: 'brand-automation-calendar',
    category: 'ai_academy',
    badgeEn: 'Brand Studio Tab 3 • Automation & Calendar',
    badgeAr: 'تبويب الهوية ٣ • أتمتة الحملات والجدولة',
    titleEn: 'Omnichannel Campaign Automation Workflows & 30-Day Content Calendar',
    titleAr: 'مسارات أتمتة الحملات التسويقية متعددة القنوات وجدول النشر الشهري (30 يوماً)',
    subtitleEn: 'Interactive trigger-action workflow simulator (LinkedIn + Email + WhatsApp + CRM) & 1-click social publishing',
    subtitleAr: 'محاكي مسارات الأتمتة التفاعلي (لينكدإن + بريد + واتساب + CRM) وجدول محتوى جاهز للنشر',
    whatIsThisEn:
      'An interactive marketing automation engine and 30-day content calendar featuring multi-step trigger-action workflows and ready-to-publish bilingual posts with hashtags and visual prompts.',
    whatIsThisAr:
      'محرك أتمتة تسويقية وجدول نشر شهري يتضمن مسارات عمل تلقائية متعددة الخطوات ومنشورات جاهزة باللغتين العربية والإنجليزية مع الوسوم (Hashtags).',
    howItWorksEn:
      'Lets you toggle automation workflows on/off, run live step-by-step execution simulations, and copy or mark calendar posts as published across LinkedIn, Instagram, Email, and WhatsApp.',
    howItWorksAr:
      'يتيح لك تفعيل مسارات الأتمتة، وتشغيل محاكاة حية لخطوات المسار خطوة بخطوة، ونسخ منشورات الجدول الشهري أو اعتماد نشرها.',
    formulaOrArchitecture: 'Workflow Pipeline: Trigger Event → AI Personalization → Multi-Channel Dispatch → CRM Lead Scoring',
    whyToUseEn: [
      'Automates repetitive buyer follow-ups so no trade-fair visitor or RFQ inquiry slips through the cracks.',
      'Supplies a full month of technical and promotional social content without hiring an external agency.',
    ],
    whyToUseAr: [
      'أتمتة متابعة العملاء المحتملين وزوار المعارض لضمان عدم ضياع أي فرصة تصديرية.',
      'توفير محتوى تسويقي وهندسي احترافي جاهز للنشر طوال الشهر دون الحاجة لوكالة خارجية.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Click "Simulate Live Run" on Any Automation Workflow',
        titleAr: '١. اضغط «محاكاة التشغيل الحي» على أي مسار أتمتة',
        detailEn: 'Watch the trigger, delay, and omnichannel dispatch steps execute in sequence.',
        detailAr: 'تابع تنفيذ خطوات المسار التسويقي من لحظة التقاط العميل حتى حجز الاجتماع.',
      },
      {
        titleEn: '2. Copy & Publish Posts from the Content Calendar',
        titleAr: '٢. انسخ المنشورات الجاهزة من جدول المحتوى واعتمد نشرها',
        detailEn: 'Copy caption + hashtags and click "Publish Now" to track campaign completion.',
        detailAr: 'انسخ نص المنشور والهاشتاجات بضغطة واحدة وحدد حالته كمنشور مكتمل.',
      },
    ],
    proTipEn: 'Pair Workflow #1 (EU Buyer Swatch Kit Funnel) with your QR Digital Product Passport link so you get notified the exact minute a buyer scans your fabric hanger!',
    proTipAr: 'اربط مسار الأتمتة الأول برابط رمز (QR) الخاص بجواز المنتج الرقمي لتعرف اللحظة التي يقوم فيها المشتري بفحص عينة القماش!',
  },

  'brand-media-studio': {
    id: 'brand-media-studio',
    category: 'ai_academy',
    badgeEn: 'Brand Studio Tab 4 • Video & Photo Studio',
    badgeAr: 'تبويب الهوية ٤ • استوديو الفيديو والصور',
    titleEn: '30-Second Promo Video Player (with Voiceover) & 4-Angle High-Res Photo Studio',
    titleAr: 'مشغل ومولد الفيديو الترويجي (30 ثانية بالتعليق الصوتي) واستوديو الصور الإعلانية عالية الدقة',
    subtitleEn: 'Multi-scene animated storyboard with TTS narration + 4 downloadable PNG product artboards (16:9, 1:1, 9:16)',
    subtitleAr: 'عرض فيديو إعلاني متعدد المشاهد بالصوت الحي + ٤ لوحات إعلانية قابلة للتحميل بصيغة PNG بمقاسات متعددة',
    whatIsThisEn:
      'A browser-native multimedia production studio that plays an animated multi-scene 30-second promotional video with synchronized voiceover narration and renders 4 high-resolution promotional photo artboards downloadable as PNGs.',
    whatIsThisAr:
      'استوديو إنتاج مرئي وصوتي يقوم بتشغيل فيديو ترويجي متعدد المشاهد مع تعليق صوتي متزامن، ويصمم 4 لوحات صور إعلانية احترافية قابلة للتحميل المباشر بصيغة PNG.',
    howItWorksEn:
      'Uses Web Speech API synthesis for bilingual voiceover playback across scenes and HTML5 Canvas rendering (`1600×900`, `1200×1200`, or `1080×1920`) to export crisp branded PNG visuals.',
    howItWorksAr:
      'يستخدم تقنية النطق الصوتي للمتصفح لقراءة التعليق الإعلاني لكل مشهد، ومحرك الرسم Canvas لتصدير صور PNG عالية الدقة بثلاثة أبعاد قياسية.',
    formulaOrArchitecture: '5-Scene Storyboard (30s) + HTML5 Canvas PNG Exporter (16:9 Landscape | 1:1 Square | 9:16 Vertical Reel)',
    whyToUseEn: [
      'Produces instant visual assets for LinkedIn posts, WhatsApp buyer catalogs, and trade-show booth screens.',
      'Provides exact lighting, camera lens, and art-direction prompts for studio shoots or AI image generators.',
    ],
    whyToUseAr: [
      'إنتاج مواد بصرية وفيديوهات ترويجية فورية لمنصات التواصل وكتالوجات واتساب وشاشات العرض بالمعارض.',
      'توفير توجيهات تصوير احترافية (الإضاءة، العدسة، التكوين) جاهزة للتنفيذ.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Click "Play Promo Video" to Preview the Animated Storyboard & Voiceover',
        titleAr: '١. اضغط «تشغيل الفيديو الترويجي» لمشاهدة المشاهد والاستماع للتعليق الصوتي',
        detailEn: 'Switch between scenes or toggle voice narration on/off.',
        detailAr: 'تنقل بين المشاهد الخمسة أو تحكم في تشغيل الصوت المصاحب.',
      },
      {
        titleEn: '2. Choose Aspect Ratio (16:9, 1:1, 9:16) & Download PNG Photos',
        titleAr: '٢. اختر مقاس الصورة (16:9 أو 1:1 أو 9:16) واضغط تحميل بصيغة PNG',
        detailEn: 'Click "Download PNG" on any of the 4 studio photo concepts.',
        detailAr: 'اضغط زر التحميل أسفل أي لوحة من اللوحات الإعلانية الأربع لحفظها على جهازك.',
      },
    ],
    proTipEn: 'Use the 16:9 aspect ratio for LinkedIn company updates and trade-portal banners, and 9:16 for WhatsApp Status and Instagram Reels!',
    proTipAr: 'استخدم مقاس (16:9) لمنشورات لينكدإن الرسمية، ومقاس (9:16 الطولي) لحالات واتساب مع المشترين وريلز إنستغرام!',
  },

  'brand-print-collateral': {
    id: 'brand-print-collateral',
    category: 'ai_academy',
    badgeEn: 'Brand Studio Tab 5 • Brochure, Flyer & Poster',
    badgeAr: 'تبويب الهوية ٥ • البروشور والفلاير والبوستر',
    titleEn: 'Print-Ready 6-Panel Trifold Brochure, A4 Sales Flyer & Trade-Show Roll-Up Poster Studio',
    titleAr: 'استوديو المطبوعات الجاهزة: بروشور ثلاثي الطي (6 أوجه)، فلاير مبيعات A4، وبوستر رول أب للمعارض',
    subtitleEn: 'Interactive live preview + 1-click export as high-res PNG or standalone printable HTML/PDF',
    subtitleAr: 'معاينة حية للمطبوعات + تحميل فوري كصورة PNG عالية الدقة أو ملف HTML/PDF جاهز للطباعة',
    whatIsThisEn:
      'A complete print-collateral layout engine that designs a 6-panel tri-fold corporate brochure, an A4 technical sales flyer, and an 85×200 cm trade-show exhibition roll-up banner with embedded QR codes and technical specification tables.',
    whatIsThisAr:
      'محرك تصميم مطبوعات متكامل ينشئ بروشور تعريفي ثلاثي الطي (6 صفحات)، فلاير عروض مبيعات ومواصفات فنية مقاس A4، وستاند رول أب للمعارض الدولية مقاس 85×200 سم.',
    howItWorksEn:
      'Populates all panels with your brand palette, ISO/OEKO-TEX badges, technical specs, and contact details, and exports either a high-resolution PNG artboard or a standalone print-ready HTML/PDF file.',
    howItWorksAr:
      'يدمج شعار علامتك وألوانها وجداول المواصفات الفنية وشارات الجودة تلقائياً في القوالب الثلاثة، ويتيح تحميلها كصورة عالية الدقة أو ملف طباعة مستقل.',
    formulaOrArchitecture: 'Tri-Fold Brochure (6 Panels) + A4 Spec Sheet Flyer + 85×200cm Trade-Show Roll-Up Banner',
    whyToUseEn: [
      'Equips your sales delegation with professional printed brochures and booth roll-up banners in minutes.',
      'Ensures technical buyers see exact yarn counts, GSM ranges, MOQs, and lead times on every handout.',
    ],
    whyToUseAr: [
      'تجهيز وفد المبيعات والتصدير بالمطبوعات التعريفية ولافتات الجناح (Roll-Up) خلال دقائق.',
      'إبراز المواصفات الهندسية الدقيقة (نمر الخيوط، الأوزان GSM، كميات الطلب MOQ، زمن التوريد) في كافة المطبوعات.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Switch Between 6-Panel Brochure, A4 Flyer & Roll-Up Poster',
        titleAr: '١. تنقل بين البروشور (6 أوجه) والفلاير (A4) وبوستر المعارض (Roll-Up)',
        detailEn: 'Select color themes (Dark Gold, Emerald Eco, Royal Blue) for the exhibition poster.',
        detailAr: 'اختر النمط اللوني المفضل لبوستر المعرض وراجع توزيع المحتوى.',
      },
      {
        titleEn: '2. Click "Download Print HTML/PDF" or "Download PNG"',
        titleAr: '٢. اضغط «تحميل ملف الطباعة HTML/PDF» أو «تحميل كصورة PNG»',
        detailEn: 'Open the downloaded file and press Ctrl+P to save as PDF or send to your print shop.',
        detailAr: 'افتح الملف المحمّل واضغط طباعة لحفظه كملف PDF قياسي جاهز للمطبعة.',
      },
    ],
    proTipEn: 'Always place your Roll-Up Poster at the front corner of your Heimtextil booth with the QR code at eye level (150 cm height) so passing buyers can scan your Digital Product Passport in 2 seconds!',
    proTipAr: 'ضع لافتة الرول أب في زاوية جناحك بالمعرض بحيث يكون رمز (QR) في مستوى النظر (ارتفاع 150 سم) ليتمكن المشترون المارون من مسحه بهواتفهم خلال ثانيتين!',
  },

  'brand-cmo-ai': {
    id: 'brand-cmo-ai',
    category: 'ai_academy',
    badgeEn: 'Brand Studio Tab 6 • AI CMO Copywriter',
    badgeAr: 'تبويب الهوية ٦ • المساعد التسويقي الذكي',
    titleEn: 'AI Chief Marketing Officer (CMO) Copywriter & B2B Export Campaign Consultant',
    titleAr: 'المستشار التسويقي الذكي (AI CMO) وكاتب المحتوى التصديري المخصص',
    subtitleEn: 'Context-aware AI copywriter grounded in your generated brand identity, product specs & target market',
    subtitleAr: 'مساعد ذكاء اصطناعي مرتبط بهويتك التجارية ومنتجك لصياغة رسائل المبيعات والإعلانات والترجمة التسويقية',
    whatIsThisEn:
      'An interactive AI Chief Marketing Officer chat studio pre-loaded with your active brand name, positioning, product specs, and target export market to generate custom emails, press releases, exhibition invitations, and ad copy on demand.',
    whatIsThisAr:
      'استوديو محادثة ذكي يعمل كمدير تسويق تنفيذي (AI CMO) مزود تلقائياً ببيانات علامتك التجارية ومنتجك والسوق المستهدف لكتابة رسائل المبيعات والدعوات الرسمية للمعارض والنصوص الإعلانية.',
    howItWorksEn:
      'Injects your live `BrandMarketingKit` context into the multi-provider LLM router (`/api/chat`) and provides 1-click prompt chips for common export marketing deliverables.',
    howItWorksAr:
      'يقوم بتمرير كافة تفاصيل الهوية التجارية النشطة إلى محرك الذكاء الاصطناعي لتوليد نصوص مخصصة جاهزة للنسخ الفوري.',
    formulaOrArchitecture: 'Brand Context Injection + Multi-LLM Copywriting Engine → Tailored B2B Export Copy',
    whyToUseEn: [
      'Generates custom trade-show booth invitations, distributor pitch decks, and LinkedIn cold messages in seconds.',
      'Maintains 100% tone consistency with your selected brand archetype (Luxury Heritage, Eco Innovation, or Industrial B2B).',
    ],
    whyToUseAr: [
      'كتابة دعوات زيارة جناح المصنع في المعارض الدولية وعروض الوكلاء والموزعين في ثوانٍ.',
      'الحفاظ على نبرة تسويقية متسقة تماماً مع شخصية العلامة التجارية التي اخترتها.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Click a 1-Click CMO Prompt Pill or Type Your Custom Request',
        titleAr: '١. اختر أحد الطلبات السريعة الجاهزة أو اكتب طلبك التسويقي الخاص',
        detailEn: 'Ask for cold emails, exhibition invites, or landing page headlines.',
        detailAr: 'اطلب كتابة سلسلة بريد إلكتروني للمشترين أو دعوة رسمية لمعرض دولي.',
      },
      {
        titleEn: '2. Copy the Generated Copy Directly into Your Campaign',
        titleAr: '٢. انسخ النص المولّد بضغطة واحدة لاستخدامه في حملاتك',
        detailEn: 'Every response is tailored to your active brand name and product focus.',
        detailAr: 'تأتي كافة النصوص مخصصة باسم علامتك التجارية ومواصفات منتجك.',
      },
    ],
    proTipEn: 'Ask the AI CMO to translate your value proposition into German, Italian, or French when reaching out to boutique European home-textile buyers!',
    proTipAr: 'اطلب من المساعد التسويقي الذكي صياغة رسالة الاستهداف باللغة الألمانية أو الإيطالية أو الفرنسية عند مراسلة بيوت الأزياء والمفروشات الأوروبية!',
  },

  'gadget-persona-switcher': {
    id: 'gadget-persona-switcher',
    category: 'gadgets_calculators',
    badgeEn: 'Header Gadget • Workspace & Role Switcher',
    badgeAr: 'أداة الشريط العلوي • مبدّل بيئة العمل والأدوار',
    titleEn: 'Role & Demo Workspace Persona Switcher (Factory • Buyer • Expert • Worker • Admin)',
    titleAr: 'أداة التبديل الفوري بين بيئات العمل والأدوار (مصنع • مشتري دولي • خبير • مهندس • إدارة التجمع)',
    subtitleEn: '1-click role simulation and tailored workspace routing across all 5 stakeholder personas',
    subtitleAr: 'محاكاة فورية للأدوار الخمسة في المنصة مع توجيه ذكي للوحدات ولوحات التحكم الخاصة بكل دور',
    whatIsThisEn:
      'An integrated header utility gadget (`PersonaSwitcher.tsx`) that lets you switch between the 5 core platform personas (Factory Owner, International Buyer, Industrial Expert/Consultant, Mill Engineer/Worker, and Cluster Admin PMO) with 1 click.',
    whatIsThisAr:
      'أداة مدمجة في شريط التنقل العلوي تتيح لك التبديل الفوري بضغطة واحدة بين الأدوار الخمسة الرئيسية في المنصة (صاحب مصنع، مشتري دولي، خبير استشاري، مهندس/فني، وإدارة التجمع PMO).',
    howItWorksEn:
      'Persists your active persona via `/api/cluster/persona` and displays a curated list of recommended shortcuts and dashboards tailored specifically to that stakeholder role.',
    howItWorksAr:
      'تحفظ الدور النشط وتعرض قائمة مخصصة بأهم الروابط السريعة ولوحات التحكم والأدوات الهندسية المصممة لهذا الدور تحديداً.',
    formulaOrArchitecture: '5 Stakeholder Personas × Role-Specific Quick Launch Links + API Session Persistence',
    whyToUseEn: [
      'Allows evaluators, UNIDO/EU project officers, and factory teams to experience the platform from both the Factory and International Buyer perspectives.',
      'Provides instant 1-click navigation to the exact dashboard and tools relevant to your daily job.',
    ],
    whyToUseAr: [
      'تمكين مسؤولي المشروع والمصانع من تجربة المنصة من منظور المصنع العارض ومنظور المشتري الدولي أو مدير التجمع.',
      'الوصول السريع لأهم الأدوات ولوحات التحكم المرتبطة بطبيعة عملك اليومي.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Click the Persona Icon in the Top Navigation Bar',
        titleAr: '١. اضغط على أيقونة الدور الشخصي في شريط التنقل العلوي',
        detailEn: 'Open the dropdown panel to see all 5 available platform roles.',
        detailAr: 'افتح القائمة المنسدلة لاستعراض الأدوار الخمسة المتاحة في المنصة.',
      },
      {
        titleEn: '2. Select a Role & Click Any Recommended Shortcut',
        titleAr: '٢. اختر الدور المطلوب وانتقل مباشرة إلى أدواته المخصصة',
        detailEn: 'Switch between Factory Owner, Buyer, Expert, Worker, or Cluster Admin.',
        detailAr: 'بدّل بين صاحب المصنع أو المشتري أو الخبير واستعرض الروابط المقترحة.',
      },
    ],
    proTipEn: 'Switch to "Cluster Admin (PMO)" to inspect the macro Cluster Observatory and KYC verification queues, or "International Buyer" to test RFQ creation!',
    proTipAr: 'اختر دور «إدارة التجمع PMO» لاستعراض المرصد الكلي ولوحة التوثيق، أو دور «مشتري دولي» لتجربة طرح مناقصات الشراء (RFQs)!',
  },

  'gadget-yarn-gsm': {
    id: 'gadget-yarn-gsm',
    category: 'gadgets_calculators',
    badgeEn: 'Pocket Calculator • Yarn Count & GSM',
    badgeAr: 'حاسبة جيب هندسية • نمر الغزل ووزن القماش',
    titleEn: 'Pocket Yarn Count Converter (Ne / Nm / Tex / Denier) & Fabric GSM Roll Weight Calculator',
    titleAr: 'حاسبة تحويل نمر الخيوط (Ne / Nm / Tex / Denier) وحساب وزن رول القماش (GSM)',
    subtitleEn: 'Instant textile physics conversions inside the Ctrl+K Quick Tools Dock',
    subtitleAr: 'تحويل فوري لمعادلات الغزل والنسيج وحساب وزن الأتواب والأمتار الطولية',
    whatIsThisEn:
      'A real-time textile engineering calculator embedded inside the bottom-left Quick Tools Dock (`Ctrl+K`) that converts English Cotton Count (`Ne`) into Metric (`Nm`), `Tex`, and `Denier`, and computes total roll area ($m^2$), roll weight (kg), and grams per linear meter (`GLM`).',
    whatIsThisAr:
      'حاسبة هندسية فورية مدمجة داخل حقيبة المهندس السفلية (`Ctrl+K`) تقوم بتحويل نمرة الغزل القطني الإنجليزي (Ne) إلى النظام المتري (Nm) والتكس (Tex) والدينير (Denier)، وتحسب مساحة ووزن رول القماش بالكيلوجرام.',
    howItWorksEn:
      'Applies exact textile physical constants (`Tex = 590.5 / Ne`, `Denier = 5315 / Ne`, `Nm = 1.693 × Ne`) and fabric geometry (`Roll Weight kg = Width(m) × Length(m) × GSM / 1000`).',
    howItWorksAr:
      'تطبق الثوابت القياسية لفيزياء المنسوجات لتحويل النمر بدقة، وتحسب وزن الرول والوزن الطولي للمتر بناءً على العرض ووزن المتر المربع GSM.',
    formulaOrArchitecture: 'Tex = 590.5 / Ne  |  Denier = 5315 / Ne  |  Nm = 1.693 × Ne  |  Roll kg = (Width_m × Length_m × GSM) / 1000',
    whyToUseEn: [
      'Eliminates manual calculation errors when quoting yarn requirements or container packing weights.',
      'Accessible from any screen in 1 second via `Ctrl+K` without leaving your current form.',
    ],
    whyToUseAr: [
      'القضاء على أخطاء الحساب اليدوي عند تسعير الطلبيات أو حساب أوزان التعبئة والشحن.',
      'متاحة في أي لحظة ومن أي صفحة عبر اختصار (Ctrl+K) دون مغادرة شاشة عملك.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Open the Textile Toolkit (`Ctrl+K`) & Select Tab 2',
        titleAr: '١. افتح حقيبة المهندس (Ctrl+K) واختر التبويب الثاني (حاسبة الغزل و GSM)',
        detailEn: 'Enter the English Cotton Count (Ne) or fabric GSM, width (cm), and roll length (m).',
        detailAr: 'أدخل نمرة الخيط (Ne) أو وزن القماش (GSM) والعرض بالسم وطول الرول بالمتر.',
      },
      {
        titleEn: '2. Read Instant Conversions & Roll Weight',
        titleAr: '٢. اقرأ نتائج التحويل الفورية ووزن الرول بالكيلوجرام',
        detailEn: 'Use the computed kg/roll to estimate container loading in the Logistics calculator.',
        detailAr: 'استخدم وزن الرول الناتج لحساب حمولة الحاوية بدقة في حاسبة اللوجستيات.',
      },
    ],
    proTipEn: 'For Giza 86 fine shirting and sateen (Ne 60/1 to Ne 80/1), check the Tex value (9.8 to 7.4 Tex) when configuring European air-jet loom tensions!',
    proTipAr: 'عند تشغيل خيوط جيزة 86 الرفيعة (Ne 60/1 إلى Ne 80/1) على أنوال الهواء الحديثة، استخدم قيمة (Tex) الناتجة لضبط شد الخيط بدقة!',
  },

  'gadget-takt-fx': {
    id: 'gadget-takt-fx',
    category: 'gadgets_calculators',
    badgeEn: 'Pocket Calculator • Takt Time & Export FX',
    badgeAr: 'حاسبة جيب هندسية • زمن التاكت والعملات',
    titleEn: 'Pocket Customer Takt Time, Hourly Line Target & Export Currency (USD / EUR / EGP) Calculator',
    titleAr: 'حاسبة زمن التاكت (Takt Time)، الإنتاج المستهدف في الساعة، وتحويل عملات التصدير',
    subtitleEn: 'Instant industrial engineering line beat & export contract FX conversion inside Ctrl+K',
    subtitleAr: 'حساب فوري لإيقاع خط الإنتاج المطلوب وتحويل قيم عقود التصدير بين الدولار واليورو والجنيه',
    whatIsThisEn:
      'A dual-purpose industrial engineering and export finance calculator inside the `Ctrl+K` Quick Tools Dock that computes net shift seconds, Customer Takt Time, required units per hour, and live USD/EUR/EGP contract values.',
    whatIsThisAr:
      'حاسبة مزدوجة للهندسة الصناعية والمالية التصديرية داخل نافذة (`Ctrl+K`) تحسب صافي ثواني الوردية، زمن التاكت، معدل الإنتاج المطلوب في الساعة، وتحويل قيم العقود بين الدولار واليورو والجنيه المصري.',
    howItWorksEn:
      'Divides net available working time (`(Shift Minutes − Breaks) × 60`) by daily customer demand to establish the exact Takt beat in seconds per unit.',
    howItWorksAr:
      'تقسم صافي وقت العمل المتاح بالثواني بعد خصم الاستراحات على كمية الطلب اليومي للعميل لتحديد إيقاع الإنتاج المطلوب بالثانية لكل قطعة.',
    formulaOrArchitecture: 'Takt Time (sec/unit) = ((Shift Min − Break Min) × 60) / Daily Customer Demand  |  Hourly Target = 3600 / Takt',
    whyToUseEn: [
      'Gives production managers an instant Takt benchmark before walking onto the sewing or weaving floor.',
      'Converts USD export quotes into EGP and EUR simultaneously during live buyer calls.',
    ],
    whyToUseAr: [
      'تزويد مدير الإنتاج بزمن التاكت المستهدف ومعدل الساعة فوراً قبل بدء جولة صالة الإنتاج.',
      'تحويل عروض الأسعار التصديرية بين الدولار واليورو والجنيه لحظياً أثناء التفاوض مع المشتري.',
    ],
    howToUseSteps: [
      {
        titleEn: '1. Open the Textile Toolkit (`Ctrl+K`) & Select Tab 3',
        titleAr: '١. افتح حقيبة المهندس (Ctrl+K) واختر التبويب الثالث (زمن التاكت والعملات)',
        detailEn: 'Input shift minutes, break minutes, and daily customer demand.',
        detailAr: 'أدخل دقائق الوردية ودقائق الراحة والكمية اليومية المطلوبة للعميل.',
      },
      {
        titleEn: '2. Check Takt Seconds/Unit & Convert USD/EUR/EGP',
        titleAr: '٢. راجع زمن التاكت بالثانية وحوّل قيمة العقد بالعملات الثلاث',
        detailEn: 'Enter any USD contract amount and exchange rates to see instant EGP and EUR totals.',
        detailAr: 'أدخل قيمة الصفقة بالدولار وسعر الصرف لمعاينة القيمة المقابلة بالجنيه واليورو فوراً.',
      },
    ],
    proTipEn: 'Design your sewing or inspection line cycle time at 90–93% of Takt Time (called Pitch/Target Cycle Time) to buffer against minor thread breaks!',
    proTipAr: 'صمّم زمن دورة خط الحياكة أو الفحص ليكون عند 90% إلى 93% من زمن التاكت لتوفير هامش أمان ضد التوقفات الصغرى وانقطاع الخيط!',
  },
};

/**
 * Automatically maps any URL pathname (`/[locale]/...`) to its corresponding ExpertManualEntry.
 */
export function resolveManualByPathname(pathname: string): ExpertManualEntry {
  const clean = pathname.replace(/^\/(ar|en)/, '') || '/';

  if (clean === '/' || clean === '') return EXPERT_MANUALS['platform-home'];
  if (clean === '/cluster') return EXPERT_MANUALS['cluster-hub'];
  if (clean.startsWith('/cluster/lean-manufacturing')) return EXPERT_MANUALS['lean-manufacturing'];
  if (clean.startsWith('/cluster/export-intelligence')) return EXPERT_MANUALS['export-intelligence'];
  if (clean.startsWith('/cluster/brand-studio')) return EXPERT_MANUALS['brand-studio'];
  if (clean.startsWith('/cluster/academy/studio')) return EXPERT_MANUALS['academy-studio'];
  if (clean.startsWith('/cluster/academy')) return EXPERT_MANUALS['academy'];
  if (clean.startsWith('/cluster/procurement')) return EXPERT_MANUALS['procurement'];
  if (clean.startsWith('/cluster/capacity')) return EXPERT_MANUALS['capacity'];
  if (clean.startsWith('/cluster/consortia')) return EXPERT_MANUALS['consortia'];
  if (clean.startsWith('/cluster/facilities')) return EXPERT_MANUALS['facilities'];
  if (clean.startsWith('/cluster/maturity')) return EXPERT_MANUALS['maturity'];
  if (clean.startsWith('/cluster/sustainability')) return EXPERT_MANUALS['sustainability'];
  if (clean.startsWith('/cluster/funding')) return EXPERT_MANUALS['funding'];
  if (clean.startsWith('/cluster/observatory')) return EXPERT_MANUALS['observatory'];
  if (clean.startsWith('/cluster/forum')) return EXPERT_MANUALS['forum'];
  if (clean.startsWith('/cluster/experts')) return EXPERT_MANUALS['experts'];
  if (clean.startsWith('/cluster/events')) return EXPERT_MANUALS['events'];
  if (clean.startsWith('/cluster/announcements')) return EXPERT_MANUALS['announcements'];

  if (clean.startsWith('/factories')) return EXPERT_MANUALS['factories'];
  if (clean.startsWith('/marketplaces/products')) return EXPERT_MANUALS['marketplace-products'];
  if (clean.startsWith('/marketplaces/resources')) return EXPERT_MANUALS['marketplace-resources'];
  if (clean.startsWith('/marketplaces/waste')) return EXPERT_MANUALS['marketplace-waste'];
  if (clean.startsWith('/marketplaces/matchmaking')) return EXPERT_MANUALS['marketplace-matchmaking'];
  if (clean.startsWith('/services/logistics')) return EXPERT_MANUALS['logistics-incoterms'];
  if (clean.startsWith('/services')) return EXPERT_MANUALS['services'];
  if (clean.startsWith('/dpp')) return EXPERT_MANUALS['dpp-passport'];
  if (clean.startsWith('/recruitment')) return EXPERT_MANUALS['recruitment'];
  if (clean.startsWith('/ai')) return EXPERT_MANUALS['ai-command-center'];

  if (clean.startsWith('/dashboard/contracts')) return EXPERT_MANUALS['dashboard-contracts'];
  if (clean.startsWith('/dashboard/knowledge')) return EXPERT_MANUALS['dashboard-knowledge'];
  if (clean.startsWith('/dashboard/messages')) return EXPERT_MANUALS['dashboard-messages'];
  if (clean.startsWith('/dashboard/buyer')) return EXPERT_MANUALS['dashboard-buyer'];
  if (clean.startsWith('/dashboard')) return EXPERT_MANUALS['dashboard-factory'];

  if (clean.startsWith('/admin')) return EXPERT_MANUALS['admin-pmo'];

  return EXPERT_MANUALS['platform-home'];
}
