import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';

export const dynamic = 'force-dynamic';

const FALLBACK_RFQS = [
  {
    id: 'demo-rfq-eu-bedlinen',
    title: '100% Giza 86 Combed Cotton Sateen Bedlinen Sets (300 TC, OEKO-TEX® Standard 100)',
    description:
      'German hospitality procurement group seeking 12,000 sets of 300 TC sateen bedlinen (duvet cover + 2 pillowcases + fitted sheet). Yarn spec: Ne 40/1 combed Giza 86, mercerized, optical white (CIE Whiteness ≥ 145), dimensional stability ≤ 2% after 5 washes at 60°C (ISO 6330). Requires EU Digital Product Passport (DPP) QR code per batch.',
    quantity: 12000,
    unit: 'sets',
    targetPrice: 27.5,
    currency: 'EUR',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
    buyer: { id: 'demo-buyer-de', firstName: 'Hanseatic Hospitality Procurement (Germany)' },
    _count: { quotations: 4 },
  },
  {
    id: 'demo-rfq-it-terry',
    title: '550 GSM Luxury Jacquard Hotel Bath & Pool Towels (Zero-Twist Pile)',
    description:
      'Milan-based resort supply distributor requesting 25,000 pcs of 550 GSM Egyptian cotton terry towels (70×140 cm). Hydrophilicity < 3 sec (ASTM D4772), vat/reactive dyed in sand & navy shades (ISO 105-E03 chlorine fastness ≥ 4). Open to Consortium bidding across weaving and dyeing mills.',
    quantity: 25000,
    unit: 'pieces',
    targetPrice: 4.8,
    currency: 'EUR',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 4 * 86400_000).toISOString(),
    buyer: { id: 'demo-buyer-it', firstName: 'Lombardia Tessile Alberghiero (Italy)' },
    _count: { quotations: 3 },
  },
  {
    id: 'demo-rfq-tr-yarn',
    title: 'Container Load (24 Tons) Compact Combed Giza 94 Knitting Yarn Ne 30/1 (Waxed Cones)',
    description:
      'Bursa circular knitting mill sourcing 1x40ft HC container (24,000 kg) of Ne 30/1 compact combed Egyptian cotton yarn on 4°20 cones, waxed. Uster 5% quality level required (U% ≤ 8.5, thin -50% ≤ 2, thick +50% ≤ 15, neps +200% ≤ 20, tenacity ≥ 22 cN/tex). CIF Gemlik/Istanbul.',
    quantity: 24000,
    unit: 'kg',
    targetPrice: 4.1,
    currency: 'USD',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
    buyer: { id: 'demo-buyer-tr', firstName: 'Anatolia Knitwear & Yarn Corp (Turkey)' },
    _count: { quotations: 5 },
  },
  {
    id: 'demo-rfq-gcc-uniforms',
    title: 'Antimicrobial Medical Scrubs & Hospital Poplin Fabric (65/35 Poly-Giza Cotton, 165 GSM)',
    description:
      'Riyadh healthcare supply chain authority requesting 45,000 meters of vat-dyed surgical green and sky-blue poplin with fluid-repellent & AATCC 100 antimicrobial finish. Delivery under GAFTA Arab Certificate of Origin (0% tariff).',
    quantity: 45000,
    unit: 'meters',
    targetPrice: 3.25,
    currency: 'USD',
    status: 'OPEN',
    createdAt: new Date(Date.now() - 6 * 86400_000).toISOString(),
    buyer: { id: 'demo-buyer-sa', firstName: 'Al-Riyadh Medical Textiles Group (KSA)' },
    _count: { quotations: 2 },
  },
];

export const GET = route(async () => {
  try {
    const rows = await prisma.rFQ.findMany({
      where: { status: 'OPEN', OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
      include: {
        buyer: { select: { firstName: true, id: true } },
        _count: { select: { quotations: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    if (rows.length > 0) return rows;
  } catch {
    // Fall through to deterministic Mahalla RFQ exchange tenders
  }
  return FALLBACK_RFQS;
});

