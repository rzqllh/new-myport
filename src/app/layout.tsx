import type { Metadata } from "next";
import { headers } from "next/headers";
import { Archivo, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { getPublicSettings } from "@/lib/content/public-content";

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  const title = settings.general.site_title || SITE_NAME;
  const tagline = settings.general.tagline || SITE_TAGLINE;
  const description = settings.seo.meta_description || SITE_DESCRIPTION;
  const ogImage = settings.seo.og_image || "";
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app";

  return {
    title: {
      default: `${title} — ${tagline}`,
      template: `%s | ${title}`,
    },
    description,
    metadataBase: new URL(baseUrl),
    alternates: { canonical: "/" },
    icons: {
      icon: [{ url: "/favicon.ico", sizes: "any" }],
      apple: "/apple-icon",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: `${title} — ${tagline}`,
      description,
      siteName: title,
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${tagline}`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const documentLocale =
    requestHeaders.get("x-portfolio-locale") === "id" ? "id" : "en";
  const settings = await getPublicSettings();

  const siteName = settings.general.site_title || SITE_NAME;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app/";
  const sameAs = [
    settings.social.github,
    settings.social.linkedin,
    settings.social.instagram,
  ].filter((value): value is string => Boolean(value));

  return (
    <html
      lang={documentLocale}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="flex min-h-[100dvh] flex-col bg-background font-sans text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                name: siteName,
                url: baseUrl,
                sameAs,
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteName,
                url: baseUrl,
                description:
                  "Professional portfolio of Hafizh Rizqullah Prasetya.",
              },
            ]),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
