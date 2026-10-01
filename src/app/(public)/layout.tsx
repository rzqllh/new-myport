import { getSiteCopy } from "@/lib/content/site-content-server";
import {
  getPublicInsights,
  getPublicSettings,
  getPublicWork,
} from "@/lib/content/public-content";
import { publicPath } from "@/lib/content/public-routes";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { PageTransition } from "@/components/layout/page-transition";
import { DeferredChatWidget } from "@/components/deferred-chat-widget";
import type { PublicSearchItem } from "@/components/public-search";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import type { Locale } from "@/types/content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    settings,
    enCopy,
    idCopy,
    enWork,
    idWork,
    enInsights,
    idInsights,
  ] = await Promise.all([
    getPublicSettings(),
    getSiteCopy("en"),
    getSiteCopy("id"),
    getPublicWork("en"),
    getPublicWork("id"),
    getPublicInsights("en"),
    getPublicInsights("id"),
  ]);

  const siteName = settings.general.site_title || SITE_NAME;
  const tagline = settings.general.tagline || SITE_TAGLINE;
  const social = settings.social;
  const profile = settings.profile;

  const labelsByLocale = {
    en: {
      work: enCopy.navigation.work ?? "Work",
      about: enCopy.navigation.about ?? "About",
      insights: enCopy.navigation.insights ?? "Insights",
      contact: enCopy.navigation.contact ?? "Contact",
      resume: enCopy.navigation.resume ?? "Resume",
    },
    id: {
      work: idCopy.navigation.work ?? "Karya",
      about: idCopy.navigation.about ?? "Tentang",
      insights: idCopy.navigation.insights ?? "Insight",
      contact: idCopy.navigation.contact ?? "Kontak",
      resume: idCopy.navigation.resume ?? "CV",
    },
  };

  function buildSearchItems(locale: Locale): PublicSearchItem[] {
    const copy = locale === "id" ? idCopy : enCopy;
    const labels = labelsByLocale[locale];
    const work = locale === "id" ? idWork : enWork;
    const insights = locale === "id" ? idInsights : enInsights;

    const pages: PublicSearchItem[] = [
      {
        id: "page-work",
        kind: "page",
        title: labels.work,
        description: copy["work.index"].intro,
        href: publicPath(locale, "/work"),
      },
      {
        id: "page-insights",
        kind: "page",
        title: labels.insights,
        description: copy["insights.index"].intro,
        href: publicPath(locale, "/insights"),
      },
      {
        id: "page-about",
        kind: "page",
        title: labels.about,
        description: copy["about.intro"].intro,
        href: publicPath(locale, "/about"),
      },
      {
        id: "page-contact",
        kind: "page",
        title: labels.contact,
        description: copy["contact.intro"].intro,
        href: publicPath(locale, "/contact"),
      },
      {
        id: "page-resume",
        kind: "page",
        title: labels.resume,
        description: copy["home.hero"].positioning,
        href: publicPath(locale, "/resume"),
      },
    ];

    return [
      ...pages,
      ...work.map(
        (item): PublicSearchItem => ({
          id: "work-" + item.id,
          kind: "work",
          title: item.title,
          description: item.summary || item.role || "",
          href: publicPath(locale, "/work/" + item.slug),
        })
      ),
      ...insights.map(
        (item): PublicSearchItem => ({
          id: "insight-" + item.id,
          kind: "insight",
          title: item.title,
          description: item.excerpt || "",
          href: publicPath(locale, "/insights/" + item.slug),
        })
      ),
    ];
  }

  const searchItemsByLocale: Record<Locale, PublicSearchItem[]> = {
    en: buildSearchItems("en"),
    id: buildSearchItems("id"),
  };

  return (
    <>
      <SkipLink />
      <Navbar
        siteName={siteName}
        labelsByLocale={labelsByLocale}
        searchItemsByLocale={searchItemsByLocale}
        availability={profile.availability}
        location={profile.location}
      />
      <PageTransition>
        <main
          id="main-content"
          tabIndex={-1}
          className="min-h-[60vh] flex-1 focus:outline-none"
        >
          {children}
        </main>
      </PageTransition>
      <Footer
        siteName={siteName}
        tagline={tagline}
        labelsByLocale={labelsByLocale}
        copyByLocale={{ en: enCopy.footer, id: idCopy.footer }}
        social={social}
      />
      <div data-print-hidden>
        <DeferredChatWidget />
      </div>
    </>
  );
}
