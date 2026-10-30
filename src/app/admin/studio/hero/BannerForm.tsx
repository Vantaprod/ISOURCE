"use client";
import { useRef, useState, useTransition } from "react";
import { Upload } from "lucide-react";
import { createBanner } from "./actions";

export function BannerForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createBanner(formData);
        formRef.current?.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create banner");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-5 space-y-4">
      <h2 className="font-bold text-charcoal">Add New Banner</h2>
      {error && <p className="text-sm text-danger p-2 rounded bg-danger/5 border border-danger/20">{error}</p>}

      <div className="grid md:grid-cols-2 gap-3">
        <input name="title" required placeholder="Title *" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="subtitle" placeholder="Subtitle" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <textarea name="description" rows={2} placeholder="Description" className="w-full rounded border border-border p-3 text-sm resize-none" />
      <input name="imageUrl" required placeholder="Image URL (Cloudinary) *" className="h-10 w-full rounded border border-border px-3 text-sm" />
      <div className="grid md:grid-cols-2 gap-3">
        <input name="ctaLabel" placeholder="CTA Button Label (e.g. Shop Now)" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="ctaUrl" placeholder="CTA URL (e.g. /category/solar-power)" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <input name="position" type="number" placeholder="Position (0 = first)" defaultValue={0} className="h-10 rounded border border-border px-3 text-sm" />
        <input name="startDate" type="date" className="h-10 rounded border border-border px-3 text-sm" />
        <input name="endDate" type="date" className="h-10 rounded border border-border px-3 text-sm" />
      </div>
      <button type="submit" disabled={isPending} className="h-10 px-5 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 inline-flex items-center gap-2">
        <Upload size={14} /> {isPending ? "Creating..." : "Create Banner"}
      </button>
    </form>
  );
}