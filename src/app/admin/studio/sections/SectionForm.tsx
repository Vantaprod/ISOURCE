"use client";
import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createSection } from "./actions";

const TYPES = [
  { value: "FLASH_DEALS", label: "Flash Deals" },
  { value: "BEST_SELLERS", label: "Best Sellers" },
  { value: "TRENDING", label: "Trending" },
  { value: "RECENT", label: "Recently Added" },
  { value: "FEATURED_CATEGORIES", label: "Featured Categories" },
  { value: "CATEGORY_GRID", label: "Category Grid" },
  { value: "BRAND_STORES", label: "Brand Stores" },
];

export function SectionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try { await createSection(formData); formRef.current?.reset(); }
      catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-5 space-y-3">
      <h2 className="font-bold text-charcoal">Add Section</h2>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="grid md:grid-cols-2 gap-3">
        <input name="title" required placeholder="Section Title *" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="subtitle" placeholder="Subtitle" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <select name="type" required className="h-10 rounded border border-border px-3 text-sm bg-white">
          <option value="">Select Type *</option>
          {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <input name="position" type="number" defaultValue={0} placeholder="Position" className="h-10 rounded border border-border px-3 text-sm" />
        <button type="submit" disabled={isPending} className="h-10 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 inline-flex items-center justify-center gap-2">
          <Plus size={14} /> {isPending ? "Adding..." : "Add Section"}
        </button>
      </div>
    </form>
  );
}