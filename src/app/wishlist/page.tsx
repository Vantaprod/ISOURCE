import { getAllProducts } from "@/lib/catalog";
import { WishlistClient } from "./WishlistClient";
export default async function WishlistPage() {
  const allProducts = await getAllProducts();
  return <WishlistClient allProducts={allProducts} />;
}