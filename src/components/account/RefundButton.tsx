"use client";
import { useState } from "react";
import { requestRefund } from "@/app/actions/refunds";
import { AlertCircle } from "lucide-react";

export function RefundButton({ vendorOrderId, status }: { vendorOrderId: string, status: string }) {
  const [loading, setLoading] = useState(false);

  // Don't show if already disputed or completed/refunded
  if (status === "DISPUTED" || status === "CANCELLED") return null;

  async function handleRefund() {
    const reason = prompt("Please describe the issue with this order (e.g., damaged item, not delivered):");
    if (!reason || reason.trim().length < 5) {
      alert("Please provide a valid reason.");
      return;
    }

    setLoading(true);
    try {
      const res = await requestRefund(vendorOrderId, reason);
      if (res.success) {
        alert("Refund request submitted successfully. The vendor's funds have been frozen pending Admin review.");
        window.location.reload();
      } else {
        alert(res.error || "Failed to submit refund.");
      }
    } catch (error) {
      alert("An error occurred while submitting the refund request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      onClick={handleRefund} 
      disabled={loading}
      className="mt-3 text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 disabled:opacity-50"
    >
      <AlertCircle size={14} /> {loading ? "Submitting..." : "Report an Issue / Request Refund"}
    </button>
  );
}