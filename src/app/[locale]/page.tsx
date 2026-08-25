import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center gap-6">
      <h1 className="text-4xl font-bold text-primary">{t('title')}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl">{t('description')}</p>
      
      <div className="flex gap-4 mt-8">
        <Link href="/dashboard">
          <Button size="lg">الدخول للمنصة (Dashboard)</Button>
        </Link>
        <Link href="/about" locale="en">
          <Button variant="outline" size="lg">English</Button>
        </Link>
        <Link href="/" locale="ar">
          <Button variant="outline" size="lg">العربية</Button>
        </Link>
      </div>
    </div>
  );
}
