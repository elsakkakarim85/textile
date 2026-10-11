import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { HttpError, route } from '@/server/http';
import { generate, sanitizeMessages } from '@/server/ai';
import { searchKnowledge } from '@/server/knowledge';
import { clientIp, rateLimit } from '@/server/rate-limit';

export const maxDuration = 30;

/** Core export-quality reference (curated, static). Live documents come from the pgvector knowledge base. */
const EXPORT_STANDARDS = `
- Colour fastness: ISO 105 series (washing C06, rubbing X12, light B02). Azo dyes restricted under EU REACH Annex XVII.
- Tensile strength (woven): ASTM D5034 grab test; buyer-specified minimum, commonly ≥250 N.
- Dimensional stability: AATCC 135 / ISO 6330; typical tolerance ≤3–5% after home laundering.
- GSM and construction: within ±5% of approved sample.
- Chemical safety: OEKO-TEX Standard 100 (formaldehyde, heavy metals, phthalates); ZDHC MRSL for wet processing.
- Organic / recycled claims: GOTS, OCS, GRS, BCI.
- Labelling (EU Reg. 1007/2011): fibre composition, care symbols (ISO 3758), country of origin.
- Packing: moisture-protective polybags, silica gel for sea freight, carton marks per buyer manual.`;

export const POST = route(async (req) => {
  const { userId } = await auth();
  // Signed-in: 30 req / 10 min. Anonymous: 8 req / 10 min per IP.
  rateLimit(userId ? `chat:u:${userId}` : `chat:ip:${clientIp(req)}`, userId ? 30 : 8, 10 * 60_000);

  const setting = await prisma.systemSetting.findUnique({ where: { key: 'ai_enabled' } }).catch(() => null);
  if (setting?.value === 'false') throw new HttpError(503, 'The AI consultant is temporarily disabled.');

  const body = await req.json().catch(() => ({}));
  const messages = sanitizeMessages(body?.messages);
  const question = messages.filter((m) => m.role === 'user').at(-1)?.content;
  if (!question) throw new HttpError(400, 'Message is required');

  const [knowledge, factories] = await Promise.all([
    searchKnowledge(question, 5),
    prisma.factory.findMany({
      where: { isVerified: true, status: 'APPROVED', deletedAt: null },
      select: {
        id: true,
        name: true,
        address: true,
        capabilities: true,
        owner: { select: { listings: { where: { status: 'ACTIVE', deletedAt: null }, select: { title: true, price: true, currency: true, unit: true }, take: 5 } } },
      },
      take: 10,
    }),
  ]);

  const marketplace = factories
    .map((f) => {
      const products = f.owner.listings.map((l) => `  - ${l.title}${l.price ? ` (${l.price} ${l.currency}${l.unit ? '/' + l.unit : ''})` : ''}`).join('\n');
      return `• ${f.name} — ${f.address}${f.capabilities.length ? ` — ${f.capabilities.join(', ')}` : ''} — /factories/${f.id}\n${products}`;
    })
    .join('\n');

  const sources = knowledge.map((k, i) => `[${i + 1}] (${k.title})\n${k.content}`).join('\n\n');

  const system = `You are the AI trade consultant of the El Mahalla Textile Cluster (Egypt), serving factory owners, buyers and workers.
Reply in the user's language (Arabic → professional Modern Standard/Egyptian Arabic; English → English).

FORMAT (strict):
- Start with a "# " title, then short sections with "## " headings.
- Use Markdown tables for standards, measurements, prices or comparisons.
- Use bullet points; no long unbroken paragraphs. Never repeat sentences.
- When you use a knowledge source, cite it as [1], [2]… and end with a "## Sources" list.

ACCURACY:
- Base answers on the context below. If the context does not contain the answer, say so clearly and give general guidance marked as such.
- Never invent factories, prices, certifications or regulations.

EXPORT STANDARDS REFERENCE:${EXPORT_STANDARDS}

VERIFIED FACTORIES ON THE PLATFORM:
${marketplace || '(none yet)'}

KNOWLEDGE BASE SOURCES:
${sources || '(no matching documents)'}`;

  const { text, model } = await generate({ system, messages, temperature: 0.3 });
  return { text, model, sources: knowledge.map((k) => k.title) };
});
