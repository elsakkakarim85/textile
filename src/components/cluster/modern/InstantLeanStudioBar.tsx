'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Gauge,
  Sparkles,
  Wrench,
  Layers,
  CheckCircle2,
  Repeat,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { LEAN_DEPARTMENTS, type LeanDepartmentId } from '@/server/modernization/lean-manufacturing';

export function InstantLeanStudioBar({ locale }: { locale: string }) {
  const router = useRouter();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [factory, setFactory] = useState('El-Mahalla Premier Textile Mill');
  const [department, setDepartment] = useState<LeanDepartmentId>('full_mill');
  const [bottleneck, setBottleneck] = useState(
    isAr
      ? 'طول زمن تغيير التشغيلات (SMED) وتراكم المخزون البيني (WIP) وإعادة الصباغة'
      : 'Long changeover times (SMED), high WIP inventory & shade rework'
  );

  const launch = (tab = 'vsm') => {
    const qs = new URLSearchParams({
      factory,
      department,
      bottleneck,
      tab,
    });
    router.push(`/${locale}/cluster/lean-manufacturing?${qs.toString()}`);
  };

  return (
    <div className="rounded-3xl border-2 border-emerald-500/35 bg-gradient-to-r from-slate-950 via-emerald-950/90 to-teal-950 p-6 text-white shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-[11px] font-extrabold text-emerald-300">
            <Gauge className="h-3.5 w-3.5" />
            {t(
              'NEW • LEAN MANAGEMENT & LEAN MANUFACTURING STUDIO (TPS • VSM • 5S • OEE • SMED • KANBAN • A3)',
              'جديد • استوديو الإدارة الرشيقة والتصنيع الرشيق (VSM • 5S • OEE • SMED • Kanban • A3)'
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            {t(
              'Apply Complete Lean Manufacturing & Operational Excellence Across Your Mill',
              'طبّق أدوات الإدارة الرشيقة والتصنيع الرشيق (Lean Manufacturing) لرفع كفاءة مصنعك'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            {t(
              'Map Value Streams (VSM), eliminate the 8 Wastes (DOWNTIME), score 5S Gemba walks, compute live OEE & SMED quick changeovers, balance sewing/weaving lines, size Kanban supermarkets, and generate Toyota A3 reports.',
              'صمّم خرائط تدفق القيمة (VSM)، تخلص من الفواقد الـ ٨، نفّذ تدقيق 5S، احسب مؤشر OEE وقلل وقت التغيير عبر SMED، وازن خطوط الإنتاج، واحسب بطاقات كانبان وتقارير A3.'
            )}
          </p>
        </div>

        <Link
          href={`/${locale}/cluster/lean-manufacturing`}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-extrabold text-slate-950 hover:bg-emerald-400 transition shrink-0"
        >
          {t('Open Full Lean Hub', 'فتح مركز اللين المتكامل')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          launch('vsm');
        }}
        className="grid gap-3 md:grid-cols-12"
      >
        <div className="md:col-span-3">
          <input
            type="text"
            value={factory}
            onChange={(e) => setFactory(e.target.value)}
            placeholder={t('Factory name...', 'اسم المصنع...')}
            className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-white"
          />
        </div>
        <div className="md:col-span-3">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value as LeanDepartmentId)}
            className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3 py-2.5 text-xs sm:text-sm text-white"
          >
            {LEAN_DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                {isAr ? d.labelAr : d.labelEn}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-4">
          <input
            type="text"
            value={bottleneck}
            onChange={(e) => setBottleneck(e.target.value)}
            placeholder={t('Target bottleneck or waste...', 'نقطة الاختناق أو الفاقد المستهدف...')}
            className="w-full rounded-xl border border-white/20 bg-slate-900/90 px-3.5 py-2.5 text-xs sm:text-sm text-white"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full h-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 hover:from-emerald-300 hover:to-teal-300 transition cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            {t('Launch Lean AI', 'ابدأ خطة اللين')}
          </button>
        </div>
      </form>

      {/* Quick Pillar Deep-Links */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold">
          {t('Jump directly to tool:', 'انتقل مباشرة إلى الأداة:')}
        </span>
        {[
          { tab: 'vsm', icon: Layers, en: 'VSM & 8 Wastes', ar: 'تدفق القيمة والفواقد الـ ٨' },
          { tab: '5s', icon: CheckCircle2, en: '5S Gemba Scorer', ar: 'تدقيق 5S الميداني' },
          { tab: 'oee_smed', icon: Wrench, en: 'OEE & SMED Changeover', ar: 'حاسبة OEE و SMED' },
          { tab: 'balancing', icon: Gauge, en: 'Line Balancing & SAM', ar: 'موازنة الخطوط و SAM' },
          { tab: 'kanban', icon: Repeat, en: 'Kanban Pull & Heijunka', ar: 'بطاقات كانبان و Heijunka' },
          { tab: 'a3_hoshin', icon: FileText, en: 'Toyota A3 & Hoshin Kanri', ar: 'تقرير A3 وهوشين كانري' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => launch(item.tab)}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold hover:bg-emerald-500/25 hover:border-emerald-400 transition cursor-pointer"
            >
              <Icon className="h-3 w-3 text-emerald-300" />
              {isAr ? item.ar : item.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default InstantLeanStudioBar;
