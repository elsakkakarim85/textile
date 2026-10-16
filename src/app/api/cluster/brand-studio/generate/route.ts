import { z } from 'zod';
import { route, parseBody } from '@/server/http';
import { generate } from '@/server/ai';
import { synthesizeExpertBrandKit } from '@/server/modernization/brand-generator';

const GenerateSchema = z.object({
  topic: z.string().min(2).max(400),
  brandName: z.string().max(120).optional(),
  targetMarket: z.string().max(240).optional(),
  productCategory: z.string().max(160).optional(),
  tone: z
    .enum(['LUXURY_HERITAGE', 'ECO_INNOVATION', 'INDUSTRIAL_B2B', 'MODERN_FASHION'])
    .optional(),
});

export const POST = route(async (req) => {
  const body = await parseBody(req, GenerateSchema);
  const baseKit = synthesizeExpertBrandKit(body);

  // Optional live AI enrichment for bespoke brand names, taglines, and brand story
  try {
    const prompt = `You are a Chief Brand Officer and Global Textile Marketing Strategist for El-Mahalla El-Kubra Industrial Cluster.
Generate bespoke bilingual (English and Arabic) brand copy for:
- Product / Niche Topic: "${body.topic}"
- Preferred Brand Name: "${body.brandName || baseKit.brandNameEn}"
- Target Market: "${body.targetMarket || 'EU, UK & GCC Premium Buyers'}"
- Brand Tone: "${body.tone || 'LUXURY_HERITAGE'}"

Respond ONLY with valid JSON matching this exact structure (no markdown fences):
{
  "brandNameEn": "string",
  "brandNameAr": "string",
  "taglineEn": "string",
  "taglineAr": "string",
  "positioningEn": "string",
  "positioningAr": "string",
  "storyEn": "string",
  "storyAr": "string"
}`;

    const aiRes = await generate({
      system:
        'Return strictly valid JSON only without markdown code fences. Never include explanatory text outside JSON.',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    if (aiRes.text && !aiRes.model.includes('mahalla-industrial-consultant')) {
      const cleaned = aiRes.text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed.taglineEn === 'string' && parsed.taglineEn.length > 8) {
        if (!body.brandName && parsed.brandNameEn) {
          baseKit.brandNameEn = parsed.brandNameEn;
        }
        if (!body.brandName && parsed.brandNameAr) {
          baseKit.brandNameAr = parsed.brandNameAr;
        }
        baseKit.taglineEn = parsed.taglineEn || baseKit.taglineEn;
        baseKit.taglineAr = parsed.taglineAr || baseKit.taglineAr;
        baseKit.positioningEn = parsed.positioningEn || baseKit.positioningEn;
        baseKit.positioningAr = parsed.positioningAr || baseKit.positioningAr;
        baseKit.storyEn = parsed.storyEn || baseKit.storyEn;
        baseKit.storyAr = parsed.storyAr || baseKit.storyAr;
      }
    }
  } catch {
    // Base kit already contains full deterministic expert content
  }

  return {
    kit: baseKit,
    aiGenerated: true,
    generatedAt: new Date().toISOString(),
  };
});
