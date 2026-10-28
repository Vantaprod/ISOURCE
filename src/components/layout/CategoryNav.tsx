import Link from "next/link";
import { Menu } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
export function CategoryNav() {
  return (
    <nav aria-label="Categories" className="hidden md:block bg-charcoal text-white">
      <div className="mx-auto max-w-[1440px] px-4">
        <ul className="flex items-stretch text-[13px]">
          <li className="flex-shrink-0"><Link href="/categories" className="flex h-11 items-center gap-2 bg-primary hover:bg-primary-hover px-4 font-semibold text-white"><Menu size={16} /><span>All Categories</span></Link></li>
          {CATEGORIES.map((c) => (<li key={c.slug}><Link href={`/category/${c.slug}`} className="flex h-11 items-center px-3 whitespace-nowrap text-white/85 hover:text-primary transition-colors">{c.name}</Link></li>))}
        </ul>
      </div>
    </nav>
  );
}