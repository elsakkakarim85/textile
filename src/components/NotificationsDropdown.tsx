"use client";

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export function NotificationsDropdown({ locale }: { locale: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch(console.error);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleOpen = () => {
    setOpen(!open);
    if (!open && unreadCount > 0) {
      // Mark as read
      fetch('/api/notifications', { method: 'PUT' })
        .then(() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))));
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="relative p-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-background border shadow-lg rounded-xl z-50 overflow-hidden">
          <div className="p-3 border-b bg-muted/30">
            <h3 className="font-bold text-sm">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No new notifications.
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`p-4 border-b last:border-0 hover:bg-muted/10 transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}>
                  <p className="text-sm font-bold">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
