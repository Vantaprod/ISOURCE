"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { formatNairaShort } from "@/lib/format";
import { PAYMENT_LABELS, DELIVERY_LABELS, type OrderDraft } from "@/lib/checkout-schema";

const DRAFT_KEY = "isource.order-draft.v1";

export default function ConfirmationPage() {
  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) setDraft(JSON.parse(raw) as OrderDraft);
    } catch { /* ignore */ }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div className="mx-auto max-w-[1440px] px-4 py-16 text-sm text-muted">Loading…</div>;
  }
  if (!draft) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center">
        <p className="text-charcoal font-medium">No recent order found</p>
        <p className="text-sm text-muted mt-1">Start a new checkout to see this page.</p>
        <Link href="/" className="inline-block mt-4 h-10 px-4 leading-10 rounded bg-primary text-white text-sm font-medium hover:bg-primary-hover">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] px-4 py-8 md:py-12">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="mt-4 text-2xl md:text-3xl font-bold">Order received</h1>
        <p className="text-sm text-muted mt-1">
          Order number <span className="font-mono font-semibold text-charcoal">{draft.orderNumber}</span>
        </p>
      </div>

      <div className="mt-6 rounded-md border border-warning/40 bg-warning/10 p-3 text-xs text-charcoal flex gap-2">
        <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-warning">DEMO MODE — No payment processed.</strong>{" "}
          This is a draft saved only in this browser session. To make this real, a database and payment provider (Paystack / Flutterwave) need to be configured. You will not be charged, and no vendor has been notified.
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-white">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Items</h2>
        </div>
        <ul className="divide-y divide-border">
          {draft.items.map((it, idx) => (
            <li key={`${it.productId}-${idx}`} className="flex items-center gap-3 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-charcoal line-clamp-2">{it.name}</p>
                {it.variantLabel && <p className="text-xs text-muted mt-0.5">{it.variantLabel}</p>}
                <p className="text-xs text-muted mt-0.5">Qty {it.qty}</p>
              </div>
              <p className="text-sm font-semibold text-charcoal whitespace-nowrap">{formatNairaShort(it.lineTotalKobo)}</p>
            </li>
          ))}
        </ul>
        <dl className="p-4 space-y-2 text-sm border-t border-border">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatNairaShort(draft.subtotalKobo)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{draft.deliveryKobo === 0 ? "Free" : formatNairaShort(draft.deliveryKobo)}</dd></div>
          <div className="flex justify-between border-t border-border pt-2 mt-2 font-semibold"><dt>Total</dt><dd>{formatNairaShort(draft.totalKobo)}</dd></div>
        </dl>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-white p-4">
          <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Delivery</h3>
          <p className="text-sm font-medium text-charcoal">{draft.form.firstName} {draft.form.lastName}</p>
          <p className="text-sm text-charcoal/80 mt-1">{draft.form.address}</p>
          <p className="text-sm text-charcoal/80">{draft.form.city}, {draft.form.state}</p>
          <p className="text-sm text-charcoal/80 mt-1">{draft.form.phone}</p>
          <p className="text-sm text-charcoal/80">{draft.form.email}</p>
          <p className="text-xs text-muted mt-2">{DELIVERY_LABELS[draft.form.deliveryMethod].label}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <h3 className="text-xs uppercase tracking-wide text-muted mb-2">Payment</h3>
          <p className="text-sm font-medium text-charcoal">{PAYMENT_LABELS[draft.form.paymentMethod].label}</p>
          <p className="text-xs text-muted mt-1">{PAYMENT_LABELS[draft.form.paymentMethod].description}</p>
          <p className="text-xs text-muted mt-2">Status: <span className="font-semibold text-warning">Not paid (demo)</span></p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link href="/" className="flex-1 h-11 rounded bg-primary text-white text-sm font-semibold inline-flex items-center justify-center hover:bg-primary-hover">
          Continue shopping
        </Link>
        <button
          type="button"
          onClick={() => { try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } router.push("/checkout"); }}
          className="flex-1 h-11 rounded border border-border text-charcoal text-sm font-semibold hover:border-primary"
        >
          Start over
        </button>
      </div>
    </div>
  );
}