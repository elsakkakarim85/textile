"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { downloadCSV } from '@/lib/export';

export default function AdminAuditLogsPage() {
  const t = useTranslations('Admin');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLogs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('audit_logs')}</h1>
          <p className="text-muted-foreground">Monitor platform security and admin actions.</p>
        </div>
        <button 
          onClick={() => downloadCSV(logs, 'mahalla_audit_logs')}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : logs.length > 0 ? (
            <div className="space-y-4">
              {logs.map(log => (
                <div key={log.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-primary">{log.action}</span>
                    <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Admin ID: {log.adminId}</p>
                    <p>Target: {log.entity} ({log.entityId})</p>
                    {log.details && (
                      <pre className="bg-muted p-2 rounded mt-2 overflow-x-auto">
                        {log.details}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">No audit logs found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
