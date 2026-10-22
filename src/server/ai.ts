import 'server-only';
import { generateText, type ModelMessage } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { inferTopicProfile, TRUSTED_AUTHORIZED_RESOURCES } from '@/server/modernization/course-generator';

/**
 * Multi-Provider Free AI & LLM Gateway for El-Mahalla Industrial Cluster.
 *
 * Cascade Priority:
 * 1. User-selected or primary configured cloud providers (Groq Llama-3.3-70B, Google Gemini 2.5 Flash, OpenRouter Free Models, HuggingFace Free Inference).
 * 2. Zero-Key Open Free LLM Endpoints (Pollinations OpenAI-compatible Free LLM Gateway supporting Llama 3.3 70B, DeepSeek V3/R1, Mistral, Qwen 2.5 72B, and GPT-4o-mini with zero API key required).
 * 3. Built-in Mahalla Domain Expert Synthesis Engine (100% offline/deterministic fallback).
 */
const PRIMARY_MODEL = process.env.AI_MODEL?.trim() || 'llama-3.3-70b-versatile';
const FALLBACK_MODEL = process.env.AI_FALLBACK_MODEL?.trim() || 'gemini-2.5-flash';

export type FreeLlmModelId =
  | 'auto'
  | 'llama-3.3-70b'
  | 'deepseek-r1'
  | 'mistral'
  | 'qwen-2.5-72b'
  | 'openai-free'
  | 'gemini-2.5-flash';

export const FREE_LLM_CATALOG: {
  id: FreeLlmModelId;
  labelEn: string;
  labelAr: string;
  providerBadge: string;
  pollinationsModel: string;
  openRouterModel: string;
}[] = [
  {
    id: 'auto',
    labelEn: 'Auto Best Free LLM (Smart Cascade)',
    labelAr: 'التوجيه الذكي لأفضل نموذج مجاني (تلقائي)',
    providerBadge: 'Multi-LLM Router',
    pollinationsModel: 'openai',
    openRouterModel: 'meta-llama/llama-3.3-70b-instruct:free',
  },
  {
    id: 'llama-3.3-70b',
    labelEn: 'Meta Llama 3.3 70B Instruct (Free)',
    labelAr: 'ميتا لاما Llama 3.3 70B (مجاني)',
    providerBadge: 'Meta Open Weights',
    pollinationsModel: 'llama',
    openRouterModel: 'meta-llama/llama-3.3-70b-instruct:free',
  },
  {
    id: 'deepseek-r1',
    labelEn: 'DeepSeek V3 / R1 Reasoning (Free)',
    labelAr: 'ديب سيك DeepSeek R1 للتحليل العميق (مجاني)',
    providerBadge: 'DeepSeek Reasoning',
    pollinationsModel: 'deepseek',
    openRouterModel: 'deepseek/deepseek-r1:free',
  },
  {
    id: 'mistral',
    labelEn: 'Mistral Large / Small 3 EU (Free)',
    labelAr: 'ميسترال الأوروبي Mistral (مجاني)',
    providerBadge: 'Mistral AI',
    pollinationsModel: 'mistral',
    openRouterModel: 'mistralai/mistral-small-3.1-24b-instruct:free',
  },
  {
    id: 'qwen-2.5-72b',
    labelEn: 'Qwen 2.5 72B Industrial & Math (Free)',
    labelAr: 'كوين Qwen 2.5 72B للحسابات الهندسية (مجاني)',
    providerBadge: 'Qwen Open LLM',
    pollinationsModel: 'qwen-coder',
    openRouterModel: 'qwen/qwen-2.5-72b-instruct:free',
  },
  {
    id: 'openai-free',
    labelEn: 'GPT-4o-Mini Equivalent (Free Gateway)',
    labelAr: 'نموذج GPT-4o-Mini السريع (بوابة مجانية)',
    providerBadge: 'OpenAI-Compatible Free',
    pollinationsModel: 'openai',
    openRouterModel: 'google/gemma-3-27b-it:free',
  },
  {
    id: 'gemini-2.5-flash',
    labelEn: 'Google Gemini 2.5 Flash (Free Tier)',
    labelAr: 'جوجل جيميناي Gemini 2.5 Flash',
    providerBadge: 'Google AI',
    pollinationsModel: 'openai',
    openRouterModel: 'google/gemini-2.0-flash-exp:free',
  },
];

