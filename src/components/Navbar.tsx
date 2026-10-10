"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';

import { useCurrency } from '@/contexts/CurrencyContext';
import { ThemeToggle } from './ThemeToggle';
import { NotificationsDropdown } from './NotificationsDropdown';

export default function Navbar({ locale }: { locale: string }) {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

  // Basic locale switcher
  const toggleLocale = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    // Replace the current locale in the path
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    window.location.href = newPath;
  };

  return (
    <div className="flex flex-col w-full sticky top-0 z-50">
      {/* TIGARA Sponsorship Banner */}
      <div className="w-full bg-white border-b py-3 md:py-4 flex justify-center items-center">
        <img 
          src="/tigara-logos.png" 
          alt="TIGARA Project Partners: EU, UNIDO, Egyptian Government" 
          className="h-16 md:h-24 object-contain"
        />
      </div>

      <nav className="border-b bg-background shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link href={`/${locale}`} className="text-2xl font-bold text-primary">
            Mahalla Cluster
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href={`/${locale}/marketplaces/products`} className="hover:text-primary transition-colors">Products</Link>
            <Link href={`/${locale}/marketplaces/resources`} className="hover:text-primary transition-colors">Resources</Link>
            <Link href={`/${locale}/marketplaces/waste`} className="text-green-600 hover:text-green-700 transition-colors">Waste</Link>
            <Link href={`/${locale}/recruitment`} className="hover:text-primary transition-colors">Jobs</Link>
            <Link href={`/${locale}/ai`} className="hover:text-primary transition-colors">AI Consultant</Link>
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as any)}
            className="text-sm font-medium bg-transparent border-none outline-none cursor-pointer text-muted-foreground hover:text-slate-800"
          >
            <option value="EGP">EGP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          
          <button onClick={toggleLocale} className="text-sm font-medium hover:underline text-muted-foreground">
            {locale === 'ar' ? 'English' : 'العربية'}
          </button>

          <ThemeToggle />
          
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <NotificationsDropdown locale={locale} />
              <Link href={`/${locale}/dashboard`}>
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <UserButton />
            </div>
          ) : (
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          )}
        </div>
        </div>
      </nav>
    </div>
  );
}
