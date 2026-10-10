"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminSettingsPage() {
  const t = useTranslations('Admin');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings').then(res => res.json()).then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings.');
    }
    setSaving(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('settings')}</h1>
        <p className="text-muted-foreground">Global platform configurations and limits.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>Changes here apply globally to all users immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Maintenance Mode</label>
              <select 
                className="w-full bg-background border rounded px-3 py-2 text-sm"
                value={settings.maintenance_mode || 'false'}
                onChange={e => updateSetting('maintenance_mode', e.target.value)}
              >
                <option value="false">Off (Live)</option>
                <option value="true">On (Maintenance)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Factory Registrations</label>
              <select 
                className="w-full bg-background border rounded px-3 py-2 text-sm"
                value={settings.allow_new_factories || 'true'}
                onChange={e => updateSetting('allow_new_factories', e.target.value)}
              >
                <option value="true">Allowed</option>
                <option value="false">Paused</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Marketplace Commission Rate (%)</label>
              <input 
                type="number" 
                className="w-full bg-background border rounded px-3 py-2 text-sm"
                value={settings.commission_rate || '5'}
                onChange={e => updateSetting('commission_rate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">IP Blocklist (Comma-separated)</label>
              <textarea 
                className="w-full bg-background border rounded px-3 py-2 text-sm"
                rows={3}
                placeholder="192.168.1.1, 10.0.0.1"
                value={settings.ip_blocklist || ''}
                onChange={e => updateSetting('ip_blocklist', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Malicious IPs added here will be blocked from accessing the platform.</p>
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
