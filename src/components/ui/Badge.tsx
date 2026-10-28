import { cn } from "@/lib/cn";
export function Badge({ children, tone = "primary", className }: { children: React.ReactNode; tone?: "primary" | "success" | "danger" | "warning" | "neutral"; className?: string; }) {
  const tones = { primary: "bg-primary text-white", success: "bg-success text-white", danger: "bg-danger text-white", warning: "bg-warning text-white", neutral: "bg-surface text-charcoal" } as const;
  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}