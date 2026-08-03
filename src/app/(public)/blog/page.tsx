import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Blog",
  description: "Writing on design, development, and product.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, tags, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <main className="mx-auto max-w-[720px] px-6 py-24 md:py-32">
      <header className="mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Writing</p>
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tighter">Blog</h1>
        <p className="text-muted-foreground mt-3">
          Thoughts on design, development, and product.
        </p>
      </header>

      {!posts || posts.length === 0 ? (
        <p className="text-muted-foreground">No posts published yet.</p>
      ) : (
        <div className="space-y-0 divide-y divide-border">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex items-start justify-between gap-6 py-7 hover:bg-muted/30 -mx-4 px-4 rounded-lg transition-colors"
            >
              <div className="space-y-1.5 min-w-0">
                <p className="text-xs text-muted-foreground">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                    : ""}
                </p>
                <h2 className="font-display font-semibold text-lg leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                )}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ArrowUpRight
                weight="bold"
                className="size-4 shrink-0 mt-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
