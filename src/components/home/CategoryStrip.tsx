import Link from "next/link";
import { Sun, Tv, Smartphone, Laptop, Home, Car, ShoppingCart, Flower2, Shirt } from "lucide-react";

const CATEGORIES = [
  { name: "Solar & Power", slug: "solar-power", icon: Sun },
  { name: "Electronics", slug: "electronics", icon: Tv },
  { name: "Phones & Accessories", slug: "phones-accessories", icon: Smartphone },
  { name: "Computers", slug: "computers", icon: Laptop },
  { name: "Home & Kitchen", slug: "home-kitchen", icon: Home },
  { name: "Automotive", slug: "automotive", icon: Car },
  { name: "Groceries", slug: "groceries", icon: ShoppingCart },
  { name: "Beauty & Personal Care", slug: "beauty-personal-care", icon: Flower2 },
  { name: "Fashion", slug: "fashion", icon: Shirt },
];

export function CategoryStrip() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6 md:py-8">
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="group flex flex-col items-center justify-start gap-3 rounded-lg border border-border bg-white px-2 py-5 text-center hover:border-primary hover:shadow-sm transition-all">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <c.icon size={24} strokeWidth={1.5} />
            </span>
            <span className="text-xs font-medium text-charcoal leading-tight">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}