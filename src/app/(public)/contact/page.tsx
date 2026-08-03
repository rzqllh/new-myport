import type { Metadata } from "next";
import { Envelope, MapPin } from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactForm } from "@/components/contact-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for freelance projects, startup roles, and collaborations.",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "social").single();
  const social = (data?.value as Record<string, string>) || {};

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
                      href={social.email || "#"}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {social.email ? social.email.replace("mailto:", "") : "hello@example.com"}
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
