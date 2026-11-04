"use client";
import { useState } from "react";
import { markVendorOrderDelivered } from "@/app/actions/vendor-orders";
import { formatNairaShort } from "@/lib/format";
import { Package, CheckCircle2, Truck } from "lucide-react";

export function VendorOrderRow({ order }: { order: any }) {
  const [loading, setLoading] = useState(false);

  async function handleDeliver() {
    if (!confirm("Are you sure? This will release the funds to your available balance.")) return;
    setLoading(true);
    try {
      await markVendorOrderDelivered(order.id);
    } catch (error) {
      alert("Failed to mark as delivered.");
    } finally {
      setLoading(false);
    }
  }

  const statusColors: any = {
    PENDING: "bg-orange-100 text-orange-700",
    DISPATCHED: "bg-blue-100 text-blue-700",
    DELIVERED: "bg-green-100 text-green-700",
    COMPLETED: "bg-green-100 text-green-700",
  };

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="bg-surface/50 border-b border-border p-4 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-muted mb-1">Order Number</p>
            <p className="font-bold text-charcoal">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Date</p>
            <p className="font-medium text-charcoal">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Net Earnings</p>
            <p className="font-bold text-primary">{formatNairaShort(order.vendorNetKobo)}</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
          {order.status}
        </span>
      </div>

      <div className="p-4 divide-y divide-border">
        {order.items.map((item: any) => (
          <div key={item.id} className="py-3 flex items-center gap-4 first:pt-0 last:pb-0">
            <div className="h-12 w-12 rounded-md bg-surface flex items-center justify-center flex-shrink-0">
              <Package className="text-muted" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">{item.productName}</p>
              <p className="text-xs text-muted">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-charcoal">{formatNairaShort(item.subtotalKobo)}</p>
          </div>
        ))}
      </div>

      {order.status !== "DELIVERED" && order.status !== "COMPLETED" && (
        <div className="p-4 border-t border-border bg-surface/30 flex justify-end">
          <button onClick={handleDeliver} disabled={loading} className="h-10 px-6 rounded-md bg-charcoal text-white text-sm font-bold hover:bg-black disabled:opacity-50 flex items-center gap-2">
            <Truck size={16} /> {loading ? "Processing..." : "Mark as Delivered"}
          </button>
        </div>
      )}

      {order.status === "DELIVERED" && (
        <div className="p-4 border-t border-border bg-green-50 flex items-center gap-2 text-sm text-green-700 font-bold">
          <CheckCircle2 size={16} /> Delivered - Funds added to your available balance
        </div>
      )}
    </div>
  );
}