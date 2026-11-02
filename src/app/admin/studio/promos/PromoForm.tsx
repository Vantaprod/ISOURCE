"use client";
import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createPromo } from "./actions";

export function PromoForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try { await createPromo(fd); ref.current?.reset(); }
      catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    });
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-5 space-y-3">
      <h2 className="font-bold text-charcoal">Add Promo Banner</h2>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="grid md:grid-cols-2 gap-3">
        <input name="title" required placeholder="Title *" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="subtitle" required placeholder="Subtitle *" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <input name="ctaLabel" required placeholder="CTA Label (e.g. Shop Now) *" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="ctaUrl" required placeholder="CTA URL (e.g. /category/solar) *" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <input name="imageUrl" placeholder="Image URL (optional)" className="h-10 rounded border border-border px-3 text-sm" />
        <select name="theme" className="h-10 rounded border border-border px-3 text-sm bg-white">
          <option value="orange">Orange (White text)</option>
          <option value="charcoal">Charcoal (White text)</option>
          <option value="cream">Cream (Dark text)</option>
        </select>
        <input name="position" type="number" defaultValue={0} placeholder="Position" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <button type="submit" disabled={isPending} className="h-10 px-5 rounded bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 inline-flex items-center gap-2">
        <Plus size={14} /> {isPending ? "Adding..." : "Add Banner"}
      </button>
    </form>
  );
}