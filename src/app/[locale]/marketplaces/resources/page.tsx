"use client";

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Factory, Mail, Building2, Search, ShoppingBag, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { tr } from '@/lib/i18n-inline';

export default function ResourcesMarketplacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const { formatPrice } = useCurrency();
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/public/listings?type=RESOURCE')
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleContact = async (item: any) => {
    const factoryId = item.seller?.factories?.[0]?.id;
    if (!factoryId) {
      router.push(`/${locale}/cluster/procurement`);
      return;
    }
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factoryId,
          listingId: item.id,
          content: `Hello, I would like to inquire about your raw material / resource listing: ${item.title}`,
        }),
      });
      if (res.ok) {
        router.push(`/${locale}/dashboard/messages`);
      } else {
        router.push(`/${locale}/cluster/procurement`);
      }
    } catch {
      router.push(`/${locale}/cluster/procurement`);
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
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white p-6 md:p-8 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5" />
            {t('Uster® 5% Certified Yarns • ZDHC Level 3 Dyes • Greige Fabrics', 'غزول معتمدة Uster 5% • صبغات ZDHC • أقمشة خام جريج')}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold">
            {t('Raw Materials, Yarns & Industrial Resources', 'سوق الخامات والغزول والموارد الصناعية')}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {t(
              'Source combed Giza 94/86 yarns, wide-width greige fabrics, and ZDHC reactive dyestuffs directly from Mahalla suppliers — or join a Joint Procurement Pool to save up to 14%.',
              'احصل على غزول قطن جيزة 94/86 الممشطة والأقمشة الخام والصبغات النشطة المعتمدة مباشرة من موردي المحلة، أو انضم لمجموعات الشراء الجماعي لتوفير حتى 14%.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href={`/${locale}/cluster/procurement`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            {t('Join Group Buying Pool', 'مجموعات الشراء الجماعي')}
          </Link>
          <Link
            href={`/${locale}/cluster/capacity`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 text-xs"
          >
            <Factory className="w-4 h-4" />
            {t('Subcontracting Capacity Exchange', 'بورصة الطاقة الإنتاجية')}
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
            'Search Ne 30/1 yarn, Giza 94, reactive dyes, greige percale...',
            'ابحث عن غزل نمرة 30/1، جيزة 94، صبغات نشطة، قماش خام...'
          )}
          className="w-full rounded-xl border bg-background ps-10 pe-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          {t('Loading raw materials & resources...', 'جاري تحميل الخامات والغزول المتاحة...')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <Factory className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold">{t('No Resources Found', 'لا توجد خامات مطابقة')}</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {t('Check the Joint Procurement Hub for active group-buying pools.', 'تصفح مركز الشراء الجماعي للانضمام لصفقات الخامات المجمعة.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const factory = item.seller?.factories?.[0];
            const displayTitle = locale === 'ar' && item.titleAr ? item.titleAr : item.title;
            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="bg-primary/5 h-44 flex items-center justify-center border-b relative">
                  <Factory className="w-16 h-16 text-primary/40" />
                  {item.minOrderQty && (
                    <span className="absolute bottom-3 start-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                      MOQ: {item.minOrderQty} {item.unit || 'kg'} • {item.incoterm || 'EXW'}
                    </span>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-lg line-clamp-2">{displayTitle}</h3>
                      <span className="font-extrabold text-primary shrink-0 text-base">
                        {formatPrice(Number(item.price || 0))}
                        {item.unit ? <span className="text-[10px] text-muted-foreground font-normal">/{item.unit}</span> : null}
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
                          className="hover:text-primary font-semibold inline-flex items-center gap-1"
                        >
                          <Building2 className="w-3.5 h-3.5 text-primary" /> {factory.name}
                        </Link>
                      ) : (
                        <span>{item.seller?.firstName || t('Verified Supplier', 'مورد معتمد')}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleContact(item)}
                      className="text-xs bg-primary text-primary-foreground px-3.5 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/90 font-semibold"
                    >
                      <Mail className="w-3.5 h-3.5" /> {t('Inquire', 'طلب توريد')}
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

