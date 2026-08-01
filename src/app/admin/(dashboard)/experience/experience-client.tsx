"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash, PencilSimple, CalendarBlank } from "@phosphor-icons/react";
import { CrudList } from "@/components/admin/crud-list";
import { AdminCardItem } from "@/components/admin/admin-card";

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  sort_order: number;
}

const BLANK_DRAFT = {
  company: "",
  role: "",
  description: "",
  start_date: "",
  end_date: "",
  is_current: false,
};

export function ExperienceClient({ initialItems }: { initialItems: Experience[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Experience[]>(initialItems);

  async function handleAdd(draft: Partial<Experience>) {
    if (!draft.company?.trim() || !draft.role?.trim()) throw new Error("Company and role are required.");
    if (!draft.start_date) throw new Error("Start date is required.");
    
    const { data, error } = await supabase
      .from("experiences")
      .insert({
        ...draft,
        company: draft.company.trim(),
        role: draft.role.trim(),
        end_date: draft.is_current ? null : draft.end_date || null,
        sort_order: items.length
      })
      .select().single();

    if (error) throw error;
    setItems((prev) => [data, ...prev]);
  }

  async function handleUpdate(id: string, draft: Partial<Experience>) {
    if (!draft.company?.trim() || !draft.role?.trim()) throw new Error("Company and role are required.");
    
    const { error } = await supabase
      .from("experiences")
      .update({
        ...draft,
        company: draft.company.trim(),
        role: draft.role.trim(),
        end_date: draft.is_current ? null : draft.end_date || null,
      })
      .eq("id", id);

    if (error) throw error;
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...draft, end_date: draft.is_current ? null : draft.end_date || null } : i));
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function formatDateRange(item: Experience) {
    const start = item.start_date ? new Date(item.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—";
    const end = item.is_current ? "Present" : item.end_date ? new Date(item.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—";
    return `${start} – ${end}`;
  }

  return (
    <div className="max-w-3xl">
      <CrudList<Experience>
        items={items}
        itemName="Experience"
        blankItem={BLANK_DRAFT}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        renderForm={(draft, onChange) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Company <span className="text-destructive">*</span></Label>
              <Input value={draft.company || ""} onChange={(e) => onChange({ company: e.target.value })} placeholder="Acme Corp" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Role <span className="text-destructive">*</span></Label>
              <Input value={draft.role || ""} onChange={(e) => onChange({ role: e.target.value })} placeholder="Product Designer" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Start Date <span className="text-destructive">*</span></Label>
              <Input type="date" value={draft.start_date || ""} onChange={(e) => onChange({ start_date: e.target.value })} className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">End Date</Label>
              <Input type="date" value={draft.end_date || ""} onChange={(e) => onChange({ end_date: e.target.value })} disabled={draft.is_current} className="h-9" />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Switch id={`current-${draft.id || 'new'}`} checked={draft.is_current ?? false} onCheckedChange={(v) => onChange({ is_current: v })} />
              <Label htmlFor={`current-${draft.id || 'new'}`} className="text-sm font-normal">Currently working here</Label>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs">Description</Label>
              <Textarea value={draft.description || ""} onChange={(e) => onChange({ description: e.target.value })} placeholder="Brief description..." className="h-20 resize-none text-sm" />
            </div>
          </div>
        )}
        renderItem={(item, { startEdit, deleteItem, isDeleting }) => (
          <AdminCardItem>
            <CalendarBlank weight="duotone" size={20} className="text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{item.role}</div>
              <div className="text-sm text-muted-foreground">{item.company}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {formatDateRange(item)}
                {item.is_current && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                    Current
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button type="button" className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" onClick={startEdit} aria-label="Edit">
                <PencilSimple weight="duotone" size={16} />
              </button>
              <button type="button" className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" onClick={deleteItem} disabled={isDeleting} aria-label="Delete">
                <Trash weight="duotone" size={16} />
              </button>
            </div>
          </AdminCardItem>
        )}
      />
    </div>
  );
}
