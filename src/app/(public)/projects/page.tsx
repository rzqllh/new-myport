import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ProjectsView } from "@/components/projects-view";
import type { Project } from "@/components/project-card";
import { FALLBACK_PROJECTS } from "@/lib/project-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects & Case Studies",
  description:
    "Engineering projects, open-source developer tooling, and quantitative UI/UX research by Hafizh Rizqullah Prasetya.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects & Case Studies | Hafizh Rizqullah Prasetya",
    description:
      "Engineering projects, open-source developer tooling, and quantitative UI/UX research by Hafizh Rizqullah Prasetya.",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects & Case Studies | Hafizh Rizqullah Prasetya",
    description:
      "Engineering projects, open-source developer tooling, and quantitative UI/UX research by Hafizh Rizqullah Prasetya.",
  },
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: dbProjects } = await supabase
    .from("projects")
    .select(
      `
      id, slug, title, description, role, category, tech_stack, status, featured, sort_order, github_url, demo_url, cover_url, cover_public_id
    `
    )
    .eq("status", "published")
    .order("sort_order")
    .order("created_at", { ascending: false });

  const projects = (dbProjects && dbProjects.length > 0)
    ? dbProjects
    : (FALLBACK_PROJECTS as Project[]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-24 md:py-32">
      {/* Header */}
      <ScrollReveal className="max-w-3xl mb-12 md:mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          Portfolio & Systems
        </p>
        <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-foreground mb-6">
          Projects & Case Studies
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Open-source developer tools, production web applications, and system case studies. Each project documents architecture choices, live demos, and source code.
        </p>
      </ScrollReveal>

      {/* Interactive Filter & Grid */}
      <ProjectsView initialProjects={projects as Project[]} />
    </div>
  );
}

