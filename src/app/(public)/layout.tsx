import { getSiteCopy } from "@/lib/content/site-content-server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { PageTransition } from "@/components/layout/page-transition";
import ChatWidget from "@/components/chat-widget";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { getPublicSettings } from "@/lib/content/public-content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, enCopy, idCopy] = await Promise.all([
    getPublicSettings(),
    getSiteCopy("en"),
    getSiteCopy("id"),
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

  return (
    <>
      <SkipLink />
      <Navbar
        siteName={siteName}
        labelsByLocale={labelsByLocale}
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
        <ChatWidget />
      </div>
    </>
  );
}
