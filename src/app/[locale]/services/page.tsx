import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Ship, FlaskConical, Award, ArrowRight } from 'lucide-react';

export default async function ServicesDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { data } = await safeQuery(async () => {
    const [facilities, experts] = await Promise.all([
      prisma.sharedFacility.findMany({ where: { isActive: true }, take: 6 }),
      prisma.expertProfile.findMany({ orderBy: { isVerified: 'desc' }, take: 6 }),
    ]);
    return { facilities, experts };
  });

  const facilities = data?.facilities ?? [];
  const experts = data?.experts ?? [];

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {tr(
              locale,
              'Cluster B2B Support Services, Labs & Logistics',
              'دليل الخدمات المساندة والمعامل والشحن اللوجستي بالتجمع'
            )}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {tr(
              locale,
              'Access accredited testing laboratories, international freight & customs calculators, and verified technical advisors.',
              'وصول مباشر إلى معامل الفحص المعتمدة، وحاسبة الشحن والتخليص الجمركي، والخبراء الفنيين المعتمدين.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/${locale}/services/logistics`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Ship className="w-4 h-4" />
              {tr(locale, 'Freight & Customs Calculator', 'حاسبة الشحن والجمارك')}
            </Button>
          </Link>
          <Link href={`/${locale}/cluster/facilities`}>
            <Button variant="outline">
              {tr(locale, 'Book Shared Lab', 'حجز المعامل المشتركة')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Shared Facilities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            {tr(locale, 'Accredited Cluster Facilities & Testing Labs', 'المعامل والمراكز الفنية المشتركة')}
          </h2>
          <Link
            href={`/${locale}/cluster/facilities`}
            className="text-sm text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
          >
            {tr(locale, 'View all & book slots', 'عرض الكل وحجز موعد')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((f) => (
            <Card key={f.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg">{f.name}</CardTitle>
                  <Badge variant="outline">{f.type}</Badge>
                </div>
                <CardDescription className="text-emerald-700 font-medium mt-1">
                  {f.operator || 'TIGARA Cluster Center'} • {Number(f.ratePerHour || 0)} {f.currency}/hr
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{f.description}</p>
                <Link
                  href={`/${locale}/cluster/facilities`}
                  className="inline-block text-xs font-bold text-emerald-700 hover:underline"
                >
                  {tr(locale, 'Reserve Equipment →', 'حجز المعدات ←')}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Advisors & Service Providers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            {tr(locale, 'Verified Technical Advisors & Export Consultants', 'الخبراء والاستشاريون المعتمدون')}
          </h2>
          <Link
            href={`/${locale}/cluster/experts`}
            className="text-sm text-indigo-700 font-semibold flex items-center gap-1 hover:underline"
          >
            {tr(locale, 'Request Mentorship', 'طلب استشارة فنية')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((exp) => (
            <Card key={exp.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg">{exp.displayName}</CardTitle>
                  {exp.isVerified && (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      {tr(locale, 'Verified', 'معتمد')}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-indigo-700 font-medium mt-1">
                  {exp.headline}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{exp.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.expertise.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
