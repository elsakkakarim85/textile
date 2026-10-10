"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BuyerRFQsPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchRfqs();
  }, []);

  const fetchRfqs = async () => {
    try {
      const res = await fetch('/api/buyer/rfq');
      const data = await res.json();
      setRfqs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (rfqId: string, quotationId: string) => {
    if (!confirm('Are you sure you want to accept this quote? This will close the RFQ and reject all other quotes.')) return;
    
    try {
      const res = await fetch('/api/buyer/rfq/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfqId, quotationId })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Quote accepted! A chat has been opened with the factory owner.');
        router.push(`/en/dashboard/messages`);
      } else {
        alert(data.error || 'Failed to accept quote.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My RFQs & Quotes</h1>
        <p className="text-muted-foreground mt-1">Review bids from factories and accept the best offer.</p>
      </div>

      <div className="space-y-8">
        {loading ? (
          <p>Loading your requests...</p>
        ) : rfqs.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-slate-50">
            <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-bold">You haven't posted any requests</h3>
            <p className="text-slate-500 mb-4">Post an RFQ to get competitive bids from factories.</p>
            <a href="/en/marketplaces/matchmaking" className="bg-primary text-white px-6 py-2 rounded-md font-bold text-sm">Post an RFQ</a>
          </div>
        ) : (
          rfqs.map(rfq => (
            <Card key={rfq.id} className="overflow-hidden shadow-sm">
              <div className={`p-4 border-b flex justify-between items-center ${rfq.status === 'CLOSED' ? 'bg-slate-100' : 'bg-blue-50/50'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${rfq.status === 'CLOSED' ? 'bg-slate-200 text-slate-600' : 'bg-blue-200 text-blue-800'}`}>
                      {rfq.status}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(rfq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-xl font-bold">{rfq.title}</h2>
                  <p className="text-sm text-slate-600">Qty: {rfq.quantity} | Target: {rfq.targetPrice || 'N/A'}</p>
                </div>
                {rfq.status === 'CLOSED' && (
                  <div className="text-sm font-bold text-slate-500 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Deal Closed
                  </div>
                )}
              </div>

              <CardContent className="p-0">
                {rfq.quotations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No bids received yet. Factories will be notified.
                  </div>
                ) : (
                  <div className="divide-y">
                    {rfq.quotations.map((quote: any) => (
                      <div key={quote.id} className={`p-6 flex flex-col md:flex-row gap-6 items-center ${quote.status === 'ACCEPTED' ? 'bg-green-50/30' : ''}`}>
                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                              {quote.factory.name}
                              {quote.status === 'ACCEPTED' && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> WINNER</span>}
                              {quote.status === 'REJECTED' && <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> REJECTED</span>}
                            </h3>
                            <div className="text-right">
                              <p className="text-xs text-slate-500 font-bold uppercase">Bid Price</p>
                              <p className="text-xl font-black text-primary">{quote.price}</p>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-3 rounded text-sm text-slate-700 border">
                            <span className="font-bold block mb-1 text-xs text-slate-500 uppercase">Message from factory:</span>
                            {quote.message}
                          </div>
                        </div>

                        {rfq.status === 'OPEN' && (
                          <div className="shrink-0 w-full md:w-auto">
                            <button 
                              onClick={() => handleAcceptQuote(rfq.id, quote.id)}
                              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-bold text-sm shadow-sm transition-colors"
                            >
                              Accept Quote
                            </button>
                          </div>
                        )}
                        
                        {quote.status === 'ACCEPTED' && (
                          <div className="shrink-0 w-full md:w-auto">
                            <a href="/en/dashboard/messages" className="flex justify-center items-center gap-2 w-full bg-primary text-white px-6 py-3 rounded-md font-bold text-sm shadow-sm hover:bg-primary/90 transition-colors">
                              <MessageSquare className="w-4 h-4" /> Message Factory
                            </a>
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
