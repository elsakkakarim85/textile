"use client";

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, MapPin, Clock, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const unwrappedParams = use(params);
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
      <div className="text-center py-20 text-muted-foreground">Loading job details...</div>
    );
  }

  if (!job) {
    return <div className="text-center py-20 text-red-500">Job not found.</div>;
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-8">
      <Link
        href={`/${unwrappedParams.locale}/recruitment`}
        className="text-primary hover:underline flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Recruitment Board
      </Link>

      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-primary">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b pb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary/70" />
                <span className="font-medium text-foreground">
                  {job.employer?.factories?.[0]?.name || 'Mahalla Cluster Factory'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary/70" />
                El Mahalla El Kubra, Egypt
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary/70" />
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="text-xl font-bold">Job Description & Technical Requirements</h2>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {/* AI Role Preparation Banner */}
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase text-emerald-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Role Preparation & Certification
              </div>
              <p className="text-sm font-semibold">
                Want to earn a verified Cluster Academy certificate tailored to this role before interviewing?
              </p>
            </div>
            <Link
              href={`/${unwrappedParams.locale}/cluster/academy/studio?topic=${encodeURIComponent(
                `Role Mastery: ${job.title}`
              )}&role=${encodeURIComponent(job.title)}&need=${encodeURIComponent(
                job.description || ''
              )}`}
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow"
            >
              Generate AI Course for This Job →
            </Link>
          </div>

          {/* Interactive Application Form */}
          <div className="pt-6 border-t">
            {applied ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">Application Submitted Successfully!</h3>
                  <p className="text-sm text-emerald-800">
                    Your candidate profile and Cluster Academy credentials have been shared with{' '}
                    <strong>{job.employer?.factories?.[0]?.name || 'the hiring mill'}</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <h3 className="text-lg font-bold">Apply for {job.title}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Full Name
                    </label>
                    <input
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Eng. Ahmed Hassan"
                      className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Phone / WhatsApp
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
                    Experience & Cluster Academy Certificates
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    placeholder="Summarize your years of experience in spinning, weaving, dyeing, or quality control..."
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-background"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow"
                >
                  Submit Official Application
                </button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
