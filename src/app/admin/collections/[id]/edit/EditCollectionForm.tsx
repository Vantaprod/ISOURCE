"use client";
import { useState, useTransition } from "react";
import { updateCollection } from "../../actions";

export function EditCollectionForm({ collection }: { collection: { id: string; name: string; description: string | null; imageUrl: string | null; isActive: boolean } }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => { await updateCollection(collection.id, fd); setSaved(true); });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-5 space-y-3">
      {saved && <p className="text-sm text-success bg-success/5 p-2 rounded border border-success/20">Saved.</p>}
      <input name="name" required defaultValue={collection.name} className="h-10 w-full rounded border border-border px-3 text-sm" />
      <input name="description" defaultValue={collection.description || ""} className="h-10 w-full rounded border border-border px-3 text-sm" />
      <input name="imageUrl" defaultValue={collection.imageUrl || ""} className="h-10 w-full rounded border border-border px-3 text-sm" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isActive" defaultChecked={collection.isActive} /> Active</label>
      <button type="submit" disabled={isPending} className="h-10 px-5 rounded bg-primary text-white text-sm font-bold">{isPending ? "Saving..." : "Save Changes"}</button>
    </form>
  );
}