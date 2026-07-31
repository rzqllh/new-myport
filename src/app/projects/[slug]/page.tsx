import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select(
      `
      id, title, description, role, category, tech_stack, status, created_at,
      project_images(url, alt_text, sort_order)
    `
    )
    .eq("slug", slug)
    .single();

  if (!project || project.status !== "published") {
    notFound();
  }

  // Sort images by sort_order
  const images =
    project.project_images?.sort(
      (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    ) ?? [];
  const heroImage = images[0];
  const galleryImages = images.slice(1);

  return (
    <article className="pb-24 md:pb-32">
      {/* Header / Hero Section */}
      <header className="mx-auto max-w-[1400px] px-6 pt-12 md:pt-24 pb-12">
        <ScrollReveal>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 md:mb-12"
          >
            <ArrowLeft weight="bold" />
            Back to projects
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Title & Description */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ScrollReveal delay={0.05}>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter text-foreground mb-6 leading-[1.1]">
                {project.title}
              </h1>
            </ScrollReveal>
            
            {project.description && (
              <ScrollReveal delay={0.1}>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </ScrollReveal>
            )}
          </div>

          {/* Meta Information Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 lg:pl-12">
            <ScrollReveal delay={0.15}>
              <div className="space-y-6 p-6 md:p-8 rounded-2xl bg-muted/50 border border-border">
                {project.role && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                      Role
                    </h3>
                    <p className="font-medium">{project.role}</p>
                  </div>
                )}
                
                {project.category && (
                  <>
                    <Separator className="bg-border/60" />
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                        Category
                      </h3>
                      <p className="font-medium">{project.category}</p>
                    </div>
                  </>
                )}
                
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <>
                    <Separator className="bg-border/60" />
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tech: string) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
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

      {/* Main Image */}
      {heroImage && (
        <div className="mx-auto max-w-[1400px] px-6 mb-12 md:mb-24">
          <ScrollReveal delay={0.2} className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage.url}
              alt={heroImage.alt_text ?? project.title}
              className="w-full h-full object-cover"
            />
          </ScrollReveal>
        </div>
      )}

      {/* Additional Images / Gallery */}
      {galleryImages.length > 0 && (
        <div className="mx-auto max-w-[1000px] px-6 space-y-12 md:space-y-24">
          {galleryImages.map((img: any, i: number) => (
            <ScrollReveal key={img.url} delay={0.1}>
              <div className="relative rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt_text ?? `${project.title} screenshot ${i + 2}`}
                  className="w-full h-auto"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </article>
  );
}
