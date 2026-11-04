import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function naira(kobo: bigint) { return "₦" + (Number(kobo) / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 }); }

export default async function AdminLogisticsPage() {
  const [total, pending, transit, delivered, revenue] = await Promise.all([
    prisma.financeDelivery.count(),
    prisma.financeDelivery.count({ where: { status: "PENDING" } }),
    prisma.financeDelivery.count({ where: { status: "IN_TRANSIT" } }),
    prisma.financeDelivery.count({ where: { status: "DELIVERED" } }),
    prisma.financeDelivery.aggregate({ _sum: { shippingFeeKobo: true } }),
  ]);

  const deliveries = await prisma.financeDelivery.findMany({
    include: { vendorOrder: { select: { orderNumber: true, vendorId: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-extrabold text-charcoal mb-6">Logistics Control Centre</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total Shipments", value: total },
          { label: "Pending Dispatch", value: pending },
          { label: "In Transit", value: transit },
          { label: "Delivered", value: delivered },
          { label: "Shipping Revenue", value: naira(revenue._sum.shippingFeeKobo || BigInt(0)), primary: true },
        ].map((k) => (
          <div key={k.label} className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs uppercase text-muted font-semibold">{k.label}</p>
            <p className={`text-xl font-extrabold mt-1 ${k.primary ? "text-primary" : "text-charcoal"}`}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface text-xs uppercase text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Order #</th>
              <th className="px-5 py-3 font-semibold">Tracking</th>
              <th className="px-5 py-3 font-semibold">Method</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">Fee</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium">{d.vendorOrder.orderNumber}</td>
                <td className="px-5 py-3 text-xs font-mono">{d.trackingNumber || "—"}</td>
                <td className="px-5 py-3 text-xs">{d.deliveryMethod}</td>
                <td className="px-5 py-3 text-xs font-bold">{d.status}</td>
                <td className="px-5 py-3 text-right font-bold">{naira(d.shippingFeeKobo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}