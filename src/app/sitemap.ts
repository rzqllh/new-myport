import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app/"
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, updated_at");

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, status")
    .eq("status", "published");

  const staticRoutes = ["", "/about", "/contact", "/projects", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const projectRoutes = (projects ?? []).map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updated_at ?? new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const postRoutes = (posts ?? []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at ?? new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
