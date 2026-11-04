import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { VendorSettingsForm } from "./VendorSettingsForm";

export const dynamic = "force-dynamic";

export default async function VendorSettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
  });

  if (!vendor) redirect("/vendor");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Store Settings</h1>
        <p className="text-sm text-muted">Manage your contact details and after-sales support.</p>
      </div>
      <VendorSettingsForm currentPhone={vendor.afterSalesPhone || ""} />
    </div>
  );
}