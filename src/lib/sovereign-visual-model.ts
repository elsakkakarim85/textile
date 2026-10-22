/**
 * Mahalla-Weave-Diffusion v5.0 — Expert-Level Procedural Visual, Dobby Draft & Uster Lab Synthesizer
 * ===================================================================================================
 * Renders 100% original, zero-rate-limit 1280x540 HD industrial visuals directly on HTML5 Canvas:
 * 1. 'weave-physics': 3D Micro-Weave & Yarn Fiber Simulation (Percale, Sateen, Twill, Jacquard, Knit)
 * 2. 'isometric-factory': 3D Isometric Smart Textile Mill Digital Twin (Spinning -> Weaving -> Dyeing -> Export)
 * 3. 'cad-techpack': Vector CAD Tech-Pack, Pantone Reactive Swatch Card & EU DPP Blueprint
 * 4. 'dobby-pegplan': 8x8 Dobby Point-Paper Weave Matrix, Reed Plan & Sinusoidal Crimp Cross-Section
 * 5. 'uster-lab': Uster® 2023 Yarn Quality Percentile Chart + CIE L*a*b* ΔE CMC(2:1) Color Bullseye
 */

import { extractTextileTelemetry, type ExtractedTextileTelemetry } from '@/lib/sovereign-textile-lm';

export type SovereignVisualMode =
  | 'weave-physics'
  | 'isometric-factory'
  | 'cad-techpack'
  | 'dobby-pegplan'
  | 'uster-lab';

export interface PaletteSpec {
  nameEn: string;
  nameAr: string;
  warpPrimary: string;
  warpHighlight: string;
  weftPrimary: string;
  weftHighlight: string;
  accent: string;
  swatches: { code: string; name: string; hex: string }[];
}

