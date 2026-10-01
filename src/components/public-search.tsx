"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PUBLIC_UI } from "@/lib/content/public-routes";
import type { Locale } from "@/types/content";

export type PublicSearchItemKind = "work" | "insight" | "page";

export interface PublicSearchItem {
  id: string;
  kind: PublicSearchItemKind;
  title: string;
  description: string;
  href: string;
}

function normalizedTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function rankItems(items: PublicSearchItem[], query: string) {
  const tokens = normalizedTokens(query);

  if (!tokens.length) {
    return items.filter((item) => item.kind === "page").slice(0, 6);
  }

  return items
    .map((item, index) => {
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();

      const score = tokens.reduce((total, token) => {
        if (title === token) return total + 12;
        if (title.startsWith(token)) return total + 8;
        if (title.includes(token)) return total + 5;
        if (description.includes(token)) return total + 2;
        return total;
      }, 0);

      return { item, score, index };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 10)
    .map((entry) => entry.item);
}

function kindLabel(kind: PublicSearchItemKind, locale: Locale) {
  if (kind === "work") return locale === "id" ? "Karya" : "Work";
  if (kind === "insight") return locale === "id" ? "Insight" : "Insight";
  return locale === "id" ? "Halaman" : "Page";
}

export function GlobalSearchDialog({
  open,
  onOpenChange,
  locale,
  items,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
  items: PublicSearchItem[];
}) {
  const router = useRouter();
  const ui = PUBLIC_UI[locale];
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => rankItems(items, query), [items, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }

    const timer = globalThis.setTimeout(() => inputRef.current?.focus(), 50);
    return () => globalThis.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(0);
  }, [activeIndex, results.length]);

  function select(item: PublicSearchItem) {
    onOpenChange(false);
    router.push(item.href);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[18vh] max-w-2xl translate-y-0 gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle>{ui.searchTitle}</DialogTitle>
          <DialogDescription>{ui.searchDescription}</DialogDescription>
        </DialogHeader>

        <div className="border-b border-border p-4">
          <div className="relative">
            <MagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && results.length) {
                  event.preventDefault();
                  setActiveIndex((current) => (current + 1) % results.length);
                } else if (event.key === "ArrowUp" && results.length) {
                  event.preventDefault();
                  setActiveIndex(
                    (current) => (current - 1 + results.length) % results.length
                  );
                } else if (event.key === "Enter" && results[activeIndex]) {
                  event.preventDefault();
                  select(results[activeIndex]);
                }
              }}
              placeholder={ui.searchPlaceholder}
              aria-label={ui.searchPlaceholder}
              aria-controls="portfolio-search-results"
              aria-activedescendant={
                results[activeIndex]
                  ? "portfolio-search-" + results[activeIndex].id
                  : undefined
              }
              className="pl-9"
            />
          </div>
        </div>

        <div className="max-h-[min(52vh,480px)] overflow-y-auto px-2 py-2">
          {results.length ? (
            <div
              id="portfolio-search-results"
              role="listbox"
              aria-label={ui.searchResults}
              className="divide-y divide-border"
            >
              {results.map((item, index) => {
                const active = index === activeIndex;

                return (
                  <button
                    key={item.id}
                    id={"portfolio-search-" + item.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => select(item)}
                    className={
                      active
                        ? "grid w-full gap-1 bg-muted px-3 py-3 text-left sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center"
                        : "grid w-full gap-1 px-3 py-3 text-left hover:bg-muted/60 sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center"
                    }
                  >
                    <span className="text-[11px] text-muted-foreground">
                      {kindLabel(item.kind, locale)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {item.title}
                      </span>
                      {item.description ? (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    <ArrowRight
                      className="hidden size-4 text-muted-foreground sm:block"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">
              {ui.searchEmpty}
            </p>
          )}
        </div>

        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          {ui.searchKeyboardHelp}
        </div>
      </DialogContent>
    </Dialog>
  );
}
