import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';
import { getCurrentUser, PERSONA_COOKIE } from '@/server/auth';

export const GET = route(async () => {
  const [activeUser, users, factories] = await Promise.all([
    getCurrentUser(),
    prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, firstName: true, lastName: true, role: true, email: true },
      orderBy: { createdAt: 'asc' },
      take: 10,
    }),
    prisma.factory.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, ownerId: true, capabilities: true, subscriptionTier: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const activeFactory = activeUser
    ? factories.find((f) => f.ownerId === activeUser.id) || factories[0] || null
    : factories[0] || null;

  return {
    activeUser,
    activeFactory,
    personas: users.map((u) => ({
      ...u,
      factory: factories.find((f) => f.ownerId === u.id) || null,
    })),
  };
});

export const POST = route(async (req) => {
  const { userId } = (await req.json()) as { userId?: string };
  const store = await cookies();
  if (!userId) {
    store.delete(PERSONA_COOKIE);
  } else {
    store.set(PERSONA_COOKIE, userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
  }
  return NextResponse.json({ ok: true, userId: userId || null });
});
