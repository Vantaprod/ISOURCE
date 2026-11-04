import Link from "next/link";
import { Store, LayoutDashboard, Image as ImageIcon, Layers, Settings, ArrowLeft, BarChart3 , Eye } from "lucide-react";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Store Sub-Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="rounded-xl bg-white border border-border overflow-hidden sticky top-24">
          <div className="p-4 border-b border-border bg-surface/50">
            <h2 className="font-extrabold text-charcoal text-sm flex items-center gap-2">
              <Store size={16} /> Storefront Manager
            </h2>
          </div>
          <ul className="py-2 text-sm font-medium text-muted">
            <li>
              <Link href="/vendor/store" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface hover:text-primary transition-colors">
                <LayoutDashboard size={16} /> Overview
              </Link>
            </li>
            <li>
              <Link href="/vendor/store/banners" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface hover:text-primary transition-colors">
                <ImageIcon size={16} /> Hero & Banners
              </Link>
            </li>
            <li>
              <Link href="/vendor/store/collections" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface hover:text-primary transition-colors">
                <Layers size={16} /> Collections
              </Link>
            </li>
            <li>
              <Link href="/vendor/store/sections" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface hover:text-primary transition-colors">
                <LayoutTemplate size={16} /> Sections
              </Link>
            </li>
            <li>
              <Link href="/vendor/store/analytics" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface hover:text-primary transition-colors">
                <BarChart3 size={16} /> Analytics
              </Link>
            </li>
            <li>
              
            <li>
              <Link href="/vendor/store/theme" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface hover:text-primary transition-colors">
                <Palette size={16} /> Theme
              </Link>
            </li>
            <Link href="/vendor/store/settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface hover:text-primary transition-colors">
                <Settings size={16} /> Settings
              </Link>
            </li>
            <li className="mt-2 pt-2 border-t border-border">
              <Link href="/vendor" className="flex items-center gap-3 px-4 py-2.5 text-charcoal hover:text-primary transition-colors">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}