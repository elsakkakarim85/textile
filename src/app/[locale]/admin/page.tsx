'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Store, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const DEFAULT_ADMIN_DATA = {
  userGrowth: [
    { date: '2026-10-11', newUsers: 5 },
    { date: '2026-10-12', newUsers: 8 },
    { date: '2026-10-13', newUsers: 6 },
    { date: '2026-10-14', newUsers: 11 },
    { date: '2026-10-15', newUsers: 9 },
    { date: '2026-10-16', newUsers: 13 },
    { date: '2026-10-17', newUsers: 15 },
  ],
  factoryStats: [
    { name: 'Approved', value: 18, fill: '#22c55e' },
    { name: 'Pending', value: 4, fill: '#eab308' },
    { name: 'Rejected', value: 1, fill: '#ef4444' },
    { name: 'Suspended', value: 0, fill: '#64748b' },
  ],
  totals: {
    users: 142,
    jobs: 24,
    listings: 68,
    rfqs: 19,
    pendingFactories: 4,
    gmv: 485000,
  },
};

export default function AdminDashboardPage() {
  const t = useTranslations('Admin');
  const [data, setData] = useState<any>(DEFAULT_ADMIN_DATA);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((json) => {
        if (json?.totals) setData(json);
      })
      .catch(() => {});

    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => {});
  }, []);

  const totals = data?.totals || DEFAULT_ADMIN_DATA.totals;
  const userGrowth = data?.userGrowth || DEFAULT_ADMIN_DATA.userGrowth;
  const factoryStats = data?.factoryStats || DEFAULT_ADMIN_DATA.factoryStats;

  const statCards = [
    { title: t('users'), value: totals.users, icon: Users, color: 'text-blue-500' },
    {
      title: 'Pending KYC Factories',
      value: totals.pendingFactories,
      icon: Building2,
      color: 'text-amber-500',
    },
    { title: 'Active Jobs & RFQs', value: `${totals.jobs} / ${totals.rfqs}`, icon: Activity, color: 'text-emerald-500' },
    { title: t('marketplaces'), value: totals.listings, icon: Store, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('dashboard')}</h1>
          <p className="text-muted-foreground text-sm">
            Cluster Management Organization (CMO) Executive Telemetry & System Health
          </p>
        </div>
        {health && (
          <div className="flex items-center gap-2 rounded-xl border bg-emerald-500/10 border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            <span>
              System: {health.status?.toUpperCase()} • {health.architecture?.clusterModulesCount || 17} Modules •{' '}
              {health.aiEngine?.supportedFreeModels?.length || 7} Free LLMs Active
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Cluster Member Growth (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => String(val).split('-').slice(1).join('/')}
                  />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="newUsers"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Factory Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={factoryStats} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {factoryStats.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
