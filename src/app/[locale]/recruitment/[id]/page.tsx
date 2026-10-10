"use client";

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Building2, MapPin, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JobDetailsPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const unwrappedParams = use(params);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/jobs')
      .then(res => res.json())
      .then(data => {
        const found = data.find((j: any) => j.id === unwrappedParams.id);
        setJob(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [unwrappedParams.id]);

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading job details...</div>;
  
  if (!job) return <div className="text-center py-20 text-red-500">Job not found.</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-8">
      <Link href={`/${unwrappedParams.locale}/recruitment`} className="text-primary hover:underline flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Link>
      
      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-primary">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b pb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary/70" />
                <span className="font-medium text-foreground">{job.employer.factories?.[0]?.name || 'Factory'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary/70" /> 
                Mahalla, Egypt
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary/70" /> 
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold">Job Description</h2>
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          <div className="pt-8 border-t">
            <button className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Apply Now (Coming Soon)
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              By applying, your profile information will be shared with the factory owner.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
