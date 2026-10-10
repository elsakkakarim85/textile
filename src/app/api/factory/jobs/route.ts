import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const jobs = await prisma.jobPosting.findMany({
      where: { employerId: authObj.userId },
      include: { applications: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, description } = await req.json();
    
    // Verify user is a factory owner and their factory is approved
    const factory = await prisma.factory.findFirst({
      where: { ownerId: authObj.userId, status: 'APPROVED' }
    });
    
    if (!factory) {
      return NextResponse.json({ error: 'You must have an approved factory profile to post jobs.' }, { status: 403 });
    }

    const job = await prisma.jobPosting.create({
      data: {
        title,
        description,
        employerId: authObj.userId
      }
    });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job posting' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const job = await prisma.jobPosting.findUnique({ where: { id } });
    if (!job || job.employerId !== authObj.userId) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
    }

    // Must delete applications first due to foreign key constraints
    await prisma.jobApplication.deleteMany({ where: { jobId: id } });
    await prisma.jobPosting.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
