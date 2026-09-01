import Link from "next/link";
import { ArrowUpRight, ArrowRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { PROJECT_DETAILS_DATA } from "@/lib/project-content";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  role?: string | null;
  category: string | null;
  tech_stack: string[];
  status: string;
  featured?: boolean;
  demo_url?: string | null;
  github_url?: string | null;
  cover_url?: string | null;
  cover_public_id?: string | null;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
  featured?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  "web-dev": "Web Application",
  tools: "Tools & Systems",
  "ui-ux": "UI/UX & Research",
  "project-management": "Project Management",
};

export function ProjectCard({
  project,
  className,
  featured = false,
}: ProjectCardProps) {
  const hasImage = !!project.cover_url;
  const categoryLabel =
    (project.category && CATEGORY_LABELS[project.category]) ||
    project.category ||
    "Project";

  const details = PROJECT_DETAILS_DATA[project.slug];

  return (
    <div
      className={cn(
        "group relative flex flex-col h-full rounded-2xl overflow-hidden border border-border/80 bg-card",
        "transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/5 hover:border-foreground/20 hover:-translate-y-1",
        className
      )}
    >
      {/* Visual Header / Cover or Architectural Fallback */}
      <div
        className={cn(
          "relative overflow-hidden bg-muted/40 border-b border-border/60",
          featured ? "aspect-[16/9]" : "aspect-[16/10]"
        )}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_url!}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* High-craft typography & system fallback */
          <div className="absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-br from-card via-muted/30 to-muted/60 font-mono">
            <div className="flex items-center justify-between w-full text-[11px]">
              <span className="uppercase tracking-widest text-primary font-semibold">
                {categoryLabel}
              </span>
              {project.role && (
                <span className="text-muted-foreground/80 font-sans text-xs">
                  {project.role}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-sans leading-snug line-clamp-2">
                {details?.tagline || project.description}
              </p>
              {details?.metrics && details.metrics[0] && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-background/80 border border-border/60 text-[10px] text-foreground">
                  <span className="text-muted-foreground">{details.metrics[0].label}:</span>
                  <span className="font-semibold text-primary">{details.metrics[0].value}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-6 gap-3.5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
          >
            <h3
              className={cn(
                "font-display font-semibold tracking-tight leading-snug text-foreground",
                "group-hover:text-primary transition-colors",
                featured ? "text-xl" : "text-lg"
              )}
            >
              {project.title}
            </h3>
          </Link>

          {/* Quick External Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                title="View GitHub Repository"
                aria-label={`View ${project.title} on GitHub`}
                className="p-1.5 rounded-lg border border-border/80 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <GithubLogo weight="fill" className="size-4" />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Live Application"
                aria-label={`Open live demo of ${project.title}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-medium transition-colors"
              >
                <span>Live</span>
                <ArrowUpRight weight="bold" className="size-3" />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Action Link to Case Study */}
        <div className="pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
          >
            <span>Case study</span>
            <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Tech stack tags */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-border/40">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-muted/60 text-muted-foreground border border-border/50"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="px-2 py-1 rounded-md text-[11px] font-mono text-muted-foreground">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

