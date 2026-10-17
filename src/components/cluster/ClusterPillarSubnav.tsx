"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { tr } from '@/lib/i18n-inline';
import {
  Network,
  BarChart3,
  ShoppingCart,
  ArrowRightLeft,
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
  Globe2,
  Sparkles,
} from 'lucide-react';

export function ClusterPillarSubnav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const base = `/${locale}/cluster`;

  const pillars = [
    {
      id: 'flagship',
      label: t('Flagship AI & Lean', 'الاستوديوهات واللين 6σ'),
      items: [
        { href: `${base}/lean-manufacturing`, label: t('Lean Six Sigma & OEE', 'التصنيع الرشيق ولين 6σ'), icon: Gauge },
        { href: `${base}/export-intelligence`, label: t('Export & Buyers AI', 'ذكاء التصدير والمشترين'), icon: Globe2 },
        { href: `${base}/brand-studio`, label: t('Brand & Print Studio', 'الهوية والمطبوعات AI'), icon: Megaphone },
        { href: `${base}/academy`, label: t('Academy & AI Courses', 'الأكاديمية والدورات'), icon: GraduationCap },
        { href: `/${locale}/ai`, label: t('Multi-LLM Arena', 'مركز الذكاء الاصطناعي'), icon: Sparkles },
      ],
    },
    {
      id: 'collab',
      label: t('Collaboration', 'التعاون المشترك'),
      items: [
        { href: `${base}/procurement`, label: t('Joint Procurement', 'الشراء المجمع'), icon: ShoppingCart },
        { href: `${base}/capacity`, label: t('Capacity Exchange', 'تبادل الطاقات'), icon: ArrowRightLeft },
        { href: `${base}/consortia`, label: t('Export Consortia', 'التحالفات التصديرية'), icon: Handshake },
        { href: `${base}/facilities`, label: t('Shared Labs & CAD', 'المعامل والمرافق'), icon: FlaskConical },
      ],
    },
    {
      id: 'modern',
      label: t('Modernization & ESG', 'التحديث والاستدامة'),
      items: [
        { href: `${base}/maturity`, label: t('Maturity 4.0', 'النضج الرقمي 4.0'), icon: Gauge },
        { href: `${base}/sustainability`, label: t('ESG & EU CBAM', 'الاستدامة وCBAM'), icon: Leaf },
        { href: `${base}/funding`, label: t('Grants & Funding', 'التمويل والمنح'), icon: Landmark },
      ],
    },
    {
      id: 'community',
      label: t('Observatory & Community', 'المرصد والمجتمع'),
      items: [
        { href: `${base}/observatory`, label: t('Cluster Observatory', 'مرصد التجمع'), icon: BarChart3 },
        { href: `${base}/experts`, label: t('Experts & Mentors', 'الخبراء والإرشاد'), icon: UserCheck },
        { href: `${base}/forum`, label: t('Technical Forum', 'المنتدى الفني'), icon: MessagesSquare },
        { href: `${base}/events`, label: t('Events & Fairs', 'الفعاليات والمعارض'), icon: CalendarDays },
        { href: `${base}/announcements`, label: t('PMO Bulletins', 'التعميمات'), icon: Megaphone },
      ],
    },
  ];

  // Auto-select the pillar that matches the current pathname
  const matchedPillar =
    pillars.find((p) =>
      p.items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    )?.id || 'flagship';

  const [activePillarId, setActivePillarId] = useState<string>(matchedPillar);

  useEffect(() => {
    setActivePillarId(matchedPillar);
  }, [matchedPillar]);

  const currentPillar = pillars.find((p) => p.id === activePillarId) || pillars[0];

  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-2 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
        {/* Left: Pillar Category Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <Link
            href={base}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              pathname === base
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            {t('All Pillars', 'كل الركائز')}
          </Link>

          <span className="text-muted-foreground/40 px-0.5">|</span>

          {pillars.map((pillar) => {
            const isSelected = pillar.id === activePillarId;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillarId(pillar.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-background text-primary shadow-2xs border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                {pillar.label}
              </button>
            );
          })}
        </div>

        {/* Right: Active Pillar's 3-5 Module Links */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {currentPillar.items.map((item) => {
            const Icon = item.icon;
            const isItemActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                  isItemActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-background/90 hover:border-primary/50 hover:text-primary'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isItemActive ? 'text-white' : 'text-primary'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
