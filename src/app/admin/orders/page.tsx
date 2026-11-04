import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";
import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Platform Orders</h1>
        <p className="text-sm text-muted">View all customer purchases across the marketplace.</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface border-b border-border text-muted font-medium">
            <tr>
              <th className="px-5 py-3">Order #</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                <td className="px-5 py-4 font-bold text-charcoal">{order.orderNumber}</td>
                <td className="px-5 py-4 text-muted">{order.user?.name || order.guestEmail || "Guest"}</td>
                <td className="px-5 py-4 text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-muted">{order.items.length}</td>
                <td className="px-5 py-4 font-bold text-charcoal">{formatNairaShort(order.totalKobo)}</td>
                <td className="px-5 py-4">
                  <span className="px-2 py-1 bg-surface border border-border rounded text-xs font-bold text-charcoal">
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                    View <ChevronRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted">
                  No orders placed yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}