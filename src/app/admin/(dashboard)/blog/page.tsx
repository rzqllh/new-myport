import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { DeleteBlogButton } from "./delete-blog-button";
import { cn } from "@/lib/utils";


export const metadata = { title: "Blog — Admin" };

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, status, published_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {posts?.length ?? 0} post{posts?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/blog/new" className={cn(buttonVariants())}>
          <Plus weight="bold" data-icon="inline-start" />
          New Post
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          No posts yet.{" "}
          <Link href="/admin/blog/new" className="text-primary hover:underline">
            Write one.
          </Link>
        </p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{post.title}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  /blog/{post.slug}
                </p>
              </div>
              <Badge variant={post.status === "published" ? "default" : "secondary"} className="shrink-0">
                {post.status}
              </Badge>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/blog/${post.id}/edit`} className={cn(buttonVariants({ size: "sm", variant: "ghost" }))}>
                  <PencilSimple weight="duotone" size={16} />
                </Link>
                <DeleteBlogButton id={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
