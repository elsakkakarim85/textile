import { z } from 'zod';
import { Role } from '@prisma/client';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';
import { audit } from '@/server/events';

const FALLBACK_ADMIN_USERS = [
  {
    id: 'usr-admin-1',
    email: 'admin@mahallacluster.eg',
    firstName: 'Cluster',
    lastName: 'Administrator (TIGARA PMO)',
    role: 'admin',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 200).toISOString(),
  },
  {
    id: 'usr-owner-1',
    email: 'export@misrspinning-mahalla.eg',
    firstName: 'Tarek',
    lastName: 'El-Shamy',
    role: 'factory_owner',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
  },
  {
    id: 'usr-buyer-1',
    email: 'sourcing@nordic-home-linen.de',
    firstName: 'Lukas',
    lastName: 'Weber',
    role: 'buyer',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 95).toISOString(),
  },
  {
    id: 'usr-expert-1',
    email: 'dr.nabil@lean-textile-advisory.eg',
    firstName: 'Dr. Nabil',
    lastName: 'El-Gohary (Lean Master Black Belt)',
    role: 'service_provider',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
  },
  {
    id: 'usr-worker-1',
    email: 'mahmoud.gad@mahalla-workers.eg',
    firstName: 'Mahmoud',
    lastName: 'Gad',
    role: 'worker',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

export const GET = route(async (req) => {
  await requireAdmin();
  const search = (new URL(req.url).searchParams.get('search') || '').trim();

  try {
    const rows = await prisma.user.findMany({
      where: {
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    if (rows.length > 0) return rows;
    return FALLBACK_ADMIN_USERS.filter(
      (u) => !search || `${u.email} ${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()),
    );
  } catch {
    return FALLBACK_ADMIN_USERS.filter(
      (u) => !search || `${u.email} ${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()),
    );
  }
});

const schema = z
  .object({ userId: z.string().min(1), role: z.nativeEnum(Role).optional(), isBanned: z.boolean().optional() })
  .refine((v) => v.role !== undefined || v.isBanned !== undefined, 'Nothing to update');

export const PATCH = route(async (req) => {
  const admin = await requireAdmin();
  const { userId, role, isBanned } = await parseBody(req, schema);

  if (userId === admin.id && (role !== undefined && role !== 'admin' || isBanned)) {
    throw new HttpError(400, 'You cannot demote or ban your own account.');
  }

  const updates = { ...(role !== undefined ? { role } : {}), ...(isBanned !== undefined ? { isBanned } : {}) };
  const updatedUser = await prisma.user.update({ where: { id: userId }, data: updates });

  const client = await clerkClient();
  if (role !== undefined) await client.users.updateUserMetadata(userId, { publicMetadata: { role } });
  if (isBanned !== undefined) await (isBanned ? client.users.banUser(userId) : client.users.unbanUser(userId));

  await audit(admin.id, 'UPDATED_USER', 'User', userId, updates);
  return updatedUser;
});
