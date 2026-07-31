import type { Metadata } from "next";
import { Envelope, MapPin, GithubLogo, LinkedinLogo, TwitterLogo } from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactForm } from "@/components/contact-form";
import { SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for freelance projects, startup roles, and collaborations.",
};

const SOCIAL_ICONS = [
  { href: SOCIAL_LINKS.github, label: "GitHub", Icon: GithubLogo },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: LinkedinLogo },
  { href: SOCIAL_LINKS.twitter, label: "Twitter", Icon: TwitterLogo },
].filter((s) => s.href);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Left Column: Contact Info */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-32">
            <ScrollReveal>
              <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tighter text-foreground mb-6">
                Let&apos;s talk
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                Whether you have a project in mind, need a hybrid PMO/Designer/Dev,
                or just want to say hi — I&apos;m always open to discussing new
                opportunities.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-xl bg-primary/10 text-primary">
                    <Envelope weight="duotone" className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Email</p>
                    <a
                      href={SOCIAL_LINKS.email}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {SOCIAL_LINKS.email.replace("mailto:", "")}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-xl bg-primary/10 text-primary">
                    <MapPin weight="duotone" className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Location</p>
                    <p className="text-muted-foreground">Indonesia (Remote / Hybrid)</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="mt-12 pt-12 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-4">Connect</p>
                <div className="flex items-center gap-3">
                  {SOCIAL_ICONS.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors shadow-sm"
                    >
                      <Icon weight="duotone" className="size-5" />
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ScrollReveal delay={0.2} className="h-full">
            <div className="p-6 md:p-10 rounded-3xl border border-border bg-card shadow-sm h-full">
              <h2 className="text-2xl font-display font-semibold tracking-tight text-foreground mb-8">
                Send a message
              </h2>
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
