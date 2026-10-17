"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash, Plus, Users, Briefcase, Sparkles, GraduationCap, Gauge, CheckCircle2 } from 'lucide-react';

const JOB_PRESETS = [
  {
    title: 'Senior Air-Jet Weaving & SMED Maintenance Engineer — مهندس صيانة أنوال هوائية وSMED',
    location: 'El Mahalla El Kubra, Industrial Zone',
    employmentType: 'full_time',
    salaryMin: '24000',
    salaryMax: '34000',
    skills: 'Picanol Air-Jet, SMED Changeover, TPM Maintenance, OEE Optimization',
    desc: 'Lead TPM autonomous/planned maintenance and Single-Minute Exchange of Die (SMED) warp-beam changeovers across 48 Picanol OmniPlus-i looms to sustain OEE ≥ 85%.',
  },
  {
    title: 'Lean Six Sigma Black Belt & OEE Continuous Improvement Lead — قائد التميز التشغيلي ولين 6 سيجما',
    location: 'El Mahalla El Kubra (Hybrid)',
    employmentType: 'full_time',
    salaryMin: '28000',
    salaryMax: '42000',
    skills: 'Lean Six Sigma Black Belt, Value Stream Mapping, OEE & SPC, Toyota A3',
    desc: 'Drive VSM lead-time compression, Poka-Yoke zero-defect gates, and A3 Kaizen projects across spinning, dyeing, and finishing departments.',
  },
  {
    title: 'ZDHC & Reactive Dyeing Lab Colorist (Right-First-Time ΔE ≤ 0.8) — كيميائي صباغة ومطابقة ألوان',
    location: 'El Mahalla El Kubra, Ring Road',
    employmentType: 'full_time',
    salaryMin: '18000',
    salaryMax: '26000',
    skills: 'Datacolor Spectrophotometer, Reactive Dyeing RFT, ZDHC MRSL v3.1, ISO 105',
    desc: 'Manage automated spectrophotometer recipe formulation on Thies jet dyeing machines to achieve ≥ 96% Right-First-Time (RFT) shade accuracy.',
  },
];

