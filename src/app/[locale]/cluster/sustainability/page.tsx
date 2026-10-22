import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { computeKPIs, computeEsgScore } from '@/server/modernization/emissions';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { PageHeader, StatCard, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { SustainabilityChart } from '@/components/cluster/modern/SustainabilityChart';
import SustainabilityEntryForm from '@/components/cluster/modern/SustainabilityEntryForm';
import { GoogleCreativeLabIntegration } from '@/components/cluster/modern/GoogleCreativeLabIntegration';
import { Leaf, Droplets, Recycle, TrendingDown, CheckCircle2, Sun, Sparkles, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SustainabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  const { data: records, ok } = await safeQuery(
    async () => {
      if (factory) {
        const own = await prisma.sustainabilityRecord.findMany({
          where: { factoryId: factory.id },
          orderBy: { period: 'desc' },
          take: 24,
        });
        if (own.length > 0) return own;
      }
      return prisma.sustainabilityRecord.findMany({
        orderBy: { period: 'desc' },
        take: 24,
      });
    },
    [
      {
        id: 's1',
        period: new Date('2026-09-01T00:00:00.000Z'),
        productionKg: 54000,
        electricityKwh: 112000,
        solarKwh: 22000,
        naturalGasM3: 3800,
        waterM3: 1750,
        recycledWaterM3: 520,
        wasteKg: 1400,
        recycledWasteKg: 780,
        co2eKg: 47948,
        notes: 'ZDHC Level 3 & OEKO-TEX Standard 100',
      },
      {
        id: 's2',
        period: new Date('2026-08-01T00:00:00.000Z'),
        productionKg: 50000,
        electricityKwh: 118000,
        solarKwh: 15000,
        naturalGasM3: 4100,
        waterM3: 1920,
        recycledWaterM3: 430,
        wasteKg: 1500,
        recycledWasteKg: 650,
        co2eKg: 54386,
        notes: 'OEKO-TEX Standard 100',
      },
    ] as any[]
  );

  const latest = records?.[0] || null;
  const kpis = latest ? computeKPIs(latest) : null;
  const esgScore = records && records.length > 0 ? computeEsgScore(records) : 72;
  const notesStr = String(latest?.notes || '').toUpperCase();
  const hasZdhc = notesStr.includes('ZDHC') || (kpis?.waterRecyclingRate ?? 0) >= 20;
  const hasOeko = notesStr.includes('OEKO') || notesStr.includes('GOTS') || esgScore >= 65;

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Leaf}
        title={t('Sustainability, ESG & EU CBAM Readiness', 'الاستدامة والحوكمة البيئية وجاهزية CBAM الأوروبية')}
        subtitle={t(
          'Monitor Scope 1 & 2 carbon intensity, water recycling (ZLD), circular cotton waste diversion, and export compliance for European buyers.',
          'تتبع كثافة الانبعاثات الكربونية (النطاق ١ و ٢)، إعادة تدوير المياه، تدوير العوادم، والجاهزية لمتطلبات التصدير للاتحاد الأوروبي.'
        )}
        actions={
          factory && (
            <Pill tone="emerald">
              {t('Active Factory:', 'المصنع النشط:')} {factory.name}
            </Pill>
          )
        }
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <SustainabilityEntryForm locale={locale} records={records || []} />

      {latest && kpis && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            label={t('Carbon Intensity', 'كثافة الكربون')}
            value={`${fmtNumber(locale, kpis.intensityCo2e)}`}
            hint={t('kg CO2e / kg textile', 'كجم كربون / كجم منتج')}
            icon={TrendingDown}
            tone="emerald"
          />
          <StatCard
            label={t('Water Intensity', 'كثافة المياه')}
            value={`${fmtNumber(locale, kpis.intensityWater)}`}
            hint={t('Liters / kg product', 'لتر / كجم منتج')}
            icon={Droplets}
            tone="blue"
          />
          <StatCard
            label={t('Waste Diversion', 'تدوير المخلفات')}
            value={`${fmtNumber(locale, kpis.wasteDiversionRate)}%`}
            hint={t('Recycled / upcycled', 'معاد تدويرها')}
            icon={Recycle}
            tone="amber"
          />
          <StatCard
            label={t('Renewable Energy', 'الطاقة المتجددة')}
            value={`${fmtNumber(locale, kpis.renewableSharePct)}%`}
            hint={t('Solar PPA share', 'حصة الطاقة الشمسية')}
            icon={Sun}
            tone="purple"
          />
          <StatCard
            label={t('Cluster ESG Rating', 'تقييم ESG البيئي')}
            value={`${esgScore}/100`}
            hint={t('EU buyer readiness index', 'مؤشر جاهزية التصدير')}
            tone={esgScore >= 70 ? 'emerald' : esgScore >= 45 ? 'amber' : 'red'}
          />
        </div>
      )}

      {records && records.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">
                {t('Monthly Carbon Footprint (CO2e) & Intensity Trend', 'اتجاه البصمة الكربونية الشهرية وكثافة الانبعاثات')}
              </h3>
              <SustainabilityChart records={records} locale={locale} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4 text-lg">
                {t('EU CBAM & Digital Product Passport (DPP) Checklist', 'قائمة التحقق الأوروبية (CBAM & DPP)')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">{t('Scope 1 & 2 GHG Accounting', 'حساب انبعاثات النطاق ١ و ٢')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('Grid electricity (0.45 kg/kWh) & natural gas verified', 'تم توثيق استهلاك الكهرباء والغاز الطبيعي')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${hasZdhc ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <div>
                    <p className="font-semibold text-sm">ZDHC MRSL & Wastewater</p>
                    <p className="text-xs text-muted-foreground">
                      {t('Zero Discharge of Hazardous Chemicals & ZLD recycling', 'التوافق مع معايير الصرف الصناعي وتدوير المياه')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${hasOeko ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <div>
                    <p className="font-semibold text-sm">OEKO-TEX Standard 100 / GOTS</p>
                    <p className="text-xs text-muted-foreground">
                      {t('Chemical safety & organic fiber traceability', 'سلامة المنتج وتتبع سلاسل الإمداد القطنية')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  {t('Recommended ESG & Export Courses', 'الدورات التدريبية المعتمدة للاستدامة والتصدير')}
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/${locale}/cluster/academy/eu-cbam-dpp-export`}
                    className="text-xs font-semibold p-2.5 rounded-lg border bg-muted/40 hover:border-emerald-500/50 transition-colors flex items-center justify-between"
                  >
                    <span>{t('EU CBAM Carbon Reporting & Digital Product Passports', 'تقارير الكربون CBAM وجواز المنتج الأوروبي')}</span>
                    <span className="text-emerald-600 font-bold">→</span>
                  </Link>
                  <Link
                    href={`/${locale}/cluster/academy/zdhc-chemical-management`}
                    className="text-xs font-semibold p-2.5 rounded-lg border bg-muted/40 hover:border-emerald-500/50 transition-colors flex items-center justify-between"
                  >
                    <span>{t('ZDHC MRSL v3.1 Chemical & Wastewater Mastery', 'إدارة الكيماويات والصرف الصناعي ZDHC')}</span>
                    <span className="text-emerald-600 font-bold">→</span>
                  </Link>
                  <Link
                    href={`/${locale}/cluster/academy/studio?category=SUSTAINABILITY&topic=${encodeURIComponent(
                      'Decarbonization, Solar PPA Integration & ZLD Water Recycling for Dyehouses'
                    )}&role=${encodeURIComponent('Sustainability & Utility Engineers')}&need=${encodeURIComponent(
                      `Reduce carbon intensity (${kpis?.intensityCo2e ?? 0.89} kg CO2e/kg) and water intensity (${kpis?.intensityWater ?? 32} L/kg) to meet EU ESPR and ZDHC Level 3.`
                    )}`}
                    className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('Generate Custom ESG Course (AI Studio)', 'توليد دورة استدامة مخصصة لمصنعك بالذكاء الاصطناعي')}
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Google Opal CBAM/ESPR Auditor Mini-App & Google Stitch DPP Mobile UI Prototyper */}
      <div className="mt-10">
        <GoogleCreativeLabIntegration
          locale={locale}
          defaultTool="opal"
          contextModule="sustainability"
        />
      </div>
    </div>
  );
}
