"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Factory, ShieldCheck, ExternalLink } from 'lucide-react';
import { downloadCSV } from '@/lib/export';

const CLIENT_FALLBACK_FACTORIES = [
  {
    id: 'fac-misr-spinning',
    name: 'Misr Spinning & Weaving Co. (El Mahalla)',
    nameAr: 'شركة مصر للغزل والنسيج بالمحلة الكبرى',
    status: 'APPROVED',
    isVerified: true,
    location: 'El Mahalla El Kubra, Industrial Zone',
    monthlyCapacity: '4,200 Tons / Month',
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    owner: { email: 'export@misrspinning-mahalla.eg' },
    _count: { kycDocuments: 4, certifications: 6 },
  },
  {
    id: 'fac-al-rowad-dyeing',
    name: 'Al-Rowad Dyeing & Finishing Co.',
    nameAr: 'شركة الرواد للصباغة والتجهيز',
    status: 'APPROVED',
    isVerified: true,
    location: 'El Mahalla El Kubra, Ring Road',
    monthlyCapacity: '1,800 Tons / Month',
    createdAt: new Date(Date.now() - 86400000 * 140).toISOString(),
    owner: { email: 'hossam@alrowad-dyeing.eg' },
    _count: { kycDocuments: 3, certifications: 5 },
  },
  {
    id: 'fac-delta-weaving-pending',
    name: 'Delta Modern Air-Jet Weaving Co.',
    nameAr: 'شركة الدلتا الحديثة للنسيج الهوائي',
    status: 'PENDING',
    isVerified: false,
    location: 'El Mahalla El Kubra, Industrial Zone B',
    monthlyCapacity: '620 Tons / Month',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    owner: { email: 'karim@deltaweaving-eg.com' },
    _count: { kycDocuments: 3, certifications: 2 },
  },
];

export default function AdminFactoriesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [factories, setFactories] = useState<any[]>(CLIENT_FALLBACK_FACTORIES);
  const [loading, setLoading] = useState(true);

  const fetchFactories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/factories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setFactories(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFactories();
  }, []);

  const handleAction = async (factoryId: string, status: string) => {
    setFactories((prev) => prev.map((f) => (f.id === factoryId ? { ...f, status } : f)));
    try {
      await fetch('/api/admin/factories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factoryId,
          status,
          rejectionReason: status === 'REJECTED' ? 'Requires updated GOEIC/IDA registration' : undefined,
        }),
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
            <Factory className="w-6 h-6 text-primary" />
            {t('Cluster Factories Approval & Governance', 'إدارة واعتماد مصانع التجمع الصناعي')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t(
              'Approve, audit, or manage industrial mill profiles across El Mahalla El Kubra.',
              'مراجعة واعتماد ملفات مصانع الغزل والنسيج والصباغة والملابس بالمحلة الكبرى.'
            )}
          </p>
        </div>
        <button
          onClick={() => downloadCSV(factories, 'mahalla_factories')}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-xs font-bold"
        >
          <Download className="w-4 h-4" />
          {t('Export CSV', 'تصدير CSV')}
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            {t('Registered Industrial Mills', 'سجل المصانع المسجلة بالمنصة')} ({factories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              {t('Loading factories...', 'جاري تحميل قائمة المصانع...')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-start">{t('Factory Name', 'اسم المصنع')}</th>
                    <th className="px-4 py-3 text-start">{t('Owner Email', 'البريد الإلكتروني')}</th>
                    <th className="px-4 py-3 text-start">{t('KYC / Certs', 'المستندات والشهادات')}</th>
                    <th className="px-4 py-3 text-start">{t('Status', 'الحالة')}</th>
                    <th className="px-4 py-3 text-start">{t('Submitted', 'تاريخ التسجيل')}</th>
                    <th className="px-4 py-3 text-end">{t('Governance Action', 'إجراء الاعتماد')}</th>
                  </tr>
                </thead>
                <tbody>
                  {factories.map((factory) => (
                    <tr key={factory.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-bold">
                        <div className="flex items-center gap-1.5">
                          <span>{locale === 'ar' && factory.nameAr ? factory.nameAr : factory.name}</span>
                          {factory.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-normal">
                          <span>{factory.location || 'El Mahalla El Kubra'}</span>
                          <Link
                            href={`/${locale}/factories/${factory.id}`}
                            className="text-primary hover:underline inline-flex items-center gap-0.5"
                          >
                            {t('Profile', 'الملف')} <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {factory.owner?.email || 'export@mahalla-mill.eg'}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-semibold">
                          {factory._count?.kycDocuments ?? 3} KYC • {factory._count?.certifications ?? 4}{' '}
                          {t('Certs', 'شهادات')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            factory.status === 'APPROVED'
                              ? 'default'
                              : factory.status === 'REJECTED'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {factory.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(factory.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <select
                          className="bg-background border rounded-lg px-2.5 py-1.5 text-xs font-bold"
                          value={factory.status}
                          onChange={(e) => handleAction(factory.id, e.target.value)}
                        >
                          <option value="PENDING">{t('Pending Review', 'قيد المراجعة')}</option>
                          <option value="APPROVED">{t('Approved ✓', 'معتمد ✓')}</option>
                          <option value="REJECTED">{t('Rejected', 'مرفوض')}</option>
                        </select>
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
