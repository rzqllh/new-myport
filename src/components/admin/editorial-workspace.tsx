"use client";

import type { ReactNode } from "react";
import { List, SlidersHorizontal } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface EditorSection {
  id: string;
  label: string;
  complete?: boolean;
}

function Outline({
  sections,
  onNavigate,
}: {
  sections: EditorSection[];
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Editor sections" className="space-y-1">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          onClick={onNavigate}
          className="flex min-h-9 items-center justify-between rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span>{section.label}</span>
          {section.complete !== undefined ? (
            <span
              aria-label={section.complete ? "Complete" : "Incomplete"}
              className={
                section.complete
                  ? "size-1.5 rounded-full bg-emerald-500"
                  : "size-1.5 rounded-full bg-muted-foreground/40"
              }
            />
          ) : null}
        </a>
      ))}
    </nav>
  );
}

export function EditorialWorkspace({
  sections,
  children,
  inspector,
}: {
  sections: EditorSection[];
  children: ReactNode;
  inspector: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 xl:hidden">
        <Sheet>
          <SheetTrigger
            render={<Button type="button" variant="outline" size="sm" />}
          >
            <List className="size-4" />
            Outline
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(88vw,320px)] p-0">
            <SheetHeader className="border-b border-border px-5 py-4">
              <SheetTitle>Document outline</SheetTitle>
            </SheetHeader>
            <div className="px-3 py-4">
              <Outline sections={sections} />
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger
            render={<Button type="button" variant="outline" size="sm" />}
          >
            <SlidersHorizontal className="size-4" />
            Settings
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[min(92vw,380px)] overflow-y-auto p-0"
          >
            <SheetHeader className="border-b border-border px-5 py-4">
              <SheetTitle>Publishing settings</SheetTitle>
            </SheetHeader>
            <div className="p-5">{inspector}</div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-8 xl:grid-cols-[180px_minmax(0,1fr)_300px]">
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <p className="mb-3 px-2.5 text-xs font-medium text-muted-foreground">
              Outline
            </p>
            <Outline sections={sections} />
          </div>
        </aside>

        <div className="min-w-0">{children}</div>

        <aside className="hidden xl:block">
          <div className="sticky top-24">{inspector}</div>
        </aside>
      </div>
    </div>
  );
}

export function LocaleSwitch({
  locale,
  onChange,
  idAvailable,
}: {
  locale: "en" | "id";
  onChange: (locale: "en" | "id") => void;
  idAvailable?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Editing language"
      className="inline-flex rounded-lg border border-border p-0.5"
    >
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-pressed={locale === "en"}
        className={
          locale === "en"
            ? "rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
            : "rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        }
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("id")}
        aria-pressed={locale === "id"}
        className={
          locale === "id"
            ? "rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background"
            : "rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        }
      >
        ID{!idAvailable ? " · empty" : ""}
      </button>
    </div>
  );
}
