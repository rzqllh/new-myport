"use client";

import { useState } from "react";
import { CalendarBlank, PencilSimple, Trash } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { revalidatePublicContent } from "@/lib/content/revalidate-public-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CrudList } from "@/components/admin/crud-list";
import { AdminCardItem } from "@/components/admin/admin-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export interface ExperienceEditorItem {
  id: string;
  company: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  sort_order: number;
  en_role: string;
  en_description: string;
  id_role: string;
  id_description: string;
}

const BLANK_DRAFT: Partial<ExperienceEditorItem> = {
  company: "",
  start_date: "",
  end_date: null,
  is_current: false,
  en_role: "",
  en_description: "",
  id_role: "",
  id_description: "",
};

function normalized(draft: Partial<ExperienceEditorItem>) {
  const company = draft.company?.trim() ?? "";
  const enRole = draft.en_role?.trim() ?? "";
  const idRole = draft.id_role?.trim() ?? "";

  if (!company || !enRole) {
    throw new Error("Company and English role are required.");
  }
  if (!draft.start_date) {
    throw new Error("Start date is required.");
  }
  if ((draft.id_description?.trim() || idRole) && !idRole) {
    throw new Error("Indonesian role is required when Indonesian copy is authored.");
  }

  return {
    company,
    enRole,
    enDescription: draft.en_description?.trim() || null,
    idRole,
    idDescription: draft.id_description?.trim() || null,
    startDate: draft.start_date,
    endDate: draft.is_current ? null : draft.end_date || null,
    isCurrent: Boolean(draft.is_current),
  };
}