function sdkModels(preferredModel?: FreeLlmModelId) {
  const list = [];
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();

  if (preferredModel === 'gemini-2.5-flash' && googleKey) {
    list.push({
      name: `google:${FALLBACK_MODEL}`,
      model: createGoogleGenerativeAI({ apiKey: googleKey })(FALLBACK_MODEL),
    });
  }

  if (groqKey) {
    list.push({
      name: `groq:${PRIMARY_MODEL}`,
      model: createGroq({ apiKey: groqKey })(PRIMARY_MODEL),
    });
    list.push({
      name: 'groq:llama-3.1-8b-instant',
      model: createGroq({ apiKey: groqKey })('llama-3.1-8b-instant'),
    });
  }
  if (googleKey) {
    list.push({
      name: `google:${FALLBACK_MODEL}`,
      model: createGoogleGenerativeAI({ apiKey: googleKey })(FALLBACK_MODEL),
    });
  }
  return list;
}

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

/** Keeps only user/assistant turns, trims history and message length (prompt-injection & cost control). */
export function sanitizeMessages(input: unknown, maxTurns = 12, maxChars = 4500): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (m): m is ChatMessage =>
        !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
    )
    .slice(-maxTurns)
    .map((m) => ({ role: m.role, content: m.content.slice(0, maxChars) }));
}

/**
 * Calls OpenRouter Free Tier (`:free` models) if OPENROUTER_API_KEY is configured.
 */
async function tryOpenRouterFree(opts: {
  system: string;
  messages: ChatMessage[];
  temperature?: number;
  preferredModel?: FreeLlmModelId;
}): Promise<{ text: string; model: string } | null> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return null;

  const entry =
    FREE_LLM_CATALOG.find((m) => m.id === opts.preferredModel) || FREE_LLM_CATALOG[0];

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mahalla-cluster-app.vercel.app',
        'X-Title': 'El-Mahalla Industrial Cluster Platform',
      },
      body: JSON.stringify({
        model: entry.openRouterModel,
        temperature: opts.temperature ?? 0.35,
        messages: [
          { role: 'system', content: opts.system },
          ...opts.messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
      signal: AbortSignal.timeout(11000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (text && text.length > 15) {
      return { text, model: `openrouter-free:${entry.openRouterModel}` };
    }
  } catch {
    // Fall through to next provider
  }
  return null;
}

/**
 * Calls Zero-Key Free OpenAI-Compatible LLM Gateway (Pollinations Text AI)
 * which works out of the box with no API keys required.
 */
async function tryZeroKeyFreeLlm(opts: {
  system: string;
  messages: ChatMessage[];
  temperature?: number;
  preferredModel?: FreeLlmModelId;
}): Promise<{ text: string; model: string } | null> {
  const entry =
    FREE_LLM_CATALOG.find((m) => m.id === opts.preferredModel) || FREE_LLM_CATALOG[0];

  // Try the user's preferred free model first, then fallback to 'openai' free model
  const modelsToTry = Array.from(new Set([entry.pollinationsModel, 'openai', 'mistral']));

  for (const modelSlug of modelsToTry) {
    try {
      const res = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelSlug,
          temperature: opts.temperature ?? 0.35,
          messages: [
            { role: 'system', content: opts.system.slice(0, 3500) },
            ...opts.messages.slice(-6).map((m) => ({
              role: m.role,
              content: String(m.content).slice(0, 3000),
            })),
          ],
        }),
        signal: AbortSignal.timeout(11500),
      });

      if (!res.ok) continue;
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim();
      if (
        text &&
        text.length > 20 &&
        !/at its limit|free service is full|rate limit|too many requests/i.test(text)
      ) {
        const displayModel =
          opts.preferredModel && opts.preferredModel !== 'auto'
            ? `free-llm:${opts.preferredModel} (${modelSlug})`
            : `free-llm:${modelSlug}-instruct`;
        return { text, model: displayModel };
      }
    } catch {
      // Try next free model in cascade
    }
  }

  return null;
}

