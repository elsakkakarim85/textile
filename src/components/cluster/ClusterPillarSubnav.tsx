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
  Film,
  Home,
} from 'lucide-react';

export function ClusterPillarSubnav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const base = `/${locale}/cluster`;

  const pillars = [
    {
      id: 'collab',
      label: t('1. Buy & Share Machines', '١. الشراء وتشغيل الماكينات'),
      items: [
        { href: `${base}/procurement`, label: t('Wholesale Buying', 'الشراء المجمع بالجملة'), icon: ShoppingCart },
        { href: `${base}/capacity`, label: t('Machine Sharing', 'تبادل تشغيل الماكينات'), icon: ArrowRightLeft },
        { href: `${base}/consortia`, label: t('Export Alliances', 'التحالفات التصديرية'), icon: Handshake },
        { href: `${base}/facilities`, label: t('Quality Labs & CAD', 'حجز معامل الفحص'), icon: FlaskConical },
      ],
    },
    {
      id: 'flagship',
      label: t('2. Export, Video & Catalog', '٢. التصدير والفيديو والكتالوج'),
      items: [
        { href: `${base}/export-intelligence`, label: t('Export Buyers & Studies', 'كشاف المشترين والتصدير'), icon: Globe2 },
        { href: `${base}/media-studio`, label: t('Video & Photo Studio', 'فيديوهات وصور MP4'), icon: Film },
        { href: `${base}/brand-studio`, label: t('Catalog & Brochure', 'الكتالوج والبروشور'), icon: Megaphone },
        { href: `${base}/google-labs`, label: t('Color Boards & Ads', 'لوحات الألوان والإعلانات'), icon: Sparkles },
      ],
    },
    {
      id: 'modern',
      label: t('3. Reduce Waste & Grants', '٣. تقليل الهالك والمنح'),
      items: [
        { href: `${base}/lean-manufacturing`, label: t('Reduce Waste (Lean)', 'تقليل الهالك والأعطال'), icon: Gauge },
        { href: `${base}/funding`, label: t('Grants & Green Loans', 'المنح والتمويل'), icon: Landmark },
        { href: `${base}/sustainability`, label: t('Energy & EU CBAM', 'توفير الطاقة وCBAM'), icon: Leaf },
        { href: `${base}/maturity`, label: t('2-Min Factory Checkup', 'تقييم المصنع السريع'), icon: Gauge },
      ],
    },
    {
      id: 'community',
      label: t('4. Training & Community', '٤. تدريب العمال والمجتمع'),
      items: [
        { href: `${base}/academy`, label: t('Training Academy', 'أكاديمية تدريب العمال'), icon: GraduationCap },
        { href: `${base}/academy/studio`, label: t('Create Custom Course', 'إنشاء دورة تدريبية'), icon: Sparkles },
        { href: `${base}/experts`, label: t('Consult Experts', 'استشارة الخبراء'), icon: UserCheck },
        { href: `${base}/forum`, label: t('Technical Forum', 'المنتدى الفني'), icon: MessagesSquare },
        { href: `${base}/events`, label: t('Events & Fairs', 'المعارض والفعاليات'), icon: CalendarDays },
        { href: `${base}/observatory`, label: t('Cluster Stats', 'إحصائيات التجمع'), icon: BarChart3 },
      ],
    },
  ];

  const matchedPillar =
    pillars.find((p) =>
      p.items.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
    )?.id || 'collab';

  const [activePillarId, setActivePillarId] = useState<string>(matchedPillar);

  useEffect(() => {
    setActivePillarId(matchedPillar);
  }, [matchedPillar]);

  const currentPillar = pillars.find((p) => p.id === activePillarId) || pillars[0];

  return (
    <div className="border-b bg-muted/35">
      <div className="container mx-auto px-4 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Left: Home + All Services + 4 Clear Numbered Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-primary" />
            {t('Home', 'الرئيسية')}
          </Link>

          <Link
            href={base}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-colors ${
              pathname === base
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'text-foreground hover:bg-background/80 border border-transparent hover:border-border'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            {t('All Services', 'كل الخدمات')}
          </Link>

          <span className="text-muted-foreground/40 px-0.5">|</span>

          {pillars.map((pillar) => {
            const isSelected = pillar.id === activePillarId;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActivePillarId(pillar.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-background text-primary shadow-2xs border-2 border-primary/40'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                }`}
              >
                {pillar.label}
              </button>
            );
          })}
        </div>

        {/* Right: Active Category's Service Links */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {currentPillar.items.map((item) => {
            const Icon = item.icon;
            const isItemActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap border transition-all ${
                  isItemActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-background/95 hover:border-primary/50 hover:text-primary'
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
