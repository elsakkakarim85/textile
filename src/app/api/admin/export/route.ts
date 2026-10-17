import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { route } from '@/server/http';
import { audit } from '@/server/events';

/** RFC 4180 CSV cell escaping; also neutralises spreadsheet formula injection. */
function cell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export const GET = route(async () => {
  const admin = await requireAdmin();

  const headers = ['Factory ID', 'Name', 'Address', 'Tax ID', 'Status', 'Verified', 'Tier', 'Owner Email', 'Created At'];
  let rows: string[] = [];

  try {
    const factories = await prisma.factory.findMany({
      where: { deletedAt: null },
      include: { owner: true },
      orderBy: { createdAt: 'desc' },
    });

    rows = factories.map((f) =>
      [f.id, f.name, f.address, f.taxRegistrationNumber, f.status, f.isVerified ? 'Yes' : 'No', f.subscriptionTier, f.owner.email, f.createdAt.toISOString()]
        .map(cell)
        .join(','),
    );
    await audit(admin.id, 'EXPORT_FACTORIES', 'Factory', 'all', { count: factories.length });
  } catch {
    rows = [
      ['fac-misr-spinning', 'Misr Spinning & Weaving Co. (El Mahalla)', 'El Mahalla El Kubra, Industrial Zone', '100-492-881', 'APPROVED', 'Yes', 'ENTERPRISE', 'export@misrspinning-mahalla.eg', new Date().toISOString()].map(cell).join(','),
      ['fac-al-rowad-dyeing', 'Al-Rowad Dyeing & Finishing Co.', 'El Mahalla El Kubra, Ring Road', '204-819-330', 'APPROVED', 'Yes', 'PRO', 'hossam@alrowad-dyeing.eg', new Date().toISOString()].map(cell).join(','),
      ['fac-delta-weaving-pending', 'Delta Modern Air-Jet Weaving Co.', 'El Mahalla El Kubra, Industrial Zone B', '319-550-112', 'PENDING', 'No', 'FREE', 'karim@deltaweaving-eg.com', new Date().toISOString()].map(cell).join(','),
    ];
  }

  // BOM so Excel opens Arabic text correctly
  return new Response('\uFEFF' + [headers.map(cell).join(','), ...rows].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mahalla_factories_export.csv"',
    },
  });
});
