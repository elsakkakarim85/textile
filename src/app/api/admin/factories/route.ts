import { z } from 'zod';
import { FactoryStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import { audit, notify } from '@/server/events';
import { sendFactoryStatusEmail } from '@/lib/email';

export const GET = route(async (req) => {
  await requireAdmin();
  const status = new URL(req.url).searchParams.get('status');
  const parsed = z.nativeEnum(FactoryStatus).safeParse(status);

  return prisma.factory.findMany({
    where: { deletedAt: null, ...(parsed.success ? { status: parsed.data } : {}) },
    include: { owner: true, _count: { select: { kycDocuments: true, certifications: true } } },
    orderBy: { createdAt: 'desc' },
  });
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
