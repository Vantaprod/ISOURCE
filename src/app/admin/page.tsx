import Link from "next/link";
import { ShoppingBag, Users, Store, DollarSign, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";

export default async function AdminDashboard() {
  const [orderCount, userCount, vendorCount, orders] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.vendor.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
  ]);

  const totalRevenueKobo = await prisma.order.aggregate({
    _sum: { totalKobo: true },
    where: { paymentStatus: "PAID" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted">Overview of Isource platform activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted uppercase font-medium">Revenue</p>
            <DollarSign size={16} className="text-success" />
          </div>
          <p className="text-2xl font-bold mt-2">{formatNairaShort(totalRevenueKobo._sum.totalKobo || 0)}</p>
          <p className="text-[10px] text-muted mt-1">Paid orders only</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted uppercase font-medium">Orders</p>
            <ShoppingBag size={16} className="text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">{orderCount}</p>
          <p className="text-[10px] text-muted mt-1">All time</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted uppercase font-medium">Users</p>
            <Users size={16} className="text-charcoal" />
          </div>
          <p className="text-2xl font-bold mt-2">{userCount}</p>
          <p className="text-[10px] text-muted mt-1">Registered</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted uppercase font-medium">Vendors</p>
            <Store size={16} className="text-warning" />
          </div>
          <p className="text-2xl font-bold mt-2">{vendorCount}</p>
          <p className="text-[10px] text-muted mt-1">Active sellers</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-muted text-center">No orders yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                <div>
                  <p className="font-mono font-semibold">{o.orderNumber}</p>
                  <p className="text-xs text-muted">{o.createdAt.toLocaleDateString("en-NG")} · {o.items.length} item{o.items.length === 1 ? "" : "s"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{formatNairaShort(o.totalKobo)}</span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-warning/10 text-warning">{o.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}