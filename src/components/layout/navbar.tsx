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

    const sectionIds = ["home", "projects", "skills", "about", "blog", "testimonials", "contact"];
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
              setActiveSection("contact");
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
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav
        className={cn(
          "mx-auto max-w-[1400px]",
          "flex items-center justify-between",
          "px-4 py-2 rounded-2xl transition-all duration-300",
          isScrolled
            ? "bg-background/85 backdrop-blur-md border border-border/80 shadow-xs"
            : "bg-background/50 backdrop-blur-sm border border-border/40"
        )}
        aria-label="Main navigation"
      >
        {/* Logo / Brand Lockup */}
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

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile menu trigger */}
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

            <SheetContent side="right" className="w-72 pt-16">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation menu</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile navigation">
                <ul className="flex flex-col gap-1" role="list">
                  <motion.li
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Link
                      href="/"
                      onClick={(e) => {
                        setOpen(false);
                        handleLogoClick(e);
                      }}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-base transition-colors",
                        pathname === "/" && !activeSection
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      Home
                    </Link>
                  </motion.li>

                  {NAV_ITEMS.map((item, i) => {
                    const isActive =
                      (pathname === "/" && activeSection === item.sectionId) ||
                      (pathname !== "/" && (pathname === item.href || pathname.startsWith(item.href + "/")));

                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (i + 1) * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={(e) => {
                            setOpen(false);
                            handleNavClick(e, item);
                          }}
                          className={cn(
                            "flex items-center px-4 py-3 rounded-xl text-base transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

