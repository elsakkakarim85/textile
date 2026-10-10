import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { Factory, Package, Users, Briefcase, ArrowRight } from 'lucide-react';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations('HomePage');

  // Fetch live stats safely
  let stats = { factories: 0, products: 0, jobs: 0 };
  try {
    const [factories, products, jobs] = await Promise.all([
      prisma.factory.count({ where: { status: 'APPROVED' } }),
      prisma.marketplaceListing.count({ where: { status: 'ACTIVE', type: 'PRODUCT' } }),
      prisma.jobPosting.count({ where: { status: 'ACTIVE' } })
    ]);
    stats = { factories, products, jobs };
  } catch (e) {
    console.error('Failed to fetch stats', e);
  }

  return (
    <div className="flex-1 flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-primary/10 to-background py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary drop-shadow-sm">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            <Link href="/marketplaces/products">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Explore Products <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                Factory Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="w-full py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <Factory className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-4xl font-bold">{stats.factories > 0 ? stats.factories : '50+'}</h3>
              <p className="text-muted-foreground font-medium">Verified Factories</p>
            </div>
            <div className="space-y-2">
              <Package className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-4xl font-bold">{stats.products > 0 ? stats.products : '100+'}</h3>
              <p className="text-muted-foreground font-medium">Textile Products</p>
            </div>
            <div className="space-y-2">
              <Briefcase className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-4xl font-bold">{stats.jobs > 0 ? stats.jobs : '20+'}</h3>
              <p className="text-muted-foreground font-medium">Active Jobs</p>
            </div>
            <div className="space-y-2">
              <Users className="w-10 h-10 mx-auto text-primary" />
              <h3 className="text-4xl font-bold">10K+</h3>
              <p className="text-muted-foreground font-medium">Monthly Visitors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold">Everything You Need</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">One unified platform for the entire textile ecosystem.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link href="/marketplaces/products" className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-colors shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">B2B Marketplace</h3>
            <p className="text-muted-foreground text-sm">Source directly from Egyptian factories without middlemen.</p>
          </Link>
          
          <Link href="/recruitment" className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-colors shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Talent Hub</h3>
            <p className="text-muted-foreground text-sm">Find skilled textile workers or apply for factory jobs.</p>
          </Link>
          
          <Link href="/ai" className="group p-8 rounded-2xl border bg-card hover:border-primary/50 transition-colors shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-xl font-bold">AI Consultant</h3>
            <p className="text-muted-foreground text-sm">Ask our Llama 3 powered AI anything about the textile industry.</p>
          </Link>
        </div>
      </section>

    </div>
  );
}
