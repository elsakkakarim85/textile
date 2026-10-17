"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Eye, TrendingUp, DollarSign, Gauge, ShieldCheck, Globe2 } from 'lucide-react';

const profileViewsData = [
  { name: 'Jan', views: 620, oee: 74 },
  { name: 'Feb', views: 890, oee: 76 },
  { name: 'Mar', views: 1120, oee: 78 },
  { name: 'Apr', views: 1480, oee: 80 },
  { name: 'May', views: 1940, oee: 82 },
  { name: 'Jun', views: 2450, oee: 84.5 },
];

const earningsData = [
  { name: 'Jan', revenue: 420000 },
  { name: 'Feb', revenue: 580000 },
  { name: 'Mar', revenue: 690000 },
  { name: 'Apr', revenue: 940000 },
  { name: 'May', revenue: 1280000 },
  { name: 'Jun', revenue: 1650000 },
];

const rfqWinRateData = [
  { name: 'Won Bids', value: 38 },
  { name: 'Pending Evaluation', value: 14 },
  { name: 'Declined / Outbid', value: 12 },
];
const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function FactoryAnalyticsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7" />
            {t(
              'Factory Executive Analytics, OEE & Export Performance',
              'تحليلات المصنع التنفيذية وكفاءة المعدات (OEE) والتصدير'
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t(
              'Monitor B2B buyer impressions, Smart Escrow export revenue, RFQ win rate, and shop-floor OEE / Six Sigma Cpk.',
              'تابع مشاهدات المشترين الدوليين، وإيرادات عقود الضمان، ونسبة الفوز بالمناقصات، ومؤشر OEE وجودة ستة سيجما.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/cluster/lean-manufacturing`}
            className="text-xs font-bold bg-emerald-600 text-white px-3.5 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-1.5"
          >
            <Gauge className="w-4 h-4" />
            {t('Lean Six Sigma & OEE Hub', 'مركز اللين وستة سيجما OEE')}
          </Link>
          <Link
            href={`/${locale}/cluster/observatory`}
            className="text-xs font-bold border px-3.5 py-2 rounded-lg hover:bg-muted flex items-center gap-1.5"
          >
            <Globe2 className="w-4 h-4 text-primary" />
            {t('Cluster Peer Benchmark', 'مقارنة الأداء مع مصانع التجمع')}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
              {t('International Buyer Views', 'مشاهدات المشترين الدوليين')}
            </CardTitle>
            <Eye className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">8,500</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold">
              +33.1% {t('from EU & GCC sourcing teams', 'من مشتركين بأوروبا والخليج')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
              {t('Escrow Export Revenue', 'إيرادات عقود الضمان التصديرية')}
            </CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">5.56M EGP</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
              +54% {t('across 30/40/30 milestone contracts', 'عبر عقود الضمان الذكية')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
              {t('B2B RFQ Win Rate', 'معدل الفوز بالمناقصات (RFQ)')}
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">74.2%</div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-semibold">
              {t('Top 10% quartile in Mahalla Cluster', 'ضمن أعلى 10% من مصانع التجمع')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
              {t('World-Class OEE & Six Sigma', 'كفاءة المعدات OEE ومؤشر Cpk')}
            </CardTitle>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">84.5% • 1.44 Cpk</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-semibold">
              {t('98.4% First-Pass Yield (Zero-Defect Gate)', 'نسبة إنتاج سليم من أول مرة 98.4%')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Buyer Views & OEE Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">
              {t('Buyer Profile Views & OEE Trajectory', 'نمو مشاهدات المشترين وكفاءة التشغيل (OEE %)')}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profileViewsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.25} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold">
              {t('Monthly Smart Escrow Revenue (EGP)', 'نمو الإيرادات الشهرية عبر عقود الضمان (ج.م)')}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.25} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Win Rate Pie Chart */}
      <Card className="md:w-1/2">
        <CardHeader>
          <CardTitle className="text-base font-bold">
            {t('B2B RFQ Bidding Conversion Breakdown', 'توزيع نتائج المناقصات وعروض الأسعار')}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rfqWinRateData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {rfqWinRateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
