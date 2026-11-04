import { getVendorDeliveries } from "@/app/actions/vendor-shipping";
import { MarkReadyButton } from "./MarkReadyButton";

export const dynamic = "force-dynamic";

const STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PICKUP_REQUESTED: "bg-blue-100 text-blue-700",
  IN_TRANSIT: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
};

export default async function VendorShippingPage() {
  const deliveries = await getVendorDeliveries();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-extrabold text-charcoal mb-6">Shipping & Dispatch</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Pending Dispatch", key: "PENDING" },
          { label: "Pickup Requested", key: "PICKUP_REQUESTED" },
          { label: "In Transit", key: "IN_TRANSIT" },
          { label: "Delivered", key: "DELIVERED" },
        ].map((s) => {
          const count = deliveries.filter((d) => d.status === s.key).length;
          return (
            <div key={s.key} className="rounded-lg border border-border bg-white p-4">
              <p className="text-xs uppercase text-muted font-semibold">{s.label}</p>
              <p className="text-2xl font-extrabold text-charcoal mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        {deliveries.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted">No shipments yet.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Order #</th>
                <th className="px-5 py-3 font-semibold">Tracking</th>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium text-charcoal">{d.vendorOrder.orderNumber}</td>
                  <td className="px-5 py-3 text-xs font-mono text-charcoal">{d.trackingNumber || "—"}</td>
                  <td className="px-5 py-3 text-xs">{d.deliveryMethod}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${STYLE[d.status] || "bg-gray-100"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {d.status === "PENDING" && <MarkReadyButton id={d.id} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}