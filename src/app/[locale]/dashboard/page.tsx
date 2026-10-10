import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const t = await getTranslations('Dashboard');

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm text-muted-foreground">مشاهدات الكتالوج</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p className="text-2xl font-bold text-primary">+1,234</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm text-muted-foreground">طلبات التوظيف</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p className="text-2xl font-bold text-primary">12</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm text-muted-foreground">الاستفسارات</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p className="text-2xl font-bold text-primary">5</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2"><CardTitle className="text-sm text-muted-foreground">مبيعات العوادم</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p className="text-2xl font-bold text-primary">320 Kg</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>إدارة مصنعي (My Factory)</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/factory">
              <Button className="w-full">تعديل بيانات الكتالوج والموارد</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>سوق المخلفات</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/marketplaces/waste">
              <Button className="w-full">دخول</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>خطوط الإنتاج والمخازن</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/marketplaces/resources">
              <Button className="w-full">دخول</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التشبيك المشترك (B2B)</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/marketplaces/matchmaking">
              <Button className="w-full">دخول</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader>
            <CardTitle>تدريب الذكاء الاصطناعي (AI Knowledge Base)</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/knowledge">
              <Button className="w-full" variant="secondary">حقن البيانات وتعليم الـ AI</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المستشار الذكي (AI)</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/ai">
              <Button className="w-full" variant="outline">دخول</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>بوابة التوظيف</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/recruitment">
              <Button className="w-full">دخول</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>دليل مقدمي الخدمات</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/services">
              <Button className="w-full">دخول</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
