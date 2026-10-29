import { getAllProducts } from "@/lib/catalog";
import { CartClient } from "./CartClient";
export default async function CartPage() {
  const allProducts = await getAllProducts();
  return <CartClient allProducts={allProducts} />;
}