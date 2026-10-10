import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const authObj = await auth();
  if (!authObj.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const factories = await prisma.factory.findMany({
      include: { owner: true }
    });

    // Generate CSV string
    const headers = ['Factory ID', 'Name', 'Address', 'Tax ID', 'Verified', 'Owner Email', 'Created At'];
    const rows = factories.map(f => [
      f.id,
      `"${f.name}"`,
      `"${f.address}"`,
      `"${f.taxRegistrationNumber}"`,
      f.isVerified ? 'Yes' : 'No',
      `"${f.owner.email}"`,
      f.createdAt.toISOString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="mahalla_factories_export.csv"',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}
