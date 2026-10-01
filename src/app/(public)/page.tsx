import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase } from "@phosphor-icons/react/dist/ssr";
import { getSiteCopy } from "@/lib/content/site-content-server";
import {
  getPublicAbout,
  getPublicCapabilities,
  getPublicExperiences,
  getPublicInsights,
  getPublicSettings,
  getPublicWork,
} from "@/lib/content/public-content";
import {
  PUBLIC_UI,
  alternateLanguages,
  localeFromValue,
  publicPath,
} from "@/lib/content/public-routes";
import { Button } from "@/components/ui/button";
import { EditorialReveal } from "@/components/motion/editorial-reveal";

interface Props {
  searchParams: Promise<{ locale?: string }>;
}

function formatMonthYear(value: string, locale: "en" | "id") {
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
  const canonical = publicPath(locale, "/");

  return {
    title: copy["home.hero"].name,
    description: copy["home.hero"].positioning,
    alternates: {
      canonical,
      languages: alternateLanguages("/"),
    },
    openGraph: {
      locale: locale === "id" ? "id_ID" : "en_US",
      url: canonical,
      title: copy["home.hero"].name,
      description: copy["home.hero"].positioning,
    },
  };
}

export default async function HomePage({ searchParams }: Props) {
  const { locale: rawLocale } = await searchParams;
  const locale = localeFromValue(rawLocale);
  const ui = PUBLIC_UI[locale];

  const [
    copy,
    work,
    insights,
    experiences,
    capabilities,
    settings,
    about,
  ] = await Promise.all([
    getSiteCopy(locale),
    getPublicWork(locale),
    getPublicInsights(locale),
    getPublicExperiences(locale),
    getPublicCapabilities(locale),
    getPublicSettings(),
    getPublicAbout(locale),
  ]);

  const selectedWork = work.slice(0, 4);
  const selectedInsights = insights.slice(0, 3);
  const currentExperience = experiences[0];
  const visibleCapabilities = capabilities.slice(0, 8);
  const availability = settings.profile.availability;
  const cvUrl = settings.cv.url;

  return (
    <div>
      <section className="editorial-container grid min-h-[72vh] items-center gap-12 py-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,.75fr)] lg:py-28">
        <EditorialReveal className="max-w-4xl">
          {availability ? (
            <p className="mb-5 text-sm text-muted-foreground">{availability}</p>
          ) : null}

          <h1 className="font-display text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {copy["home.hero"].name}
          </h1>

          <p className="mt-7 max-w-3xl text-xl leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
            {copy["home.hero"].positioning}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              render={<Link href={publicPath(locale, "/work")} />}
              nativeButton={false}
            >
              {copy["home.hero"].primary_cta}
            </Button>

            <Button
              variant="outline"
              size="lg"
              render={<Link href={publicPath(locale, "/resume")} />}
              nativeButton={false}
            >
              {copy["home.hero"].secondary_cta}
            </Button>

            {cvUrl ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {ui.downloadFile}
              </a>
            ) : null}
          </div>
        </EditorialReveal>

        <EditorialReveal delay={0.06}>
          <aside className="border-l border-border pl-6 lg:pl-8">
          {currentExperience ? (
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Briefcase className="size-4" />
                {ui.currentFocus}
              </div>
              <p className="mt-3 font-display text-xl font-semibold">
                {currentExperience.role}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentExperience.company}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {locale === "id" ? "Sejak" : "Since"}{" "}
                {formatMonthYear(currentExperience.startDate, locale)}
              </p>
            </div>
          ) : about.bio ? (
            <p className="text-sm leading-6 text-muted-foreground">{about.bio}</p>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              {locale === "id"
                ? "Detail profil sedang disiapkan."
                : "Portfolio content is being prepared."}
            </p>
          )}
          </aside>
        </EditorialReveal>
      </section>

      <section className="border-t border-border py-20 md:py-24">
        <EditorialReveal className="editorial-container">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                {copy["home.work"].title}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {copy["home.work"].intro}
              </p>
            </div>
            <Link
              href={publicPath(locale, "/work")}
              className="text-sm font-medium text-primary hover:underline"
            >
              {copy["home.work"].cta}
            </Link>
          </div>

          {selectedWork.length ? (
            <div className="mt-10 divide-y divide-border border-y border-border">
              {selectedWork.map((item, index) => (
                <article
                  key={item.id}
                  className="-mx-2 grid gap-5 px-2 py-7 transition-colors duration-150 hover:bg-card/45 md:grid-cols-[48px_minmax(0,1fr)_220px] md:items-start"
                >
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-display text-2xl font-semibold">
                        <Link
                          href={publicPath(locale, `/work/${item.slug}`)}
                          className="transition-colors duration-150 hover:text-primary"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {item.discipline.replace("-", " ")}
                      </span>
                    </div>
                    {item.summary ? (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                        {item.summary}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-sm text-muted-foreground md:text-right">
                    {item.role ? <p>{item.role}</p> : null}
                    <Link
                      href={publicPath(locale, `/work/${item.slug}`)}
                      className="mt-2 inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      {ui.readCaseStudy}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 border-y border-dashed border-border py-8 text-sm text-muted-foreground">
              {ui.noWork}
            </p>
          )}
        </EditorialReveal>
      </section>

      <section className="border-t border-border bg-card/35 py-20 md:py-24">
        <EditorialReveal className="editorial-container grid gap-10 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {copy["home.capabilities"].title}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {copy["home.capabilities"].intro}
            </p>
            <Link
              href={publicPath(locale, "/about")}
              className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
            >
              {ui.aboutBackground}
            </Link>
          </div>

          {visibleCapabilities.length ? (
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {visibleCapabilities.map((capability) => (
                <div key={capability.id} className="border-t border-border pt-4">
                  <p className="text-sm font-medium">{capability.name}</p>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {capability.category.replace("-", " ")}
                  </p>
                  {capability.description ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {capability.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{ui.capabilitiesPending}</p>
          )}
        </EditorialReveal>
      </section>

      <section className="border-t border-border py-20 md:py-24">
        <EditorialReveal className="editorial-container">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                {copy["home.insights"].title}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {copy["home.insights"].intro}
              </p>
            </div>
            <Link
              href={publicPath(locale, "/insights")}
              className="text-sm font-medium text-primary hover:underline"
            >
              {copy["home.insights"].cta}
            </Link>
          </div>

          {selectedInsights.length ? (
            <div className="mt-10 divide-y divide-border border-y border-border">
              {selectedInsights.map((insight) => (
                <article
                  key={insight.id}
                  className="-mx-2 grid gap-3 px-2 py-6 transition-colors duration-150 hover:bg-card/45 md:grid-cols-[150px_minmax(0,1fr)] md:gap-8"
                >
                  <p className="text-xs text-muted-foreground">
                    {insight.publishedAt
                      ? new Intl.DateTimeFormat(
                          locale === "id" ? "id-ID" : "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        ).format(new Date(insight.publishedAt))
                      : ui.published}
                  </p>
                  <div>
                    <h3 className="font-display text-xl font-semibold">
                      <Link
                        href={publicPath(locale, `/insights/${insight.slug}`)}
                        className="transition-colors duration-150 hover:text-primary"
                      >
                        {insight.title}
                      </Link>
                    </h3>
                    {insight.excerpt ? (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                        {insight.excerpt}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 border-y border-dashed border-border py-8 text-sm text-muted-foreground">
              {ui.noInsights}
            </p>
          )}
        </EditorialReveal>
      </section>

      <section className="border-t border-border py-16">
        <EditorialReveal className="editorial-container flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">
              {copy.footer.heading}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {copy.footer.body}
            </p>
          </div>
          <Button
            variant="outline"
            render={<Link href={publicPath(locale, "/contact")} />}
            nativeButton={false}
          >
            {copy.footer.contact_cta || ui.contact}
          </Button>
        </EditorialReveal>
      </section>
    </div>
  );
}
