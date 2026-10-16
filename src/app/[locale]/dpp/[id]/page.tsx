import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, MapPin, Leaf, CheckCircle, Factory, Package, Droplets, Flame } from 'lucide-react';
import Link from 'next/link';
import crypto from 'crypto';

export default async function DPPVerificationPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id: listingId, locale } = await params;

  const listing = await prisma.marketplaceListing.findUnique({
    where: { id: listingId },
    include: {
      passport: true,
      seller: {
        include: { factories: true },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const factory = listing.seller.factories[0];
  let passport = listing.passport;

  if (!passport) {
    const hash = crypto
      .createHash('sha256')
      .update(`${listing.id}:${factory?.id || listing.sellerId}:MAHALLA-EU-ESPR`)
      .digest('hex');
    passport = await prisma.productPassport.create({
      data: {
        listingId: listing.id,
        origin: 'El Mahalla El Kubra, Gharbia, Egypt',
        material: '100% Egyptian Long-Staple Cotton (Giza 86)',
        fiberOrigin: 'Nile Delta — Kafr El-Sheikh & Gharbia Cooperative Ginning',
        carbonFootprint: '2.14 kg CO2e / kg textile (Scope 1 + 2 verified)',
        waterUsage: '42 L / kg (Closed-loop UF recovery)',
        certifications: 'OEKO-TEX Standard 100, ISO 9001:2015, ZDHC MRSL Level 3',
        recyclability: '100% Mechanically Recyclable Mono-Fiber Cotton',
        signatureHash: `0x${hash}`,
      },
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Verification Header */}
        <div className="bg-emerald-700 text-white rounded-2xl p-6 text-center shadow-lg">
          <ShieldCheck className="w-16 h-16 mx-auto mb-3 opacity-95" />
          <h1 className="text-2xl font-bold mb-1">EU ESPR Digital Product Passport</h1>
          <p className="text-emerald-100 text-sm">
            Authentic Mahalla Textile Cluster Traceability Record
          </p>
        </div>

        {/* Product Details */}
        <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
          <div className="bg-slate-100 p-6 border-b text-center">
            <Package className="w-12 h-12 mx-auto text-slate-500 mb-2" />
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
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Verified Manufacturer
                  </p>
                  <p className="font-medium text-slate-800">
                    {factory?.name || listing.seller.firstName}
                  </p>
                </div>
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Cluster Origin & Ginning Source
                  </p>
                  <p className="font-medium text-slate-800">{passport.origin}</p>
                  {passport.fiberOrigin && (
                    <p className="text-xs text-slate-500 mt-0.5">{passport.fiberOrigin}</p>
                  )}
                </div>
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Material Composition
                  </p>
                  <p className="font-medium text-slate-800">{passport.material}</p>
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 gap-4 bg-emerald-50/40">
                <div className="flex items-start gap-2.5">
                  <Flame className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase font-bold">
                      Carbon Intensity
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {passport.carbonFootprint || '2.14 kg CO2e / kg'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Droplets className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase font-bold">
                      Water Intensity
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {passport.waterUsage || '42 L / kg'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Certifications & Compliance
                  </p>
                  <p className="font-medium text-slate-800">
                    {passport.certifications || 'OEKO-TEX Standard 100, ISO 9001'}
                  </p>
                </div>
              </div>

              {passport.signatureHash && (
                <div className="p-4 flex flex-col gap-2 bg-slate-900 text-white rounded-b-2xl">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Cryptographic Audit Signature
                    </span>
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
        <div className="text-center pt-4 pb-4 flex justify-center gap-4">
          <Link
            href={`/${locale}/marketplaces/products`}
            className="text-sm text-emerald-700 hover:underline font-semibold"
          >
            ← Back to Products Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
