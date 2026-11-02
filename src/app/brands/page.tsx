import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Store } from "lucide-react";

export default async function AllBrandsPage() {
  const brands = await prisma.brand.findMany({
    where: { status: "APPROVED" },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-charcoal">All Brand Stores</h1>
        <p className="text-sm text-muted mt-2">Discover official stores from top manufacturers.</p>
      </div>

      {brands.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <Store size={48} className="mx-auto mb-4 opacity-50" />
          <p>No brands available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div key={brand.id} className="rounded-xl border border-border bg-white p-5 flex flex-col items-center text-center">
              <div className="h-16 w-full flex items-center justify-center mb-4">
                {brand.logoUrl ? (
                  <Image src={brand.logoUrl} alt={brand.name} width={100} height={60} className="object-contain max-h-16" />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    {brand.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-charcoal mb-1">{brand.name}</h3>
              <p className="text-xs text-muted mb-4 line-clamp-2">{brand.tagline || "Quality products"}</p>
              <Link href={`/brand/${brand.slug}`} className="w-full mt-auto h-9 flex items-center justify-center rounded-md bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors">
                Visit Store
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}