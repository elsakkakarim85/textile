import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, description, quantity, targetPrice } = await req.json();

    const rfq = await prisma.rFQ.create({
      data: {
        title,
        description,
        quantity,
        targetPrice,
        buyerId: authObj.userId
      }
    });

    return NextResponse.json(rfq);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create RFQ' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rfqs = await prisma.rFQ.findMany({
      where: { buyerId: authObj.userId },
      include: {
        quotations: {
          include: { factory: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(rfqs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch RFQs' }, { status: 500 });
  }
}
