import type { Category } from "@/types/catalog";

export const CATEGORIES: Category[] = [
  { slug: "solar-power", name: "Solar & Power", shortName: "Solar & Power", description: "Inverters, batteries, panels and power backup.", icon: "Sun" },
  { slug: "electronics", name: "Electronics", shortName: "Electronics", description: "TVs, audio, gadgets and everyday tech.", icon: "Tv" },
  { slug: "phones-accessories", name: "Phones & Accessories", shortName: "Phones & Accessories", description: "Smartphones, cases, chargers and power banks.", icon: "Smartphone" },
  { slug: "computers", name: "Computers", shortName: "Computers", description: "Laptops, desktops, monitors and accessories.", icon: "Laptop" },
  { slug: "home-kitchen", name: "Home & Kitchen", shortName: "Home & Kitchen", description: "Appliances, cookware and home essentials.", icon: "Home" },
  { slug: "automotive", name: "Automotive", shortName: "Automotive", description: "Car care, tools and driving accessories.", icon: "Car" },
  { slug: "fashion", name: "Fashion", shortName: "Fashion", description: "Clothing, footwear and accessories.", icon: "Shirt" },
  { slug: "groceries", name: "Groceries", shortName: "Groceries", description: "Pantry staples, snacks and household food.", icon: "ShoppingBasket" },
  { slug: "beauty-personal-care", name: "Beauty & Personal Care", shortName: "Beauty & Personal Care", description: "Skincare, grooming and personal care.", icon: "Sparkles" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}