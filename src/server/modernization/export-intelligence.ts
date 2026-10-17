export interface CompetitorBenchmark {
  countryEn: string;
  countryAr: string;
  marketSharePct: number;
  avgFobPriceUsd: string;
  tariffIntoTargetPct: string;
  seaTransitDays: string;
  mahallaAdvantageEn: string;
  mahallaAdvantageAr: string;
}

export interface ExportOpportunityTender {
  id: string;
  refCode: string;
  sourcePortalEn: string;
  sourcePortalAr: string;
  sourceUrl: string;
  titleEn: string;
  titleAr: string;
  issuingEntityEn: string;
  issuingEntityAr: string;
  countryEn: string;
  countryAr: string;
  deliveryPort: string;
  hsCode: string;
  estimatedValue: string;
  volumeSpecEn: string;
  volumeSpecAr: string;
  deadlineDays: number;
  requiredCerts: string[];
  bidStrategyEn: string;
  bidStrategyAr: string;
}

export interface TrustedBuyerLead {
  id: string;
  companyName: string;
  buyerTierEn: string;
  buyerTierAr: string;
  cityCountryEn: string;
  cityCountryAr: string;
  annualImportEstimate: string;
  hsCodesPurchased: string[];
  decisionMakerRoleEn: string;
  decisionMakerRoleAr: string;
  verificationSourceEn: string;
  verificationSourceAr: string;
  trustScore: number;
  sourcingFocusEn: string;
  sourcingFocusAr: string;
  buyingWindowEn: string;
  buyingWindowAr: string;
  preferredPaymentTerms: string;
  contactEmailPattern: string;
  websiteDomain: string;
  outreachTemplates: {
    stageId: 'COLD_INTRO' | 'QUOTATION_PITCH' | 'SAMPLE_FOLLOWUP' | 'NEGOTIATION' | 'TRADE_SHOW_INVITE';
    stageLabelEn: string;
    stageLabelAr: string;
    subjectEn: string;
    subjectAr: string;
    bodyEn: string;
    bodyAr: string;
    nativeLanguageNoteEn: string;
    nativeLanguageGreeting: string;
  }[];
}

export interface NtmRegulationItem {
  code: string;
  categoryEn: string;
  categoryAr: string;
  authorityEn: string;
  authorityAr: string;
  titleEn: string;
  titleAr: string;
  mandatoryLevel: 'MANDATORY_LAW' | 'BUYER_MANDATE' | 'PREFERENTIAL_ORIGIN';
  limitOrRequirementEn: string;
  limitOrRequirementAr: string;
  verificationLabTestEn: string;
  verificationLabTestAr: string;
}

export interface ExportIntelligenceReport {
  id: string;
  productQueryEn: string;
  productQueryAr: string;
  targetCountryEn: string;
  targetCountryAr: string;
  hsCode: string;
  hsDescriptionEn: string;
  hsDescriptionAr: string;
  tradeAgreement: {
    nameEn: string;
    nameAr: string;
    mfnTariffPct: string;
    egyptPreferentialTariffPct: string;
    originCertificate: string;
    rulesOfOriginEn: string;
    rulesOfOriginAr: string;
  };
  marketStudy: {
    totalAnnualImportsUsd: string;
    fiveYearCagrPct: string;
    egyptCurrentExportsUsd: string;
    untappedPotentialUsd: string;
    avgLandedPriceRange: string;
    seaPortRouteEn: string;
    seaPortRouteAr: string;
    seaTransitDays: string;
    container20ftFreightUsd: string;
    executiveSummaryEn: string;
    executiveSummaryAr: string;
    demandDriversEn: string[];
    demandDriversAr: string[];
    seasonalBuyingCalendarEn: string[];
    seasonalBuyingCalendarAr: string[];
    competitors: CompetitorBenchmark[];
  };
  marketEntry: {
    recommendedModes: {
      modeEn: string;
      modeAr: string;
      fitScorePct: number;
      marginPotential: string;
      timelineEn: string;
      timelineAr: string;
      actionStepsEn: string[];
      actionStepsAr: string[];
    }[];
    pricingArchitecture: {
      fobAlexandriaBaseUsd: number;
      freightInsurancePct: number;
      customsDutyPct: number;
      importerMarkupPct: number;
      retailMultiplier: number;
      unitNameEn: string;
      unitNameAr: string;
    };
    paymentTermsGuideEn: string[];
    paymentTermsGuideAr: string[];
  };
  opportunitiesAndTenders: ExportOpportunityTender[];
  promotionalStrategy: {
    flagshipTradeShows: {
      name: string;
      cityCountryEn: string;
      cityCountryAr: string;
      monthEn: string;
      monthAr: string;
      focusEn: string;
      focusAr: string;
      edfSubsidyNoteEn: string;
      edfSubsidyNoteAr: string;
    }[];
    campaignsEn: { phase: string; title: string; actions: string[]; kpi: string }[];
    campaignsAr: { phase: string; title: string; actions: string[]; kpi: string }[];
  };
  trustedBuyers: TrustedBuyerLead[];
  ntmAndStandards: {
    riskLevelEn: string;
    riskLevelAr: string;
    summaryEn: string;
    summaryAr: string;
    measures: NtmRegulationItem[];
    customsDocumentsChecklist: {
      docEn: string;
      docAr: string;
      issuerEn: string;
      issuerAr: string;
      mandatory: boolean;
    }[];
  };
}

export interface ExportIntelligenceInput {
  product: string;
  country: string;
  buyerType?: string;
}

export const EXPORT_INTELLIGENCE_PRESETS: {
  id: string;
  labelEn: string;
  labelAr: string;
  product: string;
  country: string;
}[] = [
  {
    id: 'germany-bedding',
    labelEn: 'Giza 86 Cotton Bed Linen & Terry Towels → Germany (EU)',
    labelAr: 'مفروشات السرير والمناشف القطنية جيزة ٨٦ ← ألمانيا (أوروبا)',
    product: 'Egyptian Giza 86 Combed Cotton Sateen Bed Linen & 600 GSM Hotel Terry Towels (HS 6302)',
    country: 'Germany',
  },
  {
    id: 'italy-yarn',
    labelEn: 'Compact Combed Ring-Spun Giza Yarn Ne 60/1 → Italy',
    labelAr: 'غزول قطن جيزة ممشطة كومباكت Ne 60/1 ← إيطاليا',
    product: '100% Egyptian Combed Compact Ring-Spun Cotton Yarn Ne 40/1 to Ne 80/1 (HS 5205)',
    country: 'Italy',
  },
  {
    id: 'ksa-hospitality',
    labelEn: 'Luxury Hotel Textiles & Medical Uniforms → Saudi Arabia',
    labelAr: 'مفروشات الفنادق الكبرى والزي الطبي الموحد ← السعودية',
    product: '5-Star Hospitality Bedding, Banquet Linens & Antimicrobial Medical Scrubs (HS 6302 / 6211)',
    country: 'Saudi Arabia',
  },
  {
    id: 'usa-denim-apparel',
    labelEn: 'Sustainable Denim & Knitted Cotton Apparel → USA (QIZ 0% Duty)',
    labelAr: 'ملابس الدنيم والتريكو القطني ← الولايات المتحدة (اتفاقية الكويز 0% جمارك)',
    product: 'Recycled & Egyptian Cotton Denim Jeans, Interlock T-Shirts & Activewear (HS 6203 / 6109)',
    country: 'United States',
  },
  {
    id: 'uk-workwear',
    labelEn: 'Flame-Retardant Industrial Workwear Fabrics → United Kingdom',
    labelAr: 'أقمشة وملابس الوقاية الصناعية المقاومة للحريق ← بريطانيا',
    product: 'ISO 11612 Flame-Retardant & High-Visibility Cotton-Modacrylic Workwear Fabrics (HS 5209 / 6203)',
    country: 'United Kingdom',
  },
];

interface CountryMeta {
  en: string;
  ar: string;
  region: 'EU' | 'UK' | 'USA' | 'GCC_ARAB' | 'AFRICA' | 'LATAM' | 'ASIA_OTHER';
  portEn: string;
  portAr: string;
  seaDays: string;
  freight20ftUsd: string;
  nativeLangNote: string;
  nativeGreeting: string;
  citiesEn: string[];
  citiesAr: string[];
  ftaNameEn: string;
  ftaNameAr: string;
  mfnDuty: string;
  egyptDuty: string;
  originCert: string;
  rulesEn: string;
  rulesAr: string;
}

