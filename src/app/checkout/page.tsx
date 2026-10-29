"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronLeft, Lock, AlertTriangle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products"; // Keep for detailed display, but server uses DB
import { formatNairaShort } from "@/lib/format";
import {
  checkoutSchema, NIGERIAN_STATES, DELIVERY_LABELS, DELIVERY_METHODS,
  PAYMENT_LABELS, PAYMENT_METHODS, deliveryFeeKobo,
  type CheckoutFormData
} from "@/lib/checkout-schema";
import { placeOrder } from "./actions";

const initialForm: CheckoutFormData = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "Lagos",
  instructions: "",
  deliveryMethod: "home-delivery",
  paymentMethod: "paystack",
};

export default function CheckoutPage() {
  const { lines, ready, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Build detailed items for display (server will re-validate prices)
  const detailed = useMemo(() => {
    return lines.flatMap((line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) return [];
      const variant = line.variantId ? product.variants?.find((v) => v.id === line.variantId) : undefined;
      const unitKobo = variant?.priceKobo ?? product.priceKobo;
      return [{
        key: `${line.productId}::${line.variantId ?? "base"}`,
        productId: line.productId,
        variantId: line.variantId,
        qty: line.qty,
        name: product.name,
        variantLabel: variant?.label,
        image: product.images[0],
        unitKobo,
        lineTotalKobo: unitKobo * line.qty,
      }];
    });
  }, [lines]);

  const subtotalKobo = detailed.reduce((s, l) => s + l.lineTotalKobo, 0);
  const deliveryKobo = deliveryFeeKobo(form.deliveryMethod, subtotalKobo);
  const totalKobo = subtotalKobo + deliveryKobo;
  const qtySum = detailed.reduce((s, l) => s + l.qty, 0);

  function setField<K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "_form");
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    if (detailed.length === 0) {
      setErrors({ _form: "Your cart is empty." });
      return;
    }

    setSubmitting(true);
    
    // Call server action
    const result = await placeOrder(form, lines);

    if (result.success && result.orderNumber) {
      clear(); // wipe cart
      router.push(`/checkout/confirmation/${result.orderNumber}`);
    } else {
      setErrors({ _form: result.error || "Failed to place order." });
      setSubmitting(false);
    }
  }

  if (!ready) {
    return <div className="mx-auto max-w-[1440px] px-4 py-16 text-sm text-muted">Loading checkout…</div>;
  }
  if (submitting) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
        <p className="text-sm text-muted">Processing your order securely…</p>
      </div>
    );
  }
  if (detailed.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 text-center">
        <p className="text-charcoal font-medium">Your cart is empty</p>
        <p className="text-sm text-muted mt-1">Add items before checking out.</p>
        <Link href="/" className="inline-block mt-4 h-10 px-4 leading-10 rounded bg-primary text-white text-sm font-medium hover:bg-primary-hover">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 md:py-10">
      <nav className="text-xs text-muted mb-4">
        <Link href="/cart" className="hover:text-primary inline-flex items-center gap-1"><ChevronLeft size={14} /> Back to cart</Link>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Checkout</h1>

      <div className="rounded-md border border-warning/30 bg-warning/10 p-3 mb-6 text-xs text-charcoal flex gap-2">
        <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-warning">Demo checkout:</strong> This form saves a real draft order to the database. Real payment processing is not configured.
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-6">
            <Fieldset title="Contact information">
              <Field label="Email" required error={errors.email}>
                <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} aria-invalid={!!errors.email} className={inputCls(!!errors.email)} placeholder="you@example.com" autoComplete="email" />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <input type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} aria-invalid={!!errors.phone} className={inputCls(!!errors.phone)} placeholder="08012345678" autoComplete="tel" />
              </Field>
            </Fieldset>

            <Fieldset title="Delivery address">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First name" required error={errors.firstName}>
                  <input type="text" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} aria-invalid={!!errors.firstName} className={inputCls(!!errors.firstName)} autoComplete="given-name" />
                </Field>
                <Field label="Last name" required error={errors.lastName}>
                  <input type="text" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} aria-invalid={!!errors.lastName} className={inputCls(!!errors.lastName)} autoComplete="family-name" />
                </Field>
              </div>
              <Field label="Street address" required error={errors.address}>
                <input type="text" value={form.address} onChange={(e) => setField("address", e.target.value)} aria-invalid={!!errors.address} className={inputCls(!!errors.address)} placeholder="House number, street, area" autoComplete="street-address" />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="City" required error={errors.city}>
                  <input type="text" value={form.city} onChange={(e) => setField("city", e.target.value)} aria-invalid={!!errors.city} className={inputCls(!!errors.city)} autoComplete="address-level2" />
                </Field>
                <Field label="State" required error={errors.state}>
                  <select value={form.state} onChange={(e) => setField("state", e.target.value)} aria-invalid={!!errors.state} className={inputCls(!!errors.state)}>
                    {NIGERIAN_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </Field>
              </div>
              <Field label="Delivery instructions" error={errors.instructions} hint="Optional">
                <textarea value={form.instructions ?? ""} onChange={(e) => setField("instructions", e.target.value)} rows={2} className={textareaCls(!!errors.instructions)} placeholder="Landmark, gate code, preferred time…" />
              </Field>
            </Fieldset>

            <Fieldset title="Delivery method">
              <div className="space-y-2">
                {DELIVERY_METHODS.map((m) => {
                  const meta = DELIVERY_LABELS[m];
                  const fee = deliveryFeeKobo(m, subtotalKobo);
                  const active = form.deliveryMethod === m;
                  return (
                    <label key={m} className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"}`}>
                      <input type="radio" name="deliveryMethod" value={m} checked={active} onChange={() => setField("deliveryMethod", m)} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-charcoal">{meta.label}</p>
                          <span className="text-sm font-semibold text-charcoal whitespace-nowrap">{fee === 0 ? "Free" : formatNairaShort(fee)}</span>
                        </div>
                        <p className="text-xs text-muted mt-0.5">{meta.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </Fieldset>

            <Fieldset title="Payment method">
              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => {
                  const meta = PAYMENT_LABELS[m];
                  const active = form.paymentMethod === m;
                  return (
                    <label key={m} className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"}`}>
                      <input type="radio" name="paymentMethod" value={m} checked={active} onChange={() => setField("paymentMethod", m)} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal">{meta.label}</p>
                        <p className="text-xs text-muted mt-0.5">{meta.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-muted mt-2 inline-flex items-center gap-1">
                <Lock size={11} /> Payments are not processed in this demo. Selecting a method records your intent only.
              </p>
            </Fieldset>
          </div>

          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-lg border border-border bg-white">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Order summary</h2>
                <p className="text-xs text-muted mt-0.5">{qtySum} item{qtySum === 1 ? "" : "s"}</p>
              </div>
              <ul className="max-h-72 overflow-y-auto divide-y divide-border">
                {detailed.map((l) => (
                  <li key={l.key} className="flex gap-3 p-3">
                    <div className="relative w-14 h-14 rounded bg-surface overflow-hidden flex-shrink-0">
                      <Image src={l.image} alt={l.name} fill sizes="56px" className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-charcoal line-clamp-2">{l.name}</p>
                      {l.variantLabel && <p className="text-[10px] text-muted mt-0.5">{l.variantLabel}</p>}
                      <p className="text-xs text-muted mt-0.5">Qty {l.qty}</p>
                    </div>
                    <p className="text-xs font-semibold text-charcoal whitespace-nowrap">{formatNairaShort(l.lineTotalKobo)}</p>
                  </li>
                ))}
              </ul>
              <dl className="p-4 space-y-2 text-sm border-t border-border">
                <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatNairaShort(subtotalKobo)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{deliveryKobo === 0 ? "Free" : formatNairaShort(deliveryKobo)}</dd></div>
                <div className="flex justify-between border-t border-border pt-2 mt-2 font-semibold"><dt>Total</dt><dd>{formatNairaShort(totalKobo)}</dd></div>
              </dl>
              <div className="p-4 border-t border-border">
                {errors._form && <p className="text-xs text-danger mb-2">{errors._form}</p>}
                <button type="submit" disabled={submitting} className="w-full h-11 rounded bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed">
                  Place order (demo)
                </button>
                <p className="text-[10px] text-muted text-center mt-2">No charge will be made. See demo notice above.</p>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

function inputCls(invalid: boolean) {
  return `h-10 w-full rounded border px-3 text-sm bg-white outline-none focus:border-primary ${invalid ? "border-danger" : "border-border"}`;
}
function textareaCls(invalid: boolean) {
  return `w-full rounded border px-3 py-2 text-sm bg-white outline-none focus:border-primary resize-none ${invalid ? "border-danger" : "border-border"}`;
}
function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-white p-4 md:p-5">
      <h2 className="font-semibold mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
function Field({ label, error, required, hint, children }: { label: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-charcoal mb-1">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
        {hint && <span className="text-muted font-normal ml-1">({hint})</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}