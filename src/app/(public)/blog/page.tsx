import type { Metadata } from "next";
import Link from "next/link";
import { getSiteCopy } from "@/lib/content/site-content-server";
import { getPublicInsights } from "@/lib/content/public-content";
import {
  PUBLIC_UI,
  alternateLanguages,
  localeFromValue,
  publicPath,
} from "@/lib/content/public-routes";
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
  const canonical = publicPath(locale, "/insights");

  return {
    title: copy["insights.index"].title,
    description: copy["insights.index"].intro,
    alternates: {
      canonical,
      languages: alternateLanguages("/insights"),
    },
    openGraph: {
      locale: locale === "id" ? "id_ID" : "en_US",
      url: canonical,
      title: copy["insights.index"].title,
      description: copy["insights.index"].intro,
    },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const { locale: rawLocale } = await searchParams;
  const locale = localeFromValue(rawLocale);
  const ui = PUBLIC_UI[locale];
  const [copy, insights] = await Promise.all([
    getSiteCopy(locale),
    getPublicInsights(locale),
  ]);

  return (
    <div className="editorial-container py-16 md:py-24">
      <EditorialReveal>
        <header className="max-w-3xl">
        <h1 className="font-display text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">
          {copy["insights.index"].title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {copy["insights.index"].intro}
        </p>
        </header>
      </EditorialReveal>

      {insights.length ? (
        <EditorialReveal delay={0.04}>
          <div className="mt-14 max-w-4xl divide-y divide-border border-y border-border">
          {insights.map((insight) => (
            <article
              key={insight.id}
              className="-mx-2 grid gap-3 px-2 py-8 transition-colors duration-150 hover:bg-card/45 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8"
            >
              <div className="text-xs leading-5 text-muted-foreground">
                <p>
                  {insight.publishedAt
                    ? new Intl.DateTimeFormat(
                        locale === "id" ? "id-ID" : "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      ).format(new Date(insight.publishedAt))
                    : ui.published}
                </p>
                {insight.tags.length ? (
                  <p className="mt-2">{insight.tags.join(" · ")}</p>
                ) : null}
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold">
                  <Link
                    href={publicPath(locale, `/insights/${insight.slug}`)}
                    className="transition-colors duration-150 hover:text-primary"
                  >
                    {insight.title}
                  </Link>
                </h2>
                {insight.excerpt ? (
                  <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                    {insight.excerpt}
                  </p>
                ) : null}
                <Link
                  href={publicPath(locale, `/insights/${insight.slug}`)}
                  className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                  {locale === "id" ? "Baca insight" : "Read insight"}
                </Link>
              </div>
            </article>
          ))}
          </div>
        </EditorialReveal>
      ) : (
        <div className="mt-14 border-y border-dashed border-border py-12">
          <p className="text-sm text-muted-foreground">{ui.noInsights}</p>
        </div>
      )}
    </div>
  );
}
