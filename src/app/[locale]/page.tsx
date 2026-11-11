import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { tr, fmtNumber, fmtMoney } from '@/lib/i18n-inline';
import { Pill, ProgressBar } from '@/components/cluster/ui';
import { EasyGoalNavigator } from '@/components/cluster/EasyGoalNavigator';
import { UnifiedInstantStudiosSwitcher } from '@/components/cluster/modern/UnifiedInstantStudiosSwitcher';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';
import {
  Factory,
  Package,
  Briefcase,
  Network,
  ShoppingCart,
  ArrowRightLeft,
  Handshake,
  FlaskConical,
  Gauge,
  GraduationCap,
  Leaf,
  Landmark,
  ShieldCheck,
  Sparkles,
  QrCode,
  Megaphone,
  Globe2,
  Film,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const FALLBACK_HOME_POOLS = [
  {
    id: 'demo-pool-giza86',
    title: 'Giza 86 Combed Compact Ring Yarn Ne 30/1 (Export Lot)',
    titleAr: 'شراء مجمع: غزل قطن جيزة 86 ممشط كومباكت نمرة 30/1 للتصدير',
    targetUnitPrice: 215,
    currency: 'EGP',
    unit: 'kg',
    targetQty: 25000,
    commitments: [{ quantity: 19500 }],
  },
  {
    id: 'demo-pool-zdhc-dyes',
    title: 'ZDHC Level-3 Reactive Dyestuffs & Auxiliaries Bundle',
    titleAr: 'شراء مجمع: صبغات نشطة وكيماويات متوافقة مع ZDHC المستوى الثالث',
    targetUnitPrice: 340,
    currency: 'EGP',
    unit: 'kg',
    targetQty: 12000,
    commitments: [{ quantity: 8400 }],
  },
  {
    id: 'demo-pool-solar-ppa',
    title: 'Mahalla Industrial Rooftop Solar PPA & Smart Sub-Meters',
    titleAr: 'اتفاقية طاقة شمسية مجمعة وعدادات ذكية لمصانع المحلة الكبرى',
    targetUnitPrice: 1.85,
    currency: 'EGP',
    unit: 'kWh',
    targetQty: 500000,
    commitments: [{ quantity: 410000 }],
  },
];

const FALLBACK_HOME_FACTORIES = [
  {
    id: 'demo-factory-misr',
    name: 'Misr Spinning & Weaving Co. (El-Mahalla)',
    description:
      'Flagship vertical spinning, weaving, dyeing & finishing complex • Giza 86/94 ELS Cotton • ISO 9001 & OEKO-TEX® Standard 100.',
    subscriptionTier: 'ENTERPRISE',
  },
  {
    id: 'demo-factory-rowad',
    name: 'Al-Rowad Dyeing, Printing & Finishing Mill',
    description:
      'ZDHC Level-3 jet dyeing, digital reactive printing & ZLD water recycling for European home-textile & apparel brands.',
    subscriptionTier: 'PRO',
  },
  {
    id: 'demo-factory-delta',
    name: 'Delta Linen & Hotel Terry Export Mills',
    description:
      '550 GSM combed Egyptian cotton terry towels & 400TC percale hospitality bedlinen • BSCI & GOTS Certified.',
    subscriptionTier: 'PRO',
  },
];

const FALLBACK_HOME_DPPS = [
  {
    id: 'demo-dpp-1',
    listingId: 'demo-giza-yarn',
    carbonFootprint: '1.82 kg CO2e/kg • ESPR Tier-A',
    listing: {
      id: 'demo-giza-yarn',
      title: 'Giza 86 Combed Compact Yarn Ne 40/1 • Verified Origin',
      price: 6.4,
    },
  },
  {
    id: 'demo-dpp-2',
    listingId: 'demo-hotel-terry',
    carbonFootprint: '2.15 kg CO2e/kg • 78% Recycled Water',
    listing: {
      id: 'demo-hotel-terry',
      title: '550 GSM Luxury Hotel Bath Towel • OEKO-TEX Made in Green',
      price: 8.9,
    },
  },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  let stats = {
    factories: 6,
    products: 12,
    jobs: 6,
    pools: 4,
    consortia: 3,
    courses: 8,
    featuredFactories: FALLBACK_HOME_FACTORIES as any[],
    activePools: FALLBACK_HOME_POOLS as any[],
    dppPassports: FALLBACK_HOME_DPPS as any[],
  };

  try {
    const [factories, products, jobs, pools, consortia, courses, featuredFactories, activePools, dppPassports] =
      await Promise.all([
        prisma.factory.count({ where: { status: 'APPROVED', deletedAt: null } }),
        prisma.marketplaceListing.count({ where: { status: 'ACTIVE' } }),
        prisma.jobPosting.count({ where: { status: 'ACTIVE' } }),
        prisma.procurementPool.count({ where: { status: { in: ['OPEN', 'NEGOTIATING'] } } }),
        prisma.consortium.count({ where: { status: { not: 'CLOSED' } } }),
        prisma.course.count({ where: { isPublished: true } }),
        prisma.factory.findMany({
          where: { status: 'APPROVED', deletedAt: null },
          take: 3,
          orderBy: { createdAt: 'asc' },
        }),
        prisma.procurementPool.findMany({
          where: { status: 'OPEN' },
          include: { commitments: { where: { status: { in: ['COMMITTED', 'CONFIRMED'] } } } },
          take: 3,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.productPassport.findMany({
          include: { listing: { select: { id: true, title: true, price: true } } },
          take: 2,
        }),
      ]);
    stats = {
      factories: factories || 6,
      products: products || 12,
      jobs: jobs || 6,
      pools: pools || 4,
      consortia: consortia || 3,
      courses: courses || 8,
      featuredFactories: featuredFactories.length > 0 ? featuredFactories : FALLBACK_HOME_FACTORIES,
      activePools: activePools.length > 0 ? activePools : FALLBACK_HOME_POOLS,
      dppPassports: dppPassports.length > 0 ? dppPassports : FALLBACK_HOME_DPPS,
    };
  } catch (e) {
    console.error('Failed to fetch homepage stats', e);
  }

  const categorizedSections = [
    {
      stepNumber: isAr ? 'القسم ١' : 'Section 1',
      title: t(
        'Buy Raw Materials Cheaper & Share Factory Machines',
        '١. شراء الخامات بسعر الجملة وتشغيل الماكينات المتاحة'
      ),
      subtitle: t(
        'Save money on yarn and dyes, rent out idle machines, or partner with other Mahalla mills.',
        'وفّر في شراء الغزل والصبغات، وشغّل ماكيناتك الفائضة، أو تحالف مع مصانع المحلة.'
      ),
      accentBorder: 'border-sky-500/35',
      items: [
        {
          href: `/${locale}/cluster/procurement`,
          manualId: 'procurement',
          icon: ShoppingCart,
          title: t('Joint Buying at Wholesale Prices', 'الشراء المجمع للخامات بسعر الجملة'),
          desc: t(
            'Join other factories to buy cotton yarn, dyes, and chemicals together and save 12% to 18%.',
            'اشترك مع مصانع المحلة في شراء الغزول والصبغات وقطع الغيار بكميات مجمعة للحصول على خصم المصنع.'
          ),
          benefit: t('Save 12–18% on Cost', 'توفير ١٢–١٨٪ من السعر'),
          tone: 'blue' as const,
        },
        {
          href: `/${locale}/cluster/capacity`,
          manualId: 'capacity',
          icon: ArrowRightLeft,
          title: t('Rent Idle Machines & Subcontracting', 'تبادل ساعات تشغيل الماكينات'),
          desc: t(
            'Have idle looms, dyeing jets, or sewing lines? List them here or book trusted partner machines.',
            'اعرض ساعات التشغيل الفائضة بماكيناتك لتحقيق دخل إضافي، أو احجز تشغيل لدى مصنع موثوق.'
          ),
          benefit: t('Fill Idle Machines', 'تشغيل الماكينات المتوقفة'),
          tone: 'emerald' as const,
        },
        {
          href: `/${locale}/cluster/consortia`,
          manualId: 'consortia',
          icon: Handshake,
          title: t('Export Alliances Between Factories', 'التحالفات التصديرية بين المصانع'),
          desc: t(
            'Combine spinning, weaving, dyeing, and sewing factories to win large export orders together.',
            'تعاون مع عدة مصانع مكملة لك للفوز بطلبيات تصدير كبرى لا يكفيها مصنع واحد بمفرده.'
          ),
          benefit: t('Win Big Orders', 'الفوز بطلبيات كبرى'),
          tone: 'amber' as const,
        },
      ],
    },
    {
      stepNumber: isAr ? 'القسم ٢' : 'Section 2',
      title: t(
        'Export Globally, Find Foreign Buyers & Create Videos',
        '٢. التصدير للخارج، إيجاد المشترين، وعمل فيديوهات وإعلانات'
      ),
      subtitle: t(
        'Discover real foreign buyers, calculate shipping & customs, and create factory videos & catalogs in 1 click.',
        'اعرف أفضل الدول لتصدير منتجك، وتواصل مع المشترين، واصنع فيديو وكتالوج لمصنعك بضغطة زر.'
      ),
      accentBorder: 'border-emerald-500/35',
      items: [
        {
          href: `/${locale}/cluster/export-intelligence`,
          manualId: 'export-intelligence',
          icon: Globe2,
          title: t('Find Foreign Buyers & Export Markets', 'كشاف المشترين الدوليين ودراسات التصدير'),
          desc: t(
            'See best export countries, verified foreign buyers, live tenders, and ready WhatsApp/Email messages.',
            'اعرف أفضل الأسواق لمنتجك، وقوائم المشترين الموثقين والمناقصات الدولية، ورسائل التواصل الجاهزة.'
          ),
          benefit: t('190+ Export Markets', 'مشترون في ١٩٠+ دولة'),
          tone: 'emerald' as const,
        },
        {
          href: `/${locale}/cluster/media-studio`,
          manualId: 'ai-media-studio',
          icon: Film,
          title: t('Create Factory Video & Product Photos', 'استوديو عمل فيديوهات وصور المنتجات'),
          desc: t(
            'Create an HD .MP4 commercial video with voiceover, burned-in subtitles, and 4 studio photos in 1 click.',
            'توليد فيديو دعائي MP4 بالصوت والترجمة المكتوبة + ٤ صور احترافية لمنتجات مصنعك بضغطة زر.'
          ),
          benefit: t('Instant MP4 Video', 'فيديو MP4 بالصوت والترجمة'),
          tone: 'purple' as const,
        },
        {
          href: `/${locale}/cluster/brand-studio`,
          manualId: 'brand-studio',
          icon: Megaphone,
          title: t('Create Printable Catalog, Brochure & Brand', 'تصميم كتالوج وبروشور وهوية المصنع'),
          desc: t(
            'Generate your factory brand identity, printable 6-panel brochure, flyer, poster, and marketing plan.',
            'إنشاء هوية تجارية كاملة لمصنعك مع بروشور وفلاير وبوستر جاهز للطباعة والنشر على واتساب.'
          ),
          benefit: t('Ready-to-Print Catalog', 'كتالوج وبروشور جاهز للطباعة'),
          tone: 'amber' as const,
        },
      ],
    },
    {
      stepNumber: isAr ? 'القسم ٣' : 'Section 3',
      title: t(
        'Reduce Factory Waste, Test Quality & Save Energy',
        '٣. تقليل الهالك والأعطال، فحص الجودة، وتوفير الطاقة'
      ),
      subtitle: t(
        'Practical tools to cut fabric defects, reduce machine stops, test yarn/fabric quality, and prepare EU certificates.',
        'أدوات عملية مبسطة لخفض عيوب الإنتاج، وحجز معامل الفحص، وتقليل فاتورة الكهرباء والمياه.'
      ),
      accentBorder: 'border-amber-500/35',
      items: [
        {
          href: `/${locale}/cluster/lean-manufacturing`,
          manualId: 'lean-manufacturing',
          icon: Gauge,
          title: t('Reduce Waste & Machine Breakdowns (Lean)', 'برنامج تقليل الهالك والأعطال وتحسين الإنتاج'),
          desc: t(
            'Simple calculators and action plans to stop fabric defects, speed up changeovers, and boost machine output.',
            'حاسبات وخطط عملية بسيطة لتقليل عيوب النسيج والصباغة وتقليل وقت توقف الماكينات وتغيير الأصناف.'
          ),
          benefit: t('Cut Waste & Cost', 'تقليل الهالك والتكلفة'),
          tone: 'emerald' as const,
        },
        {
          href: `/${locale}/cluster/facilities`,
          manualId: 'facilities',
          icon: FlaskConical,
          title: t('Book Shared Quality Labs & Design Studios', 'حجز معامل اختبارات الجودة واستوديو التصميم'),
          desc: t(
            'Book ISO yarn/fabric testing labs, 3D pattern design studios, and training rooms by the hour.',
            'احجز بالساعة في معمل فحص الخيوط والأقمشة واستوديو التصميم الرقمي بتكلفة مدعمة لأعضاء التجمع.'
          ),
          benefit: t('Certified Lab Tests', 'فحص جودة معتمد بالساعة'),
          tone: 'blue' as const,
        },
        {
          href: `/${locale}/cluster/sustainability`,
          manualId: 'sustainability',
          icon: Leaf,
          title: t('Energy Savings & EU Export Certificate (CBAM)', 'توفير الطاقة والمياه وشهادة التصدير لأوروبا'),
          desc: t(
            'Calculate electricity, water, and carbon savings simply, and download the EU CBAM export report.',
            'احسب استهلاك الكهرباء والمياه لمصنعك وحمّل شهادة البصمة الكربونية المطلوبة للتصدير لأوروبا.'
          ),
          benefit: t('EU Export Ready', 'شهادة التصدير الأوروبية'),
          tone: 'emerald' as const,
        },
      ],
    },
    {
      stepNumber: isAr ? 'القسم ٤' : 'Section 4',
      title: t(
        'Train Workers, Get Factory Grants & Assess Readiness',
        '٤. تدريب العمال، الحصول على المنح والتمويل، وتقييم المصنع'
      ),
      subtitle: t(
        'Apply for grants and low-interest loans, train your workers on any skill, and get a 90-day factory upgrade plan.',
        'احصل على منح وقروض ميسرة لتحديث الماكينات، ودرّب عمالك ومهندسيك بشهادات معتمدة.'
      ),
      accentBorder: 'border-violet-500/35',
      items: [
        {
          href: `/${locale}/cluster/funding`,
          manualId: 'funding',
          icon: Landmark,
          title: t('Factory Grants & Low-Interest Green Loans', 'المنح المجانية والقروض الميسرة للمصانع'),
          desc: t(
            'Apply for EU/UNIDO TIGARA, EBRD, and MSMEDA grants and loans to upgrade machines and install solar.',
            'قدم بسهولة على منح الاتحاد الأوروبي واليونيدو والقروض الميسرة لتحديث الماكينات والطاقة الشمسية.'
          ),
          benefit: t('Direct Funding Support', 'منح وتمويل لتحديث المصنع'),
          tone: 'amber' as const,
        },
        {
          href: `/${locale}/cluster/academy`,
          manualId: 'academy',
          icon: GraduationCap,
          title: t('Worker & Engineer Training Academy', 'أكاديمية تدريب العمال والمهندسين'),
          desc: t(
            'Ready practical courses or generate any custom training course in 1 click with audio and QR certificates.',
            'دورات عملية جاهزة أو أنشئ أي دورة تدريبية لعمال مصنعك بضغطة زر مع شرح صوتي وشهادة معتمدة.'
          ),
          benefit: t('Free Certificates', 'تدريب مجاني وشهادات QR'),
          tone: 'purple' as const,
        },
        {
          href: `/${locale}/cluster/maturity`,
          manualId: 'maturity',
          icon: CheckCircle2,
          title: t('Simple Factory Assessment & 90-Day Plan', 'التقييم السريع للمصنع وخطة التطوير'),
          desc: t(
            'Answer 6 simple questions about your factory to get your readiness score and a clear 90-day upgrade plan.',
            'أجب عن أسئلة مبسطة خلال دقيقتين لتحصل على تقييم شامل لمصنعك وخطة تطوير عملية لمدة ٩٠ يوماً.'
          ),
          benefit: t('2-Minute Checkup', 'خطة تطوير في دقيقتين'),
          tone: 'blue' as const,
        },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Welcoming Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/15 via-background to-emerald-500/10 py-6 md:py-8 px-4 border-b">
        <div className="container mx-auto max-w-6xl text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              {t(
                'EU • UNIDO • Egyptian Ministry of Industry — TIGARA Digital Ecosystem',
                'الاتحاد الأوروبي • اليونيدو • وزارة الصناعة — المنصة الرقمية لتجمع المحلة الكبرى (مشروع تجارة)'
              )}
            </div>
            <ExpertManualButton manualId="platform-home" locale={locale} variant="mini" />
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
            {t(
              'El-Mahalla El-Kubra Textile Cluster — Easy Platform for Every Factory',
              'منصة تجمع المحلة الكبرى للغزل والنسيج — مصممة بسهولة لخدمة كل مصنع'
            )}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t(
              'Whether you want to buy yarn cheaper, find export buyers abroad, rent out idle machines, create a factory video, or train your workers — everything works in 3 simple clicks or by speaking with your voice.',
              'سواء كنت تريد شراء الغزول والخامات بسعر الجملة، أو تصدير منتجاتك للخارج، أو تشغيل ماكيناتك المتوقفة، أو عمل فيديو وكتالوج لمصنعك، أو تدريب عمالك — كل خدمة تعمل في ٣ خطوات بسيطة أو بالتحدث بصوتك مباشرة.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Link href={`/${locale}/cluster`}>
              <Button size="sm" className="h-10 px-5 text-xs sm:text-sm font-black rounded-full shadow-md shadow-primary/20">
                <Network className="w-4 h-4 me-1.5" />
                {t('All Factory Services (Cluster Hub)', 'جميع خدمات المصانع (المركز الرئيسي)')}
              </Button>
            </Link>
            <Link href={`/${locale}/marketplaces/products`}>
              <Button
                size="sm"
                className="h-10 px-5 text-xs sm:text-sm font-black rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                <ShoppingCart className="w-4 h-4 me-1.5" />
                {t('Buy & Sell Marketplace', 'سوق البيع والشراء والخامات')}
              </Button>
            </Link>
            <Link href={`/${locale}/cluster/export-intelligence`}>
              <Button
                size="sm"
                className="h-10 px-5 text-xs sm:text-sm font-black rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              >
                <Globe2 className="w-4 h-4 me-1.5" />
                {t('Find Foreign Buyers', 'إيجاد مشترين للتصدير')}
              </Button>
            </Link>
            <Link href={`/${locale}/cluster/media-studio`}>
              <Button
                size="sm"
                className="h-10 px-5 text-xs sm:text-sm font-black rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-md"
              >
                <Film className="w-4 h-4 me-1.5" />
                {t('Create Factory Video & Photos', 'عمل فيديو وصور لمصنعك')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Cluster Telemetry Bar */}
      <section className="w-full py-3.5 bg-muted/30 border-b">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-center">
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/90 border px-3 py-2 shadow-2xs">
              <Factory className="w-5 h-5 text-primary shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.factories)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Verified Factories', 'مصانع معتمدة')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/90 border px-3 py-2 shadow-2xs">
              <ShoppingCart className="w-5 h-5 text-sky-600 shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.pools)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Joint Buying Pools', 'مجموعات شراء بالجملة')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/90 border px-3 py-2 shadow-2xs">
              <Handshake className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.consortia)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Export Alliances', 'تحالفات تصديرية')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/90 border px-3 py-2 shadow-2xs">
              <Package className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.products)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Products & Yarns', 'عروض المنتجات والغزول')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/90 border px-3 py-2 shadow-2xs">
              <GraduationCap className="w-5 h-5 text-violet-600 shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.courses)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Training Courses', 'دورات تدريبية')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/90 border px-3 py-2 shadow-2xs">
              <Briefcase className="w-5 h-5 text-primary shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.jobs)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Factory Jobs', 'وظائف بالمصانع')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Interactive Goal Navigator (Built for Any Tech Level + Voice Input) */}
      <section className="container mx-auto pt-8 px-4">
        <EasyGoalNavigator locale={locale} />
      </section>

      {/* 1-Click Smart Factory Generators (Collapsible 4-Tab Switcher) */}
      <section className="container mx-auto pt-6 px-4">
        <UnifiedInstantStudiosSwitcher locale={locale} />
      </section>

      {/* Categorized 4-Pillar Platform Directory */}
      <section className="container mx-auto py-12 px-4 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black">
            {t(
              'All Platform Services — Organized Clearly in 4 Sections',
              'جميع خدمات المنصة — مقسمة بوضوح في ٤ أقسام حسب احتياجك'
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(
              'Click any card below to open the service. Every page includes a voice explanation and a 3-step visual guide.',
              'اضغط على أي بطاقة لفتح الخدمة مباشرة. ستجد داخل كل صفحة شرحاً صوتياً وخطوات مبسطة ١ ← ٢ ← ٣.'
            )}
          </p>
        </div>

        <div className="space-y-8">
          {categorizedSections.map((sec) => (
            <div
              key={sec.title}
              className={`rounded-3xl border-2 ${sec.accentBorder} bg-card/60 p-5 sm:p-6 space-y-4`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-foreground">{sec.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{sec.subtitle}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary shrink-0 self-start sm:self-center">
                  {sec.stepNumber}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sec.items.map((m) => {
                  const Icon = m.icon;
                  return (
                    <Link key={m.href} href={m.href} className="block group">
                      <Card className="p-5 h-full flex flex-col justify-between hover:border-primary/60 hover:shadow-md transition-all">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Pill tone={m.tone}>{m.benefit}</Pill>
                              <ExpertManualButton manualId={m.manualId} locale={locale} variant="icon" />
                            </div>
                          </div>
                          <h4 className="text-base font-black mb-1.5 group-hover:text-primary transition-colors">
                            {m.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {m.desc}
                          </p>
                        </div>

                        <div className="mt-4 pt-2.5 border-t flex items-center justify-between text-xs font-extrabold text-primary">
                          <span>{t('Open Service Now', 'افتح الخدمة الآن')}</span>
                          <ArrowRight className={`w-4 h-4 transition-transform ${isAr ? 'rotate-180' : ''}`} />
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Joint Procurement & Featured Factories Preview */}
      <section className="w-full py-12 bg-muted/20 border-t">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10">
          {/* Active Joint Procurement Pools */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                {t('Open Wholesale Buying Groups Right Now', 'مجموعات الشراء بالجملة المفتوحة حالياً')}
              </h3>
              <Link href={`/${locale}/cluster/procurement`} className="text-sm font-semibold text-primary hover:underline">
                {t('View All →', 'عرض الكل ←')}
              </Link>
            </div>
            <div className="space-y-3">
              {stats.activePools.map((p: any) => {
                const committed = (p.commitments || []).reduce((s: number, c: any) => s + Number(c.quantity), 0);
                const pct = Math.min(100, Math.round((committed / Math.max(1, Number(p.targetQty))) * 100));
                return (
                  <Link key={p.id} href={`/${locale}/cluster/procurement/${p.id}`} className="block">
                    <Card className="p-4 hover:border-primary/50 transition-colors space-y-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-sm">{locale === 'ar' ? p.titleAr || p.title : p.title}</span>
                        <Pill tone="emerald">
                          {fmtMoney(locale, Number(p.targetUnitPrice || 0), p.currency)}/{p.unit}
                        </Pill>
                      </div>
                      <ProgressBar value={pct} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {fmtNumber(locale, committed)} / {fmtNumber(locale, p.targetQty)} {p.unit}
                        </span>
                        <span className="font-semibold text-primary">{pct}%</span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Verified Factories & Digital Product Passports */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                {t('Verified Mahalla Factories & Export Passports', 'المصانع المعتمدة وشهادات التصدير الأوروبية')}
              </h3>
              <Link href={`/${locale}/factories`} className="text-sm font-semibold text-primary hover:underline">
                {t('Factories Directory →', 'دليل المصانع ←')}
              </Link>
            </div>
            <div className="space-y-3">
              {stats.featuredFactories.map((f: any) => (
                <Link key={f.id} href={`/${locale}/factories/${f.id}`} className="block">
                  <Card className="p-4 hover:border-primary/50 transition-colors flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1.5">
                        {f.name}
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{f.description}</p>
                    </div>
                    <Pill tone="blue">{f.subscriptionTier}</Pill>
                  </Card>
                </Link>
              ))}
              {stats.dppPassports.map((dpp: any) => (
                <Link key={dpp.id} href={`/${locale}/dpp/${dpp.listingId}`} className="block">
                  <Card className="p-4 border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500 transition-colors flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <QrCode className="w-6 h-6 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          {t('EU Digital Product Passport (Verified Origin)', 'جواز المنتج الرقمي الأوروبي الموثق')}
                        </div>
                        <div className="font-semibold text-sm">{dpp.listing?.title}</div>
                      </div>
                    </div>
                    <Pill tone="emerald">{dpp.carbonFootprint}</Pill>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
