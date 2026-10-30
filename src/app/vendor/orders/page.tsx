import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { VendorOrderRow } from "./VendorOrderRow";

export default async function VendorOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
  });
  if (!vendor) redirect("/account");

  // Fetch only the OrderItems that belong to this vendor
  const items = await prisma.orderItem.findMany({
    where: { vendorId: vendor.id },
    include: { order: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-sm text-muted">Manage fulfillment for your products.</p>
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        {items.length === 0 ? (
          <p className="p-10 text-sm text-muted text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-muted text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <VendorOrderRow key={item.id} item={{
                    id: item.id,
                    orderNumber: item.order.orderNumber,
                    productName: item.productName,
                    qty: item.qty,
                    lineTotalKobo: item.lineTotalKobo,
                    status: item.fulfillmentStatus
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