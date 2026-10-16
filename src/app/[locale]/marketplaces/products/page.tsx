"use client";

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Mail, ShieldCheck, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function ProductsMarketplacePage({ params }: { params: Promise<{ locale: string }> }) {
  const unwrappedParams = use(params);
  const { formatPrice } = useCurrency();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleContact = async (item: any) => {
    const factoryId = item.seller?.factories?.[0]?.id;
    if (!factoryId) {
      alert('This seller does not have an active factory profile.');
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
        router.push(`/${unwrappedParams.locale}/dashboard/messages`);
      } else {
        const err = await res.json();
        alert(err.error || 'Could not start conversation.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetch('/api/public/listings?type=PRODUCT')
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">B2B Products Marketplace</h1>
        <p className="text-lg text-muted-foreground">
          Discover high-quality finished textile products from verified El Mahalla El Kubra factories, complete with EU Digital Product Passports.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading products...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold">No Products Available</h2>
          <p className="text-muted-foreground">Check back later for new factory listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => {
            const factory = item.seller?.factories?.[0];
            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="bg-primary/5 h-44 flex items-center justify-center border-b relative">
                  <Package className="w-16 h-16 text-primary/40" />
                  {item.passport && (
                    <Link
                      href={`/${unwrappedParams.locale}/dpp/${item.id}`}
                      className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow hover:bg-emerald-700"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> EU DPP Verified
                    </Link>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-xl line-clamp-1">{item.title}</h3>
                      <span className="font-bold text-primary shrink-0">
                        {formatPrice(Number(item.price || 0))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground truncate">
                      {factory ? (
                        <Link
                          href={`/${unwrappedParams.locale}/factories/${factory.id}`}
                          className="hover:text-primary font-medium inline-flex items-center gap-1"
                        >
                          <Building2 className="w-3.5 h-3.5" /> {factory.name}
                        </Link>
                      ) : (
                        <span>By: {item.seller?.firstName || 'Factory Owner'}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/${unwrappedParams.locale}/dpp/${item.id}`}
                        className="text-xs border border-emerald-600 text-emerald-700 px-2.5 py-1.5 rounded-full hover:bg-emerald-50 font-medium"
                      >
                        Passport
                      </Link>
                      <button
                        onClick={() => handleContact(item)}
                        className="text-xs bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/90 font-medium"
                      >
                        <Mail className="w-3.5 h-3.5" /> Chat Now
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
