import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import { formatNairaShort } from "@/lib/format";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">My Orders</h1>
          <p className="text-sm text-muted">View and track your recent orders.</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <Package size={40} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-bold text-charcoal mb-2">No orders yet</h2>
          <p className="text-sm text-muted mb-4">When you place an order, it will appear here.</p>
          <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-bold text-white hover:bg-primary-hover">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-border bg-white overflow-hidden">
              {/* Order Header */}
              <div className="bg-surface/50 border-b border-border p-4 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-muted mb-1">Order Number</p>
                    <p className="font-bold text-charcoal">#{order.orderNumber || order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Date Placed</p>
                    <p className="font-medium text-charcoal">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Total</p>
                    <p className="font-bold text-charcoal">{formatNairaShort(order.totalKobo)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold 
                    ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 
                      'bg-orange-100 text-orange-700'}">
                    {order.status === 'DELIVERED' && <CheckCircle2 size={14} />}
                    {order.status === 'SHIPPED' && <Truck size={14} />}
                    {order.status === 'CANCELLED' && <XCircle size={14} />}
                    {!['DELIVERED', 'SHIPPED', 'CANCELLED'].includes(order.status) && <Clock size={14} />}
                    {order.status}
                  </span>
                  <Link href={`/account/orders/${order.id}`} className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 divide-y divide-border">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-4 first:pt-0 last:pb-0">
                    <div className="h-12 w-12 rounded-md bg-surface flex items-center justify-center flex-shrink-0">
                      <Package className="text-muted" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{item.product?.name || "Item name unavailable"}</p>
                      <p className="text-xs text-muted">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-charcoal">{formatNairaShort(item.priceKobo)}</p>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-xs text-muted pt-3">+ {order.items.length - 3} more item(s)</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}