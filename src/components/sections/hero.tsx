"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight, DownloadSimple,
  GithubLogo, LinkedinLogo, InstagramLogo,
  Terminal, ShieldCheck, ChartLineUp
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/copy-email-button";

interface HeroProps {
  photoUrl?: string;
  cvUrl?: string;
  socialLinks?: Record<string, string>;
  projectsCount?: number;
  heroStats?: Record<string, string>;
}

const CAPABILITIES = [
  { label: "Project Management", icon: ChartLineUp },
  { label: "Product Design", icon: ShieldCheck },
  { label: "Web Engineering", icon: Terminal },
];

export function Hero({ photoUrl, cvUrl, socialLinks = {}, projectsCount = 8 }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants: import("motion/react").Variants = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
      },
    };

  const rightColVariants: import("motion/react").Variants = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
      hidden: { opacity: 0, scale: 0.96 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.15 },
      },
    };

  return (
    <section id="home" aria-label="Hero" className="relative min-h-[90dvh] flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      <div className="relative mx-auto w-full max-w-[1400px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ─── Left Column (Text & Positioning) ─── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 max-w-[680px] z-10"
          >
            {/* Live Status & GitHub Activity */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-wider uppercase">
                <span
                  className="size-1.5 rounded-full bg-primary"
                  style={{ animation: "pulse 2.4s ease-in-out infinite" }}
                />
                Available for opportunities
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[1.04] text-foreground mb-6"
            >
              Hafizh Rizqullah
              <br />
              <span className="text-primary">Prasetya</span>
            </motion.h1>

            {/* Hybrid Capability Chips */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 mb-7"
            >
              {CAPABILITIES.map((cap) => {
                const Icon = cap.icon;
                return (
                  <span
                    key={cap.label}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-muted/60 border border-border/80 text-foreground flex items-center gap-2 shadow-xs"
                  >
                    <Icon weight="duotone" className="size-3.5 text-primary" />
                    <span>{cap.label}</span>
                  </span>
                );
              })}
            </motion.div>

            {/* Positioning Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[580px] mb-10"
            >
              I bridge project delivery, product design, and engineering to turn complex requirements into working digital systems.
            </motion.p>

            {/* CTAs and Socials */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Button size="lg" className="h-11 px-6 rounded-xl shadow-md shadow-primary/10" render={<Link href="/projects" />} nativeButton={false}>
                <span>View selected work</span>
                <ArrowRight weight="bold" />
              </Button>
              {cvUrl && (
                <Button size="lg" variant="outline" className="h-11 px-6 rounded-xl bg-background border-border" render={<a href={cvUrl} target="_blank" rel="noopener noreferrer" title="Download Resume / CV" />} nativeButton={false}>
                  <DownloadSimple weight="bold" className="mr-1.5 size-4" />
                  <span>Resume</span>
                </Button>
              )}

              {/* Social Links & Copy Email */}
              <div className="flex items-center gap-2">
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub @rzqllh"
                    aria-label="GitHub profile"
                    className="size-11 flex items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
                  >
                    <GithubLogo weight="fill" size={20} />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn profile"
                    aria-label="LinkedIn profile"
                    className="size-11 flex items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
                  >
                    <LinkedinLogo weight="fill" size={20} />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram profile"
                    aria-label="Instagram profile"
                    className="size-11 flex items-center justify-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-xs"
                  >
                    <InstagramLogo weight="fill" size={20} />
                  </a>
                )}
                <CopyEmailButton
                  email={socialLinks.email ? socialLinks.email.replace("mailto:", "") : "hrizqullah484@gmail.com"}
                  variant="icon"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* ─── Right Column (Photo OR Factual Selected Index) ─── */}
          <motion.div
            variants={rightColVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 w-full flex items-center justify-center mt-6 lg:mt-0"
          >
            {photoUrl ? (
              <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl bg-card border border-border overflow-hidden shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Hafizh Rizqullah Prasetya"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              </div>
            ) : (
              /* Factual Project Index Overview (No fabricated telemetry) */
              <div className="w-full max-w-[440px] rounded-3xl border border-border/80 bg-card p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                      Selected Systems
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {projectsCount} Published Works
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <Link href="/projects/voltune" className="block p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1 hover:border-foreground/20 hover:bg-muted/60 transition-colors">
                    <div className="flex justify-between items-center text-foreground font-semibold">
                      <span>Voltune</span>
                      <span className="text-muted-foreground font-mono text-[10px]">Python · Win32</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-sans leading-normal">
                      State-aware Windows performance and system recovery toolkit.
                    </p>
                  </Link>

                  <Link href="/projects/cultural-heritage-repository" className="block p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1 hover:border-foreground/20 hover:bg-muted/60 transition-colors">
                    <div className="flex justify-between items-center text-foreground font-semibold">
                      <span>Cultural Heritage Repo</span>
                      <span className="text-muted-foreground font-mono text-[10px]">PHP · MySQL</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-sans leading-normal">
                      Digital asset repository managing 100,395+ items across 451 museums.
                    </p>
                  </Link>

                  <Link href="/projects/bca-mobile-ui-analysis" className="block p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1 hover:border-foreground/20 hover:bg-muted/60 transition-colors">
                    <div className="flex justify-between items-center text-foreground font-semibold">
                      <span>BCA Mobile Usability</span>
                      <span className="text-muted-foreground font-mono text-[10px]">Figma · UCD</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-sans leading-normal">
                      Interface usability research using User-Centered Design and A/B testing.
                    </p>
                  </Link>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>Stack: TS · Next.js · Python · SQL</span>
                  <Link href="/projects" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
                    <span>View all</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </section>
  );
}


