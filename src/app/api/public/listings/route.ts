import { z } from 'zod';
import { Prisma, ListingType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';

export const dynamic = 'force-dynamic';

const query = z.object({
  type: z.nativeEnum(ListingType).optional(),
  q: z.string().trim().max(200).optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  verified: z.enum(['true', 'false']).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'popular']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(60).default(24),
});

export const GET = route(async (req) => {
  const p = query.parse(Object.fromEntries(new URL(req.url).searchParams));

  const where: Prisma.MarketplaceListingWhereInput = {
    status: 'ACTIVE',
    deletedAt: null,
    ...(p.type ? { type: p.type } : {}),
    ...(p.category ? { category: { slug: p.category } } : {}),
    ...(p.minPrice !== undefined || p.maxPrice !== undefined ? { price: { gte: p.minPrice, lte: p.maxPrice } } : {}),
    ...(p.verified === 'true' ? { seller: { factories: { some: { isVerified: true } } } } : {}),
    ...(p.q
      ? {
          OR: [
            { title: { contains: p.q, mode: 'insensitive' } },
            { titleAr: { contains: p.q, mode: 'insensitive' } },
            { description: { contains: p.q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.MarketplaceListingOrderByWithRelationInput =
    p.sort === 'price_asc' ? { price: 'asc' } : p.sort === 'price_desc' ? { price: 'desc' } : p.sort === 'popular' ? { viewCount: 'desc' } : { createdAt: 'desc' };

  const [items, total] = await Promise.all([
    prisma.marketplaceListing.findMany({
      where,
      orderBy,
      skip: (p.page - 1) * p.pageSize,
      take: p.pageSize,
      include: {
        media: { orderBy: { position: 'asc' }, take: 1 },
        passport: { select: { id: true } },
        category: { select: { slug: true, nameEn: true, nameAr: true } },
        // Public endpoint: never expose seller email/phone
        seller: { select: { firstName: true, lastName: true, factories: { select: { id: true, name: true, isVerified: true }, take: 1 } } },
      },
    }),
    prisma.marketplaceListing.count({ where }),
  ]);

  // Array body keeps existing pages working; pagination info in headers.
  return new Response(JSON.stringify(items, (_k, v) => (v instanceof Prisma.Decimal ? v.toNumber() : v)), {
    headers: { 'Content-Type': 'application/json', 'X-Total-Count': String(total), 'X-Page': String(p.page) },
  });
});
