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

const FALLBACK_LISTINGS = [
  {
    id: 'demo-prod-giza86-bedlinen',
    type: 'PRODUCT',
    title: '100% Giza 86 Combed Cotton Sateen Bedlinen Set (300 TC, OEKO-TEX® 100)',
    titleAr: 'طقم ملايات ساتان قطن مصري جيزة 86 ممشط (300 غرزة - أيكوتكس 100)',
    description:
      'Luxury hotel-grade 300 TC sateen weave crafted from extra-long staple Giza 86 combed yarn (Ne 40/1). Mercerized, Sanforized (<2% shrinkage), reactive optical white & vat-dyed hospitality shades with full EU Digital Product Passport.',
    price: 26.5,
    currency: 'USD',
    unit: 'set',
    minOrderQty: 500,
    incoterm: 'FOB',
    passport: { id: 'dpp-giza86-bedlinen' },
    seller: {
      firstName: 'Misr',
      lastName: 'Spinning',
      factories: [{ id: 'demo-factory-1', name: 'Misr Spinning & Weaving (El-Mahalla)', isVerified: true }],
    },
  },
  {
    id: 'demo-prod-jacquard-terry',
    type: 'PRODUCT',
    title: '550 GSM Zero-Twist Egyptian Cotton Hotel Bath Towels (ISO 9001 / GOTS)',
    titleAr: 'فوط ومناشف فندقية قطن مصري 550 جم/م² عالية الامتصاص (GOTS)',
    description:
      'High-hydrophilicity (<2.5s absorption) zero-twist pile terry towels woven on Dornier air-jet terry looms. Double-needle lockstitch hems, enzyme bio-polished, ready for EU/GCC hospitality chains.',
    price: 4.85,
    currency: 'USD',
    unit: 'piece',
    minOrderQty: 2000,
    incoterm: 'CIF',
    passport: { id: 'dpp-jacquard-terry' },
    seller: {
      firstName: 'Delta',
      lastName: 'Terry',
      factories: [{ id: 'demo-factory-3', name: 'Delta Jacquard & Home Textiles', isVerified: true }],
    },
  },
  {
    id: 'demo-prod-compact-jersey',
    type: 'PRODUCT',
    title: 'ZDHC MRSL v3.1 Reactive-Dyed Compact Single Jersey & Interlock (180 GSM)',
    titleAr: 'قماش تريكو سينجل جيرسيه وإنترلوك قطن مدمج مصبوغ بمعيار ZDHC (180 جم/م²)',
    description:
      'Ne 30/1 compact combed cotton knitted on Mayer & Cie circular machines. Right-First-Time (RFT > 96%) spectrophotometric shade matching (CMC ΔE ≤ 0.6) with zero-discharge chemical certification.',
    price: 6.4,
    currency: 'USD',
    unit: 'kg',
    minOrderQty: 1000,
    incoterm: 'FOB',
    passport: { id: 'dpp-compact-jersey' },
    seller: {
      firstName: 'Al-Rowad',
      lastName: 'Dyeing',
      factories: [{ id: 'demo-factory-2', name: 'Al-Rowad Modern Dyeing & Finishing', isVerified: true }],
    },
  },
  {
    id: 'demo-res-giza94-yarn',
    type: 'RESOURCE',
    title: 'Combed Compact Ring-Spun Giza 94 Cotton Yarn — Ne 30/1 & Ne 40/1 (Cones)',
    titleAr: 'غزل قطن جيزة 94 ممشط كومباكت حلقي — نمرة 30/1 و 40/1 (كون على الشمع)',
    description:
      'Uster® Quantum 4.0 cleared cones (5% Uster statistics: U% < 8.8, IPI < 35/km, Tenacity > 21 cN/tex). Waxed for high-speed circular knitting or unwaxed for air-jet warping.',
    price: 4.15,
    currency: 'USD',
    unit: 'kg',
    minOrderQty: 2000,
    incoterm: 'EXW',
    passport: { id: 'dpp-giza94-yarn' },
    seller: {
      firstName: 'Misr',
      lastName: 'Spinning',
      factories: [{ id: 'demo-factory-1', name: 'Misr Spinning & Weaving (El-Mahalla)', isVerified: true }],
    },
  },
  {
    id: 'demo-res-reactive-dyes',
    type: 'RESOURCE',
    title: 'Bifunctional Low-Salt Reactive Dyestuff & Bio-Polishing Enzyme Package (ZDHC Level 3)',
    titleAr: 'مجموعة صبغات نشطة منخفضة الأملاح وإنزيمات معالجة حيوية معتمدة (ZDHC المستوى 3)',
    description:
      'High-fixation (>88%) vinylsulfone/MCT reactive dyes reducing salt load by 35% and rinse water consumption by 28%. Includes GOTS/ZDHC Gateway conformance certificates.',
    price: 7.9,
    currency: 'USD',
    unit: 'kg',
    minOrderQty: 250,
    incoterm: 'EXW',
    passport: null,
    seller: {
      firstName: 'Al-Rowad',
      lastName: 'Chemical Hub',
      factories: [{ id: 'demo-factory-2', name: 'Al-Rowad Modern Dyeing & Finishing', isVerified: true }],
    },
  },
  {
    id: 'demo-res-greige-percale',
    type: 'RESOURCE',
    title: 'Wide-Width Greige Cotton Percale & Sateen Fabric (320 cm Loom-State)',
    titleAr: 'أقمشة خام (جريج) بركال وساتان عريضة (عرض 320 سم من النول الهوائي)',
    description:
      'Woven on Picanol OmniPlus-i air-jet looms, 4-point ASTM D5430 inspected (<12 penalty points/100 sq yd). Ready for continuous bleaching, mercerizing, or rotary printing.',
    price: 2.35,
    currency: 'USD',
    unit: 'meter',
    minOrderQty: 5000,
    incoterm: 'EXW',
    passport: null,
    seller: {
      firstName: 'Delta',
      lastName: 'Weaving',
      factories: [{ id: 'demo-factory-3', name: 'Delta Jacquard & Home Textiles', isVerified: true }],
    },
  },
  {
    id: 'demo-waste-comber-noil',
    type: 'WASTE',
    title: '100% Pure Unbleached Giza Cotton Comber Noil (Sorted & Baled, <1.2% Trash)',
    titleAr: 'عوادم تمشيط قطن جيزة نقي غير مبيض (مفروز ومكبوس في بالات - شوائب أقل من 1.2%)',
    description:
      'High-purity Rieter combing machine extraction lot. Ideal for open-end (OE) rotor spinning (Ne 10/1–16/1), medical absorbent cotton bleaching, or GRS-certified circular denim.',
    price: 1.45,
    currency: 'USD',
    unit: 'kg',
    minOrderQty: 1000,
    incoterm: 'EXW',
    passport: { id: 'dpp-comber-noil' },
    seller: {
      firstName: 'Misr',
      lastName: 'Spinning',
      factories: [{ id: 'demo-factory-1', name: 'Misr Spinning & Weaving (El-Mahalla)', isVerified: true }],
    },
  },
  {
    id: 'demo-waste-white-hosiery-clips',
    type: 'WASTE',
    title: 'Sorted Optical-White 100% Cotton Cutting Table Clips (Zero Elastane / Lycra)',
    titleAr: 'قصاقيص مقصدار قطن 100% أبيض ناصع مفروز (خالٍ تماماً من الليكرا والإيلاستان)',
    description:
      'Clean post-industrial cutting room clips from 5S Red-Tag sorting. Guaranteed 0% spandex/polyester contamination, ready for mechanical garnetting and recycled yarn spinning.',
    price: 0.85,
    currency: 'USD',
    unit: 'kg',
    minOrderQty: 2000,
    incoterm: 'EXW',
    passport: null,
    seller: {
      firstName: 'Nile Valley',
      lastName: 'Knits',
      factories: [{ id: 'demo-factory-4', name: 'Nile Valley Combed Knits & Apparel', isVerified: true }],
    },
  },
  {
    id: 'demo-waste-selvedge-offcuts',
    type: 'WASTE',
    title: 'Loom Selvedge Offcuts & Yarn Cone Ends (Sorted by Shade — GRS Traceable)',
    titleAr: 'عوادم براسل الأنوال وبواقي كون الغزل (مفروزة حسب اللون — قابلة للتتبع GRS)',
    description:
      'Baled air-jet loom selvedge trims and residual ring-spun yarn cones collected via shop-floor 5S segregation. Suitable for non-woven acoustic/automotive felts and OE recycled yarns.',
    price: 0.62,
    currency: 'USD',
    unit: 'kg',
    minOrderQty: 1500,
    incoterm: 'EXW',
    passport: null,
    seller: {
      firstName: 'Delta',
      lastName: 'Weaving',
      factories: [{ id: 'demo-factory-3', name: 'Delta Jacquard & Home Textiles', isVerified: true }],
    },
  },
];

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

  try {
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
          seller: { select: { firstName: true, lastName: true, factories: { select: { id: true, name: true, isVerified: true }, take: 1 } } },
        },
      }),
      prisma.marketplaceListing.count({ where }),
    ]);

    if (items.length > 0) {
      return new Response(JSON.stringify(items, (_k, v) => (v instanceof Prisma.Decimal ? v.toNumber() : v)), {
        headers: { 'Content-Type': 'application/json', 'X-Total-Count': String(total), 'X-Page': String(p.page) },
      });
    }
  } catch {
    // Fall through to deterministic Mahalla cluster catalog when DB is asleep
  }

  const filtered = FALLBACK_LISTINGS.filter((item) => {
    if (p.type && item.type !== p.type) return false;
    if (p.q) {
      const qLower = p.q.toLowerCase();
      if (
        !item.title.toLowerCase().includes(qLower) &&
        !item.titleAr.toLowerCase().includes(qLower) &&
        !item.description.toLowerCase().includes(qLower)
      ) {
        return false;
      }
    }
    return true;
  });

  return new Response(JSON.stringify(filtered), {
    headers: { 'Content-Type': 'application/json', 'X-Total-Count': String(filtered.length), 'X-Page': '1', 'X-Fallback': 'true' },
  });
});

