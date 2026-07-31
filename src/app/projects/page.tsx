import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of my recent work, side projects, and experiments.",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      id, slug, title, description, category, tech_stack, status, featured, sort_order,
      project_images(url, alt_text, sort_order)
    `
    )
    .eq("status", "published")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-24 md:py-32">
      {/* Header */}
      <ScrollReveal className="max-w-2xl mb-16 md:mb-24">
        <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-foreground mb-6">
          Projects & Work
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          A selection of my recent work across product management, UI/UX design,
          and web development.
        </p>
      </ScrollReveal>

      {/* Grid */}
      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.05}>
              <ProjectCard
                project={project as Parameters<typeof ProjectCard>[0]["project"]}
                className="h-full"
              />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="py-24 text-center border-2 border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">
              No projects published yet. Check back soon!
            </p>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
