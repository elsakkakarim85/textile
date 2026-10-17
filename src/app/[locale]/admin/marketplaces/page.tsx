"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, ShieldCheck, Package, Factory, Recycle, ExternalLink } from 'lucide-react';
import { downloadCSV } from '@/lib/export';
import { tr } from '@/lib/i18n-inline';

export default function AdminMarketplacesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [listings, setListings] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<'ALL' | 'PRODUCT' | 'RESOURCE' | 'WASTE'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/listings')
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = listings.filter((item) =>
    filterType === 'ALL' ? true : item.type === filterType
  );

  const toggleStatus = (id: string) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'FLAGGED' ? 'ACTIVE' : 'FLAGGED' }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t('B2B Marketplaces & EU DPP Moderation Console', 'لوحة رقابة الأسواق وجوازات المنتجات الأوروبية (DPP)')}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t(
              'Audit finished products, raw yarns/dyes, and circular textile waste lots across the Mahalla cluster.',
              'مراقبة واعتماد المنتجات النهائية والغزول والخامات ولوطات العوادم الدائرية في تجمع المحلة.'
            )}
          </p>
        </div>
        <button
          onClick={() => downloadCSV(filtered, 'mahalla_marketplace_catalog')}
          className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg text-xs font-bold"
        >
          <Download className="w-4 h-4" />
          {t('Export Catalog CSV', 'تصدير الكتالوج CSV')}
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'ALL', en: 'All Listings', ar: 'جميع العروض', icon: Package },
            { id: 'PRODUCT', en: 'Finished Products', ar: 'المنتجات النهائية', icon: Package },
            { id: 'RESOURCE', en: 'Yarns & Resources', ar: 'الغزول والخامات', icon: Factory },
            { id: 'WASTE', en: 'Circular Waste Lots', ar: 'عوادم التدوير', icon: Recycle },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                filterType === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t(tab.en, tab.ar)}
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            {t('Active Cluster Marketplace Catalog', 'سجل عروض الأسواق النشطة')} ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">
              {t('Loading marketplace catalog...', 'جاري تحميل سجل الأسواق...')}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {t('No listings match this filter.', 'لا توجد عروض مطابقة.')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-start">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-start">{t('Item / Spec', 'المنتج / المواصفة')}</th>
                    <th className="px-4 py-3 text-start">{t('Type', 'النوع')}</th>
                    <th className="px-4 py-3 text-start">{t('Mill / Seller', 'المصنع العارض')}</th>
                    <th className="px-4 py-3 text-start">{t('Price & MOQ', 'السعر والحد الأدنى')}</th>
                    <th className="px-4 py-3 text-start">{t('EU DPP', 'جواز DPP')}</th>
                    <th className="px-4 py-3 text-end">{t('Moderation', 'الإجراء')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((item) => {
                    const factory = item.seller?.factories?.[0];
                    const isFlagged = item.status === 'FLAGGED';
                    return (
                      <tr key={item.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-semibold max-w-xs">
                          <div className="line-clamp-1">
                            {locale === 'ar' && item.titleAr ? item.titleAr : item.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-normal line-clamp-1">
                            {item.description}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{item.type}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          {factory ? (
                            <Link
                              href={`/${locale}/factories/${factory.id}`}
                              className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                            >
                              {factory.name}
                              {factory.isVerified && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                              )}
                            </Link>
                          ) : (
                            <span>{item.seller?.firstName || 'Cluster Seller'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold">
                          ${Number(item.price || 0).toFixed(2)} / {item.unit || 'unit'}
                          <div className="text-[10px] text-muted-foreground font-normal">
                            MOQ: {item.minOrderQty || 500} • {item.incoterm || 'FOB'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/${locale}/dpp/${item.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {t('Verify DPP', 'فحص الجواز')}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <button
                            onClick={() => toggleStatus(item.id)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                              isFlagged
                                ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                            }`}
                          >
                            {isFlagged
                              ? t('Flagged (Restore)', 'معلق (استعادة)')
                              : t('Approved ✓', 'معتمد ✓')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

