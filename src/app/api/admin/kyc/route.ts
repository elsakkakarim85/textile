import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import { audit, notify } from '@/server/events';

export const GET = route(async () => {
  await requireAdmin(); // previously ANY signed-in user could list and verify factories
  return prisma.factory.findMany({
    where: { deletedAt: null },
    include: { owner: true, kycDocuments: { orderBy: { createdAt: 'desc' } } },
    orderBy: { createdAt: 'desc' },
  });
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
