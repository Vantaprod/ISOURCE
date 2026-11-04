import { RefundButton } from "@/components/account/RefundButton";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { Package, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id, userId: session.userId },
    include: { items: true }
  });

  if (!order) notFound();

  const vendorOrders = await prisma.financeVendorOrder.findMany({
    where: { orderId: order.id },
    include: { items: true, delivery: true, vendor: true }
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/account/orders" className="text-sm font-bold text-muted hover:text-charcoal">&larr; Back to Orders</Link>
      
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-charcoal mb-2">Order {order.orderNumber}</h1>
        <p className="text-sm text-muted mb-6">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>

        <div className="space-y-6">
          <h2 className="font-bold text-charcoal border-b border-border pb-2">Shipment Tracking</h2>
          
          {vendorOrders.map(vo => (
            <div key={vo.id} className="border border-border rounded-lg p-4 bg-surface/30">
              <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-charcoal">{(vo as any).vendor.name}</div>
                <div className="text-xs font-bold px-2 py-1 rounded bg-white border border-border">
                  {vo.status}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className={`mt-1 h-4 w-4 rounded-full flex items-center justify-center ${vo.status !== "PENDING" ? "bg-green-500 text-white" : "bg-border text-transparent"}`}>
                    <CheckCircle2 size={10} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-charcoal">Order Confirmed</p>
                    <p className="text-xs text-muted">We've received your payment</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className={`mt-1 h-4 w-4 rounded-full flex items-center justify-center ${["DISPATCHED", "DELIVERED", "COMPLETED"].includes(vo.status) ? "bg-green-500 text-white" : "bg-border text-transparent"}`}>
                    <CheckCircle2 size={10} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-charcoal">Dispatched</p>
                    <p className="text-xs text-muted">Package handed to courier</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className={`mt-1 h-4 w-4 rounded-full flex items-center justify-center ${["DELIVERED", "COMPLETED"].includes(vo.status) ? "bg-green-500 text-white" : "bg-border text-transparent"}`}>
                    <CheckCircle2 size={10} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-charcoal">Delivered</p>
                    <p className="text-xs text-muted">Package arrived safely</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border/50 text-sm">
                <p className="font-medium text-charcoal mb-2">Items in this shipment:</p>
                {(vo as any).items.map(item => (
                  <div key={item.id} className="flex justify-between text-muted text-xs py-1">
                    <span>{item.productName} (x{item.quantity})</span>
                  </div>
                ))}
              </div>
              
              {/* Add Refund Button */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <RefundButton vendorOrderId={vo.id} status={vo.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}