"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tr } from '@/lib/i18n-inline';
import { Download, ShieldCheck, ShieldAlert, FileCheck2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CLIENT_FALLBACK_KYC = [
  {
    id: 'fac-misr-spinning',
    name: 'Misr Spinning & Weaving Co. (El Mahalla)',
    location: 'El Mahalla El Kubra, Industrial Zone',
    isVerified: true,
    owner: { email: 'export@misrspinning-mahalla.eg' },
    kycDocuments: [
      { id: 'kyc-1', type: 'COMMERCIAL_REGISTER' },
      { id: 'kyc-2', type: 'INDUSTRIAL_LICENSE_IDA' },
      { id: 'kyc-3', type: 'GOEIC_EXPORT_CARD' },
    ],
  },
  {
    id: 'fac-al-rowad-dyeing',
    name: 'Al-Rowad Dyeing & Finishing Co.',
    location: 'El Mahalla El Kubra, Ring Road',
    isVerified: true,
    owner: { email: 'hossam@alrowad-dyeing.eg' },
    kycDocuments: [
      { id: 'kyc-4', type: 'COMMERCIAL_REGISTER' },
      { id: 'kyc-5', type: 'OEKO_TEX_CERT' },
    ],
  },
  {
    id: 'fac-delta-weaving-pending',
    name: 'Delta Modern Air-Jet Weaving Co.',
    location: 'El Mahalla El Kubra, Industrial Zone B',
    isVerified: false,
    owner: { email: 'karim@deltaweaving-eg.com' },
    kycDocuments: [
      { id: 'kyc-6', type: 'COMMERCIAL_REGISTER' },
      { id: 'kyc-7', type: 'TAX_CARD' },
    ],
  },
];

export default function AdminKycPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [factories, setFactories] = useState<any[]>(CLIENT_FALLBACK_KYC);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFactories();
  }, []);

  const fetchFactories = async () => {
    try {
      const res = await fetch('/api/admin/kyc');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setFactories(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (factoryId: string, currentStatus: boolean) => {
    setFactories((prev) =>
      prev.map((f) => (f.id === factoryId ? { ...f, isVerified: !currentStatus } : f))
    );
    try {
      await fetch('/api/admin/kyc', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factoryId, isVerified: !currentStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const exportCsv = () => {
    window.location.href = '/api/admin/export';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7" />
            {t(
              'Trust, KYC & Export Registry Verification (IDA / GOEIC)',
              'توثيق المصانع والسجل الصناعي وسجل المصدرين (KYC)'
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t(
              'Verify Commercial Registers, Industrial Development Authority (IDA) licenses, and GOEIC export cards.',
              'فحص وتوثيق السجل التجاري ورخصة التنمية الصناعية وبطاقة الرقابة على الصادرات (GOEIC).'
            )}
          </p>
        </div>
        <Button onClick={exportCsv} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold">
          <Download className="w-4 h-4" />
          {t('Export KYC Dossier (CSV)', 'تصدير سجل التوثيق CSV')}
        </Button>
      </div>

      <div className="bg-background border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-muted/50 border-b text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-4 text-start">{t('Factory Name', 'اسم المصنع')}</th>
                <th className="p-4 text-start">{t('Location', 'المنطقة الصناعية')}</th>
                <th className="p-4 text-start">{t('Uploaded KYC Docs', 'المستندات المرفقة')}</th>
                <th className="p-4 text-start">{t('Verification Badge', 'حالة التوثيق')}</th>
                <th className="p-4 text-end">{t('Action', 'الإجراء')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    {t('Loading KYC records...', 'جاري تحميل سجلات التوثيق...')}
                  </td>
                </tr>
              ) : (
                factories.map((f) => (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="p-4">
                      <div className="font-bold flex items-center gap-1.5">
                        {f.name}
                        {f.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{f.owner?.email}</div>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {f.location || f.address || 'El Mahalla El Kubra'}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(f.kycDocuments || [{ type: 'COMMERCIAL_REGISTER' }]).map((doc: any, i: number) => (
                          <span
                            key={doc.id || i}
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-muted border"
                          >
                            <FileCheck2 className="w-3 h-3 text-emerald-600" />
                            {doc.type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      {f.isVerified ? (
                        <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {t('TIGARA Verified ✓', 'موثق رسمياً ✓')}
                        </span>
                      ) : (
                        <span className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {t('Pending Audit', 'قيد الفحص')}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-end">
                      <Button
                        variant={f.isVerified ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => toggleVerification(f.id, f.isVerified)}
                        className={!f.isVerified ? 'bg-emerald-600 hover:bg-emerald-700 text-xs font-bold' : 'text-xs font-bold'}
                      >
                        {f.isVerified
                          ? t('Revoke Badge', 'إلغاء الشارة')
                          : t('Grant Verified Badge ✓', 'منح شارة التوثيق ✓')}
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
