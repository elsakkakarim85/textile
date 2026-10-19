'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Globe2,
  Sparkles,
  TrendingUp,
  Ship,
  ShieldCheck,
  FileCheck2,
  Building2,
  Mail,
  Copy,
  Check,
  Download,
  Printer,
  Compass,
  Award,
  Calculator,
  Search,
  ExternalLink,
  Calendar,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Layers,
  MessageSquare,
  Send,
  GraduationCap,
  Palette,
  BadgeDollarSign,
  Scale,
  HelpCircle,
} from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { Pill } from '@/components/cluster/ui';
import { ExpertManualButton, openExpertManual } from '@/components/cluster/ExpertManualModal';
import {
  EXPORT_INTELLIGENCE_PRESETS,
  synthesizeExportIntelligence,
  type ExportIntelligenceReport,
  type ExportOpportunityTender,
  type TrustedBuyerLead,
} from '@/server/modernization/export-intelligence';

interface Props {
  locale: string;
  initialProduct?: string;
  initialCountry?: string;
  initialTab?: string;
}

type ActiveTab =
  | 'MARKET_STUDY'
  | 'MARKET_ENTRY'
  | 'TENDERS'
  | 'PROMOTION'
  | 'BUYERS'
  | 'NTM_STANDARDS';

const VALID_TABS: ActiveTab[] = [
  'MARKET_STUDY',
  'MARKET_ENTRY',
  'TENDERS',
  'PROMOTION',
  'BUYERS',
  'NTM_STANDARDS',
];

const QUICK_COUNTRIES = [
  { en: 'Germany', ar: 'ألمانيا', flag: '🇩🇪' },
  { en: 'Saudi Arabia', ar: 'السعودية', flag: '🇸🇦' },
  { en: 'United Kingdom', ar: 'المملكة المتحدة', flag: '🇬🇧' },
  { en: 'United States', ar: 'الولايات المتحدة', flag: '🇺🇸' },
  { en: 'Italy', ar: 'إيطاليا', flag: '🇮🇹' },
  { en: 'France', ar: 'فرنسا', flag: '🇫🇷' },
  { en: 'UAE', ar: 'الإمارات', flag: '🇦🇪' },
  { en: 'Japan', ar: 'اليابان', flag: '🇯🇵' },
  { en: 'Kenya', ar: 'كينيا', flag: '🇰🇪' },
  { en: 'Canada', ar: 'كندا', flag: '🇨🇦' },
];

