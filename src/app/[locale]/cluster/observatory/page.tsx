import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtNumber, fmtMoney } from '@/lib/i18n-inline';
import { PageHeader, StatCard, DbOfflineBanner } from '@/components/cluster/ui';
import { ObservatoryMaturityChart } from '@/components/cluster/community/ObservatoryMaturityChart';
import { Telescope, Building2, ShoppingCart, Activity, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SustainabilityChart } from '@/components/cluster/modern/SustainabilityChart';

export default async function ObservatoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  // Re-implement the API logic here for the server component to avoid a fetch to localhost
  const { data, ok } = await safeQuery(
    async () => {
      const [f, r, c, p, m, s] = await Promise.allSettled([
        prisma.factory.count({ where: { isApproved: true } }),
        prisma.rFQ.count({ where: { status: 'OPEN' } }),
        prisma.contract.aggregate({ _sum: { value: true }, where: { status: 'ACTIVE' } }),
        prisma.poolCommitment.aggregate({ _sum: { quantity: true }, where: { status: 'COMMITTED' } }),
        prisma.maturityAssessment.findMany({ orderBy: { createdAt: 'desc' }, select: { factoryId: true, scores: true } }),
        prisma.sustainabilityRecord.findMany({ take: 200, orderBy: { period: 'desc' } })
      ]);

      const factoriesCount = f.status === 'fulfilled' ? f.value : 0;
      const openRfqs = r.status === 'fulfilled' ? r.value : 0;
      const totalContractValue = c.status === 'fulfilled' ? c.value._sum.value?.toNumber() || 0 : 0;
      const committedVolume = p.status === 'fulfilled' ? p.value._sum.quantity?.toNumber() || 0 : 0;

      let maturityAverages = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
      if (m.status === 'fulfilled' && m.value.length > 0) {
        const latestPerFactory = new Map();
        for (const a of m.value) if (!latestPerFactory.has(a.factoryId)) latestPerFactory.set(a.factoryId, a.scores);
        const latest = Array.from(latestPerFactory.values());
        const sums = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
        for (const s of latest) {
          const scores = s as Record<string, number>;
          for (const key of Object.keys(sums)) sums[key as keyof typeof sums] += scores[key] || 0;
        }
        for (const key of Object.keys(sums)) maturityAverages[key as keyof typeof maturityAverages] = Math.round(sums[key as keyof typeof sums] / latest.length);
      }

      const co2eTrend: Record<string, number> = {};
      if (s.status === 'fulfilled') {
        for (const record of s.value) {
          if (!co2eTrend[record.period]) co2eTrend[record.period] = 0;
          co2eTrend[record.period] += record.co2eKg;
        }
      }
      const co2eChartData = Object.entries(co2eTrend).map(([period, co2eKg]) => ({ period, co2eKg, productionVolumeKg: 1000 })); // dummy volume for chart

      return { kpis: { factoriesCount, openRfqs, totalContractValue, committedVolume }, maturityAverages, co2eChartData };
    },
    // Fallback data
    {
      kpis: { factoriesCount: 45, openRfqs: 12, totalContractValue: 12500000, committedVolume: 85000 },
      maturityAverages: { digital: 40, production: 50, quality: 60, sustainability: 30, market: 40, people: 55 },
      co2eChartData: [{ period: '2026-08', co2eKg: 500000 }, { period: '2026-09', co2eKg: 480000 }]
    }
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Telescope}
        title={t('Cluster Observatory', 'مرصد التجمع')}
        subtitle={t('Real-time intelligence and macro trends across the Mahalla textile cluster.', 'بيانات لحظية واتجاهات كلية عبر تجمع المحلة للغزل والنسيج.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label={t('Approved Factories', 'مصانع معتمدة')}
          value={fmtNumber(locale, data?.kpis.factoriesCount || 0)}
          icon={Building2}
          tone="blue"
        />
        <StatCard
          label={t('Active Contracts Value', 'قيمة العقود النشطة')}
          value={fmtMoney(locale, data?.kpis.totalContractValue || 0)}
          icon={ShieldCheck}
          tone="emerald"
        />
        <StatCard
          label={t('Open RFQs', 'طلبات تسعير مفتوحة')}
          value={fmtNumber(locale, data?.kpis.openRfqs || 0)}
          icon={ShoppingCart}
          tone="amber"
        />
        <StatCard
          label={t('Joint Procurement Vol', 'حجم الشراء المشترك')}
          value={fmtNumber(locale, data?.kpis.committedVolume || 0)}
          icon={Activity}
          tone="purple"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-4 text-lg">{t('Average Digital Maturity', 'متوسط النضج الرقمي')}</h3>
          {data?.maturityAverages && <ObservatoryMaturityChart data={data.maturityAverages} locale={locale} />}
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4 text-lg">{t('Cluster CO2e Emissions Trend', 'اتجاه انبعاثات الكربون للتجمع')}</h3>
          {data?.co2eChartData && data.co2eChartData.length > 0 ? (
            <SustainabilityChart records={data.co2eChartData} locale={locale} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded border border-dashed">
              {t('Not enough data', 'لا توجد بيانات كافية')}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