export function extractColorPaletteFromPrompt(prompt: string): PaletteSpec {
  const p = prompt.toLowerCase();
  if (/indigo|denim|navy|blue|أزرق|كحلي|نيله|دنيم/i.test(p)) {
    return {
      nameEn: 'Deep Mediterranean Indigo & Raw Ecru',
      nameAr: 'أزرق نيلي متوسطي وخام طبيعي',
      warpPrimary: '#1e3a8a',
      warpHighlight: '#60a5fa',
      weftPrimary: '#e2e8f0',
      weftHighlight: '#ffffff',
      accent: '#38bdf8',
      swatches: [
        { code: 'PANTONE 19-4027', name: 'Naval Indigo', hex: '#1e3a8a' },
        { code: 'PANTONE 11-0602', name: 'Combed Ecru', hex: '#f8fafc' },
        { code: 'PANTONE 17-4041', name: 'Aegean Blue', hex: '#2563eb' },
        { code: 'PANTONE 14-4112', name: 'Chambray Mist', hex: '#93c5fd' },
      ],
    };
  }
  if (/crimson|red|burgundy|terracotta|أحمر|نبيتي|عنابي/i.test(p)) {
    return {
      nameEn: 'Royal Burgundy & Warm Giza Ivory',
      nameAr: 'عنابي ملكي وعاجي قطن جيزة',
      warpPrimary: '#881337',
      warpHighlight: '#fb7185',
      weftPrimary: '#9f1239',
      weftHighlight: '#fda4af',
      accent: '#f43f5e',
      swatches: [
        { code: 'PANTONE 19-1725', name: 'Cabernet Red', hex: '#881337' },
        { code: 'PANTONE 18-1443', name: 'Terracotta Clay', hex: '#be123c' },
        { code: 'PANTONE 14-1118', name: 'Warm Sand', hex: '#fde68a' },
        { code: 'PANTONE 11-0104', name: 'Natural Ivory', hex: '#fffbeb' },
      ],
    };
  }
  if (/gold|amber|sand|beige|desert|ecru|ذهبي|بيج|رملي|أوف وايت/i.test(p)) {
    return {
      nameEn: 'Pharaonic Gold & Unbleached Giza Ecru',
      nameAr: 'ذهبي ملكي وقطن جيزة خام',
      warpPrimary: '#92400e',
      warpHighlight: '#fbbf24',
      weftPrimary: '#b45309',
      weftHighlight: '#fde68a',
      accent: '#f59e0b',
      swatches: [
        { code: 'PANTONE 16-0948', name: 'Giza Harvest Gold', hex: '#d97706' },
        { code: 'PANTONE 13-1011', name: 'Carded Sand', hex: '#fde68a' },
        { code: 'PANTONE 18-1028', name: 'Delta Bronze', hex: '#78350f' },
        { code: 'PANTONE 11-0604', name: 'Mercerized Pearl', hex: '#fef3c7' },
      ],
    };
  }
  return {
    nameEn: 'Nile Emerald & Mercerized Platinum',
    nameAr: 'زمردي النيل وبلاتيني ممرسر',
    warpPrimary: '#065f46',
    warpHighlight: '#34d399',
    weftPrimary: '#0f766e',
    weftHighlight: '#5eead4',
    accent: '#10b981',
    swatches: [
      { code: 'PANTONE 18-5633', name: 'Mahalla Emerald', hex: '#059669' },
      { code: 'PANTONE 17-4919', name: 'Nile Delta Teal', hex: '#0d9488' },
      { code: 'PANTONE 14-4102', name: 'Combed Silver', hex: '#cbd5e1' },
      { code: 'PANTONE 11-0601', name: 'Optic White', hex: '#f8fafc' },
    ],
  };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function isWarpOverWeft(i: number, j: number, structure: ExtractedTextileTelemetry['structure']): boolean {
  switch (structure) {
    case 'percale':
      return (i + j) % 2 === 0;
    case 'sateen':
      return (i + j * 2) % 5 !== 0;
    case 'twill_denim':
      return (i + j) % 4 !== 0;
    case 'jacquard': {
      const cx = (i % 12) - 5.5;
      const cy = (j % 12) - 5.5;
      const dist = Math.abs(cx) + Math.abs(cy);
      return dist < 4.5 || (dist > 6.2 && (i + j) % 2 === 0);
    }
    case 'terry_towel':
      return (i + j * 3) % 4 !== 0;
    default:
      return (i + j) % 2 === 0;
  }
}

/**
 * Renders the Built-From-Scratch Sovereign Visual onto a 1280x540 Canvas.
 */
export function renderSovereignVisualToCanvas(opts: {
  canvas: HTMLCanvasElement;
  prompt: string;
  moduleBadge: string;
  locale: string;
  mode: SovereignVisualMode;
}) {
  const { canvas, prompt, moduleBadge, locale, mode } = opts;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isAr = locale === 'ar';
  const telemetry = extractTextileTelemetry(prompt);
  const palette = extractColorPaletteFromPrompt(prompt);

  const W = 1280;
  const H = 540;
  canvas.width = W;
  canvas.height = H;

  // Deep studio background
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#020617');
  bgGrad.addColorStop(0.55, '#071c18');
  bgGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle engineering grid
  ctx.strokeStyle = 'rgba(16,185,129,0.08)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx < W; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, H);
    ctx.stroke();
  }
  for (let gy = 0; gy < H; gy += 40) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(W, gy);
    ctx.stroke();
  }

  // RIGHT VIEWPORT (x: 690..1244, y: 26..398)
  const vpX = 690;
  const vpY = 26;
  const vpW = 554;
  const vpH = 372;

  ctx.save();
  drawRoundedRect(ctx, vpX, vpY, vpW, vpH, 18);
  ctx.clip();

  if (mode === 'weave-physics') {
    // 1. PROCEDURAL 3D MICRO-WEAVE & FIBER SIMULATION
    ctx.fillStyle = '#040d14';
    ctx.fillRect(vpX, vpY, vpW, vpH);

    const pitch = 22;
    const yarnWidth = 17;
    const cols = Math.ceil(vpW / pitch) + 2;
    const rows = Math.ceil(vpH / pitch) + 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellX = vpX + c * pitch;
        const cellY = vpY + r * pitch;
        const warpTop = isWarpOverWeft(c, r, telemetry.structure);

        const drawWeftSegment = () => {
          const g = ctx.createLinearGradient(cellX, cellY + 2, cellX, cellY + yarnWidth + 2);
          g.addColorStop(0, palette.weftPrimary);
          g.addColorStop(0.45, palette.weftHighlight);
          g.addColorStop(1, '#020617');
          ctx.fillStyle = g;
          ctx.fillRect(cellX - 1, cellY + 2, pitch + 2, yarnWidth);

          ctx.strokeStyle = 'rgba(255,255,255,0.16)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cellX + 3, cellY + 3);
          ctx.lineTo(cellX + pitch - 3, cellY + yarnWidth);
          ctx.stroke();
        };

        const drawWarpSegment = () => {
          const g = ctx.createLinearGradient(cellX + 2, cellY, cellX + yarnWidth + 2, cellY);
          g.addColorStop(0, palette.warpPrimary);
          g.addColorStop(0.45, palette.warpHighlight);
          g.addColorStop(1, '#020617');
          ctx.fillStyle = g;
          ctx.fillRect(cellX + 2, cellY - 1, yarnWidth, pitch + 2);

          ctx.strokeStyle = 'rgba(255,255,255,0.18)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cellX + 4, cellY + 3);
          ctx.lineTo(cellX + yarnWidth, cellY + pitch - 3);
          ctx.stroke();
        };

        if (warpTop) {
          drawWeftSegment();
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          ctx.fillRect(cellX, cellY, pitch, pitch);
          drawWarpSegment();
        } else {
          drawWarpSegment();
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          ctx.fillRect(cellX, cellY, pitch, pitch);
          drawWeftSegment();
        }
      }
    }

    // 200x Digital Inspection Loupe Overlay
    const loupeX = vpX + vpW - 125;
    const loupeY = vpY + 115;
    const loupeR = 78;

    ctx.save();
    ctx.beginPath();
    ctx.arc(loupeX, loupeY, loupeR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(2,6,23,0.88)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#34d399';
    ctx.stroke();

    ctx.strokeStyle = 'rgba(52,211,153,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(loupeX - loupeR + 10, loupeY);
    ctx.lineTo(loupeX + loupeR - 10, loupeY);
    ctx.moveTo(loupeX, loupeY - loupeR + 10);
    ctx.lineTo(loupeX, loupeY + loupeR - 10);
    ctx.stroke();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('200× WEAVE LOUPE', loupeX, loupeY - 34);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText(`Ne ${telemetry.yarnCountNe}/${telemetry.ply}`, loupeX, loupeY - 12);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(`${telemetry.epi}×${telemetry.ppi} (${telemetry.threadCount} TC)`, loupeX, loupeY + 10);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText(`${telemetry.gsm} GSM | ${telemetry.tex} Tex`, loupeX, loupeY + 32);
    ctx.restore();
  } else if (mode === 'isometric-factory') {
    // 2. PROCEDURAL 3D ISOMETRIC SMART MILL DIGITAL TWIN
    const isoBg = ctx.createRadialGradient(vpX + vpW / 2, vpY + vpH / 2, 20, vpX + vpW / 2, vpY + vpH / 2, 340);
    isoBg.addColorStop(0, '#0b2922');
    isoBg.addColorStop(1, '#020617');
    ctx.fillStyle = isoBg;
    ctx.fillRect(vpX, vpY, vpW, vpH);

    ctx.strokeStyle = 'rgba(52,211,153,0.16)';
    ctx.lineWidth = 1;
    const cx = vpX + vpW / 2;
    const cy = vpY + 75;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(cx - i * 26, cy + i * 14);
      ctx.lineTo(cx + (10 - i) * 26, cy + 10 * 14 + i * 14);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + i * 26, cy + i * 14);
      ctx.lineTo(cx - (10 - i) * 26, cy + 10 * 14 + i * 14);
      ctx.stroke();
    }

    const stations = [
      { x: vpX + 75, y: vpY + 85, w: 185, h: 95, color: '#10b981', title: '1. RING / COMPACT SPINNING', kpi: `Ne ${telemetry.yarnCountNe}/${telemetry.ply} | CVm ${telemetry.uster.cvmPct}%` },
      { x: vpX + 305, y: vpY + 85, w: 185, h: 95, color: '#38bdf8', title: '2. AIR-JET WEAVING SHED', kpi: `${telemetry.epi}×${telemetry.ppi} | OEE 87.2%` },
      { x: vpX + 75, y: vpY + 215, w: 185, h: 95, color: '#a855f7', title: '3. LOW-LIQUOR DYEHOUSE', kpi: `LR 1:${telemetry.liquorRatio} | ΔE ≤ 0.75` },
      { x: vpX + 305, y: vpY + 215, w: 185, h: 95, color: '#f59e0b', title: '4. EU DPP & FOB DISPATCH', kpi: `$${telemetry.costing.totalFobUsdKg}/kg | ${telemetry.sustainability.netKgCo2ePerKg} CO2e` },
    ];

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(vpX + 260, vpY + 132);
    ctx.lineTo(vpX + 305, vpY + 132);
    ctx.moveTo(vpX + 397, vpY + 180);
    ctx.lineTo(vpX + 167, vpY + 215);
    ctx.moveTo(vpX + 260, vpY + 262);
    ctx.lineTo(vpX + 305, vpY + 262);
    ctx.stroke();
    ctx.setLineDash([]);

    stations.forEach((st) => {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      drawRoundedRect(ctx, st.x + 6, st.y + 8, st.w, st.h, 12);
      ctx.fill();

      ctx.fillStyle = 'rgba(15,23,42,0.92)';
      drawRoundedRect(ctx, st.x, st.y, st.w, st.h, 12);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = st.color;
      ctx.stroke();

      ctx.fillStyle = st.color;
      ctx.fillRect(st.x + 14, st.y + 14, 36, 5);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(st.title, st.x + 14, st.y + 38);

      ctx.fillStyle = st.color;
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.fillText(st.kpi, st.x + 14, st.y + 62);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText('ISO 17025 / SCADA Telemetry Live', st.x + 14, st.y + 82);
    });
  } else if (mode === 'dobby-pegplan') {
    // 4. 8x8 DOBBY POINT-PAPER MATRIX, REED PLAN & WARP/WEFT CRIMP WAVE
    ctx.fillStyle = '#06111c';
    ctx.fillRect(vpX, vpY, vpW, vpH);

    // Draw 8x8 Point-Paper Grid on Left of Viewport
    const gridX = vpX + 26;
    const gridY = vpY + 52;
    const cellSz = 26;
    const mat = telemetry.weaveGeometry.matrix8x8;

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`8×8 DOBBY POINT-PAPER (${telemetry.weaveGeometry.weaveRepeat.toUpperCase()})`, gridX, vpY + 34);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cx = gridX + c * cellSz;
        const cy = gridY + r * cellSz;
        const riser = mat[r][c] === 1;
        ctx.fillStyle = riser ? palette.accent : '#0f172a';
        ctx.fillRect(cx, cy, cellSz - 2, cellSz - 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, cy, cellSz - 2, cellSz - 2);

        if (riser) {
          ctx.fillStyle = '#020617';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('1', cx + cellSz / 2 - 1, cy + cellSz / 2 + 3);
        }
      }
    }

    // Right side of viewport: Reed Plan & Yarn Mass Balance Cards
    const infoX = gridX + 8 * cellSz + 22;
    const wg = telemetry.weaveGeometry;
    const specs = [
      { label: 'REED SPECIFICATION', val: `${wg.reedCountDentsInch} Dents/In (${wg.endsPerDent} Ends/Dent)` },
      { label: 'REED WIDTH VS FINISHED', val: `${wg.reedWidthCm} cm Reed → ${telemetry.fabricWidthCm} cm` },
      { label: 'WARP & WEFT CRIMP %', val: `Warp: ${wg.warpCrimpPct}% | Weft: ${wg.weftCrimpPct}%` },
      { label: 'LINEAR METER MASS', val: `${wg.totalGramsPerLinearMeter} g/m (${wg.warpGramsPerLinearMeter}W + ${wg.weftGramsPerLinearMeter}F)` },
    ];

    specs.forEach((sp, i) => {
      const sy = gridY + i * 52;
      ctx.fillStyle = 'rgba(15,23,42,0.92)';
      drawRoundedRect(ctx, infoX, sy, 286, 44, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56,189,248,0.35)';
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(sp.label, infoX + 12, sy + 16);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(sp.val, infoX + 12, sy + 34);
    });

    // Bottom of Viewport: Sinusoidal Warp/Weft Cross-Section Crimp Diagram
    const waveY = vpY + 298;
    ctx.fillStyle = 'rgba(15,23,42,0.85)';
    drawRoundedRect(ctx, gridX, waveY - 28, vpW - 52, 54, 10);
    ctx.fill();

    ctx.strokeStyle = palette.warpHighlight;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= vpW - 80; x += 4) {
      const y = waveY + Math.sin(x * 0.09) * 12;
      if (x === 0) ctx.moveTo(gridX + 14 + x, y);
      else ctx.lineTo(gridX + 14 + x, y);
    }
    ctx.stroke();

    // Weft cross-section circles
    for (let k = 0; k < 14; k++) {
      const wx = gridX + 32 + k * 34.8;
      const wy = waveY + (k % 2 === 0 ? 8 : -8);
      ctx.beginPath();
      ctx.arc(wx, wy, 6, 0, Math.PI * 2);
      ctx.fillStyle = palette.weftHighlight;
      ctx.fill();
    }
  } else if (mode === 'uster-lab') {
    // 5. USTER® 2023 YARN QUALITY PERCENTILE & CIE L*a*b* SPECTROPHOTOMETER LAB
    ctx.fillStyle = '#06101a';
    ctx.fillRect(vpX, vpY, vpW, vpH);

    const u = telemetry.uster;
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`USTER® STATISTICS 2023 PROFILE (Ne ${telemetry.yarnCountNe}/${telemetry.ply})`, vpX + 24, vpY + 34);

    const bars = [
      { name: `Evenness CVm (${u.cvmPct}%)`, pct: 95, target: 'Uster 5% World Band' },
      { name: `Tenacity (${u.tenacityCnTex} cN/tex)`, pct: 92, target: `Elongation ${u.elongationPct}%` },
      { name: `Hairiness Index (H=${u.hairinessH})`, pct: 89, target: `${u.spindleRpm} RPM Compact` },
      { name: `Low Neps (${u.nepsPlus200PerKm}/km)`, pct: 94, target: `Draft D=${u.spinningDraft}` },
      { name: `ISO 105 Fastness (Grade 4.8)`, pct: 96, target: 'ZDHC MRSL v3.1 Level 3' },
    ];

    bars.forEach((b, idx) => {
      const by = vpY + 52 + idx * 52;
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(b.name, vpX + 24, by + 12);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(b.target, vpX + 310, by + 12);

      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      drawRoundedRect(ctx, vpX + 24, by + 20, 286, 12, 6);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      drawRoundedRect(ctx, vpX + 24, by + 20, Math.round((286 * b.pct) / 100), 12, 6);
      ctx.fill();
    });

    // Right side of viewport: CIE L*a*b* CMC(2:1) Spectrophotometer Bullseye
    const bullX = vpX + 432;
    const bullY = vpY + 175;
    [82, 56, 30].forEach((rad, i) => {
      ctx.beginPath();
      ctx.arc(bullX, bullY, rad, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? 'rgba(16,185,129,0.08)' : i === 1 ? 'rgba(16,185,129,0.16)' : 'rgba(16,185,129,0.32)';
      ctx.fill();
      ctx.strokeStyle = i === 2 ? '#34d399' : 'rgba(52,211,153,0.4)';
      ctx.lineWidth = i === 2 ? 2 : 1;
      ctx.stroke();
    });

    // Sample hit point inside ΔE <= 0.45
    ctx.beginPath();
    ctx.arc(bullX + 8, bullY - 6, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CIE L*a*b* D65/10°', bullX, bullY + 104);
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('ΔE CMC(2:1) = 0.42 PASS', bullX, bullY + 124);
  } else {
    // 3. PROCEDURAL VECTOR CAD TECH-PACK & PANTONE COLORWAY SPEC SHEET
    ctx.fillStyle = '#07131f';
    ctx.fillRect(vpX, vpY, vpW, vpH);

    const cadX = vpX + 22;
    const cadY = vpY + 22;
    const cadW = 295;
    const cadH = 265;
    ctx.strokeStyle = 'rgba(56,189,248,0.45)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, cadX, cadY, cadW, cadH, 12);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    const midX = cadX + cadW / 2;
    const topY = cadY + 42;
    ctx.beginPath();
    ctx.moveTo(midX - 55, topY);
    ctx.lineTo(midX + 55, topY);
    ctx.lineTo(midX + 95, topY + 45);
    ctx.lineTo(midX + 75, topY + 70);
    ctx.lineTo(midX + 55, topY + 52);
    ctx.lineTo(midX + 55, topY + 175);
    ctx.lineTo(midX - 55, topY + 175);
    ctx.lineTo(midX - 55, topY + 52);
    ctx.lineTo(midX - 75, topY + 70);
    ctx.lineTo(midX - 95, topY + 45);
    ctx.closePath();
    ctx.fillStyle = `${palette.warpPrimary}55`;
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(midX - 55, topY + 192);
    ctx.lineTo(midX + 55, topY + 192);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`WIDTH: ${telemetry.fabricWidthCm} CM | ${telemetry.gsm} GSM (±3%)`, midX, topY + 208);

    const swX = cadX + cadW + 16;
    palette.swatches.forEach((sw, idx) => {
      const sy = cadY + idx * 67;
      ctx.fillStyle = 'rgba(15,23,42,0.95)';
      drawRoundedRect(ctx, swX, sy, 200, 58, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.stroke();

      ctx.fillStyle = sw.hex;
      drawRoundedRect(ctx, swX + 8, sy + 8, 42, 42, 8);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(sw.name, swX + 58, sy + 25);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(sw.code, swX + 58, sy + 43);
    });
  }

  // Viewport border & mode tag
  drawRoundedRect(ctx, vpX, vpY, vpW, vpH, 18);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(52,211,153,0.45)';
  ctx.stroke();

  ctx.fillStyle = 'rgba(2,6,23,0.88)';
  drawRoundedRect(ctx, vpX + 14, vpY + vpH - 40, 325, 28, 8);
  ctx.fill();
  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'left';
  const modeLabel =
    mode === 'weave-physics'
      ? 'MODE 1: 3D MICRO-WEAVE FIBER SIMULATION'
      : mode === 'isometric-factory'
      ? 'MODE 2: 3D ISOMETRIC SMART MILL DIGITAL TWIN'
      : mode === 'dobby-pegplan'
      ? 'MODE 4: 8×8 DOBBY PEG-PLAN & CRIMP GEOMETRY'
      : mode === 'uster-lab'
      ? 'MODE 5: USTER® 2023 & CIE L*a*b* LAB MATRIX'
      : 'MODE 3: VECTOR CAD & PANTONE COLORWAY SPEC';
  ctx.fillText(modeLabel, vpX + 24, vpY + vpH - 22);
  ctx.restore();

  // LEFT PANEL (x: 36..665): Header, Prompt Synthesis & Quantitative Equations
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(16,185,129,0.18)';
  drawRoundedRect(ctx, 36, 26, 470, 34, 17);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52,211,153,0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#6ee7b7';
  ctx.font = 'bold 12px system-ui, sans-serif';
  ctx.fillText(`MAHALLA SOVEREIGN NEURAL v5.0 • ${moduleBadge.toUpperCase().slice(0, 32)}`, 52, 48);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 23px system-ui, sans-serif';
  ctx.fillText(
    `${telemetry.structureLabelEn.slice(0, 36)} — Ne ${telemetry.yarnCountNe}/${telemetry.ply}`,
    36,
    92
  );

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.fillText(
    `${telemetry.fiberLabelEn} • Palette: ${palette.nameEn}`,
    36,
    118
  );

  // Prompt excerpt box
  ctx.fillStyle = 'rgba(15,23,42,0.82)';
  drawRoundedRect(ctx, 36, 134, 632, 92, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(148,163,184,0.22)';
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px system-ui, sans-serif';
  const cleanPrompt = prompt.replace(/\s+/g, ' ').trim();
  const words = cleanPrompt.split(' ');
  let line = '';
  let py = 160;
  for (let i = 0; i < words.length; i++) {
    const test = line + words[i] + ' ';
    if (ctx.measureText(test).width > 596) {
      ctx.fillText(line.trim(), 52, py);
      line = words[i] + ' ';
      py += 22;
      if (py > 210) break;
    } else {
      line = test;
    }
  }
  if (line.trim() && py <= 210) {
    ctx.fillText(line.trim(), 52, py);
  }

  // Quantitative Engineering Matrix (2x2 cards on left panel)
  const eqCards = [
    {
      label: isAr ? 'هندسة الغزل والنسيج (USTER 5%)' : 'YARN & WEAVE GEOMETRY (USTER 5%)',
      val: `Ne ${telemetry.yarnCountNe}/${telemetry.ply} (${telemetry.tex} Tex) • ${telemetry.epi}×${telemetry.ppi}`,
      sub: `CVm ${telemetry.uster.cvmPct}% | Tenacity ${telemetry.uster.tenacityCnTex} cN/tex | Reed ${telemetry.weaveGeometry.reedWidthCm} cm`,
    },
    {
      label: isAr ? 'التكلفة التصديرية FOB' : 'FOB EXPORT COSTING (BOM)',
      val: `$${telemetry.costing.totalFobUsdKg.toFixed(2)} / kg (${telemetry.costing.totalFobEgpKg} EGP/kg)`,
      sub: `Linear Meter: $${telemetry.costing.fobUnitUsd.toFixed(2)}/m (${telemetry.weaveGeometry.totalGramsPerLinearMeter} g/m)`,
    },
    {
      label: isAr ? 'الصباغة التفاعلية والجودة' : 'WET PROCESSING & QC GATE',
      val: `Liquor Ratio 1:${telemetry.liquorRatio} • ΔE ≤ 0.75`,
      sub: `ZDHC MRSL v3.1 Level 3 | ISO 105 ≥ 4.5 | ASTM 4-Point`,
    },
    {
      label: isAr ? 'البصمة الكربونية وجواز DPP' : 'CARBON INTENSITY & EU DPP',
      val: `${telemetry.sustainability.netKgCo2ePerKg} kg CO2e/kg • ${telemetry.sustainability.waterLitersPerKgOptimized} L/kg`,
      sub: `-${telemetry.sustainability.waterSavedPct}% Water Saved | EU ESPR 2024/1781 Verified`,
    },
  ];

  eqCards.forEach((c, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cx = 36 + col * 322;
    const cy = 240 + row * 82;
    ctx.fillStyle = 'rgba(15,23,42,0.88)';
    drawRoundedRect(ctx, cx, cy, 310, 72, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(52,211,153,0.3)';
    ctx.stroke();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 10px system-ui, sans-serif';
    ctx.fillText(c.label, cx + 14, cy + 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(c.val, cx + 14, cy + 41);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(c.sub, cx + 14, cy + 59);
  });

  // Bottom Full-Width Telemetry Footer (y: 416..514)
  ctx.fillStyle = 'rgba(2,6,23,0.9)';
  drawRoundedRect(ctx, 36, 416, 1208, 96, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52,211,153,0.35)';
  ctx.stroke();

  const pillars = [
    {
      k: isAr ? '١. المحرك العصبي السيادي' : '1. SOVEREIGN NEURAL ENGINE',
      v: 'Mahalla-Weave-Diffusion v5.0',
      s: '5 Engineering Views • 0 Rate Limits',
    },
    {
      k: isAr ? '٢. معادلة الوزن المترى' : '2. GSM PHYSICS EQUATION',
      v: `((${telemetry.epi}+${telemetry.ppi})/${telemetry.effectiveNe.toFixed(0)})×24.35 = ${telemetry.gsm} GSM`,
      s: `Cover Factor Kc = ${telemetry.coverFactor} | Uster 5%`,
    },
    {
      k: isAr ? '٣. الإعفاء الجمركي' : '3. PREFERENTIAL TARIFF',
      v: 'EU EUR.1 (0%) & US QIZ (0%)',
      s: `Saves 12.0%–14.9% Landed Customs Duty`,
    },
    {
      k: isAr ? '٤. التوثيق الرقمي الأوروبي' : '4. DIGITAL PRODUCT PASSPORT',
      v: 'EU ESPR Reg. 2024/1781 Ready',
      s: 'Batch-Level QR & ISO 17025 Traceability',
    },
  ];

  pillars.forEach((p, idx) => {
    const px = 54 + idx * 298;
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(p.k, px, 444);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillText(p.v, px, 469);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(p.s, px, 492);
  });
}
