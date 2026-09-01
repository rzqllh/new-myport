import type { Metadata } from "next";
import { Space_Grotesk, Archivo, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ChatWidget from "@/components/chat-widget";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

import { createClient } from "@/lib/supabase/server";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");

  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));

  const title = settings.general?.site_title || SITE_NAME;
  const tagline = SITE_TAGLINE;
  const desc = settings.seo?.meta_description || SITE_DESCRIPTION;
  const ogImage = settings.seo?.og_image || "";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app";

  return {
    title: {
      default: `${title} — ${tagline}`,
      template: `%s | ${title}`,
    },
    description: desc,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: "/apple-icon",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: `${title} — ${tagline}`,
      description: desc,
      siteName: title,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${tagline}`,
      description: desc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  const settings = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));

  const siteName = settings.general?.site_title || "Hafizh Rizqullah Prasetya";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app/";
  const github = settings.social?.github;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-[100dvh] bg-background text-foreground font-sans flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                name: siteName,
                url: baseUrl,
                jobTitle: "Project Management Officer (IT & Strategy)",
                worksFor: {
                  "@type": "Organization",
                  name: "Telkom Indonesia",
                },
                alumniOf: {
                  "@type": "CollegeOrUniversity",
                  name: "Gunadarma University",
                },
                knowsAbout: [
                  "Project Management",
                  "UI/UX Design",
                  "Web Engineering",
                  "Next.js",
                  "TypeScript",
                  "Python",
                  "SQL",
                ],
                sameAs: github ? [github] : [],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteName,
                url: baseUrl,
                description: "Personal portfolio of Hafizh Rizqullah Prasetya — Project Management, Product Design, and Web Engineering.",
              },
            ]),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
