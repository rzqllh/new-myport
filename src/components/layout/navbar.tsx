"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
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
    if (pathname !== "/") return;

    const observers: IntersectionObserver[] = [];
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`/#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    });

    const sections = ["home", "about", "projects", "blog", "contact"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("/#home");
    }
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav
        className={cn(
          "mx-auto max-w-[1400px]",
          "flex items-center justify-between",
          "px-4 py-2.5 rounded-2xl transition-all duration-300",
          isScrolled 
            ? "glass border border-border/60 shadow-sm bg-background/80" 
            : "bg-transparent border-transparent"
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={scrollToTop}
          className="font-display font-bold text-sm tracking-tight text-foreground hover:text-primary transition-colors"
        >
          {SITE_NAME.split(" ")[0]}{" "}
          <span className="text-muted-foreground font-normal">
            {SITE_NAME.split(" ").slice(1).join(" ")}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_ITEMS.map((item) => {
            let isActive = false;
            if (pathname === "/") {
              const activeMapped = activeSection === "/#home" || activeSection === "" ? "/" : activeSection;
              // We cast item.href to string to avoid TS narrowing errors since we removed '/' from NAV_ITEMS
              isActive = activeMapped === (item.href as string);
            } else {
              isActive = pathname.startsWith(item.href as string);
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative px-3 py-1.5 text-sm rounded-lg transition-colors",
                    "hover:text-foreground",
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

        {/* Right: theme toggle + mobile menu */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Mobile hamburger — base-ui Sheet uses render= not asChild */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={open ? "Close menu" : "Open menu"}
                />
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X weight="bold" className="size-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <List weight="bold" className="size-5" />
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
                  {NAV_ITEMS.map((item, i) => {
                    let isActive = false;
                    if (pathname === "/") {
                      const activeMapped = activeSection === "/#home" || activeSection === "" ? "/" : activeSection;
                      // We cast item.href to string to avoid TS narrowing errors since we removed '/' from NAV_ITEMS
                      isActive = activeMapped === (item.href as string);
                    } else {
                      isActive = pathname.startsWith(item.href as string);
                    }
                    return (
                      <motion.li
                        key={item.href}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
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
