import { z } from 'zod';
import { route, parseBody } from '@/server/http';
import { generate, type FreeLlmModelId } from '@/server/ai';
import { extractTextileTelemetry } from '@/lib/sovereign-textile-lm';

export const maxDuration = 30;

export const MPT_VOICE_PRESETS = [
  {
    id: 'en-US-ChristopherNeural-Male',
    labelEn: 'en-US Christopher Neural (Male • Executive B2B)',
    labelAr: 'إنجليزي أمريكي - كريستوفر (صوت رجالي رسمي)',
    lang: 'en-US',
  },
  {
    id: 'en-US-JennyNeural-Female',
    labelEn: 'en-US Jenny Neural (Female • Commercial Broadcast)',
    labelAr: 'إنجليزي أمريكي - جيني (صوت نسائي إعلاني)',
    lang: 'en-US',
  },
  {
    id: 'en-GB-RyanNeural-Male',
    labelEn: 'en-GB Ryan Neural (Male • UK/European Trade)',
    labelAr: 'إنجليزي بريطاني - ريان (للتصدير الأوروبي)',
    lang: 'en-GB',
  },
  {
    id: 'ar-EG-ShakirNeural-Male',
    labelEn: 'ar-EG Shakir Neural (Male • Egyptian Industrial)',
    labelAr: 'عربي مصري - شاكر (صوت وثائقي صناعي)',
    lang: 'ar-EG',
  },
  {
    id: 'ar-EG-SalmaNeural-Female',
    labelEn: 'ar-EG Salma Neural (Female • Egyptian Broadcast)',
    labelAr: 'عربي مصري - سلمى (صوت إعلاني احترافي)',
    lang: 'ar-EG',
  },
  {
    id: 'de-DE-ConradNeural-Male',
    labelEn: 'de-DE Conrad Neural (Male • Germany / Heimtextil)',
    labelAr: 'ألماني - كونراد (لمعرض هايم تكستيل فرانكفورت)',
    lang: 'de-DE',
  },
  {
    id: 'fr-FR-HenriNeural-Male',
    labelEn: 'fr-FR Henri Neural (Male • France / Première Vision)',
    labelAr: 'فرنسي - هنري (لمعرض بريميير فيجن باريس)',
    lang: 'fr-FR',
  },
  {
    id: 'it-IT-DiegoNeural-Male',
    labelEn: 'it-IT Diego Neural (Male • Milan Apparel & Sateen)',
    labelAr: 'إيطالي - دييغو (لسوق ميلانو للأقمشة الفاخرة)',
    lang: 'it-IT',
  },
] as const;

export const MPT_TRANSITION_MODES = [
  { id: 'FadeIn', labelEn: 'FadeIn (Smooth Cinema Fade)', labelAr: 'تلاشي سينمائي (FadeIn)' },
  { id: 'SlideIn', labelEn: 'SlideIn (Dynamic Whip Slide)', labelAr: 'انزلاق ديناميكي (SlideIn)' },
  { id: 'Shuffle', labelEn: 'Shuffle (Multi-Transition Mix)', labelAr: 'تبديل ذكي متنوع (Shuffle)' },
  { id: 'FadeOut', labelEn: 'FadeOut (Dissolve Out)', labelAr: 'تلاشي تدريجي (FadeOut)' },
  { id: 'SlideOut', labelEn: 'SlideOut (Lateral Push)', labelAr: 'إزاحة جانبية (SlideOut)' },
  { id: 'None', labelEn: 'None (Hard Cut)', labelAr: 'قطع مباشر (None)' },
] as const;

