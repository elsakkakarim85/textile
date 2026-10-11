import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import { audit } from '@/server/events';

/** Whitelisted platform settings — arbitrary keys are rejected. */
const ALLOWED_KEYS = [
  'maintenance_mode',
  'commission_rate',
  'registration_open',
  'ai_enabled',
  'ai_daily_limit',
  'default_currency',
  'support_email',
  'announcement',
] as const;

export const GET = route(async () => {
  await requireAdmin();
  const settings = await prisma.systemSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
});

const schema = z
  .record(z.enum(ALLOWED_KEYS), z.union([z.string().max(2000), z.number(), z.boolean()]))
  .refine((v) => Object.keys(v).length > 0, 'No settings provided');

export const PATCH = route(async (req) => {
  const admin = await requireAdmin();
  const updates = await parseBody(req, schema);

  await prisma.$transaction(
    Object.entries(updates).map(([key, value]) =>
      prisma.systemSetting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } }),
    ),
  );
  await audit(admin.id, 'UPDATE_SETTINGS', 'Setting', 'global', updates);
  return { success: true };
});
