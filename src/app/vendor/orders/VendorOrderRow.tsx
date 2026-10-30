"use client";
import { useState, useTransition } from "react";
import { updateItemFulfillment } from "@/app/actions/vendor-orders";
import type { FulfillmentStatus } from "@prisma/client";
import { formatNairaShort } from "@/lib/format";

const STATUSES: FulfillmentStatus[] = ["PENDING", "PROCESSING", "DISPATCHED", "DELIVERED"];

export function VendorOrderRow({ item }: { item: { id: string; orderNumber: string; productName: string; qty: number; lineTotalKobo: number; status: FulfillmentStatus } }) {
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(item.status);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as FulfillmentStatus;
    setCurrentStatus(newStatus);
    startTransition(async () => {
      await updateItemFulfillment(item.id, newStatus);
    });
  }

  return (
    <tr className={`hover:bg-surface/50 ${isPending ? "opacity-50" : ""}`}>
      <td className="px-4 py-3 font-mono font-medium">{item.orderNumber}</td>
      <td className="px-4 py-3">
        <p className="text-charcoal font-medium truncate max-w-[200px]">{item.productName}</p>
      </td>
      <td className="px-4 py-3">{item.qty}</td>
      <td className="px-4 py-3 font-semibold">{formatNairaShort(item.lineTotalKobo)}</td>
      <td className="px-4 py-3">
        <select
          value={currentStatus}
          onChange={handleChange}
          disabled={isPending}
          className={`h-8 rounded border border-border px-2 text-xs font-semibold ${
            currentStatus === "DELIVERED" ? "bg-success/10 text-success" :
            currentStatus === "PENDING" ? "bg-warning/10 text-warning" :
            "bg-primary/10 text-primary"
          }`}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
    </tr>
  );
}