'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { BrainCircuit, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function KnowledgeBasePage() {
  const [sourceName, setSourceName] = useState('');
  const [text, setText] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message?: string }>({ type: 'idle' });

  const handleIngest = async () => {
    if (!text || !sourceName) return;
    
    setIsIngesting(true);
    setStatus({ type: 'idle' });

    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceName }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: `تم استيعاب البيانات بنجاح! الذكاء الاصطناعي تعلم الآن من ${data.chunksProcessed} فقرة جديدة.` });
        setText('');
        setSourceName('');
      } else {
        setStatus({ type: 'error', message: data.error || 'حدث خطأ أثناء رفع البيانات' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'فشل الاتصال بالخادم.' });
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <BrainCircuit className="w-16 h-16 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">توطين وتدريب العقل الاصطناعي (AI Knowledge Base)</h1>
        <p className="text-muted-foreground max-w-2xl">
          هنا يمكنك تغذية المستشار الذكي ببيانات مصنعك، القوانين الجديدة، أو أبحاث النسيج. 
          سيقوم النظام بقراءة هذه النصوص، استيعابها، واستخدامها للرد على أي استفسارات مستقبلية بذكاء شديد ومجاناً 100%.
        </p>
      </div>

      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-primary" />
            إضافة مصدر معرفة جديد
          </CardTitle>
          <CardDescription>قم بلصق محتوى الكتالوج، اللوائح، أو المواصفات الفنية هنا</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">اسم المصدر / المرجع</label>
            <Input 
              placeholder="مثال: مواصفات القطن المصري 2024" 
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              disabled={isIngesting}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">النص أو المحتوى</label>
            <textarea 
              placeholder="انسخ والصق النصوص هنا (كلما كان النص أطول، زادت معرفة الذكاء الاصطناعي)..." 
              className="flex min-h-[250px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isIngesting}
            />
          </div>
          
          {status.type === 'success' && (
            <div className="p-4 bg-green-50 text-green-700 flex items-center gap-2 rounded-md">
              <CheckCircle2 className="w-5 h-5" />
              {status.message}
            </div>
          )}
          
          {status.type === 'error' && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {status.message}
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handleIngest} 
            disabled={isIngesting || !text || !sourceName}
          >
            {isIngesting ? 'جاري تحليل النص وحقنه في عقل الذكاء الاصطناعي...' : 'تدريب الذكاء الاصطناعي (Ingest Data)'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
