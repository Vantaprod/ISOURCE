"use client";
import { useActionState, useRef } from "react";
import { addStoreBanner } from "@/app/actions/store-banners";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";

export function BannerForm() {
  const [state, formAction, isPending] = useActionState(addStoreBanner, null);
  const formRef = useRef<HTMLFormElement>(null);

  if (state?.success) {
    formRef.current?.reset();
  }

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <h2 className="font-bold text-charcoal text-lg mb-4">Upload New Banner</h2>
      {state?.error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm">{state.error}</div>}
      {state?.success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded text-sm">Banner uploaded successfully! It will appear once approved.</div>}

      <form ref={formRef} action={formAction} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <ImageUploader
            name="desktopImage"
            label="Desktop Image"
            aspectRatio="banner"
            required
            hint="Recommended: 1920×600. Shown on desktop & tablet."
          />
          <ImageUploader
            name="mobileImage"
            label="Mobile Image (optional)"
            aspectRatio="video"
            hint="Recommended: 1080×1350. Shown on phones. Falls back to desktop image if empty."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Heading</label>
            <input name="heading" placeholder="e.g., Black Friday Sale" className="w-full h-10 rounded border border-border px-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Description</label>
            <input name="description" placeholder="e.g., Up to 50% off" className="w-full h-10 rounded border border-border px-3 text-sm outline-none focus:border-primary" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Button Label</label>
            <input name="ctaLabel" placeholder="e.g., Shop Now" className="w-full h-10 rounded border border-border px-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Button URL</label>
            <input name="ctaUrl" placeholder="e.g., /search?q=deal" className="w-full h-10 rounded border border-border px-3 text-sm outline-none focus:border-primary" />
          </div>
        </div>

        <div className="bg-surface p-4 rounded-lg border border-border/50 space-y-3">
          <div>
            <h3 className="text-sm font-bold text-charcoal mb-1">Schedule (Optional)</h3>
            <p className="text-xs text-muted">Leave blank to show this banner immediately and forever. Set dates for campaign banners like Black Friday.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Start Date</label>
              <input name="startsAt" type="datetime-local" className="w-full h-10 rounded border border-border px-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">End Date</label>
              <input name="endsAt" type="datetime-local" className="w-full h-10 rounded border border-border px-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isPending} className="h-10 px-6 rounded-md bg-primary text-white font-bold text-sm hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2">
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
          {isPending ? "Uploading..." : "Upload Banner"}
        </button>
      </form>
    </div>
  );
}