export function ExperienceClient({
  initialItems,
  schemaV2Available,
}: {
  initialItems: ExperienceEditorItem[];
  schemaV2Available: boolean;
}) {
  const supabase = createClient();
  const [items, setItems] = useState(initialItems);

  async function syncTranslations(
    experienceId: string,
    draft: Partial<ExperienceEditorItem>
  ) {
    if (!schemaV2Available) return;

    const value = normalized(draft);
    const rows = [
      {
        experience_id: experienceId,
        locale: "en",
        role: value.enRole,
        description: value.enDescription,
      },
    ];

    if (value.idRole) {
      rows.push({
        experience_id: experienceId,
        locale: "id",
        role: value.idRole,
        description: value.idDescription,
      });
    }

    const { error } = await supabase
      .from("experience_translations")
      .upsert(rows, { onConflict: "experience_id,locale" });

    if (error) throw error;

    if (!value.idRole) {
      const { error: deleteError } = await supabase
        .from("experience_translations")
        .delete()
        .eq("experience_id", experienceId)
        .eq("locale", "id");
      if (deleteError) throw deleteError;
    }
  }

  async function handleAdd(draft: Partial<ExperienceEditorItem>) {
    const value = normalized(draft);

    const { data, error } = await supabase
      .from("experiences")
      .insert({
        company: value.company,
        role: value.enRole,
        description: value.enDescription,
        start_date: value.startDate,
        end_date: value.endDate,
        is_current: value.isCurrent,
        sort_order: items.length,
      })
      .select("id, company, start_date, end_date, is_current, sort_order")
      .single();

    if (error) throw error;

    try {
      await syncTranslations(data.id, draft);
    } catch (translationError) {
      await supabase.from("experiences").delete().eq("id", data.id);
      throw translationError;
    }

    await revalidatePublicContent();
    setItems((current) => [
      ...current,
      {
        id: data.id,
        company: data.company,
        start_date: data.start_date,
        end_date: data.end_date,
        is_current: data.is_current,
        sort_order: data.sort_order,
        en_role: value.enRole,
        en_description: value.enDescription ?? "",
        id_role: value.idRole,
        id_description: value.idDescription ?? "",
      },
    ]);
  }

  async function handleUpdate(
    id: string,
    draft: Partial<ExperienceEditorItem>
  ) {
    const value = normalized(draft);

    const { error } = await supabase
      .from("experiences")
      .update({
        company: value.company,
        role: value.enRole,
        description: value.enDescription,
        start_date: value.startDate,
        end_date: value.endDate,
        is_current: value.isCurrent,
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
              company: value.company,
              start_date: value.startDate,
              end_date: value.endDate,
              is_current: value.isCurrent,
              en_role: value.enRole,
              en_description: value.enDescription ?? "",
              id_role: value.idRole,
              id_description: value.idDescription ?? "",
            }
          : item
      )
    );
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;

    await revalidatePublicContent();
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function formatDateRange(item: ExperienceEditorItem) {
    const start = new Date(item.start_date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const end = item.is_current
      ? "Present"
      : item.end_date
        ? new Date(item.end_date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "—";

    return start + " – " + end;
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        title="Experience"
        description="Company and dates are shared facts. Role and description can be authored independently in English and Indonesian."
      />

      {!schemaV2Available ? (
        <div className="border-y border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground">
          Schema v2 is not active in this environment yet. English experience can still be edited through the legacy table; Indonesian fields become active after the tracked migration is applied.
        </div>
      ) : null}

      <div className="max-w-4xl">
        <CrudList<ExperienceEditorItem>
          items={items}
          itemName="Experience"
          blankItem={BLANK_DRAFT}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          renderForm={(draft, onChange) => (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Company</Label>
                  <Input
                    value={draft.company || ""}
                    onChange={(event) => onChange({ company: event.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Start date</Label>
                  <Input
                    type="date"
                    value={draft.start_date || ""}
                    onChange={(event) =>
                      onChange({ start_date: event.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End date</Label>
                  <Input
                    type="date"
                    value={draft.end_date || ""}
                    disabled={draft.is_current}
                    onChange={(event) =>
                      onChange({ end_date: event.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-2 self-end pb-2">
                  <Switch
                    id={"experience-current-" + (draft.id || "new")}
                    checked={draft.is_current ?? false}
                    onCheckedChange={(value) =>
                      onChange({ is_current: value })
                    }
                  />
                  <Label
                    htmlFor={"experience-current-" + (draft.id || "new")}
                    className="font-normal"
                  >
                    Current role
                  </Label>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="space-y-3 border-t border-border pt-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    English
                  </p>
                  <div className="space-y-1">
                    <Label className="text-xs">Role</Label>
                    <Input
                      value={draft.en_role || ""}
                      onChange={(event) =>
                        onChange({ en_role: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={draft.en_description || ""}
                      onChange={(event) =>
                        onChange({ en_description: event.target.value })
                      }
                      className="min-h-28 resize-y"
                    />
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Bahasa Indonesia
                  </p>
                  <div className="space-y-1">
                    <Label className="text-xs">Peran</Label>
                    <Input
                      disabled={!schemaV2Available}
                      value={draft.id_role || ""}
                      onChange={(event) =>
                        onChange({ id_role: event.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Deskripsi</Label>
                    <Textarea
                      disabled={!schemaV2Available}
                      value={draft.id_description || ""}
                      onChange={(event) =>
                        onChange({ id_description: event.target.value })
                      }
                      className="min-h-28 resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          renderItem={(item, { startEdit, deleteItem, isDeleting }) => (
            <AdminCardItem>
              <CalendarBlank className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{item.en_role}</div>
                <div className="text-sm text-muted-foreground">
                  {item.company}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatDateRange(item)}
                  {item.id_role ? " · ID ready" : " · ID missing"}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={startEdit}
                  aria-label="Edit experience"
                >
                  <PencilSimple className="size-4" />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={deleteItem}
                  disabled={isDeleting}
                  aria-label="Delete experience"
                >
                  <Trash className="size-4" />
                </button>
              </div>
            </AdminCardItem>
          )}
        />
      </div>
    </div>
  );
}
