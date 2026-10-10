"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Send } from 'lucide-react';

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
      setQuotations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Quotations (Bids)</h1>
        <p className="text-muted-foreground">Track the status of bids you submitted to buyer RFQs.</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : quotations.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <FileText className="w-10 h-10 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-bold">No bids submitted yet</h3>
              <p className="text-muted-foreground">Browse the Matchmaking hub to find new business opportunities.</p>
              <a href="/en/marketplaces/matchmaking" className="inline-block mt-4 text-primary hover:underline font-medium">Go to Matchmaking Hub &rarr;</a>
            </CardContent>
          </Card>
        ) : (
          quotations.map(quote => (
            <Card key={quote.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
                      <span className={`px-2 py-1 rounded ${quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : quote.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {quote.status}
                      </span>
                      <span className="text-muted-foreground">{new Date(quote.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">RFQ: {quote.rfq.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase font-bold">Your Bid Price</p>
                    <p className="text-xl font-bold text-primary">{quote.price}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-md">
                  <p className="text-sm font-medium mb-1">Your Message:</p>
                  <p className="text-sm text-slate-600">{quote.message}</p>
                </div>

                {quote.status === 'ACCEPTED' && (
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <a href="/en/dashboard/messages" className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                      <Send className="w-4 h-4" /> Message Buyer
                    </a>
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