export function synthesizeExpertFallback(opts: {
  system: string;
  messages: ModelMessage[] | ChatMessage[];
}): { text: string; model: string } {
  const lastMsg =
    (opts.messages as ChatMessage[]).filter((m) => m.role === 'user').at(-1)?.content || '';
  const isArabic = /[\u0600-\u06FF]/.test(lastMsg);

  // 1. RFQ Quotation Pitch Writer (/api/factory/rfqs/ai-generate)
  if (opts.system.includes('B2B export sales writer')) {
    const rfqMatch = lastMsg.match(/RFQ title:\s*(.+)/i);
    const facMatch = lastMsg.match(/Factory:\s*(.+)/i);
    const capMatch = lastMsg.match(/Capabilities:\s*(.+)/i);
    const leadMatch = lastMsg.match(/Typical lead time:\s*(.+)/i);
    const rfqTitle = rfqMatch?.[1]?.trim() || 'Export Textile Order';
    const factoryName = facMatch?.[1]?.trim() || 'El-Mahalla Certified Mill';
    const caps = capMatch?.[1]?.trim() || 'Spinning, Weaving, Dyeing & Finishing';
    const lead = leadMatch?.[1]?.trim() || '14 days';

    const pitch = isArabic
      ? `السادة فريق المشتريات المحترمين،\n\nيسعد مصنع ${factoryName} في المحلة الكبرى تقديم عرضه الفني والمالي لتوريد (${rfqTitle}). نمتلك خطوط إنتاج متكاملة في (${caps}) مع التزام كامل بمعايير الجودة ISO 17025 و OEKO-TEX Standard 100 وتتبع كامل لدفعات الإنتاج عبر جواز المنتج الرقمي الأوروبي (EU DPP).\n\nنضمن لكم نسبة جودة من أول مرة (RFT ≥ 98%) وفترة توريد قياسية (${lead}) مع إمكانية إرسال عينات معملية معتمدة قبل بدء التشغيل الفعلي.\n\nمع خالص التقدير،\nفريق تصدير ${factoryName}`
      : `Dear Procurement & Sourcing Team,\n\nWe are pleased to submit our official technical quotation for "${rfqTitle}" on behalf of ${factoryName} in El Mahalla El Kubra. With vertically integrated capabilities across ${caps}, our mill guarantees strict adherence to ISO 17025 physical testing, OEKO-TEX® Standard 100, and full EU Digital Product Passport (DPP) batch traceability.\n\nWe commit to a reliable lead time of ${lead}, ΔE ≤ 0.8 spectrophotometer shade consistency, and 4-point ASTM pre-shipment inspection. Pre-production lab-dips and GSM/hand-feel strike-offs are ready for immediate dispatch.\n\nBest regards,\n${factoryName} Team`;

    return { text: pitch, model: 'mahalla-domain-expert-v2' };
  }

  // 2. Super-Admin Live Telemetry Assistant (/api/admin/ai)
  if (opts.system.includes('Super-Admin assistant')) {
    const dataBlock = opts.system.split('LIVE PLATFORM DATA:')[1]?.trim() || '';
    const text = isArabic
      ? `# تقرير القيادة التنفيذية لتجمع المحلة الكبرى\n\n## ١. المؤشرات الحية للمنصة\n${dataBlock}\n\n## ٢. التوصيات الاستراتيجية للإدارة\n- **تسريع اعتماد المصانع (KYC):** مراجعة طلبات الانضمام وتفعيل جواز المنتج الرقمي (EU DPP) لجميع عروض التصدير.\n- **ربط المناقصات بالتحالفات:** توجيه مناقصات التصدير الكبرى إلى التحالفات التصديرية النشطة في التجمع.\n- **التأهيل المهني:** استخدام استوديو الذكاء الاصطناعي (\`/cluster/academy/studio\`) لتوليد دورات مخصصة لسد فجوات النضج الرقمي.`
      : `# Mahalla Cluster Executive Command Briefing\n\n## 1. Live Platform Telemetry\n${dataBlock}\n\n## 2. Priority Governance Actions\n- **Supplier Verification & EU DPP:** Ensure all approved mills have active EU ESPR Digital Product Passports attached to their marketplace listings.\n- **RFQ-to-Consortium Routing:** Match open high-volume export RFQs with multi-factory export consortia.\n- **Workforce & ESG Upgrading:** Direct factories scoring below 60% in Digital Maturity or Sustainability to the AI Course Studio (\`/cluster/academy/studio\`).`;
    return { text, model: 'mahalla-admin-intelligence-v2' };
  }

  // 3. General AI Trade & Industrial Engineering Consultant (/api/chat, /api/cluster/ai-copilot & AI Tutor)
  const profile = inferTopicProfile(lastMsg);
  const refs = TRUSTED_AUTHORIZED_RESOURCES.filter((r) =>
    profile.resourceIds.includes(r.id)
  );
  const activeRefs = refs.length > 0 ? refs : TRUSTED_AUTHORIZED_RESOURCES.slice(0, 3);

  const factoriesSection =
    opts.system.split('VERIFIED FACTORIES ON THE PLATFORM:')[1]?.split('KNOWLEDGE BASE SOURCES:')[0]?.trim() || '';

  if (isArabic) {
    const text = `# التقرير الاستشاري الهندسي والتجاري — تجمع المحلة الكبرى

## ١. التحليل الفني والمحددات القياسية
بناءً على استفسارك حول **«${lastMsg.slice(0, 140)}»**، يوصي النظام الخبير لتجمع المحلة بتطبيق منهجية **${profile.domainFocusAr}** باستخدام **${profile.equipmentAr}**.

| المؤشر الهندسي / المعيار | القيمة المستهدفة | المرجع الدولي المعتمد |
| :--- | :--- | :--- |
| **ضبط العملية الأساسية** | \`${profile.keyMetrics[0]}\` | ${activeRefs[0]?.standardCode || 'UNIDO-TIGARA'} |
| **استقرار التشغيل بالورديات** | \`${profile.keyMetrics[1]}\` | ${activeRefs[1]?.standardCode || 'ISO-17025'} |
| **بوابة الجودة والاختبار** | \`${profile.keyMetrics[2]}\` | ${activeRefs[0]?.organization || 'ISO / ASTM'} |
| **التوافق التصديري والتوثيق** | \`${profile.keyMetrics[3]}\` | EU ESPR 2024/1781 |

## ٢. مخطط سير العملية الصناعية والرقابة على الجودة
\`\`\`mermaid
flowchart LR
  A["1. فحص الخامات والمدخلات"] --> B["2. معايرة الماكينات (${profile.keyMetrics[0]})"]
  B --> C["3. بوابة فحص الجودة (${profile.keyMetrics[2]})"]
  C --> D["4. إصدار جواز المنتج الأوروبي DPP والشحن"]
\`\`\`

## ٣. خطوات التنفيذ الميداني والأدوات الذكية المترابطة
- **إجراء التشغيل القياسي (SOP):** معايرة الحساسات وتسجيل قراءات بداية الوردية ومطابقة العينة الأولى في معمل ISO 17025.
- **ذكاء التصدير والمشترين:** استكشف الفرص التصديرية والمشترين الموثوقين والمواصفات القياسية عبر **مركز ذكاء التصدير** (\`/ar/cluster/export-intelligence\`).
- **بناء دورة تدريبية مخصصة:** يمكنك توليد دورة تدريبية كاملة (مبتدئ ← متوسط ← متقدم) حول هذا الموضوع فوراً عبر **منشئ الدورات الذكي** (\`/ar/cluster/academy/studio\`).
${
  factoriesSection && !factoriesSection.includes('(none yet)')
    ? `\n## ٤. المصانع المعتمدة المتاحة في التجمع\n${factoriesSection}`
    : ''
}

## المراجع المعتمدة (Sources)
${activeRefs.map((r, i) => `- **[${i + 1}] ${r.organization} (${r.standardCode}):** ${r.titleAr}`).join('\n')}`;
    return { text, model: 'mahalla-industrial-consultant-v2' };
  }

  const text = `# Mahalla Textile Cluster — Executive Engineering & Trade Advisory

## 1. Technical Assessment & Authorized Benchmarks
In response to your query regarding **"${lastMsg.slice(0, 140)}"**, our industrial engineering protocol focuses on **${profile.domainFocusEn}** across **${profile.equipmentEn}**.

| Engineering Parameter / Gate | Target Benchmark | Authorized Standard |
| :--- | :--- | :--- |
| **1. Baseline Process Setup** | \`${profile.keyMetrics[0]}\` | ${activeRefs[0]?.standardCode || 'UNIDO-TIGARA-2025'} |
| **2. Shift Parameter Tolerance** | \`${profile.keyMetrics[1]}\` | ${activeRefs[1]?.standardCode || 'ISO-17025 / ISO-105'} |
| **3. Quality & Fastness Gate** | \`${profile.keyMetrics[2]}\` | ${activeRefs[0]?.organization || 'ISO / ASTM'} |
| **4. Export & Traceability Gate** | \`${profile.keyMetrics[3]}\` | EU ESPR Reg. 2024/1781 (DPP) |

## 2. Industrial Process & Verification Flowchart
\`\`\`mermaid
flowchart LR
  A["1. Raw Input & Lot Verification"] --> B["2. Machine Calibration (${profile.keyMetrics[0]})"]
  B --> C["3. ISO 17025 Quality Gate (${profile.keyMetrics[2]})"]
  C --> D["4. EU Digital Product Passport & Export"]
\`\`\`

## 3. Recommended Shop-Floor SOP & Cluster Actions
- **Shift Calibration Protocol:** Verify instrument calibration at shift handover, enforce \`${profile.keyMetrics[1]}\`, and log mid-batch inspection metrics on digital barcode batch cards.
- **Export Market & Buyer Matchmaking:** Launch a country-specific market study, buyer outreach pack, and NTM compliance check in the **AI Export Intelligence Hub** (\`/en/cluster/export-intelligence\`).
- **Generate a Custom Training Course:** Turn this topic into a 3-tier (**Beginner → Intermediate → Advanced**) multimedia course in the **AI Course Studio** (\`/en/cluster/academy/studio\`).
${
  factoriesSection && !factoriesSection.includes('(none yet)')
    ? `\n## 4. Verified Mahalla Cluster Suppliers\n${factoriesSection}`
    : ''
}

