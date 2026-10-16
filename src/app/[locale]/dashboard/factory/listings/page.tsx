"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Plus } from 'lucide-react';

export default function FactoryListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('PRODUCT');
  const [price, setPrice] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/factory/listings');
      if (res.ok) setListings(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/factory/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, type, price }),
      });
      if (res.ok) {
        setTitle(''); setDescription(''); setPrice('');
        fetchListings();
      } else {
        alert('Failed to post listing. Is your factory approved?');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    try {
      const res = await fetch(`/api/factory/listings?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchListings();
    } catch (e) {
      console.error(e);
    }
  };

  const [dppLoading, setDppLoading] = useState<string | null>(null);

  const handleGenerateDPP = async (listingId: string) => {
    const material = prompt('Enter material composition (e.g., 100% Cotton):', '100% Egyptian Cotton');
    if (!material) return;
    const certifications = prompt('Enter certifications (e.g., ISO, GOTS):', 'GOTS Certified');

    setDppLoading(listingId);
    try {
      const res = await fetch('/api/factory/listings/dpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId, material, origin: 'Mahalla El Kubra, Egypt', certifications
        })
      });
      if (res.ok) {
        alert('Digital Passport created successfully!');
        fetchListings(); // Refresh to get passport data
      }
    } catch (e) {
      console.error(e);
    }
    setDppLoading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marketplace Listings</h1>
        <p className="text-muted-foreground">Manage your products, waste, and resources for sale/rent.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-background border rounded px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-background border rounded px-3 py-2 text-sm">
                    <option value="PRODUCT">Finished Product</option>
                    <option value="RESOURCE">Raw Material / Resource</option>
                    <option value="WASTE">Textile Waste</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (Optional)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-background border rounded px-3 py-2 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-background border rounded px-3 py-2 text-sm" />
                </div>
                <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded font-medium flex justify-center items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Listing
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          {loading ? <p>Loading...</p> : listings.length === 0 ? <p className="text-muted-foreground">No listings found.</p> : (
            listings.map(listing => (
              <Card key={listing.id}>
                <CardContent className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{listing.title} <span className="text-xs bg-secondary px-2 py-1 rounded ml-2">{listing.type}</span></h3>
                      <p className="text-sm text-muted-foreground mt-1">{listing.description}</p>
                      {listing.price > 0 && <p className="text-sm font-medium mt-2">Price: ${listing.price}</p>}
                    </div>
                    <button onClick={() => handleDelete(listing.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {listing.type === 'PRODUCT' && (
                    <div className="pt-4 border-t flex items-center justify-between">
                      {listing.passport ? (
                        <div className="flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-200 p-3 rounded-lg w-full">
                          <div>
                            <p className="text-sm font-bold text-emerald-800">
                              ✓ EU Digital Product Passport Active
                            </p>
                            <p className="text-xs text-emerald-700">
                              {listing.passport.material} • {listing.passport.certifications || 'OEKO-TEX / ISO'}
                            </p>
                          </div>
                          <a
                            href={`/en/dpp/${listing.id}`}
                            target="_blank"
                            className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700"
                          >
                            View Public DPP →
                          </a>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGenerateDPP(listing.id)}
                          disabled={dppLoading === listing.id}
                          className="text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded font-medium hover:bg-secondary/80 disabled:opacity-50"
                        >
                          {dppLoading === listing.id ? 'Generating...' : 'Generate Digital Passport (QR)'}
                        </button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
