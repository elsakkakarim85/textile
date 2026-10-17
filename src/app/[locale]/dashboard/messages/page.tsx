"use client";

import useSWR from 'swr';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send, Building2, Sparkles } from 'lucide-react';
import { tr } from '@/lib/i18n-inline';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MessagesPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const t = (en: string, ar: string) => tr(locale, en, ar);

  const { user } = useUser();
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<Record<string, any[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: personaData } = useSWR('/api/cluster/persona', fetcher);
  const currentUserId = personaData?.activeUser?.id || user?.id || 'demo-owner-1';

  const { data: rawConvos, mutate: mutateConvos } = useSWR('/api/messages', fetcher, {
    refreshInterval: 5000,
  });
  const conversations = Array.isArray(rawConvos) ? rawConvos : [];

  useEffect(() => {
    if (!activeConvo && conversations.length > 0) {
      setActiveConvo(conversations[0]);
    }
  }, [conversations, activeConvo]);

  const { data: rawMessages, mutate: mutateMessages } = useSWR(
    activeConvo ? `/api/messages?conversationId=${activeConvo.id}` : null,
    fetcher,
    { refreshInterval: 4000 }
  );
  const serverMessages = Array.isArray(rawMessages) ? rawMessages : [];
  const appended = activeConvo ? localMessages[activeConvo.id] || [] : [];
  const messages = [...serverMessages, ...appended];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const smartReplies = [
    t(
      'We can dispatch spectrophotometer lab-dips & 300 TC GSM swatches via DHL within 48 hours.',
      'يمكننا إرسال عينات المختبر (Lab-Dips) وعينات القماش 300 غرزة عبر DHL خلال 48 ساعة.'
    ),
    t(
      'Confirmed: 30/40/30 CBE Smart Escrow terms (FOB Alexandria) with full EU DPP QR codes.',
      'موافقون على شروط عقد الضمان البنكي الذكي (30/40/30) تسليم FOB الإسكندرية مع جواز المنتج الأوروبي.'
    ),
    t(
      'Attached: OEKO-TEX® Standard 100, ZDHC MRSL v3.1, and Uster® 5% yarn test certificates.',
      'مرفق شهادات الأيكوتكس 100، ومطابقة ZDHC v3.1، وتقرير فحص الغزل Uster 5%.'
    ),
  ];

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvo) return;

    const tempMessage = {
      id: String(Date.now()),
      senderId: currentUserId,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };
    const convoId = activeConvo.id;
    setNewMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convoId,
          content: tempMessage.content,
        }),
      });
      if (res.ok) {
        mutateMessages();
        mutateConvos();
      } else {
        setLocalMessages((prev) => ({
          ...prev,
          [convoId]: [...(prev[convoId] || []), tempMessage],
        }));
      }
    } catch {
      setLocalMessages((prev) => ({
        ...prev,
        [convoId]: [...(prev[convoId] || []), tempMessage],
      }));
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 h-[82vh]">
      {/* Conversations List */}
      <Card className="w-full md:w-1/3 flex flex-col h-full">
        <div className="p-4 border-b font-bold text-base md:text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            {t('B2B Trade Inbox', 'صندوق المفاوضات التجارية (B2B)')}
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {conversations.length} {t('threads', 'محادثات')}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {conversations.map((c: any) => {
            const isBuyer = currentUserId === c.buyerId;
            const title = isBuyer
              ? c.factory?.name || t('Factory', 'المصنع')
              : `${c.buyer?.firstName || 'Buyer'} ${c.buyer?.lastName || ''} ↔ ${c.factory?.name || ''}`;
            return (
              <div
                key={c.id}
                onClick={() => setActiveConvo(c)}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                  activeConvo?.id === c.id
                    ? 'bg-emerald-500/10 border-emerald-500/40 border'
                    : 'hover:bg-muted border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-sm truncate">{title}</p>
                  {c.unreadCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {c.messages?.[0]?.content || t('Start a B2B negotiation', 'ابدأ التفاوض التجاري')}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Active Conversation */}
      <Card className="w-full md:w-2/3 flex flex-col h-full">
        {activeConvo ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm md:text-base">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>
                  {activeConvo.factory?.name} — {t('Buyer:', 'المشتري:')}{' '}
                  {activeConvo.buyer?.firstName || 'Buyer'} {activeConvo.buyer?.lastName || ''}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages.map((m: any) => {
                const isMe = m.senderId === currentUserId;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[78%] p-3.5 rounded-2xl text-xs md:text-sm shadow-xs leading-relaxed ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-card border text-foreground rounded-bl-none'
                      }`}
                    >
                      <p>{m.content}</p>
                      {m.createdAt && (
                        <p
                          className={`text-[10px] mt-1 ${
                            isMe ? 'text-emerald-100' : 'text-muted-foreground'
                          }`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Quick B2B Reply Pills */}
            <div className="px-4 py-2 border-t bg-muted/10 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-bold uppercase text-emerald-600 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3" /> {t('AI Quick Reply:', 'رد ذكي سريع:')}
              </span>
              {smartReplies.map((reply, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setNewMessage(reply)}
                  className="text-[11px] px-2.5 py-1 rounded-full border bg-background hover:border-emerald-500/50 truncate max-w-[240px] shrink-0"
                >
                  {reply}
                </button>
              ))}
            </div>

            <div className="p-4 border-t">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t(
                    'Type your B2B export inquiry, lab-dip update, or quotation message...',
                    'اكتب رسالتك التجارية أو تفاصيل المواصفات وعرض السعر...'
                  )}
                  className="flex-1 border bg-background rounded-full px-4 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>{t('Select a conversation to start chatting', 'اختر محادثة لبدء التواصل التجاري')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

