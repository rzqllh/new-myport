import Link from "next/link";
import { GithubLogo, LinkedinLogo, TwitterLogo, Envelope, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import { NAV_ITEMS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { FooterContact } from "./footer-contact";

export async function Footer() {
  const year = new Date().getFullYear();
  const supabase = await createClient();
  
  const { data: settings } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["social", "general"]);

  const social = (settings?.find(s => s.key === "social")?.value as Record<string, string>) || {};
  const general = (settings?.find(s => s.key === "general")?.value as Record<string, string>) || {};
  
  const siteName = general.site_title || SITE_NAME;
  const siteTagline = general.tagline || SITE_TAGLINE;

  const SOCIAL_ICONS = [
    { href: social.github, label: "GitHub", Icon: GithubLogo },
    { href: social.linkedin, label: "LinkedIn", Icon: LinkedinLogo },
    { href: social.twitter, label: "Twitter / X", Icon: TwitterLogo },
    { href: social.instagram, label: "Instagram", Icon: InstagramLogo },
    { href: social.email, label: "Email", Icon: Envelope },
  ].filter((s) => s.href && s.href !== "mailto:");

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-[1400px] px-6 pt-12 md:pt-16 pb-8 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href="/"
              className="font-display font-bold text-lg tracking-tight text-foreground hover:text-primary transition-colors"
            >
              {siteName}
            </Link>
            <p className="text-sm text-muted-foreground">{siteTagline}</p>
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
          <FooterContact />
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {year} {siteName}. Built with Next.js and Supabase.
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
