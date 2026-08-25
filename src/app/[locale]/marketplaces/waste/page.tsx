import { supabase } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default async function WasteMarketplacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Marketplaces');

  const { data: wastes, error } = await supabase
    .from('waste_inventory')
    .select('*, factories(name_ar, name_en)')
    .eq('is_available', true);

  // Mock data for UI
  const displayWastes = wastes && wastes.length > 0 ? wastes : [
    { material_type: "Cotton Waste", quantity_kg: 500, price_per_kg: 25, factories: { name_ar: "مصنع النور", name_en: "Al-Nour Factory" } },
    { material_type: "Polyester Scraps", quantity_kg: 1200, price_per_kg: 15, factories: { name_ar: "الشركة الدولية", name_en: "International Co." } },
    { material_type: "Mixed Fabric", quantity_kg: 300, price_per_kg: 10, factories: { name_ar: "نسيج المحلة", name_en: "Mahalla Textiles" } }
  ];

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('wasteMarketplaceTitle')}</h1>
          <p className="mt-2 text-muted-foreground">{t('wasteMarketplaceDesc')}</p>
        </div>
        <Button>{t('addWasteListing')}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayWastes.map((item: any, idx: number) => (
          <Card key={idx} className="hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{item.material_type}</CardTitle>
                <Badge variant="outline">{item.quantity_kg} KG</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('factory')}:</span>
                <span className="font-medium">{locale === 'ar' ? item.factories?.name_ar : item.factories?.name_en}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('price')}:</span>
                <span className="font-medium text-primary">{item.price_per_kg} EGP/KG</span>
              </div>
              <Button className="w-full" variant="secondary">{t('contactSeller')}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
