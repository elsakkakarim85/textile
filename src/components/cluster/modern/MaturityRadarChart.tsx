"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DIMENSIONS } from '@/server/modernization/maturity';
import { tr } from '@/lib/i18n-inline';

export function MaturityRadarChart({ scores, clusterAverage, locale }: { scores: Record<string, number>, clusterAverage: Record<string, number>, locale: string }) {
  const data = DIMENSIONS.map(d => ({
    subject: tr(locale, d.en, d.ar),
    factory: scores[d.id] || 0,
    cluster: clusterAverage[d.id] || 0,
    fullMark: 100,
  }));

  return (
    <div className="h-[400px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name={tr(locale, 'Your Factory', 'مصنعك')} dataKey="factory" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
          <Radar name={tr(locale, 'Cluster Average', 'متوسط التجمع')} dataKey="cluster" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.2} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
