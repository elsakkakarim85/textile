"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Factory, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ResourcesMarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/listings?type=RESOURCE')
      .then(res => res.json())
      .then(data => setListings(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Raw Materials & Resources</h1>
        <p className="text-lg text-muted-foreground">Source yarn, fabrics, and production lines from verified suppliers.</p>
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
          {listings.map(item => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="bg-primary/5 h-48 flex items-center justify-center border-b">
                <Factory className="w-16 h-16 text-primary/40" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl line-clamp-1">{item.title}</h3>
                  <span className="font-bold text-primary">${item.price}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{item.description}</p>
                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    By: {item.seller.firstName || 'Supplier'}
                  </div>
                  <Link href={`mailto:${item.seller.email}`} className="text-sm text-primary flex items-center gap-1 hover:underline">
                    <Mail className="w-4 h-4" /> Contact
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
