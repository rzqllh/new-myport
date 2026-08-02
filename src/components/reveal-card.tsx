"use client";

import { useReducedMotion, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface RevealCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function RevealCard({
  children,
  delay = 0,
  className,
  once = true,
}: RevealCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const cardClasses = cn(
    // Base visual shell (moved to ProjectCard/BlogCard)
    "h-full"
  );

  if (prefersReducedMotion) {
    return <div className={cn(className, cardClasses)}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      <div className={cn("h-full", cardClasses)}>
        {children}
      </div>
    </motion.div>
  );
}
