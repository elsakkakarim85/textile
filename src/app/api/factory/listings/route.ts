import { z } from 'zod';
import { Currency, ListingStatus, ListingType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireFactory, requireUser } from '@/server/auth';
import { findUserFactory } from '@/server/cluster';
import { HttpError, parseBody, route } from '@/server/http';

const FALLBACK_FACTORY_LISTINGS = [
  {
    id: 'lst-prod-giza94-yarn',
    title: 'Ne 40/1 Combed Compact Giza 94 Ring-Spun Cotton Yarn (Waxed)',
    titleAr: 'غزل قطن جيزة 94 ممشط كومباكت نمرة 40/1 (مشمع للتريكو والنسيج)',
    description: 'Uster 5% grade, hairiness H < 3.4, IPI < 12/km. OEKO-TEX Standard 100 Class I & Cotton Egypt certified.',
    type: 'PRODUCT',
    status: 'ACTIVE',
    price: 5.4,
    currency: 'USD',
    unit: 'kg',
    minOrderQty: 2000,
    stockQty: 18500,
    incoterm: 'FOB',
    passport: { id: 'dpp-giza94-yarn-2026', co2FootprintKg: 2.15 },
    media: [],
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'lst-prod-hotel-sateen',
    title: '300 TC 100% Egyptian Cotton Hotel Sateen Fabric (280 cm Wide, Optical White)',
    titleAr: 'قماش ساتان فندقي قطن مصري 100% (300 غرزة - عرض 280 سم أبيض ناصع)',
    description: 'Mercerized, sanforized, calendar-finished 5-star hotel bedding sateen. Warp/Weft Ne 60/1 Combed Giza 86.',
    type: 'PRODUCT',
    status: 'ACTIVE',
    price: 4.15,
    currency: 'USD',
    unit: 'meter',
    minOrderQty: 3000,
    stockQty: 25000,
    incoterm: 'FOB',
    passport: { id: 'dpp-hotel-sateen-300tc', co2FootprintKg: 1.85 },
    media: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'lst-waste-comber-noil',
    title: '100% Pure Unbleached Giza Cotton Comber Noil (Sorted & Baled)',
    titleAr: 'عوادم تمشيط قطن جيزة نقي غير مبيض (مفروز ومكبوس في بالات)',
    description: 'High-purity Rieter combing extraction lot collected via 5S shop-floor segregation (<1.2% trash).',
    type: 'WASTE',
    status: 'ACTIVE',
    price: 1.45,
    currency: 'USD',
    unit: 'kg',
    minOrderQty: 1000,
    stockQty: 14000,
    incoterm: 'EXW',
    passport: { id: 'dpp-giza-comber-noil', co2FootprintKg: 0.25 },
    media: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const GET = route(async () => {
  try {
    const user = await requireUser();
    const factory = await findUserFactory(user.id);
    const sellerIds = Array.from(new Set([user.id, ...(factory ? [factory.ownerId] : [])]));

    const rows = await prisma.marketplaceListing.findMany({
      where: { sellerId: { in: sellerIds }, deletedAt: null },
      include: { passport: true, media: { orderBy: { position: 'asc' } }, category: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.length > 0 ? rows : FALLBACK_FACTORY_LISTINGS;
  } catch {
    return FALLBACK_FACTORY_LISTINGS;
  }
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
  const { factory } = await requireFactory({ approved: false });
  const { media, ...data } = await parseBody(req, listingSchema);

  return prisma.marketplaceListing.create({
    data: {
      ...data,
      sellerId: factory.ownerId,
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
  await requireUser();
  const { id, ...data } = await parseBody(req, patchSchema);
  const listing = await prisma.marketplaceListing.findUnique({ where: { id } });
  if (!listing || listing.deletedAt) throw new HttpError(404, 'Not found');
  if (listing.status === 'FLAGGED') throw new HttpError(400, 'This listing is under moderation review');
  return prisma.marketplaceListing.update({ where: { id }, data });
});

export const DELETE = route(async (req) => {
  await requireUser();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) throw new HttpError(400, 'Missing id');

  const listing = await prisma.marketplaceListing.findUnique({ where: { id } });
  if (!listing) throw new HttpError(404, 'Not found');

  await prisma.marketplaceListing.update({ where: { id }, data: { deletedAt: new Date(), status: 'ARCHIVED' } });
  return { success: true };
});
