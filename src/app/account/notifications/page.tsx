import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Bell, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";

const ICONS = { INFO: Info, SUCCESS: CheckCircle2, WARNING: AlertTriangle, ALERT: AlertCircle };
const COLORS = { INFO: "bg-primary/10 text-primary", SUCCESS: "bg-success/10 text-success", WARNING: "bg-warning/10 text-warning", ALERT: "bg-danger/10 text-danger" };

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted">Updates about your account and orders.</p>
        </div>
        <div className="rounded-lg bg-white border border-border px-3 py-1.5 text-xs font-bold"><Bell size={12} className="inline mr-1" /> {notifications.filter(n => !n.isRead).length} unread</div>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <Bell size={32} className="mx-auto text-muted mb-3" />
          <p className="font-bold">No notifications yet</p>
          <p className="text-sm text-muted mt-1">You will be notified when there are updates.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-white overflow-hidden divide-y divide-border">
          {notifications.map(n => {
            const Icon = ICONS[n.type as keyof typeof ICONS] || Info;
            const color = COLORS[n.type as keyof typeof COLORS] || COLORS.INFO;
            return (
              <div key={n.id} className={`flex gap-4 p-4 ${!n.isRead ? "bg-primary/5" : ""}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}><Icon size={18} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-bold text-sm text-charcoal">{n.title}</p>
                    <span className="text-[10px] text-muted whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}</span>
                  </div>
                  <p className="text-sm text-muted mt-1">{n.message}</p>
                  {n.link && <Link href={n.link} className="text-xs text-primary font-medium mt-2 inline-block hover:underline">View details →</Link>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}