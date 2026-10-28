import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";
const button = cva("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap", { variants: { variant: { primary: "bg-primary text-white hover:bg-primary-hover", outline: "border border-border bg-white text-charcoal hover:bg-surface", ghost: "text-charcoal hover:bg-surface", danger: "bg-danger text-white hover:bg-danger/90" }, size: { sm: "h-9 px-3 text-sm", md: "h-11 px-4 text-sm", lg: "h-12 px-6 text-base" } }, defaultVariants: { variant: "primary", size: "md" } });
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button> & { asChild?: false };
type LinkButtonProps = VariantProps<typeof button> & { asChild: true; href: string; children: ReactNode; className?: string; };
export function Button(props: ButtonProps | LinkButtonProps) {
  if ("asChild" in props && props.asChild) { const { href, children, variant, size, className } = props; return <Link href={href} className={cn(button({ variant, size }), className)}>{children}</Link>; }
  const { variant, size, className, ...rest } = props as ButtonProps;
  return <button className={cn(button({ variant, size }), className)} {...rest} />;
}