import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import {
  getPublicInsightDetail,
  getPublicWork,
} from "@/lib/content/public-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const insight = await getPublicInsightDetail(slug, "en");

  if (!insight) return { title: "Insights" };

  const title = insight.seoTitle || insight.title;
  const description = insight.seoDescription || insight.excerpt || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${insight.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${insight.slug}`,
      publishedTime: insight.publishedAt ?? undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [insight, work] = await Promise.all([
    getPublicInsightDetail(slug, "en"),
    getPublicWork("en"),
  ]);

  if (!insight) notFound();

  const relatedWork = insight.relatedWorkId
    ? work.find((item) => item.id === insight.relatedWorkId) ?? null
    : null;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt || undefined,
    datePublished: insight.publishedAt || undefined,
    dateModified: insight.updatedAt || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${insight.slug}`,
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
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Insights
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
                {new Intl.DateTimeFormat("en", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(insight.publishedAt))}
              </time>
            ) : null}
            {insight.tags.length ? <span>{insight.tags.join(" · ")}</span> : null}
            {relatedWork ? (
              <Link
                href={`/projects/${relatedWork.slug}`}
                className="text-primary hover:underline"
              >
                Related work: {relatedWork.title}
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
              The full article body has not been published yet.
            </p>
          )}

          {relatedWork ? (
            <aside className="mt-16 border-t border-border pt-7">
              <p className="text-xs text-muted-foreground">Related work</p>
              <Link href={`/projects/${relatedWork.slug}`} className="mt-2 block">
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
