import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtMoney } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { ExpertRequestModal, BecomeExpertModal } from '@/components/cluster/community/CommunityInteractive';
import { UserCheck, Globe, ShieldCheck, Briefcase } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const dynamic = 'force-dynamic';

export default async function ExpertsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: experts, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (q) {
        where.OR = [
          { displayName: { contains: q, mode: 'insensitive' } },
          { headline: { contains: q, mode: 'insensitive' } },
          { bio: { contains: q, mode: 'insensitive' } },
        ];
      }
      return prisma.expertProfile.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, role: true } } },
        orderBy: [{ isVerified: 'desc' }, { yearsExp: 'desc' }],
      });
    },
    [
      {
        id: '1',
        displayName: 'Dr. Eng. Ahmed Hassan',
        headline: 'Lean Manufacturing & Reactive Dyeing Specialist',
        bio: '22+ years optimizing dyeing houses across Egypt, Italy, and Turkey. Specialized in Right-First-Time (RFT) dyeing and water reduction.',
        expertise: ['Lean Manufacturing', 'Reactive Dyeing', 'ZDHC Level 3'],
        yearsExp: 22,
        languages: ['Arabic', 'English'],
        isMentor: true,
        isVerified: true,
        hourlyRate: 0,
        currency: 'EGP',
      },
      {
        id: '2',
        displayName: 'Sarah Mansour',
        headline: 'EU Export Compliance, CBAM & Digital Product Passport Advisor',
        bio: 'Helping Egyptian textile SMEs obtain OEKO-TEX, GOTS, and EU Digital Product Passport compliance for European retail chains.',
        expertise: ['EU Export', 'CBAM', 'OEKO-TEX / GOTS'],
        yearsExp: 15,
        languages: ['Arabic', 'English', 'French'],
        isMentor: true,
        isVerified: true,
        hourlyRate: 1200,
        currency: 'EGP',
      },
    ] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={UserCheck}
        title={t('Verified Experts, Auditors & Mentors', 'الخبراء المعتمدون والموجهون الصناعيون')}
        subtitle={t(
          'Book technical consultations, shop-floor lean audits, or pro-bono mentorship hours with accredited textile specialists.',
          'احجز استشارات فنية، تدقيق خطوط الإنتاج، أو ساعات توجيه مجانية مع خبراء صناعة الغزل والنسيج المعتمدين.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <form className="flex-1 max-w-md flex gap-2">
          <Input
            name="q"
            defaultValue={q || ''}
            placeholder={t('Search by skill, name or title...', 'ابحث بالمهارة، الاسم، أو التخصص...')}
          />
          <Button type="submit" variant="secondary">
            {t('Search', 'بحث')}
          </Button>
        </form>
        <BecomeExpertModal locale={locale} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {experts?.map((expert: any) => {
          const fullName =
            expert.displayName ||
            `${expert.user?.firstName || ''} ${expert.user?.lastName || ''}`.trim() ||
            'Cluster Expert';
          const initials = fullName
            .split(' ')
            .slice(0, 2)
            .map((n: string) => n[0])
            .join('')
            .toUpperCase();
          const years = expert.yearsExp ?? expert.yearsOfExperience ?? 12;
          const rate = Number(expert.hourlyRate || 0);

          return (
            <Card key={expert.id} className="p-6 flex flex-col hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {fullName}
                      {expert.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </h3>
                    <p className="text-sm text-muted-foreground">{expert.headline}</p>
                  </div>
                </div>
                <div className="text-end">
                  {rate > 0 ? (
                    <div className="font-semibold">
                      {fmtMoney(locale, rate, expert.currency || 'EGP')}
                      <span className="text-xs text-muted-foreground font-normal">/h</span>
                    </div>
                  ) : (
                    <Pill tone="emerald">{t('Pro Bono Mentor', 'توجيه مجاني للمصانع')}</Pill>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 flex-1">{expert.bio}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {expert.expertise?.map((skill: string) => (
                  <span key={skill} className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span>
                    {years} {t('Years Experience', 'سنة خبرة')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="truncate">{expert.languages?.join(', ')}</span>
                </div>
              </div>

              <ExpertRequestModal expert={expert} locale={locale} />
            </Card>
          );
        })}

        {(!experts || experts.length === 0) && (
          <div className="col-span-full">
            <EmptyState
              icon={UserCheck}
              title={t('No Experts Found', 'لا يوجد خبراء')}
              hint={t('Try searching with different keywords.', 'حاول البحث بكلمات مختلفة.')}
            />
          </div>
        )}
      </div>
    </div>
  );
}
