import type { Metadata } from "next";
import { ArrowUpRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Hafizh Rizqullah Prasetya's background and professional experience.",
};

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ data: about }, { data: experiences }, { data: settings }] = await Promise.all([
    supabase.from("about").select("*").single(),
    supabase
      .from("experiences")
      .select("*")
      .order("start_date", { ascending: false }),
    supabase.from("site_settings").select("key, value").eq("key", "social").single(),
  ]);

  const social = settings?.value || {};

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Left Column: Bio & Photo */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-32 space-y-8">
            <ScrollReveal>
              <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tighter text-foreground mb-6">
                About me
              </h1>
            </ScrollReveal>

            {about?.photo_url && (
              <ScrollReveal delay={0.05}>
                <div className="relative aspect-[4/5] w-full max-w-sm rounded-3xl overflow-hidden bg-muted border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={about.photo_url}
                    alt="Hafizh Rizqullah Prasetya"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.1}>
              <div className="flex gap-4">
                {about?.resume_url && (
                  <Button render={<a href={about.resume_url} target="_blank" rel="noopener noreferrer" download />} nativeButton={false}>
                    <DownloadSimple weight="bold" data-icon="inline-start" />
                    Resume
                  </Button>
                )}
                {social?.linkedin && (
                  <Button variant="outline" render={<a href={social.linkedin} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
                    LinkedIn
                    <ArrowUpRight weight="bold" data-icon="inline-end" />
                  </Button>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Right Column: Bio Content & Experience */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-24">
          {/* Bio Text */}
          {about?.bio && (
            <ScrollReveal delay={0.15}>
              <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline max-w-[65ch]">
                {about.bio.split("\n\n").map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </ScrollReveal>
          )}

          <Separator />

          {/* Experience Timeline */}
          <section aria-labelledby="experience-heading">
            <ScrollReveal delay={0.2}>
              <h2
                id="experience-heading"
                className="font-display font-bold text-3xl tracking-tight text-foreground mb-12"
              >
                Experience
              </h2>
            </ScrollReveal>

            <div className="space-y-12">
              {experiences?.map((exp, i) => {
                const startDate = new Date(exp.start_date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                });
                const endDate = exp.end_date
                  ? new Date(exp.end_date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "Present";

                return (
                  <ScrollReveal key={exp.id} delay={0.1 + i * 0.05}>
                    <div className="relative group">
                      {/* Desktop Timeline indicator */}
                      <div className="absolute left-[-2rem] top-1.5 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {exp.role}
                        </h3>
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          {startDate} — {endDate}
                        </span>
                      </div>
                      
                      <div className="text-primary font-medium mb-4">
                        {exp.company}
                      </div>

                      {exp.description && (
                        <div className="prose prose-sm dark:prose-invert text-muted-foreground mb-4">
                          {exp.description.split("\n").map((line: string, idx: number) => (
                            <p key={idx} className="mb-2 last:mb-0">
                              {line}
                            </p>
                          ))}
                        </div>
                      )}

                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {exp.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
