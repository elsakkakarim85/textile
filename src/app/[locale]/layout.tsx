import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ClerkProvider } from '@clerk/nextjs';
import { arSA } from '@clerk/localizations';
import { Metadata, Viewport } from 'next';
import { Fira_Sans } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Providers } from '@/components/Providers';
import { UniversalModuleAiCopilot } from '@/components/cluster/UniversalModuleAiCopilot';
import { GlobalQuickToolsDock } from '@/components/cluster/GlobalQuickToolsDock';

import '../globals.css';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'Mahalla Textile Cluster',
  description: 'The largest B2B platform for the textile industry in Egypt. Connect with factories, buy products, and find textile jobs.',
  openGraph: {
    title: 'Mahalla Textile Cluster',
    description: 'The largest B2B platform for the textile industry in Egypt.',
    url: 'https://mahalla-cluster-app.vercel.app',
    siteName: 'Mahalla Cluster',
    images: [
      {
        url: 'https://mahalla-cluster-app.vercel.app/og-image.png', // Fallback if doesn't exist
        width: 1200,
        height: 630,
        alt: 'Mahalla Textile Cluster',
      },
    ],
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahalla Textile Cluster',
    description: 'The premier B2B textile platform in Egypt.',
  }
};

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
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <ClerkProvider localization={locale === 'ar' ? arSA : undefined}>
      <html lang={locale} dir={dir} className="overflow-x-hidden" suppressHydrationWarning>
        <body className={`${firaSans.variable} antialiased min-h-screen flex flex-col bg-background font-sans overflow-x-hidden`}>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <Navbar locale={locale} />
              <main className="flex-1 flex flex-col">
                {children}
                <UniversalModuleAiCopilot locale={locale} />
              </main>
              <GlobalQuickToolsDock locale={locale} />
              <Footer locale={locale} />
            </Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
