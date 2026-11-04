import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";
import { RefundRow } from "./RefundRow";
import { RotateCcw, CheckCircle2, XCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminRefundsPage() {
  const refunds = await prisma.financeRefund.findMany({
    include: {
      vendorOrder: { include: { vendor: true } },
      payment: { include: { allocations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const pending = refunds.filter(r => r.status === "REQUESTED");
  const approved = refunds.filter(r => r.status === "APPROVED");
  const resolved = refunds.filter(r => ["SUCCESSFUL", "REJECTED"].includes(r.status));

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Refund Management</h1>
        <p className="text-sm text-muted">Review customer refund requests and resolve disputes.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-orange-600 mb-1"><Clock size={14} /><span className="text-xs font-bold uppercase">Pending</span></div>
          <p className="text-2xl font-extrabold text-charcoal">{pending.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1"><CheckCircle2 size={14} /><span className="text-xs font-bold uppercase">Approved</span></div>
          <p className="text-2xl font-extrabold text-charcoal">{approved.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 text-muted mb-1"><XCircle size={14} /><span className="text-xs font-bold uppercase">Resolved</span></div>
          <p className="text-2xl font-extrabold text-charcoal">{resolved.length}</p>
        </div>
      </div>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-bold text-charcoal mb-3">Pending Requests</h2>
          <div className="space-y-3">
            {pending.map(r => <RefundRow key={r.id} refund={r} />)}
          </div>
        </div>
      )}

      {/* All Resolved */}
      {refunds.length > 0 && (
        <div>
          <h2 className="font-bold text-charcoal mb-3">Refund History</h2>
          <div className="space-y-3">
            {refunds.filter(r => !["REQUESTED"].includes(r.status)).map(r => (
              <RefundRow key={r.id} refund={r} />
            ))}
          </div>
        </div>
      )}

      {refunds.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
          <RotateCcw size={40} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-bold text-charcoal mb-2">No refund requests</h2>
          <p className="text-sm text-muted">When customers request refunds, they will appear here.</p>
        </div>
      )}
    </div>
  );
}