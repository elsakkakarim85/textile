"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { tr } from '@/lib/i18n-inline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, MessageSquare, CheckCircle2, CalendarPlus, UserCheck, Megaphone, Sparkles } from 'lucide-react';

export function ForumNewThreadForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('TECHNICAL');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('Dyeing, Quality');

  const handleAiDraftQuestion = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'forum_thread',
          context: { category, hint: title },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields) {
        setTitle(data.fields.title || title);
        setBody(data.fields.body || body);
        setTags(data.fields.tags || tags);
      }
    } catch {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const created: any = await api('/api/cluster/forum', 'POST', {
        title,
        category,
        body,
        tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setOpen(false);
      if (created?.id) {
        router.push(`/${locale}/cluster/forum/${created.id}`);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button className="w-full justify-start" size="lg" onClick={() => setOpen(true)}>
        <Plus className="w-5 h-5 me-2" />
        {t('New Discussion', 'بدء مناقشة جديدة')}
      </Button>
    );
  }

  return (
    <Card className="p-4 border-primary/30 space-y-3">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h4 className="font-bold text-sm">{t('Start New Discussion', 'موضوع نقاش جديد')}</h4>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAiDraftQuestion}
            disabled={aiLoading}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            {aiLoading ? t('AI Drafting...', 'جاري الصياغة...') : t('✨ AI Structure Question', '✨ صياغة فنية بالذكاء الاصطناعي')}
          </button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            {t('Cancel', 'إلغاء')}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="block font-medium mb-1">{t('Question or Topic Title', 'عنوان السؤال أو الموضوع')}</label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('Min 5 chars...', '٥ أحرف على الأقل...')} />
        </div>
        <div>
          <label className="block font-medium mb-1">{t('Category', 'التصنيف')}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-9 rounded-md border bg-background px-2.5 text-sm"
          >
            <option value="TECHNICAL">TECHNICAL</option>
            <option value="MARKET">MARKET</option>
            <option value="SUSTAINABILITY">SUSTAINABILITY</option>
            <option value="POLICY">POLICY</option>
            <option value="JOBS">JOBS</option>
            <option value="GENERAL">GENERAL</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">{t('Details', 'التفاصيل')}</label>
          <textarea
            required
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-md border bg-background p-2.5 text-xs"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">{t('Tags (comma separated)', 'الوسوم (مفصولة بفاصلة)')}</label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <Button type="submit" size="sm" className="w-full" disabled={loading}>
          {loading ? t('Posting...', 'جاري النشر...') : t('Publish Topic', 'نشر الموضوع')}
        </Button>
      </form>
    </Card>
  );
}

