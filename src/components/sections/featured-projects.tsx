import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RevealCard } from "@/components/reveal-card";
import { ProjectCard, type Project } from "@/components/project-card";
import { FALLBACK_PROJECTS } from "@/lib/project-content";

export async function FeaturedProjects() {
  const supabase = await createClient();

  const { data: dbProjects } = await supabase
    .from("projects")
    .select(
      `
      id, slug, title, description, role, category, tech_stack, status, featured, demo_url, github_url, cover_url, cover_public_id
    `
    )
    .eq("featured", true)
    .eq("status", "published")
    .order("sort_order")
    .limit(3);

  const projects = (dbProjects && dbProjects.length > 0)
    ? dbProjects
    : FALLBACK_PROJECTS.filter((p) => p.featured).slice(0, 3);

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
              Featured Systems & Case Studies
            </p>
            <h2
              id="featured-projects-heading"
              className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tighter text-foreground"
            >
              Selected Work
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            View all projects (8)
          </Link>
        </ScrollReveal>

        {/* Responsive Grid Layout: Dominant featured project + secondary projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <RevealCard key={project.id} delay={0.05 + i * 0.05} className="h-full">
              <ProjectCard
                project={project as Project}
                className="h-full"
                featured={i === 0}
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
            View all projects (8)
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

