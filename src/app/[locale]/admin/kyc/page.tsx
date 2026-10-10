"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Download, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminKycPage() {
  const [factories, setFactories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFactories();
  }, []);

  const fetchFactories = async () => {
    try {
      const res = await fetch('/api/admin/kyc');
      const data = await res.json();
      setFactories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (factoryId: string, currentStatus: boolean) => {
    try {
      await fetch('/api/admin/kyc', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factoryId, isVerified: !currentStatus })
      });
      fetchFactories();
    } catch (e) {
      console.error(e);
    }
  };

  const exportCsv = () => {
    window.location.href = '/api/admin/export';
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary flex items-center gap-3">
            <ShieldCheck className="w-10 h-10" /> Trust & KYC Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Manage factory verifications and export database records.</p>
        </div>
        <Button onClick={exportCsv} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4" /> Export All to CSV
        </Button>
      </div>

      <div className="bg-background border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 font-medium">Factory Name</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Owner Email</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : factories.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No factories found.</td></tr>
              ) : (
                factories.map(f => (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-muted/10">
                    <td className="p-4 font-bold flex items-center gap-2">
                      {f.name}
                      {f.isVerified && <span title="Verified"><ShieldCheck className="w-4 h-4 text-blue-500" /></span>}
                    </td>
                    <td className="p-4 text-muted-foreground">{f.address}</td>
                    <td className="p-4 text-muted-foreground">{f.owner.email}</td>
                    <td className="p-4">
                      {f.isVerified ? (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant={f.isVerified ? "outline" : "default"} 
                        size="sm"
                        onClick={() => toggleVerification(f.id, f.isVerified)}
                        className={!f.isVerified ? "bg-blue-600 hover:bg-blue-700" : ""}
                      >
                        {f.isVerified ? 'Revoke Badge' : 'Verify Factory'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
