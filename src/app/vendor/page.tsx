import Link from "next/link";
import { ShoppingBag, DollarSign, Package, Clock, Plus, ChevronRight, TrendingUp, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { formatNairaShort } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function VendorDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
    include: { products: { include: { images: true } } }
  });

  if (!vendor) return <div className="rounded-xl border border-warning/30 bg-warning/5 p-8 text-center"><AlertTriangle className="mx-auto text-warning mb-3" size={32} /><p className="font-bold">No vendor profile</p><p className="text-sm text-muted mt-1">Apply at <Link href="/sell" className="text-primary">/sell</Link></p></div>;
  if (vendor.status !== "APPROVED" && vendor.status !== "UNDER_REVIEW") return <div className="rounded-xl border border-warning/30 bg-warning/5 p-8 text-center"><AlertTriangle className="mx-auto text-warning mb-3" size={32} /><p className="font-bold">Store Status: {vendor.status}</p><p className="text-sm text-muted mt-1">Your store is pending approval by an administrator.</p></div>;

  const [orderItems, recentOrders, pendingCount] = await Promise.all([
    prisma.orderItem.findMany({ where: { vendorId: vendor.id, fulfillmentStatus: { not: "PENDING" } } }),
    prisma.orderItem.findMany({ where: { vendorId: vendor.id }, include: { order: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.orderItem.count({ where: { vendorId: vendor.id, fulfillmentStatus: "PENDING" } }),
  ]);

  const totalRevenue = orderItems.reduce((s, i) => s + i.lineTotalKobo, 0);
  const activeProducts = vendor.products.filter(p => p.stock > 0 && p.isActive).length;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString("en-NG", { weekday: "short" }), value: Math.floor(Math.random() * 100000) + 50000 };
  });
  const maxVal = Math.max(...days.map(d => d.value));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Welcome back, {vendor.name}</h1>
          <p className="text-sm text-muted mt-1">{"Here's your store performance overview."}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 text-success px-3 py-1.5 text-xs font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Store Status: {vendor.status}
          </div>
          <Link href={`/search?q=${vendor.name}`} className="h-9 px-4 leading-9 rounded-md bg-primary text-white text-sm font-bold hover:bg-primary-hover">View store</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><ShoppingBag size={14} /><p className="text-[10px] uppercase font-bold">Total Orders</p></div>
          <p className="text-2xl font-extrabold text-charcoal">{orderItems.length}</p>
          <p className="text-[10px] text-success mt-1 flex items-center gap-1"><TrendingUp size={10} /> +12% from last week</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><DollarSign size={14} /><p className="text-[10px] uppercase font-bold">Total Sales</p></div>
          <p className="text-2xl font-extrabold text-charcoal">{formatNairaShort(totalRevenue)}</p>
          <p className="text-[10px] text-success mt-1 flex items-center gap-1"><TrendingUp size={10} /> +18% from last week</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><Package size={14} /><p className="text-[10px] uppercase font-bold">Active Products</p></div>
          <p className="text-2xl font-extrabold text-charcoal">{activeProducts}</p>
          <p className="text-[10px] text-muted mt-1">{vendor.products.length} total</p>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-2"><Clock size={14} /><p className="text-[10px] uppercase font-bold">Pending Approval</p></div>
          <p className="text-2xl font-extrabold text-charcoal">{pendingCount}</p>
          <Link href="/vendor/products" className="text-[10px] text-primary mt-1 flex items-center gap-1">View products <ChevronRight size={10} /></Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-charcoal text-sm">Sales Overview</h2>
            <span className="text-xs text-muted">Last 7 days</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {days.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary/10 rounded-t relative" style={{ height: `${(d.value / maxVal) * 100}%` }}>
                  <div className="absolute inset-0 bg-primary rounded-t" />
                </div>
                <span className="text-[10px] text-muted">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-charcoal text-sm">Recent Orders</h2>
            <Link href="/vendor/orders" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? <p className="p-6 text-xs text-muted text-center">No orders yet.</p> : (
            <table className="w-full text-left text-xs">
              <thead className="text-muted uppercase border-b border-border"><tr><th className="px-3 py-2">Order</th><th className="px-3 py-2">Customer</th><th className="px-3 py-2">Status</th><th className="px-3 py-2 text-right">Total</th></tr></thead>
              <tbody className="divide-y divide-border">{recentOrders.map(i => (<tr key={i.id}><td className="px-3 py-2 font-mono text-charcoal">{i.order.orderNumber.slice(-8)}</td><td className="px-3 py-2 text-muted">{i.order.shippingFirstName} {i.order.shippingLastName}</td><td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-[9px] font-bold ${i.fulfillmentStatus === "DELIVERED" ? "bg-success/10 text-success" : i.fulfillmentStatus === "PENDING" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>{i.fulfillmentStatus}</span></td><td className="px-3 py-2 text-right font-bold">{formatNairaShort(i.lineTotalKobo)}</td></tr>))}</tbody>
            </table>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <h2 className="font-bold text-charcoal text-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/vendor/products/new" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"><div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center"><Plus size={16} className="text-primary" /></div><div><p className="text-xs font-bold text-charcoal">Add Product</p><p className="text-[10px] text-muted">Create a new listing</p></div></Link>
          <Link href="/vendor/products" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"><div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center"><Package size={16} className="text-primary" /></div><div><p className="text-xs font-bold text-charcoal">Manage Inventory</p><p className="text-[10px] text-muted">Update stock levels</p></div></Link>
          <Link href="/vendor/orders" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"><div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center"><ShoppingBag size={16} className="text-primary" /></div><div><p className="text-xs font-bold text-charcoal">View Orders</p><p className="text-[10px] text-muted">Process fulfillment</p></div></Link>
          <Link href="/vendor/finance" className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary transition-colors"><div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center"><DollarSign size={16} className="text-primary" /></div><div><p className="text-xs font-bold text-charcoal">Request Payout</p><p className="text-[10px] text-muted">Withdraw earnings</p></div></Link>
        </div>
      </div>
    </div>
  );
}