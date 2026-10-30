"use client";
import { useState, useTransition } from "react";
import { updateRankingWeights } from "./actions";

const FIELDS = [
  { key: "relevanceWeight", label: "Relevance" },
  { key: "salesWeight", label: "Sales volume" },
  { key: "conversionWeight", label: "Conversion" },
  { key: "ratingWeight", label: "Rating" },
  { key: "stockWeight", label: "Stock availability" },
  { key: "deliveryWeight", label: "Delivery performance" },
  { key: "completenessWeight", label: "Listing completeness" },
];

export function RankingForm({ config }: { config: Record<string, number> }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => { await updateRankingWeights(fd); setSaved(true); });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-5 space-y-3">
      {saved && <p className="text-sm text-success bg-success/5 p-2 rounded border border-success/20">Weights updated. New ranking applies to all search and category results.</p>}
      {FIELDS.map(f => (
        <div key={f.key} className="flex items-center justify-between gap-4">
          <label className="text-sm font-medium text-charcoal flex-1">{f.label}</label>
          <input name={f.key} type="number" min={0} max={100} defaultValue={config[f.key]} className="h-9 w-24 rounded border border-border px-3 text-sm text-right" />
        </div>
      ))}
      <button type="submit" disabled={isPending} className="h-10 px-5 rounded bg-primary text-white text-sm font-bold">{isPending ? "Saving..." : "Save Weights"}</button>
    </form>
  );
}