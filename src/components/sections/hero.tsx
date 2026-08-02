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
    <section aria-label="Hero" className="relative h-[100dvh] flex flex-col justify-center pt-20 pb-8 overflow-hidden">
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
              I build products end-to-end — from project roadmaps to polished
              interfaces. Currently based in Indonesia, open to startup and
              cross-functional roles.
            </motion.p>

            {/* CTAs and Socials */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20" render={<Link href="/projects" />} nativeButton={false}>
                View Projects
                <ArrowRight weight="bold" />
              </Button>
              {cvUrl && (
                <Button size="icon" variant="outline" className="size-11 rounded-xl bg-background" render={<a href={cvUrl} target="_blank" rel="noopener noreferrer" title="Download CV" />} nativeButton={false}>
                  <DownloadSimple weight="bold" className="size-5" />
                </Button>
              )}

              {/* Social Links Row */}
              <div className="flex items-center gap-3">
                <a href={socialLinks.github || "#"} target="_blank" rel="noopener noreferrer" className="size-11 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm">
                  <GithubLogo weight="fill" size={20} />
                </a>
                <a href={socialLinks.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="size-11 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm">
                  <LinkedinLogo weight="fill" size={20} />
                </a>
                <a href={socialLinks.instagram || "#"} target="_blank" rel="noopener noreferrer" className="size-11 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm">
                  <InstagramLogo weight="fill" size={20} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* ─── Right Column (Visuals & Floating Cards) ─── */}
          <motion.div
            variants={rightColVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full aspect-square md:aspect-auto md:h-[420px] flex items-center justify-center lg:justify-center mt-4 lg:mt-0"
          >
            {/* Ambient Background Blob */}
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 blur-[100px] rounded-full scale-75" />

            {/* Photo Container */}
            <motion.div 
              whileHover={!prefersReducedMotion ? { scale: 1.02, rotate: 1 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-[340px] h-[340px] lg:max-w-[400px] lg:h-[400px] rounded-[2rem] bg-gradient-to-b from-primary/5 to-transparent border border-white/20 dark:border-white/5 overflow-hidden shadow-2xl cursor-pointer"
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={photoUrl} 
                  alt="Hafizh Rizqullah Prasetya" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Photo
                </div>
              )}
            </motion.div>

            {/* Floating Metric 1: Projects Completed */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute top-[10%] left-[0%] lg:-left-[10%]"
            >
              <motion.div
                animate={!prefersReducedMotion ? { y: [-6, 6, -6] } : {}}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.2 }}
                className="p-4 bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-xl shadow-foreground/5 flex flex-col gap-1 w-44"
              >
                <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-1">
                  <TrendUp weight="bold" size={16} />
                </div>
                <p className="text-xs text-muted-foreground">Projects Completed</p>
                <p className="text-xl font-bold font-display">{projectsCount}+</p>
                <p className="text-[10px] text-muted-foreground/80 mt-1">Across web & mobile</p>
              </motion.div>
            </motion.div>

            {/* Floating Metric 2: Client Satisfaction */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="absolute top-[20%] right-[-5%] lg:-right-[5%]"
            >
              <motion.div
                animate={!prefersReducedMotion ? { y: [6, -6, 6] } : {}}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                className="p-4 bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-xl shadow-foreground/5 flex items-center gap-3"
              >
                <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Star weight="fill" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Client Satisfaction</p>
                  <p className="text-lg font-bold font-display leading-tight">{heroStats.client_satisfaction || '100%'}</p>
                  <p className="text-[10px] text-muted-foreground/80">Positive feedback</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Metric 3: On Time Delivery */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-[20%] left-[-5%] lg:left-[-5%]"
            >
              <motion.div
                animate={!prefersReducedMotion ? { y: [-4, 4, -4] } : {}}
                transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.8 }}
                className="p-4 bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-xl shadow-foreground/5 flex items-center gap-3"
              >
                <div className="size-10 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle weight="fill" size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">On Time Delivery</p>
                  <p className="text-lg font-bold font-display leading-tight">{heroStats.on_time_delivery || '98%'}</p>
                  <p className="text-[10px] text-muted-foreground/80">Projects delivered</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Metric 4: Tech Stack */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute bottom-[10%] right-[0%] lg:right-[5%]"
            >
              <motion.div
                animate={!prefersReducedMotion ? { y: [4, -4, 4] } : {}}
                transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 1.1 }}
                className="p-5 bg-background/80 backdrop-blur-xl border border-border rounded-2xl shadow-xl shadow-foreground/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Tech Stack</p>
                  <div className="size-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                    <Code weight="bold" size={12} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Visual tech icons placeholders - replacing complex SVGs with simple colored circles for now to keep code clean */}
                  <div className="size-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-500 font-bold text-[10px]">Re</div>
                  <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">TS</div>
                  <div className="size-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-[10px]">Nd</div>
                  <div className="size-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-[10px]">Fg</div>
                  <div className="size-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-[10px]">Tw</div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">... and more</p>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>

        {/* ─── Bottom Stats Bar ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-8 w-full max-w-5xl mx-auto bg-card border border-border rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border overflow-hidden"
        >
          {/* Stat 1 */}
          <div className="flex items-center justify-center gap-4 p-4 lg:p-6 w-full text-left">
            <div className="size-14 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
              <UsersThree weight="fill" size={28} />
            </div>
            <div className="w-[140px]">
              <p className="text-xs text-muted-foreground font-medium">Collaborated with</p>
              <p className="text-xl font-bold font-display">{heroStats.teams_collaborated || '15+'} Teams</p>
              <p className="text-xs text-muted-foreground/80 mt-0.5">Startups to enterprises</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center justify-center gap-4 p-4 lg:p-6 w-full text-left">
            <div className="size-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
              <Rocket weight="fill" size={28} />
            </div>
            <div className="w-[140px]">
              <p className="text-xs text-muted-foreground font-medium">Experience</p>
              <p className="text-xl font-bold font-display">{heroStats.years_experience || '5+'} Years</p>
              <p className="text-xs text-muted-foreground/80 mt-0.5">In product & design</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center justify-center gap-4 p-4 lg:p-6 w-full text-left">
            <div className="size-14 rounded-full bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
              <GlobeHemisphereWest weight="fill" size={28} />
            </div>
            <div className="w-[140px]">
              <p className="text-xs text-muted-foreground font-medium">Based in</p>
              <p className="text-xl font-bold font-display">{heroStats.based_in || 'Indonesia'}</p>
              <p className="text-xs text-muted-foreground/80 mt-0.5">Open to remote</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

