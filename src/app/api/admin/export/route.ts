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
  const admin = await requireAdmin(); // previously ANY signed-in user could export all factory PII

  const factories = await prisma.factory.findMany({
    where: { deletedAt: null },
    include: { owner: true },
    orderBy: { createdAt: 'desc' },
  });

  const headers = ['Factory ID', 'Name', 'Address', 'Tax ID', 'Status', 'Verified', 'Tier', 'Owner Email', 'Created At'];
  const rows = factories.map((f) =>
    [f.id, f.name, f.address, f.taxRegistrationNumber, f.status, f.isVerified ? 'Yes' : 'No', f.subscriptionTier, f.owner.email, f.createdAt.toISOString()]
      .map(cell)
      .join(','),
  );

  await audit(admin.id, 'EXPORT_FACTORIES', 'Factory', 'all', { count: factories.length });

  // BOM so Excel opens Arabic text correctly
  return new Response('\uFEFF' + [headers.map(cell).join(','), ...rows].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mahalla_factories_export.csv"',
    },
  });
});
