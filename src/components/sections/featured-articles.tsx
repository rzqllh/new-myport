import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RevealCard } from "@/components/reveal-card";

interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string | null;
}

const DEFAULT_POSTS: BlogPostItem[] = [
  {
    id: "post-1",
    slug: "building-modular-windows-diagnostics",
    title: "Building Modular Windows Diagnostics with Python and WMI",
    excerpt: "Architecting a unified, state-aware performance and network troubleshooting toolkit with automated registry rollback snapshots.",
    published_at: "2024-06-15",
  },
  {
    id: "post-2",
    slug: "user-centered-design-mobile-banking",
    title: "Evaluating Banking Interfaces with User-Centered Design & A/B Testing",
    excerpt: "How quantitative usability metrics (SUS, Time-on-Task, Error Rates) inform navigation redesigns for high-volume consumer workflows.",
    published_at: "2024-05-20",
  },
  {
    id: "post-3",
    slug: "token-driven-dark-mode-design-systems",
    title: "Designing Accessible Dark Themes with Semantic Color Tokens",
    excerpt: "Moving beyond inverted hex codes: creating WCAG AA compliant surface hierarchies and contrast tokens for technical interfaces.",
    published_at: "2024-04-10",
  },
];

export async function FeaturedArticles() {
  const supabase = await createClient();

  const { data: dbPosts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  const posts = (dbPosts && dbPosts.length > 0) ? dbPosts : DEFAULT_POSTS;

  return (
    <section id="blog" aria-labelledby="articles-heading" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Section Header */}
        <ScrollReveal className="flex items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              Articles & Notes
            </p>
            <h2
              id="articles-heading"
              className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tighter text-foreground"
            >
              Selected Writing
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            All writing
          </Link>
        </ScrollReveal>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post, i) => {
            const date = post.published_at
              ? new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Archived";

            return (
              <RevealCard key={post.id} delay={i * 0.05} className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full p-6 lg:p-8 rounded-3xl border border-border/80 bg-card hover:bg-muted/40 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 shadow-xs"
                >
                  <p className="text-xs font-mono text-muted-foreground mb-4">
                    {date}
                  </p>
                  
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-display font-semibold text-xl leading-snug text-foreground group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <ArrowUpRight
                      weight="bold"
                      className="size-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                    />
                  </div>

                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-auto">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </RevealCard>
            );
          })}
        </div>
        
        {/* Mobile "All writing" link */}
        <ScrollReveal className="mt-8 sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all writing
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

