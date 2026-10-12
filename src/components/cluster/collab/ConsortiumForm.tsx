"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tr } from '@/lib/i18n-inline';
import { Plus } from 'lucide-react';

export function ConsortiumForm({ locale }: { locale: string }) {
  const router = useRouter();
  const t = (en: string, ar: string) => tr(locale, en, ar);
  
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetMarket: '',
    leadRole: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api('/api/cluster/consortia', 'POST', formData);
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 me-2" />
        {t('Form a Consortium', 'تشكيل تحالف')}
      </Button>
    );
  }

  return (
    <Card className="p-6 mb-8 border-primary/20 bg-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">{t('New Consortium', 'تحالف جديد')}</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>{t('Cancel', 'إلغاء')}</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">{t('Consortium Name', 'اسم التحالف')}</label>
            <Input required minLength={5} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">{t('Description & Goals', 'الوصف والأهداف')}</label>
            <textarea 
              required
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Target Market (e.g. EU Export)', 'السوق المستهدف')}</label>
            <Input value={formData.targetMarket} onChange={e => setFormData({...formData, targetMarket: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('Your Role (Lead)', 'دورك (القائد)')}</label>
            <Input required placeholder={t('e.g. Final Assembly & QA', 'مثال: التجميع النهائي والجودة')} value={formData.leadRole} onChange={e => setFormData({...formData, leadRole: e.target.value})} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={loading}>{loading ? t('Creating...', 'جاري الإنشاء...') : t('Create', 'إنشاء')}</Button>
        </div>
      </form>
    </Card>
  );
}
