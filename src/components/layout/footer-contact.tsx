"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FooterContact() {
  const pathname = usePathname();

  if (pathname === "/contact") {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Get in touch
      </p>
      <p className="text-sm text-muted-foreground">
        Open to startup roles, freelance projects, and cross-functional
        collaborations.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
      >
        Send a message →
      </Link>
    </div>
  );
}
