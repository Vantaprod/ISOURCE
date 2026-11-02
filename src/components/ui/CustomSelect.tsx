"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
}

export function CustomSelect({ options, value, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 items-center justify-between gap-2 rounded-md px-3 py-1 text-xs font-bold bg-green-100 text-green-700 min-w-[130px]"
      >
        {selectedOption ? selectedOption.label : value}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-white shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                if (onChange) {
                  // Mimic the native event object
                  onChange({ target: { value: opt.value } } as unknown as React.ChangeEvent<HTMLSelectElement>);
                }
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-surface ${
                value === opt.value ? "bg-primary/5 font-bold text-primary" : "text-charcoal"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}