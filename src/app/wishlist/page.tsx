import { getAllProducts } from "@/lib/catalog";
import { BackButton } from "@/components/ui/BackButton";
import { WishlistClient } from "./WishlistClient";
import { BackButton } from "@/components/ui/BackButton";
export default async function WishlistPage() {
  const allProducts = await getAllProducts();
  return <WishlistClient allProducts={allProducts} />;
}