const MoneyPrinterRequestSchema = z.object({
  action: z
    .enum(['generate-script', 'generate-terms', 'create-video'])
    .default('create-video'),
  companyName: z
    .string()
    .min(2)
    .max(160)
    .default('Misr Heritage Spinning & Weaving (El-Mahalla)'),
  companySpecialty: z
    .string()
    .max(400)
    .default('100% Egyptian Giza 86/94 Combed Cotton Spinning, Weaving & Reactive Dyeing'),
  certifications: z
    .string()
    .max(300)
    .default('OEKO-TEX Standard 100, ISO 17025, EUR.1 0% EU Duty, EU DPP'),
  targetMarket: z
    .string()
    .max(200)
    .default('European Union (Germany, Italy, France) & USA Hospitality'),
  // Exact MoneyPrinterTurbo TaskVideoRequest schema fields (github.com/harry0703/MoneyPrinterTurbo)
  video_subject: z.string().min(2).max(2000),
  video_script: z.string().max(5000).optional(),
  video_terms: z.union([z.string(), z.array(z.string())]).optional(),
  video_aspect: z.enum(['9:16', '16:9', '1:1', '4:5']).default('16:9'),
  video_concat_mode: z.enum(['random', 'sequential']).default('sequential'),
  video_transition_mode: z
    .enum(['None', 'Shuffle', 'FadeIn', 'FadeOut', 'SlideIn', 'SlideOut'])
    .default('FadeIn'),
  video_clip_duration: z.number().int().min(2).max(10).default(4),
  video_count: z.number().int().min(1).max(5).default(1),
  video_source: z
    .enum(['pexels', 'pixabay', 'local', 'mahalla-sovereign'])
    .default('mahalla-sovereign'),
  video_language: z.string().max(20).default('en-US'),
  voice_name: z.string().max(120).default('en-US-ChristopherNeural-Male'),
  voice_volume: z.number().min(0.1).max(2.0).default(1.0),
  voice_rate: z.number().min(0.5).max(2.0).default(1.0),
  bgm_type: z
    .enum(['random', 'none', 'corporate-industrial', 'luxury-hospitality', 'tech-innovation'])
    .default('corporate-industrial'),
  bgm_volume: z.number().min(0).max(1.0).default(0.2),
  subtitle_enabled: z.boolean().default(true),
  subtitle_position: z.enum(['bottom', 'top', 'center', 'custom']).default('bottom'),
  custom_position: z.number().min(0).max(100).default(70),
  font_name: z.string().max(100).default('Montserrat-ExtraBold'),
  text_fore_color: z.string().max(20).default('#FBBF24'),
  text_background_color: z.union([z.boolean(), z.string()]).default(true),
  font_size: z.number().int().min(24).max(110).default(60),
  stroke_color: z.string().max(20).default('#000000'),
  stroke_width: z.number().min(0).max(6).default(1.8),
  n_threads: z.number().int().min(1).max(8).default(2),
  paragraph_number: z.number().int().min(1).max(5).default(1),
  preferredLlm: z
    .enum([
      'auto',
      'mahalla-sovereign',
      'llama-3.3-70b',
      'gemini-2.5-flash',
      'deepseek-r1',
      'qwen-2.5-72b',
    ])
    .default('auto'),
  mptServerUrl: z.string().max(300).optional(),
  mptApiKey: z.string().max(300).optional(),
  pexelsApiKey: z.string().max(300).optional(),
  locale: z.string().max(10).optional(),
});

const FALLBACK_BROLL_KEYFRAMES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1280&q=85',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1280&q=85',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1280&q=85',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1280&q=85',
  'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1280&q=85',
];

function formatSrtTimecode(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const pad3 = (n: number) => String(n).padStart(3, '0');
  return `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)},${pad3(ms)}`;
}

