import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditBrandForm } from "./EditBrandForm";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) notFound();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link href="/admin/brands" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors mb-4">
          <ChevronLeft size={16} /> Back to Brands
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Edit Brand: {brand.name}</h1>
        <p className="text-sm text-muted">Upload a logo and feature this brand on the storefront.</p>
      </div>
      <EditBrandForm brand={brand} />
    </div>
  );
}