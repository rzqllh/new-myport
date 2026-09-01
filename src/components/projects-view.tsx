"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProjectCard, type Project } from "@/components/project-card";
import { cn } from "@/lib/utils";

interface ProjectsViewProps {
  initialProjects: Project[];
}

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "web-dev", label: "Web Applications" },
  { id: "tools", label: "Tools & Systems" },
  { id: "ui-ux", label: "UI/UX & Research" },
];

export function ProjectsView({ initialProjects }: ProjectsViewProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects =
    activeCategory === "all"
      ? initialProjects
      : initialProjects.filter((p) => p.category === activeCategory);

  const getCount = (categoryId: string) => {
    if (categoryId === "all") return initialProjects.length;
    return initialProjects.filter((p) => p.category === categoryId).length;
  };

  return (
    <div className="space-y-10">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        {CATEGORIES.map((cat) => {
          const count = getCount(cat.id);
          const isActive = activeCategory === cat.id;

          if (count === 0 && cat.id !== "all") return null;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                "flex items-center gap-2 cursor-pointer",
                isActive
                  ? "bg-foreground text-background shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <span>{cat.label}</span>
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-md font-mono",
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-background text-muted-foreground border border-border/50"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground">
            No projects found in this category.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full"
              >
                <ProjectCard project={project} className="h-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
