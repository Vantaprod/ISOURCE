import Link from "next/link";
import { ShoppingBag, Users, Store, DollarSign, ArrowRight, AlertCircle, TrendingUp, Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";

export default async function AdminDashboard() {
  const [orderCount, userCount, vendorCount, pendingVendors, brandCount, pendingBrands, orders, totalRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.vendor.count({ where: { status: "APPROVED" } }),
    prisma.vendor.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    prisma.brand.count({ where: { status: "APPROVED" } }),
    prisma.brand.count({ where: { status: "PENDING" } }),
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

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] text-muted uppercase font-bold">Revenue</p><DollarSign size={14} className="text-success" /></div>
          <p className="text-xl font-extrabold text-charcoal">{formatNairaShort(revenue)}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] text-muted uppercase font-bold">Orders</p><ShoppingBag size={14} className="text-primary" /></div>
          <p className="text-xl font-extrabold text-charcoal">{orderCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] text-muted uppercase font-bold">Customers</p><Users size={14} className="text-blue-600" /></div>
          <p className="text-xl font-extrabold text-charcoal">{userCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] text-muted uppercase font-bold">Vendors</p><Store size={14} className="text-warning" /></div>
          <p className="text-xl font-extrabold text-charcoal">{vendorCount}</p>
          {pendingVendors > 0 && <Link href="/admin/vendors" className="text-[10px] text-warning mt-1 flex items-center gap-1 hover:underline"><AlertCircle size={10} /> {pendingVendors} pending</Link>}
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center justify-between mb-2"><p className="text-[10px] text-muted uppercase font-bold">Brands</p><Building2 size={14} className="text-charcoal" /></div>
          <p className="text-xl font-extrabold text-charcoal">{brandCount}</p>
          {pendingBrands > 0 && <Link href="/admin/brands" className="text-[10px] text-warning mt-1 flex items-center gap-1 hover:underline"><AlertCircle size={10} /> {pendingBrands} pending</Link>}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50">
          <h2 className="font-bold text-charcoal">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">View All <ArrowRight size={14} /></Link>
        </div>
        {orders.length === 0 ? (<p className="p-8 text-sm text-muted text-center">No orders placed yet.</p>) : (
          <ul className="divide-y divide-border">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-surface/30 transition-colors">
                <div><p className="font-mono font-bold text-charcoal">{o.orderNumber}</p><p className="text-xs text-muted mt-1">{o.createdAt.toLocaleDateString("en-NG")} · {o.items.length} item(s)</p></div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-sm">{formatNairaShort(o.totalKobo)}</span>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${o.status === "PENDING" ? "bg-warning/10 text-warning" : o.status === "DELIVERED" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>{o.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}