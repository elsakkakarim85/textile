import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireFactory, requireUser } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';

export const GET = route(async () => {
  const user = await requireUser();
  return prisma.jobPosting.findMany({
    where: { employerId: user.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  });
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
