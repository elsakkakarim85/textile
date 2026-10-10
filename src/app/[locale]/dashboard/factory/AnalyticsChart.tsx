"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Apr', views: 400, bids: 24 },
  { name: 'May', views: 300, bids: 13 },
  { name: 'Jun', views: 550, bids: 38 },
  { name: 'Jul', views: 450, bids: 29 },
  { name: 'Aug', views: 700, bids: 48 },
  { name: 'Sep', views: 850, bids: 52 },
];

export function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" axisLine={false} tickLine={false} />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
        <Legend />
        <Bar yAxisId="left" dataKey="views" name="Profile Views" fill="#2563eb" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="bids" name="Quotations Sent" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
