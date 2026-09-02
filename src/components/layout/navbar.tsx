"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sectionIds = ["home", "projects", "skills", "about", "testimonials", "blog", "contact"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      // Near bottom: highlight contact
      if (window.scrollY + windowHeight >= documentHeight - 80) {
        setActiveSection("contact");
        return;
      }

      // At top: no section active
      if (window.scrollY < 180) {
        setActiveSection("");
        return;
      }

      // Check sections from bottom to top
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            if (id === "skills") {
              setActiveSection("projects");
            } else if (id === "testimonials") {
              setActiveSection("about");
            } else if (id === "home") {
              setActiveSection("");
            } else {
              setActiveSection(id);
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: (typeof NAV_ITEMS)[number]) => {
      if (pathname === "/") {
        const targetElement = document.getElementById(item.sectionId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth" });
          setActiveSection(item.sectionId);
        }
      }
    },
    [pathname]
  );

  const handleLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("");
      }
    },
    [pathname]
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 md:pt-4 pointer-events-none">
      <div className="mx-auto max-w-[1400px] px-6 w-full">
        <nav
          className={cn(
            "flex items-center justify-between w-full",
            "px-4 md:px-5 py-2 md:py-2.5 rounded-2xl transition-all duration-300 pointer-events-auto",
            isScrolled
              ? "bg-background/85 backdrop-blur-md border border-border/80 shadow-xs"
              : "bg-background/50 backdrop-blur-sm border border-border/40"
          )}
          aria-label="Main navigation"
        >
          {/* Logo / Brand Lockup - Aligned to global left edge */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="font-display font-bold text-sm tracking-tight text-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
          >
            {SITE_NAME.split(" ")[0]}{" "}
            <span className="text-muted-foreground font-normal">
              {SITE_NAME.split(" ").slice(1).join(" ")}
            </span>
          </Link>

          {/* Navigation + Theme Controls - Aligned to global right edge */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-1" role="list">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  (pathname === "/" && activeSection === item.sectionId) ||
                  (pathname !== "/" && (pathname === item.href || pathname.startsWith(item.href + "/")));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      className={cn(
                        "relative px-3.5 py-1.5 text-sm rounded-lg transition-colors inline-block",
                        "hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
                        isActive
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute inset-0 bg-primary/10 rounded-lg"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <span className="hidden md:block w-px h-4 bg-border/60" />

            {/* Right side controls */}
            <ThemeToggle />

          {/* Mobile menu trigger & revamped drawer */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                "md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              )}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="block"
                  >
                    <X weight="bold" size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="block"
                  >
                    <List weight="bold" size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:max-w-sm p-0 flex flex-col justify-between bg-card/95 backdrop-blur-2xl border-l border-border/80 text-foreground overflow-y-auto"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation menu</SheetTitle>
              </SheetHeader>

              {/* Drawer Top Header */}
              <div className="p-6 border-b border-border/60">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-bold text-base tracking-tight text-foreground">
                    {SITE_NAME}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold text-primary tracking-wider uppercase">
                  <span
                    className="size-1.5 rounded-full bg-primary"
                    style={{ animation: "pulse 2.4s ease-in-out infinite" }}
                  />
                  Available for opportunities
                </div>
              </div>

              {/* Main Nav Links */}
              <nav aria-label="Mobile navigation" className="p-6 flex-1">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 font-semibold">
                  Navigation
                </p>
                <ul className="flex flex-col gap-2" role="list">
                  <motion.li
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <Link
                      href="/"
                      onClick={(e) => {
                        setOpen(false);
                        handleLogoClick(e);
                      }}
                      className={cn(
                        "group flex items-center justify-between p-3.5 rounded-2xl transition-all border",
                        pathname === "/" && !activeSection
                          ? "bg-primary/10 border-primary/25 text-foreground font-semibold shadow-xs"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-border/60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground/80 group-hover:text-primary">
                          00
                        </span>
                        <div>
                          <span className="block text-base font-display">Home</span>
                          <span className="block text-xs font-sans text-muted-foreground font-normal">
                            Index & overview
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </Link>
                  </motion.li>

                  {NAV_ITEMS.map((item, i) => {
                    const isActive =
                      (pathname === "/" && activeSection === item.sectionId) ||
                      (pathname !== "/" && (pathname === item.href || pathname.startsWith(item.href + "/")));

                    const subtexts: Record<string, string> = {
                      Work: "Selected systems & products",
                      About: "Background, stack & leadership",
                      Writing: "Articles & technical notes",
                      Contact: "Collaborations & inquiries",
                    };

                    const indexStr = `0${i + 1}`;

                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={(e) => {
                            setOpen(false);
                            handleNavClick(e, item);
                          }}
                          className={cn(
                            "group flex items-center justify-between p-3.5 rounded-2xl transition-all border",
                            isActive
                              ? "bg-primary/10 border-primary/25 text-foreground font-semibold shadow-xs"
                              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:border-border/60"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-muted-foreground/80 group-hover:text-primary">
                              {indexStr}
                            </span>
                            <div>
                              <span className="block text-base font-display">{item.label}</span>
                              <span className="block text-xs font-sans text-muted-foreground font-normal">
                                {subtexts[item.label] || "Explore section"}
                              </span>
                            </div>
                          </div>
                          <span className={cn("text-xs font-mono transition-opacity", isActive ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-100")}>
                            →
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* Bottom Actions & Socials */}
              <div className="p-6 border-t border-border/60 space-y-4 bg-muted/20">
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="w-full h-11 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 text-sm font-semibold shadow-md transition-colors"
                  >
                    <span>Get in touch</span>
                    <span className="text-xs font-mono">→</span>
                  </Link>

                  <a
                    href="https://drive.google.com/file/d/1stzg1TlhScszdakuhONlX-VKT4AFGpkd/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-10 px-4 rounded-xl border border-border/80 bg-background hover:bg-muted text-foreground flex items-center justify-center gap-2 text-xs font-medium transition-colors"
                  >
                    <span>Download CV / Resume</span>
                    <span className="text-[10px] font-mono opacity-70">↗</span>
                  </a>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>Jakarta, Indonesia</span>
                  <div className="flex items-center gap-3 text-foreground font-sans">
                    <a
                      href="https://github.com/rzqllh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="GitHub"
                    >
                      GitHub
                    </a>
                    <span>·</span>
                    <a
                      href="https://www.linkedin.com/in/rzqllh18/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="LinkedIn"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  </header>
);
}
