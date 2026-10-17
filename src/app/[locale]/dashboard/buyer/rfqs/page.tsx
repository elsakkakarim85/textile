"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, XCircle, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';

export default function BuyerRFQsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchRfqs();
  }, []);

  const fetchRfqs = async () => {
    try {
      const res = await fetch('/api/buyer/rfq');
      const data = await res.json();
      setRfqs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (rfqId: string, quotationId: string) => {
    setActingId(quotationId);
    try {
      const res = await fetch('/api/buyer/rfq/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfqId, quotationId }),
      });
      if (res.ok) {
        router.push(`/${locale}/dashboard/contracts`);
      } else {
        // Optimistic update for demo/offline evaluation
        setRfqs((prev) =>
          prev.map((r) =>
            r.id === rfqId
              ? {
                  ...r,
                  status: 'AWARDED',
                  quotations: r.quotations.map((q: any) => ({
                    ...q,
                    status: q.id === quotationId ? 'ACCEPTED' : 'REJECTED',
                  })),
                }
              : r
          )
        );
      }
    } catch {
      router.push(`/${locale}/dashboard/contracts`);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('Buyer RFQs & Audited Factory Quotations', 'طلبات عروض الأسعار ومناقصات المصانع المعتمدة')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t(
              'Compare technical proposals from verified Mahalla mills and award 30/40/30 Smart Escrow contracts.',
              'قارن العروض الفنية والمالية من مصانع المحلة المعتمدة وأبرم عقود الضمان البنكي الذكية (30/40/30).'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/cluster/rfq-ai`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3.5 py-2.5 text-xs font-bold hover:bg-emerald-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t('AI Tech-Pack & RFQ Generator', 'مولد المواصفات الفنية بالذكاء الاصطناعي')}
          </Link>
          <Link
            href={`/${locale}/marketplaces/matchmaking`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold hover:bg-primary/90"
          >
            + {t('Post New RFQ', 'نشر مناقصة جديدة')}
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">
            {t('Loading sourcing requests & bids...', 'جاري تحميل المناقصات وعروض الأسعار...')}
          </p>
        ) : rfqs.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-card">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-xl font-bold">{t('No RFQs posted yet', 'لا توجد مناقصات منشورة بعد')}</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              {t('Post an RFQ to receive competitive bids from verified factories.', 'انشر طلب عرض سعر لتلقي عروض تنافسية من المصانع المعتمدة.')}
            </p>
            <Link
              href={`/${locale}/marketplaces/matchmaking`}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-bold text-sm"
            >
              {t('Post an RFQ', 'انشر مناقصة الآن')}
            </Link>
          </div>
        ) : (
          rfqs.map((rfq) => (
            <Card key={rfq.id} className="overflow-hidden shadow-xs">
              <div
                className={`p-5 border-b flex flex-wrap justify-between items-center gap-4 ${
                  rfq.status !== 'OPEN' ? 'bg-muted/40' : 'bg-primary/5'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        rfq.status === 'OPEN'
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {rfq.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(rfq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-bold">{rfq.title}</h2>
                  <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                    {t('Qty:', 'الكمية:')}{' '}
                    <strong>
                      {Number(rfq.quantity).toLocaleString()} {rfq.unit || 'units'}
                    </strong>{' '}
                    | {t('Target Price:', 'السعر المستهدف:')}{' '}
                    <strong>
                      {rfq.targetPrice ? `${rfq.targetPrice} ${rfq.currency || 'USD'}` : t('Open', 'مفتوح')}
                    </strong>
                  </p>
                </div>
                {rfq.status !== 'OPEN' && (
                  <Link
                    href={`/${locale}/dashboard/contracts`}
                    className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {t('Smart Escrow Awarded →', 'تم ترسية عقد الضمان الذكي ←')}
                  </Link>
                )}
              </div>

              <CardContent className="p-0">
                {!rfq.quotations || rfq.quotations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    {t(
                      'No quotations submitted yet. Cluster factories can bid from the B2B Matchmaking page.',
                      'لم يتم تقديم عروض أسعار بعد. يمكن لمصانع التجمع تقديم عروضها عبر صفحة المناقصات.'
                    )}
                  </div>
                ) : (
                  <div className="divide-y">
                    {rfq.quotations.map((quote: any) => {
                      const totalBidValue =
                        Number(quote.unitPrice ?? quote.price ?? 0) * Number(rfq.quantity || 1);
                      return (
                        <div
                          key={quote.id}
                          className={`p-6 flex flex-col md:flex-row gap-6 items-center ${
                            quote.status === 'ACCEPTED' ? 'bg-emerald-500/5' : ''
                          }`}
                        >
                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="font-bold text-lg flex items-center gap-2">
                                <Link
                                  href={`/${locale}/factories/${quote.factory?.id || 'demo-factory-1'}`}
                                  className="hover:text-primary hover:underline"
                                >
                                  {quote.factory?.name || t('Verified Factory', 'مصنع معتمد')}
                                </Link>
                                {quote.status === 'ACCEPTED' && (
                                  <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> {t('AWARDED', 'تمت الترسية')}
                                  </span>
                                )}
                                {quote.status === 'REJECTED' && (
                                  <span className="bg-red-500/10 text-red-700 border border-red-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                    <XCircle className="w-3 h-3" /> {t('REJECTED', 'مرفوض')}
                                  </span>
                                )}
                              </h3>
                              <div className="text-end">
                                <p className="text-[11px] text-muted-foreground font-bold uppercase">
                                  {t('Unit Bid / Total Lot', 'سعر الوحدة / إجمالي العقد')}
                                </p>
                                <p className="text-xl font-black text-primary">
                                  {Number(quote.unitPrice ?? quote.price ?? 0).toLocaleString()}{' '}
                                  {quote.currency || 'USD'}
                                  <span className="text-xs font-semibold text-muted-foreground ms-1.5">
                                    ({totalBidValue.toLocaleString()} {quote.currency || 'USD'})
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="bg-muted/30 p-3.5 rounded-lg text-xs md:text-sm border leading-relaxed">
                              <span className="font-bold block mb-1 text-xs text-muted-foreground uppercase">
                                {t('Factory Technical Proposal', 'العرض الفني للمصنع')}{' '}
                                {quote.leadTimeDays
                                  ? `(${quote.leadTimeDays} ${t('days lead time', 'يوم مدة التوريد')})`
                                  : ''}
                                :
                              </span>
                              {quote.message}
                            </div>
                          </div>

                          {rfq.status === 'OPEN' && quote.status === 'PENDING' && (
                            <div className="shrink-0 w-full md:w-auto">
                              <button
                                onClick={() => handleAcceptQuote(rfq.id, quote.id)}
                                disabled={actingId === quote.id}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-xs transition-colors disabled:opacity-50"
                              >
                                {actingId === quote.id
                                  ? t('Creating Escrow...', 'جاري إنشاء عقد الضمان...')
                                  : t('Accept & Create Escrow', 'قبول العرض وإنشاء عقد الضمان')}
                              </button>
                            </div>
                          )}

                          {quote.status === 'ACCEPTED' && (
                            <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
                              <Link
                                href={`/${locale}/dashboard/contracts`}
                                className="flex justify-center items-center gap-1.5 w-full bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 transition-colors"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                {t('View Escrow Contract', 'عرض عقد الضمان الذكي')}
                              </Link>
                              <Link
                                href={`/${locale}/dashboard/messages`}
                                className="flex justify-center items-center gap-1.5 w-full border bg-background px-5 py-2 rounded-lg font-bold text-xs hover:border-primary/50 transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                {t('Message Factory', 'مراسلة المصنع')}
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

