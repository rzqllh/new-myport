"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { createClient } from "@/lib/supabase/client";
import { X, DotsSixVertical, Image as ImageIcon } from "@phosphor-icons/react";

// ─── Schema ────────────────────────────────────────────────────────────────────

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  description: z.string().optional(),
  role: z.string().optional(),
  category: z.string().optional(),
  tech_stack: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
  sort_order: z.number().int(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

// ─── Types ─────────────────────────────────────────────────────────────────────

interface GalleryImage {
  /** Temporary client-side key for React lists */
  key: string;
  /** UUID from Supabase (undefined for newly-added images not yet saved) */
  id?: string;
  url: string;
  public_id: string;
  alt_text: string;
  sort_order: number;
}

interface ProjectFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cover image state
  const [coverUrl, setCoverUrl] = useState<string>(
    initialData?.cover_url ?? ""
  );
  const [coverPublicId, setCoverPublicId] = useState<string>(
    initialData?.cover_public_id ?? ""
  );

  // Gallery images state — loaded from project_images table on edit
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  // IDs of images that were already in DB and the user has removed
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  // ── Load existing gallery images on edit ──────────────────────────────────
  useEffect(() => {
    if (!initialData?.id) return;

    supabase
      .from("project_images")
      .select("id, url, public_id, alt_text, sort_order")
      .eq("project_id", initialData.id)
      .order("sort_order")
      .then(({ data, error: loadError }) => {
        if (loadError) {
          console.error("Failed to load project images:", loadError);
          return;
        }
        if (data) {
          setGalleryImages(
            data.map((img) => ({
              key: img.id,
              id: img.id,
              url: img.url,
              public_id: img.public_id ?? "",
              alt_text: img.alt_text ?? "",
              sort_order: img.sort_order,
            }))
          );
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id]);

  // ── Form ──────────────────────────────────────────────────────────────────
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      role: initialData?.role ?? "",
      category: initialData?.category ?? "",
      tech_stack: initialData?.tech_stack
        ? (initialData.tech_stack as string[]).join(", ")
        : "",
      featured: initialData?.featured ?? false,
      status: initialData?.status ?? "draft",
      sort_order: initialData?.sort_order ?? 0,
    },
  });

  // Auto-generate slug from title
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    form.setValue("title", e.target.value);
    if (!initialData?.id) {
      form.setValue(
        "slug",
        e.target.value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }

  // ── Gallery helpers ────────────────────────────────────────────────────────

  function addGalleryImage(url: string, public_id: string) {
    setGalleryImages((prev) => [
      ...prev,
      {
        key: crypto.randomUUID(),
        url,
        public_id,
        alt_text: "",
        sort_order: prev.length,
      },
    ]);
  }

  function removeGalleryImage(key: string) {
    setGalleryImages((prev) => {
      const img = prev.find((i) => i.key === key);
      if (img?.id) {
        setDeletedImageIds((ids) => [...ids, img.id!]);
      }
      return prev
        .filter((i) => i.key !== key)
        .map((i, idx) => ({ ...i, sort_order: idx }));
    });
  }

  function updateAltText(key: string, value: string) {
    setGalleryImages((prev) =>
      prev.map((i) => (i.key === key ? { ...i, alt_text: value } : i))
    );
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const techStackArray = values.tech_stack
      ? values.tech_stack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const dataToSave = {
      title: values.title,
      slug: values.slug,
      description: values.description ?? null,
      role: values.role ?? null,
      category: values.category ?? null,
      tech_stack: techStackArray,
      featured: values.featured,
      status: values.status,
      sort_order: values.sort_order,
      cover_url: coverUrl || null,
      cover_public_id: coverPublicId || null,
    };

    try {
      let projectId: string;

      if (initialData?.id) {
        // Update existing project
        const { error: updateError } = await supabase
          .from("projects")
          .update(dataToSave)
          .eq("id", initialData.id);

        if (updateError) throw updateError;
        projectId = initialData.id;
      } else {
        // Insert new project
        const { data: inserted, error: insertError } = await supabase
          .from("projects")
          .insert(dataToSave)
          .select("id")
          .single();

        if (insertError) throw insertError;
        projectId = inserted.id;
      }

      // ── Delete removed images ──────────────────────────────────────────────
      if (deletedImageIds.length > 0) {
        const { error: deleteError } = await supabase
          .from("project_images")
          .delete()
          .in("id", deletedImageIds);

        if (deleteError) throw deleteError;
      }

      // ── Upsert gallery images ──────────────────────────────────────────────
      const newImages = galleryImages.filter((i) => !i.id);
      const existingImages = galleryImages.filter((i) => i.id);

      if (newImages.length > 0) {
        const { error: insertImgError } = await supabase
          .from("project_images")
          .insert(
            newImages.map((img) => ({
              project_id: projectId,
              url: img.url,
              public_id: img.public_id || null,
              alt_text: img.alt_text || null,
              sort_order: img.sort_order,
            }))
          );

        if (insertImgError) throw insertImgError;
      }

      if (existingImages.length > 0) {
        for (const img of existingImages) {
          const { error: updateImgError } = await supabase
            .from("project_images")
            .update({
              alt_text: img.alt_text || null,
              sort_order: img.sort_order,
            })
            .eq("id", img.id!);

          if (updateImgError) throw updateImgError;
        }
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong saving the project."
      );
      setIsSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ── Basic info ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            {...form.register("title")}
            onChange={handleTitleChange}
            placeholder="Project Title"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">
            Slug <span className="text-destructive">*</span>
          </Label>
          <Input
            id="slug"
            {...form.register("slug")}
            placeholder="project-title"
          />
          {form.formState.errors.slug && (
            <p className="text-sm text-destructive">
              {form.formState.errors.slug.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Brief overview of the project..."
          className="h-24 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="role">Your Role</Label>
          <Input
            id="role"
            {...form.register("role")}
            placeholder="e.g. Lead Designer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            {...form.register("category")}
            placeholder="e.g. Web Dev"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
        <Input
          id="tech_stack"
          {...form.register("tech_stack")}
          placeholder="Next.js, Tailwind CSS, Supabase"
        />
      </div>

      {/* ── Cover image ───────────────────────────────────────────────────── */}
      <div className="space-y-3 pt-4 border-t">
        <div>
          <p className="text-sm font-medium">Cover Image</p>
          <p className="text-xs text-muted-foreground">
            Main image shown on the projects grid and detail header.
          </p>
        </div>
        <ImageUpload
          value={coverUrl || undefined}
          folder="portfolio/covers"
          label="Upload cover image"
          onUpload={(url, publicId) => {
            setCoverUrl(url);
            setCoverPublicId(publicId);
          }}
          onRemove={() => {
            setCoverUrl("");
            setCoverPublicId("");
          }}
        />
      </div>

      {/* ── Gallery images ────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-4 border-t">
        <div>
          <p className="text-sm font-medium">Gallery Images</p>
          <p className="text-xs text-muted-foreground">
            Additional screenshots or mockups shown in the project detail page.
          </p>
        </div>

        {galleryImages.length > 0 ? (
          <div className="space-y-3">
            {galleryImages.map((img) => (
              <div
                key={img.key}
                className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/30"
              >
                <DotsSixVertical
                  weight="bold"
                  size={16}
                  className="mt-2 text-muted-foreground shrink-0 cursor-grab"
                  aria-hidden
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt_text || "Gallery image"}
                  className="w-24 h-16 object-cover rounded-lg border border-border shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <Input
                    placeholder="Alt text (optional)"
                    value={img.alt_text}
                    onChange={(e) => updateAltText(img.key, e.target.value)}
                    className="h-8 text-sm"
                  />
                  <p className="text-xs text-muted-foreground truncate">
                    {img.url}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(img.key)}
                  className="mt-1 p-1.5 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors text-muted-foreground"
                  aria-label="Remove image"
                >
                  <X weight="bold" size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border text-muted-foreground">
            <ImageIcon weight="duotone" size={20} className="opacity-40" />
            <span className="text-sm">No gallery images yet.</span>
          </div>
        )}

        {/* Upload a new gallery image */}
        <ImageUpload
          folder="portfolio/gallery"
          label="Add gallery image"
          onUpload={addGalleryImage}
        />
      </div>

      {/* ── Meta controls ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
        <div className="space-y-3">
          <Label>Status</Label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-3">
          <Label>Sort Order</Label>
          <Input
            type="number"
            {...form.register("sort_order", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-3">
          <Label>Featured Project</Label>
          <div className="flex items-center h-10">
            <Controller
              control={form.control}
              name="featured"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="featured" className="font-normal">
                    Show on homepage
                  </Label>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex justify-end pt-6 border-t gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Project"
              : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
