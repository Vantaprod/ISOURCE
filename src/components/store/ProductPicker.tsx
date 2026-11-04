"use client";
import { useState, useMemo } from "react";
import { Search, Check, Package, Loader2 } from "lucide-react";
import { updateCollectionProducts } from "@/app/actions/store-collections";

interface Product {
  id: string;
  name: string;
  priceKobo: number;
  images: { url: string }[];
}

interface Props {
  collectionId: string;
  allProducts: Product[];
  initialSelectedIds: string[];
}

export function ProductPicker({ collectionId, allProducts, initialSelectedIds }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return allProducts;
    const q = search.toLowerCase();
    return allProducts.filter(p => p.name.toLowerCase().includes(q));
  }, [allProducts, search]);

  const hasChanges = useMemo(() => {
    if (selectedIds.length !== initialSelectedIds.length) return true;
    return !selectedIds.every(id => initialSelectedIds.includes(id));
  }, [selectedIds, initialSelectedIds]);

  function toggle(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateCollectionProducts(collectionId, selectedIds);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-charcoal text-lg">Products in Collection</h2>
          <p className="text-sm text-muted">{selectedIds.length} of {allProducts.length} selected</p>
        </div>
        {hasChanges && (
          <button onClick={handleSave} disabled={saving}
            className="h-10 px-5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        )}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your products..."
          className="w-full h-10 rounded-lg border border-border pl-10 pr-3 text-sm outline-none focus:border-primary" />
      </div>

      <div className="max-h-96 overflow-y-auto border border-border rounded-lg divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">
            {allProducts.length === 0 ? "No products in your store yet." : "No products match your search."}
          </div>
        ) : (
          filtered.map(p => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <label key={p.id} className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${isSelected ? "bg-primary/5" : "hover:bg-surface"}`}>
                <input type="checkbox" checked={isSelected} onChange={() => toggle(p.id)}
                  className="h-4 w-4 rounded border-border text-primary" />
                <div className="h-10 w-10 rounded border border-border bg-surface flex items-center justify-center overflow-hidden shrink-0">
                  {p.images[0]?.url ? (
                    <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package size={16} className="text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                  <p className="text-xs text-muted">₦{(p.priceKobo / 100).toLocaleString()}</p>
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}