"use client";

import { useTransition } from "react";
import { pauseCampaign, resumeCampaign, endCampaign } from "@/app/actions/advertising-campaign";

export function CampaignActions({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  function pause() { startTransition(async () => { await pauseCampaign(id); }); }
  function resume() { startTransition(async () => { await resumeCampaign(id); }); }
  function end() {
    if (!confirm("End this campaign now? It cannot be restarted.")) return;
    startTransition(async () => { await endCampaign(id); });
  }

  if (status === "ENDED" || status === "REJECTED") {
    return <span className="text-xs text-muted">—</span>;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {status === "ACTIVE" && (
        <button
          type="button"
          onClick={pause}
          disabled={isPending}
          className="h-7 px-2 rounded border border-charcoal text-charcoal text-xs font-bold hover:bg-charcoal hover:text-white transition-colors disabled:opacity-50"
        >
          Pause
        </button>
      )}
      {status === "PAUSED" && (
        <button
          type="button"
          onClick={resume}
          disabled={isPending}
          className="h-7 px-2 rounded bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          Resume
        </button>
      )}
      <button
        type="button"
        onClick={end}
        disabled={isPending}
        className="h-7 px-2 rounded border border-danger text-danger text-xs font-bold hover:bg-danger hover:text-white transition-colors disabled:opacity-50"
      >
        End
      </button>
    </div>
  );
}