/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { getSiteCopy } from "@/lib/content/site-content-server";
import {
  getPublicAbout,
  getPublicCapabilities,
  getPublicExperiences,
  getPublicSettings,
} from "@/lib/content/public-content";
import {
  PUBLIC_UI,
  alternateLanguages,
  localeFromValue,
  publicPath,
} from "@/lib/content/public-routes";
import type { Locale } from "@/types/content";
import { responsiveImageProps } from "@/lib/content/public-image";
import { Button } from "@/components/ui/button";

interface Props {
  searchParams: Promise<{ locale?: string }>;
}

function formatExperienceDate(value: string, locale: Locale) {
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
  const canonical = publicPath(locale, "/about");

  return {
    title: copy["about.intro"].title,
    description: copy["about.intro"].intro,
    alternates: {
      canonical,
      languages: alternateLanguages("/about"),
    },
    openGraph: {
      locale: locale === "id" ? "id_ID" : "en_US",
      url: canonical,
      title: copy["about.intro"].title,
      description: copy["about.intro"].intro,
    },
  };
}

export default async function AboutPage({ searchParams }: Props) {
  const { locale: rawLocale } = await searchParams;
  const locale = localeFromValue(rawLocale);
  const ui = PUBLIC_UI[locale];

  const [copy, about, experiences, capabilities, settings] =
    await Promise.all([
      getSiteCopy(locale),
      getPublicAbout(locale),
      getPublicExperiences(locale),
      getPublicCapabilities(locale),
      getPublicSettings(),
    ]);

  const current =
    experiences.find((experience) => experience.isCurrent) ??
    experiences[0] ??
    null;
  const cvUrl = settings.cv.url;
  const linkedin = settings.social.linkedin;
  const profileImage = about.photoUrl
    ? responsiveImageProps(about.photoUrl, [320, 480, 640, 800])
    : null;

  return (
    <div className="editorial-container py-16 md:py-24">
      <header className="grid gap-10 border-b border-border pb-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div className="max-w-4xl">
          <h1 className="font-display text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">
            {copy["about.intro"].title}
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-muted-foreground">
            {copy["about.intro"].intro}
          </p>

          {current ? (
            <div className="mt-8 border-l border-border pl-5 text-sm">
              <p className="text-xs text-muted-foreground">{ui.currentRole}</p>
              <p className="mt-1 font-medium">{current.role}</p>
              <p className="mt-1 text-muted-foreground">{current.company}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<Link href={publicPath(locale, "/resume")} />}
              nativeButton={false}
            >
              <DownloadSimple className="size-4" />
              {copy.navigation.resume}
            </Button>

            <Button
              variant="outline"
              render={<Link href={publicPath(locale, "/contact")} />}
              nativeButton={false}
            >
              {copy.navigation.contact}
            </Button>

            {linkedin ? (
              <Button
                variant="ghost"
                render={
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
              >
                LinkedIn
                <ArrowUpRight className="size-4" />
              </Button>
            ) : null}

            {cvUrl ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="self-center text-sm text-muted-foreground hover:text-foreground"
              >
                {ui.downloadFile}
              </a>
            ) : null}
          </div>
        </div>

        {about.photoUrl && profileImage ? (
          <figure className="self-start">
            <img
              src={profileImage.src}
              srcSet={profileImage.srcSet}
              sizes="(min-width: 1024px) 320px, 80vw"
              alt="Hafizh Rizqullah Prasetya"
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] w-full border border-border object-cover"
            />
          </figure>
        ) : null}
      </header>

      <div className="grid gap-14 py-14 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <section>
          <h2 className="font-display text-3xl font-semibold">
            {ui.professionalThroughLine}
          </h2>
          <div className="mt-5 space-y-5 text-base leading-8 text-muted-foreground">
            {about.bio ? <p className="whitespace-pre-line">{about.bio}</p> : null}
            {about.philosophy ? (
              <p className="whitespace-pre-line">{about.philosophy}</p>
            ) : null}
            {!about.bio && !about.philosophy ? (
              <p>
                {locale === "id"
                  ? "Narasi profil Bahasa Indonesia belum dipublikasikan."
                  : "Detailed profile copy has not been published in the CMS yet."}
              </p>
            ) : null}
          </div>
        </section>

        <section aria-labelledby="experience-heading">
          <h2
            id="experience-heading"
            className="font-display text-3xl font-semibold"
          >
            {ui.experience}
          </h2>

          {experiences.length ? (
            <ol className="mt-6 divide-y divide-border border-y border-border">
              {experiences.map((experience) => (
                <li key={experience.id} className="py-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold">
                        {experience.role}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {experience.company}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatExperienceDate(experience.startDate, locale)} —{" "}
                      {experience.isCurrent
                        ? ui.present
                        : experience.endDate
                          ? formatExperienceDate(experience.endDate, locale)
                          : ""}
                    </p>
                  </div>
                  {experience.description ? (
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                      {experience.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              {ui.experiencePending}
            </p>
          )}
        </section>
      </div>

      <section className="border-t border-border py-14">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div>
            <h2 className="font-display text-3xl font-semibold">
              {ui.capabilities}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {ui.capabilityNote}
            </p>
          </div>

          {capabilities.length ? (
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div key={capability.id} className="border-t border-border pt-4">
                  <h3 className="text-sm font-medium">{capability.name}</h3>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {capability.category.replace("-", " ")} · {capability.level}
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
            <p className="text-sm text-muted-foreground">
              {ui.capabilitiesPending}
            </p>
          )}
        </div>
      </section>

      {about.hobbies ? (
        <section className="border-t border-border py-14">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold">
              {ui.outsideWork}
            </h2>
            <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">
              {about.hobbies}
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
