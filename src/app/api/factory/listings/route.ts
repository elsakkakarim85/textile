import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const listings = await prisma.marketplaceListing.findMany({
      where: { sellerId: authObj.userId },
      include: { passport: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { title, description, type, price } = await req.json();
    
    // Verify user is a factory owner and their factory is approved
    const factory = await prisma.factory.findFirst({
      where: { ownerId: authObj.userId, status: 'APPROVED' }
    });
    
    if (!factory) {
      return NextResponse.json({ error: 'You must have an approved factory profile to post listings.' }, { status: 403 });
    }

    const listing = await prisma.marketplaceListing.create({
      data: {
        title,
        description,
        type, // "PRODUCT", "RESOURCE", "WASTE"
        price: parseFloat(price) || 0,
        sellerId: authObj.userId
      }
    });
    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const listing = await prisma.marketplaceListing.findUnique({ where: { id } });
    if (!listing || listing.sellerId !== authObj.userId) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
    }

    await prisma.marketplaceListing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
