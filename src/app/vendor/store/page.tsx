import Link from "next/link";
import { Store, Image as ImageIcon, Layers, Palette } from "lucide-react";

// Absolutely no database calls. No auth checks.
export default function VendorStorePage() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Store Design</h1>
          <p className="text-sm text-muted mt-1">Customize your storefront, manage banners, and collections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Link href="/vendor/store/banners" className="group block bg-white p-6 rounded-xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all">
          <ImageIcon className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="font-bold text-lg text-charcoal">Store Banners</h3>
          <p className="text-sm text-muted mt-2">Upload hero sliders and promotional banners for your store.</p>
        </Link>

        <Link href="/vendor/store/collections" className="group block bg-white p-6 rounded-xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all">
          <Layers className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="font-bold text-lg text-charcoal">Collections</h3>
          <p className="text-sm text-muted mt-2">Group products into curated collections for easier browsing.</p>
        </Link>

        <Link href="/vendor/store/sections" className="group block bg-white p-6 rounded-xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all">
          <Store className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="font-bold text-lg text-charcoal">Store Sections</h3>
          <p className="text-sm text-muted mt-2">Arrange how different product categories appear on your storefront.</p>
        </Link>

        <Link href="/vendor/store/theme" className="group block bg-white p-6 rounded-xl border border-border shadow-sm hover:border-primary hover:shadow-md transition-all">
          <Palette className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="font-bold text-lg text-charcoal">Store Theme</h3>
          <p className="text-sm text-muted mt-2">Change the colors and button styles of your store.</p>
        </Link>
      </div>
    </div>
  );
}