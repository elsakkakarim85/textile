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
import { ExpertManualButton, openExpertManual } from './cluster/ExpertManualModal';
import { resolveManualByPathname } from '@/lib/expert-manuals';
import { tr } from '@/lib/i18n-inline';
import {
  Menu,
  X,
  HelpCircle,
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
  Search,
  ArrowRight,
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
  spotlightTitle: string;
  spotlightHref: string;
  spotlightCta: string;
  items: NavSubItem[];
}

export default function Navbar({ locale }: { locale: string }) {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>('marketplaces');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [zoomPct, setZoomPct] = useState<number>(100);
  const navRef = useRef<HTMLDivElement>(null);

  const t = (en: string, ar: string) => tr(locale, en, ar);

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

  const cycleTextZoom = () => {
    const next = zoomPct === 100 ? 112 : zoomPct === 112 ? 122 : 100;
    setZoomPct(next);
    try {
      document.documentElement.style.fontSize = `${next}%`;
      localStorage.setItem('mahalla_font_zoom', String(next));
    } catch {
      // ignore
    }
  };

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

  const triggerQuickSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const categories: NavCategory[] = [
    {
      id: 'marketplaces',
      label: t('Buy & Sell', 'البيع والشراء'),
      icon: ShoppingBag,
      columns: 1,
      spotlightTitle: t(
        'Buy & sell yarns, fabrics, dyes, and factory products directly',
        'اشترِ وبِع الغزول والأقمشة والخامات والمنتجات مباشرة من مصانع المحلة'
      ),
      spotlightHref: `/${locale}/marketplaces/products`,
      spotlightCta: t('Open Market', 'افتح السوق'),
      items: [
        {
          href: `/${locale}/marketplaces/products`,
          label: t('Finished Products & Fabrics Market', 'سوق المنتجات النهائية والأقمشة'),
          desc: t(
            'Ready-to-ship towels, bedlinen, fabrics, and garments from verified mills',
            'فوط، مفروشات فندقية، أقمشة، وملابس جاهزة للبيع والتصدير من المصانع'
          ),
          icon: ShoppingBag,
          badge: t('Products', 'منتجات'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/marketplaces/resources`,
          label: t('Yarns, Dyes & Raw Materials Market', 'سوق الغزول والصبغات والخامات'),
          desc: t(
            'Egyptian cotton yarns, reactive dyes, chemicals, and machine spare parts',
            'غزول قطن جيزة، صبغات، كيماويات مساعدة، وقطع غيار ماكينات النسيج'
          ),
          icon: Package,
          accent: 'blue',
        },
        {
          href: `/${locale}/marketplaces/waste`,
          label: t('Cotton Waste & Recycling Exchange', 'بورصة العوادم والقصاقيص للتدوير'),
          desc: t(
            'Buy or sell sorted cotton waste, comber noil, and fabric cutting clips',
            'بيع وشراء عوادم الغزل والتمشيط وقصاقيص القماش المفروزة لإعادة التدوير'
          ),
          icon: Recycle,
          badge: t('Recycling', 'تدوير'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/marketplaces/matchmaking`,
          label: t('Post a Buying Request / Price Quote', 'اطلب تسعير طلبية أو قدم عرض سعر'),
          desc: t(
            'Post what you want to buy or submit price quotes from your factory',
            'انشر مواصفات الطلبية التي تريد شراءها أو قدم عرض سعر من مصنعك'
          ),
          icon: FileText,
          badge: t('Orders', 'طلبيات'),
          accent: 'amber',
        },
        {
          href: `/${locale}/factories`,
          label: t('Verified Mahalla Factories Directory', 'دليل مصانع المحلة المعتمدة'),
          desc: t(
            'Browse spinning, weaving, knitting, dyeing, and garment factories',
            'تصفح بيانات وتخصصات مصانع الغزل والنسيج والتريكو والصباغة والملابس'
          ),
          icon: Building2,
        },
      ],
    },
    {
      id: 'trade',
      label: t('Export & Buyers', 'التصدير والمشترون'),
      icon: Globe2,
      columns: 1,
      spotlightTitle: t(
        'Find foreign buyers, export tenders & shipping costs across 190+ countries',
        'اعثر على مشترين دوليين ومناقصات حقيقية واحسب الشحن والجمارك بسهولة'
      ),
      spotlightHref: `/${locale}/cluster/export-intelligence`,
      spotlightCta: t('Find Buyers', 'ابحث عن مشترين'),
      items: [
        {
          href: `/${locale}/cluster/export-intelligence`,
          label: t('Find Foreign Buyers & Export Studies', 'كشاف المشترين الدوليين ودراسات التصدير'),
          desc: t(
            'Best countries for your product, verified buyers, tenders, and customs rules',
            'أفضل الدول لتصدير منتجك، قوائم المشترين الموثقين، المناقصات، والجمارك'
          ),
          icon: Globe2,
          badge: t('Top Tool', 'الأهم'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/services/logistics`,
          label: t('Shipping & Customs Cost Calculator', 'حاسبة تكلفة الشحن والجمارك'),
          desc: t(
            'Calculate sea/air container shipping cost and 0% duty savings easily',
            'احسب تكلفة شحن الحاوية البحرية أو الجوية ونسبة الإعفاء الجمركي'
          ),
          icon: Ship,
          accent: 'blue',
        },
        {
          href: `/${locale}/dashboard/contracts`,
          label: t('Safe Export Payment Contracts (30/40/30)', 'عقود ضمان الدفعات الآمنة (30/40/30)'),
          desc: t(
            'Protect buyer and factory payments across production and shipping stages',
            'حماية حقوق المصنع والمشتري بنظام الدفعات المضمونة على ٣ مراحل'
          ),
          icon: ShieldCheck,
        },
        {
          href: `/${locale}/dpp/demo-giza-yarn`,
          label: t('European Product Certificate (DPP)', 'جواز السفر الرقمي للمنتج الأوروبي'),
          desc: t(
            'Digital QR certificate proving Egyptian cotton origin and quality for Europe',
            'شهادة رقمية برمز QR تثبت منشأ القطن المصري وجودة المنتج للتصدير لأوروبا'
          ),
          icon: ShieldCheck,
          badge: t('EU Ready', 'لأوروبا'),
          accent: 'blue',
        },
      ],
    },
    {
      id: 'collaboration',
      label: t('Bulk Buy & Machines', 'الشراء المجمع والماكينات'),
      icon: Handshake,
      columns: 1,
      spotlightTitle: t(
        'Save 12–18% on yarn & dyes by pooling orders with Mahalla factories',
        'وفّر ١٢–١٨٪ من سعر الغزل والصبغات عبر الشراء المجمع مع مصانع المحلة'
      ),
      spotlightHref: `/${locale}/cluster/procurement`,
      spotlightCta: t('Join Group Buy', 'انضم للشراء المجمع'),
      items: [
        {
          href: `/${locale}/cluster/procurement`,
          label: t('Wholesale Group Buying (Save 12–18%)', 'الشراء المجمع للخامات بسعر الجملة'),
          desc: t(
            'Join other factories to buy cotton yarn, dyes, and solar energy at bulk discount',
            'اشترك مع مصانع المحلة لشراء الغزول والصبغات والطاقة بخصم الجملة (١٢–١٨٪)'
          ),
          icon: ShoppingCart,
          badge: t('Save 15%', 'وفر ١٥٪'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/capacity`,
          label: t('Rent Idle Machines & Subcontracting', 'تبادل ساعات تشغيل الماكينات'),
          desc: t(
            'Earn money from idle machines or book a trusted partner factory for your order',
            'شغّل ماكيناتك الفائضة لتحقيق دخل إضافي أو احجز تشغيل لدى مصنع موثوق'
          ),
          icon: ArrowRightLeft,
        },
        {
          href: `/${locale}/cluster/consortia`,
          label: t('Export Alliances Between Factories', 'التحالفات التصديرية بين المصانع'),
          desc: t(
            'Partner with 3–5 factories across spinning to sewing to win big export orders',
            'تعاون مع عدة مصانع مكملة لك للفوز بطلبيات التصدير الكبيرة معاً'
          ),
          icon: Handshake,
        },
        {
          href: `/${locale}/cluster/facilities`,
          label: t('Book Quality Testing Labs & CAD Studio', 'حجز معامل الفحص واستوديو التصميم'),
          desc: t(
            'Book yarn/fabric quality labs, 3D design studio, and training rooms by the hour',
            'حجز فوري بالساعة لمعامل اختبار الجودة واستوديو التصميم وقاعات التدريب'
          ),
          icon: FlaskConical,
        },
        {
          href: `/${locale}/services`,
          label: t('Maintenance, Packaging & Lab Services', 'خدمات الصيانة والتغليف والشهادات'),
          desc: t(
            'Find machine maintenance technicians, export packaging, and ISO certifiers',
            'دليل شركات صيانة الماكينات والتغليف التصديري واستخراج شهادات الجودة'
          ),
          icon: Wrench,
        },
      ],
    },
    {
      id: 'excellence',
      label: t('Reduce Waste & Grants', 'تقليل الهالك والمنح'),
      icon: Gauge,
      columns: 1,
      spotlightTitle: t(
        'Cut fabric defects, reduce machine stops, and apply for factory grants',
        'قلل الهالك وأعطال الماكينات واحصل على منح وتمويل لتطوير مصنعك'
      ),
      spotlightHref: `/${locale}/cluster/lean-manufacturing`,
      spotlightCta: t('Open Cost & Waste Tool', 'افتح تقليل الهالك'),
      items: [
        {
          href: `/${locale}/cluster/lean-manufacturing`,
          label: t('Reduce Waste & Stop Breakdowns (Lean)', 'تقليل الهالك والأعطال وتحسين الإنتاج'),
          desc: t(
            'Simple calculators and plans to stop fabric defects, cut downtime, and lower cost',
            'أدوات مبسطة لتقليل عيوب القماش والصباغة وتقليل توقف الماكينات وحساب التكلفة'
          ),
          icon: Gauge,
          badge: t('Cut Cost', 'خفض التكلفة'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/funding`,
          label: t('Factory Grants & Low-Interest Loans', 'المنح المجانية والقروض الميسرة للمصانع'),
          desc: t(
            'Apply for EU/UNIDO TIGARA, EBRD, and MSMEDA grants to upgrade machines',
            'قدم بسهولة على منح مشروع تجارة والبنك الأوروبي والقروض الميسرة لتحديث الماكينات'
          ),
          icon: Landmark,
          badge: t('Grants', 'منح وتمويل'),
          accent: 'amber',
        },
        {
          href: `/${locale}/cluster/sustainability`,
          label: t('Save Energy & EU Export Report (CBAM)', 'توفير الكهرباء والمياه وشهادة أوروبا'),
          desc: t(
            'Calculate electricity, water, and carbon savings and download EU CBAM report',
            'حاسبة مبسطة لاستهلاك الكهرباء والمياه وإصدار تقرير الكربون للتصدير لأوروبا'
          ),
          icon: Leaf,
          badge: 'CBAM',
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/maturity`,
          label: t('2-Minute Factory Checkup & 90-Day Plan', 'التقييم السريع للمصنع وخطة التطوير'),
          desc: t(
            'Answer 6 simple questions to get your factory score and 90-day upgrade plan',
            'أجب عن ٦ أسئلة بسيطة لتحصل على تقييم مصنعك وخطة تطوير عملية لمدة ٩٠ يوماً'
          ),
          icon: BarChart3,
        },
      ],
    },
    {
      id: 'ai_academy',
      label: t('Videos, Catalog & Training', 'الفيديو والكتالوج والتدريب'),
      icon: Sparkles,
      columns: 1,
      spotlightTitle: t(
        'Create factory videos, printable catalogs, and worker training in 1 click',
        'اصنع فيديو دعائي وكتالوج لمصنعك أو أنشئ دورة تدريبية لعمالك بضغطة زر'
      ),
      spotlightHref: `/${locale}/cluster/media-studio`,
      spotlightCta: t('Create Video Now', 'اصنع فيديو الآن'),
      items: [
        {
          href: `/${locale}/cluster/media-studio`,
          label: t('Create Factory Video & Photos (MP4)', 'استوديو عمل الفيديوهات والصور (MP4)'),
          desc: t(
            'Generate HD .MP4 commercial videos with voiceover & subtitles + 4 product photos',
            'توليد فيديو دعائي MP4 بالصوت والترجمة المكتوبة + ٤ صور احترافية للمنتجات'
          ),
          icon: Sparkles,
          badge: t('Video MP4', 'فيديو MP4'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/brand-studio`,
          label: t('Create Brochure, Catalog & Brand', 'تصميم كتالوج وبروشور وهوية المصنع'),
          desc: t(
            'Create your logo, 90-day marketing plan, printable brochure, flyer & poster',
            'تصميم شعار المصنع وخطة التسويق وبروشور وفلاير وبوستر جاهز للطباعة فوراً'
          ),
          icon: Megaphone,
          accent: 'amber',
        },
        {
          href: `/${locale}/cluster/academy`,
          label: t('Worker & Engineer Training Academy', 'أكاديمية تدريب العمال والمهندسين'),
          desc: t(
            'Ready practical courses or generate any custom training course with certificates',
            'دورات عملية مبسطة أو أنشئ أي دورة تدريبية لعمال مصنعك مع شهادة معتمدة'
          ),
          icon: GraduationCap,
          badge: t('Training', 'تدريب'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/google-labs`,
          label: t('Fabric Color Boards & Social Ads', 'لوحات ألوان الأقمشة والبطاقات الإعلانية'),
          desc: t(
            'Create fabric color palettes, social media ad cards, and buyer previews',
            'تنسيق ألوان الأقمشة وتوليد بطاقات إعلانية جاهزة للنشر وإرسالها للمشترين'
          ),
          icon: Sparkles,
          accent: 'blue',
        },
        {
          href: `/${locale}/ai`,
          label: t('Smart AI Assistant & Advisor Center', 'المساعد الذكي الشامل للاستشارات'),
          desc: t(
            'Ask any question about spinning, weaving, dyeing, costing, or export in Arabic/English',
            'اسأل أي سؤال في الغزل والنسيج والصباغة وحساب التكلفة والتصدير واحصل على إجابة فورية'
          ),
          icon: Sparkles,
          badge: t('Ask AI', 'اسأل الآن'),
          accent: 'purple',
        },
        {
          href: `/${locale}/dashboard/knowledge`,
          label: t('Technical Guides & Standards Library', 'مكتبة الأدلة الفنية والمواصفات القياسية'),
          desc: t(
            'Simple search across dyeing, weaving, quality, and export reference guides',
            'ابحث بسهولة في أدلة تشغيل الصباغة والنسيج وفحص الجودة والمواصفات'
          ),
          icon: BookOpen,
        },
      ],
    },
    {
      id: 'ecosystem',
      label: t('Community & Jobs', 'المجتمع والوظائف'),
      icon: BarChart3,
      columns: 1,
      spotlightTitle: t(
        'Connect with experts, hire factory technicians, and join cluster events',
        'تواصل مع الخبراء، ووظف الفنيين والمهندسين، وشارك في المعارض والفعاليات'
      ),
      spotlightHref: `/${locale}/cluster/observatory`,
      spotlightCta: t('View Cluster Stats', 'إحصائيات التجمع'),
      items: [
        {
          href: `/${locale}/recruitment`,
          label: t('Factory Jobs & Hiring Technicians', 'وظائف المصانع وتوظيف الفنيين والمهندسين'),
          desc: t(
            'Post job openings in your factory or apply for spinning, weaving & dyeing jobs',
            'أعلن عن الوظائف المتاحة بمصنعك أو قدم على وظائف الغزل والنسيج والصباغة'
          ),
          icon: Briefcase,
          badge: t('Jobs', 'وظائف'),
          accent: 'emerald',
        },
        {
          href: `/${locale}/cluster/experts`,
          label: t('Consult Verified Textile Experts', 'استشارة الخبراء والاستشاريين المعتمدين'),
          desc: t(
            'Book free advice with spinning, weaving, dyeing, quality, and export experts',
            'احجز استشارة مجانية مع خبراء الغزل والنسيج والصباغة والجودة والتصدير'
          ),
          icon: UserCheck,
        },
        {
          href: `/${locale}/cluster/forum`,
          label: t('Factory Owners & Engineers Forum', 'منتدى أصحاب المصانع والمهندسين'),
          desc: t(
            'Ask questions, share experience, and solve technical machine issues together',
            'اطرح سؤالك وشارك خبرتك وحل مشكلات الماكينات والإنتاج مع زملائك بالمحلة'
          ),
          icon: MessagesSquare,
        },
        {
          href: `/${locale}/cluster/events`,
          label: t('Trade Fairs, Workshops & Buyer Days', 'المعارض وورش العمل ولقاءات المشترين'),
          desc: t(
            'Register for international exhibitions, training workshops, and buyer meetings',
            'سجل في بعثات المعارض الدولية وورش العمل التدريبية ولقاءات المشترين'
          ),
          icon: CalendarDays,
        },
        {
          href: `/${locale}/cluster/observatory`,
          label: t('Cluster Statistics & Performance', 'إحصائيات ومؤشرات تجمع المحلة'),
          desc: t(
            'See live statistics on cluster production, savings, and export growth',
            'شاهد الإحصائيات الحية للإنتاج والوفر المالي ونمو الصادرات بالتجمع'
          ),
          icon: BarChart3,
          accent: 'blue',
        },
        {
          href: `/${locale}/cluster/announcements`,
          label: t('Official News & Grant Deadlines', 'الأخبار الرسمية ومواعيد المنح'),
          desc: t(
            'Latest official calls, grant deadlines, and news from cluster management',
            'أحدث الإعلانات الرسمية ومواعيد التقديم على المنح والبعثات التصديرية'
          ),
          icon: Megaphone,
        },
      ],
    },
  ];

  const isCategoryActive = (cat: NavCategory) =>
    cat.items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'));

  return (
    <div ref={navRef} className="contents">
      {/* Top Sovereign & European Multi-Color Protocol Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#003399] via-[#009fe3] via-[#f36f21] to-[#c59b27]" />

      {/* Clean Compact Institutional Partner Logos Strip */}
      <div className="w-full bg-gradient-to-b from-slate-50 via-white to-slate-50/90 border-b border-slate-200/90 px-3 sm:px-4 py-1.5 shadow-2xs">
        <div className="container mx-auto max-w-7xl">
          <div
            dir="ltr"
            className="grid grid-cols-2 sm:grid-cols-5 items-center gap-2"
          >
            {/* 1. European Union */}
            <div className="rounded-lg bg-white border border-blue-200/90 hover:border-[#003399] px-2.5 py-1 flex items-center justify-center shadow-2xs transition-colors">
              <svg
                viewBox="48 24 94 98"
                className="h-10 sm:h-11 md:h-12 w-auto"
                role="img"
                aria-label="Funded by the European Union"
              >
                <image href="/tigara-logos.png" width="1024" height="183" />
              </svg>
            </div>

            {/* 2. UNIDO */}
            <div className="rounded-lg bg-white border border-sky-200/90 hover:border-[#009fe3] px-2.5 py-1 flex items-center justify-center shadow-2xs transition-colors">
              <svg
                viewBox="158 24 184 98"
                className="h-10 sm:h-11 md:h-12 w-auto"
                role="img"
                aria-label="UNIDO - United Nations Industrial Development Organization"
              >
                <image href="/tigara-logos.png" width="1024" height="183" />
              </svg>
            </div>

            {/* 3. TIGARA Flagship Centerpiece */}
            <div className="col-span-2 sm:col-span-1 rounded-lg bg-white border-2 border-[#f36f21]/60 hover:border-[#f36f21] px-2.5 py-1 flex items-center justify-center shadow-2xs transition-colors">
              <svg
                viewBox="360 22 304 102"
                className="h-11 sm:h-12 md:h-14 w-auto"
                role="img"
                aria-label="TIGARA - Driving Trade Growth"
              >
                <image href="/tigara-logos.png" width="1024" height="183" />
              </svg>
            </div>

            {/* 4. Ministry of Foreign Affairs & International Cooperation */}
            <div className="rounded-lg bg-white border border-amber-200/90 hover:border-[#c59b27] px-2.5 py-1 flex items-center justify-center shadow-2xs transition-colors">
              <svg
                viewBox="680 24 174 98"
                className="h-10 sm:h-11 md:h-12 w-auto"
                role="img"
                aria-label="Ministry of Foreign Affairs and International Cooperation"
              >
                <image href="/tigara-logos.png" width="1024" height="183" />
              </svg>
            </div>

            {/* 5. Ministry of Industry */}
            <div className="rounded-lg bg-white border border-amber-200/90 hover:border-[#c59b27] px-2.5 py-1 flex items-center justify-center shadow-2xs transition-colors">
              <svg
                viewBox="878 24 76 98"
                className="h-10 sm:h-11 md:h-12 w-auto"
                role="img"
                aria-label="Ministry of Industry - Egypt"
              >
                <image href="/tigara-logos.png" width="1024" height="183" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Main Navigation Bar with Bespoke Mahalla Cluster Crest */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 shadow-sm">
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2">
          {/* Zone 1 (Left): Bespoke Brand Emblem */}
          <Link
            href={`/${locale}`}
            className="group flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {/* Custom SVG Industrial Textile & Gear Crest */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 p-1 shadow-md border border-emerald-500/40 group-hover:border-emerald-400 transition-all flex items-center justify-center shrink-0">
              <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
                {/* Outer Precision Gear Ring */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="url(#mahallaGold)"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                {/* Interlocking Warp & Weft Textile Threads */}
                <path
                  d="M14 18H34M14 24H34M14 30H34"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M18 14V34M24 14V34M30 14V34"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeOpacity="0.9"
                />
                {/* Center Diamond Node */}
                <rect
                  x="20.5"
                  y="20.5"
                  width="7"
                  height="7"
                  rx="1.5"
                  transform="rotate(45 24 24)"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
                <defs>
                  <linearGradient id="mahallaGold" x1="0" y1="0" x2="48" y2="48">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-background animate-pulse" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm md:text-base font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-none">
                {t('Mahalla Cluster', 'تجمع المحلة الكبرى')}
              </span>
              <span className="text-[8px] md:text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-0.5">
                {t('Industrial Textile Hub', 'قلعة صناعة الغزل والنسيج')}
              </span>
            </div>
          </Link>

          {/* Zone 2 (Center): Desktop Categorized Navigation */}
          <div className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1 shrink-0">
            {/* Direct Hub Pill */}
            <Link
              href={`/${locale}/cluster`}
              className={`inline-flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-lg text-[11px] xl:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                pathname === `/${locale}/cluster`
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              <Network className="w-3.5 h-3.5 shrink-0" />
              {t('Cluster Hub', 'المركز الرئيسي')}
            </Link>

            {/* 6 Categorized Dropdown Pillars (including Marketplaces) */}
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const active = isCategoryActive(cat);
              const isOpen = openMenu === cat.id;
              const alignEnd = idx >= 3;
              const isMarketplaces = cat.id === 'marketplaces';

              return (
                <div
                  key={cat.id}
                  className="relative shrink-0"
                  onMouseEnter={() => setOpenMenu(cat.id)}
                  onMouseLeave={() => setOpenMenu((prev) => (prev === cat.id ? null : prev))}
                >
                  <button
                    type="button"
                    onClick={() => setOpenMenu(isOpen ? null : cat.id)}
                    className={`inline-flex items-center gap-1 px-1.5 xl:px-2 py-1.5 rounded-lg text-[11px] xl:text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isOpen || active
                        ? 'bg-muted text-primary'
                        : isMarketplaces
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20'
                        : 'text-foreground/85 hover:text-primary hover:bg-muted/60'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isMarketplaces ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary/80'
                      }`}
                    />
                    <span>{cat.label}</span>
                    <ChevronDown
                      className={`w-3 h-3 opacity-70 transition-transform duration-150 shrink-0 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  {/* Mega-Menu Dropdown Panel */}
                  {isOpen && (
                    <div
                      className={`absolute top-full ${
                        alignEnd ? 'end-0' : 'start-0'
                      } pt-2 z-50 ${cat.columns === 2 ? 'w-[620px]' : 'w-[380px]'}`}
                    >
                      <div className="rounded-2xl border bg-popover/98 backdrop-blur-xl text-popover-foreground shadow-2xl p-3.5 ring-1 ring-black/5 space-y-2.5">
                        <div className="flex items-center justify-between px-2.5 pb-2 border-b text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
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
                                    <div className="flex items-center gap-1 shrink-0">
                                      {sub.badge && (
                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                                          {sub.badge}
                                        </span>
                                      )}
                                      <span
                                        role="button"
                                        tabIndex={0}
                                        title={t(
                                          'Open Expert Manual: What • How It Works • Why • How To Use',
                                          'افتح الدليل الهندسي الشامل لهذه الوحدة'
                                        )}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setOpenMenu(null);
                                          openExpertManual(resolveManualByPathname(sub.href).id);
                                        }}
                                        className="inline-flex items-center justify-center w-5 h-5 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer"
                                      >
                                        <HelpCircle className="w-3 h-3" />
                                      </span>
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug mt-0.5">
                                    {sub.desc}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Mega-Menu Quick-Launch Spotlight Footer */}
                        <div className="pt-2 border-t flex items-center justify-between gap-2 px-2">
                          <span className="text-[11px] font-medium text-muted-foreground truncate">
                            {cat.spotlightTitle}
                          </span>
                          <Link
                            href={cat.spotlightHref}
                            onClick={() => setOpenMenu(null)}
                            className="inline-flex items-center gap-1 text-[11px] font-extrabold text-primary hover:underline shrink-0"
                          >
                            {cat.spotlightCta}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Zone 3 (Right): Search/Tools, Manual Icon, Workspace Icon, Currency, Language, Theme, Dashboard, Auth */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={triggerQuickSearch}
              title={t('Quick Search & Industrial Calculators (Ctrl+K)', 'البحث السريع والحاسبات الهندسية (Ctrl+K)')}
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg border bg-muted/40 hover:bg-muted text-foreground transition-colors cursor-pointer shrink-0"
              aria-label="Quick Search and Calculators"
            >
              <Search className="w-3.5 h-3.5 text-primary" />
            </button>
            <button
              type="button"
              onClick={cycleTextZoom}
              title={t('Enlarge Text Size for Easier Reading', 'تكبير حجم الخط لسهولة القراءة')}
              className={`inline-flex items-center justify-center h-7 px-1.5 rounded-lg border text-[11px] font-black transition-colors cursor-pointer shrink-0 ${
                zoomPct > 100
                  ? 'border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300'
                  : 'bg-muted/40 hover:bg-muted text-foreground'
              }`}
              aria-label="Enlarge Text Size"
            >
              A+
            </button>
            <ExpertManualButton locale={locale} variant="icon" />
            <div className="hidden lg:block shrink-0">
              <PersonaSwitcher locale={locale} />
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="text-[11px] font-bold bg-transparent border rounded-lg px-1.5 py-1 outline-none cursor-pointer text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Currency"
            >
              <option value="EGP">EGP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            <button
              onClick={toggleLocale}
              className="text-[11px] font-bold px-2 py-1 rounded-lg border hover:bg-muted transition-colors cursor-pointer shrink-0"
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </button>

            <ThemeToggle />

            <Link href={`/${locale}/dashboard`} className="hidden sm:inline-block shrink-0">
              <Button variant="outline" size="sm" className="h-7 px-2 text-[11px] font-bold gap-1" title={t('Dashboard', 'لوحة التحكم')}>
                <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                <span className="hidden xl:inline">{t('Dashboard', 'لوحة التحكم')}</span>
              </Button>
            </Link>

            {isSignedIn ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <NotificationsDropdown locale={locale} />
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button size="sm" className="h-7 px-2.5 text-[11px] font-bold shrink-0">
                  {t('Sign In', 'دخول')}
                </Button>
              </SignInButton>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-1.5 rounded-lg border hover:bg-muted shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Categorized Mobile & Tablet Accordion Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-background px-4 py-4 space-y-3 max-h-[82vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-2 pb-2 border-b">
              <PersonaSwitcher locale={locale} />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    triggerQuickSearch();
                  }}
                  className="px-2.5 py-1.5 rounded-lg border bg-muted/50 text-xs font-bold flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-primary" />
                  {t('Tools', 'الأدوات')}
                </button>
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-primary/40 bg-primary/10 text-primary text-xs font-bold flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  {t('Dashboard', 'لوحة التحكم')}
                </Link>
              </div>
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
