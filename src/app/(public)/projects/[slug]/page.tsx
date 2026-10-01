/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import {
  getPublicWork,
  getPublicWorkDetail,
  type PublicEvidence,
  type PublicMedia,
} from "@/lib/content/public-content";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatPeriod(start: string | null, end: string | null) {
  if (!start) return null;
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  });
  return `${formatter.format(new Date(start))} — ${
    end ? formatter.format(new Date(end)) : "Present"
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

function EvidenceFigure({ evidence }: { evidence: PublicEvidence }) {
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
          {evidence.sourceDate ? <span>Source date: {evidence.sourceDate}</span> : null}
          {evidence.sourceUrl ? (
            <a
              href={evidence.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Source
            </a>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = await getPublicWorkDetail(slug, "en");
  if (!work) return { title: "Work" };

  return {
    title: work.title,
    description: work.summary ?? undefined,
    alternates: { canonical: `/projects/${work.slug}` },
    openGraph: {
      type: "article",
      title: work.title,
      description: work.summary ?? undefined,
      url: `/projects/${work.slug}`,
      ...(work.cover ? { images: [{ url: work.cover.url }] } : {}),
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const [work, collection] = await Promise.all([
    getPublicWorkDetail(slug, "en"),
    getPublicWork("en"),
  ]);

  if (!work) notFound();

  const currentIndex = collection.findIndex((item) => item.id === work.id);
  const nextWork =
    currentIndex >= 0 && collection.length > 1
      ? collection[(currentIndex + 1) % collection.length]
      : null;

  const period = formatPeriod(work.timeframeStart, work.timeframeEnd);
  const primaryMedia =
    work.cover ??
    work.media.find((item) => item.role === "hero") ??
    work.media[0] ??
    null;
  const additionalMedia = work.media.filter(
    (item) => item.id !== primaryMedia?.id && item.role !== "cover"
  );

  const sections = [
    { id: "context", title: "Context", body: work.context },
    { id: "issue", title: "The issue", body: work.challenge },
    { id: "approach", title: "Approach", body: work.approach },
    { id: "outcome", title: "Outcome", body: work.outcome },
    { id: "lessons", title: "Notes and lessons", body: work.lessons },
  ].filter((section) => Boolean(section.body));

  const showSectionIndex = sections.length >= 4;

  return (
    <article className="pb-20 md:pb-28">
      <header className="editorial-container py-12 md:py-20">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Work
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
                  <dt className="text-xs text-muted-foreground">Role</dt>
                  <dd className="mt-1">{work.role}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs text-muted-foreground">Work</dt>
                <dd className="mt-1 capitalize">
                  {work.discipline.replace("-", " ")} · {work.workType.replace("-", " ")}
                </dd>
              </div>
              {period ? (
                <div>
                  <dt className="text-xs text-muted-foreground">Timeframe</dt>
                  <dd className="mt-1">{period}</dd>
                </div>
              ) : null}
              {work.technologies.length ? (
                <div>
                  <dt className="text-xs text-muted-foreground">Tools / technology</dt>
                  <dd className="mt-1 leading-6">{work.technologies.join(", ")}</dd>
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
                    Open live site
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
                    View repository
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
                aria-label="Case study sections"
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
                    Evidence
                  </a>
                ) : null}
              </nav>
            </aside>
          ) : null}

          <div className="min-w-0">
            {!sections.length && !work.evidence.length && !additionalMedia.length ? (
              <p className="border-y border-border py-8 text-base leading-7 text-muted-foreground">
                This Work item currently contains a summary and project metadata. Additional case-study material has not been published.
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
                      <EvidenceFigure key={evidence.id} evidence={evidence} />
                    ))}
                  </section>
                ) : null}
              </div>
            ))}

            {!sections.length && work.evidence.length ? (
              <section id="evidence" className="scroll-mt-24">
                {work.evidence.map((evidence) => (
                  <EvidenceFigure key={evidence.id} evidence={evidence} />
                ))}
              </section>
            ) : null}

            {additionalMedia.length ? (
              <section className="border-t border-border pt-10">
                <h2 className="font-display text-2xl font-semibold">
                  Additional material
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
          <p className="text-xs text-muted-foreground">Next work</p>
          <Link
            href={`/projects/${nextWork.slug}`}
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
            <span className="text-sm text-primary">Read next</span>
          </Link>
        </section>
      ) : null}
    </article>
  );
}
