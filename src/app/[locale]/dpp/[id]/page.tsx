import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, MapPin, Leaf, CheckCircle, Factory, Package } from 'lucide-react';
import Link from 'next/link';

export default async function DPPVerificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: listingId } = await params;

  const passport = await prisma.productPassport.findUnique({
    where: { listingId },
    include: {
      listing: {
        include: {
          seller: {
            include: { factories: true }
          }
        }
      }
    }
  });

  if (!passport) {
    notFound();
  }

  const listing = passport.listing;
  const factory = listing.seller.factories[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Verification Header */}
        <div className="bg-green-600 text-white rounded-2xl p-6 text-center shadow-lg">
          <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-2xl font-bold mb-1">Verified Digital Passport</h1>
          <p className="text-green-100 text-sm">Authentic Mahalla Cluster Product</p>
        </div>

        {/* Product Details */}
        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
          <div className="bg-slate-100 p-6 border-b text-center">
            <Package className="w-12 h-12 mx-auto text-slate-400 mb-2" />
            <h2 className="text-xl font-bold text-slate-800">{listing.title}</h2>
            <p className="text-slate-500 text-sm mt-2">{listing.description}</p>
          </div>
          
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="p-4 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Manufacturer</p>
                  <p className="font-medium text-slate-800">{factory?.name || listing.seller.firstName}</p>
                </div>
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Origin</p>
                  <p className="font-medium text-slate-800">{passport.origin}</p>
                </div>
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Material Composition</p>
                  <p className="font-medium text-slate-800">{passport.material}</p>
                </div>
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Certifications</p>
                  <p className="font-medium text-slate-800">{passport.certifications || 'Pending'}</p>
                </div>
              </div>

              {passport.signatureHash && (
                <div className="p-4 flex flex-col gap-2 bg-slate-900 text-white rounded-b-2xl">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Blockchain Verified Signature</span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 break-all bg-slate-800 p-2 rounded">
                    {passport.signatureHash}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="text-center pt-8 pb-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 font-medium">
            Powered by Mahalla Textile Cluster
          </Link>
        </div>

      </div>
    </div>
  );
}
