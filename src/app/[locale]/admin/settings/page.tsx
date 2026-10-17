"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tr } from '@/lib/i18n-inline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, CheckCircle2 } from 'lucide-react';

const DEFAULT_CLIENT_SETTINGS: Record<string, string> = {
  maintenance_mode: 'false',
  registration_open: 'true',
  commission_rate: '1.5',
  ai_enabled: 'true',
  ai_daily_limit: '500',
  default_currency: 'EGP',
  support_email: 'pmo@mahallacluster.eg',
  announcement:
    'EU Digital Product Passport (DPP) & Lean Six Sigma Master Black Belt Suite v2.5 Active Across All 520+ Cluster Mills.',
};

export default function AdminSettingsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_CLIENT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data === 'object' && !data.error) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedBanner(null);
    try {
      const payload = {
        maintenance_mode: settings.maintenance_mode || 'false',
        registration_open: settings.registration_open || 'true',
        commission_rate: settings.commission_rate || '1.5',
        ai_enabled: settings.ai_enabled || 'true',
        ai_daily_limit: settings.ai_daily_limit || '500',
        default_currency: settings.default_currency || 'EGP',
        support_email: settings.support_email || 'pmo@mahallacluster.eg',
        announcement: settings.announcement || '',
      };
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSavedBanner(
        t(
          'Global cluster configuration saved and synchronized across all modules.',
          'تم حفظ إعدادات المنصة وتعميمها على جميع الوحدات بنجاح.'
        )
      );
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          {t('Global Cluster Platform Settings', 'الإعدادات العامة لمنصة التجمع الصناعي')}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t(
            'Configure Smart Escrow commission rates, Multi-LLM AI quotas, factory onboarding, and global announcements.',
            'ضبط نسبة عمولة عقود الضمان، وحصص الذكاء الاصطناعي، وتسجيل المصانع، والتنبيهات العامة.'
          )}
        </p>
      </div>

      {savedBanner && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {savedBanner}
          </span>
          <button onClick={() => setSavedBanner(null)}>✕</button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">
            {t('System Parameters & AI Gateway Policy', 'معاملات التشغيل وبوابة الذكاء الاصطناعي')}
          </CardTitle>
          <CardDescription>
            {t(
              'Whitelisted configuration keys validated by Zod schema in /api/admin/settings.',
              'المفاتيح المعتمدة والمؤمنة عبر طبقة التحقق في الخادم.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold">
                {t('Maintenance Mode', 'وضع الصيانة')}
              </label>
              <select
                className="w-full bg-background border rounded-lg px-3 py-2 text-xs font-semibold"
                value={settings.maintenance_mode || 'false'}
                onChange={(e) => updateSetting('maintenance_mode', e.target.value)}
              >
                <option value="false">{t('Off (Platform Live 24/7)', 'مغلق (المنصة تعمل 24/7)')}</option>
                <option value="true">{t('On (Maintenance Window)', 'مفعل (نافذة صيانة)')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold">
                {t('New Factory & Buyer Registrations', 'تسجيل المصانع والمشترين الجدد')}
              </label>
              <select
                className="w-full bg-background border rounded-lg px-3 py-2 text-xs font-semibold"
                value={settings.registration_open || 'true'}
                onChange={(e) => updateSetting('registration_open', e.target.value)}
              >
                <option value="true">{t('Open (Auto KYC Queue)', 'مفتوح (مع فحص KYC)')}</option>
                <option value="false">{t('Paused (Invite Only)', 'متوقف مؤقتاً')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold">
                {t('Smart Escrow Commission Rate (%)', 'نسبة عمولة عقود الضمان الذكية (%)')}
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full bg-background border rounded-lg px-3 py-2 text-xs"
                value={settings.commission_rate || '1.5'}
                onChange={(e) => updateSetting('commission_rate', e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold">
                {t('Default Cluster Currency', 'العملة الافتراضية للمنصة')}
              </label>
              <select
                className="w-full bg-background border rounded-lg px-3 py-2 text-xs font-semibold"
                value={settings.default_currency || 'EGP'}
                onChange={(e) => updateSetting('default_currency', e.target.value)}
              >
                <option value="EGP">EGP (ج.م)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold">
                {t('Multi-Provider Free AI Gateway', 'بوابة الذكاء الاصطناعي المجانية المتعددة')}
              </label>
              <select
                className="w-full bg-background border rounded-lg px-3 py-2 text-xs font-semibold"
                value={settings.ai_enabled || 'true'}
                onChange={(e) => updateSetting('ai_enabled', e.target.value)}
              >
                <option value="true">{t('Enabled (Groq / Gemini / OpenRouter / Pollinations)', 'مفعلة بكامل النماذج')}</option>
                <option value="false">{t('Deterministic Fallback Only', 'الوضع الهندسي القياسي فقط')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold">
                {t('Daily AI Generation Quota per User', 'الحد اليومي لطلبات الذكاء الاصطناعي للمستخدم')}
              </label>
              <input
                type="number"
                className="w-full bg-background border rounded-lg px-3 py-2 text-xs"
                value={settings.ai_daily_limit || '500'}
                onChange={(e) => updateSetting('ai_daily_limit', e.target.value)}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold">
                {t('PMO Technical Support Email', 'البريد الرسمي للدعم الفني وإدارة التجمع')}
              </label>
              <input
                type="email"
                className="w-full bg-background border rounded-lg px-3 py-2 text-xs"
                value={settings.support_email || 'pmo@mahallacluster.eg'}
                onChange={(e) => updateSetting('support_email', e.target.value)}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold">
                {t('Global Cluster Banner Announcement', 'الإعلان العام أعلى المنصة')}
              </label>
              <textarea
                rows={2}
                className="w-full bg-background border rounded-lg px-3 py-2 text-xs"
                value={settings.announcement || ''}
                onChange={(e) => updateSetting('announcement', e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                {saving ? t('Saving Configuration...', 'جاري الحفظ...') : t('Save Global Settings', 'حفظ الإعدادات العامة')}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
