import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Building2,
  Store,
  FileText,
  Settings,
  Sparkles,
  Network,
  ShieldCheck,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { getCurrentUser } from '@/server/auth';
import { tr } from '@/lib/i18n-inline';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();
  const t = await getTranslations('Admin');

  const navGroups = [
    {
      groupLabel: tr(locale, 'Executive & AI', 'القيادة والذكاء الاصطناعي'),
      items: [
        { name: t('dashboard'), href: `/${locale}/admin`, icon: LayoutDashboard },
        { name: tr(locale, 'PMO AI Copilot', 'المستشار الذكي PMO'), href: `/${locale}/admin/ai`, icon: Sparkles },
        { name: tr(locale, 'Cluster Observatory', 'مرصد التجمع'), href: `/${locale}/cluster/observatory`, icon: Network },
      ],
    },
    {
      groupLabel: tr(locale, 'Cluster Governance & Trust', 'حوكمة وتوثيق التجمع'),
      items: [
        { name: t('factories'), href: `/${locale}/admin/factories`, icon: Building2 },
        { name: tr(locale, 'Trust & KYC (GOEIC)', 'توثيق المصانع KYC'), href: `/${locale}/admin/kyc`, icon: ShieldCheck },
        { name: t('users'), href: `/${locale}/admin/users`, icon: Users },
        { name: t('marketplaces'), href: `/${locale}/admin/marketplaces`, icon: Store },
      ],
    },
    {
      groupLabel: tr(locale, 'Security & System', 'الأمان وإعدادات النظام'),
      items: [
        { name: t('audit_logs'), href: `/${locale}/admin/audit-logs`, icon: FileText },
        { name: t('settings'), href: `/${locale}/admin/settings`, icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background">
      {/* Categorized Admin Sidebar */}
      <aside className="w-64 flex-shrink-0 border-e border-border bg-card/50 flex-col hidden md:flex">
        <div className="h-14 flex items-center justify-between px-5 border-b border-border shrink-0">
          <span className="font-bold text-base text-primary">{t('admin_panel')}</span>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
            TIGARA PMO
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.groupLabel} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                {group.groupLabel}
              </div>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <item.icon className="w-4 h-4 shrink-0 text-primary" />
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border shrink-0">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">
                {user?.firstName || 'Cluster'} {user?.lastName || 'Admin'}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{t('super_admin')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
