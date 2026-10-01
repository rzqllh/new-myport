import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import {
  getContentRedirect,
  getPublicInsightDetail,
  getPublicWork,
} from "@/lib/content/public-content";
import {
  PUBLIC_UI,
  alternateLanguages,
  localeFromValue,
  publicPath,
} from "@/lib/content/public-routes";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ slug }, { locale: rawLocale }] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = localeFromValue(rawLocale);

  const [requested, english, indonesian] = await Promise.all([
    getPublicInsightDetail(slug, locale),
    getPublicInsightDetail(slug, "en"),
    getPublicInsightDetail(slug, "id"),
  ]);

  if (!requested) {
    if (locale === "id" && english) {
      return {
        title: PUBLIC_UI.id.translationUnavailable,
        description: PUBLIC_UI.id.translationUnavailableBody,
        robots: { index: false, follow: true },
        alternates: {
          canonical: `/insights/${slug}`,
          languages: alternateLanguages(`/insights/${slug}`, {
            en: true,
            id: false,
          }),
        },
      };
    }
    return { title: PUBLIC_UI[locale].allInsights };
  }

  const title = requested.seoTitle || requested.title;
  const description =
    requested.seoDescription || requested.excerpt || undefined;
  const canonical = publicPath(locale, `/insights/${requested.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternateLanguages(`/insights/${requested.slug}`, {
        en: Boolean(english),
        id: Boolean(indonesian),
      }),
    },
    openGraph: {
      type: "article",
      locale: locale === "id" ? "id_ID" : "en_US",
      title,
      description,
      url: canonical,
      publishedTime: requested.publishedAt ?? undefined,
    },
  };
}

function TranslationUnavailable({ slug }: { slug: string }) {
  const ui = PUBLIC_UI.id;

  return (
    <div className="editorial-container py-20 md:py-28">
      <div className="max-w-2xl border-y border-border py-10">
        <p className="text-sm text-muted-foreground">{ui.translationUnavailable}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          {ui.translationUnavailable}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {ui.translationUnavailableBody}
        </p>
        <Link
          href={`/insights/${slug}`}
          className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
        >
          {ui.viewEnglishVersion}
        </Link>
      </div>
    </div>
  );
}

export default async function BlogPostPage({
  params,
  searchParams,
}: Props) {
  const [{ slug }, { locale: rawLocale }] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = localeFromValue(rawLocale);
  const ui = PUBLIC_UI[locale];

  const [insight, work] = await Promise.all([
    getPublicInsightDetail(slug, locale),
    getPublicWork(locale),
  ]);

  if (!insight) {
    const redirectTarget = await getContentRedirect("insight", slug, locale);
    if (redirectTarget) {
      permanentRedirect(publicPath(locale, `/insights/${redirectTarget}`));
    }

    if (locale === "id") {
      const english = await getPublicInsightDetail(slug, "en");
      if (english) return <TranslationUnavailable slug={slug} />;
    }

    notFound();
  }

  const relatedWork = insight.relatedWorkId
    ? work.find((item) => item.id === insight.relatedWorkId) ?? null
    : null;

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app"
  ).replace(/\/$/, "");
  const canonicalPath = publicPath(locale, `/insights/${insight.slug}`);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: locale,
    headline: insight.title,
    description: insight.excerpt || undefined,
    datePublished: insight.publishedAt || undefined,
    dateModified: insight.updatedAt || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}${canonicalPath}`,
    },
  };

  return (
    <article className="pb-20 md:pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header className="editorial-container py-12 md:py-20">
        <Link
          href={publicPath(locale, "/insights")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {ui.allInsights}
        </Link>

        <div className="mt-10 max-w-5xl">
          <h1 className="font-display text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {insight.title}
          </h1>

          {insight.excerpt ? (
            <p className="mt-6 max-w-3xl text-xl leading-8 text-muted-foreground">
              {insight.excerpt}
            </p>
          ) : null}

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {insight.publishedAt ? (
              <time dateTime={insight.publishedAt}>
                {new Intl.DateTimeFormat(
                  locale === "id" ? "id-ID" : "en-US",
                  { month: "long", day: "numeric", year: "numeric" }
                ).format(new Date(insight.publishedAt))}
              </time>
            ) : null}
            {insight.tags.length ? <span>{insight.tags.join(" · ")}</span> : null}
            {relatedWork ? (
              <Link
                href={publicPath(locale, `/work/${relatedWork.slug}`)}
                className="text-primary hover:underline"
              >
                {ui.relatedWork}: {relatedWork.title}
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <div className="editorial-container">
        <div className="mx-auto max-w-[760px]">
          {insight.bodyHtml ? (
            <div
              className="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-img:my-10 prose-img:w-[calc(100%+4rem)] prose-img:max-w-none prose-img:-ml-8 prose-pre:overflow-x-auto prose-table:block prose-table:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: insight.bodyHtml }}
            />
          ) : (
            <p className="border-y border-border py-8 text-base leading-7 text-muted-foreground">
              {ui.articleBodyPending}
            </p>
          )}

          {relatedWork ? (
            <aside className="mt-16 border-t border-border pt-7">
              <p className="text-xs text-muted-foreground">{ui.relatedWork}</p>
              <Link
                href={publicPath(locale, `/work/${relatedWork.slug}`)}
                className="mt-2 block"
              >
                <h2 className="font-display text-2xl font-semibold hover:text-primary">
                  {relatedWork.title}
                </h2>
                {relatedWork.summary ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {relatedWork.summary}
                  </p>
                ) : null}
              </Link>
            </aside>
          ) : null}
        </div>
      </div>
    </article>
  );
}
