import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Shared presentational building blocks for cluster modules (server-safe, no hooks). */

export type Tone = 'default' | 'green' | 'emerald' | 'amber' | 'blue' | 'purple' | 'red' | 'gray';

export function PageHeader({ icon: Icon, title, subtitle, actions, accent = 'from-primary/15' }: {
  icon?: LucideIcon; title: string; subtitle?: string; actions?: ReactNode; accent?: string;
}) {
  return (
    <div className={cn('rounded-2xl border bg-gradient-to-br to-transparent p-6 md:p-8 mb-8', accent)}>
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="rounded-xl bg-background/80 border p-3 shadow-sm">
              <Icon className="w-7 h-7 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1.5 text-muted-foreground max-w-3xl">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon, tone = 'default' }: {
  label: string; value: ReactNode; hint?: string; icon?: LucideIcon;
  tone?: Tone;
}) {
  const tones: Record<Tone, string> = {
    default: 'text-primary bg-primary/10',
    green: 'text-emerald-600 bg-emerald-500/10',
    emerald: 'text-emerald-600 bg-emerald-500/10',
    amber: 'text-amber-600 bg-amber-500/10',
    blue: 'text-sky-600 bg-sky-500/10',
    purple: 'text-violet-600 bg-violet-500/10',
    red: 'text-rose-600 bg-rose-500/10',
    gray: 'text-slate-600 bg-slate-500/10',
  };
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && <span className={cn('rounded-lg p-2', tones[tone] || tones.default)}><Icon className="w-4 h-4" /></span>}
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ProgressBar({ value, className, tone = 'bg-primary' }: { value: number; className?: string; tone?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={cn('h-2 w-full rounded-full bg-muted overflow-hidden', className)} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn('h-full rounded-full transition-all', tone)} style={{ width: `${v}%` }} />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint, action }: { icon?: LucideIcon; title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      {Icon && <Icon className="mx-auto w-10 h-10 text-muted-foreground/60" />}
      <p className="mt-3 font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function DbOfflineBanner({ locale }: { locale: string }) {
  return (
    <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
      {locale === 'ar'
        ? 'تعذّر الاتصال بقاعدة البيانات حاليًا — يتم عرض بيانات توضيحية. سيتم تفعيل البيانات الحية فور ربط قاعدة البيانات.'
        : 'The database is not reachable right now — showing illustrative data. Live data activates once the database is connected.'}
    </div>
  );
}

export function Pill({ children, className, tone = 'default' }: { children: ReactNode; className?: string; tone?: Tone }) {
  const pillTones: Record<Tone, string> = {
    default: 'bg-muted/60 text-foreground border-border',
    green: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    blue: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
    purple: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30',
    red: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    gray: 'bg-muted text-muted-foreground border-border',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', pillTones[tone] || pillTones.default, className)}>
      {children}
    </span>
  );
}
