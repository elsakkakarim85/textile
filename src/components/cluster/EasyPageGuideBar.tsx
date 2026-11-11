'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Volume2,
  VolumeX,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ZoomIn,
} from 'lucide-react';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';

interface StepGuide {
  summaryEn: string;
  summaryAr: string;
  benefitEn: string;
  benefitAr: string;
  stepsEn: [string, string, string];
  stepsAr: [string, string, string];
}

const SIMPLE_PAGE_GUIDES: Record<string, StepGuide> = {
  'cluster-hub': {
    summaryEn:
      'This is your main control center. Choose your role or goal below to access bulk buying, export buyers, machine sharing, quality tools, or worker training.',
    summaryAr:
      'هذه هي الصفحة الرئيسية لجميع خدمات التجمع. اختر دورك أو هدفك بالأسفل للوصول السريع للشراء المجمع، أو التصدير، أو تشغيل الماكينات، أو تدريب العمال.',
    benefitEn: 'All 17 factory services organized in one place',
    benefitAr: 'جميع خدمات المصانع والتصدير مرتبة في مكان واحد سهل',
    stepsEn: [
      '1. Pick your role (Factory Owner, Export, Production, Purchasing, or Training).',
      '2. Click on the service card you need today.',
      '3. Follow the 3 steps on that page or ask the Voice AI Assistant.',
    ],
    stepsAr: [
      '١. اختر تخصصك أو هدفك من الأزرار الملونة بالأسفل.',
      '٢. اضغط على البطاقة التي تناسب احتياج مصنعك اليوم.',
      '٣. اتبع الخطوات المبسطة داخل الصفحة أو تحدث للمساعد الذكي.',
    ],
  },
  procurement: {
    summaryEn:
      'Join other factories in El-Mahalla to buy cotton yarn, dyes, and chemicals together at wholesale factory prices, saving 12% to 18%.',
    summaryAr:
      'تتيح لك هذه الصفحة الانضمام مع مصانع المحلة لشراء الغزول والصبغات والكيماويات بكميات مجمعة للحصول على خصم الجملة وتوفير ١٢٪ إلى ١٨٪.',
    benefitEn: 'Save 12%–18% on yarn, dyes, and raw materials',
    benefitAr: 'توفير ١٢٪ إلى ١٨٪ من أسعار الغزول والصبغات والخامات',
    stepsEn: [
      '1. Browse the open buying pools below (Yarn, Dyes, Spare Parts, or Solar).',
      '2. Enter the quantity your factory needs and click Join Pool.',
      '3. Or start a new buying pool if you need a specific material.',
    ],
    stepsAr: [
      '١. تصفح مجموعات الشراء المفتوحة بالأسفل (غزل، صبغات، كيماويات، طاقة).',
      '٢. اكتب الكمية التي يحتاجها مصنعك واضغط على زر الانضمام للمجموعة.',
      '٣. أو أنشئ مجموعة شراء جديدة للخامة التي تطلبها.',
    ],
  },
  capacity: {
    summaryEn:
      'If you have idle machines (looms, spinning, dyeing, sewing), list them here to earn revenue, or find a trusted factory to run urgent orders for you.',
    summaryAr:
      'إذا كان لديك ماكينات متوقفة أو ساعات تشغيل فائضة يمكنك عرضها هنا لتشغيلها للغير، أو ابحث عن مصنع موثوق يساعدك في تنفيذ طلبيتك.',
    benefitEn: 'Turn idle machines into profit or find trusted subcontractors',
    benefitAr: 'تشغيل الماكينات المتوقفة وتحقيق دخل إضافي أو إيجاد مصنع شريك',
    stepsEn: [
      '1. Filter available machines by stage (Spinning, Weaving, Dyeing, Garments).',
      '2. Click Request Booking on any available machine listing.',
      '3. Or post your own available machine hours in the form on the right.',
    ],
    stepsAr: [
      '١. اختر نوع الماكينة المطلوبة (غزل، نسيج، تريكو، صباغة، ملابس).',
      '٢. اضغط على طلب حجز للتواصل مع المصنع صاحب الماكينة.',
      '٣. أو أضف ساعات التشغيل الفائضة بمصنعك من النموذج الموجود بالصفحة.',
    ],
  },
  consortia: {
    summaryEn:
      'Partner with 3 to 5 factories across spinning, weaving, dyeing, and sewing to win large export orders that one small factory cannot fulfill alone.',
    summaryAr:
      'تحالف مع عدة مصانع (غزل + نسيج + صباغة + تفصيل) للفوز بطلبيات تصدير كبرى لا يستطيع مصنع صغير تنفيذها بمفرده.',
    benefitEn: 'Win big export orders together with partner mills',
    benefitAr: 'الفوز بعقود تصدير كبيرة بالتعاون مع مصانع مكملة لك',
    stepsEn: [
      '1. Review active export alliances looking for partner factories.',
      '2. Click Join Alliance and state your factory specialty and capacity.',
      '3. Or create a new alliance for an export order you want to bid on.',
    ],
    stepsAr: [
      '١. استعرض التحالفات التصديرية المفتوحة التي تبحث عن مصانع شريكة.',
      '٢. اضغط انضمام للتحالف وحدد المرحلة التي ينفذها مصنعك.',
      '٣. أو أنشئ تحالفاً جديداً لطلبية تصدير كبرى.',
    ],
  },
  facilities: {
    summaryEn:
      'Book shared cluster laboratories (ISO quality testing, fabric inspection, 3D CAD design studio, and training halls) by the hour at low cost.',
    summaryAr:
      'احجز بالساعة في معامل الفحص المعتمدة واستوديو التصميم الرقمي وقاعات التدريب المشتركة بتكلفة مدعمة بدلاً من شراء أجهزة باهظة.',
    benefitEn: 'Test yarn & fabric quality in certified labs without buying expensive gear',
    benefitAr: 'فحص جودة الغزل والقماش في معامل معتمدة بتكلفة رمزية بالساعة',
    stepsEn: [
      '1. Choose the lab or studio you need (Quality Lab, CAD Studio, or Training Hall).',
      '2. Pick your preferred date and number of hours.',
      '3. Click Confirm Booking to reserve your slot immediately.',
    ],
    stepsAr: [
      '١. اختر المعمل أو المركز المطلوب (معمل اختبارات الجودة، استوديو التصميم، قاعة التدريب).',
      '٢. حدد التاريخ وعدد الساعات المطلوبة.',
      '٣. اضغط تأكيد الحجز لحجز موعدك فوراً.',
    ],
  },
  'lean-manufacturing': {
    summaryEn:
      'Reduce fabric defects, machine breakdowns, and changeover delays using simple calculators and step-by-step improvement plans.',
    summaryAr:
      'أدوات عملية مبسطة لتقليل الهالك وعيوب القماش والصباغة، وتقليل أعطال الماكينات، وحساب التكلفة الحقيقية للمنتج بضغطة زر.',
    benefitEn: 'Cut waste, reduce machine downtime, and lower production cost',
    benefitAr: 'تقليل الهالك والأعطال وخفض تكلفة الإنتاج في مصنعك',
    stepsEn: [
      '1. Enter your factory name and main product at the top studio bar and click Generate.',
      '2. Pick any tool tab (Waste Calculator, Machine Efficiency OEE, or Quick Changeover).',
      '3. Review your savings numbers and print or download your action plan.',
    ],
    stepsAr: [
      '١. اكتب اسم مصنعك ومنتجك في المربع العلوي واضغط زر التوليد الأخضر.',
      '٢. اختر الأداة التي تريدها (تقليل الهالك، كفاءة الماكينات، أو تنظيم المصنع 5S).',
      '٣. اقرأ خطة التحسين الجاهزة أو استمع إليها بالصوت وحمّل التقرير.',
    ],
  },
  'export-intelligence': {
    summaryEn:
      'Find the best countries to export your textiles, see real international buyers and tenders, and calculate shipping and customs duties.',
    summaryAr:
      'اعرف أفضل الدول لتصدير منتجاتك، واحصل على قائمة مشترين دوليين ومناقصات حقيقية، واحسب سعر التصدير والشحن والإعفاء الجمركي.',
    benefitEn: 'Find verified international buyers and calculate export prices in 1 click',
    benefitAr: 'الوصول لمشترين دوليين حقيقيين وحساب أسعار التصدير والجمارك',
    stepsEn: [
      '1. Choose your product (e.g., Terry Towels, Bedlinen, Giza Yarn) and target country.',
      '2. Click Generate Export Study to see buyers, prices, and customs rules.',
      '3. Copy ready-to-send WhatsApp and email messages to contact buyers directly.',
    ],
    stepsAr: [
      '١. اختر منتجك (فوط، مفروشات، غزل، ملابس) والدولة التي تريد التصدير إليها.',
      '٢. اضغط زر توليد دراسة التصدير لعرض المشترين والأسعار والجمارك.',
      '٣. انسخ رسائل التواصل الجاهزة لمراسلة المشترين عبر الإيميل أو واتساب.',
    ],
  },
  'brand-studio': {
    summaryEn:
      'Create a professional brand name, logo colors, 90-day marketing plan, promotional video, and printable brochure for your factory in 1 click.',
    summaryAr:
      'اصنع هوية تجارية احترافية لمصنعك، وخطة تسويق، وفيديو إعلاني، وكتالوج وبروشور جاهز للطباعة والنشر بضغطة زر واحدة.',
    benefitEn: 'Ready-to-print brochures, posters, and marketing plans for your factory',
    benefitAr: 'تصميم كتالوج وبروشور وفيديو وخطة تسويق جاهزة لمصنعك فوراً',
    stepsEn: [
      '1. Type your factory name and main products in the top studio bar.',
      '2. Click Generate Complete Brand & Marketing Suite.',
      '3. Switch tabs to print your 6-panel brochure, flyer, poster, or download your MP4 video.',
    ],
    stepsAr: [
      '١. اكتب اسم مصنعك ومنتجاتك الرئيسية في الشريط العلوي.',
      '٢. اضغط على زر توليد الهوية والمطبوعات.',
      '٣. تصفح البروشور والفلاير والبوستر والفيديو وحمّلها أو اطبعها مباشرة.',
    ],
  },
  'media-studio': {
    summaryEn:
      'Generate 4 studio product photos and a 5-scene HD MP4 commercial video with Arabic/English voiceover and burned-in subtitles (MoneyPrinterTurbo & MiniMax H3).',
    summaryAr:
      'توليد ٤ صور احترافية للمنتجات وفيديو إعلاني كامل بصيغة MP4 مع التعليق الصوتي والترجمة المكتوبة تلقائياً على الفيديو.',
    benefitEn: 'Download HD .MP4 commercial videos with voiceover & subtitles + 4K photos',
    benefitAr: 'تحميل فيديو إعلاني MP4 بالصوت والترجمة + ٤ صور عالية الجودة للمنتج',
    stepsEn: [
      '1. Enter your factory name and what your video or photo is about.',
      '2. Click Generate AI Script & Video or pick MoneyPrinterTurbo for burned-in subtitles.',
      '3. Click Play with Voiceover or Export HD .MP4 Video to save to your device.',
    ],
    stepsAr: [
      '١. اكتب اسم مصنعك وموضوع الإعلان أو المنتج المطلوب تصويره.',
      '٢. اضغط زر توليد الصور والفيديو (أو اختر MoneyPrinterTurbo لإضافة ترجمة مكتوبة).',
      '٣. اضغط تشغيل بالصوت أو تحميل الفيديو بصيغة MP4 على جهازك.',
    ],
  },
  'google-labs': {
    summaryEn:
      'Use 4 smart visual tools to extract your factory strengths, create fabric color moodboards, preview digital screens, and run automated workflows.',
    summaryAr:
      '٤ أدوات ذكية مبسطة لاستخراج نقاط قوة مصنعك، وتنسيق ألوان الأقمشة والمجموعات الجديدة، وتجهيز عروض للمشترين.',
    benefitEn: 'Fabric color moodboards, B2B ad cards, and smart workflows',
    benefitAr: 'لوحات ألوان الأقمشة وبطاقات إعلانية وعروض تفاعلية للمشترين',
    stepsEn: [
      '1. Enter your factory name and specialty at the top.',
      '2. Click Synthesize All 4 Studios in 1 Click.',
      '3. Explore the 4 tabs (Business DNA, Fabric Moodboard, UI Preview, and Workflow).',
    ],
    stepsAr: [
      '١. أدخل اسم مصنعك وتخصصه في الأعلى.',
      '٢. اضغط على زر تشغيل الاستوديوهات الأربعة بضغطة واحدة.',
      '٣. تنقل بين التبويبات الأربعة لتحميل البطاقات الإعلانية ولوحة الألوان.',
    ],
  },
  maturity: {
    summaryEn:
      'Answer simple questions about your factory machines and management to get your digital readiness score and a clear 90-day improvement plan.',
    summaryAr:
      'أجب عن أسئلة بسيطة حول طريقة العمل في مصنعك لتحصل فوراً على تقييم واضح وخطة تطوير عملية لمدة ٩٠ يوماً.',
    benefitEn: 'Know your factory strengths & get a 90-day upgrade roadmap',
    benefitAr: 'معرفة نقاط القوة والضعف بمصنعك والحصول على خطة تطوير واضحة',
    stepsEn: [
      '1. Rate your factory from 1 to 5 on each of the 6 simple categories.',
      '2. Click Calculate Score to see how you compare to cluster benchmarks.',
      '3. Read your personalized 90-day action steps and matched funding grants.',
    ],
    stepsAr: [
      '١. اختر تقييم مصنعك من ١ إلى ٥ في المحاور الستة البسيطة.',
      '٢. اضغط حفظ وحساب النتيجة لمعرفة مستوى مصنعك مقارنة بالتجمع.',
      '٣. استلم خطة العمل المقترحة لمدة ٩٠ يوماً والمنح التمويلية المناسبة لك.',
    ],
  },
  academy: {
    summaryEn:
      'Train yourself or your factory workers on any technical or management topic with step-by-step lessons, audio explanation, quizzes, and certificates.',
    summaryAr:
      'درّب نفسك أو عمال وفنيي مصنعك على أي موضوع فني أو إداري بدروس مبسطة واختبارات وشهادات معتمدة برمز QR.',
    benefitEn: 'Free training courses & instant AI course generator with certificates',
    benefitAr: 'دورات تدريبية جاهزة وإنشاء أي دورة تدريبية لعمالك مع شهادة معتمدة',
    stepsEn: [
      '1. Type any topic you want to learn in the top bar (or pick a ready course below).',
      '2. Read or listen to the lessons from Beginner to Advanced.',
      '3. Answer the short quiz to get your verifiable certificate.',
    ],
    stepsAr: [
      '١. اكتب أي موضوع تريد تعلمه أو تدريب عمالك عليه في المربع العلوي (أو اختر دورة جاهزة).',
      '٢. اقرأ الدروس المبسطة من مستوى المبتدئ حتى المتقدم.',
      '٣. أجب عن الأسئلة البسيطة للحصول على شهادة إتمام الدورة.',
    ],
  },
  'academy-studio': {
    summaryEn:
      'Create a complete Beginner-to-Advanced training course with diagrams, video slides, and a quiz for your factory team in 1 click.',
    summaryAr:
      'أنشئ دورة تدريبية متكاملة لعمال ومهندسي مصنعك (من المبتدئ للمتقدم) مدعومة بالصور والفيديو والاختبارات بضغطة زر.',
    benefitEn: 'Custom factory training courses & SOPs generated in seconds',
    benefitAr: 'توليد دورات تدريبية وأدلة تشغيل مخصصة لمصنعك في ثوانٍ',
    stepsEn: [
      '1. Enter the training topic or choose a quick preset topic.',
      '2. Click Generate Complete Course.',
      '3. Play the voiceover slideshow, download the MP4 video, or take the exam.',
    ],
    stepsAr: [
      '١. اكتب عنوان الدورة المطلوبة أو اختر من الأمثلة الجاهزة.',
      '٢. اضغط على زر توليد الدورة التدريبية الكاملة.',
      '٣. شغل الشرح الصوتي والمرئي أو حمّل الفيديو وابدأ الاختبار.',
    ],
  },
  sustainability: {
    summaryEn:
      'Calculate your factory electricity, water, and carbon footprint simply, and download the official report required by European buyers (CBAM).',
    summaryAr:
      'احسب استهلاك الكهرباء والمياه والبصمة الكربونية لمصنعك بسهولة، وحمّل التقرير الرسمي المطلوب للتصدير لأوروبا.',
    benefitEn: 'Lower energy bills & get EU CBAM export compliance certificates',
    benefitAr: 'توفير استهلاك الطاقة والمياه وتجهيز شهادة التصدير لأوروبا (CBAM)',
    stepsEn: [
      '1. Enter your monthly electricity, gas, water, and production tons.',
      '2. Click Log & Calculate to see your carbon and water efficiency score.',
      '3. Click Export CBAM CSV to download the file for European buyers.',
    ],
    stepsAr: [
      '١. أدخل استهلاك الشهر من الكهرباء والمياه وكمية الإنتاج بالطن.',
      '٢. اضغط تسجيل وحساب لمعرفة كفاءة مصنعك وتوفير الطاقة.',
      '٣. اضغط تحميل تقرير CBAM لإرساله للمشترين في أوروبا.',
    ],
  },
  funding: {
    summaryEn:
      'Find grants, technical support, and low-interest green loans from EU/UNIDO TIGARA, EBRD, and MSMEDA to upgrade your factory machines.',
    summaryAr:
      'تعرف على المنح المجانية، والدعم الفني، والقروض الميسرة المتاحة لتحديث ماكينات مصنعك أو تركيب طاقة شمسية أو الحصول على شهادات الجودة.',
    benefitEn: 'Grants & low-interest loans matched to your factory needs',
    benefitAr: 'منح مجانية وقروض ميسرة لتحديث الماكينات وشهادات التصدير',
    stepsEn: [
      '1. Filter programs by type (Grant, Technical Support, Loan, or Export Subsidy).',
      '2. Review the funding amount and simple requirements on each card.',
      '3. Click Express Interest to submit your factory application in 1 minute.',
    ],
    stepsAr: [
      '١. اختر نوع التمويل المطلوب (منحة مجانية، دعم فني، قرض ميسر، أو دعم صادرات).',
      '٢. اقرأ قيمة التمويل والشروط المبسطة على كل بطاقة.',
      '٣. اضغط تقديم طلب اهتمام لتسجيل مصنعك في البرنامج فوراً.',
    ],
  },
};

