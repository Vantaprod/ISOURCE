import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart, Truck, Wallet, ChevronRight, Package, RotateCcw, MapPin, HelpCircle, Bell } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatNairaShort } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function AccountDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [orders, notifications] = await Promise.all([
    prisma.order.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.notification.findMany({ where: { userId: session.userId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const totalOrders = await prisma.order.count({ where: { userId: session.userId } });
  const pendingDeliveries = await prisma.order.count({ where: { userId: session.userId, status: { in: ["PENDING", "PROCESSING", "SHIPPED"] } } });

  return (
    <div className="space-y-6">
      {/* HERO BANNER - Now split with image */}
      <div className="rounded-2xl bg-[#FDF6ED] flex flex-col md:flex-row items-center justify-between overflow-hidden border border-border">
        <div className="p-6 md:p-8 md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-charcoal">Good morning, {session.name.split(" ")[0]}! ðŸ‘‹</h1>
          <p className="text-muted mt-1">{"Here's what's happening with your account today."}</p>
        </div>
        <div className="relative w-full md:w-1/2 h-[180px] md:h-[200px] bg-primary overflow-hidden flex items-center justify-center">
           {/* Decorative circles */}
           <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-white/10" />
           <div className="absolute bottom-[-40px] left-10 w-32 h-32 rounded-full bg-white/10" />
           
           <div className="relative z-10 text-center md:text-left md:absolute md:left-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Shop Smart<br/>Live Better</h2>
              <p className="text-xs text-white/80 mb-4">Great products. Trusted sellers.</p>
              <Link href="/" className="inline-block h-8 px-4 leading-8 rounded bg-white text-charcoal text-xs font-bold hover:bg-surface">Explore Marketplace â†’</Link>
           </div>
           
           {/* The image */}
           <div className="absolute right-0 bottom-0 h-full w-[200px] opacity-90 hidden md:block">
             <Image src="/images/placeholder.svg" alt="Shop Smart" fill sizes="200px" className="object-cover object-top" />
           </div>
        </div>
      </div>

      {/* STATS CARDS - Now with soft icon backgrounds */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center"><ShoppingBag size={14} className="text-warning" /></div>
            <p className="text-xs font-bold text-muted">Total Orders</p>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{totalOrders}</p>
          <Link href="/account/orders" className="text-[10px] text-primary hover:underline mt-1 flex items-center gap-1">View all <ChevronRight size={10} /></Link>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-danger/10 flex items-center justify-center"><Heart size={14} className="text-danger" /></div>
            <p className="text-xs font-bold text-muted">Wishlist Items</p>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">5</p>
          <Link href="/wishlist" className="text-[10px] text-primary hover:underline mt-1 flex items-center gap-1">View wishlist <ChevronRight size={10} /></Link>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><Truck size={14} className="text-primary" /></div>
            <p className="text-xs font-bold text-muted">Pending Deliveries</p>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{pendingDeliveries}</p>
          <Link href="/account/orders" className="text-[10px] text-primary hover:underline mt-1 flex items-center gap-1">Track orders <ChevronRight size={10} /></Link>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center"><Wallet size={14} className="text-success" /></div>
            <p className="text-xs font-bold text-muted">Wallet Balance</p>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(0)}</p>
          <span className="text-[10px] text-muted mt-1 block">Add funds</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* RECENT ORDERS - Table Header always visible */}
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50">
            <h2 className="font-bold text-charcoal">Recent Orders</h2>
            <Link href="/account/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View all orders <ChevronRight size={14} /></Link>
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted uppercase border-b border-border">
              <tr><th className="px-4 py-3">Order #</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Total</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted">No orders yet.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface/30">
                    <td className="px-4 py-3 font-medium text-charcoal">{o.orderNumber}</td>
                    <td className="px-4 py-3 text-muted">{o.createdAt.toLocaleDateString("en-NG", { dateStyle: "medium" })}</td>
                    <td className="px-4 py-3 text-muted">{o.items.length} item(s)</td>
                    <td className="px-4 py-3"><span className="inline-flex px-2 py-1 rounded-full text-[10px] font-bold bg-success/10 text-success">{o.status}</span></td>
                    <td className="px-4 py-3 font-semibold text-charcoal">{formatNairaShort(o.totalKobo)}</td>
                    <td className="px-4 py-3 text-right"><Link href={`/checkout/confirmation/${o.orderNumber}`} className="text-xs text-primary font-medium hover:underline">View details â†’</Link></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-4">
            <h2 className="font-bold text-charcoal mb-3">Quick Access</h2>
            <ul className="space-y-1 text-sm">
              <li><Link href="/orders/track" className="flex items-center justify-between p-2 rounded hover:bg-surface text-charcoal"><span className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-surface flex items-center justify-center"><Package size={12} className="text-charcoal" /></div> Track Order</span> <ChevronRight size={14} className="text-muted" /></Link></li>
              <li><Link href="/account/addresses" className="flex items-center justify-between p-2 rounded hover:bg-surface text-charcoal"><span className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-surface flex items-center justify-center"><MapPin size={12} className="text-charcoal" /></div> My Addresses</span> <ChevronRight size={14} className="text-muted" /></Link></li>
              <li><Link href="/account/refunds" className="flex items-center justify-between p-2 rounded hover:bg-surface text-charcoal"><span className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-surface flex items-center justify-center"><RotateCcw size={12} className="text-charcoal" /></div> Returns & Refunds</span> <ChevronRight size={14} className="text-muted" /></Link></li>
              <li><Link href="/contact" className="flex items-center justify-between p-2 rounded hover:bg-surface text-charcoal"><span className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-surface flex items-center justify-center"><HelpCircle size={12} className="text-charcoal" /></div> Contact Support</span> <ChevronRight size={14} className="text-muted" /></Link></li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-charcoal">Notifications</h2>
              <Link href="/account/notifications" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-xs text-muted text-center py-4">No new notifications.</p>
            ) : (
              <ul className="space-y-4">
                {notifications.map(n => (
                  <li key={n.id} className="flex gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === "SUCCESS" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>
                      <Bell size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-charcoal">{n.title}</p>
                      <p className="text-[10px] text-muted mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* NEED HELP CARD - Now solid orange like reference */}
          <div className="rounded-xl bg-primary p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full" />
            <HelpCircle size={28} className="text-white mx-auto mb-2" />
            <h3 className="font-bold text-white mb-1">Need Help?</h3>
            <p className="text-xs text-white/90 mb-4">Our support team is here for you.</p>
            <Link href="/contact" className="inline-block h-8 leading-8 px-6 rounded bg-white text-primary text-xs font-bold hover:bg-surface">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}