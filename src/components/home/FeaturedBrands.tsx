import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Brand } from "@prisma/client";

const FeaturedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3H18L22 9L12 21L2 9L6 3Z" fill="#F07824" stroke="#242424" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M6 3L12 9M18 3L12 9M22 9H2M12 9V21" stroke="#242424" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export async function FeaturedBrands() {
  let brands: Brand[] = [];

  try {
    brands = await prisma.brand.findMany({
      where: { status: "APPROVED", isFeatured: true },
      take: 3,
    });
  } catch (error) {
    console.error("Failed to load featured brands:", error);
    return null;
  }

  if (brands.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-charcoal">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shadow-sm border border-primary/20">
            <FeaturedIcon />
          </span>
          Featured Brand Stores
        </h2>
        <Link href="/brands" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">See All <span aria-hidden="true">&rarr;</span></Link>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {brands.map((b: Brand) => (
          <div key={b.id} className="rounded-xl border border-border bg-white p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px] hover:shadow-md transition-shadow">
            <div className="relative z-10">
              {b.logoUrl ? (
                <Image src={b.logoUrl} alt={b.name} width={140} height={40} className="object-contain h-8 w-auto mb-2" />
              ) : (
                <h3 className="text-2xl font-extrabold text-charcoal mb-1">{b.name}</h3>
              )}
              <p className="text-sm text-muted mt-1 mb-4">{b.description || "Verified Brand Store"}</p>
              <Link href={`/brands/${b.slug}`} className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-white text-xs font-bold hover:bg-primary-hover">
                Visit Store <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-5">
               <Image src="/images/placeholder.svg" alt={b.name} fill sizes="128px" className="object-contain p-2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}