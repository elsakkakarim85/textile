import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DbOfflineBanner } from '@/components/cluster/ui';
import Link from 'next/link';
import { Ship, FlaskConical, Award, ArrowRight, Gauge, Globe2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

const FALLBACK_FACILITIES = [
  {
    id: 'fac-lab-1',
    name: 'TIGARA / UNIDO ISO 17025 Textile Testing & Calibration Lab',
    type: 'TESTING_LAB',
    operator: 'TIGARA Cluster Center',
    ratePerHour: 450,
    currency: 'EGP',
    description:
      'AATCC / ISO colorfastness, tensile strength, Martindale abrasion, pilling, and spectrophotometer CMC ΔE shade certification.',
  },
  {
    id: 'fac-cad-2',
    name: 'Digital 3D CAD/CAM Pattern & Jacquard Design Studio',
    type: 'CAD_STUDIO',
    operator: 'Mahalla Innovation Hub',
    ratePerHour: 350,
    currency: 'EGP',
    description:
      'Lectra/Gerber automated marker nesting, CNC sample cutting, and 3D digital twin fabric drape simulation.',
  },
  {
    id: 'fac-etp-3',
    name: 'Central ZLD Effluent Treatment & Water Recycling Plant',
    type: 'EFFLUENT_TREATMENT',
    operator: 'Cluster Green Utilities',
    ratePerHour: 600,
    currency: 'EGP',
    description:
      'Ultrafiltration (UF) + Reverse Osmosis (RO) wastewater treatment and ZDHC wastewater guideline testing.',
  },
];

const FALLBACK_EXPERTS = [
  {
    id: 'exp-1',
    headline: 'Master Black Belt Lean Six Sigma & Toyota Production System (TPS) Sensei',
    bio: '18+ years leading SMED changeover reduction, OEE turnarounds, and 5S Shingo audits across spinning, weaving, and dyeing mills.',
    expertise: ['Lean Manufacturing', 'SMED & OEE', 'Six Sigma SPC', 'Value Stream Mapping'],
    yearsExp: 18,
    hourlyRate: 950,
    currency: 'EGP',
    isFreeMentor: true,
    isVerified: true,
  },
  {
    id: 'exp-2',
    headline: 'Reactive Dyeing Chemistry, Right-First-Time (RFT) & ZDHC MRSL Lead Auditor',
    bio: 'Specialist in low-liquor 1:6 jet dyeing, spectrophotometer recipe prediction, and zero-discharge chemical management.',
    expertise: ['Reactive Dyeing', 'ZDHC Level 3', 'Colorimetry ΔE', 'Water Recycling'],
    yearsExp: 15,
    hourlyRate: 850,
    currency: 'EGP',
    isFreeMentor: false,
    isVerified: true,
  },
  {
    id: 'exp-3',
    headline: 'EU Export Compliance, CBAM Carbon Reporting & Digital Product Passport (DPP) Advisor',
    bio: 'Guides Egyptian textile exporters through EUR.1 rules of origin, OEKO-TEX/GOTS certification, and EU ESPR traceability.',
    expertise: ['EU Export & EUR.1', 'CBAM & ESG', 'Digital Product Passport', 'Buyer Contracts'],
    yearsExp: 14,
    hourlyRate: 900,
    currency: 'EGP',
    isFreeMentor: true,
    isVerified: true,
  },
];

export default async function ServicesDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const { data, ok } = await safeQuery(
    async () => {
      const [facilities, experts] = await Promise.all([
        prisma.sharedFacility.findMany({ where: { isActive: true }, take: 6 }),
        prisma.expertProfile.findMany({ orderBy: { isVerified: 'desc' }, take: 6 }),
      ]);
      return {
        facilities: facilities.length > 0 ? facilities : FALLBACK_FACILITIES,
        experts: experts.length > 0 ? experts : FALLBACK_EXPERTS,
      };
    },
    { facilities: FALLBACK_FACILITIES, experts: FALLBACK_EXPERTS }
  );

  const facilities = data?.facilities ?? FALLBACK_FACILITIES;
  const experts = data?.experts ?? FALLBACK_EXPERTS;

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {tr(
              locale,
              'Cluster B2B Support Services, Accredited Labs & Global Logistics',
              'دليل الخدمات المساندة والمعامل المعتمدة والشحن اللوجستي بالتجمع'
            )}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {tr(
              locale,
              'Access ISO 17025 testing laboratories, Incoterms 2020 freight & tariff calculators, Lean Six Sigma consultants, and verified export advisors.',
              'وصول مباشر إلى معامل الفحص المعتمدة، وحاسبة الشحن والجمارك واتفاقيات التجارة الحرة، وخبراء التصنيع الرشيق والتصدير.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/${locale}/services/logistics`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Ship className="w-4 h-4" />
              {tr(locale, 'Freight & Incoterms Calculator', 'حاسبة الشحن والإنكوتيرمز')}
            </Button>
          </Link>
          <Link href={`/${locale}/cluster/lean-manufacturing`}>
            <Button variant="outline" className="gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-600" />
              {tr(locale, 'Lean Six Sigma Hub', 'مركز التصنيع الرشيق')}
            </Button>
          </Link>
          <Link href={`/${locale}/cluster/export-intelligence`}>
            <Button variant="outline" className="gap-1.5">
              <Globe2 className="w-4 h-4 text-sky-600" />
              {tr(locale, 'Export & NTM Hub', 'مركز ذكاء التصدير')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Shared Facilities Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" />
            {tr(
              locale,
              'Accredited Cluster Facilities & Testing Labs',
              'المعامل والمراكز الفنية المشتركة'
            )}
          </h2>
          <Link
            href={`/${locale}/cluster/facilities`}
            className="text-sm text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
          >
            {tr(locale, 'View all & book slots', 'عرض الكل وحجز موعد')}{' '}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((f: any) => (
            <Card key={f.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg">{f.name}</CardTitle>
                  <Badge variant="outline">{f.type}</Badge>
                </div>
                <CardDescription className="text-emerald-700 font-medium mt-1">
                  {f.operator || 'TIGARA Cluster Center'} • {Number(f.ratePerHour || 0)}{' '}
                  {f.currency}/hr
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
            {tr(
              locale,
              'Verified Technical Advisors & Export Consultants',
              'الخبراء والاستشاريون المعتمدون'
            )}
          </h2>
          <Link
            href={`/${locale}/cluster/experts`}
            className="text-sm text-indigo-700 font-semibold flex items-center gap-1 hover:underline"
          >
            {tr(locale, 'Request Mentorship', 'طلب استشارة فنية')}{' '}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((exp: any) => (
            <Card key={exp.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base font-bold">{exp.headline}</CardTitle>
                  {exp.isFreeMentor ? (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                      {tr(locale, 'Free Pro-Bono', 'إرشاد مجاني')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {Number(exp.hourlyRate || 0)} {exp.currency}/hr
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {exp.yearsExp} {tr(locale, 'years experience', 'سنة خبرة')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">{exp.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(exp.expertise || []).slice(0, 4).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium"
                    >
                      {tag}
                    </span>
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
