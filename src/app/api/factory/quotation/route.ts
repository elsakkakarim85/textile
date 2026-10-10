import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { rfqId, price, message } = await req.json();

    const factory = await prisma.factory.findFirst({
      where: { ownerId: authObj.userId, status: 'APPROVED' }
    });

    if (!factory) {
      return NextResponse.json({ error: 'Only approved factories can submit quotes.' }, { status: 403 });
    }

    // Check if already quoted
    const existing = await prisma.quotation.findFirst({
      where: { rfqId, factoryId: factory.id }
    });

    if (existing) {
      return NextResponse.json({ error: 'You have already quoted for this RFQ.' }, { status: 400 });
    }

    const quotation = await prisma.quotation.create({
      data: {
        rfqId,
        factoryId: factory.id,
        price,
        message
      }
    });

    return NextResponse.json(quotation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit quotation' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const factory = await prisma.factory.findFirst({ where: { ownerId: authObj.userId } });
    if (!factory) return NextResponse.json([]);

    const quotes = await prisma.quotation.findMany({
      where: { factoryId: factory.id },
      include: { rfq: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  }
}
