import Link from 'next/link';
import { LayoutDashboard, FileText, MessageSquare, ShieldCheck, ShoppingCart, Building2 } from 'lucide-react';
import { tr } from '@/lib/i18n-inline';

export default async function BuyerDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const navigation = [
    { name: t('Overview', 'نظرة عامة'), href: `/${locale}/dashboard/buyer`, icon: LayoutDashboard },
    { name: t('My RFQs & Quotes', 'طلبات عروض الأسعار'), href: `/${locale}/dashboard/buyer/rfqs`, icon: FileText },
    { name: t('Post New RFQ', 'إضافة طلب تصنيع'), href: `/${locale}/marketplaces/matchmaking`, icon: ShoppingCart },
    { name: t('Verified Factories', 'دليل المصانع المعتمدة'), href: `/${locale}/factories`, icon: Building2 },
    { name: t('Messages Inbox', 'صندوق الرسائل'), href: `/${locale}/dashboard/messages`, icon: MessageSquare },
    { name: t('Contracts & Escrow', 'العقود والضمان البنكي'), href: `/${locale}/dashboard/contracts`, icon: ShieldCheck },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-muted/20">
      <aside className="w-64 bg-card border-e flex-shrink-0 hidden md:block">
        <div className="h-full flex flex-col p-4">
          <div className="mb-6 px-4 pt-2">
            <h2 className="text-lg font-bold text-primary">{t('Buyer Sourcing Portal', 'بوابة المشترين والتوريد')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('Manage RFQs, bids & escrow contracts', 'إدارة طلبات التصنيع والعروض والعقود')}
            </p>
          </div>
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
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
