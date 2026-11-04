import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { VendorOrderRow } from "./VendorOrderRow";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) redirect("/vendor");

  const orders = await prisma.financeVendorOrder.findMany({
    where: { vendorId: vendor.id },
    include: { items: true, delivery: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">My Orders</h1>
        <p className="text-sm text-muted">Manage fulfillment and update delivery statuses.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <Package size={40} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-bold text-charcoal mb-2">No orders yet</h2>
          <p className="text-sm text-muted">When customers purchase your products, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <VendorOrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}