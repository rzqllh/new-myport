import { BlogForm } from "../blog-form";

export const metadata = { title: "New Post — Admin" };

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">New Post</h1>
        <p className="text-muted-foreground text-sm mt-1">Write a new blog post.</p>
      </div>
      <BlogForm />
    </div>
  );
}
