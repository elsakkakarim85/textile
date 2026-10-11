import { Webhook } from 'svix';
import type { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { env } from '@/server/env';

const ROLES: Role[] = ['admin', 'factory_owner', 'buyer', 'worker', 'service_provider', 'user'];

type ClerkUserEvent = {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
    email_addresses?: { id: string; email_address: string }[];
    primary_email_address_id?: string | null;
    phone_numbers?: { phone_number: string }[];
    public_metadata?: { role?: string };
  };
};

/** Clerk → DB user sync. Configure in Clerk Dashboard → Webhooks → endpoint /api/webhooks/clerk */
export async function POST(req: Request) {
  if (!env.CLERK_WEBHOOK_SECRET) return new Response('Webhook not configured', { status: 501 });

  const payload = await req.text();
  const headers = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  };

  let evt: ClerkUserEvent;
  try {
    evt = new Webhook(env.CLERK_WEBHOOK_SECRET).verify(payload, headers) as unknown as ClerkUserEvent;
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  const d = evt.data;
  if (evt.type === 'user.deleted') {
    await prisma.user.updateMany({ where: { id: d.id }, data: { deletedAt: new Date(), isBanned: true } });
    return new Response('ok');
  }

  const email =
    d.email_addresses?.find((e) => e.id === d.primary_email_address_id)?.email_address ??
    d.email_addresses?.[0]?.email_address ??
    `${d.id}@users.noreply`;
  const role = ROLES.includes(d.public_metadata?.role as Role) ? (d.public_metadata!.role as Role) : undefined;
  const profile = {
    email,
    firstName: d.first_name ?? null,
    lastName: d.last_name ?? null,
    imageUrl: d.image_url ?? null,
    phone: d.phone_numbers?.[0]?.phone_number ?? null,
  };

  await prisma.user.upsert({
    where: { id: d.id },
    create: { id: d.id, ...profile, role: role ?? 'user' },
    update: { ...profile, ...(role ? { role } : {}) },
  });

  return new Response('ok');
}
