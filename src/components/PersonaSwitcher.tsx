"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ChevronDown, Check, Sparkles } from 'lucide-react';
import { tr } from '@/lib/i18n-inline';
import { ExpertManualButton } from '@/components/cluster/ExpertManualModal';

interface PersonaItem {
  id: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  factory?: { id: string; name: string } | null;
}

export function PersonaSwitcher({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [activeLabel, setActiveLabel] = useState<string>('');
  const [personas, setPersonas] = useState<PersonaItem[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/cluster/persona')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted || !data?.personas) return;
        setPersonas(data.personas);
        if (data.activeUser) {
          setActiveId(data.activeUser.id);
          const facName = data.activeFactory?.name;
          const userName = `${data.activeUser.firstName || ''} ${data.activeUser.lastName || ''}`.trim();
          setActiveLabel(facName || userName || 'Cluster Member');
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const switchPersona = async (p: PersonaItem) => {
    setLoading(true);
    setOpen(false);
    try {
      await fetch('/api/cluster/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: p.id }),
      });
      setActiveId(p.id);
      setActiveLabel(p.factory?.name || `${p.firstName || ''} ${p.lastName || ''}`.trim());
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  if (personas.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/5 px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer shrink-0"
        title={`${t('Active Workspace', 'الحساب النشط')}: ${activeLabel || t('Select Workspace', 'اختر الحساب')}`}
      >
        <Building2 className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden 2xl:inline truncate max-w-[110px]">
          {activeLabel || t('Workspace', 'الحساب')}
        </span>
        <ChevronDown className="w-3 h-3 shrink-0 opacity-70" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute end-0 mt-2 w-72 rounded-xl border bg-card p-2 shadow-xl z-50">
            <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between gap-1.5 border-b mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {t('Active Workspace / Persona', 'مساحة العمل / الدور النشط')}
              </span>
              <ExpertManualButton manualId="gadget-persona-switcher" locale={locale} variant="icon" />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {personas.map((p) => {
                const isSelected = p.id === activeId;
                const name = `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.role;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => switchPersona(p)}
                    className={`w-full text-start px-2.5 py-2 rounded-lg text-xs flex items-start justify-between gap-2 transition-colors ${
                      isSelected ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {p.factory ? p.factory.name : name}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {name} • <span className="uppercase">{p.role.replace('_', ' ')}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-primary mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
