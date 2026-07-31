"use client";

import { useState } from "react";
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
  SelectValue 
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";

const projectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  role: z.string().optional(),
  category: z.string().optional(),
  tech_stack: z.string().optional(), // We'll split by comma
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  sort_order: z.number().int().default(0),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: any;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      role: initialData?.role || "",
      category: initialData?.category || "",
      tech_stack: initialData?.tech_stack ? initialData.tech_stack.join(", ") : "",
      featured: initialData?.featured || false,
      status: initialData?.status || "draft",
      sort_order: initialData?.sort_order || 0,
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    setError(null);

    const techStackArray = values.tech_stack 
      ? values.tech_stack.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    const dataToSave = {
      title: values.title,
      slug: values.slug,
      description: values.description || null,
      role: values.role || null,
      category: values.category || null,
      tech_stack: techStackArray,
      featured: values.featured,
      status: values.status,
      sort_order: values.sort_order,
    };

    try {
      if (initialData?.id) {
        // Update existing
        const { error: updateError } = await supabase
          .from("projects")
          .update(dataToSave)
          .eq("id", initialData.id);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from("projects")
          .insert(dataToSave);

        if (insertError) throw insertError;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong saving the project.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
          <Input id="title" {...form.register("title")} placeholder="Project Title" />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
          <Input id="slug" {...form.register("slug")} placeholder="project-title" />
          {form.formState.errors.slug && (
            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
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
          <Input id="role" {...form.register("role")} placeholder="e.g. Lead Designer" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...form.register("category")} placeholder="e.g. Web Dev" />
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
          {isSubmitting ? "Saving..." : initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
