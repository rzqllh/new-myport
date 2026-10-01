"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowSquareOut,
  Image as ImageIcon,
  X,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { createSlug, validateSlug } from "@/lib/content/slug";
import { isV2SchemaUnavailable } from "@/lib/content/schema-compat";
import {
  EditorialWorkspace,
  LocaleSwitch,
  type EditorSection,
} from "@/components/admin/editorial-workspace";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ImageUpload } from "@/components/image-upload";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type PublishState = "draft" | "published";
type Locale = "en" | "id";

interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  role: string | null;
  category: string | null;
  tech_stack: string[];
  demo_url: string | null;
  github_url: string | null;
  featured: boolean;
  status: PublishState;
  sort_order: number;
  cover_url: string | null;
  cover_public_id: string | null;
}

interface GalleryImage {
  key: string;
  id?: string;
  url: string;
  public_id: string;
  alt_text: string;
  sort_order: number;
}

interface WorkCopy {
  title: string;
  summary: string;
  role: string;
  context: string;
  challenge: string;
  approach: string;
  outcome: string;
  lessons: string;
  seoTitle: string;
  seoDescription: string;
}

const blankCopy: WorkCopy = {
  title: "",
  summary: "",
  role: "",
  context: "",
  challenge: "",
  approach: "",
  outcome: "",
  lessons: "",
  seoTitle: "",
  seoDescription: "",
};

function hasCopy(copy: WorkCopy) {
  return Boolean(
    copy.title ||
      copy.summary ||
      copy.context ||
      copy.challenge ||
      copy.approach ||
      copy.outcome
  );
}

