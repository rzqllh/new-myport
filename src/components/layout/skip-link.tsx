"use client";

import { usePathname } from "next/navigation";
import { PUBLIC_UI, localeFromPathname } from "@/lib/content/public-routes";

export function SkipLink() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
    >
      {PUBLIC_UI[locale].skipToContent}
    </a>
  );
}
