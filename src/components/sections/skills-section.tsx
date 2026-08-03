import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  design: "Design",
  tools: "Tools & Methods",
};

const CATEGORY_ORDER = ["frontend", "design", "backend", "tools"];

const SPAN_MAP: Record<string, string> = {
  frontend: "lg:col-span-2",
  backend: "lg:col-span-2",
  design: "lg:col-span-1",
  tools: "lg:col-span-1",
};

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

  // Group by category
  const grouped = CATEGORY_ORDER.reduce(
    (acc, cat) => {
      const catSkills = skills.filter((s: Skill) => s.category === cat);
      if (catSkills.length > 0) acc[cat] = catSkills;
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <section
      aria-labelledby="skills-heading"
      className="py-24 md:py-32 bg-muted/30 border-y border-border"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <ScrollReveal className="mb-12">
          <h2
            id="skills-heading"
            className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-foreground"
          >
            What I work with
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([category, catSkills], groupIdx) => (
            <ScrollReveal 
              key={category} 
              delay={groupIdx * 0.05} 
              className={cn("h-full", SPAN_MAP[category] || "")}
            >
              <div className="h-full flex flex-col p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                {/* Subtle top glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
                  {CATEGORY_LABELS[category] ?? category}
                </h3>
                <div className="flex flex-wrap gap-2.5 relative z-10">
                  {catSkills.map((skill: Skill) => (
                    <span
                      key={skill.id}
                      className={cn(
                        "px-3.5 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-colors border",
                        skill.proficiency >= 80
                          ? "bg-foreground/5 text-foreground border-foreground/10"
                          : "bg-transparent text-muted-foreground border-border hover:bg-muted"
                      )}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
