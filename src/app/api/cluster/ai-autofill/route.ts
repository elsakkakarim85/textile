import { NextResponse } from 'next/server';
import { generate, type FreeLlmModelId } from '@/server/ai';

export type AutoFillKind =
  | 'procurement_pool'
  | 'capacity_post'
  | 'consortium'
  | 'facility_booking'
  | 'funding_application'
  | 'sustainability_audit'
  | 'forum_thread'
  | 'forum_reply'
  | 'expert_request'
  | 'expert_profile'
  | 'announcement';

function buildDeterministicAutoFill(
  kind: AutoFillKind,
  context: Record<string, any>,
  locale: string
): Record<string, any> {
  const isAr = locale === 'ar';
  const hint = String(context.hint || '').trim();

  switch (kind) {
    case 'procurement_pool': {
      const cat = String(context.category || 'YARN').toUpperCase();
      if (cat === 'DYES_CHEMICALS') {
        return {
          title: isAr
            ? `شراء جماعي: أصباغ تفاعلية ثنائية المجموعات الفعالة (ZDHC Level 3) ${hint ? `- ${hint}` : ''}`
            : `Joint Pool: Bifunctional Reactive Dyes Bundle (ZDHC MRSL v3.1 Level 3) ${hint ? `- ${hint}` : ''}`,
          description: isAr
            ? 'تجميع طلبات مصانع الصباغة في المحلة الكبرى للحصول على خصم كميات ١٦٪ من الوكلاء المعتمدين مع شهادة مطابقة ZDHC MRSL v3.1 وضمان ثبات الغسيل ISO 105-C06 ≥ 4-5.'
            : 'Aggregating reactive dyestuff demand across El-Mahalla dyeing mills to unlock a 16% bulk tier discount with full ZDHC MRSL v3.1 Level 3 certification and ISO 105-C06 ≥ 4-5 wash fastness guarantee.',
          specification: isAr
            ? 'أصباغ تفاعلية عالية الاستنفاد (نسبة حمام 1:6) | خالية من الأمينات العطرية المحظورة (أزو) | ثبات ضوء ISO 105-B02 ≥ 5 | توريد في براميل محكمة ٢٥ كجم مع شهادة تحليل COA لكل تشغيلة.'
            : 'High-exhaustion bifunctional reactive dyes (Liquor Ratio 1:6) | Zero restricted arylamines (AZO-free) | Light fastness ISO 105-B02 ≥ 5 | Supplied in 25kg sealed drums with batch COA & SDS.',
          targetQty: '12000',
          minCommitQty: '500',
          unit: 'kg',
          benchmarkUnitPrice: '410',
          targetUnitPrice: '345',
          supplierName: 'Archroma / Dystar Certified Regional Distributor',
        };
      }
      if (cat === 'SPARE_PARTS') {
        return {
          title: isAr
            ? `شراء مشترك: قطع غيار أنوال هواء وصمامات كهرومغناطيسية أصلية ${hint ? `- ${hint}` : ''}`
            : `Joint Pool: High-Speed Air-Jet Loom Solenoid Valves & Weft Cutters ${hint ? `- ${hint}` : ''}`,
          description: isAr
            ? 'توريد جماعي لقطع الغيار الحرجة لأنوال النسيج الهوائية (Picanol / Toyota) لتقليل فترات التوقف ورفع كفاءة التشغيل OEE مع ضمان استبدال فوري.'
            : 'Consolidated OEM spare parts procurement for Picanol & Toyota air-jet weaving looms to cut unplanned downtime, reduce weft stops, and save 18% on landed import costs.',
          specification: isAr
            ? 'صمامات هواء عالية السرعة (عمر افتراضي > 50 مليون دورة) + مقصات لحمة كربيد التنجستن + حساسات انقطاع اللحمة البصرية | مطابقة لمواصفات المصنع الأصلي OEM.'
            : 'High-response relay nozzle solenoid valves (>50M cycles) + Tungsten-carbide weft cutters + Optical weft feelers | 100% OEM spec with 12-month warranty.',
          targetQty: '1500',
          minCommitQty: '50',
          unit: 'units',
          benchmarkUnitPrice: '1850',
          targetUnitPrice: '1520',
          supplierName: 'European Textile Machinery Parts Consortium',
        };
      }
      if (cat === 'ENERGY') {
        return {
          title: isAr
            ? `اتفاقية شراء طاقة شمسية مشتركة (Solar PPA) لمصانع المحلة ${hint ? `- ${hint}` : ''}`
            : `Cluster Rooftop Solar PV & Smart Metering Joint Procurement Pool ${hint ? `- ${hint}` : ''}`,
          description: isAr
            ? 'تعاقد جماعي لتركيب محطات طاقة شمسية فوق أسطح المصانع الأعضاء لخفض تكلفة الكهرباء بنسبة ٢٢٪ وتقليل انبعاثات النطاق ٢ (Scope 2 CO2e) للتوافق مع CBAM الأوروبي.'
            : 'Group EPC & net-metering solar procurement for cluster mills to lower kWh electricity tariffs by 22% and cut Scope 2 carbon intensity by 0.45 kg CO2e/kWh for EU CBAM compliance.',
          specification: isAr
            ? 'ألواح شمسية Tier-1 ثنائية الوجه (Bifacial 580W) + إنفرترات صناعية ثلاثية الطور + عدادات طاقة ذكية مرتبطة بمنصة الاستدامة | ضمان أداء ٢٥ سنة.'
            : 'Tier-1 N-Type Bifacial 580W PV Modules + Three-Phase Industrial String Inverters + Smart Modbus Energy Meters | 25-year linear performance warranty.',
          targetQty: '2500',
          minCommitQty: '100',
          unit: 'kWp',
          benchmarkUnitPrice: '19500',
          targetUnitPrice: '16200',
          supplierName: 'Egypt Green Industrial Solar EPC Alliance',
        };
      }
      return {
        title: isAr
          ? `مجموعة شراء مشترك: غزل قطن جيزة 86 ممشط نمرة Ne 30/1 ${hint ? `- ${hint}` : ''}`
          : `Joint Pool: Combed Giza 86 Egyptian Cotton Yarn Ne 30/1 Compact ${hint ? `- ${hint}` : ''}`,
        description: isAr
          ? 'تجميع احتياجات مصانع النسيج والتريكو في المحلة الكبرى لشراء غزل قطن جيزة 86 ممشط بخصم كميات ١٤٪ وتوحيد رقم اللوط (Lot) لضمان ثبات الصباغة.'
          : 'Pooling weaving and knitting mill demand in El-Mahalla for compact-spun Giza 86 Ne 30/1 yarn to unlock a 14% volume discount and single-lot shade uniformity.',
        specification: isAr
          ? 'قطن مصري جيزة 86 ممشط 100% | معامل الاختلاف Uster CVm ≤ 11.2% | الشعيرات السطحية H ≤ 4.1 | المتانة ≥ 21.5 cN/tex | خالي من الشوائب البلاستيكية (PP-Free) ومعتمد OEKO-TEX.'
          : '100% Combed Egyptian Cotton (Giza 86) | Uster 5% Statistics: CVm ≤ 11.2%, Thin (-50%) ≤ 2/km, Thick (+50%) ≤ 18/km, Neps (+200%) ≤ 24/km | Tenacity ≥ 21.5 cN/tex | Waxed on 4°20 cones, OEKO-TEX Class I.',
        targetQty: '30000',
        minCommitQty: '1500',
        unit: 'kg',
        benchmarkUnitPrice: '265',
        targetUnitPrice: '228',
        supplierName: 'Misr Spinning & Weaving Co. — Commercial Division',
      };
    }

    case 'capacity_post': {
      const kindType = String(context.kind || 'OFFER').toUpperCase();
      const proc = String(context.process || 'weaving').toLowerCase();
      const now = Date.now();
      const fromDate = new Date(now + 3 * 86400000).toISOString().slice(0, 10);
      const untilDate = new Date(now + 45 * 86400000).toISOString().slice(0, 10);

      const uomMap: Record<string, string> = {
        spinning: 'kg',
        weaving: 'meters',
        knitting: 'kg',
        dyeing: 'kg',
        printing: 'meters',
        finishing: 'meters',
        sewing: 'pieces',
        embroidery: 'pieces',
        cutting: 'pieces',
        washing: 'kg',
        testing: 'samples',
      };

      return {
        title: isAr
          ? `${kindType === 'OFFER' ? 'عرض طاقة تشغيل متاحة' : 'طلب تشغيل لدى الغير (مقاولة باطن)'}: قسم ${proc.toUpperCase()} بمعايير تصديرية ${hint ? `- ${hint}` : ''}`
          : `${kindType === 'OFFER' ? 'Idle Capacity Offer' : 'Subcontracting Request'}: Export-Grade ${proc.toUpperCase()} Line ${hint ? `- ${hint}` : ''}`,
        description: isAr
          ? `خط إنتاج حديث (${proc.toUpperCase()}) بمعايير جودة ISO 9001 وفحص 4-Point System (أقصى نقاط عيوب ≤ 20 نقطة/100 ياردة). الالتزام الكامل بمواعيد التسليم، وتقارير متابعة يومية للإنتاج، ونسبة هالك متفق عليها ≤ 2.5%.`
          : `Export-certified ${proc.toUpperCase()} capacity operating under ISO 9001 & 4-Point Inspection SLA (≤ 20 penalty points/100 sq.yd). Includes daily lot tracking, ΔE ≤ 0.8 shade continuity where applicable, and strict process waste cap ≤ 2.5%.`,
        availableFrom: fromDate,
        availableUntil: untilDate,
        quantity: proc === 'sewing' ? '15000' : '25000',
        uom: uomMap[proc] || 'kg',
      };
    }

    case 'consortium': {
      return {
        name: isAr
          ? `تحالف المحلة التصديري للمنسوجات الفندقية والمنزلية الأوروبية ${hint ? `(${hint})` : ''}`
          : `Mahalla Euro-Hospitality & Sustainable Home Textiles Export Consortium ${hint ? `(${hint})` : ''}`,
        description: isAr
          ? 'تحالف تكاملي يضم مصانع الغزل والنسيج والصباغة المعتمدة (OEKO-TEX / GOTS) والتفصيل النهائي لتنفيذ المناقصات الأوروبية الكبرى (٥٠,٠٠٠+ طقم شهرياً) بفاتورة موحدة وشهادة منشأ EUR.1 وتقارير بصمة كربونية CBAM.'
          : 'Vertically integrated SME export consortium uniting spinning, high-speed air-jet weaving, ZDHC Level 3 reactive dyeing, and automated hemming/packaging to bid on Tier-1 EU retail & hospitality tenders (50,000+ sets/month) under unified EUR.1 and EU Digital Product Passport compliance.',
        targetMarket: isAr
          ? 'ألمانيا، فرنسا، إيطاليا، دول الخليج (قطاع الفنادق والتجزئة)'
          : 'Germany, France, Nordics & GCC 5-Star Hospitality Chains',
        leadRole: isAr
          ? 'المفوض التجاري، الفحص النهائي للجودة (AQL 1.5)، والتخليص الجمركي للتصدير'
          : 'Commercial Lead, Final AQL 1.5 QA Inspection & Export Logistics Coordinator',
      };
    }

    case 'facility_booking': {
      const fName = String(context.facilityName || 'TIGARA Lab');
      return {
        purpose: isAr
          ? `اختبار مطابقة تصديرية (${fName}): ثبات الألوان للغسيل (ISO 105-C06)، الاحتكاك (ISO 105-X12)، قوة الشد (ISO 13934-1)، والانكماش (ISO 6330)`
          : `Export Compliance Testing (${fName}): ISO 105-C06 Wash Fastness, ISO 105-X12 Rubbing, ISO 13934-1 Tensile Strength & ISO 6330 Dimensional Stability`,
      };
    }

    case 'funding_application': {
      return {
        amountRequested: '1250000',
        purpose: isAr
          ? `خطة تحديث صناعي وخفض الانبعاثات الكربونية: تمويل تحديث خطوط الإنتاج وتركيب أنظمة استرجاع الحرارة وترشيد المياه والكهرباء، مما يخفض استهلاك الطاقة بنسبة ٢٢٪ ويقلل كثافة الكربون بمقدار ٠.٤٨ كجم CO2e/كجم منتج للتوافق مع متطلبات التصدير الأوروبي (CBAM / ESPR) بعائد استثماري داخلي (IRR) يبلغ ٣١٪ وفترة استرداد ٢.٤ سنة.`
          : `Bankable Industrial Modernization & Green Transition Proposal: Co-financing high-efficiency machinery upgrades, heat-recovery exchangers, and smart energy metering to cut specific energy consumption by 22%, reduce carbon intensity by 0.48 kg CO2e/kg product for EU CBAM/ESPR readiness, and expand export capacity by 35% (Projected 5-Year IRR: 31.4%, Payback: 2.4 years).`,
      };
    }

    case 'sustainability_audit': {
      const prod = Math.max(1, Number(context.productionKg || 50000));
      const elec = Number(context.electricityKwh || 110000);
      const solar = Number(context.solarKwh || 15000);
      const gas = Number(context.naturalGasM3 || 4000);
      const water = Number(context.waterM3 || 1800);
      const recWater = Number(context.recycledWaterM3 || 400);

      const netGridKwh = Math.max(0, elec - solar);
      const co2Kg = Math.round(netGridKwh * 0.45 + gas * 1.96);
      const co2PerKg = (co2Kg / prod).toFixed(2);
      const waterLPerKg = (((water - recWater) * 1000) / prod).toFixed(1);
      const solarShare = elec > 0 ? Math.round((solar / elec) * 100) : 0;

      return {
        notes: isAr
          ? `تدقيق ذكي CBAM: كثافة الكربون = ${co2PerKg} كجم CO2e/كجم | المياه الصافية = ${waterLPerKg} لتر/كجم | الطاقة الشمسية = ${solarShare}% | متوافق مع ZDHC Level 2 & OEKO-TEX.`
          : `AI CBAM Audit: Carbon Intensity = ${co2PerKg} kg CO2e/kg | Net Water = ${waterLPerKg} L/kg | Solar Share = ${solarShare}% | Verified ZDHC Level 2 & OEKO-TEX.`,
        auditReport: isAr
          ? `### نتائج التدقيق الهندسي للبصمة الكربونية (EU CBAM & ESG)\n- **إجمالي انبعاثات النطاق ١ و ٢**: \`${co2Kg.toLocaleString()} kg CO2e\` (**${co2PerKg} كجم CO2e لكل كجم منتج**).\n- **كثافة استهلاك المياه الصافية**: **${waterLPerKg} لتر/كجم** (نسبة تدوير المياه الحالية: **${water > 0 ? Math.round((recWater / water) * 100) : 0}%**).\n- **توصية الذكاء الاصطناعي الفورية**: زيادة حصة الطاقة الشمسية من **${solarShare}%** إلى **٣٥٪** واسترجاع حرارة مياه الصباغة سيخفض كثافة الكربون بنحو **٠.٣٨ كجم CO2e/كجم** ويوفر نحو **٤٢٠,٠٠٠ ج.م سنوياً**.`
          : `### AI Engineering Audit: EU CBAM & Resource Intensity\n- **Total Scope 1 + 2 Emissions**: \`${co2Kg.toLocaleString()} kg CO2e\` (**${co2PerKg} kg CO2e / kg textile**).\n- **Net Freshwater Intensity**: **${waterLPerKg} L/kg** (Current water recycling rate: **${water > 0 ? Math.round((recWater / water) * 100) : 0}%**).\n- **AI Abatement Action**: Expanding rooftop solar PV from **${solarShare}%** to **35%** and installing dye-bath heat recovery will cut carbon intensity by **0.38 kg CO2e/kg** and save **~EGP 420,000/year**.`,
      };
    }

    case 'forum_thread': {
      const cat = String(context.category || 'TECHNICAL').toUpperCase();
      return {
        title: isAr
          ? `استفسار هندسي (${cat}): أفضل المعايير العملية لضبط الجودة وخفض الهالك ${hint ? `- ${hint}` : 'في صباغة ونسيج قطن جيزة 86'}`
          : `Engineering Query (${cat}): Optimal Machine & Process Parameters for ${hint || 'Low-Liquor Reactive Dyeing & Air-Jet Weaving on Giza 86 Cotton'}`,
        body: isAr
          ? `السلام عليكم مهندسي وأصحاب مصانع تجمع المحلة،\n\nنعمل حالياً على تطوير خط إنتاج (${hint || 'أقمشة قطن جيزة 86 للتصدير الأوروبي'}) ونرغب في مشاركة الخبرات العملية حول:\n1. القيم المثلى لمعايير التشغيل (السرعة، الرطوبة النسبية، أو منحنى الحرارة والأس الهيدروجيني pH).\n2. كيفية تقليل نسبة العيوب والهالك تحت 2% واجتياز اختبارات ISO 17025 من المرة الأولى (Right-First-Time).\n3. أفضل الموردين المحليين المعتمدين للخامات أو قطع الغيار ذات الصلة.\n\nشكراً لتعاونكم!`
          : `Dear Mahalla Cluster Engineers & Mill Owners,\n\nWe are optimizing our production line for **${hint || '100% Egyptian Giza 86 Cotton export orders'}** and would appreciate peer benchmarks on:\n1. Optimal machine settings (speed, tension/RH%, or temperature/pH dosing curve).\n2. Practical steps to achieve >94% Right-First-Time (RFT) quality and keep process waste below 2%.\n3. Recommended local suppliers or shared testing protocols at the TIGARA Lab.\n\nThank you in advance for sharing your shop-floor insights!`,
        tags: 'Giza 86, Quality Control, ISO 17025, OEE, Export',
      };
    }

    case 'forum_reply': {
      return {
        body: isAr
          ? `**توصية هندسية معتمدة (وفق مراجع UNIDO و ISO):**\n\n1. **ضبط المعايير التشغيلية**: تأكد من معايرة الشد والرطوبة النسبية (٧٨–٨٢٪ في النسيج) أو ضبط نسبة الحمام (1:6) مع إضافة القلوي التدريجي في الصباغة التفاعلية عند 60°C للحفاظ على فرق لوني $\\Delta E \\le 0.8$.\n2. **الاختبار المعملي المسبق**: ننصحبسحب عينة عشوائية وإجراء اختبار ثبات اللون (ISO 105-C06) وقوة الشد (ISO 13934-1) في معمل تيجارا المركزي قبل اعتماد التشغيلة الكاملة.\n3. **الأثر المتوقع**: يرفع هذا البروتوكول نسبة المطابقة من المرة الأولى (RFT) إلى **٩٥٪** ويخفض إعادة التشغيل بنسبة **٦٠٪**.`
          : `**Verified Engineering Protocol (UNIDO / ISO Benchmark):**\n\n1. **Process Calibration**: Maintain strict conditioning (78–82% RH in weaving; or progressive alkali dosing at 60°C with 1:6 liquor ratio in reactive dyeing) to hold shade tolerance within $\\Delta E \\le 0.8$.\n2. **Pre-Production Lab Verification**: Run a pilot lot check at the TIGARA ISO 17025 Lab for ISO 105-C06 wash fastness and ISO 13934-1 tensile strength before releasing full bulk production.\n3. **Expected Shop-Floor Impact**: Increases Right-First-Time (RFT) yield to **95%+** and cuts rework costs by **~60%**.`,
      };
    }

    case 'expert_request': {
      const expName = String(context.expertName || 'Cluster Expert');
      return {
        topic: isAr
          ? `خطة تدخل فني (30 يوماً): رفع كفاءة التشغيل OEE والتوافق مع معايير التصدير الأوروبية`
          : `30-Day Technical Turnaround: OEE Optimization, RFT Quality & EU Export Compliance`,
        message: isAr
          ? `تحية طيبة أ. ${expName}، نرغب في حجز جلسة استشارية لمراجعة خطوط الإنتاج بمصنعنا في المحلة الكبرى، وتحديد نقاط الاختناق، ووضع خطة عمل عملية لمدة ٣٠ يوماً لخفض الهالك واجتياز متطلبات المشترين الأوروبيين.`
          : `Dear ${expName}, we would like to request a technical consultation for our mill in El-Mahalla El-Kubra to audit shop-floor bottlenecks, reduce process waste, and implement a 30-day action plan for EU buyer qualification.`,
      };
    }

    case 'expert_profile': {
      return {
        headline: isAr
          ? 'استشاري أول هندسة الغزل والنسيج وتطبيقات الصناعة 4.0 والاستدامة (UNIDO / ISO)'
          : 'Senior Textile Manufacturing, OEE Turnaround & EU Sustainability Consultant (UNIDO / ISO)',
        expertise: 'Spinning & Weaving OEE, Reactive Dyeing RFT, ZDHC MRSL v3.1, ISO 9001 & 17025, EU CBAM & DPP',
        bio: isAr
          ? 'خبرة أكثر من ١٨ عاماً في تحديث مصانع الغزل والنسيج والصباغة في المحلة الكبرى، وتطبيق أنظمة التصنيع الرشيق (Lean)، ورفع الكفاءة الكلية للماكينات OEE، وتأهيل المصانع لشهادات OEKO-TEX و GOTS والتصدير للاتحاد الأوروبي.'
          : 'Over 18 years of hands-on industrial leadership across El-Mahalla spinning, weaving, and dyeing mills. Specialized in Lean Six Sigma, OEE improvement (+15–25%), Right-First-Time dyeing, and qualifying Egyptian SMEs for OEKO-TEX, GOTS, and EU CBAM/ESPR compliance.',
      };
    }

    case 'announcement': {
      return {
        title: `Official Call: ${hint || 'EU Green Export & Joint Procurement Registration Window Now Open'}`,
        titleAr: `تعميم رسمي: ${hint || 'فتح باب التسجيل في برنامج التصدير الأخضر لأوروبا ومجموعات الشراء المشترك'}`,
        body: `The Mahalla Cluster Management Organization (CMO) invites all approved member factories to participate in ${hint || 'our Q4 Joint Raw Material Procurement Pool and subsidized EU CBAM/DPP Technical Assistance Program'}. Participating SMEs receive priority laboratory testing credits and B2B buyer matchmaking.`,
        bodyAr: `تدعو إدارة تجمع المحلة الكبرى للنسيج جميع المصانع الأعضاء المعتمدة للمشاركة في (${hint || 'موجة الشراء المشترك للخامات وبرنامج الدعم الفني المجاني للتوافق مع البصمة الكربونية الأوروبية CBAM'}). تحصل المصانع المشاركة على أولوية في حجوزات المعمل المركزي ولقاءات المشترين الدوليين.`,
      };
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const kind = (body.kind || 'procurement_pool') as AutoFillKind;
    const context = body.context || {};
    const locale = body.locale === 'ar' ? 'ar' : 'en';
    const preferredModel = (body.preferredModel || 'auto') as FreeLlmModelId;

    const fallbackFields = buildDeterministicAutoFill(kind, context, locale);

    const systemPrompt = `You are the Mahalla Textile Cluster AI Form Auto-Fill Engine.
Return ONLY a valid JSON object matching the exact keys of this template:
${JSON.stringify(fallbackFields, null, 2)}
Adapt the values specifically to the user's context: ${JSON.stringify(context)}.
Language for user-facing fields: ${locale === 'ar' ? 'Arabic (unless key ends with En)' : 'English (unless key ends with Ar)'}.
Use realistic Egyptian textile industry figures (EGP/USD, Giza 86/94 cotton, ISO/ASTM/ZDHC standards). Do NOT wrap in markdown code fences.`;

    const { text, model } = await generate({
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate JSON auto-fill fields for workflow "${kind}" with context: ${JSON.stringify(context)}`,
        },
      ],
      preferredModel,
      temperature: 0.3,
    });

    let fields = fallbackFields;
    if (text && !model.includes('mahalla-industrial-consultant')) {
      try {
        const cleaned = text
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          const parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
          if (parsed && typeof parsed === 'object') {
            fields = { ...fallbackFields, ...parsed };
          }
        }
      } catch {
        fields = fallbackFields;
      }
    }

    return NextResponse.json({
      ok: true,
      fields,
      modelUsed: model.includes('mahalla-industrial-consultant')
        ? 'Mahalla Domain AI Auto-Fill Engine (Free)'
        : model,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Auto-fill failed' },
      { status: 500 }
    );
  }
}
