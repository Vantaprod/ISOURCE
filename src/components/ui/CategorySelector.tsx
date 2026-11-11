"use client";

import { useState } from "react";
import { ChevronRight, X, Check, Search } from "lucide-react";

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
};

export function CategorySelector({
  name,
  categories,
  defaultValue = "",
}: {
  name: string;
  categories: CategoryNode[];
  defaultValue?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>(defaultValue);
  const [selectedName, setSelectedName] = useState<string>(
    defaultValue ? "Selected Category" : "Select category"
  );
  const [activePath, setActivePath] = useState<CategoryNode[]>([]);
  const [search, setSearch] = useState("");

  // Helper to find a category by ID (for initial render)
  // In a real app, you'd pass the initial name down from the server
  const currentLevel = activePath.length === 0 ? categories : activePath[activePath.length - 1].children || [];

  const handleSelect = (cat: CategoryNode) => {
    if (cat.children && cat.children.length > 0) {
      setActivePath([...activePath, cat]);
    } else {
      // It's a leaf node
      setSelected(cat.id);
      setSelectedName(cat.name);
      setIsOpen(false);
      setActivePath([]);
    }
  };

  const filteredCategories = search 
    ? currentLevel.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : currentLevel;

  return (
    <>
      <input type="hidden" name={name} value={selected} required />
      
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <span className={selected ? "text-charcoal font-medium" : "text-muted"}>
          {selectedName}
        </span>
        <ChevronRight size={16} className="text-muted" />
      </button>

      {/* Sliding Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-lg text-charcoal">Categories</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="p-2 text-muted hover:text-charcoal rounded-full hover:bg-surface">
                <X size={20} />
              </button>
            </div>

            {/* Breadcrumb / Search */}
            <div className="p-4 border-b border-border bg-surface/50">
              {activePath.length > 0 && (
                <button 
                  type="button"
                  onClick={() => setActivePath(activePath.slice(0, -1))}
                  className="text-xs font-bold text-primary mb-3 flex items-center gap-1 hover:underline"
                >
                  ← Back to {activePath.length === 1 ? "All Categories" : activePath[activePath.length - 2].name}
                </button>
              )}
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search for a category"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border pl-9 pr-3 text-sm outline-none focus:border-primary bg-white"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredCategories.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted">No categories found.</div>
              ) : (
                filteredCategories.map((cat) => {
                  const hasChildren = cat.children && cat.children.length > 0;
                  const isSelected = selected === cat.id;
                  
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelect(cat)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${
                        isSelected ? "bg-primary/5 text-primary font-bold" : "text-charcoal hover:bg-surface font-medium"
                      }`}
                    >
                      <span>{cat.name}</span>
                      {isSelected ? (
                        <Check size={16} className="text-primary" />
                      ) : hasChildren ? (
                        <ChevronRight size={16} className="text-muted" />
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}