"use client";

import { CategorySelector } from "@/components/ui/CategorySelector";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { type Category } from "@/types/catalog";

interface Props {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  categories: Category[];
  initialData?: {
    name: string;
    shortDescription: string;
    description: string;
    categorySlug: string;
    sku: string;
    priceNaira: number;
    originalPriceNaira?: number;
    stock: number;
    imageUrl: string;
  };
}

export function ProductForm({ formAction, isPending, categories, initialData }: Props) {
  return (
    <form action={formAction} className="space-y-6 rounded-lg border border-border bg-white p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name *</label>
          <input name="name" defaultValue={initialData?.name} required className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Short Description *</label>
          <input name="shortDescription" defaultValue={initialData?.shortDescription} required className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Full Description *</label>
          <textarea name="description" defaultValue={initialData?.description} required rows={4} className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <CategorySelector
              name="categorySlug"
              categories={categories}
              defaultValue={initialData?.categorySlug || ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU *</label>
            <input name="sku" defaultValue={initialData?.sku} required className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price (₦) *</label>
            <input name="priceNaira" type="number" step="0.01" min="0" defaultValue={initialData?.priceNaira} required className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Orig. Price (₦)</label>
            <input name="originalPriceNaira" type="number" step="0.01" min="0" defaultValue={initialData?.originalPriceNaira} className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock *</label>
            <input name="stock" type="number" min="0" defaultValue={initialData?.stock} required className="h-10 w-full rounded border border-border px-3 text-sm outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-charcoal mb-2">Product Images (Max 12)</label>
          <ImageUploader name="imageFiles" maxImages={12} />
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end gap-3">
        <button type="submit" disabled={isPending} className="h-10 px-6 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed">
          {isPending ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}