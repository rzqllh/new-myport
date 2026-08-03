"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, FloppyDisk } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { CrudList } from "@/components/admin/crud-list";
import { AdminCardItem } from "@/components/admin/admin-card";

type SkillCategory = "frontend" | "backend" | "design" | "tools";

interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: string | null;
  proficiency: number;
  sort_order: number;
}

const CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
  { value: "tools", label: "Tools" },
];

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  frontend: "bg-muted text-foreground border border-border/50",
  backend: "bg-muted text-foreground border border-border/50",
  design: "bg-muted text-foreground border border-border/50",
  tools: "bg-muted text-foreground border border-border/50",
};

export function SkillsClient({ initialSkills }: { initialSkills: Skill[] }) {
  const supabase = createClient();
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  async function handleAdd(draft: Partial<Skill>, category: SkillCategory) {
    if (!draft.name?.trim()) throw new Error("Skill name is required.");
    const { data, error } = await supabase
      .from("skills")
      .insert({
        name: draft.name.trim(),
        category,
        icon: draft.icon || null,
        proficiency: draft.proficiency || 80,
        sort_order: skills.length,
      })
      .select().single();
    if (error) throw error;
    setSkills((p) => [...p, data]);
  }

  async function handleUpdate(id: string, draft: Partial<Skill>) {
    if (!draft.name?.trim()) throw new Error("Skill name is required.");
    const { error } = await supabase.from("skills").update({
      name: draft.name.trim(),
      icon: draft.icon || null,
      proficiency: draft.proficiency,
    }).eq("id", id);
    if (error) throw error;
    setSkills((p) => p.map((i) => i.id === id ? { ...i, ...draft } : i));
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;
    setSkills((p) => p.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {CATEGORIES.map((cat) => (
        <div key={cat.value} className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {cat.label}
          </h3>
          <CrudList<Skill>
            items={skills.filter((s) => s.category === cat.value)}
            itemName={`${cat.label} Skill`}
            blankItem={{ name: "", proficiency: 80, icon: "", category: cat.value }}
            onAdd={(draft) => handleAdd(draft, cat.value)}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            renderForm={(draft, onChange) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
                  <Input value={draft.name || ""} onChange={(e) => onChange({ name: e.target.value })} placeholder="e.g. React" className="h-9" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Proficiency (%)</Label>
                  <Input type="number" min={0} max={100} value={draft.proficiency || ""} onChange={(e) => onChange({ proficiency: Number(e.target.value) })} className="h-9" />
                </div>
                <div className="space-y-1 sm:col-span-3">
                  <Label className="text-xs">Icon (optional slug)</Label>
                  <Input value={draft.icon || ""} onChange={(e) => onChange({ icon: e.target.value })} placeholder="react" className="h-9" />
                </div>
              </div>
            )}
            renderItem={(item, { startEdit, deleteItem, isDeleting }) => (
              <AdminCardItem className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3">
                <p className="font-medium text-sm">{item.name}</p>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap", CATEGORY_COLORS[item.category])}>
                  {item.category}
                </span>
                <span className="text-sm font-medium w-12 text-right">{item.proficiency}%</span>
                <div className="flex items-center gap-1">
                  <button type="button" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" onClick={startEdit} aria-label="Edit">
                    <FloppyDisk weight="duotone" size={16} />
                  </button>
                  <button type="button" className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" onClick={deleteItem} disabled={isDeleting} aria-label="Delete">
                    <Trash weight="duotone" size={16} />
                  </button>
                </div>
              </AdminCardItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}
