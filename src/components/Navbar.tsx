"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ThemeToggle } from './ThemeToggle';
import { NotificationsDropdown } from './NotificationsDropdown';
import { PersonaSwitcher } from './PersonaSwitcher';
import { tr } from '@/lib/i18n-inline';
import { Menu, X, Network, BarChart3, Building2, ShoppingBag, Sparkles, Briefcase, Recycle, GraduationCap, Megaphone, Globe2, Gauge } from 'lucide-react';

export default function Navbar({ locale }: { locale: string }) {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const toggleLocale = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    window.location.href = newPath;
  };

  const navLinks = [
    { href: `/${locale}/cluster`, label: t('Cluster Hub', 'مركز التجمع'), highlight: true, icon: Network },
    { href: `/${locale}/cluster/lean-manufacturing`, label: t('Lean Manufacturing', 'التصنيع الرشيق Lean'), green: true, icon: Gauge },
    { href: `/${locale}/cluster/export-intelligence`, label: t('Export & Buyers AI', 'ذكاء التصدير والمشترين'), green: true, icon: Globe2 },
    { href: `/${locale}/cluster/academy`, label: t('Academy & AI Studio', 'الأكاديمية والدورات'), green: true, icon: GraduationCap },
    { href: `/${locale}/cluster/brand-studio`, label: t('Brand & Marketing AI', 'استوديو الهوية والتسويق'), green: true, icon: Megaphone },
    { href: `/${locale}/cluster/observatory`, label: t('Observatory', 'المرصد'), icon: BarChart3 },
    { href: `/${locale}/factories`, label: t('Factories', 'المصانع'), icon: Building2 },
    { href: `/${locale}/marketplaces/products`, label: t('Products', 'المنتجات'), icon: ShoppingBag },
    { href: `/${locale}/marketplaces/resources`, label: t('Resources', 'الموارد') },
    { href: `/${locale}/marketplaces/waste`, label: t('Circular Waste', 'العوادم'), icon: Recycle },
    { href: `/${locale}/marketplaces/matchmaking`, label: t('RFQs', 'المناقصات') },
    { href: `/${locale}/recruitment`, label: t('Jobs', 'الوظائف'), icon: Briefcase },
    { href: `/${locale}/ai`, label: t('AI Advisor', 'المستشار الذكي'), icon: Sparkles },
  ];

  return (
    <div className="flex flex-col w-full sticky top-0 z-50">
      {/* TIGARA Sponsorship Banner */}
      <div className="w-full bg-white border-b py-2 md:py-3 flex justify-center items-center px-4">
        <img
          src="/tigara-logos.png"
          alt="TIGARA Project Partners: EU, UNIDO, Egyptian Government"
          className="h-12 md:h-16 object-contain"
        />
      </div>

      <nav className="border-b bg-background/95 backdrop-blur shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-6">
            <Link href={`/${locale}`} className="text-xl md:text-2xl font-extrabold text-primary whitespace-nowrap">
              {t('Mahalla Cluster', 'تجمع المحلة')}
            </Link>

            <div className="hidden xl:flex items-center gap-4 text-sm font-medium">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                      item.highlight
                        ? 'bg-primary/10 text-primary font-semibold hover:bg-primary/20'
                        : item.green
                        ? 'text-emerald-600 hover:text-emerald-700 font-semibold'
                        : isActive
                        ? 'text-primary font-semibold bg-muted'
                        : 'text-foreground/80 hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block">
              <PersonaSwitcher locale={locale} />
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="text-xs md:text-sm font-medium bg-transparent border rounded-md px-2 py-1 outline-none cursor-pointer text-muted-foreground hover:text-foreground"
              aria-label="Currency"
            >
              <option value="EGP">EGP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>

            <button
              onClick={toggleLocale}
              className="text-xs md:text-sm font-semibold px-2.5 py-1 rounded-md border hover:bg-muted transition-colors"
            >
              {locale === 'ar' ? 'EN' : 'عربي'}
            </button>

            <ThemeToggle />

            <Link href={`/${locale}/dashboard`} className="hidden md:inline-block">
              <Button variant="outline" size="sm">
                {t('Dashboard', 'لوحة التحكم')}
              </Button>
            </Link>

            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <NotificationsDropdown locale={locale} />
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button size="sm">{t('Sign In', 'دخول')}</Button>
              </SignInButton>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="xl:hidden p-2 rounded-md border hover:bg-muted"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="xl:hidden border-t bg-background px-4 py-4 space-y-3">
            <div className="sm:hidden pb-2">
              <PersonaSwitcher locale={locale} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg border text-sm font-medium hover:bg-muted flex items-center gap-2"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg border border-primary/40 bg-primary/5 text-primary text-sm font-semibold"
              >
                {t('Dashboard', 'لوحة التحكم')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