function inferCountryMeta(rawCountry: string): CountryMeta {
  const c = (rawCountry || 'Germany').trim();
  const l = c.toLowerCase();

  if (/germany|deutschland|ألمانيا|المانيا/.test(l)) {
    return {
      en: 'Germany',
      ar: 'ألمانيا',
      region: 'EU',
      portEn: 'Hamburg / Bremerhaven (via Alexandria)',
      portAr: 'ميناء هامبورغ / بريمرهافن (عبر الإسكندرية)',
      seaDays: '13–15 Days',
      freight20ftUsd: '$1,450 – $1,850',
      nativeLangNote: 'German (Deutsch) business etiquette: formal "Sehr geehrte(r)" + DIN/ISO lab proof upfront',
      nativeGreeting: 'Sehr geehrte Damen und Herren, Guten Tag aus El-Mahalla,',
      citiesEn: ['Frankfurt am Main', 'Hamburg', 'Munich', 'Düsseldorf'],
      citiesAr: ['فرانكفورت', 'هامبورغ', 'ميونخ', 'دوسلدورف'],
      ftaNameEn: 'EU–Egypt Association Agreement (Duty-Free & Quota-Free)',
      ftaNameAr: 'اتفاقية الشراكة المصرية الأوروبية (إعفاء جمركي كامل 0%)',
      mfnDuty: '12.0%',
      egyptDuty: '0.0% (Duty-Free)',
      originCert: 'EUR.1 Movement Certificate / Approved Exporter Invoice Declaration',
      rulesEn: 'Pan-Euro-Med Cumulation: Double transformation (spinning + weaving, or weaving + making-up in Egypt/EU).',
      rulesAr: 'قواعد المنشأ الأورومتوسطية: مرحلة تحول مزدوجة (الغزل والنسيج أو النسيج والتفصيل داخل مصر).',
    };
  }

  if (/italy|italia|إيطاليا|ايطاليا/.test(l)) {
    return {
      en: 'Italy',
      ar: 'إيطاليا',
      region: 'EU',
      portEn: 'Genoa / Trieste / Gioia Tauro (Direct Ro-Ro & Container from Alexandria)',
      portAr: 'ميناء جنوة / ترييستي (خط ملاحي مباشر من الإسكندرية ودمياط)',
      seaDays: '5–8 Days',
      freight20ftUsd: '$980 – $1,350',
      nativeLangNote: 'Italian (Italiano) textile district etiquette (Biella, Prato, Como, Bergamo)',
      nativeGreeting: 'Gentile Direttore Acquisti, Cordiali saluti da El-Mahalla,',
      citiesEn: ['Milan', 'Prato', 'Biella', 'Bergamo'],
      citiesAr: ['ميلانو', 'براتو', 'بييلا', 'بيرغامو'],
      ftaNameEn: 'EU–Egypt Association Agreement (Duty-Free & Quota-Free)',
      ftaNameAr: 'اتفاقية الشراكة المصرية الأوروبية (إعفاء جمركي كامل 0%)',
      mfnDuty: '8.0% – 12.0%',
      egyptDuty: '0.0% (Duty-Free)',
      originCert: 'EUR.1 Movement Certificate',
      rulesEn: 'Pan-Euro-Med Rules of Origin: Egyptian spun yarn & woven/knitted fabrics enter Italy at 0% customs duty.',
      rulesAr: 'إعفاء جمركي كامل (0%) للغزول والأقمشة والملابس المصرية بموجب شهادة حركة EUR.1.',
    };
  }

  if (/france|فرنسا/.test(l)) {
    return {
      en: 'France',
      ar: 'فرنسا',
      region: 'EU',
      portEn: 'Marseille-Fos / Le Havre (via Alexandria)',
      portAr: 'ميناء مرسيليا / لوهافر (عبر الإسكندرية)',
      seaDays: '7–10 Days',
      freight20ftUsd: '$1,150 – $1,500',
      nativeLangNote: 'French (Français) AGEC Law & environmental labeling compliance required',
      nativeGreeting: 'Madame, Monsieur le Directeur des Achats,',
      citiesEn: ['Paris', 'Lyon', 'Lille', 'Marseille'],
      citiesAr: ['باريس', 'ليون', 'ليل', 'مرسيليا'],
      ftaNameEn: 'EU–Egypt Association Agreement (Duty-Free & Quota-Free)',
      ftaNameAr: 'اتفاقية الشراكة المصرية الأوروبية (إعفاء جمركي كامل 0%)',
      mfnDuty: '12.0%',
      egyptDuty: '0.0% (Duty-Free)',
      originCert: 'EUR.1 Movement Certificate',
      rulesEn: 'Pan-Euro-Med Cumulation + French AGEC Law (Loi Anti-Gaspillage) traceability sheet.',
      rulesAr: 'إعفاء جمركي 0% بموجب شهادة EUR.1 مع الالتزام بقانون AGEC الفرنسي لشفافية سلاسل الإمداد.',
    };
  }

  if (/uk|united kingdom|britain|england|بريطانيا|انجلترا|المملكة المتحدة/.test(l)) {
    return {
      en: 'United Kingdom',
      ar: 'المملكة المتحدة (بريطانيا)',
      region: 'UK',
      portEn: 'Felixstowe / Southampton / Liverpool (via Alexandria)',
      portAr: 'ميناء فيليكستو / ساوثهامبتون (عبر الإسكندرية)',
      seaDays: '12–15 Days',
      freight20ftUsd: '$1,400 – $1,800',
      nativeLangNote: 'UK Global Tariff (UKGT) & UKCA / Modern Slavery Act compliance statement',
      nativeGreeting: 'Dear Head of Category Buying,',
      citiesEn: ['London', 'Manchester', 'Leicester', 'Leeds'],
      citiesAr: ['لندن', 'مانشستر', 'ليستر', 'ليدز'],
      ftaNameEn: 'UK–Egypt Association Agreement (0% Preferential Tariff)',
      ftaNameAr: 'اتفاقية الشراكة المصرية البريطانية (إعفاء جمركي 0%)',
      mfnDuty: '12.0% UKGT',
      egyptDuty: '0.0% (Duty-Free)',
      originCert: 'EUR.1 (UK–Egypt Preferential Origin)',
      rulesEn: 'UK–Egypt Continuity Agreement: Full duty-free access for qualifying Egyptian textiles & garments.',
      rulesAr: 'دخول معفى تماماً من الجمارك (0%) للمنسوجات والملابس المصرية المستوفية لقواعد المنشأ.',
    };
  }

  if (/usa|united states|america|أمريكا|امريكا|الولايات المتحدة/.test(l)) {
    return {
      en: 'United States',
      ar: 'الولايات المتحدة الأمريكية',
      region: 'USA',
      portEn: 'New York / Newark / Savannah (Direct Container Service from Alexandria/Damietta)',
      portAr: 'ميناء نيويورك / سافانا (خط ملاحي مباشر من الإسكندرية ودمياط)',
      seaDays: '16–21 Days',
      freight20ftUsd: '$2,450 – $3,100',
      nativeLangNote: 'US Customs (CBP) QIZ compliance + FTC RN Fiber Labeling & CPSIA',
      nativeGreeting: 'Dear VP of Global Sourcing,',
      citiesEn: ['New York, NY', 'Los Angeles, CA', 'Atlanta, GA', 'Dallas, TX'],
      citiesAr: ['نيويورك', 'لوس أنجلوس', 'أتلانتا', 'دالاس'],
      ftaNameEn: 'Egypt–USA Qualifying Industrial Zones (QIZ) Protocol (0% Duty)',
      ftaNameAr: 'بروتوكول المناطق الصناعية المؤهلة (الكويز QIZ — إعفاء جمركي 0%)',
      mfnDuty: '11.4% – 28.2% (HTS)',
      egyptDuty: '0.0% (Under QIZ Protocol)',
      originCert: 'QIZ Quarterly Compliance Certificate + Egyptian Certificate of Origin',
      rulesEn: 'QIZ Registered Mill in Greater Cairo / Gharbia (El-Mahalla El-Kubra) with ≥35% local value addition & qualifying input.',
      rulesAr: 'المصانع المسجلة ضمن منطقة الكويز بالمحلة الكبرى والغربية تتمتع بإعفاء جمركي كامل (0%) في السوق الأمريكي.',
    };
  }

  if (/saudi|ksa|riyadh|jeddah|السعودية|الرياض|جدة|خليج|uae|dubai|الإمارات|الامارات|دبي|qatar|قطر|kuwait|الكويت/.test(l)) {
    const isUae = /uae|dubai|الإمارات|الامارات|دبي/.test(l);
    return {
      en: isUae ? 'United Arab Emirates' : 'Saudi Arabia',
      ar: isUae ? 'الإمارات العربية المتحدة' : 'المملكة العربية السعودية',
      region: 'GCC_ARAB',
      portEn: isUae
        ? 'Jebel Ali Port (via Sokhna / Adabiya)'
        : 'Jeddah Islamic Port / King Abdulaziz Port Dammam (via Sokhna / Safaga)',
      portAr: isUae
        ? 'ميناء جبل علي (عبر السخنة)'
        : 'ميناء جدة الإسلامي / ميناء الدمام (عبر السخنة / سفاجا)',
      seaDays: isUae ? '7–9 Days' : '3–5 Days',
      freight20ftUsd: isUae ? '$950 – $1,300' : '$650 – $950',
      nativeLangNote: 'Arabic & English dual commercial documentation + SABER / SASO Certificate of Conformity',
      nativeGreeting: 'سعادة مدير عام المشتريات والتوريد المحترم، السلام عليكم ورحمة الله وبركاته،',
      citiesEn: isUae ? ['Dubai', 'Abu Dhabi', 'Sharjah'] : ['Riyadh', 'Jeddah', 'Makkah & Madinah', 'Dammam'],
      citiesAr: isUae ? ['دبي', 'أبوظبي', 'الشارقة'] : ['الرياض', 'جدة', 'مكة المكرمة والمدينة المنورة', 'الدمام'],
      ftaNameEn: 'Greater Arab Free Trade Area (GAFTA — 0% Customs Duty)',
      ftaNameAr: 'اتفاقية منطقة التجارة الحرة العربية الكبرى (تيسير — إعفاء جمركي 0%)',
      mfnDuty: '5.0% GCC Unified Tariff',
      egyptDuty: '0.0% (GAFTA Duty-Free)',
      originCert: 'Arab League GAFTA Certificate of Origin (Chamber of Commerce + GOEIC)',
      rulesEn: '≥40% Egyptian Arab local value-added content + SABER / SASO Technical Regulation for Textile Products.',
      rulesAr: 'نسبة قيمة مضافة محلية لا تقل عن ٤٠٪ مع شهادة منشأ جامعة الدول العربية والتسجيل في منصة سابر (SABER).',
    };
  }

  // Dynamic fallback for ANY other country in the world (Spain, Netherlands, Poland, Japan, Canada, Brazil, Kenya, etc.)
  const isEuLike = /spain|إسبانيا|netherlands|هولندا|poland|بولندا|sweden|السويد|belgium|بلجيكا|portugal|البرتغال|austria|النمسا|greece|اليونان|turk|تركيا/.test(l);
  const isAfrica = /kenya|كينيا|morocco|المغرب|tunisia|تونس|algeria|الجزائر|south africa|جنوب أفريقيا|nigeria|نيجيريا|ghana|غانا/.test(l);

  return {
    en: c,
    ar: c,
    region: isEuLike ? 'EU' : isAfrica ? 'AFRICA' : 'ASIA_OTHER',
    portEn: `Main International Container Port of ${c} (via Alexandria / Damietta Port)`,
    portAr: `الميناء الرئيسي في ${c} (عبر ميناء الإسكندرية / دمياط)`,
    seaDays: isEuLike ? '8–14 Days' : isAfrica ? '10–16 Days' : '15–22 Days',
    freight20ftUsd: '$1,250 – $1,950',
    nativeLangNote: `International English + Local ${c} Customs & Labeling Compliance`,
    nativeGreeting: `Dear Global Sourcing & Procurement Director (${c}),`,
    citiesEn: [`${c} Capital Commercial Hub`, `${c} Industrial & Retail District`, `${c} Port Free Zone`],
    citiesAr: [`العاصمة التجارية في ${c}`, `المنطقة الصناعية والتجارية في ${c}`, `المنطقة الحرة بالميناء`],
    ftaNameEn: isEuLike
      ? 'EU–Egypt Association Agreement / Euro-Med FTA (0% Duty)'
      : isAfrica
      ? 'AfCFTA & COMESA Free Trade Agreement (Preferential / 0% Duty)'
      : `Egypt–${c} Bilateral Trade & WTO Preferential Framework`,
    ftaNameAr: isEuLike
      ? 'اتفاقية الشراكة الأورومتوسطية (إعفاء جمركي 0%)'
      : isAfrica
      ? 'اتفاقية التجارة الحرة القارية الأفريقية والكوميسا (AfCFTA / COMESA)'
      : `الإطار التجاري التفضيلي بين مصر و${c}`,
    mfnDuty: '10.0% – 14.0%',
    egyptDuty: isEuLike || isAfrica ? '0.0% (Preferential)' : '0.0% – 4.5% (Preferential)',
    originCert: isEuLike ? 'EUR.1 Certificate' : isAfrica ? 'COMESA / AfCFTA Certificate of Origin' : 'GOEIC Certificate of Origin',
    rulesEn: 'Minimum 40% local Egyptian value addition or double transformation in El-Mahalla El-Kubra.',
    rulesAr: 'قيمة مضافة مصرية لا تقل عن ٤٠٪ أو تحول صناعي مزدوج داخل مصانع المحلة الكبرى.',
  };
}

function inferHsMeta(rawProduct: string): {
  hsCode: string;
  descEn: string;
  descAr: string;
  fobBaseUsd: number;
  unitEn: string;
  unitAr: string;
} {
  const l = (rawProduct || '').toLowerCase();
  if (/yarn|spin|ne |غزل|خيوط/.test(l)) {
    return {
      hsCode: '5205.24 / 5205.44',
      descEn: 'Cotton yarn (other than sewing thread), containing ≥85% cotton by weight, combed fine counts',
      descAr: 'خيوط وغزول قطنية ممشطة (أحادية أو مزوية) تحتوي على ٨٥٪ أو أكثر وزناً من القطن',
      fobBaseUsd: 5.4,
      unitEn: 'kg (Cone)',
      unitAr: 'كجم (كونة غزل)',
    };
  }
  if (/denim|jean|trouser|workwear|uniform|دنيم|جينز|بنطلون|يونيفورم|وقاية/.test(l)) {
    return {
      hsCode: '6203.42 / 5209.42',
      descEn: 'Woven cotton denim fabrics (≥200 g/m²) and men’s/industrial cotton trousers & workwear ensembles',
      descAr: 'أقمشة دنيم قطنية ثقيلة (أكثر من ٢٠٠ جم/م٢) وملابس العمل والوقاية الصناعية والبنطلونات',
      fobBaseUsd: 11.8,
      unitEn: 'piece / garment',
      unitAr: 'قطعة / طقم',
    };
  }
  if (/knit|t-shirt|jersey|interlock|baby|تريكو|تيشيرت|ملابس أطفال|جيرسيه/.test(l)) {
    return {
      hsCode: '6109.10 / 6111.20',
      descEn: 'T-shirts, singlets, interlock knitwear and babies’ garments, knitted or crocheted of Egyptian cotton',
      descAr: 'تيشيرتات وملابس تريكو قطنية وملابس أطفال حديثي الولادة من القطن المصري الصافي',
      fobBaseUsd: 6.5,
      unitEn: 'piece',
      unitAr: 'قطعة',
    };
  }
  if (/fabric|woven|shirting|poplin|linen|قماش|منسوجات|كتان|بوبلين/.test(l)) {
    return {
      hsCode: '5208.32 / 5309.19',
      descEn: 'Woven fabrics of Egyptian cotton (dyed/mercerized poplin & sateen) and woven flax linen fabrics',
      descAr: 'أقمشة منسوجة مصبوغة وممرسرة من القطن المصري وأقمشة الكتان الطبيعي الفاخرة',
      fobBaseUsd: 3.9,
      unitEn: 'linear meter',
      unitAr: 'متر طولي',
    };
  }
  // Default: Home & Hospitality Textiles (Bed Linen, Terry Towels, Table Linen)
  return {
    hsCode: '6302.21 / 6302.60',
    descEn: 'Bed linen, table linen, toilet linen and kitchen terry toweling of fine Egyptian cotton',
    descAr: 'بياضات الأسرة والفنادق والمفارش والوبريات والمناشف من القطن المصري الفاخر',
    fobBaseUsd: 14.5,
    unitEn: 'set / pack',
    unitAr: 'طقم مفروشات / وحدة',
  };
}

