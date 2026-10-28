import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
interface Props { title: string; subtitle: string; href: string; tone: "orange" | "cream"; }
export function PromotionBanner({ title, subtitle, href, tone }: Props) {
  const bg = tone === "orange" ? "bg-primary text-white" : "bg-cream text-charcoal";
  const btn = tone === "orange" ? "bg-white text-charcoal hover:bg-white/90" : "bg-primary text-white hover:bg-primary-hover";
  const sub = tone === "orange" ? "text-white/90" : "text-charcoal/70";
  return (
    <div className={`relative overflow-hidden rounded-section ${bg} flex items-center justify-between gap-4 p-6 md:p-8 min-h-[170px] md:min-h-[200px]`}>
      <div className="relative z-10 max-w-[55%]"><h3 className="text-xl md:text-2xl font-bold leading-tight">{title}</h3><p className={`mt-1 text-sm ${sub}`}>{subtitle}</p><Link href={href} className={`inline-flex items-center gap-2 mt-4 h-9 px-4 rounded-md text-xs md:text-sm font-semibold ${btn} transition-colors`}>Shop Now <ArrowRight size={14} /></Link></div>
      <div className="relative w-[42%] h-[140px] md:h-[170px] flex-shrink-0"><Image src="/images/placeholder.svg" alt="" fill sizes="240px" className="object-contain opacity-90" /></div>
    </div>
  );
}