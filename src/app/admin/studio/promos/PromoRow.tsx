"use client";
import { useState, useTransition } from "react";
import { updatePromo, deletePromo } from "./actions";
import type { PromoBanner } from "@prisma/client";
import { Edit, Trash2, Check, X } from "lucide-react";

export function PromoRow({ promo }: { promo: PromoBanner }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);

  function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => { await updatePromo(promo.id, fd); setEditing(false); });
  }

  if (editing) {
    return (
      <tr className="bg-surface/50">
        <td colSpan={5} className="p-4">
          <form onSubmit={handleUpdate} className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input name="title" defaultValue={promo.title} required className="h-9 rounded border border-border px-3 text-sm" />
              <input name="subtitle" defaultValue={promo.subtitle} required className="h-9 rounded border border-border px-3 text-sm" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <input name="ctaLabel" defaultValue={promo.ctaLabel} required className="h-9 rounded border border-border px-3 text-sm" />
              <input name="ctaUrl" defaultValue={promo.ctaUrl} required className="h-9 rounded border border-border px-3 text-sm" />
            </div>
            <div className="grid md:grid-cols-4 gap-3">
              <input name="imageUrl" defaultValue={promo.imageUrl || ""} className="h-9 rounded border border-border px-3 text-sm" />
              <select name="theme" defaultValue={promo.theme} className="h-9 rounded border border-border px-3 text-sm bg-white">
                <option value="orange">Orange</option>
                <option value="charcoal">Charcoal</option>
                <option value="cream">Cream</option>
              </select>
              <input name="position" type="number" defaultValue={promo.position} className="h-9 rounded border border-border px-3 text-sm" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={promo.isActive} /> Active</label>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={isPending} className="h-8 px-3 rounded bg-success text-white text-xs font-bold flex items-center gap-1"><Check size={14} /> Save</button>
              <button type="button" onClick={() => setEditing(false)} className="h-8 px-3 rounded border border-border text-xs font-bold flex items-center gap-1"><X size={14} /> Cancel</button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className={isPending ? "opacity-50" : ""}>
      <td className="px-4 py-3 font-mono text-xs">{promo.position}</td>
      <td className="px-4 py-3 font-medium">{promo.title}</td>
      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface text-charcoal uppercase">{promo.theme}</span></td>
      <td className="px-4 py-3">{promo.isActive ? <span className="text-success text-xs font-bold">Active</span> : <span className="text-danger text-xs font-bold">Inactive</span>}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing(true)} className="text-primary hover:text-primary-hover"><Edit size={16} /></button>
          <button onClick={() => { if(confirm("Delete this promo?")) startTransition(async () => { await deletePromo(promo.id); }); }} className="text-danger hover:text-danger/80"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  );
}