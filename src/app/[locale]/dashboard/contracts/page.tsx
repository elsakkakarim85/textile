"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { exportContractPdf } from '@/lib/pdfGenerator';
import { useCurrency } from '@/contexts/CurrencyContext';
import { ShieldCheck, CheckCircle2, Circle, ArrowRightLeft, FileDown, Play, Truck } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const NEXT_FACTORY_STAGE: Record<string, { next: string; label: string }> = {
  ACTIVE: { next: 'IN_PRODUCTION', label: 'Start Production' },
  IN_PRODUCTION: { next: 'QC', label: 'Move to Quality Control (QC)' },
  QC: { next: 'SHIPPED', label: 'Mark as Shipped' },
};

const NEXT_BUYER_STAGE: Record<string, { next: string; label: string }> = {
  SHIPPED: { next: 'DELIVERED', label: 'Confirm Delivery' },
  DELIVERED: { next: 'COMPLETED', label: 'Complete Contract' },
};

export default function EscrowContractsPage() {
  const { user } = useUser();
  const { formatPrice } = useCurrency();
  const [contracts, setContracts] = useState<any[]>([]);
  const [activePersona, setActivePersona] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        fetch('/api/contracts'),
        fetch('/api/cluster/persona'),
      ]);
      if (cRes.ok) {
        const data = await cRes.json();
        setContracts(Array.isArray(data) ? data : []);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setActivePersona(pData.activeUser || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneAction = async (milestoneId: string, action: 'FUND' | 'RELEASE') => {
    setBusyId(milestoneId);
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchData();
      } else {
        alert(data.error || 'Failed to process milestone action.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusyId(null);
    }
  };

  const handleContractAction = async (payload: Record<string, string>) => {
    setBusyId(payload.contractId);
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchData();
      } else {
        alert(data.error || 'Failed to update contract.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusyId(null);
    }
  };

  const currentUserId = activePersona?.id || user?.id;
  const currentRole = activePersona?.role;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-green-600" /> Secure B2B Escrow & Smart Contracts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage milestone-backed production contracts, fund escrow tranches, and track shipment stages.
          </p>
        </div>
        {activePersona && (
          <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-2 rounded-lg">
            Active Persona: <strong>{activePersona.firstName} {activePersona.lastName}</strong> ({activePersona.role})
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading contracts...</p>
      ) : contracts.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <ShieldCheck className="w-16 h-16 mx-auto text-slate-200 mb-4" />
            <h2 className="text-xl font-bold">No Active Contracts</h2>
            <p className="text-muted-foreground">
              Accept a factory quotation in Buyer RFQs to automatically generate a 3-milestone Smart Escrow Contract.
            </p>
          </CardContent>
        </Card>
      ) : (
        contracts.map((contract) => {
          const isBuyer =
            currentUserId === contract.buyerId ||
            currentRole === 'buyer' ||
            currentRole === 'admin';
          const isFactory =
            currentUserId === contract.factory?.ownerId ||
            currentRole === 'factory_owner' ||
            currentRole === 'admin';
          const factoryStage = NEXT_FACTORY_STAGE[contract.status];
          const buyerStage = NEXT_BUYER_STAGE[contract.status];

          return (
            <Card key={contract.id} className="overflow-hidden shadow-md border-green-100">
              <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded font-bold border border-green-500/30">
                      SMART CONTRACT
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded font-bold border border-blue-500/30">
                      {contract.status}
                    </span>
                    <span className="text-slate-400 text-sm">
                      ID: {contract.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{contract.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-slate-300 text-sm">
                    <span>Buyer: {contract.buyer?.firstName || 'Buyer'} {contract.buyer?.lastName || ''}</span>
                    <ArrowRightLeft className="w-3.5 h-3.5 mx-1 text-emerald-400" />
                    <span>Factory: {contract.factory?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase">Total Value</p>
                    <p className="text-3xl font-black text-green-400">
                      {formatPrice(Number(contract.totalAmount))}
                    </p>
                  </div>
                  <button
                    onClick={() => exportContractPdf(contract)}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors text-white"
                    title="Download Official PDF Contract"
                  >
                    <FileDown className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Production Lifecycle Bar */}
              <div className="bg-slate-100 px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-medium text-slate-600 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-500" />
                  Lifecycle: <strong>{contract.status}</strong>
                  {contract.incoterm && <span>• Incoterm: {contract.incoterm}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {contract.status === 'DRAFT' && isFactory && (
                    <button
                      disabled={busyId === contract.id}
                      onClick={() => handleContractAction({ action: 'CONFIRM', contractId: contract.id })}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" /> Confirm Contract (Factory)
                    </button>
                  )}
                  {factoryStage && isFactory && (
                    <button
                      disabled={busyId === contract.id}
                      onClick={() =>
                        handleContractAction({
                          action: 'ADVANCE',
                          contractId: contract.id,
                          status: factoryStage.next,
                        })
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-md"
                    >
                      {factoryStage.label}
                    </button>
                  )}
                  {buyerStage && isBuyer && (
                    <button
                      disabled={busyId === contract.id}
                      onClick={() =>
                        handleContractAction({
                          action: 'ADVANCE',
                          contractId: contract.id,
                          status: buyerStage.next,
                        })
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-md"
                    >
                      {buyerStage.label}
                    </button>
                  )}
                </div>
              </div>

              <CardContent className="p-0">
                <div className="divide-y">
                  {contract.milestones.map((milestone: any, index: number) => (
                    <div
                      key={milestone.id}
                      className={`p-6 flex flex-col md:flex-row justify-between items-center gap-6 ${
                        milestone.status === 'RELEASED' ? 'bg-slate-50' : ''
                      }`}
                    >
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
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Milestone {index + 1}
                          </p>
                          <h3 className="font-bold text-lg text-slate-800">{milestone.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded ${
                                milestone.status === 'RELEASED'
                                  ? 'bg-green-100 text-green-700'
                                  : milestone.status === 'FUNDED'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {milestone.status === 'RELEASED'
                                ? 'PAID OUT'
                                : milestone.status === 'FUNDED'
                                ? 'IN ESCROW'
                                : 'AWAITING FUNDS'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-4 w-full md:w-auto justify-end">
                        <div className="text-right">
                          <p className="text-xl font-bold text-slate-800">
                            {formatPrice(Number(milestone.amount))}
                          </p>
                        </div>

                        {isBuyer && milestone.status === 'PENDING' && (
                          <button
                            disabled={busyId === milestone.id}
                            onClick={() => handleMilestoneAction(milestone.id, 'FUND')}
                            className="bg-blue-600 text-white px-5 py-2 rounded-md font-bold text-sm shadow hover:bg-blue-700 disabled:opacity-50"
                          >
                            Fund Escrow
                          </button>
                        )}
                        {isBuyer && milestone.status === 'FUNDED' && (
                          <button
                            disabled={busyId === milestone.id}
                            onClick={() => handleMilestoneAction(milestone.id, 'RELEASE')}
                            className="bg-green-600 text-white px-5 py-2 rounded-md font-bold text-sm shadow hover:bg-green-700 disabled:opacity-50"
                          >
                            Release Funds
                          </button>
                        )}
                        {milestone.status === 'RELEASED' && (
                          <span className="text-xs text-green-600 font-bold">
                            Settled ✓
                          </span>
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
