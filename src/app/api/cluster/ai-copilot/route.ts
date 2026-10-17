import { z } from 'zod';
import { route, parseBody } from '@/server/http';
import { generate, type FreeLlmModelId } from '@/server/ai';
import {
  MODULE_AI_CONFIGS,
  synthesizeModuleExpertDeliverable,
  type ClusterModuleId,
} from '@/server/modernization/module-ai-prompts';

const CopilotRequestSchema = z.object({
  moduleId: z.string().min(2).max(60),
  prompt: z.string().min(2).max(4000),
  contextSummary: z.string().max(3000).optional(),
  preferredModel: z
    .enum([
      'auto',
      'llama-3.3-70b',
      'deepseek-r1',
      'mistral',
      'qwen-2.5-72b',
      'openai-free',
      'gemini-2.5-flash',
    ])
    .optional(),
  locale: z.string().max(10).optional(),
});

export const POST = route(async (req) => {
  const startMs = Date.now();
  const body = await parseBody(req, CopilotRequestSchema);
  const modKey = (body.moduleId in MODULE_AI_CONFIGS
    ? body.moduleId
    : 'observatory') as ClusterModuleId;
  const cfg = MODULE_AI_CONFIGS[modKey];
  const locale = body.locale || 'en';
  const isAr = locale === 'ar';

  const systemPrompt = `${cfg.systemPrompt}
Context Module: ${cfg.titleEn} (${cfg.titleAr})
${body.contextSummary ? `Live Page Context: ${body.contextSummary}\n` : ''}
Respond in ${
    isAr ? 'authoritative professional Arabic (العربية الفصحى الصناعية والتجارية)' : 'authoritative executive English'
  } using well-structured Markdown headings, GFM tables where appropriate, concrete numerical benchmarks, and ready-to-execute templates.`;

  const res = await generate({
    system: systemPrompt,
    messages: [{ role: 'user', content: body.prompt }],
    temperature: 0.35,
    preferredModel: (body.preferredModel || 'auto') as FreeLlmModelId,
  });

  const usedFallback = res.model.includes('mahalla-industrial-consultant');
  const replyText = usedFallback
    ? synthesizeModuleExpertDeliverable(modKey, body.prompt, locale)
    : res.text;

  return {
    reply: replyText,
    modelUsed: res.model,
    moduleId: modKey,
    latencyMs: Date.now() - startMs,
    generatedAt: new Date().toISOString(),
  };
});
