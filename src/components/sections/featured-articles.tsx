import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RevealCard } from "@/components/reveal-card";

export async function FeaturedArticles() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" aria-labelledby="articles-heading" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Section Header */}
        <ScrollReveal className="flex items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              Writing
            </p>
            <h2
              id="articles-heading"
              className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-foreground"
            >
              Latest Thoughts
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            All articles
            <ArrowRight weight="bold" className="size-3.5" />
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
              : "Recently";

            return (
              <RevealCard key={post.id} delay={i * 0.05} className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full p-6 lg:p-8 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  <p className="text-xs font-medium text-muted-foreground mb-4">
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
        
        {/* Mobile "All articles" link */}
        <ScrollReveal className="mt-8 sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all articles
            <ArrowRight weight="bold" className="size-3.5" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
