import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, TrendingUp, Package, FileText, Star } from 'lucide-react';
import { AnalyticsChart } from './AnalyticsChart';

export default async function FactoryDashboardPage() {
  const authObj = await auth();
  if (!authObj.userId) return null;

  const factory = await prisma.factory.findFirst({
    where: { ownerId: authObj.userId },
    include: {
      owner: { include: { listings: true } },
      quotations: true,
      reviews: true
    }
  });

  if (!factory) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Welcome to Mahalla Cluster Factory Portal</h1>
        <p className="mt-4">Please wait while your factory profile is approved.</p>
      </div>
    );
  }

  const avgRating = factory.reviews.length > 0 
    ? (factory.reviews.reduce((acc, r) => acc + r.rating, 0) / factory.reviews.length).toFixed(1)
    : 'No ratings yet';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Factory Analytics Overview</h1>
        <p className="text-muted-foreground">Monitor your performance on the Mahalla B2B Network.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{factory.owner.listings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quotations Sent</CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{factory.quotations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {factory.quotations.filter(q => q.status === 'ACCEPTED').length} accepted bids
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profile Views</CardTitle>
            <Eye className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +14%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trust Score</CardTitle>
            <Star className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {avgRating} {avgRating !== 'No ratings yet' && <Star className="w-5 h-5 fill-yellow-500 text-yellow-500"/>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on {factory.reviews.length} reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Buyer Engagement (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <AnalyticsChart />
        </CardContent>
      </Card>
    </div>
  );
}
