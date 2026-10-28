import { discountPercent, formatNairaShort } from "@/lib/format";
import { cn } from "@/lib/cn";
export function Price({ priceKobo, originalKobo, size = "md", className }: { priceKobo: number; originalKobo?: number; size?: "sm" | "md" | "lg"; className?: string; }) {
  const pct = discountPercent(priceKobo, originalKobo);
  const sizes = { sm: { price: "text-sm", old: "text-xs" }, md: { price: "text-base", old: "text-xs" }, lg: { price: "text-2xl", old: "text-sm" } } as const;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-charcoal", sizes[size].price)}>{formatNairaShort(priceKobo)}</span>
      {originalKobo && originalKobo > priceKobo && (<><span className={cn("text-muted line-through", sizes[size].old)}>{formatNairaShort(originalKobo)}</span>{pct !== null && (<span className={cn("font-medium text-danger", sizes[size].old)}>-{pct}%</span>)}</>)}
    </div>
  );
}