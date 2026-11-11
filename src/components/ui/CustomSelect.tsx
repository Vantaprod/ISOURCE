"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectOption = {
  value: string;
  label: string;
};

export function CustomSelect({
  name,
  options,
  placeholder = "Select an option",
  defaultValue = "",
  required = false,
}: {
  name: string;
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === selected)?.label || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden input to pass value to form action */}
      <input type="hidden" name={name} value={selected} required={required} />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
          !selected && "text-muted"
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={16} className={cn("text-muted transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-white py-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSelected(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between px-3 py-2 text-sm text-charcoal hover:bg-surface transition-colors",
                selected === option.value && "bg-primary/5 font-semibold text-primary"
              )}
            >
              <span className="truncate">{option.label}</span>
              {selected === option.value && <Check size={14} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}