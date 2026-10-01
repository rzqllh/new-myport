import Link from "next/link";
import {
  ArrowSquareOut,
  PencilSimple,
  Plus,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminEmptyState,
  AdminErrorState,
} from "@/components/admin/admin-states";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminProjectsPage({ searchParams }: Props) {
  const { q = "", status = "all" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select(
      "id, slug, title, description, category, status, featured, cover_url, updated_at"
    )
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (status === "draft" || status === "published") {
    query = query.eq("status", status);
  }

  if (q.trim()) {
    query = query.ilike("title", `%${q.trim()}%`);
  }

  const { data: projects, error } = await query;

  return (
    <div className="space-y-7">
      <AdminPageHeader
        title="Work"
        description="Case studies, products, tools, and research that appear in the portfolio."
        action={
          <Button
            render={<Link href="/admin/projects/new" />}
            nativeButton={false}
          >
            <Plus className="size-4" />
            New work
          </Button>
        }
      />

      <form className="flex flex-col gap-3 sm:flex-row sm:items-center" method="get">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search work"
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
        <AdminErrorState description="Work could not be loaded from the content database." />
      ) : !projects?.length ? (
        <AdminEmptyState
          title={q || status !== "all" ? "No matching work" : "No work yet"}
          description={
            q || status !== "all"
              ? "Adjust the search or publishing-state filter."
              : "Create the first Work item to start the portfolio collection."
          }
        />
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {projects.map((project) => (
            <article
              key={project.id}
              className="grid gap-4 py-5 md:grid-cols-[72px_minmax(0,1fr)_auto] md:items-center"
            >
              <div
                aria-hidden="true"
                className="aspect-[4/3] rounded-md border border-border bg-muted bg-cover bg-center"
                style={
                  project.cover_url
                    ? { backgroundImage: `url("${project.cover_url}")` }
                    : undefined
                }
              />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-sm font-semibold text-foreground">
                    {project.title}
                  </h2>
                  {project.featured ? (
                    <Star weight="fill" className="size-3.5 text-foreground" aria-label="Featured" />
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                  {project.description || "No summary yet."}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>/work/{project.slug}</span>
                  <span>{project.category || "Unclassified"}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={
                        project.status === "published"
                          ? "size-1.5 rounded-full bg-emerald-500"
                          : "size-1.5 rounded-full bg-muted-foreground"
                      }
                    />
                    {project.status}
                  </span>
                  <span>Edited {formatDate(project.updated_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 md:justify-end">
                {project.status === "published" ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    render={
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        aria-label={`Open ${project.title}`}
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
                      href={`/admin/projects/${project.id}/edit`}
                      aria-label={`Edit ${project.title}`}
                    />
                  }
                  nativeButton={false}
                >
                  <PencilSimple className="size-4" />
                </Button>
                <DeleteProjectButton id={project.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
