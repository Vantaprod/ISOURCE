"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Package, RotateCcw, ShieldCheck, Info } from "lucide-react";

const TYPE_ICONS: Record<string, any> = {
  ORDER: Package,
  PAYMENT: Package,
  REFUND: RotateCcw,
  MODERATION: ShieldCheck,
  WELCOME: Info,
  SYSTEM: Info,
};

interface Notif {
  id: string;
  title: string | null;
  message: string;
  type: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell({ initialCount }: { initialCount: number }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(initialCount);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function loadNotifications() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch {}
    setLoading(false);
  }

  function handleOpen() {
    setOpen(!open);
    if (!open) loadNotifications();
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", { method: "POST" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {}
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative h-10 w-10 rounded-full hover:bg-surface flex items-center justify-center transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-charcoal" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[340px] max-w-[calc(100vw-32px)] bg-white rounded-xl border border-border shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-bold text-charcoal text-sm">Notifications</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-bold text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-muted text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted text-sm">
                <Bell size={24} className="mx-auto mb-2 opacity-40" />
                <p>No notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = TYPE_ICONS[n.type] || Info;
                const Wrapper = n.linkUrl ? Link : "div";
                return (
                  <Wrapper
                    key={n.id}
                    {...(n.linkUrl ? { href: n.linkUrl, onClick: () => setOpen(false) } : {})}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface cursor-pointer transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.isRead ? "font-bold" : "font-medium"} text-charcoal truncate`}>
                        {n.title || "Notification"}
                      </p>
                      <p className="text-xs text-muted line-clamp-2 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-muted mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.isRead && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </Wrapper>
                );
              })
            )}
          </div>

          <Link href="/account/notifications" onClick={() => setOpen(false)} className="block p-3 text-center text-xs font-bold text-primary hover:bg-surface border-t border-border">
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
}