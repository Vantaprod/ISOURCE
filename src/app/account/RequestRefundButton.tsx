"use client";
import { useState, useTransition } from "react";
import { requestRefund } from "@/app/actions/refund";
import { RotateCcw } from "lucide-react";

export function RequestRefundButton({ orderId, disabled }: { orderId: string; disabled?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [showPrompt, setShowPrompt] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await requestRefund(orderId, reason);
        setShowPrompt(false);
        setReason("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to request refund");
      }
    });
  }

  if (disabled) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowPrompt(true)}
        className="text-xs font-semibold text-danger hover:underline flex items-center gap-1"
      >
        <RotateCcw size={12} /> Request Refund
      </button>

      {showPrompt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-2">Request Refund</h3>
            <p className="text-sm text-muted mb-4">Please tell us why you want to return this order.</p>
            {error && <p className="text-sm text-danger mb-3">{error}</p>}
            <form onSubmit={handleSubmit}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                placeholder="e.g., Item damaged, wrong size, not as described..."
                className="w-full rounded border border-border p-3 text-sm outline-none focus:border-primary resize-none mb-4"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowPrompt(false)} className="h-9 px-4 rounded border border-border text-sm font-medium hover:bg-surface">Cancel</button>
                <button type="submit" disabled={isPending || reason.trim().length < 5} className="h-9 px-4 rounded bg-danger text-white text-sm font-semibold hover:bg-danger/90 disabled:opacity-50">
                  {isPending ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}