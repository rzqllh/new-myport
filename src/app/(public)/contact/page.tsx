import type { Metadata } from "next";
import { getSiteCopy } from "@/lib/content/site-content-server";
import { getPublicSettings } from "@/lib/content/public-content";
import {
  PUBLIC_UI,
  alternateLanguages,
  localeFromValue,
  publicPath,
} from "@/lib/content/public-routes";
import { ContactForm } from "@/components/contact-form";
import { CopyEmailButton } from "@/components/copy-email-button";
import { EditorialReveal } from "@/components/motion/editorial-reveal";

interface Props {
  searchParams: Promise<{ locale?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { locale: rawLocale } = await searchParams;
  const locale = localeFromValue(rawLocale);
  const copy = await getSiteCopy(locale);
  const canonical = publicPath(locale, "/contact");

  return {
    title: copy["contact.intro"].title,
    description: copy["contact.intro"].intro,
    alternates: {
      canonical,
      languages: alternateLanguages("/contact"),
    },
    openGraph: {
      locale: locale === "id" ? "id_ID" : "en_US",
      url: canonical,
      title: copy["contact.intro"].title,
      description: copy["contact.intro"].intro,
    },
  };
}

export default async function ContactPage({ searchParams }: Props) {
  const { locale: rawLocale } = await searchParams;
  const locale = localeFromValue(rawLocale);
  const ui = PUBLIC_UI[locale];

  const [copy, settings] = await Promise.all([
    getSiteCopy(locale),
    getPublicSettings(),
  ]);

  const email = settings.social.email?.replace(/^mailto:/, "") || "";
  const location = settings.profile.location;
  const availability = settings.profile.availability;

  return (
    <div className="editorial-container py-16 md:py-24">
      <EditorialReveal>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)] lg:gap-20">
        <header className="max-w-xl">
          <h1 className="font-display text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">
            {copy["contact.intro"].title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {copy["contact.intro"].intro}
          </p>

          <dl className="mt-10 space-y-6 border-t border-border pt-6 text-sm">
            {email ? (
              <div>
                <dt className="text-xs text-muted-foreground">{ui.email}</dt>
                <dd className="mt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {email}
                  </a>
                  <CopyEmailButton email={email} variant="badge" />
                </dd>
              </div>
            ) : null}
            {location ? (
              <div>
                <dt className="text-xs text-muted-foreground">{ui.location}</dt>
                <dd className="mt-1">{location}</dd>
              </div>
            ) : null}
            {availability ? (
              <div>
                <dt className="text-xs text-muted-foreground">
                  {ui.availability}
                </dt>
                <dd className="mt-1">{availability}</dd>
              </div>
            ) : null}
          </dl>
        </header>

        <section aria-labelledby="message-heading">
          <div className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h2
              id="message-heading"
              className="font-display text-2xl font-semibold"
            >
              {ui.contactMessage}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {ui.contactMessageHelp}
            </p>
            <div className="mt-7">
              <ContactForm locale={locale} />
            </div>
          </div>
        </section>
        </div>
      </EditorialReveal>
    </div>
  );
}
