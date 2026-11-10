import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AdminUserNav } from "@/components/admin/AdminUserNav";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const adminUser = session ? await prisma.user.findUnique({ where: { id: session.userId } }) : null;

  const session = await getSession();
  
  // 🚨 SECURITY CHECK: Only ADMIN can access this route
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-charcoal text-white p-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">Isource Admin Studio</h1>
        <Link href="/" className="text-sm hover:underline">Exit to Storefront</Link>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}