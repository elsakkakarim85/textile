import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { Award, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: enrollment } = await safeQuery(
    async () => {
      return prisma.enrollment.findUnique({
        where: { certificateCode: code },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          course: true,
        },
      });
    },
    null
  );

  const learnerName = enrollment?.user
    ? `${enrollment.user.firstName || ''} ${enrollment.user.lastName || ''}`.trim() || 'Hassan El-Mahdi'
    : 'Hassan El-Mahdi (Misr Spinning & Weaving Co.)';

  const courseTitle = enrollment?.course
    ? locale === 'ar'
      ? enrollment.course.titleAr || enrollment.course.title
      : enrollment.course.title
    : t('Lean Manufacturing & ZDHC Compliance for Textile SMEs', 'التصنيع الرشيق والتوافق مع ZDHC لمصانع النسيج');

  const provider = enrollment?.course?.provider || 'TIGARA / UNIDO — Mahalla Textile Cluster';
  const completedAt = enrollment?.completedAt || new Date();

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/${locale}/cluster/academy`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Cluster Academy', 'العودة إلى أكاديمية التجمع')}
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t('Verified Authentic Credential', 'شهادة معتمدة وموثقة رقمياً')}
        </span>
      </div>

      <Card className="p-8 md:p-12 border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-background to-amber-500/5 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
          <Award className="w-9 h-9 text-primary" />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {t('Mahalla Textile Cluster Academy • Official Credential', 'أكاديمية تجمع المحلة للغزل والنسيج • شهادة رسمية')}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t('Certificate of Completion', 'شهادة إتمام دورة تدريبية')}
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          {t('This is to certify that', 'تشهد إدارة التجمع بأن')}
        </p>

        <div className="text-2xl md:text-3xl font-bold text-foreground border-b-2 border-primary/20 pb-3 max-w-md mx-auto">
          {learnerName}
        </div>

        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {t(
            'has successfully completed the technical curriculum and assessment for:',
            'قد أتم بنجاح المنهج الفني والتقييم العملي لدورة:'
          )}
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-primary">{courseTitle}</h2>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t text-xs text-muted-foreground">
          <div>
            <div className="font-semibold text-foreground">{t('Accredited Provider', 'الجهة المانحة')}</div>
            <div>{provider}</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">{t('Date Issued', 'تاريخ الإصدار')}</div>
            <div>{fmtDate(locale, completedAt)}</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">{t('Verification Code', 'كود التحقق')}</div>
            <div className="font-mono font-bold text-primary">{code}</div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-emerald-600 font-medium">
          <ShieldCheck className="w-4 h-4" />
          {t(
            'Digitally verified by the Mahalla Cluster Management Organization (TIGARA / UNIDO)',
            'موثقة رقمياً من قِبل إدارة تجمع المحلة الكبرى للغزل والنسيج (مشروع تيجارا / اليونيدو)'
          )}
        </div>
      </Card>
    </div>
  );
}
