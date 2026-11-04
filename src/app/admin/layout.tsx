export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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