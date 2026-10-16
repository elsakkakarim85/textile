"use client";

import useSWR from 'swr';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send, Building2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MessagesPage() {
  const { user } = useUser();
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: personaData } = useSWR('/api/cluster/persona', fetcher);
  const currentUserId = personaData?.activeUser?.id || user?.id;

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
    { refreshInterval: 2000 }
  );
  const messages = Array.isArray(rawMessages) ? rawMessages : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvo) return;

    const tempMessage = {
      id: String(Date.now()),
      senderId: currentUserId,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };
    mutateMessages([...messages, tempMessage], false);
    setNewMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvo.id,
          content: tempMessage.content,
        }),
      });
      if (res.ok) {
        mutateMessages();
        mutateConvos();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6 h-[80vh]">
      {/* Conversations List */}
      <Card className="w-full md:w-1/3 flex flex-col h-full">
        <div className="p-4 border-b font-bold text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" /> B2B Inbox
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {conversations.length} threads
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {conversations.map((c: any) => {
            const isBuyer = currentUserId === c.buyerId;
            const title = isBuyer
              ? c.factory?.name || 'Factory'
              : `${c.buyer?.firstName || 'Buyer'} ${c.buyer?.lastName || ''} ↔ ${c.factory?.name || ''}`;
            return (
              <div
                key={c.id}
                onClick={() => setActiveConvo(c)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeConvo?.id === c.id
                    ? 'bg-emerald-50 border-emerald-500 border'
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
                  {c.messages?.[0]?.content || 'Start a conversation'}
                </p>
              </div>
            );
          })}
          {conversations.length === 0 && (
            <p className="text-muted-foreground text-center mt-10 text-sm">
              No messages yet. Click &ldquo;Chat Now&rdquo; on any marketplace product to start a B2B thread.
            </p>
          )}
        </div>
      </Card>

      {/* Active Conversation */}
      <Card className="w-full md:w-2/3 flex flex-col h-full">
        {activeConvo ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>
                  {activeConvo.factory?.name} — Buyer: {activeConvo.buyer?.firstName || 'Buyer'}{' '}
                  {activeConvo.buyer?.lastName || ''}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900">
              {messages.map((m: any) => {
                const isMe = m.senderId === currentUserId;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-xs ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-white border text-slate-800 rounded-bl-none'
                      }`}
                    >
                      <p>{m.content}</p>
                      {m.createdAt && (
                        <p
                          className={`text-[10px] mt-1 ${
                            isMe ? 'text-emerald-100' : 'text-slate-400'
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
            <div className="p-4 border-t">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your B2B inquiry or quotation message..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </Card>
    </div>
  );
}
