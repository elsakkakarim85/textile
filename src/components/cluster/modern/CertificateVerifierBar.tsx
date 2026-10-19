'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Award, ShieldCheck, Search, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';

export interface IssuedCertItem {
  code: string;
  learnerName: string;
  courseTitle: string;
  courseTitleAr?: string | null;
  provider: string;
  completedAt?: string | Date | null;
}

export function CertificateVerifierBar({
  locale,
  recentCertificates,
}: {
  locale: string;
  recentCertificates: IssuedCertItem[];
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [code, setCode] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = code.trim().toUpperCase();
    if (!cleaned) return;
    router.push(`/${locale}/cluster/academy/certificate/${encodeURIComponent(cleaned)}`);
  };

  return (
    <Card className="p-6 border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 via-background to-indigo-500/5">
      <div className="grid lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              {t('Official Credential Registry & Verification', 'سجل التحقق من الشهادات الرقمية المعتمدة')}
            </div>
            <ExpertManualButton manualId="academy-cert-verifier" locale={locale} variant="mini" />
          </div>
          <h3 className="text-lg font-extrabold">
            {t(
              'Verify a Mahalla Cluster Academy Certificate',
              'تحقق من صحة شهادة أكاديمية تجمع المحلة'
            )}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t(
              'Buyers, auditors, and HR managers can enter any certificate code (e.g., MC-LEAN2026A) to verify learner mastery, authorized standards (UNIDO, ZDHC, ISO 17025, EU ESPR), and SHA-256 signature.',
              'يمكن للمشترين والمدققين ومديري الموارد البشرية إدخال كود الشهادة (مثل MC-LEAN2026A) للتحقق الفوري من الاعتماد والمعايير الدولية.'
            )}
          </p>
          <form onSubmit={handleVerify} className="flex gap-2 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t('Enter Certificate Code (e.g. MC-LEAN2026A)', 'أدخل كود الشهادة (مثال: MC-LEAN2026A)')}
                className="ps-9 font-mono uppercase text-xs"
              />
            </div>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0">
              {t('Verify Credential', 'تحقق الآن')}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>{t('Recently Issued Cluster Credentials', 'أحدث الشهادات الصادرة في التجمع')}</span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('SHA-256 Verified', 'موثقة رقمياً')}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {recentCertificates.map((cert) => (
              <Link
                key={cert.code}
                href={`/${locale}/cluster/academy/certificate/${cert.code}`}
                className="p-3 rounded-xl border bg-background hover:border-emerald-500/60 transition-all flex items-start justify-between gap-2 group shadow-2xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-mono text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                      {cert.code}
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate group-hover:text-primary">
                    {locale === 'ar' ? cert.courseTitleAr || cert.courseTitle : cert.courseTitle}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {cert.learnerName} • {cert.provider}
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-emerald-600 shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
