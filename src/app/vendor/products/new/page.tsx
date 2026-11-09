import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/vendor/ProductForm"; // Adjust this path if your ProductForm is located elsewhere
import { createProduct } from "@/app/actions/vendor"; // Adjust this if your action name is different

export default async function NewProductPage() {
  // 1. Fetch categories and brands from the database
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-charcoal">Add New Product</h1>
        <p className="text-sm text-muted mt-1">Fill in the details below to list a new item in your store.</p>
      </div>

      {/* 2. Pass the fetched data to your form */}
      <div className="bg-white border border-border rounded-xl p-6">
        <ProductForm 
          action={createProduct} 
          categories={categories} 
          brands={brands} 
        />
      </div>
    </div>
  );
}