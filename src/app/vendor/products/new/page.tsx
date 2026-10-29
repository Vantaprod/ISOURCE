"use client";
import { useActionState } from "react";
import Link from "next/link";
import { ChevronLeft, AlertTriangle } from "lucide-react";
import { createProduct } from "@/app/actions/vendor";
import { CATEGORIES } from "@/data/categories";
import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  const [state, formAction, isPending] = useActionState(
    createProduct, 
    null
  );

  return (
    <div className="max-w-2xl">
      <nav className="mb-4"><Link href="/vendor" className="text-xs text-muted hover:text-primary inline-flex items-center gap-1"><ChevronLeft size={14} /> Back to Inventory</Link></nav>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      {state?.error && (
        <div className="rounded-md border border-danger/30 bg-danger/10 p-3 mb-6 text-sm text-danger flex items-center gap-2">
          <AlertTriangle size={16} /> {state.error}
        </div>
      )}

      <ProductForm formAction={formAction} isPending={isPending} categories={CATEGORIES} />
    </div>
  );
}