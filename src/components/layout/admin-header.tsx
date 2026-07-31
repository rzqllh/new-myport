"use client";

import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { SignOut } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/client";

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  // Basic title formatting based on pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    const path = pathname.split("/").filter(Boolean);
    if (path.length >= 2) {
      const section = path[1].charAt(0).toUpperCase() + path[1].slice(1);
      if (path.length > 2) {
        if (path[path.length - 1] === "new") return `New ${section.slice(0, -1)}`;
        if (path[path.length - 1] === "edit") return `Edit ${section.slice(0, -1)}`;
      }
      return section;
    }
    return "Admin";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="font-display font-medium text-lg hidden md:block">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <SignOut weight="bold" className="mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
