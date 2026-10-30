import { prisma } from "@/lib/prisma";
import { SectionForm } from "./SectionForm";
import { SectionRow } from "./SectionRow";

export default async function AdminSectionsPage() {
  const sections = await prisma.homepageSection.findMany({ orderBy: { position: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Homepage Sections</h1>
        <p className="text-sm text-muted">Control what appears on the homepage. If empty, defaults are shown.</p>
      </div>

      <SectionForm />

      {sections.length > 0 && (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-muted text-xs uppercase font-bold">
              <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Visible</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sections.map((s) => <SectionRow key={s.id} section={{ id: s.id, title: s.title, type: s.type, position: s.position, isVisible: s.isVisible }} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}