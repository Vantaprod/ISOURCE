"use client";
import Image from "next/image";
import { useTransition } from "react";
import { toggleBanner, deleteBanner } from "./actions";

interface BannerData { id: string; title: string; imageUrl: string; ctaLabel: string | null; ctaUrl: string | null; position: number; isActive: boolean; startDate: string | null; endDate: string | null; }

export function BannerRow({ banner }: { banner: BannerData }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr className={isPending ? "opacity-50" : ""}>
      <td className="px-4 py-3 font-mono text-xs">{banner.position}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-20 rounded border border-border overflow-hidden flex-shrink-0"><Image src={banner.imageUrl} alt="" fill sizes="80px" className="object-cover" /></div>
          <span className="font-medium text-charcoal">{banner.title}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-muted">{banner.ctaLabel ? <>{banner.ctaLabel} → {banner.ctaUrl}</> : "—"}</td>
      <td className="px-4 py-3 text-[10px] text-muted">{banner.startDate && banner.endDate ? `${new Date(banner.startDate).toLocaleDateString("en-NG")} – ${new Date(banner.endDate).toLocaleDateString("en-NG")}` : "Always"}</td>
      <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${banner.isActive ? "bg-success/10 text-success" : "bg-muted/10 text-muted"}`}>{banner.isActive ? "ACTIVE" : "INACTIVE"}</span></td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          <button onClick={() => startTransition(async () => { await toggleBanner(banner.id, !banner.isActive); })} disabled={isPending} className="text-[10px] text-primary hover:underline">{banner.isActive ? "Disable" : "Enable"}</button>
          <button onClick={() => { if (confirm("Delete this banner?")) startTransition(async () => { await deleteBanner(banner.id); }); }} disabled={isPending} className="text-[10px] text-danger hover:underline">Delete</button>
        </div>
      </td>
    </tr>
  );
}