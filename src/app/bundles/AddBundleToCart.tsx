"use client";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ShoppingCart } from "lucide-react";

export function AddBundleToCart({ bundleId }: { bundleId: string }) {
  const { addBundle } = useCart();
  const { toast } = useToast();

  return (
    <button 
      onClick={() => {
        addBundle(bundleId);
        toast("Bundle added to cart!");
      }} 
      className="w-full h-10 flex items-center justify-center gap-2 rounded-md bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
    >
      <ShoppingCart size={16} /> Add Bundle to Cart
    </button>
  );
}