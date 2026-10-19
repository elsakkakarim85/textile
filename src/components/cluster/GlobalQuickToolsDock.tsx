'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Search,
  X,
  Gauge,
  Globe2,
  GraduationCap,
  Megaphone,
  Layers,
  Recycle,
  Building2,
  ShoppingBag,
  Sparkles,
  Ship,
  ShieldCheck,
  Calculator,
  Command,
  HelpCircle,
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { Pill } from '@/components/cluster/ui';
import { ExpertManualButton, openExpertManual } from '@/components/cluster/ExpertManualModal';

export function GlobalQuickToolsDock({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [open, setOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'navigator' | 'yarn_gsm' | 'takt_fx'>('navigator');
  const [searchQuery, setSearchQuery] = useState('');

  // Pocket Yarn & Fabric GSM Calculator States
  const [yarnNe, setYarnNe] = useState(30);
  const [fabricGsm, setFabricGsm] = useState(180);
  const [fabricWidthCm, setFabricWidthCm] = useState(160);
  const [rollLengthM, setRollLengthM] = useState(100);

  // Pocket Takt & Currency Calculator States
  const [quickShiftMin, setQuickShiftMin] = useState(450);
  const [quickDemand, setQuickDemand] = useState(900);
  const [amountEgp, setAmountEgp] = useState(100000);

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const yarnMetrics = useMemo(() => {
    const ne = Math.max(1, yarnNe);
    const nm = (ne * 1.693).toFixed(1);
    const tex = (590.5 / ne).toFixed(1);
    const denier = (5315 / ne).toFixed(0);
    return { nm, tex, denier };
  }, [yarnNe]);

  const fabricMetrics = useMemo(() => {
    const gsm = Math.max(10, fabricGsm);
    const widthM = Math.max(0.1, fabricWidthCm / 100);
    const lenM = Math.max(1, rollLengthM);
    const rollWeightKg = ((gsm * widthM * lenM) / 1000).toFixed(2);
    const ozPerSqYd = (gsm * 0.02949).toFixed(2);
    const metersPerTon = Math.round(1_000_000 / Math.max(1, gsm * widthM));
    return { rollWeightKg, ozPerSqYd, metersPerTon };
  }, [fabricGsm, fabricWidthCm, rollLengthM]);

  const quickTaktSec = useMemo(() => {
    return Math.max(1, Math.round((quickShiftMin * 60) / Math.max(1, quickDemand)));
  }, [quickShiftMin, quickDemand]);

  const directoryItems = useMemo(
    () => [
      {
        href: `/${locale}/cluster/lean-manufacturing`,
        titleEn: 'Lean Management & Six Sigma Hub (9 Pillars)',
        titleAr: 'مركز الإدارة الرشيقة ولين 6 سيجما (٩ ركائز)',
        cat: 'Lean & IE',
        icon: Gauge,
      },
      {
        href: `/${locale}/cluster/lean-manufacturing?tab=six_sigma`,
        titleEn: 'Six Sigma SPC, Cp/Cpk & DPMO Calculator',
        titleAr: 'حاسبة لين 6 سيجما و Cp/Cpk و DPMO',
        cat: 'Lean & IE',
        icon: Calculator,
      },
      {
        href: `/${locale}/cluster/lean-manufacturing?tab=oee_smed`,
        titleEn: 'OEE, MTBF/MTTR & SMED Changeover Pit-Stop',
        titleAr: 'حاسبة كفاءة الماكينات OEE و SMED',
        cat: 'Lean & IE',
        icon: Wrench,
      },
      {
        href: `/${locale}/cluster/export-intelligence`,
        titleEn: 'Global Export Intelligence, Tenders & Buyer Matchmaking',
        titleAr: 'مركز ذكاء التصدير والمناقصات والمشترين المعتمدين',
        cat: 'Export & Trade',
        icon: Globe2,
      },
      {
        href: `/${locale}/cluster/brand-studio`,
        titleEn: 'AI Brand, Marketing Plans & Media Studio',
        titleAr: 'استوديو بناء العلامات التجارية والتسويق الآلي',
        cat: 'Brand & Media',
        icon: Megaphone,
      },
      {
        href: `/${locale}/cluster/academy/studio`,
        titleEn: 'AI Course Studio (Generate Expert Courses on Any Topic)',
        titleAr: 'استوديو توليد الدورات التدريبية بالذكاء الاصطناعي',
        cat: 'Academy',
        icon: GraduationCap,
      },
      {
        href: `/${locale}/ai`,
        titleEn: 'Multi-Provider Free AI Command Center & Benchmark Arena',
        titleAr: 'مركز قيادة ومقارنة النماذج الذكية المجانية',
        cat: 'AI Hub',
        icon: Sparkles,
      },
      {
        href: `/${locale}/cluster`,
        titleEn: 'Cluster Collaboration Hub (All 17 Modules)',
        titleAr: 'مركز تعاون وتحديث التجمع (١٧ وحدة)',
        cat: 'Cluster',
        icon: Layers,
      },
      {
        href: `/${locale}/cluster/procurement`,
        titleEn: 'Joint Procurement & Group Buying Pools',
        titleAr: 'الشراء الموحّد للغزول والصبغات',
        cat: 'Collaboration',
        icon: ShoppingBag,
      },
      {
        href: `/${locale}/cluster/capacity`,
        titleEn: 'Idle Machine Capacity Exchange',
        titleAr: 'بورصة تبادل الطاقات الإنتاجية الشاغرة',
        cat: 'Collaboration',
        icon: Building2,
      },
      {
        href: `/${locale}/cluster/consortia`,
        titleEn: 'Export Consortia & Joint Bidding',
        titleAr: 'التحالفات التصديرية المشتركة',
        cat: 'Collaboration',
        icon: ShieldCheck,
      },
      {
        href: `/${locale}/cluster/sustainability`,
        titleEn: 'Sustainability, ESG & EU CBAM Calculator',
        titleAr: 'الاستدامة والبصمة الكربونية CBAM',
        cat: 'ESG & DPP',
        icon: Recycle,
      },
      {
        href: `/${locale}/dpp/demo-giza86-sateen`,
        titleEn: 'EU Digital Product Passport (DPP) Verifier',
        titleAr: 'جواز السفر الرقمي الأوروبي للمنتج (EU DPP)',
        cat: 'ESG & DPP',
        icon: ShieldCheck,
      },
      {
        href: `/${locale}/services/logistics`,
        titleEn: 'Global Freight, Container & Incoterms 2020 Calculator',
        titleAr: 'حاسبة الشحن الدولي والحاويات والإنكوتيرمز',
        cat: 'Logistics',
        icon: Ship,
      },
      {
        href: `/${locale}/marketplaces/waste`,
        titleEn: 'Circular Textile Waste & Red-Tag Exchange',
        titleAr: 'بورصة تدوير العوادم والرواكد النسيجية',
        cat: 'Marketplace',
        icon: Recycle,
      },
    ],
    [locale]
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return directoryItems;
    return directoryItems.filter(
      (i) =>
        i.titleEn.toLowerCase().includes(q) ||
        i.titleAr.toLowerCase().includes(q) ||
        i.cat.toLowerCase().includes(q)
    );
  }, [directoryItems, searchQuery]);

  return (
    <>
      {/* Floating Quick-Tools & Command Palette Trigger */}
      <div className="fixed bottom-4 start-4 z-40 flex items-center gap-1.5 print:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-400/50 bg-slate-950/95 px-3.5 py-2 text-xs font-extrabold text-white shadow-2xl hover:bg-emerald-950 transition cursor-pointer"
          title="Open Industrial Toolkit & Command Palette (Ctrl+K)"
        >
          <Calculator className="h-3.5 w-3.5 text-emerald-400" />
          <span className="hidden sm:inline">{t('Textile Toolkit', 'أدوات المهندس')}</span>
          <kbd className="rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-mono text-emerald-300">
            Ctrl+K
          </kbd>
        </button>
        <ExpertManualButton manualId="gadget-quick-tools" locale={locale} variant="icon" />
      </div>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-3xl border-2 border-emerald-500/40 bg-card text-foreground shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-950 px-6 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <Command className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold">
                    {t(
                      'Mahalla Industrial Engineering Gadget & Command Center',
                      'حقيبة المهندس الصناعي ومركز الانتقال السريع للمنصة'
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {t(
                      'Instant module navigation, Yarn Count (Ne/Nm/Tex/Denier), Fabric GSM & Takt calculators',
                      'انتقال فوري للوحدات + حاسبة نمر الغزل (Ne/Tex/Denier) ووزن القماش GSM وزمن التاكت'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ExpertManualButton manualId="gadget-quick-tools" locale={locale} variant="mini" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/20 p-1.5 text-slate-300 hover:bg-white/10 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sub-Tabs */}
            <div className="flex flex-wrap gap-2 border-b bg-muted/40 px-6 py-3">
              {[
                {
                  id: 'navigator' as const,
                  manualId: 'gadget-quick-tools',
                  icon: Search,
                  en: '1. Quick Module Jump (Ctrl+K)',
                  ar: '١. الانتقال السريع لوحدات المنصة',
                },
                {
                  id: 'yarn_gsm' as const,
                  manualId: 'gadget-yarn-gsm',
                  icon: Calculator,
                  en: '2. Yarn (Ne/Tex/Den) & Fabric GSM Calculator',
                  ar: '٢. حاسبة نمر الغزل ووزن القماش GSM',
                },
                {
                  id: 'takt_fx' as const,
                  manualId: 'gadget-takt-fx',
                  icon: Gauge,
                  en: '3. Pocket Takt Time & Export FX Converter',
                  ar: '٣. حاسبة التاكت السريعة والعملات',
                },
              ].map((tb) => {
                const Icon = tb.icon;
                const active = activeTool === tb.id;
                return (
                  <button
                    key={tb.id}
                    type="button"
                    onClick={() => setActiveTool(tb.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition cursor-pointer ${
                      active
                        ? 'bg-emerald-600 text-white'
                        : 'bg-background border hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {isAr ? tb.ar : tb.en}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        openExpertManual(tb.manualId);
                      }}
                      title={isAr ? 'دليل الخبير لهذه الحاسبة' : 'Expert Manual for this Calculator'}
                      className={`ms-1 inline-flex h-4 w-4 items-center justify-center rounded-full border transition ${
                        active
                          ? 'border-white/30 bg-white/15 text-white hover:bg-white/30'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      <HelpCircle className="h-2.5 w-2.5" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
              {activeTool === 'navigator' && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="h-4 w-4 text-muted-foreground absolute top-3 start-3.5" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t(
                        'Search 28+ modules, calculators, AI studios (e.g., Lean, OEE, Cpk, Export, Brand, DPP)...',
                        'ابحث في وحدات المنصة والحاسبات (مثال: لين، OEE، تصدير، علامة تجارية، جواز رقمي)...'
                      )}
                      className="w-full rounded-xl border bg-background ps-10 pe-4 py-2.5 text-xs sm:text-sm font-medium focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {filteredItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="rounded-xl border p-3 hover:border-emerald-500 hover:bg-emerald-500/5 transition flex items-start gap-3"
                        >
                          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold truncate">
                              {isAr ? item.titleAr : item.titleEn}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {item.cat}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTool === 'yarn_gsm' && (
                <div className="space-y-6">
                  {/* Yarn Count Converter */}
                  <div className="rounded-2xl border p-4 space-y-3 bg-muted/15">
                    <h4 className="font-extrabold text-sm">
                      {t(
                        'Universal Textile Yarn Count Converter (Ne ↔ Nm ↔ Tex ↔ Denier)',
                        'محول نمر الخيوط القياسي (Ne ↔ Nm ↔ Tex ↔ Denier)'
                      )}
                    </h4>
                    <div className="grid sm:grid-cols-4 gap-3">
                      <div className="rounded-xl border bg-background p-3">
                        <label className="block text-[11px] font-bold text-emerald-600 mb-1">
                          {t('Cotton Count (Ne)', 'النمرة الإنجليزية (Ne)')}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={200}
                          value={yarnNe}
                          onChange={(e) => setYarnNe(Number(e.target.value))}
                          className="w-full rounded-lg border px-2.5 py-1 text-sm font-extrabold"
                        />
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <span className="text-[11px] text-muted-foreground block">
                          {t('Metric Count (Nm)', 'النمرة المترية (Nm)')}
                        </span>
                        <strong className="text-lg font-extrabold">{yarnMetrics.nm} Nm</strong>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <span className="text-[11px] text-muted-foreground block">
                          {t('Linear Density (Tex)', 'نظام تكس (Tex)')}
                        </span>
                        <strong className="text-lg font-extrabold text-emerald-600">
                          {yarnMetrics.tex} Tex
                        </strong>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <span className="text-[11px] text-muted-foreground block">
                          {t('Filament Denier', 'الدينير (Denier)')}
                        </span>
                        <strong className="text-lg font-extrabold text-sky-600">
                          {yarnMetrics.denier} D
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Fabric GSM & Roll Weight Calculator */}
                  <div className="rounded-2xl border p-4 space-y-3 bg-muted/15">
                    <h4 className="font-extrabold text-sm">
                      {t(
                        'Fabric GSM, Roll Weight (kg) & Yield (Meters / Ton) Calculator',
                        'حاسبة وزن رول القماش (كجم) وعدد الأمتار الطولية في الطن'
                      )}
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border bg-background p-3">
                        <label className="block text-[11px] font-semibold mb-1">
                          {t('Fabric Weight (GSM g/m²)', 'وزن المتر المربع (GSM)')}
                        </label>
                        <input
                          type="number"
                          value={fabricGsm}
                          onChange={(e) => setFabricGsm(Number(e.target.value))}
                          className="w-full rounded-lg border px-2.5 py-1 text-sm font-bold"
                        />
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <label className="block text-[11px] font-semibold mb-1">
                          {t('Fabric Width (cm)', 'عرض القماش (سم)')}
                        </label>
                        <input
                          type="number"
                          value={fabricWidthCm}
                          onChange={(e) => setFabricWidthCm(Number(e.target.value))}
                          className="w-full rounded-lg border px-2.5 py-1 text-sm font-bold"
                        />
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <label className="block text-[11px] font-semibold mb-1">
                          {t('Roll Length (meters)', 'طول الرول (متر)')}
                        </label>
                        <input
                          type="number"
                          value={rollLengthM}
                          onChange={(e) => setRollLengthM(Number(e.target.value))}
                          className="w-full rounded-lg border px-2.5 py-1 text-sm font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 pt-1">
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                        <span className="text-[11px] text-muted-foreground block">
                          {t('Net Roll Weight', 'وزن الرول الصافي')}
                        </span>
                        <strong className="text-lg font-extrabold text-emerald-600">
                          {fabricMetrics.rollWeightKg} kg
                        </strong>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <span className="text-[11px] text-muted-foreground block">
                          {t('Imperial Weight (oz/yd²)', 'الوزن بالأوقية (oz/yd²)')}
                        </span>
                        <strong className="text-lg font-extrabold">
                          {fabricMetrics.ozPerSqYd} oz/yd²
                        </strong>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <span className="text-[11px] text-muted-foreground block">
                          {t('Linear Yield per Ton', 'عدد الأمتار الطولية في الطن')}
                        </span>
                        <strong className="text-lg font-extrabold text-sky-600">
                          {fabricMetrics.metersPerTon} m / ton
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTool === 'takt_fx' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border p-4 space-y-3 bg-muted/15">
                    <h4 className="font-extrabold text-sm">
                      {t('Quick Shift Takt Time & Export FX Converter', 'حاسبة التاكت السريعة وتحويل عملات التصدير')}
                    </h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border bg-background p-3">
                        <label className="block text-[11px] font-semibold mb-1">
                          {t('Available Shift Minutes', 'صافي دقائق الوردية')}
                        </label>
                        <input
                          type="number"
                          value={quickShiftMin}
                          onChange={(e) => setQuickShiftMin(Number(e.target.value))}
                          className="w-full rounded-lg border px-2.5 py-1 text-sm font-bold"
                        />
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <label className="block text-[11px] font-semibold mb-1">
                          {t('Shift Customer Demand', 'الطلب المطلوب بالوردية')}
                        </label>
                        <input
                          type="number"
                          value={quickDemand}
                          onChange={(e) => setQuickDemand(Number(e.target.value))}
                          className="w-full rounded-lg border px-2.5 py-1 text-sm font-bold"
                        />
                      </div>
                      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
                        <span className="text-[11px] text-muted-foreground block">
                          {t('Required Takt Beat', 'زمن التاكت المطلوب')}
                        </span>
                        <strong className="text-2xl font-extrabold text-emerald-600">
                          {quickTaktSec} sec/unit
                        </strong>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t">
                      <div className="rounded-xl border bg-background p-3">
                        <label className="block text-[11px] font-semibold mb-1">
                          {t('Amount in EGP', 'المبلغ بالجنيه المصري (EGP)')}
                        </label>
                        <input
                          type="number"
                          value={amountEgp}
                          onChange={(e) => setAmountEgp(Number(e.target.value))}
                          className="w-full rounded-lg border px-2.5 py-1 text-sm font-bold"
                        />
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <span className="text-[11px] text-muted-foreground block">
                          {t('Equivalent USD (FOB Ref)', 'المعادل بالدولار الأمريكي')}
                        </span>
                        <strong className="text-lg font-extrabold text-emerald-600">
                          ${Math.round(amountEgp / 48.5).toLocaleString()} USD
                        </strong>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <span className="text-[11px] text-muted-foreground block">
                          {t('Equivalent EUR (EU Ref)', 'المعادل باليورو الأوروبي')}
                        </span>
                        <strong className="text-lg font-extrabold text-sky-600">
                          €{Math.round(amountEgp / 52.8).toLocaleString()} EUR
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalQuickToolsDock;
