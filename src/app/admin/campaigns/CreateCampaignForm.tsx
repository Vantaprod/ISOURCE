"use client";
import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createCampaign } from "./actions";

export function CreateCampaignForm({ banners }: { banners: { id: string; title: string }[] }) {
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try { await createCampaign(fd); ref.current?.reset(); }
      catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    });
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-4 space-y-3">
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="grid md:grid-cols-2 gap-3">
        <input name="name" required placeholder="Campaign name *" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="description" placeholder="Description" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <input name="themeColor" defaultValue="#F07824" placeholder="Theme color (hex)" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="startDate" type="date" required className="h-10 rounded border border-border px-3 text-sm" />
        <input name="endDate" type="date" required className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <select name="bannerId" className="h-10 w-full rounded border border-border px-3 text-sm bg-white">
        <option value="">No banner (theme only)</option>
        {banners.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
      </select>
      <button type="submit" disabled={isPending} className="h-10 px-5 rounded bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 inline-flex items-center gap-2"><Plus size={14} /> Create Campaign</button>
    </form>
  );
}