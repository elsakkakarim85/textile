import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { listingId, material, origin, carbonFootprint, certifications } = await req.json();

    // Verify ownership
    const listing = await prisma.marketplaceListing.findUnique({ where: { id: listingId } });
    if (!listing || listing.sellerId !== authObj.userId) {
      return NextResponse.json({ error: 'Not found or forbidden' }, { status: 403 });
    }

    // Generate Blockchain-style Hash
    const timestamp = new Date().toISOString();
    const dataToHash = `${listingId}-${material}-${origin}-${carbonFootprint}-${timestamp}`;
    const signatureHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    // Generate the public URL that the QR code will point to
    const dppUrl = `https://mahalla-cluster-app.vercel.app/en/dpp/${listingId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(dppUrl)}`;

    const passport = await prisma.productPassport.upsert({
      where: { listingId },
      update: {
        material, origin, carbonFootprint, certifications, qrCodeUrl, signatureHash
      },
      create: {
        listingId, material, origin, carbonFootprint, certifications, qrCodeUrl, signatureHash
      }
    });

    return NextResponse.json(passport);
  } catch (error) {
    console.error('DPP Error:', error);
    return NextResponse.json({ error: 'Failed to create passport' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');
    if (!listingId) return NextResponse.json({ error: 'Missing listingId' }, { status: 400 });

    const passport = await prisma.productPassport.findUnique({
      where: { listingId }
    });

    return NextResponse.json(passport);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch passport' }, { status: 500 });
  }
}
