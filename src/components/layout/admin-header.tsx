"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowSquareOut,
  List,
  SignOut,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const labels: Record<string, string> = {
  projects: "Work",
  blog: "Insights",
  experience: "Experience",
  skills: "Capabilities",
  testimonials: "Testimonials",
  messages: "Inbox",
  about: "About",
  settings: "Settings",
};

function getContext(pathname: string) {
  if (pathname === "/admin") {
    return { section: "Overview", title: "Dashboard" };
  }

  const parts = pathname.split("/").filter(Boolean);
  const segment = parts[1] ?? "";
  const baseTitle = labels[segment] ?? "Admin";
  const last = parts.at(-1);

  if (last === "new") {
    return { section: baseTitle, title: `New ${baseTitle === "Insights" ? "insight" : "work"}` };
  }

  if (last === "edit") {
    return { section: baseTitle, title: `Edit ${baseTitle === "Insights" ? "insight" : "work"}` };
  }

  return { section: "Portfolio Studio", title: baseTitle };
}

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const context = getContext(pathname);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="flex min-h-16 items-center gap-3 px-4 md:px-8 lg:px-10">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Open admin navigation"
          >
            <List className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(88vw,320px)] gap-0 p-0">
            <SheetHeader className="border-b border-border px-5 py-5">
              <SheetTitle>Portfolio Studio</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-3 py-5">
              <AdminNavigation onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">
            {context.section}
          </p>
          <p className="truncate text-sm font-medium text-foreground">
            {context.title}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            render={
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open public site"
              />
            }
            nativeButton={false}
            className="hidden sm:inline-flex"
          >
            <ArrowSquareOut className="size-[18px]" />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <SignOut className="size-[18px]" />
          </Button>
        </div>
      </div>
    </header>
  );
}
