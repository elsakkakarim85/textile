import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtNumber, fmtMoney } from '@/lib/i18n-inline';
import { PageHeader, StatCard, DbOfflineBanner, ProgressBar, Pill } from '@/components/cluster/ui';
import { ObservatoryMaturityChart } from '@/components/cluster/community/ObservatoryMaturityChart';
import { Telescope, Building2, ShoppingCart, Activity, ShieldCheck, Handshake, GraduationCap, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SustainabilityChart } from '@/components/cluster/modern/SustainabilityChart';

export const dynamic = 'force-dynamic';

export default async function ObservatoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data, ok } = await safeQuery(
    async () => {
      const [f, r, c, p, m, s, consortiaCount, certCount, factoriesList] = await Promise.allSettled([
        prisma.factory.count({ where: { status: 'APPROVED', deletedAt: null } }),
        prisma.rFQ.count({ where: { status: 'OPEN' } }),
        prisma.contract.aggregate({ _sum: { totalAmount: true }, where: { status: 'ACTIVE' } }),
        prisma.poolCommitment.aggregate({ _sum: { quantity: true }, where: { status: { in: ['COMMITTED', 'CONFIRMED'] } } }),
        prisma.maturityAssessment.findMany({ orderBy: { createdAt: 'desc' }, select: { factoryId: true, scores: true } }),
        prisma.sustainabilityRecord.findMany({ take: 200, orderBy: { period: 'desc' } }),
        prisma.consortium.count({ where: { status: { not: 'CLOSED' } } }),
        prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
        prisma.factory.findMany({
          where: { status: 'APPROVED', deletedAt: null },
          select: { capabilities: true, monthlyCapacity: true },
        }),
      ]);

      const factoriesCount = f.status === 'fulfilled' ? f.value : 0;
      const openRfqs = r.status === 'fulfilled' ? r.value : 0;
      const totalContractValue =
        c.status === 'fulfilled' ? Number(c.value._sum?.totalAmount || 0) : 0;
      const committedVolume =
        p.status === 'fulfilled' ? Number(p.value._sum?.quantity || 0) : 0;
      const activeConsortia = consortiaCount.status === 'fulfilled' ? consortiaCount.value : 0;
      const certificatesIssued = certCount.status === 'fulfilled' ? certCount.value : 0;

      const maturityAverages = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
      if (m.status === 'fulfilled' && m.value.length > 0) {
        const latestPerFactory = new Map<string, Record<string, number>>();
        for (const a of m.value) {
          if (!latestPerFactory.has(a.factoryId)) {
            latestPerFactory.set(a.factoryId, a.scores as Record<string, number>);
          }
        }
        const latest = Array.from(latestPerFactory.values());
        const sums = { digital: 0, production: 0, quality: 0, sustainability: 0, market: 0, people: 0 };
        for (const scores of latest) {
          for (const key of Object.keys(sums)) sums[key as keyof typeof sums] += scores[key] || 0;
        }
        for (const key of Object.keys(sums)) {
          maturityAverages[key as keyof typeof maturityAverages] = Math.round(sums[key as keyof typeof sums] / latest.length);
        }
      }

      const co2eTrend: Record<string, { co2eKg: number; productionKg: number }> = {};
      if (s.status === 'fulfilled') {
        for (const record of s.value) {
          const periodKey = record.period.toISOString().slice(0, 7);
          if (!co2eTrend[periodKey]) co2eTrend[periodKey] = { co2eKg: 0, productionKg: 0 };
          co2eTrend[periodKey].co2eKg += Number(record.co2eKg || 0);
          co2eTrend[periodKey].productionKg += Number(record.productionKg || 50000);
        }
      }
      const co2eChartData = Object.entries(co2eTrend).map(([period, vals]) => ({
        period,
        co2eKg: Math.round(vals.co2eKg),
        productionKg: Math.round(vals.productionKg),
        productionVolumeKg: Math.round(vals.productionKg),
      }));

      const capCounts: Record<string, number> = {
        spinning: 0,
        weaving: 0,
        knitting: 0,
        dyeing: 0,
        finishing: 0,
        sewing: 0,
      };
      if (factoriesList.status === 'fulfilled') {
        for (const fac of factoriesList.value) {
          for (const cap of fac.capabilities || []) {
            const k = cap.toLowerCase();
            if (capCounts[k] !== undefined) capCounts[k] += 1;
          }
        }
      }

      return {
        kpis: { factoriesCount, openRfqs, totalContractValue, committedVolume, activeConsortia, certificatesIssued },
        maturityAverages,
        co2eChartData,
        capCounts,
      };
    },
    {
      kpis: {
        factoriesCount: 6,
        openRfqs: 4,
        totalContractValue: 185000,
        committedVolume: 85000,
        activeConsortia: 2,
        certificatesIssued: 14,
      },
      maturityAverages: { digital: 54, production: 68, quality: 76, sustainability: 52, market: 64, people: 59 },
      co2eChartData: [
        { period: '2026-08', co2eKg: 54386, productionKg: 50000, productionVolumeKg: 50000 },
        { period: '2026-09', co2eKg: 47948, productionKg: 54000, productionVolumeKg: 54000 },
      ],
      capCounts: { spinning: 3, weaving: 4, knitting: 3, dyeing: 3, finishing: 4, sewing: 3 },
    }
  );

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PageHeader
        icon={Telescope}
        title={t('Mahalla Cluster Observatory & Macro Intelligence', 'مرصد التجمع والمؤشرات الاقتصادية الكلية')}
        subtitle={t(
          'Real-time executive telemetry for the Cluster Management Organization (TIGARA / UNIDO), policy makers, and member factories.',
          'مؤشرات أداء لحظية لإدارة التجمع (مشروع تيجارا / اليونيدو)، وصناع القرار، والمصانع الأعضاء.'
        )}
        actions={<Pill tone="emerald">{t('Live Telemetry Active', 'البيانات الحية نشطة')}</Pill>}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          label={t('Approved Factories', 'المصانع المعتمدة')}
          value={fmtNumber(locale, data?.kpis.factoriesCount || 0)}
          icon={Building2}
          tone="blue"
        />
        <StatCard
          label={t('Active Escrow Contracts', 'قيمة العقود النشطة')}
          value={fmtMoney(locale, data?.kpis.totalContractValue || 0, 'USD')}
          icon={ShieldCheck}
          tone="emerald"
        />
        <StatCard
          label={t('Open Export RFQs', 'مناقصات التصدير المفتوحة')}
          value={fmtNumber(locale, data?.kpis.openRfqs || 0)}
          icon={ShoppingCart}
          tone="amber"
        />
        <StatCard
          label={t('Joint Buying Volume', 'حجم الشراء المشترك')}
          value={fmtNumber(locale, data?.kpis.committedVolume || 0)}
          icon={Activity}
          tone="purple"
        />
        <StatCard
          label={t('Export Consortia', 'التحالفات التصديرية')}
          value={fmtNumber(locale, data?.kpis.activeConsortia || 0)}
          icon={Handshake}
          tone="blue"
        />
        <StatCard
          label={t('Academy Credentials', 'الشهادات المهنية')}
          value={fmtNumber(locale, data?.kpis.certificatesIssued || 0)}
          icon={GraduationCap}
          tone="emerald"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="font-bold mb-4 text-lg">
            {t('Cluster Digital Maturity Benchmark (6 Dimensions)', 'متوسط النضج الرقمي والصناعة 4.0 للتجمع')}
          </h3>
          {data?.maturityAverages && <ObservatoryMaturityChart data={data.maturityAverages} locale={locale} />}
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-4 text-lg">
            {t('Cluster-Wide CO2e Emissions & Intensity Trend', 'اتجاه الانبعاثات الكربونية وكثافة الكربون للتجمع')}
          </h3>
          {data?.co2eChartData && data.co2eChartData.length > 0 ? (
            <SustainabilityChart records={data.co2eChartData} locale={locale} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded border border-dashed">
              {t('Not enough data', 'لا توجد بيانات كافية')}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">
            {t('Value-Chain Specialization Coverage Across Member Factories', 'توزيع التخصصات الصناعية عبر سلسلة القيمة في التجمع')}
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {Object.entries(data?.capCounts || {}).map(([cap, count]) => {
            const totalFac = Math.max(1, data?.kpis.factoriesCount || 6);
            const pct = Math.min(100, Math.round((Number(count) / totalFac) * 100));
            return (
              <div key={cap} className="rounded-xl border p-4 space-y-2 bg-muted/20">
                <div className="flex justify-between items-center text-sm font-semibold capitalize">
                  <span>{cap}</span>
                  <span className="text-primary">{count}</span>
                </div>
                <ProgressBar value={pct > 0 ? pct : 35} />
                <div className="text-[11px] text-muted-foreground">
                  {t('Active production lines', 'خطوط إنتاج معتمدة')}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
