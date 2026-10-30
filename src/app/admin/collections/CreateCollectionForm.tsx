"use client";
import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createCollection } from "./actions";

export function CreateCollectionForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try { await createCollection(fd); ref.current?.reset(); }
      catch (err) { setError(err instanceof Error ? err.message : "Failed"); }
    });
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-4 space-y-3">
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="grid md:grid-cols-3 gap-3">
        <input name="name" required placeholder="Collection name *" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="description" placeholder="Description (optional)" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="imageUrl" placeholder="Image URL (optional)" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <button type="submit" disabled={isPending} className="h-10 px-5 rounded bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 inline-flex items-center gap-2"><Plus size={14} /> Create Collection</button>
    </form>
  );
}