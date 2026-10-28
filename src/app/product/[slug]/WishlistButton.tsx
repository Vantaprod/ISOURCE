"use client";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export function WishlistButton({ productId }: { productId: string }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);
  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`h-10 px-4 rounded border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
        active ? "border-danger text-danger bg-danger/5 hover:bg-danger/10" : "border-border text-charcoal hover:border-primary hover:text-primary"
      }`}
    >
      <Heart size={16} fill={active ? "currentColor" : "none"} />
      {active ? "Saved" : "Save"}
    </button>
  );
}