import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";
import { approveRefund, rejectRefund } from "@/app/actions/refunds";
import { CheckCircle2, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminRefundsPage() {
  const refunds = await prisma.financeRefund.findMany({
    orderBy: { createdAt: "desc" },
    include: { vendorOrder: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Refund Requests</h1>
        <p className="text-sm text-muted">Review and process customer refund requests.</p>
      </div>

      {refunds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-muted">No refund requests.</div>
      ) : (
        <div className="space-y-3">
          {refunds.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-white p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    r.status === "REQUESTED" ? "bg-orange-100 text-orange-700" :
                    r.status === "APPROVED" ? "bg-blue-100 text-blue-700" :
                    r.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>{r.status}</span>
                  <span className="text-xs text-muted">{new Date(r.createdAt).toLocaleString()}</span>
                </div>
                <p className="font-bold text-charcoal text-lg">{formatNairaShort(Number(r.amountKobo))}</p>
                <p className="text-sm text-muted">Ref: <span className="font-mono">{r.reference}</span></p>
                <p className="text-xs text-muted mt-1">Reason: {r.reason}</p>
                <p className="text-xs text-muted">Order: {r.vendorOrder?.orderNumber}</p>
              </div>

              {r.status === "REQUESTED" && (
                <div className="flex gap-2">
                  <form action={async () => { "use server"; await approveRefund(r.id); }}>
                    <button className="h-10 px-4 rounded-md bg-green-600 text-white text-sm font-bold hover:bg-green-700 flex items-center gap-2"><CheckCircle2 size={16} /> Approve</button>
                  </form>
                  <form action={async () => { "use server"; await rejectRefund(r.id); }}>
                    <button className="h-10 px-4 rounded-md border border-red-500 text-red-500 text-sm font-bold hover:bg-red-50 flex items-center gap-2"><XCircle size={16} /> Reject</button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}