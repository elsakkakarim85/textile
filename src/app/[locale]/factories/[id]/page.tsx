import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Building2, MessageSquare } from 'lucide-react';
import { FactoryReviewForm } from './FactoryReviewForm';
import { auth } from '@clerk/nextjs/server';

export default async function FactoryProfilePage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  const authObj = await auth();

  const factory = await prisma.factory.findUnique({
    where: { id },
    include: {
      owner: { include: { listings: true } },
      reviews: {
        include: { reviewer: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!factory) {
    return <div className="text-center py-20 text-2xl font-bold">Factory not found.</div>;
  }

  const avgRating = factory.reviews.length > 0 
    ? (factory.reviews.reduce((acc, r) => acc + r.rating, 0) / factory.reviews.length).toFixed(1)
    : 'No ratings yet';

  const hasReviewed = authObj.userId ? factory.reviews.some(r => r.reviewerId === authObj.userId) : false;

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {factory.name}
                {factory.isVerified && (
                  <span className="text-blue-500" title="Verified by Admin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" /> {factory.address}
              </div>
            </div>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl">{factory.description}</p>
          <div className="flex gap-2">
            {factory.status === 'APPROVED' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified Factory</Badge>}
            {factory.subscriptionTier === 'PRO' && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Pro Member</Badge>}
          </div>
        </div>
        
        {/* Trust Score */}
        <Card className="w-fit shrink-0 min-w-[200px] border-yellow-200 bg-yellow-50/30">
          <CardContent className="p-6 flex flex-col items-center gap-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase">Trust Score</h3>
            <div className="flex items-center gap-2 text-4xl font-bold text-slate-800">
              {avgRating} <Star className="w-8 h-8 fill-yellow-500 text-yellow-500" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{factory.reviews.length} Verified Reviews</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content: Products & Reviews */}
        <div className="md:col-span-2 space-y-8">
          {/* Products Catalog */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Public Catalog</h2>
            {factory.owner.listings.length === 0 ? (
              <p className="text-muted-foreground">No public products listed currently.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {factory.owner.listings.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">{product.price ? `${product.price} EGP` : 'Negotiable'}</span>
                        <Badge variant="outline">{product.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6" /> Buyer Reviews
            </h2>

            {/* Leave a review */}
            {authObj.userId && authObj.userId !== factory.ownerId && !hasReviewed && (
              <FactoryReviewForm factoryId={factory.id} />
            )}

            {/* Review List */}
            <div className="space-y-4">
              {factory.reviews.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-lg">
                  <Star className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-muted-foreground font-medium">No reviews yet.</p>
                  <p className="text-sm text-slate-400">Be the first to review this factory.</p>
                </div>
              ) : (
                factory.reviews.map(review => (
                  <div key={review.id} className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        • {review.reviewer.firstName || 'Verified Buyer'}
                      </span>
                      <span className="text-xs text-slate-400">
                        • {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="text-sm text-slate-700">{review.comment}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Registration Number</p>
                <p className="font-medium">{factory.taxRegistrationNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Member Since</p>
                <p className="font-medium">{new Date(factory.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Subscription</p>
                <Badge variant="outline">{factory.subscriptionTier}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
