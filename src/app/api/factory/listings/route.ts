import { z } from 'zod';
import { Currency, ListingStatus, ListingType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireFactory, requireUser } from '@/server/auth';
import { HttpError, parseBody, route } from '@/server/http';

export const GET = route(async () => {
  const user = await requireUser();
  return prisma.marketplaceListing.findMany({
    where: { sellerId: user.id, deletedAt: null },
    include: { passport: true, media: { orderBy: { position: 'asc' } }, category: true },
    orderBy: { createdAt: 'desc' },
  });
});

const listingSchema = z.object({
  title: z.string().trim().min(3).max(200),
  titleAr: z.string().trim().max(200).optional(),
  description: z.string().trim().min(10).max(10000),
  descriptionAr: z.string().trim().max(10000).optional(),
  type: z.nativeEnum(ListingType),
  categoryId: z.string().optional(),
  price: z.coerce.number().nonnegative().max(10_000_000).optional(),
  currency: z.nativeEnum(Currency).default('USD'),
  unit: z.string().trim().max(30).optional(),
  minOrderQty: z.coerce.number().int().positive().optional(),
  stockQty: z.coerce.number().int().nonnegative().optional(),
  incoterm: z.enum(['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP']).optional(),
  attributes: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  media: z.array(z.object({ url: z.string().url(), alt: z.string().max(200).optional() })).max(10).default([]),
});

export const POST = route(async (req) => {
  const { user } = await requireFactory({ approved: true });
  const { media, ...data } = await parseBody(req, listingSchema);

  return prisma.marketplaceListing.create({
    data: {
      ...data,
      sellerId: user.id,
      media: { create: (media || []).map((m, position) => ({ ...m, position })) },
    },
    include: { media: true },
  });
});

const patchSchema = listingSchema.partial().omit({ media: true }).extend({
  id: z.string().min(1),
  status: z.enum([ListingStatus.DRAFT, ListingStatus.ACTIVE, ListingStatus.SOLD, ListingStatus.ARCHIVED]).optional(),
});

export const PATCH = route(async (req) => {
  const user = await requireUser();
  const { id, ...data } = await parseBody(req, patchSchema);
  const listing = await prisma.marketplaceListing.findUnique({ where: { id } });
  if (!listing || listing.sellerId !== user.id || listing.deletedAt) throw new HttpError(403, 'Not found or forbidden');
  if (listing.status === 'FLAGGED') throw new HttpError(400, 'This listing is under moderation review');
  return prisma.marketplaceListing.update({ where: { id }, data });
});

export const DELETE = route(async (req) => {
  const user = await requireUser();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) throw new HttpError(400, 'Missing id');

  const listing = await prisma.marketplaceListing.findUnique({ where: { id } });
  if (!listing || listing.sellerId !== user.id) throw new HttpError(403, 'Not found or forbidden');

  await prisma.marketplaceListing.update({ where: { id }, data: { deletedAt: new Date(), status: 'ARCHIVED' } });
  return { success: true };
});
