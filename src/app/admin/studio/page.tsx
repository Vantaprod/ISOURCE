import Link from "next/link";
import { Image as ImageIcon, Layers } from "lucide-react";

export default function StudioHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Storefront Studio</h1>
        <p className="text-sm text-muted">Manage your public homepage without a code deploy.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/studio/hero" className="rounded-xl border border-border bg-white p-6 hover:border-primary transition-colors group">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors"><ImageIcon size={24} /></div>
          <h2 className="font-bold text-charcoal text-lg mb-1">Hero Banners</h2>
          <p className="text-sm text-muted">Upload banners, set CTAs, schedule campaigns.</p>
        </Link>

        <Link href="/admin/studio/sections" className="rounded-xl border border-border bg-white p-6 hover:border-primary transition-colors group">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors"><Layers size={24} /></div>
          <h2 className="font-bold text-charcoal text-lg mb-1">Homepage Sections</h2>
          <p className="text-sm text-muted">Reorder, hide, or schedule the product rows on the homepage.</p>
        </Link>
      </div>
    </div>
  );
}