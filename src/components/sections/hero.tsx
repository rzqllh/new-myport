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

export interface HeroProject {
  slug: string;
  title: string;
  description: string;
  category: string;
  tech_stack: string[];
  github_url?: string | null;
  demo_url?: string | null;
}

export interface LiveGitHubData {
  available: boolean;
  repoName?: string;
  commitMessage?: string;
  createdAt?: string;
  publicRepos?: number;
}

interface HeroProps {
  photoUrl?: string;
  cvUrl?: string;
  socialLinks?: Record<string, string>;
  projectsCount?: number;
  heroStats?: Record<string, string>;
  selectedProjects?: HeroProject[];
  liveGitHub?: LiveGitHubData | null;
}

const CAPABILITIES = [
  { label: "Project Management", icon: ChartLineUp },
  { label: "Product Design", icon: ShieldCheck },
  { label: "Web Engineering", icon: Terminal },
];

const DEFAULT_SELECTED_SYSTEMS: HeroProject[] = [
  {
    slug: "lumina",
    title: "Lumina",
    description: "Personal project OS for creative studios: brief builder, client status & receivable finances.",
    category: "web-dev",
    tech_stack: ["React", "TypeScript", "Vite", "Supabase"],
    github_url: "https://github.com/rzqllh/Lumina",
    demo_url: "https://lumina-azure-beta.vercel.app",
  },
  {
    slug: "summai",
    title: "SummAI",
    description: "Local-first meeting intelligence engine with Groq Whisper transcription & Gemini synthesis.",
    category: "web-dev",
    tech_stack: ["Next.js", "FastAPI", "Groq Whisper", "Google Gemini"],
    github_url: "https://github.com/rzqllh/SummAI",
    demo_url: null,
  },
  {
    slug: "rangkai",
    title: "Rangkai",
    description: "AI specification builder generating execution-ready Build Packs for coding agents.",
    category: "tools",
    tech_stack: ["TypeScript", "Claude", "Gemini", "Codex"],
    github_url: "https://github.com/rzqllh/Rangkai",
    demo_url: null,
  },
  {
    slug: "voltune",
    title: "Voltune",
    description: "State-aware Windows performance, network diagnostics, and recovery toolkit with auto-restore.",
    category: "tools",
    tech_stack: ["Python", "PowerShell", "Win32"],
    github_url: "https://github.com/rzqllh/Voltune",
    demo_url: null,
  },
];

export function Hero({
  photoUrl,
  cvUrl,
  socialLinks = {},
  projectsCount = 8,
  selectedProjects = DEFAULT_SELECTED_SYSTEMS,
  liveGitHub,
}: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const systems = selectedProjects && selectedProjects.length > 0 ? selectedProjects.slice(0, 3) : DEFAULT_SELECTED_SYSTEMS.slice(0, 3);

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

          {/* ─── Right Column (Photo OR Realtime Selected Systems Card) ─── */}
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
              /* Realtime Git/Database Selected Systems Overview */
              <div className="w-full max-w-[460px] rounded-3xl border border-border/80 bg-card p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                      Selected Systems
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {projectsCount} Published Works
                  </span>
                </div>

                {liveGitHub?.repoName && (
                  <div className="px-3.5 py-2 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-muted-foreground truncate max-w-[200px]">
                      git push: <span className="text-foreground font-semibold">{liveGitHub.repoName}</span>
                    </span>
                    <span className="text-primary font-semibold shrink-0">Live GitHub</span>
                  </div>
                )}

                <div className="space-y-3 font-mono text-xs">
                  {systems.map((proj) => {
                    const stackTag = proj.tech_stack.slice(0, 3).join(" · ");

                    return (
                      <Link
                        key={proj.slug}
                        href={`/projects/${proj.slug}`}
                        className="group block p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1.5 hover:border-foreground/25 hover:bg-muted/70 transition-all shadow-xs"
                      >
                        <div className="flex justify-between items-center text-foreground font-semibold">
                          <span className="group-hover:text-primary transition-colors flex items-center gap-1.5">
                            {proj.title}
                            <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                          <span className="text-muted-foreground font-mono text-[10px] font-normal truncate max-w-[150px]">
                            {stackTag}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-sans leading-relaxed line-clamp-2">
                          {proj.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="truncate max-w-[240px]">Stack: React · Next.js · Python · Supabase</span>
                  <Link href="/projects" className="text-primary font-semibold hover:underline inline-flex items-center gap-1 shrink-0">
                    <span>View all ({projectsCount})</span>
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


