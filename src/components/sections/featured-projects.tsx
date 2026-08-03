import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RevealCard } from "@/components/reveal-card";
import { ProjectCard } from "@/components/project-card";

export async function FeaturedProjects() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      id, slug, title, description, category, tech_stack, status, featured, cover_url, cover_public_id
    `
    )
    .eq("featured", true)
    .eq("status", "published")
    .order("sort_order")
    .limit(3);

  // If there's an error, show it prominently instead of silently hiding
  if (error) {
    return (
      <section className="py-24 md:py-32 bg-red-50 text-red-600 font-mono text-xs">
        <div className="mx-auto max-w-[1400px] px-6">
          <p className="font-bold text-base mb-2">Error fetching featured projects:</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      </section>
    );
  }

  // If no featured projects yet, section is hidden (not rendered)
  if (!projects || projects.length === 0) return null;

  const [primary, ...secondary] = projects;

  return (
    <section
      id="projects"
      aria-labelledby="featured-projects-heading"
      className="py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Section header */}
        <ScrollReveal className="flex items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              Selected Work
            </p>
            <h2
              id="featured-projects-heading"
              className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-foreground"
            >
              What I&apos;ve Built
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            All projects
            <ArrowRight weight="bold" className="size-3.5" />
          </Link>
        </ScrollReveal>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <RevealCard key={project.id} delay={0.05 + i * 0.05} className="h-full">
              <ProjectCard
                project={project as Parameters<typeof ProjectCard>[0]["project"]}
                className="h-full"
                featured={i === 0 && projects.length % 2 !== 0} // Feature the first if odd number of projects to balance, or just leave it
              />
            </RevealCard>
          ))}
        </div>

        {/* Mobile "All projects" link */}
        <ScrollReveal className="mt-8 sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all projects
            <ArrowRight weight="bold" className="size-3.5" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
