import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { computeKPIs, computeEsgScore } from '@/server/modernization/emissions';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { PageHeader, StatCard, EmptyState, DbOfflineBanner } from '@/components/cluster/ui';
import { SustainabilityChart } from '@/components/cluster/modern/SustainabilityChart';
import SustainabilityEntryForm from '@/components/cluster/modern/SustainabilityEntryForm';
import { Leaf, Droplets, Recycle, TrendingDown, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default async function SustainabilityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  if (!userId) redirect(`/${locale}/sign-in`);

  if (!factory) {
    return (
      <div className="container mx-auto py-8 px-4">
        <PageHeader icon={Leaf} title={t('Sustainability & ESG', 'الاستدامة والبيئة')} subtitle={t('Track your carbon footprint and ESG metrics.', 'تتبع البصمة الكربونية ومقاييس الحوكمة البيئية والاجتماعية والمؤسسية.')} />
        <EmptyState icon={Leaf} title={t('Factory Profile Required', 'مطلوب ملف مصنع')} hint={t('You must create or join a factory profile to track emissions.', 'يجب إنشاء أو الانضمام إلى ملف مصنع لتتبع الانبعاثات.')} />
      </div>
    );
  }

  const { data: records, ok } = await safeQuery(
    () => prisma.sustainabilityRecord.findMany({
      where: { factoryId: factory.id },
      orderBy: { period: 'desc' },
      take: 24,
    }),
    // Fallback data
    [{ period: '2026-09', productionVolumeKg: 50000, co2eKg: 85000, waterM3: 1500, wasteTotalKg: 2000, wasteRecycledKg: 800, certZdhc: false, certOekoTex: false }]
  );

  const latest = records?.[0] || null;
  const kpis = latest ? computeKPIs(latest) : null;
  const esgScore = records ? computeEsgScore(records) : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Leaf}
        title={t('Sustainability, ESG & CBAM Readiness', 'الاستدامة والجاهزية لآلية CBAM')}
        subtitle={t('Track your monthly emissions, water usage, and waste to prepare for export requirements.', 'تتبع انبعاثاتك الشهرية واستخدام المياه والمخلفات للتحضير لمتطلبات التصدير.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <SustainabilityEntryForm locale={locale} />

      {latest && kpis ? (
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label={t('Latest CO2e Intensity', 'كثافة الكربون الأخيرة')}
            value={`${fmtNumber(locale, kpis.intensityCo2e)}`}
            hint={t('kg CO2e / kg product', 'كجم كربون / كجم منتج')}
            icon={TrendingDown}
            tone="emerald"
          />
          <StatCard
            label={t('Water Intensity', 'كثافة استهلاك المياه')}
            value={`${fmtNumber(locale, kpis.intensityWater)}`}
            hint={t('Liters / kg product', 'لتر / كجم منتج')}
            icon={Droplets}
            tone="blue"
          />
          <StatCard
            label={t('Waste Diversion', 'تحويل المخلفات')}
            value={`${fmtNumber(locale, kpis.wasteDiversionRate)}%`}
            hint={t('Recycled or reused', 'معاد تدويرها أو استخدامها')}
            icon={Recycle}
            tone="amber"
          />
          <StatCard
            label={t('Est. ESG Score', 'درجة ESG التقديرية')}
            value={`${esgScore}/100`}
            hint={t('Based on latest data', 'بناءً على أحدث البيانات')}
            tone={esgScore > 70 ? 'emerald' : esgScore > 40 ? 'amber' : 'red'}
          />
        </div>
      ) : (
        <EmptyState icon={Leaf} title={t('No Data Yet', 'لا توجد بيانات بعد')} hint={t('Add your first monthly record above to see KPIs.', 'أضف سجلك الشهري الأول أعلاه لرؤية المقاييس.')} />
      )}

      {records && records.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t('Emissions Trend', 'اتجاه الانبعاثات')}</h3>
              <SustainabilityChart records={records} locale={locale} />
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-lg">{t('EU CBAM & DPP Readiness', 'جاهزية CBAM وجواز السفر الرقمي الأوروبي')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${records.length >= 12 ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="font-medium text-sm">{t('12 Months of Data', '12 شهراً من البيانات')}</p>
                    <p className="text-xs text-muted-foreground">{t('Required for robust baseline', 'مطلوب لخط أساس موثوق')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${latest?.certZdhc ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="font-medium text-sm">ZDHC Compliance</p>
                    <p className="text-xs text-muted-foreground">{t('Zero Discharge of Hazardous Chemicals', 'صفر تصريف للمواد الكيميائية الخطرة')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 shrink-0 ${latest?.certOekoTex ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="font-medium text-sm">OEKO-TEX / GOTS</p>
                    <p className="text-xs text-muted-foreground">{t('Product safety and organic standards', 'سلامة المنتج والمعايير العضوية')}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
