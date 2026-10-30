import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { BannerForm } from "./BannerForm";
import { BannerRow } from "./BannerRow";

export default async function AdminHeroPage() {
  const banners = await prisma.heroBanner.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Hero Banners</h1>
        <p className="text-sm text-muted">Manage the homepage hero slider. If empty, the default hero is shown.</p>
      </div>

      <BannerForm />

      {banners.length > 0 && (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase font-bold">
              <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Banner</th><th className="px-4 py-3">CTA</th><th className="px-4 py-3">Window</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {banners.map((b) => <BannerRow key={b.id} banner={{ ...b, createdAt: b.createdAt.toISOString(), updatedAt: b.updatedAt.toISOString(), startDate: b.startDate?.toISOString() || null, endDate: b.endDate?.toISOString() || null }} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}