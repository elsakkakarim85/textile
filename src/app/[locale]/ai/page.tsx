// @ts-nocheck
'use client';
import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';

function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default', suppressErrorRendering: true });
    let isCancelled = false;
    
    async function drawChart() {
      if (!chart || !chart.trim()) return;
      const id = 'mermaid-chart-' + Math.random().toString(36).substring(7);
      try {
        await mermaid.parse(chart, { suppressErrors: true });
        if (isCancelled) return;
        const { svg } = await mermaid.render(id, chart);
        if (!isCancelled && ref.current) {
          ref.current.innerHTML = svg;
          setHasError(false);
        }
      } catch (e) {
        if (!isCancelled) setHasError(true);
        setTimeout(() => document.querySelectorAll('svg[id^="dmermaid-chart-"]').forEach(el => el.remove()), 50);
      }
    }
    drawChart();
    return () => { isCancelled = true; };
  }, [chart]);

  if (hasError) {
    return (
      <div className="my-4 bg-muted/50 border border-red-200 p-4 rounded-lg text-sm font-mono text-muted-foreground" dir="ltr">
        <div className="text-red-500 mb-2 font-sans font-semibold" dir="rtl">⚠️ خطأ في رسم المخطط:</div>
        <pre>{chart}</pre>
      </div>
    );
  }
  return <div ref={ref} className="flex justify-center my-4 bg-white p-4 rounded-lg text-black" />;
}

const MarkdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match && match[1] === 'mermaid') {
      const chartText = Array.isArray(children) ? children.join('') : String(children || '');
      return <Mermaid chart={chartText.replace(/\n$/, '')} />;
    }
    return <code className={className} {...props}>{children}</code>;
  }
};

export default function AIBrainPage() {
  const t = useTranslations('AIBrain');
  const [messages, setMessages] = useState<{id: string, role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const newMsg = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      
      if (data.text) {
        setMessages([...newMessages, { id: Date.now().toString(), role: 'assistant', content: data.text }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred');
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-4 h-[calc(100vh-100px)] flex flex-col gap-6">
      <div className="text-center shrink-0">
        <h1 className="text-3xl font-bold text-primary">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{t('description')}</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden shadow-lg border-primary/20">
        <CardHeader className="bg-muted/50 shrink-0">
          <CardTitle className="text-lg">{t('chatWithData')}</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center text-muted-foreground text-center">
              <div>
                <p className="mb-4">{t('emptyState')}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full border">{t('suggest1')}</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full border">{t('suggest2')}</span>
                </div>
              </div>
            </div>
          )}
          
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted w-full'}`}>
                <div className={m.role === 'user' ? 'whitespace-pre-wrap' : ''}>
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                    <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted max-w-[80%] rounded-lg p-4 animate-pulse">
                {t('thinking')}
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-start">
              <div className="bg-red-100 text-red-700 max-w-[80%] rounded-lg p-4 border border-red-300">
                حدث خطأ أثناء الاتصال: {error}
              </div>
            </div>
          )}
        </CardContent>

        <div className="p-4 bg-background border-t shrink-0">
          <form onSubmit={onSubmit} className="flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
              className="flex-1 h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>{t('send')}</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
