import 'server-only';
import { auth } from '@clerk/nextjs/server';
import type { Factory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { serialize } from '@/server/http';

/**
 * Server-side helpers shared by the cluster collaboration & modernization modules.
 */

/** Run a DB read for a server page. Never throws: returns `fallback` + `ok:false` if the DB is unreachable. */
export async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<{ data: T; ok: boolean }> {
  try {
    return { data: serialize(await fn()), ok: true };
  } catch (err) {
    console.error('[cluster] query failed', err);
    return { data: fallback, ok: false };
  }
}

/** Current Clerk user id or null (does not throw, for public pages). */
export async function currentUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}

/** The factory the user owns or belongs to, or null. */
export async function findUserFactory(userId: string | null): Promise<Factory | null> {
  if (!userId) return null;
  try {
    return await prisma.factory.findFirst({
      where: { deletedAt: null, OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
    });
  } catch {
    return null;
  }
}

/** Notify every member (owner + team) of a factory. */
export async function notifyFactory(factoryId: string, title: string, message: string, link?: string) {
  const f = await prisma.factory.findUnique({
    where: { id: factoryId },
    select: { ownerId: true, members: { select: { userId: true } } },
  });
  if (!f) return;
  const ids = Array.from(new Set([f.ownerId, ...f.members.map((m) => m.userId)]));
  await prisma.notification.createMany({ data: ids.map((userId) => ({ userId, title, message, link })) });
}
