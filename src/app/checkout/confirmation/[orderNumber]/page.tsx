import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatNairaShort } from "@/lib/format";
import { PAYMENT_LABELS, DELIVERY_LABELS, type PaymentMethod, type DeliveryMethod } from "@/lib/checkout-schema";

export default async function ConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true }
  });

  if (!order) {
    notFound();
  }

  // Map Prisma enum back to the frontend keys for display
  const paymentKeyMap: Record<string, PaymentMethod> = {
    "PAYSTACK": "paystack",
    "FLUTTERWAVE": "flutterwave",
    "BANK_TRANSFER": "bank-transfer",
    "PAY_ON_DELIVERY": "pay-on-delivery",
  };
  const paymentKey = paymentKeyMap[order.paymentMethod] || "paystack";
  const deliveryKey = order.deliveryMethod as DeliveryMethod;

  return (
    <div className="mx-auto max-w-[720px] px-4 py-8 md:py-12">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold">Order confirmed</h1>
        <p className="text-sm text-muted mt-1">
          Order number <span className="font-mono font-semibold text-charcoal">{order.orderNumber}</span>
        </p>
      </div>

      <div className="mt-6 rounded-md border border-warning/40 bg-warning/10 p-3 text-xs text-charcoal flex gap-2">
        <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-warning">DEMO MODE — No payment processed.</strong>{" "}
          This order is saved in the database, but no money was taken. To make this real, configure Paystack or Flutterwave.
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-white">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Items</h2>
        </div>
        <ul className="divide-y divide-border">
          {order.items.map((it) => (
            <li key={it.id} className="flex items-center gap-3 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal line-clamp-2">{it.productName}</p>
                {it.variantLabel && <p className="text-xs text-muted mt-0.5">{it.variantLabel}</p>}
                <p className="text-xs text-muted mt-0.5">Qty {it.qty}</p>
              </div>
              <p className="text-sm font-semibold text-charcoal whitespace-nowrap">{formatNairaShort(it.lineTotalKobo)}</p>
            </li>
          ))}
        </ul>
        <dl className="p-4 space-y-2 text-sm border-t border-border">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatNairaShort(order.subtotalKobo)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{order.deliveryKobo === 0 ? "Free" : formatNairaShort(order.deliveryKobo)}</dd></div>
          <div className="flex justify-between border-t border-border pt-2 mt-2 font-semibold"><dt>Total</dt><dd>{formatNairaShort(order.totalKobo)}</dd></div>
        </dl>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-white p-4">
          <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Delivery</h3>
          <p className="text-sm font-medium text-charcoal">{order.shippingFirstName} {order.shippingLastName}</p>
          <p className="text-sm text-charcoal/80 mt-1">{order.shippingStreet}</p>
          <p className="text-sm text-charcoal/80">{order.shippingCity}, {order.shippingState}</p>
          <p className="text-sm text-charcoal/80 mt-1">{order.shippingPhone}</p>
          <p className="text-sm text-charcoal/80">{order.guestEmail}</p>
          <p className="text-xs text-muted mt-2">{DELIVERY_LABELS[deliveryKey]?.label || order.deliveryMethod}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Payment</h3>
          <p className="text-sm font-medium text-charcoal">{PAYMENT_LABELS[paymentKey]?.label || order.paymentMethod}</p>
          <p className="text-xs text-muted mt-1">{PAYMENT_LABELS[paymentKey]?.description}</p>
          <p className="text-xs text-muted mt-2">Status: <span className="font-semibold text-warning">Not paid (demo)</span></p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link href="/" className="flex-1 h-11 rounded bg-primary text-white text-sm font-semibold inline-flex items-center justify-center hover:bg-primary-hover">
          Continue shopping
        </Link>
        <Link href="/account" className="flex-1 h-11 rounded border border-border text-charcoal text-sm font-semibold hover:border-primary inline-flex items-center justify-center">
          View my orders
        </Link>
      </div>
    </div>
  );
}