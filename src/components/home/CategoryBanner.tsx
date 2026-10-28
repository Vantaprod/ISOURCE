import Link from "next/link";
import Image from "next/image";
interface Props { title: string; subtitle: string; href: string; }
export function CategoryBanner({ title, subtitle, href }: Props) {
  return (
    <div className="relative overflow-hidden rounded-section border border-border bg-white flex items-center justify-between gap-3 p-4 md:p-5 min-h-[130px]">
      <div className="relative z-10"><h3 className="text-sm md:text-base font-bold text-charcoal leading-tight">{title}</h3><p className="mt-1 text-xs text-muted">{subtitle}</p><Link href={href} className="inline-block mt-3 h-8 leading-8 px-3 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary-hover">Shop Now →</Link></div>
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0"><Image src="/images/placeholder.svg" alt="" fill sizes="96px" className="object-contain" /></div>
    </div>
  );
}