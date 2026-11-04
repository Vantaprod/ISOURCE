"use client";
import { useState } from "react";
import { approveBanner, rejectBanner, approveCollection, rejectCollection } from "@/app/actions/store-moderation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Props {
  id: string;
  type: "banner" | "collection";
  currentStatus: "PENDING" | "APPROVED" | "REJECTED";
}

export function ModerationButtons({ id, type, currentStatus }: Props) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleApprove() {
    setLoading("approve");
    try {
      if (type === "banner") await approveBanner(id);
      else await approveCollection(id);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleReject() {
    const reason = prompt("Reason for rejection (vendor will see this):");
    if (!reason || reason.trim().length < 5) {
      alert("Please provide a valid reason (min 5 chars).");
      return;
    }
    setLoading("reject");
    try {
      if (type === "banner") await rejectBanner(id, reason);
      else await rejectCollection(id, reason);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2 shrink-0">
      {currentStatus !== "APPROVED" && (
        <button onClick={handleApprove} disabled={!!loading} className="h-9 px-4 rounded-md bg-green-600 text-white text-xs font-bold hover:bg-green-700 disabled:opacity-50 flex items-center gap-1">
          {loading === "approve" ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />} Approve
        </button>
      )}
      {currentStatus !== "REJECTED" && (
        <button onClick={handleReject} disabled={!!loading} className="h-9 px-4 rounded-md border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 disabled:opacity-50 flex items-center gap-1">
          {loading === "reject" ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />} Reject
        </button>
      )}
    </div>
  );
}