import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function RecruitmentPage() {
  const t = await getTranslations('Recruitment');

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('description')}</p>
        </div>
        <Button>{t('postJob')}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>{t('job1')}</CardTitle>
              <Badge>{t('urgent')}</Badge>
            </div>
            <CardDescription>مصنع النور للنسيج</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{t('job1Desc')}</p>
            <Button variant="secondary" className="w-full">{t('applyWithAI')}</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('job2')}</CardTitle>
            <CardDescription>الشركة الدولية</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{t('job2Desc')}</p>
            <Button variant="secondary" className="w-full">{t('applyWithAI')}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
