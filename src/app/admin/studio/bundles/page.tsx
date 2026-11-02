import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BundleForm } from "@/components/bundles/BundleForm";
import { ChevronLeft } from "lucide-react";

export default async function AdminNewBundlePage() {
  const products = await prisma.product.findMany({ where: { isActive: true }, take: 100 });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/studio" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors mb-2">
          <ChevronLeft size={16} /> Back to Studio
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Create New Bundle</h1>
        <p className="text-sm text-muted">Platform-wide bundle creation.</p>
      </div>
      <BundleForm products={products} />
    </div>
  );
}