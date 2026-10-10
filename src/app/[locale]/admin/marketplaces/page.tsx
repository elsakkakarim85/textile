import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';

export default async function AdminMarketplacesPage() {
  const t = await getTranslations('Admin');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('marketplaces')}</h1>
        <p className="text-muted-foreground">Manage products, resources, and marketplace listings across the platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace Management (Coming Soon)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            This module is currently under development. Soon, you will be able to review, approve, and manage all marketplace items from here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
