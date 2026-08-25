import { notFound } from 'next-navigation';
import { supabase } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function FactoryProfilePage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  const t = await getTranslations('FactoryProfile');

  const { data: factory, error } = await supabase
    .from('factories')
    .select('*, products(*), production_lines(*), warehouses(*)')
    .eq('id', id)
    .single();

  // If no factory found and no DB connected, we'll just show a placeholder for UI testing
  const mockFactory = factory || {
    name_ar: "مصنع النور للغزل والنسيج",
    name_en: "Al-Nour Spinning and Weaving",
    description_ar: "مصنع متخصص في إنتاج الغزول القطنية عالية الجودة.",
    description_en: "A factory specialized in producing high quality cotton yarns.",
    is_verified: true,
    qr_code_url: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=example",
    products: [{ name_ar: "غزل قطن 100%", name_en: "100% Cotton Yarn", price_indicative: 150 }],
    production_lines: [{ name_ar: "خط غزل 1", is_rentable: true, rental_price_per_day: 5000 }],
    warehouses: [{ name: "مخزن رئيسي", capacity_sqm: 1000, is_rentable: true }]
  };

  const name = locale === 'ar' ? mockFactory.name_ar : mockFactory.name_en;
  const description = locale === 'ar' ? mockFactory.description_ar : mockFactory.description_en;

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{name}</h1>
            {mockFactory.is_verified && <Badge variant="default">{t('verified')}</Badge>}
          </div>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{description}</p>
        </div>
        
        {/* QR Code */}
        {mockFactory.qr_code_url && (
          <Card className="w-fit shrink-0">
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <img src={mockFactory.qr_code_url} alt="QR Code" className="w-32 h-32" />
              <span className="text-xs text-muted-foreground">{t('scanQr')}</span>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Products Catalog */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t('productsCatalog')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockFactory.products?.map((product: any, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-xl">{locale === 'ar' ? product.name_ar : product.name_en}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('indicativePrice')}: {product.price_indicative} EGP</p>
                <Badge className="mt-4" variant="secondary">{t('dppAvailable')}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Rentable Resources */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t('rentableResources')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockFactory.production_lines?.filter((l: any) => l.is_rentable).map((line: any, idx: number) => (
            <Card key={`line-${idx}`}>
              <CardHeader>
                <CardTitle className="text-lg">{locale === 'ar' ? line.name_ar : line.name_en}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('rentalPrice')}: {line.rental_price_per_day} EGP / {t('day')}</p>
              </CardContent>
            </Card>
          ))}
          {mockFactory.warehouses?.filter((w: any) => w.is_rentable).map((wh: any, idx: number) => (
            <Card key={`wh-${idx}`}>
              <CardHeader>
                <CardTitle className="text-lg">{wh.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t('capacity')}: {wh.capacity_sqm} m²</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
