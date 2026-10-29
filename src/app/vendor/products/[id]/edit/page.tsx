"use client";
import { useActionState, use, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { updateProduct } from "@/app/actions/vendor";
import { CATEGORIES } from "@/data/categories";
import { ProductForm } from "../../ProductForm";

interface ProductEditData {
  name: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  sku: string;
  priceNaira: number;
  originalPriceNaira?: number;
  stock: number;
  imageUrl: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<ProductEditData | null>(null);
  const [loading, setLoading] = useState(true);

  const updateActionWithId = updateProduct.bind(null, id);
  const [state, formAction, isPending] = useActionState(updateActionWithId, null);

  useEffect(() => {
    fetch(`/api/vendor/products/${id}`)
      .then((res) => res.json())
      .then((data) => { setInitialData(data as ProductEditData); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-sm text-muted">Loading product…</div>;
  if (!initialData) return <div className="text-sm text-danger">Product not found or unauthorized.</div>;

  return (
    <div className="max-w-2xl">
      <nav className="mb-4">
        <Link href="/vendor" className="text-xs text-muted hover:text-primary inline-flex items-center gap-1">
          <ChevronLeft size={14} /> Back to Inventory
        </Link>
      </nav>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      {state?.error && (
        <div className="rounded-md border border-danger/30 bg-danger/10 p-3 mb-6 text-sm text-danger flex items-center gap-2">
          <AlertTriangle size={16} /> {state.error}
        </div>
      )}

      <ProductForm
        formAction={formAction}
        isPending={isPending}
        categories={CATEGORIES}
        initialData={initialData}
      />
    </div>
  );
}