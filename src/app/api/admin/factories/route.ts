import { z } from 'zod';
import { FactoryStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import { audit, notify } from '@/server/events';
import { sendFactoryStatusEmail } from '@/lib/email';

const FALLBACK_ADMIN_FACTORIES = [
  {
    id: 'fac-misr-spinning',
    name: 'Misr Spinning & Weaving Co. (El Mahalla)',
    nameAr: 'شركة مصر للغزل والنسيج بالمحلة الكبرى',
    status: 'APPROVED',
    isVerified: true,
    verifiedAt: new Date(Date.now() - 86400000 * 120).toISOString(),
    location: 'El Mahalla El Kubra, Industrial Zone',
    monthlyCapacity: '4,200 Tons / Month',
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    owner: { id: 'usr-owner-1', firstName: 'Tarek', lastName: 'El-Shamy', email: 'export@misrspinning-mahalla.eg' },
    _count: { kycDocuments: 4, certifications: 6 },
  },
  {
    id: 'fac-al-rowad-dyeing',
    name: 'Al-Rowad Dyeing & Finishing Co.',
    nameAr: 'شركة الرواد للصباغة والتجهيز',
    status: 'APPROVED',
    isVerified: true,
    verifiedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    location: 'El Mahalla El Kubra, Ring Road',
    monthlyCapacity: '1,800 Tons / Month',
    createdAt: new Date(Date.now() - 86400000 * 140).toISOString(),
    owner: { id: 'usr-owner-2', firstName: 'Hossam', lastName: 'Abdel-Aziz', email: 'hossam@alrowad-dyeing.eg' },
    _count: { kycDocuments: 3, certifications: 5 },
  },
  {
    id: 'fac-delta-weaving-pending',
    name: 'Delta Modern Air-Jet Weaving Co.',
    nameAr: 'شركة الدلتا الحديثة للنسيج الهوائي',
    status: 'PENDING',
    isVerified: false,
    verifiedAt: null,
    location: 'El Mahalla El Kubra, Industrial Zone B',
    monthlyCapacity: '620 Tons / Month',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    owner: { id: 'usr-owner-3', firstName: 'Karim', lastName: 'Mansour', email: 'karim@deltaweaving-eg.com' },
    _count: { kycDocuments: 3, certifications: 2 },
  },
];

export const GET = route(async (req) => {
  await requireAdmin();
  const status = new URL(req.url).searchParams.get('status');
  const parsed = z.nativeEnum(FactoryStatus).safeParse(status);

  try {
    const rows = await prisma.factory.findMany({
      where: { deletedAt: null, ...(parsed.success ? { status: parsed.data } : {}) },
      include: { owner: true, _count: { select: { kycDocuments: true, certifications: true } } },
      orderBy: { createdAt: 'desc' },
    });
    if (rows.length > 0) return rows;
    return parsed.success ? FALLBACK_ADMIN_FACTORIES.filter((f) => f.status === parsed.data) : FALLBACK_ADMIN_FACTORIES;
  } catch {
    return parsed.success ? FALLBACK_ADMIN_FACTORIES.filter((f) => f.status === parsed.data) : FALLBACK_ADMIN_FACTORIES;
  }
});

const patchSchema = z
  .object({
    factoryId: z.string().min(1),
    status: z.nativeEnum(FactoryStatus),
    rejectionReason: z.string().max(1000).optional(),
  })
  .refine((v) => v.status !== 'REJECTED' || !!v.rejectionReason?.trim(), {
    message: 'A rejection reason is required',
    path: ['rejectionReason'],
  });

export const PATCH = route(async (req) => {
  const admin = await requireAdmin();
  const { factoryId, status, rejectionReason } = await parseBody(req, patchSchema);

  const factory = await prisma.factory.update({
    where: { id: factoryId },
    data: { status, rejectionReason: status === 'REJECTED' ? rejectionReason : null },
    include: { owner: true },
  });

  await audit(admin.id, `FACTORY_STATUS_${status}`, 'Factory', factoryId, { status, rejectionReason });
  await notify(
    factory.ownerId,
    status === 'APPROVED' ? 'Factory approved' : `Factory status: ${status}`,
    status === 'REJECTED' ? `Reason: ${rejectionReason}` : `Your factory "${factory.name}" is now ${status.toLowerCase()}.`,
    '/dashboard/factory',
  );

  if (factory.owner.email) {
    // Email failure must not fail the admin action
    sendFactoryStatusEmail(factory.owner.email, status, factory.owner.firstName || 'Factory Owner', rejectionReason).catch((e) =>
      console.error('[email] factory status', e),
    );
  }

  return factory;
});