function buildSovereignMoneyPrinterScript(
  companyName: string,
  companySpecialty: string,
  certifications: string,
  targetMarket: string,
  subject: string,
  isAr: boolean,
  telemetry: ReturnType<typeof extractTextileTelemetry>
): string[] {
  if (isAr) {
    return [
      `من قلب المحلة الكبرى، تقدم ${companyName} أرقى إنتاج لـ ${subject} بمواصفات عالمية.`,
      `غزل قطن جيزة المصري الممشط نمرة Ne ${telemetry.yarnCountNe}/${telemetry.ply} بانتظام Uster 5% وكثافة ${telemetry.gsm} جم/م².`,
      `نسيج وصباغة أوتوماتيكية بثبات لوني فائق ΔE ≤ 0.5 وتوفير 70% من المياه والانبعاثات.`,
      `معتمد بشهادات ${certifications} مع إعفاء جمركي 0% عبر EUR.1 و QIZ لأسواق ${targetMarket}.`,
      `اطلب صندوق العينات الفوري عبر DHL خلال 48 ساعة وتعاقد مباشرة مع مصنعنا اليوم!`,
    ];
  }
  return [
    `From El-Mahalla El-Kubra, ${companyName} engineers world-class ${subject} for global buyers.`,
    `Spun from Egyptian Giza cotton Ne ${telemetry.yarnCountNe}/${telemetry.ply} at Uster 5% quality and ${telemetry.gsm} GSM precision.`,
    `Woven on high-speed air-jet looms and reactive-dyed with ΔE ≤ 0.5 spectrophotometer accuracy.`,
    `Verified with ${certifications} and 0% preferential duty into ${targetMarket} via EUR.1 & QIZ.`,
    `Request your 48-hour DHL physical swatch box and direct FOB Alexandria quotation today!`,
  ];
}

function buildSovereignMoneyPrinterTerms(
  subject: string,
  telemetry: ReturnType<typeof extractTextileTelemetry>
): string[] {
  const cleanSubject = subject
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 3)
    .join(' ');
  return [
    cleanSubject || 'luxury hotel bedlinen textile',
    `Egyptian cotton ${telemetry.structureLabelEn.toLowerCase()} macro weave`,
    'automated industrial weaving loom factory',
    'textile dyeing laboratory quality inspection',
    'luxury fabric swatch box export logistics',
  ];
}

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const taskId = url.searchParams.get('taskId')?.trim();
  const mptServerUrl =
    url.searchParams.get('mptServerUrl')?.trim() ||
    process.env.MONEYPRINTER_TURBO_URL?.trim();

  if (taskId && mptServerUrl) {
    try {
      const cleanBase = mptServerUrl.replace(/\/+$/, '');
      const res = await fetch(`${cleanBase}/api/v1/tasks/${encodeURIComponent(taskId)}`);
      const data = await res.json().catch(() => ({}));
      return {
        engine: 'moneyprinter-turbo-v1',
        repository: 'https://github.com/harry0703/MoneyPrinterTurbo',
        taskId,
        remoteStatus: data,
      };
    } catch {
      return {
        engine: 'moneyprinter-turbo-v1',
        taskId,
        status: 'LOCAL_BROWSER_MP4_COMPILER_ACTIVE',
      };
    }
  }

  return {
    engine: 'moneyprinter-turbo-v1',
    repository: 'https://github.com/harry0703/MoneyPrinterTurbo',
    endpoints: ['/api/v1/scripts', '/api/v1/terms', '/api/v1/videos', '/api/v1/tasks/{task_id}'],
    voices: MPT_VOICE_PRESETS,
    transitions: MPT_TRANSITION_MODES,
  };
});

