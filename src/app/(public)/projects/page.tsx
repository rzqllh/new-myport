import type { Metadata } from "next";
import Link from "next/link";
import { getSiteCopy } from "@/lib/content/site-content-server";
import { getPublicWork } from "@/lib/content/public-content";
import {
  PUBLIC_UI,
  alternateLanguages,
  localeFromValue,
  publicPath,
} from "@/lib/content/public-routes";

interface Props {
  searchParams: Promise<{ locale?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { locale: rawLocale } = await searchParams;
  const locale = localeFromValue(rawLocale);
  const copy = await getSiteCopy(locale);
  const canonical = publicPath(locale, "/work");

  return {
    title: copy["work.index"].title,
    description: copy["work.index"].intro,
    alternates: {
      canonical,
      languages: alternateLanguages("/work"),
    },
    openGraph: {
      locale: locale === "id" ? "id_ID" : "en_US",
      url: canonical,
      title: copy["work.index"].title,
      description: copy["work.index"].intro,
    },
  };
}

export default async function ProjectsPage({ searchParams }: Props) {
  const { locale: rawLocale } = await searchParams;
  const locale = localeFromValue(rawLocale);
  const ui = PUBLIC_UI[locale];
  const [copy, work] = await Promise.all([
    getSiteCopy(locale),
    getPublicWork(locale),
  ]);

  return (
    <div className="editorial-container py-16 md:py-24">
      <header className="max-w-3xl">
        <h1 className="font-display text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">
          {copy["work.index"].title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {copy["work.index"].intro}
        </p>
      </header>

      {work.length ? (
        <div className="mt-14 divide-y divide-border border-y border-border">
          {work.map((item) => (
            <article
              key={item.id}
              className="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_230px]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                    <Link
                      href={publicPath(locale, `/work/${item.slug}`)}
                      className="hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  {item.featured ? (
                    <span className="text-xs text-muted-foreground">{ui.selected}</span>
                  ) : null}
                </div>

                {item.summary ? (
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                    {item.summary}
                  </p>
                ) : null}

                {item.technologies.length ? (
                  <p className="mt-4 text-xs leading-5 text-muted-foreground">
                    {item.technologies.join(" · ")}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col items-start gap-3 text-sm text-muted-foreground lg:items-end lg:text-right">
                <div>
                  <p className="capitalize">
                    {item.discipline.replace("-", " ")} · {item.workType.replace("-", " ")}
                  </p>
                  {item.role ? <p className="mt-1">{item.role}</p> : null}
                </div>
                <Link
                  href={publicPath(locale, `/work/${item.slug}`)}
                  className="font-medium text-primary hover:underline"
                >
                  {ui.read}
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-14 border-y border-dashed border-border py-12">
          <p className="text-sm text-muted-foreground">{ui.noWork}</p>
        </div>
      )}
    </div>
  );
}
