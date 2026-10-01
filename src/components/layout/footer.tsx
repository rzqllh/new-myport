import Link from "next/link";

interface FooterProps {
  siteName: string;
  tagline?: string;
  labels: {
    work: string;
    about: string;
    insights: string;
    contact: string;
    resume: string;
  };
  copy: {
    heading?: string;
    body?: string;
    contact_cta?: string;
    resume_cta?: string;
  };
  social: Record<string, string>;
  cvUrl?: string;
}

const routes = [
  { key: "work", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "insights", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

export function Footer({
  siteName,
  tagline,
  labels,
  copy,
  social,
  cvUrl,
}: FooterProps) {
  const year = new Date().getFullYear();
  const profiles = [
    ["GitHub", social.github],
    ["LinkedIn", social.linkedin],
    ["Instagram", social.instagram],
  ].filter((item): item is [string, string] => Boolean(item[1]));

  return (
    <footer className="border-t border-border">
      <div className="editorial-container py-14 md:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr_.8fr]">
          <div className="max-w-xl">
            <p className="font-display text-2xl font-semibold tracking-tight">
              {copy.heading}
            </p>
            {copy.body ? (
              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                {copy.body}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href="/contact" className="font-medium text-primary hover:underline">
                {copy.contact_cta || labels.contact}
              </Link>
              {cvUrl ? (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copy.resume_cta || labels.resume}
                </a>
              ) : null}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Navigation
            </p>
            <ul className="space-y-2">
              {routes.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {labels[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Profiles
            </p>
            <div className="space-y-2">
              {profiles.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  {label}
                </a>
              ))}
              {social.email ? (
                <a
                  href={social.email.startsWith("mailto:") ? social.email : `mailto:${social.email}`}
                  className="block text-sm text-muted-foreground hover:text-foreground"
                >
                  Email
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{siteName}</span>
          <span>{tagline || `© ${year}`}</span>
          <span>© {year}</span>
        </div>
      </div>
    </footer>
  );
}
