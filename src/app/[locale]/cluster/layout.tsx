import type { ReactNode } from 'react';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import {
  Network, BarChart3, ShoppingCart, ArrowRightLeft, Handshake, FlaskConical,
  Gauge, GraduationCap, Leaf, Landmark, MessagesSquare, CalendarDays, UserCheck, Megaphone,
} from 'lucide-react';

export default async function ClusterLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const base = `/${locale}/cluster`;

  const items = [
    { href: base, label: t('Hub', 'المركز'), icon: Network },
    { href: `${base}/observatory`, label: t('Observatory', 'المرصد'), icon: BarChart3 },
    { href: `${base}/procurement`, label: t('Procurement', 'الشراء المشترك'), icon: ShoppingCart },
    { href: `${base}/capacity`, label: t('Capacity', 'تبادل الطاقات'), icon: ArrowRightLeft },
    { href: `${base}/consortia`, label: t('Consortia', 'التحالفات'), icon: Handshake },
    { href: `${base}/facilities`, label: t('Facilities', 'المرافق'), icon: FlaskConical },
    { href: `${base}/maturity`, label: t('Maturity 4.0', 'النضج الرقمي'), icon: Gauge },
    { href: `${base}/academy`, label: t('Academy', 'الأكاديمية'), icon: GraduationCap },
    { href: `${base}/sustainability`, label: t('ESG & CBAM', 'الاستدامة'), icon: Leaf },
    { href: `${base}/funding`, label: t('Funding', 'التمويل والمنح'), icon: Landmark },
    { href: `${base}/forum`, label: t('Forum', 'المنتدى'), icon: MessagesSquare },
    { href: `${base}/events`, label: t('Events', 'الفعاليات'), icon: CalendarDays },
    { href: `${base}/experts`, label: t('Experts', 'الخبراء'), icon: UserCheck },
    { href: `${base}/announcements`, label: t('Bulletins', 'التعميمات'), icon: Megaphone },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-background/80 border hover:border-primary/50 hover:text-primary transition-colors shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
