import 'server-only';
import { embed, embedMany } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { prisma } from '@/lib/prisma';
import { HttpError } from '@/server/http';

/**
 * Knowledge base (RAG) on Postgres + pgvector — replaces the hard-coded "PDF analysis" text
 * and the unused Pinecone index. Embeddings: Gemini, 768 dims (matches DocumentChunk.embedding).
 */
const EMBED_MODEL = process.env.AI_EMBED_MODEL?.trim() || 'gemini-embedding-001';
const DIMS = 768;

function embedder() {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!key) throw new HttpError(503, 'Embeddings are not configured (GOOGLE_GENERATIVE_AI_API_KEY)');
  return createGoogleGenerativeAI({ apiKey: key }).textEmbeddingModel(EMBED_MODEL);
}

const providerOptions = { google: { outputDimensionality: DIMS } };
const toVector = (v: number[]) => `[${v.join(',')}]`;

/** Paragraph-aware chunking with overlap (~1200 chars per chunk). */
export function chunkText(text: string, size = 1200, overlap = 150): string[] {
  const paragraphs = text.replace(/\r/g, '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const p of paragraphs) {
    if ((current + '\n\n' + p).length > size && current) {
      chunks.push(current);
      current = current.slice(-overlap) + '\n\n' + p;
    } else {
      current = current ? `${current}\n\n${p}` : p;
    }
    while (current.length > size * 1.5) {
      chunks.push(current.slice(0, size));
      current = current.slice(size - overlap);
    }
  }
  if (current.trim().length > 20) chunks.push(current);
  return chunks;
}

export async function ingestDocument(input: { title: string; text: string; source?: string; sourceRef?: string; language?: string }) {
  const chunks = chunkText(input.text);
  if (chunks.length === 0) throw new HttpError(400, 'Text too short to index');

  const model = embedder();
  const embeddings: number[][] = [];
  for (let i = 0; i < chunks.length; i += 50) {
    const { embeddings: batch } = await embedMany({ model, values: chunks.slice(i, i + 50), providerOptions });
    embeddings.push(...batch);
  }

  const doc = await prisma.document.create({
    data: { title: input.title, source: input.source, sourceRef: input.sourceRef, language: input.language },
  });

  for (let i = 0; i < chunks.length; i++) {
    await prisma.$executeRaw`
      INSERT INTO "DocumentChunk" ("id", "documentId", "position", "content", "embedding", "createdAt")
      VALUES (${`${doc.id}_${i}`}, ${doc.id}, ${i}, ${chunks[i]}, ${toVector(embeddings[i])}::vector, NOW())`;
  }
  return { documentId: doc.id, chunks: chunks.length };
}

export type KnowledgeHit = { content: string; title: string; score: number };

/** Cosine-similarity search. Returns [] (never throws) so chat keeps working if embeddings are down. */
export async function searchKnowledge(query: string, k = 5, minScore = 0.55): Promise<KnowledgeHit[]> {
  try {
    const { embedding } = await embed({ model: embedder(), value: query.slice(0, 2000), providerOptions });
    const rows = await prisma.$queryRaw<KnowledgeHit[]>`
      SELECT c."content", d."title", 1 - (c."embedding" <=> ${toVector(embedding)}::vector) AS score
      FROM "DocumentChunk" c JOIN "Document" d ON d."id" = c."documentId"
      WHERE c."embedding" IS NOT NULL
      ORDER BY c."embedding" <=> ${toVector(embedding)}::vector
      LIMIT ${k}`;
    return rows.filter((r) => Number(r.score) >= minScore);
  } catch (err) {
    console.error('[knowledge] search failed', err);
    return [];
  }
}