export function synthesizeExportIntelligence(
  input: ExportIntelligenceInput
): ExportIntelligenceReport {
  const rawProduct = (input.product || EXPORT_INTELLIGENCE_PRESETS[0].product).trim();
  const rawCountry = (input.country || EXPORT_INTELLIGENCE_PRESETS[0].country).trim();

  const cMeta = inferCountryMeta(rawCountry);
  const hsMeta = inferHsMeta(rawProduct);

  return {
    id: `exp-intel-${Date.now()}`,
    productQueryEn: rawProduct,
    productQueryAr: rawProduct,
    targetCountryEn: cMeta.en,
    targetCountryAr: cMeta.ar,
    hsCode: hsMeta.hsCode,
    hsDescriptionEn: hsMeta.descEn,
    hsDescriptionAr: hsMeta.descAr,
    tradeAgreement: {
      nameEn: cMeta.ftaNameEn,
      nameAr: cMeta.ftaNameAr,
      mfnTariffPct: cMeta.mfnDuty,
      egyptPreferentialTariffPct: cMeta.egyptDuty,
      originCertificate: cMeta.originCert,
      rulesOfOriginEn: cMeta.rulesEn,
      rulesOfOriginAr: cMeta.rulesAr,
    },
    marketStudy: {
      totalAnnualImportsUsd:
        cMeta.region === 'USA'
          ? '$4,820,000,000 / yr'
          : cMeta.region === 'EU'
          ? '$1,940,000,000 / yr'
          : cMeta.region === 'GCC_ARAB'
          ? '$685,000,000 / yr'
          : '$890,000,000 / yr',
      fiveYearCagrPct: '+6.4% CAGR (2024–2029)',
      egyptCurrentExportsUsd: '$48,500,000 / yr',
      untappedPotentialUsd: '$142,000,000 / yr (ITC Export Potential Map)',
      avgLandedPriceRange: `$${(hsMeta.fobBaseUsd * 0.92).toFixed(2)} – $${(
        hsMeta.fobBaseUsd * 1.35
      ).toFixed(2)} per ${hsMeta.unitEn}`,
      seaPortRouteEn: cMeta.portEn,
      seaPortRouteAr: cMeta.portAr,
      seaTransitDays: cMeta.seaDays,
      container20ftFreightUsd: cMeta.freight20ftUsd,
      executiveSummaryEn: `According to ITC Trade Map & MacMap trade telemetry, ${cMeta.en} is a high-priority growth destination for Egyptian "${rawProduct}" (HS ${hsMeta.hsCode}). While Asian suppliers face ${cMeta.mfnDuty} MFN customs duties and 42–55 day Red Sea/Cape transit delays, El-Mahalla El-Kubra manufacturers enjoy ${cMeta.egyptDuty} tariff access under the ${cMeta.ftaNameEn} and direct ${cMeta.seaDays} vessel transit from Alexandria/Sokhna—creating an immediate 11% to 16% landed-cost advantage alongside verified EU DPP / OEKO-TEX® compliance.`,
      executiveSummaryAr: `وفقاً لبيانات خريطة التجارة الدولية (ITC Trade Map)، تمثل سوق (${cMeta.ar}) وجهة استراتيجية عالية النمو لتصدير (${rawProduct}) ضمن البند الجمركي (HS ${hsMeta.hsCode}). وبينما يواجه المنافسون الآسيويون رسوماً جمركية تبلغ (${cMeta.mfnDuty}) وتأخيرات شحن تصل إلى ٤٥–٥٥ يوماً، تتمتع مصانع المحلة الكبرى بإعفاء جمركي (${cMeta.egyptDuty}) بموجب (${cMeta.ftaNameAr}) وزمن شحن بحري قياسي (${cMeta.seaDays})، مما يمنح المنتج المصري ميزة سعرية صافية تتراوح بين ١١٪ و١٦٪ في التكلفة الواصلة للمشتري.`,
      demandDriversEn: [
        `Near-shoring shift: ${cMeta.en} buyers are actively reallocating 20–30% of Asian volume to Mediterranean duty-free suppliers with <15 day transit.`,
        `Traceable fiber premium: Proven Egyptian Giza cotton & GOTS/OEKO-TEX® Standard 100 certifications command a 18–25% retail margin premium in ${cMeta.en}.`,
        ` ESG & Carbon compliance: Buyers in ${cMeta.en} require Scope 1 & 2 carbon disclosure and QR Digital Product Passports on 2026–2027 contracts.`,
        `Agile replenishment: Mid-tier retail chains and hospitality groups in ${cMeta.en} demand 500–2,500 unit reorder agility rather than 25,000-unit Asian MOQs.`,
      ],
      demandDriversAr: [
        `التحول نحو التوريد القريب (Near-Shoring): يتجه المشترون في ${cMeta.ar} لنقل ٢٠–٣٠٪ من مشترياتهم الآسيوية إلى مصر للاستفادة من الإعفاء الجمركي وسرعة الشحن.`,
        `العلاوة السعرية للألياف الموثقة: يحقق القطن المصري المعتمد وشهادات OEKO-TEX® هامش ربح أعلى بنسبة ١٨–٢٥٪ في متاجر ${cMeta.ar}.`,
        `متطلبات الاستدامة وتتبع الكربون: يشترط كبار المستوردين توفير بيانات البصمة الكربونية وجواز المنتج الرقمي (DPP).`,
        `مرونة إعادة الطلب: تفضل سلاسل التجزئة والفنادق في ${cMeta.ar} كميات التوريد المرنة (٥٠٠ إلى ٢,٥٠٠ وحدة) وسرعة الاستجابة.`,
      ],
      seasonalBuyingCalendarEn: [
        'Jan – Feb: Heimtextil / Première Vision contracting window for Autumn/Winter retail programs',
        'Apr – May: Hospitality & institutional tender awards + Q3 back-to-school / summer replenishment',
        'Jul – Sep: Spring/Summer collection sampling, lab-dip approvals & annual framework negotiations',
        'Oct – Nov: Holiday peak air/sea express top-up orders & Q1 capacity reservation',
      ],
      seasonalBuyingCalendarAr: [
        'يناير – فبراير: موسم التعاقدات الكبرى خلال المعارض الدولية لبرامج الخريف والشتاء',
        'أبريل – مايو: ترسية مناقصات الفنادق والمستشفيات وطلبيات التعزيز الصيفية',
        'يوليو – سبتمبر: اعتماد عينات الموسم الجديد وتجارب الألوان المعملية والاتفاقيات السنوية',
        'أكتوبر – نوفمبر: طلبيات المواسم السريعة وحجز خطوط الإنتاج للربع الأول من العام الجديد',
      ],
      competitors: [
        {
          countryEn: 'Egypt (El-Mahalla Cluster)',
          countryAr: 'مصر (تجمع المحلة الكبرى)',
          marketSharePct: 6.8,
          avgFobPriceUsd: `$${hsMeta.fobBaseUsd.toFixed(2)}`,
          tariffIntoTargetPct: cMeta.egyptDuty,
          seaTransitDays: cMeta.seaDays,
          mahallaAdvantageEn: '0% Duty + Native Giza Long-Staple Fiber + Fast Mediterranean Transit',
          mahallaAdvantageAr: 'إعفاء جمركي 0% + قطن جيزة طويل التيلة الأصلي + أسرع شحن بحري',
        },
        {
          countryEn: 'Turkey',
          countryAr: 'تركيا',
          marketSharePct: 21.4,
          avgFobPriceUsd: `$${(hsMeta.fobBaseUsd * 1.18).toFixed(2)}`,
          tariffIntoTargetPct: cMeta.region === 'EU' ? '0.0% (Customs Union)' : '5.0% – 11.4%',
          seaTransitDays: '7–14 Days',
          mahallaAdvantageEn: 'Egypt offers 18–24% lower energy & labor conversion cost than Turkish mills',
          mahallaAdvantageAr: 'مصر توفر تكلفة تصنيع وطاقة أقل بنسبة ١٨–٢٤٪ مقارنة بالمصانع التركية',
        },
        {
          countryEn: 'India',
          countryAr: 'الهند',
          marketSharePct: 24.5,
          avgFobPriceUsd: `$${(hsMeta.fobBaseUsd * 0.95).toFixed(2)}`,
          tariffIntoTargetPct: cMeta.mfnDuty,
          seaTransitDays: '35–48 Days',
          mahallaAdvantageEn: `Egypt beats India on landed price once ${cMeta.mfnDuty} MFN duty & 40-day freight are added`,
          mahallaAdvantageAr: `مصر تتفوق في التكلفة النهائية بعد إضافة رسوم الجمارك (${cMeta.mfnDuty}) وتكلفة الشحن الطويل`,
        },
        {
          countryEn: 'Pakistan',
          countryAr: 'باكستان',
          marketSharePct: 16.2,
          avgFobPriceUsd: `$${(hsMeta.fobBaseUsd * 0.91).toFixed(2)}`,
          tariffIntoTargetPct: cMeta.region === 'EU' ? '0% (GSP+)' : cMeta.mfnDuty,
          seaTransitDays: '38–50 Days',
          mahallaAdvantageEn: 'Superior Egyptian fiber tensile strength (300+ wash life vs 120 washes)',
          mahallaAdvantageAr: 'متانة وطول عمر الألياف المصرية (أكثر من ٣٠٠ غسلة صناعية مقارنة بـ ١٢٠ غسلة)',
        },
        {
          countryEn: 'China',
          countryAr: 'الصين',
          marketSharePct: 26.0,
          avgFobPriceUsd: `$${(hsMeta.fobBaseUsd * 0.98).toFixed(2)}`,
          tariffIntoTargetPct: cMeta.mfnDuty,
          seaTransitDays: '42–55 Days',
          mahallaAdvantageEn: 'Zero tariff barrier + 3x faster reorder turnaround + flexible MOQs',
          mahallaAdvantageAr: 'صفر جمارك + سرعة توريد أسرع ٣ مرات + مرونة عالية في الكميات',
        },
      ],
    },
    marketEntry: {
      recommendedModes: [
        {
          modeEn: '1. Direct Private-Label OEM / ODM Contracting with Retail & Hospitality Chains',
          modeAr: '١. التعاقد المباشر لتصنيع العلامات الخاصة (Private Label / OEM) لسلاسل التجزئة والفنادق',
          fitScorePct: 95,
          marginPotential: '26% – 34% Gross Mill Margin',
          timelineEn: '30–60 Days to First Trial Order',
          timelineAr: '٣٠–٦٠ يوماً لأول طلبية تجريبية',
          actionStepsEn: [
            `Dispatch curated physical DHL Swatch & Lab-Dip Box to Top 25 Category Buyers in ${cMeta.en}`,
            `Attach pre-verified ISO 17025 test dossier, ${cMeta.originCert} specimen, and EU DPP QR code`,
            `Offer a risk-free 500-unit Fast-Track Trial Order with 14-day production lead time`,
          ],
          actionStepsAr: [
            `إرسال صندوق عينات فعلي عبر DHL لأكبر ٢٥ مدير مشتريات في ${cMeta.ar}`,
            `إرفاق شهادات المعمل ISO 17025 ونموذج شهادة المنشأ (${cMeta.originCert}) وجواز المنتج الرقمي`,
            `تقديم عرض طلبية تجريبية مرنة (٥٠٠ وحدة) بتجهيز خلال ١٤ يوماً لبناء الثقة`,
          ],
        },
        {
          modeEn: '2. Strategic Importer-Distributor & Stockist Alliance in Target Port Hub',
          modeAr: '٢. الشراكة مع مستورد وموزع معتمد يمتلك مخازن توزيع في الدولة المستهدفة',
          fitScorePct: 88,
          marginPotential: '19% – 24% High-Volume Margin',
          timelineEn: '45–75 Days to Container Contract',
          timelineAr: '٤٥–٧٥ يوماً لتعاقد الحاويات الدورية',
          actionStepsEn: [
            `Partner with established textile wholesalers in ${cMeta.citiesEn[0]} and ${cMeta.citiesEn[1]}`,
            `Provide territorial exclusivity on specific GSM/count ranges in exchange for quarterly container minimums`,
            `Co-brand marketing brochures and swatch binders in ${cMeta.en}'s local language`,
          ],
          actionStepsAr: [
            `التعاقد مع كبار تجار الجملة والموزعين في ${cMeta.citiesAr[0]} و${cMeta.citiesAr[1]}`,
            `منح وكالة توزيع لمواصفات محددة مقابل التزام ربع سنوي بحجم مسحوبات ثابت`,
            `تزويد الموزع بكتالوجات وعينات مطبوعة بلغة سوق ${cMeta.ar}`,
          ],
        },
        {
          modeEn: '3. Mahalla Export Consortium Joint Bid for Large Public & Institutional Tenders',
          modeAr: '٣. الدخول عبر تحالف مصانع المحلة التصديري للفوز بالمناقصات الحكومية والمؤسسية الكبرى',
          fitScorePct: 91,
          marginPotential: '22% – 29% Guaranteed Contract Margin',
          timelineEn: '60–90 Days Tender Cycle',
          timelineAr: '٦٠–٩٠ يوماً لدورة ترسية المناقصات',
          actionStepsEn: [
            `Combine spinning, weaving, dyeing, and stitching capacities across 3–5 Mahalla Cluster mills`,
            `Bid jointly on multi-container hospital, hotel, and workwear tenders in ${cMeta.en}`,
            `Utilize Afreximbank / Export Credit Guarantee Company of Egypt (EGE) performance bond backing`,
          ],
          actionStepsAr: [
            `توحيد طاقات الغزل والنسيج والصباغة والتفصيل بين ٣ إلى ٥ مصانع داخل تجمع المحلة`,
            `التقدم المشترك لمناقصات المستشفيات والفنادق والزي الموحد في ${cMeta.ar}`,
            `استخدام ضمانات البنك الأفريقي للتصدير والاستيراد (Afreximbank) وشركة ضمان الصادرات`,
          ],
        },
      ],
      pricingArchitecture: {
        fobAlexandriaBaseUsd: hsMeta.fobBaseUsd,
        freightInsurancePct: 6.5,
        customsDutyPct: cMeta.egyptDuty.startsWith('0.0%') ? 0 : 4.5,
        importerMarkupPct: 28,
        retailMultiplier: 2.35,
        unitNameEn: hsMeta.unitEn,
        unitNameAr: hsMeta.unitAr,
      },
      paymentTermsGuideEn: [
        'First Trial Order (<$25,000): 30% T/T Advance upon Proforma Invoice + 70% T/T against scanned Bill of Lading & EUR.1/Origin copy.',
        'Recurring Container Orders ($25,000–$250,000): Confirmed Irrevocable L/C at Sight or CAD (Cash Against Documents) through prime international bank.',
        'Credit-Insured Open Account (60 Days): Available for Tier-1 rated buyers covered by Export Credit Guarantee Company of Egypt (EGE) / Coface / Allianz Trade.',
      ],
      paymentTermsGuideAr: [
        'الطلبية التجريبية الأولى (أقل من ٢٥ ألف دولار): ٣٠٪ تحويل بنكي مقدم (T/T) + ٧٠٪ مقابل صورة بوليصة الشحن وشهادة المنشأ.',
        'الطلبيات الدورية والحاويات (٢٥ إلى ٢٥٠ ألف دولار): اعتماد مستندي معزز غير قابل للإلغاء (Confirmed L/C at Sight) أو مستندات مقابل الدفع (CAD).',
        'التسهيلات الائتمانية المؤمنة (٦٠ يوماً): متاحة لكبار المشترين بعد تغطية الفاتورة عبر شركة ضمان الصادرات المصرية (EGE) أو Coface.',
      ],
    },
    opportunitiesAndTenders: [
      {
        id: 'tender-1',
        refCode: `TED-${cMeta.en.slice(0, 2).toUpperCase()}-2026-8841`,
        sourcePortalEn: 'EU TED (Tenders Electronic Daily) / Official Procurement Portal',
        sourcePortalAr: 'بوابة المناقصات الأوروبية والدولية الرسمية (EU TED)',
        sourceUrl: 'https://ted.europa.eu',
        titleEn: `Annual Framework Supply of Certified ${rawProduct} for ${cMeta.en} Regional Group`,
        titleAr: `مناقصة التوريد السنوي لمنتجات (${rawProduct}) لصالح مجموعة مؤسسية في ${cMeta.ar}`,
        issuingEntityEn: `${cMeta.citiesEn[0]} Hospitality & Healthcare Purchasing Alliance`,
        issuingEntityAr: `تحالف مشتريات الفنادق والرعاية الصحية في ${cMeta.citiesAr[0]}`,
        countryEn: cMeta.en,
        countryAr: cMeta.ar,
        deliveryPort: cMeta.portEn.split('(')[0].trim(),
        hsCode: hsMeta.hsCode,
        estimatedValue: '$380,000 – $620,000 USD',
        volumeSpecEn: '45,000 units across 3 quarterly shipments • ISO 105 Grade 4.5+ & ≤2% shrinkage',
        volumeSpecAr: '٤٥,٠٠٠ وحدة على ٣ دفعات ربع سنوية • ثبات ألوان ISO 105 وانكماش أقل من ٢٪',
        deadlineDays: 24,
        requiredCerts: ['ISO 9001:2015', 'OEKO-TEX Standard 100', cMeta.originCert.split(' ')[0]],
        bidStrategyEn: 'Bid via Mahalla Export Consortium to guarantee 15,000 units/month capacity and 0% duty landed pricing.',
        bidStrategyAr: 'التقدم عبر تحالف مصانع المحلة لضمان طاقة إنتاجية ١٥ ألف وحدة شهرياً والاستفادة من الإعفاء الجمركي 0%.',
      },
      {
        id: 'tender-2',
        refCode: `ITC-RFQ-${cMeta.en.slice(0, 2).toUpperCase()}-9104`,
        sourcePortalEn: 'Private-Label Retail Sourcing Desk & EuroPages Verified RFQ',
        sourcePortalAr: 'مكتب التوريد المباشر لسلاسل التجزئة والعلامات الخاصة',
        sourceUrl: 'https://www.trademap.org',
        titleEn: `Private-Label Sustainable Capsule & Core Replenishment Program (${cMeta.en})`,
        titleAr: `برنامج تصنيع علامة خاصة وتوريد مستمر لمتاجر التجزئة في ${cMeta.ar}`,
        issuingEntityEn: `Nordic & ${cMeta.en} Home/Apparel Retail Buying Group (${cMeta.citiesEn[1]})`,
        issuingEntityAr: `مجموعة متاجر التجزئة والأزياء والمفروشات في ${cMeta.citiesAr[1]}`,
        countryEn: cMeta.en,
        countryAr: cMeta.ar,
        deliveryPort: cMeta.portEn.split('(')[0].trim(),
        hsCode: hsMeta.hsCode,
        estimatedValue: '$165,000 – $290,000 USD',
        volumeSpecEn: '12,000 units initial drop + monthly replenishment • Custom woven labels & QR DPP hangtags',
        volumeSpecAr: '١٢,٠٠٠ وحدة دفعة أولى مع إعادة طلب شهري • تيكيت منسوج خاص وباركود جواز المنتج الرقمي',
        deadlineDays: 16,
        requiredCerts: ['OEKO-TEX Standard 100', 'ZDHC MRSL v3.1', 'EU Digital Product Passport'],
        bidStrategyEn: 'Use AI Brand Studio to attach a custom 6-panel brochure + 5-day DHL physical swatch box offer.',
        bidStrategyAr: 'إرفاق بروشور فني مخصص من استوديو الهوية مع شحن صندوق عينات مجاني عبر DHL خلال ٥ أيام.',
      },
      {
        id: 'tender-3',
        refCode: `UNGM-TEXT-${new Date().getFullYear()}-4419`,
        sourcePortalEn: 'UNGM (United Nations Global Marketplace) & International Relief Supply',
        sourcePortalAr: 'بوابة المشتريات العالمية للأمم المتحدة (UNGM) والمنظمات الدولية',
        sourceUrl: 'https://www.ungm.org',
        titleEn: `Long-Term Agreement (LTA) for Durable Cotton Textiles, Bedding & Uniforms`,
        titleAr: `اتفاقية توريد طويلة الأجل (LTA) للمنسوجات القطنية والبياضات والزي الموحد`,
        issuingEntityEn: `International Procurement Hub (${cMeta.citiesEn[0]} / Mediterranean Logistics Hub)`,
        issuingEntityAr: `مركز المشتريات واللوجستيات الإقليمي (${cMeta.citiesAr[0]})`,
        countryEn: cMeta.en,
        countryAr: cMeta.ar,
        deliveryPort: 'FOB Alexandria / CIF Destination Port',
        hsCode: hsMeta.hsCode,
        estimatedValue: '$500,000 – $1,100,000 USD',
        volumeSpecEn: 'Multi-lot framework • ISO 17025 third-party pre-shipment inspection required',
        volumeSpecAr: 'توريد متعدد الدفعات • يتطلب شهادة فحص معملي معتمد ISO 17025 قبل الشحن',
        deadlineDays: 31,
        requiredCerts: ['ISO 9001', 'ISO 14001', 'ISO 17025 Lab Report', 'ILO Labor Compliance'],
        bidStrategyEn: 'Highlight Alexandria Port proximity and TIGARA Shared Lab ISO 17025 pre-shipment certification.',
        bidStrategyAr: 'إبراز سرعة التوريد من ميناء الإسكندرية واعتماد الفحص المعملي عبر معمل تجمع المحلة المشترك.',
      },
      {
        id: 'tender-4',
        refCode: `ECS-B2B-${cMeta.en.slice(0, 2).toUpperCase()}-7022`,
        sourcePortalEn: 'Egyptian Commercial Service (ECS) & Export Council Buyer Matchmaking',
        sourcePortalAr: 'التمثيل التجاري المصري والمجلس التصديري للغزل والنسيج والمفروشات',
        sourceUrl: 'https://www.ecs.gov.eg',
        titleEn: `Direct Importer-Distributor Contract for Egyptian Giza Cotton & Technical Lines`,
        titleAr: `فرصة تعاقد مباشر مع مستورد وموزع معتمد للمنسوجات والغزول المصرية في ${cMeta.ar}`,
        issuingEntityEn: `${cMeta.citiesEn[2]} Textile Import & Wholesale Distribution Corp.`,
        issuingEntityAr: `شركة الاستيراد والتوزيع التجاري للمنسوجات في ${cMeta.citiesAr[2]}`,
        countryEn: cMeta.en,
        countryAr: cMeta.ar,
        deliveryPort: cMeta.portEn.split('(')[0].trim(),
        hsCode: hsMeta.hsCode,
        estimatedValue: '$95,000 – $180,000 USD / Quarter',
        volumeSpecEn: '1x 20ft or 40ft container per quarter • Mix of 4–6 core SKUs / counts',
        volumeSpecAr: 'حاوية ٢٠ أو ٤٠ قدماً كل ربع سنة • تشكيلة من ٤ إلى ٦ أصناف أساسية',
        deadlineDays: 12,
        requiredCerts: ['Cotton Egypt Seal', 'OEKO-TEX 100', cMeta.originCert.split(' ')[0]],
        bidStrategyEn: 'Offer 72-hour custom Pantone TCX lab-dips and Confirmed L/C or CAD payment flexibility.',
        bidStrategyAr: 'تقديم مطابقة ألوان Pantone خلال ٧٢ ساعة وقبول الدفع عبر اعتماد مستندي (L/C) أو مستندات برسم التحصيل (CAD).',
      },
    ],
    promotionalStrategy: {
      flagshipTradeShows: [
        {
          name: 'Heimtextil Frankfurt (Global Home & Hospitality Textiles)',
          cityCountryEn: 'Frankfurt, Germany',
          cityCountryAr: 'فرانكفورت، ألمانيا',
          monthEn: 'January (Annual Flagship)',
          monthAr: 'يناير (المعرض العالمي الأول للمفروشات)',
          focusEn: 'Bed linen, terry towels, hotel textiles, table linen & decorative fabrics',
          focusAr: 'مفروشات السرير، المناشف والوبريات، تجهيزات الفنادق وأقمشة الديكور',
          edfSubsidyNoteEn: 'Eligible for 60–80% booth & freight subsidy via Egyptian Export Development Fund (EDF) & Export Council Pavilion.',
          edfSubsidyNoteAr: 'مؤهل لدعم صندوق تنمية الصادرات المصري بنسبة ٦٠–٨٠٪ من تكلفة الجناح والشحن ضمن الجناح الرسمي.',
        },
        {
          name: 'Première Vision Paris & Milano Unica (Yarns, Fabrics & Fashion)',
          cityCountryEn: 'Paris, France & Milan, Italy',
          cityCountryAr: 'باريس، فرنسا وميلانو، إيطاليا',
          monthEn: 'February & July / September',
          monthAr: 'فبراير ويوليو / سبتمبر',
          focusEn: 'Fine combed Giza yarns, shirting poplins, eco-denim, linen & private-label apparel',
          focusAr: 'غزول قطن جيزة الممشطة، أقمشة القمصان، الدنيم المستدام، الكتان والملابس الجاهزة',
          edfSubsidyNoteEn: 'Co-funded buyer matchmaking available through UNIDO TIGARA & Egyptian Commercial Service (ECS) offices.',
          edfSubsidyNoteAr: 'تشبيك مجاني مسبق مع المشترين بالتنسيق مع مشروع اليونيدو (تيجارا) ومكتب التمثيل التجاري المصري.',
        },
        {
          name: 'Techtextil Frankfurt & INDEX / Hotel Show Dubai & Riyadh',
          cityCountryEn: `${cMeta.citiesEn[0]}, ${cMeta.en} & Regional Hub`,
          cityCountryAr: `${cMeta.citiesAr[0]}، ${cMeta.ar} والمراكز الإقليمية`,
          monthEn: 'April / May & October',
          monthAr: 'أبريل / مايو وأكتوبر',
          focusEn: `Direct B2B contracting with ${cMeta.en} hospitality groups, industrial workwear buyers, and regional distributors`,
          focusAr: `التعاقد المباشر مع مجموعات الفنادق ومشتري ملابس العمل والموزعين في ${cMeta.ar}`,
          edfSubsidyNoteEn: 'Eligible for inward buyer mission hosting in El-Mahalla El-Kubra (flight & hotel covered for visiting VIP buyers).',
          edfSubsidyNoteAr: 'إمكانية استضافة بعثات المشترين الأجانب لزيارة مصانع المحلة الكبرى ضمن برامج البعثات المشتراة.',
        },
      ],
      campaignsEn: [
        {
          phase: 'Weeks 1–3: Market Localization & Compliance Proofing',
          title: `Localize Digital Showroom & Technical Dossier for ${cMeta.en}`,
          actions: [
            `Generate ${cMeta.en}-compliant product spec sheets with HS ${hsMeta.hsCode} & ${cMeta.originCert} duty-free calculation`,
            'Prepare 30 Physical VIP Swatch Binders with ISO 17025 fastness/shrinkage test strips attached',
            'Register mill profile with the Egyptian Commercial Service (ECS) Commercial Attaché in target embassy',
          ],
          kpi: '30 Swatch Binders Ready + 100% NTM Compliance Verified',
        },
        {
          phase: 'Weeks 4–8: Targeted Buyer Outreach & DHL Sample Blitz',
          title: `Account-Based Outreach to Top 50 Buyers in ${cMeta.citiesEn.join(', ')}`,
          actions: [
            'Execute 4-stage bilingual/native outreach sequence via Email, LinkedIn Sales Navigator & WhatsApp Business',
            'Dispatch complimentary 5-day DHL Swatch Boxes to qualified sourcing directors',
            'Conduct 15-minute live video walkthroughs of El-Mahalla spinning/weaving/dyeing lines & ISO lab',
          ],
          kpi: '25+ Swatch Boxes Delivered • 10+ Custom Lab-Dip / RFQ Requests',
        },
        {
          phase: 'Weeks 9–12: Trade-Show Rendezvous, Trial Orders & Consortium Scaling',
          title: 'Convert Approved Samples into Trial Containers & Annual Frameworks',
          actions: [
            `Hold pre-booked 1-on-1 meetings at trade show or via virtual showroom with landed CIF ${cMeta.portEn.split('(')[0].trim()} pricing sheets`,
            'Close initial 500–2,500 unit fast-track trial orders under L/C or CAD terms',
            'Pool overflow capacity with Mahalla Export Consortium partner mills for multi-container rollouts',
          ],
          kpi: '3–5 Active Export Contracts Signed ($150K–$500K Pipeline)',
        },
      ],
      campaignsAr: [
        {
          phase: 'الأسابيع ١–٣: توطين الكتالوج الرقمي وتجهيز ملف المطابقة القياسية',
          title: `تجهيز الملف الفني وحاسبة الإعفاء الجمركي لسوق ${cMeta.ar}`,
          actions: [
            `إصدار جداول المواصفات الفنية بالبند الجمركي (HS ${hsMeta.hsCode}) وحساب التوفير الجمركي بموجب (${cMeta.originCert})`,
            'تجهيز ٣٠ صندوق عينات VIP مرفقاً بها نتائج اختبارات المعمل ISO 17025 للثبات والانكماش',
            'تسجيل بيانات المصنع والمنتجات لدى مكتب التمثيل التجاري المصري في السفارة المصرية بالدولة المستهدفة',
          ],
          kpi: '٣٠ صندوق عينات جاهز + استيفاء ١٠٠٪ من المتطلبات القياسية',
        },
        {
          phase: 'الأسابيع ٤–٨: حملة الاستهداف المباشر لكبار المشترين وشحن العينات عبر DHL',
          title: `التواصل الموجه مع أكبر ٥٠ مشترياً في (${cMeta.citiesAr.join('، ')})`,
          actions: [
            'إطلاق تسلسل المراسلات الاحترافية (بريد إلكتروني + LinkedIn + واتساب للأعمال) بلغة السوق المستهدف',
            'شحن صناديق العينات المجانية عبر DHL خلال ٥ أيام لمديري المشتريات المؤهلين',
            'عقد جولات فيديو حية لمدة ١٥ دقيقة من داخل خطوط الإنتاج ومعمل الجودة بالمحلة الكبرى',
          ],
          kpi: 'تسليم ٢٥+ صندوق عينات • ١٠+ طلبات تسعير وعينات ألوان خاصة',
        },
        {
          phase: 'الأسابيع ٩–١٢: الاجتماعات المباشرة، الطلبيات التجريبية، والتوسع عبر التحالف',
          title: 'تحويل العينات المعتمدة إلى عقود توريد وحاويات تصديرية',
          actions: [
            `عقد اجتماعات فردية مجدولة مسبقاً مع تقديم قائمة أسعار واصلة (CIF ${cMeta.portAr.split('(')[0].trim()})`,
            'إغلاق الطلبيات التجريبية الأولى (٥٠٠–٢,٥٠٠ وحدة) بشروط دفع آمنة (L/C أو CAD)',
            'تشبيك الطلبيات الكبرى مع تحالف مصانع المحلة التصديري لمضاعفة الطاقة الإنتاجية',
          ],
          kpi: 'توقيع ٣–٥ عقود تصديرية فعلية (٢٥٠–٥٠٠ ألف دولار)',
        },
      ],
    },
    trustedBuyers: buildTrustedBuyerLeads(rawProduct, cMeta, hsMeta),
    ntmAndStandards: buildNtmAndStandards(rawProduct, cMeta, hsMeta),
  };
}

