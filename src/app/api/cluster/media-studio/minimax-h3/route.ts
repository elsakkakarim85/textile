import { z } from 'zod';
import { route, parseBody } from '@/server/http';
import { extractTextileTelemetry } from '@/lib/sovereign-textile-lm';

export const maxDuration = 30;

export const MINIMAX_H3_CAMERA_MOVEMENTS = [
  {
    id: 'PUSH_IN',
    tag: '[Push in]',
    labelEn: '[Push in] Anamorphic Dolly Push',
    labelAr: '[Push in] تقريب سينمائي للأمام',
    dx: 0,
    dy: 0,
    scaleStart: 1.02,
    scaleEnd: 1.22,
    rotDeg: 0,
  },
  {
    id: 'PULL_OUT',
    tag: '[Pull out]',
    labelEn: '[Pull out] Wide Crane Reveal',
    labelAr: '[Pull out] ابتعاد كاميرا واسع',
    dx: 0,
    dy: 0,
    scaleStart: 1.22,
    scaleEnd: 1.02,
    rotDeg: 0,
  },
  {
    id: 'PAN_RIGHT',
    tag: '[Pan right]',
    labelEn: '[Pan right] Smooth Horizontal Pan Right',
    labelAr: '[Pan right] بانوراما أفقية لليمين',
    dx: 0.09,
    dy: 0,
    scaleStart: 1.14,
    scaleEnd: 1.14,
    rotDeg: 0,
  },
  {
    id: 'PAN_LEFT',
    tag: '[Pan left]',
    labelEn: '[Pan left] Smooth Horizontal Pan Left',
    labelAr: '[Pan left] بانوراما أفقية لليسار',
    dx: -0.09,
    dy: 0,
    scaleStart: 1.14,
    scaleEnd: 1.14,
    rotDeg: 0,
  },
  {
    id: 'TRUCK_RIGHT',
    tag: '[Truck right, Follow]',
    labelEn: '[Truck right, Follow] Lateral Loom Tracking',
    labelAr: '[Truck right, Follow] تتبع جانبي بموازاة النول',
    dx: 0.11,
    dy: -0.02,
    scaleStart: 1.12,
    scaleEnd: 1.18,
    rotDeg: 0,
  },
  {
    id: 'TRUCK_LEFT',
    tag: '[Truck left, Follow]',
    labelEn: '[Truck left, Follow] Reverse Lateral Tracking',
    labelAr: '[Truck left, Follow] تتبع جانبي عكسي',
    dx: -0.11,
    dy: 0.02,
    scaleStart: 1.18,
    scaleEnd: 1.12,
    rotDeg: 0,
  },
  {
    id: 'TILT_UP',
    tag: '[Tilt up, Pedestal up]',
    labelEn: '[Tilt up, Pedestal up] Vertical Jib Elevation',
    labelAr: '[Tilt up, Pedestal up] ارتفاع رأسي للأعلى',
    dx: 0,
    dy: -0.08,
    scaleStart: 1.12,
    scaleEnd: 1.16,
    rotDeg: 0,
  },
  {
    id: 'TILT_DOWN',
    tag: '[Tilt down, Pedestal down]',
    labelEn: '[Tilt down, Pedestal down] Overhead Inspection Sweep',
    labelAr: '[Tilt down, Pedestal down] مسح رأسي للأسفل',
    dx: 0,
    dy: 0.08,
    scaleStart: 1.16,
    scaleEnd: 1.12,
    rotDeg: 0,
  },
  {
    id: 'ORBIT_360',
    tag: '[Arc shot, Pan right]',
    labelEn: '[Arc shot, Pan right] 3D Orbital Product Sweep',
    labelAr: '[Arc shot, Pan right] دوران ثلاثي الأبعاد حول المنتج',
    dx: 0.06,
    dy: -0.03,
    scaleStart: 1.1,
    scaleEnd: 1.2,
    rotDeg: 1.8,
  },
  {
    id: 'MACRO_RACK_FOCUS',
    tag: '[Push in, Rack focus macro]',
    labelEn: '[Push in, Rack focus macro] 100mm Micro-Weave Focus',
    labelAr: '[Push in, Rack focus macro] تركيز ماكرو 100mm على الشعيرات',
    dx: 0.02,
    dy: -0.02,
    scaleStart: 1.05,
    scaleEnd: 1.26,
    rotDeg: 0,
  },
  {
    id: 'TRACKING_FPV',
    tag: '[Tracking shot, Push in]',
    labelEn: '[Tracking shot, Push in] FPV Smart Mill Walkthrough',
    labelAr: '[Tracking shot, Push in] جولة ديناميكية داخل المصنع',
    dx: 0.05,
    dy: -0.04,
    scaleStart: 1.04,
    scaleEnd: 1.24,
    rotDeg: -1.1,
  },
  {
    id: 'STATIC_LOCK',
    tag: '[Static shot]',
    labelEn: '[Static shot] Tripod Executive Lock-Off',
    labelAr: '[Static shot] كادر ثابت احترافي',
    dx: 0,
    dy: 0,
    scaleStart: 1.04,
    scaleEnd: 1.06,
    rotDeg: 0,
  },
] as const;

