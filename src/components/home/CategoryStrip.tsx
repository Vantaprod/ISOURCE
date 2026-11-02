import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Sun, Tv, Smartphone, Laptop, Home, Car, ShoppingCart, Shirt, Sparkles, Grid } from "lucide-react";

// This function maps the database category name to a beautiful icon
function getCategoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("solar") || n.includes("power")) return <Sun size={24} />;
  if (n.includes("electronic")) return <Tv size={24} />;
  if (n.includes("phone")) return <Smartphone size={24} />;
  if (n.includes("computer")) return <Laptop size={24} />;
  if (n.includes("home") || n.includes("kitchen")) return <Home size={24} />;
  if (n.includes("automotive")) return <Car size={24} />;
  if (n.includes("grocer")) return <ShoppingCart size={24} />;
  if (n.includes("beauty") || n.includes("care")) return <Sparkles size={24} />;
  if (n.includes("fashion")) return <Shirt size={24} />;
  return <Grid size={24} />; // Default fallback icon
}

export async function CategoryStrip() {
  const categories = await prisma.category.findMany({
    take: 10,
    orderBy: { name: "asc" }
  });

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6">
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`} className="flex flex-col items-center p-4 rounded-xl border border-border bg-white hover:border-primary transition-colors text-center group">
            <div className="h-12 w-12 rounded-full bg-surface text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors overflow-hidden">
              {cat.imageUrl ? (
                <Image src={cat.imageUrl} alt={cat.name} width={32} height={32} className="object-contain" />
              ) : (
                getCategoryIcon(cat.name)
              )}
            </div>
            <span className="text-xs font-bold text-charcoal group-hover:text-primary transition-colors">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}