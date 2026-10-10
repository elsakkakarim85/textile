import Link from 'next/link';
import { LayoutDashboard, FileText, MessageSquare, Briefcase, ShieldCheck } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function BuyerDashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const authObj = await auth();
  
  if (!authObj.userId) redirect(`/${locale}/sign-in`);

  const navigation = [
    { name: 'Overview', href: `/${locale}/dashboard/buyer`, icon: LayoutDashboard },
    { name: 'My RFQs', href: `/${locale}/dashboard/buyer/rfqs`, icon: FileText },
    { name: 'Inbox', href: `/${locale}/dashboard/messages`, icon: MessageSquare },
    { name: 'Contracts & Escrow', href: `/${locale}/dashboard/contracts`, icon: ShieldCheck },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex-shrink-0 hidden md:block">
        <div className="h-full flex flex-col p-4">
          <div className="mb-8 px-4">
            <h2 className="text-lg font-bold text-slate-800">Buyer Portal</h2>
            <p className="text-sm text-slate-500">Manage your sourcing</p>
          </div>
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
