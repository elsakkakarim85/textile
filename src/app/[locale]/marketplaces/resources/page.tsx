import { supabase } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function ResourcesMarketplacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Marketplaces');

  const { data: lines } = await supabase
    .from('production_lines')
    .select('*, factories(name_ar, name_en)')
    .eq('is_rentable', true);
    
  const { data: warehouses } = await supabase
    .from('warehouses')
    .select('*, factories(name_ar, name_en)')
    .eq('is_rentable', true);

  const displayLines = lines && lines.length > 0 ? lines : [
    { name_ar: "خط نسيج دائري", name_en: "Circular Knitting Line", capacity_per_day: 1000, rental_price_per_day: 4000, factories: { name_ar: "مصنع أ", name_en: "Factory A" } }
  ];
  const displayWarehouses = warehouses && warehouses.length > 0 ? warehouses : [
    { name: "مخزن المنطقة الصناعية", capacity_sqm: 500, rental_price_per_sqm: 100, factories: { name_ar: "مصنع ب", name_en: "Factory B" } }
  ];

  return (
    <div className="container mx-auto py-10 px-4 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t('resourcesMarketplaceTitle')}</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{t('resourcesMarketplaceDesc')}</p>
      </div>

      {/* Production Lines Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-semibold">{t('productionLines')}</h2>
          <Button variant="outline">{t('addListing')}</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayLines.map((item: any, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{locale === 'ar' ? item.name_ar : item.name_en}</CardTitle>
                <CardDescription>{locale === 'ar' ? item.factories?.name_ar : item.factories?.name_en}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('capacity')}:</span>
                  <span className="font-bold">{item.capacity_per_day} / {t('day')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('rentalPrice')}:</span>
                  <span className="text-primary font-bold">{item.rental_price_per_day} EGP / {t('day')}</span>
                </div>
                <Button className="w-full mt-4">{t('requestRent')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Warehouses Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-semibold">{t('warehouses')}</h2>
          <Button variant="outline">{t('addListing')}</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayWarehouses.map((item: any, idx: number) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{locale === 'ar' ? item.factories?.name_ar : item.factories?.name_en}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('capacity')}:</span>
                  <span className="font-bold">{item.capacity_sqm} m²</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('rentalPrice')}:</span>
                  <span className="text-primary font-bold">{item.rental_price_per_sqm} EGP / m²</span>
                </div>
                <Button className="w-full mt-4">{t('requestRent')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
