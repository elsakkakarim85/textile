import { z } from 'zod';
import { Role } from '@prisma/client';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';
import { audit } from '@/server/events';

export const GET = route(async (req) => {
  await requireAdmin();
  const search = (new URL(req.url).searchParams.get('search') || '').trim();

  return prisma.user.findMany({
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
