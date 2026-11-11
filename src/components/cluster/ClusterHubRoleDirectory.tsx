'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Factory as FactoryIcon,
  Handshake,
  FlaskConical,
  Gauge,
  GraduationCap,
  Leaf,
  Landmark,
  MessagesSquare,
  CalendarDays,
  UserCheck,
  Megaphone,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Globe2,
  Film,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';

type RoleId =
  | 'all'
  | 'owner'
  | 'export'
  | 'production'
  | 'purchasing'
  | 'marketing'
  | 'training';

interface HubCounts {
  factories: number;
  pools: number;
  capacity: number;
  consortia: number;
  facilities: number;
  courses: number;
  programs: number;
  threads: number;
  events: number;
  experts: number;
  assessments: number;
  completions: number;
}

export function ClusterHubRoleDirectory({
  locale,
  counts,
}: {
  locale: string;
  counts: HubCounts;
}) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const base = `/${locale}/cluster`;

  const [selectedRole, setSelectedRole] = useState<RoleId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const roles: { id: RoleId; labelEn: string; labelAr: string; descEn: string; descAr: string }[] = [
    {
      id: 'all',
      labelEn: '🌟 All Platform Services (17)',
      labelAr: '🌟 كل خدمات المنصة (١٧ خدمة)',
      descEn: 'Showing all services organized in 4 simple categories.',
      descAr: 'عرض جميع خدمات المنصة مرتبة في ٤ أقسام واضحة.',
    },
    {
      id: 'owner',
      labelEn: '👔 Factory Owner / General Manager',
      labelAr: '👔 صاحب مصنع / مدير عام',
      descEn: 'Top tools to cut costs, win big orders, get grants, and track factory readiness.',
      descAr: 'أهم خدمات خفض التكلفة، الفوز بطلبيات التصدير، الحصول على المنح، وتقييم المصنع.',
    },
    {
      id: 'purchasing',
      labelEn: '🛒 Purchasing & Raw Materials',
      labelAr: '🛒 المشتريات والخامات والغزول',
      descEn: 'Buy cotton yarn, dyes, and chemicals at wholesale discount prices.',
      descAr: 'شراء الغزول والصبغات والكيماويات والطاقة بأسعار الجملة المخفضة.',
    },
    {
      id: 'export',
      labelEn: '🌍 Export & Foreign Sales',
      labelAr: '🌍 التصدير والمبيعات الخارجية',
      descEn: 'Find foreign buyers, export tenders, alliances, and EU carbon certificates.',
      descAr: 'إيجاد المشترين الدوليين، المناقصات، التحالفات التصديرية، وشهادات التصدير لأوروبا.',
    },
    {
      id: 'production',
      labelEn: '⚙️ Production, Machines & Quality',
      labelAr: '⚙️ الإنتاج والماكينات والجودة',
      descEn: 'Rent idle machines, reduce fabric waste & downtime, and book quality testing labs.',
      descAr: 'تشغيل الماكينات المتاحة، تقليل الهالك والأعطال، وحجز معامل فحص الجودة.',
    },
    {
      id: 'marketing',
      labelEn: '🎬 Video, Photos & Catalogs',
      labelAr: '🎬 الفيديوهات والكتالوجات والتسويق',
      descEn: 'Create HD .MP4 factory videos, product photos, brochures, and moodboards in 1 click.',
      descAr: 'إنشاء فيديو دعائي MP4 بالصوت والترجمة، وصور للمنتجات، وبروشور وكتالوج بضغطة زر.',
    },
    {
      id: 'training',
      labelEn: '🎓 Worker Training & Grants',
      labelAr: '🎓 تدريب العمال والمنح والخبراء',
      descEn: 'Train workers with certificates, apply for grants, and consult verified experts.',
      descAr: 'تدريب العمال والفنيين بشهادات معتمدة، والتقديم على المنح، واستشارة الخبراء.',
    },
  ];

  const allModules = [
    // Group 1: Buy & Share Machines
    {
      href: 'procurement',
      manualId: 'procurement',
      groupEn: '1. Buy Raw Materials & Share Machines',
      groupAr: '١. شراء الخامات بسعر الجملة وتشغيل الماكينات',
      tone: 'from-sky-500/15',
      icon: ShoppingCart,
      en: 'Joint Buying at Wholesale Prices',
      ar: 'الشراء المشترك للخامات بسعر الجملة',
      descEn: 'Pool demand for cotton yarn, dyes, spare parts, and solar energy to save 12%–18%.',
      descAr: 'تجميع طلبات الغزل والصبغات وقطع الغيار والطاقة مع مصانع المحلة للحصول على خصم الجملة.',
      benefitEn: 'Save 12%–18% on raw materials',
      benefitAr: 'توفير ١٢٪ إلى ١٨٪ من سعر الخامات',
      stat: counts.pools,
      roles: ['owner', 'purchasing'] as RoleId[],
    },
    {
      href: 'capacity',
      manualId: 'capacity',
      groupEn: '1. Buy Raw Materials & Share Machines',
      groupAr: '١. شراء الخامات بسعر الجملة وتشغيل الماكينات',
      tone: 'from-sky-500/15',
      icon: FactoryIcon,
      en: 'Machine Capacity Exchange',
      ar: 'تبادل ساعات تشغيل الماكينات',
      descEn: 'Rent out idle looms, dyeing jets, or sewing lines, or book trusted partner mills.',
      descAr: 'اعرض ساعات الماكينات الفائضة لديك لتحقيق دخل إضافي أو اعثر على مصنع شريك.',
      benefitEn: 'Turn idle machines into revenue',
      benefitAr: 'تشغيل الماكينات المتوقفة وتحقيق ربح',
      stat: counts.capacity,
      roles: ['owner', 'production'] as RoleId[],
    },
    {
      href: 'consortia',
      manualId: 'consortia',
      groupEn: '1. Buy Raw Materials & Share Machines',
      groupAr: '١. شراء الخامات بسعر الجملة وتشغيل الماكينات',
      tone: 'from-sky-500/15',
      icon: Handshake,
      en: 'Export Consortia & Alliances',
      ar: 'التحالفات التصديرية بين المصانع',
      descEn: 'Partner with spinning, weaving, dyeing, and garment factories to win large orders.',
      descAr: 'تحالف عدة مصانع عبر مراحل الإنتاج للفوز بطلبيات تصدير أكبر من قدرة مصنع واحد.',
      benefitEn: 'Win large export contracts together',
      benefitAr: 'الفوز بطلبيات تصدير كبرى بالتشارك',
      stat: counts.consortia,
      roles: ['owner', 'export', 'production'] as RoleId[],
    },
    {
      href: 'facilities',
      manualId: 'facilities',
      groupEn: '1. Buy Raw Materials & Share Machines',
      groupAr: '١. شراء الخامات بسعر الجملة وتشغيل الماكينات',
      tone: 'from-sky-500/15',
      icon: FlaskConical,
      en: 'Shared Quality Labs & CAD Studio',
      ar: 'حجز معامل الفحص واستوديو التصميم',
      descEn: 'Book the ISO testing lab, 3D CAD design studio, and training halls by the hour.',
      descAr: 'احجز بالساعة في معمل اختبارات الجودة واستوديو التصميم وقاعات التدريب بتكلفة مدعمة.',
      benefitEn: 'Certified lab testing by the hour',
      benefitAr: 'فحص جودة معتمد بالساعة وبدون تكلفة شراء أجهزة',
      stat: counts.facilities,
      roles: ['production', 'export'] as RoleId[],
    },

    // Group 2: Export & Marketing Studios
    {
      href: 'export-intelligence',
      manualId: 'export-intelligence',
      groupEn: '2. Export Globally & Create Videos / Catalogs',
      groupAr: '٢. التصدير العالمي وإنتاج الفيديوهات والكتالوجات',
      tone: 'from-emerald-500/15',
      icon: Globe2,
      en: 'Find Foreign Buyers & Export Studies',
      ar: 'كشاف المشترين الدوليين ودراسات التصدير',
      descEn: 'Market studies, verified international buyers, live export tenders, and customs duties.',
      descAr: 'دراسات الأسواق، قوائم المشترين الموثوقين، المناقصات الدولية، وحساب الشحن والجمارك.',
      benefitEn: 'Verified buyers across 190+ countries',
      benefitAr: 'الوصول لمشترين ومناقصات في ١٩٠+ دولة',
      roles: ['owner', 'export', 'marketing'] as RoleId[],
    },
    {
      href: 'media-studio',
      manualId: 'ai-media-studio',
      groupEn: '2. Export Globally & Create Videos / Catalogs',
      groupAr: '٢. التصدير العالمي وإنتاج الفيديوهات والكتالوجات',
      tone: 'from-emerald-500/15',
      icon: Film,
      en: 'Factory Video & Photo Studio (MP4)',
      ar: 'استوديو عمل الفيديوهات والصور (MP4)',
      descEn: 'Create 5-scene HD .MP4 videos with voiceover & subtitles (MoneyPrinterTurbo) + 4 photos.',
      descAr: 'إنتاج فيديوهات دعائية MP4 بالتعليق الصوتي والترجمة المكتوبة + ٤ صور احترافية للمنتجات.',
      benefitEn: 'Download HD .MP4 video in 1 click',
      benefitAr: 'تحميل فيديو MP4 بالصوت والترجمة بضغطة زر',
      roles: ['owner', 'export', 'marketing'] as RoleId[],
    },
    {
      href: 'brand-studio',
      manualId: 'brand-studio',
      groupEn: '2. Export Globally & Create Videos / Catalogs',
      groupAr: '٢. التصدير العالمي وإنتاج الفيديوهات والكتالوجات',
      tone: 'from-emerald-500/15',
      icon: Megaphone,
      en: 'Brand Identity, Brochure & Poster Studio',
      ar: 'استوديو الهوية والكتالوج والبروشور',
      descEn: 'Create factory brand identity, printable 6-panel brochures, flyers, posters & campaigns.',
      descAr: 'إنشاء الهوية التجارية لمصنعك، وتصميم بروشور وفلاير وبوستر جاهز للطباعة والنشر.',
      benefitEn: 'Ready-to-print factory catalog & flyer',
      benefitAr: 'كتالوج وبروشور جاهز للطباعة فوراً',
      roles: ['owner', 'export', 'marketing'] as RoleId[],
    },
    {
      href: 'google-labs',
      manualId: 'google-pomelli',
      groupEn: '2. Export Globally & Create Videos / Catalogs',
      groupAr: '٢. التصدير العالمي وإنتاج الفيديوهات والكتالوجات',
      tone: 'from-emerald-500/15',
      icon: Sparkles,
      en: 'Fabric Color Moodboards & B2B Ad Cards',
      ar: 'لوحات ألوان الأقمشة والبطاقات الإعلانية',
      descEn: 'Generate fabric color collections, B2B ad cards, and interactive buyer showcases.',
      descAr: 'تنسيق ألوان مجموعات الأقمشة الجديدة وتوليد بطاقات إعلانية وعروض تفاعلية للمشترين.',
      benefitEn: 'Visual color boards & social ad cards',
      benefitAr: 'لوحات ألوان الأقمشة وبطاقات تسويقية',
      roles: ['marketing', 'export'] as RoleId[],
    },

    // Group 3: Factory Efficiency, Quality & Grants
    {
      href: 'lean-manufacturing',
      manualId: 'lean-manufacturing',
      groupEn: '3. Reduce Waste, Upgrade Factory & Get Grants',
      groupAr: '٣. تقليل الهالك، تطوير المصنع، والحصول على المنح',
      tone: 'from-amber-500/15',
      icon: Gauge,
      en: 'Reduce Waste & Stop Breakdowns (Lean)',
      ar: 'تقليل الهالك والأعطال وتحسين الإنتاج (اللين)',
      descEn: 'Simple calculators and plans to cut fabric defects, speed up changeovers, and boost output.',
      descAr: 'أدوات عملية مبسطة لتقليل عيوب النسيج والصباغة وتقليل وقت توقف الماكينات وتكلفة الكيلو.',
      benefitEn: 'Cut waste, defects, and downtime',
      benefitAr: 'تقليل الهالك والأعطال وخفض تكلفة الإنتاج',
      roles: ['owner', 'production'] as RoleId[],
    },
    {
      href: 'funding',
      manualId: 'funding',
      groupEn: '3. Reduce Waste, Upgrade Factory & Get Grants',
      groupAr: '٣. تقليل الهالك، تطوير المصنع، والحصول على المنح',
      tone: 'from-amber-500/15',
      icon: Landmark,
      en: 'Factory Grants & Green Loans',
      ar: 'المنح المجانية والقروض الميسرة للمصانع',
      descEn: 'Grants, low-interest loans, and technical support matched to your factory needs.',
      descAr: 'منح مجانية وقروض خضراء ميسرة ودعم فني لتحديث الماكينات والطاقة الشمسية.',
      benefitEn: 'Direct funding for machine upgrades',
      benefitAr: 'تمويل ومنح لتحديث ماكينات مصنعك',
      stat: counts.programs,
      roles: ['owner', 'training'] as RoleId[],
    },
    {
      href: 'sustainability',
      manualId: 'sustainability',
      groupEn: '3. Reduce Waste, Upgrade Factory & Get Grants',
      groupAr: '٣. تقليل الهالك، تطوير المصنع، والحصول على المنح',
      tone: 'from-amber-500/15',
      icon: Leaf,
      en: 'Energy Savings & EU Export Certificate (CBAM)',
      ar: 'توفير الطاقة وشهادة التصدير لأوروبا (CBAM)',
      descEn: 'Track electricity, water, and carbon easily; download EU CBAM compliance reports.',
      descAr: 'احسب استهلاك الكهرباء والمياه والبصمة الكربونية واستخرج شهادة التصدير لأوروبا.',
      benefitEn: 'EU CBAM export certificate ready',
      benefitAr: 'توفير الكهرباء والمياه وشهادة CBAM الأوروبية',
      roles: ['owner', 'export', 'production'] as RoleId[],
    },
    {
      href: 'maturity',
      manualId: 'maturity',
      groupEn: '3. Reduce Waste, Upgrade Factory & Get Grants',
      groupAr: '٣. تقليل الهالك، تطوير المصنع، والحصول على المنح',
      tone: 'from-amber-500/15',
      icon: CheckCircle2,
      en: '2-Minute Factory Assessment & 90-Day Plan',
      ar: 'التقييم السريع للمصنع وخطة التطوير (٩٠ يوماً)',
      descEn: 'Simple 6-question checkup with a personalized 90-day improvement roadmap.',
      descAr: 'تقييم مبسط لمستوى المصنع مع خارطة طريق عملية للتطوير خلال ٩٠ يوماً.',
      benefitEn: 'Clear 90-day factory upgrade plan',
      benefitAr: 'خطة تطوير واضحة لمصنعك في دقيقتين',
      stat: counts.assessments,
      roles: ['owner', 'production'] as RoleId[],
    },

    // Group 4: Training & Community
    {
      href: 'academy',
      manualId: 'academy',
      groupEn: '4. Worker Training, Experts & Community',
      groupAr: '٤. تدريب العمال، استشارة الخبراء، ومجتمع المحلة',
      tone: 'from-violet-500/15',
      icon: GraduationCap,
      en: 'Worker & Manager Training Academy',
      ar: 'أكاديمية تدريب العمال والمديرين',
      descEn: 'Practical courses for workers and engineers with QR-verifiable certificates.',
      descAr: 'دورات تدريبية عملية للعمال والفنيين والمديرين مع شهادات معتمدة قابلة للتحقق.',
      benefitEn: 'Free training + QR certificates',
      benefitAr: 'دورات مجانية وشهادات معتمدة للعمال',
      stat: counts.courses,
      roles: ['owner', 'production', 'training'] as RoleId[],
    },
    {
      href: 'academy/studio',
      manualId: 'academy-studio',
      groupEn: '4. Worker Training, Experts & Community',
      groupAr: '٤. تدريب العمال، استشارة الخبراء، ومجتمع المحلة',
      tone: 'from-violet-500/15',
      icon: Sparkles,
      en: '1-Click Custom Course Generator',
      ar: 'منشئ الدورات التدريبية المخصصة بضغطة زر',
      descEn: 'Type any topic to create a Beginner-to-Advanced course with audio, video & quiz.',
      descAr: 'اكتب أي موضوع فني أو إداري لتوليد دورة كاملة بالصوت والفيديو والاختبار فوراً.',
      benefitEn: 'Create any course in 10 seconds',
      benefitAr: 'إنشاء أي دورة تدريبية لمصنعك في ثوانٍ',
      roles: ['production', 'training'] as RoleId[],
    },
    {
      href: 'experts',
      manualId: 'experts',
      groupEn: '4. Worker Training, Experts & Community',
      groupAr: '٤. تدريب العمال، استشارة الخبراء، ومجتمع المحلة',
      tone: 'from-violet-500/15',
      icon: UserCheck,
      en: 'Verified Textile Experts & Mentors',
      ar: 'الخبراء والاستشاريون المعتمدون',
      descEn: 'Book free mentorship and technical consultations with spinning, dyeing & export experts.',
      descAr: 'تواصل مع خبراء واستشاريين معتمدين في الغزل والنسيج والصباغة والتصدير.',
      benefitEn: 'Free expert consultation hours',
      benefitAr: 'استشارات فنية وإدارية مباشرة للمصانع',
      stat: counts.experts,
      roles: ['owner', 'production', 'training'] as RoleId[],
    },
    {
      href: 'forum',
      manualId: 'forum',
      groupEn: '4. Worker Training, Experts & Community',
      groupAr: '٤. تدريب العمال، استشارة الخبراء، ومجتمع المحلة',
      tone: 'from-violet-500/15',
      icon: MessagesSquare,
      en: 'Technical Forum & Factory Q&A',
      ar: 'المنتدى الفني وتبادل الخبرات',
      descEn: 'Ask fellow factory owners and engineers, share know-how, and solve machine problems.',
      descAr: 'اطرح سؤالك الفني وشارك الخبرات وحل المشكلات الصناعية مع زملائك بالمحلة.',
      benefitEn: 'Peer answers from Mahalla engineers',
      benefitAr: 'حلول مجربة من مهندسي وأصحاب المصانع',
      stat: counts.threads,
      roles: ['production', 'training'] as RoleId[],
    },
    {
      href: 'events',
      manualId: 'events',
      groupEn: '4. Worker Training, Experts & Community',
      groupAr: '٤. تدريب العمال، استشارة الخبراء، ومجتمع المحلة',
      tone: 'from-violet-500/15',
      icon: CalendarDays,
      en: 'Trade Fairs, Workshops & B2B Days',
      ar: 'المعارض وورش العمل ولقاءات المشترين',
      descEn: 'Register for Heimtextil delegations, local workshops, and buyer matchmaking events.',
      descAr: 'سجل في بعثات المعارض الدولية وورش العمل ولقاءات المشترين الأجانب بالمحلة.',
      benefitEn: 'Join trade fairs & buyer meetings',
      benefitAr: 'المشاركة في المعارض ولقاءات المشترين',
      stat: counts.events,
      roles: ['owner', 'export', 'training'] as RoleId[],
    },
    {
      href: 'observatory',
      manualId: 'observatory',
      groupEn: '4. Worker Training, Experts & Community',
      groupAr: '٤. تدريب العمال، استشارة الخبراء، ومجتمع المحلة',
      tone: 'from-violet-500/15',
      icon: BarChart3,
      en: 'Cluster Statistics & Observatory',
      ar: 'مرصد إحصائيات ومؤشرات التجمع',
      descEn: 'Live dashboard of cluster production, savings, export growth, and active factories.',
      descAr: 'لوحة إحصائيات حية لمؤشرات الإنتاج والوفر المالي ونمو الصادرات بتجمع المحلة.',
      benefitEn: 'Live cluster economic indicators',
      benefitAr: 'متابعة مؤشرات وإحصائيات التجمع الحية',
      roles: ['owner'] as RoleId[],
    },
    {
      href: 'announcements',
      manualId: 'announcements',
      groupEn: '4. Worker Training, Experts & Community',
      groupAr: '٤. تدريب العمال، استشارة الخبراء، ومجتمع المحلة',
      tone: 'from-violet-500/15',
      icon: Megaphone,
      en: 'Official Cluster News & Calls',
      ar: 'الإعلانات والدعوات الرسمية للتجمع',
      descEn: 'Official bulletins, new grant calls, and important updates for member factories.',
      descAr: 'الأخبار الرسمية ومواعيد التقديم على المنح والبعثات التصديرية لأعضاء التجمع.',
      benefitEn: 'Never miss a grant or tender call',
      benefitAr: 'متابعة مواعيد المنح والمناقصات الرسمية',
      roles: ['owner', 'training'] as RoleId[],
    },
  ];

  const filtered = allModules.filter((m) => {
    const matchesRole = selectedRole === 'all' || m.roles.includes(selectedRole);
    if (!matchesRole) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.en.toLowerCase().includes(q) ||
      m.ar.toLowerCase().includes(q) ||
      m.descEn.toLowerCase().includes(q) ||
      m.descAr.toLowerCase().includes(q) ||
      m.benefitEn.toLowerCase().includes(q) ||
      m.benefitAr.toLowerCase().includes(q)
    );
  });

  // Group filtered modules by their group title
  const groupOrder = [
    '1. Buy Raw Materials & Share Machines',
    '2. Export Globally & Create Videos / Catalogs',
    '3. Reduce Waste, Upgrade Factory & Get Grants',
    '4. Worker Training, Experts & Community',
  ];

  const activeRoleObj = roles.find((r) => r.id === selectedRole) || roles[0];

  return (
    <div className="space-y-8">
      {/* Role & Search Filter Card */}
      <div className="rounded-3xl border-2 border-primary/25 bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground">
              {t(
                'Choose Your Role or Goal to Filter Services Instantly:',
                'اختر تخصصك أو هدفك لعرض الخدمات المناسبة لك فوراً:'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {isAr ? activeRoleObj.descAr : activeRoleObj.descEn}
            </p>
          </div>

          {/* Instant Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute top-3.5 start-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search any service (e.g. yarn, export, video)...', 'ابحث عن أي خدمة (مثل: غزل، تصدير، فيديو، منحة)...')}
              className="w-full rounded-xl border bg-background ps-9 pe-3 py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Role Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => {
            const active = selectedRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRole(r.id)}
                className={`rounded-xl border-2 px-3.5 py-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-muted/40 text-foreground hover:border-primary/40 hover:bg-muted'
                }`}
              >
                {isAr ? r.labelAr : r.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Services Grid */}
      {groupOrder.map((groupKey) => {
        const modsInGroup = filtered.filter((m) => m.groupEn === groupKey);
        if (modsInGroup.length === 0) return null;
        const groupTitle = isAr ? modsInGroup[0].groupAr : modsInGroup[0].groupEn;

        return (
          <section key={groupKey} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-xl font-black text-foreground">{groupTitle}</h2>
              <span className="text-xs font-bold text-muted-foreground">
                {fmtNumber(locale, modsInGroup.length)} {t('Services', 'خدمات')}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {modsInGroup.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.href}
                    href={`${base}/${m.href}`}
                    className={`group relative rounded-2xl border-2 bg-gradient-to-br ${m.tone} to-transparent p-5 transition-all hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-xl bg-background/90 border p-2.5 shadow-2xs">
                          <Icon className="w-5 h-5 text-primary" />
                        </span>
                        <div className="flex items-center gap-1.5">
                          {m.stat !== undefined && (
                            <span className="rounded-full bg-background/90 border px-2.5 py-0.5 text-xs font-extrabold tabular-nums">
                              {fmtNumber(locale, m.stat)}
                            </span>
                          )}
                          <ExpertManualButton manualId={m.manualId} locale={locale} variant="icon" />
                        </div>
                      </div>

                      <div className="mt-3 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
                        ✓ {isAr ? m.benefitAr : m.benefitEn}
                      </div>

                      <h3 className="mt-2 text-base font-black text-foreground group-hover:text-primary transition-colors">
                        {t(m.en, m.ar)}
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {t(m.descEn, m.descAr)}
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs font-extrabold text-primary">
                      <span>{t('Open Service Now', 'افتح الخدمة الآن')}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
