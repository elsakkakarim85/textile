import Link from 'next/link';
import { LayoutDashboard, Store, Briefcase, Settings, FileText, ShieldCheck } from 'lucide-react';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function FactoryDashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const authObj = await auth();
  if (!authObj.userId) redirect(`/${locale}/sign-in`);
  
  let role = (authObj.sessionClaims?.metadata as any)?.role;
  if (!role) {
    const client = await clerkClient();
    const user = await client.users.getUser(authObj.userId);
    role = user.publicMetadata?.role;
  }
  
  if (role !== 'factory_owner' && role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="mb-4">You need the 'Factory Owner' role to access this portal.</p>
        <Link href={`/${locale}`} className="text-primary hover:underline">Return to Homepage</Link>
      </div>
    );
  }

  const navigation = [
    { name: 'Overview', href: `/${locale}/dashboard/factory`, icon: LayoutDashboard },
    { name: 'Marketplace Listings', href: `/${locale}/dashboard/factory/listings`, icon: Store },
    { name: 'Job Postings', href: `/${locale}/dashboard/factory/jobs`, icon: Briefcase },
    { name: 'My Quotations (Bids)', href: `/${locale}/dashboard/factory/rfqs`, icon: FileText },
    { name: 'Contracts & Escrow', href: `/${locale}/dashboard/contracts`, icon: ShieldCheck },
    { name: 'Analytics Dashboard', href: `/${locale}/dashboard/factory/analytics`, icon: LayoutDashboard },
    { name: 'Billing & Subscriptions', href: `/${locale}/dashboard/factory/billing`, icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex-shrink-0 hidden md:block">
        <div className="h-full flex flex-col p-4">
          <div className="mb-8 px-4">
            <h2 className="text-lg font-bold text-primary">Factory Portal</h2>
            <p className="text-sm text-muted-foreground">Manage your business</p>
          </div>
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
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
