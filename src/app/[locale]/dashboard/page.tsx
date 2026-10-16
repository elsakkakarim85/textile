import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { currentUserId, findUserFactory, safeQuery } from '@/server/cluster';
import { tr, fmtNumber, fmtMoney } from '@/lib/i18n-inline';
import { PageHeader, StatCard, Pill } from '@/components/cluster/ui';
import {
  LayoutDashboard,
  Building2,
  Package,
  Recycle,
  Handshake,
  ShieldCheck,
  Sparkles,
  Briefcase,
  Network,
  ShoppingCart,
  Gauge,
  Leaf,
  MessageSquare,
  Settings,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  const { data: stats } = await safeQuery(
    async () => {
      const [listings, rfqs, contracts, jobs, commitments] = await Promise.all([
        prisma.marketplaceListing.count({ where: { status: 'ACTIVE' } }),
        prisma.rFQ.count({ where: { status: 'OPEN' } }),
        prisma.contract.aggregate({ _sum: { totalAmount: true }, where: { status: 'ACTIVE' } }),
        prisma.jobPosting.count({ where: { status: 'ACTIVE' } }),
        prisma.poolCommitment.count({ where: { status: { in: ['COMMITTED', 'CONFIRMED'] } } }),
      ]);
      return {
        listings,
        rfqs,
        contractValue: Number(contracts._sum.totalAmount || 0),
        jobs,
        commitments,
      };
    },
    { listings: 8, rfqs: 4, contractValue: 45000, jobs: 4, commitments: 8 }
  );

  const sections = [
    {
      href: `/${locale}/cluster`,
      icon: Network,
      title: t('Cluster Collaboration Hub', 'مركز تعاون وتحديث التجمع'),
      desc: t('Joint procurement, capacity exchange, export consortia, shared labs, academy & grants.', 'الشراء المشترك، تبادل الطاقات، التحالفات التصديرية، المعامل المشتركة، الأكاديمية والمنح.'),
      highlight: true,
    },
    {
      href: `/${locale}/dashboard/factory`,
      icon: Building2,
      title: t('My Factory Portal & Catalog', 'إدارة مصنعي والكتالوج والجواز الرقمي'),
      desc: t('Manage products, idle machine capacity, Circular Waste listings, and EU Digital Product Passports.', 'إدارة المنتجات، الماكينات، العوادم، وإصدار جواز السفر الرقمي للمنتج (DPP).'),
    },
    {
      href: `/${locale}/dashboard/buyer/rfqs`,
      icon: ShoppingCart,
      title: t('Sourcing & RFQ Management', 'إدارة المناقصات وطلبات التسعير (RFQ)'),
      desc: t('Create B2B RFQs with AI assistance, compare factory quotations, and award contracts.', 'إنشاء طلبات التسعير بالذكاء الاصطناعي ومقارنة عروض المصانع وترسية العقود.'),
    },
    {
      href: `/${locale}/dashboard/contracts`,
      icon: ShieldCheck,
      title: t('CBE Milestone Escrow Contracts', 'عقود الضمان والاعتمادات المرحلية (Escrow)'),
      desc: t('Track 30/70 milestone escrow payments, shipments, and trade dispute resolution.', 'متابعة الدفعات المرحلية المضمونة والشحنات وحل النزاعات التجارية.'),
    },
    {
      href: `/${locale}/cluster/maturity`,
      icon: Gauge,
      title: t('Industry 4.0 Digital Maturity', 'تقييم النضج الرقمي والصناعة 4.0'),
      desc: t('Run the 6-dimension diagnostic and get your prioritized 90-day modernization roadmap.', 'إجراء التقييم الشامل والحصول على خارطة طريق التحديث لـ 90 يوماً.'),
    },
    {
      href: `/${locale}/cluster/sustainability`,
      icon: Leaf,
      title: t('Sustainability, ESG & CBAM', 'الاستدامة والبصمة الكربونية CBAM'),
      desc: t('Log monthly electricity, gas, solar, and water recycling data and export EU CBAM CSVs.', 'تسجيل استهلاك الطاقة والمياه وتصدير تقارير CBAM الأوروبية.'),
    },
    {
      href: `/${locale}/dashboard/messages`,
      icon: MessageSquare,
      title: t('B2B Trade Inbox & Negotiations', 'صندوق الرسائل والمفاوضات التجارية'),
      desc: t('Direct messaging between buyers, factories, and consortium partners.', 'التواصل المباشر والمفاوضات بين المشترين والمصانع والشركاء.'),
    },
    {
      href: `/${locale}/cluster/academy/studio`,
      icon: Sparkles,
      title: t('AI Course Studio & Workforce Certification', 'استوديو بناء الدورات الذكي والشهادات المعتمدة'),
      desc: t('Generate Beginner-to-Advanced multimedia courses from your factory needs & authorized UNIDO/ZDHC/ISO standards.', 'بناء دورات تدريبية متعددة الوسائط (مبتدئ ← متقدم) حسب احتياجات مصنعك وبمراجع دولية معتمدة.'),
      highlight: true,
    },
    {
      href: `/${locale}/dashboard/knowledge`,
      icon: Sparkles,
      title: t('AI Knowledge Base (RAG Training)', 'قاعدة معرفة المستشار الذكي (AI RAG)'),
      desc: t('Ingest technical textile manuals, pricing sheets, and compliance docs into the AI engine.', 'حقن الأدلة الفنية وبيانات الصناعة لتدريب المستشار الذكي.'),
    },
    {
      href: `/${locale}/admin`,
      icon: Settings,
      title: t('CMO & Platform Administration', 'لوحة إدارة التجمع والمنصة (Admin)'),
      desc: t('Factory KYC verification, audit logs, system settings, and macro analytics.', 'توثيق المصانع (KYC)، سجلات التدقيق، وإدارة النظام.'),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title={t('Executive Operations Dashboard', 'لوحة التحكم والعمليات التنفيذية')}
        subtitle={t(
          'Unified workspace for factory owners, international buyers, and cluster administrators.',
          'مساحة عمل موحدة لأصحاب المصانع، المشترين الدوليين، وإدارة التجمع الصناعي.'
        )}
        actions={
          factory && (
            <Pill tone="emerald">
              {t('Active Workspace:', 'المصنع النشط:')} {factory.name}
            </Pill>
          )
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t('Active B2B Listings', 'عروض الكتالوج النشطة')}
          value={fmtNumber(locale, stats?.listings || 0)}
          icon={Package}
          tone="blue"
        />
        <StatCard
          label={t('Open Export RFQs', 'مناقصات التصدير المفتوحة')}
          value={fmtNumber(locale, stats?.rfqs || 0)}
          icon={Handshake}
          tone="amber"
        />
        <StatCard
          label={t('Active Escrow Volume', 'حجم العقود المضمونة')}
          value={fmtMoney(locale, stats?.contractValue || 0, 'USD')}
          icon={ShieldCheck}
          tone="emerald"
        />
        <StatCard
          label={t('Joint Buying Commitments', 'التزامات الشراء المشترك')}
          value={fmtNumber(locale, stats?.commitments || 0)}
          icon={Recycle}
          tone="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Card
              key={sec.href}
              className={`flex flex-col justify-between ${
                sec.highlight ? 'border-primary bg-primary/5 shadow-sm' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg">{sec.title}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{sec.desc}</p>
              </CardHeader>
              <CardContent>
                <Link href={sec.href}>
                  <Button variant={sec.highlight ? 'default' : 'outline'} className="w-full">
                    {t('Open Module', 'فتح الوحدة')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
