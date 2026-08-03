import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return { title: data?.title ?? "Post", description: data?.excerpt ?? "" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  return (
    <main className="mx-auto max-w-[720px] px-6 py-24 md:py-32">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-12 transition-colors"
      >
        <ArrowLeft weight="bold" size={14} />
        All posts
      </Link>

      <header className="mb-12">
        {post.published_at && (
          <p className="text-xs text-muted-foreground mb-4">
            {new Date(post.published_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tighter leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-muted-foreground text-lg mt-4 leading-relaxed">{post.excerpt}</p>
        )}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {post.content && (
        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}
    </main>
  );
}
