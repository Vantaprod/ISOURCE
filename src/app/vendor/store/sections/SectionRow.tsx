"use client";
import { useState } from "react";
import { toggleSection } from "@/app/actions/store-sections";
import { Eye, EyeOff, ChevronUp, ChevronDown, GripVertical, Sparkles, Image as ImageIcon, Layers, Package, BookOpen, Star, ShieldCheck } from "lucide-react";

const SECTION_META: Record<string, { label: string; description: string; icon: any }> = {
  HERO:              { label: "Hero Banners",     description: "Your uploaded banner carousel",       icon: ImageIcon },
  COLLECTIONS:       { label: "Collections",      description: "All your product collections",        icon: Layers },
  FEATURED_PRODUCTS: { label: "Featured Products",description: "Handpicked products to highlight",    icon: Sparkles },
  ALL_PRODUCTS:      { label: "All Products",     description: "Full product grid",                   icon: Package },
  BRAND_STORY:       { label: "Brand Story",      description: "Your store description",              icon: BookOpen },
  REVIEWS:           { label: "Customer Reviews", description: "Recent testimonials",                 icon: Star },
  WARRANTY_INFO:     { label: "Warranty Info",    description: "Support & warranty details",          icon: ShieldCheck },
};

interface Props {
  section: any;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  loading: boolean;
}

export function SectionRow({ section, index, total, onMoveUp, onMoveDown, loading }: Props) {
  const [toggling, setToggling] = useState(false);
  const meta = SECTION_META[section.type] || { label: section.type, description: "", icon: Layers };
  const Icon = meta.icon;

  async function handleToggle() {
    setToggling(true);
    await toggleSection(section.id, section.isActive);
    setToggling(false);
  }

  return (
    <div className={`rounded-xl border bg-white p-4 flex items-center gap-3 transition-opacity ${section.isActive ? "border-border" : "border-border/50 opacity-60"}`}>
      <div className="text-muted cursor-grab"><GripVertical size={18} /></div>

      <div className="h-10 w-10 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
        <Icon size={18} className="text-charcoal" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-charcoal text-sm">{meta.label}</h3>
        <p className="text-xs text-muted">{meta.description}</p>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={onMoveUp} disabled={index === 0 || loading} className="h-8 w-8 rounded hover:bg-surface flex items-center justify-center disabled:opacity-30">
          <ChevronUp size={16} />
        </button>
        <button onClick={onMoveDown} disabled={index === total - 1 || loading} className="h-8 w-8 rounded hover:bg-surface flex items-center justify-center disabled:opacity-30">
          <ChevronDown size={16} />
        </button>
        <button onClick={handleToggle} disabled={toggling} className="h-8 px-3 rounded border border-border text-xs font-bold hover:bg-surface flex items-center gap-1 ml-2">
          {section.isActive ? <><EyeOff size={12} /> Hide</> : <><Eye size={12} /> Show</>}
        </button>
      </div>
    </div>
  );
}