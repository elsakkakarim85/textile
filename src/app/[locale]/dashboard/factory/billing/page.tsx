"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Award, ShieldCheck, Coins, Sparkles } from 'lucide-react';

export default function FactoryBillingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [activeTier, setActiveTier] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSelectTier = (tier: 'FREE' | 'PRO' | 'ENTERPRISE', label: string) => {
    setActiveTier(tier);
    setNotice(
      t(
        `Membership tier updated to ${label}. All EU DPP, AI Studios, and Export Intelligence privileges are active.`,
        `تم تحديث باقة عضوية المصنع إلى (${label}). جميع مزايا جواز المنتج الأوروبي واستوديوهات الذكاء الاصطناعي مفعلة.`
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            {t(
              'Cluster Membership Tiers & Grant Subsidies',
              'باقات عضوية التجمع الصناعي ومنح الدعم الفني'
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t(
              'Manage your factory tier, EU Digital Product Passport quota, and UNIDO / TIGARA / EBRD co-financed modernization subsidies.',
              'أدر باقة مصنعك، وحصة جوازات المنتجات الأوروبية (EU DPP)، ومنح التحديث الصناعي الممولة من مشروع تجارة والبنك الأوروبي.'
            )}
          </p>
        </div>
        <Link
          href={`/${locale}/cluster/funding`}
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Coins className="w-4 h-4" />
          {t('Apply for 80% Grant Subsidy →', 'التقديم على منح الدعم الفني (حتى 80%) ←')}
        </Link>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {notice}
          </span>
          <button onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Tier */}
        <Card className={`flex flex-col justify-between ${activeTier === 'FREE' ? 'border-primary ring-2 ring-primary/20 shadow-md' : ''}`}>
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  {t('SME Cluster Member', 'عضوية المصانع الصغيرة (أساسي)')}
                </CardTitle>
                {activeTier === 'FREE' && <Badge>{t('Active', 'مفعل')}</Badge>}
              </div>
              <div className="text-3xl font-black mt-2">
                0 EGP
                <span className="text-xs font-normal text-muted-foreground">
                  {' '}
                  / {t('month (TIGARA Subsidized)', 'شهرياً (مدعوم بالكامل)')}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex gap-2 items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {t('Public Factory Profile & B2B Catalog', 'صفحة مصنع موثقة بالدليل وعرض المنتجات')}
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {t('Join Joint Procurement Pools (Up to 14% Savings)', 'الاشتراك في الشراء المجمع للغزول والصبغات')}
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {t('9-Pillar Lean Six Sigma & OEE Calculators', 'استخدام حاسبات اللين وOEE ومصفوفة 5S')}
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {t('3 Active Recruitment Job Postings', 'نشر حتى 3 وظائف شاغرة')}
                </li>
              </ul>
            </CardContent>
          </div>
          <div className="p-6 pt-0">
            <button
              disabled={activeTier === 'FREE'}
              onClick={() => handleSelectTier('FREE', t('SME Cluster Member', 'عضوية المصانع الصغيرة'))}
              className="w-full py-2.5 border rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-muted transition-colors"
            >
              {activeTier === 'FREE'
                ? t('Current Active Plan', 'الباقة الحالية')
                : t('Switch to SME Free Tier', 'التحويل للباقة الأساسية')}
            </button>
          </div>
        </Card>

        {/* Pro Exporter Plan */}
        <Card
          className={`relative flex flex-col justify-between ${
            activeTier === 'PRO'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg bg-emerald-500/5'
              : 'border-emerald-500/30'
          }`}
        >
          <div className="absolute top-0 end-0 bg-emerald-600 text-white px-3 py-1 rounded-bl-xl rounded-tr-xl text-[10px] font-bold flex items-center gap-1">
            <Zap className="w-3 h-3" /> {t('RECOMMENDED EXPORTER', 'موصى به للمصدرين')}
          </div>
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  {t('Verified Gold Exporter', 'باقة المصدر الذهبي المعتمد')}
                </CardTitle>
                {activeTier === 'PRO' && (
                  <Badge className="bg-emerald-600 text-white">{t('Active', 'مفعل')}</Badge>
                )}
              </div>
              <div className="text-3xl font-black mt-2">
                500 EGP
                <span className="text-xs font-normal text-muted-foreground">
                  {' '}
                  / {t('month', 'شهرياً')}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2.5 text-xs">
                <li className="flex gap-2 items-center font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  {t('Unlimited EU Digital Product Passports (SHA-256 DPP)', 'إصدار غير محدود لجواز المنتج الأوروبي (EU DPP)')}
                </li>
                <li className="flex gap-2 items-center font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  {t('Full Global Export Intelligence & Buyer Outreach AI', 'وصول كامل لدراسات التصدير وقاعدة المشترين الدوليين')}
                </li>
                <li className="flex gap-2 items-center font-semibold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  {t('AI Brand, Marketing Plans & Print Collateral Studio', 'استوديو الهوية التجارية والمطبوعات بالذكاء الاصطناعي')}
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  {t('30/40/30 Smart Escrow Reduced Commission (1.0%)', 'تخفيض عمولة عقود الضمان الذكية إلى 1.0%')}
                </li>
              </ul>
            </CardContent>
          </div>
          <div className="p-6 pt-0">
            <button
              disabled={activeTier === 'PRO'}
              onClick={() => handleSelectTier('PRO', t('Verified Gold Exporter', 'باقة المصدر الذهبي'))}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              {activeTier === 'PRO'
                ? t('Current Active Plan ✓', 'الباقة المفعلة حالياً ✓')
                : t('Activate Gold Exporter Plan', 'تفعيل باقة المصدر الذهبي')}
            </button>
          </div>
        </Card>

        {/* Enterprise Anchor Mill */}
        <Card className={`flex flex-col justify-between ${activeTier === 'ENTERPRISE' ? 'border-primary ring-2 ring-primary/20 shadow-md' : ''}`}>
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">
                  {t('Anchor Mill & Consortium Lead', 'باقة المصانع الكبرى وقيادة التحالفات')}
                </CardTitle>
                {activeTier === 'ENTERPRISE' && <Badge>{t('Active', 'مفعل')}</Badge>}
              </div>
              <div className="text-3xl font-black mt-2">
                2,500 EGP
                <span className="text-xs font-normal text-muted-foreground">
                  {' '}
                  / {t('month', 'شهرياً')}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex gap-2 items-center">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  {t('Lead Multi-Factory Export Consortia & Joint Tenders', 'قيادة التحالفات التصديرية والمناقصات الدولية الكبرى')}
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {t('ERP / MES & Scada OEE Telemetry API Integration', 'ربط مباشر مع أنظمة ERP وحساسات OEE بالمصنع')}
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {t('Dedicated TIGARA Export & Lean Master Black Belt Advisor', 'مستشار تصدير ولين 6 سيجما مخصص للمصنع')}
                </li>
                <li className="flex gap-2 items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  {t('Priority Shared Lab & Dyehouse Slot Reservations', 'أولوية حجز معامل الاختبار المعتمدة ISO 17025')}
                </li>
              </ul>
            </CardContent>
          </div>
          <div className="p-6 pt-0">
            <button
              disabled={activeTier === 'ENTERPRISE'}
              onClick={() => handleSelectTier('ENTERPRISE', t('Anchor Mill & Consortium Lead', 'باقة المصانع الكبرى'))}
              className="w-full py-2.5 border rounded-xl text-xs font-bold hover:bg-muted disabled:opacity-50 transition-colors"
            >
              {activeTier === 'ENTERPRISE'
                ? t('Current Active Plan ✓', 'الباقة المفعلة حالياً ✓')
                : t('Activate Anchor Mill Tier', 'تفعيل باقة المصانع الكبرى')}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
