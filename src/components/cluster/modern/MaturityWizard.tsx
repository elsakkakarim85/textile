"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DIMENSIONS, QUESTIONS, Dimension } from '@/server/modernization/maturity';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import { ProgressBar } from '@/components/cluster/ui';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { tr, isRTL } from '@/lib/i18n-inline';

export default function MaturityWizard({ locale }: { locale: string }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentDimIdx, setCurrentDimIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const currentDim = DIMENSIONS[currentDimIdx];
  const currentQuestions = QUESTIONS.filter((q) => q.dimension === currentDim.id);
  const rtl = isRTL(locale);
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const canProceed = currentQuestions.every((q) => answers[q.id] !== undefined);
  const isLast = currentDimIdx === DIMENSIONS.length - 1;
  const progress = Math.round((currentDimIdx / DIMENSIONS.length) * 100);

  const nextStep = async () => {
    if (!isLast) {
      setCurrentDimIdx(currentDimIdx + 1);
      window.scrollTo(0, 0);
    } else {
      setSubmitting(true);
      try {
        const res = await api<any>('/api/cluster/maturity', 'POST', answers);
        router.push(`/${locale}/cluster/maturity/${res.id}`);
        router.refresh();
      } catch (err: any) {
        alert(err.message);
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium mb-2 text-muted-foreground">
          <span>{t(currentDim.en, currentDim.ar)}</span>
          <span>{currentDimIdx + 1} / {DIMENSIONS.length}</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="space-y-8">
        {currentQuestions.map((q) => (
          <Card key={q.id} className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t(q.questionEn, q.questionAr)}</h3>
            <div className="space-y-3">
              {(locale === 'ar' ? q.optionsAr : q.optionsEn).map((opt, i) => {
                const selected = answers[q.id] === i;
                return (
                  <label
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      selected ? 'bg-primary/5 border-primary shadow-sm' : 'hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={selected}
                      onChange={() => setAnswers({ ...answers, [q.id]: i })}
                      className="w-4 h-4 text-primary focus:ring-primary border-muted-foreground"
                    />
                    <span className={`text-sm md:text-base ${selected ? 'font-medium text-primary' : ''}`}>
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentDimIdx(Math.max(0, currentDimIdx - 1))}
          disabled={currentDimIdx === 0 || submitting}
        >
          {rtl ? <ChevronRight className="w-4 h-4 me-2" /> : <ChevronLeft className="w-4 h-4 me-2" />}
          {t('Back', 'السابق')}
        </Button>
        <Button onClick={nextStep} disabled={!canProceed || submitting}>
          {submitting ? t('Saving...', 'جاري الحفظ...') : isLast ? t('View Results', 'عرض النتائج') : t('Next', 'التالي')}
          {!submitting && !isLast && (rtl ? <ChevronLeft className="w-4 h-4 ms-2" /> : <ChevronRight className="w-4 h-4 ms-2" />)}
        </Button>
      </div>
    </div>
  );
}
