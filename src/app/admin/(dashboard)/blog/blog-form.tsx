"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TiptapEditor } from "@/components/tiptap-editor";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
}

interface BlogFormProps {
  initialData?: BlogPost;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status ?? "draft");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (!initialData) {
      setSlug(
        e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content || null,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status,
      published_at: status === "published" ? (initialData?.published_at ?? new Date().toISOString()) : null,
    };

    let err;
    if (initialData?.id) {
      ({ error: err } = await supabase.from("blog_posts").update(payload).eq("id", initialData.id));
    } else {
      ({ error: err } = await supabase.from("blog_posts").insert(payload));
    }

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/blog");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
          <Input id="title" value={title} onChange={handleTitleChange} placeholder="Post title" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug <span className="text-destructive">*</span></Label>
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary shown in listings..."
          className="h-20 resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="design, ux, react" />
      </div>

      <div className="space-y-1.5">
        <Label>Content</Label>
        <TiptapEditor value={content} onChange={setContent} placeholder="Write your post..." />
      </div>

      <div className="flex items-center gap-4 pt-2 border-t">
        <div className="space-y-1 w-40">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as "draft" | "published")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : initialData ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
