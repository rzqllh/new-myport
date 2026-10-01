"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { createSlug, validateSlug } from "@/lib/content/slug";
import { isV2SchemaUnavailable } from "@/lib/content/schema-compat";
import {
  EditorialWorkspace,
  LocaleSwitch,
  type EditorSection,
} from "@/components/admin/editorial-workspace";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type PublishState = "draft" | "published";
type Locale = "en" | "id";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  tags: string[];
  status: PublishState;
  published_at: string | null;
}

interface InsightCopy {
  title: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
}

const blankCopy: InsightCopy = {
  title: "",
  excerpt: "",
  content: "",
  seoTitle: "",
  seoDescription: "",
};

function hasCopy(copy: InsightCopy) {
  return Boolean(copy.title || copy.excerpt || copy.content);
}

export function BlogForm({ initialData }: { initialData?: BlogPost }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [locale, setLocale] = useState<Locale>("en");
  const [enCopy, setEnCopy] = useState<InsightCopy>({
    ...blankCopy,
    title: initialData?.title ?? "",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
  });
  const [idCopy, setIdCopy] = useState<InsightCopy>(blankCopy);
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") ?? "");
  const [status, setStatus] = useState<PublishState>(
    initialData?.status ?? "draft"
  );
  const [permalinkEditing, setPermalinkEditing] = useState(
    !initialData || initialData.status !== "published"
  );
  const [v2Available, setV2Available] = useState<boolean | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCopy = locale === "en" ? enCopy : idCopy;
  const setActiveCopy = (patch: Partial<InsightCopy>) => {
    setDirty(true);
    if (locale === "en") {
      setEnCopy((current) => ({ ...current, ...patch }));
    } else {
      setIdCopy((current) => ({ ...current, ...patch }));
    }
  };

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!initialData?.id) return;

    let active = true;

    supabase
      .from("insight_translations")
      .select("locale, title, excerpt, body, seo_title, seo_description")
      .eq("insight_id", initialData.id)
      .then(({ data, error: loadError }) => {
        if (!active) return;
        if (loadError) {
          if (isV2SchemaUnavailable(loadError)) {
            setV2Available(false);
            return;
          }
          return;
        }

        setV2Available(true);

        for (const translation of data ?? []) {
          const body = translation.body as
            | { format?: string; html?: string }
            | null;
          const copy: InsightCopy = {
            title: translation.title ?? "",
            excerpt: translation.excerpt ?? "",
            content: body?.html ?? "",
            seoTitle: translation.seo_title ?? "",
            seoDescription: translation.seo_description ?? "",
          };
          if (translation.locale === "en") setEnCopy(copy);
          if (translation.locale === "id") setIdCopy(copy);
        }
      });

    return () => {
      active = false;
    };
  }, [initialData?.id, supabase]);

  function handleEnglishTitle(value: string) {
    setDirty(true);
    setEnCopy((current) => ({ ...current, title: value }));
    if (!initialData) setSlug(createSlug(value));
  }

  async function syncV2(insightId: string, publishedAt: string | null) {
    const { error: insightError } = await supabase.from("insights").upsert(
      {
        id: insightId,
        slug,
        status,
        tags: tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        published_at: publishedAt,
      },
      { onConflict: "id" }
    );

    if (insightError) {
      if (isV2SchemaUnavailable(insightError)) {
        setV2Available(false);
        return;
      }
      throw insightError;
    }

    const translations = [
      {
        insight_id: insightId,
        locale: "en",
        status,
        title: enCopy.title.trim(),
        excerpt: enCopy.excerpt.trim() || null,
        body: { format: "html", html: enCopy.content },
        seo_title: enCopy.seoTitle.trim() || null,
        seo_description: enCopy.seoDescription.trim() || null,
      },
    ];

    if (hasCopy(idCopy)) {
      translations.push({
        insight_id: insightId,
        locale: "id",
        status: "draft",
        title: idCopy.title.trim() || enCopy.title.trim(),
        excerpt: idCopy.excerpt.trim() || null,
        body: { format: "html", html: idCopy.content },
        seo_title: idCopy.seoTitle.trim() || null,
        seo_description: idCopy.seoDescription.trim() || null,
      });
    }

    const { error: translationError } = await supabase
      .from("insight_translations")
      .upsert(translations, { onConflict: "insight_id,locale" });

    if (translationError && !isV2SchemaUnavailable(translationError)) {
      throw translationError;
    }

    if (
      initialData?.status === "published" &&
      initialData.slug !== slug
    ) {
      const redirects = [
        {
          content_type: "insight",
          content_id: insightId,
          locale: "en",
          old_slug: initialData.slug,
          new_slug: slug,
        },
      ];

      if (hasCopy(idCopy)) {
        redirects.push({
          content_type: "insight",
          content_id: insightId,
          locale: "id",
          old_slug: initialData.slug,
          new_slug: slug,
        });
      }

      const { error: redirectError } = await supabase
        .from("content_redirects")
        .upsert(redirects, { onConflict: "content_type,locale,old_slug" });

      if (redirectError && !isV2SchemaUnavailable(redirectError)) {
        throw redirectError;
      }
    }

    setV2Available(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const slugState = validateSlug(slug);
    if (!slugState.valid) {
      setError(slugState.reason);
      return;
    }

    if (!enCopy.title.trim()) {
      setError("English title is required.");
      return;
    }

    setSaving(true);

    try {
      const publishedAt =
        status === "published"
          ? initialData?.published_at ?? new Date().toISOString()
          : null;

      const legacyPayload = {
        title: enCopy.title.trim(),
        slug,
        excerpt: enCopy.excerpt.trim() || null,
        content: enCopy.content || null,
        tags: tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        status,
        published_at: publishedAt,
      };

      let insightId = initialData?.id;

      if (insightId) {
        const { error: updateError } = await supabase
          .from("blog_posts")
          .update(legacyPayload)
          .eq("id", insightId);
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from("blog_posts")
          .insert(legacyPayload)
          .select("id")
          .single();
        if (insertError) throw insertError;
        insightId = data.id;
      }

      await syncV2(insightId, publishedAt);
      setDirty(false);
      router.push("/admin/blog");
      router.refresh();
    } catch (caught: unknown) {
      console.error(caught);
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to save this Insight."
      );
    } finally {
      setSaving(false);
    }
  }

  const sections: EditorSection[] = [
    { id: "overview", label: "Overview", complete: Boolean(activeCopy.title && activeCopy.excerpt) },
    { id: "body", label: "Article", complete: Boolean(activeCopy.content) },
  ];

  const inspector = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={status}
          onValueChange={(value) => {
            setDirty(true);
            setStatus(value as PublishState);
          }}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 border-t border-border pt-5">
        <Label htmlFor="insight-slug">Permalink</Label>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          /insights/{slug || "untitled"}
        </div>
        <Input
          id="insight-slug"
          value={slug}
          disabled={!permalinkEditing}
          onChange={(event) => {
            setDirty(true);
            setSlug(createSlug(event.target.value));
          }}
        />
        {!permalinkEditing ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPermalinkEditing(true)}
          >
            Change permalink
          </Button>
        ) : initialData?.status === "published" ? (
          <p className="text-xs leading-5 text-muted-foreground">
            The previous URL will remain available through redirect history when schema v2 is active.
          </p>
        ) : null}
      </div>

      <div className="space-y-2 border-t border-border pt-5">
        <Label htmlFor="insight-tags">Tags</Label>
        <Input
          id="insight-tags"
          value={tags}
          onChange={(event) => {
            setDirty(true);
            setTags(event.target.value);
          }}
          placeholder="research, monitoring, next.js"
        />
      </div>

      <div className="space-y-2 border-t border-border pt-5">
        <Label htmlFor="insight-seo-title">SEO title · {locale.toUpperCase()}</Label>
        <Input
          id="insight-seo-title"
          value={activeCopy.seoTitle}
          onChange={(event) => setActiveCopy({ seoTitle: event.target.value })}
        />
        <Label htmlFor="insight-seo-description">SEO description</Label>
        <Textarea
          id="insight-seo-description"
          value={activeCopy.seoDescription}
          onChange={(event) => setActiveCopy({ seoDescription: event.target.value })}
          className="min-h-24"
        />
      </div>

      <p className="border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
        {v2Available === false
          ? "Schema v2 is not available in this environment yet. English legacy content will still save safely."
          : "Bilingual content and redirect history sync to schema v2."}
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <AdminPageHeader
        title={initialData ? "Edit insight" : "New insight"}
        description="Write for clarity first. Publication, permalink, tags, and SEO stay outside the reading canvas."
        action={
          <div className="flex items-center gap-2">
            <LocaleSwitch
              locale={locale}
              onChange={setLocale}
              idAvailable={hasCopy(idCopy)}
            />
            {initialData?.slug ? (
              <Button
                type="button"
                variant="outline"
                render={
                  <a
                    href={`/blog/${initialData.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
              >
                Preview
                <ArrowSquareOut className="size-4" />
              </Button>
            ) : null}
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : status === "published" ? "Save & publish" : "Save draft"}
            </Button>
          </div>
        }
      />

      {error ? (
        <div role="alert" className="border-y border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <EditorialWorkspace sections={sections} inspector={inspector}>
        <div className="space-y-12">
          <section id="overview" className="scroll-mt-24 space-y-5">
            <div>
              <p className="text-xs text-muted-foreground">
                {locale === "en" ? "English" : "Bahasa Indonesia"}
              </p>
              <h2 className="mt-1 text-lg font-semibold">Overview</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insight-title">Title</Label>
              <Input
                id="insight-title"
                value={activeCopy.title}
                onChange={(event) =>
                  locale === "en"
                    ? handleEnglishTitle(event.target.value)
                    : setActiveCopy({ title: event.target.value })
                }
                className="h-auto border-0 border-b border-border bg-transparent px-0 py-3 font-display text-3xl font-semibold shadow-none focus-visible:ring-0"
                placeholder={locale === "en" ? "Insight title" : "Judul insight"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insight-excerpt">Dek / excerpt</Label>
              <Textarea
                id="insight-excerpt"
                value={activeCopy.excerpt}
                onChange={(event) => setActiveCopy({ excerpt: event.target.value })}
                className="min-h-28 resize-y text-base leading-7"
                placeholder={
                  locale === "en"
                    ? "State the question, observation, or argument."
                    : "Jelaskan pertanyaan, temuan, atau pokok bahasannya."
                }
              />
            </div>
          </section>

          <section id="body" className="scroll-mt-24 space-y-4 border-t border-border pt-10">
            <div>
              <h2 className="text-lg font-semibold">Article</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The editor width follows the public reading measure rather than a database form.
              </p>
            </div>
            <TiptapEditor
              value={activeCopy.content}
              onChange={(value) => setActiveCopy({ content: value })}
              placeholder={
                locale === "en"
                  ? "Write the article…"
                  : "Tulis artikelnya…"
              }
            />
          </section>
        </div>
      </EditorialWorkspace>
    </form>
  );
}
