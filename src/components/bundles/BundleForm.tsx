"use client";
import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { createBundle } from "@/app/actions/bundles";
import type { Product } from "@prisma/client";

export function BundleForm({ products }: { products: Product[] }) {
  const [state, formAction, isPending] = useActionState(createBundle, null);
  const [selected, setSelected] = useState<string[]>([]);

  function toggleProduct(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <form action={formAction} className="space-y-6 rounded-xl border border-border bg-white p-6">
      {state?.error && <p className="text-sm text-danger bg-danger/10 p-3 rounded">{state.error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-bold text-charcoal mb-1">Bundle Title *</label>
          <input name="title" required placeholder="e.g., 3kVA Solar Home Bundle" className="h-10 w-full rounded border border-border px-3 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-charcoal mb-1">Category *</label>
          <select name="category" className="h-10 w-full rounded border border-border px-3 text-sm bg-white">
            <option value="solar-power">Solar &amp; Power</option>
            <option value="home-kitchen" disabled>Christmas Bundle (Coming Soon)</option>
            <option value="fashion" disabled>Valentine Bundle (Coming Soon)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-charcoal mb-1">Description *</label>
        <textarea name="description" required rows={3} placeholder="Describe what makes this bundle great..." className="w-full rounded border border-border p-3 text-sm resize-none" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-bold text-charcoal mb-1">Bundle Price (₦) *</label>
          <input name="priceNaira" type="number" required min="1" placeholder="e.g. 450000" className="h-10 w-full rounded border border-border px-3 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-charcoal mb-1">Orig. Price (₦)</label>
          <input name="originalPriceNaira" type="number" min="1" placeholder="e.g. 500000" className="h-10 w-full rounded border border-border px-3 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-charcoal mb-1">Image URL</label>
          <input name="imageUrl" placeholder="/images/placeholder.svg" className="h-10 w-full rounded border border-border px-3 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-charcoal mb-2">Select Products Included *</label>
        <div className="max-h-60 overflow-y-auto border border-border rounded-lg divide-y divide-border bg-surface/50">
          {products.map(p => (
            <label key={p.id} className="flex items-center gap-3 p-3 hover:bg-white cursor-pointer">
              <input
                type="checkbox"
                name="productIds[]"
                value={p.id}
                checked={selected.includes(p.id)}
                onChange={() => toggleProduct(p.id)}
                className="h-4 w-4 rounded border-border text-primary"
              />
              <span className="text-sm font-medium text-charcoal flex-1">{p.name}</span>
              <span className="text-xs text-muted">₦{(p.priceKobo/100).toLocaleString()}</span>
            </label>
          ))}
          {products.length === 0 && <p className="p-4 text-sm text-muted text-center">No products found. Add products first.</p>}
        </div>
      </div>

      <button type="submit" disabled={isPending || selected.length === 0} className="h-11 w-full rounded bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2">
        <Plus size={16} /> {isPending ? "Creating Bundle..." : "Create Bundle"}
      </button>
    </form>
  );
}