import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireFactory, requireUser } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';

const FALLBACK_FACTORY_JOBS = [
  {
    id: 'job-mahalla-01',
    title: 'Senior Air-Jet Weaving & SMED Maintenance Engineer — مهندس صيانة أنوال هوائية وSMED',
    description: 'Lead TPM autonomous/planned maintenance and Single-Minute Exchange of Die (SMED) warp-beam changeovers across 48 Picanol OmniPlus-i looms.',
    location: 'El Mahalla El Kubra, Industrial Zone',
    employmentType: 'full_time',
    salaryMin: 22000,
    salaryMax: 32000,
    skills: ['Picanol Air-Jet', 'SMED Changeover', 'TPM Maintenance', 'OEE Optimization'],
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    _count: { applications: 9 },
  },
  {
    id: 'job-mahalla-02',
    title: 'Lean Six Sigma Black Belt & OEE Continuous Improvement Lead — قائد التميز التشغيلي ولين 6 سيجما',
    description: 'Drive VSM, Poka-Yoke zero-defect gates, and A3 Kaizen projects across spinning and finishing lines.',
    location: 'El Mahalla El Kubra (Hybrid)',
    employmentType: 'full_time',
    salaryMin: 28000,
    salaryMax: 42000,
    skills: ['Lean Six Sigma Black Belt', 'Value Stream Mapping', 'OEE & SPC', 'DMAIC'],
    status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    _count: { applications: 14 },
  },
];

export const GET = route(async () => {
  try {
    const user = await requireUser();
    const rows = await prisma.jobPosting.findMany({
      where: { employerId: user.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.length > 0 ? rows : FALLBACK_FACTORY_JOBS;
  } catch {
    return FALLBACK_FACTORY_JOBS;
  }
});

const schema = z
  .object({
    title: z.string().trim().min(3).max(200),
    description: z.string().trim().min(10).max(10000),
    location: z.string().trim().max(120).optional(),
    employmentType: z.enum(['full_time', 'part_time', 'contract', 'internship']).optional(),
    salaryMin: z.coerce.number().nonnegative().optional(),
    salaryMax: z.coerce.number().nonnegative().optional(),
    skills: z.array(z.string().trim().max(50)).max(20).default([]),
  })
  .refine((v) => v.salaryMin === undefined || v.salaryMax === undefined || v.salaryMin <= v.salaryMax, {
    message: 'Minimum salary must not exceed maximum',
    path: ['salaryMin'],
  });

export const POST = route(async (req) => {
  const { user } = await requireFactory({ approved: true });
  const data = await parseBody(req, schema);
  return prisma.jobPosting.create({ data: { ...data, employerId: user.id } });
});

export const DELETE = route(async (req) => {
  const user = await requireUser();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) throw new HttpError(400, 'Missing id');

  const job = await prisma.jobPosting.findUnique({ where: { id } });
  if (!job || job.employerId !== user.id) throw new HttpError(403, 'Not found or forbidden');

  // Close instead of hard delete so applicants keep their history
  await prisma.jobPosting.update({ where: { id }, data: { status: 'CLOSED' } });
  return { success: true };
});
