"use client";
import { useTransition } from "react";
import { ArrowUp, ArrowDown, Eye, EyeOff, Trash2 } from "lucide-react";
import { toggleSection, deleteSection, moveSection } from "./actions";

export function SectionRow({ section }: { section: { id: string; title: string; type: string; position: number; isVisible: boolean } }) {
  const [isPending, startTransition] = useTransition();
  return (
    <tr className={isPending ? "opacity-50" : ""}>
      <td className="px-4 py-3 font-mono text-xs">{section.position}</td>
      <td className="px-4 py-3 font-medium">{section.title}</td>
      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">{section.type}</span></td>
      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${section.isVisible ? "bg-success/10 text-success" : "bg-muted/10 text-muted"}`}>{section.isVisible ? "VISIBLE" : "HIDDEN"}</span></td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-1">
          <button onClick={() => startTransition(async () => { await moveSection(section.id, "up"); })} disabled={isPending} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:border-primary"><ArrowUp size={12} /></button>
          <button onClick={() => startTransition(async () => { await moveSection(section.id, "down"); })} disabled={isPending} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:border-primary"><ArrowDown size={12} /></button>
          <button onClick={() => startTransition(async () => { await toggleSection(section.id, !section.isVisible); })} disabled={isPending} className="h-6 w-6 rounded border border-border flex items-center justify-center hover:border-primary">{section.isVisible ? <EyeOff size={12} /> : <Eye size={12} />}</button>
          <button onClick={() => { if (confirm("Delete this section?")) startTransition(async () => { await deleteSection(section.id); }); }} disabled={isPending} className="h-6 w-6 rounded border border-danger/30 flex items-center justify-center text-danger hover:bg-danger/10"><Trash2 size={12} /></button>
        </div>
      </td>
    </tr>
  );
}