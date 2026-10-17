import Link from 'next/link';
import { Gauge, Sparkles, GraduationCap, ArrowLeft } from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { PageHeader } from '@/components/cluster/ui';
import { LeanManufacturingClient } from '@/components/cluster/modern/LeanManufacturingClient';
import type { LeanDepartmentId } from '@/server/modernization/lean-manufacturing';

export const dynamic = 'force-dynamic';

export default async function LeanManufacturingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    factory?: string;
    department?: string;
    product?: string;
    bottleneck?: string;
    tab?: string;
  }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PageHeader
        icon={Gauge}
        accent="from-emerald-500/20 via-teal-500/10"
        title={t(
          'Lean Management & Lean Manufacturing Operational Excellence Hub',
          'مركز الإدارة الرشيقة والتصنيع الرشيق (Lean Management & Manufacturing)'
        )}
        subtitle={t(
          'Apply Toyota Production System (TPS), Value Stream Mapping (VSM), 8 Wastes (DOWNTIME), 5S Gemba Audits, TPM/OEE, SMED Quick Changeover, Yamazumi Line Balancing, Kanban Pull, Jidoka/Poka-Yoke, Hoshin Kanri & A3 Problem Solving.',
          'تطبيق شامل لنظام إنتاج تويوتا (TPS)، تخطيط تدفق القيمة (VSM)، الفواقد الـ ٨، تدقيق 5S، الصيانة الإنتاجية الشاملة و OEE، تقليل زمن التغيير SMED، موازنة الخطوط، نظام السحب كانبان، منع الأخطاء Poka-Yoke، وتقارير A3.'
        )}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/${locale}/cluster`}
              className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold hover:bg-muted transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('Cluster Hub', 'مركز التجمع')}
            </Link>
            <Link
              href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(
                'Lean Six Sigma, SMED, 5S, OEE & Value Stream Mapping for Textile Mills'
              )}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-emerald-500 transition"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {t('Generate Lean Academy Course', 'توليد دورة تدريبية في اللين')}
            </Link>
          </div>
        }
      />

      <LeanManufacturingClient
        locale={locale}
        initialFactory={sp.factory}
        initialDepartment={(sp.department as LeanDepartmentId) || 'full_mill'}
        initialProduct={sp.product}
        initialBottleneck={sp.bottleneck}
        initialTab={sp.tab}
      />
    </div>
  );
}
