"use client";

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Building2, MapPin, Clock, Sparkles, Search, GraduationCap, Gauge } from 'lucide-react';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';

export default function RecruitmentBoardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((job) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      job.title?.toLowerCase().includes(q) ||
      job.description?.toLowerCase().includes(q) ||
      job.employer?.factories?.[0]?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white p-6 md:p-8 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full">
              <Briefcase className="w-3.5 h-3.5" />
              {t('Industrial Talent Hub • AI Role Certification • ILUO Skill Matrix', 'منصة الكفاءات الصناعية • شهادات الذكاء الاصطناعي • مصفوفة المهارات ILUO')}
            </div>
            <ExpertManualButton manualId="recruitment" locale={locale} variant="pill" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold">
            {t('Mahalla Textile Engineering & Technical Recruitment Hub', 'بورصة التوظيف والكفاءات الهندسية والفنية لتجمع المحلة')}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {t(
              'Explore career openings across audited spinning, weaving, dyeing, and garment mills — and earn an AI-tailored Cluster Academy role certificate before interviewing.',
              'استكشف الوظائف الهندسية والفنية المتاحة في مصانع الغزل والنسيج والصباغة والملابس المعتمدة، واحصل على شهادة تدريب ذكية مخصصة للوظيفة قبل المقابلة.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href={`/${locale}/cluster/academy/studio`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 text-xs"
          >
            <GraduationCap className="w-4 h-4" />
            {t('AI Role Course Studio', 'استوديو التدريب الذكي')}
          </Link>
          <Link
            href={`/${locale}/cluster/lean-manufacturing`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 text-xs"
          >
            <Gauge className="w-4 h-4" />
            {t('ILUO Skill Matrix', 'مصفوفة مهارات ILUO')}
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-4 h-4 text-muted-foreground absolute start-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t(
            'Search Lean Six Sigma, Reactive Dyeing Colorist, Air-Jet Weaving, EU DPP...',
            'ابحث عن مهندس لين سيكس سيجما، كيميائي صباغة، مهندس نسيج هوائي، تصدير...'
          )}
          className="w-full rounded-xl border bg-background ps-10 pe-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          {t('Loading cluster career openings...', 'جاري تحميل الوظائف المتاحة في مصانع التجمع...')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20 max-w-4xl mx-auto">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold">{t('No Matching Jobs Found', 'لا توجد وظائف مطابقة للبحث')}</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {t('Try clearing your search filter or visit the Cluster Academy to upskill.', 'جرب مسح فلتر البحث أو تصفح أكاديمية التجمع لتطوير مهاراتك.')}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-4xl mx-auto">
          {filtered.map((job) => (
            <Card key={job.id} className="hover:border-primary/50 transition-colors shadow-2xs">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-bold text-primary">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 font-medium text-foreground">
                        <Building2 className="w-4 h-4 text-primary" />
                        {job.employer?.factories?.[0]?.name ||
                          job.employer?.firstName ||
                          t('Mahalla Cluster Mill', 'مصنع معتمد بتجمع المحلة')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        {t('El Mahalla El Kubra, Egypt', 'المحلة الكبرى، مصر')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-3 text-xs md:text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col gap-2">
                    <Link
                      href={`/${locale}/recruitment/${job.id}`}
                      className="block w-full md:w-auto text-center bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold text-xs hover:bg-primary/90"
                    >
                      {t('View Details & Apply', 'عرض التفاصيل والتقديم')}
                    </Link>
                    <Link
                      href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(
                        `Role Mastery: ${job.title}`
                      )}&role=${encodeURIComponent(job.title)}&need=${encodeURIComponent(
                        job.description || ''
                      )}`}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 rounded-lg hover:bg-emerald-500/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {t('Train for Role (AI)', 'تدرب للوظيفة بالذكاء الاصطناعي')}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

