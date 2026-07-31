"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  SquaresFour, 
  FolderOpen, 
  Article, 
  User, 
  Code, 
  Briefcase, 
  Quotes, 
  Envelope, 
  Gear 
} from "@phosphor-icons/react/dist/ssr";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: SquaresFour },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog", icon: Article },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/skills", label: "Skills", icon: Code },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quotes },
  { href: "/admin/messages", label: "Messages", icon: Envelope },
  { href: "/admin/settings", label: "Settings", icon: Gear },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r bg-background hidden md:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/admin" className="font-display font-bold tracking-tight text-foreground">
            CMS Admin
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="flex flex-col gap-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const isActive = item.href === "/admin" 
                ? pathname === "/admin" 
                : pathname.startsWith(item.href);
                
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon weight={isActive ? "fill" : "duotone"} className="size-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <Link 
            href="/" 
            className="flex items-center justify-center w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground border rounded-lg transition-colors"
            target="_blank"
          >
            View Live Site
          </Link>
        </div>
      </div>
    </aside>
  );
}
