import { supabase } from '@/lib/supabase';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ServicesDirectoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('Services');

  const { data: services, error } = await supabase
    .from('service_providers')
    .select('*');

  // Mock data for UI testing if DB is empty/unconnected
  const displayServices = services && services.length > 0 ? services : [
    { company_name: "Gtex for Logistics", service_category: "شحن لوجستي", region: "Egypt & Europe", description: "شحن دولي من الباب للباب لمعظم دول أوروبا." },
    { company_name: "Mahalla Dyeing Experts", service_category: "صباغة وتجهيز", region: "Egypt", description: "أحدث أساليب الصباغة الصديقة للبيئة." },
    { company_name: "TexMark", service_category: "تسويق دولي", region: "Europe", description: "خدمات الذكاء الاصطناعي والتسويق الدولي لمنتجات النسيج." }
  ];

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayServices.map((service: any, idx: number) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{service.company_name}</CardTitle>
                <Badge variant="outline">{service.region}</Badge>
              </div>
              <CardDescription className="text-primary font-medium mt-1">
                {service.service_category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
