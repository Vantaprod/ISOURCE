import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BannerForm } from "@/components/vendor/BannerForm";
import { BannerRow } from "./BannerRow";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StoreBannersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) redirect("/vendor");

  const banners = await prisma.storeBanner.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Hero & Banners</h1>
        <p className="text-sm text-muted">Manage the slides that appear at the top of your public storefront.</p>
      </div>

      <BannerForm />

      <div className="space-y-4">
        <h2 className="font-bold text-charcoal text-lg">Your Banners ({banners.length})</h2>
        {banners.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
            <ImageIcon size={40} className="mx-auto text-muted mb-4" />
            <h3 className="font-bold text-charcoal mb-1">No banners uploaded</h3>
            <p className="text-sm text-muted">Upload your first banner above to make your store look great.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {banners.map((b) => <BannerRow key={b.id} banner={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}