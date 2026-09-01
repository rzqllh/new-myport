import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { cn } from "@/lib/utils";
export async function AboutPreview() {
  const supabase = await createClient();
  const { data: about } = await supabase
    .from("about")
    .select("bio, photo_url")
    .single();

  const { data: experiences } = await supabase
    .from("experiences")
    .select("id, company, role, start_date, end_date, is_current")
    .order("start_date", { ascending: false })
    .limit(3);

  const bio = about?.bio?.trim();

  return (
    <section
      id="about"
      aria-labelledby="about-preview-heading"
      className="py-24 md:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Text side */}
          <div>


            <ScrollReveal delay={0.05}>
              <h2
                id="about-preview-heading"
                className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-foreground mb-6"
              >
                Building products from the ground up: strategy, design, and code.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-muted-foreground leading-relaxed max-w-[65ch] mb-8 text-lg">
                  {bio && bio.includes("Results-driven IT graduate") 
                    ? "PMO, UI/UX Designer, and Web Developer based in Indonesia. I've shipped government-adjacent systems, fintech interfaces, and startup products across the full project lifecycle." 
                    : bio || "PMO, UI/UX Designer, and Web Developer based in Indonesia. I've shipped government-adjacent systems, fintech interfaces, and startup products across the full project lifecycle."}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline underline-offset-4"
              >
                Read more about me
              </Link>
            </ScrollReveal>
          </div>

          {/* Photo / decorative side */}
          <ScrollReveal delay={0.1} className="hidden lg:block">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-border">
              {about?.photo_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={about.photo_url}
                  alt="Hafizh Rizqullah Prasetya"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full relative flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-200/50 via-transparent to-zinc-300/50 dark:from-zinc-800/50 dark:to-zinc-950/50" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-tr from-transparent via-zinc-400/20 to-transparent dark:via-zinc-600/10 blur-3xl opacity-60" />
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* ─── Experience Stack ─── */}
        {experiences && experiences.length > 0 && (
          <ScrollReveal delay={0.2} className="mt-20 pt-16 border-t border-border">
            <h3 className="text-xs font-semibold mb-8 uppercase tracking-widest text-muted-foreground">
              Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="group p-6 rounded-2xl bg-card/50 border border-border/50 hover:bg-card hover:border-border transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-semibold text-foreground tracking-tight text-lg group-hover:text-primary transition-colors">{exp.role}</h4>
                    <span className="text-xs font-mono uppercase px-2 py-1 rounded-md bg-muted/50 text-muted-foreground">
                      {new Date(exp.start_date).getFullYear()} — {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : ""}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
