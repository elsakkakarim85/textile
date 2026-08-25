import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function MatchmakingPage() {
  const t = await getTranslations('Marketplaces');

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t('matchmakingTitle')}</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{t('matchmakingDesc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Joint Manufacturing */}
        <Card className="border-primary/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t('jointManufacturing')}</CardTitle>
            <CardDescription>{t('jointManufacturingDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">{t('exploreOpportunities')}</Button>
            <Button variant="outline" className="w-full">{t('postRequest')}</Button>
          </CardContent>
        </Card>

        {/* Feeding Industries */}
        <Card className="border-primary/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t('feedingIndustries')}</CardTitle>
            <CardDescription>{t('feedingIndustriesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">{t('findSuppliers')}</Button>
            <Button variant="outline" className="w-full">{t('registerAsSupplier')}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
