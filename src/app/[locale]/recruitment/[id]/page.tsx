"use client";

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, MapPin, Clock, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const unwrappedParams = use(params);
  const locale = unwrappedParams.locale || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetch('/api/public/jobs')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const found = list.find((j: any) => j.id === unwrappedParams.id) || list[0];
        setJob(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {t('Loading job details...', 'جاري تحميل تفاصيل الوظيفة...')}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 text-red-500">
        {t('Job not found.', 'الوظيفة غير موجودة.')}
      </div>
    );
  }

  const handleGenerateCoverNote = () => {
    const name = applicantName || (locale === 'ar' ? 'م. أحمد حسن' : 'Eng. Ahmed Hassan');
    if (!applicantName) setApplicantName(name);
    if (!applicantPhone) setApplicantPhone('+20 100 555 8921');
    const summary =
      locale === 'ar'
        ? `أنا ${name}، متخصص في الصناعات النسيجية بالمحلة الكبرى ولدي خبرة عملية مباشرة في متطلبات وظيفة (${job.title}). متمرس في تطبيق أدوات اللين سيكس سيجما (5S, SMED, OEE, SPC Cp/Cpk ≥ 1.33)، وضبط الجودة القياسية طبقاً لمعايير ISO و OEKO-TEX® و ZDHC، وأتممت مسار التدريب الذكي المعتمد في أكاديمية تجمع المحلة.`
        : `I am ${name}, an experienced El Mahalla El Kubra textile specialist directly aligned with the technical requirements for "${job.title}". Proven shop-floor track record in Lean Six Sigma (5S, SMED, OEE, SPC Cp/Cpk ≥ 1.33), ISO/OEKO-TEX®/ZDHC compliance, and certified through the Mahalla Cluster Academy.`;
    setApplicantNote(summary);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-8">
      <Link
        href={`/${locale}/recruitment`}
        className="text-primary hover:underline flex items-center gap-2 text-sm font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('Back to Recruitment Board', 'العودة إلى بورصة التوظيف')}
      </Link>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-primary">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b pb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary/70" />
                <span className="font-semibold text-foreground">
                  {job.employer?.factories?.[0]?.name || t('Mahalla Cluster Factory', 'مصنع معتمد بتجمع المحلة')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                {t('El Mahalla El Kubra, Egypt', 'المحلة الكبرى، مصر')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary/70" />
                {t('Posted', 'تاريخ النشر:')} {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="text-lg md:text-xl font-bold">
              {t('Job Description & Technical Requirements', 'الوصف الوظيفي والمتطلبات الفنية')}
            </h2>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {job.description}
            </div>
          </div>

          {/* AI Role Preparation Banner */}
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {t('AI Role Preparation & Certification', 'التأهيل الذكي والشهادة المعتمدة للوظيفة')}
              </div>
              <p className="text-sm font-semibold">
                {t(
                  'Want to earn a verified Cluster Academy certificate tailored to this role before interviewing?',
                  'هل ترغب في الحصول على شهادة تدريب معتمدة من أكاديمية التجمع ومصممة خصيصاً لهذه الوظيفة قبل المقابلة؟'
                )}
              </p>
            </div>
            <Link
              href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(
                `Role Mastery: ${job.title}`
              )}&role=${encodeURIComponent(job.title)}&need=${encodeURIComponent(
                job.description || ''
              )}`}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow"
            >
              {t('Generate AI Course for This Job →', 'توليد دورة تدريبية للوظيفة ←')}
            </Link>
          </div>

          {/* Interactive Application Form */}
          <div className="pt-6 border-t">
            {applied ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">
                    {t('Application Submitted Successfully!', 'تم إرسال طلب التوظيف بنجاح!')}
                  </h3>
                  <p className="text-sm opacity-90">
                    {t(
                      'Your candidate profile and Cluster Academy credentials have been shared with ',
                      'تم إرسال ملفك المهني وشهادات أكاديمية التجمع إلى إدارة '
                    )}
                    <strong>{job.employer?.factories?.[0]?.name || t('the hiring mill', 'المصنع المعلن')}</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">
                    {t('Apply for', 'التقديم على وظيفة:')} {job.title}
                  </h3>
                  <button
                    type="button"
                    onClick={handleGenerateCoverNote}
                    className="text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 px-3 py-1.5 rounded-full font-bold inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('AI Auto-Fill Technical Pitch', 'صياغة نبذة الخبرة بالذكاء الاصطناعي')}
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      {t('Full Name', 'الاسم الكامل')}
                    </label>
                    <input
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder={t('e.g. Eng. Ahmed Hassan', 'مثال: م. أحمد حسن')}
                      className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      {t('Phone / WhatsApp', 'رقم الهاتف / واتساب')}
                    </label>
                    <input
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+20 10..."
                      className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-background"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    {t(
                      'Technical Experience & Cluster Academy Certificates',
                      'الخبرة الفنية وشهادات أكاديمية التجمع'
                    )}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    placeholder={t(
                      'Summarize your years of experience in spinning, weaving, dyeing, Lean Six Sigma, or quality control...',
                      'لخص سنوات خبرتك في الغزل أو النسيج أو الصباغة أو اللين سيكس سيجما ومراقبة الجودة...'
                    )}
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-background"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow text-sm"
                >
                  {t('Submit Official Application', 'إرسال طلب التقديم الرسمي')}
                </button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