export default function FactoryJobsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('El Mahalla El Kubra, Industrial Zone');
  const [employmentType, setEmploymentType] = useState('full_time');
  const [salaryMin, setSalaryMin] = useState('18000');
  const [salaryMax, setSalaryMax] = useState('28000');
  const [skillsText, setSkillsText] = useState('Lean 5S, OEE, ISO 9001');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/factory/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      title,
      description,
      location,
      employmentType,
      salaryMin: Number(salaryMin) || undefined,
      salaryMax: Number(salaryMax) || undefined,
      skills,
    };

    try {
      const res = await fetch('/api/factory/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setStatusMsg(t('Job opening published to Recruitment Hub.', 'تم نشر الوظيفة في بوابة التوظيف الصناعي.'));
        fetchJobs();
      } else {
        setJobs((prev) => [
          {
            id: `job-local-${Date.now()}`,
            ...payload,
            status: 'OPEN',
            createdAt: new Date().toISOString(),
            _count: { applications: 0 },
          },
          ...prev,
        ]);
        setTitle('');
        setDescription('');
        setStatusMsg(t('Job opening added (Simulation Mode).', 'تمت إضافة الوظيفة بنجاح (وضع المحاكاة).'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    try {
      await fetch(`/api/factory/jobs?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            {t('Industrial Recruitment & ILUO Talent Manager', 'إدارة التوظيف الصناعي ومصفوفة المهارات (ILUO)')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t(
              'Publish textile engineering & operator vacancies, generate AI onboarding courses, and track ILUO polyvalence.',
              'انشر وظائف المهندسين والفنيين، وأنشئ دورات تأهيل بالذكاء الاصطناعي، وتابع المتقدمين.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/cluster/lean-manufacturing`}
            className="text-xs font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-lg flex items-center gap-1.5"
          >
            <Gauge className="w-3.5 h-3.5" />
            {t('ILUO Skill Matrix', 'مصفوفة المهارات ILUO')}
          </Link>
          <Link
            href={`/${locale}/recruitment`}
            className="text-xs font-bold border px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            {t('Public Job Board →', 'بوابة التوظيف العامة ←')}
          </Link>
        </div>
      </div>

      {statusMsg && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {statusMsg}
          </span>
          <button onClick={() => setStatusMsg(null)}>✕</button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>{t('Post New Industrial Role', 'نشر وظيفة صناعية جديدة')}</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 1-Click Job Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-muted-foreground block">
                  {t('1-Click Role Templates:', 'قوالب وظائف هندسية وفنية جاهزة:')}
                </span>
                <div className="flex flex-col gap-1.5">
                  {JOB_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTitle(p.title);
                        setLocation(p.location);
                        setEmploymentType(p.employmentType);
                        setSalaryMin(p.salaryMin);
                        setSalaryMax(p.salaryMax);
                        setSkillsText(p.skills);
                        setDescription(p.desc);
                      }}
                      className="text-start text-[11px] p-2 rounded-lg border bg-muted/30 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors font-medium truncate"
                    >
                      ✨ {p.title}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 border-t">
                <div className="space-y-1">
                  <label className="text-xs font-bold">{t('Job Title', 'المسمى الوظيفي')}</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('e.g. Senior Air-Jet Weaving Engineer', 'مثال: مهندس صيانة أنوال هوائية')}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold">{t('Employment Type', 'نوع الدوام')}</label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full bg-background border rounded-lg px-2.5 py-2 text-xs font-semibold"
                    >
                      <option value="full_time">{t('Full-Time', 'دوام كامل')}</option>
                      <option value="contract">{t('Contract / Shift', 'عقد / ورديات')}</option>
                      <option value="part_time">{t('Part-Time', 'دوام جزئي')}</option>
                      <option value="internship">{t('Apprenticeship', 'تدريب مهني')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold">{t('Location', 'موقع العمل')}</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-background border rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold">{t('Min Salary (EGP)', 'الحد الأدنى للراتب')}</label>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-full bg-background border rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold">{t('Max Salary (EGP)', 'الحد الأقصى للراتب')}</label>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="w-full bg-background border rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold">
                    {t('Required Technical Skills (comma-separated)', 'المهارات المطلوبة (مفصولة بفاصلة)')}
                  </label>
                  <input
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold">{t('Role Responsibilities & KPIs', 'الوصف الوظيفي ومؤشرات الأداء')}</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-xs font-bold flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('Publish Job Opening', 'نشر الوظيفة الشاغرة')}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">
              {t('Loading job postings...', 'جاري تحميل الوظائف المنشورة...')}
            </p>
          ) : jobs.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              {t('No active job postings.', 'لا توجد وظائف منشورة حالياً.')}
            </Card>
          ) : (
            jobs.map((job) => {
              const appCount = job._count?.applications ?? job.applications?.length ?? 0;
              return (
                <Card key={job.id} className="hover:border-primary/40 transition-all">
                  <CardContent className="p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base">{job.title}</h3>
                          <Badge variant="secondary" className="text-[10px]">
                            {job.status || 'OPEN'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{job.description}</p>
                        {Array.isArray(job.skills) && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.skills.map((skill: string) => (
                              <span
                                key={skill}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted border"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg shrink-0"
                        title={t('Close Job Posting', 'إغلاق الوظيفة')}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="bg-muted/40 p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-primary">
                          <Users className="w-4 h-4" />
                          {appCount} {t('Applicants', 'متقدمين')}
                        </span>
                        {(job.salaryMin || job.salaryMax) && (
                          <span className="text-emerald-600">
                            {job.salaryMin ? Number(job.salaryMin).toLocaleString() : '—'} –{' '}
                            {job.salaryMax ? Number(job.salaryMax).toLocaleString() : '—'} EGP
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(job.title)}`}
                          className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg hover:bg-emerald-500/20 flex items-center gap-1"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          {t('Generate Onboarding Course (AI)', 'دورة تأهيل للوظيفة (AI)')}
                        </Link>
                        <Link
                          href={`/${locale}/recruitment/${job.id}`}
                          className="text-xs font-bold text-primary hover:underline px-2 py-1"
                        >
                          {t('View Public Posting →', 'معاينة الإعلان ←')}
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