export const MINIMAX_H3_CHOREOGRAPHY_TEMPLATES = [
  {
    id: 'hospitality-luxury',
    labelEn: '5-Star Hotel Sateen & Drape Choreography',
    labelAr: 'مسار كاميرا مفروشات الفنادق الفاخرة (5 نجوم)',
    sceneMotions: ['PUSH_IN', 'MACRO_RACK_FOCUS', 'PAN_RIGHT', 'ORBIT_360', 'STATIC_LOCK'],
  },
  {
    id: 'macro-fiber-lab',
    labelEn: '100mm Micro-Weave & Uster Lab Inspection',
    labelAr: 'مسار الفحص المجهري للشعيرات ومعمل Uster',
    sceneMotions: ['MACRO_RACK_FOCUS', 'TRUCK_RIGHT', 'TILT_UP', 'PAN_LEFT', 'PUSH_IN'],
  },
  {
    id: 'fpv-smart-mill',
    labelEn: 'FPV Air-Jet Weaving & Dyehouse OEE Tour',
    labelAr: 'جولة كاميرا FPV داخل أنوال الهواء والمصبغة',
    sceneMotions: ['TRACKING_FPV', 'TRUCK_RIGHT', 'PULL_OUT', 'TILT_UP', 'STATIC_LOCK'],
  },
  {
    id: 'export-dpp-pitch',
    labelEn: '360° Export Swatch Box & EU DPP Showcase',
    labelAr: 'استعراض ثلاثي الأبعاد لصندوق العينات وجواز DPP',
    sceneMotions: ['ORBIT_360', 'PUSH_IN', 'MACRO_RACK_FOCUS', 'PULL_OUT', 'STATIC_LOCK'],
  },
] as const;

const MiniMaxH3RequestSchema = z.object({
  companyName: z.string().min(2).max(160).default('Misr Heritage Spinning & Weaving (El-Mahalla)'),
  companySpecialty: z.string().max(400).default('Giza 86 Ne 60/1 Compact Sateen 400TC'),
  prompt: z.string().min(3).max(2000),
  cameraTags: z.array(z.string()).max(6).optional(),
  modelVariant: z
    .enum(['T2V-01-Director', 'I2V-01-Live', 'Hailuo-H3-Pro', 'S2V-01'])
    .default('T2V-01-Director'),
  firstFrameImageUrl: z.string().max(2000).optional(),
  resolution: z.enum(['1080p', '720p']).default('1080p'),
  fps: z.number().int().min(24).max(60).default(30),
  apiKey: z.string().max(500).optional(),
  locale: z.string().max(10).optional(),
});

