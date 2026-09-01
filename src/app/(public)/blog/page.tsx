import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles and technical notes on engineering, UI/UX research, and product delivery by Hafizh Rizqullah Prasetya.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Writing | Hafizh Rizqullah Prasetya",
    description: "Articles and technical notes on engineering, UI/UX research, and product delivery by Hafizh Rizqullah Prasetya.",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing | Hafizh Rizqullah Prasetya",
    description: "Articles and technical notes on engineering, UI/UX research, and product delivery by Hafizh Rizqullah Prasetya.",
  },
};

const DEFAULT_POSTS = [
  {
    id: "post-1",
    slug: "building-modular-windows-diagnostics",
    title: "Building Modular Windows Diagnostics with Python and WMI",
    excerpt: "Architecting a unified, state-aware performance and network troubleshooting toolkit with automated registry rollback snapshots.",
    tags: ["Python", "System Architecture", "CLI", "Windows"],
    published_at: "2024-06-15",
  },
  {
    id: "post-2",
    slug: "user-centered-design-mobile-banking",
    title: "Evaluating Banking Interfaces with User-Centered Design & A/B Testing",
    excerpt: "How quantitative usability metrics (SUS, Time-on-Task, Error Rates) inform navigation redesigns for high-volume consumer workflows.",
    tags: ["UI/UX", "User Research", "A/B Testing", "Fintech"],
    published_at: "2024-05-20",
  },
  {
    id: "post-3",
    slug: "token-driven-dark-mode-design-systems",
    title: "Designing Accessible Dark Themes with Semantic Color Tokens",
    excerpt: "Moving beyond inverted hex codes: creating WCAG AA compliant surface hierarchies and contrast tokens for technical interfaces.",
    tags: ["Design Systems", "CSS", "Accessibility", "Tailwind"],
    published_at: "2024-04-10",
  },
];

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: dbPosts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, tags, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const posts = (dbPosts && dbPosts.length > 0) ? dbPosts : DEFAULT_POSTS;

  return (
    <div className="mx-auto max-w-[800px] px-6 py-24 md:py-32">
      <header className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Articles & Notes</p>
        <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-foreground mb-4">
          Writing
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Articles and notes on software engineering, interface design research, and project delivery.
        </p>
      </header>

      <div className="space-y-0 divide-y divide-border/60">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex items-start justify-between gap-6 py-8 hover:bg-muted/40 -mx-4 px-4 rounded-2xl transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            <div className="space-y-2 min-w-0">
              <p className="text-xs font-mono text-muted-foreground">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                  : "Archived"}
              </p>
              <h2 className="font-display font-semibold text-xl leading-snug text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{post.excerpt}</p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <ArrowUpRight
              weight="bold"
              className="size-4 shrink-0 mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

