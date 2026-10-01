"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Article,
  Briefcase,
  Code,
  Envelope,
  FolderOpen,
  Gear,
  Quotes,
  SquaresFour,
  User,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: SquaresFour }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/projects", label: "Work", icon: FolderOpen },
      { href: "/admin/blog", label: "Insights", icon: Article },
      { href: "/admin/experience", label: "Experience", icon: Briefcase },
      { href: "/admin/skills", label: "Capabilities", icon: Code },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quotes },
    ],
  },
  {
    label: "Communication",
    items: [{ href: "/admin/messages", label: "Inbox", icon: Envelope }],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/about", label: "About", icon: User },
      { href: "/admin/settings", label: "Settings", icon: Gear },
    ],
  },
] as const;

export function AdminNavigation({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="space-y-6">
      {groups.map((group) => (
        <div key={group.label} className="space-y-1.5">
          <p className="px-3 text-[11px] font-medium tracking-wide text-muted-foreground">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                    active
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon
                    weight={active ? "fill" : "regular"}
                    className="size-[18px] shrink-0"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
