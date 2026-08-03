import Link from "next/link";
import { ArrowRight, FileText } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";

export function FooterCTA({ cvUrl }: { cvUrl?: string }) {
  return (
    <section id="contact" aria-labelledby="cta-heading" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:py-24 text-center">

            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <h2
                id="cta-heading"
                className="font-display font-bold text-3xl md:text-5xl tracking-tighter text-primary-foreground mb-6"
              >
                Have a project in mind?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-10 max-w-[480px]">
                Available for full-time roles and freelance projects. Let&apos;s build something good.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" render={<Link href="/contact" />} nativeButton={false}>
                    Get in touch
                    <ArrowRight weight="bold" data-icon="inline-end" />
                </Button>
                {cvUrl && (
                  <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-primary-foreground" render={<a href={cvUrl} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
                      <FileText weight="duotone" data-icon="inline-start" />
                      Download CV
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
