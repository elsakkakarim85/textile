import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export default async function FactoryBillingPage() {
  const authObj = await auth();
  if (!authObj.userId) return null;

  const factory = await prisma.factory.findFirst({
    where: { ownerId: authObj.userId }
  });

  if (!factory) return <div className="p-8">No factory profile found.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscriptions</h1>
        <p className="text-muted-foreground">Upgrade your factory's presence on the Mahalla Cluster.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <Card className={`${factory.subscriptionTier === 'FREE' ? 'border-primary shadow-md' : ''}`}>
          <CardHeader>
            <CardTitle>Free Tier</CardTitle>
            <div className="text-3xl font-bold mt-2">£0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-500" /> Basic Marketplace Listings</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-500" /> Standard Support</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-500" /> 3 Active Jobs</li>
            </ul>
            <button disabled={factory.subscriptionTier === 'FREE'} className="w-full py-2 border rounded-md font-medium disabled:opacity-50">
              {factory.subscriptionTier === 'FREE' ? 'Current Plan' : 'Downgrade'}
            </button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={`relative ${factory.subscriptionTier === 'PRO' ? 'border-primary shadow-md' : 'border-blue-200 bg-blue-50/30'}`}>
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-xs font-bold flex items-center gap-1">
            <Zap className="w-3 h-3" /> RECOMMENDED
          </div>
          <CardHeader>
            <CardTitle>Pro Plan</CardTitle>
            <div className="text-3xl font-bold mt-2">£500<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2 items-center font-medium"><CheckCircle className="w-4 h-4 text-blue-500" /> Digital Product Passports (DPP)</li>
              <li className="flex gap-2 items-center font-medium"><CheckCircle className="w-4 h-4 text-blue-500" /> Featured Marketplace Listings</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-500" /> Unlimited Job Postings</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-green-500" /> Priority Live Chat</li>
            </ul>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold shadow-sm transition-colors">
              Upgrade to Pro (Coming Soon)
            </button>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className={`${factory.subscriptionTier === 'ENTERPRISE' ? 'border-primary shadow-md' : ''}`}>
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <div className="text-3xl font-bold mt-2">Custom</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-slate-400" /> Dedicated Account Manager</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-slate-400" /> API Access</li>
              <li className="flex gap-2 items-center"><CheckCircle className="w-4 h-4 text-slate-400" /> Custom Integrations</li>
            </ul>
            <button className="w-full py-2 border rounded-md font-medium hover:bg-slate-50">
              Contact Sales
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
