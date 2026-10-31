import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BrandsDirectoryPage() {
  const brands = await prisma.brand.findMany({
    where: { status: "APPROVED" },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8">
      <nav className="text-xs text-muted mb-6 flex gap-2"><Link href="/" className="hover:text-primary">Home</Link><span>/</span><span className="text-charcoal font-medium">Brand Stores</span></nav>
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-charcoal">Brand Stores</h1>
        <p className="text-sm text-muted mt-2">Discover official brand stores and verified sellers on Isource.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {brands.map((b) => (
          <Link key={b.id} href={`/search?q=${b.name}`} className="group rounded-xl border border-border bg-white p-6 flex flex-col items-center justify-center hover:border-primary transition-colors min-h-[160px]">
            {b.logoUrl ? (
              <div className="relative w-32 h-12 mb-4">
                 <Image src={b.logoUrl} alt={b.name} fill sizes="128px" className="object-contain" />
              </div>
            ) : (
              <h3 className="text-xl font-extrabold text-charcoal mb-4 group-hover:text-primary transition-colors text-center">{b.name}</h3>
            )}
            <span className="text-xs text-muted mt-2 line-clamp-1">{b.description || "Verified Brand"}</span>
          </Link>
        ))}
        {brands.length === 0 && <p className="text-sm text-muted col-span-full">No verified brands yet.</p>}
      </div>
    </div>
  );
}