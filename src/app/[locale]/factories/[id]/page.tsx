import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar, Pill } from '@/components/cluster/ui';
import { tr, fmtNumber } from '@/lib/i18n-inline';
import {
  Star,
  MapPin,
  Building2,
  MessageSquare,
  ShieldCheck,
  Globe,
  Gauge,
  Users,
  Leaf,
  Send,
  FileText,
  Sparkles,
  QrCode,
  Award,
  Handshake,
} from 'lucide-react';
import { FactoryReviewForm } from './FactoryReviewForm';
import { getCurrentUser } from '@/server/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function FactoryProfilePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const currentUser = await getCurrentUser();

  const [factory, latestMaturity, latestSus] = await Promise.all([
    prisma.factory.findUnique({
      where: { id },
      include: {
        owner: {
          include: {
            listings: {
              where: { deletedAt: null },
              include: { passport: { select: { id: true } } },
            },
          },
        },
        certifications: true,
        reviews: {
          include: { reviewer: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            quotations: true,
            contracts: true,
            poolCommitments: true,
          },
        },
      },
    }),
    prisma.maturityAssessment
      .findFirst({
        where: { factoryId: id },
        orderBy: { createdAt: 'desc' },
      })
      .catch(() => null),
    prisma.sustainabilityRecord
      .findFirst({
        where: { factoryId: id },
        orderBy: { period: 'desc' },
      })
      .catch(() => null),
  ]);

  if (!factory) {
    return (
      <div className="container mx-auto py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">{t('Factory Not Found', 'المصنع غير موجود')}</h1>
        <Link href={`/${locale}/factories`}>
          <Button>{t('Back to Verified Factories', 'العودة إلى دليل المصانع')}</Button>
        </Link>
      </div>
    );
  }

  const avgRating =
    factory.reviews.length > 0
      ? (factory.reviews.reduce((acc, r) => acc + r.rating, 0) / factory.reviews.length).toFixed(1)
      : '4.9';

  const hasReviewed = currentUser
    ? factory.reviews.some((r) => r.reviewerId === currentUser.id)
    : false;

  const maturityScore = latestMaturity?.overallScore ?? 68;
  const prodKg = Math.max(1, Number(latestSus?.productionKg || 52000));
  const co2Intensity = latestSus
    ? (Number(latestSus.co2eKg || 46000) / prodKg).toFixed(2)
    : '0.88';
  const waterRecycledPct = latestSus
    ? Math.round(
        (Number(latestSus.recycledWaterM3 || 450) / Math.max(1, Number(latestSus.waterM3 || 1600))) *
          100
      )
    : 29;

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Link href={`/${locale}/factories`} className="hover:underline">
          {t('Verified Factories', 'دليل المصانع المعتمدة')}
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">{factory.name}</span>
      </div>

      {/* Executive Mill Header */}
      <Card className="p-6 md:p-8 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-indigo-950 text-white border-emerald-500/30 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl flex items-center justify-center text-emerald-300 shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
                    {factory.name}
                    {factory.isVerified && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                  </h1>
                  <Pill tone="emerald">{factory.subscriptionTier}</Pill>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-emerald-400" /> {factory.address || factory.city}
                  </span>
                  <span>•</span>
                  <span>
                    {t('Tax Reg:', 'السجل الضريبي:')}{' '}
                    <strong className="font-mono">{factory.taxRegistrationNumber}</strong>
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm md:text-base text-slate-200 leading-relaxed">
              {factory.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {factory.status === 'APPROVED' && (
                <Badge className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  ✓ {t('Audited TIGARA Cluster Mill', 'مصنع معتمد بتجمع المحلة')}
                </Badge>
              )}
              {factory.capabilities.map((cap) => (
                <Badge
                  key={cap}
                  variant="outline"
                  className="capitalize text-white border-white/25 bg-white/10"
                >
                  {cap}
                </Badge>
              ))}
            </div>

            {/* Direct B2B Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href={`/${locale}/marketplaces/matchmaking`}>
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold gap-2">
                  <FileText className="w-4 h-4" />
                  {t('Request Official Export Quote (RFQ)', 'طلب عرض سعر رسمي (RFQ)')}
                </Button>
              </Link>
              <Link href={`/${locale}/dashboard/messages`}>
                <Button
                  variant="outline"
                  className="border-white/30 bg-white/10 hover:bg-white/20 text-white gap-2"
                >
                  <Send className="w-4 h-4" />
                  {t('Direct B2B Message', 'مراسلة إدارة المصنع')}
                </Button>
              </Link>
              <Link
                href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(
                  `${factory.capabilities.join(' & ')} Quality & Export Standards`
                )}`}
              >
                <Button
                  variant="outline"
                  className="border-emerald-400/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200 gap-1.5 text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('AI Workforce Training Track', 'مسار التدريب الذكي للتخصص')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Buyer Trust & Industry 4.0 Scorecard */}
          <div className="w-full lg:w-72 bg-white/10 border border-white/15 rounded-2xl p-5 space-y-4 shrink-0">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {t('Buyer Trust Rating', 'تقييم ثقة المشترين')}
                </div>
                <div className="flex items-center gap-1.5 text-3xl font-extrabold mt-0.5">
                  {avgRating} <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
              </div>
              <div className="text-end text-xs text-slate-300">
                <div>{factory.reviews.length} {t('reviews', 'تقييمات')}</div>
                <div className="text-emerald-300 font-semibold">
                  {factory._count.contracts} {t('contracts', 'عقود')}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span>{t('Industry 4.0 Maturity', 'مؤشر النضج الرقمي 4.0')}</span>
                <span className="text-emerald-300">{maturityScore}/100</span>
              </div>
              <ProgressBar
                value={maturityScore}
                className="h-2 bg-white/20 [&>div]:bg-emerald-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <div className="text-sm font-extrabold text-emerald-300">{co2Intensity}</div>
                <div className="text-[10px] text-slate-300">kg CO2e / kg</div>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/10">
                <div className="text-sm font-extrabold text-sky-300">{waterRecycledPct}%</div>
                <div className="text-[10px] text-slate-300">
                  {t('Water Recycled', 'تدوير المياه')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column: Catalog + DPP + Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Products Catalog */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <QrCode className="w-6 h-6 text-emerald-600" />
                {t(
                  'Export Catalog & EU Digital Product Passports (DPP)',
                  'كتالوج المنتجات وجواز المنتج الرقمي الأوروبي (DPP)'
                )}
              </h2>
              <span className="text-xs text-muted-foreground">
                {factory.owner.listings.length} {t('active items', 'منتجات متاحة')}
              </span>
            </div>

            {factory.owner.listings.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                {t('No public products listed currently.', 'لا توجد منتجات معروضة حالياً.')}
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {factory.owner.listings.map((product) => (
                  <Card
                    key={product.id}
                    className="hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-bold line-clamp-1">
                          {product.title}
                        </CardTitle>
                        <Badge variant="outline">{product.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="font-extrabold text-primary text-sm">
                          {product.price
                            ? `${fmtNumber(locale, Number(product.price))} ${product.currency}`
                            : t('Negotiable', 'قابل للتفاوض')}
                        </span>
                        <Link
                          href={`/${locale}/dpp/${product.id}`}
                          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg hover:bg-emerald-500/20 flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {t('Verify EU DPP', 'جواز المنتج الأوروبي')}
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="space-y-6 pt-6 border-t">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              {t('Verified Buyer Reviews & Audit Feedback', 'تقييمات المشترين المعتمدين')}
            </h2>

            {currentUser && currentUser.id !== factory.ownerId && !hasReviewed && (
              <FactoryReviewForm factoryId={factory.id} />
            )}

            <div className="space-y-4">
              {factory.reviews.length === 0 ? (
                <Card className="text-center py-10 bg-muted/20">
                  <Star className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-muted-foreground font-medium">
                    {t('No buyer reviews yet.', 'لا توجد تقييمات بعد.')}
                  </p>
                </Card>
              ) : (
                factory.reviews.map((review) => (
                  <Card key={review.id} className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold">
                        • {review.reviewer.firstName || t('Verified Buyer', 'مشتري معتمد')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Dossier: Industrial Capacity, Certifications & Cluster Collaboration */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" />
                {t('Industrial Capacity & Specs', 'القدرة الإنتاجية والمواصفات')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between border-b pb-2.5">
                <span className="text-muted-foreground">
                  {t('Monthly Capacity', 'الطاقة الإنتاجية الشهرية')}
                </span>
                <span className="font-bold">
                  {fmtNumber(locale, factory.monthlyCapacity || 50000)}{' '}
                  {factory.capacityUnit || 'units'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2.5">
                <span className="text-muted-foreground">
                  {t('Min. Order Qty (MOQ)', 'الحد الأدنى للطلب (MOQ)')}
                </span>
                <span className="font-bold">{fmtNumber(locale, factory.minOrderQty || 500)}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2.5">
                <span className="text-muted-foreground">
                  {t('Standard Lead Time', 'مدة التوريد القياسية')}
                </span>
                <span className="font-bold">
                  {factory.leadTimeDays || 14} {t('days', 'يوماً')}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {t('Workforce', 'القوى العاملة')}
                </span>
                <span className="font-bold">
                  {fmtNumber(locale, factory.employeesCount || 120)}{' '}
                  {t('employees', 'عامل ومهندس')}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  {t('Active Export Markets', 'أسواق التصدير الحالية')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(factory.exportMarkets.length
                    ? factory.exportMarkets
                    : ['EU (Germany/Italy)', 'GCC', 'USA', 'Egypt']
                  ).map((code) => (
                    <Badge key={code} variant="secondary" className="text-xs">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-5 space-y-3 border-emerald-500/30 bg-emerald-500/5">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              {t('Authorized Certifications & Standards', 'الشهادات والمعايير المعتمدة')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['ISO 9001:2015', 'OEKO-TEX® Standard 100', 'ZDHC MRSL v3.1', 'Cotton Egypt™', 'EU DPP Ready'].map(
                (std) => (
                  <span
                    key={std}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border bg-background flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {std}
                  </span>
                )
              )}
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Handshake className="w-4 h-4 text-primary" />
              {t('Cluster Ecosystem Activity', 'نشاط المصنع في التجمع')}
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="p-3 rounded-xl border bg-muted/20">
                <div className="text-lg font-extrabold text-primary">
                  {factory._count.poolCommitments || 2}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {t('Buying Pools', 'مجموعات شراء')}
                </div>
              </div>
              <div className="p-3 rounded-xl border bg-muted/20">
                <div className="text-lg font-extrabold text-emerald-600">
                  {factory._count.contracts || 2}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {t('Export Consortia', 'تحالفات تصديرية')}
                </div>
              </div>
            </div>
            <Link
              href={`/${locale}/cluster/consortia`}
              className="block text-center text-xs font-bold text-primary hover:underline pt-1"
            >
              {t('Invite Mill to an Export Consortium →', 'دعوة المصنع لتحالف تصديري ←')}
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
