'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Globe2,
  Factory,
  Film,
  Gauge,
  GraduationCap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ZoomIn,
  Send,
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { runSovereignTextileModel } from '@/lib/sovereign-textile-lm';

interface GoalItem {
  id: string;
  numberAr: string;
  numberEn: string;
  icon: React.ComponentType<{ className?: string }>;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  benefitBadgeEn: string;
  benefitBadgeAr: string;
  stepsEn: [string, string, string];
  stepsAr: [string, string, string];
  primaryHref: string;
  primaryLabelEn: string;
  primaryLabelAr: string;
  secondaryHref: string;
  secondaryLabelEn: string;
  secondaryLabelAr: string;
  sampleQuestionEn: string;
  sampleQuestionAr: string;
  colorClass: string;
  activeBorderClass: string;
  iconBgClass: string;
}

export function EasyGoalNavigator({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const goals: GoalItem[] = [
    {
      id: 'buy-raw-materials',
      numberAr: '١',
      numberEn: '1',
      icon: ShoppingCart,
      titleEn: 'Buy Yarn, Dyes & Raw Materials Cheaper',
      titleAr: 'شراء الغزول والصبغات والخامات بسعر الجملة',
      subtitleEn:
        'Join other Mahalla factories to pool orders and save 12% to 18% on cotton yarn, reactive dyes, and spare parts.',
      subtitleAr:
        'اشترك مع مصانع المحلة في شراء الغزل والصبغات والكيماويات بكميات مجمعة لتوفير ١٢٪ إلى ١٨٪ من التكلفة.',
      benefitBadgeEn: 'Save 12%–18% immediately',
      benefitBadgeAr: 'توفير ١٢٪ إلى ١٨٪ فوراً',
      stepsEn: [
        'Choose the raw material you need (Cotton Yarn, Dyes, Chemicals, or Solar Energy).',
        'Enter the quantity your factory needs and click Join Buying Group.',
        'Get the discounted wholesale price directly from verified suppliers.',
      ],
      stepsAr: [
        'اختر الخامة التي يحتاجها مصنعك (غزل قطن، صبغات، كيماويات، أو طاقة شمسية).',
        'اكتب الكمية المطلوبة لمصنعك واضغط على زر الانضمام للمجموعة.',
        'احصل على سعر الجملة المخفض مباشرة من الموردين المعتمدين.',
      ],
      primaryHref: `/${locale}/cluster/procurement`,
      primaryLabelEn: 'Open Joint Buying Pools →',
      primaryLabelAr: 'افتح مجموعات الشراء بالجملة ←',
      secondaryHref: `/${locale}/marketplaces/resources`,
      secondaryLabelEn: 'Browse Raw Materials Market',
      secondaryLabelAr: 'تصفح سوق الخامات والغزول',
      sampleQuestionEn: 'How much can I save by joining a Giza 86 Ne 30/1 cotton yarn buying pool for 3,000 kg?',
      sampleQuestionAr: 'كم سأوفر عند شراء ٣٠٠٠ كيلو غزل قطن جيزة ٨٦ نمرة ٣٠/١ عبر الشراء المجمع؟',
      colorClass: 'from-sky-500/15 to-transparent',
      activeBorderClass: 'border-sky-500 ring-2 ring-sky-500/30',
      iconBgClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    },
    {
      id: 'export-buyers',
      numberAr: '٢',
      numberEn: '2',
      icon: Globe2,
      titleEn: 'Export My Products & Find Foreign Buyers',
      titleAr: 'تصدير منتجاتي وإيجاد مشترين بالخارج',
      subtitleEn:
        'See the best countries for your product, verified foreign buyers, live tenders, and exact shipping & customs costs.',
      subtitleAr:
        'اعرف أفضل الدول لتصدير منتجك، واحصل على قائمة مشترين دوليين ومناقصات حقيقية، واحسب الشحن والجمارك بضغطة زر.',
      benefitBadgeEn: '190+ Countries & Real Buyers',
      benefitBadgeAr: 'مشترون ومناقصات في ١٩٠+ دولة',
      stepsEn: [
        'Pick your product (Towels, Bedlinen, Yarn, or Garments) and target country.',
        'Click Generate Study to see export prices, 0% duty rules, and verified buyers.',
        'Copy the ready-made WhatsApp/Email message to contact buyers immediately.',
      ],
      stepsAr: [
        'اختر منتجك (فوط، ملايات، غزل، ملابس) والدولة التي ترغب في التصدير إليها.',
        'اضغط زر عرض الدراسة لمعرفة الأسعار والإعفاء الجمركي وقائمة المشترين.',
        'انسخ رسالة التعريف الجاهزة وأرسلها للمشتري عبر واتساب أو الإيميل فوراً.',
      ],
      primaryHref: `/${locale}/cluster/export-intelligence`,
      primaryLabelEn: 'Find Export Buyers & Markets →',
      primaryLabelAr: 'افتح كشاف المشترين والتصدير ←',
      secondaryHref: `/${locale}/services/logistics`,
      secondaryLabelEn: 'Shipping & Customs Calculator',
      secondaryLabelAr: 'حاسبة تكلفة الشحن والجمارك',
      sampleQuestionEn: 'Give me an export plan and buyer list for exporting 550 GSM Egyptian cotton towels to Germany.',
      sampleQuestionAr: 'أريد خطة تصدير وقائمة مشترين لتصدير فوط قطن مصري ٥٥٠ جرام إلى ألمانيا وأوروبا.',
      colorClass: 'from-emerald-500/15 to-transparent',
      activeBorderClass: 'border-emerald-500 ring-2 ring-emerald-500/30',
      iconBgClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'machines-subcontract',
      numberAr: '٣',
      numberEn: '3',
      icon: Factory,
      titleEn: 'Run Idle Machines or Find a Partner Factory',
      titleAr: 'تشغيل ماكيناتي المتاحة أو إيجاد مصنع يساعدني',
      subtitleEn:
        'Earn money from idle looms, dyeing jets, or sewing lines—or find a trusted factory in El-Mahalla to help finish your order.',
      subtitleAr:
        'حقق دخلاً إضافياً من ساعات الماكينات الفائضة لديك، أو اعثر على مصنع موثوق بالمحلة ينفذ لك مرحلة إنتاجية أو تحالف تصديري.',
      benefitBadgeEn: 'Fast Factory Matching',
      benefitBadgeAr: 'تشبيك فوري بين المصانع',
      stepsEn: [
        'Select the machine type (Spinning, Weaving, Knitting, Dyeing, or Sewing).',
        'View available factories and click Request Booking—or post your idle machines.',
        'Or join an Export Consortium to fulfill large orders together.',
      ],
      stepsAr: [
        'اختر نوع المرحلة (غزل، نسيج، تريكو، صباغة، أو تفصيل وملابس).',
        'اختر المصنع المتاح واضغط طلب تشغيل — أو اعرض ماكيناتك الفائضة.',
        'أو انضم لتحالف تصديري مع عدة مصانع لتنفيذ الطلبيات الكبيرة معاً.',
      ],
      primaryHref: `/${locale}/cluster/capacity`,
      primaryLabelEn: 'Open Machine Capacity Exchange →',
      primaryLabelAr: 'افتح تبادل تشغيل الماكينات ←',
      secondaryHref: `/${locale}/cluster/consortia`,
      secondaryLabelEn: 'Join Export Alliances',
      secondaryLabelAr: 'انضم للتحالفات التصديرية',
      sampleQuestionEn: 'I have 4 idle rapier looms in my factory—how do I price and rent out their capacity?',
      sampleQuestionAr: 'عندي ٤ أنوال نسيج متوقفة في مصنعي، كيف أعرضها للتشغيل للغير وأحسب سعر الساعة؟',
      colorClass: 'from-amber-500/15 to-transparent',
      activeBorderClass: 'border-amber-500 ring-2 ring-amber-500/30',
      iconBgClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'video-brochure-marketing',
      numberAr: '٤',
      numberEn: '4',
      icon: Film,
      titleEn: 'Create Factory Video, Photos & Brochure in 1 Click',
      titleAr: 'عمل فيديو وإعلان وكتالوج لمصنعي بضغطة زر',
      subtitleEn:
        'Generate an HD .MP4 commercial video with voiceover and subtitles, product photos, and a printable brochure automatically.',
      subtitleAr:
        'اصنع فيديو دعائي احترافي بالصوت والترجمة المكتوبة، وصور للمنتجات، وكتالوج وبروشور جاهز للطباعة وإرساله للعملاء.',
      benefitBadgeEn: 'Instant MP4 Video & Print Catalog',
      benefitBadgeAr: 'فيديو MP4 وكتالوج فوري',
      stepsEn: [
        'Type your factory name and main product (no design skills needed).',
        'Click Generate to create your video with voiceover, subtitles, and 4 studio photos.',
        'Click Download .MP4 Video or Print Brochure to share on WhatsApp.',
      ],
      stepsAr: [
        'اكتب اسم مصنعك ومنتجك الرئيسي فقط (لا تحتاج لأي خبرة في التصميم).',
        'اضغط زر التوليد لإنشاء الفيديو بالصوت والترجمة و٤ صور احترافية.',
        'اضغط تحميل الفيديو MP4 أو طباعة البروشور لإرساله لعملائك على واتساب.',
      ],
      primaryHref: `/${locale}/cluster/media-studio`,
      primaryLabelEn: 'Create Video & Photos Now →',
      primaryLabelAr: 'اصنع فيديو وصور لمصنعك الآن ←',
      secondaryHref: `/${locale}/cluster/brand-studio`,
      secondaryLabelEn: 'Create Brochure & Brand Identity',
      secondaryLabelAr: 'تصميم كتالوج وهوية للمصنع',
      sampleQuestionEn: 'Write a 20-second promotional video script and WhatsApp ad for my El-Mahalla textile factory.',
      sampleQuestionAr: 'اكتب لي سيناريو فيديو إعلاني قصير ورسالة تسويقية على واتساب لمصنعي بالمحلة الكبرى.',
      colorClass: 'from-rose-500/15 to-transparent',
      activeBorderClass: 'border-rose-500 ring-2 ring-rose-500/30',
      iconBgClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    },
    {
      id: 'reduce-waste-cost',
      numberAr: '٥',
      numberEn: '5',
      icon: Gauge,
      titleEn: 'Reduce Waste, Breakdowns & Calculate Costs',
      titleAr: 'تقليل الهالك والأعطال وحساب تكلفة المصنع',
      subtitleEn:
        'Cut fabric defects, reduce machine stoppages, speed up warp/lot changeovers, and book certified quality testing labs.',
      subtitleAr:
        'قلل عيوب النسيج والصباغة، واخفض وقت توقف الماكينات وتغيير الأصناف، واحسب التكلفة الحقيقية للكيلو مع فحص الجودة.',
      benefitBadgeEn: 'Cut Factory Waste & Downtime',
      benefitBadgeAr: 'تقليل الهالك وتكلفة الإنتاج',
      stepsEn: [
        'Choose your factory issue (Fabric Defects, Machine Stops, or Slow Changeover).',
        'Enter your basic numbers or click Generate Action Plan.',
        'Get a clear step-by-step fix and book the cluster quality lab if needed.',
      ],
      stepsAr: [
        'اختر المشكلة التي تواجهك (عيوب قماش، توقف ماكينات، أو بطء تغيير الصنف).',
        'أدخل أرقام مصنعك البسيطة أو اضغط على زر توليد خطة التحسين.',
        'احصل على خطوات عملية واضحة لتوفير التكلفة أو احجز معمل فحص الجودة.',
      ],
      primaryHref: `/${locale}/cluster/lean-manufacturing`,
      primaryLabelEn: 'Open Waste & Efficiency Tool →',
      primaryLabelAr: 'افتح برنامج تقليل الهالك والأعطال ←',
      secondaryHref: `/${locale}/cluster/facilities`,
      secondaryLabelEn: 'Book Quality Testing Lab',
      secondaryLabelAr: 'حجز معمل اختبارات الجودة',
      sampleQuestionEn: 'How can I reduce loom stoppage and warp breakage in my weaving workshop in 3 simple steps?',
      sampleQuestionAr: 'كيف أقلل توقف أنوال النسيج وقطع الخيوط والهالك في مصنعي بـ ٣ خطوات عملية بسيطة؟',
      colorClass: 'from-teal-500/15 to-transparent',
      activeBorderClass: 'border-teal-500 ring-2 ring-teal-500/30',
      iconBgClass: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
    },
    {
      id: 'training-grants',
      numberAr: '٦',
      numberEn: '6',
      icon: GraduationCap,
      titleEn: 'Train Workers & Get Grants / Green Loans',
      titleAr: 'تدريب العمال والحصول على منح وتمويل للمصنع',
      subtitleEn:
        'Apply for EU/UNIDO grants and low-interest loans to upgrade machines, and train workers on any skill with certificates.',
      subtitleAr:
        'قدم على المنح المجانية والقروض الميسرة لتحديث الماكينات والطاقة الشمسية، ودرّب عمالك بدورات مبسطة وشهادات معتمدة.',
      benefitBadgeEn: 'Grants + Certified Training',
      benefitBadgeAr: 'منح تمويلية + تدريب بشهادات',
      stepsEn: [
        'Browse open grants and green loans or enter any training topic for your team.',
        'Click Express Interest for funding, or Generate Course for instant training.',
        'Receive funding guidance or earn a QR-verified training certificate.',
      ],
      stepsAr: [
        'استعرض المنح والقروض المتاحة، أو اكتب أي موضوع لتدريب عمالك عليه.',
        'اضغط تقديم طلب للمنحة، أو اضغط إنشاء دورة تدريبية فورية.',
        'احصل على التوجيه التمويلي أو شهادة التدريب المعتمدة برمز QR.',
      ],
      primaryHref: `/${locale}/cluster/funding`,
      primaryLabelEn: 'View Factory Grants & Loans →',
      primaryLabelAr: 'استعرض المنح والتمويل المتاح ←',
      secondaryHref: `/${locale}/cluster/academy`,
      secondaryLabelAr: 'افتح أكاديمية تدريب العمال',
      secondaryLabelEn: 'Open Worker Training Academy',
      sampleQuestionEn: 'What grants and low-interest loans are available right now to upgrade my textile factory machines?',
      sampleQuestionAr: 'ما هي المنح المجانية والقروض الميسرة المتاحة حالياً لتحديث ماكينات مصنع النسيج؟',
      colorClass: 'from-violet-500/15 to-transparent',
      activeBorderClass: 'border-violet-500 ring-2 ring-violet-500/30',
      iconBgClass: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    },
  ];

  const [selectedGoalId, setSelectedGoalId] = useState<string>('buy-raw-materials');
  const [userQuery, setUserQuery] = useState<string>('');
  const [listening, setListening] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [instantAnswer, setInstantAnswer] = useState<string | null>(null);
  const [matchedGoalId, setMatchedGoalId] = useState<string>('buy-raw-materials');
  const [zoomPct, setZoomPct] = useState<number>(100);

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];
  const matchedGoal = goals.find((g) => g.id === matchedGoalId) || selectedGoal;

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

  const detectGoalFromText = (text: string): string => {
    const q = text.toLowerCase();
    if (
      q.includes('تصدير') ||
      q.includes('أصدر') ||
      q.includes('اصدر') ||
      q.includes('مشتر') ||
      q.includes('أوروبا') ||
      q.includes('المانيا') ||
      q.includes('export') ||
      q.includes('buyer') ||
      q.includes('germany')
    ) {
      return 'export-buyers';
    }
    if (
      q.includes('فيديو') ||
      q.includes('إعلان') ||
      q.includes('اعلان') ||
      q.includes('كتالوج') ||
      q.includes('بروشور') ||
      q.includes('صور') ||
      q.includes('video') ||
      q.includes('brochure') ||
      q.includes('brand')
    ) {
      return 'video-brochure-marketing';
    }
    if (
      q.includes('ماكين') ||
      q.includes('أنوال') ||
      q.includes('انوال') ||
      q.includes('تشغيل') ||
      q.includes('باطن') ||
      q.includes('تحالف') ||
      q.includes('idle') ||
      q.includes('loom') ||
      q.includes('capacity')
    ) {
      return 'machines-subcontract';
    }
    if (
      q.includes('هالك') ||
      q.includes('عيوب') ||
      q.includes('أعطال') ||
      q.includes('اعطال') ||
      q.includes('جودة') ||
      q.includes('تكلفة') ||
      q.includes('waste') ||
      q.includes('lean') ||
      q.includes('defect')
    ) {
      return 'reduce-waste-cost';
    }
    if (
      q.includes('منح') ||
      q.includes('تمويل') ||
      q.includes('قرض') ||
      q.includes('تدريب') ||
      q.includes('عمال') ||
      q.includes('دورة') ||
      q.includes('grant') ||
      q.includes('loan') ||
      q.includes('train')
    ) {
      return 'training-grants';
    }
    return 'buy-raw-materials';
  };

  const runSimpleAssistant = (queryText?: string) => {
    const finalQuery =
      (queryText ?? userQuery).trim() ||
      (isAr ? selectedGoal.sampleQuestionAr : selectedGoal.sampleQuestionEn);
    setUserQuery(finalQuery);
    const detected = detectGoalFromText(finalQuery);
    setSelectedGoalId(detected);
    setMatchedGoalId(detected);

    const sov = runSovereignTextileModel({
      prompt: finalQuery,
      localeHint: locale,
    });
    setInstantAnswer(sov.text);
  };

  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      runSimpleAssistant();
      return;
    }
    if (listening) {
      setListening(false);
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.lang = isAr ? 'ar-EG' : 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      setListening(true);
      rec.onresult = (event: any) => {
        const transcript = event?.results?.[0]?.[0]?.transcript || '';
        setListening(false);
        if (transcript) {
          setUserQuery(transcript);
          runSimpleAssistant(transcript);
        }
      };
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const clean = text.replace(/[#*`|>-]/g, ' ').slice(0, 1200);
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = isAr ? 'ar-EG' : 'en-US';
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const SelectedIcon = selectedGoal.icon;

  return (
    <div className="rounded-3xl border-2 border-primary/25 bg-card p-5 sm:p-7 shadow-lg space-y-6">
      {/* Top Friendly Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
            <HelpCircle className="w-4 h-4" />
            <span>
              {t(
                'Easy Guided Start • No Technical Experience Needed',
                'البداية السهلة المبسطة • مصممة للجميع بدون أي تعقيد تقني'
              )}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground">
            {t(
              'What would you like to achieve today?',
              'ماذا تريد أن تنجز لمصنعك أو عملك اليوم؟'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t(
              'Simply click one of the 6 goals below—or press the microphone button and speak in your own words:',
              'اضغط على الهدف الذي تريده من البطاقات الست بالأسفل — أو اضغط زر الميكروفون وتحدث بصوتك مباشرة:'
            )}
          </p>
        </div>

        {/* Comfort Controls: Read Aloud + Font Size Zoom */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() =>
              speakText(
                isAr
                  ? `مرحباً بك في منصة تجمع المحلة الكبرى. ${selectedGoal.titleAr}. ${selectedGoal.subtitleAr}. الخطوات: ${selectedGoal.stepsAr.join(' ثم ')}`
                  : `Welcome to the Mahalla Cluster Platform. ${selectedGoal.titleEn}. ${selectedGoal.subtitleEn}. Steps: ${selectedGoal.stepsEn.join(' Then ')}`
              )
            }
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${
              speaking
                ? 'border-amber-500 bg-amber-500 text-slate-950 animate-pulse'
                : 'border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-200'
            }`}
          >
            {speaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>
              {speaking
                ? t('Stop Voice', 'إيقاف الصوت')
                : t('🔊 Read Guide Aloud', '🔊 استمع للشرح بالصوت')}
            </span>
          </button>

          <button
            type="button"
            onClick={cycleZoom}
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 px-3.5 py-2 text-xs font-extrabold text-sky-800 dark:text-sky-200 transition cursor-pointer"
          >
            <ZoomIn className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>
              {zoomPct === 100
                ? t('A+ Enlarge Text', 'A+ تكبير حجم الخط')
                : t(`Text: ${zoomPct}%`, `الخط: ${zoomPct}%`)}
            </span>
          </button>
        </div>
      </div>

      {/* 6 Big, Clear Goal Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {goals.map((g) => {
          const Icon = g.icon;
          const isSelected = g.id === selectedGoalId;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setSelectedGoalId(g.id);
                setInstantAnswer(null);
              }}
              className={`group text-start rounded-2xl border-2 bg-gradient-to-br ${g.colorClass} p-4 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `${g.activeBorderClass} bg-background shadow-md -translate-y-0.5`
                  : 'border-border hover:border-primary/40 hover:bg-muted/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-black">
                      {isAr ? g.numberAr : g.numberEn}
                    </span>
                    <div className={`p-2.5 rounded-xl ${g.iconBgClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="rounded-full bg-background/90 border px-2.5 py-0.5 text-[11px] font-extrabold text-foreground">
                    {isAr ? g.benefitBadgeAr : g.benefitBadgeEn}
                  </span>
                </div>

                <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                  {isAr ? g.titleAr : g.titleEn}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {isAr ? g.subtitleAr : g.subtitleEn}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs font-extrabold text-primary">
                <span>
                  {isSelected
                    ? t('✓ Selected — See 3 easy steps below', '✓ تم الاختيار — شاهد الخطوات بالأسفل')
                    : t('Click to see how in 3 steps', 'اضغط هنا لعرض الخطوات المبسطة')}
                </span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isAr ? 'rotate-180' : ''}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Goal Step-by-Step Action Box */}
      <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-emerald-500/20 pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${selectedGoal.iconBgClass}`}>
              <SelectedIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                {t('Your 3 Simple Steps to Start Right Now:', '٣ خطوات بسيطة للبدء فوراً:')}
              </div>
              <h3 className="text-lg font-black text-foreground">
                {isAr ? selectedGoal.titleAr : selectedGoal.titleEn}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={selectedGoal.primaryHref}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-md transition"
            >
              <span>{isAr ? selectedGoal.primaryLabelAr : selectedGoal.primaryLabelEn}</span>
            </Link>
            <Link
              href={selectedGoal.secondaryHref}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/30 bg-background hover:bg-muted px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground transition"
            >
              <span>{isAr ? selectedGoal.secondaryLabelAr : selectedGoal.secondaryLabelEn}</span>
            </Link>
          </div>
        </div>

        {/* 1 - 2 - 3 Visual Steps */}
        <div className="grid sm:grid-cols-3 gap-3">
          {(isAr ? selectedGoal.stepsAr : selectedGoal.stepsEn).map((step, i) => (
            <div
              key={i}
              className="rounded-xl border border-emerald-500/25 bg-background p-3.5 flex items-start gap-3 shadow-2xs"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-black">
                {i + 1}
              </span>
              <div className="space-y-0.5">
                <div className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  {t(`Step ${i + 1}`, `الخطوة ${i + 1}`)}
                </div>
                <p className="text-xs sm:text-sm font-bold text-foreground leading-snug">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice & Plain-Language Instant Helper Bar */}
      <div className="rounded-2xl border bg-muted/40 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs sm:text-sm font-extrabold text-foreground">
              {t(
                'Or tell us what you need in your own words (by Voice 🎙️ or 1-Click Examples):',
                'أو أخبرنا بما تريده بطريقتك العادية (بصوتك عبر الميكروفون 🎙️ أو بضغطة زر على الأمثلة الجاهزة):'
              )}
            </span>
          </div>
        </div>

        {/* Input + Voice Mic + Send Button */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runSimpleAssistant();
              }}
              placeholder={t(
                'Type here simply (e.g., I want to export towels to Germany, or I need Giza 86 yarn)...',
                'اكتب طلبك ببساطة هنا (مثلاً: عايز أصدر فوط لألمانيا، أو عايز أشتري غزل بسعر الجملة)...'
              )}
              className="w-full rounded-xl border-2 border-primary/25 bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs sm:text-sm font-extrabold transition cursor-pointer shrink-0 ${
              listening
                ? 'border-rose-500 bg-rose-600 text-white animate-pulse'
                : 'border-amber-500/50 bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-200'
            }`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>
              {listening
                ? t('Listening... Speak now', 'جاري الاستماع... تحدث الآن')
                : t('🎙️ Speak by Voice', '🎙️ تحدث بصوتك')}
            </span>
          </button>

          <button
            type="button"
            onClick={() => runSimpleAssistant()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:opacity-95 px-5 py-3 text-xs sm:text-sm font-black text-primary-foreground shadow-sm transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{t('Guide Me Now', 'وجّهني ونفّذ لي الآن')}</span>
          </button>
        </div>

        {/* 6 One-Click Everyday Request Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-muted-foreground me-1">
            {t('1-Click Ready Requests:', 'طلبات جاهزة بضغطة واحدة:')}
          </span>
          {goals.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() =>
                runSimpleAssistant(isAr ? g.sampleQuestionAr : g.sampleQuestionEn)
              }
              className="rounded-full border bg-background hover:border-primary hover:text-primary px-3 py-1 text-[11px] font-bold text-foreground transition cursor-pointer"
            >
              {isAr ? g.titleAr : g.titleEn}
            </button>
          ))}
        </div>

        {/* Instant Plain-Language Answer Box */}
        {instantAnswer && (
          <div className="mt-3 rounded-2xl border-2 border-primary/35 bg-background p-4 space-y-3 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-black text-foreground">
                  {t(
                    'Instant Action Plan & Recommended Service:',
                    'الإجابة الفورية والخدمة الموصى بها لطلبك:'
                  )}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakText(instantAnswer)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-extrabold text-amber-800 dark:text-amber-200 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>
                    {speaking
                      ? t('Stop Reading', 'إيقاف الصوت')
                      : t('🔊 Listen to Answer', '🔊 استمع للإجابة بالصوت')}
                  </span>
                </button>
                <Link
                  href={matchedGoal.primaryHref}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-black text-white"
                >
                  <span>{isAr ? matchedGoal.primaryLabelAr : matchedGoal.primaryLabelEn}</span>
                </Link>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto pe-2">
              {instantAnswer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
