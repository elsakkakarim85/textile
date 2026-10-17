import { z } from 'zod';
import { route, parseBody } from '@/server/http';
import { generate } from '@/server/ai';
import { synthesizeExportIntelligence } from '@/server/modernization/export-intelligence';

const GenerateExportIntelSchema = z.object({
  product: z.string().min(2).max(300),
  country: z.string().min(2).max(200),
});

export const POST = route(async (req) => {
  const body = await parseBody(req, GenerateExportIntelSchema);
  const report = synthesizeExportIntelligence({
    product: body.product,
    country: body.country,
  });

  // Optional live AI enrichment for bespoke executive market summary & custom country insights
  try {
    const prompt = `You are a Senior International Trade Economist at the ITC (International Trade Centre) and Egyptian Commercial Service (ECS) specializing in El-Mahalla El-Kubra textile exports.
Analyze the export of "${body.product}" (HS Code ${report.hsCode}) from Egypt to "${body.country}".
Respond ONLY with valid JSON (no markdown fences) matching this structure:
{
  "executiveSummaryEn": "2-3 authoritative sentences citing tariff advantages, import demand, and positioning vs Turkey/India/China",
  "executiveSummaryAr": "٢-٣ جمل احترافية باللغة العربية توضح المزايا الجمركية وحجم الطلب وموقف المحلة التنافسي"
}`;

    const aiRes = await generate({
      system:
        'Return strictly valid JSON only without markdown code fences. Never include explanatory text outside JSON.',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    if (aiRes.text && !aiRes.model.includes('mahalla-industrial-consultant')) {
      const cleaned = aiRes.text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed.executiveSummaryEn === 'string' && parsed.executiveSummaryEn.length > 25) {
        report.marketStudy.executiveSummaryEn = parsed.executiveSummaryEn;
      }
      if (parsed && typeof parsed.executiveSummaryAr === 'string' && parsed.executiveSummaryAr.length > 25) {
        report.marketStudy.executiveSummaryAr = parsed.executiveSummaryAr;
      }
    }
  } catch {
    // Deterministic ITC/UN Comtrade/TARIC report is already complete
  }

  return {
    report,
    aiGenerated: true,
    generatedAt: new Date().toISOString(),
  };
});
