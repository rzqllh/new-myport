import Link from "next/link";
import { ArrowRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";

export function FooterCTA({ cvUrl }: { cvUrl?: string }) {
  return (
    <section id="contact" aria-labelledby="cta-heading" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 md:py-20 text-center shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <p className="text-xs font-mono uppercase tracking-widest text-primary-foreground/70 mb-3 font-semibold">
                Work Together
              </p>
              <h2
                id="cta-heading"
                className="font-display font-bold text-3xl md:text-5xl tracking-tighter text-primary-foreground mb-5 leading-tight"
              >
                Looking for technical leadership or hands-on delivery?
              </h2>
              <p className="text-primary-foreground/85 text-base md:text-lg mb-10 max-w-[540px] leading-relaxed">
                Available for project management, UI/UX design systems, and web engineering. Based in Indonesia (UTC+7), collaborating worldwide.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <Button size="lg" className="h-11 px-7 rounded-xl bg-background text-foreground hover:bg-background/90 shadow-md font-semibold" render={<Link href="/contact" />} nativeButton={false}>
                  <span>Get in touch</span>
                  <ArrowRight weight="bold" />
                </Button>
                {cvUrl && (
                  <Button size="lg" variant="outline" className="h-11 px-6 rounded-xl bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground" render={<a href={cvUrl} target="_blank" rel="noopener noreferrer" title="Download Resume / CV" />} nativeButton={false}>
                    <DownloadSimple weight="bold" className="mr-1.5 size-4" />
                    <span>Download Resume</span>
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

