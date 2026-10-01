import Link from "next/link";
import {
  Article,
  ArrowRight,
  CheckCircle,
  Envelope,
  FolderOpen,
  Image,
  Info,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import {
  getAdminContentHealth,
  type ContentHealthSeverity,
} from "@/lib/content/admin-content-health";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

function formatDate(value: string | null | undefined) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function severityLabel(severity: ContentHealthSeverity) {
  if (severity === "blocking") return "Blocking";
  if (severity === "review") return "Review";
  return "Info";
}

function SeverityIcon({ severity }: { severity: ContentHealthSeverity }) {
  if (severity === "blocking") {
    return <XCircle className="size-[18px] shrink-0 text-destructive" />;
  }
  if (severity === "review") {
    return <WarningCircle className="size-[18px] shrink-0 text-muted-foreground" />;
  }
  return <Info className="size-[18px] shrink-0 text-muted-foreground" />;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    projectResult,
    postResult,
    unreadResult,
    missingAltResult,
    contentHealth,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select(
        "id, title, slug, status, description, cover_url, updated_at, featured"
      )
      .order("updated_at", { ascending: false })
      .limit(12),
    supabase
      .from("blog_posts")
      .select("id, title, slug, status, published_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(12),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("project_images")
      .select("*", { count: "exact", head: true })
      .is("alt_text", null),
    getAdminContentHealth(),
  ]);

  const projects = projectResult.data ?? [];
  const posts = postResult.data ?? [];
  const unreadMessages = unreadResult.count ?? 0;
  const missingAlt = missingAltResult.count ?? 0;

  const draftProjects = projects.filter((item) => item.status !== "published");
  const draftPosts = posts.filter((item) => item.status !== "published");
  const incompleteProjects = projects.filter(
    (item) => !item.description || !item.cover_url
  );

  const workflowAttention = [
    draftProjects.length
      ? {
          label: `${draftProjects.length} Work draft${draftProjects.length === 1 ? "" : "s"} waiting for review`,
          href: "/admin/projects?status=draft",
          icon: FolderOpen,
        }
      : null,
    draftPosts.length
      ? {
          label: `${draftPosts.length} Insight draft${draftPosts.length === 1 ? "" : "s"} waiting for review`,
          href: "/admin/blog?status=draft",
          icon: Article,
        }
      : null,
    unreadMessages
      ? {
          label: `${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"} in the inbox`,
          href: "/admin/messages",
          icon: Envelope,
        }
      : null,
    !contentHealth.schemaV2Available && incompleteProjects.length
      ? {
          label: `${incompleteProjects.length} legacy Work item${incompleteProjects.length === 1 ? "" : "s"} missing a summary or cover`,
          href: "/admin/projects",
          icon: WarningCircle,
        }
      : null,
    !contentHealth.schemaV2Available && missingAlt
      ? {
          label: `${missingAlt} legacy project image${missingAlt === 1 ? "" : "s"} missing alt text`,
          href: "/admin/projects",
          icon: Image,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: typeof FolderOpen;
  }[];

  const recent = [
    ...projects.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title,
      kind: "Work",
      href: `/admin/projects/${item.id}/edit`,
      updatedAt: item.updated_at,
      status: item.status,
    })),
    ...posts.slice(0, 5).map((item) => ({
      id: item.id,
      title: item.title,
      kind: "Insight",
      href: `/admin/blog/${item.id}/edit`,
      updatedAt: item.updated_at,
      status: item.status,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 7);

  const publishedProjects = projects.filter(
    (item) => item.status === "published"
  ).length;
  const publishedPosts = posts.filter(
    (item) => item.status === "published"
  ).length;
  const blockingHealth = contentHealth.issues.filter(
    (issue) => issue.severity === "blocking"
  ).length;
  const reviewHealth = contentHealth.issues.filter(
    (issue) => issue.severity === "review"
  ).length;

  return (
    <div className="space-y-9">
      <AdminPageHeader
        title="Dashboard"
        description="What needs attention, what changed recently, and the current publishing state."
      />

      <section aria-labelledby="attention-heading" className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="attention-heading" className="text-base font-semibold">
            Workflow attention
          </h2>
          <span className="text-xs text-muted-foreground">
            {workflowAttention.length} active
          </span>
        </div>

        <div className="border-y border-border">
          {workflowAttention.length ? (
            workflowAttention.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-3 border-b border-border px-1 py-4 last:border-b-0"
                >
                  <Icon className="size-[18px] shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-sm text-foreground">
                    {item.label}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })
          ) : (
            <p className="py-6 text-sm text-muted-foreground">
              No drafts or inbox items currently need workflow attention.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="health-heading" className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <div>
            <h2 id="health-heading" className="text-base font-semibold">
              Content health
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Deterministic checks for publish readiness, localization, accessibility, and evidence.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {blockingHealth
              ? `${blockingHealth} blocking`
              : reviewHealth
                ? `${reviewHealth} to review`
                : "No flagged gaps"}
          </span>
        </div>

        <div className="border-y border-border">
          {contentHealth.issues.length ? (
            contentHealth.issues.map((issue) => (
              <Link
                key={issue.id}
                href={issue.href}
                className="group grid gap-3 border-b border-border px-1 py-4 last:border-b-0 sm:grid-cols-[90px_minmax(0,1fr)_auto] sm:items-start"
              >
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <SeverityIcon severity={issue.severity} />
                  {severityLabel(issue.severity)}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">
                    {issue.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {issue.detail}
                  </span>
                </span>
                <ArrowRight className="mt-0.5 hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 sm:block" />
              </Link>
            ))
          ) : (
            <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground">
              <CheckCircle className="size-[18px]" />
              <span>
                Published content passes the current deterministic health checks.
              </span>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="recent-heading" className="space-y-3">
        <h2 id="recent-heading" className="text-base font-semibold">
          Recent edits
        </h2>
        <div className="divide-y divide-border border-y border-border">
          {recent.map((item) => (
            <Link
              key={`${item.kind}-${item.id}`}
              href={item.href}
              className="grid gap-1 py-4 sm:grid-cols-[90px_1fr_auto] sm:items-center sm:gap-4"
            >
              <span className="text-xs text-muted-foreground">{item.kind}</span>
              <span className="truncate text-sm font-medium text-foreground">
                {item.title}
              </span>
              <span className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{item.status}</span>
                <span>{formatDate(item.updatedAt)}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="snapshot-heading" className="space-y-3">
        <h2 id="snapshot-heading" className="text-base font-semibold">
          Publishing snapshot
        </h2>
        <dl className="grid border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
          <div className="py-5 sm:px-5 sm:first:pl-0">
            <dt className="text-xs text-muted-foreground">Work</dt>
            <dd className="mt-1 text-sm font-medium">
              {publishedProjects} published / {projects.length} loaded
            </dd>
          </div>
          <div className="border-t border-border py-5 sm:border-t-0 sm:px-5">
            <dt className="text-xs text-muted-foreground">Insights</dt>
            <dd className="mt-1 text-sm font-medium">
              {publishedPosts} published / {posts.length} loaded
            </dd>
          </div>
          <div className="border-t border-border py-5 sm:border-t-0 sm:px-5">
            <dt className="text-xs text-muted-foreground">Inbox</dt>
            <dd className="mt-1 text-sm font-medium">
              {unreadMessages ? `${unreadMessages} unread` : "Up to date"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
