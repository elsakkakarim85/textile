"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportContractPdf } from '@/lib/pdfGenerator';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ShieldCheck, CheckCircle2, Circle, ArrowRightLeft, FileDown } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function EscrowContractsPage() {
  const { user } = useUser();
  const { formatPrice } = useCurrency();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await fetch('/api/contracts');
      const data = await res.json();
      setContracts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (milestoneId: string, action: string) => {
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, action })
      });
      if (res.ok) {
        fetchContracts();
      } else {
        alert("Failed to process action.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-green-600" /> Secure B2B Escrow
        </h1>
        <p className="text-muted-foreground mt-1">Manage smart contracts, fund milestones, and release payments safely.</p>
      </div>

      {loading ? (
        <p>Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <ShieldCheck className="w-16 h-16 mx-auto text-slate-200 mb-4" />
            <h2 className="text-xl font-bold">No Active Contracts</h2>
            <p className="text-muted-foreground">You don't have any active escrow contracts right now.</p>
          </CardContent>
        </Card>
      ) : (
        contracts.map(contract => {
          const isBuyer = user?.id === contract.buyerId;
          const otherPartyName = isBuyer ? contract.factory.name : contract.buyer.firstName || "Buyer";

          return (
            <Card key={contract.id} className="overflow-hidden shadow-md border-green-100">
              <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded font-bold border border-green-500/30">
                      SMART CONTRACT
                    </span>
                    <span className="text-slate-400 text-sm">ID: {contract.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{contract.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                    {isBuyer ? "You" : "You (Factory)"} 
                    <ArrowRightLeft className="w-3 h-3 mx-1" /> 
                    {otherPartyName}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase">Total Value</p>
                    <p className="text-3xl font-black text-green-400">{formatPrice(contract.totalAmount)}</p>
                  </div>
                  <button onClick={() => exportContractPdf(contract)} className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors text-white" title="Download Official PDF Contract">
                    <FileDown className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="divide-y">
                  {contract.milestones.map((milestone: any, index: number) => (
                    <div key={milestone.id} className={`p-6 flex flex-col md:flex-row justify-between items-center gap-6 ${milestone.status === 'RELEASED' ? 'bg-slate-50' : ''}`}>
                      <div className="flex items-center gap-4 w-full">
                        <div className="shrink-0">
                          {milestone.status === 'RELEASED' ? (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                          ) : milestone.status === 'FUNDED' ? (
                            <ShieldCheck className="w-8 h-8 text-blue-500" />
                          ) : (
                            <Circle className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Milestone {index + 1}</p>
                          <h3 className="font-bold text-lg text-slate-800">{milestone.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              milestone.status === 'RELEASED' ? 'bg-green-100 text-green-700' :
                              milestone.status === 'FUNDED' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {milestone.status === 'RELEASED' ? 'PAID OUT' : milestone.status === 'FUNDED' ? 'IN ESCROW' : 'AWAITING FUNDS'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-6 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-xl font-bold text-slate-800">{formatPrice(milestone.amount)}</p>
                        </div>
                        
                        {/* Actions for Buyer */}
                        {isBuyer && milestone.status === 'PENDING' && (
                          <button onClick={() => handleAction(milestone.id, 'FUND')} className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold text-sm shadow hover:bg-blue-700 w-full md:w-auto">
                            Fund Escrow
                          </button>
                        )}
                        {isBuyer && milestone.status === 'FUNDED' && (
                          <button onClick={() => handleAction(milestone.id, 'RELEASE')} className="bg-green-600 text-white px-6 py-2 rounded-md font-bold text-sm shadow hover:bg-green-700 w-full md:w-auto">
                            Release Funds
                          </button>
                        )}
                        
                        {/* Actions for Factory */}
                        {!isBuyer && milestone.status === 'PENDING' && (
                          <p className="text-xs text-slate-400 italic w-32 text-right">Waiting for buyer to fund...</p>
                        )}
                        {!isBuyer && milestone.status === 'FUNDED' && (
                          <p className="text-xs text-blue-600 font-bold w-32 text-right">Funds secured in Escrow. Proceed with work.</p>
                        )}
                        {!isBuyer && milestone.status === 'RELEASED' && (
                          <p className="text-xs text-green-600 font-bold w-32 text-right">Funds transferred to your bank.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
