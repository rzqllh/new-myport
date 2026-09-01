import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RevealCard } from "@/components/reveal-card";
import { Quotes, Buildings, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
}

export async function TestimonialsSection() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, name, role, company, quote, avatar_url")
    .eq("is_visible", true)
    .order("sort_order")
    .limit(4);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-24 md:py-32 bg-muted/30 border-b border-border"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <ScrollReveal className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            Collaboration & Endorsements
          </p>
          <h2
            id="testimonials-heading"
            className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tighter text-foreground"
          >
            Feedback from Teams
          </h2>
        </ScrollReveal>

        {/* Balanced Endorsement Grid */}
        <div
          className={cn(
            "grid gap-8",
            testimonials.length === 2
              ? "grid-cols-1 md:grid-cols-2 max-w-5xl"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {testimonials.map((t: Testimonial, i: number) => (
            <RevealCard key={t.id} delay={i * 0.08} className="h-full">
              <figure className="flex flex-col h-full p-8 md:p-10 rounded-3xl border border-border/80 bg-card shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-300 relative group">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Quotes weight="fill" className="size-5" />
                  </div>
                  {t.company && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-[11px] font-mono text-muted-foreground border border-border/60">
                      <Buildings weight="bold" className="size-3" />
                      <span>{t.company}</span>
                    </span>
                  )}
                </div>

                <blockquote className="flex-1 text-base md:text-lg leading-relaxed text-foreground/90 font-medium mb-8">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="flex items-center gap-3.5 pt-6 border-t border-border/60 mt-auto">
                  <div className="size-11 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-foreground">
                      {t.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {t.name}
                      </p>
                      <CheckCircle weight="fill" className="size-3.5 text-primary shrink-0" />
                    </div>
                    {t.role && (
                      <p className="text-xs text-muted-foreground truncate">
                        {t.role}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}
