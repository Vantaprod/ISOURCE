"use client";

import { useTransition } from "react";
import { approveCampaign, rejectCampaign } from "@/app/actions/admin-advertising";

export function AdminCampaignActions({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  function approve() { startTransition(async () => { await approveCampaign(id); }); }
  function reject() {
    const note = prompt("Reason for rejection:");
    if (note === null) return;
    startTransition(async () => { await rejectCampaign(id, note); });
  }

  if (status === "REJECTED") return <span className="text-xs text-muted">Rejected</span>;

  return (
    <div className="flex items-center justify-end gap-2">
      {status === "PENDING" && (
        <button onClick={approve} disabled={isPending} className="h-7 px-3 rounded bg-primary text-white text-xs font-bold hover:bg-primary-hover disabled:opacity-50">
          Approve
        </button>
      )}
      <button onClick={reject} disabled={isPending} className="h-7 px-3 rounded border border-danger text-danger text-xs font-bold hover:bg-danger hover:text-white disabled:opacity-50">
        Reject
      </button>
    </div>
  );
}