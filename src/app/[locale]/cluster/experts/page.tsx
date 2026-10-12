import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUserId, safeQuery } from '@/server/cluster';
import { tr, fmtMoney } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { UserCheck, Globe, Star, ShieldCheck, Briefcase, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function ExpertsPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params;
  const { q } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const userId = await currentUserId();
  if (!userId) redirect(`/${locale}/sign-in`);

  const { data: experts, ok } = await safeQuery(
    async () => {
      const where: any = {};
      if (q) {
        where.OR = [
          { headline: { contains: q, mode: 'insensitive' } },
          { bio: { contains: q, mode: 'insensitive' } }
        ];
      }
      return prisma.expertProfile.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, role: true } } },
        orderBy: [{ isVerified: 'desc' }, { yearsOfExperience: 'desc' }]
      });
    },
    // Fallback data
    [
      { id: '1', headline: 'Lean Manufacturing & Dyeing Specialist', bio: '20+ years of experience optimizing dyeing houses across Egypt and Turkey.', expertise: ['Lean', 'Dyeing', 'Quality'], yearsOfExperience: 22, languages: ['English', 'Arabic'], isAvailableForMentorship: true, isVerified: true, hourlyRate: 0, user: { firstName: 'Eng. Ahmed', lastName: 'Hassan', role: 'EXPERT' } },
      { id: '2', headline: 'EU Export & Compliance Consultant', bio: 'Helping textile SMEs navigate CBAM and DPP requirements for European markets.', expertise: ['Export', 'CBAM', 'Sustainability'], yearsOfExperience: 15, languages: ['English', 'French'], isAvailableForMentorship: true, isVerified: true, hourlyRate: 1500, user: { firstName: 'Sarah', lastName: 'Mansour', role: 'EXPERT' } }
    ]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={UserCheck}
        title={t('Experts & Mentorship', 'الخبراء والإرشاد')}
        subtitle={t('Connect with verified industry experts for consultation, auditing, or mentorship.', 'تواصل مع خبراء الصناعة المعتمدين للاستشارة، التدقيق، أو التوجيه.')}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="flex gap-4 mb-8">
        <form className="flex-1 max-w-md flex gap-2">
          <Input name="q" defaultValue={q || ''} placeholder={t('Search by skill, name or title...', 'ابحث بالمهارة، الاسم، أو الوظيفة...')} />
          <Button type="submit" variant="secondary">{t('Search', 'بحث')}</Button>
        </form>
        <Button className="ms-auto" variant="outline">
          {t('Become an Expert', 'انضم كخبير')}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {experts?.map((expert: any) => (
          <Card key={expert.id} className="p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {expert.user?.firstName?.[0]}{expert.user?.lastName?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {expert.user?.firstName} {expert.user?.lastName}
                    {expert.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                  </h3>
                  <p className="text-sm text-muted-foreground">{expert.headline}</p>
                </div>
              </div>
              <div className="text-right">
                {expert.hourlyRate ? (
                  <div className="font-semibold">{fmtMoney(locale, expert.hourlyRate)}<span className="text-xs text-muted-foreground font-normal">/h</span></div>
                ) : (
                  <Pill tone="emerald">{t('Pro Bono', 'مجاني')}</Pill>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{expert.bio}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {expert.expertise?.map((skill: string) => (
                <span key={skill} className="px-2 py-1 bg-muted rounded text-xs font-medium">{skill}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg mt-auto mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{expert.yearsOfExperience} {t('Years', 'سنوات')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="truncate">{expert.languages?.join(', ')}</span>
              </div>
            </div>

            <Button className="w-full" disabled={!expert.isAvailableForMentorship}>
              <MessageSquare className="w-4 h-4 me-2" />
              {expert.isAvailableForMentorship ? t('Request Mentorship', 'طلب توجيه') : t('Not Available', 'غير متاح حالياً')}
            </Button>
          </Card>
        ))}

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
