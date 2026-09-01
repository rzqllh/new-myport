"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { CaseArtifact } from "@/components/case-file/case-artifact";
import type { CaseExperience, CaseProject } from "@/lib/case-files";

function Field({ label, children, evidence = false }: { label: string; children: React.ReactNode; evidence?: boolean }) {
  return (
    <div className={evidence ? "border-l-2 border-primary pl-4" : "border-l border-border pl-4"}>
      <dt className={evidence ? "text-xs font-semibold text-primary" : "text-xs font-semibold text-muted-foreground"}>{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-foreground/80">{children}</dd>
    </div>
  );
}

export function CaseIndex({ projects, experiences }: { projects: CaseProject[]; experiences: CaseExperience[] }) {
  const t = useTranslations("Home");

  return (
    <div>
      <section id="home" className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 pb-20 pt-20 md:pb-28 md:pt-28 lg:grid-cols-12 lg:gap-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="lg:col-span-8">
          <p className="mb-8 max-w-max border-b-2 border-primary pb-2 text-sm font-semibold text-primary">{t("descriptor")}</p>
          <h1 className="max-w-[980px] text-5xl font-medium leading-[1.02] tracking-[-0.055em] md:text-7xl lg:text-[88px]">{t("heading")}</h1>
        </motion.div>
        <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col justify-end border-t border-border pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="max-w-[42ch] text-base leading-7 text-muted-foreground">{t("intro")}</p>
          <p className="mt-8 text-sm font-medium text-foreground">{t("location")}</p>
        </motion.aside>

        <div className="grid border-y border-border lg:col-span-12 lg:grid-cols-3">
          {[t("proofOne"), t("proofTwo"), t("proofThree")].map((proof, index) => (
            <p key={proof} className="border-b border-border px-0 py-5 text-sm font-medium leading-6 last:border-b-0 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">{String(index + 1).padStart(2, "0")} <span className="ml-4 text-muted-foreground">{proof}</span></p>
          ))}
        </div>
      </section>

      <section id="case-register" className="border-t border-border bg-background/95 py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="mb-16 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7"><p className="text-sm font-semibold text-primary">{t("projectCases")}</p><h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] md:text-6xl">{t("register")}</h2></div>
            <p className="max-w-[52ch] text-base leading-7 text-muted-foreground lg:col-span-5 lg:pt-8">{t("registerIntro")}</p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {projects.map((project, index) => (
              <motion.article key={project.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.45 }} className="grid gap-8 py-12 lg:grid-cols-12 lg:py-16">
                <header className="lg:col-span-3">
                  <p className="text-xs font-semibold text-muted-foreground">CASE {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">{project.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{project.category}</p>
                  <Link href={`/projects/${project.slug}`} className="mt-8 inline-block border-b border-foreground pb-1 text-sm font-semibold transition-colors hover:border-primary hover:text-primary">{t("openCase")}</Link>
                </header>
                <div className="lg:col-span-5"><CaseArtifact slug={project.slug} /></div>
                <dl className="grid content-start gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
                  <Field label={t("context")}>{project.context}</Field>
                  <Field label={t("decision")} evidence>{project.decision}</Field>
                  <Field label={t("outcome")}>{project.outcome}</Field>
                </dl>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience-register" className="border-t border-border py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6">
          <p className="text-sm font-semibold text-primary">{t("workCases")}</p>
          <div className="mt-12 border-t border-foreground">
            {experiences.map((experience, index) => (
              <motion.article key={experience.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-60px" }} className="grid gap-8 border-b border-border py-12 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <p className="text-xs font-semibold text-muted-foreground">WORK {String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-4 text-lg font-semibold">{experience.company}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{experience.role}</p>
                  <p className="mt-5 text-xs text-muted-foreground">{experience.start_date.slice(0, 4)}—{experience.is_current ? "Present" : experience.end_date?.slice(0, 4)}</p>
                </div>
                <dl className="grid gap-8 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
                  <Field label={t("context")}>{experience.context}</Field>
                  <Field label={t("decision")} evidence>{experience.decision}</Field>
                  <Field label={t("artifact")}>
                    {experience.evidence_items.map((item) => <span key={item.label} className="block">{item.label}<small className="mt-1 block text-muted-foreground">{item.status === "pending" ? t("pending") : t("available")}</small></span>)}
                  </Field>
                  <Field label={t("outcome")}>{experience.outcome}</Field>
                </dl>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
