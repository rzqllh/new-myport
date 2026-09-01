import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Blog",
  description: "Writing on design, development, and product.",
};

export default async function BlogPage() {
  let posts: { id: string; slug: string; title: string; excerpt: string | null; tags: string[]; published_at: string | null }[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("id, slug, title, excerpt, tags, published_at").eq("status", "published").order("published_at", { ascending: false });
    posts = data || [];
  }

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-20 md:py-28">
      <header className="mb-16 border-b border-foreground pb-12">
        <p className="mb-4 text-sm font-semibold text-primary">Working notes</p>
        <h1 className="font-display text-5xl font-medium tracking-[-0.05em] md:text-7xl">Notes from the work</h1>
        <p className="mt-5 max-w-[60ch] text-muted-foreground">Project control, systems thinking, and practical lessons from building tools around operational work.</p>
      </header>

      {!posts || posts.length === 0 ? (
        <div className="border-b border-border py-10"><p className="font-medium">No public notes yet.</p><p className="mt-2 text-sm text-muted-foreground">Drafts remain private until the evidence and examples are ready to support them.</p></div>
      ) : (
        <div className="space-y-0 divide-y divide-border">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group grid gap-4 border-b border-border py-7 transition-colors hover:border-primary md:grid-cols-[10rem_1fr]"
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
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
