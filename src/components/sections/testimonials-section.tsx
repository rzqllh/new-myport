import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RevealCard } from "@/components/reveal-card";
import { Quotes } from "@phosphor-icons/react/dist/ssr";

export async function TestimonialsSection() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, name, role, company, quote, avatar_url")
    .eq("is_visible", true)
    .order("sort_order")
    .limit(6);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-heading" className="py-24 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-[1400px] px-6">
        <ScrollReveal className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Testimonials</p>
          <h2
            id="testimonials-heading"
            className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-foreground"
          >
            Kind Words
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <RevealCard key={t.id} delay={i * 0.05} className="h-full">
              <figure className="flex flex-col h-full p-6 rounded-2xl border border-border bg-card">
                <Quotes weight="fill" size={24} className="text-primary/40 mb-4 shrink-0" />
                <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
                  {t.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatar_url} alt={t.name} className="size-9 rounded-full object-cover border border-border shrink-0" />
                  ) : (
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">{t.name[0]}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{t.name}</p>
                    {(t.role || t.company) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {[t.role, t.company].filter(Boolean).join(", ")}
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
