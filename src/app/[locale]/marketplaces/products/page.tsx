"use client";

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Mail, ShieldCheck, Building2, Search, Compass, FileText, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { tr } from '@/lib/i18n-inline';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';

export default function ProductsMarketplacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const { formatPrice } = useCurrency();
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleContact = async (item: any) => {
    const factoryId = item.seller?.factories?.[0]?.id;
    if (!factoryId) {
      router.push(`/${locale}/marketplaces/matchmaking`);
      return;
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factoryId,
          listingId: item.id,
          content: `Hello, I am interested in sourcing your product: ${item.title}`,
        }),
      });
      if (res.ok) {
        router.push(`/${locale}/dashboard/messages`);
      } else {
        router.push(`/${locale}/marketplaces/matchmaking`);
      }
    } catch {
      router.push(`/${locale}/marketplaces/matchmaking`);
    }
  };

  useEffect(() => {
    fetch('/api/public/listings?type=PRODUCT')
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = listings.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.titleAr?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.seller?.factories?.[0]?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('EU ESPR Digital Product Passports • OEKO-TEX® & GOTS', 'جواز المنتج الرقمي الأوروبي • أيكوتكس و GOTS')}
            </div>
            <ExpertManualButton manualId="marketplace-products" locale={locale} variant="pill" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold">
            {t('B2B Finished Textile Products Marketplace', 'سوق المنتجات النسيجية النهائية للتصدير (B2B)')}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {t(
              'Source hospital & hotel bedlinen, zero-twist jacquard terry towels, and compact combed knitwear directly from audited El Mahalla El Kubra mills.',
              'تعاقد مباشرة مع مصانع المحلة الكبرى المعتمدة لتوريد مفروشات الفنادق والمستشفيات، الفوط الجاكار، وأقمشة التريكو المدمجة المرفقة بجواز المنتج الأوروبي.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            href={`/${locale}/marketplaces/matchmaking`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 text-xs"
          >
            <FileText className="w-4 h-4" />
            {t('Post Custom Export RFQ', 'نشر مناقصة توريد خاصة (RFQ)')}
          </Link>
          <Link
            href={`/${locale}/cluster/export-intelligence`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 text-xs"
          >
            <Compass className="w-4 h-4" />
            {t('Export Intelligence Hub', 'مركز ذكاء التصدير')}
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
            'Search Giza 86 bedlinen, 550 GSM hotel towels, jersey, factory name...',
            'ابحث عن ملايات جيزة 86، فوط فندقية 550 جم، جيرسيه، أو اسم المصنع...'
          )}
          className="w-full rounded-xl border bg-background ps-10 pe-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">
          {t('Loading verified export catalog...', 'جاري تحميل كتالوج المنتجات المعتمدة...')}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold">{t('No Matching Products Found', 'لا توجد منتجات مطابقة للبحث')}</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {t('Try clearing your search filter or post a custom RFQ.', 'جرب مسح كلمة البحث أو انشر طلب عرض سعر مخصص.')}
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
                  <Package className="w-16 h-16 text-primary/40" />
                  <Link
                    href={`/${locale}/dpp/${item.id}`}
                    className="absolute top-3 end-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow hover:bg-emerald-700"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t('EU DPP Verified', 'جواز منتج أوروبي موثق')}
                  </Link>
                  {item.incoterm && (
                    <span className="absolute bottom-3 start-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                      {item.incoterm} • MOQ: {item.minOrderQty || 500} {item.unit || 'units'}
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
                        <span>{item.seller?.firstName || t('Verified Mill', 'مصنع معتمد')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href={`/${locale}/dpp/${item.id}`}
                        className="text-xs border border-emerald-600 text-emerald-700 dark:text-emerald-300 px-2.5 py-1.5 rounded-full hover:bg-emerald-500/10 font-semibold"
                      >
                        {t('DPP QR', 'جواز DPP')}
                      </Link>
                      <button
                        onClick={() => handleContact(item)}
                        className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/90 font-semibold"
                      >
                        <Mail className="w-3.5 h-3.5" /> {t('Inquire', 'تواصل')}
                      </button>
                    </div>
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

