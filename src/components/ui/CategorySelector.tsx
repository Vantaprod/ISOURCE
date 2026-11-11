"use client";

import { useState } from "react";
import { ChevronRight, X, Check, Search, FolderTree } from "lucide-react";

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
  const [selectedName, setSelectedName] = useState<string>("Select category");
  
  // Navigation state
  const [activeParent, setActiveParent] = useState<CategoryNode | null>(null);
  const [activePath, setActivePath] = useState<CategoryNode[]>([]);
  const [search, setSearch] = useState("");

  const handleSelect = (cat: CategoryNode) => {
    if (cat.children && cat.children.length > 0) {
      setActiveParent(cat);
      setActivePath([...activePath, cat]);
      setSearch("");
    } else {
      setSelected(cat.id);
      setSelectedName(cat.name);
      setIsOpen(false);
      setActiveParent(null);
      setActivePath([]);
    }
  };

  // Get the current list to display
  const currentList = activeParent ? (activeParent.children || []) : categories;
  
  const filteredList = search
    ? currentList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : currentList;

  return (
    <>
      <input type="hidden" name={name} value={selected} required />
      
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm text-charcoal outline-none transition-colors hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <span className={selected ? "text-charcoal font-bold" : "text-muted"}>
          {selectedName}
        </span>
        <ChevronRight size={16} className="text-muted" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-surface/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FolderTree size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-charcoal">Select a Category</h3>
                  <p className="text-xs text-muted">Choose the most relevant category for your product</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-muted hover:text-charcoal rounded-full hover:bg-surface transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-border bg-white flex items-center gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-xl border border-border pl-11 pr-4 text-sm outline-none focus:border-primary bg-surface/50 focus:bg-white transition-colors"
                />
              </div>
              {activePath.length > 0 && (
                <button 
                  type="button"
                  onClick={() => {
                    const newPath = [...activePath];
                    newPath.pop();
                    setActivePath(newPath);
                    setActiveParent(newPath.length > 0 ? newPath[newPath.length - 1] : null);
                  }}
                  className="h-12 px-4 rounded-xl border border-border text-sm font-bold text-charcoal hover:bg-surface transition-colors flex items-center gap-2 shrink-0"
                >
                  ← Back
                </button>
              )}
            </div>

            {/* Breadcrumb */}
            {activePath.length > 0 && (
              <div className="px-6 py-3 bg-surface/50 border-b border-border flex items-center gap-2 text-sm font-semibold text-muted overflow-x-auto">
                <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => { setActivePath([]); setActiveParent(null); }}>All Categories</span>
                {activePath.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2 shrink-0">
                    <ChevronRight size={14} />
                    <span 
                      className={`hover:text-primary cursor-pointer transition-colors ${i === activePath.length - 1 ? "text-primary" : ""}`}
                      onClick={() => {
                        const newPath = activePath.slice(0, i + 1);
                        setActivePath(newPath);
                        setActiveParent(newPath[newPath.length - 1]);
                      }}
                    >
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Main Grid View */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              {filteredList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted">
                  <Search size={48} className="mb-4 text-border" />
                  <p className="font-bold text-lg">No categories found</p>
                  <p className="text-sm mt-1">Try adjusting your search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredList.map((cat) => {
                    const hasChildren = cat.children && cat.children.length > 0;
                    const isSelected = selected === cat.id;
                    
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelect(cat)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                          isSelected 
                            ? "border-primary bg-primary/5 shadow-sm" 
                            : "border-border hover:border-primary hover:shadow-md bg-white"
                        }`}
                      >
                        <span className={`text-sm font-bold ${isSelected ? "text-primary" : "text-charcoal"}`}>
                          {cat.name}
                        </span>
                        {isSelected ? (
                          <Check size={18} className="text-primary shrink-0 ml-2" />
                        ) : hasChildren ? (
                          <ChevronRight size={18} className="text-muted shrink-0 ml-2" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-surface/30 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-10 px-6 rounded-lg border border-border bg-white text-sm font-bold text-charcoal hover:bg-surface transition-colors"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}