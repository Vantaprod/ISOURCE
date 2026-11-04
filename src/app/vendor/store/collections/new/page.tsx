import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { CollectionForm } from "@/components/store/CollectionForm";

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) redirect("/vendor");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">New Collection</h1>
        <p className="text-sm text-muted">Create a new collection to organize your products.</p>
      </div>
      <CollectionForm mode="create" />
    </div>
  );
}