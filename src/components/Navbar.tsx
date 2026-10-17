"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ThemeToggle } from './ThemeToggle';
import { NotificationsDropdown } from './NotificationsDropdown';
import { PersonaSwitcher } from './PersonaSwitcher';
import { tr } from '@/lib/i18n-inline';
import {
  Menu,
  X,
  Network,
  BarChart3,
  Building2,
  ShoppingBag,
  Sparkles,
  Briefcase,
  Recycle,
  GraduationCap,
  Megaphone,
  Globe2,
  Gauge,
  ChevronDown,
  ShoppingCart,
  ArrowRightLeft,
  Handshake,
  FlaskConical,
  Leaf,
  Landmark,
  MessagesSquare,
  CalendarDays,
  UserCheck,
  ShieldCheck,
  Ship,
  Package,
  FileText,
  BookOpen,
  Wrench,
  LayoutDashboard,
} from 'lucide-react';

interface NavSubItem {
  href: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  accent?: 'emerald' | 'blue' | 'amber' | 'purple';
}

interface NavCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  columns?: 1 | 2;
  items: NavSubItem[];
}

export default function Navbar({ locale }: { locale: string }) {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>('excellence');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const t = (en: string, ar: string) => tr(locale, en, ar);

  // Close menus on route change
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLocale = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    window.location.href = newPath;
  };

  const categories: NavCategory[] = [
    {
      id: 'excellence',
      label: t('Industrial Excellence', 'التميز الصناعي والتحديث'),
      icon: Gauge,
      columns: 1,
      items: [
        {
          href: `/${locale}/cluster/lean-manufacturing`,
          label: t('Lean Six Sigma & OEE Suite', 'التصنيع الرشيق ولين 6 سيجما'),
          desc: t(
            '9-Pillar VSM, 5S, OEE, SMED, Poka-Yoke, Six Sigma Cpk & A3 Kaizen Studio',
            'منظومة اللين: خريطة القيمة، 5S، كفاءة المعدات OEE، SMED، بوكا يوكي، و6 سيجما'
          ),
          icon: Gauge,
          badge: t('9 Pillars', '9 ركائز'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/maturity`,
          label: t('Industry 4.0 Digital Maturity', 'تقييم النضج الرقمي والصناعة 4.0'),
          desc: t(
            '6-Dimension diagnostic radar & prioritized 90-day modernization roadmap',
            'تشخيص رقمي عبر 6 أبعاد مع خارطة طريق تطويرية لمدة 90 يوماً'
          ),
          icon: BarChart3,
        },
        {
          href: `/${locale}/cluster/sustainability`,
          label: t('ESG, Carbon & EU CBAM Readiness', 'الاستدامة والبصمة الكربونية CBAM'),
          desc: t(
            'Scope 1/2 CO2e calculator, water intensity, ZDHC & EU compliance',
            'حاسبة انبعاثات الكربون وكثافة المياه والتوافق مع اشتراطات الاتحاد الأوروبي'
          ),
          icon: Leaf,
          badge: 'CBAM',
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/funding`,
          label: t('Grants, Subsidies & Green Finance', 'التمويل والمنح الصناعية الخضراء'),
          desc: t(
            'UNIDO/TIGARA technical assistance, EBRD GEFF, MSMEDA & IMC grants',
            'منح مشروع تجارة والبنك الأوروبي EBRD وجهاز تنمية المشروعات ومركز تحديث الصناعة'
          ),
          icon: Landmark,
        },
        {
          href: `/${locale}/dpp/demo-giza-yarn`,
          label: t('EU Digital Product Passport (DPP)', 'جواز المنتج الرقمي الأوروبي (DPP)'),
          desc: t(
            'Cryptographic SHA-256 origin, carbon & Six Sigma quality traceability',
            'شهادة التتبع الرقمي الموثقة للمنشأ والبصمة الكربونية وجودة التصدير لأوروبا'
          ),
          icon: ShieldCheck,
          badge: 'ESPR',
          accent: 'blue',
        },
      ],
    },
    {
      id: 'trade',
      label: t('Marketplaces & Export', 'البورصات والتصدير'),
      icon: Globe2,
      columns: 2,
      items: [
        {
          href: `/${locale}/cluster/export-intelligence`,
          label: t('Global Export & Buyers AI Hub', 'ذكاء التصدير والمشترين الدوليين'),
          desc: t(
            'Market studies, verified international buyers, export tenders & NTM tariffs',
            'دراسات الأسواق، قاعدة المشترين المعتمدين، المناقصات الدولية، وتحليل الجمارك'
          ),
          icon: Globe2,
          badge: t('Flagship AI', 'رائد'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/factories`,
          label: t('Verified Factories Directory', 'دليل المصانع المعتمدة بالمحلة'),
          desc: t(
            '520+ spinning, weaving, knitting, dyeing & garment mills with KYC badges',
            'أكثر من 520 مصنع غزل ونسيج وتريكو وصباغة وملابس موثق'
          ),
          icon: Building2,
        },
        {
          href: `/${locale}/marketplaces/products`,
          label: t('Finished Products Marketplace', 'سوق المنتجات النهائية والغزول'),
          desc: t(
            'Export-grade Giza yarns, fabrics, hotel bedlinen & terry towels',
            'غزول قطن جيزة، أقمشة، مفروشات فندقية، ووبريات جاهزة للتصدير'
          ),
          icon: ShoppingBag,
        },
        {
          href: `/${locale}/marketplaces/resources`,
          label: t('Raw Materials & Dyestuffs', 'سوق الخامات والكيماويات وقطع الغيار'),
          desc: t(
            'Giza lint, ZDHC reactive dyes, auxiliaries & loom spare parts',
            'أقطان خام، صبغات نشطة، كيماويات مساعدة، وقطع غيار الأنوال'
          ),
          icon: Package,
        },
        {
          href: `/${locale}/marketplaces/waste`,
          label: t('Circular Waste & GRS Exchange', 'بورصة العوادم والتدوير الدائري'),
          desc: t(
            'Sorted comber noil, cutting clips & 5S Red-Tag salvage with CO2e metrics',
            'عوادم تمشيط وقصاقيص مفروزة للتدوير مع حاسبة وفر الكربون والمياه'
          ),
          icon: Recycle,
          badge: 'GRS',
          accent: 'emerald',
        },
        {
          href: `/${locale}/marketplaces/matchmaking`,
          label: t('B2B RFQ Matchmaking & Tenders', 'مناقصات التوريد وطلبات الأسعار (RFQ)'),
          desc: t(
            'Post sourcing specs or submit AI-assisted factory quotations',
            'انشر مواصفات طلبيتك أو قدم عروض أسعار فنية ومالية من مصنعك'
          ),
          icon: FileText,
        },
        {
          href: `/${locale}/services/logistics`,
          label: t('Incoterms 2020 Freight & Duty Simulator', 'محاكي الشحن والجمارك (Incoterms)'),
          desc: t(
            'EXW/FOB/CIF/DDP container freight & EUR.1 / QIZ duty savings calculator',
            'حاسبة تكلفة الحاويات البحرية والجوية والوفر الجمركي لاتفاقيات التجارة'
          ),
          icon: Ship,
          accent: 'blue',
        },
        {
          href: `/${locale}/dashboard/contracts`,
          label: t('Smart Milestone Escrow (30/40/30)', 'عقود الضمان الذكية (30/40/30)'),
          desc: t(
            'CBE-regulated milestone payment protection for buyers & mills',
            'حماية المدفوعات التصديرية بنظام الدفعات المرحلية الموثقة'
          ),
          icon: ShieldCheck,
        },
      ],
    },
    {
      id: 'collaboration',
      label: t('Cluster Collaboration', 'التعاون الصناعي'),
      icon: Handshake,
      columns: 1,
      items: [
        {
          href: `/${locale}/cluster/procurement`,
          label: t('Joint Procurement Pools', 'الشراء المجمع للخامات والطاقة'),
          desc: t(
            'Aggregate SME demand for Giza yarn, reactive dyes & solar PPA (12–15% savings)',
            'تجميع طلبات المصانع لشراء الغزول والصبغات والطاقة بخصومات تصل إلى 15%'
          ),
          icon: ShoppingCart,
          badge: t('Save 14%', 'وفر 14%'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/capacity`,
          label: t('Idle Capacity & Subcontracting', 'تبادل الطاقات التشغيلية الفائضة'),
          desc: t(
            'Smart matching between idle looms/dyehouses and urgent overflow orders',
            'مطابقة ذكية بين ساعات التشغيل الفائضة بالمصانع وطلبات التشغيل للغير'
          ),
          icon: ArrowRightLeft,
        },
        {
          href: `/${locale}/cluster/consortia`,
          label: t('Multi-Factory Export Consortia', 'التحالفات التصديرية المشتركة'),
          desc: t(
            'Combine spinning, weaving, dyeing & sewing SMEs to win mega export RFQs',
            'تكوين تكتلات تصديرية متكاملة من عدة مصانع للفوز بالمناقصات الدولية الكبرى'
          ),
          icon: Handshake,
        },
        {
          href: `/${locale}/cluster/facilities`,
          label: t('Shared Labs, CAD & ZLD Facilities', 'حجز المعامل والمرافق المشتركة'),
          desc: t(
            'Book ISO 17025 testing labs, 3D CAD studio & effluent treatment slots',
            'حجز فوري لمعامل الفحص المعتمدة واستوديو التصميم ومحطة معالجة المياه'
          ),
          icon: FlaskConical,
        },
        {
          href: `/${locale}/services`,
          label: t('Industrial Support Services', 'سوق الخدمات الصناعية المساندة'),
          desc: t(
            'Accredited labs, TPM maintenance contractors, packaging & certifiers',
            'مقدمو خدمات الصيانة، الفحص المعملي، التغليف، وشهادات الأيزو والأيكوتكس'
          ),
          icon: Wrench,
        },
      ],
    },
    {
      id: 'ai_academy',
      label: t('AI Studios & Academy', 'الذكاء الاصطناعي والأكاديمية'),
      icon: Sparkles,
      columns: 1,
      items: [
        {
          href: `/${locale}/ai`,
          label: t('Multi-LLM AI Command Center & Arena', 'مركز الذكاء الاصطناعي المتعدد والمقارنة'),
          desc: t(
            'Groq Llama 3.3 70B, Gemini 2.5, DeepSeek R1, Qwen 72B & Side-by-Side Arena',
            'استشر 7 نماذج ذكاء اصطناعي مجانية وقارن بينها جنباً إلى جنب'
          ),
          icon: Sparkles,
          badge: t('7 Free LLMs', '7 نماذج'),
          accent: 'purple',
        },
        {
          href: `/${locale}/cluster/academy`,
          label: t('Cluster Academy & AI Course Studio', 'الأكاديمية واستوديو الدورات الذكي'),
          desc: t(
            'Generate 3-tier technical courses on any topic + verifiable MC-* certificates',
            'توليد دورات تدريبية هندسية من 3 مستويات بالذكاء الاصطناعي مع شهادات معتمدة'
          ),
          icon: GraduationCap,
          badge: t('AI Studio', 'استوديو'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/brand-studio`,
          label: t('AI Brand, Marketing & Print Studio', 'استوديو الهوية والتسويق والمطبوعات'),
          desc: t(
            'SVG logos, 90-day marketing plans, brochures, flyers & trade-show roll-ups',
            'تصميم الشعارات، خطط التسويق، البروشورات، ورول أب المعارض الدولية'
          ),
          icon: Megaphone,
          accent: 'amber',
        },
        {
          href: `/${locale}/dashboard/knowledge`,
          label: t('Industrial RAG Knowledge Base', 'قاعدة المعرفة الهندسية والقياسية (RAG)'),
          desc: t(
            'Semantic pgvector search across AATCC, ISO, ZDHC & Lean SMED playbooks',
            'بحث دلالي ذكي في المراجع القياسية لأعمال الصباغة والنسيج واللين'
          ),
          icon: BookOpen,
        },
      ],
    },
    {
      id: 'ecosystem',
      label: t('Observatory & Community', 'المرصد والمجتمع'),
      icon: BarChart3,
      columns: 1,
      items: [
        {
          href: `/${locale}/cluster/observatory`,
          label: t('Cluster Observatory & Peer Benchmark', 'مرصد التجمع ومقارنة الأداء'),
          desc: t(
            'Executive macro KPIs, capacity heatmaps, CO2e trends & factory percentiles',
            'لوحة المؤشرات الكلية للتجمع، خرائط الطاقة الإنتاجية، وترتيب مصنعك بين الأقران'
          ),
          icon: BarChart3,
          badge: t('Live KPIs', 'مباشر'),
          accent: 'blue',
        },
        {
          href: `/${locale}/recruitment`,
          label: t('Industrial Recruitment & ILUO Jobs', 'بوابة التوظيف الصناعي والمهندسين'),
          desc: t(
            'Textile engineering & technician roles with AI applicant pitch generator',
            'وظائف مهندسي وفنيي الغزل والنسيج والصباغة مع مساعد التقديم الذكي'
          ),
          icon: Briefcase,
        },
        {
          href: `/${locale}/cluster/experts`,
          label: t('Verified Experts & Free Mentorship', 'دليل الخبراء والإرشاد الصناعي'),
          desc: t(
            'Connect with Master Black Belts, dyeing chemists & EU export consultants',
            'تواصل مع خبراء اللين 6 سيجما وكيمياء الصباغة والتصدير الدولي'
          ),
          icon: UserCheck,
        },
        {
          href: `/${locale}/cluster/forum`,
          label: t('Technical Q&A Forum', 'المنتدى الفني وتبادل الخبرات'),
          desc: t(
            'Peer troubleshooting on yarn quality, dyeing RFT, loom maintenance & CBAM',
            'نقاشات هندسية وحلول مجربة لمشكلات الغزل والصباغة وصيانة الأنوال'
          ),
          icon: MessagesSquare,
        },
        {
          href: `/${locale}/cluster/events`,
          label: t('Workshops, Trade Fairs & Events', 'الفعاليات والمعارض وورش العمل'),
          desc: t(
            'B2B matchmaking days, Heimtextil delegations & 1-click .ICS calendar sync',
            'أيام التشبيك التجاري، بعثات المعارض الدولية، والندوات التدريبية'
          ),
          icon: CalendarDays,
        },
        {
          href: `/${locale}/cluster/announcements`,
          label: t('Official PMO Bulletins', 'التعميمات والنشرات الرسمية'),
          desc: t(
            'Cluster governance updates, subsidy deadlines & export alerts',
            'إعلانات إدارة التجمع ومواعيد التقديم على المنح والبعثات التصديرية'
          ),
          icon: Megaphone,
        },
      ],
    },
  ];

  const isCategoryActive = (cat: NavCategory) =>
    cat.items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'));

  return (
    <div ref={navRef} className="flex flex-col w-full sticky top-0 z-50">
      {/* Compact TIGARA Sponsorship Banner */}
      <div className="w-full bg-white border-b py-1.5 md:py-2 flex justify-center items-center px-4">
        <img
          src="/tigara-logos.png"
          alt="TIGARA Project Partners: EU, UNIDO, Egyptian Government"
          className="h-10 md:h-12 object-contain"
        />
      </div>

      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 shadow-xs">
        <div className="container mx-auto px-4 h-15 flex items-center justify-between gap-3">
          {/* Left: Brand + 5 Categorized Mega-Menus */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Link
              href={`/${locale}`}
              className="text-lg md:text-xl font-extrabold text-primary whitespace-nowrap flex items-center gap-2 pe-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('Mahalla Cluster', 'تجمع المحلة')}
            </Link>

            {/* Desktop Categorized Navigation */}
            <div className="hidden xl:flex items-center gap-1">
              {/* Direct Hub Pill */}
              <Link
                href={`/${locale}/cluster`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  pathname === `/${locale}/cluster`
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                {t('Cluster Hub', 'المركز الرئيسي')}
              </Link>

              {/* 5 Categorized Dropdown Pillars */}
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = isCategoryActive(cat);
                const isOpen = openMenu === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(cat.id)}
                    onMouseLeave={() => setOpenMenu((prev) => (prev === cat.id ? null : prev))}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenMenu(isOpen ? null : cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        isOpen || active
                          ? 'bg-muted text-primary'
                          : 'text-foreground/85 hover:text-primary hover:bg-muted/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-primary/80" />
                      <span>{cat.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 opacity-70 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </button>

                    {/* Mega-Menu Dropdown Panel */}
                    {isOpen && (
                      <div
                        className={`absolute top-full start-0 pt-2 z-50 ${
                          cat.columns === 2 ? 'w-[640px]' : 'w-[380px]'
                        }`}
                      >
                        <div className="rounded-2xl border bg-popover/98 backdrop-blur-xl text-popover-foreground shadow-2xl p-3 ring-1 ring-black/5">
                          <div className="flex items-center justify-between px-2.5 pb-2 mb-2 border-b text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Icon className="w-3.5 h-3.5 text-primary" />
                              {cat.label}
                            </span>
                            <span>
                              {cat.items.length} {t('Modules', 'وحدات')}
                            </span>
                          </div>

                          <div
                            className={`grid gap-1.5 ${
                              cat.columns === 2 ? 'grid-cols-2' : 'grid-cols-1'
                            }`}
                          >
                            {cat.items.map((sub) => {
                              const SubIcon = sub.icon;
                              const isSubActive =
                                pathname === sub.href || pathname.startsWith(sub.href + '/');
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setOpenMenu(null)}
                                  className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                                    isSubActive
                                      ? 'bg-primary/10 border border-primary/30'
                                      : 'hover:bg-muted/80 border border-transparent'
                                  }`}
                                >
                                  <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                      sub.accent === 'emerald'
                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                        : sub.accent === 'blue'
                                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                        : sub.accent === 'amber'
                                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                        : sub.accent === 'purple'
                                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                                        : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                                    }`}
                                  >
                                    <SubIcon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1.5">
                                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                        {sub.label}
                                      </span>
                                      {sub.badge && (
                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                                          {sub.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug mt-0.5">
                                      {sub.desc}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Controls: Persona, Currency, Language, Theme, Dashboard, Auth */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <PersonaSwitcher locale={locale} />
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="text-xs font-bold bg-transparent border rounded-lg px-2 py-1.5 outline-none cursor-pointer text-muted-foreground hover:text-foreground"
              aria-label="Currency"
            >
              <option value="EGP">EGP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            <button
              onClick={toggleLocale}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg border hover:bg-muted transition-colors"
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </button>

            <ThemeToggle />

            <Link href={`/${locale}/dashboard`} className="hidden sm:inline-block">
              <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                {t('Dashboard', 'لوحة التحكم')}
              </Button>
            </Link>

            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <NotificationsDropdown locale={locale} />
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button size="sm" className="h-8 text-xs font-bold">
                  {t('Sign In', 'دخول')}
                </Button>
              </SignInButton>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden p-2 rounded-lg border hover:bg-muted"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Categorized Mobile & Tablet Accordion Drawer */}
        {mobileOpen && (
          <div className="xl:hidden border-t bg-background px-4 py-4 space-y-3 max-h-[82vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-2 pb-2 border-b">
              <PersonaSwitcher locale={locale} />
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-primary text-xs font-bold flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {t('Dashboard', 'لوحة التحكم')}
              </Link>
            </div>

            <Link
              href={`/${locale}/cluster`}
              onClick={() => setMobileOpen(false)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                {t('Cluster Command Hub (All 17 Modules)', 'المركز الرئيسي للتجمع (جميع الوحدات الـ 17)')}
              </span>
              <span>→</span>
            </Link>

            <div className="space-y-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const expanded = mobileExpandedCat === cat.id;
                return (
                  <div key={cat.id} className="rounded-xl border bg-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setMobileExpandedCat(expanded ? null : cat.id)}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold hover:bg-muted/50"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        {cat.label}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180 text-primary' : ''}`}
                      />
                    </button>

                    {expanded && (
                      <div className="p-2 pt-0 grid sm:grid-cols-2 gap-1.5 border-t bg-muted/20">
                        {cat.items.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-background border border-transparent hover:border-border transition-colors"
                            >
                              <SubIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold truncate">{sub.label}</div>
                                <div className="text-[10px] text-muted-foreground line-clamp-1">
                                  {sub.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
