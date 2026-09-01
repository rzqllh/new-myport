"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { List, X } from "@phosphor-icons/react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const items = [
    { label: t("work"), href: "/#case-register" },
    { label: t("experience"), href: "/#experience-register" },
    { label: t("notes"), href: "/blog" },
    { label: t("contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6" aria-label="Primary navigation">
        <Link href="/" className="flex items-baseline gap-3 font-display font-semibold tracking-tight">
          <span className="text-base">Hafizh Rizqullah</span>
          <span className="hidden text-xs font-normal text-muted-foreground sm:inline">Case files / 2026</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{item.label}</Link>
          ))}
          <div className="flex items-center gap-2 border-l border-border pl-3">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="grid size-10 place-items-center md:hidden" aria-expanded={open} aria-controls="mobile-navigation" aria-label={t("menu")}>
          {open ? <X weight="bold" className="size-5" /> : <List weight="bold" className="size-5" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-navigation" className="border-t border-border bg-background px-6 py-6 md:hidden">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-1">
            {items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="border-b border-border py-3 text-base font-medium">{item.label}</Link>
            ))}
            <div className="mt-4 flex items-center gap-3"><ThemeToggle /><LanguageToggle /></div>
          </div>
        </div>
      )}
    </header>
  );
}
