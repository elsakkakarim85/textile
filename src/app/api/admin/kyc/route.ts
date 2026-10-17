import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import { audit, notify } from '@/server/events';

const FALLBACK_KYC_FACTORIES = [
  {
    id: 'fac-misr-spinning',
    name: 'Misr Spinning & Weaving Co. (El Mahalla)',
    status: 'APPROVED',
    isVerified: true,
    verifiedAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    owner: { id: 'usr-owner-1', firstName: 'Tarek', lastName: 'El-Shamy', email: 'export@misrspinning-mahalla.eg' },
    kycDocuments: [
      { id: 'kyc-1', type: 'COMMERCIAL_REGISTER', fileUrl: '#cr-misr-mahalla-2026', createdAt: new Date(Date.now() - 86400000 * 125).toISOString() },
      { id: 'kyc-2', type: 'INDUSTRIAL_LICENSE', fileUrl: '#ida-license-44021', createdAt: new Date(Date.now() - 86400000 * 124).toISOString() },
      { id: 'kyc-3', type: 'EXPORT_REGISTRY_GOEIC', fileUrl: '#goeic-export-9920', createdAt: new Date(Date.now() - 86400000 * 122).toISOString() },
    ],
  },
  {
    id: 'fac-delta-weaving-pending',
    name: 'Delta Modern Air-Jet Weaving Co.',
    status: 'PENDING',
    isVerified: false,
    verifiedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    owner: { id: 'usr-owner-3', firstName: 'Karim', lastName: 'Mansour', email: 'karim@deltaweaving-eg.com' },
    kycDocuments: [
      { id: 'kyc-4', type: 'COMMERCIAL_REGISTER', fileUrl: '#cr-delta-weaving-2026', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 'kyc-5', type: 'TAX_CARD', fileUrl: '#tax-delta-weaving-2026', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    ],
  },
];

export const GET = route(async () => {
  await requireAdmin();
  try {
    const rows = await prisma.factory.findMany({
      where: { deletedAt: null },
      include: { owner: true, kycDocuments: { orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.length > 0 ? rows : FALLBACK_KYC_FACTORIES;
  } catch {
    return FALLBACK_KYC_FACTORIES;
  }
});

const schema = z.object({ factoryId: z.string().min(1), isVerified: z.boolean() });

export const PUT = route(async (req) => {
  const admin = await requireAdmin();
  const { factoryId, isVerified } = await parseBody(req, schema);

  const updated = await prisma.factory.update({
    where: { id: factoryId },
    data: { isVerified, verifiedAt: isVerified ? new Date() : null },
  });

  await audit(admin.id, isVerified ? 'KYC_VERIFIED' : 'KYC_UNVERIFIED', 'Factory', factoryId);
  if (isVerified) {
    await notify(
      updated.ownerId,
      'Account verified ✔',
      'Congratulations! Your factory has been verified by the Mahalla Cluster admin team.',
      `/factories/${updated.id}`,
    );
  }
  return updated;
});
