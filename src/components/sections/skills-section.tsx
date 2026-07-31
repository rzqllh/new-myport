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
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            Skills
          </p>
          <h2
            id="skills-heading"
            className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-foreground"
          >
            What I work with
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(grouped).map(([category, catSkills], groupIdx) => (
            <ScrollReveal key={category} delay={groupIdx * 0.05}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  {CATEGORY_LABELS[category] ?? category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill: Skill) => (
                    <span
                      key={skill.id}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                        skill.proficiency >= 80
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border hover:text-foreground"
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
