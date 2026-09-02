import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/sections/hero";
import { AboutPreview } from "@/components/sections/about-preview";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { SkillsSection } from "@/components/sections/skills-section";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FooterCTA } from "@/components/sections/footer-cta";

export const dynamic = 'force-dynamic';

async function getLiveGitHubActivity() {
  try {
    const res = await fetch("https://api.github.com/users/rzqllh/events?per_page=6", {
      headers: {
        "User-Agent": "rzqllh-portfolio-sync",
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const events = await res.json();
    if (!Array.isArray(events)) return null;

    const push = events.find((e: { type: string }) => e.type === "PushEvent" || e.type === "CreateEvent");
    if (!push) return null;

    return {
      available: true,
      repoName: push.repo?.name ? push.repo.name.replace(/^rzqllh\//, "") : undefined,
      commitMessage: push.payload?.commits?.[0]?.message || "Updated repository",
      createdAt: push.created_at,
    };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: about },
    { data: settings },
    { count: projectsCount },
    { data: dbProjects },
    liveGitHub,
  ] = await Promise.all([
    supabase.from("about").select("photo_url").single(),
    supabase.from("site_settings").select("key, value").in("key", ["social", "cv", "hero_stats"]),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("projects").select("slug, title, description, category, tech_stack, github_url, demo_url").eq("status", "published").order("sort_order").limit(4),
    getLiveGitHubActivity(),
  ]);

  const social = settings?.find(s => s.key === "social")?.value || {};
  const cv = settings?.find(s => s.key === "cv")?.value || {};
  const heroStats = settings?.find(s => s.key === "hero_stats")?.value || {};

  return (
    <>
      <Hero 
        photoUrl={about?.photo_url}
        socialLinks={social as Record<string, string>}
        cvUrl={(cv as { url?: string })?.url}
        projectsCount={projectsCount || 0}
        heroStats={heroStats as Record<string, string>}
        selectedProjects={dbProjects && dbProjects.length > 0 ? dbProjects : undefined}
        liveGitHub={liveGitHub}
      />
      <FeaturedProjects />
      <SkillsSection />
      <AboutPreview />
      <TestimonialsSection />
      <FeaturedArticles />
      <FooterCTA cvUrl={(cv as { url?: string })?.url} />
    </>
  );
}
