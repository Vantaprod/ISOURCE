"use client";
import { useTransition } from "react";
import { toggleSponsored, deleteSponsored } from "./actions";
import { formatNairaShort } from "@/lib/format";

export function SponsoredRow({ campaign }: { campaign: { id: string; productName: string; startDate: string; endDate: string; budgetKobo: number; spendKobo: number; impressions: number; clicks: number; isActive: boolean; priority: number } }) {
  const [isPending, startTransition] = useTransition();
  const now = new Date();
  const isLive = campaign.isActive && new Date(campaign.startDate) <= now && new Date(campaign.endDate) >= now;
  const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1) : "0";
  const budgetRemaining = campaign.budgetKobo > 0 ? Math.max(0, campaign.budgetKobo - campaign.spendKobo) : null;

  return (
    <tr className={isPending ? "opacity-50" : ""}>
      <td className="px-4 py-3 font-medium">{campaign.productName}<p className="text-[10px] text-muted">Priority {campaign.priority}</p></td>
      <td className="px-4 py-3 text-xs text-muted">{new Date(campaign.startDate).toLocaleDateString("en-NG")} – {new Date(campaign.endDate).toLocaleDateString("en-NG")}</td>
      <td className="px-4 py-3 text-xs">
        {campaign.budgetKobo > 0 ? (<>{formatNairaShort(campaign.spendKobo)} / {formatNairaShort(campaign.budgetKobo)}<p className="text-muted">{formatNairaShort(budgetRemaining!)} left</p></>) : (<span className="text-muted">Unlimited</span>)}
      </td>
      <td className="px-4 py-3 text-xs"><p>{campaign.impressions.toLocaleString()} imp</p><p>{campaign.clicks.toLocaleString()} clicks · {ctr}% CTR</p></td>
      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isLive ? "bg-success/10 text-success" : campaign.isActive ? "bg-warning/10 text-warning" : "bg-muted/10 text-muted"}`}>{isLive ? "LIVE" : campaign.isActive ? "SCHEDULED/EXPIRED" : "PAUSED"}</span></td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={() => startTransition(async () => { await toggleSponsored(campaign.id, !campaign.isActive); })} disabled={isPending} className="text-[10px] text-primary hover:underline">{campaign.isActive ? "Pause" : "Resume"}</button>
          <button onClick={() => { if (confirm("Delete this campaign?")) startTransition(async () => { await deleteSponsored(campaign.id); }); }} disabled={isPending} className="text-[10px] text-danger hover:underline">Delete</button>
        </div>
      </td>
    </tr>
  );
}