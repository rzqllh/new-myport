"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash, PencilSimple, Quotes } from "@phosphor-icons/react";
import { CrudList } from "@/components/admin/crud-list";
import { AdminCardItem } from "@/components/admin/admin-card";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

const BLANK = { name: "", role: "", company: "", quote: "", avatar_url: "", is_visible: true };

export function TestimonialsClient({ initialItems }: { initialItems: Testimonial[] }) {
  const supabase = createClient();
  const [items, setItems] = useState<Testimonial[]>(initialItems);

  async function handleAdd(draft: Partial<Testimonial>) {
    if (!draft.name?.trim() || !draft.quote?.trim()) throw new Error("Name and quote are required.");
    const { data, error } = await supabase
      .from("testimonials")
      .insert({ ...draft, sort_order: items.length })
      .select().single();
    if (error) throw error;
    setItems((p) => [...p, data]);
  }

  async function handleUpdate(id: string, draft: Partial<Testimonial>) {
    if (!draft.name?.trim() || !draft.quote?.trim()) throw new Error("Name and quote are required.");
    const { error } = await supabase.from("testimonials").update(draft).eq("id", id);
    if (error) throw error;
    setItems((p) => p.map((i) => i.id === id ? { ...i, ...draft } : i));
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    setItems((p) => p.filter((i) => i.id !== id));
  }

  return (
    <div className="max-w-3xl">
      <CrudList<Testimonial>
        items={items}
        itemName="Testimonial"
        blankItem={BLANK}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        renderForm={(draft, onChange) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
              <Input value={draft.name || ""} onChange={(e) => onChange({ name: e.target.value })} placeholder="Jane Smith" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Role</Label>
              <Input value={draft.role || ""} onChange={(e) => onChange({ role: e.target.value })} placeholder="CEO" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Company</Label>
              <Input value={draft.company || ""} onChange={(e) => onChange({ company: e.target.value })} placeholder="Acme Corp" className="h-9" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Avatar URL</Label>
              <Input value={draft.avatar_url || ""} onChange={(e) => onChange({ avatar_url: e.target.value })} placeholder="https://..." className="h-9" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs">Quote <span className="text-destructive">*</span></Label>
              <Textarea value={draft.quote || ""} onChange={(e) => onChange({ quote: e.target.value })} placeholder="What they said..." className="h-20 resize-none text-sm" />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Switch id={`visible-${draft.id || 'new'}`} checked={draft.is_visible ?? true} onCheckedChange={(v) => onChange({ is_visible: v })} />
              <Label htmlFor={`visible-${draft.id || 'new'}`} className="text-sm font-normal">Visible on homepage</Label>
            </div>
          </div>
        )}
        renderItem={(item, { startEdit, deleteItem, isDeleting }) => (
          <AdminCardItem>
            <Quotes weight="duotone" size={20} className="text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm italic text-muted-foreground line-clamp-2">&ldquo;{item.quote}&rdquo;</p>
              <p className="text-sm font-medium mt-1">{item.name}</p>
              {(item.role || item.company) && (
                <p className="text-xs text-muted-foreground">{[item.role, item.company].filter(Boolean).join(", ")}</p>
              )}
              {!item.is_visible && <span className="text-xs text-muted-foreground">(hidden)</span>}
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
