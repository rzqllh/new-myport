import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getSiteCopy } from "@/lib/content/site-content-server";
import { getPublicWork } from "@/lib/content/public-content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected project delivery, product, engineering, and research work by Hafizh Rizqullah Prasetya.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const [copy, work] = await Promise.all([
    getSiteCopy("en"),
    getPublicWork("en"),
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
                      href={`/projects/${item.slug}`}
                      className="hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  {item.featured ? (
                    <span className="text-xs text-muted-foreground">
                      Selected
                    </span>
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
                    {item.discipline.replace("-", " ")} ·{" "}
                    {item.workType.replace("-", " ")}
                  </p>
                  {item.role ? <p className="mt-1">{item.role}</p> : null}
                </div>
                <Link
                  href={`/projects/${item.slug}`}
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  Read
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-14 border-y border-dashed border-border py-12">
          <p className="text-sm text-muted-foreground">
            No published Work is available yet.
          </p>
        </div>
      )}
    </div>
  );
}
