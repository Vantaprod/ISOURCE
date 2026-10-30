"use client";
import { useState, useTransition } from "react";
import { updateBrandStatus } from "./actions";
import type { BrandStatus } from "@prisma/client";

const STATUSES: BrandStatus[] = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

export function BrandRow({ brand }: { brand: { id: string; name: string; ownerEmail: string; productCount: number; status: BrandStatus } }) {
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(brand.status);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as BrandStatus;
    setCurrentStatus(newStatus);
    startTransition(async () => { await updateBrandStatus(brand.id, newStatus); });
  }

  return (
    <tr className={`hover:bg-surface/30 transition-colors ${isPending ? "opacity-50" : ""}`}>
      <td className="px-5 py-4 font-semibold text-charcoal">{brand.name}</td>
      <td className="px-5 py-4 text-muted">{brand.ownerEmail}</td>
      <td className="px-5 py-4 font-medium">{brand.productCount}</td>
      <td className="px-5 py-4">
        <select value={currentStatus} onChange={handleChange} disabled={isPending} className={`h-8 rounded border border-border px-2 text-xs font-bold ${currentStatus === "APPROVED" ? "bg-success/10 text-success" : currentStatus === "SUSPENDED" || currentStatus === "REJECTED" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"}`}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
    </tr>
  );
}