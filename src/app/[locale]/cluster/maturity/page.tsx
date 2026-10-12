import { currentUserId, findUserFactory } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { PageHeader, EmptyState } from '@/components/cluster/ui';
import MaturityWizard from '@/components/cluster/modern/MaturityWizard';
import { Gauge } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function MaturityAssessmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  const factory = await findUserFactory(userId);

  if (!userId) redirect(`/${locale}/sign-in`);

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={Gauge}
        title={t('Digital Maturity & Industry 4.0 Assessment', 'تقييم النضج الرقمي والجاهزية للصناعة 4.0')}
        subtitle={t(
          'Evaluate your factory across 6 dimensions to get a personalized roadmap and matching grants.',
          'قيّم مصنعك عبر 6 محاور للحصول على خارطة طريق مخصصة ومنح مطابقة.'
        )}
      />

      {!factory ? (
        <EmptyState
          icon={Gauge}
          title={t('Factory Profile Required', 'مطلوب ملف مصنع')}
          hint={t('You must create or join a factory profile to take this assessment.', 'يجب عليك إنشاء أو الانضمام إلى ملف مصنع لإجراء هذا التقييم.')}
        />
      ) : (
        <MaturityWizard locale={locale} />
      )}
    </div>
  );
}
