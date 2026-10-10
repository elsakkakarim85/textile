'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FactoryForm() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    phone: '',
  });

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.from('factories').upsert({
        id: user.id, // Using Clerk user ID as factory ID for simplicity
        owner_id: user.id,
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        contact_info: { phone: formData.phone },
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      setMessage('تم حفظ البيانات بنجاح!');
    } catch (err: any) {
      console.error(err);
      setMessage('حدث خطأ أثناء الحفظ. (تأكد من إعداد مفاتيح Supabase)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>البيانات الأساسية للمصنع</CardTitle>
        <CardDescription>هذه البيانات ستظهر في ملفك التعريفي (Profile) للجمهور.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">اسم المصنع (عربي)</label>
          <Input 
            value={formData.name_ar} 
            onChange={(e) => setFormData({...formData, name_ar: e.target.value})} 
            placeholder="مثال: مصنع النور للنسيج" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">اسم المصنع (إنجليزي)</label>
          <Input 
            value={formData.name_en} 
            onChange={(e) => setFormData({...formData, name_en: e.target.value})} 
            placeholder="e.g: Al Nour Textiles" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">رقم التواصل</label>
          <Input 
            value={formData.phone} 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            placeholder="01xxxxxxxxx" 
          />
        </div>
        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? 'جاري الحفظ...' : 'حفظ بيانات المصنع'}
        </Button>
        {message && <p className="text-sm text-center mt-2 font-bold">{message}</p>}
      </CardContent>
    </Card>
  );
}
