import crypto from 'crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';

const schema = z.object({
  listingId: z.string().min(1),
  material: z.string().trim().min(2).max(300),
  origin: z.string().trim().max(200).optional(),
  fiberOrigin: z.string().trim().max(200).optional(),
  carbonFootprint: z.string().trim().max(100).optional(),
  waterUsage: z.string().trim().max(100).optional(),
  certifications: z.string().trim().max(500).optional(),
  careInstructions: z.string().trim().max(1000).optional(),
  recyclability: z.string().trim().max(500).optional(),
  supplyChain: z
    .array(z.object({ step: z.string().max(100), actor: z.string().max(200), location: z.string().max(200).optional(), date: z.string().max(30).optional() }))
    .max(20)
    .optional(),
});

/**
 * Tamper-evident signature over the passport content.
 * HMAC with a server secret when DPP_SIGNING_SECRET is set (recommended), plain SHA-256 otherwise.
 */
function sign(payload: unknown) {
  const data = JSON.stringify(payload);
  const secret = process.env.DPP_SIGNING_SECRET;
  return secret
    ? crypto.createHmac('sha256', secret).update(data).digest('hex')
    : crypto.createHash('sha256').update(data).digest('hex');
}

export const POST = route(async (req) => {
  const user = await requireUser();
  const input = await parseBody(req, schema);

  const listing = await prisma.marketplaceListing.findUnique({ where: { id: input.listingId } });
  if (!listing || listing.sellerId !== user.id) throw new HttpError(403, 'Not found or forbidden');

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const dppUrl = `${origin}/en/dpp/${listing.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(dppUrl)}`;
  const { listingId, ...fields } = input;
  const signatureHash = sign({ listingId, ...fields, signedAt: new Date().toISOString().slice(0, 10) });

  return prisma.productPassport.upsert({
    where: { listingId },
    update: { ...fields, qrCodeUrl, signatureHash },
    create: { listingId, ...fields, origin: fields.origin ?? 'Mahalla El Kubra, Egypt', qrCodeUrl, signatureHash },
  });
});

export const GET = route(async (req) => {
  const listingId = new URL(req.url).searchParams.get('listingId');
  if (!listingId) throw new HttpError(400, 'Missing listingId');
  return prisma.productPassport.findUnique({ where: { listingId } });
});
