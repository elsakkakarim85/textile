import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center px-4">
      <h1 className="text-8xl font-bold text-primary opacity-20">404</h1>
      <h2 className="text-2xl font-semibold">الصفحة غير موجودة</h2>
      <p className="text-muted-foreground max-w-md">
        عذراً، يبدو أنك تبحث عن صفحة غير موجودة أو تم نقلها. يرجى التأكد من الرابط أو العودة للرئيسية.
      </p>
      <Link href="/dashboard">
        <Button size="lg">العودة للرئيسية</Button>
      </Link>
    </div>
  )
}
