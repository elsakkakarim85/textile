'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from '@/i18n/routing';

export default function AddWastePage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    material_type: '',
    quantity_kg: '',
    price_per_kg: '',
  });

  const handleSave = async () => {
    if (!user) {
      setMessage('يجب تسجيل الدخول أولاً');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const { error } = await supabase.from('waste_inventory').insert({
        factory_id: user.id, // Assuming the user ID is the factory ID for simplicity
        material_type: formData.material_type,
        quantity_kg: parseFloat(formData.quantity_kg),
        price_per_kg: parseFloat(formData.price_per_kg),
        is_available: true
      });

      if (error) throw error;
      setMessage('تم عرض المخلفات للبيع بنجاح!');
      // Reset form
      setFormData({ title_ar: '', title_en: '', material_type: '', quantity_kg: '', price_per_kg: '' });
    } catch (err: any) {
      console.error(err);
      setMessage('حدث خطأ أثناء الحفظ. تأكد من ربط قاعدة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>إضافة عرض بيع مخلفات نسيج (عوادم)</CardTitle>
          <CardDescription>قم بتعبئة بيانات العوادم أو المخلفات المتاحة للبيع لربطك مع مصانع إعادة التدوير.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">العنوان (عربي)</label>
            <Input 
              placeholder="مثال: عوادم قطن بيضاء" 
              value={formData.title_ar}
              onChange={e => setFormData({...formData, title_ar: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">العنوان (إنجليزي)</label>
            <Input 
              placeholder="e.g: White Cotton Waste" 
              value={formData.title_en}
              onChange={e => setFormData({...formData, title_en: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">نوع الخامة</label>
            <Input 
              placeholder="مثال: قطن 100%" 
              value={formData.material_type}
              onChange={e => setFormData({...formData, material_type: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">الكمية المتاحة (كجم)</label>
              <Input 
                type="number" 
                placeholder="500" 
                value={formData.quantity_kg}
                onChange={e => setFormData({...formData, quantity_kg: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">السعر التقديري (للكيلو)</label>
              <Input 
                type="number" 
                placeholder="20" 
                value={formData.price_per_kg}
                onChange={e => setFormData({...formData, price_per_kg: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full mt-6">
            {loading ? 'جاري النشر...' : 'نشر العرض في السوق'}
          </Button>
          {message && <p className="text-center font-bold mt-2">{message}</p>}
          
          <div className="text-center mt-4">
            <Link href="/marketplaces/waste" className="text-blue-600 hover:underline">العودة للسوق</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
