import Link from "next/link";
import { ShoppingBag, Users, Store, DollarSign, ArrowRight, AlertCircle, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";

export default async function AdminDashboard() {
  const [orderCount, userCount, vendorCount, pendingVendors, orders, totalRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.vendor.count({ where: { status: "APPROVED" } }),
    prisma.vendor.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.order.aggregate({ _sum: { totalKobo: true }, where: { paymentStatus: "PAID" } }),
  ]);

  const revenue = totalRevenue._sum.totalKobo || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Platform Overview</h1>
          <p className="text-sm text-muted">Real-time metrics for Isource.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Total Revenue</p>
            <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center"><DollarSign size={16} className="text-success" /></div>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(revenue)}</p>
          <p className="text-xs text-success mt-1 flex items-center gap-1"><TrendingUp size={12} /> From paid orders</p>
        </div>
        
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Total Orders</p>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><ShoppingBag size={16} className="text-primary" /></div>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{orderCount}</p>
          <p className="text-xs text-muted mt-1">All time</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Customers</p>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"><Users size={16} className="text-blue-600" /></div>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{userCount}</p>
          <p className="text-xs text-muted mt-1">Registered accounts</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Vendors</p>
            <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center"><Store size={16} className="text-warning" /></div>
          </div>
          <p className="text-2xl font-extrabold text-charcoal">{vendorCount}</p>
          {pendingVendors > 0 ? (
            <Link href="/admin/vendors" className="text-xs text-warning mt-1 flex items-center gap-1 hover:underline"><AlertCircle size={12} /> {pendingVendors} pending approval</Link>
          ) : (
            <p className="text-xs text-muted mt-1">Active stores</p>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <h2 className="font-bold text-charcoal">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="p-8 text-sm text-muted text-center">No orders placed yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-surface/30 transition-colors">
                <div>
                  <p className="font-mono font-bold text-charcoal">{o.orderNumber}</p>
                  <p className="text-xs text-muted mt-1">{o.createdAt.toLocaleDateString("en-NG")} · {o.items.length} item{o.items.length === 1 ? "" : "s"}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-sm">{formatNairaShort(o.totalKobo)}</span>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    o.status === "PENDING" ? "bg-warning/10 text-warning" :
                    o.status === "DELIVERED" ? "bg-success/10 text-success" :
                    "bg-primary/10 text-primary"
                  }`}>{o.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}