"use client";
import { useState } from "react";

export function ProductOptions({ variants }: { variants: any[] }) {
  const [selectedColor, setSelectedColor] = useState(variants.find(v => v.name === "Color")?.value || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const colors = Array.from(new Set(variants.filter(v => v.name === "Color").map(v => v.value)));
  const sizes = Array.from(new Set(variants.filter(v => v.name === "Size").map(v => v.value)));

  const getColorHex = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("black")) return "#111111";
    if (lower.includes("white")) return "#FFFFFF";
    if (lower.includes("red")) return "#EF4444";
    if (lower.includes("blue")) return "#3B82F6";
    if (lower.includes("brown")) return "#78350F";
    if (lower.includes("green")) return "#22C55E";
    return "#9CA3AF"; 
  };

  return (
    <div className="space-y-6">
      {/* COLORS */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-charcoal mb-3">Color: <span className="text-muted font-normal">{selectedColor}</span></h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-10 w-10 rounded-full border-2 transition-all flex items-center justify-center ${
                  selectedColor === color ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <span className="h-8 w-8 rounded-full border border-black/10" style={{ backgroundColor: getColorHex(color) }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SIZES */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-charcoal mb-3">Size: <span className="text-muted font-normal">{selectedSize || "Select"}</span></h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`h-10 px-4 rounded-md text-sm font-bold border transition-all ${
                  selectedSize === size ? "border-primary bg-primary/5 text-primary" : "border-border text-charcoal hover:border-charcoal"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUANTITY (Fixed layout using span instead of input for perfect alignment) */}
      <div>
        <h3 className="text-sm font-bold text-charcoal mb-3">Quantity</h3>
        <div className="flex items-center border border-border rounded-md overflow-hidden w-fit bg-white">
          <button 
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))} 
            className="w-10 h-10 flex items-center justify-center text-lg text-charcoal bg-surface hover:bg-border/50 transition-colors"
          >
            -
          </button>
          <span className="w-12 h-10 flex items-center justify-center text-sm font-bold text-charcoal border-x border-border">
            {qty}
          </span>
          <button 
            type="button"
            onClick={() => setQty(qty + 1)} 
            className="w-10 h-10 flex items-center justify-center text-lg text-charcoal bg-surface hover:bg-border/50 transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}