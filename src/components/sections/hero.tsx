"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, DownloadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const ROLES = ["Project Manager", "UI/UX Designer", "Web Developer"];

export function Hero() {
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

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[100dvh] flex items-center"
    >
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

      {/* Accent blob */}
      <div
        className="pointer-events-none absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-24 pt-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[760px]"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-medium text-muted-foreground tracking-widest uppercase">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Available for opportunities
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-bold text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.05] text-foreground mb-6"
          >
            Hafizh Rizqullah
            <br />
            <span className="text-gradient">Prasetya</span>
          </motion.h1>

          {/* Role tags */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-2 mb-6"
          >
            {ROLES.map((role) => (
              <span
                key={role}
                className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary font-medium"
              >
                {role}
              </span>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground leading-relaxed max-w-[560px] mb-10"
          >
            I build products end-to-end — from project roadmaps to polished
            interfaces. Currently based in Indonesia, open to startup and
            cross-functional roles.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3"
          >
            <Button size="lg" render={<Link href="/projects" />} nativeButton={false}>
                View Projects
                <ArrowRight weight="bold" data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<a href="/Hafizh Rizqullah Prasetya - CV.pdf" target="_blank" rel="noopener noreferrer" download />} nativeButton={false}>
                <DownloadSimple weight="duotone" data-icon="inline-start" />
                Download CV
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-6 hidden md:flex items-center gap-2 text-xs text-muted-foreground"
        >
          <div className="w-px h-10 bg-border" />
          <span className="rotate-90 origin-left translate-y-5">
            scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
