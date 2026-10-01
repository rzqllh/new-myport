import { createClient } from "@/lib/supabase/server";
import { getSiteCopy } from "@/lib/content/site-content-server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";
import ChatWidget from "@/components/chat-widget";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [{ data: settings }, copy] = await Promise.all([
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["general", "social", "cv", "profile"]),
    getSiteCopy("en"),
  ]);

  const map = Object.fromEntries(
    (settings ?? []).map((row) => [row.key, row.value])
  ) as Record<string, Record<string, string>>;

  const siteName = map.general?.site_title || SITE_NAME;
  const tagline = map.general?.tagline || SITE_TAGLINE;
  const social = map.social ?? {};
  const cvUrl = map.cv?.url;
  const profile = map.profile ?? {};
  const navigation = {
    work: copy.navigation.work ?? "Work",
    about: copy.navigation.about ?? "About",
    insights: copy.navigation.insights ?? "Insights",
    contact: copy.navigation.contact ?? "Contact",
    resume: copy.navigation.resume ?? "Resume",
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
      >
        Skip to main content
      </a>
      <Navbar
        siteName={siteName}
        labels={navigation}
        cvUrl={cvUrl}
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
        labels={navigation}
        copy={copy.footer}
        social={social}
        cvUrl={cvUrl}
      />
      <div data-print-hidden>\n        <ChatWidget />\n      </div>
    </>
  );
}
