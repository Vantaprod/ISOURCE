"use client";
import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createSponsoredCampaign } from "./actions";

export function CreateSponsoredForm({ products }: { products: { id: string; name: string }[] }) {
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try { await createSponsoredCampaign(fd); ref.current?.reset(); }
      catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    });
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-4 space-y-3">
      <h2 className="font-bold text-charcoal">New Sponsored Campaign</h2>
      {error && <p className="text-sm text-danger">{error}</p>}
      <select name="productId" required className="h-10 w-full rounded border border-border px-3 text-sm bg-white">
        <option value="">Select product *</option>
        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <div className="grid md:grid-cols-3 gap-3">
        <input name="startDate" type="date" required className="h-10 rounded border border-border px-3 text-sm" />
        <input name="endDate" type="date" required className="h-10 rounded border border-border px-3 text-sm" />
        <input name="priority" type="number" defaultValue={0} placeholder="Priority (higher first)" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <input name="budgetNaira" type="number" min={0} placeholder="Budget ₦ (0 = unlimited)" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="costPerClickNaira" type="number" min={0} placeholder="Cost per click ₦" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <button type="submit" disabled={isPending} className="h-10 px-5 rounded bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 inline-flex items-center gap-2"><Plus size={14} /> Create Campaign</button>
    </form>
  );
}