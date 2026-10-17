"use client";

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Recycle, Mail, Building2, Plus, Gauge, Leaf, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { tr } from '@/lib/i18n-inline';

export default function WasteMarketplacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const { formatPrice } = useCurrency();
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/public/listings?type=WASTE')
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleContact = async (item: any) => {
    const factoryId = item.seller?.factories?.[0]?.id;
    if (!factoryId) {
      router.push(`/${locale}/cluster/sustainability`);
      return;
    }
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factoryId,
          listingId: item.id,
          content: `Hello, I am interested in purchasing your circular textile waste lot: ${item.title}`,
        }),
      });
      if (res.ok) {
        router.push(`/${locale}/dashboard/messages`);
      } else {
        router.push(`/${locale}/cluster/sustainability`);
      }
    } catch {
      router.push(`/${locale}/cluster/sustainability`);
    }
  };

  const filtered = listings.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.titleAr?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-green-950 to-slate-900 text-white p-6 md:p-8 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full">
            <Recycle className="w-3.5 h-3.5" />
            {t('GRS Circular Economy • 5S Red-Tag Salvage • Scope 3 Carbon Offset', 'الاقتصاد الدائري GRS • استرداد بطاقات 5S الحمراء • خفض الانبعاثات')}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold">
            {t('Circular Textile Waste & Fiber Recycling Exchange', 'بورصة تدوير العوادم والمخلفات النسيجية الدائرية')}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {t(
              'Monetize sorted Giza comber noil, 100% cotton cutting clips, and selvedge offcuts to power open-end recycled spinning and EU CBAM/DPP circularity targets.',
              'حوّل عوادم التمشيط وقصاقيص المقصدار وبواقي الأنوال المفروزة إلى إيرادات نقدية مباشرة لدعم الغزل التوربيني المعاد تدويره وتحقيق متطلبات الاستدامة الأوروبية.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href={`/${locale}/marketplaces/waste/add`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 text-xs shadow"
          >
            <Plus className="w-4 h-4" />
            {t('List Waste Lot for Sale', 'إضافة عرض بيع عوادم')}
          </Link>
          <Link
            href={`/${locale}/cluster/lean-manufacturing`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 text-xs"
          >
            <Gauge className="w-4 h-4" />
            {t('5S Red-Tag Register', 'سجل بطاقات 5S الحمراء')}
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl">
        <Search className="w-4 h-4 text-muted-foreground absolute start-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t(
            'Search comber noil, white cotton clips, selvedge offcuts, yarn cones...',
            'ابحث عن عوادم تمشيط، قصاقيص قطن بيضاء، براسل أنوال، بواقي كون...'
          )}
          className="w-full rounded-xl border bg-background ps-10 pe-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          {t('Loading circular textile waste lots...', 'جاري تحميل لوطات العوادم والمخلفات النسيجية...')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <Recycle className="w-12 h-12 mx-auto mb-4 text-green-500/50" />
          <h2 className="text-xl font-bold">{t('No Waste Lots Matching Filter', 'لا توجد عروض عوادم مطابقة')}</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {t('List your sorted shop-floor offcuts to connect with mechanical recyclers.', 'انشر عوادم مصنعك المفروزة للتواصل المباشر مع مصانع الفرم وإعادة التدوير.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const factory = item.seller?.factories?.[0];
            const displayTitle = locale === 'ar' && item.titleAr ? item.titleAr : item.title;
            const lotKg = Number(item.minOrderQty || 1000);
            const co2SavedKg = Math.round(lotKg * 3.2);
            return (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-green-500/20 flex flex-col"
              >
                <div className="bg-green-500/10 h-44 flex items-center justify-center border-b border-green-500/20 relative">
                  <Recycle className="w-16 h-16 text-green-600/40" />
                  <span className="absolute top-3 end-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> -{co2SavedKg.toLocaleString()} kg CO₂e / lot
                  </span>
                  <span className="absolute bottom-3 start-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                    {t('Min Lot:', 'الحد الأدنى:')} {lotKg.toLocaleString()} {item.unit || 'kg'}
                  </span>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-lg line-clamp-2">{displayTitle}</h3>
                      <span className="font-extrabold text-green-600 shrink-0 text-base">
                        {formatPrice(Number(item.price || 0))}
                        <span className="text-[10px] text-muted-foreground font-normal">/{item.unit || 'kg'}</span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground truncate">
                      {factory ? (
                        <Link
                          href={`/${locale}/factories/${factory.id}`}
                          className="hover:text-green-700 font-semibold inline-flex items-center gap-1"
                        >
                          <Building2 className="w-3.5 h-3.5 text-green-600" /> {factory.name}
                        </Link>
                      ) : (
                        <span>{item.seller?.firstName || t('Verified Mill', 'مصنع معتمد')}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleContact(item)}
                      className="text-xs bg-green-600 text-white px-3.5 py-1.5 rounded-full flex items-center gap-1 hover:bg-green-700 font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5" /> {t('Acquire Lot', 'شراء اللوط')}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

