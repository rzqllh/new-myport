import type { Metadata } from "next";
import Link from "next/link";
import { getSiteCopy } from "@/lib/content/site-content-server";
import { getPublicInsights } from "@/lib/content/public-content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Project notes, technical exploration, research, and delivery practice by Hafizh Rizqullah Prasetya.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const [copy, insights] = await Promise.all([
    getSiteCopy("en"),
    getPublicInsights("en"),
  ]);

  return (
    <div className="editorial-container py-16 md:py-24">
      <header className="max-w-3xl">
        <h1 className="font-display text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">
          {copy["insights.index"].title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {copy["insights.index"].intro}
        </p>
      </header>

      {insights.length ? (
        <div className="mt-14 max-w-4xl divide-y divide-border border-y border-border">
          {insights.map((insight) => (
            <article
              key={insight.id}
              className="grid gap-3 py-8 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8"
            >
              <div className="text-xs leading-5 text-muted-foreground">
                <p>
                  {insight.publishedAt
                    ? new Intl.DateTimeFormat("en", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(insight.publishedAt))
                    : "Published"}
                </p>
                {insight.tags.length ? (
                  <p className="mt-2">{insight.tags.join(" · ")}</p>
                ) : null}
              </div>

              <div>
                <h2 className="font-display text-2xl font-semibold">
                  <Link
                    href={`/blog/${insight.slug}`}
                    className="hover:text-primary"
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
                  href={`/blog/${insight.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Read insight
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-14 border-y border-dashed border-border py-12">
          <p className="text-sm text-muted-foreground">
            No published Insights are available yet.
          </p>
        </div>
      )}
    </div>
  );
}
