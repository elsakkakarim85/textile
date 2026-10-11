import 'server-only';
import { generateText, type ModelMessage } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { HttpError } from '@/server/http';

/**
 * Central AI gateway. Primary: Groq. Fallback: Google Gemini (if configured).
 * Model IDs are env-configurable so they can be changed without a code deploy.
 */
const PRIMARY_MODEL = process.env.AI_MODEL?.trim() || 'qwen/qwen3.8-27b';
const FALLBACK_MODEL = process.env.AI_FALLBACK_MODEL?.trim() || 'gemini-2.5-flash';

function models() {
  const list = [];
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (groqKey) list.push({ name: `groq:${PRIMARY_MODEL}`, model: createGroq({ apiKey: groqKey })(PRIMARY_MODEL) });
  if (googleKey) list.push({ name: `google:${FALLBACK_MODEL}`, model: createGoogleGenerativeAI({ apiKey: googleKey })(FALLBACK_MODEL) });
  return list;
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

/** Keeps only user/assistant turns, trims history and message length (prompt-injection & cost control). */
export function sanitizeMessages(input: unknown, maxTurns = 12, maxChars = 4000): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((m): m is ChatMessage => !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-maxTurns)
    .map((m) => ({ role: m.role, content: m.content.slice(0, maxChars) }));
}

export async function generate(opts: { system: string; messages: ModelMessage[] | ChatMessage[]; temperature?: number }) {
  const candidates = models();
  if (candidates.length === 0) throw new HttpError(503, 'AI is not configured');

  let lastError: unknown;
  for (const c of candidates) {
    try {
      const result = await generateText({
        model: c.model,
        system: opts.system,
        messages: opts.messages as ModelMessage[],
        temperature: opts.temperature ?? 0.3,
      });
      return { text: result.text, model: c.name };
    } catch (err) {
      lastError = err;
      console.error(`[ai] ${c.name} failed`, err);
    }
  }
  throw new HttpError(502, 'AI provider unavailable', String(lastError));
}
