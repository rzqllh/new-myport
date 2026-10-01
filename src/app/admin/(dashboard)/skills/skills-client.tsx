"use client";

import { useState } from "react";
import { Eye, EyeSlash, PencilSimple, Trash } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { revalidatePublicContent } from "@/lib/content/revalidate-public-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CrudList } from "@/components/admin/crud-list";
import { AdminCardItem } from "@/components/admin/admin-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type CapabilityCategory =
  | "project-management"
  | "product"
  | "engineering"
  | "research-design"
  | "tools";
type CapabilityLevel = "primary" | "working" | "familiar";

export interface CapabilityEditorItem {
  id: string;
  key: string;
  category: CapabilityCategory;
  level: CapabilityLevel;
  sort_order: number;
  is_visible: boolean;
  en_name: string;
  en_description: string;
  id_name: string;
  id_description: string;
}

const CATEGORIES: Array<{ value: CapabilityCategory; label: string }> = [
  { value: "project-management", label: "Project management" },
  { value: "product", label: "Product" },
  { value: "engineering", label: "Engineering" },
  { value: "research-design", label: "Research & design" },
  { value: "tools", label: "Tools" },
];

const LEVELS: Array<{ value: CapabilityLevel; label: string }> = [
  { value: "primary", label: "Primary" },
  { value: "working", label: "Working" },
  { value: "familiar", label: "Familiar" },
];

const BLANK: Partial<CapabilityEditorItem> = {
  category: "engineering",
  level: "working",
  is_visible: true,
  en_name: "",
  en_description: "",
  id_name: "",
  id_description: "",
};

function createKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function validateDraft(draft: Partial<CapabilityEditorItem>) {
  const enName = draft.en_name?.trim() ?? "";
  const idName = draft.id_name?.trim() ?? "";

  if (!enName) throw new Error("English capability name is required.");
  if ((draft.id_description?.trim() || idName) && !idName) {
    throw new Error(
      "Indonesian capability name is required when Indonesian copy is authored."
    );
  }

  return {
    enName,
    enDescription: draft.en_description?.trim() || null,
    idName,
    idDescription: draft.id_description?.trim() || null,
    category: (draft.category || "engineering") as CapabilityCategory,
    level: (draft.level || "working") as CapabilityLevel,
    isVisible: draft.is_visible !== false,
  };
}

