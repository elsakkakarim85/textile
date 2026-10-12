"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { tr } from '@/lib/i18n-inline';

export function SustainabilityChart({ records, locale }: { records: any[], locale: string }) {
  // sort ascending by period for the chart
  const data = [...records].sort((a, b) => a.period.localeCompare(b.period)).map(r => ({
    period: r.period,
    co2e: Math.round(r.co2eKg || 0),
    intensity: r.productionVolumeKg ? Number((r.co2eKg / r.productionVolumeKg).toFixed(2)) : 0
  }));

  return (
    <div className="h-[300px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line yAxisId="left" type="monotone" name={tr(locale, 'Total CO2e (kg)', 'إجمالي الكربون (كجم)')} dataKey="co2e" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line yAxisId="right" type="monotone" name={tr(locale, 'Intensity (kg/kg)', 'الكثافة (كجم/كجم)')} dataKey="intensity" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
