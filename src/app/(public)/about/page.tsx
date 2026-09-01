import type { Metadata } from "next";
import { ArrowUpRight, DownloadSimple, GraduationCap, MapPin, EnvelopeSimple, Briefcase } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, technical experience, and product delivery philosophy of Hafizh Rizqullah Prasetya — PMO, UI/UX Designer, and Web Engineer.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | Hafizh Rizqullah Prasetya",
    description:
      "Background, technical experience, and product delivery philosophy of Hafizh Rizqullah Prasetya — PMO, UI/UX Designer, and Web Engineer.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Hafizh Rizqullah Prasetya",
    description:
      "Background, technical experience, and product delivery philosophy of Hafizh Rizqullah Prasetya — PMO, UI/UX Designer, and Web Engineer.",
  },
};

const DEFAULT_EXPERIENCES = [
  {
    id: "exp-1",
    role: "Project Management Officer (IT & Strategy)",
    company: "Telkom Indonesia",
    start_date: "2024-03-01",
    end_date: null,
    is_current: true,
    description: "• Supported IT project coordination and tracking across multiple teams, ensuring alignment with project timelines and deliverables.\n• Monitored project progress, identified bottlenecks, and assisted in resolving workflow issues.\n• Monitored daily device health and system performance utilizing Grafana, ensuring optimal infrastructure reliability.",
    skills: ["Project Management", "IT Strategy", "Grafana", "Workflow Coordination", "Stakeholder Alignment"],
  },
  {
    id: "exp-2",
    role: "Computer Operator",
    company: "Ministry of Education, Culture, Research and Technology",
    start_date: "2023-03-01",
    end_date: "2023-04-30",
    is_current: false,
    description: "• Documented and inventoried Indonesian cultural treasures across 451 museums nationwide.\n• Managed a digital asset repository containing over 100,395 multimedia items, optimizing data retrieval for cultural heritage websites.\n• Cataloged 30,930 registered objects, buildings, sites, structures, and areas.",
    skills: ["Digital Asset Management", "Data Cataloging", "SQL Systems", "Cultural Heritage"],
  },
];

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ data: about }, { data: dbExperiences }, { data: settings }, { data: cvSetting }] = await Promise.all([
    supabase.from("about").select("*").single(),
    supabase
      .from("experiences")
      .select("*")
      .order("start_date", { ascending: false }),
    supabase.from("site_settings").select("key, value").eq("key", "social").single(),
    supabase.from("site_settings").select("key, value").eq("key", "cv").single(),
  ]);

  const experiences = (dbExperiences && dbExperiences.length > 0) ? dbExperiences : DEFAULT_EXPERIENCES;
  const social = settings?.value || {};
  const cvUrl = (cvSetting?.value as { url?: string })?.url || about?.resume_url || "";

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        {/* Left Column: Sticky Profile / Summary Card */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-28 space-y-6">
            <ScrollReveal>
              <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tighter text-foreground">
                About me
              </h1>
            </ScrollReveal>

            {about?.photo_url ? (
              <ScrollReveal delay={0.05}>
                <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-card border border-border/80 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={about.photo_url}
                    alt="Hafizh Rizqullah Prasetya"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ScrollReveal>
            ) : (
              /* Information Card Fallback */
              <ScrollReveal delay={0.05}>
                <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4 font-mono text-xs">
                  <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="font-semibold text-foreground tracking-wider uppercase">
                      Profile Overview
                    </span>
                  </div>

                  <div className="space-y-2 text-muted-foreground font-sans">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <MapPin weight="duotone" className="size-4 text-primary shrink-0" />
                      <span>Indonesia · UTC+7</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Briefcase weight="duotone" className="size-4 text-primary shrink-0" />
                      <span>PMO · Product Design · Engineering</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <GraduationCap weight="duotone" className="size-4 text-primary shrink-0" />
                      <span>Gunadarma University (GPA 3.54)</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap gap-3">
                {cvUrl ? (
                  <Button className="rounded-xl shadow-xs" render={<a href={cvUrl} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
                    <DownloadSimple weight="bold" className="mr-1.5 size-4" />
                    <span>Resume</span>
                  </Button>
                ) : (
                  <Button className="rounded-xl shadow-xs" render={<a href="/contact" />} nativeButton={false}>
                    <EnvelopeSimple weight="bold" className="mr-1.5 size-4" />
                    <span>Contact</span>
                  </Button>
                )}
                {social?.linkedin && (
                  <Button variant="outline" className="rounded-xl bg-card border-border/80" render={<a href={social.linkedin} target="_blank" rel="noopener noreferrer" />} nativeButton={false}>
                    <span>LinkedIn</span>
                    <ArrowUpRight weight="bold" className="ml-1.5 size-3.5" />
                  </Button>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Right Column: Narrative, Experience Timeline & Education */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-16">
          {/* Bio Text */}
          <ScrollReveal delay={0.15}>
            <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary max-w-[68ch] space-y-5 text-base md:text-lg">
              <p>
                I operate at the intersection of technical project management, product design, and web engineering. My core focus is translating organizational requirements and complex ideas into structured, accessible, and high-performance digital products.
              </p>
              <p>
                Currently serving as a <strong>Project Management Officer (IT & Strategy)</strong> at Telkom Indonesia, I support cross-team IT coordination, track project milestones, and monitor system performance and reliability.
              </p>
              <p>
                On the design and engineering side, I build responsive Next.js and React web applications, design systems with semantic color tokens, and craft open-source diagnostic utilities like Voltune.
              </p>
            </div>
          </ScrollReveal>

          <Separator />

          {/* Experience Timeline */}
          <section aria-labelledby="experience-heading">
            <ScrollReveal delay={0.2}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                Career History
              </p>
              <h2
                id="experience-heading"
                className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground mb-10"
              >
                Experience
              </h2>
            </ScrollReveal>

            <div className="space-y-10">
              {experiences.map((exp, i) => {
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
                    <div className="p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-lg md:text-xl font-semibold text-foreground">
                          {exp.role}
                        </h3>
                        <span className="text-xs font-mono text-muted-foreground shrink-0">
                          {startDate} — {endDate}
                        </span>
                      </div>
                      
                      <div className="text-primary font-medium text-sm">
                        {exp.company}
                      </div>

                      {exp.description && (
                        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </div>
                      )}

                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {exp.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-[11px] font-mono">
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

          <Separator />

          {/* Dedicated Education Section */}
          <section aria-labelledby="education-heading">
            <ScrollReveal delay={0.25}>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                Academic Background
              </p>
              <h2
                id="education-heading"
                className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground mb-8"
              >
                Education
              </h2>

              <div className="p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground">
                    Gunadarma University
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground shrink-0">
                    2018 — 2022
                  </span>
                </div>
                <p className="text-sm font-medium text-primary">
                  Bachelor of Informatics · GPA 3.54 / 4.00
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                  Undergraduate Thesis Research: Focused on user interface analysis and design for mobile banking using User-Centered Design (UCD) and A/B Testing methodology.
                </p>
              </div>
            </ScrollReveal>
          </section>
        </div>
      </div>
    </div>
  );
}

