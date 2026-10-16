import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { findUserFactory, safeQuery } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { PageHeader } from '@/components/cluster/ui';
import { TRUSTED_AUTHORIZED_RESOURCES } from '@/server/modernization/course-generator';
import { AiCourseStudioClient } from '@/components/cluster/modern/AiCourseStudioClient';
import { Sparkles, ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function AiCourseStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data } = await safeQuery(async () => {
    const factory = await findUserFactory();
    const latestAssessment = factory
      ? await prisma.maturityAssessment.findFirst({
          where: { factoryId: factory.id },
          orderBy: { createdAt: 'desc' },
        })
      : null;

    return {
      factoryName: factory?.name || 'Misr Spinning & Weaving Co.',
      scores: (latestAssessment?.scores as Record<string, number> | null) || {
        digital: 52,
        production: 64,
        quality: 58,
        sustainability: 46,
        market: 55,
        people: 62,
      },
    };
  });

  const factoryName = data?.factoryName || 'Misr Spinning & Weaving Co.';
  const scores = data?.scores || {
    digital: 52,
    production: 64,
    quality: 58,
    sustainability: 46,
    market: 55,
    people: 62,
  };

  const suggestedNeeds = [
    {
      id: 'need-sustainability',
      dimension: 'sustainability',
      score: scores.sustainability ?? 46,
      category: 'SUSTAINABILITY',
      title: 'Zero-Defect Reactive Dyeing, Water Recovery & ZDHC MRSL v3.1 Mastery',
      titleAr: 'إتقان الصباغة التفاعلية واسترجاع المياه والتوافق مع معيار ZDHC MRSL v3.1',
      needSummary:
        'Reduce dyehouse liquor ratios from 1:10 to 1:6, eliminate restricted chemical formulations, and meet EU wastewater guidelines.',
      needSummaryAr:
        'خفض نسبة الحمام في الصباغة إلى 1:6، وإحلال الكيماويات المحظورة، والتوافق مع معايير الصرف الأوروبية.',
      targetRole: 'Dyehouse & Chemical Supervisor',
      resourceIds: ['zdhc-mrsl', 'oekotex-gots', 'eu-espr-cbam'],
    },
    {
      id: 'need-digital',
      dimension: 'digital',
      score: scores.digital ?? 52,
      category: 'DIGITAL',
      title: 'Industry 4.0 Loom OEE Telemetry, ERP Batch Tracking & EU Digital Product Passports',
      titleAr: 'الجيل الرابع للصناعة: تتبع كفاءة الأنوال OEE وبطاقات التشغيل الرقمية وجواز المنتج الأوروبي',
      needSummary:
        'Connect shop-floor weaving/knitting counters to cloud ERP and generate cryptographic EU ESPR Digital Product Passports.',
      needSummaryAr:
        'ربط عدادات الأنوال والتريكو بنظام ERP السحابي وإصدار جواز المنتج الرقمي الموثق للتصدير لأوروبا.',
      targetRole: 'Operations & Plant Manager',
      resourceIds: ['eu-espr-cbam', 'unido-tigara', 'iso-astm-lab'],
    },
    {
      id: 'need-quality',
      dimension: 'quality',
      score: scores.quality ?? 58,
      category: 'QUALITY',
      title: 'ISO 17025 Physical Textile Testing, Giza Cotton Traceability & Shade Control',
      titleAr: 'اختبارات النسيج الفيزيائية ISO 17025 وتتبع قطن جيزة وضبط الدرجات اللونية',
      needSummary:
        'Master tensile strength, pilling, and spectrophotometer ΔE<0.8 shade sorting for Tier-1 European retail buyers.',
      needSummaryAr:
        'إتقان اختبارات الشد والتوبير والقياس الطيفي للألوان ΔE<0.8 لتلبية متطلبات سلاسل التجزئة الأوروبية.',
      targetRole: 'Quality Assurance & Lab Engineer',
      resourceIds: ['iso-astm-lab', 'oekotex-gots', 'ilo-cotton-egypt'],
    },
    {
      id: 'need-production',
      dimension: 'production',
      score: scores.production ?? 64,
      category: 'TECHNICAL',
      title: 'High-Speed Air-Jet Weaving & Ring Spinning Optimization (SMED & Zero Yarn Stops)',
      titleAr: 'تحسين أداء أنوال الهواء والغزل الحلقي (تقليل توقفات السداء واللحمة ومنهجية SMED)',
      needSummary:
        'Cut warp beam changeover time by 50% and reduce stops per 100,000 picks through humidity and tension calibration.',
      needSummaryAr:
        'خفض زمن تغيير مطواة السداء بنسبة 50% وتقليل انقطاعات الخيوط عبر ضبط الرطوبة والشد.',
      targetRole: 'Spinning & Weaving Floor Engineer',
      resourceIds: ['unido-tigara', 'iso-astm-lab', 'ilo-cotton-egypt'],
    },
  ].sort((a, b) => a.score - b.score);

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/cluster/academy`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Cluster Academy Catalog', 'العودة إلى كتالوج أكاديمية التجمع')}
        </Link>
        <Link href={`/${locale}/cluster/academy`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <GraduationCap className="w-4 h-4" />
            {t('Browse All Courses & Certificates', 'تصفح جميع الدورات والشهادات')}
          </Button>
        </Link>
      </div>

      <PageHeader
        icon={Sparkles}
        title={t(
          'AI Course Studio & Needs-Based Curriculum Generator',
          'استوديو الذكاء الاصطناعي لبناء الدورات التدريبية المخصصة'
        )}
        subtitle={t(
          'Create expert-level training courses from Beginner to Advanced based on your factory’s real competency gaps, grounded in trusted UNIDO, ZDHC, ISO 17025, OEKO-TEX, and EU ESPR resources with full multimedia and verifiable certifications.',
          'ابتكر دورات تدريبية احترافية تتدرج من المبتدئ إلى المتقدم بناءً على الاحتياجات الفعلية لمصنعك، وموثقة من مصادر معتمدة (UNIDO, ZDHC, ISO 17025, OEKO-TEX, EU ESPR) مع وسائط متعددة وشهادات رقمية معتمدة.'
        )}
      />

      <AiCourseStudioClient
        locale={locale}
        factoryName={factoryName}
        maturityScores={scores}
        suggestedNeeds={suggestedNeeds}
        authorizedResources={TRUSTED_AUTHORIZED_RESOURCES}
      />
    </div>
  );
}
