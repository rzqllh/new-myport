import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RevealCard } from "@/components/reveal-card";
import { ProjectCard } from "@/components/project-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of my recent work, side projects, and experiments.",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      id, slug, title, description, category, tech_stack, status, featured, sort_order, cover_url, cover_public_id
    `
    )
    .eq("status", "published")
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching public projects:", error);
  }

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
      {error ? (
        <div className="py-24 text-center border-2 border-red-500 rounded-2xl bg-red-50">
          <p className="text-red-500 font-bold mb-4">Error fetching projects (Supabase):</p>
          <pre className="text-xs text-left inline-block max-w-[800px] whitespace-pre-wrap p-4 bg-red-100 rounded-md text-red-900">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <RevealCard key={project.id} delay={i * 0.05} className="h-full">
              <ProjectCard
                project={project as Parameters<typeof ProjectCard>[0]["project"]}
                className="h-full"
              />
            </RevealCard>
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
