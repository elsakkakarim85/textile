'use client';

import { useChat } from 'ai/react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AIBrainPage() {
  const t = useTranslations('AIBrain');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

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
                  <Badge variant="outline" className="cursor-pointer">{t('suggest1')}</Badge>
                  <Badge variant="outline" className="cursor-pointer">{t('suggest2')}</Badge>
                </div>
              </div>
            </div>
          )}
          
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
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
        </CardContent>

        <div className="p-4 bg-background border-t shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input 
              value={input}
              onChange={handleInputChange}
              placeholder={t('inputPlaceholder')}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>{t('send')}</Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

// Just a quick inline component to avoid import issues for this demo
function Badge({ children, className, variant }: any) {
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${className}`}>{children}</span>;
}
