import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { formatNairaShort } from "@/lib/format";
import Link from "next/link";
import { Store, Users, Eye, TrendingUp, Image as ImageIcon, Layers, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StoreOverviewPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
    include: {
      _count: { select: { products: true, storeFollowers: true, storeBanners: true, storeCollections: true } }
    }
  });

  if (!vendor) redirect("/vendor");

  // Calculate basic analytics (Views from PageVisit where path includes vendor.slug)
  const totalViews = await prisma.pageVisit.count({
    where: { path: { contains: `/brand/${vendor.slug}` } }
  });

  const storeUrl = `/brand/${vendor.slug}`;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-surface rounded-xl border border-border flex items-center justify-center overflow-hidden">
            {vendor.logoUrl ? (
              <img src={vendor.logoUrl} alt={vendor.name} className="h-full w-full object-cover" />
            ) : (
              <Store className="text-muted" size={24} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-charcoal">{vendor.name}</h1>
              {vendor.status === "APPROVED" && (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                  <CheckCircle2 size={12} /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-muted font-mono bg-surface px-2 py-1 rounded inline-block">
              isource.com{storeUrl}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={storeUrl} target="_blank" className="h-10 px-4 rounded-lg bg-charcoal text-white text-sm font-bold flex items-center justify-center hover:bg-black transition-colors">
            Visit Store
          </Link>
          <Link href="/vendor/store/preview" className="h-10 px-4 rounded-lg border border-charcoal text-charcoal text-sm font-bold flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors">
            Preview
          </Link>
          <Link href="/vendor/store/banners" className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center hover:bg-primary-hover transition-colors">
            Edit Store
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-border">
          <div className="flex items-center gap-2 text-muted mb-2"><Eye size={16} /> <span className="text-xs font-bold uppercase">Store Visitors</span></div>
          <p className="text-3xl font-extrabold text-charcoal">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border">
          <div className="flex items-center gap-2 text-muted mb-2"><Users size={16} /> <span className="text-xs font-bold uppercase">Followers</span></div>
          <p className="text-3xl font-extrabold text-charcoal">{vendor._count.storeFollowers}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border">
          <div className="flex items-center gap-2 text-muted mb-2"><Store size={16} /> <span className="text-xs font-bold uppercase">Products</span></div>
          <p className="text-3xl font-extrabold text-charcoal">{vendor._count.products}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border">
          <div className="flex items-center gap-2 text-muted mb-2"><TrendingUp size={16} /> <span className="text-xs font-bold uppercase">Status</span></div>
          <p className="text-xl font-extrabold text-primary">{vendor.status}</p>
        </div>
      </div>

      {/* Quick Actions & Setup Checklist */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border">
          <h2 className="font-bold text-charcoal text-lg mb-4">Storefront Setup</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <ImageIcon size={18} className={vendor._count.storeBanners > 0 ? "text-green-600" : "text-muted"} />
                <span className="text-sm font-medium text-charcoal">Upload Hero Banners</span>
              </div>
              <Link href="/vendor/store/banners" className="text-xs font-bold text-primary hover:underline">
                {vendor._count.storeBanners > 0 ? "Manage" : "Add"}
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <Layers size={18} className={vendor._count.storeCollections > 0 ? "text-green-600" : "text-muted"} />
                <span className="text-sm font-medium text-charcoal">Create Collections</span>
              </div>
              <Link href="/vendor/store/collections" className="text-xs font-bold text-primary hover:underline">
                {vendor._count.storeCollections > 0 ? "Manage" : "Add"}
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border">
          <h2 className="font-bold text-charcoal text-lg mb-4">Recent Activity</h2>
          <div className="text-sm text-muted text-center py-8">
            No recent activity recorded.
          </div>
        </div>
      </div>

    </div>
  );
}