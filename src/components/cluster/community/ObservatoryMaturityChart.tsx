"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { tr } from '@/lib/i18n-inline';

export function ObservatoryMaturityChart({ data, locale }: { data: any, locale: string }) {
  const chartData = [
    { name: tr(locale, 'Digital', 'الرقمية'), score: data.digital || 0 },
    { name: tr(locale, 'Production', 'الإنتاج'), score: data.production || 0 },
    { name: tr(locale, 'Quality', 'الجودة'), score: data.quality || 0 },
    { name: tr(locale, 'Sustainability', 'الاستدامة'), score: data.sustainability || 0 },
    { name: tr(locale, 'Market', 'السوق'), score: data.market || 0 },
    { name: tr(locale, 'People', 'الكوادر'), score: data.people || 0 },
  ];

  return (
    <div className="h-[300px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar name={tr(locale, 'Avg Score', 'متوسط التقييم')} dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
