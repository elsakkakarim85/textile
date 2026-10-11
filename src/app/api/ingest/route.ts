import { z } from 'zod';
import { requireAdmin } from '@/server/auth';
import { parseBody, route } from '@/server/http';
import { audit } from '@/server/events';
import { ingestDocument } from '@/server/knowledge';

export const maxDuration = 60;

const schema = z.object({
  text: z.string().trim().min(50).max(500_000),
  sourceName: z.string().trim().min(1).max(200).default('manual-upload'),
  language: z.enum(['ar', 'en']).optional(),
});

/** Admin-only: add a document to the AI knowledge base (was previously open to anyone). */
export const POST = route(async (req) => {
  const admin = await requireAdmin();
  const { text, sourceName, language } = await parseBody(req, schema);
  const result = await ingestDocument({ title: sourceName || 'manual-upload', text, source: 'upload', language: language as string | undefined });
  await audit(admin.id, 'KNOWLEDGE_INGEST', 'Document', result.documentId, { chunks: result.chunks });
  return { success: true, chunksProcessed: result.chunks, documentId: result.documentId };
});
