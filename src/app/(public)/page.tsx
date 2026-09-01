import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/sections/hero";
import { AboutPreview } from "@/components/sections/about-preview";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { SkillsSection } from "@/components/sections/skills-section";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FooterCTA } from "@/components/sections/footer-cta";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: about },
    { data: settings },
    { count: projectsCount }
  ] = await Promise.all([
    supabase.from("about").select("photo_url").single(),
    supabase.from("site_settings").select("key, value").in("key", ["social", "cv", "hero_stats"]),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "published")
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
      />
      <FeaturedProjects />
      <SkillsSection />
      <AboutPreview />
      <FeaturedArticles />
      <TestimonialsSection />
      <FooterCTA cvUrl={(cv as { url?: string })?.url} />
    </>
  );
}