export function ForumReplySection({
  threadId,
  posts,
  locale,
}: {
  threadId: string;
  posts: any[];
  locale: string;
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleAiDraftSolution = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'forum_reply',
          context: { threadId },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields?.body) {
        setBody(data.fields.body);
      }
    } catch {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api(`/api/cluster/forum/${threadId}/posts`, 'POST', { body });
      setBody('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccepted = async (postId: string, accept: boolean) => {
    setLoading(true);
    try {
      await api(`/api/cluster/forum/${threadId}/posts`, 'PATCH', { postId, accept });
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-lg">
          {posts.length} {t('Answers & Replies', 'الردود والإجابات الفنية')}
        </h3>
        {posts.map((post: any) => (
          <Card
            key={post.id}
            className={`p-5 ${
              post.isAccepted ? 'border-emerald-500/50 bg-emerald-500/5' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold">
                  {post.author?.firstName || 'Cluster'} {post.author?.lastName || 'Member'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted uppercase">
                  {post.author?.role?.replace('_', ' ') || 'Member'}
                </span>
                {post.isAccepted && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('Accepted Technical Solution', 'الحل الفني المعتمد')}
                  </span>
                )}
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() => toggleAccepted(post.id, !post.isAccepted)}
                className="text-xs text-primary hover:underline"
              >
                {post.isAccepted ? t('Unmark Solution', 'إلغاء الاعتماد') : t('Mark as Solution ✓', 'اعتماد كحل ✓')}
              </button>
            </div>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.body}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 border-primary/20">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="font-bold">{t('Post Your Answer or Technical Advice', 'أضف إجابتك أو نصيحتك الفنية')}</h4>
          <Button
            type="button"
            size="sm"
            onClick={handleAiDraftSolution}
            disabled={aiLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {aiLoading
              ? t('AI Synthesizing Engineering Answer...', 'جاري توليد الحل الهندسي بالذكاء الاصطناعي...')
              : t('✨ AI Draft Engineering Solution (ISO/UNIDO)', '✨ صياغة حل هندسي بالذكاء الاصطناعي (ISO/UNIDO)')}
          </Button>
        </div>
        <form onSubmit={handleReply} className="space-y-3">
          <textarea
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t('Share your experience, machine parameters, or supplier recommendation...', 'شارك خبرتك العملية أو توصياتك الفنية...')}
            className="w-full rounded-md border bg-background p-3 text-sm"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? t('Posting...', 'جاري الإرسال...') : t('Post Reply', 'نشر الرد')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function EventActionButtons({
  event,
  isRegistered,
  isFull,
  locale,
}: {
  event: any;
  isRegistered: boolean;
  isFull: boolean;
  locale: string;
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (isRegistered) {
        await api(`/api/cluster/events/${event.id}/register`, 'DELETE');
      } else {
        await api(`/api/cluster/events/${event.id}/register`, 'POST', {});
      }
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-auto border-t pt-4 flex items-center gap-2">
      {isRegistered ? (
        <Button
          variant="outline"
          className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          onClick={handleToggle}
          disabled={loading}
        >
          {loading ? '...' : t('Registered ✓ (Cancel)', 'مسجل ✓ (إلغاء)')}
        </Button>
      ) : isFull ? (
        <Button variant="outline" className="flex-1" disabled>
          {t('Fully Booked', 'مكتمل العدد')}
        </Button>
      ) : (
        <Button className="flex-1" onClick={handleToggle} disabled={loading}>
          <CalendarPlus className="w-4 h-4 me-1.5" />
          {loading ? t('Registering...', 'جاري التسجيل...') : t('Register Seat', 'تسجيل حضور')}
        </Button>
      )}
    </div>
  );
}

export function ExpertRequestModal({
  expert,
  locale,
}: {
  expert: any;
  locale: string;
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');

  const handleAiDraftRequest = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'expert_request',
          context: { expertName: expert.displayName || 'Expert', headline: expert.headline },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields) {
        setTopic(data.fields.topic || topic);
        setMessage(data.fields.message || message);
      }
    } catch {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api(`/api/cluster/experts/${expert.id}/request`, 'POST', {
        topic,
        message,
      });
      setSent(true);
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Button variant="outline" className="w-full border-emerald-500 text-emerald-600" disabled>
        <CheckCircle2 className="w-4 h-4 me-2" />
        {t('Mentorship Request Sent ✓', 'تم إرسال طلب الاستشارة ✓')}
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Button
        className="w-full"
        variant={open ? 'secondary' : 'default'}
        disabled={!expert.isMentor && !expert.isAvailableForMentorship}
        onClick={() => setOpen((o) => !o)}
      >
        <MessageSquare className="w-4 h-4 me-2" />
        {open ? t('Cancel', 'إلغاء') : t('Request Consultation / Mentorship', 'طلب استشارة فنية / توجيه')}
      </Button>
      {open && (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-muted/30 p-3.5 space-y-2.5 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-medium">{t('Consultation Topic', 'موضوع الاستشارة')}</label>
              <button
                type="button"
                onClick={handleAiDraftRequest}
                disabled={aiLoading}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                {aiLoading ? t('AI Drafting...', 'جاري الصياغة...') : t('✨ AI Draft TOR', '✨ صياغة بالذكاء الاصطناعي')}
              </button>
            </div>
            <Input
              required
              placeholder={t('e.g. Reactive dyeing shade consistency / CBAM audit', 'مثال: ضبط ثبات الألوان / تدقيق CBAM')}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">{t('Factory Challenge & Preferred Timing', 'التحدي الفني والموعد المفضل')}</label>
            <textarea
              required
              rows={2}
              className="w-full rounded-md border bg-background p-2 text-xs"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" className="w-full" disabled={loading}>
            {loading ? t('Sending...', 'جاري الإرسال...') : t('Send Request', 'إرسال الطلب')}
          </Button>
        </form>
      )}
    </div>
  );
}

export function BecomeExpertModal({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('Spinning, Lean Manufacturing, ISO 9001');
  const [yearsExp, setYearsExp] = useState('15');
  const [hourlyRate, setHourlyRate] = useState('0');

  const handleAiPolishProfile = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'expert_profile',
          context: { displayName, headline, expertise },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields) {
        setHeadline(data.fields.headline || headline);
        setExpertise(data.fields.expertise || expertise);
        setBio(data.fields.bio || bio);
      }
    } catch {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api('/api/cluster/experts', 'POST', {
        displayName,
        headline,
        bio,
        expertise: expertise.split(',').map((s) => s.trim()).filter(Boolean),
        yearsExp: Number(yearsExp),
        languages: ['Arabic', 'English'],
        isMentor: true,
        hourlyRate: Number(hourlyRate),
      });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <UserCheck className="w-4 h-4 me-2" />
        {t('Register as Cluster Expert', 'التسجيل كخبير بالتجمع')}
      </Button>
    );
  }

  return (
    <Card className="p-6 mb-8 border-primary/30 w-full">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h3 className="font-bold">{t('Register Expert / Consultant Profile', 'تسجيل ملف خبير / استشاري صناعي')}</h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleAiPolishProfile}
            disabled={aiLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {aiLoading ? t('AI Polishing...', 'جاري التحسين...') : t('✨ AI Polish Bio & Specialties', '✨ تحسين السيرة والخبرات بالذكاء الاصطناعي')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            {t('Cancel', 'إلغاء')}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-medium mb-1">{t('Full Name & Title', 'الاسم الكامل واللقب')}</label>
          <Input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Eng. Tarek El-Sayed" />
        </div>
        <div>
          <label className="block font-medium mb-1">{t('Professional Headline', 'التخصص الرئيسي')}</label>
          <Input required value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Senior Weaving & OEE Consultant" />
        </div>
        <div>
          <label className="block font-medium mb-1">{t('Specialties (comma separated)', 'المهارات (مفصولة بفاصلة)')}</label>
          <Input required value={expertise} onChange={(e) => setExpertise(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block font-medium mb-1">{t('Years Exp.', 'سنوات الخبرة')}</label>
            <Input type="number" min="1" required value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">{t('Hourly Rate (EGP, 0=Pro Bono)', 'سعر الساعة (٠ = مجاني)')}</label>
            <Input type="number" min="0" required value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block font-medium mb-1">{t('Bio & Track Record', 'نبذة عن الخبرة وسابقة الأعمال')}</label>
          <textarea
            required
            rows={2}
            className="w-full rounded-md border bg-background p-2.5 text-xs"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? t('Saving...', 'جاري الحفظ...') : t('Publish Expert Profile', 'نشر ملف الخبير')}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function AnnouncementComposer({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [body, setBody] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [isPinned, setIsPinned] = useState(true);

  const handleAiDraftBulletin = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'announcement',
          context: { hint: title || titleAr },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields) {
        setTitle(data.fields.title || title);
        setTitleAr(data.fields.titleAr || titleAr);
        setBody(data.fields.body || body);
        setBodyAr(data.fields.bodyAr || bodyAr);
      }
    } catch {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api('/api/cluster/announcements', 'POST', {
        title,
        titleAr: titleAr || title,
        body,
        bodyAr: bodyAr || body,
        audience: 'ALL',
        isPinned,
      });
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Megaphone className="w-4 h-4 me-2" />
        {t('Broadcast Official Bulletin', 'نشر تعميم رسمي جديد')}
      </Button>
    );
  }

  return (
    <Card className="p-5 mb-6 border-primary/30">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <h3 className="font-bold text-sm">{t('Broadcast Cluster Bulletin (CMO)', 'نشر تعميم رسمي من إدارة التجمع')}</h3>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleAiDraftBulletin}
            disabled={aiLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {aiLoading
              ? t('AI Translating & Drafting...', 'جاري الصياغة باللغتين...')
              : t('✨ AI Draft Bilingual EN+AR Bulletin', '✨ صياغة التعميم باللغتين بالذكاء الاصطناعي')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            {t('Cancel', 'إلغاء')}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium mb-1">Title (English)</label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block font-medium mb-1">العنوان (بالعربية)</label>
            <Input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium mb-1">Announcement Body (English)</label>
            <textarea
              required
              rows={2}
              className="w-full rounded-md border bg-background p-2 text-xs"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">نص الإعلان (بالعربية)</label>
            <textarea
              rows={2}
              className="w-full rounded-md border bg-background p-2 text-xs"
              value={bodyAr}
              onChange={(e) => setBodyAr(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
            <span>{t('Pin to top of bulletin board', 'تثبيت في أعلى لوحة الإعلانات')}</span>
          </label>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? t('Publishing...', 'جاري النشر...') : t('Publish Bulletin', 'نشر التعميم')}
          </Button>
        </div>
      </form>
    </Card>
  );
}

