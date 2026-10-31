import { ShieldCheck, Truck, RotateCcw, Box } from "lucide-react";

const items = [
  { icon: Box,        title: "Wide Selection",   sub: "Top brands & trusted sellers" },
  { icon: ShieldCheck, title: "Secure Shopping", sub: "Your data is safe with us" },
  { icon: Truck,       title: "Fast Delivery",   sub: "Across Nigeria" },
  { icon: RotateCcw,   title: "Easy Returns",    sub: "No hassle, no stress" },
];

export function TrustBar() {
  return (
    <section className="bg-white border-y border-border">
      <div className="mx-auto max-w-[1440px] px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-white text-primary shadow-sm">
              <Icon size={22} strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-bold text-charcoal">{title}</p>
              <p className="text-xs text-muted mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}