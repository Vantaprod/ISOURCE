"use client";
import { useState, useTransition } from "react";
import { formatNairaShort } from "@/lib/format";
import { reviewRefund } from "./actions";

export function RefundRow({ refund }: { refund: { id: string; orderNumber: string; amountKobo: number; reason: string; status: string; createdAt: string } }) {
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  function handle(decision: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      await reviewRefund(refund.id, decision, notes);
    });
  }

  return (
    <tr className={isPending ? "opacity-50" : ""}>
      <td className="px-4 py-3 font-mono text-xs">{refund.orderNumber}</td>
      <td className="px-4 py-3 font-bold">{formatNairaShort(refund.amountKobo)}</td>
      <td className="px-4 py-3 text-charcoal max-w-[300px] truncate">{refund.reason}</td>
      <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${refund.status === "APPROVED" ? "bg-success/10 text-success" : refund.status === "REJECTED" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}>{refund.status}</span></td>
      <td className="px-4 py-3 text-right">
        {refund.status === "REQUESTED" ? (
          <div className="flex flex-col items-end gap-1">
            {showNotes ? (
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Admin notes" className="h-7 text-xs rounded border border-border px-2 w-40" />
            ) : (<button onClick={() => setShowNotes(true)} className="text-[10px] text-muted hover:underline">Add note</button>)}
            <div className="flex gap-1">
              <button onClick={() => handle("APPROVED")} disabled={isPending} className="h-7 px-2 rounded bg-success text-white text-[10px] font-bold">Approve</button>
              <button onClick={() => handle("REJECTED")} disabled={isPending} className="h-7 px-2 rounded border border-danger text-danger text-[10px] font-bold">Reject</button>
            </div>
          </div>
        ) : (<span className="text-[10px] text-muted">—</span>)}
      </td>
    </tr>
  );
}