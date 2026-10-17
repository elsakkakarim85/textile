"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { tr, fmtMoney, fmtDate } from '@/lib/i18n-inline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, CheckCircle2, Sparkles } from 'lucide-react';

export function FacilityBookForm({
  facility,
  locale,
}: {
  facility: any;
  locale: string;
}) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [date, setDate] = useState(tomorrow);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');
  const [purpose, setPurpose] = useState('');

  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);
  const hours = Math.max(0, (endDateTime.getTime() - startDateTime.getTime()) / 3600000);
  const estimatedCost = Math.round(hours * Number(facility.ratePerHour || 0));

  const handleAiSuggestProtocol = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cluster/ai-autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'facility_booking',
          context: { facilityName: facility.name, facilityType: facility.type },
          locale,
        }),
      });
      const data = await res.json();
      if (data?.fields?.purpose) {
        setPurpose(data.fields.purpose);
      }
    } catch {
      // ignore
    } finally {
      setAiLoading(false);
    }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api(`/api/cluster/facilities/${facility.id}/bookings`, 'POST', {
        startAt: startDateTime.toISOString(),
        endAt: endDateTime.toISOString(),
        purpose,
      });
      setOpen(false);
      setPurpose('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-auto border-t pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-primary" />
          {facility._count?.bookings || 0} {t('upcoming bookings', 'حجوزات مؤكدة')}
        </span>
        <Button size="sm" variant={open ? 'secondary' : 'default'} onClick={() => setOpen((o) => !o)}>
          <Calendar className="w-3.5 h-3.5 me-1.5" />
          {open ? t('Cancel', 'إلغاء') : t('Book Slot', 'احجز موعداً')}
        </Button>
      </div>

      {open && (
        <form onSubmit={handleBook} className="rounded-xl border bg-muted/30 p-3.5 space-y-3 text-xs">
          <div>
            <label className="block font-medium mb-1">{t('Date', 'التاريخ')}</label>
            <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-medium mb-1">{t('Start Time', 'وقت البدء')}</label>
              <Input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">{t('End Time', 'وقت الانتهاء')}</label>
              <Input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-medium">{t('Testing / Usage Purpose', 'الغرض من الحجز أو الاختبار')}</label>
              <button
                type="button"
                onClick={handleAiSuggestProtocol}
                disabled={aiLoading}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                {aiLoading ? t('AI Drafting...', 'جاري التوليد...') : t('✨ AI Suggest ISO Protocol', '✨ اقتراح اختبارات ISO بالذكاء الاصطناعي')}
              </button>
            </div>
            <Input
              required
              placeholder={t('e.g. ISO 105 Color Fastness & Yarn Tensile Test', 'مثال: اختبار ثبات اللون وشد الخيوط')}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-muted-foreground">{t('Est. Cost:', 'التكلفة التقديرية:')} </span>
              <strong className="text-primary text-sm">{fmtMoney(locale, estimatedCost, facility.currency)}</strong>
              <span className="text-muted-foreground ms-1">({hours.toFixed(1)}h)</span>
            </div>
            <Button type="submit" size="sm" disabled={loading || hours <= 0}>
              {loading ? t('Booking...', 'جاري الحجز...') : t('Confirm Booking', 'تأكيد الحجز')}
            </Button>
          </div>
        </form>
      )}

      {facility.bookings && facility.bookings.length > 0 && (
        <div className="space-y-1.5 pt-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t('Recent & Upcoming Slots', 'المواعيد المحجوزة')}
          </div>
          {facility.bookings.slice(0, 3).map((b: any) => (
            <div key={b.id} className="flex items-center justify-between text-xs bg-muted/30 px-2.5 py-1.5 rounded-md">
              <span className="truncate font-medium">
                {b.factory?.name || t('Cluster Member', 'عضو بالتجمع')} — {b.purpose}
              </span>
              <span className="text-emerald-600 font-medium inline-flex items-center gap-1 shrink-0 ms-2">
                <CheckCircle2 className="w-3 h-3" /> {fmtDate(locale, b.startAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
