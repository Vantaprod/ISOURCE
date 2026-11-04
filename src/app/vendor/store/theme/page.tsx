import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ThemeForm } from "@/components/store/ThemeForm";
import { Palette } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ThemePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) redirect("/vendor");

  const theme = await prisma.storeTheme.findUnique({ where: { vendorId: vendor.id } });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
          <Palette size={22} /> Store Theme
        </h1>
        <p className="text-sm text-muted">
          Customize your storefront's look. The Isource brand and navigation always remain visible.
        </p>
      </div>

      <ThemeForm initialTheme={theme} />
    </div>
  );
}