import type { ForumCategory } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, EmptyState, DbOfflineBanner, Pill } from '@/components/cluster/ui';
import { ForumNewThreadForm } from '@/components/cluster/community/CommunityInteractive';
import { MessageSquare, Pin, CheckCircle2, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const CATEGORIES: ForumCategory[] = ['TECHNICAL', 'MARKET', 'SUSTAINABILITY', 'POLICY', 'JOBS', 'GENERAL'];

export default async function ForumPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: threads, ok } = await safeQuery(
    async () => {
      const where: any = { deletedAt: null };
      if (category && CATEGORIES.includes(category as ForumCategory)) {
        where.category = category as ForumCategory;
      }
      if (q) where.title = { contains: q, mode: 'insensitive' };
      return prisma.forumThread.findMany({
        where,
        include: {
          author: true,
          posts: { where: { isAccepted: true, deletedAt: null }, select: { id: true } },
          _count: { select: { posts: true } },
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        take: 50,
      });
    },
    [
      {
        id: '1',
        title: 'أفضل طريقة لتقليل استهلاك المياه في الصباغة التفاعلية للقطن؟',
        category: 'TECHNICAL' as ForumCategory,
        isPinned: true,
        posts: [{ id: 'p1' }],
        author: { firstName: 'Hassan', lastName: 'El-Mahdi', role: 'factory_owner' },
        createdAt: new Date(),
        _count: { posts: 4 },
      },
      {
        id: '2',
        title: 'Experience with EU CBAM & Digital Product Passport (DPP) reporting?',
        category: 'SUSTAINABILITY' as ForumCategory,
        isPinned: false,
        posts: [],
        author: { firstName: 'Omar', lastName: 'Tarek', role: 'factory_owner' },
        createdAt: new Date(Date.now() - 86400000),
        _count: { posts: 3 },
      },
    ] as any[]
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <PageHeader
        icon={MessageSquare}
        title={t('Cluster Technical Forum & Peer Q&A', 'منتدى التجمع وتبادل الخبرات الفنية')}
        subtitle={t(
          'Solve dyeing, spinning, loom maintenance, and EU export compliance challenges together with Mahalla engineers and verified consultants.',
          'اطرح الأسئلة الفنية، شارك المعرفة، وحل مشكلات الصباغة والغزل والصيانة والتصدير مع مهندسي وخبراء المحلة.'
        )}
      />

      {!ok && <DbOfflineBanner locale={locale} />}

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-6">
          <ForumNewThreadForm locale={locale} />

          <Card className="p-4">
            <form className="relative mb-6">
              <Search className="absolute top-2.5 start-3 w-4 h-4 text-muted-foreground" />
              <Input name="q" defaultValue={q || ''} placeholder={t('Search discussions...', 'بحث في المناقشات...')} className="ps-9" />
            </form>

            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">{t('Categories', 'التصنيفات')}</h3>
            <div className="space-y-1">
              <Link
                href={`/${locale}/cluster/forum`}
                className={`block px-3 py-2 rounded-md text-sm ${
                  !category ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                }`}
              >
                {t('All Topics', 'جميع المواضيع')}
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/${locale}/cluster/forum?category=${cat}`}
                  className={`block px-3 py-2 rounded-md text-sm capitalize ${
                    category === cat ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                  }`}
                >
                  {cat.toLowerCase()}
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {threads?.map((thread: any) => {
            const hasAccepted = thread.hasAcceptedAnswer || (thread.posts && thread.posts.length > 0);
            return (
              <Link key={thread.id} href={`/${locale}/cluster/forum/${thread.id}`} className="block group">
                <Card className="p-5 hover:border-primary/50 transition-colors flex gap-4">
                  <div className="hidden sm:flex flex-col items-center justify-center min-w-[64px] p-2 bg-muted/50 rounded-lg text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    <span className="text-xl font-bold">{thread._count?.posts || 0}</span>
                    <span className="text-xs">{t('replies', 'ردود')}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      {thread.isPinned && <Pin className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />}
                      {hasAccepted && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors truncate">
                        {thread.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mt-2">
                      <Pill tone="blue">{thread.category}</Pill>
                      <span className="truncate font-medium text-foreground">
                        {thread.author?.firstName || 'Cluster'} {thread.author?.lastName || ''}
                      </span>
                      <span className="px-1.5 py-0.5 bg-muted rounded uppercase">
                        {thread.author?.role?.replace('_', ' ') || 'Member'}
                      </span>
                      <span>{fmtDate(locale, thread.createdAt)}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}

          {(!threads || threads.length === 0) && (
            <EmptyState
              icon={MessageSquare}
              title={t('No Discussions Found', 'لا توجد مناقشات')}
              hint={t('Be the first to start a topic in this category.', 'كن أول من يطرح موضوعاً في هذا التصنيف.')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
