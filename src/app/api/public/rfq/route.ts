import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const rfqs = await prisma.rFQ.findMany({
      where: { status: 'OPEN' },
      include: {
        buyer: { select: { firstName: true, id: true } },
        _count: { select: { quotations: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(rfqs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch public RFQs' }, { status: 500 });
  }
}
