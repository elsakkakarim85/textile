"use client";

import { useEffect, useState, use } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Factory, Mail, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function ResourcesMarketplacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { formatPrice } = useCurrency();
  const [listings, setListings] = useState<any[]>([]);
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Raw Materials & Resources</h1>
        <p className="text-lg text-muted-foreground">
          Source Giza cotton yarn, greige fabrics, dyes, and production lines from verified Mahalla suppliers.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading resources...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-muted/20">
          <Factory className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold">No Resources Available</h2>
          <p className="text-muted-foreground">Check back later for new factory listings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => {
            const factory = item.seller?.factories?.[0];
            return (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-primary/5 h-44 flex items-center justify-center border-b">
                  <Factory className="w-16 h-16 text-primary/40" />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-xl line-clamp-1">{item.title}</h3>
                    <span className="font-bold text-primary shrink-0">
                      {formatPrice(Number(item.price || 0))}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                    {item.description}
                  </p>
                  <div className="pt-4 border-t flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground truncate">
                      {factory ? (
                        <Link
                          href={`/${locale}/factories/${factory.id}`}
                          className="hover:text-primary font-medium inline-flex items-center gap-1"
                        >
                          <Building2 className="w-3.5 h-3.5" /> {factory.name}
                        </Link>
                      ) : (
                        <span>By: {item.seller?.firstName || 'Supplier'}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleContact(item)}
                      className="text-xs bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/90 font-medium"
                    >
                      <Mail className="w-3.5 h-3.5" /> Inquire
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
