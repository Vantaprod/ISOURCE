import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PromoForm } from "./PromoForm";
import { PromoRow } from "./PromoRow";
import { ChevronLeft } from "lucide-react";

export default async function AdminPromosPage() {
  const promos = await prisma.promoBanner.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/studio" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary transition-colors mb-2">
          <ChevronLeft size={16} /> Back to Studio
        </Link>
        <h1 className="text-2xl font-bold text-charcoal">Promo Banners</h1>
        <p className="text-sm text-muted">Manage the promotional panels on the homepage. If you have more than 2, they will rotate every 10 seconds.</p>
      </div>

      <PromoForm />

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-muted text-xs uppercase font-bold">
            <tr><th className="px-4 py-3">Pos</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Theme</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {promos.map((p) => (
              <PromoRow key={p.id} promo={p} />
            ))}
          </tbody>
        </table>
        {promos.length === 0 && <p className="p-8 text-center text-sm text-muted">No promo banners yet.</p>}
      </div>
    </div>
  );
}