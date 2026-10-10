"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Building2, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function RecruitmentBoardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/jobs')
      .then(res => res.json())
      .then(data => setJobs(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Textile Recruitment Board</h1>
        <p className="text-lg text-muted-foreground">Find jobs from verified Mahalla Cluster factories.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold">No Jobs Available</h2>
          <p className="text-muted-foreground">Check back later for new openings.</p>
        </div>
      ) : (
        <div className="grid gap-4 max-w-4xl mx-auto">
          {jobs.map(job => (
            <Card key={job.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-bold text-primary">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {job.employer.factories?.[0]?.name || job.employer.firstName || 'Factory'}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Mahalla, Egypt
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm">{job.description}</p>
                  </div>
                  <div className="shrink-0">
                    <Link href={`/recruitment/${job.id}`} className="block w-full md:w-auto text-center bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90">
                      View Details
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