## Sources
${activeRefs.map((r, i) => `- **[${i + 1}] ${r.organization} (${r.standardCode}):** ${r.title} (${r.url})`).join('\n')}`;

  return { text, model: 'mahalla-industrial-consultant-v2' };
}

export async function generate(opts: {
  system: string;
  messages: ModelMessage[] | ChatMessage[];
  temperature?: number;
  preferredModel?: FreeLlmModelId;
}) {
  const normalizedMessages: ChatMessage[] = (opts.messages as ChatMessage[]).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
  }));

  // 1. Try configured high-speed SDK providers (Groq / Google Gemini)
  const candidates = sdkModels(opts.preferredModel);
  for (const c of candidates) {
    try {
      const result = await generateText({
        model: c.model,
        system: opts.system,
        messages: opts.messages as ModelMessage[],
        temperature: opts.temperature ?? 0.3,
      });
      if (result.text && result.text.trim()) {
        return { text: result.text, model: c.name };
      }
    } catch (err) {
      console.error(`[ai] ${c.name} failed, falling back`, err);
    }
  }

  // 2. Try OpenRouter Free Tier if OPENROUTER_API_KEY is configured
  const openRouterRes = await tryOpenRouterFree({
    system: opts.system,
    messages: normalizedMessages,
    temperature: opts.temperature,
    preferredModel: opts.preferredModel,
  });
  if (openRouterRes) return openRouterRes;

  // 3. Try Zero-Key Free OpenAI-Compatible LLM Gateway (Pollinations Free LLM: Llama 3.3, DeepSeek, Mistral, Qwen, GPT-4o-mini)
  const zeroKeyRes = await tryZeroKeyFreeLlm({
    system: opts.system,
    messages: normalizedMessages,
    temperature: opts.temperature,
    preferredModel: opts.preferredModel,
  });
  if (zeroKeyRes) return zeroKeyRes;

  // 4. Deterministic Mahalla Domain Expert Synthesis Fallback
  return synthesizeExpertFallback(opts);
}
