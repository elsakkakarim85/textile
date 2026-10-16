import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { safeQuery } from '@/server/cluster';
import { tr, fmtDate } from '@/lib/i18n-inline';
import { PageHeader, Pill, DbOfflineBanner } from '@/components/cluster/ui';
import { ForumReplySection } from '@/components/cluster/community/CommunityInteractive';
import { MessageSquare, Pin } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function ForumThreadDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { data: thread, ok } = await safeQuery(
    async () => {
      return prisma.forumThread.findUnique({
        where: { id },
        include: {
          author: { select: { firstName: true, lastName: true, role: true } },
          posts: {
            where: { deletedAt: null },
            include: { author: { select: { firstName: true, lastName: true, role: true } } },
            orderBy: [{ isAccepted: 'desc' }, { createdAt: 'asc' }],
          },
        },
      });
    },
    null
  );

  if (ok && !thread) notFound();
  if (!thread) {
    return (
      <div className="container py-8">
        <DbOfflineBanner locale={locale} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-4 text-sm">
        <Link href={`/${locale}/cluster/forum`} className="text-muted-foreground hover:underline">
          {t('Cluster Forum', 'منتدى التجمع')}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{thread.title}</span>
      </div>

      <PageHeader
        icon={MessageSquare}
        title={thread.title}
        subtitle={`${t('Posted by', 'نُشر بواسطة')} ${thread.author?.firstName || 'Member'} ${thread.author?.lastName || ''} • ${fmtDate(locale, thread.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <Pill tone="blue">{thread.category}</Pill>
            {thread.isPinned && (
              <Pill tone="amber">
                <Pin className="w-3 h-3 me-1" /> {t('Pinned', 'مثبت')}
              </Pill>
            )}
          </div>
        }
      />

      <Card className="p-6 mb-8 border-primary/20">
        <p className="whitespace-pre-wrap leading-relaxed text-base mb-4">{thread.body}</p>
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t">
            {thread.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Card>

      <ForumReplySection threadId={thread.id} posts={thread.posts || []} locale={locale} />
    </div>
  );
}
