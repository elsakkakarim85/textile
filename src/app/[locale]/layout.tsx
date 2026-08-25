import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next-navigation';
import { routing } from '@/i18n/routing';
import { ClerkProvider } from '@clerk/nextjs';
import { arSA } from '@clerk/localizations';

import '../globals.css'; // Global CSS must still be imported

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  // Set direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <ClerkProvider localization={locale === 'ar' ? arSA : undefined}>
      <html lang={locale} dir={dir}>
        <body className="antialiased min-h-screen bg-background font-sans">
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
