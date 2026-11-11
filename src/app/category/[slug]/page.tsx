import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Find the current category
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  // 2. Fetch all categories to build the tree
  const allCategories = await prisma.category.findMany({
    select: { id: true, parentId: true, name: true, slug: true },
  });

  // 3. Recursive helper to get the current ID + all descendant IDs
  function getDescendantIds(catId: string): string[] {
    const children = allCategories.filter((c) => c.parentId === catId);
    let ids = [catId];
    for (const child of children) {
      ids = ids.concat(getDescendantIds(child.id));
    }
    return ids;
  }

  const categoryIds = getDescendantIds(category.id);

  // 4. Fetch products that belong to this category OR any of its subcategories
  const products = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIds },
      isActive: true,
      approvalStatus: "APPROVED",
    },
    include: {
      images: { take: 1 },
      vendor: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100, // You can add pagination logic here later
  });

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-4 flex gap-2">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span className="text-charcoal font-medium">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-charcoal">{category.name}</h1>
        <p className="text-sm text-muted mt-2">
          {products.length} product{products.length === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="flex gap-8">
        {/* Optional Sidebar for Subcategories */}
        <aside className="w-64 hidden lg:block shrink-0">
          <h3 className="font-bold text-charcoal mb-4">Subcategories</h3>
          <ul className="space-y-2 text-sm text-muted">
            {allCategories
              .filter((c) => c.parentId === category.id)
              .map((sub) => (
                <li key={sub.id}>
                  <Link href={`/category/${sub.slug}`} className="hover:text-primary transition-colors">
                    {sub.name}
                  </Link>
                </li>
              ))}
            {allCategories.filter((c) => c.parentId === category.id).length === 0 && (
              <li>No subcategories</li>
            )}
          </ul>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="p-10 text-center bg-surface rounded-xl border border-border">
              <p className="text-muted">No products found in this category yet.</p>
            </div>
          ) : (
            <ProductGrid products={products as any} />
          )}
        </div>
      </div>
    </div>
  );
}