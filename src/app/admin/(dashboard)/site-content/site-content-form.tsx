"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { revalidatePublicContent } from "@/lib/content/revalidate-public-client";
import {
  SITE_CONTENT_DEFINITIONS,
  SITE_CONTENT_NAMESPACES,
  type SiteContentNamespace,
  type SiteCopyBundle,
} from "@/lib/content/site-copy";
import { isV2SchemaUnavailable } from "@/lib/content/schema-compat";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LocaleSwitch } from "@/components/admin/editorial-workspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Locale = "en" | "id";

export function SiteContentForm({
  initial,
}: {
  initial: Record<Locale, SiteCopyBundle>;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [locale, setLocale] = useState<Locale>("en");
  const [namespace, setNamespace] =
    useState<SiteContentNamespace>("home.hero");
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);

  const definition = SITE_CONTENT_DEFINITIONS[namespace];
  const content = draft[locale][namespace];

  function update(key: string, value: string) {
    setDraft((current) => ({
      ...current,
      [locale]: {
        ...current[locale],
        [namespace]: {
          ...current[locale][namespace],
          [key]: value,
        },
      },
    }));
  }

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("site_content").upsert(
      {
        namespace,
        locale,
        status: "published",
        content,
      },
      { onConflict: "namespace,locale" }
    );

    setSaving(false);

    if (error) {
      if (isV2SchemaUnavailable(error)) {
        toast.error(
          "Site Content requires the tracked schema v2 migration before it can be saved."
        );
        return;
      }
      toast.error(error.message);
      return;
    }

    await revalidatePublicContent();
    toast.success(`${definition.label} · ${locale.toUpperCase()} saved`);
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        title="Site Content"
        description="Public editorial copy lives here. English and Indonesian are written as natural equivalents, not literal translations."
        action={
          <div className="flex items-center gap-2">
            <LocaleSwitch locale={locale} onChange={setLocale} idAvailable />
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save section"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,720px)]">
        <nav aria-label="Site content sections" className="space-y-1">
          {SITE_CONTENT_NAMESPACES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setNamespace(item)}
              className={
                item === namespace
                  ? "flex w-full rounded-lg bg-foreground px-3 py-2 text-left text-sm text-background"
                  : "flex w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            >
              {SITE_CONTENT_DEFINITIONS[item].label}
            </button>
          ))}
        </nav>

        <section>
          <div className="border-b border-border pb-5">
            <p className="text-xs text-muted-foreground">
              {locale === "en" ? "English" : "Bahasa Indonesia"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold">
              {definition.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {definition.description}
            </p>
          </div>

          <div className="space-y-6 pt-6">
            {definition.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`${namespace}-${field.key}`}>
                  {field.label}
                </Label>
                {field.multiline ? (
                  <Textarea
                    id={`${namespace}-${field.key}`}
                    value={content[field.key] ?? ""}
                    onChange={(event) => update(field.key, event.target.value)}
                    className="min-h-28 resize-y leading-7"
                  />
                ) : (
                  <Input
                    id={`${namespace}-${field.key}`}
                    value={content[field.key] ?? ""}
                    onChange={(event) => update(field.key, event.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
