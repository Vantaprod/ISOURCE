import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { initializeStoreSections } from "@/app/actions/store-sections";
import { SectionsManager } from "./SectionsManager";
import { LayoutTemplate } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SectionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) redirect("/vendor");

  // Auto-initialize if vendor has no sections yet
  let sections = await prisma.storeSection.findMany({
    where: { vendorId: vendor.id },
    orderBy: { sortOrder: "asc" },
  });

  if (sections.length === 0) {
    await initializeStoreSections();
    sections = await prisma.storeSection.findMany({
      where: { vendorId: vendor.id },
      orderBy: { sortOrder: "asc" },
    });
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
          <LayoutTemplate size={22} /> Store Sections
        </h1>
        <p className="text-sm text-muted">
          Reorder or hide sections to control what appears on your public storefront.
          Customers see them top to bottom.
        </p>
      </div>

      <SectionsManager initialSections={sections} />
    </div>
  );
}