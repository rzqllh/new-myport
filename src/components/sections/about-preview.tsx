import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";

export async function AboutPreview() {
  const supabase = await createClient();
  const { data: about } = await supabase
    .from("about")
    .select("bio, photo_url")
    .single();

  const { data: experiences } = await supabase
    .from("experiences")
    .select("id, company, position, start_date, end_date, current")
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
                The hybrid who bridges strategy and execution
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              {bio ? (
                <p className="text-muted-foreground leading-relaxed max-w-[65ch] mb-8">
                  {bio.length > 280 ? bio.slice(0, 280) + "..." : bio}
                </p>
              ) : (
                <p className="text-muted-foreground leading-relaxed max-w-[65ch] mb-8">
                  PMO · UI/UX Designer · Web Developer — I operate at the
                  intersection of product thinking, design craft, and
                  engineering. Based in Indonesia, I&apos;ve worked across
                  government digitization, interior design platforms, and
                  e-commerce products.
                </p>
              )}
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline underline-offset-4"
              >
                Read more about me
                <ArrowRight weight="bold" className="size-4" />
              </Link>
            </ScrollReveal>

            {experiences && experiences.length > 0 && (
              <ScrollReveal delay={0.2} className="mt-12 pt-8 border-t border-border">
                <h3 className="text-sm font-semibold mb-6 uppercase tracking-wider text-muted-foreground">
                  Experience & Education
                </h3>
                <div className="relative before:absolute before:inset-y-2 before:left-[5px] before:w-px before:bg-border space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative flex gap-6">
                      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-background bg-primary z-10" />
                      <div>
                        <h4 className="font-medium text-foreground tracking-tight">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-mono uppercase">
                          {new Date(exp.start_date).getFullYear()} — {exp.current ? "Present" : exp.end_date ? new Date(exp.end_date).getFullYear() : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Photo / decorative side */}
          <ScrollReveal delay={0.1} className="hidden lg:block">
            {about?.photo_url ? (
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={about.photo_url}
                  alt="Hafizh Rizqullah Prasetya"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              /* Decorative placeholder when no photo */
              <div className="relative aspect-[4/5] rounded-3xl bg-muted border border-border flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="text-center text-muted-foreground">
                  <div className="w-24 h-24 rounded-full bg-muted-foreground/10 mx-auto mb-4" />
                  <p className="text-sm">Photo coming soon</p>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