export function ProjectForm({ initialData }: { initialData?: ProjectRecord }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [locale, setLocale] = useState<Locale>("en");
  const [enCopy, setEnCopy] = useState<WorkCopy>({
    ...blankCopy,
    title: initialData?.title ?? "",
    summary: initialData?.description ?? "",
    role: initialData?.role ?? "",
  });
  const [idCopy, setIdCopy] = useState<WorkCopy>(blankCopy);
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [status, setStatus] = useState<PublishState>(
    initialData?.status ?? "draft"
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [techStack, setTechStack] = useState(
    initialData?.tech_stack?.join(", ") ?? ""
  );
  const [demoUrl, setDemoUrl] = useState(initialData?.demo_url ?? "");
  const [githubUrl, setGithubUrl] = useState(initialData?.github_url ?? "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [discipline, setDiscipline] = useState("engineering");
  const [workType, setWorkType] = useState("case-study");
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url ?? "");
  const [coverPublicId, setCoverPublicId] = useState(
    initialData?.cover_public_id ?? ""
  );
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [permalinkEditing, setPermalinkEditing] = useState(
    !initialData || initialData.status !== "published"
  );
  const [v2Available, setV2Available] = useState<boolean | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCopy = locale === "en" ? enCopy : idCopy;
  const setActiveCopy = (patch: Partial<WorkCopy>) => {
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

    Promise.all([
      supabase
        .from("project_images")
        .select("id, url, public_id, alt_text, sort_order")
        .eq("project_id", initialData.id)
        .order("sort_order"),
      supabase
        .from("work_items")
        .select("discipline, work_type")
        .eq("id", initialData.id)
        .maybeSingle(),
      supabase
        .from("work_translations")
        .select(
          "locale, title, summary, role, context, challenge, approach, outcome, lessons, seo_title, seo_description"
        )
        .eq("work_id", initialData.id),
    ]).then(([imagesResult, workResult, translationResult]) => {
      if (!active) return;

      if (imagesResult.data) {
        setGalleryImages(
          imagesResult.data.map((image) => ({
            key: image.id,
            id: image.id,
            url: image.url,
            public_id: image.public_id ?? "",
            alt_text: image.alt_text ?? "",
            sort_order: image.sort_order,
          }))
        );
      }

      if (workResult.error && isV2SchemaUnavailable(workResult.error)) {
        setV2Available(false);
        return;
      }

      if (
        translationResult.error &&
        isV2SchemaUnavailable(translationResult.error)
      ) {
        setV2Available(false);
        return;
      }

      setV2Available(true);

      if (workResult.data) {
        setDiscipline(workResult.data.discipline);
        setWorkType(workResult.data.work_type);
      }

      for (const translation of translationResult.data ?? []) {
        const copy: WorkCopy = {
          title: translation.title ?? "",
          summary: translation.summary ?? "",
          role: translation.role ?? "",
          context: translation.context ?? "",
          challenge: translation.challenge ?? "",
          approach: translation.approach ?? "",
          outcome: translation.outcome ?? "",
          lessons: translation.lessons ?? "",
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

  const handleEnglishTitle = (value: string) => {
    setDirty(true);
    setEnCopy((current) => ({ ...current, title: value }));
    if (!initialData) setSlug(createSlug(value));
  };

  function addGalleryImage(url: string, publicId: string) {
    setDirty(true);
    setGalleryImages((current) => [
      ...current,
      {
        key: crypto.randomUUID(),
        url,
        public_id: publicId,
        alt_text: "",
        sort_order: current.length,
      },
    ]);
  }

  function removeGalleryImage(key: string) {
    setDirty(true);
    setGalleryImages((current) => {
      const image = current.find((item) => item.key === key);
      if (image?.id) {
        setDeletedImageIds((ids) => [...ids, image.id!]);
      }
      return current
        .filter((item) => item.key !== key)
        .map((item, index) => ({ ...item, sort_order: index }));
    });
  }

  async function syncV2(projectId: string) {
    const workPayload = {
      id: projectId,
      slug,
      status,
      discipline,
      work_type: workType,
      featured,
      sort_order: sortOrder,
      live_url: demoUrl.trim() || null,
      repository_url: githubUrl.trim() || null,
      published_at: status === "published" ? new Date().toISOString() : null,
    };

    const { error: workError } = await supabase
      .from("work_items")
      .upsert(workPayload, { onConflict: "id" });

    if (workError) {
      if (isV2SchemaUnavailable(workError)) {
        setV2Available(false);
        return;
      }
      throw workError;
    }

    const translations = [
      {
        work_id: projectId,
        locale: "en",
        status,
        title: enCopy.title.trim(),
        summary: enCopy.summary.trim() || null,
        role: enCopy.role.trim() || null,
        context: enCopy.context.trim() || null,
        challenge: enCopy.challenge.trim() || null,
        approach: enCopy.approach.trim() || null,
        outcome: enCopy.outcome.trim() || null,
        lessons: enCopy.lessons.trim() || null,
        seo_title: enCopy.seoTitle.trim() || null,
        seo_description: enCopy.seoDescription.trim() || null,
      },
    ];

    if (hasCopy(idCopy)) {
      translations.push({
        work_id: projectId,
        locale: "id",
        status: "draft",
        title: idCopy.title.trim() || enCopy.title.trim(),
        summary: idCopy.summary.trim() || null,
        role: idCopy.role.trim() || null,
        context: idCopy.context.trim() || null,
        challenge: idCopy.challenge.trim() || null,
        approach: idCopy.approach.trim() || null,
        outcome: idCopy.outcome.trim() || null,
        lessons: idCopy.lessons.trim() || null,
        seo_title: idCopy.seoTitle.trim() || null,
        seo_description: idCopy.seoDescription.trim() || null,
      });
    }

    const { error: translationError } = await supabase
      .from("work_translations")
      .upsert(translations, { onConflict: "work_id,locale" });

    if (translationError && !isV2SchemaUnavailable(translationError)) {
      throw translationError;
    }

    if (
      initialData?.status === "published" &&
      initialData.slug !== slug
    ) {
      const redirects = [
        {
          content_type: "work",
          content_id: projectId,
          locale: "en",
          old_slug: initialData.slug,
          new_slug: slug,
        },
      ];

      if (hasCopy(idCopy)) {
        redirects.push({
          content_type: "work",
          content_id: projectId,
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
      const legacyPayload = {
        title: enCopy.title.trim(),
        slug,
        description: enCopy.summary.trim() || null,
        role: enCopy.role.trim() || null,
        category: category.trim() || null,
        tech_stack: techStack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        demo_url: demoUrl.trim() || null,
        github_url: githubUrl.trim() || null,
        featured,
        status,
        sort_order: sortOrder,
        cover_url: coverUrl || null,
        cover_public_id: coverPublicId || null,
      };

      let projectId = initialData?.id;

      if (projectId) {
        const { error: updateError } = await supabase
          .from("projects")
          .update(legacyPayload)
          .eq("id", projectId);
        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from("projects")
          .insert(legacyPayload)
          .select("id")
          .single();
        if (insertError) throw insertError;
        projectId = data.id;
      }

      if (deletedImageIds.length) {
        const { error: deleteError } = await supabase
          .from("project_images")
          .delete()
          .in("id", deletedImageIds);
        if (deleteError) throw deleteError;
      }

      const newImages = galleryImages.filter((image) => !image.id);
      if (newImages.length) {
        const { error: insertImageError } = await supabase
          .from("project_images")
          .insert(
            newImages.map((image) => ({
              project_id: projectId,
              url: image.url,
              public_id: image.public_id || null,
              alt_text: image.alt_text || null,
              sort_order: image.sort_order,
            }))
          );
        if (insertImageError) throw insertImageError;
      }

      for (const image of galleryImages.filter((item) => item.id)) {
        const { error: imageError } = await supabase
          .from("project_images")
          .update({
            alt_text: image.alt_text || null,
            sort_order: image.sort_order,
          })
          .eq("id", image.id!);
        if (imageError) throw imageError;
      }

      if (!projectId) throw new Error("Project ID was not returned after save.");
      await syncV2(projectId);
      setDirty(false);
      router.push("/admin/projects");
      router.refresh();
    } catch (caught: unknown) {
      console.error(caught);
      setError(
        caught instanceof Error ? caught.message : "Unable to save this Work item."
      );
    } finally {
      setSaving(false);
    }
  }

  const sections: EditorSection[] = [
    { id: "overview", label: "Overview", complete: Boolean(activeCopy.title) },
    {
      id: "story",
      label: "Story",
      complete: Boolean(activeCopy.context || activeCopy.challenge || activeCopy.approach),
    },
    {
      id: "outcome",
      label: "Outcome",
      complete: Boolean(activeCopy.outcome),
    },
    { id: "media", label: "Media", complete: Boolean(coverUrl || galleryImages.length) },
  ];

  const inspector = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium">Publication</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          English remains the default public locale; Indonesian publishes independently when its translation is ready.
        </p>
      </div>

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
        <Label htmlFor="work-slug">Permalink</Label>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          /work/{slug || "untitled"}
        </div>
        <Input
          id="work-slug"
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
            The previous URL will be preserved in redirect history when schema v2 is active.
          </p>
        ) : null}
      </div>

      <div className="space-y-3 border-t border-border pt-5">
        <Label>Classification</Label>
        <Select value={discipline} onValueChange={(value) => { setDirty(true); setDiscipline(value ?? "engineering"); }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="project-management">Project management</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="research-design">Research & design</SelectItem>
          </SelectContent>
        </Select>
        <Select value={workType} onValueChange={(value) => { setDirty(true); setWorkType(value ?? "case-study"); }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="case-study">Case study</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="tool">Tool</SelectItem>
            <SelectItem value="research">Research</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 border-t border-border pt-5">
        <Label htmlFor="seo-title">SEO title · {locale.toUpperCase()}</Label>
        <Input
          id="seo-title"
          value={activeCopy.seoTitle}
          onChange={(event) => setActiveCopy({ seoTitle: event.target.value })}
        />
        <Label htmlFor="seo-description">SEO description</Label>
        <Textarea
          id="seo-description"
          value={activeCopy.seoDescription}
          onChange={(event) => setActiveCopy({ seoDescription: event.target.value })}
          className="min-h-24"
        />
      </div>

      <div className="space-y-3 border-t border-border pt-5">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="featured">Featured</Label>
          <Switch
            id="featured"
            checked={featured}
            onCheckedChange={(value) => { setDirty(true); setFeatured(value); }}
          />
        </div>
        <Label htmlFor="sort-order">Sort order</Label>
        <Input
          id="sort-order"
          type="number"
          value={sortOrder}
          onChange={(event) => { setDirty(true); setSortOrder(Number(event.target.value)); }}
        />
      </div>

      <p className="border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
        {v2Available === false
          ? "Schema v2 is not available in this environment yet. Legacy fields will still save safely."
          : "Bilingual content and redirect history sync to schema v2."}
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <AdminPageHeader
        title={initialData ? "Edit work" : "New work"}
        description="Write the case study as a document. Publishing controls and permalink management stay in the inspector."
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
                    href={`/work/${initialData.slug}`}
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
              <Label htmlFor="work-title">Title</Label>
              <Input
                id="work-title"
                value={activeCopy.title}
                onChange={(event) =>
                  locale === "en"
                    ? handleEnglishTitle(event.target.value)
                    : setActiveCopy({ title: event.target.value })
                }
                className="h-auto border-0 border-b border-border bg-transparent px-0 py-3 font-display text-3xl font-semibold shadow-none focus-visible:ring-0"
                placeholder={locale === "en" ? "Work title" : "Judul karya"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work-summary">Summary</Label>
              <Textarea
                id="work-summary"
                value={activeCopy.summary}
                onChange={(event) => setActiveCopy({ summary: event.target.value })}
                className="min-h-28 resize-y text-base leading-7"
                placeholder={
                  locale === "en"
                    ? "What is this work and why does it matter?"
                    : "Apa pekerjaan ini dan kenapa konteksnya penting?"
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work-role">Your role</Label>
              <Input
                id="work-role"
                value={activeCopy.role}
                onChange={(event) => setActiveCopy({ role: event.target.value })}
              />
            </div>
          </section>

          <section id="story" className="scroll-mt-24 space-y-6 border-t border-border pt-10">
            <h2 className="text-lg font-semibold">Story</h2>
            {([
              ["context", "Context", locale === "en" ? "What was happening around the work?" : "Apa konteks pekerjaan ini?"],
              ["challenge", "The issue", locale === "en" ? "What problem or constraint needed attention?" : "Masalah atau batasan apa yang perlu ditangani?"],
              ["approach", "Approach", locale === "en" ? "What did you do, coordinate, or decide?" : "Apa yang Anda kerjakan, koordinasikan, atau putuskan?"],
            ] as const).map(([key, label, placeholder]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`work-${key}`}>{label}</Label>
                <Textarea
                  id={`work-${key}`}
                  value={activeCopy[key]}
                  onChange={(event) => setActiveCopy({ [key]: event.target.value })}
                  placeholder={placeholder}
                  className="min-h-36 resize-y leading-7"
                />
              </div>
            ))}
          </section>

          <section id="outcome" className="scroll-mt-24 space-y-6 border-t border-border pt-10">
            <h2 className="text-lg font-semibold">Outcome</h2>
            <div className="space-y-2">
              <Label htmlFor="work-outcome">What changed</Label>
              <Textarea
                id="work-outcome"
                value={activeCopy.outcome}
                onChange={(event) => setActiveCopy({ outcome: event.target.value })}
                className="min-h-32 resize-y leading-7"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work-lessons">Notes / lessons</Label>
              <Textarea
                id="work-lessons"
                value={activeCopy.lessons}
                onChange={(event) => setActiveCopy({ lessons: event.target.value })}
                className="min-h-28 resize-y leading-7"
              />
            </div>
          </section>

          <section id="media" className="scroll-mt-24 space-y-6 border-t border-border pt-10">
            <div>
              <h2 className="text-lg font-semibold">Media & shared metadata</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                These fields are shared across languages.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Legacy category</Label>
                <Input id="category" value={category} onChange={(event) => { setDirty(true); setCategory(event.target.value); }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech-stack">Technology / tools</Label>
                <Input id="tech-stack" value={techStack} onChange={(event) => { setDirty(true); setTechStack(event.target.value); }} placeholder="Next.js, Supabase, Grafana" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo-url">Live URL</Label>
                <Input id="demo-url" value={demoUrl} onChange={(event) => { setDirty(true); setDemoUrl(event.target.value); }} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github-url">Repository URL</Label>
                <Input id="github-url" value={githubUrl} onChange={(event) => { setDirty(true); setGithubUrl(event.target.value); }} />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Cover image</Label>
              <ImageUpload
                value={coverUrl || undefined}
                folder="portfolio/covers"
                label="Upload cover image"
                onUpload={(url, publicId) => { setDirty(true); setCoverUrl(url); setCoverPublicId(publicId); }}
                onRemove={() => { setDirty(true); setCoverUrl(""); setCoverPublicId(""); }}
              />
            </div>

            <div className="space-y-4">
              <Label>Gallery / evidence images</Label>
              {galleryImages.length ? (
                <div className="divide-y divide-border border-y border-border">
                  {galleryImages.map((image) => (
                    <div key={image.key} className="flex gap-4 py-4">
                      <div
                        className="h-16 w-24 shrink-0 rounded-md border border-border bg-muted bg-cover bg-center"
                        style={{ backgroundImage: `url("${image.url}")` }}
                      />
                      <div className="min-w-0 flex-1">
                        <Input
                          value={image.alt_text}
                          onChange={(event) => {
                            setDirty(true);
                            setGalleryImages((items) =>
                              items.map((item) =>
                                item.key === image.key
                                  ? { ...item, alt_text: event.target.value }
                                  : item
                              )
                            );
                          }}
                          placeholder="Describe this image"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGalleryImage(image.key)}
                        aria-label="Remove image"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 border-y border-dashed border-border py-6 text-sm text-muted-foreground">
                  <ImageIcon className="size-4" />
                  No gallery images yet.
                </div>
              )}
              <ImageUpload
                folder="portfolio/gallery"
                label="Add gallery image"
                onUpload={addGalleryImage}
              />
            </div>
          </section>
        </div>
      </EditorialWorkspace>
    </form>
  );
}
