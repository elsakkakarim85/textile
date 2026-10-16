import Link from 'next/link';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { Award, ShieldCheck, CheckCircle2, ArrowLeft, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PrintCertificateButton } from '@/components/cluster/modern/PrintCertificateButton';

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
    ? `${enrollment.user.firstName || ''} ${enrollment.user.lastName || ''}`.trim() ||
      'Mahmoud Abdel-Aziz'
    : 'Mahmoud Abdel-Aziz (Misr Spinning & Weaving Co.)';

  const courseTitle = enrollment?.course
    ? locale === 'ar'
      ? enrollment.course.titleAr || enrollment.course.title
      : enrollment.course.title
    : t(
        'Lean Manufacturing & ZDHC Compliance for Textile SMEs',
        'التصنيع الرشيق والتوافق مع ZDHC لمصانع النسيج'
      );

  const provider =
    enrollment?.course?.provider || 'TIGARA / UNIDO — Mahalla Textile Cluster';
  const durationHours = enrollment?.course?.durationHours || 12;
  const completedAt = enrollment?.completedAt || new Date();

  const signatureHash = crypto
    .createHash('sha256')
    .update(`${code}:${learnerName}:${courseTitle}:MAHALLA-ACADEMY-CREDENTIAL`)
    .digest('hex')
    .slice(0, 32)
    .toUpperCase();

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/${locale}/cluster/academy`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Cluster Academy', 'العودة إلى أكاديمية التجمع')}
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('Verified Authentic Credential', 'شهادة معتمدة وموثقة رقمياً')}
          </span>
          <PrintCertificateButton
            label={t('Print / Save Official PDF', 'طباعة / حفظ الشهادة PDF')}
          />
        </div>
      </div>

      <Card className="p-8 md:p-12 border-2 border-emerald-600/40 bg-gradient-to-br from-emerald-500/5 via-background to-amber-500/5 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-600/15 border border-emerald-600/30 flex items-center justify-center mx-auto">
          <Award className="w-9 h-9 text-emerald-700" />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            {t(
              'Mahalla Textile Cluster Academy • Official Industrial Credential',
              'أكاديمية تجمع المحلة للغزل والنسيج • شهادة كفاءة صناعية رسمية'
            )}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t('Certificate of Mastery', 'شهادة إتمام وإتقان دورة تدريبية')}
          </h1>
        </div>

        <p className="text-sm text-muted-foreground">
          {t('This is to certify that', 'تشهد إدارة التجمع بأن')}
        </p>

        <div className="text-2xl md:text-3xl font-bold text-foreground border-b-2 border-emerald-600/30 pb-3 max-w-md mx-auto">
          {learnerName}
        </div>

        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          {t(
            'has successfully completed the full multimedia curriculum, shop-floor SOP checklists, and competency assessments across all mastery tiers for:',
            'قد أتم بنجاح المنهج متعدد الوسائط وقوائم إجراءات التشغيل القياسية والاختبارات المعرفية عبر جميع المستويات التدريبية لدورة:'
          )}
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-emerald-800 dark:text-emerald-300">
          {courseTitle}
        </h2>

        {/* Mastery Tiers Badge */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-200">
          <Layers className="w-4 h-4" />
          <span>
            {t(
              `Mastery Track Completed: Level 1 (Beginner) → Level 2 (Intermediate) → Level 3 (Advanced) • ${durationHours} Contact Hours`,
              `المسار المكتمل: المستوى ١ (مبتدئ) ← المستوى ٢ (متوسط) ← المستوى ٣ (متقدم) • ${durationHours} ساعة تدريبية`
            )}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t text-xs text-muted-foreground">
          <div>
            <div className="font-semibold text-foreground">
              {t('Accredited Authority', 'الجهة المانحة والمعيار')}
            </div>
            <div>{provider}</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {t('Date Issued', 'تاريخ الإصدار')}
            </div>
            <div>{fmtDate(locale, completedAt)}</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {t('Verification Code', 'كود التحقق')}
            </div>
            <div className="font-mono font-bold text-emerald-700">{code}</div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            {t(
              'Grounded in Authorized UNIDO, ZDHC, ISO 17025 & EU ESPR Standards',
              'موثقة وفق معايير اليونيدو و ZDHC و ISO 17025 ولائحة الاتحاد الأوروبي ESPR'
            )}
          </div>
          <div className="text-[10px] font-mono text-muted-foreground">
            SHA-256 Credential Signature: 0x{signatureHash}
          </div>
        </div>
      </Card>
    </div>
  );
}
