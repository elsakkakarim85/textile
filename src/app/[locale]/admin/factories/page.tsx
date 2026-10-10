"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { downloadCSV } from '@/lib/export';

export default function AdminFactoriesPage() {
  const t = useTranslations('Admin');
  const [factories, setFactories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFactories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/factories');
      if (res.ok) setFactories(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFactories();
  }, []);

  const handleAction = async (factoryId: string, status: string) => {
    let rejectionReason = null;
    if (status === 'REJECTED') {
      rejectionReason = prompt('Please enter a reason for rejection:');
      if (rejectionReason === null) return; // cancelled
    } else {
      if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
    }

    try {
      const res = await fetch('/api/admin/factories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factoryId, status, rejectionReason }),
      });
      if (res.ok) fetchFactories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('factories')}</h1>
          <p className="text-muted-foreground">Approve, reject, or manage factory profiles on the platform.</p>
        </div>
        <button 
          onClick={() => downloadCSV(factories, 'mahalla_factories')}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Factory Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : factories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3">Factory Name</th>
                    <th className="px-4 py-3">Owner Email</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {factories.map(factory => (
                    <tr key={factory.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">
                        {factory.name}
                        {factory.taxRegistrationNumber && <p className="text-xs text-muted-foreground">Tax ID: {factory.taxRegistrationNumber}</p>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{factory.owner?.email || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          factory.status === 'APPROVED' ? 'default' : 
                          factory.status === 'REJECTED' ? 'destructive' : 'secondary'
                        }>
                          {factory.status}
                        </Badge>
                        {factory.rejectionReason && (
                          <p className="text-[10px] text-red-500 mt-1 max-w-[120px] truncate" title={factory.rejectionReason}>
                            {factory.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">{new Date(factory.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <select 
                          className="bg-background border rounded px-2 py-1 text-xs"
                          value={factory.status}
                          onChange={(e) => handleAction(factory.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approve</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">No factories found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
