"use client";
import { useState } from "react";
import { approveRefund, rejectRefund } from "@/app/actions/refunds";
import { formatNairaShort } from "@/lib/format";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export function RefundRow({ refund }: { refund: any }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleApprove() {
    if (!confirm("Approve this refund? The customer will be refunded and funds will be reversed from the vendor.")) return;
    setLoading("approve");
    try {
      await approveRefund(refund.id);
    } catch (err: any) {
      alert(err.message || "Failed to approve");
    } finally {
      setLoading(null);
    }
  }

  async function handleReject() {
    if (!confirm("Reject this refund? The vendor's funds will be released back to them.")) return;
    setLoading("reject");
    try {
      await rejectRefund(refund.id);
    } catch (err: any) {
      alert(err.message || "Failed to reject");
    } finally {
      setLoading(null);
    }
  }

  const statusColor =
    refund.status === "REQUESTED" ? "bg-orange-100 text-orange-700" :
    refund.status === "SUCCESSFUL" ? "bg-green-100 text-green-700" :
    refund.status === "REJECTED" ? "bg-red-100 text-red-700" :
    "bg-gray-100 text-gray-700";

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor}`}>{refund.status}</span>
            <span className="text-xs text-muted">{new Date(refund.createdAt).toLocaleString()}</span>
          </div>
          <p className="font-bold text-charcoal text-lg">{formatNairaShort(refund.amountKobo)}</p>
          <p className="text-sm text-muted">
            Vendor: <span className="font-medium text-charcoal">{refund.vendorOrder?.vendor?.name || "Unknown"}</span>
          </p>
          <p className="text-xs text-muted">Order: {refund.vendorOrder?.orderNumber}</p>
        </div>

        {refund.status === "REQUESTED" && (
          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              disabled={!!loading}
              className="h-10 px-4 rounded-md bg-green-600 text-white text-sm font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading === "approve" ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={16} />}
              Approve Refund
            </button>
            <button
              onClick={handleReject}
              disabled={!!loading}
              className="h-10 px-4 rounded-md border border-red-500 text-red-600 text-sm font-bold hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
            >
              {loading === "reject" ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={16} />}
              Reject
            </button>
          </div>
        )}
      </div>

      <div className="bg-surface p-3 rounded-lg border border-border/50">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-charcoal mb-0.5">Customer Reason:</p>
            <p className="text-sm text-charcoal/80">{refund.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
}