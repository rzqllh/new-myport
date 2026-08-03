/* eslint-disable */
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { 
  ArrowRight, DownloadSimple, 
  GithubLogo, LinkedinLogo, InstagramLogo, EnvelopeSimple,
  TrendUp, Star, CheckCircle, Code, UsersThree, Rocket, GlobeHemisphereWest
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  photoUrl?: string;
  cvUrl?: string;
  socialLinks?: Record<string, string>;
  projectsCount?: number;
  heroStats?: Record<string, string>;
}

const ROLES = ["Project Manager", "UI/UX Designer", "Web Developer"];

export function Hero({ photoUrl, cvUrl, socialLinks = {}, projectsCount = 0, heroStats = {} }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants: import("motion/react").Variants = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      };

  const rightColVariants: import("motion/react").Variants = prefersReducedMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 },
        },
      };

  return (
    <section id="home" aria-label="Hero" className="relative min-h-[100dvh] flex flex-col justify-center pt-20 pb-8 overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative mx-auto w-full max-w-[1400px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* ─── Left Column (Text & CTAs) ─── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[640px] z-10"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-widest uppercase">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Available for opportunities
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[1.05] text-foreground mb-6"
            >
              Hafizh Rizqullah
              <br />
              <span className="text-primary">Prasetya</span>
            </motion.h1>

            {/* Role tags */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 mb-8"
            >
              {ROLES.map((role) => (
                <span
                  key={role}
                  className="px-4 py-1.5 rounded-full text-sm bg-muted/50 border border-border text-foreground font-medium flex items-center gap-2 shadow-sm"
                >
                  <span className="text-primary/70">✦</span>
                  {role}
                </span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground leading-relaxed max-w-[540px] mb-10"
            >
              I manage projects, design interfaces, and write code. From raw idea to final release, I build things that work.
            </motion.p>

            {/* CTAs and Socials */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Button size="lg" className="h-11 px-6 rounded-xl shadow-lg shadow-primary/20" render={<Link href="/projects" />} nativeButton={false}>
                View Projects
                <ArrowRight weight="bold" />
              </Button>
              {cvUrl && (
                <Button size="lg" variant="outline" className="h-11 px-6 rounded-xl bg-background" render={<a href={cvUrl} target="_blank" rel="noopener noreferrer" title="Download CV" />} nativeButton={false}>
                  <DownloadSimple weight="bold" className="mr-1" />
                  Download CV
                </Button>
              )}

              {/* Social Links Row */}
              <div className="flex items-center gap-3">
                {socialLinks.github && (
                  <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="size-11 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm">
                    <GithubLogo weight="fill" size={20} />
                  </a>
                )}
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="size-11 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm">
                    <LinkedinLogo weight="fill" size={20} />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="size-11 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm">
                    <InstagramLogo weight="fill" size={20} />
                  </a>
                )}
                {socialLinks.email && (
                  <a href={socialLinks.email} target="_blank" rel="noopener noreferrer" className="size-11 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm">
                    <EnvelopeSimple weight="fill" size={20} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* ─── Right Column (Visuals) ─── */}
          <motion.div
            variants={rightColVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full aspect-square md:aspect-auto md:h-[420px] flex items-center justify-center lg:justify-center mt-4 lg:mt-0"
          >
            {/* Photo Container */}
            <motion.div 
              whileHover={!prefersReducedMotion ? { scale: 1.02, rotate: 1 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-[340px] h-[340px] lg:max-w-[400px] lg:h-[400px] rounded-[2rem] bg-gradient-to-b from-foreground/5 to-transparent border border-border overflow-hidden shadow-2xl cursor-pointer"
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={photoUrl} 
                  alt="Hafizh Rizqullah Prasetya" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full relative flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 overflow-hidden">
                  {/* Subtle Grid Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                       style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  {/* Abstract Mesh Gradients */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-200/50 via-transparent to-zinc-300/50 dark:from-zinc-800/50 dark:to-zinc-950/50" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-gradient-to-tr from-transparent via-zinc-400/20 to-transparent dark:via-zinc-600/10 blur-3xl opacity-60" />
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