export function CapabilitiesClient({
  initialItems,
  schemaV2Available,
}: {
  initialItems: CapabilityEditorItem[];
  schemaV2Available: boolean;
}) {
  const supabase = createClient();
  const [items, setItems] = useState(initialItems);

  async function syncTranslations(
    capabilityId: string,
    draft: Partial<CapabilityEditorItem>
  ) {
    const value = validateDraft(draft);
    const rows = [
      {
        capability_id: capabilityId,
        locale: "en",
        name: value.enName,
        description: value.enDescription,
      },
    ];

    if (value.idName) {
      rows.push({
        capability_id: capabilityId,
        locale: "id",
        name: value.idName,
        description: value.idDescription,
      });
    }

    const { error } = await supabase
      .from("capability_translations")
      .upsert(rows, { onConflict: "capability_id,locale" });
    if (error) throw error;

    if (!value.idName) {
      const { error: deleteError } = await supabase
        .from("capability_translations")
        .delete()
        .eq("capability_id", capabilityId)
        .eq("locale", "id");
      if (deleteError) throw deleteError;
    }
  }

  async function handleAdd(draft: Partial<CapabilityEditorItem>) {
    if (!schemaV2Available) {
      throw new Error("Apply the tracked schema-v2 migration before editing capabilities.");
    }

    const value = validateDraft(draft);
    const key = createKey(value.enName);
    if (!key) throw new Error("Capability key could not be generated.");

    const { data, error } = await supabase
      .from("capabilities")
      .insert({
        key,
        category: value.category,
        level: value.level,
        is_visible: value.isVisible,
        sort_order: items.length,
      })
      .select("id, key, category, level, is_visible, sort_order")
      .single();

    if (error) throw error;

    try {
      await syncTranslations(data.id, draft);
    } catch (translationError) {
      await supabase.from("capabilities").delete().eq("id", data.id);
      throw translationError;
    }

    await revalidatePublicContent();
    setItems((current) => [
      ...current,
      {
        id: data.id,
        key: data.key,
        category: data.category,
        level: data.level,
        is_visible: data.is_visible,
        sort_order: data.sort_order,
        en_name: value.enName,
        en_description: value.enDescription ?? "",
        id_name: value.idName,
        id_description: value.idDescription ?? "",
      },
    ]);
  }

  async function handleUpdate(
    id: string,
    draft: Partial<CapabilityEditorItem>
  ) {
    if (!schemaV2Available) {
      throw new Error("Apply the tracked schema-v2 migration before editing capabilities.");
    }

    const value = validateDraft(draft);
    const { error } = await supabase
      .from("capabilities")
      .update({
        category: value.category,
        level: value.level,
        is_visible: value.isVisible,
      })
      .eq("id", id);
    if (error) throw error;

    await syncTranslations(id, draft);
    await revalidatePublicContent();

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              ...draft,
              category: value.category,
              level: value.level,
              is_visible: value.isVisible,
              en_name: value.enName,
              en_description: value.enDescription ?? "",
              id_name: value.idName,
              id_description: value.idDescription ?? "",
            }
          : item
      )
    );
  }

  async function handleDelete(id: string) {
    if (!schemaV2Available) {
      throw new Error("Apply the tracked schema-v2 migration before editing capabilities.");
    }

    const { error } = await supabase.from("capabilities").delete().eq("id", id);
    if (error) throw error;

    await revalidatePublicContent();
    setItems((current) => current.filter((item) => item.id !== id));
  }

  const form = (
    draft: Partial<CapabilityEditorItem>,
    onChange: (patch: Partial<CapabilityEditorItem>) => void
  ) => (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-xs">Category</Label>
          <Select
            value={draft.category || "engineering"}
            onValueChange={(value) =>
              onChange({ category: value as CapabilityCategory })
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Level</Label>
          <Select
            value={draft.level || "working"}
            onValueChange={(value) =>
              onChange({ level: value as CapabilityLevel })
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 self-end pb-2">
          <Switch
            id={"capability-visible-" + (draft.id || "new")}
            checked={draft.is_visible !== false}
            onCheckedChange={(value) => onChange({ is_visible: value })}
          />
          <Label
            htmlFor={"capability-visible-" + (draft.id || "new")}
            className="font-normal"
          >
            Public
          </Label>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground">English</p>
          <div className="space-y-1">
            <Label className="text-xs">Name</Label>
            <Input
              value={draft.en_name || ""}
              onChange={(event) => onChange({ en_name: event.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea
              value={draft.en_description || ""}
              onChange={(event) =>
                onChange({ en_description: event.target.value })
              }
              className="min-h-24 resize-y"
            />
          </div>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground">
            Bahasa Indonesia
          </p>
          <div className="space-y-1">
            <Label className="text-xs">Nama</Label>
            <Input
              value={draft.id_name || ""}
              onChange={(event) => onChange({ id_name: event.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Deskripsi</Label>
            <Textarea
              value={draft.id_description || ""}
              onChange={(event) =>
                onChange({ id_description: event.target.value })
              }
              className="min-h-24 resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-7">
      <AdminPageHeader
        title="Capabilities"
        description="Qualitative capability levels replace arbitrary percentage scores. Public copy can be authored in English and Indonesian."
      />

      {!schemaV2Available ? (
        <div className="space-y-4">
          <div className="border-y border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground">
            Schema v2 is not active in this environment. Legacy skills are shown read-only; apply the tracked migration to manage qualitative capabilities.
          </div>
          <div className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid gap-1 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-4"
              >
                <span className="text-sm font-medium">{item.en_name}</span>
                <span className="text-xs capitalize text-muted-foreground">
                  {item.category.replace("-", " ")}
                </span>
                <span className="text-xs capitalize text-muted-foreground">
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl">
          <CrudList<CapabilityEditorItem>
            items={items}
            itemName="Capability"
            blankItem={BLANK}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            renderForm={form}
            renderItem={(item, { startEdit, deleteItem, isDeleting }) => (
              <AdminCardItem>
                {item.is_visible ? (
                  <Eye className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <EyeSlash className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.en_name}</p>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {item.category.replace("-", " ")} · {item.level}
                    {item.id_name ? " · ID ready" : " · ID missing"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={startEdit}
                    aria-label="Edit capability"
                  >
                    <PencilSimple className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={deleteItem}
                    disabled={isDeleting}
                    aria-label="Delete capability"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              </AdminCardItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
