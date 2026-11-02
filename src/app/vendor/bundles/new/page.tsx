import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BundleForm } from "@/components/bundles/BundleForm";
import { ChevronLeft } from "lucide-react";

export default async function VendorNewBundlePage() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") redirect("/login");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) redirect("/vendor");

  const products = await prisma.product.findMany({ where: { vendorId: vendor.id, isActive: true } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/vendor" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors mb-2">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Create New Bundle</h1>
        <p className="text-sm text-muted">Combine multiple products into a single discounted package.</p>
      </div>
      <BundleForm products={products} />
    </div>
  );
}