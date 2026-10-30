"use client";
import { useState, useTransition } from "react";
import { formatNairaShort } from "@/lib/format";
import { createPayout } from "./actions";

export function PayoutClient({ vendors }: { vendors: { id: string; name: string; balanceKobo: number; commissionRate: number }[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedVendor, setSelectedVendor] = useState(vendors[0]?.id || "");
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const vendor = vendors.find((v) => v.id === selectedVendor);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!vendor) return;
    if (amount <= 0 || amount > vendor.balanceKobo) {
      setError("Amount must be between 0 and available balance.");
      return;
    }
    startTransition(async () => {
      try {
        await createPayout(vendor.id, amount, notes);
        setAmount(0);
        setNotes("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create payout");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h2 className="font-bold text-charcoal mb-4">Create Payout</h2>
      {error && <p className="text-sm text-danger mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Vendor</label>
            <select value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)} className="h-10 w-full rounded border border-border bg-white px-3 text-sm">
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name} ({formatNairaShort(v.balanceKobo)} available)</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Amount (Kobo)</label>
            <input type="number" min={1} value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} placeholder={vendor?.balanceKobo.toString()} className="h-10 w-full rounded border border-border px-3 text-sm" />
            {vendor && <p className="text-xs text-muted mt-1">Max: {formatNairaShort(vendor.balanceKobo)}</p>}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Notes (optional)</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Bank reference, memo..." className="h-10 w-full rounded border border-border px-3 text-sm" />
        </div>
        <button type="submit" disabled={isPending || !vendor || vendor.balanceKobo <= 0} className="h-10 px-6 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50">
          {isPending ? "Processing..." : "Create Payout"}
        </button>
      </form>
    </div>
  );
}