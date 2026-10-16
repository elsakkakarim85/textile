"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, XCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BuyerRFQsPage() {
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
      const data = await res.json();
      if (res.ok) {
        router.push('/en/dashboard/contracts');
      } else {
        alert(data.error || 'Failed to accept quote.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RFQs & Factory Quotations</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review competitive bids from verified Mahalla factories and award 30/70 smart escrow contracts.
          </p>
        </div>
        <Link
          href="/en/marketplaces/matchmaking"
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold hover:bg-primary/90"
        >
          + Post New RFQ
        </Link>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading sourcing requests...</p>
        ) : rfqs.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-card">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-xl font-bold">No RFQs posted yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">Post an RFQ to receive competitive bids from verified factories.</p>
            <Link href="/en/marketplaces/matchmaking" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-bold text-sm">
              Post an RFQ
            </Link>
          </div>
        ) : (
          rfqs.map((rfq) => (
            <Card key={rfq.id} className="overflow-hidden shadow-xs">
              <div className={`p-5 border-b flex flex-wrap justify-between items-center gap-4 ${rfq.status !== 'OPEN' ? 'bg-muted/40' : 'bg-primary/5'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        rfq.status === 'OPEN'
                          ? 'bg-blue-500/10 text-blue-700 border border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                      }`}
                    >
                      {rfq.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{new Date(rfq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-xl font-bold">{rfq.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Qty: <strong>{Number(rfq.quantity).toLocaleString()} {rfq.unit || 'units'}</strong> | Target Price:{' '}
                    <strong>{rfq.targetPrice ? `${rfq.targetPrice} ${rfq.currency || 'USD'}` : 'Open'}</strong>
                  </p>
                </div>
                {rfq.status !== 'OPEN' && (
                  <Link
                    href="/en/dashboard/contracts"
                    className="text-xs font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" /> Contract Awarded &rarr;
                  </Link>
                )}
              </div>

              <CardContent className="p-0">
                {!rfq.quotations || rfq.quotations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No quotations submitted yet. Cluster factories can bid from the B2B Matchmaking page.
                  </div>
                ) : (
                  <div className="divide-y">
                    {rfq.quotations.map((quote: any) => (
                      <div
                        key={quote.id}
                        className={`p-6 flex flex-col md:flex-row gap-6 items-center ${quote.status === 'ACCEPTED' ? 'bg-emerald-500/5' : ''}`}
                      >
                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                              <Link href={`/en/factories/${quote.factory?.id}`} className="hover:text-primary hover:underline">
                                {quote.factory?.name || 'Verified Factory'}
                              </Link>
                              {quote.status === 'ACCEPTED' && (
                                <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> AWARDED
                                </span>
                              )}
                              {quote.status === 'REJECTED' && (
                                <span className="bg-red-500/10 text-red-700 border border-red-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <XCircle className="w-3 h-3" /> REJECTED
                                </span>
                              )}
                            </h3>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground font-bold uppercase">Unit Bid Price</p>
                              <p className="text-xl font-black text-primary">
                                {Number(quote.unitPrice ?? quote.price ?? 0).toLocaleString()} {quote.currency || 'USD'}
                              </p>
                            </div>
                          </div>
                          <div className="bg-muted/30 p-3.5 rounded-lg text-sm border">
                            <span className="font-bold block mb-1 text-xs text-muted-foreground uppercase">
                              Factory Proposal {quote.leadTimeDays ? `(${quote.leadTimeDays} days lead time)` : ''}:
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
                              {actingId === quote.id ? 'Creating Contract...' : 'Accept & Create Escrow'}
                            </button>
                          </div>
                        )}

                        {quote.status === 'ACCEPTED' && (
                          <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
                            <Link
                              href="/en/dashboard/contracts"
                              className="flex justify-center items-center gap-1.5 w-full bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" /> View Escrow Contract
                            </Link>
                            <Link
                              href="/en/dashboard/messages"
                              className="flex justify-center items-center gap-1.5 w-full border bg-background px-5 py-2 rounded-lg font-bold text-xs hover:border-primary/50 transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5" /> Message Factory
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
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
