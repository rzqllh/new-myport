import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  tech_stack: string[];
  status: string;
  project_images?: Array<{ url: string; alt_text: string | null }>;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
  featured?: boolean;
}

export function ProjectCard({
  project,
  className,
  featured = false,
}: ProjectCardProps) {
  const image = project.project_images?.[0];
  const hasImage = !!image;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-1",
        "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
        className
      )}
      aria-label={`View project: ${project.title}`}
    >
      {/* Image area */}
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          featured ? "aspect-[16/9]" : "aspect-[4/3]"
        )}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt_text ?? project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Placeholder when no image — text-only card treatment */
          <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
            <p className="text-sm text-muted-foreground font-mono">
              {project.category ?? "Project"}
            </p>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              "font-display font-semibold tracking-tight leading-snug text-foreground",
              "group-hover:text-primary transition-colors",
              featured ? "text-xl" : "text-lg"
            )}
          >
            {project.title}
          </h3>
          <ArrowUpRight
            weight="bold"
            className="size-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
          />
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Tech stack tags */}
        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.tech_stack.length > 4 && (
              <Badge variant="secondary" className="text-xs text-muted-foreground">
                +{project.tech_stack.length - 4}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
