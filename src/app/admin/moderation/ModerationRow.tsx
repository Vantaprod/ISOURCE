"use client";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Check, X, AlertTriangle } from "lucide-react";
import { moderateProduct } from "./actions";
import { formatNairaShort } from "@/lib/format";

export function ModerationRow({ product }: { product: { id: string; name: string; slug: string; image: string; priceKobo: number; vendorName: string; status: string } }) {
  const [isPending, startTransition] = useTransition();

  function handle(status: "APPROVED" | "REJECTED" | "NEEDS_REVISION") {
    startTransition(async () => { await moderateProduct(product.id, status); });
  }

  return (
    <tr className={isPending ? "opacity-50" : ""}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded border border-border overflow-hidden flex-shrink-0">
            <Image src={product.image} alt="" fill sizes="40px" className="object-contain p-1" />
          </div>
          <Link href={`/product/${product.slug}`} className="font-medium text-charcoal hover:text-primary line-clamp-1">{product.name}</Link>
        </div>
      </td>
      <td className="px-4 py-3 text-muted">{product.vendorName}</td>
      <td className="px-4 py-3 font-semibold">{formatNairaShort(product.priceKobo)}</td>
      <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded bg-warning/10 text-warning text-[10px] font-bold">{product.status}</span></td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <button onClick={() => handle("APPROVED")} disabled={isPending} className="h-7 px-2 rounded bg-success text-white text-[10px] font-bold flex items-center gap-1"><Check size={10} /> Approve</button>
          <button onClick={() => handle("NEEDS_REVISION")} disabled={isPending} className="h-7 px-2 rounded bg-warning text-white text-[10px] font-bold flex items-center gap-1"><AlertTriangle size={10} /> Revise</button>
          <button onClick={() => handle("REJECTED")} disabled={isPending} className="h-7 px-2 rounded bg-danger text-white text-[10px] font-bold flex items-center gap-1"><X size={10} /> Reject</button>
        </div>
      </td>
    </tr>
  );
}