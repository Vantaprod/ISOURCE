import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const pending = await prisma.category.findMany({
    where: { status: "PENDING" },
    include: { parent: true },
    orderBy: { createdAt: "desc" }
  });

  async function approve(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.category.update({ where: { id }, data: { status: "APPROVED" } });
    revalidatePath("/admin/categories");
  }

  async function reject(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-extrabold text-charcoal mb-6">Category Requests</h1>
      
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        {pending.length === 0 ? (
          <div className="p-10 text-center text-muted">No pending category requests.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-5 py-3">Suggested Name</th>
                <th className="px-5 py-3">Parent Category</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((cat) => (
                <tr key={cat.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium text-charcoal">{cat.name}</td>
                  <td className="px-5 py-3 text-muted">{cat.parent?.name || "Root"}</td>
                  <td className="px-5 py-3 text-right flex justify-end gap-2">
                    <form action={approve}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button className="h-8 px-3 rounded bg-primary text-white text-xs font-bold hover:bg-primary-hover">Approve</button>
                    </form>
                    <form action={reject}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button className="h-8 px-3 rounded border border-danger text-danger text-xs font-bold hover:bg-danger hover:text-white">Reject</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}