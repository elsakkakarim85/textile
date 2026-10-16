"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Send, TrendingUp } from 'lucide-react';

export default function MatchmakingPage() {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // RFQ Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
          currency: 'EGP',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Your request has been broadcasted to all Mahalla cluster factories!');
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
          currency: selectedRfq.currency || 'EGP',
          message: quoteMessage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Quotation submitted successfully!');
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
    <div className="container mx-auto py-10 px-4 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          B2B Matchmaking (RFQ Exchange)
        </h1>
        <p className="text-lg text-muted-foreground">
          Post your textile sourcing specifications and receive competitive bids directly from verified El Mahalla El Kubra mills.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Post RFQ Form */}
        <div className="md:col-span-1">
          <Card className="sticky top-20 shadow-md border-primary/20">
            <div className="bg-primary/5 p-4 border-b">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" /> Request a Quote
              </h2>
            </div>
            <CardContent className="p-4">
              <form onSubmit={handlePostRFQ} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product / Need Title</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 100% Giza 86 Combed Cotton Bedlinen Sets"
                    className="w-full mt-1 bg-background border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Quantity Required (Units)</label>
                  <input
                    required
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full mt-1 bg-background border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Target Unit Price (EGP, Optional)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="e.g. 180"
                    className="w-full mt-1 bg-background border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Detailed Specifications</label>
                  <textarea
                    required
                    minLength={10}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe yarn count, GSM, weave structure, OEKO-TEX requirements, and delivery deadline..."
                    className="w-full mt-1 bg-background border rounded px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded font-bold shadow-sm hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Broadcasting...' : 'Broadcast to Cluster Factories'}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Live Open Requests */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" /> Live Market Requests
          </h2>

          {loading ? (
            <p>Loading market requests...</p>
          ) : rfqs.length === 0 ? (
            <div className="text-center py-20 border rounded-xl bg-muted/20">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold">No open requests right now.</h3>
              <p className="text-muted-foreground">Be the first to post a sourcing request!</p>
            </div>
          ) : (
            rfqs.map((rfq) => (
              <Card key={rfq.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        {rfq.status || 'OPEN'}
                      </span>
                      <span>{new Date(rfq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-bold">{rfq.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {rfq.description}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Quantity</span>
                        <span className="font-bold">
                          {rfq.quantity} {rfq.unit || 'units'}
                        </span>
                      </div>
                      <div className="flex flex-col border-l pl-4">
                        <span className="text-muted-foreground text-xs">Target Unit Price</span>
                        <span className="font-bold text-primary">
                          {rfq.targetPrice
                            ? `${rfq.targetPrice} ${rfq.currency || 'EGP'}`
                            : 'Negotiable'}
                        </span>
                      </div>
                      <div className="flex flex-col border-l pl-4">
                        <span className="text-muted-foreground text-xs">Bids Received</span>
                        <span className="font-bold">{rfq._count?.quotations ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-48 flex flex-col justify-end">
                    <button
                      onClick={() => setSelectedRfq(rfq)}
                      className="block text-center w-full bg-slate-900 text-white py-2.5 rounded-md font-medium text-sm hover:bg-slate-800"
                    >
                      Submit Quote
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {selectedRfq && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background w-full max-w-lg rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedRfq(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">Submit Factory Quotation</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Bidding on: <strong>{selectedRfq.title}</strong>
            </p>

            <form onSubmit={submitQuote} className="space-y-4">
              <div>
                <label className="text-sm font-bold">
                  Unit Price Offer ({selectedRfq.currency || 'EGP'})
                </label>
                <input
                  required
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="e.g. 165"
                  className="w-full mt-1 border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="text-sm font-bold">Technical Proposal & Lead Time</label>
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={generatingAi}
                    className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded font-bold flex items-center gap-1 transition-colors"
                  >
                    ✨ {generatingAi ? 'Generating...' : 'AI Auto-Pitch'}
                  </button>
                </div>
                <textarea
                  required
                  minLength={5}
                  value={quoteMessage}
                  onChange={(e) => setQuoteMessage(e.target.value)}
                  rows={5}
                  placeholder="Detail your mill's yarn/fabric specs, OEKO-TEX compliance, and delivery lead time..."
                  className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Send Official Quotation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
