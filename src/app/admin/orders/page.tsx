import { prisma } from "@/lib/prisma";
import { OrderRow } from "./OrderRow";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted">Manage order fulfillment across the platform.</p>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-muted text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => (
                  <OrderRow key={o.id} order={{
                    id: o.id,
                    orderNumber: o.orderNumber,
                    email: o.guestEmail || o.user?.email || "Guest",
                    date: o.createdAt.toISOString(),
                    totalKobo: o.totalKobo,
                    status: o.status
                  }} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}