"use client";
import { useState } from "react";
import { Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { registerBrand } from "./actions";

export default function ApplyBrandPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await registerBrand(formData);
    if (result.success) setSubmitted(true);
    else setError(result.error || "Failed to submit");
  }

  if (submitted) return (
    <div className="rounded-xl border border-success/30 bg-success/5 p-10 text-center">
      <CheckCircle2 size={40} className="mx-auto text-success mb-4" />
      <h2 className="text-xl font-bold">Brand Application Submitted</h2>
      <p className="text-sm text-muted mt-2">Your application is under review. You will be notified once approved.</p>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-6"><Building2 size={32} className="text-primary mb-2" /><h1 className="text-2xl font-bold">Register Your Brand</h1><p className="text-sm text-muted mt-1">Apply to have your brand verified on Isource.</p></div>
      {error && <p className="text-sm text-danger mb-3 p-3 bg-danger/5 rounded border border-danger/20">{error}</p>}
      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6 space-y-4">
        <div><label className="block text-sm font-medium mb-1">Brand Name *</label><input name="name" required className="h-10 w-full rounded border border-border px-3 text-sm" /></div>
        <div><label className="block text-sm font-medium mb-1">Description *</label><textarea name="description" required rows={3} className="w-full rounded border border-border p-3 text-sm resize-none" placeholder="What does your brand sell?" /></div>
        <div><label className="block text-sm font-medium mb-1">Website</label><input name="website" type="url" className="h-10 w-full rounded border border-border px-3 text-sm" placeholder="https://" /></div>
        <button type="submit" className="w-full h-11 rounded bg-primary text-white text-sm font-bold hover:bg-primary-hover flex items-center justify-center gap-2">Submit Application <ArrowRight size={14} /></button>
      </form>
    </div>
  );
}