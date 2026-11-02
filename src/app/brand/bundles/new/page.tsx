import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { BundleForm } from "@/components/bundles/BundleForm";
import { ChevronLeft } from "lucide-react";

export default async function BrandNewBundlePage() {
  const session = await getSession();
  if (!session || session.role !== "BRAND") redirect("/login");

  const brand = await prisma.brand.findFirst({ where: { ownerId: session.userId } });
  if (!brand) redirect("/brand");

  const products = await prisma.product.findMany({ where: { brandId: brand.id, isActive: true } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/brand" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors mb-2">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Create New Bundle</h1>
        <p className="text-sm text-muted">Combine multiple brand products into a single discounted package.</p>
      </div>
      <BundleForm products={products} />
    </div>
  );
}