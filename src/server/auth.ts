import 'server-only';
import { auth, currentUser } from '@clerk/nextjs/server';
import type { Role, User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { HttpError } from '@/server/http';

const VALID_ROLES: Role[] = ['admin', 'factory_owner', 'buyer', 'worker', 'service_provider', 'user'];

function normalizeRole(value: unknown): Role {
  return VALID_ROLES.includes(value as Role) ? (value as Role) : 'user';
}

/**
 * Returns the DB user for the signed-in Clerk user, creating/syncing it if needed.
 * This guarantees FK integrity for every write (previously users were never inserted).
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (existing) return existing;

  const cu = await currentUser();
  if (!cu) return null;

  const email = cu.primaryEmailAddress?.emailAddress ?? cu.emailAddresses[0]?.emailAddress ?? `${userId}@users.noreply`;
  return prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email,
      firstName: cu.firstName,
      lastName: cu.lastName,
      imageUrl: cu.imageUrl,
      role: normalizeRole(cu.publicMetadata?.role),
    },
  });
}

/** Throws 401 if not signed in, 403 if banned. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new HttpError(401, 'Unauthorized');
  if (user.isBanned) throw new HttpError(403, 'Account suspended');
  return user;
}

/** Throws 403 unless the user has one of the given roles (admins always pass). */
export async function requireRole(...roles: Role[]): Promise<User> {
  let user = await requireUser();
  const allowed = (u: User) => u.role === 'admin' || roles.includes(u.role);
  if (!allowed(user)) {
    // DB role may be stale if it was changed directly in the Clerk dashboard — re-sync once.
    const cu = await currentUser();
    const clerkRole = normalizeRole(cu?.publicMetadata?.role);
    if (cu && clerkRole !== user.role) {
      user = await prisma.user.update({ where: { id: user.id }, data: { role: clerkRole } });
    }
    if (!allowed(user)) throw new HttpError(403, 'Forbidden');
  }
  return user;
}

export const requireAdmin = () => requireRole('admin');

/** Returns the user's factory (owned or as team member). Optionally requires APPROVED status. */
export async function requireFactory(opts: { approved?: boolean } = {}) {
  const user = await requireUser();
  const factory = await prisma.factory.findFirst({
    where: {
      deletedAt: null,
      OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      ...(opts.approved ? { status: 'APPROVED' as const } : {}),
    },
  });
  if (!factory) {
    throw new HttpError(403, opts.approved ? 'An approved factory profile is required.' : 'Factory profile required.');
  }
  return { user, factory };
}