function buildTrustedBuyerLeads(
  rawProduct: string,
  cMeta: CountryMeta,
  hsMeta: { hsCode: string; fobBaseUsd: number; unitEn: string; unitAr: string }
): TrustedBuyerLead[] {
  const shortProd = rawProduct.length > 52 ? rawProduct.slice(0, 50) + '…' : rawProduct;

  const baseBuyers = [
    {
      suffixId: 'b1',
      companyName: `${cMeta.citiesEn[0]} Home & Living Retail Group GmbH / Ltd`,
      tierEn: 'Tier-1 Department Store & Home Textile Chain',
      tierAr: 'سلسلة متاجر كبرى وعلامة خاصة للمفروشات والمنسوجات',
      cityIdx: 0,
      annualImport: '$8.5M – $22M / yr',
      roleEn: 'Head of Category Sourcing — Home & Private Label Textiles',
      roleAr: 'مدير عام مشتريات قطاع المفروشات والعلامات الخاصة',
      verSourceEn: 'ITC Trade Map Importer Registry & Heimtextil VIP Buyer Directory',
      verSourceAr: 'سجل المستوردين المعتمدين في خريطة التجارة الدولية ودليل زوار هايم تكستيل',
      trustScore: 98,
      focusEn: `Long-staple Egyptian cotton bedding, terry towels & sustainable private-label collections (${hsMeta.hsCode})`,
      focusAr: `بياضات الأسرة والمناشف القطنية المصرية ومجموعات العلامات الخاصة المستدامة (${hsMeta.hsCode})`,
      windowEn: 'January–March (A/W) & July–September (S/S)',
      windowAr: 'يناير–مارس (خريف/شتاء) ويوليو–سبتمبر (ربيع/صيف)',
      payment: 'Confirmed Irrevocable L/C at Sight / 60-Day EGE Insured Open Account',
      domain: `${cMeta.citiesEn[0].toLowerCase().replace(/[^a-z]/g, '')}-homeliving.com`,
    },
    {
      suffixId: 'b2',
      companyName: ` Continental Hospitality & Healthcare Linen Supply (${cMeta.en})`,
      tierEn: 'B2B Institutional & 5-Star Hotel Textile Distributor',
      tierAr: 'موزع معتمد للفنادق ذات الـ ٥ نجوم والمستشفيات الكبرى',
      cityIdx: 1,
      annualImport: '$4.2M – $11M / yr',
      roleEn: 'VP of Global Textile Procurement & Quality Assurance',
      roleAr: 'نائب رئيس المشتريات العالمية وضمان الجودة',
      verSourceEn: 'European / Regional Hospitality Procurement Network & Customs Bill-of-Lading Records',
      verSourceAr: 'شبكة مشتريات الضيافة الدولية وسجلات بوالص الشحن الجمركية الموثقة',
      trustScore: 96,
      focusEn: `High-durability 300-wash institutional linens, damask table textiles, and ISO-certified uniforms`,
      focusAr: `مفروشات الفنادق عالية التحمل (٣٠٠ غسلة صناعية)، مفارش الموائد الدمشقية، والزي الموحد المعتمد`,
      windowEn: 'Year-round quarterly container replenishment tenders',
      windowAr: 'طلبيات ربع سنوية مستمرة طوال العام بنظام العقود الإطارية',
      payment: '30% T/T Advance + 70% CAD (Cash Against Documents)',
      domain: `continental-hospitality-${cMeta.en.toLowerCase().slice(0, 3)}.com`,
    },
    {
      suffixId: 'b3',
      companyName: `Nordic & ${cMeta.en} Eco-Apparel & Fabrics Collective`,
      tierEn: 'Sustainable Fashion Brand & Fabric Wholesaler',
      tierAr: 'علامة أزياء مستدامة ومستورد أقمشة وغزول معتمدة',
      cityIdx: 2,
      annualImport: '$2.8M – $7.5M / yr',
      roleEn: 'Chief Sourcing Officer & Sustainability Lead',
      roleAr: 'مدير التوريد الرئيسي ومسؤول الاستدامة وسلاسل الإمداد',
      verSourceEn: 'GOTS / OEKO-TEX® Certified Buyer Directory & Première Vision Exhibitor Match',
      verSourceAr: 'دليل المشترين المعتمدين لدى GOTS و OEKO-TEX® ومعرض بريميير فيجن',
      trustScore: 95,
      focusEn: `GOTS organic / Giza combed yarns, dyed woven fabrics, and EU Digital Product Passport ready garments`,
      focusAr: `غزول قطن جيزة والقطن العضوي، الأقمشة المصبوغة، والملابس المزودة بجواز المنتج الرقمي الأوروبي`,
      windowEn: 'February–April & August–October seasonal capsule drops',
      windowAr: 'فبراير–أبريل وأغسطس–أكتوبر لإطلاق المجموعات الموسمية',
      payment: 'Confirmed L/C at Sight / 30% T/T + 70% Against B/L Copy',
      domain: `eco-textile-${cMeta.en.toLowerCase().slice(0, 3)}.org`,
    },
    {
      suffixId: 'b4',
      companyName: ` EuroMed Industrial Workwear & Technical Textiles Corp (${cMeta.citiesEn[0]})`,
      tierEn: 'Industrial Workwear, PPE & Technical Fabric Importer',
      tierAr: 'مستورد رئيسي لأقمشة وملابس الوقاية الصناعية والمنسوجات التقنية',
      cityIdx: 0,
      annualImport: '$5.0M – $14M / yr',
      roleEn: 'Technical Purchasing Director (ISO / EN Standards)',
      roleAr: 'مدير المشتريات الفنية والمواصفات القياسية (ISO / EN)',
      verSourceEn: 'Techtextil Buyer Registry & Egyptian Commercial Service (ECS) Verified List',
      verSourceAr: 'سجل مشتري معرض تيك تكستيل وقائمة التمثيل التجاري المصري المعتمدة',
      trustScore: 94,
      focusEn: `Heavyweight twill/denim workwear fabrics, flame-retardant garments, and compact ring-spun yarns`,
      focusAr: `أقمشة التويل والدنيم الثقيلة لملابس العمل، الأقمشة المقاومة للحريق، والغزول الصناعية المتينة`,
      windowEn: 'Q1 & Q3 Annual Framework Bidding',
      windowAr: 'الربع الأول والربع الثالث لعقود التوريد السنوية',
      payment: 'Irrevocable L/C at Sight',
      domain: `euromed-workwear-${cMeta.en.toLowerCase().slice(0, 2)}.com`,
    },
  ];

  return baseBuyers.map((b) => {
    const cityEn = cMeta.citiesEn[b.cityIdx] || cMeta.citiesEn[0];
    const cityAr = cMeta.citiesAr[b.cityIdx] || cMeta.citiesAr[0];
    const email = `sourcing@${b.domain}`;

    return {
      id: `${b.suffixId}-${cMeta.en.toLowerCase().replace(/\s+/g, '-')}`,
      companyName: b.companyName.trim(),
      buyerTierEn: b.tierEn,
      buyerTierAr: b.tierAr,
      cityCountryEn: `${cityEn}, ${cMeta.en}`,
      cityCountryAr: `${cityAr}، ${cMeta.ar}`,
      annualImportEstimate: b.annualImport,
      hsCodesPurchased: [hsMeta.hsCode, '5205.24', '6302.21'],
      decisionMakerRoleEn: b.roleEn,
      decisionMakerRoleAr: b.roleAr,
      verificationSourceEn: b.verSourceEn,
      verificationSourceAr: b.verSourceAr,
      trustScore: b.trustScore,
      sourcingFocusEn: b.focusEn,
      sourcingFocusAr: b.focusAr,
      buyingWindowEn: b.windowEn,
      buyingWindowAr: b.windowAr,
      preferredPaymentTerms: b.payment,
      contactEmailPattern: email,
      websiteDomain: b.domain,
      outreachTemplates: [
        {
          stageId: 'COLD_INTRO',
          stageLabelEn: '1. Executive Cold Intro + Free DHL Swatch Box',
          stageLabelAr: '١. رسالة التعارف التنفيذية + عرض شحن صندوق عينات مجاني عبر DHL',
          subjectEn: `[0% Duty Egypt Origin] Traceable ${shortProd} (HS ${hsMeta.hsCode}) for ${b.companyName.trim()}`,
          subjectAr: `[إعفاء جمركي 0% - منشأ مصري] توريد ${shortProd} (بند ${hsMeta.hsCode}) لشركة ${b.companyName.trim()}`,
          nativeLanguageNoteEn: cMeta.nativeLangNote,
          nativeLanguageGreeting: cMeta.nativeGreeting,
          bodyEn: `${cMeta.nativeGreeting}\n\nI am writing to you from the El-Mahalla El-Kubra Industrial Textile Cluster in Egypt regarding ${b.companyName.trim()}’s sourcing of ${rawProduct} (HS ${hsMeta.hsCode}).\n\nWhy leading buyers in ${cMeta.en} are shifting 25%+ of their Asian volume to our audited El-Mahalla mills:\n1. ${cMeta.egyptDuty} Customs Duty into ${cMeta.en} under the ${cMeta.ftaNameEn} (accompanied by ${cMeta.originCert}), saving you ${cMeta.mfnDuty} immediately compared to Far East suppliers.\n2. Rapid ${cMeta.seaDays} Sea Transit from Alexandria Port to ${cMeta.portEn.split('(')[0].trim()}.\n3. Verified Quality & ESG: ISO 17025 lab test reports (ΔE ≤ 0.8 colorfastness, ≤2% shrinkage), OEKO-TEX® Standard 100, ZDHC MRSL Level 3, and serialized QR EU Digital Product Passports.\n\nWe have prepared a complimentary Physical Swatch & Lab-Dip Box tailored to your specifications. May I dispatch it to your ${cityEn} office via DHL Express this week?\n\nBest regards,\nExport Desk — El-Mahalla El-Kubra Textile Cluster\nWeb: https://mahalla-cluster-app.vercel.app`,
          bodyAr: `${cMeta.nativeGreeting}\n\nنتشرف بالتواصل معكم من تجمع المحلة الكبرى الصناعي للغزل والنسيج في مصر بخصوص احتياجات شركة (${b.companyName.trim()}) من منتجات (${rawProduct} — البند الجمركي ${hsMeta.hsCode}).\n\nلماذا يتجه كبار المستوردين في (${cMeta.ar}) إلى التعاقد مع مصانعنا المعتمدة بالمحلة الكبرى:\n١. إعفاء جمركي تفضيلي (${cMeta.egyptDuty}) عند الاستيراد في ${cMeta.ar} بموجب (${cMeta.ftaNameAr}) وشهادة المنشأ (${cMeta.originCert})، مما يوفر لكم رسوم الجمارك العامة (${cMeta.mfnDuty}).\n٢. شحن بحري سريع خلال (${cMeta.seaDays}) مباشرة إلى (${cMeta.portAr.split('(')[0].trim()}).\n٣. جودة واستدامة موثقة معملياً: تقارير اختبار ISO 17025 (ثبات ألوان ΔE ≤ 0.8 وانكماش أقل من ٢٪)، واعتماد OEKO-TEX® Standard 100 و ZDHC وجواز السفر الرقمي للمنتج (DPP).\n\nلقد جهزنا لكم صندوق عينات فعلي مجاني (Swatch & Lab-Dip Box) مطابق لمواصفاتكم. هل يمكننا شحنه إلى مقر شركتكم في (${cityAr}) عبر DHL Express هذا الأسبوع؟\n\nمع خالص التحية والتقدير،\nمكتب التصدير — تجمع المحلة الكبرى الصناعي\nhttps://mahalla-cluster-app.vercel.app`,
        },
        {
          stageId: 'QUOTATION_PITCH',
          stageLabelEn: '2. Official FOB / CIF Commercial Quotation + Tariff Advantage',
          stageLabelAr: '٢. عرض السعر التجاري الرسمي (FOB / CIF) مع جدول الوفر الجمركي',
          subjectEn: `Official Quotation: ${shortProd} (FOB Alexandria / CIF ${cMeta.portEn.split('(')[0].trim()})`,
          subjectAr: `عرض سعر رسمي: ${shortProd} (تسليم FOB الإسكندرية / CIF ${cMeta.portAr.split('(')[0].trim()})`,
          nativeLanguageNoteEn: cMeta.nativeLangNote,
          nativeLanguageGreeting: cMeta.nativeGreeting,
          bodyEn: `${cMeta.nativeGreeting}\n\nThank you for your interest in our El-Mahalla production lines. Please find below our official commercial and technical offer for ${rawProduct} (HS ${hsMeta.hsCode}):\n\n• Technical Specification: 100% Traceable Egyptian Fiber • ISO 105-C06 Wash Fastness Grade 4.5+ • Spectrophotometer ΔE ≤ 0.8 • 4-Point ASTM D5430 Inspection.\n• Tiered Pricing (FOB Alexandria Port):\n  - Trial Capsule (500 – 1,500 ${hsMeta.unitEn}s): $${(hsMeta.fobBaseUsd * 1.06).toFixed(2)} / ${hsMeta.unitEn}\n  - Standard Program (2,500 – 10,000 ${hsMeta.unitEn}s): $${hsMeta.fobBaseUsd.toFixed(2)} / ${hsMeta.unitEn}\n  - Full 20ft/40ft Container (>10,000 ${hsMeta.unitEn}s): $${(hsMeta.fobBaseUsd * 0.92).toFixed(2)} / ${hsMeta.unitEn}\n• Customs Duty in ${cMeta.en}: ${cMeta.egyptDuty} (with ${cMeta.originCert} included in shipping documents).\n• Lead Time: 5 Days Lab-Dips • 18–21 Days Bulk Production • ${cMeta.seaDays} Vessel Transit.\n• Payment Terms: ${b.payment}.\n\nWould Tuesday at 11:00 AM local time work for a 10-minute video call to finalize your sample colorway selection?`,
          bodyAr: `${cMeta.nativeGreeting}\n\nشكراً لاهتمامكم بخطوط إنتاجنا في المحلة الكبرى. نرفق لسيادتكم عرض السعر الفني والتجاري الرسمي لمنتجات (${rawProduct} — البند الجمركي ${hsMeta.hsCode}):\n\n• المواصفات الفنية المعتمدة: ألياف مصرية موثقة ١٠٠٪ • ثبات غسيل ISO 105-C06 درجة 4.5+ • دقة ألوان طيفية ΔE ≤ 0.8 • فحص جودة شامل ASTM D5430.\n• شرائح الأسعار التصديرية (تسليم FOB ميناء الإسكندرية):\n  - طلبية تجريبية (٥٠٠ – ١,٥٠٠ ${hsMeta.unitAr}): $${(hsMeta.fobBaseUsd * 1.06).toFixed(2)} لكل ${hsMeta.unitAr}\n  - برنامج قياسي (٢,٥٠٠ – ١٠,٠٠٠ ${hsMeta.unitAr}): $${hsMeta.fobBaseUsd.toFixed(2)} لكل ${hsMeta.unitAr}\n  - تعاقد حاوية كاملة (أكثر من ١٠,٠٠٠ ${hsMeta.unitAr}): $${(hsMeta.fobBaseUsd * 0.92).toFixed(2)} لكل ${hsMeta.unitAr}\n• الرسوم الجمركية في ${cMeta.ar}: ${cMeta.egyptDuty} (مرفق شهادة المنشأ ${cMeta.originCert}).\n• مدة التوريد: ٥ أيام لعينات الألوان • ١٨–٢١ يوماً للإنتاج الكمي • ${cMeta.seaDays} شحن بحري.\n• شروط الدفع المقترحة: ${b.payment}.\n\nهل يناسبكم عقد مكالمة فيديو قصيرة (١٠ دقائق) يوم الثلاثاء القادم لتأكيد درجات الألوان المطلوبة؟`,
        },
        {
          stageId: 'SAMPLE_FOLLOWUP',
          stageLabelEn: '3. Post-DHL Swatch Follow-Up + ISO 17025 Lab Dossier',
          stageLabelAr: '٣. رسالة المتابعة بعد تسليم عينات DHL وإرفاق شهادة الفحص المعملي',
          subjectEn: `[DHL Delivered] Your ${shortProd} Swatch Kit + ISO 17025 Lab Test Report`,
          subjectAr: `[تم تسليم DHL] صندوق عينات ${shortProd} + تقرير الفحص المعملي ISO 17025`,
          nativeLanguageNoteEn: cMeta.nativeLangNote,
          nativeLanguageGreeting: cMeta.nativeGreeting,
          bodyEn: `${cMeta.nativeGreeting}\n\nDHL tracking confirms that our physical Swatch & Lab-Dip Box was delivered to your ${cityEn} reception today.\n\nInside the box, each swatch carries a QR code linked to its live EU Digital Product Passport (0.86 kg CO2e/kg carbon footprint) and our TIGARA ISO 17025 accredited lab test report.\n\nIf you have specific Pantone® TCX shades or custom GSM/construction adjustments for your upcoming season, our dye-house in El-Mahalla can produce custom lab-dips within 72 hours. Let us know your feedback on the hand-feel and weave construction!`,
          bodyAr: `${cMeta.nativeGreeting}\n\nتؤكد بيانات تتبع DHL تسليم صندوق العينات الخاص بنا إلى مقر شركتكم في (${cityAr}) اليوم.\n\nتحتوي كل عينة داخل الصندوق على رمز QR مرتبط بجواز السفر الرقمي للمنتج (البصمة الكربونية 0.86 كجم CO2e/كجم) وتقرير الفحص المعملي المعتمد ISO 17025.\n\nفي حال رغبتكم في تنفيذ ألوان Pantone® TCX خاصة بكم أو تعديل الأوزان والمقاسات للموسم القادم، يمكن لمعمل الصباغة لدينا في المحلة الكبرى تجهيز عينات الألوان خلال ٧٢ ساعة. نتطلع لمعرفة رأيكم الفني في ملمس وجودة العينات!`,
        },
        {
          stageId: 'NEGOTIATION',
          stageLabelEn: '4. Win-Win Price, MOQ & Payment Terms Counter-Offer',
          stageLabelAr: '٤. صياغة التفاوض الذكي حول السعر والكميات وشروط الدفع (Win-Win)',
          subjectEn: `Re: Commercial Terms & Capacity Hold for ${b.companyName.trim()}`,
          subjectAr: `رد: التوافق على الشروط التجارية وحجز خط الإنتاج لشركة ${b.companyName.trim()}`,
          nativeLanguageNoteEn: cMeta.nativeLangNote,
          nativeLanguageGreeting: cMeta.nativeGreeting,
          bodyEn: `${cMeta.nativeGreeting}\n\nThank you for sharing your target landed price and volume roadmap. To build a long-term partnership in ${cMeta.en}, our Cluster Management has approved the following structured package:\n\n1. Target Price Match: We can honor your target price of $${(hsMeta.fobBaseUsd * 0.94).toFixed(2)} / ${hsMeta.unitEn} FOB Alexandria by pooling our raw Giza yarn/dye procurement through the Mahalla Joint Buying Pool—without compromising a single GSM or ISO fastness grade.\n2. Phased Call-Off Flexibility: You may lock in the container rate across a 6-month blanket contract while calling off 2 smaller shipments of 1,500 units each.\n3. Duty-Free Landed Savings: Remember that our ${cMeta.originCert} saves you ${cMeta.mfnDuty} at ${cMeta.portEn.split('(')[0].trim()} customs.\n\nShall we issue the Proforma Invoice and reserve your loom/dyeing slot for next week?`,
          bodyAr: `${cMeta.nativeGreeting}\n\nنشكركم على مشاركة السعر المستهدف وخطة الكميات السنوية. وحرصاً منا على بناء شراكة استراتيجية طويلة الأجل في سوق (${cMeta.ar})، وافقت إدارة التجمع على الحزمة التعاقدية التالية:\n\n١. تلبية السعر المستهدف: يمكننا اعتماد سعركم المستهدف البالغ $${(hsMeta.fobBaseUsd * 0.94).toFixed(2)} لكل ${hsMeta.unitAr} (FOB الإسكندرية) من خلال تجميع الخامات والصبغات عبر صندوق الشراء المشترك بالمحلة الكبرى — مع الحفاظ الكامل على نفس الوزن والمواصفات القياسية.\n٢. مرونة الشحن المجزأ: يمكنكم تثبيت سعر الحاوية ضمن عقد إطاري لمدة ٦ أشهر مع سحب البضاعة على دفعتين مرنتين.\n٣. ميزة الإعفاء الجمركي: شهادة المنشأ (${cMeta.originCert}) المرفقة توفر لكم (${cMeta.mfnDuty}) من الرسوم الجمركية.\n\nهل نصدر الفاتورة المبدئية (Proforma Invoice) ونؤكد حجز خط الإنتاج للأسبوع القادم؟`,
        },
        {
          stageId: 'TRADE_SHOW_INVITE',
          stageLabelEn: '5. Trade-Show VIP Booth Invitation & Live Mill Video Tour',
          stageLabelAr: '٥. دعوة VIP لزيارة جناح المعرض الدولي أو جولة فيديو حية بالمصنع',
          subjectEn: `VIP Invitation: Meet the El-Mahalla Export Delegation (${cMeta.en} / Heimtextil)`,
          subjectAr: `دعوة خاصة VIP: لقاء بعثة تجمع المحلة التصديرية ومعاينة المجموعة الجديدة`,
          nativeLanguageNoteEn: cMeta.nativeLangNote,
          nativeLanguageGreeting: cMeta.nativeGreeting,
          bodyEn: `${cMeta.nativeGreeting}\n\nWe would be honored to host ${b.companyName.trim()} at the Egypt National Pavilion (Hall 4.1 • Booth C-18) to preview our new 2026/2027 ${rawProduct} collection.\n\nIf you would like to review the collection ahead of the show, we can host a 15-minute live HD video walkthrough directly from our El-Mahalla mill and ISO 17025 laboratory this Thursday.\n\nReply with your preferred time slot and we will send your VIP pass and pre-show sample kit.`,
          bodyAr: `${cMeta.nativeGreeting}\n\nيشرفنا دعوة فريق مشتريات (${b.companyName.trim()}) لزيارة جناحنا الرسمي ضمن الجناح المصري (قاعة 4.1 • جناح C-18) لمعاينة التشكيلة التصديرية الجديدة من (${rawProduct}).\n\nوإذا رغبتم في معاينة المجموعة قبل موعد المعرض، يسعدنا تنظيم جولة فيديو حية عالية الدقة لمدة ١٥ دقيقة مباشرة من خطوط إنتاجنا ومعمل الجودة ISO 17025 بالمحلة الكبرى يوم الخميس القادم.\n\nيرجى إفادتنا بالموعد المناسب لإرسال بطاقة دعوة VIP وصندوق العينات المسبق.`,
        },
      ],
    };
  });
}

