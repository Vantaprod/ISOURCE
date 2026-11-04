import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { markAllNotificationsRead } from "@/app/actions/notifications";
import { Bell, Package, RotateCcw, ShieldCheck, Info } from "lucide-react";

export const dynamic = "force-dynamic";

const TYPE_ICONS: Record<string, any> = {
  ORDER: Package,
  PAYMENT: Package,
  REFUND: RotateCcw,
  MODERATION: ShieldCheck,
  WELCOME: Info,
  SYSTEM: Info,
};

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
            <Bell size={22} /> Notifications
          </h1>
          <p className="text-sm text-muted">
            {unread > 0 ? `${unread} unread notification${unread === 1 ? "" : "s"}` : "All caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <form action={markAllNotificationsRead}>
            <button type="submit" className="h-10 px-4 rounded-lg border border-border text-sm font-bold hover:bg-surface">
              Mark all as read
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <Bell size={40} className="mx-auto text-muted mb-4 opacity-50" />
          <h2 className="text-lg font-bold text-charcoal mb-1">No notifications yet</h2>
          <p className="text-sm text-muted">You'll see updates about orders, refunds, and store activity here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border divide-y divide-border overflow-hidden">
          {notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type] || Info;
            const content = (
              <div className={`flex items-start gap-4 p-4 hover:bg-surface transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}>
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.isRead ? "font-bold" : "font-medium"} text-charcoal`}>
                    {n.title || "Notification"}
                  </p>
                  <p className="text-sm text-charcoal/80 mt-1">{n.message}</p>
                  <p className="text-xs text-muted mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-2" />}
              </div>
            );

            return n.linkUrl ? (
              <Link key={n.id} href={n.linkUrl} className="block">
                {content}
              </Link>
            ) : (
              <div key={n.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}