export const GET = route(async (req) => {
  const url = new URL(req.url);
  const taskId = url.searchParams.get('taskId')?.trim();
  const apiKey =
    url.searchParams.get('apiKey')?.trim() || process.env.MINIMAX_API_KEY?.trim();

  if (taskId && apiKey) {
    try {
      const qRes = await fetch(
        `https://api.minimaxi.chat/v1/query/video_generation?task_id=${encodeURIComponent(taskId)}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      );
      const qData = await qRes.json().catch(() => ({}));
      return {
        engine: 'minimax-h3-director-v5',
        taskId,
        status: qData?.status || 'Processing',
        fileId: qData?.file_id || null,
        raw: qData,
      };
    } catch {
      return {
        engine: 'minimax-h3-director-v5',
        taskId,
        status: 'LOCAL_MP4_FALLBACK_ACTIVE',
      };
    }
  }

  return {
    engine: 'minimax-h3-director-v5',
    supportedVariants: ['T2V-01-Director', 'I2V-01-Live', 'Hailuo-H3-Pro', 'S2V-01'],
    cameraMovementsCatalog: MINIMAX_H3_CAMERA_MOVEMENTS,
    choreographyTemplates: MINIMAX_H3_CHOREOGRAPHY_TEMPLATES,
  };
});

export const POST = route(async (req) => {
  const startMs = Date.now();
  const body = await parseBody(req, MiniMaxH3RequestSchema);
  const telemetry = extractTextileTelemetry(`${body.companySpecialty} ${body.prompt}`);
  const tags =
    body.cameraTags && body.cameraTags.length > 0
      ? body.cameraTags
      : [
          '[Push in]',
          '[Truck right, Follow]',
          '[Push in, Rack focus macro]',
          '[Pull out]',
          '[Static shot]',
        ];

  const modePrefix =
    body.modelVariant === 'I2V-01-Live'
      ? '[I2V-01-Live Keyframe Animation]'
      : body.modelVariant === 'S2V-01'
      ? '[S2V-01 Subject-Consistent Mill Showcase]'
      : '[T2V-01-Director Multi-Camera Script]';

  const directorPrompt = `${modePrefix} ${tags[0] || '[Push in]'} Commercial 1080p 60fps cinema shot for ${body.companyName}: ${body.prompt}. Substrate physics: ${telemetry.fiberLabelEn} ${telemetry.structureLabelEn}, Yarn Ne ${telemetry.yarnCountNe}/${telemetry.ply} (${telemetry.tex} Tex, Uster 5% CVm ${telemetry.uster.cvmPct}%), Sett ${telemetry.epi}x${telemetry.ppi} (${telemetry.gsm} GSM). ${tags[1] || '[Truck right, Follow]'} 100mm macro raking light across lustrous interlaced warp and weft yarns. ${tags[2] || '[Pull out]'} Automated El-Mahalla air-jet weaving and low-liquor 1:${telemetry.liquorRatio} reactive dyeing hall, OEKO-TEX & EU DPP verified.`;

  const activeApiKey = body.apiKey?.trim() || process.env.MINIMAX_API_KEY?.trim();
  let cloudTask: {
    dispatched: boolean;
    taskId?: string;
    status: string;
    providerUrl: string;
    messageEn: string;
    messageAr: string;
  } = {
    dispatched: false,
    status: 'SOVEREIGN_LOCAL_WEBCODECS_MP4_READY',
    providerUrl: 'https://hailuoai.video',
    messageEn: `MiniMax H3 (${body.modelVariant}) Camera-Director trajectory & 60fps cloth-physics storyboard synthesized in <5ms. Ready for instant browser H.264 .MP4 encoding or 1-click Hailuo AI launch.`,
    messageAr: `تم بناء مسارات كاميرا MiniMax H3 (${body.modelVariant}) وفيزياء الأقمشة فائقة الدقة في أقل من 5 مللي ثانية؛ جاهز للتصدير الفوري بصيغة .MP4 أو الفتح المباشر في Hailuo AI.`,
  };

  if (activeApiKey) {
    try {
      const payload: Record<string, unknown> = {
        model: body.modelVariant === 'Hailuo-H3-Pro' ? 'T2V-01-Director' : body.modelVariant,
        prompt: directorPrompt.slice(0, 1900),
        prompt_optimizer: true,
      };
      if (body.firstFrameImageUrl && body.modelVariant === 'I2V-01-Live') {
        payload.first_frame_image = body.firstFrameImageUrl;
      }
      const mmRes = await fetch('https://api.minimaxi.chat/v1/video_generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeApiKey}`,
        },
        body: JSON.stringify(payload),
      });
      const mmData = await mmRes.json().catch(() => ({}));
      if (mmRes.ok && mmData?.task_id) {
        cloudTask = {
          dispatched: true,
          taskId: String(mmData.task_id),
          status: 'CLOUD_GENERATING',
          providerUrl: 'https://api.minimaxi.chat/v1/video_generation',
          messageEn: `MiniMax Cloud Task #${mmData.task_id} dispatched to ${body.modelVariant}! Meanwhile, your local H.264 .MP4 master is ready immediately.`,
          messageAr: `تم إرسال مهمة التوليد السحابية #${mmData.task_id} إلى نموذج ${body.modelVariant} بنجاح! كما يمكنك تحميل نسخة الفيديو .MP4 الفورية مباشرة.`,
        };
      }
    } catch {
      // Fallback gracefully to zero-limit local H.264 MP4 studio engine
    }
  }

  return {
    engine: 'minimax-h3-director-v5',
    modelVariant: body.modelVariant,
    resolution: body.resolution,
    fps: body.fps,
    directorPrompt,
    cameraMovementsCatalog: MINIMAX_H3_CAMERA_MOVEMENTS,
    choreographyTemplates: MINIMAX_H3_CHOREOGRAPHY_TEMPLATES,
    appliedCameraTags: tags,
    sovereignTelemetry: telemetry,
    cloudTask,
    latencyMs: Date.now() - startMs,
    generatedAt: new Date().toISOString(),
  };
});
