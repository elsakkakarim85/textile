import Link from 'next/link';
import { LayoutDashboard, Store, Briefcase, Settings, FileText, ShieldCheck, Network, MessageSquare } from 'lucide-react';
import { findUserFactory } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';

export default async function FactoryDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const factory = await findUserFactory();

  const navigation = [
    { name: t('Overview', 'نظرة عامة'), href: `/${locale}/dashboard/factory`, icon: LayoutDashboard },
    { name: t('Products, Resources & DPP', 'المنتجات وجواز المنتج الرقمي'), href: `/${locale}/dashboard/factory/listings`, icon: Store },
    { name: t('My Quotations (Bids)', 'عروض الأسعار المقدمة'), href: `/${locale}/dashboard/factory/rfqs`, icon: FileText },
    { name: t('Contracts & Escrow', 'العقود والضمان البنكي'), href: `/${locale}/dashboard/contracts`, icon: ShieldCheck },
    { name: t('Job Postings', 'وظائف المصنع'), href: `/${locale}/dashboard/factory/jobs`, icon: Briefcase },
    { name: t('Messages Inbox', 'صندوق الرسائل'), href: `/${locale}/dashboard/messages`, icon: MessageSquare },
    { name: t('Analytics Dashboard', 'تحليلات الأداء'), href: `/${locale}/dashboard/factory/analytics`, icon: LayoutDashboard },
    { name: t('Billing & Plan', 'الاشتراك والفوترة'), href: `/${locale}/dashboard/factory/billing`, icon: Settings },
    { name: t('Cluster Ecosystem Hub', 'منظومة التجمع الصناعي'), href: `/${locale}/cluster`, icon: Network },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-muted/20">
      <aside className="w-64 bg-card border-e flex-shrink-0 hidden md:block">
        <div className="h-full flex flex-col p-4">
          <div className="mb-6 px-4 pt-2">
            <h2 className="text-lg font-bold text-primary">{t('Factory Portal', 'بوابة إدارة المصنع')}</h2>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {factory ? factory.name : t('Mahalla Cluster Member', 'عضو تجمع المحلة')}
            </p>
          </div>
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
