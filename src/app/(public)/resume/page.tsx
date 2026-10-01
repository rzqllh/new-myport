import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { getSiteCopy } from "@/lib/content/site-content-server";
import {
  getPublicAbout,
  getPublicCapabilities,
  getPublicExperiences,
  getPublicSettings,
  getPublicWork,
} from "@/lib/content/public-content";
import {
  PUBLIC_UI,
  alternateLanguages,
  localeFromValue,
  publicPath,
} from "@/lib/content/public-routes";
import type { Locale } from "@/types/content";
import { ResumePrintButton } from "@/components/resume-print-button";

interface Props {
  searchParams: Promise<{ locale?: string }>;
}

function formatMonthYear(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { locale: rawLocale } = await searchParams;
  const locale = localeFromValue(rawLocale);
  const copy = await getSiteCopy(locale);
  const canonical = publicPath(locale, "/resume");

  return {
    title: copy.navigation.resume,
    description: copy["home.hero"].positioning,
    alternates: {
      canonical,
      languages: alternateLanguages("/resume"),
    },
    openGraph: {
      locale: locale === "id" ? "id_ID" : "en_US",
      url: canonical,
      title: copy.navigation.resume,
      description: copy["home.hero"].positioning,
    },
  };
}

export default async function ResumePage({ searchParams }: Props) {
  const { locale: rawLocale } = await searchParams;
  const locale = localeFromValue(rawLocale);
  const ui = PUBLIC_UI[locale];

  const [copy, about, experiences, capabilities, settings, work] =
    await Promise.all([
      getSiteCopy(locale),
      getPublicAbout(locale),
      getPublicExperiences(locale),
      getPublicCapabilities(locale),
      getPublicSettings(),
      getPublicWork(locale),
    ]);

  const siteName = settings.general.site_title || SITE_NAME;
  const subtitle = copy["home.hero"].positioning;
  const email = settings.social.email?.replace(/^mailto:/, "") || "";
  const cvUrl = settings.cv.url;
  const selectedWork = work.slice(0, 4);

  return (
    <article className="print-resume editorial-container py-12 md:py-20">
      <header className="border-b border-border pb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-[-0.04em]">
              {siteName}
            </h1>
            <p className="mt-2 max-w-3xl text-base leading-7 text-muted-foreground">
              {subtitle}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {email ? <a href={`mailto:${email}`}>{email}</a> : null}
              {settings.profile.location ? (
                <span>{settings.profile.location}</span>
              ) : null}
              {settings.social.linkedin ? (
                <a
                  href={settings.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              ) : null}
              {settings.social.github ? (
                <a
                  href={settings.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              ) : null}
            </div>
          </div>

          <div data-print-hidden className="flex flex-wrap gap-2">
            <ResumePrintButton label={ui.printSavePdf} />
            {cvUrl ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
              >
                {ui.downloadFile}
              </a>
            ) : null}
          </div>
        </div>

        {about.bio ? (
          <p className="mt-7 max-w-3xl text-sm leading-7 text-muted-foreground">
            {about.bio}
          </p>
        ) : null}
      </header>

      <div className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(240px,.55fr)]">
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-semibold">
              {ui.resumeExperience}
            </h2>
            {experiences.length ? (
              <div className="mt-5 divide-y divide-border border-y border-border">
                {experiences.map((experience) => (
                  <article key={experience.id} className="py-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <h3 className="font-medium">{experience.role}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {experience.company}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatMonthYear(experience.startDate, locale)} —{" "}
                        {experience.isCurrent
                          ? ui.present
                          : experience.endDate
                            ? formatMonthYear(experience.endDate, locale)
                            : ""}
                      </p>
                    </div>
                    {experience.description ? (
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                        {experience.description}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                {ui.experiencePending}
              </p>
            )}
          </section>

          {selectedWork.length ? (
            <section>
              <h2 className="font-display text-2xl font-semibold">
                {ui.selectedWork}
              </h2>
              <div className="mt-5 divide-y divide-border border-y border-border">
                {selectedWork.map((item) => (
                  <article key={item.id} className="py-5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="font-medium">
                        <Link href={publicPath(locale, `/work/${item.slug}`)}>
                          {item.title}
                        </Link>
                      </h3>
                      <span className="text-xs capitalize text-muted-foreground">
                        {item.discipline.replace("-", " ")}
                      </span>
                    </div>
                    {item.summary ? (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.summary}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-10">
          <section>
            <h2 className="font-display text-xl font-semibold">
              {ui.capabilities}
            </h2>
            {capabilities.length ? (
              <ul className="mt-4 space-y-3">
                {capabilities.map((capability) => (
                  <li key={capability.id}>
                    <p className="text-sm font-medium">{capability.name}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {capability.category.replace("-", " ")} ·{" "}
                      {capability.level}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                {ui.capabilitiesPending}
              </p>
            )}
          </section>

          {about.philosophy ? (
            <section>
              <h2 className="font-display text-xl font-semibold">
                {ui.workingApproach}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {about.philosophy}
              </p>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