export function ExportIntelligenceClient({
  locale,
  initialProduct,
  initialCountry,
  initialTab,
}: Props) {
  const isAr = locale === 'ar';

  const startProduct = initialProduct?.trim() || EXPORT_INTELLIGENCE_PRESETS[0].product;
  const startCountry = initialCountry?.trim() || EXPORT_INTELLIGENCE_PRESETS[0].country;
  const startTab: ActiveTab = VALID_TABS.includes(initialTab as ActiveTab)
    ? (initialTab as ActiveTab)
    : 'MARKET_STUDY';

  const [productInput, setProductInput] = useState(startProduct);
  const [countryInput, setCountryInput] = useState(startCountry);
  const [loading, setLoading] = useState(false);

  const [report, setReport] = useState<ExportIntelligenceReport>(() =>
    synthesizeExportIntelligence({
      product: startProduct,
      country: startCountry,
    })
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>(startTab);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive Pricing Calculator state
  const [fobOverride, setFobOverride] = useState<number | null>(null);
  const [orderQty, setOrderQty] = useState<number>(5000);
  const [freightPctOverride, setFreightPctOverride] = useState<number | null>(null);
  const [dutyPctOverride, setDutyPctOverride] = useState<number | null>(null);
  const [importerMarkupOverride, setImporterMarkupOverride] = useState<number | null>(null);

  // Tenders state
  const [selectedTenderForBid, setSelectedTenderForBid] =
    useState<ExportOpportunityTender | null>(null);
  const [bidCompanyName, setBidCompanyName] = useState('El-Mahalla Heritage Textiles Co.');
  const [bidLeadTimeWeeks, setBidLeadTimeWeeks] = useState(4);

  // Buyer Outreach Studio & Custom Buyer Finder state
  const [selectedBuyerIdx, setSelectedBuyerIdx] = useState(0);
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);
  const [outreachLang, setOutreachLang] = useState<'en' | 'ar'>('en');
  const [senderName, setSenderName] = useState('Karim El-Sakka — Head of Global Exports');
  const [senderFactory, setSenderFactory] = useState('El-Mahalla Premier Spinning & Weaving');
  const [customBuyerQuery, setCustomBuyerQuery] = useState('');
  const [showProformaModal, setShowProformaModal] = useState(false);

  // AI Buyer Negotiation Copilot state
  const [objectionPrompt, setObjectionPrompt] = useState('');
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);

  // NTM Checklist state
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [ntmFilter, setNtmFilter] = useState<'ALL' | 'MANDATORY_LAW' | 'BUYER_MANDATE'>('ALL');

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleGenerate = async (overrideProduct?: string, overrideCountry?: string) => {
    const prod = (overrideProduct ?? productInput).trim();
    const ctry = (overrideCountry ?? countryInput).trim();
    if (!prod || !ctry) return;

    setLoading(true);
    // Reset pricing overrides when switching product/country
    setFobOverride(null);
    setFreightPctOverride(null);
    setDutyPctOverride(null);
    setImporterMarkupOverride(null);
    setSelectedBuyerIdx(0);
    setSelectedTenderForBid(null);
    setCopilotResponse(null);

    try {
      const res = await fetch('/api/cluster/export-intelligence/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: prod, country: ctry }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.report) {
          setReport(data.report);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to instant local synthesis
    }

    const fallback = synthesizeExportIntelligence({ product: prod, country: ctry });
    setReport(fallback);
    setLoading(false);
  };

  // Computed pricing numbers
  const pricing = useMemo(() => {
    const base = report.marketEntry.pricingArchitecture;
    const fob = fobOverride ?? base.fobAlexandriaBaseUsd;
    const freightPct = freightPctOverride ?? base.freightInsurancePct;
    const dutyPct = dutyPctOverride ?? base.customsDutyPct;
    const markupPct = importerMarkupOverride ?? base.importerMarkupPct;

    const cifUnit = fob * (1 + freightPct / 100);
    const landedUnit = cifUnit * (1 + dutyPct / 100);
    const importerWholesaleUnit = landedUnit * (1 + markupPct / 100);
    const estRetailUnit = landedUnit * base.retailMultiplier;

    // Compare vs non-FTA competitor paying MFN tariff
    const mfnDutyNum = parseFloat(report.tradeAgreement.mfnTariffPct) || 12;
    const competitorLandedUnit = cifUnit * (1 + mfnDutyNum / 100);
    const dutySavingsPerOrder = Math.max(0, (competitorLandedUnit - landedUnit) * orderQty);

    return {
      fob,
      freightPct,
      dutyPct,
      markupPct,
      cifUnit,
      landedUnit,
      importerWholesaleUnit,
      estRetailUnit,
      totalFobOrder: fob * orderQty,
      totalLandedOrder: landedUnit * orderQty,
      dutySavingsPerOrder,
      unitName: isAr ? base.unitNameAr : base.unitNameEn,
    };
  }, [
    report,
    fobOverride,
    freightPctOverride,
    dutyPctOverride,
    importerMarkupOverride,
    orderQty,
    isAr,
  ]);

  // Download CSV of Buyers & Tenders
  const handleDownloadCsv = () => {
    const rows: string[][] = [
      [
        'Type',
        'Company / Issuing Authority',
        'Location / Country',
        'HS Code',
        'Estimated Value / Annual Imports',
        'Verification / Portal',
        'Contact / Terms',
      ],
    ];

    report.trustedBuyers.forEach((b) => {
      rows.push([
        'Verified Buyer',
        b.companyName,
        b.cityCountryEn,
        b.hsCodesPurchased.join(' | '),
        b.annualImportEstimate,
        `${b.verificationSourceEn} (Trust ${b.trustScore}%)`,
        `${b.contactEmailPattern} | ${b.preferredPaymentTerms}`,
      ]);
    });

    report.opportunitiesAndTenders.forEach((t) => {
      rows.push([
        `Tender (${t.refCode})`,
        t.issuingEntityEn,
        `${t.countryEn} (${t.deliveryPort})`,
        t.hsCode,
        t.estimatedValue,
        t.sourcePortalEn,
        `Deadline: ${t.deadlineDays} days | Certs: ${t.requiredCerts.join(', ')}`,
      ]);
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `mahalla-export-leads-${report.targetCountryEn.toLowerCase().replace(/\s+/g, '-')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Full Markdown Dossier
  const handleDownloadMarkdown = () => {
    const md = `# Global Export Intelligence & NTM Compliance Dossier
**Product:** ${report.productQueryEn} (${report.productQueryAr})
**Target Country:** ${report.targetCountryEn} (${report.targetCountryAr})
**HS Code:** ${report.hsCode} — ${report.hsDescriptionEn}
**Trade Agreement:** ${report.tradeAgreement.nameEn} (Egypt Tariff: ${report.tradeAgreement.egyptPreferentialTariffPct} vs MFN: ${report.tradeAgreement.mfnTariffPct})

## 1. Executive Market Study
${report.marketStudy.executiveSummaryEn}

- **Total Annual Imports:** ${report.marketStudy.totalAnnualImportsUsd} (5Y CAGR: ${report.marketStudy.fiveYearCagrPct})
- **Egypt Current Exports:** ${report.marketStudy.egyptCurrentExportsUsd}
- **Untapped Export Potential:** ${report.marketStudy.untappedPotentialUsd}
- **Sea Route & Transit:** ${report.marketStudy.seaPortRouteEn} (${report.marketStudy.seaTransitDays})

## 2. Recommended Market Entry Modes
${report.marketEntry.recommendedModes
  .map(
    (m) =>
      `### ${m.modeEn} (Fit: ${m.fitScorePct}%, Margin: ${m.marginPotential})\n` +
      m.actionStepsEn.map((s) => `- ${s}`).join('\n')
  )
  .join('\n\n')}

## 3. Live Export Opportunities & Tenders
${report.opportunitiesAndTenders
  .map(
    (t) =>
      `- **[${t.refCode}] ${t.titleEn}** (${t.estimatedValue}) — ${t.issuingEntityEn} | Deadline: ${t.deadlineDays} days`
  )
  .join('\n')}

## 4. Trusted Buyers Directory
${report.trustedBuyers
  .map(
    (b) =>
      `- **${b.companyName}** (${b.cityCountryEn}) — ${b.buyerTierEn} | Est. Imports: ${b.annualImportEstimate} | Contact: ${b.contactEmailPattern}`
  )
  .join('\n')}

## 5. Non-Tariff Measures (NTM) & Technical Standards
${report.ntmAndStandards.measures
  .map(
    (r) =>
      `- **[${r.code}] ${r.titleEn}** (${r.authorityEn}): ${r.limitOrRequirementEn} | Lab Test: ${r.verificationLabTestEn}`
  )
  .join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-intelligence-${report.targetCountryEn.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // AI Buyer Negotiation Copilot
  const handleAskCopilot = async () => {
    const activeBuyer = report.trustedBuyers[selectedBuyerIdx] || report.trustedBuyers[0];
    const q =
      objectionPrompt.trim() ||
      (isAr
        ? 'المشتري يقول إن أسعار تركيا أقل بنسبة 6% ويطلب تسهيلات سداد 60 يوماً'
        : 'The buyer claims Turkish suppliers are 6% cheaper and requests 60-day payment terms');

    setCopilotLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          messages: [
            {
              role: 'user',
              content: `Act as an Senior Export Negotiation Strategist for an El-Mahalla textile manufacturer exporting "${report.productQueryEn}" (HS ${report.hsCode}) to "${activeBuyer.companyName}" in ${report.targetCountryEn}.
Egypt enjoys ${report.tradeAgreement.egyptPreferentialTariffPct} duty under ${report.tradeAgreement.nameEn} (${report.tradeAgreement.originCertificate}) vs ${report.tradeAgreement.mfnTariffPct} MFN tariff.
Write a persuasive, executive counter-response to this buyer objection/scenario: "${q}". Include both strategic talking points and a ready-to-send email paragraph.`,
            },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.reply) {
          setCopilotResponse(data.reply);
          setCopilotLoading(false);
          return;
        }
      }
    } catch {
      // fallback below
    }

    setCopilotResponse(
      isAr
        ? `رد تفاوضي مقترح إلى ${activeBuyer.companyName} (${report.targetCountryAr}):\n\n١. الميزة الجمركية الصفرية (${report.tradeAgreement.originCertificate}): حتى لو كان سعر FOB المنافس أقل ظاهرياً بنسبة 5%، فإن إعفاء الصادرات المصرية (${report.tradeAgreement.egyptPreferentialTariffPct}) بموجب ${report.tradeAgreement.nameAr} يوفر لشركتكم ما يعادل ${report.tradeAgreement.mfnTariffPct} من الرسوم الجمركية عند التخليص في ${report.marketStudy.seaPortRouteAr}.\n٢. جودة الألياف وطول التيلة: قطن المحلة يمنح عمر غسيل أطول بـ 40% وفق اختبار ISO 6330 مما يقلل نسبة المرتجعات.\n٣. شروط الدفع المرنة: نقترح دفعة أولى 30% والباقي 70% عبر اعتماد مستندي أو تأمين ائتمان الصادرات (EGE) لمدة 60 يوماً بعد نجاح أول شحنة تجريبية.`
        : `Executive Counter-Proposal for ${activeBuyer.companyName} (${report.targetCountryEn}):\n\n1. Landed Duty-Paid Advantage (${report.tradeAgreement.originCertificate}): Under the ${report.tradeAgreement.nameEn}, our shipments enter ${report.targetCountryEn} at ${report.tradeAgreement.egyptPreferentialTariffPct} customs duty (vs. ${report.tradeAgreement.mfnTariffPct} MFN rate), creating an immediate net landed cost reduction that outweighs minor FOB variances.\n2. Total Lifecycle Value: Verified ISO 17025 lab testing on our El-Mahalla yarns shows 35–40% higher tensile durability and pilling resistance (ISO 12945-2 Grade 4.5), cutting retail defect claims.\n3. Structured Payment Bridge: We can offer a split schedule—30% deposit and 70% CAD at ${report.marketStudy.seaPortRouteEn} on the trial lot, transitioning to 60-day EGE-insured open account from the second container.`
    );
    setCopilotLoading(false);
  };

  const activeBuyer = report.trustedBuyers[selectedBuyerIdx] || report.trustedBuyers[0];
  const activeTemplate =
    activeBuyer?.outreachTemplates[selectedStageIdx] || activeBuyer?.outreachTemplates[0];

  const customizedOutreachBody = useMemo(() => {
    if (!activeTemplate) return '';
    const raw = outreachLang === 'ar' ? activeTemplate.bodyAr : activeTemplate.bodyEn;
    return `${raw}\n\n${
      outreachLang === 'ar' ? 'مع خالص التحية،' : 'Best regards,'
    }\n${senderName}\n${senderFactory} — El-Mahalla El-Kubra, Egypt`;
  }, [activeTemplate, outreachLang, senderName, senderFactory]);

  const checklistTotal = report.ntmAndStandards.customsDocumentsChecklist.length;
  const checklistDone = Object.values(checkedDocs).filter(Boolean).length;
  const checklistPct = Math.round((checklistDone / Math.max(1, checklistTotal)) * 100);

  const filteredNtmRegs = useMemo(() => {
    if (ntmFilter === 'ALL') return report.ntmAndStandards.measures;
    return report.ntmAndStandards.measures.filter((r) => r.mandatoryLevel === ntmFilter);
  }, [report.ntmAndStandards.measures, ntmFilter]);

  return (
    <div className="space-y-8">
      {/* 1. COMMAND CENTER SEARCH & PRESETS */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-emerald-950/85 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <Globe2 className="h-3.5 w-3.5" />
            {tr(
              locale,
              'AI Global Export Intelligence • Market Entry • Buyer Matchmaking • NTM Compliance',
              'ذكاء التصدير العالمي • استراتيجيات دخول الأسواق • كشاف المشترين • تحليل المواصفات والعوائق غير الجمركية'
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition"
            >
              <Printer className="h-3.5 w-3.5 text-emerald-300" />
              {tr(locale, 'Print PDF Dossier', 'طباعة الدراسة PDF')}
            </button>
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition"
            >
              <Download className="h-3.5 w-3.5 text-amber-300" />
              {tr(locale, 'Export Buyers & Tenders (.CSV)', 'تصدير المشترين والمناقصات (.CSV)')}
            </button>
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-sky-300" />
              {tr(locale, 'Full Report (.MD)', 'التقرير الكامل (.MD)')}
            </button>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          {tr(
            locale,
            'Analyze Any Product & Any Country in the World',
            'حلّل أي منتج نسجي وأي دولة مستهدفة حول العالم'
          )}
        </h2>
        <p className="text-sm text-slate-300 max-w-3xl mb-6">
          {tr(
            locale,
            'Enter your textile product (or HS code) and any destination country to synthesize an executive market study, landed-cost entry strategy, verified international tenders, trade-show promotional roadmap, trusted buyer contacts with 5-stage outreach templates, and mandatory Non-Tariff Measures (NTMs).',
            'أدخل اسم المنتج النسجي (أو البند الجمركي HS Code) وأي دولة مستهدفة لتوليد دراسة سوق متكاملة، استراتيجية التسعير ودخول السوق، المناقصات الدولية الموثوقة، خطة الترويج والمعارض، قائمة المشترين المعتمدين مع رسائل تواصل احترافية، وتحليل شامل للمواصفات القياسية والإجراءات غير الجمركية (NTM).'
          )}
        </p>

        {/* Dual Search Bar: Product + Target Country */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="grid gap-3 md:grid-cols-12"
        >
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1.5">
              {tr(
                locale,
                '1. Product, Specification or HS Code',
                '١. المنتج النسجي أو المواصفة أو البند الجمركي'
              )}
            </label>
            <div className="relative">
              <Layers className="h-4 w-4 text-slate-400 absolute top-3.5 start-3.5" />
              <input
                type="text"
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder={tr(
                  locale,
                  'e.g., Giza 86 Hotel Bed Linen, Organic Baby Knits, Ne 30/1 Yarn...',
                  'مثال: ملايات فنادق قطن جيزة 86، ملابس أطفال عضوية، غزل ممشط...'
                )}
                className="w-full rounded-xl border border-white/20 bg-slate-900/90 ps-10 pe-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1.5">
              {tr(locale, '2. Target Destination Country', '٢. الدولة المستهدفة للتصدير')}
            </label>
            <div className="relative">
              <Globe2 className="h-4 w-4 text-slate-400 absolute top-3.5 start-3.5" />
              <input
                type="text"
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                placeholder={tr(
                  locale,
                  'Any country: Germany, Saudi Arabia, UK, USA, Japan, Kenya...',
                  'أي دولة: ألمانيا، السعودية، بريطانيا، أمريكا، اليابان، كينيا...'
                )}
                className="w-full rounded-xl border border-white/20 bg-slate-900/90 ps-10 pe-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg hover:from-emerald-400 hover:to-teal-300 disabled:opacity-60 transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              {loading
                ? tr(locale, 'Analyzing Global Trade Data...', 'جارٍ تحليل بيانات التجارة العالمية...')
                : tr(locale, 'Generate Export Intelligence', 'توليد دراسة التصدير والمشترين')}
            </button>
          </div>
        </form>

        {/* Quick Country Switcher */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 me-1">
            {tr(locale, 'Instant Country Switch:', 'تبديل سريع للدولة:')}
          </span>
          {QUICK_COUNTRIES.map((c) => {
            const active =
              report.targetCountryEn.toLowerCase().includes(c.en.toLowerCase()) ||
              countryInput.toLowerCase() === c.en.toLowerCase();
            return (
              <button
                key={c.en}
                type="button"
                onClick={() => {
                  const chosen = isAr ? c.ar : c.en;
                  setCountryInput(chosen);
                  handleGenerate(productInput, chosen);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                  active
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'border border-white/15 bg-white/5 text-slate-200 hover:bg-white/15'
                }`}
              >
                <span>{c.flag}</span>
                <span>{isAr ? c.ar : c.en}</span>
              </button>
            );
          })}
        </div>

        {/* 5 Ready Preset Trade Corridors */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs font-semibold text-emerald-300 mb-2">
            {tr(
              locale,
              'Expert Trade Corridor Presets (1-Click Full Market & Buyer Pack):',
              'مسارات تصديرية جاهزة بنقرة واحدة (دراسة سوق + مناقصات + مشترين + مواصفات NTM):'
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {EXPORT_INTELLIGENCE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  const p = preset.product;
                  const c = preset.country;
                  setProductInput(p);
                  setCountryInput(c);
                  handleGenerate(p, c);
                }}
                className="text-start rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 p-2.5 transition cursor-pointer"
              >
                <div className="text-[11px] font-bold text-amber-300 truncate">
                  {preset.country}
                </div>
                <div className="text-xs font-medium text-white line-clamp-1 mt-0.5">
                  {isAr ? preset.labelAr : preset.labelEn}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI SUMMARY RIBBON */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {tr(locale, 'Target Market Imports', 'إجمالي واردات السوق المستهدف')}
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">
            {report.marketStudy.totalAnnualImportsUsd}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Pill tone="emerald">{report.marketStudy.fiveYearCagrPct} CAGR</Pill>
            <span>HS {report.hsCode}</span>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {tr(locale, 'Egypt Untapped Potential', 'الفرص التصديرية غير المستغلة لمصر')}
            </span>
            <BadgeDollarSign className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {report.marketStudy.untappedPotentialUsd}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {tr(locale, 'Current Egypt exports:', 'صادرات مصر الحالية:')}{' '}
            <strong className="text-foreground">{report.marketStudy.egyptCurrentExportsUsd}</strong>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {tr(locale, 'Egyptian Customs Tariff', 'التعريفة الجمركية للصادرات المصرية')}
            </span>
            <ShieldCheck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {report.tradeAgreement.egyptPreferentialTariffPct}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {tr(locale, 'vs. MFN Tariff:', 'مقابل التعريفة العامة:')}{' '}
            <span className="line-through">{report.tradeAgreement.mfnTariffPct}</span> •{' '}
            <strong className="text-foreground">{report.tradeAgreement.originCertificate}</strong>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {tr(locale, 'Maritime Transit & Freight', 'زمن وتكلفة الشحن البحري')}
            </span>
            <Ship className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-foreground">
            {report.marketStudy.seaTransitDays}
          </div>
          <div className="mt-1 text-xs text-muted-foreground truncate">
            20ft FCL: <strong className="text-foreground">{report.marketStudy.container20ftFreightUsd}</strong>
          </div>
        </div>
      </div>

      {/* 3. SIX-MODULE NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {[
          {
            id: 'MARKET_STUDY' as const,
            icon: TrendingUp,
            labelEn: '1. Market Study & Competitors',
            labelAr: '١. دراسة السوق والمنافسين',
            manualId: 'export-market-study',
          },
          {
            id: 'MARKET_ENTRY' as const,
            icon: Compass,
            labelEn: '2. Market Entry & Landed Cost',
            labelAr: '٢. استراتيجية الدخول وحاسبة التسعير',
            manualId: 'export-entry-strategy',
          },
          {
            id: 'TENDERS' as const,
            icon: Briefcase,
            labelEn: `3. Export Tenders & RFQs (${report.opportunitiesAndTenders.length})`,
            labelAr: `٣. المناقصات والفرص التصديرية (${report.opportunitiesAndTenders.length})`,
            manualId: 'export-tenders',
          },
          {
            id: 'PROMOTION' as const,
            icon: Award,
            labelEn: '4. Export Promotional Strategy',
            labelAr: '٤. خطة الترويج والمعارض الدولية',
            manualId: 'export-promotion',
          },
          {
            id: 'BUYERS' as const,
            icon: Building2,
            labelEn: `5. Trusted Buyers & Outreach (${report.trustedBuyers.length})`,
            labelAr: `٥. المشترون الموثوقون والتواصل (${report.trustedBuyers.length})`,
            manualId: 'export-buyers',
          },
          {
            id: 'NTM_STANDARDS' as const,
            icon: Scale,
            labelEn: `6. Country Standards & NTMs (${report.ntmAndStandards.measures.length})`,
            labelAr: `٦. المواصفات القياسية والعوائق غير الجمركية (${report.ntmAndStandards.measures.length})`,
            manualId: 'export-ntm',
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              <span
                role="button"
                tabIndex={0}
                title={tr(
                  locale,
                  'Open Expert Manual for this Export Pillar',
                  'افتح الدليل الهندسي الشامل لهذه الأداة'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openExpertManual(tab.manualId);
                }}
                className={`inline-flex items-center justify-center w-4 h-4 rounded-full transition-colors ${
                  isActive
                    ? 'bg-white/25 text-white hover:bg-amber-400 hover:text-slate-950'
                    : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950'
                }`}
              >
                <HelpCircle className="w-3 h-3" />
              </span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: MARKET STUDY & COMPETITOR BENCHMARK MATRIX
         ===================================================================== */}
      {activeTab === 'MARKET_STUDY' && (
        <div className="space-y-6">
          {/* Executive Summary + Preferential Trade Agreement */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl border bg-card p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Pill tone="emerald">
                    {tr(locale, 'HS Code', 'البند الجمركي')} {report.hsCode}
                  </Pill>
                  <h3 className="text-xl font-bold mt-2">
                    {isAr ? report.productQueryAr : report.productQueryEn} →{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {isAr ? report.targetCountryAr : report.targetCountryEn}
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isAr ? report.hsDescriptionAr : report.hsDescriptionEn}
                  </p>
                </div>
                <div className="text-end">
                  <div className="text-xs text-muted-foreground">
                    {tr(locale, 'Wholesale Landed Benchmark', 'متوسط سعر الاستيراد بالميناء')}
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {report.marketStudy.avgLandedPriceRange}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-sm leading-relaxed text-foreground">
                {isAr
                  ? report.marketStudy.executiveSummaryAr
                  : report.marketStudy.executiveSummaryEn}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                    {tr(
                      locale,
                      'Key Demand Drivers in Target Country',
                      'محركات الطلب الرئيسية في السوق المستهدف'
                    )}
                  </h4>
                  <ul className="space-y-2">
                    {(isAr
                      ? report.marketStudy.demandDriversAr
                      : report.marketStudy.demandDriversEn
                    ).map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                    {tr(
                      locale,
                      'Importer Seasonal Buying Calendar',
                      'التقويم الموسمي للتعاقدات والشراء'
                    )}
                  </h4>
                  <ul className="space-y-2">
                    {(isAr
                      ? report.marketStudy.seasonalBuyingCalendarAr
                      : report.marketStudy.seasonalBuyingCalendarEn
                    ).map((cal, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 rounded-lg border bg-muted/30 p-2.5 text-xs leading-relaxed"
                      >
                        <Calendar className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{cal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Trade Agreement & Logistics Box */}
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-base">
                  {tr(
                    locale,
                    'Treaty & Preferential Tariff Advantage',
                    'الاتفاقية التجارية والإعفاء الجمركي'
                  )}
                </h3>
              </div>

              <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-4 space-y-2">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {isAr ? report.tradeAgreement.nameAr : report.tradeAgreement.nameEn}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="rounded-lg bg-background p-2.5 border">
                    <div className="text-[11px] text-muted-foreground">
                      {tr(locale, 'Egypt Preferential Duty', 'جمارك الصادرات المصرية')}
                    </div>
                    <div className="text-lg font-extrabold text-emerald-600">
                      {report.tradeAgreement.egyptPreferentialTariffPct}
                    </div>
                  </div>
                  <div className="rounded-lg bg-background p-2.5 border">
                    <div className="text-[11px] text-muted-foreground">
                      {tr(locale, 'Standard MFN Duty', 'التعريفة العامة للمنافسين')}
                    </div>
                    <div className="text-lg font-bold text-muted-foreground">
                      {report.tradeAgreement.mfnTariffPct}
                    </div>
                  </div>
                </div>
                <div className="pt-2 text-xs">
                  <span className="font-semibold">
                    {tr(locale, 'Origin Document:', 'شهادة المنشأ المطلوبة:')}
                  </span>{' '}
                  <span className="text-foreground">{report.tradeAgreement.originCertificate}</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {tr(locale, 'Rules of Origin Requirement', 'قاعدة المنشأ التفضيلية')}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {isAr
                    ? report.tradeAgreement.rulesOfOriginAr
                    : report.tradeAgreement.rulesOfOriginEn}
                </p>
              </div>

              <div className="border-t pt-4 space-y-2 text-xs">
                <div className="font-bold uppercase tracking-wider text-muted-foreground">
                  {tr(locale, 'Maritime Logistics Corridor', 'المسار اللوجستي البحري')}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{tr(locale, 'Route:', 'خط الملاحة:')}</span>
                  <span className="font-semibold text-end">
                    {isAr ? report.marketStudy.seaPortRouteAr : report.marketStudy.seaPortRouteEn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {tr(locale, 'Sea Transit:', 'زمن الإبحار:')}
                  </span>
                  <span className="font-semibold">{report.marketStudy.seaTransitDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {tr(locale, 'Est. 20ft FCL Freight:', 'تكلفة حاوية ٢٠ قدم:')}
                  </span>
                  <span className="font-semibold">{report.marketStudy.container20ftFreightUsd}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Competitor Benchmark Table */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-lg font-bold">
                  {tr(
                    locale,
                    `Competitor Benchmark Matrix in ${report.targetCountryEn}`,
                    `مصفوفة مقارنة المنافسين الدوليين في سوق ${report.targetCountryAr}`
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {tr(
                    locale,
                    'Side-by-side comparison of FOB pricing, import tariffs, transit time, and how El-Mahalla mills win against rival exporting nations.',
                    'مقارنة مباشرة لأسعار FOB، الرسوم الجمركية، زمن الشحن، وكيف تتفوق مصانع المحلة الكبرى على الدول المنافسة.'
                  )}
                </p>
              </div>
              <Pill tone="blue">ITC Trade Map & UN Comtrade Benchmarks</Pill>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/50 text-start">
                    <th className="py-3 px-3 text-start font-bold">
                      {tr(locale, 'Supplying Country', 'الدولة المصدّرة')}
                    </th>
                    <th className="py-3 px-3 text-start font-bold">
                      {tr(locale, 'Import Share', 'الحصة السوقية')}
                    </th>
                    <th className="py-3 px-3 text-start font-bold">
                      {tr(locale, 'Avg FOB Price', 'متوسط سعر FOB')}
                    </th>
                    <th className="py-3 px-3 text-start font-bold">
                      {tr(locale, 'Tariff in Destination', 'الرسوم الجمركية')}
                    </th>
                    <th className="py-3 px-3 text-start font-bold">
                      {tr(locale, 'Sea Transit', 'زمن الشحن البحري')}
                    </th>
                    <th className="py-3 px-3 text-start font-bold">
                      {tr(
                        locale,
                        'El-Mahalla Strategic Advantage',
                        'الميزة التنافسية لمصانع المحلة الكبرى'
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {report.marketStudy.competitors.map((comp, idx) => {
                    const isEgypt = comp.countryEn.toLowerCase().includes('egypt');
                    return (
                      <tr
                        key={idx}
                        className={
                          isEgypt
                            ? 'bg-emerald-500/10 font-medium'
                            : 'hover:bg-muted/30 transition'
                        }
                      >
                        <td className="py-3.5 px-3 font-bold">
                          <div className="flex items-center gap-2">
                            {isEgypt && <Pill tone="emerald">{tr(locale, 'OUR CLUSTER', 'تجمعنا')}</Pill>}
                            <span>{isAr ? comp.countryAr : comp.countryEn}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{comp.marketSharePct}%</span>
                            <div className="w-16 h-2 rounded-full bg-muted overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full ${
                                  isEgypt ? 'bg-emerald-600' : 'bg-slate-400'
                                }`}
                                style={{ width: `${Math.min(100, comp.marketSharePct * 3)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-semibold">{comp.avgFobPriceUsd}</td>
                        <td className="py-3.5 px-3">
                          <Pill tone={isEgypt ? 'emerald' : 'amber'}>
                            {comp.tariffIntoTargetPct}
                          </Pill>
                        </td>
                        <td className="py-3.5 px-3">{comp.seaTransitDays}</td>
                        <td className="py-3.5 px-3 text-xs leading-relaxed max-w-md">
                          {isAr ? comp.mahallaAdvantageAr : comp.mahallaAdvantageEn}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: MARKET ENTRY STRATEGY & INTERACTIVE LANDED-COST SIMULATOR
         ===================================================================== */}
      {activeTab === 'MARKET_ENTRY' && (
        <div className="space-y-6">
          {/* 3 Recommended Entry Modes */}
          <div className="grid gap-5 lg:grid-cols-3">
            {report.marketEntry.recommendedModes.map((mode, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-6 flex flex-col justify-between ${
                  idx === 0
                    ? 'border-emerald-500/40 bg-emerald-500/5 shadow-sm'
                    : 'bg-card'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Pill tone={idx === 0 ? 'emerald' : idx === 1 ? 'blue' : 'purple'}>
                      {tr(locale, 'Fit Score:', 'درجة الملاءمة:')} {mode.fitScorePct}%
                    </Pill>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {isAr ? mode.timelineAr : mode.timelineEn}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2">
                    {isAr ? mode.modeAr : mode.modeEn}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4">
                    {tr(locale, 'Net Factory Margin Potential:', 'هامش الربح المتوقع للمصنع:')}{' '}
                    {mode.marginPotential}
                  </div>
                  <div className="space-y-2 border-t pt-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {tr(locale, 'Execution Roadmap Steps', 'خطوات التنفيذ العملية')}
                    </div>
                    {(isAr ? mode.actionStepsAr : mode.actionStepsEn).map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs leading-relaxed">
                        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive FOB -> CIF -> Landed Cost -> Retail Simulator */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-2xl border bg-card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-lg font-bold">
                    {tr(
                      locale,
                      'Interactive Export Pricing & Landed-Cost Calculator',
                      'حاسبة تسعير التصدير والتكلفة الواصلة لميناء المشتري (FOB → CIF → DDP)'
                    )}
                  </h3>
                </div>
                <Pill tone="emerald">{pricing.unitName}</Pill>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {tr(locale, 'FOB Alexandria Unit Price (USD)', 'سعر الوحدة FOB الإسكندرية (دولار)')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={pricing.fob}
                    onChange={(e) => setFobOverride(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {tr(locale, 'Shipment Order Volume (Units)', 'كمية الطلبية الإجمالية (وحدة)')}
                  </label>
                  <input
                    type="number"
                    step="500"
                    min="100"
                    value={orderQty}
                    onChange={(e) => setOrderQty(parseInt(e.target.value, 10) || 100)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {tr(locale, 'Sea Freight & Marine Insurance (%)', 'الشحن البحري والتأمين (%)')}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={pricing.freightPct}
                    onChange={(e) => setFreightPctOverride(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {tr(
                      locale,
                      `Destination Customs Tariff % (${report.tradeAgreement.originCertificate})`,
                      `الرسوم الجمركية بالدولة المستهدفة % (${report.tradeAgreement.originCertificate})`
                    )}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={pricing.dutyPct}
                    onChange={(e) => setDutyPctOverride(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Price Waterfall Visualization */}
              <div className="grid gap-3 sm:grid-cols-4 pt-2">
                <div className="rounded-xl border bg-muted/40 p-3.5">
                  <div className="text-[11px] text-muted-foreground">
                    {tr(locale, '1. FOB Alexandria', '١. سعر FOB الإسكندرية')}
                  </div>
                  <div className="text-lg font-extrabold mt-1">${pricing.fob.toFixed(2)}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {tr(locale, 'Total:', 'الإجمالي:')} ${pricing.totalFobOrder.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/40 p-3.5">
                  <div className="text-[11px] text-muted-foreground">
                    {tr(locale, '2. CIF Target Port', '٢. سعر CIF ميناء الوصول')}
                  </div>
                  <div className="text-lg font-extrabold mt-1">${pricing.cifUnit.toFixed(2)}</div>
                  <div className="text-[11px] text-muted-foreground">
                    +{pricing.freightPct}% {tr(locale, 'Freight/Ins.', 'شحن وتأمين')}
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5">
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    {tr(locale, '3. Landed Duty-Paid', '٣. التكلفة خالصة الجمارك')}
                  </div>
                  <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
                    ${pricing.landedUnit.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                    {pricing.dutyPct}% {tr(locale, 'Duty', 'جمارك')}
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/40 p-3.5">
                  <div className="text-[11px] text-muted-foreground">
                    {tr(locale, '4. Importer Wholesale', '٤. سعر بيع المستورد للجملة')}
                  </div>
                  <div className="text-lg font-extrabold mt-1">
                    ${pricing.importerWholesaleUnit.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {tr(locale, 'Retail Est:', 'التجزئة:')} ${pricing.estRetailUnit.toFixed(2)}
                  </div>
                </div>
              </div>

              {pricing.dutySavingsPerOrder > 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs flex items-center justify-between">
                  <span>
                    {tr(
                      locale,
                      `Buyer's direct tariff savings on this ${orderQty.toLocaleString()}-unit order by sourcing from Egypt (${report.tradeAgreement.originCertificate}) vs. MFN suppliers (${report.tradeAgreement.mfnTariffPct}):`,
                      `وفورات المشتري المباشرة من الرسوم الجمركية في هذه الطلبية (${orderQty.toLocaleString()} وحدة) عند الاستيراد من مصر (${report.tradeAgreement.originCertificate}) مقارنة بالمنافسين (${report.tradeAgreement.mfnTariffPct}):`
                    )}
                  </span>
                  <strong className="text-base font-extrabold text-amber-700 dark:text-amber-300 ms-3 shrink-0">
                    +${ Math.round(pricing.dutySavingsPerOrder).toLocaleString() } USD
                  </strong>
                </div>
              )}
            </div>

            {/* Safe Export Payment Terms & Trade Finance Guide */}
            <div className="lg:col-span-5 rounded-2xl border bg-card p-6 space-y-4">
              <h3 className="text-base font-bold">
                {tr(
                  locale,
                  'Safe Export Payment Terms & Risk Protection',
                  'شروط الدفع الآمنة وضمان مخاطر التصدير'
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tr(
                  locale,
                  `Recommended banking & credit-insurance protocols when contracting with buyers in ${report.targetCountryEn}:`,
                  `الضوابط المصرفية وأدوات ضمان الصادرات الموصى بها عند التعاقد مع المشترين في ${report.targetCountryAr}:`
                )}
              </p>
              <div className="space-y-3">
                {(isAr
                  ? report.marketEntry.paymentTermsGuideAr
                  : report.marketEntry.paymentTermsGuideEn
                ).map((term, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-muted/30 p-3.5 flex items-start gap-2.5 text-xs leading-relaxed"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: REALISTIC & TRUSTED EXPORT OPPORTUNITIES & TENDERS
         ===================================================================== */}
      {activeTab === 'TENDERS' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold">
                {tr(
                  locale,
                  `Verified International Tenders & B2B RFQs — ${report.targetCountryEn}`,
                  `المناقصات الدولية وطلبات عروض الأسعار الموثقة — ${report.targetCountryAr}`
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tr(
                  locale,
                  'Sourced from official procurement portals (EU TED, UNGM, ITC Trade Map, and Egyptian Commercial Service ECS). Click "Prepare Official Bid" on any tender to generate a formal bid response.',
                  'مُستخرجة من بوابات المشتريات الرسمية (EU TED، الأمم المتحدة UNGM، مركز التجارة الدولي ITC، والتمثيل التجاري المصري ECS). اضغط "إعداد عرض فني ومالي" لتوليد عرض رسمي.'
                )}
              </p>
            </div>
            <Link
              href={`/${locale}/cluster/consortia`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <Building2 className="h-3.5 w-3.5" />
              {tr(
                locale,
                'Form Export Consortium for Large Tenders',
                'تشكيل تحالف تصديري للمناقصات الكبرى'
              )}
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {report.opportunitiesAndTenders.map((tender) => (
              <div
                key={tender.id}
                className="rounded-2xl border bg-card p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Pill tone="blue">{tender.refCode}</Pill>
                      <Pill tone="emerald">HS {tender.hsCode}</Pill>
                    </div>
                    <Pill tone={tender.deadlineDays <= 25 ? 'amber' : 'default'}>
                      {tr(locale, 'Closes in', 'ينتهي خلال')} {tender.deadlineDays}{' '}
                      {tr(locale, 'days', 'يوماً')}
                    </Pill>
                  </div>

                  <h4 className="text-base font-bold leading-snug">
                    {isAr ? tender.titleAr : tender.titleEn}
                  </h4>

                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      <strong>{tr(locale, 'Authority:', 'الجهة الطارحة:')}</strong>{' '}
                      {isAr ? tender.issuingEntityAr : tender.issuingEntityEn}
                    </span>
                    <span>
                      <strong>{tr(locale, 'Port:', 'الميناء:')}</strong> {tender.deliveryPort}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3 border">
                    <div>
                      <div className="text-[11px] text-muted-foreground">
                        {tr(locale, 'Estimated Contract Value', 'القيمة التقديرية للعقد')}
                      </div>
                      <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {tender.estimatedValue}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground">
                        {tr(locale, 'Official Portal Source', 'المصدر الرسمي للمناقصة')}
                      </div>
                      <a
                        href={tender.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        <span>{isAr ? tender.sourcePortalAr : tender.sourcePortalEn}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="font-bold">
                      {tr(locale, 'Technical Volume & Spec:', 'الكميات والمواصفات الفنية:')}
                    </span>{' '}
                    <span className="text-muted-foreground">
                      {isAr ? tender.volumeSpecAr : tender.volumeSpecEn}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {tender.requiredCerts.map((cert) => (
                      <span
                        key={cert}
                        className="rounded-md border bg-background px-2 py-0.5 text-[11px] font-medium"
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 text-xs leading-relaxed">
                    <strong className="text-amber-700 dark:text-amber-300">
                      {tr(locale, 'Winning Bid Strategy:', 'استراتيجية الفوز بالمناقصة:')}
                    </strong>{' '}
                    {isAr ? tender.bidStrategyAr : tender.bidStrategyEn}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setSelectedTenderForBid(tender)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />
                    {tr(
                      locale,
                      'Prepare Official Bid & Proforma Proposal',
                      'إعداد العرض الفني والمالي للمناقصة'
                    )}
                  </button>
                  <a
                    href={tender.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <span>{tr(locale, 'Open Official Portal', 'فتح البوابة الرسمية')}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Official Tender Bid Generator Drawer */}
          {selectedTenderForBid && (
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-card p-6 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Pill tone="emerald">
                    {tr(locale, 'Official Tender Bid Dossier', 'ملف العرض الفني والمالي الرسمي')}
                  </Pill>
                  <h4 className="text-lg font-bold mt-1">
                    {selectedTenderForBid.refCode} —{' '}
                    {isAr ? selectedTenderForBid.titleAr : selectedTenderForBid.titleEn}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTenderForBid(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕ {tr(locale, 'Close', 'إغلاق')}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {tr(locale, 'Bidding Company / Consortium Name', 'اسم المصنع أو التحالف المتقدم للعطاء')}
                  </label>
                  <input
                    type="text"
                    value={bidCompanyName}
                    onChange={(e) => setBidCompanyName(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {tr(locale, 'Guaranteed Delivery Lead Time (Weeks)', 'مدة التوريد المضمونة (بالأسابيع)')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={bidLeadTimeWeeks}
                    onChange={(e) => setBidLeadTimeWeeks(parseInt(e.target.value, 10) || 4)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {(() => {
                const bidText = `OFFICIAL TECHNICAL & COMMERCIAL TENDER SUBMISSION
Tender Reference: ${selectedTenderForBid.refCode}
Issuing Authority: ${selectedTenderForBid.issuingEntityEn} (${selectedTenderForBid.countryEn})
Submitted By: ${bidCompanyName} — El-Mahalla El-Kubra Industrial Cluster, Egypt
Commodity / HS Code: ${report.productQueryEn} (HS ${selectedTenderForBid.hsCode})
------------------------------------------------------------------------
1. TECHNICAL COMPLIANCE & QUALITY ASSURANCE:
We hereby confirm 100% compliance with tender volume & specification (${selectedTenderForBid.volumeSpecEn}).
All lots are manufactured in El-Mahalla El-Kubra and accompanied by accredited ISO/IEC 17025 laboratory test certificates and ${selectedTenderForBid.requiredCerts.join(', ')}.

2. COMMERCIAL & PREFERENTIAL TARIFF TERMS:
- Unit FOB Alexandria Price: $${pricing.fob.toFixed(2)} USD (${pricing.unitName})
- Unit CIF ${selectedTenderForBid.deliveryPort} Price: $${pricing.cifUnit.toFixed(2)} USD
- Preferential Customs Duty: ${report.tradeAgreement.egyptPreferentialTariffPct} accompanied by official ${report.tradeAgreement.originCertificate} under ${report.tradeAgreement.nameEn}.

3. PRODUCTION & DELIVERY SCHEDULE:
- First Container Dispatch: ${bidLeadTimeWeeks} weeks from L/C confirmation
- Sea Transit to ${selectedTenderForBid.deliveryPort}: ${report.marketStudy.seaTransitDays}

Authorized Signatory: ${senderName}
${bidCompanyName}`;

                return (
                  <div className="space-y-3">
                    <pre className="whitespace-pre-wrap rounded-xl border bg-muted/40 p-4 text-xs font-mono leading-relaxed overflow-x-auto">
                      {bidText}
                    </pre>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyText('tender-bid', bidText)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer"
                      >
                        {copiedId === 'tender-bid' ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        {copiedId === 'tender-bid'
                          ? tr(locale, 'Copied Official Bid!', 'تم نسخ العرض الرسمي!')
                          : tr(locale, 'Copy Tender Bid Letter', 'نسخ خطاب العطاء الرسمي')}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 4: EXPORT PROMOTIONAL PLAN & TRADE-SHOW STRATEGY
         ===================================================================== */}
      {activeTab === 'PROMOTION' && (
        <div className="space-y-6">
          {/* Flagship International Exhibitions + Export Subsidy */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">
                  {tr(
                    locale,
                    `Flagship Trade Fairs & Export Subsidy Guide for ${report.targetCountryEn}`,
                    `المعارض الدولية المعتمدة ودعم الصادرات لسوق ${report.targetCountryAr}`
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {tr(
                    locale,
                    'Target the highest-ROI international exhibitions with Egyptian Export Development Fund (EDF) & ExpoLink booth subsidies.',
                    'استهدف أهم المعارض العالمية المتخصصة مع الاستفادة من دعم صندوق تنمية الصادرات المصرية وهيئة تنمية الصادرات.'
                  )}
                </p>
              </div>
              <Link
                href={`/${locale}/cluster/brand-studio`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition"
              >
                <Palette className="h-3.5 w-3.5" />
                {tr(
                  locale,
                  'Generate Booth Poster, Brochure & Video in Brand Studio',
                  'تصميم بروشور ورول أب وفيديو المعرض في استوديو العلامة'
                )}
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {report.promotionalStrategy.flagshipTradeShows.map((show, idx) => (
                <div key={idx} className="rounded-xl border bg-muted/20 p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Pill tone="emerald">{isAr ? show.monthAr : show.monthEn}</Pill>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {isAr ? show.cityCountryAr : show.cityCountryEn}
                    </span>
                  </div>
                  <h4 className="text-base font-bold">{show.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAr ? show.focusAr : show.focusEn}
                  </p>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs">
                    <strong className="text-amber-700 dark:text-amber-300">
                      {tr(locale, 'Export Fund Subsidy:', 'دعم المعارض الحكومي:')}
                    </strong>{' '}
                    {isAr ? show.edfSubsidyNoteAr : show.edfSubsidyNoteEn}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 12-Week 3-Phase Export Promotional Funnel */}
          <div className="rounded-2xl border bg-card p-6 space-y-4">
            <h3 className="text-lg font-bold">
              {tr(
                locale,
                '90-Day B2B Export Promotional & Buyer Conversion Funnel',
                'الخطة الترويجية التنفيذية (٩٠ يوماً) لاختراق السوق وتحويل المشترين'
              )}
            </h3>
            <div className="grid gap-4 lg:grid-cols-3">
              {(isAr
                ? report.promotionalStrategy.campaignsAr
                : report.promotionalStrategy.campaignsEn
              ).map((camp, idx) => (
                <div key={idx} className="rounded-xl border p-5 space-y-3 bg-background">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <Pill tone="blue">{camp.phase}</Pill>
                  </div>
                  <h4 className="font-bold text-sm">{camp.title}</h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {camp.actions.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-1.5 leading-relaxed">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/25 p-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    🎯 KPI: {camp.kpi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: TRUSTED BUYERS DIRECTORY & 5-STAGE PROFESSIONAL OUTREACH STUDIO
         ===================================================================== */}
      {activeTab === 'BUYERS' && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: Verified Buyers List + Custom Buyer Synthesizer */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold">
                  {tr(
                    locale,
                    `Trusted Buyers in ${report.targetCountryEn}`,
                    `المشترون الموثوقون في ${report.targetCountryAr}`
                  )}
                </h3>
                <Pill tone="emerald">
                  {report.trustedBuyers.length} {tr(locale, 'Verified', 'مشتري موثق')}
                </Pill>
              </div>

              {/* Custom Buyer Search / Add Any Specific Buyer Company */}
              <div className="rounded-2xl border bg-muted/30 p-3 space-y-2">
                <div className="text-[11px] font-bold text-muted-foreground">
                  {tr(
                    locale,
                    'Target a Specific Buyer or Retail Chain (Instant Profile & Outreach Pack):',
                    'استهدف شركة مستوردة أو سلسلة تجزئة محددة (توليد ملف تواصل فوري):'
                  )}
                </div>
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Search className="h-3.5 w-3.5 text-muted-foreground absolute top-2.5 start-2.5" />
                    <input
                      type="text"
                      value={customBuyerQuery}
                      onChange={(e) => setCustomBuyerQuery(e.target.value)}
                      placeholder={tr(
                        locale,
                        'e.g., IKEA, Carrefour, Zara Home, Marriott...',
                        'مثال: إيكيا، كارفور، زارا هوم، ماريوت...'
                      )}
                      className="w-full rounded-xl border bg-background ps-8 pe-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const name = customBuyerQuery.trim();
                      if (!name) return;
                      const templateBuyer = report.trustedBuyers[0];
                      const slug = name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '')
                        .slice(0, 18) || 'buyer';
                      const newBuyer: TrustedBuyerLead = {
                        ...templateBuyer,
                        id: `custom-buyer-${Date.now()}`,
                        companyName: name,
                        trustScore: 95,
                        websiteDomain: `www.${slug}.com`,
                        contactEmailPattern: `sourcing@${slug}.com`,
                        outreachTemplates: templateBuyer.outreachTemplates.map((tpl) => ({
                          ...tpl,
                          subjectEn: tpl.subjectEn.replace(templateBuyer.companyName, name),
                          subjectAr: tpl.subjectAr.replace(templateBuyer.companyName, name),
                          bodyEn: tpl.bodyEn.replaceAll(templateBuyer.companyName, name),
                          bodyAr: tpl.bodyAr.replaceAll(templateBuyer.companyName, name),
                        })),
                      };
                      setReport((prev) => ({
                        ...prev,
                        trustedBuyers: [newBuyer, ...prev.trustedBuyers],
                      }));
                      setSelectedBuyerIdx(0);
                      setCustomBuyerQuery('');
                    }}
                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer shrink-0"
                  >
                    + {tr(locale, 'Add Buyer', 'إضافة المشتري')}
                  </button>
                </div>
              </div>

              {report.trustedBuyers.map((buyer, idx) => {
                const isSelected = idx === selectedBuyerIdx;
                return (
                  <button
                    key={buyer.id}
                    type="button"
                    onClick={() => setSelectedBuyerIdx(idx)}
                    className={`w-full text-start rounded-2xl border p-4 transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-sm'
                        : 'bg-card hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-sm text-foreground">
                          {buyer.companyName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isAr ? buyer.cityCountryAr : buyer.cityCountryEn} •{' '}
                          {isAr ? buyer.buyerTierAr : buyer.buyerTierEn}
                        </div>
                      </div>
                      <Pill tone="emerald">
                        {tr(locale, 'Trust', 'موثوقية')} {buyer.trustScore}%
                      </Pill>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg border bg-background/70 p-2">
                        <div className="text-[10px] text-muted-foreground">
                          {tr(locale, 'Annual Imports', 'الواردات السنوية')}
                        </div>
                        <div className="font-bold">{buyer.annualImportEstimate}</div>
                      </div>
                      <div className="rounded-lg border bg-background/70 p-2">
                        <div className="text-[10px] text-muted-foreground">
                          {tr(locale, 'Decision Maker', 'صانع القرار')}
                        </div>
                        <div className="font-semibold truncate">
                          {isAr ? buyer.decisionMakerRoleAr : buyer.decisionMakerRoleEn}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 text-[11px] text-muted-foreground">
                      <span>✓ {isAr ? buyer.verificationSourceAr : buyer.verificationSourceEn}</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-300">
                        {buyer.contactEmailPattern}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: 5-Stage Professional B2B Outreach & Negotiation Studio */}
            {activeBuyer && activeTemplate && (
              <div className="lg:col-span-7 space-y-5">
                <div className="rounded-2xl border bg-card p-6 space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Pill tone="blue">
                          {tr(locale, 'Selected Buyer', 'المشتري المحدد')}
                        </Pill>
                        <span className="text-xs text-muted-foreground font-mono">
                          {activeBuyer.websiteDomain}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mt-1">{activeBuyer.companyName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAr ? activeBuyer.sourcingFocusAr : activeBuyer.sourcingFocusEn}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-xl border bg-muted/40 p-1">
                      <button
                        type="button"
                        onClick={() => setOutreachLang('en')}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                          outreachLang === 'en'
                            ? 'bg-emerald-600 text-white'
                            : 'text-muted-foreground'
                        }`}
                      >
                        English B2B
                      </button>
                      <button
                        type="button"
                        onClick={() => setOutreachLang('ar')}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                          outreachLang === 'ar'
                            ? 'bg-emerald-600 text-white'
                            : 'text-muted-foreground'
                        }`}
                      >
                        نسخة عربية
                      </button>
                    </div>
                  </div>

                  {/* Buyer Intelligence Metadata */}
                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="rounded-xl border bg-muted/30 p-3">
                      <div className="text-[11px] text-muted-foreground">
                        {tr(locale, 'Target Role', 'المنصب المستهدف')}
                      </div>
                      <div className="font-bold mt-0.5">
                        {isAr ? activeBuyer.decisionMakerRoleAr : activeBuyer.decisionMakerRoleEn}
                      </div>
                    </div>
                    <div className="rounded-xl border bg-muted/30 p-3">
                      <div className="text-[11px] text-muted-foreground">
                        {tr(locale, 'Buying Window', 'موسم التعاقد')}
                      </div>
                      <div className="font-bold mt-0.5">
                        {isAr ? activeBuyer.buyingWindowAr : activeBuyer.buyingWindowEn}
                      </div>
                    </div>
                    <div className="rounded-xl border bg-muted/30 p-3">
                      <div className="text-[11px] text-muted-foreground">
                        {tr(locale, 'Preferred Payment Terms', 'شروط الدفع المعتادة')}
                      </div>
                      <div className="font-bold mt-0.5">{activeBuyer.preferredPaymentTerms}</div>
                    </div>
                  </div>

                  {/* Cultural & Native Greeting Tip */}
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                    <strong className="text-amber-700 dark:text-amber-300">
                      {tr(locale, 'Cultural Protocol & Native Greeting:', 'بروتوكول التخاطب والتحية المحلية:')}
                    </strong>{' '}
                    <span>{activeTemplate.nativeLanguageNoteEn}</span>
                  </div>

                  {/* 5 Communication Stage Selector */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      {tr(
                        locale,
                        'Select Professional B2B Communication Stage (5 Stages):',
                        'اختر مرحلة التواصل التجاري مع المشتري (٥ مراحل احترافية):'
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeBuyer.outreachTemplates.map((tpl, tIdx) => (
                        <button
                          key={tpl.stageId}
                          type="button"
                          onClick={() => setSelectedStageIdx(tIdx)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                            selectedStageIdx === tIdx
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                              : 'border bg-muted/40 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {tIdx + 1}. {isAr ? tpl.stageLabelAr : tpl.stageLabelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sender Customization Inputs */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        {tr(locale, 'Your Name & Title', 'اسمك والمسمى الوظيفي')}
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full rounded-xl border bg-background px-3 py-1.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                        {tr(locale, 'Your Mill / Company Name', 'اسم المصنع أو الشركة')}
                      </label>
                      <input
                        type="text"
                        value={senderFactory}
                        onChange={(e) => setSenderFactory(e.target.value)}
                        className="w-full rounded-xl border bg-background px-3 py-1.5 text-xs"
                      />
                    </div>
                  </div>

                  {/* Email Subject & Body Preview */}
                  <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
                    <div className="text-xs border-b pb-2">
                      <span className="font-bold text-muted-foreground">
                        {tr(locale, 'Subject:', 'عنوان الرسالة:')}
                      </span>{' '}
                      <span className="font-bold text-foreground">
                        {outreachLang === 'ar'
                          ? activeTemplate.subjectAr
                          : activeTemplate.subjectEn}
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground">
                      {customizedOutreachBody}
                    </pre>
                  </div>

                  {/* Action Buttons: Copy, Mailto, WhatsApp */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        copyText(
                          'outreach-msg',
                          `Subject: ${
                            outreachLang === 'ar'
                              ? activeTemplate.subjectAr
                              : activeTemplate.subjectEn
                          }\n\n${customizedOutreachBody}`
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition cursor-pointer"
                    >
                      {copiedId === 'outreach-msg' ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedId === 'outreach-msg'
                        ? tr(locale, 'Copied to Clipboard!', 'تم نسخ الرسالة!')
                        : tr(locale, 'Copy Subject & Message', 'نسخ العنوان والرسالة')}
                    </button>

                    <a
                      href={`mailto:${activeBuyer.contactEmailPattern}?subject=${encodeURIComponent(
                        outreachLang === 'ar'
                          ? activeTemplate.subjectAr
                          : activeTemplate.subjectEn
                      )}&body=${encodeURIComponent(customizedOutreachBody)}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold hover:bg-muted transition"
                    >
                      <Mail className="h-3.5 w-3.5 text-blue-600" />
                      {tr(locale, 'Open in Email App', 'فتح في تطبيق البريد')}
                    </a>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `${
                          outreachLang === 'ar'
                            ? activeTemplate.subjectAr
                            : activeTemplate.subjectEn
                        }\n\n${customizedOutreachBody}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border bg-background px-3.5 py-2 text-xs font-bold hover:bg-muted transition"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                      {tr(locale, 'Send via WhatsApp B2B', 'إرسال عبر واتساب للأعمال')}
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowProformaModal((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
                    >
                      <FileCheck2 className="h-3.5 w-3.5" />
                      {tr(
                        locale,
                        'Generate Export Proforma Invoice (PI)',
                        'إصدار فاتورة مبدئية للتصدير (Proforma Invoice)'
                      )}
                    </button>
                  </div>

                  {/* Expandable Official Export Proforma Invoice (PI) Dossier */}
                  {showProformaModal && (
                    <div className="mt-4 rounded-2xl border-2 border-amber-500/40 bg-background p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Pill tone="amber">
                          {tr(
                            locale,
                            'Incoterms® 2020 Export Proforma Invoice (PI)',
                            'فاتورة تصدير مبدئية معتمدة (Incoterms® 2020)'
                          )}
                        </Pill>
                        <button
                          type="button"
                          onClick={() => setShowProformaModal(false)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          ✕ {tr(locale, 'Close', 'إغلاق')}
                        </button>
                      </div>
                      {(() => {
                        const piNo = `PI-MHL-${new Date().getFullYear()}-${activeBuyer.trustScore}08`;
                        const piText = `COMMERCIAL PROFORMA INVOICE — ${piNo}
Exporter: ${senderFactory} (El-Mahalla El-Kubra Industrial Zone, Egypt)
Consignee / Buyer: ${activeBuyer.companyName} (${activeBuyer.cityCountryEn})
Attention: ${activeBuyer.decisionMakerRoleEn} | Domain: ${activeBuyer.websiteDomain}
------------------------------------------------------------------------
Commodity Description: ${report.productQueryEn}
Harmonized System (HS) Code: ${report.hsCode} (${report.hsDescriptionEn})
Country of Origin: Arab Republic of Egypt (El-Mahalla El-Kubra Cluster)
Preferential Trade Treaty: ${report.tradeAgreement.nameEn}
Origin Certificate Included: ${report.tradeAgreement.originCertificate} (Destination Duty: ${report.tradeAgreement.egyptPreferentialTariffPct} vs MFN ${report.tradeAgreement.mfnTariffPct})
------------------------------------------------------------------------
Order Quantity: ${orderQty.toLocaleString()} Units (${pricing.unitName})
Unit Price (FOB Alexandria/Damietta, Incoterms® 2020): $${pricing.fob.toFixed(2)} USD
Total FOB Value: $${pricing.totalFobOrder.toLocaleString()} USD
Unit Price (CIF ${report.marketStudy.seaPortRouteEn}): $${pricing.cifUnit.toFixed(2)} USD
Total CIF Value: $${Math.round(pricing.cifUnit * orderQty).toLocaleString()} USD
------------------------------------------------------------------------
Payment Terms: ${activeBuyer.preferredPaymentTerms}
Estimated Sea Transit: ${report.marketStudy.seaTransitDays}
NTM & Lab Compliance Warranty: Certified compliant with ${report.ntmAndStandards.measures
                          .slice(0, 3)
                          .map((m) => m.code)
                          .join(', ')} (ISO/IEC 17025 Lab Report attached).

Authorized Exporter Signatory: ${senderName}`;
                        return (
                          <div className="space-y-2">
                            <pre className="whitespace-pre-wrap rounded-xl border bg-muted/40 p-3.5 text-xs font-mono leading-relaxed overflow-x-auto">
                              {piText}
                            </pre>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => copyText('pi-doc', piText)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-500 transition cursor-pointer"
                              >
                                {copiedId === 'pi-doc' ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                                {copiedId === 'pi-doc'
                                  ? tr(locale, 'Copied Proforma Invoice!', 'تم نسخ الفاتورة المبدئية!')
                                  : tr(locale, 'Copy Proforma Invoice', 'نسخ الفاتورة المبدئية')}
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* AI Live Buyer Objection & Negotiation Copilot */}
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <h4 className="text-sm font-bold">
                      {tr(
                        locale,
                        'AI Buyer Negotiation Copilot — Overcome Any Buyer Objection',
                        'المستشار الذكي للتفاوض التصديري — الرد الاحترافي على اعتراضات المشتري'
                      )}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tr(
                      locale,
                      `Paste any email reply or price/MOQ objection from ${activeBuyer.companyName} and generate an executive counter-argument backed by tariff and lab data.`,
                      `اكتب أي اعتراض سعري أو شرط دفع يطلبه المشتري (${activeBuyer.companyName}) ليقوم الذكاء الاصطناعي بصياغة رد تفاوضي مدعوم ببيانات الإعفاء الجمركي والمواصفات.`
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={objectionPrompt}
                      onChange={(e) => setObjectionPrompt(e.target.value)}
                      placeholder={tr(
                        locale,
                        'e.g., Buyer says Turkish supplier is 6% cheaper and wants 60-day payment terms...',
                        'مثال: المشتري يقول إن أسعار تركيا أقل بنسبة 6% ويطلب تسهيلات سداد 60 يوماً...'
                      )}
                      className="flex-1 rounded-xl border bg-background px-3.5 py-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAskCopilot}
                      disabled={copilotLoading}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-60 transition cursor-pointer shrink-0"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {copilotLoading
                        ? tr(locale, 'Drafting Reply...', 'جارٍ صياغة الرد...')
                        : tr(locale, 'Draft Counter-Offer', 'صياغة رد تفاوضي')}
                    </button>
                  </div>
                  {copilotResponse && (
                    <div className="rounded-xl border bg-background p-4 text-xs whitespace-pre-wrap leading-relaxed">
                      {copilotResponse}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: COUNTRY STANDARDS & NON-TARIFF MEASURES (NTM) ANALYZER
         ===================================================================== */}
      {activeTab === 'NTM_STANDARDS' && (
        <div className="space-y-6">
          {/* Regulatory Summary Banner */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3 max-w-3xl">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold">
                  {tr(
                    locale,
                    `Regulatory & Non-Tariff Measures (NTM) Profile — ${report.targetCountryEn}`,
                    `ملف المواصفات القياسية والإجراءات غير الجمركية (NTM) — ${report.targetCountryAr}`
                  )}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {isAr
                    ? `${report.ntmAndStandards.riskLevelAr} — ${report.ntmAndStandards.summaryAr}`
                    : `${report.ntmAndStandards.riskLevelEn} — ${report.ntmAndStandards.summaryEn}`}
                </p>
              </div>
            </div>

            <Link
              href={`/${locale}/cluster/academy/studio`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2.5 text-xs font-bold hover:opacity-90 transition shrink-0"
            >
              <GraduationCap className="h-4 w-4" />
              {tr(
                locale,
                'Train QC Team on These Standards in Academy',
                'توليد دورة تدريبية لفريق الجودة حول هذه المواصفات'
              )}
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left 8 cols: Detailed NTM Regulation Matrix */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-base font-bold">
                  {tr(
                    locale,
                    'Technical Regulations, Chemical Limits, Labeling & Lab Benchmarks',
                    'اللوائح الفنية، الحدود الكيميائية، اشتراطات البطاقة التعريفية والاختبارات المعملية'
                  )}
                </h4>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'ALL' as const, en: 'All NTMs', ar: 'جميع الاشتراطات' },
                    { id: 'MANDATORY_LAW' as const, en: 'Mandatory Law', ar: 'إلزامي قانوناً' },
                    { id: 'BUYER_MANDATE' as const, en: 'Buyer Mandate', ar: 'اشترطات المشترين' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setNtmFilter(f.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                        ntmFilter === f.id
                          ? 'bg-emerald-600 text-white'
                          : 'border bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      {isAr ? f.ar : f.en}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredNtmRegs.map((reg) => (
                  <div key={reg.code} className="rounded-2xl border bg-card p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Pill tone="purple">{reg.code}</Pill>
                        <span className="text-xs font-bold text-muted-foreground">
                          {isAr ? reg.categoryAr : reg.categoryEn}
                        </span>
                      </div>
                      <Pill
                        tone={
                          reg.mandatoryLevel === 'MANDATORY_LAW'
                            ? 'red'
                            : reg.mandatoryLevel === 'PREFERENTIAL_ORIGIN'
                            ? 'emerald'
                            : 'amber'
                        }
                      >
                        {reg.mandatoryLevel === 'MANDATORY_LAW'
                          ? tr(locale, 'Mandatory Customs Law', 'إلزامي للتخليص الجمركي')
                          : reg.mandatoryLevel === 'PREFERENTIAL_ORIGIN'
                          ? tr(locale, 'Duty-Free Origin Rule', 'شرط الإعفاء الجمركي')
                          : tr(locale, 'Retail / Buyer Standard', 'معيار سلاسل التجزئة')}
                      </Pill>
                    </div>

                    <div>
                      <h5 className="text-sm font-bold">
                        {isAr ? reg.titleAr : reg.titleEn}
                      </h5>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        <strong>{tr(locale, 'Enforcing Authority:', 'الجهة الرقابية:')}</strong>{' '}
                        {isAr ? reg.authorityAr : reg.authorityEn}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 text-xs">
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <div className="font-bold text-foreground mb-1">
                          {tr(
                            locale,
                            'Technical Threshold / Requirement:',
                            'الحد الفني المسموح / المتطلب الإلزامي:'
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {isAr ? reg.limitOrRequirementAr : reg.limitOrRequirementEn}
                        </p>
                      </div>

                      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3">
                        <div className="font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                          {tr(
                            locale,
                            'Required Lab Verification Method:',
                            'طريقة الفحص والاعتماد المعملي:'
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {isAr ? reg.verificationLabTestAr : reg.verificationLabTestEn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 cols: Interactive Pre-Shipment Customs Clearance Document Checklist */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl border bg-card p-6 space-y-4 sticky top-20">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold">
                    {tr(
                      locale,
                      'Pre-Shipment Customs Document Checklist',
                      'قائمة فحص مستندات الشحن والتخليص الجمركي'
                    )}
                  </h4>
                  <Pill tone={checklistPct === 100 ? 'emerald' : 'amber'}>{checklistPct}%</Pill>
                </div>

                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${checklistPct}%` }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {tr(
                    locale,
                    `Verify every mandatory export document before container gate-in for ${report.targetCountryEn}:`,
                    `تحقق من استيفاء جميع المستندات الإلزامية قبل دخول الحاوية للميناء باتجاه ${report.targetCountryAr}:`
                  )}
                </p>

                <div className="space-y-2.5">
                  {report.ntmAndStandards.customsDocumentsChecklist.map((docItem, idx) => {
                    const checked = !!checkedDocs[idx];
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed cursor-pointer transition ${
                          checked
                            ? 'border-emerald-500/40 bg-emerald-500/10 font-medium'
                            : 'bg-muted/20 hover:bg-muted/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setCheckedDocs((prev) => ({ ...prev, [idx]: !prev[idx] }))
                          }
                          className="mt-0.5 h-4 w-4 rounded accent-emerald-600"
                        />
                        <div>
                          <div className="font-semibold">
                            {isAr ? docItem.docAr : docItem.docEn}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {isAr ? docItem.issuerAr : docItem.issuerEn}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-2 border-t flex flex-col gap-2">
                  <Link
                    href={`/${locale}/cluster/facilities`}
                    className="inline-flex items-center justify-between rounded-xl border bg-muted/40 px-3.5 py-2.5 text-xs font-bold hover:bg-muted transition"
                  >
                    <span>
                      {tr(
                        locale,
                        'Book TIGARA Accredited ISO 17025 Lab Test',
                        'حجز فحص معمل تيجارا المعتمد ISO 17025'
                      )}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
