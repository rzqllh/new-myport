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

  const bio = about?.bio?.trim();

  return (
    <section
      aria-labelledby="about-preview-heading"
      className="py-24 md:py-32 border-t border-border"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Text side */}
          <div>
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
                About
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <h2
                id="about-preview-heading"
                className="font-display font-bold text-3xl md:text-4xl tracking-tighter text-foreground mb-6"
              >
                The hybrid who bridges{" "}
                <span className="text-gradient">strategy and execution</span>
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