export const POST = route(async (req) => {
  const body = await parseBody(req, MoneyPrinterRequestSchema);
  const companyName = body.companyName || 'Misr Heritage Spinning & Weaving (El-Mahalla)';
  const companySpecialty =
    body.companySpecialty ||
    '100% Egyptian Giza 86/94 Combed Cotton Spinning, Weaving & Reactive Dyeing';
  const certifications =
    body.certifications || 'OEKO-TEX Standard 100, ISO 17025, EUR.1 0% EU Duty, EU DPP';
  const targetMarket =
    body.targetMarket || 'European Union (Germany, Italy, France) & USA Hospitality';
  const videoLanguage = body.video_language || 'en-US';
  const voiceName = body.voice_name || 'en-US-ChristopherNeural-Male';
  const clipDuration = body.video_clip_duration || 4;
  const isAr =
    body.locale === 'ar' ||
    videoLanguage.toLowerCase().startsWith('ar') ||
    voiceName.startsWith('ar-');

  const telemetry = extractTextileTelemetry(`${companySpecialty} ${body.video_subject}`);
  const fallbackSentences = buildSovereignMoneyPrinterScript(
    companyName,
    companySpecialty,
    certifications,
    targetMarket,
    body.video_subject,
    isAr,
    telemetry
  );
  const fallbackTerms = buildSovereignMoneyPrinterTerms(body.video_subject, telemetry);

  // 1. Generate or refine the 5-sentence video_script (/api/v1/scripts)
  let scriptSentences = fallbackSentences;
  let llmUsed = 'mahalla-sovereign-v5 (MoneyPrinterTurbo Script Engine)';

  if (body.video_script && body.video_script.trim().length > 20 && body.action !== 'generate-script') {
    const split = body.video_script
      .split(/(?<=[.!؟\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
    if (split.length >= 3) {
      scriptSentences = split.slice(0, 5);
    }
  } else if (body.preferredLlm !== 'mahalla-sovereign') {
    try {
      const llmRes = await generate({
        system: `You are the MoneyPrinterTurbo AI Video Script Engine (github.com/harry0703/MoneyPrinterTurbo) specialized in high-converting industrial textile & B2B export commercials. Write exactly 5 punchy spoken sentences (no markdown bullets, no scene numbers, just 5 sentences separated by newlines) for a ${
          clipDuration * 5
        }-second video. Respond strictly in ${isAr ? 'Arabic' : 'English'}.`,
        messages: [
          {
            role: 'user',
            content: `Video Subject: ${body.video_subject}\nCompany: ${companyName} (${companySpecialty})\nCertifications: ${certifications}\nTarget Market: ${targetMarket}`,
          },
        ],
        temperature: 0.4,
        preferredModel: (body.preferredLlm || 'auto') as FreeLlmModelId,
      });
      const lines = llmRes.text
        .split(/\n+/)
        .map((l) => l.replace(/^[\d\-*•.)\s]+/, '').trim())
        .filter((l) => l.length > 12);
      if (lines.length >= 3) {
        scriptSentences = lines.slice(0, 5);
        llmUsed = llmRes.model;
      }
    } catch {
      // Keep deterministic sovereign script
    }
  }

  const finalScript = scriptSentences.join('\n');

  if (body.action === 'generate-script') {
    return {
      status: 200,
      engine: 'moneyprinter-turbo-v1',
      endpoint: '/api/v1/scripts',
      modelUsed: llmUsed,
      data: {
        video_script: finalScript,
        sentences: scriptSentences,
      },
    };
  }

  // 2. Generate or normalize video_terms (/api/v1/terms)
  let termsList: string[] = fallbackTerms;
  if (Array.isArray(body.video_terms) && body.video_terms.length > 0) {
    termsList = body.video_terms.map((t) => t.trim()).filter(Boolean).slice(0, 6);
  } else if (typeof body.video_terms === 'string' && body.video_terms.trim().length > 2) {
    termsList = body.video_terms
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6);
  }

  if (body.action === 'generate-terms') {
    return {
      status: 200,
      engine: 'moneyprinter-turbo-v1',
      endpoint: '/api/v1/terms',
      data: {
        video_terms: termsList,
      },
    };
  }

  // 3. Optional Pexels API B-Roll lookup if pexelsApiKey is provided
  const keyframes = [...FALLBACK_BROLL_KEYFRAMES];
  const activePexelsKey = body.pexelsApiKey?.trim() || process.env.PEXELS_API_KEY?.trim();
  if (activePexelsKey && body.video_source === 'pexels') {
    try {
      const q = encodeURIComponent(termsList[0] || 'textile factory');
      const pRes = await fetch(
        `https://api.pexels.com/videos/search?query=${q}&per_page=5`,
        {
          headers: { Authorization: activePexelsKey },
        }
      );
      if (pRes.ok) {
        const pData = await pRes.json();
        const videos = Array.isArray(pData?.videos) ? pData.videos : [];
        videos.slice(0, 5).forEach((v: any, idx: number) => {
          if (v?.image) keyframes[idx] = v.image;
        });
      }
    } catch {
      // Keep studio keyframes on Pexels network error
    }
  }

  // 4. Build synchronized .SRT subtitles and 5 MoneyPrinterTurbo video scenes
  const clipDur = body.video_clip_duration || 4;
  const cameraMotions = ['PUSH_IN', 'MACRO_RACK_FOCUS', 'TRUCK_RIGHT', 'ORBIT_360', 'PULL_OUT'] as const;
  const minimaxTags = [
    '[Push in]',
    '[Push in, Rack focus macro]',
    '[Truck right, Follow]',
    '[Arc shot, Pan right]',
    '[Pull out]',
  ];

  const subtitles = scriptSentences.slice(0, 5).map((line, idx) => {
    const startSec = idx * clipDur;
    const endSec = (idx + 1) * clipDur;
    const startTimecode = formatSrtTimecode(startSec);
    const endTimecode = formatSrtTimecode(endSec);
    return {
      index: idx + 1,
      startSec,
      endSec,
      startTimecode,
      endTimecode,
      text: line,
      brollTerm: termsList[idx % termsList.length] || termsList[0],
      keyframeUrl: keyframes[idx % keyframes.length],
      transition: body.video_transition_mode,
    };
  });

  const srtContent = subtitles
    .map(
      (sub) =>
        `${sub.index}\n${sub.startTimecode} --> ${sub.endTimecode}\n${sub.text}\n`
    )
    .join('\n');

  const scenes = subtitles.map((sub, idx) => ({
    sceneNumber: idx + 1,
    durationSec: clipDur,
    cameraMotion: cameraMotions[idx % cameraMotions.length],
    minimaxMotionId: cameraMotions[idx % cameraMotions.length],
    minimaxDirectorTag: minimaxTags[idx % minimaxTags.length],
    cameraMotionLabelEn: `MoneyPrinterTurbo • ${body.video_transition_mode} • B-Roll: "${sub.brollTerm}"`,
    cameraMotionLabelAr: `MoneyPrinterTurbo • انتقال ${body.video_transition_mode} • لقطة: «${sub.brollTerm}»`,
    headlineEn: sub.text.slice(0, 72),
    headlineAr: sub.text.slice(0, 72),
    sublineEn: `${companyName} • ${certifications}`,
    sublineAr: `${companyName} • ${certifications}`,
    voiceoverEn: sub.text,
    voiceoverAr: sub.text,
    kpiBadgeEn: `MPT SUBTITLE #0${idx + 1} • ${voiceName.split('-').slice(0, 3).join('-')}`,
    kpiBadgeAr: `ترجمة MPT #٠${idx + 1} • ${voiceName.split('-').slice(0, 3).join('-')}`,
    visualPromptEn: `[MoneyPrinterTurbo B-Roll: ${sub.brollTerm}] ${sub.text}`,
    keyframeUrl: sub.keyframeUrl,
    mptSubtitle: {
      enabled: body.subtitle_enabled,
      position: body.subtitle_position,
      customPositionPct: body.custom_position,
      textForeColor: body.text_fore_color,
      strokeColor: body.stroke_color,
      strokeWidth: body.stroke_width,
      fontSize: body.font_size,
      transitionMode: body.video_transition_mode,
      timecode: `${sub.startTimecode} --> ${sub.endTimecode}`,
    },
  }));

  // Official MoneyPrinterTurbo TaskVideoRequest JSON payload
  const mptRequestPayload = {
    video_subject: body.video_subject,
    video_script: finalScript,
    video_terms: termsList.join(', '),
    video_aspect: body.video_aspect === '4:5' ? '9:16' : body.video_aspect,
    video_concat_mode: body.video_concat_mode,
    video_transition_mode: body.video_transition_mode,
    video_clip_duration: clipDur,
    video_count: body.video_count,
    video_source: body.video_source === 'mahalla-sovereign' ? 'pexels' : body.video_source,
    video_language: body.video_language,
    voice_name: body.voice_name,
    voice_volume: body.voice_volume,
    voice_rate: body.voice_rate,
    bgm_type: body.bgm_type === 'none' ? 'none' : 'random',
    bgm_volume: body.bgm_volume,
    subtitle_enabled: body.subtitle_enabled,
    subtitle_position: body.subtitle_position,
    custom_position: body.custom_position,
    font_name: body.font_name,
    text_fore_color: body.text_fore_color,
    text_background_color: body.text_background_color,
    font_size: body.font_size,
    stroke_color: body.stroke_color,
    stroke_width: body.stroke_width,
    n_threads: body.n_threads,
    paragraph_number: body.paragraph_number,
  };

  // Optional dispatch to a self-hosted MoneyPrinterTurbo server (e.g. http://127.0.0.1:8080/api/v1/videos)
  const activeServerUrl =
    body.mptServerUrl?.trim() || process.env.MONEYPRINTER_TURBO_URL?.trim();
  let remoteDispatch = {
    dispatched: false,
    taskId: `mpt-local-${Date.now().toString(36)}`,
    status: 'SOVEREIGN_WEBCODECS_MP4_READY',
    messageEn:
      'MoneyPrinterTurbo script, B-roll terms, .SRT subtitles & kinetic caption styling synthesized! Ready for instant browser H.264 .MP4 rendering.',
    messageAr:
      'تم توليد سيناريو MoneyPrinterTurbo والكلمات المفتاحية للقطات وملف الترجمة (.SRT) بنجاح! جاهز للتصدير الفوري بصيغة .MP4.',
  };

  if (activeServerUrl) {
    try {
      const cleanBase = activeServerUrl.replace(/\/+$/, '');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (body.mptApiKey?.trim()) {
        headers['Authorization'] = `Bearer ${body.mptApiKey.trim()}`;
      }
      const rRes = await fetch(`${cleanBase}/api/v1/videos`, {
        method: 'POST',
        headers,
        body: JSON.stringify(mptRequestPayload),
      });
      const rData = await rRes.json().catch(() => ({}));
      if (rRes.ok && rData?.data?.task_id) {
        remoteDispatch = {
          dispatched: true,
          taskId: String(rData.data.task_id),
          status: 'REMOTE_MPT_PROCESSING',
          messageEn: `Dispatched to MoneyPrinterTurbo Server (${cleanBase}) — Task ID: ${rData.data.task_id}. Local H.264 .MP4 render is also ready immediately.`,
          messageAr: `تم إرسال المهمة إلى خادم MoneyPrinterTurbo (${cleanBase}) برقم ${rData.data.task_id}، كما يمكنك تحميل الفيديو بصيغة .MP4 مباشرة من المتصفح.`,
        };
      }
    } catch {
      // Graceful fallback to in-browser H.264 MP4 compiler
    }
  }

  return {
    status: 200,
    engine: 'moneyprinter-turbo-v1',
    repository: 'https://github.com/harry0703/MoneyPrinterTurbo',
    endpoint: '/api/v1/videos',
    modelUsed: llmUsed,
    taskId: remoteDispatch.taskId,
    remoteDispatch,
    video_script: finalScript,
    video_terms: termsList,
    srtContent,
    subtitles,
    scenes,
    mptRequestPayload,
    telemetry: {
      yarnCountNe: telemetry.yarnCountNe,
      gsm: telemetry.gsm,
      fobUsdKg: telemetry.costing.totalFobUsdKg,
    },
  };
});
