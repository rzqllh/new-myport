import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET() {
  // Create an anon client without cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {}
      }
    }
  );

  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id, slug, title, description, category, tech_stack, status, featured, sort_order,
      project_images(url, alt_text, sort_order)
    `)
    .eq("status", "published")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return NextResponse.json({
    projects,
    error,
  });
}
