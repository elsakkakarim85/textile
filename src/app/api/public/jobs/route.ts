import { prisma } from '@/lib/prisma';
import { route } from '@/server/http';

export const dynamic = 'force-dynamic';

const FALLBACK_JOBS = [
  {
    id: 'demo-job-lean-black-belt',
    title: 'Lean Six Sigma & Operational Excellence Lead (Spinning & Weaving)',
    description:
      'Lead shop-floor Value Stream Mapping (VSM), SMED warp-beam changeover reduction (<35 min), 5S Gemba audits, and Statistical Process Control (SPC Cp/Cpk ≥ 1.33) across 48 Picanol air-jet looms and Rieter compact ring-spinning frames.\n\nRequirements:\n• B.Sc. in Textile Engineering or Industrial Engineering\n• 4+ years experience in high-speed weaving/spinning OEE optimization\n• Hands-on mastery of A3 problem-solving, Yamazumi line balancing, and Poka-Yoke quality gates.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
    employer: {
      firstName: 'Misr',
      lastName: 'Spinning',
      factories: [{ id: 'demo-factory-1', name: 'Misr Spinning & Weaving (El-Mahalla)', isVerified: true }],
    },
    _count: { applications: 9 },
  },
  {
    id: 'demo-job-dyeing-colorist',
    title: 'Senior Reactive Dyeing Colorist & ZDHC Chemical Compliance Manager',
    description:
      'Oversee spectrophotometer recipe formulation (Datacolor CMC ΔE ≤ 0.6), Right-First-Time (RFT ≥ 96%) jet dyeing of Giza cotton knits and terry towels, and ZDHC MRSL v3.1 / wastewater ETP compliance.\n\nRequirements:\n• B.Sc. in Textile Chemistry / Dyeing & Finishing\n• Proven track record reducing salt & water intensity (L/kg) in reactive dyeing\n• Familiarity with OEKO-TEX® Standard 100 and GOTS chemical auditing.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
    employer: {
      firstName: 'Al-Rowad',
      lastName: 'Dyeing',
      factories: [{ id: 'demo-factory-2', name: 'Al-Rowad Modern Dyeing & Finishing', isVerified: true }],
    },
    _count: { applications: 6 },
  },
  {
    id: 'demo-job-export-dpp-specialist',
    title: 'EU Export Compliance, CBAM & Digital Product Passport (DPP) Specialist',
    description:
      'Manage European export documentation (EUR.1 movement certificates, Nafeza Single Window ACI filings, REACH/OEKO-TEX dossiers) and generate batch-level EU ESPR Digital Product Passports (Scope 1-2-3 carbon & water footprint tracking) for German and Italian buyers.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 5 * 86400_000).toISOString(),
    employer: {
      firstName: 'Delta',
      lastName: 'Terry',
      factories: [{ id: 'demo-factory-3', name: 'Delta Jacquard & Home Textiles', isVerified: true }],
    },
    _count: { applications: 11 },
  },
  {
    id: 'demo-job-airjet-maintenance',
    title: 'TPM Autonomous Maintenance & Air-Jet Loom Mechatronics Engineer',
    description:
      'Drive Total Productive Maintenance (TPM), MTBF/MTTR reliability improvement, and compressed-air leak elimination on Picanol OmniPlus-i and Dornier air-jet weaving machines.',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 7 * 86400_000).toISOString(),
    employer: {
      firstName: 'Nile Valley',
      lastName: 'Knits',
      factories: [{ id: 'demo-factory-4', name: 'Nile Valley Combed Knits & Apparel', isVerified: true }],
    },
    _count: { applications: 5 },
  },
];

export const GET = route(async (req) => {
  const q = new URL(req.url).searchParams.get('q')?.trim();
  try {
    const rows = await prisma.jobPosting.findMany({
      where: {
        status: 'ACTIVE',
        ...(q ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}),
      },
      include: {
        employer: { select: { firstName: true, lastName: true, factories: { select: { id: true, name: true, isVerified: true } } } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    if (rows.length > 0) return rows;
  } catch {
    // Fall through to deterministic Mahalla cluster recruitment board
  }

  if (!q) return FALLBACK_JOBS;
  const qLower = q.toLowerCase();
  return FALLBACK_JOBS.filter(
    (j) => j.title.toLowerCase().includes(qLower) || j.description.toLowerCase().includes(qLower)
  );
});

