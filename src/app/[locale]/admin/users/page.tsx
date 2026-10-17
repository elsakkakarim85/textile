"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Users } from 'lucide-react';
import { downloadCSV } from '@/lib/export';

const CLIENT_FALLBACK_USERS = [
  {
    id: 'usr-admin-1',
    email: 'admin@mahallacluster.eg',
    firstName: 'Cluster',
    lastName: 'Administrator (TIGARA PMO)',
    role: 'admin',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 200).toISOString(),
  },
  {
    id: 'usr-owner-1',
    email: 'export@misrspinning-mahalla.eg',
    firstName: 'Tarek',
    lastName: 'El-Shamy',
    role: 'factory_owner',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
  },
  {
    id: 'usr-buyer-1',
    email: 'sourcing@nordic-home-linen.de',
    firstName: 'Lukas',
    lastName: 'Weber',
    role: 'buyer',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 95).toISOString(),
  },
  {
    id: 'usr-expert-1',
    email: 'dr.nabil@lean-textile-advisory.eg',
    firstName: 'Dr. Nabil',
    lastName: 'El-Gohary (Lean Master Black Belt)',
    role: 'service_provider',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 120).toISOString(),
  },
  {
    id: 'usr-worker-1',
    email: 'mahmoud.gad@mahalla-workers.eg',
    firstName: 'Mahmoud',
    lastName: 'Gad',
    role: 'worker',
    isBanned: false,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

export default function AdminUsersPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [users, setUsers] = useState<any[]>(CLIENT_FALLBACK_USERS);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setUsers(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleBanToggle = async (userId: string, currentBanStatus: boolean) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: !currentBanStatus } : u)));
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isBanned: !currentBanStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            {t('User Accounts & Role-Based Access Control (RBAC)', 'إدارة المستخدمين والصلاحيات (RBAC)')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t(
              'Manage factory owners, international buyers, industrial experts, engineers, and PMO admins.',
              'إدارة حسابات أصحاب المصانع والمشترين الدوليين والخبراء والمهندسين ومديري المنصة.'
            )}
          </p>
        </div>
        <button
          onClick={() => downloadCSV(users, 'mahalla_users')}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-xs font-bold"
        >
          <Download className="w-4 h-4" />
          {t('Export CSV', 'تصدير CSV')}
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            {t('Platform Directory', 'دليل حسابات المنصة')} ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              {t('Loading users...', 'جاري تحميل الحسابات...')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-start">{t('Name & Email', 'الاسم والبريد الإلكتروني')}</th>
                    <th className="px-4 py-3 text-start">{t('Platform Role', 'الدور الوظيفي')}</th>
                    <th className="px-4 py-3 text-start">{t('Status', 'الحالة')}</th>
                    <th className="px-4 py-3 text-start">{t('Joined', 'تاريخ الانضمام')}</th>
                    <th className="px-4 py-3 text-end">{t('Actions', 'الإجراءات')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="font-bold">
                          {user.firstName || ''} {user.lastName || ''}
                        </div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="bg-background border rounded-lg px-2.5 py-1.5 text-xs font-bold"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="factory_owner">{t('Factory Owner', 'صاحب مصنع')}</option>
                          <option value="buyer">{t('International Buyer', 'مشتري / مستورد')}</option>
                          <option value="service_provider">{t('Expert / Service Provider', 'خبير استشاري')}</option>
                          <option value="worker">{t('Engineer / Worker', 'مهندس / فني')}</option>
                          <option value="admin">{t('Cluster Admin (PMO)', 'مدير التجمع (PMO)')}</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.isBanned ? 'destructive' : 'default'}>
                          {user.isBanned ? t('Suspended', 'موقوف') : t('Active', 'نشط')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button
                          onClick={() => handleBanToggle(user.id, user.isBanned)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                            user.isBanned
                              ? 'text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10'
                              : 'text-red-500 border-red-500/30 hover:bg-red-500/10'
                          }`}
                        >
                          {user.isBanned ? t('Restore Access', 'تفعيل الحساب') : t('Suspend', 'إيقاف مؤقت')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
