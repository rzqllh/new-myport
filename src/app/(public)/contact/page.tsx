import type { Metadata } from "next";
import { getSiteCopy } from "@/lib/content/site-content-server";
import { getPublicSettings } from "@/lib/content/public-content";
import { ContactForm } from "@/components/contact-form";
import { CopyEmailButton } from "@/components/copy-email-button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Hafizh Rizqullah Prasetya about relevant IT project, product, or technical work.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [copy, settings] = await Promise.all([
    getSiteCopy("en"),
    getPublicSettings(),
  ]);

  const email = settings.social.email?.replace(/^mailto:/, "") || "";
  const location = settings.profile.location;
  const availability = settings.profile.availability;

  return (
    <div className="editorial-container py-16 md:py-24">
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
                <dt className="text-xs text-muted-foreground">Email</dt>
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
                <dt className="text-xs text-muted-foreground">Location</dt>
                <dd className="mt-1">{location}</dd>
              </div>
            ) : null}
            {availability ? (
              <div>
                <dt className="text-xs text-muted-foreground">Availability</dt>
                <dd className="mt-1">{availability}</dd>
              </div>
            ) : null}
          </dl>
        </header>

        <section aria-labelledby="message-heading">
          <div className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <h2 id="message-heading" className="font-display text-2xl font-semibold">
              Send a message
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Include enough context to understand the subject, scope, or question.
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
