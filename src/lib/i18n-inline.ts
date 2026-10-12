/**
 * Inline bilingual text helper for cluster modules.
 * Keeps module strings co-located with the UI (avoids merge conflicts in messages/*.json).
 *   tr(locale, 'Joint Procurement', 'الشراء المشترك')
 */
export type Locale = 'ar' | 'en' | string;

export function tr(locale: Locale, en: string, ar: string): string {
  return locale === 'ar' ? ar : en;
}

export const isRTL = (locale: Locale) => locale === 'ar';

/** Pick the localized variant of a DB field pair, e.g. pick(locale, row.title, row.titleAr). */
export function pick(locale: Locale, en?: string | null, ar?: string | null): string {
  return (locale === 'ar' ? ar || en : en || ar) ?? '';
}

export function fmtNumber(locale: Locale, n: number | null | undefined, digits = 0): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: digits }).format(n);
}

export function fmtMoney(locale: Locale, n: number | null | undefined, currency = 'EGP'): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

export function fmtDate(locale: Locale, d: Date | string | null | undefined, withTime = false): string {
  if (!d) return '—';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    dateStyle: 'medium',
    ...(withTime ? { timeStyle: 'short' } : {}),
  }).format(new Date(d));
}

export function daysUntil(d: Date | string): number {
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
}