function buildNtmAndStandards(
  rawProduct: string,
  cMeta: CountryMeta,
  hsMeta: { hsCode: string }
): ExportIntelligenceReport['ntmAndStandards'] {
  const isEuOrUk = cMeta.region === 'EU' || cMeta.region === 'UK';
  const isUsa = cMeta.region === 'USA';
  const isGcc = cMeta.region === 'GCC_ARAB';

  const measures: NtmRegulationItem[] = [
    {
      code: isEuOrUk
        ? 'EU REACH Annex XVII (Entries 43 & 72)'
        : isUsa
        ? 'US CPSIA & California Prop 65'
        : isGcc
        ? 'GSO 1956 / SASO Technical Regulation for Textiles'
        : 'WTO TBT / ISO 17025 Chemical Safety Standard',
      categoryEn: 'SPS / TBT — Restricted Chemicals & Azo Dyes',
      categoryAr: 'العوائق الفنية (TBT) — الكيماويات المحظورة وصبغات الأزو',
      authorityEn: isEuOrUk
        ? 'European Chemicals Agency (ECHA) / UK HSE'
        : isUsa
        ? 'U.S. Consumer Product Safety Commission (CPSC)'
        : 'GCC Standardization Organization (GSO) / SASO SABER',
      authorityAr: isEuOrUk
        ? 'الوكالة الأوروبية للكيماويات (ECHA) والجمارك الأوروبية'
        : isUsa
        ? 'هيئة سلامة المنتجات الاستهلاكية الأمريكية (CPSC)'
        : 'هيئة التقييس الخليجية (GSO) ومنصة سابر (SABER)',
      titleEn: 'Prohibition of Arylamine Azo Dyes, Free Formaldehyde & Heavy Metals',
      titleAr: 'حظر صبغات الأزو المسرطنة وتحديد نسب الفورمالديهايد والمعادن الثقيلة',
      mandatoryLevel: 'MANDATORY_LAW',
      limitOrRequirementEn:
        'Aromatic amines from azo dyes ≤ 30 mg/kg (ppm); Free formaldehyde ≤ 20 mg/kg (babywear) / ≤ 75 mg/kg (direct skin contact); pH value 4.0–7.5; Pentachlorophenol (PCP) < 0.5 mg/kg.',
      limitOrRequirementAr:
        'الأمينات العطرية من صبغات الأزو ≤ 30 جزء في المليون (ppm)؛ الفورمالديهايد الحر ≤ 20 ppm لملابس الأطفال و ≤ 75 ppm للملامس للجلد؛ الرقم الهيدروجيني pH بين 4.0 و7.5.',
      verificationLabTestEn:
        'EN ISO 14362-1 (Azo dyes), ISO 14184-1 (Formaldehyde), ISO 3071 (Aqueous extract pH) — Certified via OEKO-TEX® Standard 100 or TIGARA ISO 17025 Lab.',
      verificationLabTestAr:
        'اختبار EN ISO 14362-1 (صبغات الأزو) و ISO 14184-1 (الفورمالديهايد) و ISO 3071 (درجة الحموضة pH) عبر شهادة OEKO-TEX® 100 أو معمل ISO 17025.',
    },
    {
      code: isEuOrUk
        ? 'EU Regulation (EU) No 1007/2011 & ISO 3758'
        : isUsa
        ? '16 CFR Part 303 (Textile Fiber Products Identification Act) & 16 CFR 423'
        : 'GSO ISO 3758 & Dual Arabic/English Labeling Mandate',
      categoryEn: 'TBT — Mandatory Fiber Composition & Care Labeling',
      categoryAr: 'اشتراطات الوسم وبطاقات البيانات ونسب الألياف وتعليمات الغسيل',
      authorityEn: `${cMeta.en} Customs & Market Surveillance Authority`,
      authorityAr: `سلطات الجمارك والرقابة على الأسواق في ${cMeta.ar}`,
      titleEn: `Mandatory Local-Language Fiber Content, Care Symbols & Origin Marking in ${cMeta.en}`,
      titleAr: `إلزامية كتابة نسبة الألياف ورموز العناية وبلد المنشأ بلغة سوق (${cMeta.ar})`,
      mandatoryLevel: 'MANDATORY_LAW',
      limitOrRequirementEn: `100% accurate fiber percentage by weight (tolerance ±3% for blends, 0% for "100% Egyptian Cotton") printed in ${cMeta.en}'s official language, plus 5 standard ISO 3758 care symbols (Wash, Bleach, Tumble Dry, Iron, Dry Clean).`,
      limitOrRequirementAr: `كتابة نسبة الألياف بدقة بالوزن باللغة الرسمية لدولة (${cMeta.ar}) مع رموز العناية الخمسة القياسية وفق ISO 3758 وبيان واضح لبلد المنشأ (Made in Egypt).`,
      verificationLabTestEn:
        'ISO 1833 / AATCC 20A Quantitative Chemical Fiber Analysis + Permanent Sewn-In Care Label durability check.',
      verificationLabTestAr:
        'تحليل كيميائي ومجهري لنسب الألياف وفق ISO 1833 / AATCC 20A مع ثبات طباعة التيكيت المخيوط بعد الغسيل.',
    },
    {
      code: isEuOrUk
        ? 'EU Regulation 2024/1781 (ESPR Digital Product Passport)'
        : 'ISO 14067 Product Carbon Footprint & Traceability',
      categoryEn: 'ESG & Sustainability Non-Tariff Measure (NTM)',
      categoryAr: 'اشتراطات الاستدامة وجواز السفر الرقمي للمنتج والبصمة الكربونية',
      authorityEn: 'European Commission DG ENV / Tier-1 Retail ESG Compliance Desks',
      authorityAr: 'المفوضية الأوروبية وإدارات الاستدامة لدى كبار المشترين الدوليين',
      titleEn: 'Digital Product Passport (DPP) QR Serialization & Scope 1+2 Carbon Disclosure',
      titleAr: 'الترميز الرقمي لجواز المنتج (EU DPP QR) والإفصاح عن البصمة الكربونية والمياه',
      mandatoryLevel: isEuOrUk ? 'MANDATORY_LAW' : 'BUYER_MANDATE',
      limitOrRequirementEn:
        'Each lot/SKU must provide a machine-readable QR/URI disclosing fiber origin, wet-processing chemical compliance (ZDHC MRSL v3.1), water recycling %, and embodied carbon (kg CO2e/kg).',
      limitOrRequirementAr:
        'تزويد كل تشغيلة برمز QR رقمي يوضح مصدر الألياف، مطابقة كيماويات الصباغة لـ ZDHC v3.1، نسبة تدوير المياه، والانبعاثات الكربونية لكل كجم.',
      verificationLabTestEn:
        'Native Mahalla Platform DPP Generator (`/dpp/[listingId]`) + Sustainability Hub Monthly Scope 1 & 2 Ledger.',
      verificationLabTestAr:
        'يتم إصداره تلقائياً عبر نظام جواز المنتج الرقمي ووحدة الاستدامة و CBAM على منصة تجمع المحلة.',
    },
    {
      code: 'ISO 105-C06 / ISO 105-X12 / ISO 6330 / ISO 12945-2',
      categoryEn: 'Physical & Colorfastness Performance Benchmarks',
      categoryAr: 'المعايير القياسية لثبات الألوان والمتانة الميكانيكية والانكماش',
      authorityEn: 'International Buyer Quality Assurance Manual (AQL 1.5 / 2.5)',
      authorityAr: 'دليل توكيد الجودة للمشترين الدوليين (مستوى الفحص المقبول AQL 1.5 / 2.5)',
      titleEn: 'Commercial Wash Fastness, Rubbing Fastness, Dimensional Stability & Pilling',
      titleAr: 'ثبات اللون للغسيل والاحتكاك، ثبات الأبعاد (الانكماش)، ومقاومة التوبر',
      mandatoryLevel: 'BUYER_MANDATE',
      limitOrRequirementEn:
        'Wash fastness ≥ Grade 4.5; Dry rubbing ≥ Grade 4.5, Wet rubbing ≥ Grade 3.5–4.0; Dimensional shrinkage ≤ ±2.0% (woven) / ≤ ±4.0% (knit); Spectrophotometer shade continuity ΔE CMC(2:1) ≤ 0.8.',
      limitOrRequirementAr:
        'ثبات الغسيل ≥ 4.5؛ الاحتكاك الجاف ≥ 4.5 والرطب ≥ 3.5–4.0؛ الانكماش ≤ ±2% للمنسوجات و ≤ ±4% للتريكو؛ تطابق اللون الطيفي ΔE ≤ 0.8.',
      verificationLabTestEn:
        'Pre-shipment 4-Point ASTM D5430 fabric inspection (≤20 penalty points/100 sq yd) + ISO 17025 lab test report.',
      verificationLabTestAr:
        'فحص الأقمشة بنظام الـ ٤ نقاط ASTM D5430 قبل الشحن مع شهادة اختبار معملية معتمدة ISO 17025.',
    },
    {
      code: cMeta.originCert,
      categoryEn: 'Rules of Origin & Preferential 0% Tariff Qualification',
      categoryAr: 'قواعد المنشأ التفضيلية للحصول على الإعفاء الجمركي (0%)',
      authorityEn: `Egyptian GOEIC + ${cMeta.en} Customs Authority`,
      authorityAr: `الهيئة العامة للرقابة على الصادرات والواردات (GOEIC) وجمارك ${cMeta.ar}`,
      titleEn: `${cMeta.ftaNameEn} — Origin Documentation & Supplier Declarations`,
      titleAr: `${cMeta.ftaNameAr} — توثيق شهادة المنشأ وفواتير الخامات المحلية`,
      mandatoryLevel: 'PREFERENTIAL_ORIGIN',
      limitOrRequirementEn: `${cMeta.rulesEn} Unlocks ${cMeta.egyptDuty} tariff vs ${cMeta.mfnDuty} MFN duty on HS ${hsMeta.hsCode}.`,
      limitOrRequirementAr: `${cMeta.rulesAr} مما يمنح شحنتك إعفاءً جمركياً (${cMeta.egyptDuty}) بدلاً من (${cMeta.mfnDuty}).`,
      verificationLabTestEn:
        'GOEIC Approved Exporter / Chamber of Commerce endorsement + Yarn/Fabric Mill invoices retained for 5 years.',
      verificationLabTestAr:
        'اعتماد الهيئة العامة للرقابة على الصادرات والواردات (GOEIC) والغرفة التجارية مع حفظ فواتير الغزل والنسيج لمدة ٥ سنوات.',
    },
  ];

  return {
    riskLevelEn: isEuOrUk
      ? 'High Regulatory Scrutiny — Full Zero-Duty Access When Compliant'
      : 'Moderate Technical Scrutiny — Fast-Track Preferential Clearance',
    riskLevelAr: isEuOrUk
      ? 'رقابة فنية وبيئية عالية — مع إعفاء جمركي كامل (0%) عند استيفاء الشهادات'
      : 'رقابة فنية قياسية — تخليص جمركي سريع ومباشر عند استيفاء شهادة المنشأ والمطابقة',
    summaryEn: `Exporting "${rawProduct}" (HS ${hsMeta.hsCode}) to ${cMeta.en} qualifies for ${cMeta.egyptDuty} customs duty via ${cMeta.originCert}, provided the shipment complies with ${cMeta.en}'s chemical safety limits, mandatory local-language fiber/care labeling, and ISO 17025 physical performance benchmarks.`,
    summaryAr: `تتمتع صادرات (${rawProduct} — البند الجمركي ${hsMeta.hsCode}) إلى (${cMeta.ar}) بإعفاء جمركي (${cMeta.egyptDuty}) بموجب (${cMeta.originCert})، بشرط استيفاء الحدود الكيميائية الآمنة، وبطاقة البيانات باللغة المعتمدة، وتقارير الفحص المعملي ISO 17025.`,
    measures,
    customsDocumentsChecklist: [
      {
        docEn: `Preferential Certificate of Origin (${cMeta.originCert})`,
        docAr: `شهادة المنشأ التفضيلية المعتمدة (${cMeta.originCert}) للحصول على 0% جمارك`,
        issuerEn: 'GOEIC (General Organization for Export & Import Control) & Egyptian Customs',
        issuerAr: 'الهيئة العامة للرقابة على الصادرات والواردات (GOEIC) ومصلحة الجمارك المصرية',
        mandatory: true,
      },
      {
        docEn: `Commercial Invoice & Detailed Packing List (with 6-Digit HS Code ${hsMeta.hsCode})`,
        docAr: `الفاتورة التجارية وبيان العبوة التفصيلي متضمناً البند الجمركي (${hsMeta.hsCode})`,
        issuerEn: 'Exporting Mill / Mahalla Export Consortium',
        issuerAr: 'المصنع المُصدّر / تحالف مصانع المحلة التصديري',
        mandatory: true,
      },
      {
        docEn: 'Clean On-Board Ocean Bill of Lading (B/L) or Air Waybill (AWB)',
        docAr: 'بوليصة الشحن البحري النظيفة (Bill of Lading) أو الجوي (AWB)',
        issuerEn: `Shipping Line at Alexandria / Damietta / Sokhna Port → ${cMeta.portEn.split('(')[0].trim()}`,
        issuerAr: `الخط الملاحي من ميناء الإسكندرية / دمياط / السخنة إلى ${cMeta.portAr.split('(')[0].trim()}`,
        mandatory: true,
      },
      {
        docEn: 'ISO 17025 Accredited Physical & Chemical Lab Test Report (Colorfastness, Shrinkage, Azo/pH)',
        docAr: 'شهادة الفحص المعملي المعتمدة ISO 17025 (ثبات الألوان، الانكماش، الخلو من الأزو والفورمالديهايد)',
        issuerEn: 'TIGARA Shared Testing Lab / OEKO-TEX® Institute / SGS / Intertek',
        issuerAr: 'معمل اختبارات تجمع المحلة المشترك (تيجارا) أو معهد OEKO-TEX® / SGS',
        mandatory: true,
      },
      {
        docEn: 'REACH / OEKO-TEX® Standard 100 Declaration of Conformity & EU Digital Product Passport URI',
        docAr: 'إقرار المطابقة البيئية (REACH / OEKO-TEX® 100) ورابط جواز السفر الرقمي للمنتج (DPP)',
        issuerEn: 'Exporting Mill Quality Assurance & Mahalla Platform DPP Engine',
        issuerAr: 'إدارة توكيد الجودة بالمصنع ونظام جواز المنتج الرقمي بالمنصة',
        mandatory: true,
      },
      {
        docEn: isGcc
          ? 'SABER / SASO Shipment Certificate of Conformity (SCoC)'
          : isUsa
          ? 'QIZ Quarterly Compliance Certificate & US Importer Security Filing (ISF 10+2)'
          : 'REX / Approved Exporter Origin Statement & Cotton Egypt™ DNA Certificate (if applicable)',
        docAr: isGcc
          ? 'شهادة مطابقة الإرسالية في منصة سابر (SABER / SASO SCoC)'
          : isUsa
          ? 'شهادة تأهيل الكويز (QIZ) ونموذج أمن المستورد الأمريكي (ISF 10+2)'
          : 'شهادة ترخيص شعار القطن المصري (Cotton Egypt™) وإقرار المصدّر المعتمد',
        issuerEn: isGcc ? 'SASO SABER Portal' : isUsa ? 'Ministry of Trade QIZ Unit' : 'Cotton Egypt Association (CEA)',
        issuerAr: isGcc ? 'منصة سابر السعودية / الخليجية' : isUsa ? 'وحدة الكويز بوزارة الصناعة والتجارة' : 'جمعية قطن مصر (CEA)',
        mandatory: true,
      },
    ],
  };
}
