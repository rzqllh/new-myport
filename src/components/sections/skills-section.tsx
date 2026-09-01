import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Code, Compass, ChartLineUp, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
}

export async function SkillsSection() {
  const supabase = await createClient();
  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, category, proficiency")
    .order("sort_order");

  if (!skills || skills.length === 0) return null;

  const frontendAndBackend = skills.filter(
    (s: Skill) => s.category === "frontend" || s.category === "backend"
  );
  const design = skills.filter((s: Skill) => s.category === "design");
  const tools = skills.filter((s: Skill) => s.category === "tools");

  const PILLARS = [
    {
      id: "engineering",
      icon: Code,
      title: "Web Engineering & Systems",
      summary:
        "Full-stack web architecture, type-safe frontend systems, and relational database modeling.",
      skills: frontendAndBackend,
      highlights: ["TypeScript / React Ecosystem", "SQL & Database Schema Design", "Python & Windows Tooling"],
    },
    {
      id: "design",
      icon: Compass,
      title: "UI/UX & Product Research",
      summary:
        "User-centered design methodologies, quantitative usability testing, and high-fidelity prototyping.",
      skills: design,
      highlights: ["UCD & A/B Usability Testing", "Design Systems & Tokenization", "Figma Interactive Prototypes"],
    },
    {
      id: "pmo",
      icon: ChartLineUp,
      title: "Project Management & Delivery",
      summary:
        "Cross-functional alignment between engineering and business stakeholders, progress tracking, and system health.",
      skills: tools,
      highlights: ["IT Project Coordination", "Grafana Reliability Monitoring", "Version Control & Release Workflows"],
    },
  ];

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-24 md:py-32 bg-muted/20 border-y border-border"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <ScrollReveal className="max-w-3xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Capabilities & Stack
          </p>
          <h2
            id="skills-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tighter text-foreground mb-4"
          >
            Technical Disciplines
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            The hybrid capability matrix: managing software lifecycles, designing clear interfaces, and engineering maintainable code.
          </p>
        </ScrollReveal>

        {/* 3 Pillars Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;

            return (
              <ScrollReveal
                key={pillar.id}
                delay={idx * 0.08}
                className="h-full"
              >
                <div className="h-full flex flex-col p-8 rounded-3xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-300 relative overflow-hidden group">
                  {/* Icon & Category Header */}
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                      <Icon weight="duotone" className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-foreground tracking-tight">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {pillar.summary}
                  </p>

                  {/* Core Highlights */}
                  <div className="space-y-2 mb-8 pt-4 border-t border-border/50">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/90 font-semibold mb-2">
                      Key Competencies
                    </p>
                    {pillar.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-foreground/90 font-medium">
                        <span className="size-1.5 rounded-full bg-primary/60" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Skill Badges */}
                  <div className="mt-auto pt-6 border-t border-border/50">
                    <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/80 mb-3">
                      Technologies & Tools
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {pillar.skills.map((skill: Skill) => (
                        <span
                          key={skill.id}
                          className={cn(
                            "px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors border",
                            skill.proficiency >= 85
                              ? "bg-foreground/5 text-foreground border-foreground/15 font-semibold"
                              : "bg-muted/50 text-muted-foreground border-border/60"
                          )}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
