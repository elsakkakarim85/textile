"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Plus, Users } from 'lucide-react';

export default function FactoryJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/factory/jobs');
      if (res.ok) setJobs(await res.json());
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
    try {
      const res = await fetch('/api/factory/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        setTitle(''); setDescription('');
        fetchJobs();
      } else {
        alert('Failed to post job. Is your factory approved?');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job posting and all its applications?')) return;
    try {
      const res = await fetch(`/api/factory/jobs?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchJobs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Postings</h1>
        <p className="text-muted-foreground">Manage your recruitment and review applications.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Post New Job</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Textile Engineer" className="w-full bg-background border rounded px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Description</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Describe the role and requirements..." className="w-full bg-background border rounded px-3 py-2 text-sm" />
                </div>
                <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded font-medium flex justify-center items-center gap-2">
                  <Plus className="w-4 h-4" /> Post Job
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          {loading ? <p>Loading...</p> : jobs.length === 0 ? <p className="text-muted-foreground">No active job postings.</p> : (
            jobs.map(job => (
              <Card key={job.id}>
                <CardContent className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{job.description}</p>
                    </div>
                    <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:bg-red-50 p-2 rounded shrink-0">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Users className="w-4 h-4 text-primary" />
                      {job.applications?.length || 0} Applications
                    </div>
                    <button className="text-sm text-primary hover:underline">View Applicants</button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
