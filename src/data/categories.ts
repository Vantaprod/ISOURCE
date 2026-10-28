import type { Category } from "@/types/catalog";
export const CATEGORIES: Category[] = [
  { slug: "electronics", name: "Electronics", shortName: "Electronics", description: "TVs, audio, gadgets and everyday tech.", icon: "Tv" },
  { slug: "phones-accessories", name: "Phones & Accessories", shortName: "Phones", description: "Smartphones, cases, chargers and power banks.", icon: "Smartphone" },
  { slug: "computers", name: "Computers", shortName: "Computers", description: "Laptops, desktops, monitors and accessories.", icon: "Laptop" },
  { slug: "home-kitchen", name: "Home & Kitchen", shortName: "Home", description: "Appliances, cookware and home essentials.", icon: "Home" },
  { slug: "automotive", name: "Automotive", shortName: "Automotive", description: "Car care, tools and driving accessories.", icon: "Car" },
  { slug: "solar-power", name: "Solar & Power", shortName: "Solar", description: "Inverters, batteries, panels and power backup.", icon: "Sun" },
  { slug: "groceries", name: "Groceries", shortName: "Groceries", description: "Pantry staples, snacks and household food.", icon: "ShoppingBasket" },
  { slug: "beauty-personal-care", name: "Beauty & Personal Care", shortName: "Beauty", description: "Skincare, grooming and personal care.", icon: "Sparkles" },
  { slug: "fashion", name: "Fashion", shortName: "Fashion", description: "Clothing, footwear and accessories.", icon: "Shirt" },
];
export function getCategory(slug: string): Category | undefined { return CATEGORIES.find((c) => c.slug === slug); }