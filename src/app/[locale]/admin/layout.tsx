import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { LayoutDashboard, Users, Building2, Store, FileText, Settings, Sparkles } from 'lucide-react';
import { ClerkProvider, UserButton } from '@clerk/nextjs';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Perform RBAC check
  const authObj = await auth();
  if (!authObj.userId) {
    redirect(`/${locale}/sign-in`);
  }
  
  let role = (authObj.sessionClaims?.metadata as any)?.role;
  let userEmail = 'Unknown';
  if (!role) {
    const client = await clerkClient();
    const user = await client.users.getUser(authObj.userId);
    role = user.publicMetadata?.role;
    userEmail = user.emailAddresses[0]?.emailAddress || 'Unknown';
  }
  
  if (role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="mb-2">You are logged in as: <strong>{userEmail}</strong></p>
        <p className="mb-2">Your current role is: <strong>{role || 'None'}</strong></p>
        <p className="mb-4">You need the 'admin' role to access this page.</p>
        <Link href={`/${locale}`} className="text-primary hover:underline">Return to Homepage</Link>
      </div>
    );
  }

  const t = await getTranslations('Admin');

  const navigation = [
    { name: t('dashboard'), href: `/${locale}/admin`, icon: LayoutDashboard },
    { name: t('users'), href: `/${locale}/admin/users`, icon: Users },
    { name: t('factories'), href: `/${locale}/admin/factories`, icon: Building2 },
    { name: t('marketplaces'), href: `/${locale}/admin/marketplaces`, icon: Store },
    { name: 'AI Assistant', href: `/${locale}/admin/ai`, icon: Sparkles },
    { name: t('audit_logs'), href: `/${locale}/admin/audit-logs`, icon: FileText },
    { name: t('settings'), href: `/${locale}/admin/settings`, icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card/50 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
          <span className="font-bold text-xl text-primary">{t('admin_panel')}</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border shrink-0">
          <div className="flex items-center gap-3">
            <UserButton />
            <span className="text-sm font-medium text-muted-foreground">{t('super_admin')}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center px-6 border-b border-border shrink-0 md:hidden bg-card/50">
          <span className="font-bold text-lg text-primary">{t('admin_panel')}</span>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
