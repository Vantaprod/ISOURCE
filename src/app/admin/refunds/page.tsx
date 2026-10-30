import { prisma } from "@/lib/prisma";
import { RefundRow } from "./RefundRow";

export default async function AdminRefundsPage() {
  const refunds = await prisma.refund.findMany({
    orderBy: { createdAt: "desc" },
    include: { order: { select: { orderNumber: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Refunds</h1>
        <p className="text-sm text-muted">Review and process customer refund requests.</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        {refunds.length === 0 ? (
          <p className="p-8 text-sm text-muted text-center">No refund requests.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase font-bold">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {refunds.map((r) => (
                <RefundRow key={r.id} refund={{ id: r.id, orderNumber: r.order.orderNumber, amountKobo: r.amountKobo, reason: r.reason, status: r.status, createdAt: r.createdAt.toISOString() }} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}