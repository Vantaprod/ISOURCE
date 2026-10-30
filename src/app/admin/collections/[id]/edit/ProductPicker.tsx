"use client";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { addProductToCollection, removeProductFromCollection } from "../../actions";

export function ProductPicker({ collectionId, current, allProducts }: { collectionId: string; current: string[]; allProducts: { id: string; name: string; image: string; priceKobo: number }[] }) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const inCollection = allProducts.filter(p => current.includes(p.id));
  const available = filtered.filter(p => !current.includes(p.id));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-border bg-white p-4">
        <h3 className="font-bold text-sm mb-3">In this collection ({inCollection.length})</h3>
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {inCollection.map(p => (
            <li key={p.id} className="flex items-center gap-3 p-2 rounded hover:bg-surface">
              <div className="relative h-8 w-8 rounded border border-border overflow-hidden flex-shrink-0"><Image src={p.image} alt="" fill sizes="32px" className="object-contain p-0.5" /></div>
              <span className="text-xs flex-1 truncate">{p.name}</span>
              <button onClick={() => startTransition(async () => { await removeProductFromCollection(collectionId, p.id); })} disabled={isPending} className="text-danger"><X size={14} /></button>
            </li>
          ))}
          {inCollection.length === 0 && <p className="text-xs text-muted text-center py-4">No products yet.</p>}
        </ul>
      </div>
      <div className="rounded-xl border border-border bg-white p-4">
        <h3 className="font-bold text-sm mb-3">Add products</h3>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="h-9 w-full rounded border border-border px-3 text-sm mb-3" />
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {available.slice(0, 30).map(p => (
            <li key={p.id} className="flex items-center gap-3 p-2 rounded hover:bg-surface">
              <div className="relative h-8 w-8 rounded border border-border overflow-hidden flex-shrink-0"><Image src={p.image} alt="" fill sizes="32px" className="object-contain p-0.5" /></div>
              <span className="text-xs flex-1 truncate">{p.name}</span>
              <button onClick={() => startTransition(async () => { await addProductToCollection(collectionId, p.id); })} disabled={isPending} className="text-primary"><Plus size={14} /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}