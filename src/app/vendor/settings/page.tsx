import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function VendorSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { vendor: true },
  });

  if (!user || !user.vendor) redirect("/vendor");

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-charcoal">Store Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your business profile and account security.</p>
      </div>

      <SettingsClient 
        initialData={{
          name: user.vendor.name,
          description: user.vendor.description || "",
          afterSalesPhone: user.vendor.afterSalesPhone || "",
          email: user.email,
        }} 
      />
    </div>
  );
}