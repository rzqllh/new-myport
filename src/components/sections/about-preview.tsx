import Link from "next/link";
import { ArrowRight, GraduationCap, Briefcase } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    company: "Telkom Indonesia",
    role: "Project Management Officer (IT & Strategy)",
    start_date: "2024-03-01",
    end_date: null,
    is_current: true,
  },
  {
    id: "exp-2",
    company: "Ministry of Education, Culture, Research and Technology",
    role: "Computer Operator",
    start_date: "2023-03-01",
    end_date: "2023-04-30",
    is_current: false,
  },
];

export async function AboutPreview() {
  const supabase = await createClient();

  const { data: dbExperiences } = await supabase
    .from("experiences")
    .select("id, company, role, start_date, end_date, is_current")
    .order("start_date", { ascending: false })
    .limit(2);

  const experiences = (dbExperiences && dbExperiences.length > 0) ? dbExperiences : DEFAULT_EXPERIENCES;

  return (
    <section
      id="about"
      aria-labelledby="about-preview-heading"
      className="py-24 md:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                Background & Approach
              </p>
              <h2
                id="about-preview-heading"
                className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tighter text-foreground"
              >
                Building products from the ground up: strategy, design, and code.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <p className="text-muted-foreground leading-relaxed max-w-[65ch] text-lg">
                Project Management Officer, UI/UX Designer, and Web Engineer based in Indonesia. I connect project management and hands-on technical execution, enterprise dashboards, and developer tooling across the full product lifecycle.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline underline-offset-4 text-sm pt-2"
              >
                <span>More about me</span>
                <ArrowRight weight="bold" className="size-4" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Right Card Column: Experience & Education snapshot */}
          <div className="lg:col-span-5 space-y-4">
            <ScrollReveal delay={0.15}>
              <div className="p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-xs space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  <Briefcase weight="duotone" className="size-4 text-primary" />
                  <span>Recent Experience</span>
                </div>

                <div className="space-y-4">
                  {experiences.map((exp) => {
                    const startYear = new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
                    const endYear = exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";

                    return (
                      <div key={exp.id} className="space-y-1 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-foreground text-sm leading-snug">
                            {exp.role}
                          </h4>
                          <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                            {startYear} — {endYear}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{exp.company}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Education snapshot */}
                <div className="pt-4 border-t border-border/60">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                    <GraduationCap weight="duotone" className="size-4 text-primary" />
                    <span>Education</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Gunadarma University</p>
                      <p className="text-xs text-muted-foreground">Bachelor of Informatics · GPA 3.54 / 4.00</p>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                      2020 — 2024
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

