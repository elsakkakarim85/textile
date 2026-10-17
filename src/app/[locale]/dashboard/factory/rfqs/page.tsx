"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Send, CheckCircle2, Clock, Handshake, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function FactoryQuotationsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const res = await fetch('/api/factory/quotation');
      const data = await res.json();
      setQuotations(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('Factory Export Quotations & Bids', 'عروض الأسعار والمناقصات المقدمة من المصنع')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t(
              'Track the status of technical and commercial bids submitted by your factory to domestic and international buyer RFQs.',
              'تتبع حالة العروض الفنية والمالية المقدمة من مصنعك على طلبات التوريد والمناقصات التصديرية.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/${locale}/cluster/consortia`}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-bold hover:bg-muted transition-colors"
          >
            <Handshake className="w-4 h-4 text-emerald-600" />
            {t('Export Consortia', 'التحالفات التصديرية')}
          </Link>
          <Link
            href={`/${locale}/marketplaces/matchmaking`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-bold hover:bg-primary/90"
          >
            {t('Browse Open RFQs →', 'تصفح المناقصات المفتوحة ←')}
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">
            {t('Loading factory quotations...', 'جاري تحميل عروض الأسعار...')}
          </p>
        ) : quotations.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <FileText className="w-10 h-10 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-bold">
                {t('No bids submitted yet', 'لم يتم تقديم عروض أسعار بعد')}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {t(
                  'Browse the B2B Matchmaking hub to bid on open sourcing requests.',
                  'تصفح بورصة المناقصات لتقديم عروض أسعار مصنعك.'
                )}
              </p>
              <Link
                href={`/${locale}/marketplaces/matchmaking`}
                className="inline-block mt-4 text-primary hover:underline font-medium text-sm"
              >
                {t('Go to Matchmaking Hub →', 'الذهاب لبورصة المناقصات ←')}
              </Link>
            </CardContent>
          </Card>
        ) : (
          quotations.map((quote) => (
            <Card key={quote.id} className="hover:border-primary/40 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          quote.status === 'ACCEPTED'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : quote.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {quote.status === 'ACCEPTED' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {quote.status}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">
                      {t('RFQ:', 'المناقصة:')} {quote.rfq?.title}
                    </h3>
                    {quote.rfq && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('Requested Volume:', 'الكمية المطلوبة:')}{' '}
                        <strong>
                          {Number(quote.rfq.quantity || 0).toLocaleString()} {quote.rfq.unit || 'units'}
                        </strong>
                      </p>
                    )}
                  </div>
                  <div className="sm:text-end">
                    <p className="text-xs text-muted-foreground uppercase font-bold">
                      {t('Your Unit Bid Price', 'سعر الوحدة المقدم')}
                    </p>
                    <p className="text-xl font-black text-primary">
                      {Number(quote.unitPrice ?? quote.price ?? 0).toLocaleString()}{' '}
                      {quote.currency || 'USD'}
                    </p>
                    <div className="flex flex-wrap sm:justify-end gap-2 mt-1 text-xs text-muted-foreground">
                      {quote.leadTimeDays && (
                        <span>
                          {t('Lead time:', 'مدة التوريد:')} {quote.leadTimeDays} {t('days', 'يوم')}
                        </span>
                      )}
                      {quote.minOrderQty && (
                        <span>• MOQ: {Number(quote.minOrderQty).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/40 p-4 rounded-xl border">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    {t('Technical & Commercial Proposal', 'العرض الفني والتجاري المقدم')}
                  </p>
                  <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                    {quote.message}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t flex flex-wrap justify-end gap-3">
                  <Link
                    href={`/${locale}/dashboard/contracts`}
                    className="border bg-background px-4 py-2 rounded-lg text-xs font-bold hover:border-primary/50 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {t('View Smart Escrow Contract', 'عقد الضمان الذكي')}
                  </Link>
                  <Link
                    href={`/${locale}/dashboard/messages`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {t('Message Buyer', 'مراسلة المشتري')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
