"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Send, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function FactoryQuotationsPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">My Quotations (Bids)</h1>
          <p className="text-muted-foreground text-sm">Track the status of bids submitted by your factory to buyer RFQs.</p>
        </div>
        <Link
          href="/en/marketplaces/matchmaking"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90"
        >
          Browse Open RFQs &rarr;
        </Link>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading quotations...</p>
        ) : quotations.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <FileText className="w-10 h-10 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-bold">No bids submitted yet</h3>
              <p className="text-muted-foreground text-sm mt-1">Browse the B2B Matchmaking hub to bid on open sourcing requests.</p>
              <Link href="/en/marketplaces/matchmaking" className="inline-block mt-4 text-primary hover:underline font-medium text-sm">
                Go to Matchmaking Hub &rarr;
              </Link>
            </CardContent>
          </Card>
        ) : (
          quotations.map((quote) => (
            <Card key={quote.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          quote.status === 'ACCEPTED'
                            ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                            : quote.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-700 border border-red-500/30'
                            : 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                        }`}
                      >
                        {quote.status === 'ACCEPTED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {quote.status}
                      </span>
                      <span className="text-muted-foreground">{new Date(quote.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold">RFQ: {quote.rfq?.title}</h3>
                    {quote.rfq && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Requested Qty: {quote.rfq.quantity?.toLocaleString()} {quote.rfq.unit || 'units'}
                      </p>
                    )}
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Your Unit Bid Price</p>
                    <p className="text-xl font-black text-primary">
                      {Number(quote.unitPrice ?? quote.price ?? 0).toLocaleString()} {quote.currency || 'USD'}
                    </p>
                    {quote.leadTimeDays && (
                      <p className="text-xs text-muted-foreground">Lead time: {quote.leadTimeDays} days</p>
                    )}
                  </div>
                </div>

                <div className="bg-muted/40 p-4 rounded-lg border">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Technical & Commercial Pitch</p>
                  <p className="text-sm whitespace-pre-wrap">{quote.message}</p>
                </div>

                {quote.status === 'ACCEPTED' && (
                  <div className="mt-4 pt-4 border-t flex flex-wrap justify-end gap-3">
                    <Link
                      href="/en/dashboard/contracts"
                      className="border bg-background px-4 py-2 rounded-md text-xs font-semibold hover:border-primary/50"
                    >
                      View Escrow Contract
                    </Link>
                    <Link
                      href="/en/dashboard/messages"
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Message Buyer
                    </Link>
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
