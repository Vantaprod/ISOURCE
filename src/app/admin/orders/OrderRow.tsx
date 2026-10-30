"use client";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "./actions";
import type { OrderStatus } from "@prisma/client";
import { formatNairaShort } from "@/lib/format";
import { CreateShipmentModal } from "./CreateShipmentModal";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

export function OrderRow({ order }: { order: { id: string; orderNumber: string; email: string; date: string; totalKobo: number; status: OrderStatus } }) {
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(order.status);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as OrderStatus;
    setCurrentStatus(newStatus);
    startTransition(async () => {
      await updateOrderStatus(order.id, newStatus);
    });
  }

  return (
    <tr className={`hover:bg-surface/50 ${isPending ? "opacity-50" : ""}`}>
      <td className="px-4 py-3 font-mono font-medium">{order.orderNumber}</td>
      <td className="px-4 py-3 text-muted truncate max-w-[150px]">{order.email}</td>
      <td className="px-4 py-3 text-muted">{new Date(order.date).toLocaleDateString("en-NG", { dateStyle: "medium" })}</td>
      <td className="px-4 py-3 font-semibold">{formatNairaShort(order.totalKobo)}</td>
      <td className="px-4 py-3">
        <select
          value={currentStatus}
          onChange={handleChange}
          disabled={isPending}
          className="h-8 rounded border border-border bg-white px-2 text-xs font-semibold"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <CreateShipmentModal orderId={order.id} />
          <a href={`/checkout/confirmation/${order.orderNumber}`} className="text-xs text-primary hover:underline">View</a>
        </div>
      </td>
    </tr>
  );
}