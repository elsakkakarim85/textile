"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Calculator, Globe, Clock, PackageCheck } from 'lucide-react';

export default function LogisticsCalculatorPage() {
  const [weight, setWeight] = useState('');
  const [cbm, setCbm] = useState('');
  const [destination, setDestination] = useState('Europe');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/logistics/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          weightKg: Number(weight), 
          volumeCbm: Number(cbm), 
          destination 
        })
      });
      const data = await res.json();
      if (res.ok) setResult(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-3">
          <Ship className="w-10 h-10 text-blue-600" /> Global Freight Estimator
        </h1>
        <p className="text-lg text-slate-500">
          Instantly calculate estimated shipping costs from Mahalla El Kubra, Egypt to ports worldwide.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Calculator Form */}
        <Card className="shadow-lg border-blue-100">
          <CardHeader className="bg-blue-50/50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" /> Enter Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-700">Total Weight (kg)</label>
                <input required type="number" min="1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 5000" className="w-full mt-1 border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-700">Total Volume (CBM)</label>
                <input required type="number" min="1" step="0.1" value={cbm} onChange={e => setCbm(e.target.value)} placeholder="e.g. 15" className="w-full mt-1 border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                <p className="text-xs text-slate-400 mt-1">Cubic Meters (Length x Width x Height in meters)</p>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Destination Region</label>
                <select value={destination} onChange={e => setDestination(e.target.value)} className="w-full mt-1 border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="Europe">Europe (Rotterdam / Genoa)</option>
                  <option value="USA">USA (New York / LA)</option>
                  <option value="GCC">GCC (Jeddah / Jebel Ali)</option>
                  <option value="Other">Other Global Ports</option>
                </select>
              </div>

              <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md shadow-md transition-colors disabled:opacity-50">
                {loading ? 'Calculating...' : 'Get Instant Quote'}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-green-800 font-bold mb-1">Estimated Total Cost</p>
                <p className="text-5xl font-black text-green-600">${result.totalUsd}</p>
                <p className="text-xs text-green-700/70 mt-2">Port to Port (Excludes final mile & duties)</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white border p-4 rounded-lg shadow-sm">
                  <Globe className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Port of Loading</p>
                    <p className="font-bold text-slate-800">{result.portOfLoading}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white border p-4 rounded-lg shadow-sm">
                  <Clock className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Est. Transit Time</p>
                    <p className="font-bold text-slate-800">{result.estimatedTransitTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white border p-4 rounded-lg shadow-sm">
                  <PackageCheck className="w-8 h-8 text-indigo-500" />
                  <div className="w-full">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Cost Breakdown</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Ocean Freight</span>
                      <span className="font-bold">${result.oceanFreight}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Customs Clearance (Origin)</span>
                      <span className="font-bold">${result.customs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Documentation</span>
                      <span className="font-bold">${result.docs}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-md hover:bg-slate-800 transition-colors">
                Book Freight Forwarder (Coming Soon)
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-xl bg-slate-50">
              <Globe className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-400">Ready to Ship?</h3>
              <p className="text-slate-400 mt-2 text-sm">Fill out the calculator to instantly estimate your global logistics costs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
