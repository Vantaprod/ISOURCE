import { ShieldCheck, Lock, Truck, RotateCcw } from "lucide-react";
const items = [{ icon: ShieldCheck, title: "Trusted Sellers", sub: "Verified and reliable" }, { icon: Lock, title: "Secure Payments", sub: "Paystack & Flutterwave" }, { icon: Truck, title: "Fast Delivery", sub: "Across Nigeria" }, { icon: RotateCcw, title: "Easy Returns", sub: "Hassle-free policy" }];
export function TrustBar() {
  return (
    <section className="bg-white border-y border-border"><div className="mx-auto max-w-[1440px] px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(({ icon: Icon, title, sub }) => (<div key={title} className="flex items-center gap-3"><span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary"><Icon size={20} strokeWidth={2} /></span><div><p className="text-sm font-semibold text-charcoal">{title}</p><p className="text-xs text-muted">{sub}</p></div></div>))}
    </div></section>
  );
}