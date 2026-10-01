import Link from "next/link";
import {
  ArrowSquareOut,
  PencilSimple,
  Plus,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminEmptyState,
  AdminErrorState,
} from "@/components/admin/admin-states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteBlogButton } from "./delete-blog-button";

export const metadata = { title: "Insights — Admin" };

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>;
}

function formatDate(value: string | null) {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminBlogPage({ searchParams }: Props) {
  const { q = "", status = "all" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, status, published_at, updated_at")
    .order("updated_at", { ascending: false });

  if (status === "draft" || status === "published") {
    query = query.eq("status", status);
  }

  if (q.trim()) {
    query = query.ilike("title", `%${q.trim()}%`);
  }

  const { data: posts, error } = await query;

  return (
    <div className="space-y-7">
      <AdminPageHeader
        title="Insights"
        description="Project notes, research, technical writing, and documented lessons."
        action={
          <Button
            render={<Link href="/admin/blog/new" />}
            nativeButton={false}
          >
            <Plus className="size-4" />
            New insight
          </Button>
        }
      />

      <form className="flex flex-col gap-3 sm:flex-row sm:items-center" method="get">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search insights"
          className="sm:max-w-xs"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All states</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      {error ? (
        <AdminErrorState description="Insights could not be loaded from the content database." />
      ) : !posts?.length ? (
        <AdminEmptyState
          title={q || status !== "all" ? "No matching insights" : "No insights yet"}
          description={
            q || status !== "all"
              ? "Adjust the search or publishing-state filter."
              : "Create the first Insight when there is a real project, research note, or technical subject worth documenting."
          }
        />
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {posts.map((post) => (
            <article
              key={post.id}
              className="grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-foreground">
                  {post.title}
                </h2>
                <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {post.excerpt || "No excerpt yet."}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>/insights/{post.slug}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={
                        post.status === "published"
                          ? "size-1.5 rounded-full bg-emerald-500"
                          : "size-1.5 rounded-full bg-muted-foreground"
                      }
                    />
                    {post.status}
                  </span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 md:justify-end">
                {post.status === "published" ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    render={
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        aria-label={`Open ${post.title}`}
                      />
                    }
                    nativeButton={false}
                  >
                    <ArrowSquareOut className="size-4" />
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="icon"
                  render={
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      aria-label={`Edit ${post.title}`}
                    />
                  }
                  nativeButton={false}
                >
                  <PencilSimple className="size-4" />
                </Button>
                <DeleteBlogButton id={post.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
