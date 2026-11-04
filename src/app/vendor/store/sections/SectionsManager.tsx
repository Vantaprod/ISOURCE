"use client";
import { useState } from "react";
import { reorderSections } from "@/app/actions/store-sections";
import { SectionRow } from "./SectionRow";
import { Save, Loader2 } from "lucide-react";

export function SectionsManager({ initialSections }: { initialSections: any[] }) {
  const [sections, setSections] = useState(initialSections);
  const [saving, setSaving] = useState(false);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  }

  async function handleSave() {
    setSaving(true);
    await reorderSections(sections.map(s => s.id));
    setSaving(false);
  }

  const hasChanges = JSON.stringify(sections.map(s => s.id)) !== JSON.stringify(initialSections.map((s: any) => s.id));

  return (
    <div className="space-y-4">
      {hasChanges && (
        <div className="sticky top-20 z-10 bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm font-bold text-charcoal">You have unsaved changes</span>
          <button onClick={handleSave} disabled={saving} className="h-9 px-4 rounded-md bg-primary text-white text-sm font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Order"}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {sections.map((section, i) => (
          <SectionRow
            key={section.id}
            section={section}
            index={i}
            total={sections.length}
            onMoveUp={() => move(i, -1)}
            onMoveDown={() => move(i, 1)}
            loading={saving}
          />
        ))}
      </div>
    </div>
  );
}