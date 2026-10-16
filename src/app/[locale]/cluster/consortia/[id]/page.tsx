import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import { PageHeader, Pill, ProgressBar, DbOfflineBanner } from '@/components/cluster/ui';
import { ConsortiumMemberControls } from '@/components/cluster/collab/ConsortiumMemberControls';
import { Handshake, Building2, Target, CheckCircle2, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const VALUE_CHAIN_STEPS = [
  { key: 'spinning', en: 'Spinning', ar: 'الغزل' },
  { key: 'weaving', en: 'Weaving', ar: 'النسيج' },
  { key: 'knitting', en: 'Knitting', ar: 'التريكو' },
  { key: 'dyeing', en: 'Dyeing', ar: 'الصباغة' },
  { key: 'finishing', en: 'Finishing', ar: 'التجهيز' },
  { key: 'sewing', en: 'Garmenting / Sewing', ar: 'الحياكة والتفصيل' },
];

export default async function ConsortiumDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data, ok } = await safeQuery(
    async () => {
      const [consortium, factories] = await Promise.all([
        prisma.consortium.findUnique({
          where: { id },
          include: {
            leadFactory: true,
            rfq: true,
            members: {
              include: {
                factory: {
                  select: {
                    id: true,
                    name: true,
                    capabilities: true,
                    monthlyCapacity: true,
                    capacityUnit: true,
                    isVerified: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        }),
        prisma.factory.findMany({
          where: { status: 'APPROVED', deletedAt: null },
          select: { id: true, name: true, capabilities: true },
          orderBy: { name: 'asc' },
        }),
      ]);
      return { consortium, factories };
    },
    null
  );

  if (ok && !data?.consortium) notFound();
  if (!data?.consortium) {
    return (
      <div className="container py-8">
        <DbOfflineBanner locale={locale} />
      </div>
    );
  }

  const { consortium, factories } = data;
  const coveredCaps = new Set<string>();
  for (const m of consortium.members) {
    for (const cap of m.factory?.capabilities || []) {
      coveredCaps.add(cap.toLowerCase());
    }
    const r = (m.role || '').toLowerCase();
    for (const step of VALUE_CHAIN_STEPS) {
      if (r.includes(step.key)) coveredCaps.add(step.key);
    }
  }

  const combinedMonthlyCapacity = consortium.members.reduce(
    (sum: number, m: any) => sum + Number(m.factory?.monthlyCapacity || 25000),
    0
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4 text-sm">
        <Link href={`/${locale}/cluster/consortia`} className="text-muted-foreground hover:underline">
          {t('Export Consortia', 'التحالفات التصديرية')}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{consortium.name}</span>
      </div>

      <PageHeader
        icon={Handshake}
        title={consortium.name}
        subtitle={consortium.description}
        actions={
          <div className="flex items-center gap-2">
            <Pill tone={consortium.status === 'ACTIVE' ? 'emerald' : 'blue'}>{consortium.status}</Pill>
            {consortium.targetMarket && (
              <Pill tone="purple">
                <Target className="w-3.5 h-3.5 me-1" /> {consortium.targetMarket}
              </Pill>
            )}
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Value-Chain Coverage */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{t('Integrated Value-Chain Coverage', 'تكامل سلسلة القيمة للتحالف')}</h3>
              <span className="text-xs font-semibold text-primary flex items-center gap-1">
                <Layers className="w-4 h-4" />
                {t('Combined Capacity:', 'الطاقة المجمعة:')} {fmtNumber(locale, combinedMonthlyCapacity)} {t('units/mo', 'وحدة/شهر')}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {VALUE_CHAIN_STEPS.map((step) => {
                const isCovered = coveredCaps.has(step.key);
                return (
                  <div
                    key={step.key}
                    className={`rounded-xl border p-3 text-center transition-colors ${
                      isCovered
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                        : 'border-dashed opacity-50'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 mx-auto mb-1 ${
                        isCovered ? 'text-emerald-600' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="text-xs font-semibold">{t(step.en, step.ar)}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Member Factories & Work Share */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">
              {t('Consortium Member Factories & Work Allocation', 'المصانع الأعضاء وتوزيع حصص الإنتاج')}
            </h3>
            <div className="space-y-4">
              {consortium.members.map((m: any) => {
                const share = Number(m.sharePct || 0);
                return (
                  <div key={m.id} className="rounded-xl border p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Building2 className="w-5 h-5 text-primary" />
                        <div>
                          <Link
                            href={`/${locale}/factories/${m.factory.id}`}
                            className="font-bold hover:text-primary transition-colors"
                          >
                            {m.factory.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{m.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Pill tone={m.status === 'ACCEPTED' ? 'emerald' : 'amber'}>{m.status}</Pill>
                        <span className="font-bold text-sm tabular-nums">{share}%</span>
                      </div>
                    </div>
                    <ProgressBar value={share} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-primary/25">
            <ConsortiumMemberControls
              consortiumId={consortium.id}
              currentStatus={consortium.status}
              factories={factories || []}
              locale={locale}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
