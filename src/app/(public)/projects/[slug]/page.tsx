import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  GithubLogo,
  Globe,
  CheckCircle,
  ShieldCheck,
  Browser,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PROJECT_DETAILS_DATA, FALLBACK_PROJECTS } from "@/lib/project-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .single();

  const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug);

  const title = project?.title || fallback?.title || "Project";
  const description = project?.description || fallback?.description || "";

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: `${title} | Hafizh Rizqullah Prasetya`,
      description,
      url: `/projects/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Hafizh Rizqullah Prasetya`,
      description,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch all published projects to find current and next project
  const { data: allProjects } = await supabase
    .from("projects")
    .select("id, slug, title, category, sort_order")
    .eq("status", "published")
    .order("sort_order");

  const projectList = (allProjects && allProjects.length > 0) ? allProjects : FALLBACK_PROJECTS;

  const { data: dbProject } = await supabase
    .from("projects")
    .select(
      `
      id, slug, title, description, role, category, tech_stack, status, demo_url, github_url, cover_url, created_at,
      project_images(url, alt_text, sort_order)
    `
    )
    .eq("slug", slug)
    .single();

  const project = dbProject || FALLBACK_PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Find next project for bottom navigation
  const currentIndex = projectList?.findIndex((p) => p.slug === slug) ?? -1;
  const nextProject =
    currentIndex >= 0 && projectList && projectList.length > 1
      ? projectList[(currentIndex + 1) % projectList.length]
      : null;


  // Rich content details
  const details = PROJECT_DETAILS_DATA[slug];

  return (
    <article className="pb-24 md:pb-32">
      {/* ── Top Header Section ── */}
      <header className="mx-auto max-w-[1400px] px-6 pt-12 md:pt-24 pb-12">
        <ScrollReveal>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 md:mb-12"
          >
            <ArrowLeft weight="bold" />
            <span>Back to all projects</span>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Main Title & Overview */}
          <div className="lg:col-span-8">
            <ScrollReveal delay={0.05} className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  {project.category?.replace("-", " ") || "Project"}
                </span>
                {project.role && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                    {project.role}
                  </span>
                )}
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tighter text-foreground leading-[1.05]">
                {project.title}
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed pt-2">
                {details?.tagline || project.description}
              </p>
            </ScrollReveal>

            {/* CTAs */}
            {(project.demo_url || project.github_url) && (
              <ScrollReveal delay={0.1} className="flex flex-wrap items-center gap-3 pt-6">
                {project.demo_url && (
                  <Button
                    size="lg"
                    className="h-12 px-7 rounded-xl shadow-lg shadow-primary/15"
                    render={
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    nativeButton={false}
                  >
                    <span>Launch Live Application</span>
                    <ArrowUpRight weight="bold" />
                  </Button>
                )}
                {project.github_url && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 px-7 rounded-xl bg-card border-border hover:bg-muted"
                    render={
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    nativeButton={false}
                  >
                    <GithubLogo weight="fill" className="size-5 mr-2" />
                    <span>View Repository Source</span>
                  </Button>
                )}
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar Quick Specs */}
          <div className="lg:col-span-4">
            <ScrollReveal delay={0.15}>
              <div className="p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  Project Specifications
                </p>

                {project.role && (
                  <div>
                    <span className="text-xs text-muted-foreground">My Role</span>
                    <p className="font-semibold text-foreground text-sm pt-0.5">{project.role}</p>
                  </div>
                )}

                {project.category && (
                  <>
                    <Separator className="bg-border/60" />
                    <div>
                      <span className="text-xs text-muted-foreground">Category</span>
                      <p className="font-semibold text-foreground text-sm capitalize pt-0.5">
                        {project.category.replace("-", " ")}
                      </p>
                    </div>
                  </>
                )}

                {project.tech_stack && project.tech_stack.length > 0 && (
                  <>
                    <Separator className="bg-border/60" />
                    <div>
                      <span className="text-xs text-muted-foreground mb-2 block">Technologies</span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md text-xs font-mono bg-muted text-foreground border border-border/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </header>

      {/* ── Metrics Banner (If Available) ── */}
      {details?.metrics && details.metrics.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-6 mb-16">
          <ScrollReveal delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl bg-muted/30 border border-border/70">
              {details.metrics.map((m) => (
                <div key={m.label} className="p-4 rounded-2xl bg-card border border-border/50">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </p>
                  <p className="font-display font-bold text-2xl md:text-3xl text-foreground mt-1">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── Interactive Preview / Visual Showcase ── */}
      <section className="mx-auto max-w-[1400px] px-6 mb-20">
        <ScrollReveal delay={0.2}>
          {project.demo_url ? (
            /* Browser Mockup Frame */
            <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-muted/60 border-b border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-border" />
                  <span className="size-3 rounded-full bg-border" />
                  <span className="size-3 rounded-full bg-border" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-border text-foreground font-mono text-[11px] max-w-md truncate">
                  <Globe weight="bold" className="size-3 text-primary" />
                  <span>{project.demo_url}</span>
                </div>
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground inline-flex items-center gap-1 font-medium text-xs"
                >
                  <span>Open</span>
                  <ArrowUpRight weight="bold" />
                </a>
              </div>
              <div className="p-12 md:p-20 text-center bg-gradient-to-br from-card via-muted/20 to-muted/50 flex flex-col items-center justify-center">
                <Browser weight="duotone" className="size-16 text-primary mb-4" />
                <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground max-w-md text-sm mb-6">
                  {details?.tagline || project.description}
                </p>
                <Button
                  size="lg"
                  className="rounded-xl px-8"
                  render={
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                >
                  Launch Live Demo
                  <ArrowUpRight weight="bold" />
                </Button>
              </div>
            </div>
          ) : (
            /* Technical Case Study Frame */
            <div className="p-8 md:p-12 rounded-3xl border border-border bg-card shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-medium">
                  <ShieldCheck weight="bold" className="size-4" />
                  <span>Case Study Overview</span>
                </div>
                <h3 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                  System Architecture & Implementation
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {details?.tagline || project.description}
                </p>
              </div>
              {project.github_url && (
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl shrink-0"
                  render={
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                >
                  <GithubLogo weight="bold" className="mr-2 size-5" />
                  View Repository
                </Button>
              )}
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* ── Deep Technical Breakdown ── */}
      <section className="mx-auto max-w-[1400px] px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column: Problem, Solution, Architecture */}
          <div className="lg:col-span-8 space-y-16">
            {/* Problem & Solution */}
            {details && (
              <ScrollReveal className="space-y-8">
                <div className="space-y-4">
                  <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                    01 / The Challenge
                  </p>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                    Problem & Context
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {details.problem}
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                    02 / The Solution
                  </p>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                    Engineering Approach
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {details.solution}
                  </p>
                </div>
              </ScrollReveal>
            )}

            {/* Architecture Cards */}
            {details?.architecture && details.architecture.length > 0 && (
              <ScrollReveal className="space-y-6">
                <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                  03 / Core Subsystems
                </p>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-6">
                  Technical Architecture
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {details.architecture.map((item, idx) => (
                    <div
                      key={item.title}
                      className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2 hover:border-foreground/20 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold mb-1">
                        <span>0{idx + 1}.</span>
                        <span>{item.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* Key Features List */}
            {details?.keyFeatures && details.keyFeatures.length > 0 && (
              <ScrollReveal className="space-y-6">
                <p className="text-xs font-mono uppercase tracking-widest text-primary font-semibold">
                  04 / Capabilities
                </p>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-6">
                  Feature Breakdown
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {details.keyFeatures.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/60"
                    >
                      <CheckCircle
                        weight="fill"
                        className="size-5 text-primary shrink-0 mt-0.5"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Right Column: Tech Decisions & Stack Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {details?.techChoices && details.techChoices.length > 0 && (
              <ScrollReveal delay={0.1}>
                <div className="p-6 md:p-8 rounded-3xl bg-muted/30 border border-border/80 space-y-6">
                  <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                    Technical Stack Rationales
                  </p>

                  <div className="space-y-4">
                    {details.techChoices.map((choice) => (
                      <div key={choice.tech} className="space-y-1">
                        <p className="font-mono text-sm font-bold text-foreground">
                          {choice.tech}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {choice.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Bottom Next Project Navigator ── */}
      {nextProject && (
        <section className="mx-auto max-w-[1400px] px-6 pt-12 border-t border-border">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 md:p-10 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md hover:border-foreground/20 transition-all group">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Next Project
                </p>
                <h4 className="font-display font-bold text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors">
                  {nextProject.title}
                </h4>
                <p className="text-sm text-muted-foreground capitalize mt-1">
                  {nextProject.category?.replace("-", " ")}
                </p>
              </div>

              <Link
                href={`/projects/${nextProject.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium shadow hover:opacity-90 transition-opacity shrink-0"
              >
                <span>View Next Project</span>
                <ArrowRight weight="bold" />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      )}
    </article>
  );
}
