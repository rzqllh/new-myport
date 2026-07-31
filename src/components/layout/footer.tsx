import Link from "next/link";
import { GithubLogo, LinkedinLogo, TwitterLogo, Envelope } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import { NAV_ITEMS, SITE_NAME, SITE_TAGLINE, SOCIAL_LINKS } from "@/lib/constants";

const SOCIAL_ICONS = [
  { href: SOCIAL_LINKS.github, label: "GitHub", Icon: GithubLogo },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: LinkedinLogo },
  { href: SOCIAL_LINKS.twitter, label: "Twitter / X", Icon: TwitterLogo },
  { href: SOCIAL_LINKS.email, label: "Email", Icon: Envelope },
].filter((s) => s.href && s.href !== "mailto:");

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href="/"
              className="font-display font-bold text-lg tracking-tight text-foreground hover:text-primary transition-colors"
            >
              {SITE_NAME}
            </Link>
            <p className="text-sm text-muted-foreground">{SITE_TAGLINE}</p>
            {/* Social links */}
            {SOCIAL_ICONS.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                {SOCIAL_ICONS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Icon weight="duotone" className="size-[18px]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Navigation
            </p>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2" role="list">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact snippet */}
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
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {year} {SITE_NAME}. Built with Next.js, Supabase, and ☕.
          </p>
          <Link
            href="/admin"
            className="hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
