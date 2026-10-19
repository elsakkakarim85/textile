"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';
import {
  FileText,
  Send,
  TrendingUp,
  Sparkles,
  Handshake,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

export default function MatchmakingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // RFQ Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'EGP'>('USD');
  const [submitting, setSubmitting] = useState(false);

  const rfqTemplates = [
    {
      title: '100% Giza 86 Combed Cotton Sateen Bedlinen (300 TC, OEKO-TEX 100)',
      qty: '10000',
      price: '28',
      curr: 'USD' as const,
      desc: '40/1 Ne combed Giza 86 cotton, 300 thread count sateen weave, reactive dyed optical white & pastel shades (ΔE ≤ 0.8), ISO 105 fastness ≥ 4, EU Digital Product Passport required.',
    },
    {
      title: '550 GSM Luxury Hotel Jacquard Terry Towels (Zero-Twist Pile)',
      qty: '25000',
      price: '4.80',
      curr: 'EUR' as const,
      desc: '100% Egyptian carded/combed ring-spun cotton, 550 GSM, 16/1 ground warp, hydrophilicity < 3 sec (ASTM D4772), double-needle lockstitch hem.',
    },
    {
      title: 'ZDHC Level 3 Reactive Dyed Interlock & Single Jersey (180 GSM)',
      qty: '15000',
      price: '6.50',
      curr: 'USD' as const,
      desc: 'Ne 30/1 compact combed cotton knitted fabric, enzyme bio-polished, Sanforized shrinkage < 3% (ISO 6330), full ZDHC MRSL v3.1 compliance.',
    },
  ];

  useEffect(() => {
    fetchRfqs();
  }, []);

  const fetchRfqs = async () => {
    try {
      const res = await fetch('/api/public/rfq');
      const data = await res.json();
      setRfqs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePostRFQ = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const numericQty = Number(String(quantity).replace(/[^0-9]/g, '')) || 1000;
      const numericTarget = targetPrice
        ? Number(String(targetPrice).replace(/[^0-9.]/g, '')) || undefined
        : undefined;
      const res = await fetch('/api/buyer/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          quantity: numericQty,
          targetPrice: numericTarget,
          currency,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle('');
        setDescription('');
        setQuantity('');
        setTargetPrice('');
        fetchRfqs();
      } else {
        alert(data.error || 'Failed to broadcast RFQ.');
      }
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  const handleAiGenerate = async () => {
    if (!selectedRfq) return;
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/factory/rfqs/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfqTitle: selectedRfq.title,
          rfqDescription: selectedRfq.description,
        }),
      });
      const data = await res.json();
      if (res.ok && data.pitch) {
        setQuoteMessage(data.pitch);
      } else {
        alert(data.error || 'Failed to generate AI pitch');
      }
    } catch (e) {
      console.error(e);
    }
    setGeneratingAi(false);
  };

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const unitPrice = Number(String(quotePrice).replace(/[^0-9.]/g, '')) || 50;
      const res = await fetch('/api/factory/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfqId: selectedRfq.id,
          unitPrice,
          currency: selectedRfq.currency || 'USD',
          message: quoteMessage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedRfq(null);
        setQuotePrice('');
        setQuoteMessage('');
        fetchRfqs();
      } else {
        alert(data.error || 'Failed to submit quote.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-10">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t(
                'Smart Escrow • Consortia Bidding • AI Technical Proposals',
                'مناقصات موثقة • تحالفات تصديرية • عروض فنية بالذكاء الاصطناعي'
              )}
            </div>
            <ExpertManualButton manualId="marketplace-matchmaking" locale={locale} variant="pill" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold">
            {t(
              'B2B Export Matchmaking & RFQ Exchange',
              'بورصة المناقصات وطلبات عروض الأسعار التصديرية (RFQ)'
            )}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {t(
              'Post your textile sourcing specifications to receive audited quotations from El Mahalla El Kubra mills, or combine SME capacities via an Export Consortium.',
              'انشر مواصفات طلبيتك للحصول على عروض أسعار مباشرة من مصانع المحلة المعتمدة، أو شكّل تحالفاً تصديرياً لتنفيذ الطلبيات الكبرى.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link href={`/${locale}/cluster/consortia`}>
            <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold gap-1.5 text-xs">
              <Handshake className="w-4 h-4" />
              {t('Export Consortia Hub', 'مركز التحالفات التصديرية')}
            </Button>
          </Link>
          <Link href={`/${locale}/dashboard/contracts`}>
            <Button
              variant="outline"
              className="border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs"
            >
              {t('Smart Escrow Contracts', 'عقود الضمان الذكية')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Post RFQ Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-md border-primary/20 overflow-hidden">
            <div className="bg-primary/10 p-4 border-b">
              <h2 className="font-bold text-base flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                {t('Broadcast New Sourcing RFQ', 'نشر مناقصة توريد جديدة (RFQ)')}
              </h2>
            </div>
            <CardContent className="p-5 space-y-4">
              {/* 1-Click Buyer Templates */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-muted-foreground block">
                  {t('1-Click Buyer Spec Templates:', 'نماذج مواصفات سريعة للمشترين:')}
                </span>
                <div className="flex flex-col gap-1.5">
                  {rfqTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setTitle(tpl.title);
                        setQuantity(tpl.qty);
                        setTargetPrice(tpl.price);
                        setCurrency(tpl.curr);
                        setDescription(tpl.desc);
                      }}
                      className="text-start text-[11px] p-2 rounded-lg border bg-muted/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-colors font-medium truncate"
                    >
                      ✨ {tpl.title}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handlePostRFQ} className="space-y-3.5 pt-2 border-t">
                <div>
                  <label className="text-xs font-bold block mb-1">
                    {t('Product / Tech-Pack Title', 'عنوان المنتج أو المناقصة')}
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t(
                      'e.g. 100% Giza 86 Combed Cotton Bedlinen Sets',
                      'مثال: أطقم ملايات قطن جيزة 86 ممشط'
                    )}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-xs md:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold block mb-1">
                      {t('Quantity (Units/kg)', 'الكمية المطلوبة')}
                    </label>
                    <input
                      required
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="10000"
                      className="w-full bg-background border rounded-lg px-3 py-2 text-xs md:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">
                      {t('Target Price', 'السعر المستهدف')}
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        placeholder="25"
                        className="w-full bg-background border rounded-lg px-2.5 py-2 text-xs md:text-sm"
                      />
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as any)}
                        className="border rounded-lg px-2 text-xs bg-background font-bold"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="EGP">EGP</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">
                    {t(
                      'Technical & Compliance Specifications',
                      'المواصفات الفنية وشروط الجودة والتصدير'
                    )}
                  </label>
                  <textarea
                    required
                    minLength={10}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder={t(
                      'Describe yarn count (Ne), GSM, weave/knit structure, OEKO-TEX / ZDHC requirements, and delivery lead time...',
                      'اذكر نمرة الغزل، وزن المتر المربع GSM، نوع النسيج، شهادات الأيكوتكس و ZDHC، وموعد التسليم...'
                    )}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-xs md:text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5"
                >
                  {submitting
                    ? t('Broadcasting...', 'جاري النشر...')
                    : t('Broadcast to Cluster Factories', 'إرسال لجميع مصانع التجمع المعتمدة')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Live Open Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              {t('Live Open Sourcing RFQs', 'المناقصات وطلبات التوريد المفتوحة')}
            </h2>
            <span className="text-xs text-muted-foreground font-semibold">
              {rfqs.length} {t('active tenders', 'مناقصات نشطة')}
            </span>
          </div>

          {loading ? (
            <Card className="p-8 text-center text-muted-foreground">
              {t('Loading live market requests...', 'جاري تحميل المناقصات المفتوحة...')}
            </Card>
          ) : rfqs.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-muted/20">
              <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-bold">
                {t('No open requests right now.', 'لا توجد مناقصات مفتوحة حالياً.')}
              </h3>
            </div>
          ) : (
            rfqs.map((rfq) => (
              <Card key={rfq.id} className="hover:border-primary/50 transition-all shadow-2xs">
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        {rfq.status || 'OPEN'}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(rfq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {t('Bids Received:', 'العروض المقدمة:')}{' '}
                      <strong className="text-foreground">{rfq._count?.quotations ?? 0}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5">{rfq.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {rfq.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs block">
                          {t('Required Volume', 'الكمية المطلوبة')}
                        </span>
                        <span className="font-extrabold">
                          {Number(rfq.quantity || 0).toLocaleString()} {rfq.unit || 'units'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs block">
                          {t('Target Unit Price', 'السعر المستهدف')}
                        </span>
                        <span className="font-extrabold text-emerald-600">
                          {rfq.targetPrice
                            ? `${rfq.targetPrice} ${rfq.currency || 'USD'}`
                            : t('Negotiable', 'قابل للتفاوض')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/${locale}/cluster/academy/studio?topic=${encodeURIComponent(
                          rfq.title
                        )}&need=${encodeURIComponent(rfq.description || '')}`}
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          {t('Train Team for Spec (AI)', 'تدريب الفريق على المواصفة')}
                        </Button>
                      </Link>
                      <Link href={`/${locale}/cluster/consortia`}>
                        <Button type="button" size="sm" variant="outline" className="text-xs gap-1">
                          <Handshake className="w-3.5 h-3.5" />
                          {t('Form Consortium', 'تشكيل تحالف')}
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setSelectedRfq(rfq)}
                        className="bg-primary text-primary-foreground text-xs font-bold"
                      >
                        {t('Submit Official Quote', 'تقديم عرض سعر رسمي')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {selectedRfq && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border">
            <button
              onClick={() => setSelectedRfq(null)}
              className="absolute top-4 end-4 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-1">
              {t('Submit Official Factory Quotation', 'تقديم عرض سعر رسمي من المصنع')}
            </h2>
            <p className="text-xs text-muted-foreground mb-5">
              {t('Bidding on:', 'المناقصة:')} <strong>{selectedRfq.title}</strong>
            </p>

            <form onSubmit={submitQuote} className="space-y-4">
              <div>
                <label className="text-xs font-bold block mb-1">
                  {t('Unit Price Offer', 'سعر الوحدة المقترح')} ({selectedRfq.currency || 'USD'})
                </label>
                <input
                  required
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="24.50"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold">
                    {t(
                      'Technical Proposal, ISO/OEKO-TEX Compliance & Lead Time',
                      'العرض الفني وشهادات الجودة ومدة التوريد'
                    )}
                  </label>
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={generatingAi}
                    className="text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    {generatingAi
                      ? t('Writing Proposal...', 'جاري كتابة العرض...')
                      : t('AI Auto-Pitch', 'كتابة العرض بالذكاء الاصطناعي')}
                  </button>
                </div>
                <textarea
                  required
                  minLength={5}
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  rows={5}
                  placeholder={t(
                    'Click "AI Auto-Pitch" above or detail your yarn/fabric specs, ISO 17025 lab verification, and delivery schedule...',
                    'اضغط على "كتابة العرض بالذكاء الاصطناعي" أعلاه أو اكتب تفاصيل المواصفات والجدول الزمني للتوريد...'
                  )}
                  className="w-full border rounded-lg px-3 py-2 text-xs md:text-sm bg-background"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5"
              >
                {t('Send Official Quotation', 'إرسال عرض السعر الرسمي')}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
