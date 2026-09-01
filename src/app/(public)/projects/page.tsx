import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ProjectsView } from "@/components/projects-view";
import type { Project } from "@/components/project-card";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Work by Hafizh Rizqullah Prasetya across software engineering, system architecture, tools, and UI/UX research.",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      `
      id, slug, title, description, role, category, tech_stack, status, featured, sort_order, github_url, demo_url, cover_url, cover_public_id
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
      <ScrollReveal className="max-w-3xl mb-12 md:mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          Portfolio & Case Studies
        </p>
        <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-foreground mb-6">
          Projects & Code
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Open-source developer tools, production web applications, and system case studies. Each project includes technical breakdowns and repository sources.
        </p>
      </ScrollReveal>

      {/* Interactive Filter & Grid */}
      {error ? (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">
            Something went wrong loading projects. Try refreshing the page.
          </p>
        </div>
      ) : (
        <ProjectsView initialProjects={(projects || []) as Project[]} />
      )}
    </div>
  );
}
