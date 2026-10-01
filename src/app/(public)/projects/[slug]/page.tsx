/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import {
  getContentRedirect,
  getPublicWork,
  getPublicWorkDetail,
  type PublicEvidence,
  type PublicMedia,
} from "@/lib/content/public-content";
import {
  PUBLIC_UI,
  alternateLanguages,
  localeFromValue,
  publicPath,
} from "@/lib/content/public-routes";
import type { Locale } from "@/types/content";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

function formatPeriod(
  start: string | null,
  end: string | null,
  locale: Locale
) {
  if (!start) return null;

  const formatter = new Intl.DateTimeFormat(
    locale === "id" ? "id-ID" : "en-US",
    { month: "short", year: "numeric" }
  );

  return `${formatter.format(new Date(start))} — ${
    end ? formatter.format(new Date(end)) : PUBLIC_UI[locale].present
  }`;
}

function MediaFigure({ media }: { media: PublicMedia }) {
  return (
    <figure className="my-10 lg:-mx-20">
      <img
        src={media.url}
        alt={media.alt}
        className="h-auto w-full border border-border object-contain"
      />
      {media.caption ? (
        <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function EvidenceFigure({
  evidence,
  locale,
}: {
  evidence: PublicEvidence;
  locale: Locale;
}) {
  const ui = PUBLIC_UI[locale];

  return (
    <figure className="my-10 border-y border-border py-6 lg:-mx-20 lg:px-20">
      <div className="max-w-3xl">
        <p className="text-xs capitalize text-muted-foreground">
          {evidence.type.replace("-", " ")}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold">
          {evidence.title}
        </h3>
        {evidence.description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {evidence.description}
          </p>
        ) : null}
      </div>

      {evidence.media ? (
        <img
          src={evidence.media.url}
          alt={evidence.media.alt}
          className="mt-5 h-auto w-full object-contain"
        />
      ) : null}

      {evidence.sourceUrl || evidence.sourceDate ? (
        <figcaption className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {evidence.sourceDate ? (
            <span>
              {ui.sourceDate}: {evidence.sourceDate}
            </span>
          ) : null}
          {evidence.sourceUrl ? (
            <a
              href={evidence.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {ui.source}
            </a>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

function TranslationUnavailable({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const ui = PUBLIC_UI[locale];

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
          href={`/work/${slug}`}
          className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
        >
          {ui.viewEnglishVersion}
        </Link>
      </div>
    </div>
  );
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
    getPublicWorkDetail(slug, locale),
    getPublicWorkDetail(slug, "en"),
    getPublicWorkDetail(slug, "id"),
  ]);

  if (!requested) {
    if (locale === "id" && english) {
      return {
        title: PUBLIC_UI.id.translationUnavailable,
        description: PUBLIC_UI.id.translationUnavailableBody,
        robots: { index: false, follow: true },
        alternates: {
          canonical: `/work/${slug}`,
          languages: alternateLanguages(`/work/${slug}`, {
            en: true,
            id: false,
          }),
        },
      };
    }
    return { title: PUBLIC_UI[locale].allWork };
  }

  const canonical = publicPath(locale, `/work/${requested.slug}`);
  const title = requested.seoTitle || requested.title;
  const description =
    requested.seoDescription || requested.summary || undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternateLanguages(`/work/${requested.slug}`, {
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
      ...(requested.cover
        ? { images: [{ url: requested.cover.url }] }
        : {}),
    },
  };
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: Props) {
  const [{ slug }, { locale: rawLocale }] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = localeFromValue(rawLocale);
  const ui = PUBLIC_UI[locale];

  const [work, collection] = await Promise.all([
    getPublicWorkDetail(slug, locale),
    getPublicWork(locale),
  ]);

  if (!work) {
    const redirectTarget = await getContentRedirect("work", slug, locale);
    if (redirectTarget) {
      permanentRedirect(publicPath(locale, `/work/${redirectTarget}`));
    }

    if (locale === "id") {
      const english = await getPublicWorkDetail(slug, "en");
      if (english) {
        return <TranslationUnavailable slug={slug} locale={locale} />;
      }
    }

    notFound();
  }

  const currentIndex = collection.findIndex((item) => item.id === work.id);
  const nextWork =
    currentIndex >= 0 && collection.length > 1
      ? collection[(currentIndex + 1) % collection.length]
      : null;

  const period = formatPeriod(
    work.timeframeStart,
    work.timeframeEnd,
    locale
  );
  const primaryMedia =
    work.cover ??
    work.media.find((item) => item.role === "hero") ??
    work.media[0] ??
    null;
  const additionalMedia = work.media.filter(
    (item) => item.id !== primaryMedia?.id && item.role !== "cover"
  );

  const sections = [
    { id: "context", title: ui.context, body: work.context },
    { id: "issue", title: ui.issue, body: work.challenge },
    { id: "approach", title: ui.approach, body: work.approach },
    { id: "outcome", title: ui.outcome, body: work.outcome },
    { id: "lessons", title: ui.notesLessons, body: work.lessons },
  ].filter((section) => Boolean(section.body));

  const showSectionIndex = sections.length >= 4;

  return (
    <article className="pb-20 md:pb-28">
      <header className="editorial-container py-12 md:py-20">
        <Link
          href={publicPath(locale, "/work")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {ui.allWork}
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
          <div className="max-w-4xl">
            <h1 className="font-display text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {work.title}
            </h1>
            {work.summary ? (
              <p className="mt-6 max-w-3xl text-xl leading-8 text-muted-foreground">
                {work.summary}
              </p>
            ) : null}
          </div>

          <aside className="border-l border-border pl-5 text-sm">
            <dl className="space-y-5">
              {work.role ? (
                <div>
                  <dt className="text-xs text-muted-foreground">{ui.role}</dt>
                  <dd className="mt-1">{work.role}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs text-muted-foreground">{ui.work}</dt>
                <dd className="mt-1 capitalize">
                  {work.discipline.replace("-", " ")} ·{" "}
                  {work.workType.replace("-", " ")}
                </dd>
              </div>
              {period ? (
                <div>
                  <dt className="text-xs text-muted-foreground">{ui.timeframe}</dt>
                  <dd className="mt-1">{period}</dd>
                </div>
              ) : null}
              {work.technologies.length ? (
                <div>
                  <dt className="text-xs text-muted-foreground">
                    {ui.toolsTechnology}
                  </dt>
                  <dd className="mt-1 leading-6">
                    {work.technologies.join(", ")}
                  </dd>
                </div>
              ) : null}
            </dl>

            {work.liveUrl || work.repositoryUrl ? (
              <div className="mt-6 space-y-2 border-t border-border pt-5">
                {work.liveUrl ? (
                  <a
                    href={work.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    {ui.openLiveSite}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                ) : null}
                {work.repositoryUrl ? (
                  <a
                    href={work.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary hover:underline"
                  >
                    {ui.viewRepository}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </header>

      {primaryMedia ? (
        <div className="editorial-container pb-16">
          <figure>
            <img
              src={primaryMedia.url}
              alt={primaryMedia.alt}
              className="h-auto max-h-[760px] w-full border border-border object-contain"
            />
            {primaryMedia.caption ? (
              <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
                {primaryMedia.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}

      <div className="editorial-container">
        <div
          className={
            showSectionIndex
              ? "grid gap-12 lg:grid-cols-[170px_minmax(0,760px)] lg:justify-center"
              : "mx-auto max-w-[760px]"
          }
        >
          {showSectionIndex ? (
            <aside className="hidden lg:block">
              <nav
                aria-label={ui.navigation}
                className="sticky top-24 space-y-2 border-l border-border pl-4 text-xs text-muted-foreground"
              >
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block py-1 hover:text-foreground"
                  >
                    {section.title}
                  </a>
                ))}
                {work.evidence.length ? (
                  <a href="#evidence" className="block py-1 hover:text-foreground">
                    {ui.evidence}
                  </a>
                ) : null}
              </nav>
            </aside>
          ) : null}

          <div className="min-w-0">
            {!sections.length &&
            !work.evidence.length &&
            !additionalMedia.length ? (
              <p className="border-y border-border py-8 text-base leading-7 text-muted-foreground">
                {ui.workDetailPending}
              </p>
            ) : null}

            {sections.map((section, index) => (
              <div key={section.id}>
                <section
                  id={section.id}
                  className="scroll-mt-24 border-t border-border py-10 first:border-t-0 first:pt-0"
                >
                  <h2 className="font-display text-3xl font-semibold">
                    {section.title}
                  </h2>
                  <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">
                    {section.body}
                  </p>
                </section>

                {index === 0 && work.evidence.length ? (
                  <section id="evidence" className="scroll-mt-24">
                    {work.evidence.map((evidence) => (
                      <EvidenceFigure
                        key={evidence.id}
                        evidence={evidence}
                        locale={locale}
                      />
                    ))}
                  </section>
                ) : null}
              </div>
            ))}

            {!sections.length && work.evidence.length ? (
              <section id="evidence" className="scroll-mt-24">
                {work.evidence.map((evidence) => (
                  <EvidenceFigure
                    key={evidence.id}
                    evidence={evidence}
                    locale={locale}
                  />
                ))}
              </section>
            ) : null}

            {additionalMedia.length ? (
              <section className="border-t border-border pt-10">
                <h2 className="font-display text-2xl font-semibold">
                  {ui.additionalMaterial}
                </h2>
                {additionalMedia.map((media) => (
                  <MediaFigure key={media.id} media={media} />
                ))}
              </section>
            ) : null}
          </div>
        </div>
      </div>

      {nextWork ? (
        <section className="editorial-container mt-20 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">{ui.nextWork}</p>
          <Link
            href={publicPath(locale, `/work/${nextWork.slug}`)}
            className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
          >
            <div>
              <h2 className="font-display text-3xl font-semibold hover:text-primary">
                {nextWork.title}
              </h2>
              {nextWork.summary ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {nextWork.summary}
                </p>
              ) : null}
            </div>
            <span className="text-sm text-primary">{ui.readNext}</span>
          </Link>
        </section>
      ) : null}
    </article>
  );
}
