"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Mail } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function ProductsMarketplacePage({ params }: { params: Promise<{ locale: string }> }) {
  const unwrappedParams = use(params);
  const { formatPrice } = useCurrency();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleContact = async (item: any) => {
    if (!isSignedIn) {
      alert('Please sign in to contact the factory.');
      return;
    }
    const factoryId = item.seller.factories?.[0]?.id;
    if (!factoryId) {
      alert('This seller does not have an active factory profile.');
      return;
    }
    
    // Create or get conversation
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factoryId,
          listingId: item.id,
          content: `Hello, I am interested in your product: ${item.title}`
        })
      });
      if (res.ok) {
        router.push(`/${unwrappedParams.locale}/dashboard/messages`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetch('/api/public/listings?type=PRODUCT')
      .then(res => res.json())
      .then(data => setListings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">B2B Products Marketplace</h1>
        <p className="text-lg text-muted-foreground">Discover high-quality finished textile products from verified Egyptian factories.</p>
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
          {listings.map(item => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-primary/5 h-48 flex items-center justify-center border-b">
                <Package className="w-16 h-16 text-primary/40" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl line-clamp-1">{item.title}</h3>
                  <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{item.description}</p>
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    By: {item.seller.factories?.[0]?.name || item.seller.firstName || 'Factory Owner'}
                  </div>
                  <button 
                    onClick={() => handleContact(item)} 
                    className="text-sm bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-primary/90"
                  >
                    <Mail className="w-4 h-4" /> Chat Now
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
