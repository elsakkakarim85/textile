import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { tr, fmtNumber, fmtMoney } from '@/lib/i18n-inline';
import { Pill, ProgressBar } from '@/components/cluster/ui';
import { InstantTopicCourseBar } from '@/components/cluster/modern/InstantTopicCourseBar';
import { InstantBrandStudioBar } from '@/components/cluster/modern/InstantBrandStudioBar';
import { InstantExportIntelligenceBar } from '@/components/cluster/modern/InstantExportIntelligenceBar';
import { InstantLeanStudioBar } from '@/components/cluster/modern/InstantLeanStudioBar';
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
  Bot,
  Megaphone,
  Globe2,
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
      '550 GSM combed Egyptian cotton terry towels & 400TCpercale hospitality bedlinen • BSCI & GOTS Certified.',
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
      title: 'Giza 86 Combed Compact Yarn Ne 40/1 • SHA-256 Verified Origin',
      price: 6.4,
    },
  },
  {
    id: 'demo-dpp-2',
    listingId: 'demo-hotel-terry',
    carbonFootprint: '2.15 kg CO2e/kg • 78% ZLD Recycled Water',
    listing: {
      id: 'demo-hotel-terry',
      title: '550 GSM Luxury Hotel Bath Towel • OEKO-TEX Made in Green',
      price: 8.9,
    },
  },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
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

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/15 via-background to-emerald-500/10 py-6 md:py-8 px-4 border-b">
        <div className="container mx-auto max-w-6xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] font-bold text-primary shadow-2xs">
            <Sparkles className="w-3 h-3" />
            {t(
              'EU • UNIDO • Egyptian Ministry of Industry — TIGARA Digital Ecosystem',
              'الاتحاد الأوروبي • اليونيدو • وزارة الصناعة — المنصة الرقمية لتجمع المحلة الكبرى (مشروع تجارة)'
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
            {t(
              'El-Mahalla El-Kubra Industrial Textile Cluster Platform',
              'المنصة المتكاملة لتجمع المحلة الكبرى لصناعة الغزل والنسيج'
            )}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t(
              'Uniting Egyptian spinning, weaving, dyeing, and garment factories to apply Lean Six Sigma & OEE, discover global export buyers across 190+ countries, pool raw-material procurement, form export consortia, and train teams on any topic with 7 free AI models.',
              'توحيد مصانع الغزل والنسيج والصباغة والملابس بالمحلة الكبرى لتطبيق التصنيع الرشيق ولين 6 سيجما، واستكشاف المشترين الدوليين في 190+ دولة، والشراء المجمع للخامات، وتشكيل التحالفات التصديرية، وتدريب الكوادر بالذكاء الاصطناعي.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5">
            <Link href={`/${locale}/cluster`}>
              <Button size="sm" className="h-9 px-4 text-xs font-bold rounded-full shadow-md shadow-primary/20">
                <Network className="w-4 h-4 me-1.5" />
                {t('Cluster Command Hub', 'مركز قيادة التجمع')}
              </Button>
            </Link>
            <Link href={`/${locale}/cluster/lean-manufacturing`}>
              <Button
                size="sm"
                className="h-9 px-4 text-xs font-bold rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-md"
              >
                <Gauge className="w-4 h-4 me-1.5" />
                {t('Lean Six Sigma & OEE Hub', 'مركز اللين 6 سيجما و OEE')}
              </Button>
            </Link>
            <Link href={`/${locale}/cluster/export-intelligence`}>
              <Button
                size="sm"
                className="h-9 px-4 text-xs font-bold rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-md"
              >
                <Globe2 className="w-4 h-4 me-1.5" />
                {t('Global Export & Buyers AI', 'ذكاء التصدير والمشترين الدوليين')}
              </Button>
            </Link>
            <Link href={`/${locale}/cluster/brand-studio`}>
              <Button
                size="sm"
                className="h-9 px-4 text-xs font-bold rounded-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white shadow-md"
              >
                <Megaphone className="w-4 h-4 me-1.5" />
                {t('AI Brand & Print Studio', 'استوديو الهوية والمطبوعات')}
              </Button>
            </Link>
            <Link href={`/${locale}/cluster/academy`}>
              <Button
                size="sm"
                className="h-9 px-4 text-xs font-bold rounded-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white shadow-md"
              >
                <GraduationCap className="w-4 h-4 me-1.5" />
                {t('Academy & AI Course Studio', 'الأكاديمية واستوديو الدورات')}
              </Button>
            </Link>
            <Link href={`/${locale}/ai`}>
              <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold rounded-full">
                <Bot className="w-4 h-4 me-1.5 text-primary" />
                {t('7-LLM AI Arena', 'مركز الذكاء الاصطناعي')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Telemetry Bar */}
      <section className="w-full py-4 bg-muted/30 border-b">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/80 border px-3 py-2 shadow-2xs">
              <Factory className="w-5 h-5 text-primary shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.factories)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Verified Factories', 'مصانع معتمدة')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/80 border px-3 py-2 shadow-2xs">
              <ShoppingCart className="w-5 h-5 text-sky-600 shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.pools)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Joint Buying Pools', 'مجموعات شراء')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/80 border px-3 py-2 shadow-2xs">
              <Handshake className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.consortia)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Export Consortia', 'تحالفات تصديرية')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/80 border px-3 py-2 shadow-2xs">
              <Package className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.products)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Active B2B Listings', 'عروض المنتجات')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/80 border px-3 py-2 shadow-2xs">
              <GraduationCap className="w-5 h-5 text-violet-600 shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.courses)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Academy Programs', 'برامج الأكاديمية')}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 rounded-xl bg-background/80 border px-3 py-2 shadow-2xs">
              <Briefcase className="w-5 h-5 text-primary shrink-0" />
              <div className="text-start">
                <div className="text-lg font-black leading-none">{fmtNumber(locale, stats.jobs)}</div>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">{t('Industrial Jobs', 'وظائف صناعية')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Any-Topic AI Lean, Export Intelligence, Course & Brand Studio Spotlights */}
      <section className="container mx-auto pt-8 px-4 space-y-5">
        <InstantLeanStudioBar locale={locale} />
        <InstantExportIntelligenceBar locale={locale} />
        <InstantTopicCourseBar locale={locale} />
        <InstantBrandStudioBar locale={locale} />
      </section>

      {/* Core Cluster Modules Grid */}
      <section className="container mx-auto py-16 px-4 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold">
            {t('Complete Industrial Cluster Operating System', 'منظومة متكاملة للتعاون الصناعي والتحديث والتصدير')}
          </h2>
          <p className="text-muted-foreground">
            {t(
              'Built specifically for El-Mahalla El-Kubra SMEs, exporters, international buyers, and the Cluster Management Organization.',
              'صُممت خصيصاً لمصانع المحلة الكبرى، والمصدرين، والمشترين الدوليين، وإدارة التجمع الصناعي.'
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              href: `/${locale}/cluster/lean-manufacturing`,
              icon: Gauge,
              title: t('Lean Management & Manufacturing Hub', 'مركز الإدارة الرشيقة والتصنيع الرشيق (Lean)'),
              desc: t('Apply Toyota Production System (TPS), Value Stream Mapping (VSM), 8 Wastes (DOWNTIME), 5S Gemba Audits, OEE/TPM, SMED Changeover, Line Balancing, Kanban Pull & A3 Reports.', 'تطبيق شامل لتدفق القيمة VSM، الفواقد الـ ٨، تدقيق 5S، مؤشر OEE و SMED، موازنة الخطوط، نظام كانبان، منع الأخطاء Poka-Yoke، وتقارير A3.'),
              badge: t('New • TPS & Six Sigma', 'جديد • اللين و 6 سيجما'),
            },
            {
              href: `/${locale}/cluster/export-intelligence`,
              icon: Globe2,
              title: t('AI Global Export Intelligence, Buyers & NTMs', 'ذكاء التصدير العالمي، المشترون والمواصفات القياسية'),
              desc: t('Generate market studies, landed-cost entry strategies, live international tenders, promotional plans, verified buyers with 5-stage outreach, and country NTM standards.', 'دراسات سوق، استراتيجيات دخول الأسواق، مناقصات دولية موثقة، خطط ترويج، كشاف المشترين الموثوقين والتواصل معهم، وتحليل المواصفات والعوائق غير الجمركية.'),
              badge: t('New • 190+ Countries', 'جديد • ١٩٠+ دولة'),
            },
            {
              href: `/${locale}/cluster/brand-studio`,
              icon: Megaphone,
              title: t('AI Brand, Marketing & Collateral Studio', 'استوديو الهوية والتسويق والمطبوعات الذكي'),
              desc: t('Create textile brands, 90-day export marketing plans, automated campaigns, promo videos, studio photos, 6-panel brochures, flyers & trade-show posters.', 'إنشاء علامات تجارية، خطط تسويق تصديرية، أتمتة حملات، وتوليد فيديوهات وصور وبروشورات وفلايرز وبوسترات للمعارض.'),
              badge: t('New • Full Studio', 'جديد • استوديو متكامل'),
            },
            {
              href: `/${locale}/cluster/procurement`,
              icon: ShoppingCart,
              title: t('Joint Procurement', 'الشراء المشترك للخامات'),
              desc: t('Pool Giza cotton yarn, reactive dyes, spare parts & solar PPA orders for bulk discounts.', 'تجميع طلبات الغزول والصبغات وقطع الغيار والطاقة للحصول على أسعار الجملة.'),
              badge: t('Save 12–18%', 'توفير ١٢–١٨٪'),
            },
            {
              href: `/${locale}/cluster/capacity`,
              icon: ArrowRightLeft,
              title: t('Capacity Exchange', 'تبادل الطاقات الإنتاجية'),
              desc: t('Subcontract idle looms, circular knitting machines, and dyeing jets across trusted peers.', 'استغلال الماكينات المتاحة أو التعاقد من الباطن مع مصانع موثوقة بالتجمع.'),
              badge: t('Smart Matching', 'تشبيك ذكي'),
            },
            {
              href: `/${locale}/cluster/consortia`,
              icon: Handshake,
              title: t('Export Consortia', 'التحالفات التصديرية'),
              desc: t('Form multi-factory alliances covering spinning to sewing to win large EU retail RFQs.', 'تشكيل تحالفات متكاملة عبر سلسلة القيمة للفوز بطلبيات التصدير الكبرى.'),
              badge: t('EU Export', 'تصدير لأوروبا'),
            },
            {
              href: `/${locale}/cluster/facilities`,
              icon: FlaskConical,
              title: t('Shared Labs & Studios', 'المعامل والمرافق المشتركة'),
              desc: t('Book ISO testing labs, 3D CAD/CAM studios, effluent treatment, and training halls.', 'حجز معمل اختبارات الجودة واستوديو التصميم CAD ومحطة المعالجة.'),
              badge: t('Hourly Booking', 'حجز فوري'),
            },
            {
              href: `/${locale}/cluster/maturity`,
              icon: Gauge,
              title: t('Industry 4.0 Maturity', 'تقييم النضج الرقمي 4.0'),
              desc: t('24-point diagnostic across 6 dimensions with a prioritized 90-day roadmap.', 'تقييم شامل عبر ٦ محاور مع خارطة طريق تنفيذية لمدة ٩٠ يوماً.'),
              badge: t('AI Roadmap', 'خارطة طريق'),
            },
            {
              href: `/${locale}/cluster/sustainability`,
              icon: Leaf,
              title: t('ESG & EU CBAM Hub', 'الاستدامة وآلية CBAM'),
              desc: t('Calculate Scope 1 & 2 CO2e intensity, ZLD water recycling, and export CBAM CSV reports.', 'حساب البصمة الكربونية وتدوير المياه وتصدير تقارير CBAM الأوروبية.'),
              badge: t('CBAM Ready', 'جاهزية CBAM'),
            },
            {
              href: `/${locale}/cluster/academy`,
              icon: GraduationCap,
              title: t('Cluster Academy & AI Course Studio', 'أكاديمية التجمع واستوديو الدورات الذكي'),
              desc: t('Generate Beginner-to-Advanced multimedia courses on any topic with QR-verifiable certificates.', 'توليد دورات تدريبية متعددة الوسائط لأي موضوع مع إصدار شهادات رقمية قابلة للتحقق.'),
              badge: t('Certified', 'شهادات معتمدة'),
            },
            {
              href: `/${locale}/cluster/funding`,
              icon: Landmark,
              title: t('Grants & Green Finance', 'التمويل والمنح الخضراء'),
              desc: t('Apply to EU/UNIDO TIGARA, EBRD, MSMEDA & IMC grants matched to your maturity gaps.', 'التقديم المباشر على منح وبرامج التمويل الأخضر المطابقة لاحتياجات مصنعك.'),
              badge: t('Matched Grants', 'تمويل مطابق'),
            },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.href} href={m.href} className="block group">
                <Card className="p-6 h-full flex flex-col hover:border-primary/50 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Pill tone="blue">{m.badge}</Pill>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{m.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{m.desc}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Live Joint Procurement & Featured Factories Preview */}
      <section className="w-full py-16 bg-muted/20 border-t">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10">
          {/* Active Joint Procurement Pools */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                {t('Live Joint Procurement Pools', 'مجموعات الشراء المشترك المفتوحة الآن')}
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
                {t('Verified Factories & EU Digital Passports (DPP)', 'المصانع المعتمدة وجواز السفر الرقمي للمنتج')}
              </h3>
              <Link href={`/${locale}/factories`} className="text-sm font-semibold text-primary hover:underline">
                {t('Directory →', 'دليل المصانع ←')}
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
                          {t('EU Digital Product Passport (ESPR Verified)', 'جواز السفر الرقمي الأوروبي الموثق')}
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
