import type { Metadata } from "next";
import { Envelope, MapPin } from "@phosphor-icons/react/dist/ssr";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ContactForm } from "@/components/contact-form";
import { CopyEmailButton } from "@/components/copy-email-button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Hafizh Rizqullah Prasetya for IT project management, product design, and web engineering collaborations.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Hafizh Rizqullah Prasetya",
    description: "Get in touch with Hafizh Rizqullah Prasetya for IT project management, product design, and web engineering collaborations.",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Hafizh Rizqullah Prasetya",
    description: "Get in touch with Hafizh Rizqullah Prasetya for IT project management, product design, and web engineering collaborations.",
  },
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "social").single();
  const social = (data?.value as Record<string, string>) || {};
  const emailClean = social.email ? social.email.replace("mailto:", "") : "hrizqullah484@gmail.com";

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
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                I&apos;m open to technical project management, UI/UX design systems, and web engineering collaborations.
                Reach out directly, I respond within 24 hours.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Envelope weight="duotone" className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={social.email || `mailto:${emailClean}`}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm font-mono"
                      >
                        {emailClean}
                      </a>
                      <CopyEmailButton email={emailClean} />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2.5 rounded-xl bg-primary/10 text-primary">
                    <MapPin weight="duotone" className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Location</p>
                    <p className="text-muted-foreground text-sm">Indonesia (Remote / Hybrid)</p>
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
