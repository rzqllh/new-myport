import type { Metadata } from "next";
import { Space_Grotesk, Archivo, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import "./globals.css";
import { messages, type PortfolioLocale } from "@/i18n/messages";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app"),
  title: {
    default: "Hafizh Rizqullah Prasetya — Project Management Officer",
    template: "%s | Hafizh Rizqullah Prasetya",
  },
  description:
    "Case-file portfolio of Hafizh Rizqullah Prasetya, a Project Management Officer in IT who plans, reads, and builds the systems behind delivery.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hafizh Rizqullah Prasetya",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get("portfolio_locale")?.value;
  const locale: PortfolioLocale = storedLocale === "id" ? "id" : "en";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rzqllh-port.vercel.app";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Hafizh Rizqullah Prasetya",
              url: baseUrl,
              jobTitle: "Project Management Officer (IT & Strategy)",
              sameAs: ["https://github.com/rzqllh", "https://linkedin.com/in/rzqllh"],
            }),
          }}
        />
      </head>
      <body className="min-h-[100dvh] bg-background text-foreground font-sans flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider locale={locale} messages={messages[locale]}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