export function EasyPageGuideBar({ manualId }: { manualId?: string }) {
  const pathname = usePathname() || '';
  const isAr = pathname.startsWith('/ar') || pathname === '/ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const [showSteps, setShowSteps] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [zoomPct, setZoomPct] = useState<number>(100);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mahalla_font_zoom');
      if (saved) {
        const num = Number(saved);
        if (num >= 100 && num <= 125) {
          setZoomPct(num);
          document.documentElement.style.fontSize = `${num}%`;
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const cycleZoom = () => {
    const next = zoomPct === 100 ? 112 : zoomPct === 112 ? 122 : 100;
    setZoomPct(next);
    try {
      document.documentElement.style.fontSize = `${next}%`;
      localStorage.setItem('mahalla_font_zoom', String(next));
    } catch {
      // ignore
    }
  };

  // Resolve guide key
  const key =
    manualId && SIMPLE_PAGE_GUIDES[manualId]
      ? manualId
      : pathname.includes('lean-manufacturing')
      ? 'lean-manufacturing'
      : pathname.includes('export-intelligence')
      ? 'export-intelligence'
      : pathname.includes('brand-studio')
      ? 'brand-studio'
      : pathname.includes('media-studio')
      ? 'media-studio'
      : pathname.includes('google-labs')
      ? 'google-labs'
      : pathname.includes('procurement')
      ? 'procurement'
      : pathname.includes('capacity')
      ? 'capacity'
      : pathname.includes('consortia')
      ? 'consortia'
      : pathname.includes('facilities')
      ? 'facilities'
      : pathname.includes('maturity')
      ? 'maturity'
      : pathname.includes('academy/studio')
      ? 'academy-studio'
      : pathname.includes('academy')
      ? 'academy'
      : pathname.includes('sustainability')
      ? 'sustainability'
      : pathname.includes('funding')
      ? 'funding'
      : 'cluster-hub';

  const guide = SIMPLE_PAGE_GUIDES[key] || SIMPLE_PAGE_GUIDES['cluster-hub'];

  const toggleReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const textToSpeak = isAr
      ? `${guide.summaryAr}. خطوات الاستخدام البسيطة: ${guide.stepsAr.join(' ثم ')}`
      : `${guide.summaryEn}. Simple steps to use this page: ${guide.stepsEn.join(' Then ')}`;
    const utter = new SpeechSynthesisUtterance(textToSpeak);
    utter.lang = isAr ? 'ar-EG' : 'en-US';
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="mt-3 space-y-2.5">
      {/* Friendly Action Pills Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. How to use in 3 simple steps */}
        <button
          type="button"
          onClick={() => setShowSteps((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-emerald-500/45 bg-emerald-500/15 hover:bg-emerald-500/25 px-3.5 py-1.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-200 transition cursor-pointer shadow-2xs"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            {t(
              'How to use this page in 3 simple steps',
              'كيف تستخدم هذه الصفحة في ٣ خطوات بسيطة؟'
            )}
          </span>
          {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* 2. Read Aloud by Voice */}
        <button
          type="button"
          onClick={toggleReadAloud}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition cursor-pointer ${
            speaking
              ? 'border-amber-500 bg-amber-500 text-slate-950 animate-pulse'
              : 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-200'
          }`}
        >
          {speaking ? <VolumeX className="w-4 h-4 shrink-0" /> : <Volume2 className="w-4 h-4 shrink-0" />}
          <span>
            {speaking
              ? t('Stop Voice Guide', 'إيقاف القراءة الصوتية')
              : t('🔊 Listen to Page Explanation', '🔊 استمع لشرح الصفحة بالصوت')}
          </span>
        </button>

        {/* 3. Large Text Comfort Zoom (A+) */}
        <button
          type="button"
          onClick={cycleZoom}
          className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/35 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 text-xs font-bold text-sky-800 dark:text-sky-200 transition cursor-pointer"
          title={t('Enlarge text size for easier reading', 'تكبير حجم الخط لراحة العين وسهولة القراءة')}
        >
          <ZoomIn className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>
            {zoomPct === 100
              ? t('A+ Enlarge Text', 'A+ تكبير الخط')
              : t(`Text Size: ${zoomPct}% (Click to reset)`, `حجم الخط: ${zoomPct}% (اضغط للتغيير)`)}
          </span>
        </button>

        {/* 4. Scroll to AI Assistant */}
        <a
          href="#mahalla-universal-ai-copilot"
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 hover:bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary transition"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>
            {t(
              '🤖 Ask Smart Assistant to help you ↓',
              '🤖 اطلب من المساعد الذكي مساعدتك الآن ↓'
            )}
          </span>
        </a>

        {/* 5. Detailed Manual Modal */}
        <ExpertManualButton manualId={manualId} locale={isAr ? 'ar' : 'en'} variant="pill" />
      </div>

      {/* Expandable 3-Step Visual Guide Card */}
      {showSteps && (
        <div className="rounded-2xl border-2 border-emerald-500/35 bg-background/95 p-4 shadow-md space-y-3 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-black text-foreground">
                {isAr ? guide.benefitAr : guide.benefitEn}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleReadAloud}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-300 underline cursor-pointer"
            >
              {speaking
                ? t('Stop reading aloud', 'إيقاف الصوت')
                : t('🔊 Read these 3 steps aloud', '🔊 اقرأ لي هذه الخطوات بالصوت')}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isAr ? guide.summaryAr : guide.summaryEn}
          </p>

          <div className="grid sm:grid-cols-3 gap-3 pt-1">
            {(isAr ? guide.stepsAr : guide.stepsEn).map((stepText, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 flex items-start gap-2.5"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                  {stepText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
