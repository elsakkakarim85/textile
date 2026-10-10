"use client";

import useSWR from 'swr';
import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Send, RefreshCw } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MessagesPage() {
  const { user } = useUser();
  const [activeConvo, setActiveConvo] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-polling for conversations list every 5s
  const { data: conversations = [], mutate: mutateConvos } = useSWR('/api/messages', fetcher, { refreshInterval: 5000 });

  // Auto-polling for messages in active convo every 1s
  const { data: messages = [], mutate: mutateMessages, isValidating } = useSWR(
    activeConvo ? `/api/messages?conversationId=${activeConvo.id}` : null,
    fetcher,
    { refreshInterval: 1000 }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvo) return;

    // Optimistic UI update
    const tempMessage = { id: Date.now(), senderId: user?.id, content: newMessage };
    mutateMessages([...messages, tempMessage], false);
    setNewMessage('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConvo.id,
          content: tempMessage.content
        })
      });
      if (res.ok) {
        mutateMessages(); // Re-fetch actual
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
        <div className="p-4 border-b font-bold text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Inbox
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {conversations.map((c: any) => {
            const isBuyer = user?.id === c.buyerId;
            const title = isBuyer ? c.factory.name : c.buyer.firstName || 'Buyer';
            return (
              <div 
                key={c.id} 
                onClick={() => setActiveConvo(c)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${activeConvo?.id === c.id ? 'bg-primary/10 border-primary border' : 'hover:bg-muted border border-transparent'}`}
              >
                <p className="font-bold">{title}</p>
                <p className="text-xs text-muted-foreground truncate">{c.messages[0]?.content || 'Start a conversation'}</p>
              </div>
            );
          })}
          {conversations.length === 0 && <p className="text-muted-foreground text-center mt-10">No messages yet.</p>}
        </div>
      </Card>

      {/* Active Conversation */}
      <Card className="w-full md:w-2/3 flex flex-col h-full">
        {activeConvo ? (
          <>
            <div className="p-4 border-b font-bold">
              {user?.id === activeConvo.buyerId ? activeConvo.factory.name : activeConvo.buyer.firstName}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900">
              {messages.map((m: any) => {
                const isMe = m.senderId === user?.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                      {m.content}
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
                  onChange={e => setNewMessage(e.target.value)} 
                  placeholder="Type your message..." 
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button type="submit" disabled={!newMessage.trim()} className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 disabled:opacity-50">
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
