import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/server/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';

export const dynamic = 'force-dynamic';

export default async function BuyerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const user = await getCurrentUser();

  const rfqs = await prisma.rFQ.findMany({
    where: user ? { OR: [{ buyerId: user.id }, { status: 'OPEN' }] } : undefined,
    include: { _count: { select: { quotations: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const activeRfqs = rfqs.filter((r) => r.status === 'OPEN').length;
  const totalQuotes = rfqs.reduce((acc, r) => acc + r._count.quotations, 0);

  const unreadMessages = user
    ? await prisma.message.count({
        where: {
          conversation: { OR: [{ buyerId: user.id }, { factory: { ownerId: user.id } }] },
          senderId: { not: user.id },
          isRead: false,
        },
      })
    : 0;

  const activeContracts = user
    ? await prisma.contract.count({
        where: { OR: [{ buyerId: user.id }, { factory: { ownerId: user.id } }] },
      })
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('Buyer & Sourcing Dashboard', 'لوحة المشترين وإدارة التوريد')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('Track your RFQs, compare factory quotations, and manage escrow contracts.', 'تتبع طلبات عروض الأسعار وقارن عروض المصانع وأدر عقود الضمان.')}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">
              {t('Open RFQs', 'طلبات التصنيع المفتوحة')}
            </CardTitle>
            <FileText className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{activeRfqs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('Sourcing requests open for bidding', 'طلبات متاحة لتقديم عروض المصانع')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">
              {t('Quotes Received', 'عروض الأسعار المستلمة')}
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalQuotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('Submitted by cluster factories', 'مقدمة من مصانع التجمع')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">
              {t('Escrow Contracts', 'عقود الضمان النشطة')}
            </CardTitle>
            <ShieldCheck className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{activeContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('Milestone-protected orders', 'طلبيات محمية بنظام الدفعات')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground">
              {t('Unread Messages', 'رسائل غير مقروءة')}
            </CardTitle>
            <MessageSquare className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{unreadMessages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('Direct factory threads', 'محادثات مباشرة مع المصانع')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 text-white border-none">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-xl font-bold">{t('Need custom textile manufacturing?', 'هل تحتاج تصنيع منسوجات بمواصفات خاصة؟')}</h3>
            <p className="text-slate-300 text-sm">
              {t(
                'Broadcast your technical specifications to verified spinning, weaving, dyeing, and garment factories in El Mahalla El Kubra.',
                'انشر المواصفات الفنية والكميات المطلوبة لتلقي عروض أسعار تنافسية من مصانع الغزل والنسيج والصباغة والملابس المعتمدة بالمحلة الكبرى.'
              )}
            </p>
            <Link
              href={`/${locale}/marketplaces/matchmaking`}
              className="inline-block bg-white text-slate-900 px-6 py-2.5 rounded-md font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              {t('Post New RFQ', 'انشر طلب عرض سعر جديد')}
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-xl font-bold">{t('Review Factory Bids & Award Contracts', 'مراجعة عروض المصانع وترسية العقود')}</h3>
            <p className="text-muted-foreground text-sm">
              {t(
                'Compare unit prices, lead times, and MOQs. Accepting a quotation automatically generates a 30/70 smart escrow contract.',
                'قارن أسعار الوحدة وفترات التوريد والحد الأدنى للطلب. قبول العرض ينشئ تلقائياً عقد ضمان ذكي بنظام دفعات 30/70.'
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/dashboard/buyer/rfqs`}
                className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                {t('Manage RFQs & Quotes', 'إدارة الطلبات والعروض')}
              </Link>
              <Link
                href={`/${locale}/dashboard/contracts`}
                className="inline-block border bg-background px-5 py-2.5 rounded-md font-bold text-sm hover:border-primary/50 transition-colors"
              >
                {t('View Escrow Contracts', 'عقود الضمان')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
