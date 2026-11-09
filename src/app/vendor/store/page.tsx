import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Store, Image as ImageIcon, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorStorePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
    include: {
      _count: {
        select: {
          storeFollowers: true,
          products: true,
          storeBanners: true,
          storeCollections: true,
        },
      },
    },
  });

  if (!vendor) redirect("/vendor");

  // Safe fallbacks in case relations are missing or null
  const storeUrl = vendor.slug ? `/brand/${vendor.slug}` : "#";
  const followers = vendor._count?.storeFollowers ?? 0;
  const products = vendor._count?.products ?? 0;
  const banners = vendor._count?.storeBanners ?? 0;
  const collections = vendor._count?.storeCollections ?? 0;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-charcoal">Store Design</h1>
          <p className="text-sm text-muted mt-1">Customize your storefront, manage banners, and collections.</p>
        </div>
        {vendor.slug && (
          <Link 
            href={storeUrl} 
            target="_blank" 
            className="h-10 px-5 rounded-lg bg-primary text-white text-sm font-bold flex items-center hover:bg-primary-hover transition-colors"
          >
            View Storefront
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <p className="text-xs uppercase text-muted font-semibold">Followers</p>
          <p className="text-2xl font-extrabold text-charcoal mt-1">{followers}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <p className="text-xs uppercase text-muted font-semibold">Products</p>
          <p className="text-2xl font-extrabold text-charcoal mt-1">{products}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <p className="text-xs uppercase text-muted font-semibold">Banners</p>
          <p className="text-2xl font-extrabold text-charcoal mt-1">{banners}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-border shadow-sm">
          <p className="text-xs uppercase text-muted font-semibold">Collections</p>
          <p className="text-2xl font-extrabold text-charcoal mt-1">{collections}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
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
      </div>
    </div>
  );
}