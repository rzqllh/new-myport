import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogForm } from "../../blog-form";

export const metadata = { title: "Edit Post — Admin" };

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Edit Post</h1>
        <p className="text-muted-foreground text-sm mt-1 truncate">{post.title}</p>
      </div>
      <BlogForm initialData={post} />
    </div>
  );
}
