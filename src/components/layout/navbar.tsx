"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  labels: NavigationLabels;
  cvUrl?: string;
  availability?: string;
  location?: string;
}

const routes = [
  { key: "work", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "insights", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

export function Navbar({
  siteName,
  labels,
  cvUrl,
  availability,
  location,
}: NavbarProps) {
  const pathname = usePathname();

  return (
    <header data-print-hidden className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <nav
        className="editorial-container flex h-16 items-center justify-between gap-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="min-w-0 truncate font-display text-sm font-semibold tracking-tight text-foreground"
        >
          {siteName}
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {routes.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {labels[item.key]}
              </Link>
            );
          })}
          <span className="mx-2 h-4 w-px bg-border" />
          <ThemeToggle />
          {cvUrl ? (
            <Button
              variant="outline"
              size="sm"
              render={
                <a href={cvUrl} target="_blank" rel="noopener noreferrer" />
              }
              nativeButton={false}
            >
              {labels.resume}
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation"
                />
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
                <nav aria-label="Mobile navigation">
                  <ul className="divide-y divide-border">
                    {routes.map((item) => (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          className="flex min-h-12 items-center text-base text-foreground"
                        >
                          {labels[item.key]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {availability || location ? (
                  <div className="space-y-1 border-t border-border pt-5 text-sm text-muted-foreground">
                    {availability ? <p>{availability}</p> : null}
                    {location ? <p>{location}</p> : null}
                  </div>
                ) : null}

                {cvUrl ? (
                  <Button
                    className="w-full"
                    render={
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    nativeButton={false}
                  >
                    {labels.resume}
                  </Button>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
