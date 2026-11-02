"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  tagline: string | null;
}

export function FeaturedBrandsClient({ brands }: { brands: Brand[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (window.innerWidth >= 768 || brands.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % brands.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [brands.length]);

  if (brands.length === 0) return null;

  const BrandCard = ({ brand }: { brand: Brand }) => (
    <div className="rounded-xl border border-border bg-white p-5 flex flex-col justify-between shadow-sm">
      <div>
        <div className="h-12 w-full flex items-center justify-start mb-3">
          {brand.logoUrl ? (
            <Image src={brand.logoUrl} alt={brand.name} width={100} height={40} className="object-contain max-h-12 w-auto" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {brand.name.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="font-extrabold text-charcoal text-sm mb-1">{brand.name}</h3>
        <p className="text-xs text-muted mb-5 line-clamp-1">{brand.tagline || "Quality products"}</p>
      </div>
      <Link href={`/brand/${brand.slug}`} className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-bold text-white hover:bg-primary-hover transition-colors w-fit">
        Visit Store →
      </Link>
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <BrandCard brand={brands[activeIndex]} />
        {brands.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {brands.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
        )}
      </div>
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {brands.map((b) => (
          <BrandCard key={b.id} brand={b} />
        ))}
      </div>
    </>
  );
}