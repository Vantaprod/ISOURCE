import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";
import { createProduct } from "@/app/actions/vendor";

export const dynamic = "force-dynamic";

// Helper to build the nested tree from a flat database list
function buildCategoryTree(categories: any[]) {
  const map = new Map();
  const roots: any[] = [];

  categories.forEach((c) => map.set(c.id, { ...c, children: [] }));

  categories.forEach((c) => {
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId).children.push(map.get(c.id));
    } else {
      roots.push(map.get(c.id));
    }
  });

  return roots;
}

export default async function NewProductPage() {
  // 1. Fetch ALL categories flat from the DB (no deep includes needed)
  const flatCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  // 2. Build the tree in memory
  const categoryTree = buildCategoryTree(flatCategories);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Add New Product</h1>
        <p className="text-sm text-muted mt-1">Fill in the details below to list a new item in your store.</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <ProductForm 
          formAction={createProduct} 
          categories={categoryTree} 
          brands={brands} 
          isPending={false}
        />
      </div>
    </div>
  );
}