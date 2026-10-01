"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { List, MagnifyingGlass } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  GlobalSearchDialog,
  type PublicSearchItem,
} from "@/components/public-search";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  PUBLIC_UI,
  localeFromPathname,
  publicPath,
  switchLocalePath,
} from "@/lib/content/public-routes";
import type { Locale } from "@/types/content";
import { cn } from "@/lib/utils";

interface NavigationLabels {
  work: string;
  about: string;
  insights: string;
  contact: string;
  resume: string;
}

interface NavbarProps {
  siteName: string;
  labelsByLocale: Record<Locale, NavigationLabels>;
  searchItemsByLocale: Record<Locale, PublicSearchItem[]>;
  availability?: string;
  location?: string;
}

const routes = [
  { key: "work", path: "/work" },
  { key: "about", path: "/about" },
  { key: "insights", path: "/insights" },
  { key: "contact", path: "/contact" },
] as const;

export function Navbar({
  siteName,
  labelsByLocale,
  searchItemsByLocale,
  availability,
  location,
}: NavbarProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);
  const locale = localeFromPathname(pathname);
  const labels = labelsByLocale[locale];
  const ui = PUBLIC_UI[locale];
  const homeHref = publicPath(locale, "/");
  const resumeHref = publicPath(locale, "/resume");
  const localeHref = switchLocalePath(pathname);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <header
      data-print-hidden
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90"
    >
      <nav
        className="editorial-container flex h-16 items-center justify-between gap-6"
        aria-label={ui.navigation}
      >
        <Link
          href={homeHref}
          className="min-w-0 truncate font-display text-sm font-semibold tracking-tight text-foreground"
        >
          {siteName}
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {routes.map((item) => {
            const href = publicPath(locale, item.path);
            const active =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={item.key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm transition-colors duration-150",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {labels[item.key]}
                {active ? (
                  prefersReducedMotion ? (
                    <span className="absolute inset-x-3 bottom-1 h-px bg-primary" />
                  ) : (
                    <motion.span
                      layoutId="public-nav-active"
                      className="absolute inset-x-3 bottom-1 h-px bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                        mass: 0.7,
                      }}
                    />
                  )
                ) : null}
              </Link>
            );
          })}

          <span className="mx-2 h-4 w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchOpen(true)}
            aria-label={ui.searchOpen}
          >
            <MagnifyingGlass className="size-4" />
            {ui.searchOpen}
          </Button>
          <a
            href={localeHref}
            hrefLang={locale === "en" ? "id" : "en"}
            className="rounded-md px-2 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            aria-label={ui.switchLanguage}
          >
            {locale === "en" ? "ID" : "EN"}
          </a>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            render={<Link href={resumeHref} />}
            nativeButton={false}
          >
            {labels.resume}
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            aria-label={ui.searchOpen}
          >
            <MagnifyingGlass className="size-5" />
          </Button>
          <a
            href={localeHref}
            hrefLang={locale === "en" ? "id" : "en"}
            className="px-2 py-2 text-xs font-medium text-muted-foreground"
            aria-label={ui.switchLanguage}
          >
            {locale === "en" ? "ID" : "EN"}
          </a>
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label={ui.navigation} />
              }
            >
              <List className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(92vw,360px)] overflow-y-auto p-0"
            >
              <SheetHeader className="border-b border-border px-5 py-5 text-left">
                <SheetTitle>{siteName}</SheetTitle>
              </SheetHeader>

              <div className="space-y-8 p-5">
                <nav aria-label={ui.navigation}>
                  <ul className="divide-y divide-border">
                    {routes.map((item) => {
                      const href = publicPath(locale, item.path);
                      const active =
                        pathname === href || pathname.startsWith(`${href}/`);
                      return (
                        <li key={item.key}>
                          <Link
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex min-h-12 items-center border-l-2 px-3 text-base transition-colors duration-150",
                              active
                                ? "border-primary text-foreground"
                                : "border-transparent text-foreground hover:border-border"
                            )}
                          >
                            {labels[item.key]}
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <Link
                        href={resumeHref}
                        className="flex min-h-12 items-center text-base text-foreground"
                      >
                        {labels.resume}
                      </Link>
                    </li>
                  </ul>
                </nav>

                {availability || location ? (
                  <div className="space-y-1 border-t border-border pt-5 text-sm text-muted-foreground">
                    {availability ? <p>{availability}</p> : null}
                    {location ? <p>{location}</p> : null}
                  </div>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <GlobalSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        locale={locale}
        items={searchItemsByLocale[locale]}
      />
    </header>
  );
}
