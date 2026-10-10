import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const jobs = await prisma.jobPosting.findMany({
      where: { status: 'ACTIVE' },
      include: {
        employer: {
          select: { firstName: true, lastName: true, factories: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
