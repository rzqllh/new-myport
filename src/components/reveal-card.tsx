"use client";

import { useReducedMotion, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface RevealCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
  /**
   * If true, applies hover affordances (translate-y, shadow, etc).
   * Set to false for static content like Testimonials where there is no click destination.
   */
  interactive?: boolean;
}

export function RevealCard({
  children,
  delay = 0,
  className,
  once = true,
  interactive = true,
}: RevealCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const cardClasses = cn(
    // Base visual shell
    "rounded-2xl border border-border bg-card",
    // Interactive states
    interactive &&
      "transition-all duration-300 ease-out hover:shadow-lg hover:shadow-foreground/5 hover:-translate-y-1 focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2",
    className
  );

  if (prefersReducedMotion) {
    return <div className={cardClasses}>{children}</div>;
  }

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}
